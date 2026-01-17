"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Play, StopCircle as StopCircleIcon, Timer } from "lucide-react";
import { useAlarmTimer } from "@/hooks/useAlarmTimer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TaskTimerButtonProps {
  taskId: string;
  taskTitle: string;
}

// Autoresponsive System - Neuro-Adaptive Sizing
const useAutoresponsive = () => {
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    scale: 1,
    fontSize: 16,
    iconSize: 20,
    buttonHeight: 44,
    inputHeight: 44,
  });

  React.useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      let scale = 1;
      let fontSize = 16;
      let iconSize = 20;
      let buttonHeight = 44;
      let inputHeight = 44;

      if (width < 480) {
        // Mobile
        scale = 0.85;
        fontSize = 14;
        iconSize = 16;
        buttonHeight = 40;
        inputHeight = 40;
      } else if (width < 768) {
        // Tablet
        scale = 0.95;
        fontSize = 15;
        iconSize = 18;
        buttonHeight = 42;
        inputHeight = 42;
      } else if (width < 1024) {
        // Small Desktop
        scale = 1.05;
        fontSize = 16;
        iconSize = 20;
        buttonHeight = 44;
        inputHeight = 44;
      } else if (width < 1440) {
        // Medium Desktop
        scale = 1.1;
        fontSize = 17;
        iconSize = 22;
        buttonHeight = 46;
        inputHeight = 46;
      } else {
        // Large Desktop
        scale = 1.15;
        fontSize = 18;
        iconSize = 24;
        buttonHeight = 48;
        inputHeight = 48;
      }

      setViewport({
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        scale,
        fontSize,
        iconSize,
        buttonHeight,
        inputHeight,
      });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  return viewport;
};

