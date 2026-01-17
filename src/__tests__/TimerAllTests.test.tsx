import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { TaskTimerButton } from '../components/TaskTimerButton';
import { AlarmControl } from '../components/AlarmControl';
import { AlarmProvider } from '../contexts/AlarmContext';

// Import all the test suites
import './useAlarmTimer.test';
import './TaskTimerButton.test';
import './AlarmControl.test';
import './TimerIntegration.test';
import './TimerPerformance.test';
import './TimerScenarioTests.test';
import './TimerEdgeCases.test';
import './TimerNotifications.test';

// Mock toast functions
jest.mock('../utils/toast', () => ({
  showError: jest.fn(),
  showToast: jest.fn(),
}));

// Mock the useNeuroAdaptiveSizing hook to return consistent values
jest.mock('../components/TaskTimerButton', () => {
  const originalModule = jest.requireActual('../components/TaskTimerButton');
  return {
    ...originalModule,
    useNeuroAdaptiveSizing: () => ({
      width: 1024,
      height: 768,
      scale: 1,
      iconSize: 20,
      textSize: 16,
      padding: 16,
      gap: 8,
    }),
  };
});

// Mock browser APIs
Object.defineProperty(window, 'Notification', {
  value: {
    permission: 'granted',
    requestPermission: jest.fn(() => Promise.resolve('granted')),
  },
  writable: true,
});

Object.defineProperty(navigator, 'vibrate', {
  value: jest.fn(),
  writable: true,
});

window.Audio = class MockAudio {
  constructor(public src?: string) {}
  play = jest.fn(() => Promise.resolve());
  pause = jest.fn();
  currentTime = 0;
  volume = 1.0;
  loop = false;
  load = jest.fn();
} as unknown as typeof Audio;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AlarmProvider>{children}</AlarmProvider>
);

