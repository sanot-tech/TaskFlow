import { useAlarmContext } from "@/contexts/AlarmContext";

// useAlarmTimer Hook - Now uses context
export const useAlarmTimer = () => {
  return useAlarmContext();
};