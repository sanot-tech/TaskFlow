import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Lightbulb, HelpCircle, Library, Users, Settings, ChevronRight, Clock, Target, Zap, GitBranch, Database, Code, Palette, Layout, BarChart2, PieChart, LineChart, User, Users as UsersIcon, MessageSquare, Share2, Lock, Unlock, Eye, EyeOff, Sun, Moon, Laptop, Smartphone, Tablet, Monitor, Wifi, Battery, Cpu, MemoryStick, HardDrive, GitCommit, GitMerge, GitPullRequest, GitCompare, Terminal, Codepen, Figma, Framer } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Guide = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">TodoList 2025 Guide</h1>
          </div>
          <Link to="/">
            <Button className="btn-primary">
              <ChevronRight className="h-4 w-4 mr-2" />
              Back to Tasks
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-bold">
                <BookOpen className="h-5 w-5 mr-2 text-primary" />
                Getting Started
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">Learn the basics of TodoList 2025 and how to maximize your productivity.</p>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <ChevronRight className="h-4 w-4 mr-2 text-primary" />
                  <span>Creating your first task</span>
                </div>
                <div className="flex items-center text-sm">
                  <ChevronRight className="h-4 w-4 mr-2 text-primary" />
                  <span>Managing task priorities</span>
                </div>
                <div className="flex items-center text-sm">
                  <ChevronRight className="h-4 w-4 mr-2 text-primary" />
                  <span>Using tags effectively</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-bold">
                <Lightbulb className="h-5 w-5 mr-2 text-primary" />
                Productivity Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">Discover advanced techniques to boost your productivity.</p>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-primary" />
                  <span>Time management strategies</span>
                </div>
                <div className="flex items-center text-sm">
                  <Target className="h-4 w-4 mr-2 text-primary" />
                  <span>Goal setting techniques</span>
                </div>
                <div className="flex items-center text-sm">
                  <Zap className="h-4 w-4 mr-2 text-primary" />
                  <span>Quick productivity hacks</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-bold">
                <UsersIcon className="h-5 w-5 mr-2 text-primary" />
                Collaboration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">Learn how to work effectively with your team.</p>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Share2 className="h-4 w-4 mr-2 text-primary" />
                  <span>Sharing tasks</span>
                </div>
                <div className="flex items-center text-sm">
                  <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                  <span>Team communication</span>
                </div>
                <div className="flex items-center text-sm">
                  <GitBranch className="h-4 w-4 mr-2 text-primary" />
                  <span>Version control</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-10">
          <section className="section-spacing">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <BookOpen className="h-6 w-6 mr-3 text-primary" />
              School of Learning
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Introduction to TodoList 2025</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Welcome to the School of Learning for TodoList 2025. Here you will learn everything you need to know to become a productivity master.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-bold mb-2">Lesson 1: Getting Started</h3>
                      <p className="text-sm text-muted-foreground">Learn the basics of creating and managing tasks.</p>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Lesson 2: Advanced Features</h3>
                      <p className="text-sm text-muted-foreground">Explore tags, priorities, and subtasks.</p>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Lesson 3: Collaboration</h3>
                      <p className="text-sm text-muted-foreground">Learn how to share tasks and work with others.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Advanced Techniques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-bold mb-2">Time Management</h3>
                      <p className="text-sm text-muted-foreground">Master the art of prioritizing and scheduling.</p>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Productivity Hacks</h3>
                      <p className="text-sm text-muted-foreground">Discover secrets to getting more done in less time.</p>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Automation</h3>
                      <p className="text-sm text-muted-foreground">Learn how to automate repetitive tasks.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="section-spacing">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Lightbulb className="h-6 w-6 mr-3 text-primary" />
              Productivity Advisor
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Personalized Advice</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Get tailored recommendations based on your usage patterns and goals.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-bold mb-2">Weekly Review</h3>
                      <p className="text-sm text-muted-foreground">Analyze your week and plan for the next one.</p>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Goal Setting</h3>
                      <p className="text-sm text-muted-foreground">Set SMART goals and track your progress.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Quick Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-start space-x-2">
                      <Zap className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                      <div>
                        <h4 className="font-bold">Pomodoro Technique</h4>
                        <p className="text-sm text-muted-foreground">Work for 25 minutes, then take a 5-minute break.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Target className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                      <div>
                        <h4 className="font-bold">Eat the Frog</h4>
                        <p className="text-sm text-muted-foreground">Do your hardest task first thing in the morning.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Clock className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                      <div>
                        <h4 className="font-bold">Two-Minute Rule</h4>
                        <p className="text-sm text-muted-foreground">If it takes less than 2 minutes, do it now.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <GitBranch className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                      <div>
                        <h4 className="font-bold">Batching</h4>
                        <p className="text-sm text-muted-foreground">Group similar tasks together to minimize context switching.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="section-spacing">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <HelpCircle className="h-6 w-6 mr-3 text-primary" />
              Usage Examples
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Common Scenarios</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-bold mb-2">Project Management</h3>
                      <p className="text-sm text-muted-foreground">How to manage a complex project with multiple tasks and subtasks.</p>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Daily Planning</h3>
                      <p className="text-sm text-muted-foreground">How to plan your day effectively.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Industry-Specific Examples</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <h4 className="font-bold mb-2">For Developers</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                        <li>• Bug tracking</li>
                        <li>• Feature development</li>
                        <li>• Code reviews</li>
                        <li>• Deployment checklists</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">For Designers</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                        <li>• Design sprints</li>
                        <li>• Client feedback</li>
                        <li>• Asset management</li>
                        <li>• Version control</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="section-spacing">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Library className="h-6 w-6 mr-3 text-primary" />
              Productivity Encyclopedia
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Productivity Methodologies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-bold mb-2">Getting Things Done (GTD)</h3>
                      <p className="text-sm text-muted-foreground">A method for organizing tasks and projects.</p>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Agile & Scrum</h3>
                      <p className="text-sm text-muted-foreground">Iterative approach to project management.</p>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Kanban</h3>
                      <p className="text-sm text-muted-foreground">Visual workflow management system.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Productivity Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-start space-x-2">
                      <Clock className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                      <div>
                        <h4 className="font-bold">Time Tracking</h4>
                        <p className="text-sm text-muted-foreground">Tools to monitor how you spend your time.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Zap className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                      <div>
                        <h4 className="font-bold">Task Automation</h4>
                        <p className="text-sm text-muted-foreground">Automate repetitive tasks to save time.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <BookOpen className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                      <div>
                        <h4 className="font-bold">Note Taking</h4>
                        <p className="text-sm text-muted-foreground">Capture and organize your thoughts and ideas.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Database className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                      <div>
                        <h4 className="font-bold">Data Analysis</h4>
                        <p className="text-sm text-muted-foreground">Analyze your productivity patterns.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="section-spacing">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <UsersIcon className="h-6 w-6 mr-3 text-primary" />
              Collaboration Guide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Team Workflows</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-bold mb-2">Shared Task Lists</h3>
                      <p className="text-sm text-muted-foreground">How to create and manage shared task lists.</p>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Real-time Collaboration</h3>
                      <p className="text-sm text-muted-foreground">Work together in real-time on tasks and projects.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Best Practices</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <ChevronRight className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                      <div>
                        <h4 className="font-bold">Clear Task Descriptions</h4>
                        <p className="text-sm text-muted-foreground">Write detailed descriptions so everyone understands the task.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <ChevronRight className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                      <div>
                        <h4 className="font-bold">Set Realistic Deadlines</h4>
                        <p className="text-sm text-muted-foreground">Agree on achievable deadlines with your team.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <ChevronRight className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                      <div>
                        <h4 className="font-bold">Break Down Complex Tasks</h4>
                        <p className="text-sm text-muted-foreground">Divide large tasks into smaller, manageable subtasks.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>

        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Guide;