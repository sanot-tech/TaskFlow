"use client";

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

// AlarmToggle Component
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
        className={cn(
          "w-full py-5 font-semibold transition-all duration-300 rounded-xl shadow-lg flex-center-all quantum-symmetry",
          isAlarmEnabled
            ? "bg-gradient-to-r from-rose-400 to-orange-300 hover:from-rose-500 hover:to-orange-400 shadow-rose-400/20"
            : "bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-500 hover:to-teal-400 shadow-emerald-400/20"
        )}
      >
        {isAlarmEnabled ? (
          <span className="flex items-center gap-2 flex-center-all">
            <BellOff className="h-5 w-5 flex-center-all" />
            <span className="flex-center-all">Disable</span>
          </span>
        ) : (
          <span className="flex items-center gap-2 flex-center-all">
            <Bell className="h-5 w-5 flex-center-all" />
            <span className="flex-center-all">Enable Alarms</span>
          </span>
        )}
      </Button>
    </motion.div>
  );
};