"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserProfile } from "@/hooks/useUserProfile";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { useAvatarSync } from "@/hooks/useAvatarSync";

// ProfileBadge Component
export const ProfileBadge: React.FC = () => {
  const { avatar } = useAvatarSync();
  const { profile, isLoading } = useUserProfile();

  if (isLoading) {
    return (
      <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
    );
  }

  // Вместо return null, возвращаем пустой элемент, чтобы сохранить структуру
  if (!profile) {
    return <div className="w-16 h-16 opacity-0 pointer-events-none"></div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Avatar className="w-16 h-16 border-2 border-primary/30 cursor-pointer rounded-full overflow-hidden">
        <AvatarImage src={avatar.url || profile.avatar} alt={profile.username} className="rounded-full" />
        <AvatarFallback>
          <User className="h-6 w-6" />
        </AvatarFallback>
      </Avatar>
    </motion.div>
  );
};