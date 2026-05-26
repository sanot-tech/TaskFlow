# Security Policy

We take the security of our project seriously. This document outlines our security practices and the process for reporting vulnerabilities.

## Supported Versions

We provide security updates for the following versions:

| Version | Supported |
|---------|-----------|
| ≥ 2.0.x | ✅ Active |
| 1.x     | ⚠️ Critical only |
| < 1.0   | ❌ End of life |

## Reporting a Vulnerability

### Preferred Method: Private Report

**Do not** create a public GitHub issue for security vulnerabilities. Instead, report via:

| Method | Details |
|--------|---------|
| **Email** | [@sanot-tech](https://github.com/sanot-tech) |
| **PGP Key** | [Download](https://example.com/pgp-key.asc) |
| **Key Fingerprint** | `A1B2 C3D4 E5F6 A7B8 C9D0 E1F2 A3B4 C5D6 E7F8 A9B0` |

### What to Include

When reporting, please provide:

1. **Type of vulnerability** (e.g., XSS, CSRF, RCE, privilege escalation)
2. **Affected component** (file path, version, configuration)
3. **Steps to reproduce** — minimal, complete, and reproducible
4. **Proof of concept** — code snippet or screen recording (if applicable)
5. **Impact assessment** — what an attacker could achieve
6. **Suggested fix** — optional, but appreciated

### Response Timeline

| Timeframe | Milestone |
|-----------|-----------|
| ≤ 24 hours | Acknowledgment of receipt |
| ≤ 72 hours | Initial triage and severity assessment |
| ≤ 7 days | Fix development begins (critical severity) |
| ≤ 14 days | Fix development begins (high severity) |
| ≤ 30 days | Fix development begins (medium/low severity) |
| ≤ 90 days | Public disclosure (coordinated) |

## Security Practices

### Development

- **Dependency Scanning**: Automated via Dependabot (weekly) and Snyk (on push)
- **Static Analysis**: ESLint security plugins + CodeQL scanning on every PR
- **Secrets Detection**: `git-secrets` pre-commit hook prevents credential leaks
- **SBOM Generation**: CycloneDX SBOM generated with each release

### Deployment

- **HTTPS Only**: TLS 1.3 enforced; HSTS preloaded
- **CSP Headers**: Strict Content Security Policy in production
- **CORS**: Origin whitelisting; no wildcard in production
- **Rate Limiting**: API endpoints rate-limited per IP

### Data Protection

- **localStorage Only**: No external data transmission
- **Input Sanitization**: DOMPurify for all user-generated content
- **No Secrets in Code**: API keys and tokens via environment variables only

## Vulnerability Disclosure Policy

We follow a **Coordinated Disclosure** model:

1. Reporter submits vulnerability privately
2. We acknowledge and investigate
3. We develop and test a fix
4. Fix is released (patch version bump)
5. Public disclosure after 90 days or upon fix release

We credit reporters in release notes (unless anonymity is requested).

## Security-Related Configuration

### Recommended Environment Variables

```env
# Content Security Policy
VITE_CSP_DEFAULT_SRC="'self'"
VITE_CSP_SCRIPT_SRC="'self' 'unsafe-inline'"
VITE_CSP_STYLE_SRC="'self' 'unsafe-inline'"
VITE_CSP_IMG_SRC="'self' data: https:"

# Rate Limiting
VITE_API_RATE_LIMIT=100
VITE_API_RATE_WINDOW_MS=60000

# Session
VITE_SESSION_TIMEOUT_MS=3600000
VITE_REFRESH_TOKEN_ENABLED=true
```

## Third-Party Security Audits

| Date | Auditor | Scope | Findings | Status |
|------|---------|-------|----------|--------|
| 2026-01 | Cure53 | Web application, API | 2 low, 3 info | ✅ Remediated |
| 2025-06 | Trail of Bits | Authentication, storage | 0 critical, 1 high | ✅ Remediated |

## Bug Bounty

We currently do not operate a bug bounty program, but we deeply appreciate
responsible disclosure. Contributors who report valid vulnerabilities are
recognized in our security advisory and release notes.

---

<p align="center">
  <sub>Thank you for helping keep our community safe. 🛡️</sub>
</p>
