# AGENTS.md — AI Assistant Guide

This file provides context for AI coding assistants (openode, Cursor, Windsurf, Cline, etc.)
to understand the project structure, conventions, and workflows for this project.
It also serves as a **template guide for publishing new projects to GitHub** with
professional standards.

---

## 1. Project Overview

| Field | Value |
|-------|-------|
| **Name** | TaskFlow |
| **Stack** | React 19 + TypeScript 5.7 (strict) + Vite 6 + Tailwind CSS 4 |
| **Routing** | React Router 7 |
| **State** | React Context + localStorage |
| **Testing** | Vitest + Testing Library (97 tests) |
| **Package Manager** | npm |
| **Dev** | `npm run dev` → http://localhost:5173 |
| **Build** | `npm run build` → `dist/` |
| **Port** | 5173 (Vite default) |

---

## 2. Project Structure

```
src/
├── __tests__/        # Test files (co-located by domain)
├── components/
│   ├── ui/           # Radix UI primitives (30+ components)
│   └── *.tsx         # Business components
├── contexts/         # React context providers (Alarm, Avatar)
├── hooks/            # Custom React hooks
├── lib/              # Utility functions (cn, etc.)
├── pages/            # Route-level components (Index, Guide, NotFound)
├── utils/            # Toast helpers
├── App.tsx           # Root component with routing
└── main.tsx          # Entry point
```

---

## 3. Key Conventions

### Components
- Functional components with hooks only
- Props typed as `interface ComponentNameProps`
- One component per file (except tightly-coupled sub-components)
- Custom hooks: `useXxx` naming

### Imports (strict order)
1. React
2. Third-party libraries
3. Internal `@/` aliases

### Styling
- Tailwind utility classes via `cn()` helper
- Mobile-first responsive (sm → md → lg → xl)
- Framer Motion for animations

### State Management
- `useLocalStorage<T>` for persistence (generic, typed)
- React Context for cross-cutting concerns
- No Redux / Zustand

### Git History Rules
- One logical commit per feature group (not one giant commit)
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`
- Never commit with generic messages like "Initial commit", "update", "fix"
- Maximum 72 chars in subject line

---

## 4. Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (HMR) |
| `npm run build` | Production build |
| `npm test` | Run all tests |
| `npx tsc --noEmit` | TypeScript check |
| `npx eslint src/` | Lint check |

---

## 5. Important Files

| File | Purpose |
|------|---------|
| `src/pages/Index.tsx` | Main page — task management |
| `src/pages/Guide.tsx` | User guide |
| `src/contexts/AvatarContext.tsx` | Avatar state provider |
| `src/contexts/AlarmContext.tsx` | Alarm timer state |
| `src/hooks/useLocalStorage.ts` | Generic localStorage hook |
| `src/hooks/useUserProfile.ts` | User profile lifecycle |
| `src/components/ScrollNav.tsx` | Side navigation |
| `src/components/ProfileSettings.tsx` | Profile dialog |

---

## 6. GitHub Publishing Guide

Use this checklist when publishing any new project to GitHub to ensure
a professional, enterprise-grade repository.

### 6.1 Repository Setup

```bash
# Create local repo
git init
git add -A
git commit -m "chore: scaffold project with [stack summary]"

# Create on GitHub (via CLI or web)
gh repo create my-repo --private --description "Short description here"

# Push
git remote add origin https://github.com/username/my-repo.git
git push origin main
```

### 6.2 Required Files Checklist

| File | Purpose | Status |
|------|---------|--------|
| `README.md` | Full project documentation | ✅ Required |
| `LICENSE` | MIT, Apache 2.0, or custom | ✅ Required |
| `.gitignore` | Ignore node_modules, dist, .env, logs | ✅ Required |
| `.editorconfig` | Cross-editor consistency | ✅ Recommended |
| `.env.example` | Document all env vars | ✅ Recommended |
| `CONTRIBUTING.md` | Contribution guide | ✅ Recommended |
| `CODE_OF_CONDUCT.md` | Community standards | ✅ Recommended |
| `SECURITY.md` | Vulnerability disclosure | ✅ Recommended |
| `CHANGELOG.md` | Release history | ✅ Recommended |
| `AGENTS.md` | AI assistant context | ✅ Recommended |

### 6.3 GitHub Configuration Checklist

| File | Purpose | Status |
|------|---------|--------|
| `.github/ISSUE_TEMPLATE/bug_report.yml` | Bug form (YAML) | ✅ Recommended |
| `.github/ISSUE_TEMPLATE/feature_request.yml` | Feature form (YAML) | ✅ Recommended |
| `.github/PULL_REQUEST_TEMPLATE.md` | PR checklist | ✅ Recommended |
| `.github/CODEOWNERS` | Code ownership | ✅ Recommended |
| `.github/FUNDING.yml` | Sponsorship | ✅ Recommended |
| `.github/dependabot.yml` | Auto-dependency updates | ✅ Recommended |
| `.github/workflows/ci.yml` | CI pipeline | ✅ Recommended |
| `.github/workflows/release.yml` | Release automation | ✅ Optional |

### 6.4 API Commands for Repo Polish

```bash
# Update description
curl -s -X PATCH -H "Authorization: token $TOKEN" \
  https://api.github.com/repos/username/repo \
  -d '{"description": "Your description here"}'

