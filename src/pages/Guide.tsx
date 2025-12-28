import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Lightbulb, HelpCircle, Library, Users, Settings, ChevronRight, Clock, Target, Zap, GitBranch, Database, Code, Palette, Layout, BarChart2, PieChart, LineChart, User, Users as UsersIcon, MessageSquare, Share2, Lock, Unlock, Eye, EyeOff, Sun, Moon, Laptop, Smartphone, Tablet, Monitor, Wifi, Battery, Cpu, MemoryStick, HardDrive, GitCommit, GitMerge, GitPullRequest, GitCompare, Terminal, Codepen, Figma, Framer, ChevronDown, ChevronUp, AlertCircle, Info, CheckCircle2, XCircle, PlusCircle, MinusCircle, Tag, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Guide = () => {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [progressValue, setProgressValue] = useState(13);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sections = [
    { id: "getting-started", title: "Getting Started" },
    { id: "productivity-tips", title: "Productivity Tips" },
    { id: "collaboration", title: "Collaboration" },
    { id: "school-of-learning", title: "School of Learning" },
    { id: "productivity-advisor", title: "Productivity Advisor" },
    { id: "usage-examples", title: "Usage Examples" },
    { id: "productivity-encyclopedia", title: "Productivity Encyclopedia" },
    { id: "collaboration-guide", title: "Collaboration Guide" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 dark">
      {/* Fixed Back to Tasks button */}
      <div className="fixed top-4 right-4 z-50">
        <Link to="/">
          <Button className="btn-primary shadow-lg">
            <ChevronRight className="h-4 w-4 mr-2" />
            Back to Tasks
          </Button>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 mt-16">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">TodoList 2025 Guide</h1>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <Tabs defaultValue="getting-started" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 mb-4">
              {sections.map((section) => (
                <TabsTrigger
                  key={section.id}
                  value={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-sm"
                >
                  {section.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Guide Progress</span>
            <span className="text-sm text-muted-foreground">{progressValue}%</span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>

        <div className="space-y-12">
          {/* Getting Started Section */}
          <section id="getting-started" className="section-spacing">
            <div className="border-l-4 border-primary pl-6 mb-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center">
                <BookOpen className="h-8 w-8 mr-3 text-primary" />
                Getting Started
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Learn the basics of TodoList 2025 and how to maximize your productivity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow duration-300 border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-bold">
                    <PlusCircle className="h-5 w-5 mr-2 text-primary" />
                    Creating Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">Learn how to create your first task in TodoList 2025.</p>
                  <Alert variant="default" className="border-l-4 border-primary">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Tip</AlertTitle>
                    <AlertDescription>
                      Use clear and concise task titles for better organization.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300 border-2 border-yellow-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-bold">
                    <Target className="h-5 w-5 mr-2 text-yellow-500" />
                    Managing Priorities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">Understand how to set and manage task priorities.</p>
                  <div className="flex space-x-2">
                    <Badge variant="destructive">High</Badge>
                    <Badge variant="secondary">Medium</Badge>
                    <Badge variant="outline">Low</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300 border-2 border-green-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-bold">
                    <Tag className="h-5 w-5 mr-2 text-green-500" />
                    Using Tags
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">Discover how tags can help you organize your tasks.</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">work</Badge>
                    <Badge variant="secondary">personal</Badge>
                    <Badge variant="secondary">urgent</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Productivity Tips Section */}
          <section id="productivity-tips" className="section-spacing">
            <div className="border-l-4 border-yellow-500 pl-6 mb-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center">
                <Lightbulb className="h-8 w-8 mr-3 text-yellow-500" />
                Productivity Tips
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Discover advanced techniques to boost your productivity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-yellow-500/20">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Time Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="pomodoro">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>Pomodoro Technique</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground text-sm">
                          Work for 25 minutes, then take a 5-minute break. Repeat this cycle 4 times, then take a longer break of 15-30 minutes.
                        </p>
                        <Progress value={75} className="h-1 mt-2" />
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="time-blocking">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Time Blocking</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground text-sm">
                          Divide your day into blocks of time, each dedicated to a specific task or group of tasks.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Goal Setting</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold">SMART Goals</h4>
                        <p className="text-sm text-muted-foreground">
                          Specific, Measurable, Achievable, Relevant, Time-bound
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Target className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold">OKRs</h4>
                        <p className="text-sm text-muted-foreground">
                          Objectives and Key Results for tracking progress
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Collaboration Section */}
          <section id="collaboration" className="section-spacing">
            <div className="border-l-4 border-blue-500 pl-6 mb-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center">
                <UsersIcon className="h-8 w-8 mr-3 text-blue-500" />
                Collaboration
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Learn how to work effectively with your team.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Task Sharing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground text-sm">
                    Share tasks with team members and assign responsibilities.
                  </p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share Task
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Click to share this task</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Real-time Updates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground text-sm">
                    See changes as they happen with real-time synchronization.
                  </p>
                  <Alert variant="default" className="border-l-4 border-purple-500">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Sync Status</AlertTitle>
                    <AlertDescription>
                      All changes are synced in real-time across all devices.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Card className="border-2 border-indigo-500/20">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Team Analytics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground text-sm">
                    Track team productivity and identify bottlenecks.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tasks Completed</span>
                      <span className="font-bold">42/50</span>
                    </div>
                    <Progress value={84} className="h-1" />
                    <div className="flex justify-between text-sm">
                      <span>Productivity</span>
                      <span className="font-bold">92%</span>
                    </div>
                    <Progress value={92} className="h-1" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* School of Learning Section */}
          <section id="school-of-learning" className="section-spacing">
            <div className="border-l-4 border-green-500 pl-6 mb-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center">
                <BookOpen className="h-8 w-8 mr-3 text-green-500" />
                School of Learning
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Welcome to the School of Learning for TodoList 2025. Here you will learn everything you need to know to become a productivity master.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-2 border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Introduction to TodoList 2025</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription>
                    Welcome to the School of Learning for TodoList 2025. Here you will learn everything you need to know to become a productivity master.
                  </CardDescription>

                  <Separator />

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold mb-2 text-primary">Lesson 1: Getting Started</h3>
                      <p className="text-sm text-muted-foreground">
                        Learn the basics of creating and managing tasks. Understand the interface and core features.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold mb-2 text-primary">Lesson 2: Advanced Features</h3>
                      <p className="text-sm text-muted-foreground">
                        Explore tags, priorities, and subtasks. Learn how to use these features to organize your work effectively.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold mb-2 text-primary">Lesson 3: Collaboration</h3>
                      <p className="text-sm text-muted-foreground">
                        Learn how to share tasks and work with others. Understand team workflows and best practices.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Advanced Techniques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="time-management">
                      <AccordionTrigger className="text-left hover:no-underline">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-blue-500" />
                          <span className="font-medium">Time Management</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground mb-2">
                          Master the art of prioritizing and scheduling your tasks.
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                          <li>• Eisenhower Matrix</li>
                          <li>• Time blocking</li>
                          <li>• Task batching</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="productivity-hacks">
                      <AccordionTrigger className="text-left hover:no-underline">
                        <div className="flex items-center">
                          <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                          <span className="font-medium">Productivity Hacks</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground mb-2">
                          Discover secrets to getting more done in less time.
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                          <li>• Pomodoro Technique</li>
                          <li>• Two-minute rule</li>
                          <li>• Eat the frog</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="automation">
                      <AccordionTrigger className="text-left hover:no-underline">
                        <div className="flex items-center">
                          <Cpu className="h-4 w-4 mr-2 text-green-500" />
                          <span className="font-medium">Automation</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground mb-2">
                          Learn how to automate repetitive tasks to save time.
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                          <li>• Recurring tasks</li>
                          <li>• Task templates</li>
                          <li>• Integration with other apps</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Productivity Advisor Section */}
          <section id="productivity-advisor" className="section-spacing">
            <div className="border-l-4 border-purple-500 pl-6 mb-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center">
                <Lightbulb className="h-8 w-8 mr-3 text-purple-500" />
                Productivity Advisor
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Get tailored recommendations based on your usage patterns and goals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Personalized Advice</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert variant="default" className="border-l-4 border-purple-500 mb-4">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Weekly Tip</AlertTitle>
                    <AlertDescription>
                      Try focusing on one major task each morning before checking emails.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-bold mb-2">Weekly Review</h3>
                      <p className="text-sm text-muted-foreground">
                        Analyze your week and plan for the next one. Reflect on what worked and what didn't.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold mb-2">Goal Setting</h3>
                      <p className="text-sm text-muted-foreground">
                        Set SMART goals and track your progress. Break down large goals into smaller, actionable tasks.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-500/20">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Quick Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-start space-x-2">
                      <Zap className="h-4 w-4 mt-1 text-orange-500 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold">Pomodoro Technique</h4>
                        <p className="text-sm text-muted-foreground">
                          Work for 25 minutes, then take a 5-minute break.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Target className="h-4 w-4 mt-1 text-red-500 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold">Eat the Frog</h4>
                        <p className="text-sm text-muted-foreground">
                          Do your hardest task first thing in the morning.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Clock className="h-4 w-4 mt-1 text-blue-500 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold">Two-Minute Rule</h4>
                        <p className="text-sm text-muted-foreground">
                          If it takes less than 2 minutes, do it now.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <GitBranch className="h-4 w-4 mt-1 text-green-500 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold">Batching</h4>
                        <p className="text-sm text-muted-foreground">
                          Group similar tasks together to minimize context switching.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Usage Examples Section */}
          <section id="usage-examples" className="section-spacing">
            <div className="border-l-4 border-indigo-500 pl-6 mb-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center">
                <HelpCircle className="h-8 w-8 mr-3 text-indigo-500" />
                Usage Examples
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Practical examples of how to use TodoList 2025 in different scenarios.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-indigo-500/20">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Common Scenarios</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="project-management">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center">
                          <Layout className="h-4 w-4 mr-2" />
                          <span>Project Management</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground">
                          How to manage a complex project with multiple tasks and subtasks.
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1 pl-4 mt-2">
                          <li>• Break down into milestones</li>
                          <li>• Create task dependencies</li>
                          <li>• Assign team members</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="daily-planning">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Daily Planning</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground">
                          How to plan your day effectively using TodoList 2025.
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1 pl-4 mt-2">
                          <li>• Morning review</li>
                          <li>• Prioritize tasks</li>
                          <li>• Time blocking</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              <Card className="border-2 border-teal-500/20">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Industry-Specific Examples</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="developers" className="w-full">
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="developers">Developers</TabsTrigger>
                      <TabsTrigger value="designers">Designers</TabsTrigger>
                    </TabsList>

                    <TabsContent value="developers">
                      <ul className="text-sm text-muted-foreground space-y-2 pl-4 mt-2">
                        <li>• Bug tracking</li>
                        <li>• Feature development</li>
                        <li>• Code reviews</li>
                        <li>• Deployment checklists</li>
                      </ul>
                    </TabsContent>

                    <TabsContent value="designers">
                      <ul className="text-sm text-muted-foreground space-y-2 pl-4 mt-2">
                        <li>• Design sprints</li>
                        <li>• Client feedback</li>
                        <li>• Asset management</li>
                        <li>• Version control</li>
                      </ul>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Productivity Encyclopedia Section */}
          <section id="productivity-encyclopedia" className="section-spacing">
            <div className="border-l-4 border-teal-500 pl-6 mb-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center">
                <Library className="h-8 w-8 mr-3 text-teal-500" />
                Productivity Encyclopedia
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Comprehensive guide to productivity methodologies and tools.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-teal-500/20">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Productivity Methodologies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="gtd">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                          <span>Getting Things Done (GTD)</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground">
                          A method for organizing tasks and projects by capturing all tasks, clarifying actions, organizing by context, and reviewing regularly.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="agile">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center">
                          <GitBranch className="h-4 w-4 mr-2 text-blue-500" />
                          <span>Agile & Scrum</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground">
                          Iterative approach to project management with regular sprints and stand-up meetings.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="kanban">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center">
                          <Layout className="h-4 w-4 mr-2 text-purple-500" />
                          <span>Kanban</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground">
                          Visual workflow management system using columns to represent different stages of work.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              <Card className="border-2 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Productivity Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-start space-x-2">
                      <Clock className="h-4 w-4 mt-1 text-cyan-500 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold">Time Tracking</h4>
                        <p className="text-sm text-muted-foreground">
                          Tools to monitor how you spend your time and identify productivity patterns.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Zap className="h-4 w-4 mt-1 text-yellow-500 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold">Task Automation</h4>
                        <p className="text-sm text-muted-foreground">
                          Automate repetitive tasks to save time and reduce errors.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <BookOpen className="h-4 w-4 mt-1 text-indigo-500 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold">Note Taking</h4>
                        <p className="text-sm text-muted-foreground">
                          Capture and organize your thoughts, ideas, and meeting notes.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Database className="h-4 w-4 mt-1 text-emerald-500 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold">Data Analysis</h4>
                        <p className="text-sm text-muted-foreground">
                          Analyze your productivity patterns and identify areas for improvement.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Collaboration Guide Section */}
          <section id="collaboration-guide" className="section-spacing">
            <div className="border-l-4 border-blue-600 pl-6 mb-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center">
                <UsersIcon className="h-8 w-8 mr-3 text-blue-600" />
                Collaboration Guide
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Best practices for working effectively with your team.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-blue-600/20">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Team Workflows</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <ChevronRight className="h-4 w-4 mt-1 text-blue-600 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold">Shared Task Lists</h4>
                        <p className="text-sm text-muted-foreground">
                          How to create and manage shared task lists for team projects.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <ChevronRight className="h-4 w-4 mt-1 text-blue-600 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold">Real-time Collaboration</h4>
                        <p className="text-sm text-muted-foreground">
                          Work together in real-time on tasks and projects with instant synchronization.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <ChevronRight className="h-4 w-4 mt-1 text-blue-600 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold">Task Assignment</h4>
                        <p className="text-sm text-muted-foreground">
                          Assign tasks to team members and track progress effectively.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-600/20">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Best Practices</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert variant="default" className="border-l-4 border-purple-600 mb-4">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Pro Tip</AlertTitle>
                    <AlertDescription>
                      Regular team syncs can improve collaboration by 40%.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 mt-1 text-green-500 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold">Clear Task Descriptions</h4>
                        <p className="text-sm text-muted-foreground">
                          Write detailed descriptions so everyone understands the task requirements.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Target className="h-4 w-4 mt-1 text-red-500 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold">Set Realistic Deadlines</h4>
                        <p className="text-sm text-muted-foreground">
                          Agree on achievable deadlines with your team to avoid burnout.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <GitBranch className="h-4 w-4 mt-1 text-blue-500 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold">Break Down Complex Tasks</h4>
                        <p className="text-sm text-muted-foreground">
                          Divide large tasks into smaller, manageable subtasks for better progress tracking.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 shadow-lg"
          size="icon"
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default Guide;