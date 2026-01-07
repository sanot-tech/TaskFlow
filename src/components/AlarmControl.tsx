"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, BellOff, Clock, X, Zap, Activity, Volume2, Play } from "lucide-react";
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
      audio.volume = 0.5;
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
                ? "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-red-500/25" 
                : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-green-500/25"
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
            ? "bg-green-500/20 text-green-600 border border-green-500/30" 
            : "bg-gray-500/20 text-gray-500 border border-gray-500/30"
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
          <Card className="border-0 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-md">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-purple-700 flex items-center gap-1">
                  <Volume2 className="h-3 w-3" /> Выберите звук
                </span>
                <span className="text-xs text-purple-600">
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
                    className="relative"
                  >
                    <Button
                      onClick={() => {
                        setSelectedSound(sound.id);
                        testSound(sound.id);
                      }}
                      className={cn(
                        "w-full h-10 p-0 rounded-lg border-2 transition-all",
                        selectedSound === sound.id
                          ? "border-purple-500 bg-purple-100 shadow-md"
                          : "border-purple-200 bg-white hover:border-purple-300"
                      )}
                      title={sound.name}
                    >
                      <span className="text-lg">{sound.name.split(' ')[0]}</span>
                    </Button>
                    {/* Тест-кнопка */}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-white shadow-sm border border-purple-200 hover:bg-purple-50 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        testSound(sound.id);
                      }}
                      title="Прослушать"
                    >
                      <Play className="h-3 w-3 text-purple-600" />
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
          <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-700 flex items-center gap-1">
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
                      className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-blue-200/50"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate text-gray-800">
                          {alarm.taskTitle}
                        </div>
                        <div className="text-xs font-mono text-blue-600 font-bold">
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
                          className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
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