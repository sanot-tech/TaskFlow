name: Pull Request
description: Submit a pull request to contribute to the project
title: "[PR]: "
labels: []
body:
  - type: markdown
    attributes:
      value: |
        ## 🚀 Pull Request
        Thank you for contributing! Please complete the checklist below to ensure a smooth review process.

  - type: checkboxes
    id: prerequisites
    attributes:
      label: Pre-submission Checklist
      description: Confirm before submitting
      options:
        - label: I have read the [Contributing Guide](../CONTRIBUTING.md)
          required: true
        - label: I have read the [Code of Conduct](../CODE_OF_CONDUCT.md)
          required: true
        - label: I have run `pnpm lint` and fixed any issues
          required: true
        - label: I have run `pnpm typecheck` and fixed any issues
          required: true
        - label: I have run `pnpm test` and all tests pass
          required: true
        - label: I have added/updated tests for my changes
          required: true
        - label: I have added/updated documentation as needed
          required: true
        - label: My commits follow [conventional commits](https://www.conventionalcommits.org/)
          required: true

  - type: dropdown
    id: type
    attributes:
      label: Change Type
      options:
        - feat — New feature
        - fix — Bug fix
        - refactor — Code refactoring
        - docs — Documentation
        - test — Testing
        - chore — Maintenance
        - perf — Performance
        - style — Code style
    validations:
      required: true

  - type: textarea
    id: description
    attributes:
      label: Description
      description: What does this PR do? Why is it needed?
      placeholder: |
        This PR adds...
        Closes #ISSUE_NUMBER
    validations:
      required: true

  - type: textarea
    id: testing
    attributes:
      label: Testing Notes
      description: How did you verify your changes?
      placeholder: |
        - Unit tests added for new functionality
        - Manual testing on Chrome/Firefox/Safari
        - Tested with screen reader
    validations:
      required: true

  - type: textarea
    id: screenshots
    attributes:
      label: Screenshots / Recordings
      description: If UI changes, add screenshots or screen recordings
      placeholder: Drag and drop images here, or paste video links

  - type: textarea
    id: notes
    attributes:
      label: Additional Notes
      description: Any other information reviewers should know
