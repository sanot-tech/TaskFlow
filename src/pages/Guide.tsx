import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Lightbulb, HelpCircle, Library, Users, Settings, ChevronRight, Clock, Target, Zap, GitBranch, Database, Code, Palette, Layout, BarChart2, PieChart, LineChart, User, Users as UsersIcon, MessageSquare, Share2, Lock, Unlock, Eye, EyeOff, Sun, Moon, Laptop, Smartphone, Tablet, Monitor, Wifi, Battery, Cpu, MemoryStick, HardDrive, GitCommit, GitMerge, GitPullRequest, GitCompare, Terminal, Codepen, Figma, Framer, ChevronDown, ChevronUp, AlertCircle, Info, CheckCircle2, XCircle, PlusCircle, MinusCircle, Tag, Calendar, Palette as PaletteIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import WebFont from "webfontloader";

// List of beautiful, similar fonts (modern sans-serif)
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

const Guide = () => {
  const [letterFonts, setLetterFonts] = useState<string[]>([]);

  // Initialize fonts for each letter in "TodoList"
  useEffect(() => {
    const initialFonts = "TodoList".split("").map(() => 
      fontList[Math.floor(Math.random() * fontList.length)]
    );
    setLetterFonts(initialFonts);
  }, []);

  // Change fonts every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLetterFonts("TodoList".split("").map(() => 
        fontList[Math.floor(Math.random() * fontList.length)]
      ));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Load fonts using WebFontLoader with Inter as backup
  useEffect(() => {
    WebFont.load({
      google: {
        families: [...fontList, 'Inter:300,400,500,600,700']
      }
    });
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    // Добавляем классы для эффекта нажатого скролла
    <div className="min-h-screen bg-background text-foreground p-4 dark smooth-scroll scrollable">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 mt-16">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary flex">
              Simple Guide for&nbsp;
              {"TodoList".split("").map((letter, index) => (
                <span
                  key={index}
                  style={{ fontFamily: `${letterFonts[index]}, sans-serif` }}
                  className="transition-all duration-500 ease-in-out"
                >
                  {letter}
                </span>
              ))}
            </h1>
          </div>
        </div>
        <div className="space-y-12 pb-24">
          {/* Getting Started Section */}
          <section className="section-spacing">
            <div className="border-l-4 border-primary pl-6 mb-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center">
                <BookOpen className="h-8 w-8 mr-3 text-primary" /> How to Start
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Learn the basics of TodoList in simple steps.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow duration-300 border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-bold">
                    <PlusCircle className="h-5 w-5 mr-2 text-primary" /> Creating Your First Task
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">Learn how to create your first task in TodoList.</p>
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
                    <Target className="h-5 w-5 mr-2 text-yellow-500" /> Setting Priorities
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
                    <Tag className="h-5 w-5 mr-2 text-green-500" /> Using Categories
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
          {/* Priority Colors Section */}
          <section className="section-spacing">
            <div className="border-l-4 border-red-500 pl-6 mb-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center">
                <PaletteIcon className="h-8 w-8 mr-3 text-red-500" /> Understanding Priority Colors
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Learn how to use colors to organize your tasks by importance.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-red-500/20">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Priority Levels</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-sm bg-red-500"></div>
                      <div>
                        <h4 className="font-bold">High Priority</h4>
                        <p className="text-sm text-muted-foreground">Urgent tasks that need immediate attention</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-sm bg-yellow-500"></div>
                      <div>
                        <h4 className="font-bold">Medium Priority</h4>
                        <p className="text-sm text-muted-foreground">Important tasks for the near future</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-sm bg-green-500"></div>
                      <div>
                        <h4 className="font-bold">Low Priority</h4>
                        <p className="text-sm text-muted-foreground">Tasks that can be done when you have time</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Custom Priorities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Create your own priority levels with custom names and colors.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-sm bg-orange-500"></div>
                      <span className="text-sm">Personal</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-sm bg-blue-500"></div>
                      <span className="text-sm">Work</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-sm bg-purple-500"></div>
                      <span className="text-sm">Family</span>
                    </div>
                  </div>
                  <Alert variant="default" className="border-l-4 border-purple-500 mt-4">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Tip</AlertTitle>
                    <AlertDescription>
                      Use colors that make sense to you. Red for urgent, green for easy tasks.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </section>
          {/* Calendar Section */}
          <section className="section-spacing">
            <div className="border-l-4 border-blue-500 pl-6 mb-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center">
                <Calendar className="h-8 w-8 mr-3 text-blue-500" /> Using the Calendar
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Plan your tasks with due dates to stay organized.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Setting Due Dates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Assign due dates to your tasks to keep track of deadlines.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2 pl-4">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-green-500" /> Click the "Pick a date" button when creating a task
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-green-500" /> Select a date from the calendar popup
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-green-500" /> The due date will appear on your task card
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-2 border-teal-500/20">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Benefits of Due Dates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Target className="h-5 w-5 text-teal-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold">Stay Organized</h4>
                        <p className="text-sm text-muted-foreground">Never miss an important deadline again</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold">Time Management</h4>
                        <p className="text-sm text-muted-foreground">Plan your tasks in advance</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <BarChart2 className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold">Visual Planning</h4>
                        <p className="text-sm text-muted-foreground">See all your upcoming tasks at a glance</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
          {/* Simple Tips Section */}
          <section className="section-spacing">
            <div className="border-l-4 border-yellow-500 pl-6 mb-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center">
                <Lightbulb className="h-8 w-8 mr-3 text-yellow-500" /> Simple Tips for Better Organization
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
                        <p className="text-sm text-muted-foreground">
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
                        <p className="text-sm text-muted-foreground">
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
          {/* Working with Others Section - Simplified */}
          <section className="section-spacing">
            <div className="border-l-4 border-blue-500 pl-6 mb-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center">
                <UsersIcon className="h-8 w-8 mr-3 text-blue-500" /> Working with Family and Friends
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Learn how to use TodoList together with others for shared tasks.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Shared Shopping Lists</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground text-sm">
                    Create shared shopping lists with your family so everyone can add items they need.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 pl-4 mt-2">
                    <li>• Milk</li>
                    <li>• Bread</li>
                    <li>• Eggs</li>
                    <li>• Fruits</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-2 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Household Chores</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground text-sm">
                    Divide household chores among family members and track who does what.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 pl-4 mt-2">
                    <li>• Cleaning</li>
                    <li>• Cooking</li>
                    <li>• Laundry</li>
                    <li>• Taking out trash</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-2 border-indigo-500/20">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Family Events</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground text-sm">
                    Plan family events together and assign responsibilities.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 pl-4 mt-2">
                    <li>• Birthdays</li>
                    <li>• Holidays</li>
                    <li>• Family trips</li>
                    <li>• Special occasions</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>
          {/* Simple Examples Section */}
          <section className="section-spacing">
            <div className="border-l-4 border-green-500 pl-6 mb-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center">
                <HelpCircle className="h-8 w-8 mr-3 text-green-500" /> Everyday Examples
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                How to use TodoList for common daily tasks.
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
                      <ul className="text-sm text-muted-foreground space-y-2 pl-4">
                        <li>• Meetings</li>
                        <li>• Reports</li>
                        <li>• Emails</li>
                        <li>• Presentations</li>
                      </ul>
                    </TabsContent>
                    <TabsContent value="remote">
                      <ul className="text-sm text-muted-foreground space-y-2 pl-4">
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
                <Lightbulb className="h-8 w-8 mr-3 text-purple-500" /> Simple Advice
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
      {/* Fixed Navigation Buttons at Bottom */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-3">
        <Link to="/">
          <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg rounded-full px-6 h-12 font-bold">
            <ChevronRight className="h-5 w-5 mr-2" /> К задачам
          </Button>
        </Link>
        <Link to="/" onClick={scrollToTop}>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg rounded-full px-6 h-12 font-bold">
            <BookOpen className="h-5 w-5 mr-2" /> На главную
          </Button>
        </Link>
        <Link to="/">
          <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg rounded-full px-6 h-12 font-bold">
            <HelpCircle className="h-5 w-5 mr-2" /> Вернуться
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Guide;