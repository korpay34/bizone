import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const resources = sqliteTable("resources", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  author: text("author").notNull().default("고객지원팀"),
  content: text("content").notNull().default(""),
  fileKey: text("file_key"),
  fileName: text("file_name"),
  fileUrl: text("file_url"),
  fileType: text("file_type"),
  fileSize: integer("file_size"),
  downloadCount: integer("download_count").notNull().default(0),
  viewCount: integer("view_count").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const notices = sqliteTable("notices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  author: text("author").notNull().default("고객지원팀"),
  content: text("content").notNull().default(""),
  viewCount: integer("view_count").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`(datetime('now', '+9 hours'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now', '+9 hours'))`),
});
