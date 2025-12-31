import { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { type Detection } from "@shared/schema";
import { useCreateDetection } from "@/hooks/use-detections";
import { Truck, Car, AlertTriangle } from "lucide-react";

interface DetectionFeedProps {
  isHeavyVehicleMode: boolean;
  sensitivity: number;
}

export function DetectionFeed({ isHeavyVehicleMode, sensitivity }: DetectionFeedProps) {
  const webcamRef = useRef<Webcam>(null);
  const [simulatedBox, setSimulatedBox] = useState<{ x: number; y: number; type: 'vehicle' | 'heavy_vehicle' } | null>(null);
  const createDetection = useCreateDetection();

  // Simulate AI Detection Loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance to detect something
        const isHeavy = Math.random() > 0.6; // 40% chance it's a truck
        
        // If in Heavy Vehicle Mode, we care mostly about heavy vehicles
        // But for simulation, let's detect both but highlight differently
        
        const type = isHeavy ? 'heavy_vehicle' : 'vehicle';
        
        // Random position
        setSimulatedBox({
          x: 20 + Math.random() * 60, // 20-80%
          y: 30 + Math.random() * 40, // 30-70%
          type
        });

        // Only log detection if it meets criteria or mode
        if ((isHeavyVehicleMode && isHeavy) || !isHeavyVehicleMode) {
           createDetection.mutate({
             type: isHeavy ? 'heavy_vehicle' : 'vehicle',
             confidence: Math.floor(70 + Math.random() * 30),
             isHeavyVehicle: isHeavy
           });
        }

        // Clear box after 1.5s
        setTimeout(() => setSimulatedBox(null), 1500);
      }
    }, 3000); // Check every 3s

    return () => clearInterval(interval);
  }, [isHeavyVehicleMode, createDetection]);

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border-2 border-border shadow-2xl shadow-primary/10">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="w-full h-full object-cover opacity-80"
        videoConstraints={{ facingMode: "environment" }}
      />
      
      {/* HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)]" />
        <div className="scan-line" />
        
        {/* HUD Elements */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
           <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
           <span className="text-xs font-mono text-red-500 uppercase tracking-widest">Live Feed</span>
        </div>

        <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
          <span className="text-xs font-mono text-primary/80 uppercase">System Status</span>
          <span className="text-sm font-display font-bold text-primary">ONLINE</span>
        </div>

        {/* Dynamic Bounding Box */}
        <AnimatePresence>
          {simulatedBox && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              style={{
                left: `${simulatedBox.x}%`,
                top: `${simulatedBox.y}%`,
              }}
              className={`absolute w-32 h-24 -ml-16 -mt-12 border-2 rounded-lg flex flex-col items-center justify-start pt-1 backdrop-blur-sm
                ${simulatedBox.type === 'heavy_vehicle' 
                  ? 'border-accent bg-accent/10 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                  : 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(14,165,233,0.3)]'
                }
                ${isHeavyVehicleMode && simulatedBox.type !== 'heavy_vehicle' ? 'opacity-30 border-dashed' : ''}
              `}
            >
              <div className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded flex items-center gap-1
                ${simulatedBox.type === 'heavy_vehicle' ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'}
              `}>
                {simulatedBox.type === 'heavy_vehicle' ? <Truck className="w-3 h-3" /> : <Car className="w-3 h-3" />}
                {simulatedBox.type === 'heavy_vehicle' ? 'HV-DETECT' : 'VEHICLE'}
              </div>
              <span className="mt-1 text-[10px] font-mono text-white/90">
                CONF: {Math.floor(85 + Math.random() * 14)}%
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
