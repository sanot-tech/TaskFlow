// src/__tests__/test-setup.ts
import '@testing-library/jest-dom';

// Mock window.Notification as a constructor
const MockNotification: any = jest.fn().mockImplementation((title: string, options?: any) => {
  return { title, ...options };
});
MockNotification.permission = 'granted';
MockNotification.requestPermission = jest.fn(() => Promise.resolve('granted'));
Object.defineProperty(window, 'Notification', {
  value: MockNotification,
  writable: true,
});

// Mock navigator.vibrate
Object.defineProperty(navigator, 'vibrate', {
  value: jest.fn(),
  writable: true,
});

// Mock Audio
window.Audio = class MockAudio {
  constructor(public src?: string) {}
  play = jest.fn(() => Promise.resolve());
  pause = jest.fn();
  currentTime = 0;
  volume = 1.0;
  loop = false;
  load = jest.fn();
} as unknown as typeof Audio;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock console.error to prevent test log pollution
console.error = jest.fn();

describe('test setup', () => {
  it('loads without errors', () => {
    expect(true).toBe(true);
  });
});