import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Lightbulb, HelpCircle, Library, Users, Settings } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Guide = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <BookOpen className="h-8 w-8 mr-3" />
          <h1 className="text-3xl font-bold">TodoList 2025 Guide</h1>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                School of Learning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <section>
                <h2 className="text-xl font-bold mb-4">Introduction to TodoList 2025</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Welcome to the School of Learning for TodoList 2025. Here you will learn everything you need to know to become a productivity master.
                </p>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold">Lesson 1: Getting Started</h3>
                    <p className="text-sm text-muted-foreground">Learn the basics of creating and managing tasks.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Lesson 2: Advanced Features</h3>
                    <p className="text-sm text-muted-foreground">Explore tags, priorities, and subtasks.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Lesson 3: Collaboration</h3>
                    <p className="text-sm text-muted-foreground">Learn how to share tasks and work with others.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">Advanced Techniques</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold">Time Management</h3>
                    <p className="text-sm text-muted-foreground">Master the art of prioritizing and scheduling.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Productivity Hacks</h3>
                    <p className="text-sm text-muted-foreground">Discover secrets to getting more done in less time.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Automation</h3>
                    <p className="text-sm text-muted-foreground">Learn how to automate repetitive tasks.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">Expert Level</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold">Custom Workflows</h3>
                    <p className="text-sm text-muted-foreground">Create your own productivity systems.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Integration Mastery</h3>
                    <p className="text-sm text-muted-foreground">Connect TodoList with other tools.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Data Analysis</h3>
                    <p className="text-sm text-muted-foreground">Analyze your productivity patterns.</p>
                  </div>
                </div>
              </section>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2" />
                Productivity Advisor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <section>
                <h2 className="text-xl font-bold mb-4">Personalized Advice</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Get tailored recommendations based on your usage patterns and goals.
                </p>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold">Weekly Review</h3>
                    <p className="text-sm text-muted-foreground">Analyze your week and plan for the next one.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Goal Setting</h3>
                    <p className="text-sm text-muted-foreground">Set SMART goals and track your progress.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Time Audit</h3>
                    <p className="text-sm text-muted-foreground">Identify time wasters and optimize your schedule.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">Quick Tips</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <h4 className="font-medium">Pomodoro Technique</h4>
                    <p className="text-sm text-muted-foreground">Work for 25 minutes, then take a 5-minute break.</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Eat the Frog</h4>
                    <p className="text-sm text-muted-foreground">Do your hardest task first thing in the morning.</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Two-Minute Rule</h4>
                    <p className="text-sm text-muted-foreground">If it takes less than 2 minutes, do it now.</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Batching</h4>
                    <p className="text-sm text-muted-foreground">Group similar tasks together to minimize context switching.</p>
                  </div>
                </div>
              </section>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="h-5 w-5 mr-2" />
                Usage Examples
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <section>
                <h2 className="text-xl font-bold mb-4">Common Scenarios</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold">Project Management</h3>
                    <p className="text-sm text-muted-foreground">How to manage a complex project with multiple tasks and subtasks.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Daily Planning</h3>
                    <p className="text-sm text-muted-foreground">How to plan your day effectively.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">Industry-Specific Examples</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <h4 className="font-medium">For Developers</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                      <li>• Bug tracking</li>
                      <li>• Feature development</li>
                      <li>• Code reviews</li>
                      <li>• Deployment checklists</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium">For Designers</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                      <li>• Design sprints</li>
                      <li>• Client feedback</li>
                      <li>• Asset management</li>
                      <li>• Version control</li>
                    </ul>
                  </div>
                </div>
              </section>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Library className="h-5 w-5 mr-2" />
                Productivity Encyclopedia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <section>
                <h2 className="text-xl font-bold mb-4">Productivity Methodologies</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold">Getting Things Done (GTD)</h3>
                    <p className="text-sm text-muted-foreground">A method for organizing tasks and projects.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Agile & Scrum</h3>
                    <p className="text-sm text-muted-foreground">Iterative approach to project management.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Kanban</h3>
                    <p className="text-sm text-muted-foreground">Visual workflow management system.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">Productivity Tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <h4 className="font-medium">Time Tracking</h4>
                    <p className="text-sm text-muted-foreground">Tools to monitor how you spend your time.</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Task Automation</h4>
                    <p className="text-sm text-muted-foreground">Automate repetitive tasks to save time.</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Note Taking</h4>
                    <p className="text-sm text-muted-foreground">Capture and organize your thoughts and ideas.</p>
                  </div>
                </div>
              </section>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Collaboration Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <section>
                <h2 className="text-xl font-bold mb-4">Team Workflows</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold">Shared Task Lists</h3>
                    <p className="text-sm text-muted-foreground">How to create and manage shared task lists.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Real-time Collaboration</h3>
                    <p className="text-sm text-muted-foreground">Work together in real-time on tasks and projects.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">Best Practices</h2>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">Clear Task Descriptions</h4>
                    <p className="text-sm text-muted-foreground">Write detailed descriptions so everyone understands the task.</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Set Realistic Deadlines</h4>
                    <p className="text-sm text-muted-foreground">Agree on achievable deadlines with your team.</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Break Down Complex Tasks</h4>
                    <p className="text-sm text-muted-foreground">Divide large tasks into smaller, manageable subtasks.</p>
                  </div>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>

        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Guide;