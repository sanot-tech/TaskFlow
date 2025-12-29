import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { showSuccess, showError } from "@/utils/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { BookOpen, Plus, Trash2, Tag, Calendar, AlertCircle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

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
  const [darkMode, setDarkMode] = useState(true);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load tasks from local storage or API
    const loadTasks = async () => {
      try {
        // Simulate loading tasks
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

    // Add new task at the top
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

  const addSubtask = (taskId: string, subtaskTitle: string) => {
    if (!subtaskTitle.trim()) {
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

  const addTag = () => {
    if (newTag.trim() && !taskTags.includes(newTag)) {
      setTaskTags([...taskTags, newTag]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTaskTags(taskTags.filter((tag) => tag !== tagToRemove));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
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

  return (
    <div className={cn("min-h-screen p-4", darkMode ? "dark" : "light")}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-primary">TodoList 2025</h1>
            <Link to="/guide">
              <Button variant="outline" size="sm" className="btn-outline">
                <BookOpen className="h-4 w-4 mr-2" /> Guide
              </Button>
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="dark-mode">Dark Mode</Label>
            <Switch id="dark-mode" checked={darkMode} onCheckedChange={toggleDarkMode} />
          </div>
        </div>

        <Card className="mb-8 custom-card">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Add New Task</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="font-medium">Title</Label>
              <Input
                placeholder="Task Title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="border-2 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-medium">Description</Label>
              <Input
                placeholder="Description"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                className="border-2 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-medium">Priority</Label>
              <div className="space-y-3">
                <Input
                  placeholder="Custom priority text (optional)"
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
                          className="w-10 h-10 p-0 border-2 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        >
                          <div className={cn("w-6 h-6 rounded-sm mx-auto", taskPriorityColor)}></div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-2" align="start">
                        <div className="grid grid-cols-3 gap-2">
                          {customPriorityColors.map((color, index) => (
                            <Button
                              key={index}
                              onClick={() => handleCustomColorSelect(color.color)}
                              className={cn(
                                "w-8 h-8 p-1",
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
              <Label className="font-medium">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal border-2 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20",
                      !taskDueDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
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

            <div className="space-y-2">
              <Label className="font-medium">Tags</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Add Tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTag()}
                  className="border-2 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <Button onClick={addTag} className="btn-secondary">
                  <Tag className="h-4 w-4 mr-2" /> Add Tag
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {taskTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1 bg-secondary text-secondary-foreground"
                  >
                    {tag}
                    <button onClick={() => removeTag(tag)} className="text-xs hover:text-red-500">
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <Button onClick={addTask} className="btn-primary w-full text-lg font-medium">
              <Plus className="h-5 w-5 mr-2" /> Add Task
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {tasks.map((task) => (
            <Card key={task.id} className="custom-card">
              <CardHeader className="flex-row justify-between items-start pb-4 border-b border-primary/20">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskCompletion(task.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <CardTitle
                      className={cn("text-lg font-bold", task.completed && "line-through text-gray-400")}
                    >
                      {task.title}
                    </CardTitle>
                    {task.description && (
                      <CardDescription className="mt-2 card-description">
                        {task.description}
                      </CardDescription>
                    )}
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteTask(task.id)}
                  className="flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex flex-wrap items-center gap-4 mb-4 pb-4 border-b border-yellow-500/20">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">Priority:</span>
                    <Badge className={cn("text-white", task.priorityColor)}>
                      {task.priority}
                    </Badge>
                  </div>
                  {task.dueDate && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm text-muted-foreground">
                        {format(task.dueDate, "PPP")}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {taskTags.map((tag) => (
                    <Badge key={tag} variant="outline" className="bg-secondary text-secondary-foreground">
                      {tag}
                    </Badge>
                  ))}
                </div>
                {task.subtasks.length > 0 && (
                  <div className="space-y-3 mt-4 pt-4 border-t border-blue-500/20">
                    <h4 className="font-bold flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" /> Subtasks:
                    </h4>
                    <div className="space-y-2 ml-6">
                      {task.subtasks.map((subtask) => (
                        <div key={subtask.id} className="flex items-center space-x-3">
                          <Checkbox
                            checked={subtask.completed}
                            onCheckedChange={() => toggleSubtaskCompletion(task.id, subtask.id)}
                          />
                          <span
                            className={cn("text-sm", subtask.completed && "line-through text-gray-400")}
                          >
                            {subtask.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;