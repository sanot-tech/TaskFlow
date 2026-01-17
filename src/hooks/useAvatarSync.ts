import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';

// AvatarState interface definition
export interface AvatarState {
  url: string;
  timestamp: number;
  version: number;
  error?: string;
}

// useAvatarSync Hook
export const useAvatarSync = () => {
  const [localAvatar, setLocalAvatar] = useLocalStorage<AvatarState>(
    'avatar-state',
    { url: '', timestamp: Date.now(), version: 1 }
  );
  
  const [avatar, setAvatar] = useState<AvatarState>(localAvatar);
  const [isLoading, setIsLoading] = useState(false);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Очистка таймера ошибок при размонтировании
  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);
  
  // Синхронизация с localStorage
  useEffect(() => {
    setLocalAvatar(avatar);
  }, [avatar, setLocalAvatar]);
  
  // Слушаем изменения в localStorage из других вкладок
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'avatar-state' && e.newValue) {
        try {
          const newAvatar = JSON.parse(e.newValue);
          setAvatar(prev => ({
            ...prev,
            ...newAvatar,
            error: undefined // Очищаем ошибку при получении нового состояния
          }));
        } catch (error) {
          console.error('Error parsing avatar state:', error);
          setAvatar(prev => ({
            ...prev,
            error: 'Ошибка при синхронизации аватара'
          }));
          
          // Автоматически очищаем ошибку через 5 секунд
          if (errorTimeoutRef.current) {
            clearTimeout(errorTimeoutRef.current);
          }
          errorTimeoutRef.current = setTimeout(() => {
            setAvatar(prev => ({ ...prev, error: undefined }));
          }, 5000);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  const updateAvatar = useCallback((newUrl: string) => {
    setIsLoading(true);
    
    // Проверяем валидность URL
    try {
      new URL(newUrl);
      setAvatar({
        url: newUrl,
        timestamp: Date.now(),
        version: avatar.version + 1,
        error: undefined
      });
    } catch (error) {
      setAvatar(prev => ({
        ...prev,
        error: 'Невалидный URL аватара'
      }));
    } finally {
      setIsLoading(false);
    }
  }, [avatar.version]);
  
  const resetAvatar = useCallback(() => {
    setAvatar({
      url: '',
      timestamp: Date.now(),
      version: avatar.version + 1,
      error: undefined
    });
  }, [avatar.version]);
  
  return {
    avatar,
    updateAvatar,
    resetAvatar,
    isLoading,
    hasError: !!avatar.error
  };
};