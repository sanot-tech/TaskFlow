"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, LogOut, User, Calendar, Clock, Smile } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface UserProfileCardProps {
  compact?: boolean;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ compact = false }) => {
  const { profile, isLoading, resetProfile, regenerateAvatar } = useUserProfile();

  if (isLoading) {
    return (
      <Card className="w-full max-w-md animate-pulse">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn("w-full max-w-md", compact && "max-w-xs")}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <User className="h-4 w-4" /> Профиль
            </CardTitle>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                size="sm"
                variant="ghost"
                onClick={resetProfile}
                className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                title="Сбросить профиль"
              >
                <LogOut className="h-3 w-3" />
              </Button>
            </motion.div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Avatar className="w-16 h-16 border-2 border-primary/30">
                <AvatarImage src={profile.avatar} alt={profile.username} />
                <AvatarFallback>{profile.username[0]}</AvatarFallback>
              </Avatar>
            </motion.div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">{profile.username}</h3>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-7 px-2 gap-1"
                    onClick={regenerateAvatar}
                  >
                    <Smile className="h-3 w-3" /> Новый
                  </Button>
                </motion.div>
              </div>
              
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Создан: {format(new Date(profile.createdAt), "dd.MM.yyyy", { locale: ru })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Последний визит: {format(new Date(profile.lastVisit), "dd.MM.yyyy HH:mm", { locale: ru })}</span>
                </div>
              </div>

              {/* Быстрые настройки */}
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  variant={profile.settings.notifications ? "default" : "secondary"}
                  onClick={() => updateSettings({ notifications: !profile.settings.notifications })}
                  className="text-xs h-7"
                >
                  {profile.settings.notifications ? "🔔 Вкл" : "🔕 Выкл"}
                </Button>
                <Button
                  size="sm"
                  variant={profile.settings.soundEnabled ? "default" : "secondary"}
                  onClick={() => updateSettings({ soundEnabled: !profile.settings.soundEnabled })}
                  className="text-xs h-7"
                >
                  {profile.settings.soundEnabled ? "🔊 Звук" : "🔇 Без звука"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};