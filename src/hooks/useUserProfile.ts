import { useState, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { showSuccess } from "@/utils/toast";

interface UserProfile {
  id: string;
  username: string;
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
      showSuccess(`Welcome, ${username}! 🎉`);
      setIsLoading(false);
    };

    setTimeout(initProfile, 100);
  }, []);

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (profile) {
      const updatedProfile = { ...profile, ...updates };
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

  return {
    profile,
    isLoading,
    updateProfile,
    updateSettings,
    resetProfile,
  };
};