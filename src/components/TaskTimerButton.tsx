"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Play, StopCircle as StopCircleIcon, Timer } from "lucide-react";
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
  const [duration, setDuration] = useState(25);
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
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        className="flex items-center gap-2 flex-center-all quantum-symmetry"
      >
        <Button
          size="sm"
          variant="destructive"
          onClick={() => stopTimer(taskId)}
          className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 shadow-md shadow-red-500/20 flex-center-all quantum-symmetry"
        >
          <StopCircleIcon className="h-3.5 w-3.5 mr-1.5 flex-center-all" />
          <span className="font-mono font-bold flex-center-all">{remainingTime}</span>
        </Button>
      </motion.div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-center-all"
        >
          <Button
            size="sm"
            variant="outline"
            className="px-3 py-1.5 rounded-lg border-blue-400/30 text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-all flex-center-all quantum-symmetry"
          >
            <Timer className="h-3.5 w-3.5 mr-1.5 flex-center-all" /> Timer
          </Button>
        </motion.div>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[360px] rounded-xl quantum-symmetry">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg flex-center-all">
            <Clock className="h-5 w-5 text-blue-500 flex-center-all" />
            <span className="flex-center-all">Start Timer</span>
          </DialogTitle>
          <DialogDescription className="text-sm flex-center-all">
            Task: <strong className="text-gray-900 flex-center-all">{taskTitle}</strong>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4 flex-center-all">
          <div className="space-y-2 flex-center-all">
            <Label className="text-sm font-medium flex-center-all">Duration (minutes)</Label>
            <Input
              type="number"
              min="1"
              max="180"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="h-10 flex-center-all quantum-symmetry"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-2 flex-center-all">
            {[5, 25, 45].map((min) => (
              <Button
                key={min}
                onClick={() => setDuration(min)}
                variant={duration === min ? "default" : "secondary"}
                className="h-9 text-sm font-medium flex-center-all quantum-symmetry"
              >
                {min} min
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex gap-2 flex-center-all">
          <Button onClick={handleStart} className="flex-1 bg-blue-500 hover:bg-blue-600 h-10 flex-center-all quantum-symmetry">
            <Play className="h-4 w-4 mr-2 flex-center-all" /> Start
          </Button>
          <Button onClick={() => setIsOpen(false)} variant="outline" className="flex-1 h-10 flex-center-all quantum-symmetry">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};