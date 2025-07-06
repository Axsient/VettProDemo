# Smart Vetting Canvas Components

This directory contains components for the Smart Vetting Canvas feature, providing intelligent cost calculation, real-time animations, and optimization suggestions for vetting processes.

## Components

### VettingCalculator

The main calculator component that provides real-time cost calculations and time estimates with smooth animations.

#### Features

- **Live Cost Calculations**: Real-time updates using CountUp animations
- **Time Estimation**: Turnaround time calculation with provider reliability metrics
- **Efficiency Scoring**: Performance optimization with visual indicators
- **Cost Breakdown**: Detailed breakdown by category and provider
- **Provider Performance**: Performance comparison with animated rings
- **Optimization Suggestions**: AI-powered cost optimization recommendations
- **Risk Coverage**: Visual risk assessment summary
- **Responsive Design**: Mobile-friendly with compact mode

#### Props

```typescript
interface VettingCalculatorProps {
  selectedChecks: string[];           // Array of selected check IDs
  selectedPackage?: string | null;    // Selected package ID (optional)
  entityType: VettingEntityType;      // Entity type for calculations
  className?: string;                 // Additional CSS classes
  onOptimizationApply?: (optimizationId: string) => void; // Optimization callback
  showBreakdown?: boolean;           // Show detailed breakdown (default: true)
  compact?: boolean;                 // Compact display mode (default: false)
}
```

#### Usage

```tsx
import { VettingCalculator } from '@/components/vetting/smart-canvas';
import { VettingEntityType } from '@/types/vetting';

<VettingCalculator
  selectedChecks={['id_verification', 'cipc_check']}
  selectedPackage={null}
  entityType={VettingEntityType.COMPANY}
  onOptimizationApply={(optimizationId) => {
    console.log('Applied optimization:', optimizationId);
  }}
  showBreakdown={true}
  compact={false}
/>
```

### VettingCalculatorDemo

A demonstration component showing how to integrate and use the VettingCalculator with sample data and controls.

#### Features

- Interactive controls for testing
- Sample check and package data
- Entity type selection
- Real-time preview
- Display mode options

#### Usage

```tsx
import { VettingCalculatorDemo } from '@/components/vetting/smart-canvas';

<VettingCalculatorDemo />
```

## Integration

### With InitiateVettingForm

The VettingCalculator can be integrated into the existing InitiateVettingForm to provide real-time feedback:

```tsx
import { VettingCalculator } from '@/components/vetting/smart-canvas';

// Inside your form component
const [selectedChecks, setSelectedChecks] = useState<string[]>([]);
const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
const [entityType, setEntityType] = useState<VettingEntityType>(VettingEntityType.COMPANY);

return (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Your existing form */}
    <div>
      {/* Form components */}
    </div>
    
    {/* Live calculator */}
    <div>
      <VettingCalculator
        selectedChecks={selectedChecks}
        selectedPackage={selectedPackage}
        entityType={entityType}
        onOptimizationApply={handleOptimizationApply}
      />
    </div>
  </div>
);
```

## Dependencies

The VettingCalculator relies on several hooks and utilities:

- `useVettingCalculator` - Core calculation logic and real-time updates
- `vetting-animations.ts` - Animation configurations and utilities
- Neumorphic UI components - Consistent design system
- CircularProgressRing - Progress visualization
- Vetting types and interfaces

## Animation Features

### CountUp Animations

- Currency formatting with ZAR prefix
- Smooth easing transitions
- Configurable duration and decimals
- Performance optimized

### Progress Rings

- Circular progress indicators
- Color-coded by performance thresholds
- Smooth SVG animations
- Responsive sizing

### Hover Effects

- Card elevation on hover
- Interactive buttons with scaling
- Smooth transitions with CSS custom properties

## Performance Considerations

- **Debounced Updates**: Calculations are debounced to prevent excessive re-renders
- **Memoized Calculations**: Expensive calculations are memoized for performance
- **Conditional Animations**: Animations respect reduced motion preferences
- **Lazy Loading**: Complex components support lazy loading
- **Error Boundaries**: Graceful error handling with fallbacks

## Accessibility

- Screen reader compatible with proper ARIA labels
- Keyboard navigation support
- High contrast mode support
- Reduced motion preferences respected
- Semantic HTML structure

## Theme Support

- Full neumorphic theme integration
- Light/dark mode switching
- CSS custom properties for theming
- Consistent with design system

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Progressive enhancement for older browsers
- Mobile-first responsive design
- Touch-friendly interactions

