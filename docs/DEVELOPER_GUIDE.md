# Developer Guide

## Overview
This guide provides comprehensive instructions for developers working on the TodoList application. The application is built with React, TypeScript, Vite, and Tailwind CSS.

## Prerequisites

### Required Tools
- Node.js 18+ (LTS recommended)
- npm 9+ or yarn 1.22+
- Git
- Code editor (VS Code recommended)

### Recommended Extensions
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript React Snippets

## Project Structure

```
src/
├── components/
│   ├── ui/           # Shadcn UI components
│   ├── AdaptiveCardTitle.tsx
│   ├── AlarmControl.tsx
│   ├── AlarmStatusBadge.tsx
│   ├── AlarmToggle.tsx
│   ├── AvatarConstructor.tsx
│   ├── PremiumHeader.tsx
│   ├── ProfileBadge.tsx
│   ├── ProfileComponentsWrapper.tsx
│   ├── ProfileSettings.tsx
│   ├── ScrollNav.tsx
│   ├── TaskCard.tsx
│   ├── TaskTimerButton.tsx
│   └── UserProfileCard.tsx
├── hooks/
│   ├── useAlarmTimer.ts
│   ├── useAvatarSync.ts
│   ├── useLocalStorage.ts
│   ├── use-mobile.tsx
│   ├── useUserProfile.ts
│   └── useToast.ts
├── pages/
│   ├── Index.tsx
│   ├── Guide.tsx
│   └── NotFound.tsx
├── utils/
│   └── toast.ts
├── lib/
│   └── utils.ts
├── globals.css
├── App.tsx
├── main.tsx
└── vite-env.d.ts
```

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/todo-list-app.git
cd todo-list-app
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Start Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173` (or `http://localhost:3000`).

### 4. Build for Production
```bash
npm run build
# or
yarn build
```

### 5. Preview Production Build
```bash
npm run preview
# or
yarn preview
```

## Development Workflow

### Code Style
- Use TypeScript for all new code
- Follow ESLint rules (configured in `eslint.config.js`)
- Use Prettier for formatting
- Follow React best practices

### Component Structure
```tsx
// Example component structure
import React from 'react';
import { cn } from '@/lib/utils';

interface ComponentProps {
  // Props definition
}

export const Component: React.FC<ComponentProps> = ({ /* props */ }) => {
  // Component logic
  return (
    // JSX
  );
};
```

### Hook Structure
```tsx
// Example hook structure
import { useState, useEffect } from 'react';

export const useCustomHook = () => {
  // Hook logic
  return {
    // Return values
  };
};
```

## Key Concepts

### 1. State Management
- **LocalStorage**: For persistent data (tasks, user profile)
- **React State**: For UI state (modals, forms)
- **Context API**: For global state (theme, user)

### 2. Routing
- **React Router DOM**: For client-side routing
- **Dynamic Imports**: For code splitting

### 3. Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: Component library
- **Framer Motion**: Animations

### 4. Data Validation
- **Zod**: Schema validation
- **DOMPurify**: HTML sanitization (if implemented)

## Common Tasks

### Adding a New Component
1. Create a new file in `src/components/`
2. Define props interface
3. Implement component logic
4. Add to `src/pages/Index.tsx` or other pages
5. Test in browser

### Adding a New Hook
1. Create a new file in `src/hooks/`
2. Follow the hook pattern
3. Add TypeScript types
4. Test with React DevTools

### Adding a New Page
1. Create a new file in `src/pages/`
2. Add route in `src/App.tsx`
3. Update navigation if needed
4. Test routing

### Adding a New Feature
1. Create feature branch: `git checkout -b feature/your-feature`
2. Implement feature
3. Write tests
4. Update documentation
5. Create pull request

## Testing

### Unit Tests
```bash
npm run test
# or
yarn test
```

### Component Tests
```bash
npm run test:components
# or
yarn test:components
```

### E2E Tests
```bash
npm run test:e2e
# or
yarn test:e2e
```

