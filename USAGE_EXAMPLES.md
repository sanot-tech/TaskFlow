# Usage Examples

## Basic Usage

### 1. Creating a Task
```tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function TaskCreator() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateTask = () => {
    // This would be handled by your task management system
    console.log('Creating task:', { title, description });
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input
        placeholder="Task description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button onClick={handleCreateTask}>Create Task</Button>
    </div>
  );
}
```

### 2. Using the Alarm Timer
```tsx
import { useAlarmTimer } from '@/hooks/useAlarmTimer';
import { Button } from '@/components/ui/button';

function TimerExample() {
  const { startTimer, stopTimer, isTimerActive, getTimeForTask } = useAlarmTimer();

  const handleStartTimer = () => {
    startTimer('task-123', 'Complete Project', 25);
  };

  const handleStopTimer = () => {
    stopTimer('task-123');
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleStartTimer}>Start 25-minute Timer</Button>
      <Button onClick={handleStopTimer} variant="destructive">
        Stop Timer
      </Button>
      {isTimerActive('task-123') && (
        <div className="text-lg font-mono">
          Remaining: {getTimeForTask('task-123')}
        </div>
      )}
    </div>
  );
}
```

### 3. User Profile Management
```tsx
import { useUserProfile } from '@/hooks/useUserProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function ProfileEditor() {
  const { profile, updateProfile, isLoading } = useUserProfile();
  const [username, setUsername] = useState('');

  if (isLoading) return <div>Loading...</div>;
  if (!profile) return <div>No profile found</div>;

  const handleUpdateProfile = () => {
    updateProfile({ username });
  };

  return (
    <div className="space-y-4">
      <h2>Edit Profile</h2>
      <Input
        placeholder="Username"
        value={username || profile.username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Button onClick={handleUpdateProfile}>Update Profile</Button>
    </div>
  );
}
```

## Advanced Usage

### 1. Custom Task Card Component
```tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface CustomTaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    priority: string;
    priorityColor: string;
    dueDate?: Date;
    tags: string[];
  };
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CustomTaskCard: React.FC<CustomTaskCardProps> = ({
  task,
  onToggle,
  onDelete,
}) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className={task.completed ? 'line-through text-gray-500' : ''}>
            {task.title}
          </CardTitle>
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggle(task.id)}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-gray-600">{task.description}</p>
        
        <div className="flex items-center gap-2">
          <Badge className={task.priorityColor}>{task.priority}</Badge>
          {task.dueDate && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(task.dueDate, 'MMM d')}
            </span>
          )}
        </div>

        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(task.id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};
```

### 2. Avatar Constructor Integration
```tsx
import { useState } from 'react';
import { AvatarConstructor } from '@/components/AvatarConstructor';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

function AvatarManager() {
  const [showConstructor, setShowConstructor] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');

  const handleApplyAvatar = (url: string) => {
    setAvatarUrl(url);
    setShowConstructor(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar className="w-16 h-16">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt="User Avatar" />
          ) : (
            <AvatarFallback>?</AvatarFallback>
          )}
        </Avatar>
        <Button onClick={() => setShowConstructor(true)}>
          Customize Avatar
        </Button>
      </div>

      {showConstructor && (
        <AvatarConstructor
          currentAvatar={avatarUrl}
          onApply={handleApplyAvatar}
          onClose={() => setShowConstructor(false)}
        />
      )}
    </div>
  );
}
```

### 3. Custom Hook Example
```tsx
import { useState, useEffect } from 'react';

// Custom hook for debouncing
export const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Usage in component
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Perform search
      console.log('Searching for:', debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      type="text"
      placeholder="Search tasks..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
}
```

### 4. Error Boundary Example
```tsx
import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to Sentry or logging service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-100 border border-red-400 rounded">
          <h2 className="text-red-800 font-bold">Something went wrong</h2>
          <p className="text-red-600">Please refresh the page</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}
```

### 5. Virtualized List (Planned)
```tsx
import { FixedSizeList as List } from 'react-window';
import { TaskCard } from '@/components/TaskCard';

interface VirtualizedTaskListProps {
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    completed: boolean;
    priority: string;
    priorityColor: string;
    dueDate?: Date;
    tags: string[];
    subtasks: Array<{
      id: string;
      title: string;
      completed: boolean;
    }>;
  }>;
  onToggleCompletion: (id: string) => void;
  onDelete: (id: string) => void;
  onAddSubtask: (id: string, title: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
}

export const VirtualizedTaskList: React.FC<VirtualizedTaskListProps> = ({
  tasks,
  onToggleCompletion,
  onDelete,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
}) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const task = tasks[index];
    return (
      <div style={style}>
        <TaskCard
          key={task.id}
          task={task}
          onToggleCompletion={onToggleCompletion}
          onDelete={onDelete}
          onAddSubtask={onAddSubtask}
          onToggleSubtask={onToggleSubtask}
          onDeleteSubtask={onDeleteSubtask}
        />
      </div>
    );
  };

  return (
    <List
      height={600}
      itemCount={tasks.length}
      itemSize={200}
      width="100%"
    >
      {Row}
    </List>
  );
};
```

