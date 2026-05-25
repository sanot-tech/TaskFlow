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

// Mock browser Notification API as a constructor function
const mockNotification = jest.fn() as jest.Mock & { permission: string; requestPermission: jest.Mock };
mockNotification.permission = 'granted';
mockNotification.requestPermission = jest.fn(() => Promise.resolve('granted'));
Object.defineProperty(window, 'Notification', {
  value: mockNotification,
  writable: true,
});

// Mock navigator.vibrate
Object.defineProperty(navigator, 'vibrate', {
  value: jest.fn(),
  writable: true,
});

// Mock Audio as a jest.fn() so it can be spied on (assigns to `this` so mock.instances reflects property changes)
window.Audio = jest.fn().mockImplementation(function (this: any, src?: string) {
  this.play = jest.fn(() => Promise.resolve());
  this.pause = jest.fn();
  this.currentTime = 0;
  this.src = src;
  this.volume = 1.0;
  this.loop = false;
  this.load = jest.fn();
}) as unknown as typeof Audio;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AlarmProvider>{children}</AlarmProvider>
);

describe('Timer Notifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    
    // Clear any existing notifications
    if ((window.Notification as any).requestPermission?.mock) {
      (window.Notification as any).requestPermission.mockClear();
    }
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('plays sound when timer completes', async () => {
    const taskProps = {
      taskId: 'notification-task',
      taskTitle: 'Notification test task',
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

    // Select a specific sound
    fireEvent.click(screen.getByRole('button', { name: '🔔 Sunrise' }));

    // Start a short timer (2 seconds)
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '0.033' } }); // ~2 seconds
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    // Wait for timer to complete
    act(() => {
      jest.advanceTimersByTime(3000); // 3 seconds
    });

    // Check that audio was created and played
    const MockAudioConstructor = window.Audio as jest.MockedClass<typeof Audio>;
    // Audio is called once when clicking the sound button (testSound) and once when timer completes (playSound)
    expect(MockAudioConstructor).toHaveBeenCalledTimes(2);
    expect(MockAudioConstructor).toHaveBeenCalledWith('/sounds/bell.mp3');
    
    // Check that play was called on the audio instance created by playSound
    const audioInstance = (MockAudioConstructor as any).mock.instances[1];
    expect(audioInstance.play).toHaveBeenCalledTimes(1);
  });

  it('creates browser notification when timer completes', async () => {
    const taskProps = {
      taskId: 'browser-notification-task',
      taskTitle: 'Browser notification test',
    };

    // Mock the Notification constructor with granted permission
    const mockNotification = jest.fn();
    (mockNotification as any).permission = 'granted';
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

    // Start a short timer (2 seconds)
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '0.033' } }); // ~2 seconds
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    // Wait for timer to complete
    act(() => {
      jest.advanceTimersByTime(3000); // 3 seconds
    });

    // Check that notification was created
    expect(mockNotification).toHaveBeenCalledWith('⏰ Alarm triggered!', {
      body: 'Task "Browser notification test" requires attention!',
      icon: '/favicon.ico',
      tag: 'browser-notification-task',
    });
  });

  it('initiates vibration when timer completes', async () => {
    const taskProps = {
      taskId: 'vibration-task',
      taskTitle: 'Vibration test',
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

    // Start a short timer (2 seconds)
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '0.033' } }); // ~2 seconds
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    // Wait for timer to complete
    act(() => {
      jest.advanceTimersByTime(3000); // 3 seconds
    });

    // Check that vibration was called with the expected pattern
    expect(navigator.vibrate).toHaveBeenCalledWith([200, 100, 200, 100, 400, 200, 200]);
  });

  it('flashes page title when timer completes', async () => {
    const originalTitle = document.title;
    document.title = 'Test Page';

    const taskProps = {
      taskId: 'title-flash-task',
      taskTitle: 'Title flash test',
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

    // Start a short timer (2 seconds)
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '0.033' } }); // ~2 seconds
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    // Wait for timer to complete
    act(() => {
      jest.advanceTimersByTime(3000); // 3 seconds
    });

    // Advance time to let the flashing happen
    act(() => {
      jest.advanceTimersByTime(10000); // 10 seconds
    });

    // Title should be restored to original
    expect(document.title).toBe('Test Page');

    // Clean up
    document.title = originalTitle;
  });

  it('supports different alarm sounds', async () => {
    const taskProps = {
      taskId: 'sound-choice-task',
      taskTitle: 'Sound choice test',
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

    // Select different sounds and verify they are used
    const sounds = [
      { name: '🔔 Sunrise', url: '/sounds/bell.mp3' },
      { name: '✨ Melody', url: '/sounds/chime.mp3' },
      { name: '🚨 Siren', url: '/sounds/siren.mp3' },
      { name: '🔊 Beep', url: '/sounds/beep.mp3' },
      { name: '🎵 Soft', url: '/sounds/soft.mp3' },
    ];

    for (const sound of sounds) {
      // Reset mocks
      jest.clearAllMocks();
      
      // Select sound
      fireEvent.click(screen.getByRole('button', { name: sound.name }));

      // Start a short timer
      fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
      fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '0.033' } }); // ~2 seconds
      fireEvent.click(screen.getByRole('button', { name: /Start/i }));

      // Wait for timer to complete
      act(() => {
        jest.advanceTimersByTime(3000); // 3 seconds
      });

      // Check that the correct sound file was used
      const MockAudioConstructor = window.Audio as jest.MockedClass<typeof Audio>;
      expect(MockAudioConstructor).toHaveBeenCalledWith(sound.url);
    }
  });

  it('handles notification permission flow', async () => {
    // Temporarily change notification permission to 'default'
    const permMock = jest.fn() as jest.Mock & { permission: string; requestPermission: jest.Mock };
    permMock.permission = 'default';
    permMock.requestPermission = jest.fn(() => Promise.resolve('granted'));
    Object.defineProperty(window, 'Notification', {
      value: permMock,
      writable: true,
    });

    const taskProps = {
      taskId: 'permission-task',
      taskTitle: 'Permission test',
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

    // Start a short timer
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '0.033' } }); // ~2 seconds
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    // Wait for timer to complete
    act(() => {
      jest.advanceTimersByTime(3000); // 3 seconds
    });

    // Check that permission was requested
    expect(Notification.requestPermission).toHaveBeenCalled();
  });

  it('handles notification blocking gracefully', async () => {
    // Temporarily change notification permission to 'denied'
    const deniedMock = jest.fn() as jest.Mock & { permission: string; requestPermission: jest.Mock };
    deniedMock.permission = 'denied';
    deniedMock.requestPermission = jest.fn(() => Promise.resolve('denied'));
    Object.defineProperty(window, 'Notification', {
      value: deniedMock,
      writable: true,
    });

    const taskProps = {
      taskId: 'blocked-notification-task',
      taskTitle: 'Blocked notification test',
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

    // Start a short timer
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '0.033' } }); // ~2 seconds
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    // Wait for timer to complete
    act(() => {
      jest.advanceTimersByTime(3000); // 3 seconds
    });

    // Other notification methods should still work even if browser notifications are blocked
    expect(navigator.vibrate).toHaveBeenCalledWith([200, 100, 200, 100, 400, 200, 200]);
  });

  it('manages multiple concurrent alarms with notifications', async () => {
    const task1Props = {
      taskId: 'multi-notify-task-1',
      taskTitle: 'Multi notification test 1',
    };

    const task2Props = {
      taskId: 'multi-notify-task-2',
      taskTitle: 'Multi notification test 2',
    };

    // Mock the Notification constructor with granted permission
    const mockNotification = jest.fn();
    (mockNotification as any).permission = 'granted';
    (window as any).Notification = mockNotification;

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

    // Start first timer (short: 2 seconds)
    fireEvent.click(screen.getAllByRole('button', { name: /Timer/i })[0]);
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '0.033' } }); // ~2 seconds
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    // Start second timer (slightly longer: 4 seconds)
    // After first timer starts, its button changes to the stop button, so only one Timer button remains
    fireEvent.click(screen.getAllByRole('button', { name: /Timer/i })[0]);
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '0.067' } }); // ~4 seconds
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    // Wait for first timer to complete
    act(() => {
      jest.advanceTimersByTime(3000); // 3 seconds
    });

    // First notification should be created
    expect(mockNotification).toHaveBeenCalledTimes(1);
    expect(mockNotification).toHaveBeenCalledWith('⏰ Alarm triggered!', {
      body: 'Task "Multi notification test 1" requires attention!',
      icon: '/favicon.ico',
      tag: 'multi-notify-task-1',
    });

    // Wait for second timer to complete
    act(() => {
      jest.advanceTimersByTime(2000); // Additional 2 seconds
    });

    // Second notification should be created
    expect(mockNotification).toHaveBeenCalledTimes(2);
    expect(mockNotification).toHaveBeenCalledWith('⏰ Alarm triggered!', {
      body: 'Task "Multi notification test 2" requires attention!',
      icon: '/favicon.ico',
      tag: 'multi-notify-task-2',
    });
  });

  it('continues playing sound in loop until acknowledged', async () => {
    const taskProps = {
      taskId: 'loop-sound-task',
      taskTitle: 'Loop sound test',
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

    // Start a short timer
    fireEvent.click(screen.getByRole('button', { name: /Timer/i }));
    fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), { target: { value: '0.033' } }); // ~2 seconds
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    // Wait for timer to complete
    act(() => {
      jest.advanceTimersByTime(3000); // 3 seconds
    });

    // Check that audio was created with loop set to true
    const audioInstance = (window.Audio as jest.MockedClass<typeof Audio>).mock.instances[0];
    expect(audioInstance.loop).toBe(true);
    expect(audioInstance.play).toHaveBeenCalledTimes(1);
  });
});