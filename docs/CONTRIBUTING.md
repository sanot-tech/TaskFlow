# Contributing to TodoList Application

Thank you for your interest in contributing to the TodoList application! We welcome contributions from the community and are happy to have you join us.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Setup](#development-setup)
3. [Code Style](#code-style)
4. [Testing](#testing)
5. [Pull Request Process](#pull-request-process)
6. [Code Review Guidelines](#code-review-guidelines)
7. [Reporting Issues](#reporting-issues)
8. [Feature Requests](#feature-requests)
9. [Community Guidelines](#community-guidelines)

## Getting Started

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm 9+ or yarn 1.22+
- Git
- Code editor (VS Code recommended)

### Recommended Tools
- **ESLint**: For code linting
- **Prettier**: For code formatting
- **TypeScript**: For type safety
- **React DevTools**: For debugging React components

## Development Setup

### 1. Fork the Repository
1. Go to [https://github.com/your-username/todo-list-app](https://github.com/your-username/todo-list-app)
2. Click the "Fork" button in the top-right corner
3. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/todo-list-app.git
   cd todo-list-app
   ```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### 4. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

## Code Style

### TypeScript
- Use TypeScript for all new code
- Define interfaces for props and state
- Use `React.FC` for functional components
- Avoid `any` type - use specific types

### React
- Follow React best practices
- Use functional components with hooks
- Keep components small and focused
- Use `React.memo()` for expensive components
- Use `useCallback()` for event handlers
- Use `useMemo()` for expensive calculations

### Naming Conventions
- **Components**: PascalCase (e.g., `TaskCard`, `UserProfile`)
- **Hooks**: useCamelCase (e.g., `useUserProfile`, `useAlarmTimer`)
- **Variables**: camelCase (e.g., `taskTitle`, `isCompleted`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `ALARM_SOUNDS`)
- **Files**: kebab-case or PascalCase (e.g., `task-card.tsx`, `UserProfile.tsx`)

### File Structure
```
src/
├── components/
│   ├── ui/           # Shadcn UI components
│   └── ...           # Custom components
├── hooks/            # Custom React hooks
├── pages/            # Page components
├── utils/            # Utility functions
├── lib/              # Library utilities
└── globals.css       # Global styles
```

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

## Testing

### Running Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests
- **Unit Tests**: Test individual functions and hooks
- **Component Tests**: Test React components
- **Integration Tests**: Test component interactions

### Test Structure
```tsx
// Example test file
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskCard } from '@/components/TaskCard';

describe('TaskCard', () => {
  it('renders task title', () => {
    const mockTask = {
      id: '1',
      title: 'Test Task',
      description: 'Test Description',
      completed: false,
      priority: 'High',
      priorityColor: 'bg-red-500',
      tags: ['test'],
      subtasks: [],
    };

    render(
      <TaskCard
        task={mockTask}
        onToggleCompletion={jest.fn()}
        onDelete={jest.fn()}
        onAddSubtask={jest.fn()}
        onToggleSubtask={jest.fn()}
        onDeleteSubtask={jest.fn()}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });
});
```

### Test Coverage
- **Target**: 80% coverage
- **Focus**: Hooks, components, utilities
- **Tools**: Jest, React Testing Library

## Pull Request Process

### 1. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes
- Write clean, readable code
- Add comments where necessary
- Update documentation if needed
- Add tests for new features

### 3. Run Tests
```bash
npm run test
npm run lint
npm run build
```

### 4. Commit Changes
```bash
git add .
git commit -m "feat: add your feature description"
```

**Commit Message Format:**
```
<type>: <description>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes (formatting, etc.)
- refactor: Code refactoring
- test: Adding tests
- chore: Build process or auxiliary tool changes
```

### 5. Push to Branch
```bash
git push origin feature/your-feature-name
```

### 6. Create Pull Request
1. Go to your fork on GitHub
2. Click "Compare & pull request"
3. Fill in the PR template:
   - **Title**: Clear, descriptive title
   - **Description**: What changes were made and why
   - **Related Issues**: Link to any related issues
   - **Testing**: How you tested the changes
   - **Screenshots**: If applicable, add screenshots

### 7. PR Template
```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
- [ ] Unit tests
- [ ] Component tests
- [ ] Manual testing

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published

## Screenshots (if applicable)
Add screenshots here
```

## Code Review Guidelines

### What We Look For
1. **Code Quality**
   - Clean, readable code
   - Proper TypeScript types
   - Follows project conventions
   - No unnecessary comments

2. **Testing**
   - Tests for new features
   - Tests for bug fixes
   - Test coverage maintained

3. **Documentation**
   - Updated README if needed
   - Added JSDoc comments
   - Updated API documentation

4. **Performance**
   - No performance regressions
   - Proper memoization where needed
   - Efficient algorithms

5. **Security**
   - Input validation
   - XSS protection
   - No security vulnerabilities

### Review Process
1. **Automated Checks**: CI runs linting, tests, and builds
2. **Manual Review**: At least one maintainer reviews the code
3. **Discussion**: Address any comments or questions
4. **Approval**: Once approved, the PR can be merged

### Common Review Comments
- "Please add tests for this feature"
- "Consider using `useMemo` here for performance"
- "This could be extracted into a separate hook"
- "Please update the documentation"
- "Consider edge cases: what if X happens?"

## Reporting Issues

### Bug Reports
When reporting a bug, please include:

1. **Clear Title**: Brief description of the bug
2. **Steps to Reproduce**: Detailed steps to reproduce the issue
3. **Expected Behavior**: What you expected to happen
4. **Actual Behavior**: What actually happened
5. **Environment**: 
   - Browser and version
   - Operating system
   - Node.js version
   - Application version
6. **Screenshots**: If applicable
7. **Error Messages**: Any console errors

### Bug Report Template
```markdown
## Bug Description
Brief description of the bug

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Browser: [e.g., Chrome 90]
- OS: [e.g., Windows 10]
- Node.js: [e.g., 18.0.0]
- App Version: [e.g., 1.0.0]

## Screenshots
[Add screenshots if applicable]

## Additional Context
[Any other relevant information]
```

## Feature Requests

### Submitting a Feature Request
1. **Check Existing Issues**: Make sure the feature hasn't been requested before
2. **Use the Template**: Fill out the feature request template
3. **Provide Details**: Explain the feature and its benefits
4. **Be Specific**: Include use cases and examples

### Feature Request Template
```markdown
## Feature Description
Brief description of the feature

## Use Case
Describe how this feature would be used

## Benefits
What benefits does this feature provide?

## Implementation Ideas
(Optional) How you think this could be implemented

## Alternatives
(Optional) Are there any alternatives to this feature?
```

## Community Guidelines

### Code of Conduct
We follow the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/). Please be respectful and inclusive.

### Communication
- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and community discussions
- **Pull Requests**: For code contributions

### Respectful Communication
- Be patient and understanding
- Provide constructive feedback
- Assume good intentions
- Be inclusive and welcoming

### Recognition
Contributors will be recognized in:
- The project's README
- Release notes
- Contributor list

## Development Workflow

### Daily Development
1. **Pull Latest Changes**: `git pull origin main`
2. **Create Branch**: `git checkout -b feature/your-feature`
3. **Make Changes**: Write code, add tests
4. **Run Tests**: `npm run test`
5. **Run Lint**: `npm run lint`
6. **Build**: `npm run build`
7. **Commit**: `git commit -m "feat: your feature"`
8. **Push**: `git push origin feature/your-feature`
9. **Create PR**: On GitHub

### Before Merging
1. **All Tests Pass**: CI must pass
2. **Code Review**: At least one approval
3. **Documentation Updated**: README, docs if needed
4. **No Conflicts**: Merge conflicts resolved

## Getting Help

### Where to Get Help
1. **Documentation**: Check the README and docs
2. **GitHub Issues**: Search for similar issues
3. **GitHub Discussions**: Ask the community
4. **Stack Overflow**: Tag with `todo-list-app`

### Asking Questions
When asking questions:
- Be specific about your problem
- Include relevant code snippets
- Mention what you've tried
- Include error messages

## Thank You!

Thank you for contributing to the TodoList application! Your contributions help make this project better for everyone.

**Happy coding! 🚀**