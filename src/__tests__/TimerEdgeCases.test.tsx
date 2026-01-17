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

describe('Timer Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('handles minimum possible timer duration', async () => {
    const taskProps = {
      taskId: 'min-duration-task',
      taskTitle: 'Minimal duration test',
    };

    render(<TaskTimerButton {...taskProps} />, { wrapper });

    // Enable alarm system
    const { getByRole } = render(<AlarmControl />, { wrapper });
    fireEvent.click(getByRole('switch'));

    // Start timer with minimum possible duration (1 second = 0.0167 minutes)
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '0.0167' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    // Timer should start with 00:01 (rounded display)
    expect(screen.getByText('00:01')).toBeInTheDocument();

    // Advance time by 1 second to complete the timer
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Timer should complete quickly
    expect(screen.queryByText('00:01')).not.toBeInTheDocument();
  });

  it('handles maximum possible timer duration', async () => {
    const taskProps = {
      taskId: 'max-duration-task',
      taskTitle: 'Maximum duration test',
    };

    render(<TaskTimerButton {...taskProps} />, { wrapper });

    // Enable alarm system
    const { getByRole } = render(<AlarmControl />, { wrapper });
    fireEvent.click(getByRole('switch'));

    // Start timer with maximum possible duration (180 minutes as per input constraints)
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '180' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    // Timer should start with 180:00
    expect(screen.getByText('180:00')).toBeInTheDocument();

    // Advance time by 1 hour (3600 seconds)
    act(() => {
      jest.advanceTimersByTime(3600 * 1000);
    });

    // Should have 179:00 left (179 hours, 0 minutes)
    // Actually, this would be 179:00 = 179*60 = 10740 seconds remaining
    // So 180 minutes = 10800 seconds, minus 3600 = 7200 seconds = 120 minutes = 2 hours
    // So should show 178:00
    // Actually, 180 minutes = 3 hours, after 1 hour should be 2 hours left = 120 minutes = 2:00:00
    // So it should show 120:00 in our format
    // Let me recalculate: 180 minutes initially = 180:00
    // After 1 hour (60 minutes), should be 120:00
    expect(screen.getByText('120:00')).toBeInTheDocument();
  });

  it('handles timer with zero duration', async () => {
    const taskProps = {
      taskId: 'zero-duration-task',
      taskTitle: 'Zero duration test',
    };

    render(<TaskTimerButton {...taskProps} />, { wrapper });

    // Enable alarm system
    const { getByRole } = render(<AlarmControl />, { wrapper });
    fireEvent.click(getByRole('switch'));

    // Try to start timer with zero duration
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    // Should show error or not start
    // Based on our implementation, it should not start with 0 duration
    expect(screen.queryByText('00:00')).not.toBeInTheDocument();
  });

  it('handles invalid timer values gracefully', async () => {
    const taskProps = {
      taskId: 'invalid-value-task',
      taskTitle: 'Invalid value test',
    };

    render(<TaskTimerButton {...taskProps} />, { wrapper });

    // Enable alarm system
    const { getByRole } = render(<AlarmControl />, { wrapper });
    fireEvent.click(getByRole('switch'));

    // Try to start timer with negative duration
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '-10' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    // Should not start with negative value
    expect(screen.queryByText('-10:00')).not.toBeInTheDocument();

    // Try with extremely large value
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '999999' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    // Should handle large values appropriately (may depend on input constraints)
    // Our input has max="180" so it should cap at 180
    expect(screen.queryByText('999999:00')).not.toBeInTheDocument();
  });

  it('handles rapid start-stop operations', async () => {
    const taskProps = {
      taskId: 'rapid-op-task',
      taskTitle: 'Rapid operations test',
    };

    render(<TaskTimerButton {...taskProps} />, { wrapper });

    // Enable alarm system
    const { getByRole } = render(<AlarmControl />, { wrapper });
    fireEvent.click(getByRole('switch'));

    // Perform rapid start-stop operations
    for (let i = 0; i < 10; i++) {
      fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
      fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '1' } });
      fireEvent.click(screen.getByRole('button', { name: /Start/i }));
      
      // Immediately stop
      fireEvent.click(screen.getByRole('button', { name: /Stop Circle Icon/i }));
    }

    // UI should not crash and should not have any active timers
    expect(screen.queryByText('01:00')).not.toBeInTheDocument();
    expect(screen.queryByText('Active (')).not.toBeInTheDocument();
  });

  it('handles multiple simultaneous timer starts', async () => {
    const taskProps = {
      taskId: 'multi-start-task',
      taskTitle: 'Multiple start test',
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

    // Try to start the same timer multiple times rapidly
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '5' } });

    // Click start multiple times
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    // Should only have one timer active (due to duplicate prevention)
    expect(screen.getByText('5:00')).toBeInTheDocument();
    
    // Try to start with same task ID should fail
    // This is handled in the startTimer function which prevents duplicates
  });

  it('handles system time changes gracefully', async () => {
    const taskProps = {
      taskId: 'time-change-task',
      taskTitle: 'Time change test',
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

    // Start a timer
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    expect(screen.getByText('5:00')).toBeInTheDocument();

    // Simulate a large time jump forward (should not affect our fake timers)
    act(() => {
      jest.advanceTimersByTime(1000 * 60 * 10); // 10 minutes
    });

    // Timer should have counted down appropriately
    expect(screen.getByText('00:00')).toBeInTheDocument(); // Should be complete
  });

  it('handles browser tab visibility changes', async () => {
    const taskProps = {
      taskId: 'visibility-task',
      taskTitle: 'Visibility test',
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

    // Start a timer
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    expect(screen.getByText('2:00')).toBeInTheDocument();

    // Simulate tab becoming hidden and then visible (our timers should continue)
    Object.defineProperty(document, 'hidden', { value: true, writable: true });
    fireEvent(document, new Event('visibilitychange'));

    // Advance time while "tab is hidden"
    act(() => {
      jest.advanceTimersByTime(30000); // 30 seconds
    });

    // Simulate tab becoming visible again
    Object.defineProperty(document, 'hidden', { value: false, writable: true });
    fireEvent(document, new Event('visibilitychange'));

    // Timer should reflect the elapsed time
    expect(screen.getByText('1:30')).toBeInTheDocument(); // Should have 1:30 left
  });

  it('handles concurrent timers with overlapping durations', async () => {
    const task1Props = {
      taskId: 'overlap-task-1',
      taskTitle: 'Overlap test 1',
    };

    const task2Props = {
      taskId: 'overlap-task-2',
      taskTitle: 'Overlap test 2',
    };

    render(
      <>
        <AlarmControl />
        <TaskTimerButton {...task1Props} />
        <TaskTimerButton {...task2Props} />
      </>,
      { wrapper }
    );

    // Enable alarm system
    fireEvent.click(screen.getByRole('switch'));

    // Start first timer (3 minutes)
    fireEvent.click(screen.getAllByRole('button', { name: /Timer/i })[0]);
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '3' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    // Start second timer (5 minutes) immediately
    fireEvent.click(screen.getAllByRole('button', { name: /Timer/i })[1]);
    fireEvent.change(screen.getAllByLabelText(/Duration \(minutes\)/i)[1], { target: { value: '5' } });
    fireEvent.click(screen.getAllByRole('button', { name: /Start/i })[1]);

    // Both timers should be running
    expect(screen.getByText('3:00')).toBeInTheDocument();
    expect(screen.getByText('5:00')).toBeInTheDocument();
    expect(screen.getByText('Active (2)')).toBeInTheDocument();

    // Advance time by 3 minutes - first timer should complete
    act(() => {
      jest.advanceTimersByTime(3 * 60 * 1000);
    });

    // First timer should be gone, second should have 2 minutes left
    expect(screen.queryByText('3:00')).not.toBeInTheDocument();
    expect(screen.getByText('2:00')).toBeInTheDocument();
    expect(screen.getByText('Active (1)')).toBeInTheDocument();

    // Advance time by 2 more minutes - second timer should complete
    act(() => {
      jest.advanceTimersByTime(2 * 60 * 1000);
    });

    // Second timer should also be gone
    expect(screen.queryByText('2:00')).not.toBeInTheDocument();
    expect(screen.queryByText('Active (')).not.toBeInTheDocument();
  });

  it('handles rapid consecutive timer completions', async () => {
    const taskProps = {
      taskId: 'rapid-completion-task',
      taskTitle: 'Rapid completion test',
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

    // Complete multiple short timers in succession
    for (let i = 0; i < 5; i++) {
      // Start a 10-second timer
      fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
      fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '0.167' } }); // ~10 seconds
      fireEvent.click(screen.getByRole('button', { name: /Start/i }));

      // Wait for timer to complete
      act(() => {
        jest.advanceTimersByTime(10000); // 10 seconds
      });

      // Timer should complete and disappear
      expect(screen.queryByText('00:10')).not.toBeInTheDocument();
    }

    // UI should remain stable after multiple completions
    expect(screen.queryByText('Active (')).not.toBeInTheDocument();
  });
});