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
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// НОВАЯ: Генерация гарантированно радостных аватарок
const generateHappyAvatar = (seed: string) => {
  // ТОЛЬКО самые радостные параметры
  const happyParams = {
    // Улыбка - обязательно
    mouth: ['smile', 'laughing'][Math.floor(Math.random() * 2)],
    
    // Глаза - только счастливые
    eyes: ['happy', 'close'][Math.floor(Math.random() * 2)],
    
    // Брови - поднятые (весёлые)
    eyebrows: ['raisedExcited', 'natural'][Math.floor(Math.random() * 2)],
    
    // Цвет фона - яркие и пастельные
    backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd700', 'ff69b4', 'a8e6cf'][Math.floor(Math.random() * 6)],
    
    // Прически - стильные короткие
    topType: ['shortHairShortFlat', 'shortHairShortWaved', 'shortHairShortCurly', 'shortHairDreads01'][Math.floor(Math.random() * 4)],
    
    // Цвет волос - тёмные и шоколадные
    hairColor: ['2c1b18', '4a312c', '6b4f4f', '854d4e', 'b5651d'][Math.floor(Math.random() * 5)],
    
    // Кожа - светлые оттенки
    skinColor: ['edb98a', 'ffdbac', 'f1c27d', 'f6c7b6'][Math.floor(Math.random() * 4)],
    
    // Одежда - яркая и стильная
    clothingColor: ['25557c', '6b4f4f', '2c2c2c', '7f4e1e', 'ff69b4', 'ffd700'][Math.floor(Math.random() * 6)],
    
    // Аксессуары - круглые очки (милые)
    accessories: 'round',
    
    // Без усов/бороды (чище лицо)
    facialHair: 'blank'
  };

  // Собираем URL с параметрами
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=${happyParams.backgroundColor}&accessories=${happyParams.accessories}&accessoriesProbability=100&skinColor=${happyParams.skinColor}&topType=${happyParams.topType}&hairColor=${happyParams.hairColor}&facialHairType=${happyParams.facialHair}&clothingType=blazerShirt,blazerSweater,collarSweater,graphicShirt&clothingColor=${happyParams.clothingColor}&eyeType=${happyParams.eyes}&mouthType=${happyParams.mouth}&eyebrowType=${happyParams.eyebrows}&skin=edb98a,ffdbac,f1c27d,f6c7b6`;
};

const getRandomUsername = () => {
  const adjectives = ["Happy", "Bright", "Swift", "Calm", "Brave", "Smart", "Cool", "Warm", "Joyful", "Sunny"];
  const nouns = ["Panda", "Fox", "Eagle", "Tiger", "Dolphin", "Wolf", "Bear", "Hawk", "Koala", "Lion"];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj}${noun}${Math.floor(Math.random() * 1000)}`;
};

export const useUserProfile = () => {
  const [profile, setProfile] = useLocalStorage<UserProfile | null>("user_profile", null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initProfile = () => {
      if (profile) {
        setProfile({
          ...profile,
          lastVisit: new Date().toISOString(),
        });
        setIsLoading(false);
        return;
      }

      const userId = generateUserId();
      const username = getRandomUsername();
      const newProfile: UserProfile = {
        id: userId,
        username: username,
        avatar: generateHappyAvatar(userId),
        theme: "dark",
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

    setTimeout(initProfile, 100);
  }, []);

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (profile) {
      setProfile({ ...profile, ...updates });
    }
  };

  const updateSettings = (updates: Partial<UserProfile['settings']>) => {
    if (profile) {
      setProfile({
        ...profile,
        settings: { ...profile.settings, ...updates },
      });
    }
  };

  const resetProfile = () => {
    setProfile(null);
    window.location.reload();
  };

  const regenerateAvatar = () => {
    if (profile) {
      const newSeed = Math.random().toString(36).substr(2, 9);
      updateProfile({ avatar: generateHappyAvatar(newSeed) });
    }
  };

  return {
    profile,
    isLoading,
    updateProfile,
    updateSettings,
    resetProfile,
    regenerateAvatar,
  };
};