import { z } from "zod";
import { insertDetectionSchema, insertSettingsSchema, detections, settings } from "./schema";

export const api = {
  detections: {
    list: {
      method: "GET" as const,
      path: "/api/detections",
      responses: {
        200: z.array(z.custom<typeof detections.$inferSelect>()),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/detections",
      input: insertDetectionSchema,
      responses: {
        201: z.custom<typeof detections.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
  },
  settings: {
    get: {
      method: "GET" as const,
      path: "/api/settings",
      responses: {
        200: z.custom<typeof settings.$inferSelect>(),
      },
    },
    update: {
      method: "POST" as const,
      path: "/api/settings",
      input: insertSettingsSchema,
      responses: {
        200: z.custom<typeof settings.$inferSelect>(),
      },
    },
  },
};
