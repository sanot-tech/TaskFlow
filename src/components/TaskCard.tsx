"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardDescription, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Trash2, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  Plus, 
  Clock,
  MoreHorizontal,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { format } from "date-fns";
import { TaskTimerButton } from "./TaskTimerButton";

// Task interface definition
interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: string;
  priorityColor: string;
  dueDate?: Date;
  tags: string[];
  subtasks: Subtask[];
}

// Subtask interface definition
interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

// TaskCard component props interface
interface TaskCardProps {
  task: Task;
  onToggleCompletion: (id: string) => void;
  onDelete: (id: string) => void;
  onAddSubtask: (id: string, title: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
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
  });

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      let scale = 1;
      if (width < 480) scale = 0.85; // Mobile
      else if (width < 768) scale = 0.95; // Tablet
      else if (width < 1024) scale = 1.05; // Small Desktop
      else if (width < 1440) scale = 1.1; // Medium Desktop
      else scale = 1.15; // Large Desktop

      setViewport({
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        scale,
      });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  return viewport;
};

// Premium Checkbox Component
const PremiumCheckbox = ({ 
  checked, 
  onChange, 
  size = "default" 
}: { 
  checked: boolean; 
  onChange: (checked: boolean) => void; 
  size?: "sm" | "default" | "lg";
}) => {
  const { scale } = useAutoresponsive();
  
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.15 * scale }}
      whileTap={{ scale: 0.9 * scale }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className="flex-center-all"
    >
      <Checkbox
        checked={checked}
        onCheckedChange={onChange}
        className={cn(
          "border-2 rounded-md transition-all duration-200 flex-center-all",
          sizeClasses[size],
          checked 
            ? "bg-gradient-to-br from-emerald-400 to-teal-500 border-emerald-500 shadow-lg shadow-emerald-500/30" 
            : "bg-gray-800 border-gray-600 hover:border-emerald-400"
        )}
      />
    </motion.div>
  );
};

