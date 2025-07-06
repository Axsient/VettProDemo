### **Definitive Design & UX Specification: The Executive Dashboard**

**Page Route:** `/executive-dashboard`
**Access Role:** `SUPER_ADMIN` (and a future `EXECUTIVE` role)

#### **1. Overall Layout & Visual Philosophy**

*   **Design Intent:** To create an immersive, high-tech "command center" experience that feels more like a live intelligence interface than a static report. The layout is designed to guide the executive's eye from a high-level strategic overview down to specific, actionable details. The entire dashboard is a single, interconnected ecosystem where an interaction in one component dynamically updates the context of all others.
*   **Layout Structure:** A full-screen, responsive CSS Grid layout. The standard `CurvedSidebar` will be present but collapsed by default to maximize screen real estate for the dashboard content. The `TopMenuBar` will also be present.
*   **Background:** The entire page background will use the animated wave effect from `globals.css` to create a sense of dynamism and depth.

**Wireframe (Desktop View - `>1280px`):**

A 12-column grid is used for precise placement.

```
[  COLUMN 1-8  ] [  COLUMN 9-12 ]
+----------------+---------------+
|                |               |
| [1. World Map] | [2. Risk     ] |
|                | [   Gauges   ] |
|                |               |
|                |---------------|
|                |               |
|                | [3. Context  ] |
|                | [   Panel    ] |
|                |               |
+----------------+---------------|
|                |               |
| [4. Constellation] | [5. Quest  ] |
|                | [   Log      ] |
|                |               |
+----------------+---------------+
```

---

#### **2. Component Placement & Detailed Specification**

**Component 1: `RiskConcentrationMap` ("World Map")**
*   **Placement:** Occupies the largest visual area, the top-left quadrant (Grid columns 1-8, Rows 1-2). This is the hero component.
*   **Visuals:**
    *   A dark-themed map fills the entire component area.
    *   The "Zones of Interest" (key provinces) have a faint, pulsing purple outline (`--neumorphic-border`).
    *   Mine site markers are rendered as neumorphic icons with a colored `drop-shadow` filter that pulses gently. The color is determined by the `aggregatedRiskScore`.
    *   The `deck.gl` layer of supplier dots is visible but subtle, with low opacity.
*   **Interactions:**
    *   **On Hover (Mine Site):** A `NeumorphicCard` tooltip (styled via custom HTML) appears, showing the site name and aggregated risk score. The marker's glow intensifies.
    *   **On Click (Mine Site):**
        1.  **Map Animation:** The map smoothly pans and zooms to center on the clicked mine site using `react-leaflet`'s animation controls.
        2.  **Data Layer Animation:** The supplier dots around the mine increase in opacity and size. The `deck.gl` "Arc Layer" animates, drawing curved lines from the mine to its suppliers.
        3.  **Dashboard Update:** The `ContextualDetailPanel` (Component 3) and `StrategicEventFeed` (Component 5) instantly update their content to reflect the context of the selected mine.

**Component 2: `RiskPostureGauges` ("Character Sheet")**
*   **Placement:** Top-right quadrant (Grid columns 9-12, Row 1). This provides the main KPIs at a glance.
*   **Visuals:**
    *   A `NeumorphicCard` with an `inset` style contains a 2x2 grid of the four large `ApexCharts` radial gauge components.
    *   Each gauge has a clear title: "Financial Risk," "Compliance Risk," etc.
    *   The gauge's track is a semi-transparent `--neumorphic-text-secondary`. The value bar is a gradient that shifts from green to amber to red based on the score.
    *   The central number uses `React-CountUp` and is styled as a large, bold `H2`.
*   **Interactions:**
    *   **On Hover (Gauge):** The gauge's shadow deepens, and the component subtly scales up (`transform: scale(1.02)` via Framer Motion) to indicate it's clickable.
    *   **On Click (Gauge - e.g., "Financial Risk"):**
        1.  **Filter Activation:** The clicked gauge remains highlighted (e.g., with a persistent purple border).
        2.  **Dashboard Update:** All other components on the dashboard filter their data to show only information relevant to financial risk. The `RiskConcentrationMap` might show a heatmap of financial risk instead of overall risk. The `SupplierNetworkGraph` will highlight suppliers with high financial risk. The `StrategicEventFeed` will filter to show only financial-related events.

