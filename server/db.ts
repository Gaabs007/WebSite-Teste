import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, podcasts, InsertPodcast, albumPosts, InsertAlbumPost, teamMembers, InsertTeamMember, sessions, InsertSession } from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

/**
 * User authentication queries
 */
export async function getUserByUsername(username: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createUser(data: InsertUser) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(users).values(data);
  return result;
}

export async function updateUserLastSignIn(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, userId));
}

/**
 * Session queries
 */
export async function createSession(data: InsertSession) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(sessions).values(data);
}

export async function getSession(sessionId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function deleteSession(sessionId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function deleteExpiredSessions() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(sessions).where(eq(sessions.expiresAt, new Date()));
}

/**
 * Podcast queries
 */
export async function getPodcasts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(podcasts).orderBy((t) => t.createdAt);
}

export async function getPodcastById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(podcasts).where(eq(podcasts.id, id)).limit(1);
  return result[0];
}

export async function createPodcast(data: InsertPodcast) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(podcasts).values(data);
  return result[0];
}

export async function updatePodcast(id: number, data: Partial<InsertPodcast>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(podcasts).set(data).where(eq(podcasts.id, id));
  return getPodcastById(id);
}

export async function deletePodcast(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(podcasts).where(eq(podcasts.id, id));
}

/**
 * Album Post queries
 */
export async function getAlbumPosts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(albumPosts).orderBy((t) => t.createdAt);
}

export async function getAlbumPostById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(albumPosts).where(eq(albumPosts.id, id)).limit(1);
  return result[0];
}

export async function createAlbumPost(data: InsertAlbumPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(albumPosts).values(data);
  return result[0];
}

export async function updateAlbumPost(id: number, data: Partial<InsertAlbumPost>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(albumPosts).set(data).where(eq(albumPosts.id, id));
  return getAlbumPostById(id);
}

export async function deleteAlbumPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(albumPosts).where(eq(albumPosts.id, id));
}

/**
 * Team Member queries
 */
export async function getTeamMembers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(teamMembers).orderBy((t) => t.createdAt);
}

export async function getTeamMemberById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(teamMembers).where(eq(teamMembers.id, id)).limit(1);
  return result[0];
}

export async function createTeamMember(data: InsertTeamMember) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(teamMembers).values(data);
  return result[0];
}

export async function updateTeamMember(id: number, data: Partial<InsertTeamMember>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(teamMembers).set(data).where(eq(teamMembers.id, id));
  return getTeamMemberById(id);
}

export async function deleteTeamMember(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(teamMembers).where(eq(teamMembers.id, id));
}
