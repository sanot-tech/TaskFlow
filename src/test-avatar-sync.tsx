import React from 'react';
import { useAvatarSync } from './hooks/useAvatarSync';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from './components/ui/avatar';

// TestAvatarSync Component
const TestAvatarSync: React.FC = () => {
  const { avatar, updateAvatar, isLoading, hasError } = useAvatarSync();

  const generateTestAvatar = () => {
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomTime = Date.now();
    return `https://placehold.co/200x200/${randomColor}/white?text=Avatar+${randomTime}`;
  };

  const handleUpdateAvatar = () => {
    const newAvatar = generateTestAvatar();
    updateAvatar(newAvatar);
  };

  return (
    <Card className="w-full max-w-md mx-auto m-4">
      <CardHeader>
        <CardTitle>Avatar Sync Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center gap-2">
          <Avatar className="w-24 h-24">
            {avatar.url ? (
              <AvatarImage src={avatar.url} alt="Test Avatar" />
            ) : (
              <AvatarFallback>?</AvatarFallback>
            )}
          </Avatar>
          
          <div className="text-center">
            <p className="text-sm break-words max-w-full">{avatar.url || 'No avatar'}</p>
            <p className="text-xs text-gray-500">Version: {avatar.version}</p>
            <p className="text-xs text-gray-500">Time: {new Date(avatar.timestamp).toLocaleTimeString()}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={handleUpdateAvatar} disabled={isLoading} className="w-full">
            {isLoading ? 'Loading...' : 'Update Avatar'}
          </Button>
          
          {hasError && (
            <div className="p-2 bg-red-100 text-red-700 rounded text-sm">
              Error: {avatar.error}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestAvatarSync;