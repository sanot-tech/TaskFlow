"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Play, StopCircle as StopCircleIcon, Timer } from "lucide-react";
import { useAlarmTimer } from "@/hooks/useAlarmTimer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { showError } from "@/utils/toast";

// TaskTimerButton component props interface
interface TaskTimerButtonProps {
  taskId: string;
  taskTitle: string;
}

// Autoresponsive Neuro-Adaptive Sizing Hook
const useNeuroAdaptiveSizing = () => {
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
    scale: 1,
    iconSize: 20,
    textSize: 16,
    padding: 16,
    gap: 8,
  });

  React.useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Neuro-adaptive scaling algorithm
      let scale = 1;
      let iconSize = 20;
      let textSize = 16;
      let padding = 16;
      let gap = 8;

      if (width < 480) {
        // Mobile
        scale = 0.85;
        iconSize = 16;
        textSize = 14;
        padding = 12;
        gap = 6;
      } else if (width < 768) {
        // Tablet
        scale = 0.95;
        iconSize = 18;
        textSize = 15;
        padding = 14;
        gap = 7;
      } else if (width < 1024) {
        // Small Desktop
        scale = 1.05;
        iconSize = 20;
        textSize = 16;
        padding = 16;
        gap = 8;
      } else if (width < 1440) {
        // Medium Desktop
        scale = 1.1;
        iconSize = 22;
        textSize = 17;
        padding = 18;
        gap = 9;
      } else {
        // Large Desktop
        scale = 1.15;
        iconSize = 24;
        textSize = 18;
        padding = 20;
        gap = 10;
      }

      setViewport({
        width,
        height,
        scale,
        iconSize,
        textSize,
        padding,
        gap,
      });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  return viewport;
};

// TaskTimerButton Component
export const TaskTimerButton: React.FC<TaskTimerButtonProps> = ({ taskId, taskTitle }) => {
  const { startTimer, stopTimer, isTimerActive, getTimeForTask, isAlarmEnabled } = useAlarmTimer();
  const [duration, setDuration] = useState(25);
  const [isOpen, setIsOpen] = useState(false);
  const { scale, iconSize, textSize, padding, gap } = useNeuroAdaptiveSizing();

  const handleStart = () => {
    if (duration > 0) {
      // Check if alarm system is enabled before starting
      if (!isAlarmEnabled) {
        showError("Please enable the alarm system first!");
        return;
      }
      
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
        style={{ transform: `scale(${scale})` }}
      >
        <Button
          size="sm"
          variant="destructive"
          onClick={() => stopTimer(taskId)}
          className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 shadow-md shadow-red-500/20 flex-center-all quantum-symmetry"
          style={{ 
            fontSize: `${textSize}px`,
            padding: `${padding / 2}px ${padding}px`,
            gap: `${gap}px`
          }}
        >
          <StopCircleIcon 
            className="flex-center-all" 
            style={{ width: `${iconSize}px`, height: `${iconSize}px` }} 
          />
          <span className="font-mono font-bold flex-center-all">{remainingTime}</span>
        </Button>
      </motion.div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.02 * scale }}
          whileTap={{ scale: 0.98 * scale }}
          className="flex-center-all"
          style={{ transform: `scale(${scale})` }}
        >
          <Button
            size="sm"
            variant="outline"
            className="px-3 py-1.5 rounded-lg border-blue-400/30 text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-all flex-center-all quantum-symmetry"
            style={{ 
              fontSize: `${textSize}px`,
              padding: `${padding / 2}px ${padding}px`,
              gap: `${gap}px`
            }}
          >
            <Timer 
              className="flex-center-all" 
              style={{ width: `${iconSize}px`, height: `${iconSize}px` }} 
            /> 
            <span className="flex-center-all">Timer</span>
          </Button>
        </motion.div>
      </DialogTrigger>
      
      {/* NEW AUTORESPONSIVE DIALOG CONTENT - FLEX CONCEPTION PREMIUM */}
      {/* Fixed: Added overlay and centered positioning */}
      <DialogContent 
        className={cn(
          "rounded-2xl quantum-symmetry flex-center-all",
          "max-w-[90vw] sm:max-w-[85vw] md:max-w-[70vw] lg:max-w-[600px] xl:max-w-[700px]",
          "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        )}
        style={{ 
          transform: `translate(-50%, -50%) scale(${scale})`,
          padding: `${padding * 1.5}px`,
          gap: `${gap * 1.5}px`
        }}
      >
        {/* Neuro-Adaptive Header */}
        <DialogHeader className="flex-center-all w-full">
          <DialogTitle 
            className="flex items-center gap-2 flex-center-all font-bold text-white"
            style={{ fontSize: `${textSize * 1.5}px` }}
          >
            <Clock 
              className="text-white flex-center-all" 
              style={{ width: `${iconSize * 1.2}px`, height: `${iconSize * 1.2}px` }} 
            />
            <span className="flex-center-all text-white">Start Timer</span>
          </DialogTitle>
          <DialogDescription 
            className="text-sm flex-center-all text-gray-300"
            style={{ fontSize: `${textSize}px` }}
          >
            Task: <strong className="text-white flex-center-all ml-1">{taskTitle}</strong>
          </DialogDescription>
        </DialogHeader>
        
        {/* Neuro-Adaptive Content */}
        <div 
          className="space-y-4 py-4 flex-center-all w-full"
          style={{ gap: `${gap * 1.5}px`, padding: `${padding}px` }}
        >
          <div className="space-y-2 flex-center-all w-full">
            <Label 
              className="text-sm font-medium flex-center-all text-gray-300"
              style={{ fontSize: `${textSize}px` }}
            >
              Duration (minutes)
            </Label>
            <Input
              type="number"
              min="1"
              max="180"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="h-10 flex-center-all quantum-symmetry w-full text-white"
              style={{ 
                fontSize: `${textSize}px`,
                padding: `${padding / 2}px ${padding}px`
              }}
            />
          </div>
          
          <div 
            className="grid grid-cols-3 gap-2 flex-center-all w-full"
            style={{ gap: `${gap}px` }}
          >
            {[5, 25, 45].map((min) => (
              <Button
                key={min}
                onClick={() => setDuration(min)}
                variant={duration === min ? "default" : "secondary"}
                className="h-9 flex-center-all quantum-symmetry"
                style={{ 
                  fontSize: `${textSize}px`,
                  padding: `${padding / 2}px ${padding}px`,
                  gap: `${gap}px`
                }}
              >
                {min} min
              </Button>
            ))}
          </div>
        </div>
        
        {/* Neuro-Adaptive Actions */}
        <div 
          className="flex gap-2 flex-center-all w-full"
          style={{ gap: `${gap}px` }}
        >
          <Button 
            onClick={handleStart} 
            className="flex-1 bg-blue-500 hover:bg-blue-600 h-10 flex-center-all quantum-symmetry text-white"
            style={{ 
              fontSize: `${textSize}px`,
              padding: `${padding / 2}px ${padding}px`,
              gap: `${gap}px`
            }}
          >
            <Play 
              className="flex-center-all" 
              style={{ width: `${iconSize}px`, height: `${iconSize}px` }} 
            /> 
            <span className="flex-center-all">Start</span>
          </Button>
          <Button 
            onClick={() => setIsOpen(false)} 
            variant="outline" 
            className="flex-1 h-10 flex-center-all quantum-symmetry text-gray-300"
            style={{ 
              fontSize: `${textSize}px`,
              padding: `${padding / 2}px ${padding}px`,
              gap: `${gap}px`
            }}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};