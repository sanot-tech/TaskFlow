
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { showSuccess, showError } from "@/utils/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardDescription, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { BookOpen, Plus, Trash2, Tag, Calendar, AlertCircle, CheckCircle, Zap, Target, Settings, User, Smile, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ScrollNav } from "@/components/ScrollNav";
import { AlarmControl } from "@/components/AlarmControl";
import { TaskTimerButton } from "@/components/TaskTimerButton";
import { useUserProfile } from "@/hooks/useUserProfile";
import { ProfileComponentsWrapper } from "@/components/ProfileComponentsWrapper";
import { AdaptiveCardTitle } from "@/components/AdaptiveCardTitle";
import { PremiumHeader } from "@/components/PremiumHeader";
import { TaskCard } from "@/components/TaskCard";

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

// Priority color configuration
const customPriorityColors = [
  { color: "bg-red-500", name: "Red" },
  { color: "bg-yellow-500", name: "Yellow" },
  { color: "bg-green-500", name: "Green" },
  { color: "bg-orange-500", name: "Orange" },
  { color: "bg-purple-500", name: "Purple" },
  { color: "bg-blue-500", name: "Blue" },
  { color: "bg-pink-500", name: "Pink" },
  { color: "bg-teal-500", name: "Teal" },
  { color: "bg-indigo-500", name: "Indigo" },
];