**Component 3: `ContextualDetailPanel` ("Inventory & Stats")**
*   **Placement:** Mid-right quadrant (Grid columns 9-12, Row 2), directly below the gauges.
*   **Visuals:**
    *   A `NeumorphicCard` with a subtle `glassmorphism` effect.
    *   It contains a title, a list of stats, and a primary action button. The content is entirely dynamic.
*   **Interactions:**
    *   This component is primarily a *target* for interactions from other components. It has no primary actions of its own, other than links within its dynamic content.
    *   **Content Transition Animation:** When another component (like the map) updates this panel's context, the existing content will animate out (fade and slide down) and the new content will animate in (slide up and fade in) using `<AnimatePresence>`. This provides clear feedback that the context has changed.

**Component 4: `SupplierNetworkGraph` ("Constellation")**
*   **Placement:** Bottom-left quadrant (Grid columns 1-8, Row 3).
*   **Visuals:**
    *   Renders on a transparent canvas, placed inside a `NeumorphicCard`.
    *   Nodes are rendered as soft, glowing orbs using the custom canvas rendering function. The color is based on risk score, and the size on contract value.
    *   Links are thin, semi-transparent lines.
    *   The entire graph has a slow, constant, gentle physics-based movement to feel "alive."
*   **Interactions:**
    *   **On Hover (Node):** A `NeumorphicCard` tooltip appears. The hovered node and its immediate connections (1st-degree links) brighten and increase in size, while all other nodes and links in the graph fade to a lower opacity.
    *   **On Click (Node):**
        1.  **Graph Animation:** The graph re-centers, bringing the clicked node and its neighbors to the forefront.
        2.  **Dashboard Update:** The `ContextualDetailPanel` updates to show the detailed profile of the clicked supplier or director.

**Component 5: `StrategicEventFeed` ("Quest Log")**
*   **Placement:** Bottom-right quadrant (Grid columns 9-12, Row 3).
*   **Visuals:**
    *   A `NeumorphicCard` containing a vertically scrolling list.
    *   Each list item is a small card, with a colored border on the left indicating its severity (`Critical`=Red, `High`=Amber, etc.).
    *   The list has a "fade-out" effect at the bottom to indicate more content is available on scroll.
*   **Interactions:**
    *   **On Hover (List Item):** The item's background subtly highlights, and it lifts slightly.
    *   **On Click (List Item):** This is a "global filter" action.
        1.  **Dashboard Update:** All other components (Map, Gauges, Constellation, Panel) immediately filter their views to the context of this event. For example, clicking a "Compliance Failure" event will highlight the 5 failing suppliers on the map, in the graph, and list them in the detail panel.
    *   **Real-time Update Animation:** When a new event arrives, it animates into the top of the list using Framer Motion's `layout` animation, smoothly pushing the other items down.

#### **3. Responsive Design Behavior**

*   **Tablet (`max-width: 1024px`):**
    *   The layout collapses. The `RiskConcentrationMap` takes the full width at the top.
    *   The `RiskPostureGauges` and the `ContextualDetailPanel` form a two-column grid below the map.
    *   The `SupplierNetworkGraph` and `StrategicEventFeed` form a two-column grid at the bottom.
*   **Mobile (`max-width: 768px`):**
    *   The layout becomes a **single vertical column**. The order of components is critical for usability:
        1.  `RiskPostureGauges` (most important KPIs first).
        2.  `StrategicEventFeed` (most recent actionable items).
        3.  `RiskConcentrationMap` (still interactive, but smaller).
        4.  `SupplierNetworkGraph` (simplified view, possibly with fewer nodes visible by default).
    *   The `ContextualDetailPanel` is removed from the main view. Instead, clicking on any item (a map pin, a graph node) will open a full-screen `Dialog` modal containing the drill-down details. This is a crucial pattern for maintaining usability on small screens.