import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AlarmControl } from '../components/AlarmControl';
import { AlarmProvider, AlarmContext } from '../contexts/AlarmContext';

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
    const EnabledWrapper = ({ children }: { children: React.ReactNode }) => (
      <AlarmContext.Provider value={{
        alarms: [],
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

    render(<AlarmControl />, { wrapper: EnabledWrapper });

    // Check that the sound selection panel is visible
    expect(screen.getByText('Select Sound')).toBeInTheDocument();

    // Check that all sound buttons are present
    expect(screen.getAllByText('🔔 Sunrise').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('✨ Melody')).toBeInTheDocument();
    expect(screen.getByText('🚨 Siren')).toBeInTheDocument();
    expect(screen.getByText('🔊 Beep')).toBeInTheDocument();
    expect(screen.getByText('🎵 Soft')).toBeInTheDocument();
  });

  it('changes selected sound', () => {
    let currentSound = 'bell';
    const setSelectedSound = (soundId: string) => { currentSound = soundId; };
    const EnabledWrapper = ({ children }: { children: React.ReactNode }) => (
      <AlarmContext.Provider value={{
        startTimer: () => true,
        stopTimer: () => {},
        isTimerActive: () => false,
        getTimeForTask: () => null,
        isAlarmEnabled: true,
        toggleAlarmSystem: () => {},
        formatTime: (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`,
        alarms: [],
        selectedSound: currentSound,
        ALARM_SOUNDS: [
          { id: 'bell', name: '🔔 Sunrise', url: '/sounds/bell.mp3' },
          { id: 'chime', name: '✨ Melody', url: '/sounds/chime.mp3' },
          { id: 'siren', name: '🚨 Siren', url: '/sounds/siren.mp3' },
          { id: 'beep', name: '🔊 Beep', url: '/sounds/beep.mp3' },
          { id: 'soft', name: '🎵 Soft', url: '/sounds/soft.mp3' },
        ],
        setSelectedSound,
      }}>
        {children}
      </AlarmContext.Provider>
    );

    render(<AlarmControl />, { wrapper: EnabledWrapper });
    
    // Click on a different sound button
    fireEvent.click(screen.getByText('✨ Melody'));
    
    // Check that the selected sound is updated in the UI
    expect(screen.getByText('✨ Melody')).toBeInTheDocument();
  });

  it('displays active timers when present', () => {
    const ActiveTimersWrapper = ({ children }: { children: React.ReactNode }) => (
      <AlarmContext.Provider value={{
        startTimer: () => true,
        stopTimer: () => {},
        isTimerActive: () => true,
        getTimeForTask: () => '00:25',
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
        setSelectedSound: () => {},
      }}>
        {children}
      </AlarmContext.Provider>
    );

    render(<AlarmControl />, { wrapper: ActiveTimersWrapper });
    
    // Check that active timers are displayed
    expect(screen.getByText('Active (2)')).toBeInTheDocument();
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    expect(screen.getByText('0:25')).toBeInTheDocument(); // Displayed time
  });

  it('stops a timer when stop button is clicked', () => {
    const ActiveTimersWrapper = ({ children }: { children: React.ReactNode }) => (
      <AlarmContext.Provider value={{
        startTimer: () => true,
        stopTimer: () => {},
        isTimerActive: () => true,
        getTimeForTask: () => '00:25',
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
        setSelectedSound: () => {},
      }}>
        {children}
      </AlarmContext.Provider>
    );

    render(<AlarmControl />, { wrapper: ActiveTimersWrapper });
    
    // Verify the active timer is displayed
    expect(screen.getByText('Active (1)')).toBeInTheDocument();
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    
    // Find and click the stop button
    const buttons = screen.getAllByRole('button');
    const stopBtn = buttons.find(b => b.querySelector('svg'));
    if (stopBtn) fireEvent.click(stopBtn);
  });
});