## Debugging

### React DevTools
1. Install React DevTools browser extension
2. Open browser console
3. Inspect component state and props

### Vite DevTools
1. Open browser console
2. Check Vite logs
3. Use `vite-plugin-inspect` for detailed analysis

### Sentry Integration
1. Configure Sentry DSN in `.env`
2. Check Sentry dashboard for errors
3. Use source maps for debugging

## Performance Optimization

### 1. Code Splitting
```tsx
// Dynamic import
const LazyComponent = React.lazy(() => import('./LazyComponent'));

// Usage
<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>
```

### 2. Memoization
```tsx
// React.memo for components
const MemoizedComponent = React.memo(Component);

// useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return heavyComputation(data);
}, [data]);

// useCallback for event handlers
const handleClick = useCallback(() => {
  // handler logic
}, [dependencies]);
```

### 3. Virtualization (Planned)
```tsx
// Example with react-window (when implemented)
import { FixedSizeList as List } from 'react-window';

<List
  height={400}
  itemCount={1000}
  itemSize={50}
  width={300}
>
  {Row}
</List>
```

## Security Best Practices

### 1. Input Validation
```tsx
import { z } from 'zod';

const taskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

const validateTask = (data) => {
  const result = taskSchema.safeParse(data);
  if (!result.success) {
    throw new Error('Invalid data');
  }
  return result.data;
};
```

### 2. XSS Protection
```tsx
// Use DOMPurify for HTML sanitization
import DOMPurify from 'dompurify';

const sanitizedHTML = DOMPurify.sanitize(userInput);
```

### 3. CSP Headers
```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
        }
      ]
    }
  ]
}
```

## CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
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

  deploy:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Monitoring & Logging

### 1. Sentry Integration
```tsx
// src/main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

### 2. Vercel Analytics
```tsx
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

### 3. Custom Logging
```tsx
// src/utils/logger.ts
export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data);
    // Send to Sentry or other logging service
  },
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error);
    // Send to Sentry
  },
  warn: (message: string) => {
    console.warn(`[WARN] ${message}`);
  },
};
```

## Deployment

### Vercel Deployment
1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Environment Variables
```env
# Required
VITE_SENTRY_DSN=your_sentry_dsn
VITE_VERCEL_ANALYTICS_ID=your_vercel_analytics_id

# Optional
VITE_API_BASE_URL=https://api.example.com
VITE_FEATURE_FLAGS=enableAlarms,enableAvatarConstructor
```

## Troubleshooting

### Common Issues

#### 1. "Rendered more hooks than during the previous render"
**Solution**: Ensure hooks are called unconditionally at the top level of components.

#### 2. "LocalStorage quota exceeded"
**Solution**: Implement IndexedDB for larger datasets or add data cleanup logic.

#### 3. "CORS error with external APIs"
**Solution**: Use proxy or cache responses locally.

#### 4. "Performance issues with large lists"
**Solution**: Implement virtualization or pagination.

### Debugging Commands
```bash
# Check bundle size
npm run build -- --report

# Analyze dependencies
npm run build -- --analyze

# Check for unused dependencies
npx depcheck
```

## Contributing

### Pull Request Process
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push to branch: `git push origin feature/your-feature`
5. Create pull request

### Code Review Guidelines
- All code must pass linting and tests
- New features must include tests
- Documentation must be updated
- Follow existing code style

## Resources

### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn UI Documentation](https://ui.shadcn.com/)
- [Vite Documentation](https://vitejs.dev/)

### Tools
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Vite DevTools](https://vitejs.dev/guide/api-plugin.html#vite-plugin-inspect)
- [Sentry](https://sentry.io/)
- [Vercel Analytics](https://vercel.com/analytics)

### Community
- [GitHub Issues](https://github.com/your-username/todo-list-app/issues)
- [Discussions](https://github.com/your-username/todo-list-app/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/todo-list-app)

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.