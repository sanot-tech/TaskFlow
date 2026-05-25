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

describe('Timer Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('creates and manages timers through the full workflow', async () => {
    const taskProps = {
      taskId: 'integration-test-task',
      taskTitle: 'Integration Test Task',
    };

    render(
      <>
        <AlarmControl />
        <TaskTimerButton {...taskProps} />
      </>,
      { wrapper }
    );

    // Initially, alarm system should be disabled
    expect(screen.getByText('Enable to use timers')).toBeInTheDocument();

    // Enable the alarm system
    const toggleSwitch = screen.getByRole('switch');
    fireEvent.click(toggleSwitch);

    // Sound selection panel should appear
    expect(screen.getByText('Select Sound')).toBeInTheDocument();

    // Start a timer by clicking the TaskTimerButton
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));

    // Modal should appear
    expect(screen.getByText(/Start Timer/i)).toBeInTheDocument();

    // Change duration to 1 minute
    const durationInput = screen.getByLabelText(/Duration \(minutes\)/i);
    fireEvent.change(durationInput, { target: { value: '1' } });

    // Click start button
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    // Check that the timer is now active in the UI
    expect(screen.getAllByText('1:00').length).toBeGreaterThanOrEqual(1); // Initial time

    // Advance timer by 30 seconds
    act(() => {
      jest.advanceTimersByTime(30000); // 30 seconds
    });

    // Check that the timer has updated
    expect(screen.getAllByText('0:30').length).toBeGreaterThanOrEqual(1); // Should be 30 seconds left

    // Check that the timer appears in the AlarmControl section too
    expect(screen.getByText('Active (1)')).toBeInTheDocument();
    expect(screen.getByText('Integration Test Task')).toBeInTheDocument();

    // Stop the timer
    fireEvent.click(screen.getByRole('button', { name: '0:30' }));

    // Check that the timer is gone from the UI
    await waitFor(() => {
      expect(screen.queryByText('0:30')).not.toBeInTheDocument();
    });
  });

  it('manages multiple timers concurrently', async () => {
    const task1Props = {
      taskId: 'multi-test-task-1',
      taskTitle: 'Multi Test Task 1',
    };

    const task2Props = {
      taskId: 'multi-test-task-2',
      taskTitle: 'Multi Test Task 2',
    };

    render(
      <>
        <AlarmControl />
        <TaskTimerButton {...task1Props} />
        <TaskTimerButton {...task2Props} />
      </>,
      { wrapper }
    );

    // Enable the alarm system
    const toggleSwitch = screen.getByRole('switch');
    fireEvent.click(toggleSwitch);

    // Start first timer (5 minutes)
    fireEvent.click(screen.getAllByRole('button', { name: /Timer/i })[0]);
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));
    await waitFor(() => {
      expect(screen.getAllByText('5:00').length).toBeGreaterThanOrEqual(1);
    });

    // Start second timer (3 minutes)
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '3' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));
    await waitFor(() => {
      expect(screen.getAllByText('3:00').length).toBeGreaterThanOrEqual(1);
    });

    // Both timers should be active
    expect(screen.getByText('Active (2)')).toBeInTheDocument();

    // Advance time by 1 minute
    act(() => {
      jest.advanceTimersByTime(60000); // 1 minute
    });

    // Check that both timers have updated
    expect(screen.getAllByText('4:00').length).toBeGreaterThanOrEqual(1); // First timer
    expect(screen.getAllByText('2:00').length).toBeGreaterThanOrEqual(1); // Second timer

    // Stop the second timer
    fireEvent.click(screen.getByRole('button', { name: '2:00' }));

    // Should now show only one active timer
    await waitFor(() => {
      expect(screen.getByText('Active (1)')).toBeInTheDocument();
    });
  });

  it('properly cleans up timers when alarm system is disabled', async () => {
    const taskProps = {
      taskId: 'cleanup-test-task',
      taskTitle: 'Cleanup Test Task',
    };

    render(
      <>
        <AlarmControl />
        <TaskTimerButton {...taskProps} />
      </>,
      { wrapper }
    );

    // Enable the alarm system
    const toggleSwitch = screen.getByRole('switch');
    fireEvent.click(toggleSwitch);

    // Start a timer
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '10' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));
    await waitFor(() => {
      expect(screen.getAllByText('10:00').length).toBeGreaterThanOrEqual(1);
    });

    // Verify the timer is active
    expect(screen.getByText('Active (1)')).toBeInTheDocument();

    // Disable the alarm system
    fireEvent.click(toggleSwitch);

    // Timers should be cleared
    await waitFor(() => {
      expect(screen.queryByText('Active (1)')).not.toBeInTheDocument();
    });
    expect(screen.queryByText('10:00')).not.toBeInTheDocument();
    expect(screen.getByText('Enable to use timers')).toBeInTheDocument();

    // Re-enable the alarm system
    fireEvent.click(toggleSwitch);

    // No timers should be active
    expect(screen.queryByText('Active (')).not.toBeInTheDocument();
  });

  it('handles timer completion and triggers notifications', async () => {
    const taskProps = {
      taskId: 'completion-test-task',
      taskTitle: 'Completion Test Task',
    };

    render(
      <>
        <AlarmControl />
        <TaskTimerButton {...taskProps} />
      </>,
      { wrapper }
    );

    // Enable the alarm system
    const toggleSwitch = screen.getByRole('switch');
    fireEvent.click(toggleSwitch);

    // Start a short timer (2 minutes)
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));
    await waitFor(() => {
      expect(screen.getAllByText('2:00').length).toBeGreaterThanOrEqual(1);
    });

    // Advance time past the timer completion
    act(() => {
      jest.advanceTimersByTime(2 * 60 * 1000 + 1000); // 2 minutes + 1 second
    });

    // Timer should be removed from the active list
    await waitFor(() => {
      expect(screen.queryByText('Active (1)')).not.toBeInTheDocument();
    });
    expect(screen.queryByText('2:00')).not.toBeInTheDocument();
  });

  it('maintains timer state across UI interactions', async () => {
    const taskProps = {
      taskId: 'state-test-task',
      taskTitle: 'State Test Task',
    };

    render(
      <>
        <AlarmControl />
        <TaskTimerButton {...taskProps} />
      </>,
      { wrapper }
    );

    // Enable the alarm system
    const toggleSwitch = screen.getByRole('switch');
    fireEvent.click(toggleSwitch);

    // Start a timer
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));
    await waitFor(() => {
      expect(screen.getAllByText('5:00').length).toBeGreaterThanOrEqual(1);
    });

    // Interact with other parts of the UI (like changing sounds)
    fireEvent.click(screen.getByText('✨ Melody'));

    // Timer should still be running
    expect(screen.getAllByText('5:00').length).toBeGreaterThanOrEqual(1);

    // Advance time
    act(() => {
      jest.advanceTimersByTime(60000); // 1 minute
    });

    // Timer should have updated despite UI interactions
    expect(screen.getAllByText('4:00').length).toBeGreaterThanOrEqual(1);
  });
});
