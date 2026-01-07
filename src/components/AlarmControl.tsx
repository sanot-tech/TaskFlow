"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, BellOff, Clock, Play, StopCircle, X } from "lucide-react";
import { useAlarmTimer } from "@/hooks/useAlarmTimer";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export const AlarmControl: React.FC = () => {
  const {
    alarms,
    isAlarmEnabled,
    startTimer,
    stopTimer,
    toggleAlarmSystem,
    formatTime,
  } = useAlarmTimer();

  return (
    <div className="space-y-4">
      {/* Кнопка включения/выключения */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Button
          onClick={toggleAlarmSystem}
          className={cn(
            "w-full py-6 text-lg font-semibold transition-all duration-300",
            isAlarmEnabled 
              ? "bg-red-500 hover:bg-red-600 border-2 border-red-300" 
              : "bg-green-500 hover:bg-green-600 border-2 border-green-300"
          )}
        >
          {isAlarmEnabled ? (
            <>
              <BellOff className="h-6 w-6 mr-3" /> Выключить будильники
            </>
          ) : (
            <>
              <Bell className="h-6 w-6 mr-3" /> Включить будильники
            </>
          )}
        </Button>
      </motion.div>

      {/* Статус системы */}
      <div className="text-center">
        <Badge 
          variant={isAlarmEnabled ? "default" : "secondary"}
          className={cn(
            "px-4 py-2 text-sm font-semibold",
            isAlarmEnabled ? "bg-green-500 text-white" : "bg-gray-400 text-gray-800"
          )}
        >
          {isAlarmEnabled ? "🟢 СИСТЕМА АКТИВНА" : "🔴 СИСТЕМА ВЫКЛЮЧЕНА"}
        </Badge>
      </div>

      {/* Активные таймеры */}
      {isAlarmEnabled && alarms.length > 0 && (
        <Card className="border-2 border-blue-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-500" /> Активные таймеры
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <AnimatePresence>
              {alarms.map((alarm) => (
                <motion.div
                  key={alarm.taskId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{alarm.taskTitle}</div>
                    <div className="text-blue-600 font-mono text-lg">
                      {formatTime(alarm.remainingTime)}
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => stopTimer(alarm.taskId)}
                      className="px-3 py-1"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </CardContent>
        </Card>
      )}

      {/* Инструкция */}
      {!isAlarmEnabled && (
        <div className="text-center text-sm text-muted-foreground p-3 bg-gray-50 rounded-lg">
          Включите систему, чтобы использовать таймеры
        </div>
      )}
    </div>
  );
};