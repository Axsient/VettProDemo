# SupplierNetworkGraph Component

An interactive force-directed graph visualization component that displays the relationships between suppliers and directors using react-force-graph-2d. The component features neumorphic styling with custom canvas rendering and provides rich interactivity for exploring supplier networks.

## Features

- **Force-Directed Layout**: Automatically positions nodes based on their relationships
- **Custom Canvas Rendering**: Neumorphic shadows and theme-aware colors
- **Interactive Nodes**: Click to select suppliers, hover for details
- **Risk-Based Filtering**: Filter by financial, compliance, operational, or reputational risk
- **Director Connections**: Visualize shared board members between suppliers
- **Zoom Controls**: Zoom in/out and fit-to-screen functionality
- **Responsive Design**: Adapts to container dimensions
- **TypeScript Support**: Fully typed with comprehensive interfaces

## Usage

### Basic Implementation

```tsx
import { SupplierNetworkGraph } from '@/components/executive';

function Dashboard() {
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  return (
    <SupplierNetworkGraph
      onNodeClick={(supplier) => setSelectedSupplier(supplier)}
    />
  );
}
```

### With Risk Filtering

```tsx
import { SupplierNetworkGraph, RiskCategory } from '@/components/executive';

function Dashboard() {
  const [filter, setFilter] = useState<RiskCategory | null>(null);

  return (
    <SupplierNetworkGraph
      activeFilter={filter}
      onNodeClick={(supplier) => console.log('Selected:', supplier)}
    />
  );
}
```

## Props

| Prop | Type | Description | Default |
|------|------|-------------|---------|
| `activeFilter` | `RiskCategory \| null` | Filter suppliers by risk category | `null` |
| `onNodeClick` | `(nodeData: any) => void` | Callback when a supplier node is clicked | - |
| `selectedSupplierId` | `string \| null` | ID of the currently selected supplier | `null` |
| `className` | `string` | Additional CSS classes | `''` |

## Node Types

### Supplier Nodes
- Size based on contract value
- Color based on risk level (Critical/High/Medium/Low)
- Shows warning icon for critical risk (≥75%)
- Displays name and risk score on hover

### Director Nodes
- Smaller fixed size
- Secondary color theme
- Shows person icon
- Links to multiple suppliers

## Visual Encoding

### Node Colors
- **Critical Risk (≥75%)**: `--neumorphic-severity-critical` (Red)
- **High Risk (50-74%)**: `--neumorphic-severity-high` (Orange)
- **Medium Risk (25-49%)**: `--neumorphic-severity-medium` (Yellow)
- **Low Risk (<25%)**: `--neumorphic-severity-low` (Green)
- **Directors**: `--neumorphic-text-secondary` (Gray)

### Node Sizes
- **Suppliers**: Proportional to contract value (in millions ZAR)
- **Directors**: Fixed small size (5 units)

### Links
- **Supplier-Director**: Direct connection (thicker lines)
- **Supplier-Supplier**: Shared director connection (thinner lines)
- **Opacity**: 30% for better visibility of overlapping connections

## Interactions

### Mouse Controls
- **Click**: Select supplier node (triggers `onNodeClick`)
- **Hover**: Show node details in tooltip
- **Drag**: Reposition nodes (physics simulation continues)

### Zoom Controls
- **Zoom In Button**: Increase zoom by 20%
- **Zoom Out Button**: Decrease zoom by 20%
- **Fit to Screen**: Auto-fit all nodes in view
- **Mouse Wheel**: Zoom in/out
- **Pan**: Click and drag on empty space

## Theme Integration

The component uses the neumorphic theme system via the `theme-bridge` utilities:

```tsx
// Get theme colors
const colors = getThemeColors();

// Apply neumorphic shadows to canvas
applyNeumorphicToCanvas(ctx, 'convex');

// Get severity colors
const color = getSeverityColor('High');
```

## Performance Considerations

- **Cooldown**: 100 ticks for stable layout
- **Auto-fit**: Zooms to fit after simulation stops
- **Particle Effects**: Directional particles show link direction
- **Canvas Rendering**: Efficient custom rendering for large networks

## Example Implementation

See `Example.tsx` for a complete implementation with:
- Filter controls for risk categories
- Selected supplier details panel
- Responsive layout
- Full interactivity demonstration

## Dependencies

- `react-force-graph-2d`: Core graph visualization
- `framer-motion`: Animations and transitions
- `lucide-react`: Icon components
- Theme utilities from `@/lib/executive/theme-bridge`
- Sample data from `@/lib/sample-data/executive-dashboard-data`

## Customization

### Adding New Node Types

```tsx
// In nodeCanvasObject callback
if (node.type === 'newType') {
  ctx.fillStyle = customColor;
  // Custom rendering logic
}
```

### Custom Risk Thresholds

```tsx
const getRiskLevel = (score: number): string => {
  if (score >= 80) return 'Extreme';
  if (score >= 60) return 'Severe';
  // ... custom levels
};
```

### Alternative Layouts

The component uses force-directed layout by default. For hierarchical or circular layouts, consider using d3-force directly with custom force configurations.