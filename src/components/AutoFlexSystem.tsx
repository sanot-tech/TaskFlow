"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { AutoFlexContainer, AutoFlexItem, useAutoFlex } from './AutoFlexContainer';
import { AutoResponsiveButton } from './AutoResponsiveButton';

// Premium AutoFlex Card Component
export const AutoFlexCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'glass' | 'neon';
}> = ({ children, className = '', variant = 'primary' }) => {
  const { scale } = useAutoFlex();

  const variantStyles = {
    primary: 'bg-gray-800/90 border border-gray-700 shadow-xl shadow-black/25',
    secondary: 'bg-gray-900/95 border border-gray-600 shadow-lg shadow-black/20',
    glass: 'bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/30',
    neon: 'bg-gray-900/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)]',
  };

  return (
    <AutoFlexItem adaptive baseSize="md">
      <motion.div
        className={`rounded-2xl p-6 ${variantStyles[variant]} ${className}`}
        style={{ transform: `scale(${scale})` }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: scale * 1.02 }}
      >
        {children}
      </motion.div>
    </AutoFlexItem>
  );
};

// Premium AutoFlex Input Component
export const AutoFlexInput: React.FC<{
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  type?: string;
}> = ({ placeholder, value, onChange, className = '', type = 'text' }) => {
  const { scale } = useAutoFlex();

  return (
    <AutoFlexItem adaptive baseSize="md">
      <motion.input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full bg-gray-800/80 border-2 border-gray-700 rounded-lg text-gray-200 placeholder:text-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all ${className}`}
        style={{ transform: `scale(${scale})` }}
        whileFocus={{ scale: scale * 1.02 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    </AutoFlexItem>
  );
};

// Premium AutoFlex Badge Component
export const AutoFlexBadge: React.FC<{
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}> = ({ children, variant = 'default', className = '' }) => {
  const { scale } = useAutoFlex();

  const variantStyles = {
    default: 'bg-gray-700 text-gray-200 border-gray-600',
    success: 'bg-green-900/50 text-green-300 border-green-700',
    warning: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
    error: 'bg-red-900/50 text-red-300 border-red-700',
    info: 'bg-blue-900/50 text-blue-300 border-blue-700',
  };

  return (
    <AutoFlexItem adaptive baseSize="sm">
      <motion.span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantStyles[variant]} ${className}`}
        style={{ transform: `scale(${scale})` }}
        whileHover={{ scale: scale * 1.05 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
    </AutoFlexItem>
  );
};

// Export all components
export { AutoFlexContainer, AutoFlexItem, AutoResponsiveButton, useAutoFlex };