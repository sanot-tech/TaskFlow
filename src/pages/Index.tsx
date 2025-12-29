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

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: Date;
  tags: string[];
  subtasks: Subtask[];
}

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState<"low" | "medium" | "high">("medium");
  const [taskDueDate, setTaskDueDate] = useState<Date | undefined>(undefined);
  const [taskTags, setTaskTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [darkMode, setDarkMode] = useState(true);
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
            tags: ["personal", "shopping"],
            subtasks: [],
          },
          {
            id: "3",
            title: "Exercise",
            description: "30 minutes of cardio and strength training",
            completed: false,
            priority: "low",
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
      priority: taskPriority,
      dueDate: taskDueDate,
      tags: taskTags,
      subtasks: [],
    };

    // Add new task at the top
    setTasks([newTask, ...tasks]);
    setTaskTitle("");
    setTaskDescription("");
    setTaskPriority("medium");
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className={cn("min-h-screen p-4", darkMode ? "dark" : "light")}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-primary">TodoList 2025</h1>
            <Link to="/guide">
              <Button variant="outline" size="sm" className="btn-outline">
                <BookOpen className="h-4 w-4 mr-2" />
                Guide
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
              <Select value={taskPriority} onValueChange={(value: "low" | "medium" | "high") => setTaskPriority(value)}>
                <SelectTrigger className="border-2 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-medium">Tags</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Add Tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  className="border-2 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <Button onClick={addTag} className="btn-secondary">
                  <Tag className="h-4 w-4 mr-2" />
                  Add Tag
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {taskTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1 bg-secondary text-secondary-foreground">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="text-xs hover:text-red-500">×</button>
                  </Badge>
                ))}
              </div>
            </div>
            <Button onClick={addTask} className="btn-primary w-full text-lg font-medium">
              <Plus className="h-5 w-5 mr-2" />
              Add Task
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {tasks.map((task) => (
            <Card key={task.id} className="custom-card">
              <CardHeader className="flex-row justify-between items-start pb-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskCompletion(task.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <CardTitle className={cn("text-lg font-bold", task.completed && "line-through text-gray-400")}>
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
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">Priority:</span>
                    <Badge className={cn("text-white", getPriorityColor(task.priority))}>
                      {task.priority}
                    </Badge>
                  </div>
                  {task.dueDate && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm text-muted-foreground">
                        Due: {task.dueDate.toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {task.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="bg-secondary text-secondary-foreground">
                      {tag}
                    </Badge>
                  ))}
                </div>
                {task.subtasks.length > 0 && (
                  <div className="space-y-3 mt-4 pt-4 border-t border-border">
                    <h4 className="font-bold flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Subtasks:
                    </h4>
                    <div className="space-y-2 ml-6">
                      {task.subtasks.map((subtask) => (
                        <div key={subtask.id} className="flex items-center space-x-3">
                          <Checkbox
                            checked={subtask.completed}
                            onCheckedChange={() => toggleSubtaskCompletion(task.id, subtask.id)}
                          />
                          <span className={cn("text-sm", subtask.completed && "line-through text-gray-400")}>
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