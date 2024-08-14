import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const locate = sqliteTable("locate", {
  id: integer("id", {
    mode: "number",
  }).primaryKey({
    autoIncrement: true,
  }),
  name: text("name", {
    length: 100,
    mode: "text",
  })
    .notNull()
    .unique(),
});

export const srcType = sqliteTable("src_type", {
  id: integer("id", {
    mode: "number",
  }).primaryKey({
    autoIncrement: true,
  }),
  name: text("name", {
    length: 100,
    mode: "text",
  })
    .notNull()
    .unique(),
});

export const log = sqliteTable("count_log", {
  id: integer("id", {
    mode: "number",
  }).primaryKey({
    autoIncrement: true,
  }),
  count: integer("count", {
    mode: "number",
  }).notNull(),
  timestamp: integer("timestamp", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
  locateId: integer("locate_id", {
    mode: "number",
  })
    .references(() => locate.id)
    .notNull(),
  srcType: integer("src_type", {
    mode: "number",
  })
    .references(() => srcType.id)
    .notNull(),
});

export const admin = sqliteTable("admin", {
  id: text("id").primaryKey(),
  passwordSalt: text("passwordSalt").notNull(),
  passwordHash: text("passwordHash").notNull(),
});
