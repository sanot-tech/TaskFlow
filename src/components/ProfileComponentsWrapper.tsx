
import React from "react";
import { ProfileBadge } from "@/components/ProfileBadge";
import { ProfileSettings } from "@/components/ProfileSettings";
import { motion } from "framer-motion";

// ProfileComponentsWrapper component props interface
interface ProfileComponentsWrapperProps {
  profile: any;
  isLoading: boolean;
}

// ProfileComponentsWrapper Component
export const ProfileComponentsWrapper: React.FC<ProfileComponentsWrapperProps> = ({ 
  profile, 
  isLoading 
}) => {
  if (isLoading || !profile) {
    // Return empty container with same dimensions to preserve DOM structure
    return (
      <div className="flex items-center gap-3 opacity-0 pointer-events-none h-16">
        <div className="w-16 h-16" />
        <div className="w-24 h-10" />
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="flex items-center gap-3"
    >
      <ProfileBadge />
      <ProfileSettings />
    </motion.div>
  );
};