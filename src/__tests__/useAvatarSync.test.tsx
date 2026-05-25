import { renderHook, act } from '@testing-library/react';
import { useAvatarSync } from '../hooks/useAvatarSync';

const mockStorage: Record<string, string> = {};
let currentStorageValue: any = { url: '', timestamp: 0, version: 1 };

jest.mock('../hooks/useLocalStorage', () => ({
  useLocalStorage: (key: string, initialValue: any) => {
    if (key === 'avatar-state') {
      return [currentStorageValue, (val: any) => {
        currentStorageValue = val;
        mockStorage[key] = JSON.stringify(val);
      }];
    }
    return [initialValue, jest.fn()];
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
  currentStorageValue = { url: '', timestamp: 0, version: 1 };
  Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
});

describe('useAvatarSync', () => {
  it('initializes with empty avatar state', () => {
    const { result } = renderHook(() => useAvatarSync());
    expect(result.current.avatar.url).toBe('');
    expect(result.current.avatar.version).toBe(1);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasError).toBe(false);
  });

  it('updates avatar URL correctly', () => {
    const { result } = renderHook(() => useAvatarSync());

    act(() => {
      result.current.updateAvatar('https://example.com/avatar.svg');
    });

    expect(result.current.avatar.url).toBe('https://example.com/avatar.svg');
    expect(result.current.avatar.version).toBe(2);
    expect(result.current.hasError).toBe(false);
  });

  it('sets error on invalid URL', () => {
    const { result } = renderHook(() => useAvatarSync());

    act(() => {
      result.current.updateAvatar('not-a-valid-url');
    });

    expect(result.current.hasError).toBe(true);
    expect(result.current.avatar.error).toBeTruthy();
  });

  it('resets avatar to empty state', () => {
    const { result } = renderHook(() => useAvatarSync());

    act(() => {
      result.current.updateAvatar('https://example.com/avatar.svg');
    });

    expect(result.current.avatar.url).toBeTruthy();

    act(() => {
      result.current.resetAvatar();
    });

    expect(result.current.avatar.url).toBe('');
    expect(result.current.avatar.version).toBe(3);
  });

  it('handles storage events from other tabs', () => {
    const { result } = renderHook(() => useAvatarSync());

    const newAvatar = { url: 'https://example.com/synced.svg', timestamp: 1000, version: 5 };

    act(() => {
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'avatar-state',
        newValue: JSON.stringify(newAvatar),
      }));
    });

    expect(result.current.avatar.url).toBe('https://example.com/synced.svg');
    expect(result.current.avatar.version).toBe(5);
  });

  it('handles errors in storage events', () => {
    const { result } = renderHook(() => useAvatarSync());

    act(() => {
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'avatar-state',
        newValue: '{invalid json',
      }));
    });

    expect(result.current.hasError).toBe(true);
  });
});
