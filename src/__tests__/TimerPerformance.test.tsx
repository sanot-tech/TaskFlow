import React from 'react';
import { render, act } from '@testing-library/react';
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

describe('Timer Performance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('handles rapid timer creation without performance degradation', async () => {
    const taskProps = {
      taskId: 'perf-test-task',
      taskTitle: 'Performance Test Task',
    };

    // Measure initial render time
    const startTime = performance.now();
    render(<TaskTimerButton {...taskProps} />, { wrapper });
    const initialRenderTime = performance.now() - startTime;

    // Expect initial render to be under 50ms
    expect(initialRenderTime).toBeLessThan(50);

    // Enable alarm system
    const { getByRole } = render(<AlarmControl />, { wrapper });
    act(() => {
      fireEvent.click(getByRole('switch'));
    });

    // Create multiple timers rapidly
    const createTimerPromises = [];
    const numTimers = 10;

    for (let i = 0; i < numTimers; i++) {
      const taskPropsWithId = {
        ...taskProps,
        taskId: `perf-test-task-${i}`,
        taskTitle: `Performance Test Task ${i}`,
      };

      const timerStartTime = performance.now();
      createTimerPromises.push(
        act(async () => {
          render(<TaskTimerButton {...taskPropsWithId} />, { wrapper });
        }).then(() => {
          const renderTime = performance.now() - timerStartTime;
          return { id: i, renderTime };
        })
      );
    }

    const results = await Promise.all(createTimerPromises);
    const avgRenderTime = results.reduce((sum, res) => sum + res.renderTime, 0) / results.length;

    // Average render time should be under 50ms
    expect(avgRenderTime).toBeLessThan(50);
  });

  it('maintains performance with many active timers', async () => {
    // Create a context provider with many active timers
    const ManyTimersProvider = ({ children }: { children: React.ReactNode }) => {
      const [alarms, setAlarms] = React.useState<any[]>(() => {
        // Create 50 active timers
        return Array.from({ length: 50 }, (_, i) => ({
          taskId: `timer-${i}`,
          taskTitle: `Timer ${i}`,
          duration: 25,
          remainingTime: Math.floor(Math.random() * 1500), // Random time between 0-25 min
          isActive: true,
        }));
      });
      const [isAlarmEnabled, setIsAlarmEnabled] = React.useState(true);
      const [selectedSound, setSelectedSound] = React.useState('bell');
      const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
      const audioRef = React.useRef<HTMLAudioElement | null>(null);

      const startTimer = (taskId: string, taskTitle: string, duration: number) => {
        const newAlarm = {
          taskId,
          taskTitle,
          duration,
          isActive: true,
          remainingTime: duration * 60,
        };
        setAlarms(prev => [...prev, newAlarm]);
        return true;
      };

      const stopTimer = (taskId: string) => {
        setAlarms(prev => prev.filter((a: any) => a.taskId !== taskId));
      };

      const toggleAlarmSystem = () => {
        setIsAlarmEnabled(prev => !prev);
      };

      const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      };

      const getTimeForTask = (taskId: string) => {
        const alarm = alarms.find((a: any) => a.taskId === taskId);
        return alarm ? formatTime(alarm.remainingTime) : null;
      };

      const isTimerActive = (taskId: string) => {
        return alarms.some((a: any) => a.taskId === taskId);
      };

      const ALARM_SOUNDS = [
        { id: 'bell', name: '🔔 Sunrise', url: '/sounds/bell.mp3' },
        { id: 'chime', name: '✨ Melody', url: '/sounds/chime.mp3' },
        { id: 'siren', name: '🚨 Siren', url: '/sounds/siren.mp3' },
        { id: 'beep', name: '🔊 Beep', url: '/sounds/beep.mp3' },
        { id: 'soft', name: '🎵 Soft', url: '/sounds/soft.mp3' },
      ];

      const value = {
        alarms,
        isAlarmEnabled,
        selectedSound,
        ALARM_SOUNDS,
        startTimer,
        stopTimer,
        toggleAlarmSystem,
        setSelectedSound,
        formatTime,
        getTimeForTask,
        isTimerActive,
      };

      return <AlarmContext.Provider value={value}>{children}</AlarmContext.Provider>;
    };

    const AlarmContext = React.createContext<any>(undefined);

    const ManyTimersWrapper = ({ children }: { children: React.ReactNode }) => (
      <ManyTimersProvider>
        <AlarmContext.Provider value={{
          startTimer: (taskId: string, taskTitle: string, duration: number) => {
            return true;
          },
          stopTimer: (taskId: string) => {},
          isTimerActive: (taskId: string) => false,
          getTimeForTask: (taskId: string) => null,
          isAlarmEnabled: true,
          toggleAlarmSystem: () => {},
          formatTime: (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`,
          alarms: Array.from({ length: 50 }, (_, i) => ({
            taskId: `timer-${i}`,
            taskTitle: `Timer ${i}`,
            duration: 25,
            remainingTime: Math.floor(Math.random() * 1500),
            isActive: true,
          })),
          selectedSound: 'bell',
          ALARM_SOUNDS: [
            { id: 'bell', name: '🔔 Sunrise', url: '/sounds/bell.mp3' },
            { id: 'chime', name: '✨ Melody', url: '/sounds/chime.mp3' },
            { id: 'siren', name: '🚨 Siren', url: '/sounds/siren.mp3' },
            { id: 'beep', name: '🔊 Beep', url: '/sounds/beep.mp3' },
            { id: 'soft', name: '🎵 Soft', url: '/sounds/soft.mp3' },
          ],
          setSelectedSound: (soundId: string) => {},
        }}>
          {children}
        </AlarmContext.Provider>
      </ManyTimersProvider>
    );

    // Render the AlarmControl with many active timers
    const startTime = performance.now();
    render(<AlarmControl />, { wrapper: ManyTimersWrapper });
    const renderTime = performance.now() - startTime;

    // Even with 50 active timers, render should be under 100ms
    expect(renderTime).toBeLessThan(100);

    // Simulate advancing time for all timers
    const updateTimeStart = performance.now();
    act(() => {
      jest.advanceTimersByTime(1000); // 1 second
    });
    const updateTime = performance.now() - updateTimeStart;

    // Updating 50 timers should be under 50ms
    expect(updateTime).toBeLessThan(50);
  });

  it('does not create memory leaks with continuous timer operations', async () => {
    const taskProps = {
      taskId: 'leak-test-task',
      taskTitle: 'Leak Test Task',
    };

    // Capture initial memory usage if possible
    const initialMemory = (global as any).performance?.memory 
      ? (global as any).performance.memory.usedJSHeapSize 
      : 0;

    // Perform multiple start/stop cycles
    for (let i = 0; i < 100; i++) {
      const { unmount } = render(<TaskTimerButton {...taskProps} />, { wrapper });

      // Enable alarm system
      const { getByRole, rerender } = render(<AlarmControl />, { wrapper });
      act(() => {
        fireEvent.click(getByRole('switch'));
      });

      // Start and immediately stop timer
      act(() => {
        fireEvent.click(getByRole('button', { name: /Timer/i }));
        fireEvent.change(getByRole('textbox'), { target: { value: '1' } });
        fireEvent.click(getByRole('button', { name: /Start/i }));
      });

      // Clean up
      unmount();
    }

    // Check memory usage again if possible
    const finalMemory = (global as any).performance?.memory 
      ? (global as any).performance.memory.usedJSHeapSize 
      : 0;

    // Memory increase should be reasonable (less than 10MB for 100 operations)
    if (initialMemory > 0 && finalMemory > 0) {
      const memoryIncrease = finalMemory - initialMemory;
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // 10MB
    }
  });

  it('efficiently updates UI when multiple timers change simultaneously', async () => {
    // Create a provider with multiple timers that will update simultaneously
    const MultiUpdateProvider = ({ children }: { children: React.ReactNode }) => {
      const [alarms, setAlarms] = React.useState<any[]>([
        { taskId: 'timer-1', taskTitle: 'Timer 1', duration: 1, remainingTime: 60, isActive: true },
        { taskId: 'timer-2', taskTitle: 'Timer 2', duration: 1, remainingTime: 60, isActive: true },
        { taskId: 'timer-3', taskTitle: 'Timer 3', duration: 1, remainingTime: 60, isActive: true },
        { taskId: 'timer-4', taskTitle: 'Timer 4', duration: 1, remainingTime: 60, isActive: true },
        { taskId: 'timer-5', taskTitle: 'Timer 5', duration: 1, remainingTime: 60, isActive: true },
      ]);
      const [isAlarmEnabled, setIsAlarmEnabled] = React.useState(true);
      const [selectedSound, setSelectedSound] = React.useState('bell');
      const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
      const audioRef = React.useRef<HTMLAudioElement | null>(null);

      // Set up an interval to update all timers
      React.useEffect(() => {
        if (isAlarmEnabled && alarms.length > 0) {
          intervalRef.current = setInterval(() => {
            setAlarms(prev => 
              prev.map(alarm => 
                alarm.remainingTime > 0 
                  ? { ...alarm, remainingTime: alarm.remainingTime - 1 } 
                  : { ...alarm, remainingTime: 0, isActive: false }
              ).filter(alarm => alarm.isActive || alarm.remainingTime > 0)
            );
          }, 1000);
        }

        return () => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        };
      }, [isAlarmEnabled, alarms.length]);

      const startTimer = (taskId: string, taskTitle: string, duration: number) => {
        const newAlarm = {
          taskId,
          taskTitle,
          duration,
          isActive: true,
          remainingTime: duration * 60,
        };
        setAlarms(prev => [...prev, newAlarm]);
        return true;
      };

      const stopTimer = (taskId: string) => {
        setAlarms(prev => prev.filter((a: any) => a.taskId !== taskId));
      };

      const toggleAlarmSystem = () => {
        setIsAlarmEnabled(prev => !prev);
      };

      const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      };

      const getTimeForTask = (taskId: string) => {
        const alarm = alarms.find((a: any) => a.taskId === taskId);
        return alarm ? formatTime(alarm.remainingTime) : null;
      };

      const isTimerActive = (taskId: string) => {
        return alarms.some((a: any) => a.taskId === taskId);
      };

      const ALARM_SOUNDS = [
        { id: 'bell', name: '🔔 Sunrise', url: '/sounds/bell.mp3' },
        { id: 'chime', name: '✨ Melody', url: '/sounds/chime.mp3' },
        { id: 'siren', name: '🚨 Siren', url: '/sounds/siren.mp3' },
        { id: 'beep', name: '🔊 Beep', url: '/sounds/beep.mp3' },
        { id: 'soft', name: '🎵 Soft', url: '/sounds/soft.mp3' },
      ];

      const value = {
        alarms,
        isAlarmEnabled,
        selectedSound,
        ALARM_SOUNDS,
        startTimer,
        stopTimer,
        toggleAlarmSystem,
        setSelectedSound,
        formatTime,
        getTimeForTask,
        isTimerActive,
      };

      return <AlarmContext.Provider value={value}>{children}</AlarmContext.Provider>;
    };

    const AlarmContext = React.createContext<any>(undefined);

    const MultiUpdateWrapper = ({ children }: { children: React.ReactNode }) => (
      <MultiUpdateProvider>
        <AlarmContext.Provider value={{
          startTimer: (taskId: string, taskTitle: string, duration: number) => {
            return true;
          },
          stopTimer: (taskId: string) => {},
          isTimerActive: (taskId: string) => false,
          getTimeForTask: (taskId: string) => null,
          isAlarmEnabled: true,
          toggleAlarmSystem: () => {},
          formatTime: (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`,
          alarms: [
            { taskId: 'timer-1', taskTitle: 'Timer 1', duration: 1, remainingTime: 60, isActive: true },
            { taskId: 'timer-2', taskTitle: 'Timer 2', duration: 1, remainingTime: 60, isActive: true },
            { taskId: 'timer-3', taskTitle: 'Timer 3', duration: 1, remainingTime: 60, isActive: true },
            { taskId: 'timer-4', taskTitle: 'Timer 4', duration: 1, remainingTime: 60, isActive: true },
            { taskId: 'timer-5', taskTitle: 'Timer 5', duration: 1, remainingTime: 60, isActive: true },
          ],
          selectedSound: 'bell',
          ALARM_SOUNDS: [
            { id: 'bell', name: '🔔 Sunrise', url: '/sounds/bell.mp3' },
            { id: 'chime', name: '✨ Melody', url: '/sounds/chime.mp3' },
            { id: 'siren', name: '🚨 Siren', url: '/sounds/siren.mp3' },
            { id: 'beep', name: '🔊 Beep', url: '/sounds/beep.mp3' },
            { id: 'soft', name: '🎵 Soft', url: '/sounds/soft.mp3' },
          ],
          setSelectedSound: (soundId: string) => {},
        }}>
          {children}
        </AlarmContext.Provider>
      </MultiUpdateProvider>
    );

    // Measure how long it takes to update multiple timers
    render(<AlarmControl />, { wrapper: MultiUpdateWrapper });

    const updateStartTime = performance.now();
    act(() => {
      jest.advanceTimersByTime(5000); // Advance 5 seconds
    });
    const updateTime = performance.now() - updateStartTime;

    // Updating 5 timers simultaneously should be under 100ms
    expect(updateTime).toBeLessThan(100);
  });

  it('has efficient cleanup when components unmount', async () => {
    const taskProps = {
      taskId: 'cleanup-perf-task',
      taskTitle: 'Cleanup Perf Task',
    };

    // Measure how long cleanup takes
    const { unmount } = render(<TaskTimerButton {...taskProps} />, { wrapper });

    // Enable alarm system and start a timer
    const { getByRole } = render(<AlarmControl />, { wrapper });
    act(() => {
      fireEvent.click(getByRole('switch'));
    });

    act(() => {
      fireEvent.click(getByRole('button', { name: /Timer/i }));
      fireEvent.change(getByRole('textbox'), { target: { value: '5' } });
      fireEvent.click(getByRole('button', { name: /Start/i }));
    });

    // Measure unmount time
    const unmountStartTime = performance.now();
    unmount();
    const unmountTime = performance.now() - unmountStartTime;

    // Unmounting should be under 10ms
    expect(unmountTime).toBeLessThan(10);
  });
});