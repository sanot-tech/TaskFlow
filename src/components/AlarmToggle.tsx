
import React from "react";
import { Button } from "@/components/ui/button";
import { Bell, BellOff } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// AlarmToggle component props interface
interface AlarmToggleProps {
  isAlarmEnabled: boolean;
  toggleAlarmSystem: () => void;
}

// AlarmToggle Component - Updated for Dark Theme
export const AlarmToggle: React.FC<AlarmToggleProps> = ({
  isAlarmEnabled,
  toggleAlarmSystem,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex-1 flex-center-all"
    >
      <Button
        onClick={toggleAlarmSystem}
        role="switch"
        aria-checked={isAlarmEnabled}
        className={cn(
          "w-full py-5 font-semibold transition-all duration-300 rounded-xl shadow-lg flex-center-all quantum-symmetry text-sm",
          isAlarmEnabled
            ? "bg-gradient-to-r from-rose-500 to-orange-400 hover:from-rose-600 hover:to-orange-500 shadow-rose-500/20 text-white"
            : "bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 shadow-emerald-500/20 text-white"
        )}
      >
        {isAlarmEnabled ? (
          <span className="flex items-center gap-2 flex-center-all">
            <BellOff className="h-4 w-4 flex-center-all" />
            <span className="flex-center-all">Disable</span>
          </span>
        ) : (
          <span className="flex items-center gap-2 flex-center-all">
            <Bell className="h-4 w-4 flex-center-all" />
            <span className="flex-center-all">Enable Alarms</span>
          </span>
        )}
      </Button>
    </motion.div>
  );
};