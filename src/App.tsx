"use client";

import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import Guide from "./pages/Guide";
import NotFound from "./pages/NotFound";
import { motion } from "framer-motion";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useEffect } from "react";
import { AlarmProvider } from "@/contexts/AlarmContext";

// Initialize React Query client for data fetching and caching
const queryClient = new QueryClient();

// Component to initialize user profile on app load
const UserProfileInitializer = () => {
  const { profile, isLoading } = useUserProfile();

  useEffect(() => {
    if (!isLoading && profile) {
      console.log("User profile initialized:", profile);
    }
  }, [profile, isLoading]);

  return null;
};

// Animated routes component for smooth page transitions
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/guide" element={<Guide />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

// Main application component
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster position="top-right" duration={5000} />
      <AlarmProvider>
        <BrowserRouter>
          <UserProfileInitializer />
          <AnimatedRoutes />
        </BrowserRouter>
      </AlarmProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;