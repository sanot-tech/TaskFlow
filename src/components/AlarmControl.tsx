"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, X, Zap, Activity, Volume2 } from "lucide-react";
import { useAlarmTimer } from "@/hooks/useAlarmTimer";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AlarmToggle } from "./AlarmToggle";
import { AlarmStatusBadge } from "./AlarmStatusBadge";

// Alarm Control Component - Updated for Dark Theme Harmony
export const AlarmControl: React.FC = () => {
  const {
    alarms,
    isAlarmEnabled,
    stopTimer,
    toggleAlarmSystem,
    formatTime,
    selectedSound,
    setSelectedSound,
    ALARM_SOUNDS,
  } = useAlarmTimer();

  // Test sound function
  const testSound = (soundId: string) => {
    const sound = ALARM_SOUNDS.find(s => s.id === soundId);
    if (sound) {
      const audio = new Audio(sound.url);
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
  };

  return (
    <div className="space-y-3 quantum-symmetry">
      {/* Main Button + Status - centered vertically */}
      <div className="flex items-center gap-3 flex-center-all">
        <AlarmToggle
          isAlarmEnabled={isAlarmEnabled}
          toggleAlarmSystem={toggleAlarmSystem}
        />
        <AlarmStatusBadge isAlarmEnabled={isAlarmEnabled} />
      </div>

      {/* Sound Selection Panel (compact) - Dark Theme */}
      <AnimatePresence>
        {isAlarmEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="border-2 border-gray-700/50 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg quantum-symmetry">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3 flex-center-all">
                  <span className="text-sm font-bold text-gray-300 flex items-center gap-2 flex-center-all">
                    <Volume2 className="h-4 w-4 flex-center-all text-blue-400" /> Select Sound
                  </span>
                  <span className="text-xs text-gray-400 flex-center-all font-mono">
                    {ALARM_SOUNDS.find(s => s.id === selectedSound)?.name}
                  </span>
                </div>
                
                {/* Sound selection buttons - Improved spacing and contrast */}
                <div className="grid grid-cols-5 gap-2">
                  {ALARM_SOUNDS.map((sound) => (
                    <motion.div
                      key={sound.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center flex-center-all"
                    >
                      <Button
                        onClick={() => {
                          setSelectedSound(sound.id);
                          testSound(sound.id);
                        }}
                        className={cn(
                          "w-full h-10 p-0 rounded-lg border-2 transition-all flex items-center justify-center flex-center-all quantum-symmetry text-sm font-bold",
                          selectedSound === sound.id
                            ? "border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/20 text-blue-300"
                            : "border-gray-700 bg-gray-800 hover:border-gray-600 hover:bg-gray-700 text-gray-300"
                        )}
                        title={sound.name}
                      >
                        <span className="flex-center-all">{sound.name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Timers - Dark Theme with Improved Typography */}
      <AnimatePresence>
        {isAlarmEnabled && alarms.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="border-2 border-gray-700/50 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg quantum-symmetry">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3 flex-center-all">
                  <span className="text-sm font-bold text-gray-300 flex items-center gap-2 flex-center-all">
                    <Clock className="h-4 w-4 flex-center-all text-green-400" /> Active ({alarms.length})
                  </span>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <AnimatePresence>
                    {alarms.map((alarm) => (
                      <motion.div
                        key={alarm.taskId}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-center justify-between bg-gray-800/60 backdrop-blur-sm rounded-lg p-3 border border-gray-700/50 quantum-symmetry"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate text-gray-200 flex-center-all">
                            {alarm.taskTitle}
                          </div>
                          <div className="text-xs font-mono text-green-400 font-bold flex-center-all mt-1">
                            {formatTime(alarm.remainingTime)}
                          </div>
                        </div>
                        
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="flex-center-all"
                        >
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => stopTimer(alarm.taskId)}
                            className="h-7 w-7 p-0 text-rose-400 hover:text-rose-300 hover:bg-rose-900/30 rounded-lg flex-center-all quantum-symmetry"
                          >
                            <X className="h-3 w-3 flex-center-all" />
                          </Button>
                        </motion.div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint - Dark Theme */}
      {!isAlarmEnabled && (
        <div className="text-center text-xs text-gray-500 py-2 px-3 bg-gray-900/50 rounded-lg border border-gray-800/50 flex-center-all quantum-symmetry">
          Enable to use timers
        </div>
      )}
    </div>
  );
};