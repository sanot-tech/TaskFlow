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
  const [showBackToTop, setShowBackToTop] = useState(false);

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
            <h1 className="text-3xl font-bold text-primary">Simple Guide for TodoList 2025</h1>
          </div>
        </div>

        <div className="space-y-12">
          {/* Getting Started Section */}
          <section className="section-spacing">
            <div className="border-l-4 border-primary pl-6 mb-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center">
                <BookOpen className="h-8 w-8 mr-3 text-primary" />
                How to Start
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Learn the basics of TodoList 2025 in simple steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow duration-300 border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-bold">
                    <PlusCircle className="h-5 w-5 mr-2 text-primary" />
                    Creating Your First Task
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">Learn how to create your first task in TodoList 2025.</p>
                  <Alert variant="default" className="border-l-4 border-primary">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Tip</AlertTitle>
                    <AlertDescription>
                      Use simple and clear task names like "Buy groceries" or "Call mom".
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300 border-2 border-yellow-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-bold">
                    <Target className="h-5 w-5 mr-2 text-yellow-500" />
                    Setting Priorities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">Learn how to mark tasks as important or not.</p>
                  <div className="flex space-x-2">
                    <Badge variant="destructive">Urgent</Badge>
                    <Badge variant="secondary">Normal</Badge>
                    <Badge variant="outline">Later</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300 border-2 border-green-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-bold">
                    <Tag className="h-5 w-5 mr-2 text-green-500" />
                    Using Categories
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">Organize your tasks by categories like "Work", "Home", "Shopping".</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">work</Badge>
                    <Badge variant="secondary">home</Badge>
                    <Badge variant="secondary">shopping</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Simple Tips Section */}
          <section className="section-spacing">
            <div className="border-l-4 border-yellow-500 pl-6 mb-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center">
                <Lightbulb className="h-8 w-8 mr-3 text-yellow-500" />
                Simple Tips for Better Organization
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Easy ways to manage your tasks better.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-yellow-500/20">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Time Management Made Easy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="pomodoro">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>Work and Rest</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground text-sm">
                          Work for 25 minutes, then take a 5-minute break. This helps you stay focused.
                        </p>
                        <Progress value={75} className="h-1 mt-2" />
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="time-blocking">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Plan Your Day</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground text-sm">
                          Decide what you want to do in the morning, afternoon, and evening.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Setting Simple Goals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold">Clear Goals</h4>
                        <p className="text-sm text-muted-foreground">
                          Make your goals specific and easy to understand.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Target className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold">Track Progress</h4>
                        <p className="text-sm text-muted-foreground">
                          Check off tasks as you complete them to see your progress.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Collaboration Section */}
          <section className="section-spacing">
            <div className="border-l-4 border-blue-500 pl-6 mb-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center">
                <UsersIcon className="h-8 w-8 mr-3 text-blue-500" />
                Working with Others
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Learn how to share tasks with family or friends.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Sharing Tasks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground text-sm">
                    Share tasks with family members or friends.
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
                  <CardTitle className="text-lg font-bold">Stay Updated</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground text-sm">
                    See changes as they happen when working with others.
                  </p>
                  <Alert variant="default" className="border-l-4 border-purple-500">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Sync Status</AlertTitle>
                    <AlertDescription>
                      All changes are updated in real-time.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Card className="border-2 border-indigo-500/20">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Team Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground text-sm">
                    Track how you and your team are doing.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tasks Completed</span>
                      <span className="font-bold">42/50</span>
                    </div>
                    <Progress value={84} className="h-1" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Simple Examples Section */}
          <section className="section-spacing">
            <div className="border-l-4 border-green-500 pl-6 mb-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center">
                <HelpCircle className="h-8 w-8 mr-3 text-green-500" />
                Everyday Examples
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                How to use TodoList 2025 for common daily tasks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Home Tasks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="cleaning">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center">
                          <Layout className="h-4 w-4 mr-2" />
                          <span>House Cleaning</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground">
                          Create tasks for different rooms and cleaning activities.
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1 pl-4 mt-2">
                          <li>• Kitchen</li>
                          <li>• Bathroom</li>
                          <li>• Living room</li>
                          <li>• Bedrooms</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="shopping">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Grocery Shopping</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground">
                          Make a shopping list with all the items you need.
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1 pl-4 mt-2">
                          <li>• Milk</li>
                          <li>• Eggs</li>
                          <li>• Bread</li>
                          <li>• Fruits</li>
                          <li>• Vegetables</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              <Card className="border-2 border-teal-500/20">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Work Tasks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="office" className="w-full">
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="office">Office</TabsTrigger>
                      <TabsTrigger value="remote">Remote</TabsTrigger>
                    </TabsList>

                    <TabsContent value="office">
                      <ul className="text-sm text-muted-foreground space-y-2 pl-4 mt-2">
                        <li>• Meetings</li>
                        <li>• Reports</li>
                        <li>• Emails</li>
                        <li>• Presentations</li>
                      </ul>
                    </TabsContent>

                    <TabsContent value="remote">
                      <ul className="text-sm text-muted-foreground space-y-2 pl-4 mt-2">
                        <li>• Video calls</li>
                        <li>• Online meetings</li>
                        <li>• Digital documents</li>
                        <li>• Virtual collaboration</li>
                      </ul>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Simple Advice Section */}
          <section className="section-spacing">
            <div className="border-l-4 border-purple-500 pl-6 mb-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center">
                <Lightbulb className="h-8 w-8 mr-3 text-purple-500" />
                Simple Advice
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Easy tips to help you stay organized.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Easy Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert variant="default" className="border-l-4 border-purple-500 mb-4">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Weekly Tip</AlertTitle>
                    <AlertDescription>
                      Start your day by doing the most important task first.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-bold mb-2">Weekly Review</h3>
                      <p className="text-sm text-muted-foreground">
                        At the end of each week, look at what you've done and plan for the next week.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold mb-2">Set Simple Goals</h3>
                      <p className="text-sm text-muted-foreground">
                        Break big tasks into smaller, easier steps.
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
                        <h4 className="font-bold">Work and Rest</h4>
                        <p className="text-sm text-muted-foreground">
                          Work for 25 minutes, then take a 5-minute break.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Target className="h-4 w-4 mt-1 text-red-500 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold">Do Hard Tasks First</h4>
                        <p className="text-sm text-muted-foreground">
                          Do the hardest task first thing in the morning.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Clock className="h-4 w-4 mt-1 text-blue-500 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold">Quick Tasks</h4>
                        <p className="text-sm text-muted-foreground">
                          If it takes less than 2 minutes, do it now.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <GitBranch className="h-4 w-4 mt-1 text-green-500 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold">Group Similar Tasks</h4>
                        <p className="text-sm text-muted-foreground">
                          Do similar tasks together to save time.
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