export const TaskTimerButton: React.FC<TaskTimerButtonProps> = ({ taskId, taskTitle }) => {
  const { startTimer, stopTimer, isTimerActive, getTimeForTask } = useAlarmTimer();
  const [duration, setDuration] = useState(25);
  const [isOpen, setIsOpen] = useState(false);
  const { scale, fontSize, iconSize, buttonHeight, inputHeight, isMobile } = useAutoresponsive();

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
        style={{ transform: `scale(${scale})` }}
      >
        <Button
          size="sm"
          variant="destructive"
          onClick={() => stopTimer(taskId)}
          className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 shadow-md shadow-red-500/20 flex-center-all quantum-symmetry"
          style={{ 
            height: `${buttonHeight}px`,
            fontSize: `${fontSize}px`,
            transform: `scale(${scale})`
          }}
        >
          <StopCircleIcon className="flex-center-all" style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
          <span className="font-mono font-bold flex-center-all ml-1" style={{ fontSize: `${fontSize}px` }}>{remainingTime}</span>
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
              height: `${buttonHeight}px`,
              fontSize: `${fontSize}px`,
              transform: `scale(${scale})`
            }}
          >
            <Timer className="flex-center-all" style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
            <span className="ml-1">Timer</span>
          </Button>
        </motion.div>
      </DialogTrigger>
      
      <DialogContent 
        className={cn(
          "rounded-2xl quantum-symmetry flex flex-col items-center justify-center p-0 overflow-hidden",
          isMobile ? "max-w-[95vw] max-h-[90vh]" : "max-w-[480px] max-h-[85vh]"
        )}
        style={{ transform: `scale(${scale})` }}
      >
        {/* PREMIUM HEADER - Glassmorphic Gradient */}
        <div className="relative w-full bg-gradient-to-r from-blue-600/90 via-cyan-600/90 to-teal-600/90 p-6 text-white flex-shrink-0 backdrop-blur-xl border-b border-white/10 flex-center-all">
          <DialogHeader className="relative z-10 flex-center-all">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2 flex-center-all">
              <Clock className="text-white/90 flex-center-all" style={{ width: `${iconSize * 1.2}px`, height: `${iconSize * 1.2}px` }} />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-100">
                Start Timer
              </span>
            </DialogTitle>
            <DialogDescription className="text-cyan-100/80 opacity-90 flex-center-all mt-1">
              Task: <strong className="text-white ml-1">{taskTitle}</strong>
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* PREMIUM SCROLLABLE CONTENT - Glass Card */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative w-full flex-center-all">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none"
               style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)' }}>
          </div>
          
          <div className="relative p-6 space-y-5 w-full flex-center-all">
            {/* Duration Input Section - Perfect Flex Symmetry */}
            <div className="space-y-3 w-full flex-center-all">
              <Label 
                className="text-sm font-bold text-cyan-200 flex items-center gap-2 flex-center-all"
                style={{ fontSize: `${fontSize * 0.9}px` }}
              >
                <Clock className="flex-center-all" style={{ width: `${iconSize * 0.8}px`, height: `${iconSize * 0.8}px` }} />
                Duration (minutes)
              </Label>
              
              <div className="flex items-center gap-3 w-full flex-center-all">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-center-all"
                >
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-xl border-2 border-cyan-400/30 bg-white/10 text-white hover:bg-white/20 flex-center-all"
                    style={{ 
                      height: `${buttonHeight * 0.9}px`,
                      width: `${buttonHeight * 0.9}px`,
                      fontSize: `${fontSize * 1.2}px`
                    }}
                    onClick={() => setDuration(Math.max(1, duration - 1))}
                  >
                    −
                  </Button>
                </motion.div>
                
                <Input
                  type="number"
                  min="1"
                  max="180"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="flex-1 text-center font-bold text-xl border-2 border-cyan-400/30 bg-white/10 text-white placeholder:text-cyan-200/60 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 flex-center-all"
                  style={{ 
                    height: `${inputHeight}px`,
                    fontSize: `${fontSize * 1.5}px`
                  }}
                />
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-center-all"
                >
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-xl border-2 border-cyan-400/30 bg-white/10 text-white hover:bg-white/20 flex-center-all"
                    style={{ 
                      height: `${buttonHeight * 0.9}px`,
                      width: `${buttonHeight * 0.9}px`,
                      fontSize: `${fontSize * 1.2}px`
                    }}
                    onClick={() => setDuration(Math.min(180, duration + 1))}
                  >
                    +
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Quick Presets - Perfect Grid Symmetry */}
            <div className="space-y-2 w-full flex-center-all">
              <Label 
                className="text-sm font-bold text-cyan-200 flex-center-all"
                style={{ fontSize: `${fontSize * 0.9}px` }}
              >
                Quick Presets
              </Label>
              
              <div className="grid grid-cols-3 gap-2 w-full flex-center-all">
                {[5, 25, 45].map((min) => (
                  <motion.div
                    key={min}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-center-all"
                  >
                    <Button
                      onClick={() => setDuration(min)}
                      variant={duration === min ? "default" : "secondary"}
                      className={cn(
                        "w-full rounded-xl font-bold flex-center-all transition-all duration-200",
                        duration === min 
                          ? "bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white shadow-lg shadow-cyan-500/20" 
                          : "bg-white/10 text-white border-2 border-cyan-400/30 hover:bg-white/20"
                      )}
                      style={{ 
                        height: `${buttonHeight}px`,
                        fontSize: `${fontSize}px`
                      }}
                    >
                      {min} min
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Action Buttons - Perfect Flex Symmetry */}
            <div className="flex gap-2 w-full flex-center-all pt-2">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex-center-all"
              >
                <Button 
                  onClick={handleStart} 
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold flex-center-all shadow-lg shadow-green-500/20 border-2 border-green-400/30"
                  style={{ 
                    height: `${buttonHeight * 1.2}px`,
                    fontSize: `${fontSize * 1.1}px`
                  }}
                >
                  <Play className="flex-center-all mr-2" style={{ width: `${iconSize}px`, height: `${iconSize}px` }} /> 
                  Start
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex-center-all"
              >
                <Button 
                  onClick={() => setIsOpen(false)} 
                  variant="outline"
                  className="w-full rounded-xl font-bold border-2 border-white/20 bg-white/10 text-white hover:bg-white/20 flex-center-all"
                  style={{ 
                    height: `${buttonHeight * 1.2}px`,
                    fontSize: `${fontSize * 1.1}px`
                  }}
                >
                  Cancel
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};