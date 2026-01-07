"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, Save, RefreshCw, User, Trash2, Smile } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAlarmTimer } from "@/hooks/useAlarmTimer";
import { cn } from "@/lib/utils";

export const ProfileSettings: React.FC = () => {
  const { profile, updateProfile, updateSettings, resetProfile, regenerateAvatar } = useUserProfile();
  const { ALARM_SOUNDS, selectedSound, setSelectedSound } = useAlarmTimer();
  const [isOpen, setIsOpen] = useState(false);
  const [tempUsername, setTempUsername] = useState("");

  if (!profile) return null;

  const handleSave = () => {
    if (tempUsername.trim()) {
      updateProfile({ username: tempUsername.trim() });
    }
    setIsOpen(false);
  };

  const handleRegenerateAvatar = () => {
    regenerateAvatar();
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

      <DialogContent className="sm:max-w-[500px] rounded-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Settings className="h-5 w-5 text-primary" /> Настройки профиля
          </DialogTitle>
          <DialogDescription>
            Управляйте своим профилем и предпочтениями
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Аватар и имя */}
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Avatar className="w-16 h-16 border-2 border-primary/30">
                <AvatarImage src={profile.avatar} alt={profile.username} />
                <AvatarFallback>{profile.username[0]}</AvatarFallback>
              </Avatar>
            </motion.div>
            
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Имя пользователя"
                  value={tempUsername || profile.username}
                  onChange={(e) => setTempUsername(e.target.value)}
                  className="flex-1"
                />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    onClick={handleRegenerateAvatar} 
                    title="Новая радостная аватарка"
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Настройки уведомлений */}
          <Card className="border-0 bg-gray-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold">Уведомления</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Браузерные уведомления</Label>
                <Switch
                  checked={profile.settings.notifications}
                  onCheckedChange={(checked) => updateSettings({ notifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Звук будильника</Label>
                <Switch
                  checked={profile.settings.soundEnabled}
                  onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Выбор звука */}
          <Card className="border-0 bg-gray-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold">Звук будильника</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {ALARM_SOUNDS.map((sound) => (
                  <motion.div
                    key={sound.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => {
                        setSelectedSound(sound.id);
                        updateSettings({ selectedSound: sound.id });
                      }}
                      className={cn(
                        "w-full h-10 p-0 rounded-lg border-2 transition-all",
                        selectedSound === sound.id
                          ? "border-primary bg-primary/10 shadow-md"
                          : "border-gray-200 bg-white hover:border-primary/50"
                      )}
                      title={sound.name}
                    >
                      <span className="text-lg">{sound.name.split(' ')[0]}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Опасная зона */}
          <Card className="border-0 bg-red-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-red-700">Опасная зона</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full"
              >
                <Button
                  variant="destructive"
                  className="w-full gap-2"
                  onClick={handleReset}
                >
                  <Trash2 className="h-4 w-4" /> Сбросить профиль
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex-1 gap-2">
            <Save className="h-4 w-4" /> Сохранить
          </Button>
          <Button onClick={() => setIsOpen(false)} variant="outline" className="flex-1">
            Отмена
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};