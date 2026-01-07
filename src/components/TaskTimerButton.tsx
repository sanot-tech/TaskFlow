"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Play, StopCircle } from "lucide-react";
import { useAlarmTimer } from "@/hooks/useAlarmTimer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";

interface TaskTimerButtonProps {
  taskId: string;
  taskTitle: string;
}

export const TaskTimerButton: React.FC<TaskTimerButtonProps> = ({ taskId, taskTitle }) => {
  const { startTimer, stopTimer, isTimerActive, getTimeForTask } = useAlarmTimer();
  const [duration, setDuration] = useState(25); // 25 минут по умолчанию
  const [isOpen, setIsOpen] = useState(false);

  const handleStart = () => {
    if (duration > 0) {
      startTimer(taskId, taskTitle, duration);
      setIsOpen(false);
    }
  };

  const isActive = isTimerActive(taskId);
  const remainingTime = getTimeForTask(taskId);

  if (isActive) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        className="flex items-center gap-2"
      >
        <Button
          size="sm"
          variant="destructive"
          onClick={() => stopTimer(taskId)}
          className="px-3 py-1"
        >
          <StopCircle className="h-4 w-4 mr-2" /> Стоп ({remainingTime})
        </Button>
      </motion.div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Button
            size="sm"
            variant="outline"
            className="px-3 py-1 border-blue-500/30 hover:bg-blue-50"
          >
            <Clock className="h-4 w-4 mr-2" /> Таймер
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" /> Запустить таймер
          </DialogTitle>
          <DialogDescription>
            Задача: <strong>{taskTitle}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Длительность (минуты)</Label>
            <Input
              type="number"
              min="1"
              max="180"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              placeholder="25"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setDuration(5)}
              variant={duration === 5 ? "default" : "secondary"}
              className="flex-1"
            >
              5 мин
            </Button>
            <Button
              onClick={() => setDuration(25)}
              variant={duration === 25 ? "default" : "secondary"}
              className="flex-1"
            >
              25 мин
            </Button>
            <Button
              onClick={() => setDuration(45)}
              variant={duration === 45 ? "default" : "secondary"}
              className="flex-1"
            >
              45 мин
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleStart} className="flex-1 bg-blue-500 hover:bg-blue-600">
            <Play className="h-4 w-4 mr-2" /> Запустить
          </Button>
          <Button onClick={() => setIsOpen(false)} variant="outline" className="flex-1">
            Отмена
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};