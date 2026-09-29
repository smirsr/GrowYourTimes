import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
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

// Task model
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  completed: boolean("completed").notNull().default(false),
  points: integer("points").notNull().default(10),
  userId: integer("user_id").references(() => users.id),
});

// Create a more flexible schema for task insertion
export const insertTaskSchema = createInsertSchema(tasks)
  .pick({
    title: true,
    description: true,
    points: true,
    userId: true,
  })
  .extend({
    // Accept date string or null for dueDate
    dueDate: z.union([
      z.string().transform(val => new Date(val)),
      z.date(),
      z.null()
    ]).optional().nullable(),
  });

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

// Plant model
export const plants = pgTable("plants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  stage: integer("stage").notNull().default(1),
  maxStage: integer("max_stage").notNull().default(5),
  points: integer("points").notNull().default(0),
  pointsToNextStage: integer("points_to_next_stage").notNull(),
  completed: boolean("completed").notNull().default(false),
  startDate: timestamp("start_date").notNull().defaultNow(),
  userId: integer("user_id").references(() => users.id),
  // Plant care attributes
  waterLevel: integer("water_level").notNull().default(50),
  sunlightLevel: integer("sunlight_level").notNull().default(50),
  nutrientLevel: integer("nutrient_level").notNull().default(50),
  // Plant health status: "healthy", "withering", or "dead"
  status: text("status").notNull().default("healthy"),
  // If plant is withering, track when it started withering
  witheringSince: timestamp("withering_since"),
  // Last care timestamp
  lastCareDate: timestamp("last_care_date").notNull().defaultNow(),
});

export const insertPlantSchema = createInsertSchema(plants).pick({
  name: true,
  type: true,
  maxStage: true,
  pointsToNextStage: true,
  userId: true,
});

export type InsertPlant = z.infer<typeof insertPlantSchema>;
export type Plant = typeof plants.$inferSelect;

// Chat model
export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  isUser: boolean("is_user").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  userId: integer("user_id").references(() => users.id),
});

export const insertChatSchema = createInsertSchema(chats).pick({
  message: true,
  isUser: true,
  userId: true,
});

export type InsertChat = z.infer<typeof insertChatSchema>;
export type Chat = typeof chats.$inferSelect;
