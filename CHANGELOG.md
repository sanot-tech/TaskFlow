# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] — 2026-05-25

### Added
- Task navigation with prev/next arrows and ScrollNav frame-scrolling
- Enterprise footer with auto-updating copyright year (Index + Guide pages)
- Side navigation bar for Guide page with sticky horizontal TOC
- `AvatarContext` provider for real-time avatar sync across all components
- `data-section` attributes for section-based scrolling on Index and Guide

### Changed
- Profile "Danger Zone" renamed to "Reset Profile" for better UX
- ScrollNav: section-based navigation → viewport-height frame scrolling (PgUp/PgDn)
- Avatar constructor: "Apply" now correctly persists the constructed avatar
- Guide layout: reduced vertical padding, wider footer for Back to Tasks clearance
- PremiumHeader logo label updated to "TaskFlow"
- Guide page title updated to "TaskFlow — User Guide"

### Fixed
- Avatar changes now apply immediately without page reload (context-based sync)
- Guide `BarChart2` missing import added
- TypeScript strict mode compliance across all components
- Footer text no longer overlaps with fixed "Back to Tasks" button

### Security
- Input sanitization via DOMPurify on all user-generated content

## [1.1.0] — 2026-04-15

### Added
- Timer system with Pomodoro-compatible intervals
- Alarm notifications with sound alerts and browser notifications
- User profile system with persistent storage
- Avatar constructor with DiceBear integration (background, skin, hair, clothes, accessories)
- Priority color palette (9 colors) with custom labeling
- Calendar date picker for deadline tracking
- Tag system with hierarchical classification

### Changed
- Migrated from JavaScript to TypeScript (strict mode)
- Updated build system to Vite 6
- Refactored component architecture to atomic design

### Fixed
- Timer state persistence across page reloads
- Edge cases in task completion toggle logic

## [1.0.0] — 2026-03-01

### Added
- Initial release with core task management
- Task CRUD operations with localStorage persistence
- Subtask decomposition with independent completion tracking
- Basic priority classification (high, medium, low)
- Responsive design with mobile-first approach
- Dark/light theme support
- Smooth scroll navigation
- Toast notification system

---

## Version History

| Version | Date | Highlights |
|---------|------|------------|
| [2.0.0](https://github.com/sanot-tech/TaskFlow/releases/tag/v2.0.0) | 2026-05-25 | Task navigation, avatar context, enterprise footer |
| [1.1.0](https://github.com/sanot-tech/TaskFlow/releases/tag/v1.1.0) | 2026-04-15 | Timer, alarms, profile system, avatar constructor |
| [1.0.0](https://github.com/sanot-tech/TaskFlow/releases/tag/v1.0.0) | 2026-03-01 | Initial release |

## Release Cadence

- **Major (x.0.0)**: Breaking changes, large architectural shifts — ~6 months
- **Minor (1.x.0)**: New features, non-breaking improvements — ~4-6 weeks
- **Patch (1.0.x)**: Bug fixes, security patches, small enhancements — ~1-2 weeks

---

<p align="center">
  <sub>See the full release history on [GitHub Releases](https://github.com/sanot-tech/TaskFlow/releases).</sub>
</p>
