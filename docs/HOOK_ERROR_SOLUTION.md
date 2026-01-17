# React Hook Error Solution: "Rendered more hooks than during the previous render"

## Problem Description
The error "Rendered more hooks than during the previous render" occurs when React components call a different number of hooks between renders. This violates the [Rules of Hooks](https://reactjs.org/docs/hooks-rules.html), which require that hooks are called in the same order on every render.

## Root Cause
In the `ProfileSettings.tsx` component, hooks were being called unconditionally at the top of the component, but the component also had an early return statement that would execute when `!profile` was true. This meant:

1. On the first render (when profile was null): hooks were called, then the early return was executed
2. On subsequent renders (when profile existed): hooks were called, and then the full component rendered

While the number of hooks was technically the same, the conditional rendering pattern was causing inconsistencies in how React tracked the hooks internally.

## Solution Applied
The solution involved extracting the main component logic into a separate component (`ProfileSettingsContent`) that only renders when the profile exists. This ensures:

1. The main `ProfileSettings` component handles the conditional rendering
2. The `ProfileSettingsContent` component always has the same hook calls when it renders
3. No early returns interfere with hook ordering

## Code Changes Made

### Before:
```jsx
export const ProfileSettings: React.FC = () => {
  const { profile, updateProfile, ... } = useUserProfile();
  const [isOpen, setIsOpen] = useState(false);
  // ... other hooks

  // Early return here caused hook inconsistency
  if (!profile) {
    return <div>Loading...</div>;
  }

  // Rest of component...
}
```

### After:
```jsx
const ProfileSettingsContent: React.FC = ({ profile, ...handlers }) => {
  const { ALARM_SOUNDS, selectedSound, setSelectedSound } = useAlarmTimer();
  const [isOpen, setIsOpen] = useState(false);
  // ... other hooks and component logic

  // No early returns here, so hooks are always called consistently
};

export const ProfileSettings: React.FC = () => {
  const { profile, ... } = useUserProfile();

  // Handle conditional rendering in the main component
  if (!profile) {
    return <button className="opacity-0 pointer-events-none">Loading...</button>;
  }

  return <ProfileSettingsContent profile={profile} ...handlers />;
};
```

## Key Takeaways

1. **Never put hooks after conditional statements**: Hooks must always be called in the same order
2. **Avoid early returns in components that use hooks**: Instead, use conditional rendering or wrapper components
3. **Separate conditional logic from hook-heavy components**: Use wrapper components for loading/error states
4. **Hooks go at the top level**: Always call hooks at the top level of your React function, not inside conditions, loops, or nested functions

## Prevention Strategies

1. Use ESLint plugin `eslint-plugin-react-hooks` to catch these errors during development
2. Follow the Rule of Hooks: only call hooks at the top level of your React function
3. Consider using custom hooks for complex state management logic
4. When in doubt, extract components to ensure consistent hook usage

## Additional Resources
- [React Hooks Rules](https://reactjs.org/docs/hooks-rules.html)
- [Building Your Own Hooks](https://reactjs.org/docs/hooks-custom.html)
- [Understanding React's reconciliation algorithm](https://reactjs.org/docs/reconciliation.html)