// Premium Card Header Component
const PremiumCardHeader = ({ 
  task, 
  onToggleCompletion, 
  onDelete,
  onExpand,
  isExpanded
}: {
  task: Task;
  onToggleCompletion: (id: string) => void;
  onDelete: (id: string) => void;
  onExpand: () => void;
  isExpanded: boolean;
}) => {
  const { scale, isMobile } = useAutoresponsive();
  
  return (
    <div className={cn(
      "flex items-center gap-3 p-4 border-b border-gray-700/50",
      isMobile ? "flex-col items-start" : "flex-row"
    )}>
      {/* Checkbox + Title Section - Perfect Flex Symmetry */}
      <div className={cn(
        "flex items-center gap-3 flex-1",
        isMobile ? "w-full" : ""
      )}>
        <PremiumCheckbox 
          checked={task.completed} 
          onChange={() => onToggleCompletion(task.id)}
          size={isMobile ? "lg" : "default"}
        />
        
        <div className="flex-1 min-w-0">
          <motion.div
            initial={false}
            animate={{ 
              opacity: task.completed ? 0.6 : 1,
              scale: task.completed ? 0.98 : 1
            }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <h3 className={cn(
              "font-bold text-lg leading-tight truncate",
              task.completed && "line-through text-gray-500"
            )}>
              {task.title}
            </h3>
            
            {/* Expand/Collapse Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onExpand}
              className="p-1 rounded-full hover:bg-gray-700/50 flex-center-all"
            >
              {isExpanded ? 
                <ChevronUp className="h-4 w-4 text-gray-400" /> : 
                <ChevronDown className="h-4 w-4 text-gray-400" />
              }
            </motion.button>
          </motion.div>
          
          {task.description && (
            <CardDescription className="text-sm text-gray-400 mt-1 line-clamp-2">
              {task.description}
            </CardDescription>
          )}
        </div>
      </div>

      {/* Actions Section - Perfect Flex Symmetry */}
      <div className={cn(
        "flex items-center gap-2",
        isMobile ? "w-full justify-between mt-2" : ""
      )}>
        {/* Priority Badge */}
        <Badge 
          className={cn(
            "px-2 py-1 text-xs font-bold flex items-center gap-1",
            task.priorityColor,
            "text-white"
          )}
        >
          <AlertCircle className="h-3 w-3" />
          {task.priority}
        </Badge>

        {/* Delete Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.id)}
            className="text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

// Premium Task Details Component
const PremiumTaskDetails = ({ 
  task, 
  onAddSubtask, 
  onToggleSubtask, 
  onDeleteSubtask,
  newSubtask,
  setNewSubtask
}: {
  task: Task;
  onAddSubtask: (id: string, title: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
  newSubtask: string;
  setNewSubtask: (value: string) => void;
}) => {
  const { scale, isMobile } = useAutoresponsive();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      onAddSubtask(task.id, newSubtask);
      setNewSubtask("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddSubtask();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="p-4 space-y-4">
        {/* Meta Info Row - Perfect Flex Symmetry */}
        <div className={cn(
          "flex flex-wrap items-center gap-4",
          isMobile ? "flex-col items-start" : "flex-row"
        )}>
          {task.dueDate && (
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Calendar className="h-4 w-4 text-blue-400" />
              <span className="font-medium">{format(task.dueDate, "PPP")}</span>
            </div>
          )}
          
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="text-xs px-2 py-0.5 bg-gray-800 border-gray-700 text-gray-300"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Subtasks Section */}
        {task.subtasks.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-300">
              <CheckCircle className="h-4 w-4 text-blue-400" />
              <span>Subtasks ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})</span>
            </div>
            
            <div className="space-y-1 ml-6">
              <AnimatePresence>
                {task.subtasks.map((subtask) => (
                  <motion.div
                    key={subtask.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-2 group"
                  >
                    <PremiumCheckbox
                      checked={subtask.completed}
                      onChange={() => onToggleSubtask(task.id, subtask.id)}
                      size="sm"
                    />
                    <span
                      className={cn(
                        "text-sm flex-1",
                        subtask.completed && "line-through text-gray-500"
                      )}
                    >
                      {subtask.title}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onDeleteSubtask(task.id, subtask.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-300 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Add Subtask Input */}
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            placeholder="Add subtask..."
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 border-2 border-gray-700 bg-gray-800 text-gray-200 placeholder:text-gray-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-900/30"
          />
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={handleAddSubtask}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        {/* Timer Section */}
        <div className="pt-3 border-t border-gray-700">
          <TaskTimerButton taskId={task.id} taskTitle={task.title} />
        </div>
      </div>
    </motion.div>
  );
};

// Main TaskCard Component
export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleCompletion,
  onDelete,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");
  const { scale, isMobile } = useAutoresponsive();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -50, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="w-full"
    >
      <Card className={cn(
        "border-2 rounded-2xl overflow-hidden transition-all duration-300",
        task.subtasks.length > 0 
          ? "border-blue-900/50 bg-gradient-to-br from-gray-900 to-gray-800/50" 
          : "border-gray-700/50 bg-gray-900",
        "hover:shadow-xl hover:shadow-gray-900/50 hover:border-gray-600/50",
        "backdrop-blur-sm"
      )}>
        <PremiumCardHeader
          task={task}
          onToggleCompletion={onToggleCompletion}
          onDelete={onDelete}
          onExpand={() => setIsExpanded(!isExpanded)}
          isExpanded={isExpanded}
        />
        
        {isExpanded && (
          <PremiumTaskDetails
            task={task}
            onAddSubtask={onAddSubtask}
            onToggleSubtask={onToggleSubtask}
            onDeleteSubtask={onDeleteSubtask}
            newSubtask={newSubtask}
            setNewSubtask={setNewSubtask}
          />
        )}
      </Card>
    </motion.div>
  );
};