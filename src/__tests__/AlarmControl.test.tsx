import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AlarmControl } from '../components/AlarmControl';
import { AlarmProvider } from '../contexts/AlarmContext';

// Mock toast functions
jest.mock('../utils/toast', () => ({
  showError: jest.fn(),
  showToast: jest.fn(),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AlarmProvider>{children}</AlarmProvider>
);

describe('AlarmControl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders initial state correctly', () => {
    render(<AlarmControl />, { wrapper });
    
    // Check that the alarm toggle is rendered
    expect(screen.getByRole('switch')).toBeInTheDocument();
    
    // Initially, alarm system should be disabled
    expect(screen.getByText('Enable to use timers')).toBeInTheDocument();
  });

  it('toggles alarm system', () => {
    render(<AlarmControl />, { wrapper });
    
    // Get the toggle switch
    const toggleSwitch = screen.getByRole('switch');
    
    // Initially, it should be off
    expect(toggleSwitch).not.toBeChecked();
    
    // Click to turn it on
    fireEvent.click(toggleSwitch);
    
    // Now it should be checked
    expect(toggleSwitch).toBeChecked();
    
    // Sound selection panel should appear when enabled
    expect(screen.getByText('Select Sound')).toBeInTheDocument();
  });

  it('displays sound selection panel when enabled', () => {
    // Create a wrapper that initializes with the alarm enabled
    const EnabledAlarmProvider = ({ children }: { children: React.ReactNode }) => {
      const [alarms, setAlarms] = React.useState<any[]>([]);
      const [isAlarmEnabled, setIsAlarmEnabled] = React.useState(true);
      const [selectedSound, setSelectedSound] = React.useState('bell');
      const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
      const audioRef = React.useRef<HTMLAudioElement | null>(null);

      const startTimer = (taskId: string, taskTitle: string, duration: number) => {
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

    const EnabledWrapper = ({ children }: { children: React.ReactNode }) => (
      <EnabledAlarmProvider>
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
          alarms: [],
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
      </EnabledAlarmProvider>
    );

    render(<AlarmControl />, { wrapper: EnabledWrapper });
    
    // Check that the sound selection panel is visible
    expect(screen.getByText('Select Sound')).toBeInTheDocument();
    
    // Check that all sound buttons are present
    expect(screen.getByText('🔔 Sunrise')).toBeInTheDocument();
    expect(screen.getByText('✨ Melody')).toBeInTheDocument();
    expect(screen.getByText('🚨 Siren')).toBeInTheDocument();
    expect(screen.getByText('🔊 Beep')).toBeInTheDocument();
    expect(screen.getByText('🎵 Soft')).toBeInTheDocument();
  });

  it('changes selected sound', () => {
    const EnabledWrapper = ({ children }: { children: React.ReactNode }) => (
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
        alarms: [],
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
    );

    const AlarmContext = React.createContext<any>(undefined);

    render(<AlarmControl />, { wrapper: EnabledWrapper });
    
    // Click on a different sound button
    fireEvent.click(screen.getByText('✨ Melody'));
    
    // Check that the selected sound is updated in the UI
    expect(screen.getByText('Melody')).toBeInTheDocument();
  });

  it('displays active timers when present', () => {
    const ActiveTimersWrapper = ({ children }: { children: React.ReactNode }) => (
      <AlarmContext.Provider value={{
        startTimer: (taskId: string, taskTitle: string, duration: number) => {
          return true;
        },
        stopTimer: (taskId: string) => {},
        isTimerActive: (taskId: string) => true,
        getTimeForTask: (taskId: string) => '00:25',
        isAlarmEnabled: true,
        toggleAlarmSystem: () => {},
        formatTime: (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`,
        alarms: [
          { taskId: 'task-1', taskTitle: 'Test Task 1', duration: 25, remainingTime: 25, isActive: true },
          { taskId: 'task-2', taskTitle: 'Test Task 2', duration: 15, remainingTime: 15, isActive: true }
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
    );

    const AlarmContext = React.createContext<any>(undefined);

    render(<AlarmControl />, { wrapper: ActiveTimersWrapper });
    
    // Check that active timers are displayed
    expect(screen.getByText('Active (2)')).toBeInTheDocument();
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    expect(screen.getByText('00:25')).toBeInTheDocument(); // Displayed time
  });

  it('stops a timer when stop button is clicked', () => {
    const ActiveTimersWrapper = ({ children }: { children: React.ReactNode }) => (
      <AlarmContext.Provider value={{
        startTimer: (taskId: string, taskTitle: string, duration: number) => {
          return true;
        },
        stopTimer: (taskId: string) => {
          // Simulate stopping the timer
        },
        isTimerActive: (taskId: string) => true,
        getTimeForTask: (taskId: string) => '00:25',
        isAlarmEnabled: true,
        toggleAlarmSystem: () => {},
        formatTime: (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`,
        alarms: [
          { taskId: 'task-1', taskTitle: 'Test Task 1', duration: 25, remainingTime: 25, isActive: true }
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
    );

    const AlarmContext = React.createContext<any>(undefined);

    render(<AlarmControl />, { wrapper: ActiveTimersWrapper });
    
    // Find and click the stop button for the timer
    const stopButton = screen.getByRole('button', { name: /X/i });
    fireEvent.click(stopButton);
    
    // The timer should be stopped (implementation depends on how the component handles this)
  });
});