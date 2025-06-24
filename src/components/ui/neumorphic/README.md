# Neumorphic UI Components

A complete neumorphic design system for React applications. This system provides elegant, glass-like components with sophisticated shadow effects, progress rings with glow animations, and a comprehensive theming system.

## Components

### NeумorphicBackground
The main background wrapper for neumorphic pages with gradient background.

```tsx
<NeumorphicBackground>
  {/* Your page content */}
</NeumorphicBackground>
```

### NeumorphicCard
A main container component with neumorphic styling, perfect for content sections. Includes proper padding (32px), rounded corners (40px), and multi-layer shadows.

```tsx
<NeumorphicCard className="max-w-4xl">
  <h2>Card Content</h2>
</NeumorphicCard>
```

### NeumorphicButton
A button component with neumorphic styling and interactive states (convex to concave on hover).

```tsx
<NeumorphicButton onClick={handleClick}>
  Click Me
</NeumorphicButton>
```

### NeumorphicIconButton
A circular icon button with neumorphic styling, perfect for toolbar buttons.

```tsx
<NeumorphicIconButton>
  <Icon className="w-5 h-5" />
</NeumorphicIconButton>
```

### NeumorphicInput
A text input component with neumorphic styling (concave appearance).

```tsx
<NeumorphicInput 
  placeholder="Enter text..."
  value={value}
  onChange={handleChange}
/>
```

### NeumorphicProgressRing
An animated progress ring component with glow effects for displaying progress data.

```tsx
<NeumorphicProgressRing
  icon={CheckIcon}
  progress={75}
  color="#3B82F6"
  size={60}
  strokeWidth={3}
/>
```

### NeumorphicText & NeumorphicHeading
Typography components with proper neumorphic text colors.

```tsx
<NeumorphicHeading>Main Title</NeumorphicHeading>
<NeumorphicText variant="secondary">Subtitle</NeumorphicText>
```

## Styling System

The neumorphic styling system is built with:

1. **CSS Variables** (in `src/styles/themes/neumorphic.css`)
   - Base colors with transparency for glass-like effects
   - Multi-layer shadow system (no light shadows - only dark bottom-right)
   - Spacing system (sm: 0.5rem, md: 1rem, lg: 1.5rem, xl: 2rem)
   - Border radius system (sm: 0.75rem, md: 1.25rem, lg: 2rem, xl: 2.5rem)
   - Rich gradient backgrounds for depth
   - Progress ring glow animations

2. **Tailwind Configuration** (in `tailwind.config.ts`)
   - Neumorphic color palette integration
   - Shadow variants (convex, concave, with size variations)
   - Background gradients with glassmorphism
   - Backdrop blur effects
   - Custom progress ring colors

## Usage

1. **Import the components:**
```tsx
import {
  NeumorphicBackground,
  NeumorphicCard,
  NeumorphicButton,
  NeumorphicIconButton,
  NeumorphicInput,
  NeumorphicText,
  NeumorphicHeading
} from "@/components/ui/neumorphic";
```

2. **Always use NeumorphicBackground for pages:**
```tsx
export default function MyPage() {
  return (
    <NeumorphicBackground>
      <NeumorphicCard className="max-w-4xl">
        {/* Your content */}
      </NeumorphicCard>
    </NeumorphicBackground>
  );
}
```

3. **Use CSS variables for consistent spacing:**
```tsx
<div className="p-[var(--neumorphic-spacing-md)] rounded-[var(--neumorphic-radius-lg)]">
  Content with consistent spacing
</div>
```

## Available Classes

