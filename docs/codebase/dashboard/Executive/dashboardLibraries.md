### New Libraries for the Executive Dashboard

#### **1. `deck.gl` with `react-map-gl`**

*   **Component:** `RiskConcentrationMap`
*   **Purpose:** To render advanced, WebGL-powered data visualizations on top of our existing map. While `react-leaflet` is great for base maps and markers, `deck.gl` is purpose-built for rendering large-scale data layers (like thousands of supplier dots) and complex animations (like the animated supply chain "Arc Layer").
*   **Why it's needed:**
    *   **Performance:** It can render tens of thousands of data points smoothly, which `react-leaflet` markers cannot.
    *   **Advanced Layers:** It provides pre-built, highly customizable layers like `ArcLayer` (for the animated flows), `ScatterplotLayer` (for the supplier dots), and `HeatmapLayer`.
    *   **3D Capabilities:** Allows for future enhancements like extruding bars from the map to represent risk or contract value.
*   **Installation:**
    ```bash
    npm install deck.gl react-map-gl maplibre-gl
    ```
    *(Note: `react-map-gl` is the recommended React wrapper for managing the map state for `deck.gl`)*

*   **Neumorphic Theme Integration (The CSS Bridge):**
    `deck.gl` renders to a canvas, so direct CSS styling is limited. However, its tooltips are HTML elements, which we can style.
    1.  **Colors:** All layer colors (arcs, dots, heatmaps) will be defined programmatically. When creating a layer, we will pass in color values directly from our CSS custom properties.
        ```typescript
        // Example of passing theme colors to a Deck.gl layer
        import { ScatterplotLayer } from '@deck.gl/layers';

        const getCssVariable = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

        const layer = new ScatterplotLayer({
          id: 'supplier-scatterplot',
          data: suppliers,
          getPosition: d => d.coordinates,
          getFillColor: d => {
            // Programmatically set color based on risk score and theme
            if (d.riskScore > 75) return hexToRgb(getCssVariable('--neumorphic-severity-critical'));
            if (d.riskScore > 50) return hexToRgb(getCssVariable('--neumorphic-severity-high'));
            // ... etc
          },
          // ... other props
        });
        ```
    2.  **Tooltips:** `deck.gl` provides a `getTooltip` function that can return custom HTML. We will use this to create tooltips that are wrapped in our `NeumorphicCard` component, ensuring they perfectly match the application's theme.
    3.  **Map Controls:** The zoom and pan controls provided by `react-map-gl` are HTML elements. We will target their CSS classes directly in `neumorphic.css` to apply our button styles, just as we did for Leaflet.

#### **2. `react-force-graph-2d` or `d3-force`**

*   **Component:** `SupplierNetworkGraph`
*   **Purpose:** To create the dynamic, physics-based "Constellation" graph that visualizes the complex relationships between suppliers and directors.
*   **Why it's needed:** Standard charting libraries cannot create force-directed graphs. This requires a specialized physics simulation engine to position nodes and links in an organic, readable way. `d3-force` is the industry standard engine, and `react-force-graph-2d` is an excellent React wrapper for it.
*   **Installation:**
    ```bash
    npm install react-force-graph-2d
    # or for more control:
    npm install d3-force d3-drag d3-selection
    ```

*   **Neumorphic Theme Integration (The CSS Bridge):**
    This library typically renders to an HTML5 Canvas, which presents a similar challenge to `deck.gl`. The key is to use its custom rendering capabilities.
    1.  **Custom Node Rendering:** The library allows you to provide a custom function to draw each node. Instead of drawing a simple circle, our function will:
        *   Draw a base circle with a color from our Neumorphic palette (`--neumorphic-button`).
        *   Apply a programmatic "glow" or "shadow" effect using the canvas's `shadowBlur` and `shadowColor` properties, with colors derived from our CSS variables (`--neumorphic-accent`, `--neumorphic-border`).
        *   This will simulate the soft, glowing orb look of our design system directly on the canvas.
        ```typescript
        // Example of a custom node rendering function
        const handleNodeCanvasObject = (node, ctx, globalScale) => {
          const label = node.name;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;

          // Neumorphic styling on the canvas
          ctx.shadowColor = getCssVariable('--neumorphic-border');
          ctx.shadowBlur = 15;
          ctx.fillStyle = getCssVariable('--neumorphic-accent');
          
          // Draw the glowing orb
          ctx.beginPath();
          ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
          ctx.fill();

          // Draw the text
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = getCssVariable('--neumorphic-text-primary');
          ctx.fillText(label, node.x, node.y + 10);
        };
        ```
    2.  **Custom Link Rendering:** Similarly, the function to draw links between nodes will use our `--neumorphic-text-secondary` color and apply a subtle transparency to appear less prominent than the nodes.
    3.  **Tooltips:** The library supports custom HTML tooltips. Just like with `deck.gl`, we will wrap tooltip content in our `NeumorphicCard` component to ensure a perfectly themed appearance.
    4.  **Background:** We will set the canvas background to be transparent and place it on top of a `div` styled with our `--neumorphic-bg` variable, ensuring it matches the rest of the application.

### Summary of Integration Strategy

| Library | Component | Integration Method | Key Challenge | Solution |
| :--- | :--- | :--- | :--- | :--- |
| **`deck.gl`** | `RiskConcentrationMap` | Programmatic Styling & Custom HTML Overlays | Rendering massive datasets performantly while matching the theme. | Use `deck.gl` for WebGL performance. Pass CSS variable colors into layer props. Use custom HTML for tooltips. |
| **`react-force-graph-2d`** | `SupplierNetworkGraph` | Custom Canvas Rendering & HTML Tooltips | Simulating neumorphic effects (soft shadows, glows) on a 2D canvas. | Use canvas `shadowBlur` and `shadowColor` properties. Draw nodes as glowing orbs. Use custom HTML for tooltips. |
