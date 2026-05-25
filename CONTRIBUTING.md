# Contributing to Project Name

First off, thank you for considering contributing! We welcome contributions from everyone, regardless of experience level. This document provides guidelines to make the process smooth and effective.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Development Workflow](#development-workflow)
3. [Getting Started](#getting-started)
4. [Coding Standards](#coding-standards)
5. [Commit Conventions](#commit-conventions)
6. [Pull Request Process](#pull-request-process)
7. [Testing Requirements](#testing-requirements)
8. [Documentation](#documentation)
9. [Issue Reporting](#issue-reporting)
10. [Community](#community)

---

## Code of Conduct

This project adheres to the [Contributor Covenant](CODE_OF_CONDUCT.md) v2.1. By participating, you agree to uphold this code. Report unacceptable behavior to [conduct@biopasks.dev](mailto:conduct@biopasks.dev).

---

## Development Workflow

```
[Issue] → [Fork] → [Branch] → [Changes] → [Tests] → [PR] → [Review] → [Merge]
```

### Branch Naming

Use descriptive, hyphenated branch names with a type prefix:

| Prefix | Example | Purpose |
|--------|---------|---------|
| `feat/` | `feat/dark-mode-toggle` | New features |
| `fix/` | `fix/login-validation` | Bug fixes |
| `refactor/` | `refactor/state-management` | Code restructuring |
| `docs/` | `docs/api-reference` | Documentation |
| `test/` | `test/timer-edge-cases` | Test additions |
| `chore/` | `chore/update-deps` | Maintenance |
| `perf/` | `perf/lazy-load-images` | Performance |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20 LTS
- **npm** ≥ 10.x
- **Git** ≥ 2.40

### Setup

```bash
# 1. Fork the repository
# 2. Clone your fork
git clone https://github.com/Biopasks/todo-list.git
cd todo-list

# 3. Add upstream remote
git remote add upstream https://github.com/Biopasks/todo-list.git

# 4. Install dependencies
npm install

# 5. Create a branch
git checkout -b feat/my-feature

# 6. Make your changes
# 7. Run checks
npm run lint && npx tsc --noEmit && npm test

# 8. Commit
git commit -m "feat: add my awesome feature"

# 9. Push
git push origin feat/my-feature

# 10. Open a Pull Request
```

---

## Coding Standards

### TypeScript

- **Strict mode** enabled — no `any` unless justified with `// eslint-disable-next-line`
- Use `interface` for object shapes; `type` for unions, intersections, and primitives
- Prefer `const` over `let`; never use `var`
- Use optional chaining (`?.`) and nullish coalescing (`??`) over logical `&&`/`||`
- Avoid non-null assertions (`!`); use type guards instead

### React

- Functional components with hooks only (no class components)
- One component per file (except small, tightly-coupled sub-components)
- Props interfaces defined with `interface ComponentNameProps`
- Custom hooks follow `useXxx` naming; return typed objects
- Prefer `useCallback`/`useMemo` only for expensive computations or stable references

### Styling

- Use Tailwind utility classes; avoid custom CSS unless necessary
- Extract repeated patterns to `cn()` helper composition
- Follow mobile-first responsive design (sm → md → lg → xl)

### Imports

Ordered groups (separated by blank line):

1. **React** — `import React, { useState } from "react"`
2. **Third-party** — `import { motion } from "framer-motion"`
3. **Internal modules** — `import { Button } from "@/components/ui/button"`
4. **Styles** — `import "./styles.css"`

---

## Commit Conventions

We strictly follow [Conventional Commits](https://www.conventionalcommits.org/) for automated versioning and changelog generation.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Release | Description |
|------|---------|-------------|
| `feat` | Minor | A new feature |
| `fix` | Patch | A bug fix |
| `docs` | — | Documentation only |
| `style` | — | Code style (formatting, etc.) |
| `refactor` | — | Code restructuring (no behavior change) |
| `perf` | Patch | Performance improvement |
| `test` | — | Adding or fixing tests |
| `chore` | — | Build/dependency changes |
| `ci` | — | CI/CD changes |
| `breaking` | Major | Breaking change (`BREAKING CHANGE:` in footer) |

### Examples

```
feat(timer): add pomodoro mode with configurable intervals

fix(auth): handle token expiry with automatic refresh

docs: add API reference for task endpoints

BREAKING CHANGE: remove deprecated v1 endpoints
```

---

## Pull Request Process

1. **Ensure your fork is up to date** with upstream `main`
2. **Create a branch** from `main` using the naming convention
3. **Make focused, atomic commits** — each commit should do one thing
4. **Write or update tests** — coverage must not decrease
5. **Update documentation** if changing public APIs or behavior
6. **Run all checks** before pushing:

    ```bash
    npm run lint        # Must pass with zero warnings
    npx tsc --noEmit    # Must pass with zero errors
    npm test            # Must pass with full coverage
    ```

7. **Open a PR** using the [template](.github/PULL_REQUEST_TEMPLATE.md)
8. **Respond to review feedback** — all conversations must be resolved
9. **Squash commits** if requested by maintainers
10. **Merge** after approval (maintainers will merge)

### PR Checklist

- [ ] Code follows style guidelines
- [ ] Tests added/updated and passing
- [ ] Documentation updated
- [ ] Commits follow conventional commits
- [ ] No breaking changes without `BREAKING CHANGE` footer
- [ ] All CI checks pass
- [ ] Self-review completed

---

## Testing Requirements

- All new features must include unit tests
- Bug fixes must include a regression test
- Integration tests for critical user workflows
- Maintain minimum 85% line coverage

### What to Test

| Scenario | Test Level | Priority |
|----------|-----------|----------|
| Happy path | Integration | ✅ Required |
| Error states | Unit | ✅ Required |
| Edge cases | Unit | ✅ Required |
| Loading states | Integration | ✅ Required |
| Empty states | Integration | ✅ Required |
| Accessibility | E2E | ⭐ Preferred |
| Performance | Unit | ⭐ Preferred |

---

## Documentation

- Code should be self-documenting (clear names, small functions)
- Add JSDoc/TSDoc for public APIs and complex logic
- Update `README.md` if adding features or changing behavior
- Document breaking changes clearly in commit message footer

### JSDoc Example

```typescript
/**
 * Creates a new task with the specified properties.
 *
 * @param title - The task title (1-200 characters)
 * @param priority - Priority level (high, medium, low)
 * @param tags - Optional list of tags for categorization
 * @returns The newly created Task object
 * @throws {ValidationError} If title is empty or exceeds 200 characters
 */
function createTask(title: string, priority: Priority, tags?: string[]): Task
```

---

## Issue Reporting

### Bug Reports

Open a [bug report](.github/ISSUE_TEMPLATE/bug_report.yml) with:

- Clear description of the problem
- Exact steps to reproduce
- Expected vs. actual behavior
- Environment details (OS, browser, version)
- Screenshots or logs

### Feature Requests

Open a [feature request](.github/ISSUE_TEMPLATE/feature_request.yml) with:

- Problem statement (what doesn't work or could be improved)
- Proposed solution (detailed description)
- Alternatives considered
- Expected impact

---

## Community

- **Discord**: [Join our server](https://discord.gg/biopasks)
- **Twitter/X**: [@Biopasks](https://twitter.com/Biopasks)
- **Discussions**: [GitHub Discussions](https://github.com/Biopasks/todo-list/discussions)

### Recognition

Contributors are recognized in:
- Release notes
- Repository README (if significant contribution)
- Project website (if applicable)

---

## Questions?

If you have questions about contributing, please:

1. Check existing [documentation](https://github.com/Biopasks/todo-list#readme)
2. Search [existing issues](https://github.com/Biopasks/todo-list/issues)
3. Ask in [Discussions](https://github.com/Biopasks/todo-list/discussions)
4. Reach out via email: [contributors@biopasks.dev](mailto:contributors@biopasks.dev)

---

<p align="center">
  <sub>Thank you for making this project better! ❤️</sub>
</p>
