import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Lightbulb, HelpCircle, Library, Users, BarChart2, Settings, Award, Clock, Target, Calendar, List, Tag, Flag, Bell, Share2, MessageSquare, UserPlus, GitBranch, Zap, PieChart, TrendingUp, GitCommit, GitPullRequest, GitMerge, Code, Terminal, Server, Database, Cloud, Globe, Shield, Key, Lock, Mail, Phone, MapPin, Compass, Star, Heart, ThumbsUp, Eye, Search, Filter, SortAsc, Download, Upload, Plus, Minus, Edit, Trash2, Copy, Save, Maximize, Minimize, X, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, MoreVertical, MoreHorizontal, Menu, Grid, Layout, Columns, Rows, Table, Kanban, Activity, ChartBar, ChartLine, ChartPie, ChartArea } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const GuideModal = () => {
  const [activeTab, setActiveTab] = useState("school");

  const sections = {
    school: {
      title: "School of Learning",
      icon: <BookOpen className="h-4 w-4" />,
      content: (
        <ScrollArea className="h-[600px] p-4">
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-bold mb-4">Introduction to TodoList 2025</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Welcome to the School of Learning for TodoList 2025. Here you will learn everything you need to know to become a productivity master.
              </p>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="text-lg font-semibold">Lesson 1: Getting Started</h3>
                  <p className="text-sm text-muted-foreground">Learn the basics of creating and managing tasks.</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="text-lg font-semibold">Lesson 2: Advanced Features</h3>
                  <p className="text-sm text-muted-foreground">Explore tags, priorities, and subtasks.</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="text-lg font-semibold">Lesson 3: Collaboration</h3>
                  <p className="text-sm text-muted-foreground">Learn how to share tasks and work with others.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">Advanced Techniques</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-secondary pl-4">
                  <h3 className="text-lg font-semibold">Time Management</h3>
                  <p className="text-sm text-muted-foreground">Master the art of prioritizing and scheduling.</p>
                </div>
                <div className="border-l-4 border-secondary pl-4">
                  <h3 className="text-lg font-semibold">Productivity Hacks</h3>
                  <p className="text-sm text-muted-foreground">Discover secrets to getting more done in less time.</p>
                </div>
                <div className="border-l-4 border-secondary pl-4">
                  <h3 className="text-lg font-semibold">Automation</h3>
                  <p className="text-sm text-muted-foreground">Learn how to automate repetitive tasks.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">Expert Level</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-destructive pl-4">
                  <h3 className="text-lg font-semibold">Custom Workflows</h3>
                  <p className="text-sm text-muted-foreground">Create your own productivity systems.</p>
                </div>
                <div className="border-l-4 border-destructive pl-4">
                  <h3 className="text-lg font-semibold">Integration Mastery</h3>
                  <p className="text-sm text-muted-foreground">Connect TodoList with other tools.</p>
                </div>
                <div className="border-l-4 border-destructive pl-4">
                  <h3 className="text-lg font-semibold">Data Analysis</h3>
                  <p className="text-sm text-muted-foreground">Analyze your productivity patterns.</p>
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>
      ),
    },
    advisor: {
      title: "Productivity Advisor",
      icon: <Lightbulb className="h-4 w-4" />,
      content: (
        <ScrollArea className="h-[600px] p-4">
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-bold mb-4">Personalized Advice</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Get tailored recommendations based on your usage patterns and goals.
              </p>
              <div className="space-y-4">
                <div className="bg-primary/10 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Weekly Review</h3>
                  <p className="text-sm text-muted-foreground">Analyze your week and plan for the next one.</p>
                </div>
                <div className="bg-secondary/10 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Goal Setting</h3>
                  <p className="text-sm text-muted-foreground">Set SMART goals and track your progress.</p>
                </div>
                <div className="bg-destructive/10 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Time Audit</h3>
                  <p className="text-sm text-muted-foreground">Identify time wasters and optimize your schedule.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">Quick Tips</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-accent p-3 rounded-lg">
                  <h4 className="font-medium">Pomodoro Technique</h4>
                  <p className="text-sm text-muted-foreground">Work for 25 minutes, then take a 5-minute break.</p>
                </div>
                <div className="bg-accent p-3 rounded-lg">
                  <h4 className="font-medium">Eat the Frog</h4>
                  <p className="text-sm text-muted-foreground">Do your hardest task first thing in the morning.</p>
                </div>
                <div className="bg-accent p-3 rounded-lg">
                  <h4 className="font-medium">Two-Minute Rule</h4>
                  <p className="text-sm text-muted-foreground">If it takes less than 2 minutes, do it now.</p>
                </div>
                <div className="bg-accent p-3 rounded-lg">
                  <h4 className="font-medium">Batching</h4>
                  <p className="text-sm text-muted-foreground">Group similar tasks together to minimize context switching.</p>
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>
      ),
    },
    examples: {
      title: "Usage Examples",
      icon: <HelpCircle className="h-4 w-4" />,
      content: (
        <ScrollArea className="h-[600px] p-4">
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-bold mb-4">Common Scenarios</h2>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">Project Management</h3>
                  <p className="text-sm text-muted-foreground mb-2">How to manage a complex project with multiple tasks and subtasks.</p>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                    <pre className="text-xs overflow-x-auto">
{`1. Create main project task
2. Add subtasks for each phase
3. Set priorities and deadlines
4. Assign tags for categorization
5. Track progress with completion checkboxes`}
                    </pre>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">Daily Planning</h3>
                  <p className="text-sm text-muted-foreground mb-2">How to plan your day effectively.</p>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                    <pre className="text-xs overflow-x-auto">
{`1. Review yesterday's tasks
2. Identify top 3 priorities
3. Schedule time blocks
4. Set reminders
5. Review at end of day`}
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">Industry-Specific Examples</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">For Developers</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Bug tracking</li>
                    <li>• Feature development</li>
                    <li>• Code reviews</li>
                    <li>• Deployment checklists</li>
                  </ul>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">For Designers</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Design sprints</li>
                    <li>• Client feedback</li>
                    <li>• Asset management</li>
                    <li>• Version control</li>
                  </ul>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">For Managers</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Team coordination</li>
                    <li>• Meeting agendas</li>
                    <li>• Performance reviews</li>
                    <li>• Budget tracking</li>
                  </ul>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">For Students</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Assignment tracking</li>
                    <li>• Exam preparation</li>
                    <li>• Research projects</li>
                    <li>• Group study sessions</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>
      ),
    },
    encyclopedia: {
      title: "Productivity Encyclopedia",
      icon: <Library className="h-4 w-4" />,
      content: (
        <ScrollArea className="h-[600px] p-4">
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-bold mb-4">Productivity Methodologies</h2>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">Getting Things Done (GTD)</h3>
                  <p className="text-sm text-muted-foreground mb-2">A method for organizing tasks and projects.</p>
                  <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                    <li>• Capture everything</li>
                    <li>• Clarify next actions</li>
                    <li>• Organize by context</li>
                    <li>• Reflect weekly</li>
                    <li>• Engage with work</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">Agile & Scrum</h3>
                  <p className="text-sm text-muted-foreground mb-2">Iterative approach to project management.</p>
                  <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                    <li>• Sprint planning</li>
                    <li>• Daily standups</li>
                    <li>• Sprint reviews</li>
                    <li>• Retrospectives</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">Kanban</h3>
                  <p className="text-sm text-muted-foreground mb-2">Visual workflow management system.</p>
                  <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                    <li>• Visualize work</li>
                    <li>• Limit work in progress</li>
                    <li>• Manage flow</li>
                    <li>• Make policies explicit</li>
                    <li>• Improve collaboratively</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">Productivity Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium mb-1">Time Tracking</h4>
                  <p className="text-sm text-muted-foreground">Tools to monitor how you spend your time.</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium mb-1">Task Automation</h4>
                  <p className="text-sm text-muted-foreground">Automate repetitive tasks to save time.</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium mb-1">Note Taking</h4>
                  <p className="text-sm text-muted-foreground">Capture and organize your thoughts and ideas.</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium mb-1">Calendar Apps</h4>
                  <p className="text-sm text-muted-foreground">Schedule and manage your time effectively.</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium mb-1">Focus Apps</h4>
                  <p className="text-sm text-muted-foreground">Block distractions and maintain concentration.</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium mb-1">Collaboration Tools</h4>
                  <p className="text-sm text-muted-foreground">Work effectively with teams and colleagues.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">Productivity Metrics</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <BarChart2 className="h-4 w-4 text-primary" />
                  <span className="font-medium">Task Completion Rate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-medium">Time per Task</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="font-medium">Goal Achievement</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="font-medium">Productivity Trends</span>
                </div>
                <div className="flex items-center space-x-2">
                  <PieChart className="h-4 w-4 text-primary" />
                  <span className="font-medium">Time Distribution</span>
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>
      ),
    },
    collaboration: {
      title: "Collaboration Guide",
      icon: <Users className="h-4 w-4" />,
      content: (
        <ScrollArea className="h-[600px] p-4">
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-bold mb-4">Team Workflows</h2>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">Shared Task Lists</h3>
                  <p className="text-sm text-muted-foreground mb-2">How to create and manage shared task lists.</p>
                  <ol className="text-sm text-muted-foreground space-y-1 pl-4">
                    <li>1. Create a new shared list</li>
                    <li>2. Invite team members</li>
                    <li>3. Assign tasks to specific members</li>
                    <li>4. Set permissions and roles</li>
                    <li>5. Track progress together</li>
                  </ol>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">Real-time Collaboration</h3>
                  <p className="text-sm text-muted-foreground mb-2">Work together in real-time on tasks and projects.</p>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                    <pre className="text-xs overflow-x-auto">
{`• See who's currently working on what
• Get instant notifications on changes
• Comment and discuss tasks in real-time
• Synchronized views across all devices`}
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">Communication Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Task Comments</h4>
                  <p className="text-sm text-muted-foreground">Discuss specific tasks with your team.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Team Chat</h4>
                  <p className="text-sm text-muted-foreground">Quick messaging for the whole team.</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Mentions</h4>
                  <p className="text-sm text-muted-foreground">Get someone's attention with @mentions.</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Notifications</h4>
                  <p className="text-sm text-muted-foreground">Stay updated on important changes.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">Best Practices</h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-full mt-1">
                    <Award className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Clear Task Descriptions</h4>
                    <p className="text-sm text-muted-foreground">Write detailed descriptions so everyone understands the task.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-secondary/10 p-2 rounded-full mt-1">
                    <Calendar className="h-4 w-4 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Set Realistic Deadlines</h4>
                    <p className="text-sm text-muted-foreground">Agree on achievable deadlines with your team.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-destructive/10 p-2 rounded-full mt-1">
                    <List className="h-4 w-4 text-destructive" />
                  </div>
                  <div>
                    <h4 className="font-medium">Break Down Complex Tasks</h4>
                    <p className="text-sm text-muted-foreground">Divide large tasks into smaller, manageable subtasks.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>
      ),
    },
    analytics: {
      title: "Analytics & Insights",
      icon: <BarChart2 className="h-4 w-4" />,
      content: (
        <ScrollArea className="h-[600px] p-4">
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-bold mb-4">Productivity Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">87%</div>
                  <div className="text-sm text-muted-foreground">Task Completion Rate</div>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-secondary mb-2">42</div>
                  <div className="text-sm text-muted-foreground">Tasks Completed</div>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-destructive mb-2">8</div>
                  <div className="text-sm text-muted-foreground">Overdue Tasks</div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Productivity Trends</h3>
                <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground">Interactive Chart Would Go Here</span>
                </div>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Visual representation of your productivity over time
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">Time Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">Time by Priority</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">High Priority</span>
                      <span className="text-sm font-medium">12.5 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Medium Priority</span>
                      <span className="text-sm font-medium">8.3 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Low Priority</span>
                      <span className="text-sm font-medium">4.2 hours</span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">Time by Category</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Work</span>
                      <span className="text-sm font-medium">18.7 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Personal</span>
                      <span className="text-sm font-medium">6.3 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Learning</span>
                      <span className="text-sm font-medium">4.5 hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">Recommendations</h2>
              <div className="space-y-4">
                <div className="bg-primary/10 border-l-4 border-primary p-4">
                  <h3 className="text-lg font-semibold mb-2">Focus on High-Priority Tasks</h3>
                  <p className="text-sm text-muted-foreground">
                    You're spending a lot of time on medium-priority tasks. Consider focusing more on high-priority items to maximize impact.
                  </p>
                </div>

                <div className="bg-secondary/10 border-l-4 border-secondary p-4">
                  <h3 className="text-lg font-semibold mb-2">Improve Work-Life Balance</h3>
                  <p className="text-sm text-muted-foreground">
                    Your work tasks are dominating your time. Try to allocate more time for personal development and relaxation.
                  </p>
                </div>

                <div className="bg-accent/10 border-l-4 border-accent p-4">
                  <h3 className="text-lg font-semibold mb-2">Reduce Multitasking</h3>
                  <p className="text-sm text-muted-foreground">
                    You have many tasks in progress simultaneously. Focus on completing tasks before starting new ones.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>
      ),
    },
    settings: {
      title: "Advanced Settings",
      icon: <Settings className="h-4 w-4" />,
      content: (
        <ScrollArea className="h-[600px] p-4">
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-bold mb-4">General Settings</h2>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Display Options</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="dark-mode-guide" className="flex items-center">
                        <span>Dark Mode</span>
                      </Label>
                      <Switch id="dark-mode-guide" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="compact-view" className="flex items-center">
                        <span>Compact View</span>
                      </Label>
                      <Switch id="compact-view" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="animations" className="flex items-center">
                        <span>Enable Animations</span>
                      </Label>
                      <Switch id="animations" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="desktop-notifications" className="flex items-center">
                        <span>Desktop Notifications</span>
                      </Label>
                      <Switch id="desktop-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notifications" className="flex items-center">
                        <span>Email Notifications</span>
                      </Label>
                      <Switch id="email-notifications" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sound-alerts" className="flex items-center">
                        <span>Sound Alerts</span>
                      </Label>
                      <Switch id="sound-alerts" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">Task Defaults</h2>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Default Priority</h3>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue placeholder="Select default priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Default Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">work</Badge>
                    <Badge variant="secondary">personal</Badge>
                    <Badge variant="secondary">urgent</Badge>
                  </div>
                  <Input
                    placeholder="Add new default tag"
                    className="mt-3"
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">Integrations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 text-center">
                  <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">G</span>
                  </div>
                  <h4 className="font-medium mb-1">Google Calendar</h4>
                  <p className="text-sm text-muted-foreground mb-3">Sync with your Google Calendar</p>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>

                <div className="border rounded-lg p-4 text-center">
                  <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">O</span>
                  </div>
                  <h4 className="font-medium mb-1">Outlook</h4>
                  <p className="text-sm text-muted-foreground mb-3">Sync with Outlook Calendar</p>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>

                <div className="border rounded-lg p-4 text-center">
                  <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">S</span>
                  </div>
                  <h4 className="font-medium mb-1">Slack</h4>
                  <p className="text-sm text-muted-foreground mb-3">Get notifications in Slack</p>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>

                <div className="border rounded-lg p-4 text-center">
                  <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">T</span>
                  </div>
                  <h4 className="font-medium mb-1">Trello</h4>
                  <p className="text-sm text-muted-foreground mb-3">Sync with Trello boards</p>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>

                <div className="border rounded-lg p-4 text-center">
                  <div className="h-8 w-8 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">A</span>
                  </div>
                  <h4 className="font-medium mb-1">Asana</h4>
                  <p className="text-sm text-muted-foreground mb-3">Sync with Asana projects</p>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>

                <div className="border rounded-lg p-4 text-center">
                  <div className="h-8 w-8 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">J</span>
                  </div>
                  <h4 className="font-medium mb-1">Jira</h4>
                  <p className="text-sm text-muted-foreground mb-3">Sync with Jira issues</p>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">Data & Privacy</h2>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Data Export</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Export your tasks and data for backup or migration.
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export as JSON
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export as CSV
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Data Import</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Import tasks from other applications or backups.
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Import from JSON
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Import from CSV
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Privacy Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="analytics" className="flex items-center">
                        <span>Enable Analytics</span>
                      </Label>
                      <Switch id="analytics" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="personalization" className="flex items-center">
                        <span>Enable Personalization</span>
                      </Label>
                      <Switch id="personalization" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="data-sharing" className="flex items-center">
                        <span>Allow Data Sharing</span>
                      </Label>
                      <Switch id="data-sharing" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>
      ),
    },
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          <BookOpen className="h-4 w-4 mr-2" />
          Open Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl h-[700px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center">
            <BookOpen className="h-6 w-6 mr-2" />
            TodoList 2025 Comprehensive Guide
          </DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-6">
            <TabsTrigger value="school">
              <BookOpen className="h-4 w-4 mr-1" />
              School
            </TabsTrigger>
            <TabsTrigger value="advisor">
              <Lightbulb className="h-4 w-4 mr-1" />
              Advisor
            </TabsTrigger>
            <TabsTrigger value="examples">
              <HelpCircle className="h-4 w-4 mr-1" />
              Examples
            </TabsTrigger>
            <TabsTrigger value="encyclopedia">
              <Library className="h-4 w-4 mr-1" />
              Encyclopedia
            </TabsTrigger>
            <TabsTrigger value="collaboration">
              <Users className="h-4 w-4 mr-1" />
              Collaboration
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart2 className="h-4 w-4 mr-1" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </TabsTrigger>
          </TabsList>
          {Object.entries(sections).map(([key, section]) => (
            <TabsContent key={key} value={key}>
              {section.content}
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default GuideModal;