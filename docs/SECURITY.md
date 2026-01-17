# Security Documentation

## Overview
This document describes the security strategy for the TodoList application. We implement multiple layers of security to protect against common web vulnerabilities and ensure data privacy.

## Security Layers

### 1. Defense in Depth
```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                          │
├─────────────────────────────────────────────────────────────┤
│ 1. Input Validation & Sanitization                          │
│ 2. Output Encoding & XSS Prevention                         │
│ 3. Content Security Policy (CSP)                            │
│ 4. Secure Headers                                           │
│ 5. Data Encryption                                          │
│ 6. Access Controls                                          │
│ 7. Monitoring & Logging                                     │
└─────────────────────────────────────────────────────────────┘
```

### 2. Security Checklist
- [ ] Input validation
- [ ] Output encoding
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] CSP headers
- [ ] Secure cookies
- [ ] HTTPS enforcement
- [ ] Dependency scanning
- [ ] Security headers
- [ ] Error handling

## Input Validation

### 1. Schema Validation
```typescript
// src/schemas/security.schema.ts
import { z } from 'zod';

// User Input Schema
export const userInputSchema = z.object({
  text: z.string()
    .min(1, 'Text is required')
    .max(1000, 'Text must be 1000 characters or less')
    .regex(/^[a-zA-Z0-9\s.,!?@\-_]+$/, 'Invalid characters detected')
    .trim(),
  email: z.string()
    .email('Invalid email format')
    .max(100, 'Email must be 100 characters or less'),
  url: z.string()
    .url('Invalid URL format')
    .max(500, 'URL must be 500 characters or less')
    .refine((url) => {
      try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
      } catch {
        return false;
      }
    }, 'URL must use http or https protocol'),
});

// File Upload Schema
export const fileUploadSchema = z.object({
  filename: z.string()
    .min(1, 'Filename is required')
    .max(255, 'Filename must be 255 characters or less')
    .regex(/^[a-zA-Z0-9._-]+$/, 'Invalid filename characters'),
  size: z.number()
    .max(5 * 1024 * 1024, 'File size must be less than 5MB'),
  type: z.enum(['image/jpeg', 'image/png', 'image/gif', 'application/json']),
});
```

### 2. Input Sanitization
```typescript
// src/utils/securitySanitization.ts
import DOMPurify from 'dompurify';

export const sanitizeInput = (input: string): string => {
  // Remove control characters
  let sanitized = input.replace(/[\x00-\x1F\x7F]/g, '');
  
  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');
  
  // Remove potential XSS vectors
  const xssPatterns = [
    /<script[^>]*>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /on\w+="[^"]*"/g,
    /data:/gi,
    /vbscript:/gi,
  ];
  
  xssPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  
  // Trim and limit length
  sanitized = sanitized.trim();
  if (sanitized.length > 1000) {
    sanitized = sanitized.substring(0, 1000);
  }
  
  return sanitized;
};

export const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'u', 'p', 'br', 'span'],
    ALLOWED_ATTR: ['class', 'style'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  });
};

export const sanitizeURL = (url: string): string => {
  try {
    const parsed = new URL(url);
    
    // Only allow http and https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
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
  } catch {
    return '';
  }
};
```

## XSS Prevention

### 1. Content Security Policy
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
    "object-src 'none'",
    "upgrade-insecure-requests",
  ];

  return policies.join('; ');
};

// In vercel.json
export const securityHeaders = {
  headers: [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: generateCSP(),
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()',
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains',
        },
      ],
    },
  ],
};
```

### 2. Safe Rendering
```typescript
// src/utils/safeRendering.ts
import { sanitizeHTML } from '@/utils/securitySanitization';

export const safeRenderHTML = (html: string): string => {
  // Multiple layers of protection
  const sanitized = sanitizeHTML(html);
  
  // Additional checks
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+=/i,
    /data:/i,
  ];
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(sanitized)) {
      console.warn('Dangerous pattern detected in HTML');
      return '';
    }
  }
  
  return sanitized;
};

export const safeRenderText = (text: string): string => {
  // Escape HTML entities
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};
```

## CSRF Protection

### 1. CSRF Token Generation
```typescript
// src/utils/csrf.ts
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const validateCSRFToken = (token: string): boolean => {
  // In a real application, you would validate against a stored token
  // For this client-side app, we'll use a simple check
  const stored = sessionStorage.getItem('csrf_token');
  return token === stored;
};

export const setCSRFToken = (): string => {
  const token = generateCSRFToken();
  sessionStorage.setItem('csrf_token', token);
  return token;
};
```

### 2. CSRF Protection in Forms
```typescript
// src/components/SecureForm.tsx
import React, { useState, useEffect } from 'react';
import { generateCSRFToken, validateCSRFToken } from '@/utils/csrf';

interface SecureFormProps {
  onSubmit: (data: any) => void;
  children: React.ReactNode;
}

