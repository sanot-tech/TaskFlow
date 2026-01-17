import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  // ВАЖНО: Все хуки должны вызываться в одном и том же порядке при каждом рендере
  const [value, setValue] = useState<T>(() => {
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
  });

  // Сохраняем в localStorage при каждом изменении value
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [key, value]);

  return [value, setValue] as const;
}