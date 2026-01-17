# Validation & Sanitization Documentation

## Overview
This document describes the validation and sanitization strategy for the TodoList application. We use Zod for schema validation and DOMPurify for HTML sanitization to ensure data integrity and security.

## Validation Strategy

### 1. Schema Validation with Zod
```typescript
// src/schemas/task.schema.ts
import { z } from 'zod';

// Task Schema
export const taskSchema = z.object({
  id: z.string().uuid(),
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less')
    .trim(),
  description: z.string()
    .max(500, 'Description must be 500 characters or less')
    .trim()
    .optional(),
  completed: z.boolean().default(false),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  priorityColor: z.string().regex(/^bg-/, 'Priority color must be a Tailwind class'),
  dueDate: z.date().optional(),
  tags: z.array(z.string().max(20)).max(10, 'Maximum 10 tags allowed'),
  subtasks: z.array(
    z.object({
      id: z.string().uuid(),
      title: z.string().min(1).max(100),
      completed: z.boolean(),
    })
  ).max(20, 'Maximum 20 subtasks allowed'),
});

// User Profile Schema
export const userProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be 20 characters or less')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string()
    .email('Invalid email format')
    .max(100, 'Email must be 100 characters or less'),
  avatar: z.string().url('Avatar must be a valid URL'),
  theme: z.enum(['light', 'dark']),
  createdAt: z.date(),
  lastVisit: z.date(),
  settings: z.object({
    notifications: z.boolean(),
    soundEnabled: z.boolean(),
    selectedSound: z.string().min(1),
  }),
});

// Alarm Timer Schema
export const alarmTimerSchema = z.object({
  taskId: z.string().uuid(),
  taskTitle: z.string().min(1).max(100),
  duration: z.number().int().min(1).max(180), // 1-180 minutes
  isActive: z.boolean(),
  remainingTime: z.number().int().min(0),
});

// Form Validation Schema
export const taskFormSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less')
    .trim(),
  description: z.string()
    .max(500, 'Description must be 500 characters or less')
    .trim()
    .optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  dueDate: z.date().optional(),
  tags: z.array(z.string().max(20)).max(10),
});

// User Settings Schema
export const userSettingsSchema = z.object({
  notifications: z.boolean(),
  soundEnabled: z.boolean(),
  selectedSound: z.string().min(1),
});
```

### 2. Validation Utilities
```typescript
// src/utils/validation.ts
import { z } from 'zod';
import { logger } from '@/utils/logger';

export const validateData = <T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): { success: boolean; data?: z.infer<T>; errors?: z.ZodError } => {
  try {
    const result = schema.parse(data);
    logger.info('Validation successful', { schema: schema._def.typeName });
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('Validation failed', {
        schema: schema._def.typeName,
        errors: error.errors,
      });
      return { success: false, errors: error };
    }
    throw error;
  }
};

export const validateDataSafe = <T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): z.SafeParseReturnType<unknown, z.infer<T>> => {
  return schema.safeParse(data);
};

export const validateTask = (data: unknown) => {
  return validateDataSafe(taskSchema, data);
};

export const validateUserProfile = (data: unknown) => {
  return validateDataSafe(userProfileSchema, data);
};

export const validateAlarmTimer = (data: unknown) => {
  return validateDataSafe(alarmTimerSchema, data);
};
```

### 3. Form Validation with React Hook Form
```typescript
// src/components/TaskForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskFormSchema } from '@/schemas/task.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type TaskFormData = z.infer<typeof taskFormSchema>;

export const TaskForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      tags: [],
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      // Validate again before submission
      const result = taskFormSchema.safeParse(data);
      if (!result.success) {
        console.error('Form validation failed:', result.error);
        return;
      }

      // Submit data
      console.log('Submitting:', result.data);
      
      // Clear form
      setValue('title', '');
      setValue('description', '');
      setValue('priority', 'medium');
      setValue('tags', []);
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="Task title"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          {...register('description')}
          placeholder="Task description"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select
          value={watch('priority')}
          onValueChange={(value) => setValue('priority', value as TaskFormData['priority'])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Create Task'}
      </Button>
    </form>
  );
};
```

