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

describe('Timer Scenario Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('scenario: User sets Pomodoro timer for focused work session', async () => {
    const taskProps = {
      taskId: 'pomodoro-task',
      taskTitle: 'Focus on Project Report',
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

    // Select a suitable sound for work
    fireEvent.click(screen.getByText('🎵 Soft'));

    // Start a Pomodoro timer (25 minutes)
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '25' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    // Check that the timer has started
    expect(screen.getByText('25:00')).toBeInTheDocument();
    expect(screen.getByText('Focus on Project Report')).toBeInTheDocument();

    // Simulate working for 15 minutes
    act(() => {
      jest.advanceTimersByTime(15 * 60 * 1000); // 15 minutes
    });

    expect(screen.getByText('10:00')).toBeInTheDocument();

    // User decides to pause work and takes a break early
    fireEvent.click(screen.getByRole('button', { name: /Stop Circle Icon/i }));

    // Timer should be stopped
    expect(screen.queryByText('10:00')).not.toBeInTheDocument();
  });

  it('scenario: User manages multiple concurrent tasks with timers', async () => {
    const task1Props = {
      taskId: 'task-1',
      taskTitle: 'Write article draft',
    };

    const task2Props = {
      taskId: 'task-2',
      taskTitle: 'Prepare presentation',
    };

    const task3Props = {
      taskId: 'task-3',
      taskTitle: 'Review team reports',
    };

    render(
      <>
        <AlarmControl />
        <TaskTimerButton {...task1Props} />
        <TaskTimerButton {...task2Props} />
        <TaskTimerButton {...task3Props} />
      </>,
      { wrapper }
    );

    // Enable alarm system
    fireEvent.click(screen.getByRole('switch'));

    // Start first task timer (45 minutes)
    fireEvent.click(screen.getAllByRole('button', { name: /Timer/i })[0]);
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '45' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    // Start second task timer (30 minutes)
    fireEvent.click(screen.getAllByRole('button', { name: /Timer/i })[1]);
    fireEvent.change(screen.getAllByLabelText(/Duration \(minutes\)/i)[1], { target: { value: '30' } });
    fireEvent.click(screen.getAllByRole('button', { name: /Start/i })[1]);

    // Verify both timers are running
    await waitFor(() => {
      expect(screen.getByText('45:00')).toBeInTheDocument();
      expect(screen.getByText('30:00')).toBeInTheDocument();
    });

    // Check that both appear in the AlarmControl panel
    expect(screen.getByText('Active (2)')).toBeInTheDocument();

    // Simulate time passing (15 minutes)
    act(() => {
      jest.advanceTimersByTime(15 * 60 * 1000);
    });

    // Verify timers have updated
    expect(screen.getByText('30:00')).toBeInTheDocument(); // First timer
    expect(screen.getByText('15:00')).toBeInTheDocument(); // Second timer

    // Complete the second task early by stopping its timer
    const stopButtons = screen.getAllByRole('button', { name: /X/i });
    fireEvent.click(stopButtons[stopButtons.length - 1]); // Stop the second timer

    // Now only one timer should be active
    expect(screen.getByText('Active (1)')).toBeInTheDocument();

    // Start third task timer (20 minutes)
    fireEvent.click(screen.getAllByRole('button', { name: /Timer/i })[2]);
    fireEvent.change(screen.getAllByLabelText(/Duration \(minutes\)/i)[2], { target: { value: '20' } });
    fireEvent.click(screen.getAllByRole('button', { name: /Start/i })[2]);

    // Now should have 2 active timers again
    expect(screen.getByText('Active (2)')).toBeInTheDocument();
  });

  it('scenario: User adjusts timer settings based on changing needs', async () => {
    const taskProps = {
      taskId: 'adaptive-task',
      taskTitle: 'Complete weekly review',
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

    // Start with a short timer (15 minutes) for initial planning
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '15' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    expect(screen.getByText('15:00')).toBeInTheDocument();

    // After 5 minutes, realize more time is needed
    act(() => {
      jest.advanceTimersByTime(5 * 60 * 1000);
    });

    expect(screen.getByText('10:00')).toBeInTheDocument();

    // Stop the current timer
    fireEvent.click(screen.getByRole('button', { name: /Stop Circle Icon/i }));

    // Start a new, longer timer (45 minutes) for the actual work
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '45' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    expect(screen.getByText('45:00')).toBeInTheDocument();

    // Work for the full duration
    act(() => {
      jest.advanceTimersByTime(45 * 60 * 1000);
    });

    // Timer should complete and disappear
    expect(screen.queryByText('45:00')).not.toBeInTheDocument();
    expect(screen.queryByText('Active (')).not.toBeInTheDocument();
  });

  it('scenario: User uses timers for time-blocking schedule', async () => {
    const morningTaskProps = {
      taskId: 'morning-block',
      taskTitle: 'Morning routine & planning',
    };

    const afternoonTaskProps = {
      taskId: 'afternoon-block',
      taskTitle: 'Deep work session',
    };

    const eveningTaskProps = {
      taskId: 'evening-block',
      taskTitle: 'Review & prep for tomorrow',
    };

    render(
      <>
        <AlarmControl />
        <TaskTimerButton {...morningTaskProps} />
        <TaskTimerButton {...afternoonTaskProps} />
        <TaskTimerButton {...eveningTaskProps} />
      </>,
      { wrapper }
    );

    // Enable alarm system
    fireEvent.click(screen.getByRole('switch'));

    // Set up morning block (60 minutes)
    fireEvent.click(screen.getAllByRole('button', { name: /Timer/i })[0]);
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '60' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    // Set up afternoon block (120 minutes)
    fireEvent.click(screen.getAllByRole('button', { name: /Timer/i })[1]);
    fireEvent.change(screen.getAllByLabelText(/Duration \(minutes\)/i)[1], { target: { value: '120' } });
    fireEvent.click(screen.getAllByRole('button', { name: /Start/i })[1]);

    // Set up evening block (45 minutes)
    fireEvent.click(screen.getAllByRole('button', { name: /Timer/i })[2]);
    fireEvent.change(screen.getAllByLabelText(/Duration \(minutes\)/i)[2], { target: { value: '45' } });
    fireEvent.click(screen.getAllByRole('button', { name: /Start/i })[2]);

    // Verify all three timers are active
    expect(screen.getByText('Active (3)')).toBeInTheDocument();

    // Simulate moving through the day
    // Morning block completes
    act(() => {
      jest.advanceTimersByTime(60 * 60 * 1000); // 60 minutes
    });

    // Now should have 2 active timers
    expect(screen.getByText('Active (2)')).toBeInTheDocument();

    // Continue through afternoon
    act(() => {
      jest.advanceTimersByTime(60 * 60 * 1000); // Another 60 minutes
    });

    // Afternoon block should have 60 minutes left, evening should have 45
    // Check if both are still running (depends on implementation)
    expect(screen.getByText('Active (2)')).toBeInTheDocument();

    // Finish the day
    act(() => {
      jest.advanceTimersByTime(120 * 60 * 1000); // 120 minutes to finish everything
    });

    // All timers should be completed
    expect(screen.queryByText('Active (')).not.toBeInTheDocument();
  });

  it('scenario: User handles interruptions and timer adjustments', async () => {
    const primaryTaskProps = {
      taskId: 'primary-task',
      taskTitle: 'Code new feature',
    };

    render(
      <>
        <AlarmControl />
        <TaskTimerButton {...primaryTaskProps} />
      </>,
      { wrapper }
    );

    // Enable alarm system
    fireEvent.click(screen.getByRole('switch'));

    // Start primary task timer (50 minutes)
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '50' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    expect(screen.getByText('50:00')).toBeInTheDocument();

    // Work for 10 minutes
    act(() => {
      jest.advanceTimersByTime(10 * 60 * 1000);
    });

    expect(screen.getByText('40:00')).toBeInTheDocument();

    // Unexpected interruption: urgent meeting (15 minutes)
    fireEvent.click(screen.getByRole('button', { name: /Stop Circle Icon/i }));

    // Start timer for meeting
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '15' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    expect(screen.getByText('15:00')).toBeInTheDocument();

    // Meeting completes
    act(() => {
      jest.advanceTimersByTime(15 * 60 * 1000);
    });

    // Now return to original task with adjusted time
    // Start new timer for remaining work (40 minutes originally, worked 10, so 40 left, but maybe add more)
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '45' } }); // Adding 5 extra minutes for buffer
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    expect(screen.getByText('45:00')).toBeInTheDocument();

    // Complete the task
    act(() => {
      jest.advanceTimersByTime(45 * 60 * 1000);
    });

    expect(screen.queryByText('45:00')).not.toBeInTheDocument();
  });

  it('scenario: User experiments with different timer techniques', async () => {
    const taskProps = {
      taskId: 'experiment-task',
      taskTitle: 'Try new productivity technique',
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

    // Try 2-minute micro-bursts
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    expect(screen.getByText('02:00')).toBeInTheDocument();

    // Complete first burst
    act(() => {
      jest.advanceTimersByTime(2 * 60 * 1000);
    });

    // Take a 1-minute break
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    expect(screen.getByText('01:00')).toBeInTheDocument();

    // Break ends
    act(() => {
      jest.advanceTimersByTime(1 * 60 * 1000);
    });

    // Try 90-minute focus block
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '90' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    expect(screen.getByText('90:00')).toBeInTheDocument();

    // Work for 45 minutes
    act(() => {
      jest.advanceTimersByTime(45 * 60 * 1000);
    });

    expect(screen.getByText('45:00')).toBeInTheDocument();

    // Adjust technique: stop and try 60 minutes instead
    fireEvent.click(screen.getByRole('button', { name: /Stop Circle Icon/i }));

    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '60' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    expect(screen.getByText('60:00')).toBeInTheDocument();

    // Complete the session
    act(() => {
      jest.advanceTimersByTime(60 * 60 * 1000);
    });

    expect(screen.queryByText('60:00')).not.toBeInTheDocument();
  });
});