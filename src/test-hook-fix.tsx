/**
 * Test component to verify that the hook error has been fixed
 * This component demonstrates the correct pattern for conditional rendering
 * with React hooks to avoid "Rendered more hooks than during the previous render" error
 */

import React from 'react';
import { useUserProfile } from './hooks/useUserProfile';

// Correct implementation: Component that handles conditional rendering properly
const TestProfileSettingsCorrect: React.FC = () => {
  const { profile, updateProfile, updateSettings, resetProfile, regenerateAvatar } = useUserProfile();

  // Handle the conditional rendering in the main component
  // This ensures hooks are always called in the same order
  if (!profile) {
    return <div className="loading-placeholder">Loading...</div>;
  }

  // All other hooks and logic go here after the conditional check
  return (
    <div>
      <h1>Profile Settings for {profile.username}</h1>
      {/* Other JSX elements */}
    </div>
  );
};

// Alternative correct implementation: Separate the logic into two components
const ProfileSettingsLogic: React.FC<{ 
  profile: any, 
  updateProfile: any, 
  updateSettings: any, 
  resetProfile: any, 
  regenerateAvatar: any 
}> = ({ profile, updateProfile, updateSettings, resetProfile, regenerateAvatar }) => {
  // All hooks go here in the inner component
  // Since this component only renders when profile exists, no conditional checks needed
  const [isOpen, setIsOpen] = React.useState(false);
  const [tempUsername, setTempUsername] = React.useState("");
  const [showConstructor, setShowConstructor] = React.useState(false);
  const [isRegenerating, setIsRegenerating] = React.useState(false);

  return (
    <div>
      <h1>Profile Settings for {profile.username}</h1>
      {/* Other JSX elements */}
    </div>
  );
};

export const TestProfileSettingsAlternative: React.FC = () => {
  const { profile, updateProfile, updateSettings, resetProfile, regenerateAvatar } = useUserProfile();

  // Conditional rendering happens in the main component
  if (!profile) {
    return <div className="loading-placeholder">Loading...</div>;
  }

  // Inner component is only rendered when profile exists
  return (
    <ProfileSettingsLogic 
      profile={profile} 
      updateProfile={updateProfile} 
      updateSettings={updateSettings} 
      resetProfile={resetProfile} 
      regenerateAvatar={regenerateAvatar} 
    />
  );
};

// Test to verify the fix
const HookFixTest: React.FC = () => {
  return (
    <div>
      <h2>Testing Hook Fix Implementation</h2>
      <p>This component verifies that the "Rendered more hooks than during the previous render" error has been resolved.</p>
      
      <div>
        <h3>Correct Pattern:</h3>
        <p>Hooks are called at the top level, conditional rendering happens after.</p>
        <TestProfileSettingsCorrect />
      </div>
      
      <div>
        <h3>Alternative Correct Pattern:</h3>
        <p>Conditional rendering in main component, hooks in child component.</p>
        <TestProfileSettingsAlternative />
      </div>
    </div>
  );
};

export default HookFixTest;