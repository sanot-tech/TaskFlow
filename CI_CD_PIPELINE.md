# CI/CD Pipeline Documentation

## Overview
This document describes the Continuous Integration and Continuous Deployment (CI/CD) pipeline for the TodoList application. The pipeline ensures code quality, automated testing, and seamless deployment to Vercel.

## Pipeline Architecture

### Pipeline Stages
```
┌─────────────────────────────────────────────────────────────┐
│                    CI/CD Pipeline                           │
├─────────────────────────────────────────────────────────────┤
│ 1. Code Commit → 2. Lint → 3. Test → 4. Build → 5. Deploy  │
└─────────────────────────────────────────────────────────────┘
```

### Tools & Services
- **Version Control**: GitHub
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint
- **Monitoring**: Sentry, Vercel Analytics

## GitHub Actions Workflow

### Main Workflow (`.github/workflows/main.yml`)
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # Stage 1: Code Quality Check
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - name: Upload lint results
        uses: actions/upload-artifact@v3
        with:
          name: lint-results
          path: lint-results.json

  # Stage 2: Type Checking
  type-check:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run type-check

  # Stage 3: Unit Tests
  test:
    runs-on: ubuntu-latest
    needs: [lint, type-check]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella
      - name: Upload test results
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: |
            coverage/
            test-results.xml

  # Stage 4: Build
  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: dist/

  # Stage 5: Deploy to Staging (on develop branch)
  deploy-staging:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/develop'
    environment: staging
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
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_STAGING }}
          vercel-args: '--prod'
          github-token: ${{ secrets.GITHUB_TOKEN }}

  # Stage 6: Deploy to Production (on main branch)
  deploy-production:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment: production
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
          vercel-args: '--prod'
          github-token: ${{ secrets.GITHUB_TOKEN }}
        env:
          VITE_SENTRY_DSN: ${{ secrets.VITE_SENTRY_DSN }}
          VITE_VERCEL_ANALYTICS_ID: ${{ secrets.VITE_VERCEL_ANALYTICS_ID }}

  # Stage 7: Security Scan
  security-scan:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v3
      - name: Run npm audit
        run: npm audit --audit-level=moderate
      - name: Run dependency check
        run: npx depcheck
      - name: Upload security report
        uses: actions/upload-artifact@v3
        with:
          name: security-report
          path: security-report.txt

  # Stage 8: Performance Test
  performance-test:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

### Pull Request Workflow (`.github/workflows/pr.yml`)
```yaml
name: Pull Request Check

on:
  pull_request:
    branches: [main, develop]

jobs:
  # Quick checks for PRs
  quick-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run build

  # PR-specific checks
  pr-checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check PR title
        run: |
          PR_TITLE="${{ github.event.pull_request.title }}"
          if [[ ! $PR_TITLE =~ ^(feat|fix|docs|style|refactor|test|chore): ]]; then
            echo "PR title must follow conventional commits format"
            exit 1
          fi
      - name: Check for breaking changes
        run: |
          # Check if PR contains breaking changes
          if git diff --name-only HEAD~1 HEAD | grep -E '\.(ts|tsx)$'; then
            echo "TypeScript files changed - checking for breaking changes"
          fi
```

### Release Workflow (`.github/workflows/release.yml`)
```yaml
name: Release

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build
      - name: Create GitHub Release
        uses: softprops/action-gh-release@v1
        with:
          files: dist/
          generate_release_notes: true
      - name: Deploy to Production
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Vercel Configuration

### Vercel Project Settings
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/vite"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' https://api.dicebear.com https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.dicebear.com; frame-ancestors 'none';"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ],
  "env": {
    "VITE_SENTRY_DSN": "@sentry-dsn",
    "VITE_VERCEL_ANALYTICS_ID": "@vercel-analytics-id"
  }
}
```