## Integration Examples

### 1. Integrating with External API
```tsx
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface ExternalData {
  id: number;
  title: string;
  completed: boolean;
}

function ExternalApiExample() {
  const { data, isLoading, error } = useQuery<ExternalData[]>({
    queryKey: ['todos'],
    queryFn: async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos');
      if (!response.ok) {
        throw new Error('Network error');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>External API Data</h2>
      <ul>
        {data?.slice(0, 5).map((item) => (
          <li key={item.id} className={item.completed ? 'line-through' : ''}>
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 2. Integrating with Web Notifications
```tsx
import { useEffect } from 'react';
import { useAlarmTimer } from '@/hooks/useAlarmTimer';

function NotificationExample() {
  const { alarms } = useAlarmTimer();

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    // Show notification when alarm triggers
    alarms.forEach((alarm) => {
      if (alarm.remainingTime === 0 && alarm.isActive) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('⏰ Timer Complete!', {
            body: `Task "${alarm.taskTitle}" is done!`,
            icon: '/favicon.ico',
          });
        }
      }
    });
  }, [alarms]);

  return <div>Notification system active</div>;
}
```

### 3. Integrating with IndexedDB
```tsx
import { useState, useEffect } from 'react';

// IndexedDB wrapper
const DB_NAME = 'TodoListDB';
const STORE_NAME = 'tasks';

function IndexedDBExample() {
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const initDB = async () => {
      return new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
          const database = (event.target as IDBOpenDBRequest).result;
          if (!database.objectStoreNames.contains(STORE_NAME)) {
            database.createObjectStore(STORE_NAME, { keyPath: 'id' });
          }
        };
      });
    };

    initDB().then(setDb).catch(console.error);
  }, []);

  const addTask = async (task: any) => {
    if (!db) return;
    
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.add(task);
    
    return new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  };

  return (
    <div>
      <button onClick={() => addTask({ id: Date.now(), title: 'New Task' })}>
        Add to IndexedDB
      </button>
    </div>
  );
}
```

### 4. Integrating with BroadcastChannel (Multi-tab Sync)
```tsx
import { useEffect, useState } from 'react';

