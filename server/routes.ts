import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.detections.list.path, async (req, res) => {
    const detections = await storage.getDetections();
    res.json(detections);
  });

  app.post(api.detections.create.path, async (req, res) => {
    try {
      const input = api.detections.create.input.parse(req.body);
      const detection = await storage.createDetection(input);
      res.status(201).json(detection);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.message });
      }
      throw err;
    }
  });

  app.get(api.settings.get.path, async (req, res) => {
    const settings = await storage.getSettings();
    res.json(settings);
  });

  app.post(api.settings.update.path, async (req, res) => {
    const input = api.settings.update.input.parse(req.body);
    const settings = await storage.updateSettings(input);
    res.json(settings);
  });

  // Seed initial data
  const existing = await storage.getDetections();
  if (existing.length === 0) {
    await storage.createDetection({ type: 'heavy_vehicle', confidence: 95, isHeavyVehicle: true });
    await storage.createDetection({ type: 'vehicle', confidence: 88, isHeavyVehicle: false });
    await storage.createDetection({ type: 'heavy_vehicle', confidence: 92, isHeavyVehicle: true });
  }

  return httpServer;
}