### VettingStoryPanel

Advanced consent footprint visualization and vetting story generation component that provides dynamic narrative text, visual consent requirements, and interactive SVG-based visualizations.

#### Features

- **Consent Footprint Visualization**: Interactive SVG with person/building icons and animated data flow connections
- **Dynamic Vetting Story Generation**: Real-time narrative text based on selected checks and entity type
- **Risk Level Explanation**: Plain English explanations of risk assessments and compliance requirements
- **Interactive Elements**: Hover effects, detailed tooltips, and click interactions for more information
- **South African Compliance**: POPIA context and regulatory compliance information
- **Real-time Updates**: Live updates when check selections change
- **Mobile Responsive**: Optimized for all device sizes with touch-friendly interactions

#### Props

```typescript
interface VettingStoryPanelProps {
  selectedChecks: string[];           // Array of selected check IDs
  selectedPackage?: string | null;    // Selected package ID (optional)
  entityType: VettingEntityType;      // Entity type for story generation
  className?: string;                 // Additional CSS classes
  onCheckInteraction?: (checkId: string, action: 'view' | 'consent') => void; // Interaction callback
  showConsentDetails?: boolean;       // Show detailed consent tab (default: true)
  compact?: boolean;                  // Compact display mode (default: false)
}
```

#### Usage

```tsx
import { VettingStoryPanel } from '@/components/vetting/smart-canvas';
import { VettingEntityType } from '@/types/vetting';

<VettingStoryPanel
  selectedChecks={['id_verification', 'criminal_record_afis']}
  selectedPackage={null}
  entityType={VettingEntityType.INDIVIDUAL}
  onCheckInteraction={(checkId, action) => {
    console.log(`${action} performed on check:`, checkId);
  }}
  showConsentDetails={true}
  compact={false}
/>
```

#### Visualization Features

- **SVG-based Icons**: Scalable person and building representations
- **Animated Connections**: Color-coded data flow lines with particle animations
- **Interactive Data Points**: Clickable check points with category-specific icons
- **Consent Indicators**: Visual markers for checks requiring explicit consent
- **Risk Color Coding**: Color-coded elements based on check types and risk levels

#### Story Generation

The component generates dynamic narratives based on:
- Selected check categories and types
- Entity type (Individual, Company, Staff Medical)
- Risk levels and compliance requirements
- Consent requirements and POPIA regulations
- Cost estimates and timeline information

### VettingStoryPanelDemo

A comprehensive demonstration component showcasing the VettingStoryPanel with interactive controls and sample configurations.

#### Features

- **Quick Start Configurations**: Predefined check combinations for common scenarios
- **Interactive Controls**: Real-time entity type and check selection
- **Package Integration**: Quick package selection with automatic check updates
- **Display Options**: Toggle consent details and compact mode
- **Interaction Logging**: Real-time feedback on user interactions
- **Selection Summary**: Live cost and timeline calculations

#### Usage

```tsx
import { VettingStoryPanelDemo } from '@/components/vetting/smart-canvas';

<VettingStoryPanelDemo />
```

## Animation System

The Smart Canvas components use a sophisticated animation system built on:

### SVG Animations
- **Path Animations**: Smooth connection line drawing
- **Particle Systems**: Animated data flow indicators
- **Color Transitions**: Dynamic color changes based on state
- **Staggered Entry**: Sequential component appearance

### Framer Motion Integration
- **Layout Animations**: Smooth component transitions
- **Gesture Recognition**: Touch and hover interactions
- **Spring Physics**: Natural feeling animations
- **Performance Optimization**: GPU-accelerated transforms

### CSS Custom Properties
- **Theme Integration**: Consistent color and spacing
- **Dynamic Styling**: Runtime style adjustments
- **Performance**: Efficient style calculations

## Future Enhancements

Planned features for future development:

- **Smart Suggestions Component**: AI-powered package recommendations
- **Risk Assessment Widget**: Real-time risk scoring visualization
- **Cost Comparison Tool**: Side-by-side package comparisons
- **Provider Performance Dashboard**: Detailed provider analytics
- **Batch Calculation Mode**: Multiple entity calculations
- **Export Functionality**: PDF/Excel report generation
- **Advanced Consent Management**: Workflow automation and tracking
- **3D Visualization Mode**: Enhanced spatial consent mapping