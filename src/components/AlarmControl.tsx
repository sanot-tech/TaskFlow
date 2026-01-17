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

  // Тест звука
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

      {/* Sound Selection Panel (compact) */}
      {isAlarmEnabled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <Card className="border-0 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl shadow-md quantum-symmetry">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-3 flex-center-all">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1 flex-center-all">
                  <Volume2 className="h-3 w-3 flex-center-all" /> Select Sound
                </span>
                <span className="text-xs text-slate-600 flex-center-all">
                  {ALARM_SOUNDS.find(s => s.id === selectedSound)?.name}
                </span>
              </div>
              
              {/* Sound selection buttons */}
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
                        "w-full h-10 p-0 rounded-lg border-2 transition-all flex items-center justify-center flex-center-all quantum-symmetry",
                        selectedSound === sound.id
                          ? "border-slate-600 bg-slate-400 shadow-md"
                          : "border-slate-300 bg-white hover:border-slate-400"
                      )}
                      title={sound.name}
                    >
                      <span className="text-lg font-bold tracking-wider flex-center-all">{sound.name}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Active Timers */}
      {isAlarmEnabled && alarms.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <Card className="border-0 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl shadow-md quantum-symmetry">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2 flex-center-all">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1 flex-center-all">
                  <Clock className="h-3 w-3 flex-center-all" /> Active ({alarms.length})
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
                      className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-slate-200/50 quantum-symmetry"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate text-slate-800 flex-center-all">
                          {alarm.taskTitle}
                        </div>
                        <div className="text-xs font-mono text-slate-600 font-bold flex-center-all">
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
                          className="h-7 w-7 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50 flex-center-all quantum-symmetry"
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

      {/* Hint */}
      {!isAlarmEnabled && (
        <div className="text-center text-xs text-muted-foreground py-2 px-3 bg-gray-50/50 rounded-lg border border-gray-200/50 flex-center-all quantum-symmetry">
          Enable to use timers
        </div>
      )}
    </div>
  );
};