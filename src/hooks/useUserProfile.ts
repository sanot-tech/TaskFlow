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

// НОВАЯ: Используем готовую библиотеку с красивыми аватарками
// Все аватарки гарантированно радостные и стильные
const HAPPY_AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4&accessories=round&accessoriesProbability=100&skinColor=edb98a&topType=shortHairShortFlat&hairColor=2c1b18&facialHairType=blank&clothingType=blazerShirt&clothingColor=25557c&eyeType=happy&mouthType=smile&eyebrowType=raisedExcited",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna&backgroundColor=c0aede&accessories=round&accessoriesProbability=100&skinColor=ffdbac&topType=shortHairShortWaved&hairColor=4a312c&facialHairType=blank&clothingType=blazerSweater&clothingColor=ff69b4&eyeType=close&mouthType=laughing&eyebrowType=natural",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Max&backgroundColor=d1d4f9&accessories=round&accessoriesProbability=100&skinColor=f1c27d&topType=shortHairShortCurly&hairColor=6b4f4f&facialHairType=blank&clothingType=collarSweater&clothingColor=ffd700&eyeType=happy&mouthType=smile&eyebrowType=raisedExcited",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Bella&backgroundColor=f0e68c&accessories=round&accessoriesProbability=100&skinColor=f6c7b6&topType=shortHairDreads01&hairColor=854d4e&facialHairType=blank&clothingType=graphicShirt&clothingColor=a8e6cf&eyeType=happy&mouthType=laughing&eyebrowType=raisedExcited",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie&backgroundColor=ffd700&accessories=round&accessoriesProbability=100&skinColor=edb98a&topType=shortHairShortFlat&hairColor=b5651d&facialHairType=blank&clothingType=blazerShirt&clothingColor=2c2c2c&eyeType=close&mouthType=smile&eyebrowType=natural",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Daisy&backgroundColor=ff69b4&accessories=round&accessoriesProbability=100&skinColor=ffdbac&topType=shortHairShortWaved&hairColor=2c1b18&facialHairType=blank&clothingType=blazerSweater&clothingColor=7f4e1e&eyeType=happy&mouthType=laughing&eyebrowType=raisedExcited",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Rocky&backgroundColor=a8e6cf&accessories=round&accessoriesProbability=100&skinColor=f1c27d&topType=shortHairShortCurly&hairColor=4a312c&facialHairType=blank&clothingType=collarSweater&clothingColor=25557c&eyeType=happy&mouthType=smile&eyebrowType=raisedExcited",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe&backgroundColor=b6e3f4&accessories=round&accessoriesProbability=100&skinColor=f6c7b6&topType=shortHairDreads01&hairColor=6b4f4f&facialHairType=blank&clothingType=graphicShirt&clothingColor=ff69b4&eyeType=close&mouthType=laughing&eyebrowType=natural",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Oscar&backgroundColor=c0aede&accessories=round&accessoriesProbability=100&skinColor=edb98a&topType=shortHairShortFlat&hairColor=854d4e&facialHairType=blank&clothingType=blazerShirt&clothingColor=ffd700&eyeType=happy&mouthType=smile&eyebrowType=raisedExcited",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Milo&backgroundColor=d1d4f9&accessories=round&accessoriesProbability=100&skinColor=ffdbac&topType=shortHairShortWaved&hairColor=b5651d&facialHairType=blank&clothingType=blazerSweater&clothingColor=2c2c2c&eyeType=happy&mouthType=laughing&eyebrowType=raisedExcited",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Ruby&backgroundColor=f0e68c&accessories=round&accessoriesProbability=100&skinColor=f1c27d&topType=shortHairShortCurly&hairColor=2c1b18&facialHairType=blank&clothingType=collarSweater&clothingColor=7f4e1e&eyeType=close&mouthType=smile&eyebrowType=natural",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper&backgroundColor=ffd700&accessories=round&accessoriesProbability=100&skinColor=f6c7b6&topType=shortHairDreads01&hairColor=4a312c&facialHairType=blank&clothingType=graphicShirt&clothingColor=a8e6cf&eyeType=happy&mouthType=laughing&eyebrowType=raisedExcited",
];

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
      // Выбираем случайную готовую радостную аватарку
      const randomAvatar = HAPPY_AVATARS[Math.floor(Math.random() * HAPPY_AVATARS.length)];
      
      const newProfile: UserProfile = {
        id: userId,
        username: username,
        avatar: randomAvatar,
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
      // Выбираем другую случайную аватарку из готового списка
      const newAvatar = HAPPY_AVATARS[Math.floor(Math.random() * HAPPY_AVATARS.length)];
      updateProfile({ avatar: newAvatar });
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