### 4. Runtime Validation
```typescript
// src/utils/runtimeValidation.ts
import { logger } from '@/utils/logger';

export const validateLocalStorageData = (key: string, data: any): boolean => {
  try {
    // Check if data is valid JSON
    const parsed = JSON.parse(data);
    
    // Validate based on key
    switch (key) {
      case 'user_profile':
        return validateUserProfile(parsed).success;
      case 'todo_tasks':
        return Array.isArray(parsed) && parsed.every(task => validateTask(task).success);
      case 'alarms':
        return Array.isArray(parsed) && parsed.every(alarm => validateAlarmTimer(alarm).success);
      default:
        return true;
    }
  } catch (error) {
    logger.error('Failed to validate localStorage data', error as Error, { key });
    return false;
  }
};

export const sanitizeLocalStorageData = (key: string, data: any): any => {
  try {
    switch (key) {
      case 'user_profile':
        const profileResult = validateUserProfile(data);
        if (profileResult.success) {
          return profileResult.data;
        }
        // Return default profile if invalid
        return {
          id: '',
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
      
      case 'todo_tasks':
        if (!Array.isArray(data)) return [];
        return data
          .map(task => validateTask(task))
          .filter(result => result.success)
          .map(result => result.data);
      
      default:
        return data;
    }
  } catch (error) {
    logger.error('Failed to sanitize localStorage data', error as Error, { key });
    return null;
  }
};
```

## Sanitization Strategy

### 1. HTML Sanitization with DOMPurify
```typescript
// src/utils/sanitization.ts
import DOMPurify from 'dompurify';

// Configure DOMPurify
DOMPurify.setConfig({
  ALLOWED_TAGS: [
    'b', 'i', 'em', 'strong', 'u', 'p', 'br', 'span', 'div',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'a', 'img',
  ],
  ALLOWED_ATTR: [
    'href', 'src', 'alt', 'title', 'class', 'style',
    'data-*',
  ],
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  ALLOW_DATA_ATTR: true,
  SANITIZE_DOM: true,
  KEEP_CONTENT: false,
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  WHOLE_DOCUMENT: false,
});

export const sanitizeHTML = (html: string): string => {
  try {
    const sanitized = DOMPurify.sanitize(html);
    logger.info('HTML sanitized', { originalLength: html.length, sanitizedLength: sanitized.length });
    return sanitized;
  } catch (error) {
    logger.error('HTML sanitization failed', error as Error);
    return '';
  }
};

export const sanitizeUserInput = (input: string): string => {
  // Remove any HTML tags
  const noHTML = input.replace(/<[^>]*>/g, '');
  
  // Escape special characters
  const escaped = noHTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
  
  return escaped;
};

export const sanitizeRichText = (text: string): string => {
  // Allow basic formatting but sanitize
  const allowedHTML = text
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/on\w+="[^"]*"/g, '')
    .replace(/javascript:/gi, '');
  
  return sanitizeHTML(allowedHTML);
};
```

### 2. Input Sanitization
```typescript
// src/utils/inputSanitization.ts
export const sanitizeInput = (input: string): string => {
  // Remove control characters
  let sanitized = input.replace(/[\x00-\x1F\x7F]/g, '');
  
  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  // Limit length
  if (sanitized.length > 1000) {
    sanitized = sanitized.substring(0, 1000);
  }
  
  return sanitized;
};

export const sanitizeFilename = (filename: string): string => {
  // Remove path traversal attempts
  let sanitized = filename.replace(/\.\.\//g, '');
  
  // Remove special characters
  sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '');
  
  // Limit length
  if (sanitized.length > 255) {
    sanitized = sanitized.substring(0, 255);
  }
  
  return sanitized;
};

export const sanitizeEmail = (email: string): string => {
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
  
  return email.toLowerCase().trim();
};
```

