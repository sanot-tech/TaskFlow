"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, Save, Trash2, Smile, Palette, Type, Shirt, Glasses, Sparkles, User, X, Plus, Check } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAlarmTimer } from "@/hooks/useAlarmTimer";
import { cn } from "@/lib/utils";
import { AvatarConstructor } from "./AvatarConstructor";

// Wrapper component to handle the conditional rendering properly
const ProfileSettingsContent: React.FC<{
  profile: any,
  updateProfile: any,
  updateSettings: any,
  resetProfile: any,
  regenerateAvatar: any
}> = ({ profile, updateProfile, updateSettings, resetProfile, regenerateAvatar }) => {
  const { ALARM_SOUNDS, selectedSound, setSelectedSound } = useAlarmTimer();
  const [isOpen, setIsOpen] = useState(false);
  const [tempUsername, setTempUsername] = useState(profile?.username || "");
  const [showConstructor, setShowConstructor] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleSave = () => {
    if (tempUsername.trim()) {
      updateProfile({ username: tempUsername.trim() });
    }
    setIsOpen(false);
  };

  // Debounced avatar regeneration to prevent rapid clicks
  const handleRegenerateAvatar = useCallback(() => {
    if (isRegenerating) return;
    
    setIsRegenerating(true);
    regenerateAvatar();
    
    // Reset regeneration state after a short delay
    setTimeout(() => {
      setIsRegenerating(false);
    }, 500);
  }, [regenerateAvatar, isRegenerating]);

  const handleApplyAvatar = (avatarUrl: string) => {
    updateProfile({ avatar: avatarUrl });
    setShowConstructor(false);
  };

  const handleReset = () => {
    if (confirm("Вы уверены? Это удалит все данные профиля!")) {
      resetProfile();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" /> Профиль
          </Button>
        </motion.div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] rounded-2xl p-0 overflow-hidden flex flex-col max-h-[90vh] bg-gradient-to-br from-purple-900/90 via-pink-900/90 to-blue-900/90 backdrop-blur-2xl border-0 shadow-2xl">
        {/* PREMIUM HEADER - Glassmorphic Gradient */}
        <div className="relative bg-gradient-to-r from-purple-600/90 via-pink-600/90 to-blue-600/90 p-6 text-white flex-shrink-0 backdrop-blur-xl border-b border-white/10">
          {/* Decorative glow */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-50 pointer-events-none"></div>
          
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Settings className="h-6 w-6 text-white/90" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-100">
                Профиль
              </span>
            </DialogTitle>
            <DialogDescription className="text-purple-100/80 opacity-90">
              Управляйте своим профилем и предпочтениями
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* PREMIUM SCROLLABLE CONTENT - Glass Card */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none"
               style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)' }}>
          </div>
          
          <div className="relative p-6 space-y-5">
            {/* Секция 1: Аватар и имя - PREMIUM FLEX LAYOUT */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 sm:p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
              {/* Аватар - Perfect Center */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex-shrink-0"
              >
                <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-3 border-white/30 rounded-full overflow-hidden shadow-2xl ring-4 ring-purple-500/20">
                  <AvatarImage src={profile.avatar} alt={profile.username} className="rounded-full" />
                  <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white font-bold text-xl">
                    {profile.username[0]}
                  </AvatarFallback>
                </Avatar>
                {/* Быстрые кнопки действий */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute -bottom-2 -right-2"
                >
                  <Button
                    size="icon"
                    className={cn(
                      "w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-lg border-2 border-white/30 transition-all duration-200",
                      isRegenerating && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={handleRegenerateAvatar}
                    disabled={isRegenerating}
                    title="Случайная аватарка"
                  >
                    <Sparkles className={cn("h-4 w-4", isRegenerating && "animate-spin")} />
                  </Button>
                </motion.div>
              </motion.div>

              {/* Имя и конструктор - Flex Column */}
              <div className="flex-1 space-y-3 min-w-0 w-full">
                <div className="space-y-1">
                  <Label className="text-sm font-bold text-purple-200 flex items-center gap-2">
                    <User className="h-3 w-3" /> Имя пользователя
                  </Label>
                  <Input
                    placeholder={profile.username}
                    value={tempUsername || profile.username}
                    onChange={(e) => setTempUsername(e.target.value)}
                    className="border-2 border-white/20 bg-white/10 text-white placeholder:text-purple-200/60 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 h-11"
                  />
                </div>
                
                <div className="flex gap-2">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                    <Button
                      onClick={() => setShowConstructor(!showConstructor)}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-2 border-white/20 shadow-lg h-10"
                    >
                      <Palette className="h-4 w-4 mr-2" /> Конструктор
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      size="icon"
                      variant="outline"
                      className="w-10 h-10 border-2 border-white/20 bg-white/10 text-white hover:bg-white/20"
                      onClick={() => setTempUsername("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Конструктор (анимированный) */}
            <AnimatePresence>
              {showConstructor && (
                <motion.div
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: "auto", scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                  className="overflow-hidden"
                >
                  <AvatarConstructor
                    currentAvatar={profile.avatar}
                    onApply={handleApplyAvatar}
                    onClose={() => setShowConstructor(false)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Секция 2: Уведомления - PREMIUM CARD */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg overflow-hidden">
              <div className="p-4 border-b border-white/10 bg-gradient-to-r from-amber-500/20 to-yellow-500/20">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-300" /> Уведомления
                </h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl border border-white/10 hover:bg-white/15 transition-colors">
                  <Label className="font-medium text-white/90">Браузерные уведомления</Label>
                  <Switch
                    checked={profile.settings.notifications}
                    onCheckedChange={(checked) => updateSettings({ notifications: checked })}
                    className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-400"
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl border border-white/10 hover:bg-white/15 transition-colors">
                  <Label className="font-medium text-white/90">Звук будильника</Label>
                  <Switch
                    checked={profile.settings.soundEnabled}
                    onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
                    className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Секция 4: Опасная зона - PREMIUM WARNING */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-red-500/30 shadow-lg overflow-hidden">
              <div className="p-4 border-b border-red-500/20 bg-gradient-to-r from-red-500/20 to-rose-500/20">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Trash2 className="h-5 w-5 text-red-300" /> Опасная зона
                </h3>
              </div>
              <div className="p-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full"
                >
                  <Button
                    variant="destructive"
                    className="w-full h-12 text-lg font-bold bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 border-2 border-red-400/30 shadow-lg"
                    onClick={handleReset}
                  >
                    <Trash2 className="h-5 w-5 mr-2" /> Сбросить профиль
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* PREMIUM FOOTER - Glassmorphic Actions */}
        <div className="p-6 bg-white/10 backdrop-blur-md border-t border-white/10 flex-shrink-0">
          <div className="flex gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
              <Button onClick={handleSave} className="w-full h-12 text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-2 border-white/20 shadow-lg">
                <Save className="h-5 w-5 mr-2" /> Сохранить
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
              <Button onClick={() => setIsOpen(false)} variant="outline" className="w-full h-12 text-lg font-bold border-2 border-white/20 bg-white/10 text-white hover:bg-white/20">
                Отмена
              </Button>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const ProfileSettings: React.FC = () => {
  const { profile, updateProfile, updateSettings, resetProfile, regenerateAvatar } = useUserProfile();

  // Render an empty button when profile is not loaded to maintain consistent hook calls
  if (!profile) {
    return <Button variant="outline" className="gap-2 opacity-0 pointer-events-none">
      <Settings className="h-4 w-4" /> Профиль
    </Button>;
  }

  return <ProfileSettingsContent
    profile={profile}
    updateProfile={updateProfile}
    updateSettings={updateSettings}
    resetProfile={resetProfile}
    regenerateAvatar={regenerateAvatar}
  />;
};