import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { showSuccess, showError } from "@/utils/toast";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { BookOpen } from "lucide-react";
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
            description: "Finish the React Native project",
            completed: false,
            priority: "high",
            dueDate: new Date("2025-12-31"),
            tags: ["work", "urgent"],
            subtasks: [
              { id: "1-1", title: "Design UI", completed: false },
              { id: "1-2", title: "Implement API", completed: false },
            ],
          },
          {
            id: "2",
            title: "Buy Groceries",
            description: "Milk, eggs, bread",
            completed: false,
            priority: "medium",
            tags: ["personal"],
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

    setTasks([...tasks, newTask]);
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

  return (
    <div className={cn("min-h-screen p-4", darkMode ? "dark" : "")}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">TodoList 2025</h1>
          <Link to="/guide" className="ml-4">
            <Button variant="outline" size="sm" className="text-foreground hover:text-foreground">
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

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Task</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              placeholder="Task Title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              placeholder="Description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select value={taskPriority} onValueChange={(value: "low" | "medium" | "high") => setTaskPriority(value)}>
              <SelectTrigger>
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
            <Label>Tags</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Add Tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button onClick={addTag}>Add Tag</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {taskTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="text-xs">×</button>
                </Badge>
              ))}
            </div>
          </div>
          <Button onClick={addTask} className="w-full">
            Add Task
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardHeader className="flex-row justify-between items-start">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTaskCompletion(task.id)}
                />
                <CardTitle className={cn(task.completed && "line-through")}>
                  {task.title}
                </CardTitle>
              </div>
              <Button variant="destructive" size="sm" onClick={() => deleteTask(task.id)}>
                Delete
              </Button>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">{task.description}</CardDescription>
              <div className="flex items-center space-x-2 mb-4">
                <span className="font-medium">Priority:</span>
                <Badge variant={task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"}>
                  {task.priority}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {task.tags.map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
              {task.subtasks.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Subtasks:</h4>
                  {task.subtasks.map((subtask) => (
                    <div key={subtask.id} className="flex items-center space-x-2">
                      <Checkbox
                        checked={subtask.completed}
                        onCheckedChange={() => toggleSubtaskCompletion(task.id, subtask.id)}
                      />
                      <span className={cn(subtask.completed && "line-through")}>
                        {subtask.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;