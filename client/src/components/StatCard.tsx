import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  className?: string;
}

export function StatCard({ title, value, icon, trend, className }: StatCardProps) {
  return (
    <div className={cn("glass-panel p-6 rounded-xl tech-border hover:bg-secondary/90 transition-colors", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h4 className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{title}</h4>
          <div className="text-2xl font-display font-bold text-foreground">{value}</div>
        </div>
        <div className="p-2 bg-background/50 rounded-lg text-primary border border-white/5">
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-4 text-xs font-medium text-primary/80 flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          {trend}
        </div>
      )}
    </div>
  );
}
