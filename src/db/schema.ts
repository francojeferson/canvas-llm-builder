import {
  pgTable,
  boolean,
  text,
  uuid,
  varchar,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";

// Agents table to store agent configurations
export const agents = pgTable("agents", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  globalPrompt: text("global_prompt").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// States table to store individual states of an agent
export const states = pgTable("states", {
  id: uuid("id").defaultRandom().primaryKey(),
  agentId: uuid("agent_id")
    .references(() => agents.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  prompt: text("prompt").notNull(),
  isInitial: boolean("is_initial").default(false).notNull(),
  position: jsonb("position").notNull().default({ x: 0, y: 0 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Edges table to store transitions between states
export const edges = pgTable("edges", {
  id: uuid("id").defaultRandom().primaryKey(),
  agentId: uuid("agent_id")
    .references(() => agents.id, { onDelete: "cascade" })
    .notNull(),
  sourceId: uuid("source_id")
    .references(() => states.id, { onDelete: "cascade" })
    .notNull(),
  targetId: uuid("target_id")
    .references(() => states.id, { onDelete: "cascade" })
    .notNull(),
  intent: varchar("intent", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
