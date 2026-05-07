import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createMockContext(userId: number = 1): TrpcContext {
  return {
    user: {
      id: userId,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "test",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Podcasts Router", () => {
  it("should list podcasts publicly", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {} } as any,
      res: { clearCookie: () => {} } as any,
    });
    const result = await caller.podcasts.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should create a podcast when authenticated", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.podcasts.create({
      title: "Test Podcast",
      description: "A test podcast",
      mediaUrl: "https://example.com/podcast.mp3",
      mediaType: "audio",
      thumbnailUrl: "https://example.com/thumb.jpg",
    });

    expect(result).toBeDefined();
  });

  it("should prevent unauthorized podcast creation", async () => {
    const publicCaller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {} } as any,
      res: { clearCookie: () => {} } as any,
    });

    try {
      await publicCaller.podcasts.create({
        title: "Unauthorized",
        mediaUrl: "https://example.com/podcast.mp3",
        mediaType: "audio",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });
});

describe("Album Posts Router", () => {
  it("should list album posts publicly", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {} } as any,
      res: { clearCookie: () => {} } as any,
    });
    const result = await caller.albumPosts.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should create an album post when authenticated", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const imageUrls = JSON.stringify([
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
    ]);

    const result = await caller.albumPosts.create({
      title: "Test Album Post",
      description: "A test album post",
      imageUrls,
    });

    expect(result).toBeDefined();
  });

  it("should prevent unauthorized album post creation", async () => {
    const publicCaller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {} } as any,
      res: { clearCookie: () => {} } as any,
    });

    try {
      await publicCaller.albumPosts.create({
        title: "Unauthorized",
        imageUrls: "[]",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });
});

describe("Team Members Router", () => {
  it("should list team members publicly", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {} } as any,
      res: { clearCookie: () => {} } as any,
    });
    const result = await caller.teamMembers.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should create a team member when authenticated", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.teamMembers.create({
      name: "Test Member",
      role: "Coordinator",
      description: "A test team member",
      photoUrl: "https://example.com/photo.jpg",
    });

    expect(result).toBeDefined();
  });

  it("should prevent unauthorized team member creation", async () => {
    const publicCaller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {} } as any,
      res: { clearCookie: () => {} } as any,
    });

    try {
      await publicCaller.teamMembers.create({
        name: "Unauthorized",
        role: "Test",
        photoUrl: "https://example.com/photo.jpg",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });
});
