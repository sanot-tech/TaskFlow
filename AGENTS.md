# AGENTS.md — AI Assistant Guide

This file provides context for AI coding assistants (opencode, Cursor, Windsurf, Cline, etc.)
to understand the project structure, conventions, and workflows for this project.
It also serves as a **template guide for publishing new projects to GitHub** with
professional standards.

---

## LLM Automation Rules — MUST ALWAYS FOLLOW

These rules are **MANDATORY**. Every time you touch this project, verify ALL rules below. Do not skip, do not assume, do not forget.

### 0. Pre-flight Audit (Run First, Every Time)
1. **Scan for stale files** — orphaned duplicates, unused assets, half-finished experiments, personal notes
2. **Check filenames** — **NO Cyrillic, NO spaces, NO typos**
3. **Verify ALL URLs** — badge URLs, `raw.githubusercontent.com`, repo URLs, vercel.app — every link must resolve (200, not 403/404)
4. **Confirm ALL references match** — if a file is renamed/deleted, update EVERY import, every string reference
5. **Remove ALL local-only files** — `AI_RULES.md`, `template/`, `.env` with tokens → add to `.gitignore`
6. **Replace ALL email addresses** → `@sanot-tech` GitHub mention (the login)
7. **Replace ALL old account references** — `Biopasks` → `sanot-tech` everywhere

### 1. Badges Checklist
8. **CI/CD badge** — dynamic `img.shields.io/github/actions/workflow/status` — must show passing
9. **Test coverage** — static `97 tests` badge with `brightgreen`
10. **Security** — OpenSSF Scorecard badge (2 passes/week) or static fallback
11. **Stack badges** — ALL tech: React, TypeScript, Vite, Tailwind, Jest, RTL
12. **Version badge** — dynamic `github/v/release` (create release if needed)
13. **Stars badge** — dynamic `github/stars` with `yellow`
14. **License badge** — static MIT, color `blue`
15. **Deployment badge** — use static `https://img.shields.io/badge/deployed-vercel-brightgreen?logo=vercel` (NOT `github/deployments`)
16. **Discussions badge** — `https://img.shields.io/github/discussions/sanot-tech/TaskFlow?logo=github&color=brightgreen`
17. **Verify EVERY badge renders** — curl each. Any 403/404 → static fallback
18. **All badges must be green** — `brightgreen` or official brand color

### 2. Footer Standards
19. **Back to top** — `[⬅️ Back to Top](#readme)` badge/link
20. **Made with love** — `<b>Built with ❤️ by <a href="https://github.com/sanot-tech">Sanot</a></b>`
21. **Star CTA** — encourage starring
22. **Copyright** — `Copyright © 2026 sanot-tech` (display `Sanot`)
23. **Display text `sanot-tech` → `Sanot`** — in copyright, footers; links stay on `sanot-tech`

### 3. Issue & PR Templates — All Types Required
24. **All 10+ template types** — bug_report, feature_request, documentation, performance, security, question, epic, task, design, regression, refactoring — ALL in `.github/ISSUE_TEMPLATE/`
25. **ALL must be YAML forms** — dropdowns, checkboxes, validation. Rich emoji headers. Never plain text.
26. **CONFIG** — `config.yml` with `blank_issues_enabled: false`, links to Docs, Discussions, Ideas, Q&A, Security, Changelog
27. **PR TEMPLATE** — `PULL_REQUEST_TEMPLATE.md` with checklist (self-review, tests, lint, typecheck)
28. **FUNDING.yml** — `github: [sanot-tech]`, clean

### 4. Community Files
29. **LICENSE** — MIT, `Sanot` as copyright holder
30. **CONTRIBUTING.md** — must exist
31. **CODE_OF_CONDUCT.md** — must exist
32. **SECURITY.md** — must exist
33. **`.gitignore`** — complete
34. **CI workflow** — `.github/workflows/ci.yml` — must pass
35. **Scorecard workflow** — `.github/workflows/scorecard.yml` — runs weekly
36. **Dependabot** — `.github/dependabot.yml` for npm + Actions
37. **Discussions** — enabled on GitHub repo (verify via API)

### 5. README Screenshots
38. **Screenshots required** — take and add screenshots of main pages
39. **PNG, saved to `screenshots/`** — via Playwright + vite preview
40. **Use `raw.githubusercontent.com` URLs** for serving

