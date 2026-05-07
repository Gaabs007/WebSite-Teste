import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Username for login */
  username: varchar("username", { length: 64 }).notNull().unique(),
  /** Password hash (bcrypt) */
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// For login response, exclude password hash
export type UserPublic = Omit<User, 'passwordHash'>;

/**
 * Session table - stores active user sessions
 */
export const sessions = mysqlTable("sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: int("userId").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;

/**
 * Podcasts table - stores podcast metadata and media URLs
 */
export const podcasts = mysqlTable("podcasts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  mediaUrl: text("mediaUrl").notNull(), // S3 URL for audio/video file
  mediaType: varchar("mediaType", { length: 50 }).notNull(), // 'audio' or 'video'
  thumbnailUrl: text("thumbnailUrl"), // S3 URL for thumbnail image
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Podcast = typeof podcasts.$inferSelect;
export type InsertPodcast = typeof podcasts.$inferInsert;

/**
 * Album Posts table - stores album postings with images and text
 */
export const albumPosts = mysqlTable("albumPosts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrls: json("imageUrls").$type<string[]>().notNull(), // JSON array of S3 URLs
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AlbumPost = typeof albumPosts.$inferSelect;
export type InsertAlbumPost = typeof albumPosts.$inferInsert;

/**
 * Team Members table - stores information about project team members
 */
export const teamMembers = mysqlTable("teamMembers", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(), // Position/function in the project
  description: text("description"),
  photoUrl: text("photoUrl").notNull(), // S3 URL for member photo
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;