# Set topics (max 20)
curl -s -X PUT -H "Authorization: token $TOKEN" \
  https://api.github.com/repos/username/repo/topics \
  -d '{"names":["tag1","tag2","tag3"]}'

# Make private
curl -s -X PATCH -H "Authorization: token $TOKEN" \
  https://api.github.com/repos/username/repo \
  -d '{"private": true}'

# Rename repo
curl -s -X PATCH -H "Authorization: token $TOKEN" \
  https://api.github.com/repos/username/old-name \
  -d '{"name": "new-name"}'
```

### 6.5 README Structure Template

```
1. Hero section + badges (CI/CD, coverage, license, version, stars, etc.)
2. Table of Contents (collapsible)
3. Overview (2-3 paragraphs describing the problem and solution)
4. Key Capabilities (table with columns: Area, Capability, Technology)
5. Architecture (ASCII diagram, design decisions table)
6. Quick Start (prerequisites table, 30-second install)
7. Features (collapsible sections)
8. Tech Stack (table with versions and links)
9. Project Structure (tree diagram)
10. Development (available scripts, making changes, code style)
11. Testing (philosophy, commands, coverage targets)
12. API Reference (storage schema, future REST endpoints)
13. Contributing (links to CONTRIBUTING, CODE_OF_CONDUCT, SECURITY)
14. Changelog (recent releases table)
15. License (full MIT text or link)
16. Enterprise (licensing, support, professional services)
17. Acknowledgments (open-source credits)
18. Footer (built by, star call-to-action)
```

### 6.6 CI Pipeline Checklist

| Stage | Tool | Gate |
|-------|------|------|
| Lint | ESLint | Zero errors |
| Type check | TypeScript (strict) | Zero errors |
| Test | Vitest + Testing Library | 100% pass, ≥85% coverage |
| Security | CodeQL + Dependabot | No high severity |
| Build | Vite | Success |
| Size check | Custom script | ≤800 KB JS bundle |

### 6.7 Commit History Best Practices

**DO NOT** create one giant commit. Split into logical groups:

```bash
# Example workflow for a new project:
git commit -m "chore: scaffold project with Vite + React + TypeScript"
git commit -m "feat: implement core [feature] with [subsystems]"
git commit -m "feat: add [feature] with [components]"
git commit -m "test: add unit and integration tests"
git commit -m "chore: configure CI/CD and community files"
git commit -m "docs: add README with full documentation"
```

**Rules:**
- One commit = one logical change (not one commit per file)
- Subject: max 72 chars, imperative mood ("add" not "added")
- Body: explain WHY, not WHAT (the diff shows what)
- Use `git log --oneline` to verify history before push

### 6.8 History Rewrite (if needed)

If you already have a messy commit history, clean it up:

```bash
# Create orphan branch (fresh history)
git checkout --orphan clean/main

# Add files in logical groups with meaningful messages
git add file1 file2 ...
git commit -m "feat: first logical feature"

git add file3 file4 ...
git commit -m "feat: second logical feature"

# Force push (destructive! use with caution)
git push origin clean/main:main --force

# Clean up local
git branch -m main old-main
git branch -m clean/main main
git branch -D old-main
```

---

## 7. Known Patterns

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

---

## 8. Environment Variables

See `.env.example` for the complete list. All client-exposed vars
must be prefixed with `VITE_`. Never commit `.env` files.

Key variables:
- `VITE_APP_NAME` — Application name
- `VITE_APP_VERSION` — Current version
- `VITE_ENABLE_FEATURE_X` — Feature flags
- `VITE_API_URL` — Backend URL (future use)

---

<p align="center">
  <sub>This file serves as both runtime context for AI assistants and a template
  for publishing any new project to GitHub with professional standards.</sub>
</p>
