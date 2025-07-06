### Definitive Component Breakdown: The VettPro Executive "War Room" Dashboard

This dashboard is designed as a single, immersive screen. The components are not just widgets; they are interconnected parts of a strategic narrative.

#### **1. The "World Map" of Risk (Interactive Geographic Intelligence)**

*   **Component Name:** `RiskConcentrationMap`
*   **Library:** `React-Leaflet` for the base map, enhanced with `Deck.gl` for the data visualization layers.
*   - **PRD Reference:** `vettPro-execdashboard02.md` - "Interactive Map of South Africa"
*   **Functionality & Information Displayed:**
    *   The component will render a high-fidelity, dark-themed map of South Africa, covering all 9 provinces.
    *   **Zones of Interest:** The key provinces (North West, Limpopo, Gauteng, Free State) will be subtly highlighted with a faint, pulsing purple border (`--neumorphic-border`) to draw the eye.
    *   **Mine Site Markers:** Major Sibanye-Stillwater mine sites (Marikana, Rustenburg, Driefontein, etc.) will be represented by unique, neumorphic-styled icons. The color of the icon's glow will represent the *aggregated risk score* of all suppliers operating at that site (Green -> Amber -> Red).
    *   **Supplier Data Layer:** A `Deck.gl` layer will render thousands of individual suppliers as small, semi-transparent dots on the map, color-coded by their individual risk score. This creates a visual "heatmap" of risk across the country.
