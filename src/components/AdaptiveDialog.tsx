"use client";

import React, { useEffect, useRef, useState } from "react";
import { DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface AdaptiveDialogProps {
  children: React.ReactNode;
  className?: string;
  baseWidth?: number;
}

export const AdaptiveDialog: React.FC<AdaptiveDialogProps> = ({ 
  children, 
  className = "",
  baseWidth = 360
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [dimensions, setDimensions] = useState({ width: baseWidth, height: 0 });

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      
      // Получаем viewport размеры
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Базовые расчеты для нейро-подгонки
      const optimalWidth = Math.min(baseWidth, viewportWidth * 0.9);
      const optimalHeight = Math.min(rect.height, viewportHeight * 0.85);
      
      // Нейросеть-подобная адаптация
      let calculatedScale = 1;
      
      // Адаптация по ширине
      if (viewportWidth < 480) {
        calculatedScale = 0.85; // Mobile
      } else if (viewportWidth < 768) {
        calculatedScale = 0.92; // Small tablet
      } else if (viewportWidth < 1024) {
        calculatedScale = 0.98; // Tablet
      } else if (viewportWidth < 1440) {
        calculatedScale = 1.05; // Desktop
      } else {
        calculatedScale = 1.12; // Large desktop
      }
      
      // Адаптация по высоте
      if (viewportHeight < 600) {
        calculatedScale *= 0.9;
      } else if (viewportHeight < 800) {
        calculatedScale *= 0.95;
      }
      
      // Золотое сечение для пропорций
      const goldenRatio = 1.618;
      const aspectRatio = optimalWidth / optimalHeight;
      
      // Корректировка на основе соотношения сторон
      if (aspectRatio > goldenRatio) {
        calculatedScale *= 1.05; // Широкий экран - увеличиваем
      } else if (aspectRatio < 1.2) {
        calculatedScale *= 0.95; // Высокий экран - уменьшаем
      }
      
      // Ограничения
      calculatedScale = Math.max(0.75, Math.min(calculatedScale, 1.5));
      
      setScale(calculatedScale);
      setDimensions({
        width: optimalWidth,
        height: optimalHeight
      });
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    
    // Наблюдатель для изменений в контенте
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateScale);
      observer.disconnect();
    };
  }, [baseWidth]);

  return (
    <div
      ref={containerRef}
      className="auto-responsive-container"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'center',
        width: '100%',
        maxWidth: `${dimensions.width}px`,
      }}
    >
      <DialogContent
        className={cn(
          "auto-flex-dialog",
          "rounded-2xl",
          "p-0",
          "overflow-hidden",
          "flex flex-col",
          "max-h-[90vh]",
          "backdrop-blur-2xl",
          "border-0",
          "shadow-2xl",
          className
        )}
        style={{
          width: '100%',
          maxWidth: `${dimensions.width}px`,
        }}
      >
        {/* Авто-адаптивный контейнер для всех дочерних элементов */}
        <div className="auto-responsive-content flex flex-col h-full">
          {children}
        </div>
      </DialogContent>
    </div>
  );
};