import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const AVATAR_PARAMS = {
  backgroundColors: ["b6e3f4", "c0aede", "d1d4f9", "f0e68c", "ffd700", "ff69b4", "a8e6cf", "f0e68c", "ffd700", "ff69b4"],
  skinColors: ["edb98a", "ffdbac", "f1c27d", "f6c7b6", "edb98a", "ffdbac"],
  topTypes: ["shortHairShortFlat", "shortHairShortWaved", "shortHairShortCurly", "shortHairDreads01", "shortHairFrizzle", "shortHairShaggyMullet"],
  hairColors: ["2c1b18", "4a312c", "6b4f4f", "854d4e", "b5651d", "4a312c"],
  clothingTypes: ["blazerShirt", "blazerSweater", "collarSweater", "graphicShirt", "hoodie", "overall"],
  clothingColors: ["25557c", "ff69b4", "ffd700", "2c2c2c", "7f4e1e", "a8e6cf"],
  accessories: ["round", "prescription01", "sunglasses", "wayfarers"],
};

const generateRandomAvatar = () => {
  const seed = `avatar_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const backgroundColor = AVATAR_PARAMS.backgroundColors[Math.floor(Math.random() * AVATAR_PARAMS.backgroundColors.length)];
  const skinColor = AVATAR_PARAMS.skinColors[Math.floor(Math.random() * AVATAR_PARAMS.skinColors.length)];
  const topType = AVATAR_PARAMS.topTypes[Math.floor(Math.random() * AVATAR_PARAMS.topTypes.length)];
  const hairColor = AVATAR_PARAMS.hairColors[Math.floor(Math.random() * AVATAR_PARAMS.hairColors.length)];
  const clothingType = AVATAR_PARAMS.clothingTypes[Math.floor(Math.random() * AVATAR_PARAMS.clothingTypes.length)];
  const clothingColor = AVATAR_PARAMS.clothingColors[Math.floor(Math.random() * AVATAR_PARAMS.clothingColors.length)];
  const accessory = AVATAR_PARAMS.accessories[Math.floor(Math.random() * AVATAR_PARAMS.accessories.length)];

  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=${backgroundColor}&accessories=${accessory}&accessoriesProbability=100&skinColor=${skinColor}&topType=${topType}&hairColor=${hairColor}&facialHairType=blank&clothingType=${clothingType}&clothingColor=${clothingColor}&eyeType=happy&mouthType=smile&eyebrowType=raisedExcited&radius=50`;
};

export interface AvatarState {
  url: string;
  timestamp: number;
  version: number;
  error?: string;
}

interface AvatarContextValue {
  avatar: AvatarState;
  updateAvatar: (url: string) => void;
  regenerateAvatar: () => string;
  resetAvatar: () => void;
  isLoading: boolean;
  hasError: boolean;
}

const AvatarContext = createContext<AvatarContextValue | null>(null);

export const AvatarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [localAvatar, setLocalAvatar] = useLocalStorage<AvatarState>(
    'avatar-state',
    { url: '', timestamp: Date.now(), version: 1 }
  );

  const [avatar, setAvatar] = useState<AvatarState>(localAvatar);
  const [isLoading, setIsLoading] = useState(false);
  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setLocalAvatar(avatar);
  }, [avatar, setLocalAvatar]);

  const updateAvatar = useCallback((newUrl: string) => {
    setIsLoading(true);

    try {
      new URL(newUrl);
      setAvatar({
        url: newUrl,
        timestamp: Date.now(),
        version: avatar.version + 1,
        error: undefined,
      });
    } catch {
      setAvatar(prev => ({
        ...prev,
        error: 'Invalid avatar URL',
      }));
    } finally {
      setIsLoading(false);
    }
  }, [avatar.version]);

  const regenerateAvatar = useCallback(() => {
    const newUrl = generateRandomAvatar();
    updateAvatar(newUrl);
    return newUrl;
  }, [updateAvatar]);

  const resetAvatar = useCallback(() => {
    setAvatar({
      url: '',
      timestamp: Date.now(),
      version: avatar.version + 1,
      error: undefined,
    });
  }, [avatar.version]);

  return (
    <AvatarContext.Provider value={{
      avatar,
      updateAvatar,
      regenerateAvatar,
      resetAvatar,
      isLoading,
      hasError: !!avatar.error,
    }}>
      {children}
    </AvatarContext.Provider>
  );
};

export const useAvatar = () => {
  const ctx = useContext(AvatarContext);
  if (!ctx) throw new Error('useAvatar must be used within AvatarProvider');
  return ctx;
};