*   **Drill-Down Capabilities:**
    *   **Hovering a Mine Site:** A tooltip appears showing the site name, the number of active suppliers, and the overall aggregated risk score.
    *   **Clicking a Mine Site:** The map zooms in. The individual supplier dots around that mine become more prominent. A `Deck.gl` "Arc Layer" animates, drawing lines from the mine to the supplier locations, visually representing the supply chain network for that site. The sidebar panel (Component #3) updates to show a portfolio review specifically for that mine's suppliers.
*   **Animation & Effects:**
    *   **Initial Load:** The map tiles fade in, the provincial zones pulse into view, and the mine site markers appear with a subtle "drop-in" animation.
    *   **Data Flow:** The "Arc Layer" lines will animate as if energy is flowing from the supplier to the mine, with the speed and color of the pulse indicating the value or risk of that supply line.
    *   **Neumorphic Theme Integration:** The map will use a custom dark tile layer. All popups and controls will use the established `neumorphic-map-popup` styles. The `Deck.gl` layers will use our `--neumorphic-severity-*` color variables.

#### **2. The "Character Sheet" (Overall Risk Posture Gauges)**

*   **Component Name:** `RiskPostureGauges`
*   **Library:** `ApexCharts` (Radial Bar / Gauge charts) and `React-CountUp` for animated numbers.
*   **PRD Reference:** `vettPro-execdashboard02.md` - "Key Risk Indicators (KRIs)"
*   **Functionality & Information Displayed:**
    *   This is a set of 4 large, prominent `CircularProgressRing` / Gauge charts, representing the "health bars" of the company.
    *   Each gauge corresponds to the risk categories we defined:
        1.  **Financial Risk:** Score from 0-100.
        2.  **Compliance Risk:** Score from 0-100.
        3.  **Operational Risk:** Score from 0-100.
        4.  **Reputational Risk:** Score from 0-100.
    *   The color of each gauge's progress bar will change dynamically based on its value (Green for low risk, transitioning to Red for high risk).
    *   Inside each gauge, the precise numerical score will be displayed using `React-CountUp` to animate changes.
*   **Drill-Down Capabilities:**
    *   **Clicking a Gauge (e.g., "Financial Risk"):** This acts as a filter for the entire dashboard. The "World Map" will update to show only financial risk hotspots. The "Constellation" (Component #4) will re-arrange to highlight suppliers with the highest financial risk. The "Quest Log" (Component #5) will update to show the top 5 financial risk events.
*   **Animation & Effects:**
    *   **On Load:** The gauges animate, filling up from 0 to their current value. The numbers count up rapidly.
    *   **On Data Update:** The gauge needles/bars smoothly animate to their new positions, and the numbers adjust with the `CountUp` effect.

#### **3. The "Inventory & Stats" Panel (Contextual Data Sidebar)**

*   **Component Name:** `ContextualDetailPanel`
*   **Library:** Standard `React` components, `Framer Motion` for transitions.
*   **PRD Reference:** `vettPro-execdashboard02.md` - "Drill-Down Detail Panel"
*   **Functionality & Information Displayed:**
    *   A sidebar panel that is initially collapsed or shows a high-level summary. Its content is *entirely driven by user interactions* with other components.
    *   **Default State:** Shows a company-wide overview: Total Suppliers, Overall Risk Score, Top 3 Active "Quests" (high-risk events).
    *   **On Mine Site Click:** The panel title changes to the mine's name (e.g., "Marikana Operations Portfolio"). It displays aggregated stats for that site's suppliers and lists the top 5 riskiest suppliers specific to that location.
    *   **On Constellation Node Click:** The panel updates to show the detailed profile of the selected supplier or director (the "Supplier 360° View" from the main PRD, but condensed for this dashboard).
*   **Drill-Down Capabilities:**
    *   This component *is* the drill-down. It's the destination for drill-down actions from other components. It contains further links to the full operational pages (e.g., a "View Full Profile" button that navigates to `/suppliers/[id]`).
*   **Animation & Effects:**
    *   When its content updates, the old content fades out, and the new content fades in with a subtle slide effect, managed by `<AnimatePresence>`. This gives the user clear feedback that their interaction with the map or graph has changed the context.

#### **4. The "Relationship Web" (Supplier Constellation Graph)**

*   **Component Name:** `SupplierNetworkGraph`
*   **Library:** `React-Force-Graph` or a similar D3-based library.
*   **PRD Reference:** `vettPro-execdashboard01.md` - "Constellation of Suppliers"
*   **Functionality & Information Displayed:**
    *   A dynamic, physics-based force-directed graph visualizing the relationships between entities.
    *   **Nodes:**
        *   Large central node: "Sibanye-Stillwater".
        *   Medium nodes: Key suppliers. The size of the node represents the supplier's contract value. The color represents their risk score.
        *   Small nodes: Directors associated with those suppliers.
    *   **Links:** Lines connecting directors to the companies they serve on. If a director sits on the board of multiple suppliers, this will be immediately visible, highlighting potential conflicts of interest or concentrated influence.
*   **Drill-Down Capabilities:**
    *   **Hovering a Node:** A tooltip appears with the name and risk score. The node and its direct connections are highlighted, while the rest of the graph dims.
    *   **Clicking a Node (Supplier or Director):** The graph re-centers on that node. The `ContextualDetailPanel` (Component #3) updates to show the detailed profile for the selected entity.
*   **Animation & Effects:**
    *   The graph is constantly in a state of subtle, slow motion, making it feel alive.
    *   When a filter is applied (e.g., by clicking a risk gauge), nodes that don't match the filter can gently drift to the periphery or fade in opacity, while matching nodes are pulled towards the center.
    *   **Neumorphic Theme Integration:** Nodes will be styled as soft, glowing orbs rather than flat circles. Links will be subtle, glowing lines. This will require a custom rendering function passed to the graph library, bridging its canvas/SVG output with our design system.

#### **5. The "Quest Log" (Actionable Risk Events Feed)**

*   **Component Name:** `StrategicEventFeed`
*   **Library:** Standard `React` components, `Framer Motion` for list animations.
*   **PRD Reference:** `vettPro-execdashboard01.md` - "Dynamic Quest Log"
*   **Functionality & Information Displayed:**
    *   A real-time, scrolling feed of the most critical, high-level risk events across the entire organization. This is not for low-level events; it's for strategic "quests."
    *   Each item in the feed represents a significant event, for example:
        *   "**Adverse Finding:** A key director at 'ABC Mining' has been flagged in international media."
        *   "**Compliance Failure:** 5 suppliers at the Rustenburg site have let their COID certificates expire this week."
        *   "**Concentration Risk:** 'Director X' now sits on the board of 4 critical suppliers."
*   **Drill-Down Capabilities:**
    *   Each event is a clickable item.
    *   **Clicking an Event:** Triggers a coordinated update across the dashboard. For example, clicking the "Compliance Failure" event would:
        1.  Filter the "World Map" to show only the 5 non-compliant suppliers at Rustenburg.
        2.  Filter the "Constellation" to highlight those 5 suppliers.
        3.  Update the `ContextualDetailPanel` with a "Request Portfolio Review" button.
*   **Animation & Effects:**
    *   When a new, critical event occurs in real-time, it animates into the top of the list, pushing the others down. The new item will have a temporary, pulsing glow to draw the executive's eye.

This set of components, working in concert, directly translates your "WoW Journey" concept into a tangible, interactive, and strategically valuable Executive Dashboard.