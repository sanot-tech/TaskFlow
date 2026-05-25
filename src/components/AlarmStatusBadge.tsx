
import React from "react";
import { Zap, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

// AlarmStatusBadge component props interface
interface AlarmStatusBadgeProps {
  isAlarmEnabled: boolean;
}

// AlarmStatusBadge Component - Updated for Dark Theme
export const AlarmStatusBadge: React.FC<AlarmStatusBadgeProps> = ({
  isAlarmEnabled,
}) => {
  return (
    <div className={cn(
      "px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 min-w-[60px] justify-center flex-center-all quantum-symmetry border-2",
      isAlarmEnabled
        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
        : "bg-gray-800/50 text-gray-500 border-gray-700/50"
    )}>
      {isAlarmEnabled ? <Zap className="h-3 w-3 flex-center-all" /> : <Activity className="h-3 w-3 flex-center-all" />}
      {isAlarmEnabled ? "ON" : "OFF"}
    </div>
  );
};