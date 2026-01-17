"use client";

import * as React from "react";
import { useToast } from "./toast";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

// Toaster variant types
export type ToasterVariant = "success" | "error" | "warning" | "info" | "default";

// Toaster props interface
export interface ToasterProps {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
  duration?: number;
}

// Autoresponsive sizing hook
const useAutoResponsiveSizing = () => {
  const [viewport, setViewport] = React.useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1920,
    height: typeof window !== "undefined" ? window.innerHeight : 1080,
    scale: 1,
    iconSize: 20,
    textSize: 14,
    padding: 12,
    gap: 8,
    borderRadius: 12,
  });

  React.useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      let scale = 1;
      let iconSize = 20;
      let textSize = 14;
      let padding = 12;
      let gap = 8;
      let borderRadius = 12;

      if (width < 480) {
        // Mobile
        scale = 0.85;
        iconSize = 16;
        textSize = 12;
        padding = 8;
        gap = 6;
        borderRadius = 8;
      } else if (width < 768) {
        // Tablet
        scale = 0.95;
        iconSize = 18;
        textSize = 13;
        padding = 10;
        gap = 7;
        borderRadius = 10;
      } else if (width < 1024) {
        // Small Desktop
        scale = 1.05;
        iconSize = 20;
        textSize = 14;
        padding = 12;
        gap = 8;
        borderRadius = 12;
      } else if (width < 1440) {
        // Medium Desktop
        scale = 1.1;
        iconSize = 22;
        textSize = 15;
        padding = 14;
        gap = 9;
        borderRadius = 14;
      } else {
        // Large Desktop
        scale = 1.15;
        iconSize = 24;
        textSize = 16;
        padding = 16;
        gap = 10;
        borderRadius = 16;
      }

      setViewport({
        width,
        height,
        scale,
        iconSize,
        textSize,
        padding,
        gap,
        borderRadius,
      });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  return viewport;
};

// Toaster variant styles
const getToasterStyles = (variant: ToasterVariant) => {
  const styles = {
    success: {
      bg: "bg-gradient-to-br from-emerald-500/90 to-emerald-600/90",
      border: "border-emerald-400/30",
      icon: "text-emerald-100",
      title: "text-emerald-50",
      description: "text-emerald-100/80",
      shadow: "shadow-lg shadow-emerald-500/20",
    },
    error: {
      bg: "bg-gradient-to-br from-rose-500/90 to-rose-600/90",
      border: "border-rose-400/30",
      icon: "text-rose-100",
      title: "text-rose-50",
      description: "text-rose-100/80",
      shadow: "shadow-lg shadow-rose-500/20",
    },
    warning: {
      bg: "bg-gradient-to-br from-amber-500/90 to-amber-600/90",
      border: "border-amber-400/30",
      icon: "text-amber-100",
      title: "text-amber-50",
      description: "text-amber-100/80",
      shadow: "shadow-lg shadow-amber-500/20",
    },
    info: {
      bg: "bg-gradient-to-br from-blue-500/90 to-blue-600/90",
      border: "border-blue-400/30",
      icon: "text-blue-100",
      title: "text-blue-50",
      description: "text-blue-100/80",
      shadow: "shadow-lg shadow-blue-500/20",
    },
    default: {
      bg: "bg-gradient-to-br from-gray-700/90 to-gray-800/90",
      border: "border-gray-500/30",
      icon: "text-gray-100",
      title: "text-gray-50",
      description: "text-gray-100/80",
      shadow: "shadow-lg shadow-gray-500/20",
    },
  };

  return styles[variant];
};

// Toaster toast icon component
const ToasterToastIcon = ({ variant, size }: { variant: ToasterVariant; size: number }) => {
  const icons = {
    success: <CheckCircle size={size} />,
    error: <AlertCircle size={size} />,
    warning: <AlertTriangle size={size} />,
    info: <Info size={size} />,
    default: <Info size={size} />,
  };

  return icons[variant] || icons.default;
};

