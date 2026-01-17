"use client";

import * as React from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Toast variant types
export type ToastVariant = "success" | "error" | "warning" | "info" | "default";

// Toast props interface
export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  onClose: () => void;
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

// Toast variant styles
const getToastStyles = (variant: ToastVariant) => {
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

// Toast icon component
const ToastIcon = ({ variant, size }: { variant: ToastVariant; size: number }) => {
  const icons = {
    success: <CheckCircle size={size} />,
    error: <AlertCircle size={size} />,
    warning: <AlertTriangle size={size} />,
    info: <Info size={size} />,
    default: <Info size={size} />,
  };

  return icons[variant] || icons.default;
};

// Main Toast component
export const Toast: React.FC<ToastProps> = ({
  id,
  title,
  description,
  variant = "default",
  duration = 5000,
  onClose,
}) => {
  const { scale, iconSize, textSize, padding, gap, borderRadius } = useAutoResponsiveSizing();
  const styles = getToastStyles(variant);
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
          "fixed top-4 right-4 z-50",
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
          <ToastIcon variant={variant} size={iconSize} />
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

// Toast container component
export const ToastContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div 
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
      style={{ maxWidth: "calc(100vw - 2rem)" }}
    >
      {children}
    </div>
  );
};

// Toast hook interface
export interface ToastHook {
  toast: (options: {
    title?: string;
    description?: string;
    variant?: ToastVariant;
    duration?: number;
  }) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

// Toast hook implementation
export const useToast = (): ToastHook => {
  const [toasts, setToasts] = React.useState<Array<ToastProps>>([]);

  const toast = React.useCallback((options: {
    title?: string;
    description?: string;
    variant?: ToastVariant;
    duration?: number;
  }) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    setToasts((prev) => [
      ...prev,
      {
        id,
        title: options.title,
        description: options.description,
        variant: options.variant || "default",
        duration: options.duration || 5000,
        onClose: () => dismiss(id),
      },
    ]);

    return id;
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const dismissAll = React.useCallback(() => {
    setToasts([]);
  }, []);

  const ToastRenderer: React.FC = () => {
    return (
      <ToastContainer>
        {toasts.map((toastProps) => (
          <Toast key={toastProps.id} {...toastProps} />
        ))}
      </ToastContainer>
    );
  };

  return {
    toast,
    dismiss,
    dismissAll,
  };
};

// Utility functions for common toast types
export const showToast = (options: {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}) => {
  const event = new CustomEvent("show-toast", { detail: options });
  window.dispatchEvent(event);
};

export const hideToast = (id: string) => {
  const event = new CustomEvent("hide-toast", { detail: { id } });
  window.dispatchEvent(event);
};

export const hideAllToasts = () => {
  const event = new CustomEvent("hide-all-toasts");
  window.dispatchEvent(event);
};