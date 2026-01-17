import { useState, useEffect, useRef } from "react";
import { showError } from "@/utils/toast";

// AlarmTimer interface definition
interface AlarmTimer {
  taskId: string;
  taskTitle: string;
  duration: number;
  isActive: boolean;
  remainingTime: number;
}

// Local sounds from public/sounds folder
const ALARM_SOUNDS = [
  { id: 'bell', name: '🔔 Sunrise', url: '/sounds/bell.mp3' },
  { id: 'chime', name: '✨ Melody', url: '/sounds/chime.mp3' },
  { id: 'siren', name: '🚨 Siren', url: '/sounds/siren.mp3' },
  { id: 'beep', name: '🔊 Beep', url: '/sounds/beep.mp3' },
  { id: 'soft', name: '🎵 Soft', url: '/sounds/soft.mp3' },
];

// useAlarmTimer Hook
export const useAlarmTimer = () => {
  const [alarms, setAlarms] = useState<AlarmTimer[]>([]);
  const [isAlarmEnabled, setIsAlarmEnabled] = useState(false);
  const [selectedSound, setSelectedSound] = useState(ALARM_SOUNDS[0].id);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startTimer = (taskId: string, taskTitle: string, duration: number) => {
    // Check if alarm system is enabled
    if (!isAlarmEnabled) {
      showError("Please enable the alarm system first!");
      return false;
    }

    const existingAlarm = alarms.find(a => a.taskId === taskId);
    if (existingAlarm) {
      showError("Timer for this task is already running!");
      return false;
    }

    const newAlarm: AlarmTimer = {
      taskId,
      taskTitle,
      duration,
      isActive: true,
      remainingTime: duration * 60,
    };

    setAlarms(prev => [...prev, newAlarm]);
    return true;
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

  // Sound playback
  const playSound = () => {
    const sound = ALARM_SOUNDS.find(s => s.id === selectedSound);
    if (!sound) {
      console.error("Sound not found:", selectedSound);
      return;
    }

    console.log("Playing sound:", sound.name, sound.url);

    // Stop previous sound
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    try {
      audioRef.current = new Audio(sound.url);
      audioRef.current.loop = true;
      audioRef.current.volume = 1.0;
      
      // Try to play
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Audio play error:", error);
          showError("Could not play sound. Please try another one.");
        });
      }
    } catch (error) {
      console.error("Audio creation error:", error);
      showError("Audio error: " + error);
    }
  };

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  };

  // Alarm trigger
  const triggerAlarm = (alarm: AlarmTimer) => {
    // 1. Sound notification
    playSound();

    // 2. Browser notification (system)
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("⏰ Alarm triggered!", {
          body: `Task "${alarm.taskTitle}" requires attention!`,
          icon: "/favicon.ico",
          tag: alarm.taskId,
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            new Notification("⏰ Alarm triggered!", {
              body: `Task "${alarm.taskTitle}" requires attention!`,
              icon: "/favicon.ico",
            });
          }
        });
      }
    }

    // 3. Vibration (mobile devices)
    if ("vibrate" in navigator) {
      navigator.vibrate([200, 100, 200, 100, 400, 200, 200]);
    }

    // 4. Page title flashing
    let flashCount = 0;
    const originalTitle = document.title;
    const flashInterval = setInterval(() => {
      document.title = flashCount % 2 === 0 ? "⏰ TIME IS UP!" : originalTitle;
      flashCount++;
      if (flashCount > 15) {
        clearInterval(flashInterval);
        document.title = originalTitle;
      }
    }, 600);

    // 5. Popup alert - as last resort
    setTimeout(() => {
      alert(`⏰ TIME IS UP!\n\nTask: "${alarm.taskTitle}"\n\nClick OK to confirm.`);
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