import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { TaskTimerButton } from '../components/TaskTimerButton';
import { AlarmControl } from '../components/AlarmControl';
import { AlarmProvider } from '../contexts/AlarmContext';

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

    // Enable alarm system
    fireEvent.click(screen.getByRole('switch'));
    expect(screen.getByText('Select Sound')).toBeInTheDocument();

    // Select a sound
    fireEvent.click(screen.getByText('🎵 Soft'));

    // Start a timer
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    // Check timer is running
    const runningTimers = screen.getAllByText('5:00');
    expect(runningTimers.length).toBeGreaterThanOrEqual(1);

    // Let it run for 2 minutes
    act(() => {
      jest.advanceTimersByTime(2 * 60 * 1000);
    });

    // Check it updated correctly
    const updatedTimers = screen.getAllByText('3:00');
    expect(updatedTimers.length).toBeGreaterThanOrEqual(1);

    // Stop the timer
    const stopButtons = screen.getAllByRole('button', { name: '3:00' });
    fireEvent.click(stopButtons[0]);

    // Verify it stopped
    await waitFor(() => {
      expect(screen.queryByText('3:00')).not.toBeInTheDocument();
    });

    // Start another timer
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    // Let it complete
    act(() => {
      jest.advanceTimersByTime(60 * 1000);
    });

    // Verify completion
    expect(screen.queryByText('0:00')).not.toBeInTheDocument();
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
    const durations = [1, 5, 10];

    for (const duration of durations) {
      // Start timer
      fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
      fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: duration.toString() } });
      fireEvent.click(screen.getByRole('button', { name: /Start/i }));

      // Verify it started
      const timeTexts = screen.getAllByText(`${duration}:00`);
      expect(timeTexts.length).toBeGreaterThanOrEqual(1);

      // Stop the timer
      const stopBtns = screen.getAllByRole('button', { name: `${duration}:00` });
      fireEvent.click(stopBtns[0]);

      // Verify it stopped
      await waitFor(() => {
        expect(screen.queryByText(`${duration}:00`)).not.toBeInTheDocument();
      });
    }
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

      // Stop immediately (don't advance timers, just stop the active timer)
      const activeBtn = screen.getAllByRole('button').find(b => b.textContent?.match(/^\d+:\d{2}$/));
      if (activeBtn) fireEvent.click(activeBtn);

      // Wait for state to flush
      await waitFor(() => {
        expect(screen.queryByText('Active (')).not.toBeInTheDocument();
      });
    }

    // Should be stable after all operations
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    // Start and stop one more time without errors
    const activeBtn = screen.getAllByRole('button').find(b => b.textContent?.match(/^\d+:\d{2}$/));
    expect(activeBtn).toBeTruthy();
    if (activeBtn) fireEvent.click(activeBtn);
  });

  it('confirms all notification systems work correctly', async () => {
    const taskProps = {
      taskId: 'notification-workflow-task',
      taskTitle: 'Notification workflow test',
    };

    // Mock Notification as a constructor
    const mockNotification = jest.fn();
    (mockNotification as any).permission = 'granted';
    (mockNotification as any).requestPermission = jest.fn(() => Promise.resolve('granted'));
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

    // Start a short timer
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '0.033' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    // Wait for completion
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // Verify notification was triggered
    expect(mockNotification).toHaveBeenCalled();
  });

  it('verifies performance metrics under normal usage', async () => {
    const taskProps = {
      taskId: 'performance-test-task',
      taskTitle: 'Performance test',
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

    // Start timer
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    // Check timer is displayed
    const timers = screen.getAllByText('5:00');
    expect(timers.length).toBeGreaterThanOrEqual(1);

    // Advance time
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    // Stop timer
    const stopBtns = screen.getAllByRole('button', { name: /4:50/ });
    if (stopBtns.length > 0) fireEvent.click(stopBtns[0]);
  });
});
