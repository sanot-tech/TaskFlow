import { useState, useEffect, useRef } from "react";
import { showError } from "@/utils/toast";

interface AlarmTimer {
  taskId: string;
  taskTitle: string;
  duration: number;
  isActive: boolean;
  remainingTime: number;
}

// Прямые URL с Mixkit (безопасные и работающие)
const ALARM_SOUNDS = [
  { id: 'bell', name: '🔔 Восход', url: 'https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3' },
  { id: 'chime', name: '✨ Мелодия', url: 'https://assets.mixkit.co/sfx/preview/mixkit-bell-notification-933.mp3' },
  { id: 'siren', name: '🚨 Сирена', url: 'https://assets.mixkit.co/sfx/preview/mixkit-siren-alert-986.mp3' },
  { id: 'beep', name: '🔊 Бип', url: 'https://assets.mixkit.co/sfx/preview/mixkit-classic-alarm-995.mp3' },
  { id: 'soft', name: '🎵 Нежный', url: 'https://assets.mixkit.co/sfx/preview/mixkit-positive-notification-951.mp3' },
];

export const useAlarmTimer = () => {
  const [alarms, setAlarms] = useState<AlarmTimer[]>([]);
  const [isAlarmEnabled, setIsAlarmEnabled] = useState(false);
  const [selectedSound, setSelectedSound] = useState(ALARM_SOUNDS[0].id);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startTimer = (taskId: string, taskTitle: string, duration: number) => {
    if (!isAlarmEnabled) {
      showError("Сначала включите систему будильников!");
      return;
    }

    const existingAlarm = alarms.find(a => a.taskId === taskId);
    if (existingAlarm) {
      showError("Таймер для этой задачи уже запущен!");
      return;
    }

    const newAlarm: AlarmTimer = {
      taskId,
      taskTitle,
      duration,
      isActive: true,
      remainingTime: duration * 60,
    };

    setAlarms(prev => [...prev, newAlarm]);
  };

  const stopTimer = (taskId: string) => {
    setAlarms(prev => prev.filter(a => a.taskId !== taskId));
    stopSound();
  };

  const toggleAlarmSystem = () => {
    setIsAlarmEnabled(prev => {
      const newState = !prev;
      if (!newState) {
        setAlarms([]);
        stopSound();
      }
      return newState;
    });
  };

  // Проигрывание звука
  const playSound = () => {
    const sound = ALARM_SOUNDS.find(s => s.id === selectedSound);
    if (!sound) {
      console.error("Sound not found:", selectedSound);
      return;
    }

    console.log("Playing sound:", sound.name, sound.url);

    // Останавливаем предыдущий звук
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    try {
      audioRef.current = new Audio(sound.url);
      audioRef.current.loop = true;
      audioRef.current.volume = 1.0;
      
      // Пробуем проиграть
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Audio play error:", error);
          showError("Не удалось проиграть звук. Попробуйте другой.");
        });
      }
    } catch (error) {
      console.error("Audio creation error:", error);
      showError("Ошибка аудио: " + error);
    }
  };

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  };

  // Триггер будильника
  const triggerAlarm = (alarm: AlarmTimer) => {
    // 1. Звуковое уведомление
    playSound();

    // 2. Браузерное уведомление (системное)
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("⏰ Будильник сработал!", {
          body: `Задача "${alarm.taskTitle}" требует внимания!`,
          icon: "/favicon.ico",
          tag: alarm.taskId,
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            new Notification("⏰ Будильник сработал!", {
              body: `Задача "${alarm.taskTitle}" требует внимания!`,
              icon: "/favicon.ico",
            });
          }
        });
      }
    }

    // 3. Вибрация (мобильные устройства)
    if ("vibrate" in navigator) {
      navigator.vibrate([200, 100, 200, 100, 400, 200, 200]);
    }

    // 4. Мигание заголовком страницы
    let flashCount = 0;
    const originalTitle = document.title;
    const flashInterval = setInterval(() => {
      document.title = flashCount % 2 === 0 ? "⏰ ВРЕМЯ ВЫШЛО!" : originalTitle;
      flashCount++;
      if (flashCount > 15) {
        clearInterval(flashInterval);
        document.title = originalTitle;
      }
    }, 600);

    // 5. Всплывающее окно (alert) — как последний резервный вариант
    setTimeout(() => {
      alert(`⏰ ВРЕМЯ ВЫШЛО!\n\nЗадача: "${alarm.taskTitle}"\n\nНажмите OK для подтверждения.`);
    }, 500);
  };

  useEffect(() => {
    if (!isAlarmEnabled || alarms.length === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setAlarms(prev => {
          const updatedAlarms = prev.map(alarm => {
            if (alarm.remainingTime <= 1) {
              triggerAlarm(alarm);
              return { ...alarm, isActive: false, remainingTime: 0 };
            }
            return { ...alarm, remainingTime: alarm.remainingTime - 1 };
          });
          return updatedAlarms.filter(a => a.isActive || a.remainingTime === 0);
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAlarmEnabled, alarms.length, selectedSound]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimeForTask = (taskId: string) => {
    const alarm = alarms.find(a => a.taskId === taskId);
    return alarm ? formatTime(alarm.remainingTime) : null;
  };

  const isTimerActive = (taskId: string) => {
    return alarms.some(a => a.taskId === taskId);
  };

  return {
    alarms,
    isAlarmEnabled,
    selectedSound,
    ALARM_SOUNDS,
    startTimer,
    stopTimer,
    toggleAlarmSystem,
    setSelectedSound,
    formatTime,
    getTimeForTask,
    isTimerActive,
  };
};