export const SecureForm: React.FC<SecureFormProps> = ({ onSubmit, children }) => {
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    const token = generateCSRFToken();
    setCsrfToken(token);
    sessionStorage.setItem('csrf_token', token);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate CSRF token
    if (!validateCSRFToken(csrfToken)) {
      console.error('CSRF token validation failed');
      return;
    }
    
    // Submit form data
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="csrf_token" value={csrfToken} />
      {children}
    </form>
  );
};
```

## Secure Headers

### 1. HTTP Security Headers
```typescript
// src/utils/securityHeaders.ts
export const getSecurityHeaders = (): Record<string, string> => {
  return {
    'Content-Security-Policy': generateCSP(),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-XSS-Protection': '1; mode=block',
  };
};

// In vercel.json
export const securityHeadersConfig = {
  headers: [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: generateCSP(),
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()',
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
    },
  ],
};
```

### 2. Secure Cookies
```typescript
// src/utils/secureCookies.ts
export const setSecureCookie = (name: string, value: string, options: any = {}) => {
  const defaults = {
    secure: true,
    sameSite: 'strict',
    httpOnly: false, // Note: httpOnly can't be set from client-side
    maxAge: 3600, // 1 hour
  };

  const cookieOptions = { ...defaults, ...options };
  
  const cookieString = `${name}=${value}; ` +
    `Secure=${cookieOptions.secure}; ` +
    `SameSite=${cookieOptions.sameSite}; ` +
    `Max-Age=${cookieOptions.maxAge}; ` +
    `Path=/`;

  document.cookie = cookieString;
};

export const getSecureCookie = (name: string): string | null => {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) {
      return value;
    }
  }
  return null;
};

export const deleteSecureCookie = (name: string) => {
  document.cookie = `${name}=; Secure; SameSite=Strict; Max-Age=0; Path=/`;
};
```

## Data Encryption

### 1. Client-Side Encryption
```typescript
// src/utils/encryption.ts
export const encryptData = async (data: string, key: string): Promise<string> => {
  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    // Generate key from passphrase
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(key),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );
    
    const derivedKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('salt'),
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      derivedKey,
      dataBuffer
    );
    
    const encryptedArray = new Uint8Array(encrypted);
    const combined = new Uint8Array(iv.length + encryptedArray.length);
    combined.set(iv);
    combined.set(encryptedArray, iv.length);
    
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption failed:', error);
    throw error;
  }
};

export const decryptData = async (encrypted: string, key: string): Promise<string> => {
  try {
    const combined = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(key),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );
    
    const derivedKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('salt'),
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      derivedKey,
      data
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw error;
  }
};
```

### 2. Secure Storage
```typescript
// src/utils/secureStorage.ts
import { encryptData, decryptData } from '@/utils/encryption';

export const secureLocalStorage = {
  setItem: async (key: string, value: any, encryptionKey: string) => {
    try {
      const encrypted = await encryptData(JSON.stringify(value), encryptionKey);
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Failed to set secure localStorage item:', error);
    }
  },
  
  getItem: async (key: string, encryptionKey: string): Promise<any> => {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      
      const decrypted = await decryptData(encrypted, encryptionKey);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Failed to get secure localStorage item:', error);
      return null;
    }
  },
  
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
};
```

## Access Controls

### 1. Role-Based Access Control
```typescript
// src/utils/accessControl.ts
export type UserRole = 'admin' | 'user' | 'guest';

export interface UserPermissions {
  canCreateTasks: boolean;
  canEditTasks: boolean;
  canDeleteTasks: boolean;
  canViewTasks: boolean;
  canManageUsers: boolean;
  canViewAnalytics: boolean;
}

export const getPermissions = (role: UserRole): UserPermissions => {
  const permissions: Record<UserRole, UserPermissions> = {
    admin: {
      canCreateTasks: true,
      canEditTasks: true,
      canDeleteTasks: true,
      canViewTasks: true,
      canManageUsers: true,
      canViewAnalytics: true,
    },
    user: {
      canCreateTasks: true,
      canEditTasks: true,
      canDeleteTasks: true,
      canViewTasks: true,
      canManageUsers: false,
      canViewAnalytics: false,
    },
    guest: {
      canCreateTasks: false,
      canEditTasks: false,
      canDeleteTasks: false,
      canViewTasks: true,
      canManageUsers: false,
      canViewAnalytics: false,
    },
  };

  return permissions[role];
};

export const checkPermission = (role: UserRole, permission: keyof UserPermissions): boolean => {
  const permissions = getPermissions(role);
  return permissions[permission];
};
```

### 2. Feature Flags
```typescript
// src/utils/featureFlags.ts
export const getFeatureFlags = (): Record<string, boolean> => {
  // In production, fetch from Vercel Edge Config
  return {
    enableAlarms: true,
    enableAvatarConstructor: true,
    enableAnalytics: true,
    enableExport: true,
    enableImport: true,
  };
};

