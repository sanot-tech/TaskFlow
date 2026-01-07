import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { showSuccess, showError } from "@/utils/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { BookOpen, Plus, Trash2, Tag, Calendar, AlertCircle, CheckCircle, Layout, Zap, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import WebFont from "webfontloader";
import { motion, AnimatePresence } from "framer-motion";

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

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

const standardPriorities = [
  { name: "High", color: "bg-red-500", value: "high" },
  { name: "Medium", color: "bg-yellow-500", value: "medium" },
  { name: "Low", color: "bg-green-500", value: "low" },
];

const customPriorityColors = [
  { color: "bg-red-500" },
  { color: "bg-yellow-500" },
  { color: "bg-green-500" },
  { color: "bg-orange-500" },
  { color: "bg-purple-500" },
  { color: "bg-blue-500" },
];

const fontList = [
  "Poppins", "Montserrat", "Open Sans", "Lato", "Roboto", 
  "Source Sans Pro", "Nunito", "Raleway", "Quicksand", "Work Sans",
  "Rubik", "Muli", "Fira Sans", "Ubuntu", "Merriweather Sans",
  "Cabin", "Oxygen", "PT Sans", "Dosis", "Karla",
  "Asap", "Cantarell", "Exo", "Varela Round", "Titillium Web",
  "Signika", "Yanone Kaffeesatz", "Abel", "Anton", "Arimo",
  "Bitter", "Cairo", "Catamaran", "Droid Sans", "Encode Sans",
  "Francois One", "Hind", "Josefin Sans", "Kanit", "Maven Pro",
  "Noto Sans", "Orbitron", "Oswald", "Play", "Prompt",
  "Questrial", "Rajdhani", "Sora", "Telex", "Zilla Slab"
];

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState("medium");
  const [taskPriorityColor, setTaskPriorityColor] = useState("bg-yellow-500");
  const [customPriority, setCustomPriority] = useState("");
  const [taskDueDate, setTaskDueDate] = useState<Date | undefined>(undefined);
  const [taskTags, setTaskTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [letterFonts, setLetterFonts] = useState<string[]>([]);
  const [newSubtask, setNewSubtask] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

  useEffect(() => {
    const initialFonts = "TodoList".split("").map(() => 
      fontList[Math.floor(Math.random() * fontList.length)]
    );
    setLetterFonts(initialFonts);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLetterFonts("TodoList".split("").map(() => 
        fontList[Math.floor(Math.random() * fontList.length)]
      ));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    WebFont.load({
      google: {
        families: fontList
      }
    });
  }, []);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const mockTasks: Task[] = [
          {
            id: "1",
            title: "Complete Project",
            description: "Finish the React Native project with all required features",
            completed: false,
            priority: "high",
            priorityColor: "bg-red-500",
            dueDate: new Date("2025-12-31"),
            tags: ["work", "urgent"],
            subtasks: [
              { id: "1-1", title: "Design UI", completed: false },
              { id: "1-2", title: "Implement API", completed: false },
              { id: "1-3", title: "Write documentation", completed: false },
            ],
          },
          {
            id: "2",
            title: "Buy Groceries",
            description: "Milk, eggs, bread, fruits and vegetables",
            completed: false,
            priority: "medium",
            priorityColor: "bg-yellow-500",
            tags: ["personal", "shopping"],
            subtasks: [],
          },
          {
            id: "3",
            title: "Exercise",
            description: "30 minutes of cardio and strength training",
            completed: false,
            priority: "low",
            priorityColor: "bg-green-500",
            tags: ["health", "fitness"],
            subtasks: [],
          },
        ];
        setTasks(mockTasks);
        showSuccess("Tasks loaded successfully!");
      } catch (error) {
        showError("Failed to load tasks.");
      }
    };
    loadTasks();
  }, []);

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
      priority: customPriority || taskPriority,
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
    setCustomPriority("");
    setTaskDueDate(undefined);
    setTaskTags([]);
    showSuccess("Task added successfully!");
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    showSuccess("Task deleted successfully!");
  };

  const addSubtask = (taskId: string) => {
    const subtaskTitle = newSubtask[taskId];
    if (!subtaskTitle?.trim()) {
      showError("Subtask title cannot be empty.");
      return;
    }

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
    
    setNewSubtask(prev => ({ ...prev, [taskId]: "" }));
    showSuccess("Subtask added successfully!");
  };

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

  const addTag = () => {
    if (newTag.trim() && !taskTags.includes(newTag)) {
      setTaskTags([...taskTags, newTag]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTaskTags(taskTags.filter((tag) => tag !== tagToRemove));
  };

  const handleStandardPrioritySelect = (priority: string, color: string) => {
    setTaskPriority(priority);
    setTaskPriorityColor(color);
    setCustomPriority("");
  };

  const handleCustomPriorityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomPriority(value);
    if (value.trim()) {
      setTaskPriority(value);
    } else {
      setTaskPriority("medium");
      setTaskPriorityColor("bg-yellow-500");
    }
  };

  const handleCustomColorSelect = (color: string) => {
    setTaskPriorityColor(color);
    setShowColorPicker(false);
  };

  const handleNewSubtaskChange = (taskId: string, value: string) => {
    setNewSubtask(prev => ({ ...prev, [taskId]: value }));
  };

  const handleAddSubtaskKeyPress = (taskId: string, e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addSubtask(taskId);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section - Perfectly Centered */}
        <div className="flex justify-center items-center mb-12">
          <div className="flex items-center space-x-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            >
              <h1 className="text-4xl font-bold text-primary flex items-center space-x-2">
                <motion.span
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                >
                  <Zap className="h-8 w-8 text-yellow-500" />
                </motion.span>
                <span className="flex">
                  {"TodoList".split("").map((letter, index) => (
                    <motion.span 
                      key={index} 
                      style={{ fontFamily: `${letterFonts[index]}, sans-serif` }}
                      className="transition-all duration-500 ease-in-out inline-block"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
                <motion.span
                  animate={{ rotate: [0, -5, 0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                >
                  <Target className="h-8 w-8 text-blue-500" />
                </motion.span>
              </h1>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link to="/guide">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="btn-outline relative overflow-hidden group px-6 py-5"
                >
                  <span className="relative z-10 flex items-center text-lg">
                    <BookOpen className="h-5 w-5 mr-3" /> Guide
                  </span>
                  <span className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></span>
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Add Task Section - Perfectly Centered */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex justify-center mb-10">
            <Card className="custom-card w-full max-w-3xl">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold flex items-center justify-center">
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
                      className="border-2 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 text-lg py-6 px-4"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-medium text-lg">Description</Label>
                    <Input
                      placeholder="Add details (optional)"
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                      className="border-2 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 text-lg py-6 px-4"
                    />
                  </div>
                </div>

                {/* Priority & Date - Perfectly Balanced */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-medium text-lg">Priority</Label>
                    <div className="space-y-3">
                      <Input
                        placeholder="Custom priority (optional)"
                        value={customPriority}
                        onChange={handleCustomPriorityChange}
                        className="border-2 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                      <div className="flex items-center space-x-2">
                        {customPriority && (
                          <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-12 h-12 p-0 border-2 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                              >
                                <div className={cn("w-7 h-7 rounded-sm mx-auto", taskPriorityColor)}></div>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-2" align="start">
                              <div className="grid grid-cols-3 gap-2">
                                {customPriorityColors.map((color, index) => (
                                  <Button
                                    key={index}
                                    onClick={() => handleCustomColorSelect(color.color)}
                                    className={cn(
                                      "w-10 h-10 p-1",
                                      taskPriorityColor === color.color ? "ring-2 ring-primary" : ""
                                    )}
                                  >
                                    <div className={cn("w-full h-full rounded-sm", color.color)}></div>
                                  </Button>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                        <Select
                          value={customPriority || taskPriority}
                          onValueChange={(value) => {
                            const selected = standardPriorities.find((p) => p.value === value);
                            if (selected) {
                              handleStandardPrioritySelect(selected.value, selected.color);
                            } else {
                              setTaskPriority(value);
                            }
                          }}
                        >
                          <SelectTrigger className="border-2 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20">
                            <SelectValue placeholder={customPriority || taskPriority || "Select priority"}>
                              {customPriority || taskPriority}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {standardPriorities.map((priority) => (
                              <SelectItem key={priority.value} value={priority.value}>
                                <div className="flex items-center space-x-2">
                                  <div className={cn("w-4 h-4 rounded-sm", priority.color)}></div>
                                  <span>{priority.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                            "w-full justify-start text-left font-normal border-2 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 py-6",
                            !taskDueDate && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-3 h-5 w-5" />
                          {taskDueDate ? format(taskDueDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
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
                      className="border-2 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 flex-1"
                    />
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Button onClick={addTag} className="btn-secondary px-6">
                        <Tag className="h-5 w-5 mr-2" /> Add
                      </Button>
                    </motion.div>
                  </div>
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
                            className="flex items-center gap-2 bg-secondary text-secondary-foreground px-3 py-2 text-sm"
                          >
                            <span className="font-medium">{tag}</span>
                            <button 
                              onClick={() => removeTag(tag)} 
                              className="text-xs hover:text-red-500 font-bold"
                            >
                              ×
                            </button>
                          </Badge>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Add Task Button - Perfectly Centered */}
                <motion.div
                  className="flex justify-center pt-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Button 
                    onClick={addTask} 
                    className="btn-primary w-full max-w-md text-lg font-medium py-6"
                  >
                    <Plus className="h-6 w-6 mr-3" /> Create Task
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Tasks List Section - Perfectly Centered */}
        <div className="flex justify-center">
          <div className="w-full max-w-3xl space-y-6">
            <AnimatePresence>
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -100, scale: 0.9 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                >
                  <Card 
                    className={cn(
                      "custom-card border-2",
                      task.subtasks.length > 0 
                        ? "border-blue-500/30" 
                        : "border-yellow-500/30"
                    )}
                  >
                    {/* Task Header - Perfectly Balanced */}
                    <CardHeader className="flex-row justify-between items-start pb-4 space-y-0">
                      <div className="flex items-start space-x-4 flex-1">
                        <motion.div
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => toggleTaskCompletion(task.id)}
                            className="mt-1.5 w-5 h-5"
                          />
                        </motion.div>
                        
                        <div className="flex-1 space-y-1">
                          <CardTitle
                            className={cn(
                              "text-xl font-bold leading-tight",
                              task.completed && "line-through text-gray-400"
                            )}
                          >
                            {task.title}
                          </CardTitle>
                          {task.description && (
                            <CardDescription className="text-base leading-relaxed card-description">
                              {task.description}
                            </CardDescription>
                          )}
                        </div>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteTask(task.id)}
                          className="flex-shrink-0 px-4 py-2"
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </Button>
                      </motion.div>
                    </CardHeader>

                    {/* Task Details - Perfectly Aligned */}
                    <CardContent className="pt-4 space-y-4">
                      {/* Priority & Date Row */}
                      <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-primary/20">
                        <div className="flex items-center space-x-3">
                          <AlertCircle className="h-5 w-5 text-primary" />
                          <span className="font-semibold text-sm">Priority:</span>
                          <Badge className={cn("text-white px-3 py-1.5", task.priorityColor)}>
                            {task.priority}
                          </Badge>
                        </div>
                        
                        {task.dueDate && (
                          <div className="flex items-center space-x-3">
                            <Calendar className="h-5 w-5 text-primary" />
                            <span className="text-sm font-medium text-muted-foreground">
                              {format(task.dueDate, "PPP")}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Tags Row */}
                      {task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {task.tags.map((tag) => (
                            <Badge 
                              key={tag} 
                              variant="outline" 
                              className="bg-secondary text-secondary-foreground px-3 py-1.5"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Subtasks Section */}
                      {task.subtasks.length > 0 && (
                        <div className="space-y-3 pt-3 border-t border-blue-500/20">
                          <h4 className="font-bold flex items-center text-lg">
                            <CheckCircle className="h-5 w-5 mr-2 text-blue-500" /> 
                            Subtasks ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})
                          </h4>
                          <div className="space-y-2 ml-7">
                            <AnimatePresence>
                              {task.subtasks.map((subtask) => (
                                <motion.div
                                  key={subtask.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 20 }}
                                  transition={{ duration: 0.2 }}
                                  className="flex items-center justify-between group"
                                >
                                  <div className="flex items-center space-x-3 flex-1">
                                    <motion.div
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    >
                                      <Checkbox
                                        checked={subtask.completed}
                                        onCheckedChange={() => toggleSubtaskCompletion(task.id, subtask.id)}
                                        className="w-4 h-4"
                                      />
                                    </motion.div>
                                    <span
                                      className={cn(
                                        "text-sm font-medium",
                                        subtask.completed && "line-through text-gray-400"
                                      )}
                                    >
                                      {subtask.title}
                                    </span>
                                  </div>
                                  
                                  <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <button 
                                      onClick={() => deleteSubtask(task.id, subtask.id)}
                                      className="text-red-500 hover:text-red-700 p-1"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </motion.div>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                        </div>
                      )}

                      {/* Add Subtask Input */}
                      <div className="flex gap-3 pt-3">
                        <Input
                          placeholder="Add subtask"
                          value={newSubtask[task.id] || ""}
                          onChange={(e) => handleNewSubtaskChange(task.id, e.target.value)}
                          onKeyPress={(e) => handleAddSubtaskKeyPress(task.id, e)}
                          className="border-2 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 flex-1"
                        />
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <Button 
                            onClick={() => addSubtask(task.id)}
                            className="btn-secondary px-5"
                          >
                            <Plus className="h-4 w-4 mr-2" /> Add
                          </Button>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;