### 3. URL Sanitization
```typescript
// src/utils/urlSanitization.ts
export const sanitizeURL = (url: string): string => {
  try {
    const parsed = new URL(url);
    
    // Only allow http and https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Invalid protocol');
    }
    
    // Remove dangerous search params
    const safeParams = new URLSearchParams();
    for (const [key, value] of parsed.searchParams) {
      if (!key.match(/^(on|javascript|data)/i)) {
        safeParams.append(key, value);
      }
    }
    
    parsed.search = safeParams.toString();
    
    return parsed.toString();
  } catch (error) {
    logger.error('URL sanitization failed', error as Error, { url });
    return '';
  }
};

export const sanitizeAvatarURL = (url: string): string => {
  // Only allow DiceBear API
  if (!url.startsWith('https://api.dicebear.com/')) {
    throw new Error('Invalid avatar URL');
  }
  
  return sanitizeURL(url);
};
```

## Security Best Practices

### 1. XSS Prevention
```typescript
// src/utils/xssPrevention.ts
import { sanitizeHTML, sanitizeUserInput } from '@/utils/sanitization';

export const preventXSS = (input: string): string => {
  // Multiple layers of protection
  const sanitized = sanitizeUserInput(input);
  
  // Additional checks
  if (sanitized.includes('<script') || sanitized.includes('javascript:')) {
    logger.warn('Potential XSS attempt detected', { input });
    return '';
  }
  
  return sanitized;
};

export const safeRenderHTML = (html: string): string => {
  // Only render if sanitized
  const sanitized = sanitizeHTML(html);
  
  // Check for dangerous patterns
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+=/i,
    /data:/i,
  ];
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(sanitized)) {
      logger.warn('Dangerous pattern detected in HTML', { pattern: pattern.source });
      return '';
    }
  }
  
  return sanitized;
};
```

### 2. Content Security Policy
```typescript
// src/utils/csp.ts
export const generateCSP = (): string => {
  const policies = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'", // Note: 'unsafe-inline' is for development
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' https://api.dicebear.com https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://api.dicebear.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ];

  return policies.join('; ');
};

// In vercel.json
export const cspHeaders = {
  headers: [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: generateCSP(),
        },
      ],
    },
  ],
};
```

### 3. Input Validation in Components
```typescript
// src/components/SecureInput.tsx
import React, { useState } from 'react';
import { sanitizeInput } from '@/utils/inputSanitization';
import { preventXSS } from '@/utils/xssPrevention';

interface SecureInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}

export const SecureInput: React.FC<SecureInputProps> = ({
  value,
  onChange,
  placeholder,
  maxLength = 100,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    try {
      // Sanitize input
      const sanitized = sanitizeInput(rawValue);
      
      // Prevent XSS
      const safe = preventXSS(sanitized);
      
      // Validate length
      if (safe.length > maxLength) {
        setError(`Maximum ${maxLength} characters allowed`);
        return;
      }
      
      setError(null);
      onChange(safe);
    } catch (error) {
      setError('Invalid input');
      logger.error('Input validation error', error as Error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={error ? 'border-red-500' : ''}
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};
```

## Validation in Hooks

### 1. useUserProfile Validation
```typescript
// src/hooks/useUserProfile.ts
import { useState, useEffect } from 'react';
import { validateUserProfile, sanitizeLocalStorageData } from '@/utils/validation';
import { logger } from '@/utils/logger';

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = () => {
      try {
        const stored = localStorage.getItem('user_profile');
        
        if (stored) {
          // Validate stored data
          const parsed = JSON.parse(stored);
          const result = validateUserProfile(parsed);
          
          if (result.success) {
            setProfile(result.data);
            logger.info('User profile loaded successfully');
          } else {
            // Invalid data - sanitize and use defaults
            const sanitized = sanitizeLocalStorageData('user_profile', parsed);
            setProfile(sanitized);
            logger.warn('Invalid user profile data, using defaults');
          }
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
        // Create default profile
        const defaultProfile: UserProfile = {
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
        setProfile(defaultProfile);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!profile) return;

    const updatedProfile = { ...profile, ...updates };
    
    // Validate updated profile
    const result = validateUserProfile(updatedProfile);
    
    if (!result.success) {
      logger.error('Invalid profile update', result.error);
      throw new Error('Invalid profile data');
    }

    // Sanitize before saving
    const sanitized = sanitizeLocalStorageData('user_profile', result.data);
    
    setProfile(sanitized);
    localStorage.setItem('user_profile', JSON.stringify(sanitized));
    logger.info('Profile updated successfully');
  };

  return { profile, isLoading, updateProfile };
};
```

