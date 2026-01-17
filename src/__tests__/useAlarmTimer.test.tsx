import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AlarmProvider, useAlarmContext } from '../contexts/AlarmContext';

// Mock toast function
jest.mock('../utils/toast', () => ({
  showError: jest.fn(),
}));

// Wrapper component to provide context for tests
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AlarmProvider>{children}</AlarmProvider>
);

describe('useAlarmTimer', () => {
  // Reset timers after each test to avoid conflicts
  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with default values', () => {
    jest.useFakeTimers();
    
    const { result } = renderHook(() => useAlarmContext(), { wrapper });
    
    expect(result.current.alarms).toEqual([]);
    expect(result.current.isAlarmEnabled).toBe(false);
    expect(result.current.selectedSound).toBe('bell');
  });

  it('should toggle alarm system correctly', () => {
    jest.useFakeTimers();
    
    const { result } = renderHook(() => useAlarmContext(), { wrapper });
    
    expect(result.current.isAlarmEnabled).toBe(false);
    
    act(() => {
      result.current.toggleAlarmSystem();
    });
    
    expect(result.current.isAlarmEnabled).toBe(true);
    
    act(() => {
      result.current.toggleAlarmSystem();
    });
    
    expect(result.current.isAlarmEnabled).toBe(false);
  });

  it('should start a timer when alarm system is enabled', () => {
    jest.useFakeTimers();
    
    const { result } = renderHook(() => useAlarmContext(), { wrapper });
    
    // Enable the alarm system first
    act(() => {
      result.current.toggleAlarmSystem();
    });
    
    // Start a timer
    act(() => {
      const success = result.current.startTimer('task-1', 'Test Task', 5);
      expect(success).toBe(true);
    });
    
    expect(result.current.alarms).toHaveLength(1);
    expect(result.current.alarms[0]).toEqual({
      taskId: 'task-1',
      taskTitle: 'Test Task',
      duration: 5,
      isActive: true,
      remainingTime: 300, // 5 minutes in seconds
    });
  });

  it('should not start a timer when alarm system is disabled', () => {
    jest.useFakeTimers();
    
    const { result } = renderHook(() => useAlarmContext(), { wrapper });
    
    // Alarm system is disabled by default
    act(() => {
      const success = result.current.startTimer('task-1', 'Test Task', 5);
      expect(success).toBe(false);
    });
    
    expect(result.current.alarms).toHaveLength(0);
  });

  it('should not start a timer if one already exists for the same task', () => {
    jest.useFakeTimers();
    
    const { result } = renderHook(() => useAlarmContext(), { wrapper });
    
    // Enable the alarm system
    act(() => {
      result.current.toggleAlarmSystem();
    });
    
    // Start the first timer
    act(() => {
      const success = result.current.startTimer('task-1', 'Test Task', 5);
      expect(success).toBe(true);
    });
    
    expect(result.current.alarms).toHaveLength(1);
    
    // Try to start another timer with the same task ID
    act(() => {
      const success = result.current.startTimer('task-1', 'Test Task', 10);
      expect(success).toBe(false);
    });
    
    // Should still have only one timer
    expect(result.current.alarms).toHaveLength(1);
    expect(result.current.alarms[0].duration).toBe(5); // Original duration should remain
  });

  it('should stop a timer correctly', () => {
    jest.useFakeTimers();
    
    const { result } = renderHook(() => useAlarmContext(), { wrapper });
    
    // Enable the alarm system
    act(() => {
      result.current.toggleAlarmSystem();
    });
    
    // Start a timer
    act(() => {
      result.current.startTimer('task-1', 'Test Task', 5);
    });
    
    expect(result.current.alarms).toHaveLength(1);
    
    // Stop the timer
    act(() => {
      result.current.stopTimer('task-1');
    });
    
    expect(result.current.alarms).toHaveLength(0);
  });

  it('should decrement timer every second when enabled', () => {
    jest.useFakeTimers();
    
    const { result } = renderHook(() => useAlarmContext(), { wrapper });
    
    // Enable the alarm system
    act(() => {
      result.current.toggleAlarmSystem();
    });
    
    // Start a timer
    act(() => {
      result.current.startTimer('task-1', 'Test Task', 1); // 1 minute timer
    });
    
    // Initially, remaining time should be 60 seconds (1 minute)
    expect(result.current.alarms[0].remainingTime).toBe(60);
    
    // Advance timer by 10 seconds
    act(() => {
      jest.advanceTimersByTime(10000); // 10 seconds
    });
    
    // Remaining time should now be 50 seconds
    expect(result.current.alarms[0].remainingTime).toBe(50);
  });

  it('should trigger alarm when timer reaches zero', () => {
    jest.useFakeTimers();
    
    const { result } = renderHook(() => useAlarmContext(), { wrapper });
    
    // Enable the alarm system
    act(() => {
      result.current.toggleAlarmSystem();
    });
    
    // Start a very short timer
    act(() => {
      result.current.startTimer('task-1', 'Test Task', 0.0167); // About 1 second (0.0167 * 60 ≈ 1)
    });
    
    // Mock the triggerAlarm function behavior
    const originalTitle = document.title;
    
    // Advance timer by 2 seconds to ensure timer finishes
    act(() => {
      jest.advanceTimersByTime(2000); // 2 seconds
    });
    
    // Timer should be removed from the list after finishing
    expect(result.current.alarms).toHaveLength(0);
    
    // Restore original title
    document.title = originalTitle;
  });

  it('should format time correctly', () => {
    jest.useFakeTimers();
    
    const { result } = renderHook(() => useAlarmContext(), { wrapper });
    
    expect(result.current.formatTime(0)).toBe('0:00');
    expect(result.current.formatTime(30)).toBe('0:30');
    expect(result.current.formatTime(60)).toBe('1:00');
    expect(result.current.formatTime(90)).toBe('1:30');
    expect(result.current.formatTime(3600)).toBe('60:00');
  });

  it('should get time for specific task', () => {
    jest.useFakeTimers();
    
    const { result } = renderHook(() => useAlarmContext(), { wrapper });
    
    // Enable the alarm system
    act(() => {
      result.current.toggleAlarmSystem();
    });
    
    // Start a timer
    act(() => {
      result.current.startTimer('task-1', 'Test Task', 5);
    });
    
    const timeForTask = result.current.getTimeForTask('task-1');
    expect(timeForTask).toBe('5:00'); // Initial time should be 5:00
    
    // Change time and verify
    act(() => {
      jest.advanceTimersByTime(60000); // 1 minute
    });
    
    const updatedTime = result.current.getTimeForTask('task-1');
    expect(updatedTime).toBe('4:00'); // Should now be 4:00
  });

  it('should check if timer is active for a task', () => {
    jest.useFakeTimers();
    
    const { result } = renderHook(() => useAlarmContext(), { wrapper });
    
    // Enable the alarm system
    act(() => {
      result.current.toggleAlarmSystem();
    });
    
    // Initially, no timer should be active for task-1
    expect(result.current.isTimerActive('task-1')).toBe(false);
    
    // Start a timer
    act(() => {
      result.current.startTimer('task-1', 'Test Task', 5);
    });
    
    // Now timer should be active for task-1
    expect(result.current.isTimerActive('task-1')).toBe(true);
    
    // Stop the timer
    act(() => {
      result.current.stopTimer('task-1');
    });
    
    // Now timer should not be active for task-1
    expect(result.current.isTimerActive('task-1')).toBe(false);
  });

  it('should change selected sound correctly', () => {
    jest.useFakeTimers();
    
    const { result } = renderHook(() => useAlarmContext(), { wrapper });
    
    expect(result.current.selectedSound).toBe('bell');
    
    act(() => {
      result.current.setSelectedSound('chime');
    });
    
    expect(result.current.selectedSound).toBe('chime');
  });
});