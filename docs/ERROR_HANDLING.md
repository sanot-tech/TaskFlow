# Error Handling Documentation

## Overview
This document describes the error handling strategy for the TodoList application. We use a combination of error boundaries, try-catch blocks, and global error handlers to ensure graceful failure and good user experience.

## Error Handling Strategy

### 1. Error Hierarchy
```
┌─────────────────────────────────────────────────────────────┐
│                    Error Handling Strategy                  │
├─────────────────────────────────────────────────────────────┤
│ 1. Global Error Boundary (App-level)                        │
│ 2. Component Error Boundaries (Feature-level)               │
│ 3. Try-Catch Blocks (Operation-level)                       │
│ 4. Promise Error Handling (Async-level)                     │
│ 5. Global Error Listeners (Browser-level)                   │
└─────────────────────────────────────────────────────────────┘
```

### 2. Error Types
```typescript
// src/types/errors.ts
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ValidationError {
  field: string;
  message: string;
  value: any;
}

export interface NetworkError {
  status: number;
  statusText: string;
  url: string;
  data?: any;
}

export interface StorageError {
  key: string;
  operation: 'get' | 'set' | 'remove';
  error: Error;
}
```

## Global Error Boundary

### 1. App-Level Error Boundary
```typescript
// src/components/AppErrorBoundary.tsx
import React from 'react';
import { logger } from '@/utils/logger';
import * as Sentry from '@sentry/react';

interface AppErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class AppErrorBoundary extends React.Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  constructor(props: AppErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log error
    logger.error('App error caught by boundary', error, {
      componentStack: errorInfo.componentStack,
    });
    
    // Send to Sentry
    Sentry.captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      },
    });
    
    // Send to monitoring
    this.sendToMonitoring(error, errorInfo);
  }

  private sendToMonitoring(error: Error, errorInfo: React.ErrorInfo) {
    // Send to external monitoring service
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Send to Sentry (already done above)
    // Send to custom endpoint if needed
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorData),
    }).catch(() => {
      // Silently fail - we don't want to cause more errors
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Something went wrong
              </h2>
              <p className="text-gray-600 mb-6">
                We're sorry, but an unexpected error occurred. Our team has been notified.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                >
                  Reload Page
                </button>
                <button
                  onClick={() => {
                    // Clear any corrupted state
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition"
                >
                  Clear Data & Reload
                </button>
              </div>
              <details className="mt-4 text-left text-sm text-gray-500">
                <summary>Technical Details</summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-40">
                  {this.state.error?.message}
                </pre>
              </details>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
```

### 2. Component-Level Error Boundaries
```typescript
// src/components/ComponentErrorBoundary.tsx
import React from 'react';
import { logger } from '@/utils/logger';

interface ComponentErrorBoundaryProps {
  children: React.ReactNode;
  componentName: string;
  fallback?: React.ReactNode;
}

interface ComponentErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ComponentErrorBoundary extends React.Component<
  ComponentErrorBoundaryProps,
  ComponentErrorBoundaryState
> {
  constructor(props: ComponentErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ComponentErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error(`Component error: ${this.props.componentName}`, error, {
      componentStack: errorInfo.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
          <p className="text-yellow-800">
            {this.props.componentName} failed to load. Please try again.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 text-sm text-yellow-600 underline"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ComponentErrorBoundary;
```

## Try-Catch Error Handling

### 1. Async Error Handler
```typescript
// src/utils/asyncError.ts
import { logger } from '@/utils/logger';
import * as Sentry from '@sentry/react';

export const asyncError = async <T>(
  operation: string,
  fn: () => Promise<T>,
  context?: any
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    logger.error(`Async error in ${operation}`, error as Error, context);
    
    Sentry.captureException(error, {
      extra: {
        operation,
        context,
        timestamp: new Date().toISOString(),
      },
    });
    
    throw error;
  }
};

export const asyncErrorWithFallback = async <T>(
  operation: string,
  fn: () => Promise<T>,
  fallback: T,
  context?: any
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    logger.warn(`Async error in ${operation}, using fallback`, error as Error, context);
    
    Sentry.captureException(error, {
      extra: {
        operation,
        context,
        timestamp: new Date().toISOString(),
        usingFallback: true,
      },
    });
    
    return fallback;
  }
};
```

