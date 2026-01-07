"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, BellOff, Clock, X, Zap, Activity, Music, Volume2 } from "lucide-react";
import { useAlarmTimer } from "@/hooks/useAlarmTimer";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  return (
    <div className="space-y-3">
      {/* Компактная панель управления */}
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1"
        >
          <Button
            onClick={toggleAlarmSystem}
            className={cn(
              "w-full py-5 font-semibold transition-all duration-300 rounded-xl",
              isAlarmEnabled 
                ? "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-lg shadow-red-500/20" 
                : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg shadow-green-500/20"
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
          "px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1",
          isAlarmEnabled 
            ? "bg-green-500/20 text-green-600 border border-green-500/30" 
            : "bg-gray-500/20 text-gray-500 border border-gray-500/30"
        )}>
          {isAlarmEnabled ? <Zap className="h-3 w-3" /> : <Activity className="h-3 w-3" />}
          {isAlarmEnabled ? "ON" : "OFF"}
        </div>
      </div>

      {/* Выбор звука */}
      {isAlarmEnabled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <Card className="border-0 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-md">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-purple-700 flex items-center gap-1">
                  <Music className="h-3 w-3" /> Звук будильника
                </span>
                <span className="text-xs text-purple-600 flex items-center gap-1">
                  <Volume2 className="h-3 w-3" /> {ALARM_SOUNDS.find(s => s.id === selectedSound)?.name}
                </span>
              </div>
              <Select value={selectedSound} onValueChange={setSelectedSound}>
                <SelectTrigger className="w-full h-9 text-sm">
                  <SelectValue placeholder="Выберите звук" />
                </SelectTrigger>
                <SelectContent>
                  {ALARM_SOUNDS.map((sound) => (
                    <SelectItem key={sound.id} value={sound.id}>
                      {sound.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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