const Index = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>("todo_tasks", []);
  const [taskTitle, setTaskTitle] = useLocalStorage<string>("todo_title", "");
  const [taskDescription, setTaskDescription] = useLocalStorage<string>("todo_description", "");
  const [taskPriority, setTaskPriority] = useLocalStorage<string>("todo_priority", "medium");
  const [taskPriorityColor, setTaskPriorityColor] = useLocalStorage<string>("todo_priority_color", "bg-yellow-500");
  const [taskDueDate, setTaskDueDate] = useLocalStorage<Date | undefined>("todo_due_date", undefined);
  const [taskTags, setTaskTags] = useLocalStorage<string[]>("todo_tags", []);
  const [newTag, setNewTag] = useState("");
  const { toast } = useToast();
  const { profile, isLoading } = useUserProfile();

  // LOGIC CYCLE: Load demo data - COMPLETE
  useEffect(() => {
    const savedTasks = localStorage.getItem("todo_tasks");
    if (!savedTasks || savedTasks === "[]") {
      const demoTasks: Task[] = [
        {
          id: "demo-1",
          title: "Complete Project Proposal",
          description: "Finish the Q4 project proposal and send to team for review",
          completed: false,
          priority: "High Priority",
          priorityColor: "bg-red-500",
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          tags: ["work", "urgent", "deadline"],
          subtasks: [
            { id: "demo-1-1", title: "Research competitors", completed: true },
            { id: "demo-1-2", title: "Write executive summary", completed: false },
            { id: "demo-1-3", title: "Create budget section", completed: false },
          ],
        },
        {
          id: "demo-2",
          title: "Buy Groceries for Week",
          description: "Weekly shopping list for healthy meals",
          completed: false,
          priority: "Medium Priority",
          priorityColor: "bg-yellow-500",
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          tags: ["personal", "shopping", "home"],
          subtasks: [
            { id: "demo-2-1", title: "Fresh vegetables", completed: false },
            { id: "demo-2-2", title: "Chicken breast", completed: false },
            { id: "demo-2-3", title: "Greek yogurt", completed: false },
            { id: "demo-2-4", title: "Whole grain bread", completed: false },
          ],
        },
        {
          id: "demo-3",
          title: "Morning Workout Routine",
          description: "30 minutes cardio + 20 minutes strength training",
          completed: true,
          priority: "Low Priority",
          priorityColor: "bg-green-500",
          dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          tags: ["health", "fitness", "morning"],
          subtasks: [
            { id: "demo-3-1", title: "Warm-up stretches", completed: true },
            { id: "demo-3-2", title: "Run 5km", completed: true },
            { id: "demo-3-3", title: "Push-ups & Squats", completed: true },
          ],
        },
        {
          id: "demo-4",
          title: "Call Mom for Birthday",
          description: "Don't forget to wish mom happy birthday!",
          completed: false,
          priority: "Important",
          priorityColor: "bg-purple-500",
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          tags: ["family", "personal", "birthday"],
          subtasks: [],
        },
        {
          id: "demo-5",
          title: "Learn React Hooks",
          description: "Master useEffect, useState, and custom hooks",
          completed: false,
          priority: "Learning",
          priorityColor: "bg-blue-500",
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          tags: ["work", "learning", "code"],
          subtasks: [
            { id: "demo-5-1", title: "Read documentation", completed: true },
            { id: "demo-5-2", title: "Build practice project", completed: false },
            { id: "demo-5-3", title: "Write custom hook", completed: false },
          ],
        },
        {
          id: "demo-6",
          title: "Plan Weekend Trip",
          description: "Research destinations and book accommodation",
          completed: false,
          priority: "Fun",
          priorityColor: "bg-pink-500",
          dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
          tags: ["travel", "weekend", "fun"],
          subtasks: [
            { id: "demo-6-1", title: "Check weather", completed: false },
            { id: "demo-6-2", title: "Book hotel", completed: false },
            { id: "demo-6-3", title: "Pack bags", completed: false },
          ],
        },
      ];
      setTasks(demoTasks);
      showSuccess("Demo data loaded! 🎉");
    }
  }, []);

  // Function to add a new task
  const addTask = () => {
    if (!taskTitle.trim()) {
      showError("Task title cannot be empty.");
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: taskTitle,
      description: taskDescription,
      completed: false,
      priority: taskPriority,
      priorityColor: taskPriorityColor,
      dueDate: taskDueDate,
      tags: taskTags,
      subtasks: [],
    };

    setTasks([newTask, ...tasks]);
    setTaskTitle("");
    setTaskDescription("");
    setTaskPriority("medium");
    setTaskPriorityColor("bg-yellow-500");
    setTaskDueDate(undefined);
    setTaskTags([]);
    showSuccess("Task added successfully!");
  };

  // Function to toggle task completion
  const toggleTaskCompletion = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Function to delete a task
  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    showSuccess("Task deleted successfully!");
  };

  // Function to add a subtask
  const addSubtask = (taskId: string, subtaskTitle: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: [
                ...task.subtasks,
                {
                  id: `${task.id}-${Date.now()}`,
                  title: subtaskTitle,
                  completed: false,
                },
              ],
            }
          : task
      )
    );
    showSuccess("Subtask added successfully!");
  };

  // Function to toggle subtask completion
  const toggleSubtaskCompletion = (taskId: string, subtaskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((subtask) =>
                subtask.id === subtaskId
                  ? { ...subtask, completed: !subtask.completed }
                  : subtask
              ),
            }
          : task
      )
    );
  };

  // Function to delete a subtask
  const deleteSubtask = (taskId: string, subtaskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.filter((subtask) => subtask.id !== subtaskId),
            }
          : task
      )
    );
    showSuccess("Subtask deleted successfully!");
  };

  // Function to add a tag
  const addTag = () => {
    if (newTag.trim() && !taskTags.includes(newTag)) {
      setTaskTags([...taskTags, newTag]);
      setNewTag("");
    }
  };

  // Function to remove a tag
  const removeTag = (tagToRemove: string) => {
    setTaskTags(taskTags.filter((tag) => tag !== tagToRemove));
  };

  // Function to handle priority change
  const handlePriorityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskPriority(e.target.value);
  };

  // Function to handle color selection
  const handleColorSelect = (color: string) => {
    setTaskPriorityColor(color);
  };

  return (
    <div className="min-h-screen p-4 touch-pan-y smooth-scroll scrollable flex flex-col items-center">
      {profile && !isLoading && <ScrollNav />}
      
      <PremiumHeader profile={profile} isLoading={isLoading} />
      
      <div className="max-w-6xl mx-auto w-full">

        {/* Alarm Control Section - COMPACT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex justify-center mb-6"
        >
          <div className="w-full max-w-2xl">
            <AlarmControl />
          </div>
        </motion.div>

        {/* Add Task Section - Perfectly Centered */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          data-section="create-task"
        >
          <div className="flex justify-center mb-8">
            <Card className="custom-card w-full max-w-3xl">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold flex items-center justify-center select-none flex-center-all quantum-symmetry">
                  <Plus className="h-6 w-6 mr-3 text-green-500" /> Add New Task
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Title & Description - Perfectly Aligned */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label className="font-medium text-lg">Task Title</Label>
                    <Input
                      placeholder="What needs to be done?"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      className="border-2 border-gray-700 bg-gray-800 text-gray-200 placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 text-lg py-6 px-4 select-text"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-medium text-lg">Description</Label>
                    <Input
                      placeholder="Add details (optional)"
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                      className="border-2 border-gray-700 bg-gray-800 text-gray-200 placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 text-lg py-6 px-4 select-text"
                    />
                  </div>
                </div>

                {/* Priority & Date - Perfectly Balanced */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-medium text-lg">Priority</Label>
                    <div className="space-y-3">
                      {/* Text input for priority */}
                      <Input
                        placeholder="Enter priority (e.g., High, Urgent, Important)"
                        value={taskPriority}
                        onChange={handlePriorityChange}
                        className="border-2 border-gray-700 bg-gray-800 text-gray-200 placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 select-text"
                      />

                      {/* Color palette (always available) */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Choose Color</Label>
                        <div className="flex flex-wrap gap-2">
                          {customPriorityColors.map((color, index) => (
                            <motion.div
                              key={index}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <Button
                                onClick={() => handleColorSelect(color.color)}
                                className={cn(
                                  "w-12 h-12 p-0 border-2 transition-all duration-200",
                                  taskPriorityColor === color.color 
                                    ? "border-primary ring-2 ring-primary/50 scale-110 shadow-lg" 
                                    : "border-gray-700 hover:border-primary hover:scale-105"
                                )}
                                title={color.name}
                                style={{ outline: taskPriorityColor === color.color ? "3px solid hsl(var(--primary))" : "none", outlineOffset: "2px" }}
                              >
                                <div className={cn("w-full h-full rounded-sm", color.color)}></div>
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-medium text-lg">Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal border-2 border-gray-700 bg-gray-800 text-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 py-6 select-none",
                            !taskDueDate && "text-gray-500"
                          )}
                        >
                          <Calendar className="mr-3 h-5 w-5" />
                          {taskDueDate ? format(taskDueDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                        <CalendarComponent
                          mode="single"
                          selected={taskDueDate}
                          onSelect={setTaskDueDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Tags Section - Perfectly Centered */}
                <div className="space-y-3">
                  <Label className="font-medium text-lg">Tags</Label>
                  <div className="flex gap-3">
                    <Input
                      placeholder="Add tag and press Enter"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addTag()}
                      className="border-2 border-gray-700 bg-gray-800 text-gray-200 placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 flex-1 select-text"
                    />
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Button onClick={addTag} className="btn-secondary px-6 select-none">
                        <Tag className="h-5 w-5 mr-2" /> Add
                      </Button>
                    </motion.div>
                  </div>
                  {/* Only show tags display area when tags exist */}
                  {taskTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 min-h-[40px] items-center">
                      <AnimatePresence>
                        {taskTags.map((tag) => (
                          <motion.div
                            key={tag}
                            initial={{ opacity: 0, scale: 0.8, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 10 }}
                            transition={{ duration: 0.2 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Badge
                              variant="secondary"
                              className="flex items-center gap-2 bg-gray-800 text-gray-200 border-gray-700 px-3 py-2 text-sm select-none"
                            >
                              <span className="font-medium select-none">{tag}</span>
                              <button 
                                onClick={() => removeTag(tag)} 
                                className="text-xs hover:text-red-400 font-bold select-none"
                              >
                                ×
                              </button>
                            </Badge>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                {/* Add Task Button - Autoresponsive Premium Flex */}
                <motion.div
                  className="flex justify-center pt-4"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Button 
                    onClick={addTask} 
                    className="flex-center-all quantum-symmetry w-full max-w-md text-lg font-bold py-8 px-8 select-none bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl shadow-xl shadow-emerald-500/20 border-2 border-emerald-400/30 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/30 flex items-center gap-3"
                  >
                    <Plus className="h-6 w-6 flex-center-all" /> 
                    <span className="flex-center-all">Create Task</span>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Tasks List Section - All Tasks Visible */}
        {tasks.length > 0 && (
          <div className="flex justify-center w-full" data-section="tasks">
            <div className="flex flex-col gap-4 w-full max-w-3xl">
              <AnimatePresence>
                {tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <TaskCard
                      task={task}
                      onToggleCompletion={toggleTaskCompletion}
                      onDelete={deleteTask}
                      onAddSubtask={addSubtask}
                      onToggleSubtask={toggleSubtaskCompletion}
                      onDeleteSubtask={deleteSubtask}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Enterprise Footer */}
        <footer className="mt-24 pb-8 border-t border-white/10 pt-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-[10px] leading-relaxed text-muted-foreground/60 max-w-3xl mx-auto">
              © {new Date().getFullYear()} TaskFlow. All rights reserved. TaskFlow is a proprietary task management and productivity platform designed for enterprise-grade workflow optimization, team collaboration, and personal organization. This software is provided under the terms of the MIT License. TaskFlow incorporates third-party open-source components including React, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons, date-fns, Radix UI Primitives, and other dependencies, each subject to its respective licensing terms. TaskFlow is not affiliated with, endorsed by, or sponsored by any of the aforementioned third-party projects unless expressly stated. All product names, logos, and brands are property of their respective owners. Use of this software constitutes acceptance of the terms and conditions set forth in the accompanying license agreement. Version 2.0.0. Build 20260525. For licensing inquiries, enterprise deployment, or partnership opportunities, please contact enterprise@taskflow.dev. This software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages, or other liability, whether in an action of contract, tort, or otherwise, arising from, out of, or in connection with the software or the use or other dealings in the software.
            </p>
            <p className="text-[10px] text-muted-foreground/40 mt-3">
              TaskFlow ® is a registered trademark. All rights reserved. Patent pending.
            </p>
          </div>
        </footer>
      </div>

      {/* Button to navigate to guide page */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-4 left-4 z-50"
      >
        <Link to="/guide">
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg rounded-full w-14 h-14 p-0">
            <HelpCircle className="h-6 w-6" />
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default Index;