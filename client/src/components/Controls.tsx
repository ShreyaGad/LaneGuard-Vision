import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { type Settings } from "@shared/schema";

interface ControlsProps {
  settings: Settings;
  onUpdate: (updates: Partial<Settings>) => void;
}

export function Controls({ settings, onUpdate }: ControlsProps) {
  return (
    <div className="space-y-8 p-1">
      {/* Heavy Vehicle Toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-background/30 border border-white/5">
        <div className="space-y-1">
          <Label className="text-base font-display font-bold">Heavy Vehicle Mode</Label>
          <p className="text-xs text-muted-foreground max-w-[200px]">
            Prioritize detection of trucks, buses, and industrial machinery.
          </p>
        </div>
        <Switch
          checked={settings.heavyVehicleMode}
          onCheckedChange={(checked) => onUpdate({ heavyVehicleMode: checked })}
          className="data-[state=checked]:bg-accent data-[state=unchecked]:bg-input"
        />
      </div>

      {/* Sensitivity Slider */}
      <div className="space-y-4 p-4 rounded-xl bg-background/30 border border-white/5">
        <div className="flex items-center justify-between">
          <Label className="text-base font-display font-bold">Detection Sensitivity</Label>
          <span className="font-mono text-sm text-primary">{settings.sensitivity}%</span>
        </div>
        <Slider
          value={[settings.sensitivity]}
          min={0}
          max={100}
          step={1}
          onValueChange={([val]) => onUpdate({ sensitivity: val })}
          className="py-4"
        />
        <p className="text-xs text-muted-foreground">
          Lower values increase range but may produce more false positives.
        </p>
      </div>
      
      {/* Status Readout */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-background/30 rounded-lg border border-white/5 text-center">
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Status</div>
            <div className="text-green-500 font-bold font-mono text-sm">ACTIVE</div>
        </div>
        <div className="p-3 bg-background/30 rounded-lg border border-white/5 text-center">
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Latency</div>
            <div className="text-primary font-bold font-mono text-sm">24ms</div>
        </div>
      </div>
    </div>
  );
}
