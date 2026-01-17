"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Play, StopCircle as StopCircleIcon, Timer } from "lucide-react";
import { useAlarmTimer } from "@/hooks/useAlarmTimer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { AdaptiveDialog } from "./AdaptiveDialog";

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
        className="flex-center-all quantum-symmetry"
      >
        <Button
          size="sm"
          variant="destructive"
          onClick={() => stopTimer(taskId)}
          className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 shadow-md shadow-red-500/20 flex-center-all quantum-symmetry neuro-button"
        >
          <StopCircleIcon className="neuro-icon flex-center-all" />
          <span className="font-mono font-bold flex-center-all neuro-text">{remainingTime}</span>
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
            className="px-3 py-1.5 rounded-lg border-blue-400/30 text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-all flex-center-all quantum-symmetry neuro-button"
          >
            <Timer className="neuro-icon flex-center-all" /> 
            <span className="neuro-text">Timer</span>
          </Button>
        </motion.div>
      </DialogTrigger>
      
      <AdaptiveDialog baseWidth={360}>
        <div className="auto-flex-dialog w-full">
          {/* Header - Perfect Flex Symmetry */}
          <div className="symmetry-header">
            <DialogTitle className="flex items-center gap-2 text-lg flex-center-all neuro-text">
              <Clock className="neuro-icon text-blue-500 flex-center-all" />
              <span className="font-bold">Start Timer</span>
            </DialogTitle>
          </div>
          
          {/* Description */}
          <DialogDescription className="text-sm flex-center-all adaptive-padding neuro-text">
            Task: <strong className="text-gray-900 ml-1 font-semibold">{taskTitle}</strong>
          </DialogDescription>
          
          {/* Content - Auto-Responsive */}
          <div className="adaptive-content adaptive-padding auto-item flex-col">
            <div className="auto-item flex-col w-full">
              <Label className="neuro-text font-medium">Duration (minutes)</Label>
              <Input
                type="number"
                min="1"
                max="180"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="h-10 text-center text-lg font-bold quantum-symmetry"
              />
            </div>
            
            {/* Quick Select Grid - Auto-Responsive */}
            <div className="adaptive-grid auto-item w-full mt-3">
              {[5, 25, 45].map((min) => (
                <Button
                  key={min}
                  onClick={() => setDuration(min)}
                  variant={duration === min ? "default" : "secondary"}
                  className="neuro-button font-medium"
                >
                  {min}m
                </Button>
              ))}
            </div>
          </div>
          
          {/* Actions - Perfect Flex Symmetry */}
          <div className="auto-item w-full adaptive-padding border-t border-gray-200/20">
            <Button 
              onClick={handleStart} 
              className="flex-1 bg-blue-500 hover:bg-blue-600 h-10 neuro-button font-semibold"
            >
              <Play className="neuro-icon flex-center-all" /> 
              <span className="neuro-text">Start</span>
            </Button>
            <Button 
              onClick={() => setIsOpen(false)} 
              variant="outline" 
              className="flex-1 h-10 neuro-button"
            >
              Cancel
            </Button>
          </div>
        </div>
      </AdaptiveDialog>
    </Dialog>
  );
};