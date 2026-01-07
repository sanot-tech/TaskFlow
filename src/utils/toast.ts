import { toast } from "sonner";

export const showSuccess = (message: string) => {
  toast.success(message, {
    className: "bg-green-500 text-white border-2 border-green-300 shadow-xl rounded-lg p-4 font-semibold",
    style: {
      background: "hsl(var(--primary))",
      color: "white",
      border: "2px solid hsl(var(--border))",
    },
  });
};

export const showError = (message: string) => {
  toast.error(message, {
    className: "bg-red-500 text-white border-2 border-red-300 shadow-xl rounded-lg p-4 font-semibold",
    style: {
      background: "hsl(var(--destructive))",
      color: "white",
      border: "2px solid hsl(var(--destructive))",
    },
  });
};

export const showLoading = (message: string) => {
  return toast.loading(message, {
    className: "bg-blue-500 text-white border-2 border-blue-300 shadow-xl rounded-lg p-4 font-semibold",
    style: {
      background: "hsl(var(--primary))",
      color: "white",
      border: "2px solid hsl(var(--border))",
    },
  });
};

export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};