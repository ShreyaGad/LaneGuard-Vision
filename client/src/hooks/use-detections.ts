import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type InsertDetection, type Detection } from "@shared/schema";

export function useDetections() {
  return useQuery({
    queryKey: [api.detections.list.path],
    queryFn: async () => {
      const res = await fetch(api.detections.list.path);
      if (!res.ok) throw new Error("Failed to fetch detections");
      return api.detections.list.responses[200].parse(await res.json());
    },
    refetchInterval: 2000, // Poll every 2s for "real-time" feel
  });
}

export function useCreateDetection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertDetection) => {
      const res = await fetch(api.detections.create.path, {
        method: api.detections.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create detection");
      return api.detections.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.detections.list.path] });
    },
  });
}
