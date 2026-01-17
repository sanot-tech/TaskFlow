# AdaptiveCardTitle Component

## Overview
The `AdaptiveCardTitle` component is a responsive, flex-centered card title that automatically adapts to different screen sizes and device types. It follows the "flex conception" design principle with premium flex styling, perfect symmetry, and centered alignment.

## Features
- **Auto-responsive**: Automatically adjusts to screen size from 320px to 8K displays
- **Flex-centered**: Uses flexbox for perfect centering on all devices
- **Premium styling**: Follows premium UI/UX principles
- **Symmetrical design**: Maintains perfect symmetry at all times
- **Theme-aware**: Adapts to both light and dark themes
- **Completed state**: Supports visual indication for completed tasks

## Usage

### Basic Usage
```tsx
import { AdaptiveCardTitle } from '@/components/AdaptiveCardTitle';

<AdaptiveCardTitle>
  My Card Title
</AdaptiveCardTitle>
```

### With Completion State
```tsx
<AdaptiveCardTitle completed={task.completed}>
  {task.title}
</AdaptiveCardTitle>
```

### With Additional Classes
```tsx
<AdaptiveCardTitle className="text-2xl font-semibold" completed={false}>
  Custom Styled Title
</AdaptiveCardTitle>
```

## Props
- `children`: ReactNode - The title text/content
- `className` (optional): string - Additional CSS classes to apply
- `completed` (optional): boolean - Whether the task/card is completed (adds strikethrough and opacity effect)

## Styling Features
- **Centered alignment**: Text is always centered horizontally and vertically
- **Flexible sizing**: Font size adapts using CSS clamp() function
- **Word wrapping**: Long titles wrap appropriately with hyphenation
- **Theme compatibility**: Works with both light and dark themes
- **Accessibility**: Maintains proper contrast and readability

## CSS Variables
The component relies on CSS variables defined in `globals.css`:
- `--title-font-size-xs`: For extra small screens
- `--title-font-size-sm`: For small screens
- `--title-font-size-md`: For medium screens
- `--title-font-size-lg`: For large screens
- `--title-line-height`: Responsive line height

## Responsive Behavior
- On mobile (320px-640px): Smaller font size with tighter spacing
- On desktop (640px-1200px): Medium font size with balanced spacing
- On large screens (1200px+): Larger font size with spacious layout
- On 8K displays: Optimized for high-resolution viewing

## Accessibility
- Proper semantic HTML using CardTitle primitive
- Sufficient color contrast in both themes
- Screen reader friendly
- Keyboard navigable
- Reduced motion support

## Dependencies
- `cn` utility from '@/lib/utils' for conditional class names
- `CardTitle` primitive from '@/components/ui/card'