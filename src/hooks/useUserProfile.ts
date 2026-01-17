import { useState, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { showSuccess } from "@/utils/toast";
import { useAvatarSync } from "./useAvatarSync";

// UserProfile interface definition
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

// Generate unique user ID
const generateUserId = () => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Parameters for random avatar generation
const AVATAR_PARAMS = {
  backgroundColors: ["b6e3f4", "c0aede", "d1d4f9", "f0e68c", "ffd700", "ff69b4", "a8e6cf", "f0e68c", "ffd700", "ff69b4"],
  skinColors: ["edb98a", "ffdbac", "f1c27d", "f6c7b6", "edb98a", "ffdbac"],
  topTypes: ["shortHairShortFlat", "shortHairShortWaved", "shortHairShortCurly", "shortHairDreads01", "shortHairFrizzle", "shortHairShaggyMullet"],
  hairColors: ["2c1b18", "4a312c", "6b4f4f", "854d4e", "b5651d", "4a312c"],
  clothingTypes: ["blazerShirt", "blazerSweater", "collarSweater", "graphicShirt", "hoodie", "overall"],
  clothingColors: ["25557c", "ff69b4", "ffd700", "2c2c2c", "7f4e1e", "a8e6cf"],
  accessories: ["round", "prescription01", "sunglasses", "wayfarers"],
};

// Function for random avatar generation
const generateRandomAvatar = () => {
  const seed = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const backgroundColor = AVATAR_PARAMS.backgroundColors[Math.floor(Math.random() * AVATAR_PARAMS.backgroundColors.length)];
  const skinColor = AVATAR_PARAMS.skinColors[Math.floor(Math.random() * AVATAR_PARAMS.skinColors.length)];
  const topType = AVATAR_PARAMS.topTypes[Math.floor(Math.random() * AVATAR_PARAMS.topTypes.length)];
  const hairColor = AVATAR_PARAMS.hairColors[Math.floor(Math.random() * AVATAR_PARAMS.hairColors.length)];
  const clothingType = AVATAR_PARAMS.clothingTypes[Math.floor(Math.random() * AVATAR_PARAMS.clothingTypes.length)];
  const clothingColor = AVATAR_PARAMS.clothingColors[Math.floor(Math.random() * AVATAR_PARAMS.clothingColors.length)];
  const accessory = AVATAR_PARAMS.accessories[Math.floor(Math.random() * AVATAR_PARAMS.accessories.length)];

  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=${backgroundColor}&accessories=${accessory}&accessoriesProbability=100&skinColor=${skinColor}&topType=${topType}&hairColor=${hairColor}&facialHairType=blank&clothingType=${clothingType}&clothingColor=${clothingColor}&eyeType=happy&mouthType=smile&eyebrowType=raisedExcited&radius=50`;
};

// Get random username
const getRandomUsername = () => {
  const adjectives = ["Happy", "Bright", "Swift", "Calm", "Brave", "Smart", "Cool", "Warm", "Joyful", "Sunny"];
  const nouns = ["Panda", "Fox", "Eagle", "Tiger", "Dolphin", "Wolf", "Bear", "Hawk", "Koala", "Lion"];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj}${noun}${Math.floor(Math.random() * 1000)}`;
};

// useUserProfile Hook
export const useUserProfile = () => {
  const { updateAvatar } = useAvatarSync();
  const [profile, setProfile] = useLocalStorage<UserProfile | null>("user_profile", null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initProfile = () => {
      if (profile) {
        setProfile({
          ...profile,
          lastVisit: new Date().toISOString(),
        });
        // Синхронизируем аватар при инициализации
        updateAvatar(profile.avatar);
        setIsLoading(false);
        return;
      }

      const userId = generateUserId();
      const username = getRandomUsername();
      const randomAvatar = generateRandomAvatar();
      
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
      // Синхронизируем аватар при создании нового профиля
      updateAvatar(randomAvatar);
      showSuccess(`Welcome, ${username}! 🎉`);
      setIsLoading(false);
    };

    setTimeout(initProfile, 100);
  }, []);

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (profile) {
      const updatedProfile = { ...profile, ...updates };
      // Если обновляется аватар, синхронизируем его
      if (updates.avatar) {
        updateAvatar(updates.avatar);
      }
      setProfile(updatedProfile);
      return updatedProfile;
    }
  };

  const updateSettings = (updates: Partial<UserProfile['settings']>) => {
    if (profile) {
      const updatedProfile = {
        ...profile,
        settings: { ...profile.settings, ...updates },
      };
      setProfile(updatedProfile);
      return updatedProfile;
    }
  };

  const resetProfile = () => {
    setProfile(null);
    window.location.reload();
  };

  const regenerateAvatar = () => {
    if (profile) {
      const newAvatar = generateRandomAvatar();
      updateAvatar(newAvatar); // Синхронизируем аватар
      const updatedProfile = updateProfile({ avatar: newAvatar });
      return updatedProfile;
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