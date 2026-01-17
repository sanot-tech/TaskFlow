"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useAutoFlex, AutoFlexItem } from './AutoFlexContainer';
import { cn } from '@/lib/utils';

interface AutoResponsiveButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'auto';
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  adaptive?: boolean;
  glow?: boolean;
}

export const AutoResponsiveButton: React.FC<AutoResponsiveButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'auto',
  className = '',
  icon,
  iconPosition = 'left',
  disabled = false,
  adaptive = true,
  glow = false,
}) => {
  const { scale, density } = useAutoFlex();

  // Neural Network-inspired adaptive sizing
  const getAdaptiveSize = () => {
    const baseSizes = {
      sm: { py: 2, px: 4, text: 'text-sm' },
      md: { py: 3, px: 6, text: 'text-base' },
      lg: { py: 4, px: 8, text: 'text-lg' },
      xl: { py: 5, px: 10, text: 'text-xl' },
      auto: { py: 3, px: 6, text: 'text-base' },
    };

    const base = baseSizes[size];
    
    // Apply density adjustments
    const densityMultiplier = {
      compact: 0.85,
      normal: 1.0,
      spacious: 1.15,
    }[density];

    // Apply viewport scaling
    const scaleMultiplier = scale;

    return {
      py: base.py * densityMultiplier * scaleMultiplier,
      px: base.px * densityMultiplier * scaleMultiplier,
      text: base.text,
    };
  };

  const adaptiveSize = getAdaptiveSize();

  // Premium variant styles with quantum-like depth
  const variantStyles = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25',
    secondary: 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-gray-200 shadow-lg shadow-gray-500/25',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-500/25',
    ghost: 'bg-transparent border-2 border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white',
    gradient: 'bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 hover:from-purple-700 hover:via-pink-600 hover:to-orange-600 text-white shadow-lg shadow-purple-500/25',
  };

  const glowEffect = glow ? 'ring-2 ring-white/20 ring-offset-2 ring-offset-gray-900' : '';

  return (
    <AutoFlexItem adaptive={adaptive} baseSize="md">
      <motion.button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          'relative overflow-hidden rounded-lg font-semibold transition-all duration-200',
          'flex items-center justify-center gap-2',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900',
          variantStyles[variant],
          glowEffect,
          className
        )}
        style={{
          padding: `${adaptiveSize.py}px ${adaptiveSize.px}px`,
          fontSize: adaptiveSize.text === 'text-sm' ? '0.875rem' : 
                   adaptiveSize.text === 'text-base' ? '1rem' :
                   adaptiveSize.text === 'text-lg' ? '1.125rem' :
                   adaptiveSize.text === 'text-xl' ? '1.25rem' : '1rem',
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {icon && iconPosition === 'left' && (
          <span className="flex items-center justify-center" style={{ transform: `scale(${scale})` }}>
            {icon}
          </span>
        )}
        <span className="flex-1 text-center">{children}</span>
        {icon && iconPosition === 'right' && (
          <span className="flex items-center justify-center" style={{ transform: `scale(${scale})` }}>
            {icon}
          </span>
        )}
        
        {/* Premium hover glow effect */}
        <motion.div
          className="absolute inset-0 bg-white/5 opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      </motion.button>
    </AutoFlexItem>
  );
};