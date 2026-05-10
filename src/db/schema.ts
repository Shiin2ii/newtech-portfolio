import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  source_url: text("source_url"),
  live_url: text("live_url"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const contact_messages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type ContactMessage = typeof contact_messages.$inferSelect;
export type NewContactMessage = typeof contact_messages.$inferInsert;
