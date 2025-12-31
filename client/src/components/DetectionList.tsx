import { format } from "date-fns";
import { type Detection } from "@shared/schema";
import { Truck, Car, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface DetectionListProps {
  detections: Detection[];
}

export function DetectionList({ detections }: DetectionListProps) {
  if (detections.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8">
        <Activity className="w-12 h-12 mb-4 opacity-20" />
        <p>No recent detections</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
      {detections.map((detection, index) => (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          key={detection.id}
          className={`flex items-center gap-4 p-3 rounded-lg border border-white/5 bg-secondary/30 hover:bg-secondary/50 transition-colors
            ${detection.isHeavyVehicle ? 'border-l-4 border-l-accent' : 'border-l-4 border-l-primary/50'}
          `}
        >
          <div className={`p-2 rounded-md ${detection.isHeavyVehicle ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'}`}>
            {detection.isHeavyVehicle ? <Truck className="w-5 h-5" /> : <Car className="w-5 h-5" />}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm text-foreground truncate">
                {detection.isHeavyVehicle ? "Heavy Vehicle Detected" : "Standard Vehicle"}
              </span>
              <span className="text-xs font-mono text-muted-foreground">
                {detection.timestamp ? format(new Date(detection.timestamp), 'HH:mm:ss') : '--:--'}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${detection.confidence > 80 ? 'bg-green-500' : 'bg-yellow-500'}`}
                  style={{ width: `${detection.confidence}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">{detection.confidence}%</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