### Colors
- `text-neumorphic-text-primary` - Main text color (#E0E0E0)
- `text-neumorphic-text-secondary` - Secondary text color (#A0A0A0)
- `text-neumorphic-accent` - Accent color (#FF9A3E)
- `bg-neumorphic-bg` - Base background
- `bg-neumorphic-card` - Card background with transparency
- `bg-neumorphic-button` - Button background with transparency
- `border-neumorphic-border` - Border color

### Shadows (Multi-layer System - No Light Shadows)
- `shadow-neumorphic-convex` - Standard raised effect (2px+4px multi-layer dark shadow)
- `shadow-neumorphic-convex-sm` - Small raised effect (1px+2px multi-layer dark shadow)
- `shadow-neumorphic-convex-lg` - Large raised effect (4px+8px+16px multi-layer dark shadow)
- `shadow-neumorphic-concave` - Inset effect (inset 2px+4px multi-layer dark shadow)

**Important**: All shadows use only dark shadows on bottom-right for proper neumorphic effect. Multi-layer system creates gentle, natural depth without harsh contrast.

### Gradients
- `bg-neumorphic-gradient` - Card gradient background
- `bg-neumorphic-bg-gradient` - Page background gradient

### Spacing (CSS Variables)
- `var(--neumorphic-spacing-sm)` - 0.5rem (8px)
- `var(--neumorphic-spacing-md)` - 1rem (16px)
- `var(--neumorphic-spacing-lg)` - 1.5rem (24px)
- `var(--neumorphic-spacing-xl)` - 2rem (32px)

### Border Radius (CSS Variables)
- `var(--neumorphic-radius-sm)` - 0.75rem (12px)
- `var(--neumorphic-radius-md)` - 1.25rem (20px)
- `var(--neumorphic-radius-lg)` - 2rem (32px)
- `var(--neumorphic-radius-xl)` - 2.5rem (40px)

### Progress Ring Glow Effects
- `.neumorphic-progress-glow` - Animated glow effect for progress rings
- Custom `drop-shadow` filters with pulsing animation
- Color-matched glow effects that adapt to ring color

### Effects
- `backdrop-blur-neumorphic` - Consistent blur effect

## Best Practices

1. **Always wrap pages in NeumorphicBackground**
2. **Use NeumorphicCard for main content containers**
3. **Use CSS variables for spacing and radius to maintain consistency**
4. **Follow the shadow hierarchy: convex-lg for main cards, convex for buttons, convex-sm for small elements**
5. **Use NeumorphicIconButton for circular icon buttons**
6. **Combine convex shadows with semi-transparent backgrounds for glass-like effects**
7. **CRITICAL: Only use dark shadows (no light shadows) positioned on bottom-right for proper neumorphic depth**
8. **Use !important declarations in neumorphic.css to prevent CSS conflicts**
9. **Avoid mixing neumorphic shadows with other shadow systems**
10. **For progress rings, always use NeumorphicProgressRing component with proper glow isolation**
11. **Use `goal-card-enhanced` class for enhanced card backgrounds without unwanted glow effects**
12. **Maintain glassmorphism with backdrop-blur and semi-transparent backgrounds**

## Advanced Components

### Goal Cards with Progress Rings
For creating progress tracking cards with glow effects:

```tsx
const GoalCard = ({ icon, title, amount, goal, color, progress }) => {
  return (
    <div className="bg-neumorphic-button p-4 rounded-[var(--neumorphic-radius-lg)] shadow-neumorphic-convex-sm border border-neumorphic-border/5 backdrop-blur-[var(--neumorphic-blur)] goal-card-enhanced">
      <div className="flex items-center space-x-4">
        <NeumorphicProgressRing
          icon={icon}
          progress={progress}
          color={color}
          size={52}
          strokeWidth={2.5}
        />
        <div className="flex-grow">
          <h2 className="text-lg font-semibold text-neumorphic-text-primary">{title}</h2>
          <p className="text-sm text-neumorphic-text-secondary">
            <span className="text-neumorphic-accent font-medium">{amount}</span> / {goal}
          </p>
        </div>
      </div>
    </div>
  );
};
```

## Complete Example Implementation

```tsx
import { 
  NeumorphicBackground, 
  NeumorphicCard, 
  NeumorphicButton, 
  NeumorphicIconButton,
  NeumorphicProgressRing 
} from "@/components/ui/neumorphic";
import { ArrowLeft, Settings, TrendingUp } from "lucide-react";

export default function SavingsPage() {
  return (
    <NeumorphicBackground className="flex items-center justify-center">
      <NeumorphicCard className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <NeumorphicIconButton>
            <ArrowLeft className="w-5 h-5" />
          </NeumorphicIconButton>
          <h1 className="text-3xl font-bold text-neumorphic-text-primary">Savings</h1>
          <NeumorphicIconButton>
            <Settings className="w-5 h-5" />
          </NeumorphicIconButton>
        </div>
        
        {/* Progress Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <GoalCard 
            icon={TrendingUp}
            title="Investment Goal"
            amount="$5,000"
            goal="$10,000"
            color="#3B82F6"
            progress={50}
          />
        </div>
        
        {/* Action Button */}
        <NeumorphicButton className="w-full py-4">
          Create New Goal
        </NeumorphicButton>
      </NeumorphicCard>
    </NeumorphicBackground>
  );
}
```

## System Architecture

### File Structure
```
src/
├── styles/themes/neumorphic.css     # Core theme system with CSS variables
├── components/ui/neumorphic/
│   ├── index.tsx                    # All neumorphic components
│   └── README.md                    # This documentation
└── app/globals.css                  # Theme imports and base styles
```

### Theme Integration
1. Import neumorphic.css in globals.css
2. CSS variables provide consistent theming
3. Multi-layer shadow system for natural depth
4. Progress ring glow effects isolated to prevent unwanted filters
5. Glassmorphism with backdrop-blur and transparency

### Shadow System Details
- **No light shadows**: Only dark shadows positioned on bottom-right
- **Multi-layer approach**: Combines multiple shadow layers for natural depth
- **Size variants**: sm (subtle), default (standard), lg (prominent)
- **!important declarations**: Prevents conflicts with other shadow systems 