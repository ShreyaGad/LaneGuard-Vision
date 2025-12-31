import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const detections = pgTable("detections", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'vehicle', 'heavy_vehicle', 'lane_departure'
  confidence: integer("confidence").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  isHeavyVehicle: boolean("is_heavy_vehicle").default(false).notNull(),
});

export const insertDetectionSchema = createInsertSchema(detections).omit({ 
  id: true, 
  timestamp: true 
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  heavyVehicleMode: boolean("heavy_vehicle_mode").default(false).notNull(),
  sensitivity: integer("sensitivity").default(50).notNull(),
});

export const insertSettingsSchema = createInsertSchema(settings).omit({ id: true });

export type Detection = typeof detections.$inferSelect;
export type InsertDetection = z.infer<typeof insertDetectionSchema>;
export type Settings = typeof settings.$inferSelect;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
