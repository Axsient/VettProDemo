# RiskConcentrationMap Component

An interactive geographic visualization component that displays South African mining operations with supplier risk concentration analysis using react-map-gl and deck.gl.

## Features

- **Interactive Map**: Pan and zoom across South Africa
- **Mine Site Markers**: Large markers showing mine locations with risk-based coloring
- **Supplier Dots**: Smaller dots representing suppliers with risk-based sizing and coloring
- **Risk Heatmap**: Heat visualization showing risk concentration areas
- **Arc Connections**: Animated arcs showing supplier-mine relationships when a mine is selected
- **Hover Tooltips**: Detailed information on hover for both mines and suppliers
- **Legend**: Risk level color coding and symbol explanations
- **Stats Overview**: Real-time statistics display
- **Theme Integration**: Full neumorphic theme support using theme-bridge utilities

## Props

```typescript
interface RiskConcentrationMapProps {
  className?: string;
  height?: string;
  onSupplierClick?: (supplier: ExecutiveSupplierInfo) => void;
  onMineSiteClick?: (mineSite: MineSite) => void;
}
```

## Usage

### Basic Usage

```tsx
import RiskConcentrationMap from '@/components/executive/RiskConcentrationMap';

function Dashboard() {
  return (
    <RiskConcentrationMap 
      height="600px"
      className="w-full"
    />
  );
}
```

### With Event Handlers

```tsx
import RiskConcentrationMap from '@/components/executive/RiskConcentrationMap';

function Dashboard() {
  const handleSupplierClick = (supplier: ExecutiveSupplierInfo) => {
    console.log('Supplier clicked:', supplier);
    // Open supplier details modal
  };

  const handleMineSiteClick = (mineSite: MineSite) => {
    console.log('Mine site clicked:', mineSite);
    // Show mine site details
  };

  return (
    <RiskConcentrationMap 
      height="700px"
      onSupplierClick={handleSupplierClick}
      onMineSiteClick={handleMineSiteClick}
    />
  );
}
```

## Data Structure

The component uses data from `@/lib/sample-data/executive-dashboard-data.ts`:

### Mine Sites
- Location coordinates (latitude, longitude)
- Risk scores (0-100)
- Active supplier counts
- Metal types extracted
- Province information

### Suppliers
- Geographic coordinates
- Risk scores and risk factor breakdowns
- Contract values (ZAR)
- Category classifications
- Director relationships
- Linked mine site IDs

## Layers

### 1. Heatmap Layer
- Shows risk concentration areas
- Uses weighted risk scores
- Configurable opacity and color range

### 2. Supplier Layer (ScatterplotLayer)
- Small dots representing suppliers
- Size based on contract value
- Color based on risk score
- Clickable and hoverable

### 3. Mine Site Layer (ScatterplotLayer)
- Large markers for mine sites
- Size based on active supplier count
- Color based on aggregated risk score
- Clickable to show connections

### 4. Arc Layer (Dynamic)
- Appears when a mine site is selected
- Shows animated connections to suppliers
- Color-coded based on risk levels
- Helps visualize supply chain relationships

## Styling

The component uses:
- **Neumorphic Theme**: All colors and styling via CSS custom properties
- **Theme Bridge**: Utilities for converting CSS variables to canvas-compatible formats
- **Responsive Design**: Adapts to different screen sizes
- **Backdrop Blur**: Modern glassmorphism effects on overlays

## Dependencies

- `react-map-gl`: Map rendering
- `deck.gl`: WebGL-based data visualization layers
- `maplibre-gl`: Open-source map renderer
- `@/lib/executive/theme-bridge`: Theme integration utilities
- `@/components/ui/neumorphic`: Neumorphic UI components

## Performance Considerations

- Uses `useMemo` for expensive layer calculations
- Optimized hover states
- Efficient data filtering for connections
- Minimal re-renders with proper callback handling

## Customization

### Color Scheme
Colors are derived from the neumorphic theme system:
- `--neumorphic-severity-critical`: High risk (75-100)
- `--neumorphic-severity-high`: Medium-high risk (50-74)
- `--neumorphic-severity-medium`: Medium risk (25-49)
- `--neumorphic-severity-low`: Low risk (0-24)

### Map Style
Currently uses CartoDB Dark Matter style. Can be changed by modifying the `mapStyle` prop in the `Map` component.

### Layer Configuration
Each layer can be customized through its configuration object:
- Opacity levels
- Size scaling
- Color ranges
- Interaction settings

## South African Context

The component is specifically designed for South African mining operations:
- Centered on South Africa coordinates
- Uses South African provinces
- Displays ZAR currency formatting
- Mine site locations based on real mining regions

## Future Enhancements

- Real-time data updates
- Time-based risk evolution
- Additional layer types (polygon boundaries, routes)
- Export functionality
- Filter controls
- Performance metrics overlay