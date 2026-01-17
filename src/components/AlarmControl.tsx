"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, BellOff, Clock, X, Zap, Activity, Volume2 } from "lucide-react";
import { useAlarmTimer } from "@/hooks/useAlarmTimer";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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
    <div className="space-y-3">
      {/* Главная кнопка + статус */}
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1"
        >
          <Button
            onClick={toggleAlarmSystem}
            className={cn(
              "w-full py-5 font-semibold transition-all duration-300 rounded-xl shadow-lg",
              isAlarmEnabled 
                ? "bg-gradient-to-r from-rose-400 to-orange-300 hover:from-rose-500 hover:to-orange-400 shadow-rose-400/20" 
                : "bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-500 hover:to-teal-400 shadow-emerald-400/20"
            )}
          >
            {isAlarmEnabled ? (
              <span className="flex items-center gap-2">
                <BellOff className="h-5 w-5" /> 
                <span>Выключить</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Bell className="h-5 w-5" /> 
                <span>Включить будильники</span>
              </span>
            )}
          </Button>
        </motion.div>

        {/* Статус-бадж */}
        <div className={cn(
          "px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 min-w-[60px] justify-center",
          isAlarmEnabled 
            ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/25" 
            : "bg-gray-500/15 text-gray-500 border border-gray-500/25"
        )}>
          {isAlarmEnabled ? <Zap className="h-3 w-3" /> : <Activity className="h-3 w-3" />}
          {isAlarmEnabled ? "ON" : "OFF"}
        </div>
      </div>

      {/* Панель выбора звука (компактная) */}
      {isAlarmEnabled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <Card className="border-0 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl shadow-md">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Volume2 className="h-3 w-3" /> Выберите звук
                </span>
                <span className="text-xs text-slate-600">
                  {ALARM_SOUNDS.find(s => s.id === selectedSound)?.name}
                </span>
              </div>
              
              {/* Кнопки выбора звука */}
              <div className="grid grid-cols-5 gap-2">
                {ALARM_SOUNDS.map((sound) => (
                  <motion.div
                    key={sound.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center"
                  >
                    <Button
                      onClick={() => {
                        setSelectedSound(sound.id);
                        testSound(sound.id);
                      }}
                      className={cn(
                        "w-full h-10 p-0 rounded-lg border-2 transition-all flex items-center justify-center",
                        selectedSound === sound.id
                          ? "border-slate-600 bg-slate-400 shadow-md"
                          : "border-slate-300 bg-white hover:border-slate-400"
                      )}
                      title={sound.name}
                    >
                      <span className="text-lg">{sound.name.split(' ')[0]}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Активные таймеры */}
      {isAlarmEnabled && alarms.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <Card className="border-0 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl shadow-md">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Активные ({alarms.length})
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
                      className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-slate-200/50"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate text-slate-800">
                          {alarm.taskTitle}
                        </div>
                        <div className="text-xs font-mono text-slate-600 font-bold">
                          {formatTime(alarm.remainingTime)}
                        </div>
                      </div>
                      
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => stopTimer(alarm.taskId)}
                          className="h-7 w-7 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                        >
                          <X className="h-3 w-3" />
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

      {/* Подсказка */}
      {!isAlarmEnabled && (
        <div className="text-center text-xs text-muted-foreground py-2 px-3 bg-gray-50/50 rounded-lg border border-gray-200/50">
          Включите для использования таймеров
        </div>
      )}
    </div>
  );
};