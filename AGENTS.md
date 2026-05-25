# AGENTS.md — AI Assistant Guide

This file provides context for AI coding assistants (openode, Cursor, Windsurf, etc.)
to understand the project structure, conventions, and workflows.

## Project Overview

- **Name**: TaskFlow — Enterprise Task Management Platform
- **Stack**: React 19 + TypeScript 5.7 (strict) + Vite 6 + Tailwind CSS 4
- **Routing**: React Router 7 (client-side)
- **State**: React Context + localStorage (TanStack Query ready for API)
- **Testing**: Vitest + Testing Library (97 tests, 97 passing)
- **Package Manager**: npm (lockfile: package-lock.json)
- **Build**: `npm run build` → outputs to `dist/`
- **Dev**: `npm run dev` → http://localhost:5173

## Project Structure

```
src/
├── __tests__/        # Test files (co-located by domain)
├── components/
│   ├── ui/           # Atomic UI primitives (shadcn/ui)
│   └── *.tsx         # Composite business components
├── contexts/         # React context providers (Alarm, Avatar)
├── hooks/            # Custom React hooks
├── lib/              # Utility functions (cn, etc.)
├── pages/            # Route-level components (Index, Guide, NotFound)
├── App.tsx           # Root component with routing
└── main.tsx          # Application entry point
```

## Key Conventions

### Components
- Functional components with hooks only (no class components)
- Props typed as `interface ComponentNameProps`
- One component per file (except tightly-coupled sub-components)
- Custom hooks: `useXxx` naming pattern

### Imports (ordered)
1. React
2. Third-party libraries
3. Internal `@/` aliases
4. Styles (when applicable)

### Styling
- Tailwind utility classes first; `cn()` helper for composition
- Mobile-first responsive design (sm → md → lg → xl)
- Framer Motion for animations

### State Management
- `useLocalStorage<T>` hook for persistence (generic, typed)
- React Context for cross-cutting concerns (avatar, alarm)
- No Redux/Zustand (kept intentionally simple)

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (HMR) |
| `npm run build` | Production build |
| `npm test` | Run all tests |
| `npm test -- -u` | Update snapshots |
| `npx tsc --noEmit` | TypeScript check |
| `npx eslint src/` | Lint check |

## Important Files

| File | Purpose |
|------|---------|
| `src/pages/Index.tsx` | Main page — task management |
| `src/pages/Guide.tsx` | User guide with enterprise footer |
| `src/contexts/AvatarContext.tsx` | Avatar state (shared across components) |
| `src/contexts/AlarmContext.tsx` | Alarm timer state |
| `src/hooks/useLocalStorage.ts` | Generic localStorage hook with JSON serialization |
| `src/hooks/useUserProfile.ts` | User profile lifecycle |
| `src/components/ScrollNav.tsx` | Side navigation (frame-scrolling) |
| `src/components/ProfileSettings.tsx` | Profile dialog with avatar constructor |

## Known Patterns

### Adding a New Component
1. Create file in `src/components/` with PascalCase name
2. Define props interface
3. Export as named export
4. Add tests in `src/__tests__/`
5. Import via `@/components/ComponentName`

### Adding a New Page
1. Create file in `src/pages/`
2. Export as default export
3. Add route in `src/App.tsx`

### Adding a New Context
1. Create file in `src/contexts/`
2. Export Provider + consumer hook
3. Wrap in `src/App.tsx`
