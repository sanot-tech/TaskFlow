import { renderHook, act, waitFor } from '@testing-library/react';
import { useUserProfile } from '../hooks/useUserProfile';
import React from 'react';

let mockProfile: any = null;
let mockSetProfile: (val: any) => void = () => {};

jest.mock('../hooks/useLocalStorage', () => ({
  useLocalStorage: (key: string, initialValue: any) => {
    if (key === 'user_profile') {
      const [val, setVal] = React.useState(mockProfile !== null ? mockProfile : initialValue);
      mockSetProfile = (newVal: any) => {
        mockProfile = newVal;
        setVal(newVal);
      };
      return [val, mockSetProfile];
    }
    const [val, setVal] = React.useState(initialValue);
    return [val, setVal];
  },
}));

jest.mock('../utils/toast', () => ({
  showSuccess: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockProfile = null;
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('useUserProfile', () => {
  it('initializes with null profile and loading state', () => {
    const { result } = renderHook(() => useUserProfile());
    expect(result.current.profile).toBeNull();
    expect(result.current.isLoading).toBe(true);
  });

  it('creates a new profile after init delay', async () => {
    const { result } = renderHook(() => useUserProfile());

    act(() => {
      jest.advanceTimersByTime(150);
    });

    await waitFor(() => {
      expect(result.current.profile).not.toBeNull();
    });
    expect(result.current.profile?.username).toBeTruthy();
    expect(result.current.profile?.id).toContain('user_');
    expect(result.current.isLoading).toBe(false);
  });

  it('loads existing profile from storage', async () => {
    const existingProfile = {
      id: 'user_existing',
      username: 'TestUser',
      theme: 'dark',
      createdAt: '2024-01-01',
      lastVisit: '2024-01-01',
      settings: { notifications: true, soundEnabled: true, selectedSound: 'bell' },
    };
    mockProfile = existingProfile;

    const { result } = renderHook(() => useUserProfile());

    act(() => {
      jest.advanceTimersByTime(150);
    });

    await waitFor(() => {
      expect(result.current.profile?.username).toBe('TestUser');
    });
    expect(result.current.isLoading).toBe(false);
  });

  it('updates profile fields', async () => {
    const { result } = renderHook(() => useUserProfile());

    act(() => {
      jest.advanceTimersByTime(150);
    });

    await waitFor(() => {
      expect(result.current.profile).not.toBeNull();
    });

    act(() => {
      result.current.updateProfile({ username: 'NewName' });
    });

    await waitFor(() => {
      expect(result.current.profile?.username).toBe('NewName');
    });
  });

  it('updates settings', async () => {
    const { result } = renderHook(() => useUserProfile());

    act(() => {
      jest.advanceTimersByTime(150);
    });

    await waitFor(() => {
      expect(result.current.profile).not.toBeNull();
    });

    act(() => {
      result.current.updateSettings({ notifications: false });
    });

    await waitFor(() => {
      expect(result.current.profile?.settings.notifications).toBe(false);
    });
  });

  it('resets profile and triggers reload', async () => {
    const reloadSpy = jest.fn();
    delete (window as any).location;
    (window as any).location = { reload: reloadSpy };

    const { result } = renderHook(() => useUserProfile());

    act(() => {
      jest.advanceTimersByTime(150);
    });

    await waitFor(() => {
      expect(result.current.profile).not.toBeNull();
    });

    act(() => {
      result.current.resetProfile();
    });

    expect(reloadSpy).toHaveBeenCalled();
  });
});
