
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Settings, Bell, Volume2, Edit, Save, X } from "lucide-react";
import { motion } from "framer-motion";
import { useAvatar } from "@/contexts/AvatarContext";

interface UserProfileCardProps {
  profile: {
    name: string;
    email: string;
    avatar: string;
    settings: {
      notifications: boolean;
      soundEnabled: boolean;
    };
  };
  onUpdateProfile: (updatedProfile: any) => void;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ profile, onUpdateProfile }) => {
  const { avatar } = useAvatar();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(profile.name);
  const [editedEmail, setEditedEmail] = useState(profile.email);

  // Add the missing updateSettings function
  const updateSettings = (newSettings: Partial<typeof profile.settings>) => {
    onUpdateProfile({
      ...profile,
      settings: {
        ...profile.settings,
        ...newSettings,
      },
    });
  };

  const handleSave = () => {
    onUpdateProfile({
      ...profile,
      name: editedName,
      email: editedEmail,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(profile.name);
    setEditedEmail(profile.email);
    setIsEditing(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto border-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" /> Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Avatar Section */}
        <div className="flex justify-center">
          <Avatar className="w-24 h-24 border-4 border-blue-300 rounded-full overflow-hidden shadow-xl">
            <AvatarImage src={avatar.url || profile.avatar} alt={profile.name} className="rounded-full" />
            <AvatarFallback>
              <User className="h-10 w-10" />
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Name & Email */}
        <div className="text-center space-y-1">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-center font-medium"
                placeholder="Name"
              />
              <input
                type="email"
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-center text-sm text-gray-600"
                placeholder="Email"
              />
            </div>
          ) : (
            <>
              <h3 className="font-bold text-lg">{profile.name}</h3>
              <p className="text-sm text-gray-600">{profile.email}</p>
            </>
          )}
        </div>

        {/* Settings Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Notifications</span>
            </div>
            <Button
              variant={profile.settings.notifications ? "default" : "secondary"}
              onClick={() => updateSettings({ notifications: !profile.settings.notifications })}
              className="text-xs h-7"
            >
              {profile.settings.notifications ? "On" : "Off"}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Sound</span>
            </div>
            <Button
              variant={profile.settings.soundEnabled ? "default" : "secondary"}
              onClick={() => updateSettings({ soundEnabled: !profile.settings.soundEnabled })}
              className="text-xs h-7"
            >
              {profile.settings.soundEnabled ? "On" : "Off"}
            </Button>
          </div>
        </div>

        {/* Edit/Save Buttons */}
        <div className="flex gap-2 pt-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                <Save className="h-4 w-4 mr-2" /> Save
              </Button>
              <Button onClick={handleCancel} variant="outline" className="flex-1">
                <X className="h-4 w-4 mr-2" /> Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="w-full">
              <Edit className="h-4 w-4 mr-2" /> Edit Profile
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};