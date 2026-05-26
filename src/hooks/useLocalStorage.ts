import { useState, useEffect } from "react";

// useLocalStorage Hook
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get saved value from localStorage or use initialValue
  const getSavedValue = () => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
      return initialValue;
    } catch (error) {
      console.error("Error loading from localStorage:", error);
      return initialValue;
    }
  };

  const [value, setValue] = useState<T>(getSavedValue);

  // Persist to localStorage on every value change
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [key, value]);

  return [value, setValue] as const;
}