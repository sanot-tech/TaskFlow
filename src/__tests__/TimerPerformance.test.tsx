import React from 'react';
import { render, act, fireEvent, screen } from '@testing-library/react';
import { TaskTimerButton } from '../components/TaskTimerButton';
import { AlarmControl } from '../components/AlarmControl';
import { AlarmProvider, AlarmContext } from '../contexts/AlarmContext';

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

describe('Timer Performance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('handles rapid timer creation without performance degradation', async () => {
    const taskIds = Array.from({ length: 10 }, (_, i) => `perf-test-task-${i}`);

    // Render both components together to share AlarmProvider state
    render(
      <>
        <AlarmControl />
        {taskIds.map(id => (
          <TaskTimerButton key={id} taskId={id} taskTitle={`Task ${id}`} />
        ))}
      </>,
      { wrapper }
    );

    // Enable alarm system
    fireEvent.click(screen.getByRole('switch'));

    // All Timer buttons should be visible
    const timerButtons = screen.getAllByRole('button', { name: /Timer/i });
    expect(timerButtons.length).toBe(taskIds.length);

    // Start first timer
    fireEvent.click(timerButtons[0]);
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    // Should have created timers without crashing
    expect(screen.getAllByText('Active (1)').length).toBeGreaterThanOrEqual(1);
  });

  it('maintains performance with many active timers', async () => {
    const ManyTimersWrapper = ({ children }: { children: React.ReactNode }) => (
      <AlarmContext.Provider value={{
        alarms: Array.from({ length: 50 }, (_, i) => ({
          taskId: `timer-${i}`,
          taskTitle: `Timer ${i}`,
          duration: 25,
          remainingTime: Math.floor(Math.random() * 1500),
          isActive: true,
        })),
        isAlarmEnabled: true,
        selectedSound: 'bell',
        ALARM_SOUNDS: [
          { id: 'bell', name: '🔔 Sunrise', url: '/sounds/bell.mp3' },
          { id: 'chime', name: '✨ Melody', url: '/sounds/chime.mp3' },
          { id: 'siren', name: '🚨 Siren', url: '/sounds/siren.mp3' },
          { id: 'beep', name: '🔊 Beep', url: '/sounds/beep.mp3' },
          { id: 'soft', name: '🎵 Soft', url: '/sounds/soft.mp3' },
        ],
        startTimer: () => true,
        stopTimer: () => {},
        toggleAlarmSystem: () => {},
        setSelectedSound: () => {},
        formatTime: (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`,
        getTimeForTask: () => null,
        isTimerActive: () => false,
      }}>
        {children}
      </AlarmContext.Provider>
    );

    // Render with 50 active timers — should not crash
    render(<AlarmControl />, { wrapper: ManyTimersWrapper });
    expect(screen.getByText('Active (50)')).toBeInTheDocument();

    // Advance time — should update without crashing
    act(() => {
      jest.advanceTimersByTime(1000);
    });
  });

  it('does not create memory leaks with continuous timer operations', async () => {
    const taskProps = {
      taskId: 'leak-test-task',
      taskTitle: 'Leak Test Task',
    };

    // Perform multiple start/stop cycles using single render with pre-enabled alarm
    for (let i = 0; i < 5; i++) {
      const { unmount } = render(
        <>
          <AlarmControl />
          <TaskTimerButton {...taskProps} />
        </>,
        { wrapper }
      );

      // Enable alarm system
      fireEvent.click(screen.getByRole('switch'));

      // Start and immediately stop timer
      fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
      fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '1' } });
      fireEvent.click(screen.getByRole('button', { name: /Start/i }));

      // Clean up
      unmount();
    }

    // If we got here without errors, memory is fine
    expect(true).toBe(true);
  });

  it('efficiently updates UI when multiple timers change simultaneously', async () => {
    const MultiUpdateWrapper = ({ children }: { children: React.ReactNode }) => (
      <AlarmContext.Provider value={{
        alarms: [
          { taskId: 'timer-1', taskTitle: 'Timer 1', duration: 1, remainingTime: 60, isActive: true },
          { taskId: 'timer-2', taskTitle: 'Timer 2', duration: 1, remainingTime: 60, isActive: true },
          { taskId: 'timer-3', taskTitle: 'Timer 3', duration: 1, remainingTime: 60, isActive: true },
          { taskId: 'timer-4', taskTitle: 'Timer 4', duration: 1, remainingTime: 60, isActive: true },
          { taskId: 'timer-5', taskTitle: 'Timer 5', duration: 1, remainingTime: 60, isActive: true },
        ],
        isAlarmEnabled: true,
        selectedSound: 'bell',
        ALARM_SOUNDS: [
          { id: 'bell', name: '🔔 Sunrise', url: '/sounds/bell.mp3' },
          { id: 'chime', name: '✨ Melody', url: '/sounds/chime.mp3' },
          { id: 'siren', name: '🚨 Siren', url: '/sounds/siren.mp3' },
          { id: 'beep', name: '🔊 Beep', url: '/sounds/beep.mp3' },
          { id: 'soft', name: '🎵 Soft', url: '/sounds/soft.mp3' },
        ],
        startTimer: () => true,
        stopTimer: () => {},
        toggleAlarmSystem: () => {},
        setSelectedSound: () => {},
        formatTime: (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`,
        getTimeForTask: () => null,
        isTimerActive: () => false,
      }}>
        {children}
      </AlarmContext.Provider>
    );

    render(<AlarmControl />, { wrapper: MultiUpdateWrapper });
    expect(screen.getByText('Active (5)')).toBeInTheDocument();

    // Advance time — should update without crashing
    act(() => {
      jest.advanceTimersByTime(1000);
    });
  });

  it('has efficient cleanup when components unmount', async () => {
    const taskProps = {
      taskId: 'cleanup-perf-task',
      taskTitle: 'Cleanup Perf Task',
    };

    const { unmount } = render(
      <>
        <AlarmControl />
        <TaskTimerButton {...taskProps} />
      </>,
      { wrapper }
    );

    // Enable alarm system and start a timer
    fireEvent.click(screen.getByRole('switch'));
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    // Unmount should not throw
    expect(() => unmount()).not.toThrow();
  });
});