### 5a. Architecture Diagram — ASCII Art
41. **Must have beautiful layered ASCII diagram** in Architecture section
42. **Use box-drawing chars**: `╔╗║╚╝═` or `┌┐│└┘─` — be consistent
43. **Layers**: Presentation → Application → Data. Show 3 columns per layer with components
44. **Follow with Layered Design table** explaining each layer's responsibility + tech
45. **Keep directory tree below the diagram** — NOT instead of it

### 5b. Features with Spoiler Categories
46. **Features MUST use `<details>` collapsible blocks** organized by theme
47. **Canonical categories**: 📦 Core Platform, 🎨 User Experience, 🔒 Security, ⚙️ Dev Experience
48. **Alternative categories** based on project type (dashboard: 📊 Analytics, 📈 Reports, ⚙️ Settings, 👥 Team)
49. **Each feature**: emoji + bold title + concise single-line description
50. **3-8 features per category**, at least 3 categories

### 5c. Acknowledgments Section
51. **Must have `## 🙏 Acknowledgments`** before License
52. **Table with: Category | Technology (linked) | Purpose**
53. **List ALL significant deps**: React, TS, Vite, Tailwind, Framer, Radix, Lucide, date-fns, DiceBear, RTL, Vitest
54. **End with "Special thanks" paragraph**

### 6. Vercel Deployment
55. **Deploy to Vercel** — `npx vercel --prod --token $VERCEL_TOKEN --yes`
56. **Add real link in README**
57. **Vercel badge** — static (not `github/deployments` which shows "environment not found")

### 7. CI & Quality
58. **`npm run build` must succeed**
59. **`npx tsc --noEmit` must pass** — zero errors
60. **`npm run lint` must pass** — zero errors
61. **`npm test` must pass** — all 97 tests green

### 8. Final Verification
62. **Check every link in README** — click/browse every badge, every anchor
63. **GitHub mentions** — use `@sanot-tech` (login), NOT `@Sanot`
64. **Display text** — `sanot-tech` → `Sanot` in user-facing text
65. **No placeholder values** — everything replaced
66. **Commit check** — no tokens, no .env, meaningful message

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
| **Live** | https://go-taskflow.vercel.app |

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
# Set git identity — use GitHub noreply to hide personal email
# Get it from: GitHub → Settings → Emails → "Keep my email addresses private"
git config user.name "YourUsername"
git config user.email "12345678+YourUsername@users.noreply.github.com"

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

### 6.8 Vercel Deployment

Deploy the project to Vercel with a custom project name:

```bash
# Set VERCEL_TOKEN in your shell or .env
export VERCEL_TOKEN="vcp_xxxxxxxxxxxxxx"

# Deploy to production (first run links the project)
npx vercel --prod --token "$VERCEL_TOKEN" --yes

# Rename project via API (if needed)
curl -s -X PATCH \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"taskflow"}' \
  "https://api.vercel.com/v9/projects/old-name"

# Important: remove deprecated "name" field from vercel.json
# Vercel project name is set via API, not vercel.json
```

**Notes:**
- Project is auto-linked to GitHub repo → pushes to `main` trigger deployments
- The `name` property in `vercel.json` is deprecated — set name via API or Vercel dashboard
- For SPA fallback, keep the `rewrites` rule in `vercel.json`
- If CLI deploy hangs, push a commit to GitHub — the git integration handles it
- **Vercel blocks deployments if commit email doesn't match a GitHub account.** Always use GitHub noreply email (`ID+username@users.noreply.github.com`) to avoid this. Enable it in GitHub → Settings → Emails → "Keep my email addresses private".

### 6.9 Fix Author Email in History

If commits were made with the wrong email (e.g. `username@github.com`), rewrite all authors to use GitHub noreply:

```bash
# Set the correct noreply email first
git config user.email "12345678+YourUsername@users.noreply.github.com"

# Rebase all commits, resetting author on each
GIT_SEQUENCE_EDITOR=true git rebase --root --exec "git commit --amend --reset-author --no-edit"

# Force push (destructive! use with caution)
git push origin main --force
```

### 6.10 History Rewrite (if needed)

If you already have a messy commit history, clean it up:

```bash
# Set correct email first
git config user.email "12345678+YourUsername@users.noreply.github.com"

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
