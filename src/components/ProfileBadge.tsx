"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserProfile } from "@/hooks/useUserProfile";
import { motion } from "framer-motion";
import { User } from "lucide-react";

export const ProfileBadge: React.FC = () => {
  const { profile, isLoading } = useUserProfile();

  if (isLoading) {
    return (
      <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
    );
  }

  if (!profile) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Avatar className="w-10 h-10 border-2 border-primary/30 cursor-pointer">
        <AvatarImage src={profile.avatar} alt={profile.username} />
        <AvatarFallback>
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
    </motion.div>
  );
};