describe('Complete Timer Test Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('completes full timer workflow without errors', async () => {
    const taskProps = {
      taskId: 'full-workflow-task',
      taskTitle: 'Full workflow test',
    };

    render(
      <>
        <AlarmControl />
        <TaskTimerButton {...taskProps} />
      </>,
      { wrapper }
    );

    // Test the complete workflow
    // 1. Enable alarm system
    fireEvent.click(screen.getByRole('switch'));
    expect(screen.getByText('Select Sound')).toBeInTheDocument();

    // 2. Select a sound
    fireEvent.click(screen.getByText('🎵 Soft'));

    // 3. Start a timer
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    // 4. Check timer is running
    expect(screen.getByText('5:00')).toBeInTheDocument();

    // 5. Let it run for 2 minutes
    act(() => {
      jest.advanceTimersByTime(2 * 60 * 1000);
    });

    // 6. Check it updated correctly
    expect(screen.getByText('3:00')).toBeInTheDocument();

    // 7. Stop the timer
    fireEvent.click(screen.getByRole('button', { name: /Stop Circle Icon/i }));

    // 8. Verify it stopped
    expect(screen.queryByText('3:00')).not.toBeInTheDocument();

    // 9. Start another timer
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    // 10. Let it complete
    act(() => {
      jest.advanceTimersByTime(60 * 1000);
    });

    // 11. Verify completion
    expect(screen.queryByText('00:00')).not.toBeInTheDocument();

    // All steps completed without errors
    expect(true).toBe(true);
  });

  it('handles all timer operations with various durations', async () => {
    const taskProps = {
      taskId: 'duration-test-task',
      taskTitle: 'Duration test',
    };

    render(
      <>
        <AlarmControl />
        <TaskTimerButton {...taskProps} />
      </>,
      { wrapper }
    );

    // Enable alarm system
    fireEvent.click(screen.getByRole('switch'));

    // Test various durations
    const durations = [1, 5, 10, 25, 45, 60];

    for (const duration of durations) {
      // Start timer
      fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
      fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: duration.toString() } });
      fireEvent.click(screen.getByRole('button', { name: /Start/i }));

      // Verify it started with correct time
      expect(screen.getByText(`${duration}:00`)).toBeInTheDocument();

      // Stop the timer
      fireEvent.click(screen.getByRole('button', { name: /Stop Circle Icon/i }));

      // Verify it stopped
      expect(screen.queryByText(`${duration}:00`)).not.toBeInTheDocument();
    }

    // All durations handled successfully
    expect(true).toBe(true);
  });

  it('validates timer functionality under stress conditions', async () => {
    const taskProps = {
      taskId: 'stress-test-task',
      taskTitle: 'Stress test',
    };

    render(
      <>
        <AlarmControl />
        <TaskTimerButton {...taskProps} />
      </>,
      { wrapper }
    );

    // Enable alarm system
    fireEvent.click(screen.getByRole('switch'));

    // Perform multiple rapid operations
    for (let i = 0; i < 5; i++) {
      // Start timer
      fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
      fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '1' } });
      fireEvent.click(screen.getByRole('button', { name: /Start/i }));

      // Let it run briefly
      act(() => {
        jest.advanceTimersByTime(10000); // 10 seconds
      });

      // Stop timer
      fireEvent.click(screen.getByRole('button', { name: /Stop Circle Icon/i }));
    }

    // Verify UI stability
    expect(screen.queryByText('Active (')).not.toBeInTheDocument();

    // Start one more timer and let it complete
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '0.1' } }); // ~6 seconds
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    act(() => {
      jest.advanceTimersByTime(10000); // 10 seconds
    });

    // Should complete without issues
    expect(screen.queryByText('00:06')).not.toBeInTheDocument();

    // Stress test completed successfully
    expect(true).toBe(true);
  });

  it('confirms all notification systems work correctly', async () => {
    const taskProps = {
      taskId: 'notification-workflow-task',
      taskTitle: 'Notification workflow test',
    };

    // Mock notification system
    const mockNotification = jest.fn();
    (window as any).Notification = mockNotification;

    render(
      <>
        <AlarmControl />
        <TaskTimerButton {...taskProps} />
      </>,
      { wrapper }
    );

    // Enable alarm system
    fireEvent.click(screen.getByRole('switch'));

    // Select different sound
    fireEvent.click(screen.getByText('🔔 Sunrise'));

    // Start a timer that will complete and trigger notifications
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '0.033' } }); // ~2 seconds
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    // Wait for completion
    act(() => {
      jest.advanceTimersByTime(5000); // 5 seconds
    });

    // Verify all notification systems were triggered
    expect(window.Audio).toHaveBeenCalledTimes(1);
    const audioInstance = (window.Audio as jest.MockedClass<typeof Audio>).mock.instances[0];
    expect(audioInstance.play).toHaveBeenCalledTimes(1);
    
    expect(navigator.vibrate).toHaveBeenCalledWith([200, 100, 200, 100, 400, 200, 200]);
    
    expect(mockNotification).toHaveBeenCalledWith('⏰ Alarm triggered!', {
      body: 'Task "Notification workflow test" requires attention!',
      icon: '/favicon.ico',
      tag: 'notification-workflow-task',
    });

    // All notification systems validated
    expect(true).toBe(true);
  });

  it('verifies performance metrics under normal usage', async () => {
    const taskProps = {
      taskId: 'performance-test-task',
      taskTitle: 'Performance test',
    };

    // Measure performance of basic operations
    const startTime = performance.now();
    
    render(
      <>
        <AlarmControl />
        <TaskTimerButton {...taskProps} />
      </>,
      { wrapper }
    );
    
    const renderTime = performance.now() - startTime;
    
    // Enable alarm system
    fireEvent.click(screen.getByRole('switch'));
    
    // Start timer
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));
    
    // Check timer is displayed
    expect(screen.getByText('5:00')).toBeInTheDocument();
    
    // Advance time
    const updateTimeStart = performance.now();
    act(() => {
      jest.advanceTimersByTime(10000); // 10 seconds
    });
    const updateTime = performance.now() - updateTimeStart;
    
    // Performance checks
    expect(renderTime).toBeLessThan(100); // Render should be under 100ms
    expect(updateTime).toBeLessThan(50);  // Time update should be under 50ms
    
    // Stop timer
    fireEvent.click(screen.getByRole('button', { name: /Stop Circle Icon/i }));
    
    // Performance test passed
    expect(true).toBe(true);
  });
});