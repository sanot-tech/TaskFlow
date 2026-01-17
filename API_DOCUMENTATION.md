# API Documentation

## Overview
This document provides comprehensive API documentation for the TodoList application. The application uses a combination of local storage, browser APIs, and external services.

## Base URL
The application is a client-side SPA. All APIs are either:
1. **Local APIs** - Browser APIs and localStorage
2. **External APIs** - Third-party services (DiceBear, Google Fonts)
3. **Internal APIs** - Custom hooks and utilities

## Authentication
No authentication is required. All data is stored locally in the user's browser.

## Rate Limits
- **DiceBear API**: No official rate limits, but recommended to cache avatars locally
- **Google Fonts**: Subject to Google's standard rate limits
- **Local Storage**: Limited by browser storage quota (typically 5-10MB)

## Endpoints

### 1. User Profile API

#### `GET /api/user/profile` (Simulated)
Returns the current user profile from localStorage.

**Response:**
```json
{
  "id": "user_1234567890_abc123",
  "username": "HappyPanda123",
  "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=...",
  "theme": "dark",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "lastVisit": "2024-01-15T10:30:00.000Z",
  "settings": {
    "notifications": true,
    "soundEnabled": true,
    "selectedSound": "bell"
  }
}
```

#### `POST /api/user/profile` (Simulated)
Updates the user profile.

**Request Body:**
```json
{
  "username": "NewUsername",
  "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=new_seed",
  "theme": "light"
}
```

**Response:**
```json
{
  "success": true,
  "profile": { /* updated profile */ }
}
```

### 2. Tasks API

#### `GET /api/tasks` (Simulated)
Returns all tasks from localStorage.

**Response:**
```json
[
  {
    "id": "task_1234567890",
    "title": "Complete Project Proposal",
    "description": "Finish the Q4 project proposal",
    "completed": false,
    "priority": "High Priority",
    "priorityColor": "bg-red-500",
    "dueDate": "2024-01-20T00:00:00.000Z",
    "tags": ["work", "urgent"],
    "subtasks": [
      {
        "id": "subtask_1234567890",
        "title": "Research competitors",
        "completed": true
      }
    ]
  }
]
```

#### `POST /api/tasks` (Simulated)
Creates a new task.

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task description",
  "priority": "Medium Priority",
  "priorityColor": "bg-yellow-500",
  "dueDate": "2024-01-25T00:00:00.000Z",
  "tags": ["personal"]
}
```

**Response:**
```json
{
  "success": true,
  "task": { /* created task */ }
}
```

#### `PUT /api/tasks/:id` (Simulated)
Updates a task.

**Request Body:**
```json
{
  "title": "Updated Task Title",
  "completed": true
}
```

#### `DELETE /api/tasks/:id` (Simulated)
Deletes a task.

**Response:**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

### 3. Alarm Timer API

#### `POST /api/alarm/start` (Simulated)
Starts a timer for a task.

**Request Body:**
```json
{
  "taskId": "task_1234567890",
  "taskTitle": "Complete Project Proposal",
  "duration": 25
}
```

**Response:**
```json
{
  "success": true,
  "alarm": {
    "taskId": "task_1234567890",
    "taskTitle": "Complete Project Proposal",
    "duration": 25,
    "isActive": true,
    "remainingTime": 1500
  }
}
```

#### `POST /api/alarm/stop` (Simulated)
Stops a timer.

**Request Body:**
```json
{
  "taskId": "task_1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Timer stopped"
}
```

### 4. External APIs

#### DiceBear Avatar API
**URL:** `https://api.dicebear.com/7.x/avataaars/svg`

**Parameters:**
- `seed` (required): Unique identifier for the avatar
- `backgroundColor`: Hex color code (e.g., "b6e3f4")
- `accessories`: Glasses type (e.g., "round", "sunglasses")
- `skinColor`: Skin tone (e.g., "edb98a")
- `topType`: Hair style (e.g., "shortHairShortFlat")
- `hairColor`: Hair color (e.g., "2c1b18")
- `clothingType`: Clothing style (e.g., "blazerShirt")
- `clothingColor`: Clothing color (e.g., "25557c")
- `eyeType`: Eye style (e.g., "happy")
- `mouthType`: Mouth style (e.g., "smile")
- `radius`: Border radius (e.g., "50")

**Example:**
```
https://api.dicebear.com/7.x/avataaars/svg?seed=user_123&backgroundColor=b6e3f4&accessories=round&skinColor=edb98a&topType=shortHairShortFlat&hairColor=2c1b18&clothingType=blazerShirt&clothingColor=25557c&eyeType=happy&mouthType=smile&radius=50
```

#### Google Fonts API
**URL:** `https://fonts.googleapis.com/css2`

**Parameters:**
- `family`: Font family name (e.g., "Inter:wght@300;400;500;600;700")
- `display`: Display strategy (e.g., "swap")

**Example:**
```
https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap
```

## Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Additional error details (optional)"
  }
}
```

### Common Error Codes
- `STORAGE_QUOTA_EXCEEDED`: Local storage quota exceeded
- `INVALID_DATA`: Data validation failed
- `NETWORK_ERROR`: External API request failed
- `PERMISSION_DENIED`: Browser permission denied (e.g., notifications)
- `ALREADY_EXISTS`: Resource already exists
- `NOT_FOUND`: Resource not found

## Security Considerations

### 1. Data Validation
All user inputs are validated using Zod schemas before storage.

### 2. Sanitization
- HTML content is sanitized using DOMPurify (if implemented)
- User inputs are escaped before rendering

### 3. XSS Protection
- Content Security Policy (CSP) headers
- No `innerHTML` usage without sanitization
- Safe attribute binding

### 4. Data Storage
- Sensitive data is not stored in localStorage
- All data is client-side only
- No server-side storage required

## Performance Optimization

### 1. Caching Strategy
- **Static Assets**: Cache for 1 year (Cache-Control: public, max-age=31536000)
- **API Responses**: Cache for 5 minutes (Cache-Control: public, max-age=300)
- **User Data**: Cache in IndexedDB for offline access

### 2. Lazy Loading
- Components are lazy-loaded using `React.lazy()`
- Routes are code-split using dynamic imports
- Images are lazy-loaded using `loading="lazy"`

### 3. Memoization
- `React.memo()` for expensive components
- `useMemo()` for expensive calculations
- `useCallback()` for event handlers

### 4. Virtualization (Planned)
- Virtual scrolling for large task lists
- Windowing for performance optimization

## Browser Compatibility

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Required Features
- localStorage
- IndexedDB
- Web Audio API
- Notification API
- Vibration API
- BroadcastChannel API

## Environment Variables

### Required Variables
```env
VITE_SENTRY_DSN=your_sentry_dsn
VITE_VERCEL_ANALYTICS_ID=your_vercel_analytics_id
```

### Optional Variables
```env
VITE_API_BASE_URL=https://api.example.com
VITE_FEATURE_FLAGS=enableAlarms,enableAvatarConstructor
```

## API Versioning

### Current Version: v1.0.0
- Initial release
- All endpoints are stable

### Version History
- **v1.0.0** (2024-01-15): Initial release

## Deprecation Policy
- API endpoints will be deprecated with 6 months notice
- Deprecated endpoints will return 410 Gone status
- Migration guides will be provided

## Support
For API-related issues, please create an issue on GitHub or contact the development team.