### 2. Storage Error Handler
```typescript
// src/utils/storageError.ts
import { logger } from '@/utils/logger';

export const storageError = <T>(
  operation: 'get' | 'set' | 'remove',
  key: string,
  fn: () => T,
  fallback: T
): T => {
  try {
    return fn();
  } catch (error) {
    logger.error(`Storage error: ${operation} ${key}`, error as Error);
    
    // Clear corrupted data
    try {
      localStorage.removeItem(key);
    } catch (e) {
      // Ignore cleanup errors
    }
    
    return fallback;
  }
};

export const storageErrorAsync = async <T>(
  operation: 'get' | 'set' | 'remove',
  key: string,
  fn: () => Promise<T>,
  fallback: T
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    logger.error(`Storage error: ${operation} ${key}`, error as Error);
    
    // Clear corrupted data
    try {
      localStorage.removeItem(key);
    } catch (e) {
      // Ignore cleanup errors
    }
    
    return fallback;
  }
};
```

### 3. Network Error Handler
```typescript
// src/utils/networkError.ts
import { logger } from '@/utils/logger';
import * as Sentry from '@sentry/react';

export const networkError = async <T>(
  url: string,
  options: RequestInit = {},
  fallback: T
): Promise<T> => {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
      logger.error('Network error', error, { url, status: response.status });
      
      Sentry.captureException(error, {
        extra: { url, status: response.status, options },
      });
      
      throw error;
    }
    
    return await response.json();
  } catch (error) {
    logger.error('Network request failed', error as Error, { url });
    
    Sentry.captureException(error, {
      extra: { url, options },
    });
    
    return fallback;
  }
};

export const networkErrorWithRetry = async <T>(
  url: string,
  options: RequestInit = {},
  fallback: T,
  maxRetries = 3
): Promise<T> => {
  let lastError: Error | null = null;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      lastError = error as Error;
      
      if (i < maxRetries - 1) {
        // Exponential backoff
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  logger.error(`Network request failed after ${maxRetries} retries`, lastError!, { url });
  
  Sentry.captureException(lastError, {
    extra: { url, options, retries: maxRetries },
  });
  
  return fallback;
};
```

## Promise Error Handling

### 1. Promise Error Handler
```typescript
// src/utils/promiseError.ts
import { logger } from '@/utils/logger';

export const handlePromiseError = <T>(
  promise: Promise<T>,
  operation: string,
  context?: any
): Promise<T> => {
  return promise.catch((error) => {
    logger.error(`Promise error in ${operation}`, error, context);
    throw error;
  });
};

export const handlePromiseErrorWithFallback = <T>(
  promise: Promise<T>,
  operation: string,
  fallback: T,
  context?: any
): Promise<T> => {
  return promise.catch((error) => {
    logger.warn(`Promise error in ${operation}, using fallback`, error, context);
    return fallback;
  });
};
```

### 2. Promise All Error Handler
```typescript
// src/utils/promiseAllError.ts
import { logger } from '@/utils/logger';

export const handlePromiseAllError = async <T>(
  promises: Promise<T>[],
  operation: string
): Promise<(T | null)[]> => {
  const results = await Promise.allSettled(promises);
  
  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      logger.error(`Promise ${index} failed in ${operation}`, result.reason);
      return null;
    }
  });
};
```

## Global Error Listeners

### 1. Window Error Listener
```typescript
// src/utils/globalError.ts
import { logger } from '@/utils/logger';
import * as Sentry from '@sentry/react';

export const setupGlobalErrorListeners = () => {
  // Window error listener
  window.addEventListener('error', (event) => {
    logger.error('Global window error', event.error, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
    
    Sentry.captureException(event.error, {
      extra: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    });
  });

  // Unhandled promise rejection
  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled promise rejection', event.reason);
    
    Sentry.captureException(event.reason, {
      extra: { type: 'unhandled-rejection' },
    });
  });

  // React error listener (for non-boundary errors)
  if (process.env.NODE_ENV === 'development') {
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      originalConsoleError(...args);
      
      // Log to our logger
      logger.error('Console error', new Error(args.join(' ')));
    };
  }
};
```

### 2. Service Worker Error Listener
```typescript
// src/utils/serviceWorkerError.ts
import { logger } from '@/utils/logger';

export const setupServiceWorkerErrorListeners = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('error', (event) => {
      logger.error('Service worker error', event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'ERROR') {
        logger.error('Service worker message error', new Error(event.data.message), {
          data: event.data,
        });
      }
    });
  }
};
```

## Error Recovery Strategies

