# VettPro Executive Dashboard - Product Requirements Document

## Executive Summary

The VettPro Executive Dashboard is a state-of-the-art, immersive command center designed for C-suite executives overseeing supplier risk management at Sibanye-Stillwater's mining operations across South Africa. This dashboard transforms complex supplier risk data into an interactive, visually compelling strategic intelligence interface that enables real-time decision-making and proactive risk mitigation.

### Vision Statement
To create a "World of Warcraft"-inspired strategic dashboard that gamifies risk management, turning supplier oversight from a mundane compliance task into an engaging strategic experience. The dashboard serves as the executive's "War Room," providing a living, breathing ecosystem of interconnected risk intelligence.

### Key Design Principles
1. **Immersive Experience**: Full-screen, dark-themed interface that feels more like a live intelligence platform than a static report
2. **Interconnected Components**: Every interaction dynamically updates the entire dashboard context
3. **Strategic Focus**: Displays only high-level, actionable intelligence - not operational minutiae
4. **Visual Storytelling**: Uses gaming metaphors (quest logs, character sheets, world maps) to make data intuitive
5. **Real-time Intelligence**: Live updates and animations create a sense of urgency and importance

## Product Overview

### Target Users
- **Primary**: C-suite executives (CEO, CFO, Chief Risk Officer)
- **Secondary**: Board members, Senior risk managers
- **Access Level**: `SUPER_ADMIN` and future `EXECUTIVE` role

### Core Value Proposition
1. **Instant Situational Awareness**: See the entire risk landscape at a glance
2. **Drill-Down Capability**: Navigate from strategic overview to tactical details in 2 clicks
3. **Relationship Visualization**: Immediately identify concentrated risks and conflicts of interest
4. **Proactive Alerts**: "Quest log" format transforms risks into actionable missions
5. **Decision Support**: Every visualization directly supports a business decision

## Technical Architecture

### Route Configuration
- **URL**: `/executive-dashboard`
- **Layout**: Full-screen responsive grid with collapsible sidebar
- **Authentication**: Requires `SUPER_ADMIN` or `EXECUTIVE` role

### Required Libraries

#### Core Visualization Libraries
1. **`deck.gl` with `react-map-gl`**
   - Purpose: WebGL-powered data visualization layers for the risk concentration map
   - Features: Renders thousands of data points, animated arc layers, heatmaps
   - Installation: `npm install deck.gl react-map-gl maplibre-gl`

2. **`react-force-graph-2d`**
   - Purpose: Physics-based force-directed graph for supplier constellation
   - Features: Dynamic relationship visualization, interactive nodes
   - Installation: `npm install react-force-graph-2d`

#### Supporting Libraries
- **`ApexCharts`**: For risk posture gauges (already in project)
- **`React-CountUp`**: For animated number displays
- **`Framer Motion`**: For component transitions (already in project)
- **`React-Leaflet`**: Base map functionality (already in project)

### Neumorphic Theme Integration Strategy

The dashboard must seamlessly integrate with the existing neumorphic design system. This requires special handling for canvas-based libraries:

#### CSS Bridge Pattern for Canvas Libraries
```typescript
// Helper function to extract CSS variables
const getCssVariable = (name: string): string => 
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

// Example: Applying theme to deck.gl layers
const scatterplotLayer = new ScatterplotLayer({
  id: 'suppliers',
  data: suppliers,
  getFillColor: (d) => {
    if (d.riskScore > 75) return hexToRgb(getCssVariable('--neumorphic-severity-critical'));
    if (d.riskScore > 50) return hexToRgb(getCssVariable('--neumorphic-severity-high'));
    return hexToRgb(getCssVariable('--neumorphic-severity-low'));
  }
});

// Example: Custom canvas rendering for force graph
const handleNodeCanvasObject = (node, ctx, globalScale) => {
  // Apply neumorphic glow effect
  ctx.shadowColor = getCssVariable('--neumorphic-border');
  ctx.shadowBlur = 15;
  ctx.fillStyle = getCssVariable('--neumorphic-accent');
  
  // Draw glowing orb
  ctx.beginPath();
  ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
  ctx.fill();
};
```

## Component Specifications

### 1. RiskConcentrationMap - "World Map of Risk"

