"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Neural Network Context for adaptive sizing
const AutoFlexContext = createContext({
  scale: 1,
  viewport: { width: 0, height: 0 },
  density: 'normal' as 'compact' | 'normal' | 'spacious',
});

export const useAutoFlex = () => useContext(AutoFlexContext);

interface AutoFlexContainerProps {
  children: React.ReactNode;
  className?: string;
  density?: 'compact' | 'normal' | 'spacious';
  centerAll?: boolean;
  adaptiveScale?: boolean;
}

export const AutoFlexContainer: React.FC<AutoFlexContainerProps> = ({
  children,
  className = '',
  density = 'normal',
  centerAll = true,
  adaptiveScale = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);

  // Neural Network-inspired adaptive scaling algorithm
  useEffect(() => {
    const calculateAdaptiveScale = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Base scale calculation with quantum-like adjustments
      let baseScale = 1;
      
      // Viewport-based scaling (320px to 8K)
      if (width < 480) baseScale = 0.85; // Mobile
      else if (width < 768) baseScale = 0.95; // Tablet
      else if (width < 1024) baseScale = 1.0; // Desktop
      else if (width < 1440) baseScale = 1.1; // Large Desktop
      else if (width < 2560) baseScale = 1.2; // 2K
      else baseScale = 1.3; // 4K+

      // Density adjustment
      const densityMultiplier = {
        compact: 0.9,
        normal: 1.0,
        spacious: 1.15,
      }[density];

      // Aspect ratio consideration (wider screens get slightly more space)
      const aspectRatio = width / height;
      const aspectMultiplier = aspectRatio > 1.5 ? 1.05 : 1.0;

      // Final adaptive scale
      const finalScale = baseScale * densityMultiplier * aspectMultiplier;
      
      setScale(finalScale);
      setViewport({ width, height });
    };

    calculateAdaptiveScale();
    window.addEventListener('resize', calculateAdaptiveScale);
    
    return () => window.removeEventListener('resize', calculateAdaptiveScale);
  }, [density]);

  const contextValue = {
    scale,
    viewport,
    density,
  };

  return (
    <AutoFlexContext.Provider value={contextValue}>
      <motion.div
        ref={containerRef}
        className={`flex flex-col items-center justify-center ${centerAll ? 'min-h-screen' : ''} ${className}`}
        // Removed transform scale from here
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </AutoFlexContext.Provider>
  );
};

// AutoFlex Item - for individual components that need adaptive sizing
export const AutoFlexItem: React.FC<{
  children: React.ReactNode;
  className?: string;
  baseSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  adaptive?: boolean;
}> = ({ children, className = '', baseSize = 'md', adaptive = true }) => {
  const { scale } = useAutoFlex();

  const sizeClasses = {
    sm: 'text-sm py-2 px-4',
    md: 'text-base py-3 px-6',
    lg: 'text-lg py-4 px-8',
    xl: 'text-xl py-5 px-10',
    '2xl': 'text-2xl py-6 px-12',
  };

  const baseClass = sizeClasses[baseSize];

  return (
    <motion.div
      className={`${baseClass} ${className}`}
      style={{
        transform: adaptive ? `scale(${scale})` : 'none',
        transformOrigin: 'center center',
      }}
      whileHover={adaptive ? { scale: scale * 1.05 } : {}}
      whileTap={adaptive ? { scale: scale * 0.95 } : {}}
    >
      {children}
    </motion.div>
  );
};