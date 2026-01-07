import { useState, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { showSuccess } from "@/utils/toast";

interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  theme: string;
  createdAt: string;
  lastVisit: string;
  settings: {
    notifications: boolean;
    soundEnabled: boolean;
    selectedSound: string;
  };
}

const generateUserId = () => {
  // Генерируем уникальный ID на основе timestamp + random
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const generateRandomAvatar = (seed: string) => {
  // Используем DiceBear API для генерации аватарок
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
};

const getRandomUsername = () => {
  const adjectives = ["Happy", "Bright", "Swift", "Calm", "Brave", "Smart", "Cool", "Warm"];
  const nouns = ["Panda", "Fox", "Eagle", "Tiger", "Dolphin", "Wolf", "Bear", "Hawk"];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj}${noun}${Math.floor(Math.random() * 1000)}`;
};

export const useUserProfile = () => {
  const [profile, setProfile] = useLocalStorage<UserProfile | null>("user_profile", null);
  const [isLoading, setIsLoading] = useState(true);

  // Автоматическое создание профиля при первом заходе
  useEffect(() => {
    const initProfile = () => {
      // Если профиль уже существует — обновляем lastVisit
      if (profile) {
        setProfile({
          ...profile,
          lastVisit: new Date().toISOString(),
        });
        setIsLoading(false);
        return;
      }

      // Создаем новый профиль
      const userId = generateUserId();
      const username = getRandomUsername();
      const newProfile: UserProfile = {
        id: userId,
        username: username,
        avatar: generateRandomAvatar(userId),
        theme: "dark", // По умолчанию темная тема
        createdAt: new Date().toISOString(),
        lastVisit: new Date().toISOString(),
        settings: {
          notifications: true,
          soundEnabled: true,
          selectedSound: "bell",
        },
      };

      setProfile(newProfile);
      showSuccess(`Добро пожаловать, ${username}! 🎉`);
      setIsLoading(false);
    };

    // Запускаем с небольшой задержкой для плавности
    setTimeout(initProfile, 100);
  }, []);

  // Обновление профиля
  const updateProfile = (updates: Partial<UserProfile>) => {
    if (profile) {
      setProfile({ ...profile, ...updates });
    }
  };

  // Обновление настроек
  const updateSettings = (updates: Partial<UserProfile['settings']>) => {
    if (profile) {
      setProfile({
        ...profile,
        settings: { ...profile.settings, ...updates },
      });
    }
  };

  // Сброс профиля (для тестирования)
  const resetProfile = () => {
    setProfile(null);
    window.location.reload();
  };

  return {
    profile,
    isLoading,
    updateProfile,
    updateSettings,
    resetProfile,
  };
};