**Purpose**: Primary visual interface showing geographic distribution of supplier risk across South African mining operations.

**Key Features**:
- Dark-themed map of South Africa with all 9 provinces
- Animated mine site markers with risk-based color coding
- Thousands of supplier dots creating visual risk heatmaps
- Interactive drill-down with animated supply chain arcs

**Technical Implementation**:
```typescript
interface MapLayer {
  mineSites: {
    data: MineSite[];
    visualization: 'pulsing-markers';
    colorScale: 'risk-based'; // Green ’ Amber ’ Red
  };
  suppliers: {
    data: ExecutiveSupplierInfo[];
    visualization: 'scatterplot';
    opacity: 0.6;
    sizeScale: 'contract-value';
  };
  supplyChains: {
    data: 'dynamic'; // Generated on mine site click
    visualization: 'animated-arcs';
    animation: 'energy-flow';
  };
}
```

**Interactions**:
- **Hover**: Tooltip with site name, supplier count, aggregated risk
- **Click**: Zoom to site, reveal supplier network, update all dashboard components

### 2. RiskPostureGauges - "Character Sheet"

**Purpose**: Executive-level KPIs displayed as game-style health bars representing organizational risk posture.

**Key Metrics**:
1. **Financial Risk** (0-100)
2. **Compliance Risk** (0-100)
3. **Operational Risk** (0-100)
4. **Reputational Risk** (0-100)

**Visual Design**:
- Large radial gauges with animated fills
- Dynamic color gradients (green ’ amber ’ red)
- Central display with CountUp animation
- Neumorphic card container with inset styling

**Interactions**:
- **Click**: Activates global filter across all dashboard components
- **Hover**: Subtle scale animation indicating interactivity

### 3. ContextualDetailPanel - "Inventory & Stats"

**Purpose**: Dynamic sidebar providing contextual information based on user interactions with other components.

**Content States**:
1. **Default**: Company-wide overview
   - Total suppliers
   - Overall risk score
   - Top 3 active "quests"

2. **Mine Site Selected**: Location-specific portfolio
   - Site name and statistics
   - Aggregated risk metrics
   - Top 5 riskiest suppliers

3. **Entity Selected**: Detailed profile view
   - Supplier/Director 360° view
   - Risk factor breakdown
   - Action buttons

**Animations**:
- Content transitions with fade and slide effects
- Clear visual feedback for context changes

### 4. SupplierNetworkGraph - "Constellation of Suppliers"

**Purpose**: Visualize complex relationships between suppliers, directors, and Sibanye-Stillwater to identify concentrated risks and conflicts of interest.

**Node Types**:
1. **Central Node**: Sibanye-Stillwater (largest)
2. **Supplier Nodes**: Size = contract value, Color = risk score
3. **Director Nodes**: Small nodes showing board memberships

**Key Features**:
- Physics-based layout with constant subtle motion
- Relationship lines highlighting shared directorships
- Interactive filtering based on risk categories
- Custom canvas rendering for neumorphic glow effects

**Interactions**:
- **Hover**: Highlight node and first-degree connections
- **Click**: Re-center graph, update detail panel

### 5. StrategicEventFeed - "Quest Log"

**Purpose**: Transform risk events into actionable "quests" that executives can pursue.

**Event Types**:
- **Critical**: Immediate threats requiring C-suite attention
- **High**: Significant risks needing strategic decisions
- **Medium**: Important trends to monitor
- **Informational**: Positive updates and completed mitigations

**Event Structure**:
```typescript
interface StrategicEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  severity: EventSeverity;
  relatedEntityIds: string[];
  action: {
    label: string;
    type: 'DRILL_DOWN' | 'INITIATE_REVIEW';
  };
}
```

**Real-time Behavior**:
- New events animate in from top with pulsing glow
- Clicking an event triggers coordinated dashboard updates
- Auto-scrolling feed with fade-out at bottom

## Layout Specifications

### Desktop Layout (>1280px)
```
[  COLUMN 1-8  ] [  COLUMN 9-12 ]
+----------------+---------------+
|                |               |
| [World Map]    | [Risk Gauges] |
|                |               |
|                |---------------|
|                |               |
|                | [Detail Panel]|
|                |               |
+----------------+---------------|
|                |               |
| [Constellation]| [Quest Log]   |
|                |               |
+----------------+---------------+
```

