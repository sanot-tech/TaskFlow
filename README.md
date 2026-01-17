# DYAD Timer Application

## Overview
DYAD is a sophisticated timer application built with React, TypeScript, and Tailwind CSS. The application features a comprehensive timer system with advanced notification capabilities, responsive design, and premium UI components.

## Timer Functionality
The application includes a robust timer system with the following features:

- **Task Timers**: Create and manage timers for specific tasks with customizable durations
- **Multiple Concurrent Timers**: Run multiple timers simultaneously for different tasks
- **Visual Countdown**: Real-time visual representation of remaining time
- **Sound Notifications**: Audio alerts with multiple sound options when timers complete
- **Browser Notifications**: Native browser notifications for completed timers
- **Device Vibration**: Haptic feedback on supported devices
- **Page Title Flashing**: Visual alerts in browser tab when timer completes
- **Responsive Design**: Works seamlessly across mobile, tablet, and desktop devices
- **Premium UI Components**: Elegant, modern interface with smooth animations

## Core Components
- `TaskTimerButton`: Interactive button component for creating and controlling task timers
- `AlarmControl`: Central control panel for managing the alarm system and active timers
- `AlarmContext`: Global state management for all timer-related functionality
- `useAlarmTimer`: Custom hook providing timer functionality to components

## Technical Features
- Built with React 18 and TypeScript for type safety
- Styled with Tailwind CSS and shadcn/ui components
- Responsive design using flexbox and grid layouts
- Animated UI elements with Framer Motion
- Comprehensive testing with Jest and React Testing Library
- Advanced state management with React Context API

## Testing
The application includes a comprehensive test suite covering:
- Unit tests for individual components and hooks
- Integration tests for component interactions
- Performance tests for timer operations
- Scenario tests for real-world usage patterns
- Edge case tests for boundary conditions
- Notification system tests for all alert types

## Setup
To run the application locally:

1. Clone the repository
2. Install dependencies with `pnpm install`
3. Start the development server with `pnpm dev`

## Documentation
Additional documentation is available in the `docs/` directory:
- `TIMER_TESTS.md` - Detailed test strategy and implementation
- `TIMER_TEST_RESULTS.md` - Test results and coverage report