// Main Toaster toast component
export const ToasterToast: React.FC<{
  id: string;
  title?: string;
  description?: string;
  variant?: ToasterVariant;
  duration?: number;
  onClose: () => void;
}> = ({
  id,
  title,
  description,
  variant = "default",
  duration = 5000,
  onClose,
}) => {
  const { scale, iconSize, textSize, padding, gap, borderRadius } = useAutoResponsiveSizing();
  const styles = getToasterStyles(variant);
  const [isHovered, setIsHovered] = React.useState(false);

  // Auto-dismiss timer
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 100, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 100, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(
          "flex items-start gap-3 p-4 backdrop-blur-sm border-2",
          styles.bg,
          styles.border,
          styles.shadow,
          "rounded-xl",
          "max-w-md w-[90vw] sm:w-[400px] md:w-[450px] lg:w-[500px]",
          "flex-center-all"
        )}
        style={{
          transform: `scale(${scale})`,
          borderRadius: `${borderRadius}px`,
          padding: `${padding}px`,
          gap: `${gap}px`,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Icon */}
        <div 
          className={cn("flex-shrink-0 flex-center-all", styles.icon)}
          style={{ 
            width: `${iconSize * 1.5}px`, 
            height: `${iconSize * 1.5}px`,
            minWidth: `${iconSize * 1.5}px`,
          }}
        >
          <ToasterToastIcon variant={variant} size={iconSize} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex-center-all" style={{ gap: `${gap / 2}px` }}>
          {title && (
            <div 
              className={cn("font-bold flex-center-all", styles.title)}
              style={{ fontSize: `${textSize + 2}px` }}
            >
              {title}
            </div>
          )}
          {description && (
            <div 
              className={cn("text-sm flex-center-all", styles.description)}
              style={{ fontSize: `${textSize}px` }}
            >
              {description}
            </div>
          )}
        </div>

        {/* Close button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className={cn(
            "flex-shrink-0 rounded-full p-1 flex-center-all transition-all",
            "hover:bg-white/20",
            isHovered ? "opacity-100" : "opacity-60"
          )}
          style={{ 
            width: `${iconSize * 1.2}px`, 
            height: `${iconSize * 1.2}px`,
            minWidth: `${iconSize * 1.2}px`,
          }}
          aria-label="Close notification"
        >
          <X 
            className={cn("flex-center-all", styles.icon)}
            size={iconSize * 0.8} 
          />
        </motion.button>

        {/* Progress bar */}
        {duration > 0 && (
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: duration / 1000, ease: "linear" }}
            className={cn(
              "absolute bottom-0 left-0 h-1 rounded-b-xl",
              variant === "success" ? "bg-emerald-300" :
              variant === "error" ? "bg-rose-300" :
              variant === "warning" ? "bg-amber-300" :
              variant === "info" ? "bg-blue-300" :
              "bg-gray-300"
            )}
            style={{ borderRadius: `0 0 ${borderRadius}px ${borderRadius}px` }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

// Main Toaster component
export const Toaster: React.FC<ToasterProps> = ({ 
  position = "top-right",
  duration = 5000 
}) => {
  const [toasts, setToasts] = React.useState<Array<{
    id: string;
    title?: string;
    description?: string;
    variant?: ToasterVariant;
    duration?: number;
  }>>([]);

  // Listen for custom events
  React.useEffect(() => {
    const handleShowToast = (event: CustomEvent) => {
      const { title, description, variant, duration: toastDuration } = event.detail;
      const id = `toaster-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      setToasts((prev) => [
        ...prev,
        {
          id,
          title,
          description,
          variant: variant || "default",
          duration: toastDuration || duration,
        },
      ]);

      // Auto-dismiss
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, toastDuration || duration);
    };

    const handleHideToast = (event: CustomEvent) => {
      const { id } = event.detail;
      setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const handleHideAllToasts = () => {
      setToasts([]);
    };

    window.addEventListener("show-toast" as any, handleShowToast);
    window.addEventListener("hide-toast" as any, handleHideToast);
    window.addEventListener("hide-all-toasts" as any, handleHideAllToasts);

    return () => {
      window.removeEventListener("show-toast" as any, handleShowToast);
      window.removeEventListener("hide-toast" as any, handleHideToast);
      window.removeEventListener("hide-all-toasts" as any, handleHideAllToasts);
    };
  }, [duration]);

  // Position classes
  const positionClasses = {
    "top-right": "fixed top-4 right-4 z-50 flex flex-col gap-2",
    "top-left": "fixed top-4 left-4 z-50 flex flex-col gap-2",
    "bottom-right": "fixed bottom-4 right-4 z-50 flex flex-col gap-2",
    "bottom-left": "fixed bottom-4 left-4 z-50 flex flex-col gap-2",
    "top-center": "fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2",
    "bottom-center": "fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2",
  };

  return (
    <div className={cn(positionClasses[position], "pointer-events-none")}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToasterToast
            key={toast.id}
            id={toast.id}
            title={toast.title}
            description={toast.description}
            variant={toast.variant}
            duration={toast.duration}
            onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Utility functions for common toast types
export const showSuccess = (message: string, duration?: number) => {
  const event = new CustomEvent("show-toast", { 
    detail: { 
      title: "Success", 
      description: message, 
      variant: "success",
      duration: duration || 3000,
    } 
  });
  window.dispatchEvent(event);
};

export const showError = (message: string, duration?: number) => {
  const event = new CustomEvent("show-toast", { 
    detail: { 
      title: "Error", 
      description: message, 
      variant: "error",
      duration: duration || 5000,
    } 
  });
  window.dispatchEvent(event);
};

export const showWarning = (message: string, duration?: number) => {
  const event = new CustomEvent("show-toast", { 
    detail: { 
      title: "Warning", 
      description: message, 
      variant: "warning",
      duration: duration || 4000,
    } 
  });
  window.dispatchEvent(event);
};

export const showInfo = (message: string, duration?: number) => {
  const event = new CustomEvent("show-toast", { 
    detail: { 
      title: "Info", 
      description: message, 
      variant: "info",
      duration: duration || 3000,
    } 
  });
  window.dispatchEvent(event);
};

export const showToast = (message: string, duration?: number) => {
  const event = new CustomEvent("show-toast", { 
    detail: { 
      description: message, 
      variant: "default",
      duration: duration || 3000,
    } 
  });
  window.dispatchEvent(event);
};