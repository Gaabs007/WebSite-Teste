import { ForbiddenError } from "@shared/_core/errors";
import { parse as parseCookieHeader } from "cookie";
import type { Request } from "express";
import { SignJWT, jwtVerify } from "jose";
import type { User } from "../../drizzle/schema";
import * as db from "../db";
import { ENV } from "./env";
import { COOKIE_NAME } from "@shared/const";

export type SessionPayload = {
  sub: string; // user id
  name: string;
};

const AXIOS_TIMEOUT_MS = 30000;

class SDKServer {
  private readonly jwtSecret: Uint8Array;

  constructor() {
    const secret = ENV.cookieSecret;
    this.jwtSecret = new TextEncoder().encode(secret);
  }

  private parseCookies(cookieHeader?: string): Map<string, string> {
    const cookies = new Map<string, string>();
    if (!cookieHeader) return cookies;

    const parsed = parseCookieHeader(cookieHeader);
    for (const [key, value] of Object.entries(parsed)) {
      cookies.set(key, value);
    }
    return cookies;
  }

  async createSessionToken(
    userId: string,
    options: { name: string; expiresInMs: number }
  ): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = Math.floor(options.expiresInMs / 1000);

    const jwt = await new SignJWT({
      sub: userId,
      name: options.name,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt(now)
      .setExpirationTime(now + expiresIn)
      .sign(this.jwtSecret);

    return jwt;
  }

  async verifySession(token: string): Promise<SessionPayload | null> {
    try {
      const verified = await jwtVerify(token, this.jwtSecret);
      return verified.payload as SessionPayload;
    } catch (error) {
      return null;
    }
  }

  async authenticateRequest(req: Request): Promise<User> {
    // Regular authentication flow
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);

    if (!sessionCookie) {
      throw ForbiddenError("No session cookie");
    }

    const session = await this.verifySession(sessionCookie);

    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }

    const userId = session.sub;
    const user = await db.getUserById(parseInt(userId, 10));

    if (!user) {
      throw ForbiddenError("User not found");
    }

    await db.updateUserLastSignIn(user.id);

    return user;
  }
}

export const sdk = new SDKServer();