export const isFeatureEnabled = (feature: string): boolean => {
  const flags = getFeatureFlags();
  return flags[feature] || false;
};
```

## Dependency Security

### 1. Dependency Scanning
```bash
# Check for vulnerabilities
npm audit

# Check for outdated dependencies
npm outdated

# Check for unused dependencies
npx depcheck

# Generate security report
npm audit --json > security-report.json
```

### 2. Dependency Updates
```json
// package.json
{
  "scripts": {
    "audit": "npm audit --audit-level=moderate",
    "outdated": "npm outdated",
    "update-deps": "npm update",
    "security-check": "npm audit && npx depcheck"
  }
}
```

## Security Monitoring

### 1. Security Logging
```typescript
// src/utils/securityLogging.ts
import { logger } from '@/utils/logger';

export const logSecurityEvent = (event: string, data?: any) => {
  logger.info(`Security: ${event}`, data);
  
  // Send to security monitoring service
  fetch('/api/security', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event,
      data,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }),
  }).catch(() => {
    // Silently fail
  });
};

export const logFailedLogin = (username: string) => {
  logSecurityEvent('failed_login', { username });
};

export const logXSSAttempt = (input: string) => {
  logSecurityEvent('xss_attempt', { input });
};

export const logCSRFAttempt = () => {
  logSecurityEvent('csrf_attempt');
};
```

### 2. Security Dashboard
```typescript
// src/components/SecurityDashboard.tsx
import React, { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';

export const SecurityDashboard: React.FC = () => {
  const [securityEvents, setSecurityEvents] = useState<any[]>([]);

  useEffect(() => {
    const logs = logger.getLogs();
    const securityLogs = logs.filter(log => 
      log.message.includes('Security:') || 
      log.message.includes('XSS') ||
      log.message.includes('CSRF')
    );
    setSecurityEvents(securityLogs);
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h2 className="text-xl font-bold mb-4">Security Dashboard</h2>
      
      <div className="space-y-2">
        {securityEvents.length === 0 ? (
          <p className="text-gray-500">No security events logged</p>
        ) : (
          securityEvents.map((event, index) => (
            <div key={index} className="bg-white p-3 rounded border border-gray-200">
              <div className="flex justify-between">
                <span className="font-bold">{event.message}</span>
                <span className="text-sm text-gray-500">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
              {event.data && (
                <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-auto">
                  {JSON.stringify(event.data, null, 2)}
                </pre>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
```

## Security Best Practices

### 1. Input Validation Rules
- **Never trust user input**: Always validate
- **Whitelist over blacklist**: Allow only known good patterns
- **Length limits**: Prevent buffer overflows
- **Type checking**: Ensure correct data types
- **Range checking**: Validate numeric ranges

### 2. Output Encoding Rules
- **Escape HTML entities**: <, >, &, ", '
- **Escape JavaScript**: Use JSON.stringify for data
- **Escape URLs**: Use encodeURIComponent
- **Escape CSS**: Use CSS.escape

### 3. Security Headers Rules
- **CSP**: Restrict sources
- **X-Frame-Options**: DENY or SAMEORIGIN
- **X-Content-Type-Options**: nosniff
- **Referrer-Policy**: strict-origin-when-cross-origin
- **Permissions-Policy**: Disable unused features

### 4. Error Handling Rules
- **Don't expose details**: Don't leak system info
- **Log errors**: For debugging and monitoring
- **User-friendly messages**: Don't confuse users
- **Fail securely**: Default to safe behavior

## Security Checklist

### Before Deployment
- [ ] All inputs validated
- [ ] All outputs encoded
- [ ] XSS prevention implemented
- [ ] CSRF protection implemented
- [ ] CSP headers configured
- [ ] Secure headers configured
- [ ] HTTPS enforced
- [ ] Dependencies scanned
- [ ] Error handling implemented
- [ ] Security logging implemented
- [ ] Access controls implemented
- [ ] Feature flags configured

### After Deployment
- [ ] Monitor security events
- [ ] Review security logs
- [ ] Check for vulnerabilities
- [ ] Update dependencies
- [ ] Regular security audits

## Security Conclusion

This security strategy provides:
1. **Input Validation**: Protection against injection attacks
2. **XSS Prevention**: Multiple layers of protection
3. **CSRF Protection**: Token-based validation
4. **Secure Headers**: Defense against common attacks
5. **Data Encryption**: Client-side encryption
6. **Access Controls**: Role-based permissions
7. **Security Monitoring**: Real-time event tracking

**Key Benefits:**
- **Data Protection**: Encrypted storage
- **Attack Prevention**: Multiple defense layers
- **Compliance**: Meets security standards
- **Monitoring**: Real-time security tracking
- **Recovery**: Automatic security recovery

**Next Steps:**
1. Implement all security measures
2. Set up security monitoring
3. Configure security headers
4. Write security tests
5. Regular security audits

**Happy securing! 🔒**