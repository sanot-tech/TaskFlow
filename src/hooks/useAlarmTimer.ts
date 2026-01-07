import { useState, useEffect, useRef } from "react";
import { showSuccess, showError } from "@/utils/toast";

interface AlarmTimer {
  taskId: string;
  taskTitle: string;
  duration: number;
  isActive: boolean;
  remainingTime: number;
}

export const useAlarmTimer = () => {
  const [alarms, setAlarms] = useState<AlarmTimer[]>([]);
  const [isAlarmEnabled, setIsAlarmEnabled] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
    showSuccess(`Таймер запущен: ${taskTitle} (${duration} мин)`);
  };

  const stopTimer = (taskId: string) => {
    setAlarms(prev => prev.filter(a => a.taskId !== taskId));
    showSuccess("Таймер остановлен");
  };

  const toggleAlarmSystem = () => {
    setIsAlarmEnabled(prev => {
      const newState = !prev;
      if (newState) {
        showSuccess("Система будильников ВКЛЮЧЕНА");
      } else {
        setAlarms([]);
        showSuccess("Система будильников ВЫКЛЮЧЕНА");
      }
      return newState;
    });
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
  }, [isAlarmEnabled, alarms.length]);

  const triggerAlarm = (alarm: AlarmTimer) => {
    showSuccess(`⏰ ВРЕМЯ ВЫШЛО! Задача: "${alarm.taskTitle}"`);

    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("⏰ Будильник сработал!", {
          body: `Задача "${alarm.taskTitle}" требует внимания!`,
          icon: "/favicon.ico",
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

    if ("vibrate" in navigator) {
      navigator.vibrate([200, 100, 200, 100, 400]);
    }

    let flashCount = 0;
    const originalTitle = document.title;
    const flashInterval = setInterval(() => {
      document.title = flashCount % 2 === 0 ? "⏰ ВРЕМЯ ВЫШЛО!" : originalTitle;
      flashCount++;
      if (flashCount > 10) {
        clearInterval(flashInterval);
        document.title = originalTitle;
      }
    }, 500);
  };

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
    startTimer,
    stopTimer,
    toggleAlarmSystem,
    formatTime,
    getTimeForTask,
    isTimerActive,
  };
};