function MultiTabSyncExample() {
  const [messages, setMessages] = useState<string[]>([]);
  const channel = new BroadcastChannel('todo-sync');

  useEffect(() => {
    channel.onmessage = (event) => {
      setMessages((prev) => [...prev, `Received: ${event.data}`]);
    };

    return () => {
      channel.close();
    };
  }, []);

  const sendMessage = (message: string) => {
    channel.postMessage(message);
  };

  return (
    <div>
      <button onClick={() => sendMessage('Hello from tab 1')}>
        Send Message
      </button>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 5. Integrating with Vercel Edge Config (Feature Flags)
```tsx
import { useEffect, useState } from 'react';
import { get } from '@vercel/edge-config';

function FeatureFlagExample() {
  const [enableAlarms, setEnableAlarms] = useState(false);

  useEffect(() => {
    const fetchFeatureFlags = async () => {
      try {
        const flags = await get('featureFlags');
        setEnableAlarms(flags?.enableAlarms || false);
      } catch (error) {
        console.error('Failed to fetch feature flags:', error);
      }
    };

    fetchFeatureFlags();
  }, []);

  return (
    <div>
      {enableAlarms ? (
        <AlarmControl />
      ) : (
        <p>Alarms feature is disabled</p>
      )}
    </div>
  );
}
```

## Testing Examples

### 1. Unit Test for Custom Hook
```tsx
// __tests__/useDebounce.test.ts
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@/hooks/useDebounce';

describe('useDebounce', () => {
  jest.useFakeTimers();

  it('should debounce value', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'test' } }
    );

    expect(result.current).toBe('test');

    rerender({ value: 'new value' });
    expect(result.current).toBe('test');

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('new value');
  });
});
```

### 2. Component Test
```tsx
// __tests__/TaskCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskCard } from '@/components/TaskCard';

const mockTask = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  completed: false,
  priority: 'High',
  priorityColor: 'bg-red-500',
  tags: ['test'],
  subtasks: [],
};

describe('TaskCard', () => {
  it('renders task title', () => {
    render(
      <TaskCard
        task={mockTask}
        onToggleCompletion={jest.fn()}
        onDelete={jest.fn()}
        onAddSubtask={jest.fn()}
        onToggleSubtask={jest.fn()}
        onDeleteSubtask={jest.fn()}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('calls onToggleCompletion when checkbox is clicked', () => {
    const mockToggle = jest.fn();
    render(
      <TaskCard
        task={mockTask}
        onToggleCompletion={mockToggle}
        onDelete={jest.fn()}
        onAddSubtask={jest.fn()}
        onToggleSubtask={jest.fn()}
        onDeleteSubtask={jest.fn()}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockToggle).toHaveBeenCalledWith('1');
  });
});
```

### 3. Integration Test
```tsx
// __tests__/UserProfile.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { UserProfileCard } from '@/components/UserProfileCard';

const mockProfile = {
  name: 'Test User',
  email: 'test@example.com',
  avatar: 'https://example.com/avatar.jpg',
  settings: {
    notifications: true,
    soundEnabled: true,
  },
};

describe('UserProfileCard', () => {
  it('renders user profile', () => {
    render(
      <UserProfileCard
        profile={mockProfile}
        onUpdateProfile={jest.fn()}
      />
    );

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('shows edit mode when edit button is clicked', () => {
    render(
      <UserProfileCard
        profile={mockProfile}
        onUpdateProfile={jest.fn()}
      />
    );

    const editButton = screen.getByText('Edit Profile');
    fireEvent.click(editButton);

    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  });
});
```

## Performance Examples

### 1. Memoization Example
```tsx
import React, { useMemo, useCallback } from 'react';

interface ExpensiveComponentProps {
  data: Array<{ id: number; value: string }>;
  onItemSelect: (id: number) => void;
}

const ExpensiveComponent: React.FC<ExpensiveComponentProps> = React.memo(
  ({ data, onItemSelect }) => {
    // Expensive calculation
    const processedData = useMemo(() => {
      return data.map((item) => ({
        ...item,
        value: item.value.toUpperCase(),
      }));
    }, [data]);

    const handleSelect = useCallback((id: number) => {
      onItemSelect(id);
    }, [onItemSelect]);

    return (
      <div>
        {processedData.map((item) => (
          <div key={item.id} onClick={() => handleSelect(item.id)}>
            {item.value}
          </div>
        ))}
      </div>
    );
  }
);
```

### 2. Lazy Loading Example
```tsx
import React, { Suspense } from 'react';

// Lazy load heavy components
const HeavyChart = React.lazy(() => import('./HeavyChart'));
const HeavyTable = React.lazy(() => import('./HeavyTable'));

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<div>Loading chart...</div>}>
        <HeavyChart />
      </Suspense>
      <Suspense fallback={<div>Loading table...</div>}>
        <HeavyTable />
      </Suspense>
    </div>
  );
}
```

### 3. Code Splitting by Route
```tsx
// App.tsx
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Index = React.lazy(() => import('./pages/Index'));
const Guide = React.lazy(() => import('./pages/Guide'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

## Security Examples

### 1. Input Validation with Zod
```tsx
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.date().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

function TaskForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  const onSubmit = (data: TaskFormData) => {
    console.log('Valid data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} />
      {errors.title && <span>{errors.title.message}</span>}
      
      <select {...register('priority')}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

### 2. HTML Sanitization
```tsx
import DOMPurify from 'dompurify';

function SafeHTMLComponent({ htmlContent }: { htmlContent: string }) {
  const sanitizedHTML = DOMPurify.sanitize(htmlContent);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
}
```

### 3. XSS Protection
```tsx
import React from 'react';

function SafeTextComponent({ text }: { text: string }) {
  // Escape HTML entities
  const escapeHTML = (str: string) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  return <div>{escapeHTML(text)}</div>;
}
```

## Deployment Examples

### 1. Vercel Deployment Configuration
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' https://api.dicebear.com https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.dicebear.com; frame-ancestors 'none';"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

### 2. Environment Variables
```env
# .env.production
VITE_SENTRY_DSN=https://your-sentry-dsn.ingest.sentry.io/...
VITE_VERCEL_ANALYTICS_ID=your-analytics-id
VITE_API_BASE_URL=https://api.example.com
VITE_FEATURE_FLAGS=enableAlarms,enableAvatarConstructor
```

### 3. GitHub Actions CI/CD
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Troubleshooting Examples

### 1. Debugging Performance Issues
```tsx
import { useEffect } from 'react';

function PerformanceMonitor() {
  useEffect(() => {
    // Monitor component render count
    const renderCount = new Map<string, number>();
    
    const originalRender = React.createElement;
    React.createElement = function(type, props, ...children) {
      const name = typeof type === 'string' ? type : type?.displayName || 'Component';
      renderCount.set(name, (renderCount.get(name) || 0) + 1);
      return originalRender.call(this, type, props, ...children);
    };

    return () => {
      console.log('Render counts:', Object.fromEntries(renderCount));
      React.createElement = originalRender;
    };
  }, []);

  return null;
}
```

### 2. Memory Leak Detection
```tsx
import { useEffect, useRef } from 'react';

function MemoryLeakDetector() {
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // This would cause a memory leak if not cleaned up
    intervalRef.current = setInterval(() => {
      console.log('Memory leak test');
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return <div>Memory leak detector active</div>;
}
```

### 3. Error Recovery
```tsx
import { useState, useEffect } from 'react';

function ErrorRecoveryExample() {
  const [data, setData] = useState(null);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = async () => {
    try {
      const response = await fetch('https://api.example.com/data');
      if (!response.ok) throw new Error('Network error');
      const result = await response.json();
      setData(result);
      setError(null);
      setRetryCount(0);
    } catch (err) {
      setError(err as Error);
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
          fetchData();
        }, 1000 * (retryCount + 1));
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
        <p>Retry count: {retryCount}/3</p>
        {retryCount < 3 && <p>Retrying...</p>}
      </div>
    );
  }

  return <div>{data ? 'Data loaded' : 'Loading...'}</div>;
}