### Responsive Behavior

**Tablet (768px - 1024px)**:
- Map takes full width at top
- 2x2 grid for other components below

**Mobile (<768px)**:
- Single column layout
- Priority order: Gauges ’ Events ’ Map ’ Graph
- Detail panel becomes full-screen modal

## Data Architecture

### Sample Data Structure

The dashboard is powered by interconnected data models that create a living ecosystem:

#### Mine Sites
```typescript
interface MineSite {
  id: string;
  name: string;
  province: SAProvince;
  coordinates: [number, number];
  metals: string[];
  aggregatedRiskScore: number; // Calculated from linked suppliers
  activeSuppliers: number;
}
```

#### Suppliers
```typescript
interface ExecutiveSupplierInfo {
  id: string;
  name: string;
  category: string;
  coordinates: [number, number];
  riskScore: number;
  contractValueZAR: number;
  directorIds: string[];
  linkedMineSiteIds: string[];
  riskFactors: {
    financial: number;
    compliance: number;
    operational: number;
    reputational: number;
  };
}
```

#### Directors
```typescript
interface Director {
  id: string;
  name: string;
}
```

### Data Relationships
- **Mine Sites ” Suppliers**: Many-to-many relationship via `linkedMineSiteIds`
- **Suppliers ” Directors**: Many-to-many relationship via `directorIds`
- **Risk Aggregation**: Mine site risk = weighted average of supplier risks
- **Network Effects**: Shared directors create risk concentration warnings

## Implementation Phases

### Phase 1: Core Infrastructure (Week 1-2)
1. Set up route and layout structure
2. Install and configure new libraries
3. Create base components with static data
4. Implement neumorphic theme bridges

### Phase 2: Interactive Features (Week 3-4)
1. Implement component interconnections
2. Add drill-down capabilities
3. Create animation sequences
4. Build filtering system

### Phase 3: Polish & Optimization (Week 5)
1. Performance optimization for large datasets
2. Mobile responsive refinements
3. Error boundaries and loading states
4. User testing and iterations

## Success Metrics

1. **Performance**:
   - Map renders 10,000+ supplier points at 60fps
   - Component updates complete in <100ms
   - Initial load time <3 seconds

2. **Usability**:
   - Any data point accessible in d3 clicks
   - Mobile experience maintains core functionality
   - Zero training required for navigation

3. **Business Impact**:
   - 50% reduction in time to identify risk concentrations
   - 75% faster executive decision-making
   - 90% user satisfaction score

## Future Enhancements

1. **AI-Powered Insights**: ML models predicting risk trends
2. **Real-time Data Integration**: Live API connections
3. **Collaborative Features**: Annotation and sharing capabilities
4. **Extended Visualizations**: 3D risk topography, timeline views
5. **Mobile App**: Native iOS/Android executive companion

## Appendix: Component File Structure

```
src/
   app/
      executive-dashboard/
          page.tsx
          layout.tsx
   components/
      executive/
          RiskConcentrationMap/
             index.tsx
             MapLayers.tsx
             styles.module.css
          RiskPostureGauges/
             index.tsx
             GaugeChart.tsx
          ContextualDetailPanel/
             index.tsx
             PanelStates.tsx
          SupplierNetworkGraph/
             index.tsx
             ForceGraphConfig.ts
             NodeRenderer.ts
          StrategicEventFeed/
              index.tsx
              EventItem.tsx
   lib/
       sample-data/
          executive-dashboard-data.ts
       executive/
           theme-bridge.ts
           risk-calculations.ts
```

## Conclusion

The VettPro Executive Dashboard represents a paradigm shift in how C-suite executives interact with risk data. By combining cutting-edge visualization technology with gamification principles and our distinctive neumorphic design system, we're creating not just a dashboard, but a strategic command center that transforms risk management from a reactive necessity into a proactive competitive advantage.

This PRD serves as the definitive guide for implementing this vision, ensuring every pixel and interaction serves the ultimate goal: empowering executives to make faster, better-informed decisions that protect and enhance shareholder value.