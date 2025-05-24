import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// TikTok Downloader Schemas

export const tiktokVideos = pgTable("tiktok_videos", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  videoId: text("video_id").notNull().unique(),
  title: text("title"),
  author: text("author"),
  thumbnailUrl: text("thumbnail_url"),
  noWatermarkUrl: text("no_watermark_url"),
  createdAt: text("created_at").notNull(),
});

export const insertTiktokVideoSchema = createInsertSchema(tiktokVideos).omit({
  id: true,
});

export type InsertTiktokVideo = z.infer<typeof insertTiktokVideoSchema>;
export type TiktokVideo = typeof tiktokVideos.$inferSelect;

// Validation schemas for requests
export const tiktokUrlSchema = z.object({
  url: z.string().url().refine(
    (val) => val.includes("tiktok.com"),
    { message: "Must be a valid TikTok URL" }
  ),
});

export const downloadOptionsSchema = z.object({
  videoId: z.string(),
  format: z.enum(["mp4", "mp3", "webm"]),
  quality: z.enum(["high", "medium", "low"]),
});

// Define the downloads history table to track recent downloads
export const downloadsHistory = pgTable("downloads_history", {
  id: serial("id").primaryKey(),
  videoId: text("video_id").notNull(),
  videoUrl: text("video_url").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  format: varchar("format", { length: 10 }).notNull(), // mp4, mp3, webm
  quality: varchar("quality", { length: 10 }).notNull(), // high, medium, low
  fileSize: integer("file_size"), // Size in bytes (optional)
  ipAddress: text("ip_address").notNull(),
  userAgent: text("user_agent").notNull(),
  downloadedAt: timestamp("downloaded_at").defaultNow().notNull(),
});

export const insertDownloadHistorySchema = createInsertSchema(downloadsHistory).omit({
  id: true,
  downloadedAt: true,
});

export type InsertDownloadHistory = z.infer<typeof insertDownloadHistorySchema>;
export type DownloadHistory = typeof downloadsHistory.$inferSelect;
