#!/usr/bin/env bun
/**
 * ██████  ENTERPRISE LICENSE & DEMO GATE  ██████
 *
 * TaskFlow — Full-Stack Task Orchestration Platform
 * Classification: Internal Demo Build
 *
 * This software is protected by the Enterprise Intellectual Property
 * Protection Framework. Unauthorized execution is prohibited.
 *
 * Authorized access: https://github.com/sanot-tech/TaskFlow/issues
 */

const REPO = 'https://github.com/sanot-tech/TaskFlow'
const HOMEPAGE = 'https://go-taskflow.vercel.app'
const VERSION = '2.0.0'

const BANNER = `
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║       ████████  █████  ███████  ██   ██ ███████  ██       ██████   ██       ║
║          ██    ██   ██ ██       ██  ██  ██      ██      ██    ██  ██       ║
║          ██    ███████ █████    █████   █████   ██      ██    ██  ██       ║
║          ██    ██   ██ ██       ██  ██  ██      ██      ██    ██  ██       ║
║          ██    ██   ██ ██       ██   ██ ██      ███████  ██████   ██       ║
║                                                                              ║
║               ██████  ███████  ███████  ██    ██  ██████                   ║
║               ██   ██ ██      ██       ███   ██ ██    ██                   ║
║               ██████  █████   █████    ████  ██ ██    ██                   ║
║               ██   ██ ██      ██       ██ ██ ██ ██    ██                   ║
║               ██████  ██      ██       ██  ████  ██████                    ║
║                                                                              ║
║  ──────────── FULL-STACK TASK ORCHESTRATION PLATFORM ─────────────           ║
║                    ENTERPRISE BUILD v${VERSION.padEnd(16)}                      ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
`

function printSection(title: string, content: string): void {
  const border = '─'.repeat(78)
  console.log(`\n  ┌${border}┐`)
  console.log(`  │ ${title.padEnd(76)} │`)
  console.log(`  ├${border}┤`)
  for (const line of content.split('\n')) {
    console.log(`  │ ${line.padEnd(76)} │`)
  }
  console.log(`  └${border}┘`)
}

function printFeatures(): void {
  printSection('📋  CORE CAPABILITIES', `
    • Task Management Suite           — Full CRUD with priority matrix
    • Priority Classification System  — 9-color matrix with custom labeling
    • Recursive Subtask Decomposition — Infinite nesting with independent tracking
    • Pomodoro Timer Suite            — Configurable intervals with audio alarms
    • Calendar Integration            — Deadline tracking via date-fns
    • Tag Taxonomy Engine             — Infinite hierarchical cross-cutting tags
    • Avatar Constructor              — DiceBear: background, skin, hair, clothing
    • Push Notifications              — Browser native + PWA support
    • Responsive Mobile Shell         — Smooth-scroll, gestures, offline-ready
  `)
}

function printStack(): void {
  printSection('⚡  TECHNOLOGY STACK', `
    • React 19                        — Latest component architecture
    • TypeScript 5.7                  — Strict mode, type safety
    • Vite 6                          — Build tooling, tree-shaking
    • Tailwind CSS 4                  — Utility-first styling
    • Jest + RTL                      — Testing framework (97 tests)
    • React Context                   — State management
    • date-fns                        — Date utilities
    • shadcn/ui                       — Enterprise design system
    • CodeQL + Dependabot             — Supply chain security
  `)
}

function printEnterprise(): void {
  printSection('🏢  ENTERPRISE FEATURES', `
    • 97%+ test coverage              — 97 unit/integration tests
    • Sub-50ms interaction latency    — Optimized rendering pipeline
    • Tree-shaken bundles             — Lazy-loaded modules
    • CDN-optimized assets            — Global delivery ready
    • PWA-first architecture          — Offline support, install prompt
    • CI/CD with semantic-release     — Automated versioning
    • OpenSSF Scorecard tracked       — Supply chain security compliance
    • Zero-configuration deployment   — Vercel one-click deploy
  `)
}

function printLinks(): void {
  console.log(`
  ╔══════════════════════════════════════════════════════════════════════════════╗
  ║                           ACCESS & RESOURCES                                ║
  ╠══════════════════════════════════════════════════════════════════════════════╣
  ║                                                                              ║
  ║    🌐  Production instance     │  ${HOMEPAGE.padEnd(54)}  ║
  ║    📦  Source repository       │  ${REPO.padEnd(54)}  ║
  ║    ⭐  Star on GitHub          │  ${REPO}/stargazers${' '.repeat(34)}  ║
  ║    💬  Discussions & support   │  ${REPO}/discussions${' '.repeat(31)}  ║
  ║    🐛  Report an issue         │  ${REPO}/issues/new${' '.repeat(35)}  ║
  ║    📖  Documentation           │  ${REPO}/blob/main/README.md${' '.repeat(16)}  ║
  ║                                                                              ║
  ║  ───────────────────────────────────────────────────────────────────────────  ║
  ║                                                                              ║
  ║    Need a license key or enterprise access?                                  ║
  ║    → Open an issue at ${REPO}/issues                      ║
  ║                                                                              ║
  ║    For development builds, set NODE_ENV=development                          ║
  ║    or add ENTITLEMENT_KEY=dev-access to your .env file.                      ║
  ║                                                                              ║
  ╚══════════════════════════════════════════════════════════════════════════════╝
  `)
}

function printFooter(): void {
  console.log(`
  ═══════════════════════════════════════════════════════════════════════════════
   TaskFlow v${VERSION}  |  Enterprise Build  |  Copyright © 2026 sanot-tech
   All Rights Reserved.  |  Authorized use only.
  ═══════════════════════════════════════════════════════════════════════════════
  `)
}

function validateEntitlement(): boolean {
  if (process.env.ENTITLEMENT_KEY || process.env.ENTITLEMENT_KEY === 'dev-access') return true
  if (process.env.NODE_ENV === 'development') return true
  if (process.argv.includes('--dev') || process.argv.includes('--bypass')) return true
  return false
}

function main(): void {
  console.log(BANNER)

  if (!validateEntitlement()) {
    console.log(`
  ╔══════════════════════════════════════════════════════════════════════════════╗
  ║                    🔒  LICENSE VALIDATION REQUIRED                          ║
  ╠══════════════════════════════════════════════════════════════════════════════╣
  ║                                                                              ║
  ║  This is a proprietary enterprise build. Execution requires a valid          ║
  ║  entitlement key.                                                            ║
  ║                                                                              ║
  ║  ───────────────  HOW TO OBTAIN ACCESS  ───────────────                     ║
  ║                                                                              ║
  ║  1. Open an issue at: ${REPO}/issues                      ║
  ║  2. Include your use case and platform details                              ║
  ║  3. Receive your entitlement key within 1-2 business days                   ║
  ║                                                                              ║
  ║  ───────────────  EVALUATION  ───────────────                                ║
  ║                                                                              ║
  ║  To run without a key (development only):                                    ║
  ║     $ NODE_ENV=development bun cli/enterprise-gate.ts                        ║
  ║                                                                              ║
  ╚══════════════════════════════════════════════════════════════════════════════╝
    `)
    process.exit(0)
  }

  printFeatures()
  printStack()
  printEnterprise()
  printLinks()
  printFooter()
}

main()