### 1. Data Recovery
```typescript
// src/utils/dataRecovery.ts
import { logger } from '@/utils/logger';

export const recoverUserData = (): any => {
  try {
    // Try to recover from localStorage
    const stored = localStorage.getItem('user_profile');
    if (stored) {
      const parsed = JSON.parse(stored);
      logger.info('Recovered user data from localStorage');
      return parsed;
    }
    
    // Try to recover from IndexedDB
    return recoverFromIndexedDB();
  } catch (error) {
    logger.error('Failed to recover user data', error as Error);
    return null;
  }
};

export const recoverFromIndexedDB = async (): Promise<any> => {
  return new Promise((resolve) => {
    const request = indexedDB.open('AppDataDB', 1);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['userData'], 'readonly');
      const store = transaction.objectStore('userData');
      const getRequest = store.get('profile');
      
      getRequest.onsuccess = () => {
        if (getRequest.result) {
          logger.info('Recovered user data from IndexedDB');
          resolve(getRequest.result);
        } else {
          resolve(null);
        }
      };
      
      getRequest.onerror = () => {
        resolve(null);
      };
    };
    
    request.onerror = () => {
      resolve(null);
    };
  });
};
```

### 2. State Recovery
```typescript
// src/utils/stateRecovery.ts
import { logger } from '@/utils/logger';

export const recoverAppState = (): any => {
  try {
    // Try to recover from sessionStorage
    const stored = sessionStorage.getItem('app_state');
    if (stored) {
      const parsed = JSON.parse(stored);
      logger.info('Recovered app state from sessionStorage');
      return parsed;
    }
    
    // Return default state
    return getDefaultState();
  } catch (error) {
    logger.error('Failed to recover app state', error as Error);
    return getDefaultState();
  }
};

export const getDefaultState = () => ({
  tasks: [],
  user: null,
  alarms: [],
  settings: {
    theme: 'dark',
    notifications: true,
  },
});
```

### 3. Component Recovery
```typescript
// src/utils/componentRecovery.ts
import { logger } from '@/utils/logger';

export const recoverComponentState = (componentName: string): any => {
  try {
    const key = `component_${componentName}_state`;
    const stored = sessionStorage.getItem(key);
    
    if (stored) {
      const parsed = JSON.parse(stored);
      logger.info(`Recovered state for ${componentName}`);
      return parsed;
    }
    
    return null;
  } catch (error) {
    logger.error(`Failed to recover state for ${componentName}`, error as Error);
    return null;
  }
};

export const saveComponentState = (componentName: string, state: any) => {
  try {
    const key = `component_${componentName}_state`;
    sessionStorage.setItem(key, JSON.stringify(state));
  } catch (error) {
    logger.error(`Failed to save state for ${componentName}`, error as Error);
  }
};
```

## Error Reporting

### 1. Error Reporting Service
```typescript
// src/utils/errorReporting.ts
import { logger } from '@/utils/logger';
import * as Sentry from '@sentry/react';

export const reportError = (error: Error, context?: any) => {
  // Log locally
  logger.error('Error reported', error, context);
  
  // Send to Sentry
  Sentry.captureException(error, {
    extra: context,
  });
  
  // Send to custom endpoint
  fetch('/api/errors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }),
  }).catch(() => {
    // Silently fail
  });
};

export const reportWarning = (message: string, context?: any) => {
  logger.warn(message, context);
  
  Sentry.captureMessage(message, 'warning', {
    extra: context,
  });
};

export const reportInfo = (message: string, context?: any) => {
  logger.info(message, context);
};
```

### 2. Error Dashboard
```typescript
// src/components/ErrorDashboard.tsx
import React, { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';

export const ErrorDashboard: React.FC = () => {
  const [errors, setErrors] = useState<any[]>([]);

  useEffect(() => {
    const logs = logger.getLogs();
    const errorLogs = logs.filter(log => log.level === 'error');
    setErrors(errorLogs);
  }, []);

  const clearErrors = () => {
    logger.clearLogs();
    setErrors([]);
  };

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h2 className="text-xl font-bold mb-4">Error Dashboard</h2>
      
      <div className="mb-4">
        <button
          onClick={clearErrors}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Clear Errors
        </button>
      </div>

      <div className="max-h-96 overflow-auto">
        {errors.length === 0 ? (
          <p className="text-gray-500">No errors logged</p>
        ) : (
          <div className="space-y-2">
            {errors.map((error, index) => (
              <div key={index} className="bg-white p-3 rounded border border-red-200">
                <div className="flex justify-between">
                  <span className="font-bold text-red-600">{error.message}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(error.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                {error.data && (
                  <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-auto">
                    {JSON.stringify(error.data, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
```