### 2. useLocalStorage Validation
```typescript
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      
      if (stored) {
        // Validate stored data
        const parsed = JSON.parse(stored);
        
        // Add validation based on key
        if (key === 'user_profile') {
          // Basic validation
          if (typeof parsed === 'object' && parsed !== null) {
            return parsed as T;
          }
        } else if (key === 'todo_tasks') {
          if (Array.isArray(parsed)) {
            return parsed as T;
          }
        }
        
        return initialValue;
      }
      
      return initialValue;
    } catch (error) {
      logger.error(`Failed to load from localStorage: ${key}`, error as Error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      // Validate before saving
      if (key === 'user_profile') {
        // Ensure it's a valid object
        if (typeof value !== 'object' || value === null) {
          logger.warn(`Invalid data for ${key}, not saving`);
          return;
        }
      }
      
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      logger.error(`Failed to save to localStorage: ${key}`, error as Error);
    }
  }, [key, value]);

  return [value, setValue] as const;
}
```

## Error Handling

### 1. Validation Error Handler
```typescript
// src/utils/validationError.ts
import { z } from 'zod';
import { logger } from '@/utils/logger';

export const handleValidationError = (error: z.ZodError): string => {
  const messages = error.errors.map(err => {
    const path = err.path.join('.');
    const message = err.message;
    return `${path}: ${message}`;
  });

  const errorMessage = `Validation failed: ${messages.join(', ')}`;
  
  logger.error('Validation error', error, { messages });
  
  return errorMessage;
};

export const getValidationErrors = (error: z.ZodError): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  error.errors.forEach(err => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });
  
  return errors;
};
```

### 2. Sanitization Error Handler
```typescript
// src/utils/sanitizationError.ts
import { logger } from '@/utils/logger';

export const handleSanitizationError = (error: Error, input: string): string => {
  logger.error('Sanitization error', error, { input });
  
  // Return empty string for security
  return '';
};

export const handleHTMLSanitizationError = (error: Error, html: string): string => {
  logger.error('HTML sanitization error', error, { html });
  
  // Return safe fallback
  return '<div class="text-red-500">Content could not be displayed</div>';
};
```

## Testing Validation & Sanitization

### 1. Validation Tests
```typescript
// __tests__/validation.test.ts
import { validateTask, validateUserProfile } from '@/utils/validation';
import { sanitizeHTML, sanitizeUserInput } from '@/utils/sanitization';

describe('Validation', () => {
  describe('Task Validation', () => {
    it('should validate a valid task', () => {
      const validTask = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Test Task',
        description: 'Test Description',
        completed: false,
        priority: 'high',
        priorityColor: 'bg-red-500',
        tags: ['test'],
        subtasks: [],
      };

      const result = validateTask(validTask);
      expect(result.success).toBe(true);
    });

    it('should reject invalid task title', () => {
      const invalidTask = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: '', // Empty title
        description: 'Test Description',
        completed: false,
        priority: 'high',
        priorityColor: 'bg-red-500',
        tags: ['test'],
        subtasks: [],
      };

      const result = validateTask(invalidTask);
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toContain('Title is required');
    });

    it('should reject task with too many tags', () => {
      const invalidTask = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Test Task',
        description: 'Test Description',
        completed: false,
        priority: 'high',
        priorityColor: 'bg-red-500',
        tags: Array(11).fill('tag'), // 11 tags
        subtasks: [],
      };

      const result = validateTask(invalidTask);
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toContain('Maximum 10 tags');
    });
  });

  describe('User Profile Validation', () => {
    it('should validate a valid user profile', () => {
      const validProfile = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        username: 'testuser',
        email: 'test@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
        theme: 'dark',
        createdAt: new Date(),
        lastVisit: new Date(),
        settings: {
          notifications: true,
          soundEnabled: true,
          selectedSound: 'bell',
        },
      };

      const result = validateUserProfile(validProfile);
      expect(result.success).toBe(true);
    });

    it('should reject invalid username', () => {
      const invalidProfile = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        username: 'ab', // Too short
        email: 'test@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
        theme: 'dark',
        createdAt: new Date(),
        lastVisit: new Date(),
        settings: {
          notifications: true,
          soundEnabled: true,
          selectedSound: 'bell',
        },
      };

      const result = validateUserProfile(invalidProfile);
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toContain('at least 3 characters');
    });
  });
});

describe('Sanitization', () => {
  describe('HTML Sanitization', () => {
    it('should remove script tags', () => {
      const html = '<div>Hello <script>alert("xss")</script></div>';
      const sanitized = sanitizeHTML(html);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('Hello');
    });

    it('should remove dangerous attributes', () => {
      const html = '<div onclick="alert(\'xss\')">Click me</div>';
      const sanitized = sanitizeHTML(html);
      expect(sanitized).not.toContain('onclick');
    });

    it('should allow safe HTML', () => {
      const html = '<div><strong>Bold</strong> and <em>italic</em></div>';
      const sanitized = sanitizeHTML(html);
      expect(sanitized).toContain('<strong>');
      expect(sanitized).toContain('<em>');
    });
  });

  describe('Input Sanitization', () => {
    it('should remove control characters', () => {
      const input = 'Hello\x00World';
      const sanitized = sanitizeUserInput(input);
      expect(sanitized).not.toContain('\x00');
    });

    it('should trim whitespace', () => {
      const input = '  Hello World  ';
      const sanitized = sanitizeUserInput(input);
      expect(sanitized).toBe('Hello World');
    });

    it('should escape special characters', () => {
      const input = '<script>alert("xss")</script>';
      const sanitized = sanitizeUserInput(input);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('alert');
    });
  });
});
```

