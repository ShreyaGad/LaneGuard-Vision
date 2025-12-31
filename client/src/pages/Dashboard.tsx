import { useEffect } from "react";
import { DetectionFeed } from "@/components/DetectionFeed";
import { DetectionList } from "@/components/DetectionList";
import { StatCard } from "@/components/StatCard";
import { Controls } from "@/components/Controls";
import { useDetections } from "@/hooks/use-detections";
import { useSettings, useUpdateSettings } from "@/hooks/use-settings";
import { Truck, ShieldAlert, Activity, Settings2 } from "lucide-react";

export default function Dashboard() {
  const { data: detections = [] } = useDetections();
  const { data: settings } = useSettings();
  const updateSettings = useUpdateSettings();

  // Sort detections to show newest first
  const sortedDetections = [...detections].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const heavyVehiclesCount = detections.filter(d => d.isHeavyVehicle).length;
  const recentConfidenceAvg = detections.length > 0
    ? Math.round(detections.slice(0, 5).reduce((acc, curr) => acc + curr.confidence, 0) / Math.min(detections.length, 5))
    : 0;

  if (!settings) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 font-sans overflow-x-hidden">
      
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl tracking-tighter text-primary">
            LANEGUARD<span className="text-foreground">VISION</span>
          </h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">
            ADVANCED HEAVY VEHICLE MONITORING SYSTEM V2.0
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-secondary rounded border border-white/5 text-xs font-mono text-muted-foreground">
            {new Date().toLocaleDateString()}
          </div>
          <div className={`px-3 py-1 rounded border border-white/5 text-xs font-bold font-mono tracking-wider animate-pulse ${settings.heavyVehicleMode ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'}`}>
            {settings.heavyVehicleMode ? 'HV MODE' : 'STD MODE'}
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Stats & Controls */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <StatCard 
              title="Heavy Vehicles" 
              value={heavyVehiclesCount} 
              icon={<Truck className="w-5 h-5" />}
              trend="Last 24h"
              className={settings.heavyVehicleMode ? "border-accent/50" : ""}
            />
            <StatCard 
              title="Avg Confidence" 
              value={`${recentConfidenceAvg}%`} 
              icon={<Activity className="w-5 h-5" />}
              trend="Live Metric"
            />
            <StatCard 
              title="Alerts" 
              value={detections.length} 
              icon={<ShieldAlert className="w-5 h-5" />}
              trend="Total Logs"
            />
          </div>

          <div className="glass-panel p-6 rounded-xl tech-border">
            <div className="flex items-center gap-2 mb-6">
              <Settings2 className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-display font-bold">System Config</h3>
            </div>
            <Controls 
              settings={settings} 
              onUpdate={(updates) => updateSettings.mutate(updates)} 
            />
          </div>
        </div>

        {/* Center Column: Video Feed */}
        <div className="lg:col-span-6">
          <div className="glass-panel p-1 rounded-2xl tech-border relative h-full flex flex-col">
            <DetectionFeed 
              isHeavyVehicleMode={settings.heavyVehicleMode}
              sensitivity={settings.sensitivity}
            />
            <div className="p-4 flex justify-between items-center text-xs font-mono text-muted-foreground">
              <span>CAMERA_01 [ACTIVE]</span>
              <span>1920x1080 @ 60FPS</span>
            </div>
          </div>
        </div>

        {/* Right Column: Detections List */}
        <div className="lg:col-span-3">
          <div className="glass-panel p-6 rounded-xl tech-border h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-display font-bold">Detection Log</h3>
              <span className="text-xs font-mono text-primary animate-pulse">LIVE</span>
            </div>
            <DetectionList detections={sortedDetections} />
          </div>
        </div>
      </div>

    </div>
  );
}