## Error Recovery in Hooks

### 1. useUserProfile Error Recovery
```typescript
// src/hooks/useUserProfile.ts
import { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';
import { recoverUserData } from '@/utils/dataRecovery';

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const stored = localStorage.getItem('user_profile');
        
        if (stored) {
          const parsed = JSON.parse(stored);
          setProfile(parsed);
        } else {
          // Create new profile
          const newProfile: UserProfile = {
            id: crypto.randomUUID(),
            username: 'User',
            avatar: '',
            theme: 'dark',
            createdAt: new Date(),
            lastVisit: new Date(),
            settings: {
              notifications: true,
              soundEnabled: true,
              selectedSound: 'bell',
            },
          };
          setProfile(newProfile);
          localStorage.setItem('user_profile', JSON.stringify(newProfile));
        }
      } catch (error) {
        logger.error('Failed to load user profile', error as Error);
        
        // Try to recover
        const recovered = recoverUserData();
        if (recovered) {
          setProfile(recovered);
          logger.info('Recovered user profile');
        } else {
          setError(error as Error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!profile) return;

    try {
      const updatedProfile = { ...profile, ...updates };
      setProfile(updatedProfile);
      localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
    } catch (error) {
      logger.error('Failed to update profile', error as Error);
      
      // Try to recover
      const recovered = recoverUserData();
      if (recovered) {
        setProfile(recovered);
      }
    }
  };

  return { profile, isLoading, error, updateProfile };
};
```

### 2. useLocalStorage Error Recovery
```typescript
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';
import { storageError } from '@/utils/storageError';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    return storageError(
      'get',
      key,
      () => {
        const stored = localStorage.getItem(key);
        if (stored) {
          return JSON.parse(stored);
        }
        return initialValue;
      },
      initialValue
    );
  });

  useEffect(() => {
    storageError(
      'set',
      key,
      () => {
        localStorage.setItem(key, JSON.stringify(value));
      },
      null
    );
  }, [key, value]);

  return [value, setValue] as const;
}
```

## Error Recovery in Components

### 1. TaskCard Error Recovery
```typescript
// src/components/TaskCard.tsx
import React, { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';
import { recoverComponentState } from '@/utils/componentRecovery';

interface TaskCardProps {
  task: {
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
  };
  onToggleCompletion: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleCompletion, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Try to recover expanded state
    const recovered = recoverComponentState('TaskCard');
    if (recovered && recovered[task.id]) {
      setIsExpanded(recovered[task.id]);
    }
  }, [task.id]);

  const handleToggle = () => {
    try {
      onToggleCompletion(task.id);
    } catch (error) {
      logger.error('Failed to toggle task', error as Error, { taskId: task.id });
      setError(error as Error);
      
      // Show user-friendly error
      alert('Failed to update task. Please try again.');
    }
  };

  const handleDelete = () => {
    try {
      onDelete(task.id);
    } catch (error) {
      logger.error('Failed to delete task', error as Error, { taskId: task.id });
      setError(error as Error);
      
      // Show user-friendly error
      alert('Failed to delete task. Please try again.');
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 rounded">
        <p className="text-red-800">Failed to load task</p>
        <button
          onClick={() => setError(null)}
          className="mt-2 text-sm text-red-600 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="task-card">
      <h3>{task.title}</h3>
      <button onClick={handleToggle}>Toggle</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};
```

## Error Recovery in API Calls

### 1. API Error Recovery
```typescript
// src/utils/apiErrorRecovery.ts
import { logger } from '@/utils/logger';
import { networkErrorWithRetry } from '@/utils/networkError';

export const fetchWithRecovery = async <T>(
  url: string,
  options: RequestInit = {},
  fallback: T
): Promise<T> => {
  try {
    return await networkErrorWithRetry(url, options, fallback, 3);
  } catch (error) {
    logger.error('API call failed with recovery', error as Error, { url });
    
    // Try to recover from cache
    const cached = await recoverFromCache(url);
    if (cached) {
      logger.info('Recovered from cache', { url });
      return cached;
    }
    
    return fallback;
  }
};

export const recoverFromCache = async (url: string): Promise<any> => {
  try {
    const cache = await caches.open('api-cache');
    const response = await cache.match(url);
    
    if (response) {
      return await response.json();
    }
    
    return null;
  } catch (error) {
    logger.error('Failed to recover from cache', error as Error, { url });
    return null;
  }
};
```

## Error Recovery in Storage