## Validation & Sanitization Best Practices

### 1. Defense in Depth
- **Client-side validation**: Immediate feedback
- **Server-side validation**: Final validation (if applicable)
- **Database constraints**: Last line of defense
- **Output encoding**: Prevent XSS in rendering

### 2. Input Validation Rules
- **Never trust user input**: Always validate
- **Whitelist over blacklist**: Allow only known good patterns
- **Length limits**: Prevent buffer overflows
- **Type checking**: Ensure correct data types
- **Range checking**: Validate numeric ranges

### 3. Sanitization Rules
- **Remove dangerous tags**: script, style, iframe, etc.
- **Remove dangerous attributes**: on*, javascript:, data:
- **Escape special characters**: <, >, &, ", '
- **Validate URLs**: Only allow safe protocols
- **Limit input size**: Prevent DoS attacks

### 4. Error Handling
- **Don't expose details**: Don't leak system info
- **Log errors**: For debugging and monitoring
- **User-friendly messages**: Don't confuse users
- **Fail securely**: Default to safe behavior

## Validation & Sanitization Checklist

### Before Deployment
- [ ] All forms validated with Zod
- [ ] All user inputs sanitized
- [ ] HTML content sanitized with DOMPurify
- [ ] URLs validated and sanitized
- [ ] File names sanitized
- [ ] Email addresses validated
- [ ] XSS prevention implemented
- [ ] CSP headers configured
- [ ] Error handling implemented
- [ ] Tests written and passing

### After Deployment
- [ ] Monitor validation errors
- [ ] Check for XSS attempts
- [ ] Review security logs
- [ ] Update validation rules as needed
- [ ] Regular security audits

## Validation & Sanitization Conclusion

This validation and sanitization strategy provides:
1. **Schema Validation**: Type-safe data validation with Zod
2. **HTML Sanitization**: Safe rendering of user content
3. **Input Sanitization**: Protection against injection attacks
4. **XSS Prevention**: Multiple layers of protection
5. **Error Handling**: Graceful failure handling
6. **Testing**: Comprehensive test coverage

**Key Benefits:**
- **Data Integrity**: Valid data only
- **Security**: Protection against XSS and injection
- **User Experience**: Clear error messages
- **Maintainability**: Centralized validation logic
- **Compliance**: Meets security standards

**Next Steps:**
1. Implement validation in all forms
2. Add sanitization to all user inputs
3. Set up CSP headers
4. Write comprehensive tests
5. Regular security audits

**Happy validating! 🔒**