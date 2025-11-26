import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const farmers = pgTable("farmers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").notNull(),
  language: text("language").notNull().default("en"),
  phoneNumber: text("phone_number"),
  farmSize: real("farm_size"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const crops = pgTable("crops", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  season: text("season").notNull(),
  soilType: text("soil_type").notNull(),
  waterRequirement: text("water_requirement").notNull(),
  expectedYield: real("expected_yield"),
  profitEstimate: real("profit_estimate"),
  growthDuration: integer("growth_duration"),
  description: text("description"),
});

export const advisories = pgTable("advisories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  farmerId: varchar("farmer_id").references(() => farmers.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  severity: text("severity").notNull().default("info"),
  timestamp: timestamp("timestamp").defaultNow(),
  source: text("source"),
});

export const soilAnalyses = pgTable("soil_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  farmerId: varchar("farmer_id").references(() => farmers.id),
  soilType: text("soil_type").notNull(),
  nitrogen: real("nitrogen"),
  phosphorus: real("phosphorus"),
  potassium: real("potassium"),
  ph: real("ph"),
  organicMatter: real("organic_matter"),
  recommendations: text("recommendations"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const resources = pgTable("resources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  farmerId: varchar("farmer_id").references(() => farmers.id),
  resourceType: text("resource_type").notNull(),
  used: real("used").notNull().default(0),
  optimal: real("optimal").notNull(),
  unit: text("unit").notNull(),
  month: text("month").notNull(),
  year: integer("year").notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  farmerId: varchar("farmer_id").references(() => farmers.id),
  role: text("role").notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  language: text("language").notNull().default("en"),
});

export const pestsDiseases = pgTable("pests_diseases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(),
  cropAffected: text("crop_affected").notNull(),
  symptoms: jsonb("symptoms").notNull(),
  severity: text("severity").notNull(),
  treatment: text("treatment").notNull(),
  prevention: text("prevention"),
  imageUrl: text("image_url"),
});

export const weatherData = pgTable("weather_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  location: text("location").notNull(),
  temperature: real("temperature").notNull(),
  humidity: real("humidity"),
  rainfall: real("rainfall"),
  windSpeed: real("wind_speed"),
  condition: text("condition").notNull(),
  forecast: jsonb("forecast"),
  advisory: text("advisory"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertFarmerSchema = createInsertSchema(farmers).omit({ id: true, createdAt: true });
export const insertCropSchema = createInsertSchema(crops).omit({ id: true });
export const insertAdvisorySchema = createInsertSchema(advisories).omit({ id: true, timestamp: true });
export const insertSoilAnalysisSchema = createInsertSchema(soilAnalyses).omit({ id: true, createdAt: true });
export const insertResourceSchema = createInsertSchema(resources).omit({ id: true });
export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ id: true, timestamp: true });
export const insertPestDiseaseSchema = createInsertSchema(pestsDiseases).omit({ id: true });
export const insertWeatherDataSchema = createInsertSchema(weatherData).omit({ id: true, timestamp: true });

export type Farmer = typeof farmers.$inferSelect;
export type InsertFarmer = z.infer<typeof insertFarmerSchema>;
export type Crop = typeof crops.$inferSelect;
export type InsertCrop = z.infer<typeof insertCropSchema>;
export type Advisory = typeof advisories.$inferSelect;
export type InsertAdvisory = z.infer<typeof insertAdvisorySchema>;
export type SoilAnalysis = typeof soilAnalyses.$inferSelect;
export type InsertSoilAnalysis = z.infer<typeof insertSoilAnalysisSchema>;
export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type PestDisease = typeof pestsDiseases.$inferSelect;
export type InsertPestDisease = z.infer<typeof insertPestDiseaseSchema>;
export type WeatherData = typeof weatherData.$inferSelect;
export type InsertWeatherData = z.infer<typeof insertWeatherDataSchema>;
