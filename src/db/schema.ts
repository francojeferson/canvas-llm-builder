import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const Posts = pgTable("posts", {
  id: serial("id").primaryKey().notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
});
