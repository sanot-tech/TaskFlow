# Monitoring & Logging Documentation

## Overview
This document describes the monitoring and logging strategy for the TodoList application. We use a combination of Sentry, Vercel Analytics, and custom logging to ensure application reliability and performance.

## Architecture

### Monitoring Stack
```
┌─────────────────────────────────────────────────────────────┐
│                    Monitoring Stack                         │
├─────────────────────────────────────────────────────────────┤
│ 1. Sentry (Error Tracking)                                  │
│ 2. Vercel Analytics (Performance)                           │
│ 3. Custom Logging (Application Logs)                        │
│ 4. Browser Console (Development)                            │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow
```
User Action → Application → Logs → Monitoring Services → Alerts → Team
```

## Sentry Integration

### Setup
```typescript
// src/main.tsx
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
  environment: import.meta.env.MODE,
  release: import.meta.env.VITE_APP_VERSION,
  
  // Performance monitoring
  beforeSend(event) {
    // Filter out sensitive data
    if (event.request?.headers?.['Authorization']) {
      delete event.request.headers['Authorization'];
    }
    return event;
  },
});
```

### Error Tracking
```typescript
// src/utils/errorHandler.ts
import * as Sentry from '@sentry/react';

export const captureError = (error: Error, context?: any) => {
  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext('context', context);
    }
    Sentry.captureException(error);
  });
};

export const captureMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
  Sentry.captureMessage(message, level);
};
```

### Performance Monitoring
```typescript
// src/utils/performance.ts
import * as Sentry from '@sentry/react';

export const startTransaction = (name: string, op: string) => {
  return Sentry.startTransaction({ name, op });
};

export const withPerformance = async <T>(
  name: string,
  op: string,
  fn: () => Promise<T>
): Promise<T> => {
  const transaction = startTransaction(name, op);
  const span = transaction.startChild({ op: 'function' });
  
  try {
    const result = await fn();
    span.setStatus('ok');
    return result;
  } catch (error) {
    span.setStatus('internal_error');
    captureError(error as Error, { name, op });
    throw error;
  } finally {
    span.finish();
    transaction.finish();
  }
};
```

### Custom Events
```typescript
// src/utils/analytics.ts
import * as Sentry from '@sentry/react';

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  Sentry.addBreadcrumb({
    category: 'analytics',
    message: eventName,
    data: properties,
    level: 'info',
  });
  
  // Also send to Vercel Analytics
  if (window.gtag) {
    window.gtag('event', eventName, properties);
  }
};

export const trackUser = (userId: string, properties?: Record<string, any>) => {
  Sentry.setUser({ id: userId, ...properties });
};
```

## Vercel Analytics

### Setup
```typescript
// src/App.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

function App() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
      {/* ... */}
    </>
  );
}
```

### Core Web Vitals
Vercel Analytics automatically tracks:
- **LCP** (Largest Contentful Paint)
- **FID** (First Input Delay)
- **CLS** (Cumulative Layout Shift)
- **FCP** (First Contentful Paint)
- **TTFB** (Time to First Byte)

### Custom Metrics
```typescript
// src/utils/metrics.ts
export const measurePerformance = (metricName: string, value: number) => {
  if (window.gtag) {
    window.gtag('event', 'metric', {
      metric_name: metricName,
      metric_value: value,
    });
  }
};

export const measureComponentRender = (componentName: string, renderTime: number) => {
  measurePerformance(`render_${componentName}`, renderTime);
};
```

## Custom Logging

### Logger Utility
```typescript
// src/utils/logger.ts
interface LogEntry {
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  data?: any;
  context?: any;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private log(level: LogEntry['level'], message: string, data?: any, context?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      context,
    };

    // Store in memory
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output (development only)
    if (import.meta.env.DEV) {
      const consoleMethod = {
        debug: console.debug,
        info: console.info,
        warn: console.warn,
        error: console.error,
      }[level];

      consoleMethod(`[${level.toUpperCase()}] ${message}`, data || '', context || '');
    }