### Vercel Environment Variables
```env
# Production
VITE_SENTRY_DSN=https://your-sentry-dsn.ingest.sentry.io/...
VITE_VERCEL_ANALYTICS_ID=your-analytics-id

# Staging
VITE_SENTRY_DSN_STAGING=https://your-sentry-dsn-staging.ingest.sentry.io/...
VITE_VERCEL_ANALYTICS_ID_STAGING=your-analytics-id-staging

# Development
VITE_SENTRY_DSN_DEV=https://your-sentry-dsn-dev.ingest.sentry.io/...
VITE_VERCEL_ANALYTICS_ID_DEV=your-analytics-id-dev
```

## Environment Setup

### Required Secrets
Add these secrets to your GitHub repository:

1. **VERCEL_TOKEN**: Your Vercel access token
2. **VERCEL_ORG_ID**: Your Vercel organization ID
3. **VERCEL_PROJECT_ID**: Your Vercel project ID (production)
4. **VERCEL_PROJECT_ID_STAGING**: Your Vercel project ID (staging)
5. **VITE_SENTRY_DSN**: Sentry DSN for production
6. **VITE_VERCEL_ANALYTICS_ID**: Vercel Analytics ID
7. **LHCI_GITHUB_APP_TOKEN**: Lighthouse CI token (optional)

