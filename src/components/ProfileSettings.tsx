"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, Save, Trash2, Smile, Palette, Type, Shirt, Glasses, Sparkles, User, X, Plus } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAlarmTimer } from "@/hooks/useAlarmTimer";
import { cn } from "@/lib/utils";
import { AvatarConstructor } from "./AvatarConstructor";

export const ProfileSettings: React.FC = () => {
  const { profile, updateProfile, updateSettings, resetProfile, regenerateAvatar } = useUserProfile();
  const { ALARM_SOUNDS, selectedSound, setSelectedSound } = useAlarmTimer();
  const [isOpen, setIsOpen] = useState(false);
  const [tempUsername, setTempUsername] = useState("");
  const [showConstructor, setShowConstructor] = useState(false);

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

      <DialogContent className="sm:max-w-[600px] rounded-xl p-0 overflow-hidden">
        {/* Заголовок */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Settings className="h-6 w-6" /> Настройки профиля
            </DialogTitle>
            <DialogDescription className="text-purple-100 opacity-90">
              Управляйте своим профилем и предпочтениями
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Основной контент */}
        <div className="p-6 space-y-6 bg-white">
          {/* Секция 1: Аватар и имя (Flex Perfect Symmetry) */}
          <div className="flex items-center gap-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
            {/* Аватар */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Avatar className="w-28 h-28 border-4 border-purple-400 rounded-full overflow-hidden shadow-xl">
                <AvatarImage src={profile.avatar} alt={profile.username} className="rounded-full" />
                <AvatarFallback className="bg-gradient-to-br from-purple-200 to-pink-200 text-purple-800 font-bold text-xl">
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
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-lg"
                  onClick={handleRegenerateAvatar}
                  title="Случайная аватарка"
                >
                  <Sparkles className="h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Имя и конструктор */}
            <div className="flex-1 space-y-3">
              <div className="space-y-1">
                <Label className="text-sm font-bold text-purple-800">Имя пользователя</Label>
                <Input
                  placeholder={profile.username}
                  value={tempUsername || profile.username}
                  onChange={(e) => setTempUsername(e.target.value)}
                  className="border-2 border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
              </div>
              
              <div className="flex gap-2">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                  <Button
                    onClick={() => setShowConstructor(!showConstructor)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    <Palette className="h-4 w-4 mr-2" /> Конструктор
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="icon"
                    variant="outline"
                    className="w-10 border-purple-300 text-purple-600 hover:bg-purple-50"
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
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
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

          {/* Секция 2: Уведомления (Gold Standard Card) */}
          <Card className="border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-amber-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-600" /> Уведомления
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-amber-200">
                <Label className="font-medium text-amber-900">Браузерные уведомления</Label>
                <Switch
                  checked={profile.settings.notifications}
                  onCheckedChange={(checked) => updateSettings({ notifications: checked })}
                  className="data-[state=checked]:bg-amber-500"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-amber-200">
                <Label className="font-medium text-amber-900">Звук будильника</Label>
                <Switch
                  checked={profile.settings.soundEnabled}
                  onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
                  className="data-[state=checked]:bg-amber-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Секция 3: Звук будильника (Perfect Symmetry) */}
          <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-blue-900 flex items-center gap-2">
                <Glasses className="h-5 w-5 text-blue-600" /> Звук будильника
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {ALARM_SOUNDS.map((sound) => (
                  <motion.div
                    key={sound.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    <Button
                      onClick={() => {
                        setSelectedSound(sound.id);
                        updateSettings({ selectedSound: sound.id });
                      }}
                      className={cn(
                        "w-full h-12 p-0 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-1",
                        selectedSound === sound.id
                          ? "border-blue-500 bg-blue-100 shadow-md"
                          : "border-blue-200 bg-white hover:border-blue-400"
                      )}
                      title={sound.name}
                    >
                      <span className="text-xl">{sound.name.split(' ')[0]}</span>
                      <span className="text-[10px] font-normal text-blue-600">{sound.name.split(' ')[1]}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Секция 4: Опасная зона (Gold Standard) */}
          <Card className="border-2 border-red-300 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-red-900 flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-red-600" /> Опасная зона
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full"
              >
                <Button
                  variant="destructive"
                  className="w-full h-12 text-lg font-bold bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
                  onClick={handleReset}
                >
                  <Trash2 className="h-5 w-5 mr-2" /> Сбросить профиль
                </Button>
              </motion.div>
            </CardContent>
          </Card>

          {/* Футер с кнопками */}
          <div className="flex gap-3 pt-2 border-t border-gray-200">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
              <Button onClick={handleSave} className="w-full h-12 text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                <Save className="h-5 w-5 mr-2" /> Сохранить
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
              <Button onClick={() => setIsOpen(false)} variant="outline" className="w-full h-12 text-lg font-bold border-2 border-gray-300 hover:bg-gray-50">
                Отмена
              </Button>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};