### 1. Storage Recovery
```typescript
// src/utils/storageRecovery.ts
import { logger } from '@/utils/logger';

export const recoverStorage = async (): Promise<void> => {
  try {
    // Clear corrupted localStorage
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      try {
        JSON.parse(localStorage.getItem(key)!);
      } catch (error) {
        logger.warn(`Corrupted localStorage key: ${key}`);
        localStorage.removeItem(key);
      }
    }
    
    // Clear corrupted IndexedDB
    const databases = await indexedDB.databases();
    for (const db of databases) {
      if (db.name?.includes('App')) {
        indexedDB.deleteDatabase(db.name);
      }
    }
    
    logger.info('Storage recovery completed');
  } catch (error) {
    logger.error('Storage recovery failed', error as Error);
  }
};
```

## Error Recovery in State Management

### 1. State Recovery
```typescript
// src/utils/stateRecovery.ts
import { logger } from '@/utils/logger';

export const recoverState = async (): Promise<void> => {
  try {
    // Clear corrupted state
    sessionStorage.clear();
    
    // Reset app state
    const defaultState = {
      tasks: [],
      user: null,
      alarms: [],
      settings: {
        theme: 'dark',
        notifications: true,
      },
    };
    
    sessionStorage.setItem('app_state', JSON.stringify(defaultState));
    
    logger.info('State recovery completed');
  } catch (error) {
    logger.error('State recovery failed', error as Error);
  }
};
```

## Error Recovery in UI

### 1. UI Recovery
```typescript
// src/utils/uiRecovery.ts
import { logger } from '@/utils/logger';

export const recoverUI = (): void => {
  try {
    // Clear any corrupted UI state
    const corruptedElements = document.querySelectorAll('[data-corrupted="true"]');
    corruptedElements.forEach(el => {
      el.remove();
    });
    
    // Reset scroll position
    window.scrollTo(0, 0);
    
    // Clear any stuck animations
    const animatedElements = document.querySelectorAll('[style*="animation"]');
    animatedElements.forEach(el => {
      (el as HTMLElement).style.animation = 'none';
    });
    
    logger.info('UI recovery completed');
  } catch (error) {
    logger.error('UI recovery failed', error as Error);
  }
};
```

## Error Recovery Checklist

### Before Deployment
- [ ] All async operations have error handling
- [ ] All storage operations have error handling
- [ ] All network operations have error handling
- [ ] Error boundaries are in place
- [ ] Global error listeners are set up
- [ ] Error recovery strategies are implemented
- [ ] Error reporting is configured
- [ ] User-friendly error messages are in place
- [ ] Tests for error scenarios are written
- [ ] Recovery procedures are documented

### After Deployment
- [ ] Monitor error rates
- [ ] Review error logs
- [ ] Check recovery success rates
- [ ] Update error handling as needed
- [ ] Regular error audits

## Error Recovery Best Practices

### 1. Error Recovery Principles
- **Fail gracefully**: Don't crash the app
- **Provide fallbacks**: Always have a backup plan
- **Log errors**: For debugging and monitoring
- **Recover automatically**: When possible
- **Inform users**: Don't hide errors

### 2. Error Recovery Strategies
- **Retry**: For transient errors
- **Fallback**: For permanent errors
- **Cache**: For network errors
- **Recovery**: For corrupted data
- **Reset**: For unrecoverable errors

### 3. Error Recovery Patterns
- **Circuit Breaker**: Stop trying after repeated failures
- **Bulkhead**: Isolate failures to prevent cascade
- **Timeout**: Don't wait forever
- **Rate Limiting**: Prevent overwhelming the system
- **Backoff**: Exponential retry delays

## Error Recovery Conclusion

This error recovery strategy provides:
1. **Global Error Boundaries**: App-level error containment
2. **Component Error Boundaries**: Feature-level error isolation
3. **Async Error Handling**: Promise and network error management
4. **Storage Error Recovery**: Data recovery strategies
5. **State Recovery**: Application state restoration
6. **UI Recovery**: Visual error recovery
7. **Error Reporting**: Comprehensive error tracking

**Key Benefits:**
- **High Availability**: App stays functional
- **Good UX**: Users see helpful messages
- **Debugging**: Detailed error logs
- **Monitoring**: Real-time error tracking
- **Recovery**: Automatic error recovery

**Next Steps:**
1. Implement error boundaries
2. Add error recovery to all hooks
3. Set up error reporting
4. Create error dashboard
5. Test error scenarios

**Happy recovering! 🛡️**