    // Send to Sentry in production
    if (import.meta.env.PROD) {
      import('@sentry/react').then((Sentry) => {
        Sentry.addBreadcrumb({
          category: 'log',
          message,
          data,
          level: level === 'error' ? 'error' : 'info',
        });
      });
    }
  }

  debug(message: string, data?: any, context?: any) {
    this.log('debug', message, data, context);
  }

  info(message: string, data?: any, context?: any) {
    this.log('info', message, data, context);
  }

  warn(message: string, data?: any, context?: any) {
    this.log('warn', message, data, context);
  }

  error(message: string, error?: Error, context?: any) {
    this.log('error', message, error, context);
    
    // Also capture in Sentry
    if (import.meta.env.PROD) {
      import('@sentry/react').then((Sentry) => {
        Sentry.captureException(error || new Error(message), {
          extra: { message, context },
        });
      });
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = Logger.getInstance();
```

### Usage Examples
```typescript
import { logger } from '@/utils/logger';

// Debug logging
logger.debug('User clicked button', { buttonId: 'submit', userId: '123' });

// Info logging
logger.info('Task created', { taskId: '456', title: 'New Task' });

// Warning logging
logger.warn('Low storage space', { available: 1024 });

// Error logging
try {
  // Some operation
} catch (error) {
  logger.error('Failed to save task', error, { taskId: '789' });
}
```

## Application-Specific Logging

### User Profile Logging
```typescript
// src/hooks/useUserProfile.ts
import { logger } from '@/utils/logger';

export const useUserProfile = () => {
  // ... existing code

  const updateProfile = (updates: Partial<UserProfile>) => {
    logger.info('Updating user profile', { updates });
    
    try {
      // ... update logic
      logger.info('Profile updated successfully', { updates });
    } catch (error) {
      logger.error('Failed to update profile', error, { updates });
      throw error;
    }
  };

  // ... rest of hook
};
```

### Alarm Timer Logging
```typescript
// src/hooks/useAlarmTimer.ts
import { logger } from '@/utils/logger';

export const useAlarmTimer = () => {
  // ... existing code

  const startTimer = (taskId: string, taskTitle: string, duration: number) => {
    logger.info('Starting timer', { taskId, taskTitle, duration });
    
    // ... timer logic
    
    logger.info('Timer started', { taskId, remainingTime: duration * 60 });
  };

  const stopTimer = (taskId: string) => {
    logger.info('Stopping timer', { taskId });
    
    // ... stop logic
    
    logger.info('Timer stopped', { taskId });
  };

  // ... rest of hook
};
```

### Task Operations Logging
```typescript
// src/pages/Index.tsx
import { logger } from '@/utils/logger';

const Index = () => {
  // ... existing code

  const addTask = () => {
    logger.info('Adding new task', { title: taskTitle, priority: taskPriority });
    
    try {
      // ... add task logic
      logger.info('Task added successfully', { taskId: newTask.id });
    } catch (error) {
      logger.error('Failed to add task', error, { title: taskTitle });
    }
  };

  const deleteTask = (taskId: string) => {
    logger.info('Deleting task', { taskId });
    
    try {
      // ... delete logic
      logger.info('Task deleted successfully', { taskId });
    } catch (error) {
      logger.error('Failed to delete task', error, { taskId });
    }
  };

  // ... rest of component
};
```

## Error Handling

### Global Error Boundary
```typescript
// src/components/ErrorBoundary.tsx
import React from 'react';
import { logger } from '@/utils/logger';
import * as Sentry from '@sentry/react';

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
    logger.error('Component error caught by boundary', error, {
      componentStack: errorInfo.componentStack,
    });
    
    Sentry.captureException(error, {
      extra: { componentStack: errorInfo.componentStack },
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-100 border border-red-400 rounded">
          <h2 className="text-red-800 font-bold">Something went wrong</h2>
          <p className="text-red-600">Please refresh the page</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### API Error Handling
```typescript
// src/utils/api.ts
import { logger } from '@/utils/logger';
import * as Sentry from '@sentry/react';

export const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const startTime = performance.now();
  
  try {
    logger.info('API call started', { endpoint, method: options.method || 'GET' });
    
    const response = await fetch(endpoint, options);
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    logger.info('API call completed', {
      endpoint,
      status: response.status,
      duration: Math.round(duration),
    });
    
    if (!response.ok) {
      const error = new Error(`API error: ${response.status}`);
      logger.error('API call failed', error, { endpoint, status: response.status });
      throw error;
    }
    
    return response.json();
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    logger.error('API call error', error as Error, {
      endpoint,
      duration: Math.round(duration),
    });
    
    Sentry.captureException(error, {
      extra: { endpoint, duration: Math.round(duration) },
    });
    
    throw error;
  }
};
```

## Performance Monitoring

### Component Performance
```typescript
// src/utils/performance.ts
import { logger } from '@/utils/logger';

export const measureComponentPerformance = (
  componentName: string,
  renderTime: number
) => {
  logger.info('Component render performance', {
    component: componentName,
    renderTime: Math.round(renderTime),
  });
  
  // Alert if slow
  if (renderTime > 100) {
    logger.warn('Slow component render', {
      component: componentName,
      renderTime: Math.round(renderTime),
    });
  }
};

// Usage in component
export const TaskCard: React.FC<TaskCardProps> = (props) => {
  const startTime = performance.now();
  
  // ... component logic
  
  useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    measureComponentPerformance('TaskCard', renderTime);
  }, []);
  
  // ... rest of component
};
```

### Hook Performance
```typescript
// src/utils/performance.ts
export const measureHookPerformance = (
  hookName: string,
  executionTime: number
) => {
  logger.info('Hook execution performance', {
    hook: hookName,
    executionTime: Math.round(executionTime),
  });
  
  if (executionTime > 50) {
    logger.warn('Slow hook execution', {
      hook: hookName,
      executionTime: Math.round(executionTime),
    });
  }
};

// Usage in hook
export const useUserProfile = () => {
  const startTime = performance.now();
  
  // ... hook logic
  
  useEffect(() => {
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    measureHookPerformance('useUserProfile', executionTime);
  }, []);
  
  // ... rest of hook
};
```

### Memory Usage Monitoring
```typescript
// src/utils/memory.ts
import { logger } from '@/utils/logger';

export const monitorMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    const usedJSHeapSize = memory.usedJSHeapSize / 1024 / 1024; // MB
    const totalJSHeapSize = memory.totalJSHeapSize / 1024 / 1024; // MB
    
    logger.info('Memory usage', {
      used: Math.round(usedJSHeapSize),
      total: Math.round(totalJSHeapSize),
      percentage: Math.round((usedJSHeapSize / totalJSHeapSize) * 100),
    });
    
    // Alert if high usage
    if (usedJSHeapSize > 100) {
      logger.warn('High memory usage', {
        used: Math.round(usedJSHeapSize),
        total: Math.round(totalJSHeapSize),
      });
    }
  }
};

// Monitor periodically
setInterval(monitorMemoryUsage, 60000); // Every minute
```

## Alerting System

### Alert Configuration
```typescript
// src/utils/alerts.ts
import { logger } from '@/utils/logger';

interface AlertConfig {
  threshold: number;
  window: number; // seconds
  cooldown: number; // seconds
}

class AlertManager {
  private alerts: Map<string, number[]> = new Map();
  private lastAlert: Map<string, number> = new Map();
  
  private config: AlertConfig = {
    threshold: 5, // 5 errors in window
    window: 60, // 60 seconds
    cooldown: 300, // 5 minutes
  };

  recordAlert(type: string) {
    const now = Date.now();
    const windowStart = now - this.config.window * 1000;
    
    if (!this.alerts.has(type)) {
      this.alerts.set(type, []);
    }
    
    const timestamps = this.alerts.get(type)!;
    timestamps.push(now);
    
    // Remove old timestamps
    const filtered = timestamps.filter(t => t >= windowStart);
    this.alerts.set(type, filtered);
    
    // Check if threshold exceeded
    if (filtered.length >= this.config.threshold) {
      const lastAlertTime = this.lastAlert.get(type) || 0;
      const timeSinceLastAlert = now - lastAlertTime;
      
      if (timeSinceLastAlert > this.config.cooldown * 1000) {
        this.sendAlert(type, filtered.length);
        this.lastAlert.set(type, now);
      }
    }
  }

  private sendAlert(type: string, count: number) {
    logger.error(`ALERT: ${type} - ${count} occurrences`, undefined, {
      type,
      count,
      timestamp: new Date().toISOString(),
    });
    
    // Send to Sentry
    import('@sentry/react').then((Sentry) => {
      Sentry.captureMessage(`Alert: ${type} - ${count} occurrences`, 'error');
    });
    
    // Send to external service (Slack, etc.)
    this.sendToExternalService(type, count);
  }

  private sendToExternalService(type: string, count: number) {
    // Implement external alerting (Slack, Discord, etc.)
    console.log(`[ALERT] ${type}: ${count} occurrences`);
  }
}

export const alertManager = new AlertManager();
```

### Usage in Error Handling
```typescript
import { alertManager } from '@/utils/alerts';

try {
  // Some operation
} catch (error) {
  logger.error('Operation failed', error);
  alertManager.recordAlert('operation_failed');
}
```

## Log Storage & Retention

### Local Storage
```typescript
// src/utils/logStorage.ts
import { logger } from '@/utils/logger';

export const saveLogsToLocalStorage = () => {
  try {
    const logs = logger.getLogs();
    const serialized = JSON.stringify(logs);
    
    if (serialized.length > 5 * 1024 * 1024) { // 5MB limit
      logger.warn('Log storage approaching limit');
      // Keep only last 100 logs
      const recentLogs = logs.slice(-100);
      localStorage.setItem('app_logs', JSON.stringify(recentLogs));
    } else {
      localStorage.setItem('app_logs', serialized);
    }
  } catch (error) {
    logger.error('Failed to save logs to localStorage', error as Error);
  }
};

export const loadLogsFromLocalStorage = () => {
  try {
    const serialized = localStorage.getItem('app_logs');
    if (serialized) {
      const logs = JSON.parse(serialized);
      // Restore logs to logger
      // Note: This is simplified - actual implementation would need to add logs to logger
      return logs;
    }
  } catch (error) {
    logger.error('Failed to load logs from localStorage', error as Error);
  }
  return [];
};

// Auto-save logs periodically
setInterval(saveLogsToLocalStorage, 300000); // Every 5 minutes
```

### IndexedDB Storage (for large logs)
```typescript
// src/utils/logStorageIndexedDB.ts
import { logger } from '@/utils/logger';

const DB_NAME = 'AppLogsDB';
const STORE_NAME = 'logs';

export const saveLogsToIndexedDB = async (logs: any[]) => {
  return new Promise<void>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      logs.forEach(log => {
        store.put(log);
      });
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'timestamp' });
      }
    };
  });
};

export const getLogsFromIndexedDB = async (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
  });
};
```

## Log Analysis

### Log Parser
```typescript
// src/utils/logParser.ts
import { logger } from '@/utils/logger';

export const analyzeLogs = (logs: any[]) => {
  const analysis = {
    total: logs.length,
    byLevel: {
      debug: 0,
      info: 0,
      warn: 0,
      error: 0,
    },
    byTime: new Map<string, number>(),
    byMessage: new Map<string, number>(),
    errors: [] as any[],
  };

  logs.forEach(log => {
    // Count by level
    analysis.byLevel[log.level] = (analysis.byLevel[log.level] || 0) + 1;

    // Count by hour
    const hour = new Date(log.timestamp).getHours();
    const hourKey = `${hour}:00`;
    analysis.byTime.set(hourKey, (analysis.byTime.get(hourKey) || 0) + 1);

    // Count by message
    analysis.byMessage.set(log.message, (analysis.byMessage.get(log.message) || 0) + 1);

    // Collect errors
    if (log.level === 'error') {
      analysis.errors.push(log);
    }
  });

  return analysis;
};

export const generateLogReport = (logs: any[]) => {
  const analysis = analyzeLogs(logs);
  
  const report = `
    Log Analysis Report
    ===================
    Total Logs: ${analysis.total}
    
    By Level:
    - Debug: ${analysis.byLevel.debug}
    - Info: ${analysis.byLevel.info}
    - Warn: ${analysis.byLevel.warn}
    - Error: ${analysis.byLevel.error}
    
    Top Messages:
    ${Array.from(analysis.byMessage.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([msg, count]) => `- ${msg}: ${count}`)
      .join('\n')}
    
    Errors (${analysis.errors.length}):
    ${analysis.errors
      .map(e => `- ${e.timestamp}: ${e.message}`)
      .join('\n')}
  `;
  
  return report;
};
```

## Dashboard & Reporting

### Log Dashboard Component
```typescript
// src/components/LogDashboard.tsx
import React, { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';
import { analyzeLogs, generateLogReport } from '@/utils/logParser';

export const LogDashboard: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [report, setReport] = useState('');

  useEffect(() => {
    const allLogs = logger.getLogs();
    setLogs(allLogs);
    setReport(generateLogReport(allLogs));
  }, []);

  const exportLogs = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h2 className="text-xl font-bold mb-4">Log Dashboard</h2>
      
      <div className="mb-4">
        <button
          onClick={exportLogs}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Export Logs
        </button>
      </div>

      <div className="mb-4">
        <h3 className="font-bold">Summary</h3>
        <pre className="bg-white p-4 rounded text-sm overflow-auto">
          {report}
        </pre>
      </div>

      <div>
        <h3 className="font-bold">Recent Logs</h3>
        <div className="max-h-64 overflow-auto bg-white p-4 rounded">
          {logs.slice(-20).map((log, index) => (
            <div key={index} className="mb-2 border-b pb-2">
              <span className="text-xs text-gray-500">{log.timestamp}</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                log.level === 'error' ? 'bg-red-100 text-red-800' :
                log.level === 'warn' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {log.level.toUpperCase()}
              </span>
              <span className="ml-2">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

## Alerting & Notifications

### Slack Integration
```typescript
// src/utils/slack.ts
import { logger } from '@/utils/logger';

export const sendToSlack = async (message: string, channel: string = '#alerts') => {
  try {
    const webhookUrl = import.meta.env.VITE_SLACK_WEBHOOK_URL;
    
    if (!webhookUrl) {
      logger.warn('Slack webhook URL not configured');
      return;
    }

    const payload = {
      channel,
      text: message,
      username: 'TodoList App',
      icon_emoji: ':robot_face:',
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Slack API error: ${response.status}`);
    }

    logger.info('Message sent to Slack', { channel, message });
  } catch (error) {
    logger.error('Failed to send message to Slack', error as Error);
  }
};

// Usage
export const sendAlertToSlack = (type: string, details: any) => {
  const message = `
    *Alert: ${type}*
    Time: ${new Date().toISOString()}
    Details: ${JSON.stringify(details, null, 2)}
  `;
  
  sendToSlack(message);
};
```

### Email Notifications
```typescript
// src/utils/email.ts
import { logger } from '@/utils/logger';

export const sendEmail = async (to: string, subject: string, body: string) => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, subject, body }),
    });

    if (!response.ok) {
      throw new Error(`Email API error: ${response.status}`);
    }

    logger.info('Email sent', { to, subject });
  } catch (error) {
    logger.error('Failed to send email', error as Error);
  }
};
```

## Monitoring Dashboard

### Admin Dashboard
```typescript
// src/pages/Admin.tsx
import React, { useState, useEffect } from 'react';
import { LogDashboard } from '@/components/LogDashboard';
import { PerformanceMetrics } from '@/components/PerformanceMetrics';
import { ErrorOverview } from '@/components/ErrorOverview';

export const Admin: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    // Fetch metrics from Sentry/Vercel
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/metrics');
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch metrics', error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 60000); // Every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold">Error Rate</h3>
          <p className="text-2xl">{metrics?.errorRate || '0%'}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold">Avg Response Time</h3>
          <p className="text-2xl">{metrics?.avgResponseTime || '0ms'}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold">Active Users</h3>
          <p className="text-2xl">{metrics?.activeUsers || '0'}</p>
        </div>
      </div>

      <LogDashboard />
      <PerformanceMetrics />
      <ErrorOverview />
    </div>
  );
};
```

## Log Retention Policy

### Retention Rules
```typescript
// src/utils/logRetention.ts
import { logger } from '@/utils/logger';

export const applyLogRetention = () => {
  const logs = logger.getLogs();
  const now = Date.now();
  
  // Keep logs for 7 days
  const retentionPeriod = 7 * 24 * 60 * 60 * 1000;
  
  const filteredLogs = logs.filter(log => {
    const logTime = new Date(log.timestamp).getTime();
    return now - logTime <= retentionPeriod;
  });
  
  // Clear old logs
  logger.clearLogs();
  
  // Add filtered logs back
  filteredLogs.forEach(log => {
    // This is simplified - actual implementation would need to add logs to logger
    console.log('Keeping log:', log);
  });
  
  logger.info('Log retention applied', {
    originalCount: logs.length,
    retainedCount: filteredLogs.length,
    removedCount: logs.length - filteredLogs.length,
  });
};

// Apply retention daily
setInterval(applyLogRetention, 24 * 60 * 60 * 1000); // Every 24 hours
```

## Security & Privacy

### Log Sanitization
```typescript
// src/utils/logSanitization.ts
import { logger } from '@/utils/logger';

export const sanitizeLog = (log: any): any => {
  const sanitized = { ...log };
  
  // Remove sensitive data
  if (sanitized.data) {
    if (sanitized.data.password) {
      sanitized.data.password = '[REDACTED]';
    }
    if (sanitized.data.token) {
      sanitized.data.token = '[REDACTED]';
    }
    if (sanitized.data.email) {
      // Keep email but mask it
      const email = sanitized.data.email as string;
      const [local, domain] = email.split('@');
      sanitized.data.email = `${local[0]}***@${domain}`;
    }
  }
  
  // Remove stack traces in production
  if (import.meta.env.PROD && sanitized.context?.stack) {
    delete sanitized.context.stack;
  }
  
  return sanitized;
};

// Usage in logger
export const safeLog = (level: string, message: string, data?: any, context?: any) => {
  const sanitizedData = data ? sanitizeLog({ data }) : undefined;
  const sanitizedContext = context ? sanitizeLog({ context }) : undefined;
  
  logger.log(level, message, sanitizedData, sanitizedContext);
};
```

### GDPR Compliance
```typescript
// src/utils/gdpr.ts
export const getLogConsent = (): boolean => {
  const consent = localStorage.getItem('log_consent');
  return consent === 'true';
};

export const setLogConsent = (consent: boolean) => {
  localStorage.setItem('log_consent', consent.toString());
};

export const deleteUserData = () => {
  // Delete all logs
  localStorage.removeItem('app_logs');
  
  // Clear IndexedDB
  const request = indexedDB.deleteDatabase('AppLogsDB');
  
  // Clear Sentry user data
  import('@sentry/react').then((Sentry) => {
    Sentry.setUser(null);
  });
  
  logger.info('User data deleted');
};
```

## Monitoring Best Practices

### 1. Log Levels
- **DEBUG**: Detailed information for debugging
- **INFO**: General information about application flow
- **WARN**: Potential issues that don't affect functionality
- **ERROR**: Errors that affect functionality

### 2. Log Structure
```typescript
// Good
logger.info('Task created', { taskId: '123', title: 'My Task' });

// Bad
logger.info('Task created');
```

### 3. Error Context
```typescript
// Good
try {
  // operation
} catch (error) {
  logger.error('Operation failed', error, { operation: 'save', data: {...} });
}

// Bad
try {
  // operation
} catch (error) {
  logger.error('Operation failed');
}
```

### 4. Performance Monitoring
- Monitor component render times
- Track API response times
- Alert on slow operations
- Regular performance audits

### 5. Alert Fatigue Prevention
- Set appropriate thresholds
- Use cooldown periods
- Group similar alerts
- Review alerts regularly

## Monitoring Metrics

### Key Metrics to Track
| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| **Error Rate** | < 1% | > 5% |
| **Avg Response Time** | < 500ms | > 2000ms |
| **Memory Usage** | < 100MB | > 200MB |
| **API Success Rate** | > 99% | < 95% |
| **User Satisfaction** | > 4.5/5 | < 3/5 |

### Dashboard Metrics
- **Real-time**: Error count, active users, response times
- **Hourly**: Traffic patterns, error trends
- **Daily**: Performance summary, user engagement
- **Weekly**: System health, capacity planning

## Monitoring Conclusion

This monitoring and logging strategy provides:
1. **Comprehensive Error Tracking**: Sentry integration
2. **Performance Monitoring**: Vercel Analytics + custom metrics
3. **Application Logging**: Structured, searchable logs
4. **Alerting System**: Proactive notifications
5. **Security & Privacy**: GDPR compliance
6. **Dashboard & Reporting**: Real-time insights

**Key Benefits:**
- **Proactive Issue Detection**: Catch problems before users report them
- **Performance Optimization**: Identify bottlenecks
- **Security Monitoring**: Track suspicious activities
- **User Experience**: Monitor real user metrics
- **Compliance**: Meet regulatory requirements

**Next Steps:**
1. Set up Sentry and Vercel Analytics
2. Implement custom logging
3. Configure alerts
4. Create monitoring dashboard
5. Set up log retention policies

**Happy monitoring! 📊**