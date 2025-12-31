import { db } from "./db";
import { detections, settings, type Detection, type InsertDetection, type Settings, type InsertSettings } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getDetections(): Promise<Detection[]>;
  createDetection(detection: InsertDetection): Promise<Detection>;
  getSettings(): Promise<Settings>;
  updateSettings(settings: InsertSettings): Promise<Settings>;
}

export class DatabaseStorage implements IStorage {
  async getDetections(): Promise<Detection[]> {
    return await db.select().from(detections).orderBy(detections.timestamp);
  }

  async createDetection(detection: InsertDetection): Promise<Detection> {
    const [newDetection] = await db.insert(detections).values(detection).returning();
    return newDetection;
  }

  async getSettings(): Promise<Settings> {
    const [existing] = await db.select().from(settings);
    if (!existing) {
      const [newSettings] = await db.insert(settings).values({ heavyVehicleMode: false, sensitivity: 50 }).returning();
      return newSettings;
    }
    return existing;
  }

  async updateSettings(newSettings: InsertSettings): Promise<Settings> {
    const existing = await this.getSettings();
    const [updated] = await db
      .update(settings)
      .set(newSettings)
      .where(eq(settings.id, existing.id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