### How to Get Vercel Token
1. Go to [Vercel Dashboard](https://vercel.com)
2. Go to Account Settings → Tokens
3. Create a new token with "Full Access"
4. Copy the token and add it to GitHub Secrets

### How to Get Project IDs
1. Go to your Vercel project
2. Go to Settings → General
3. Copy the Project ID and Organization ID

## Pipeline Triggers

### Automatic Triggers
1. **Push to `main` branch**: Full pipeline + production deployment
2. **Push to `develop` branch**: Full pipeline + staging deployment
3. **Pull Request to `main`**: Quick checks (lint, test, build)
4. **Tag push (`v*.*.*`)**: Release workflow

### Manual Triggers
1. **GitHub Actions UI**: Run any workflow manually
2. **Vercel Dashboard**: Manual deployment
3. **CLI**: `vercel --prod`

## Pipeline Stages Detailed

### Stage 1: Code Quality (Lint)
```bash
# Run ESLint
npm run lint

# Auto-fix issues
npm run lint:fix

# Check specific files
npx eslint src/components/TaskCard.tsx
```

**Checks:**
- TypeScript errors
- ESLint warnings
- Code style violations
- Unused variables

### Stage 2: Type Checking
```bash
# Run TypeScript compiler
npm run type-check

# Check specific files
npx tsc --noEmit src/components/TaskCard.tsx
```

**Checks:**
- Type errors
- Missing imports
- Interface violations
- Generic type issues

### Stage 3: Testing
```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Run specific test
npm run test -- TaskCard.test.tsx

# Run in watch mode
npm run test:watch
```

**Checks:**
- Unit tests pass
- Component tests pass
- Integration tests pass
- Coverage threshold met (80%)

### Stage 4: Build
```bash
# Build for production
npm run build

# Build with analysis
npm run build -- --report

# Build with analyze
npm run build -- --analyze
```

**Checks:**
- Build succeeds
- No build warnings
- Bundle size acceptable
- No critical errors

### Stage 5: Security Scan
```bash
# Check for vulnerabilities
npm audit

# Check dependencies
npx depcheck

# Generate security report
npm audit --json > security-report.json
```

**Checks:**
- No high/critical vulnerabilities
- No unused dependencies
- No security warnings

### Stage 6: Performance Test
```bash
# Run Lighthouse CI
npx lhci autorun

# Run performance tests
npm run test:performance
```

**Checks:**
- Performance score > 90
- Accessibility score > 90
- Best practices score > 90
- SEO score > 90

### Stage 7: Deployment
```bash
# Deploy to Vercel
vercel --prod

# Deploy with environment
vercel --prod --env NODE_ENV=production
```

**Checks:**
- Deployment succeeds
- Environment variables set
- Build artifacts uploaded
- Health check passes

## Monitoring & Alerts

### Sentry Integration
```typescript
// src/main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
  environment: import.meta.env.MODE,
});
```

### Vercel Analytics
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

### Alert Configuration
```yaml
# .github/workflows/alerts.yml
name: Alerts

on:
  schedule:
    - cron: '0 9 * * 1-5'  # 9 AM on weekdays

jobs:
  check-metrics:
    runs-on: ubuntu-latest
    steps:
      - name: Check Sentry errors
        run: |
          # Check for new errors in Sentry
          # Send alert if errors > threshold
      - name: Check Vercel metrics
        run: |
          # Check performance metrics
          # Send alert if metrics degrade
```

## Rollback Strategy

### Automatic Rollback
```yaml
# .github/workflows/rollback.yml
name: Rollback

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to rollback'
        required: true
        default: 'production'
        type: choice
        options:
          - production
          - staging

jobs:
  rollback:
    runs-on: ubuntu-latest
    steps:
      - name: Get previous deployment
        run: |
          # Get previous successful deployment
          # Deploy to that version
      - name: Notify team
        run: |
          # Send notification to Slack/Teams
```

### Manual Rollback
1. **Vercel Dashboard**: Go to deployments → rollback
2. **CLI**: `vercel --prod --rollback`
3. **GitHub Actions**: Run rollback workflow

## Pipeline Optimization

### Caching Strategy
```yaml
# Cache npm dependencies
- uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-

# Cache build artifacts
- uses: actions/cache@v3
  with:
    path: dist/
    key: ${{ runner.os }}-build-${{ hashFiles('src/**/*') }}
    restore-keys: |
      ${{ runner.os }}-build-
```

### Parallel Execution
```yaml
jobs:
  # Run lint and type-check in parallel
  lint:
    runs-on: ubuntu-latest
    steps: [...]

  type-check:
    runs-on: ubuntu-latest
    steps: [...]

  # Test depends on both
  test:
    runs-on: ubuntu-latest
    needs: [lint, type-check]
    steps: [...]
```

### Conditional Execution
```yaml
# Only run certain jobs on specific branches
deploy-staging:
  if: github.ref == 'refs/heads/develop'
  steps: [...]

deploy-production:
  if: github.ref == 'refs/heads/main'
  steps: [...]
```

## Pipeline Security

### Secret Management
```yaml
# Use GitHub Secrets for all sensitive data
env:
  VITE_SENTRY_DSN: ${{ secrets.VITE_SENTRY_DSN }}
  VITE_VERCEL_ANALYTICS_ID: ${{ secrets.VITE_VERCEL_ANALYTICS_ID }}
```

### Environment Protection
```yaml
# Require approval for production deployment
deploy-production:
  environment: production
  needs: build
  steps: [...]
```

### Audit Trail
- All deployments are logged in GitHub Actions
- All environment changes are tracked
- All secret accesses are audited

## Pipeline Metrics

### Key Metrics
| Metric | Target | Current |
|--------|--------|---------|
| **Build Time** | < 5 min | - |
| **Test Time** | < 3 min | - |
| **Deploy Time** | < 2 min | - |
| **Success Rate** | > 95% | - |
| **Rollback Rate** | < 1% | - |

### Monitoring Dashboard
- **GitHub Actions**: Workflow runs and durations
- **Vercel**: Deployment history and performance
- **Sentry**: Error rates and performance
- **Codecov**: Test coverage trends

## Troubleshooting

### Common Issues

#### 1. Build Fails
**Symptoms**: `npm run build` fails
**Solutions**:
- Check TypeScript errors: `npm run type-check`
- Check ESLint errors: `npm run lint`
- Check dependencies: `npm install`
- Clear cache: `rm -rf node_modules && npm install`

#### 2. Tests Fail
**Symptoms**: `npm run test` fails
**Solutions**:
- Run specific test: `npm run test -- --testNamePattern="test name"`
- Check test setup: `npm run test:coverage`
- Update snapshots: `npm run test -- -u`

#### 3. Deployment Fails
**Symptoms**: Vercel deployment fails
**Solutions**:
- Check environment variables
- Check build command
- Check Vercel logs
- Check GitHub Actions logs

#### 4. Performance Degradation
**Symptoms**: Slow build or deploy
**Solutions**:
- Enable caching in GitHub Actions
- Optimize dependencies
- Use parallel execution
- Reduce bundle size

### Debugging Pipeline
```bash
# Run pipeline locally
act -j lint

# Check workflow syntax
gh workflow view .github/workflows/main.yml

# View logs
gh run view <run-id>
```

## Pipeline Maintenance

### Weekly Maintenance
1. **Update dependencies**: `npm update`
2. **Check for security updates**: `npm audit`
3. **Review pipeline logs**: Check for failures
4. **Update documentation**: Keep docs current

### Monthly Maintenance
1. **Review pipeline performance**: Optimize slow stages
2. **Update GitHub Actions**: Update to latest versions
3. **Review secrets**: Rotate if needed
4. **Update environment variables**: Check for changes

### Quarterly Maintenance
1. **Full pipeline audit**: Review all workflows
2. **Security audit**: Check for vulnerabilities
3. **Performance audit**: Optimize build times
4. **Documentation audit**: Update all docs

## Pipeline Extensions

### Adding New Workflows
1. Create new file in `.github/workflows/`
2. Define triggers and jobs
3. Test locally with `act`
4. Merge to main branch

### Adding New Stages
1. Add new job to main workflow
2. Define dependencies
3. Add necessary secrets
4. Update documentation

### Adding New Environments
1. Create new Vercel project
2. Add environment variables
3. Update GitHub Secrets
4. Add deployment job

## Pipeline Best Practices

### 1. Keep Workflows Simple
- One job per responsibility
- Clear job names
- Minimal dependencies

### 2. Use Caching
- Cache npm dependencies
- Cache build artifacts
- Cache test results

### 3. Fail Fast
- Run quick checks first
- Cancel on first failure
- Provide clear error messages

### 4. Secure Secrets
- Never commit secrets
- Use GitHub Secrets
- Rotate secrets regularly

### 5. Monitor Everything
- Log all workflow runs
- Track performance metrics
- Set up alerts

## Pipeline Examples

### Example 1: Feature Branch Deployment
```yaml
# .github/workflows/feature.yml
name: Feature Branch Deployment

on:
  push:
    branches: ['feature/*']

jobs:
  deploy-feature:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_STAGING }}
          vercel-args: '--prod'
```

### Example 2: Hotfix Deployment
```yaml
# .github/workflows/hotfix.yml
name: Hotfix Deployment

on:
  push:
    branches: ['hotfix/*']

jobs:
  deploy-hotfix:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
        env:
          VITE_SENTRY_DSN: ${{ secrets.VITE_SENTRY_DSN }}
```

### Example 3: Documentation Deployment
```yaml
# .github/workflows/docs.yml
name: Documentation Deployment

on:
  push:
    branches: ['main']
    paths:
      - 'docs/**'
      - 'README.md'
      - 'CONTRIBUTING.md'

jobs:
  deploy-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs
```

## Pipeline Conclusion

This CI/CD pipeline ensures:
1. **Code Quality**: Linting and type checking
2. **Testing**: Comprehensive test coverage
3. **Security**: Vulnerability scanning
4. **Performance**: Performance testing
5. **Deployment**: Automated deployment to Vercel
6. **Monitoring**: Error tracking and analytics

**Key Benefits:**
- **Speed**: Fast feedback on code changes
- **Reliability**: Automated testing and deployment
- **Security**: Continuous security scanning
- **Visibility**: Full pipeline transparency
- **Scalability**: Easy to extend and maintain

**Next Steps:**
1. Set up GitHub Secrets
2. Configure Vercel projects
3. Test pipeline locally
4. Deploy first version
5. Monitor and optimize

**Happy deploying! 🚀**