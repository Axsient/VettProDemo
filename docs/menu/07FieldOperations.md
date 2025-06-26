### Component Inventory & Build Plan

Here is a detailed breakdown of the components required for the enhanced "Field Operations" menu, categorizing them into what you have and what you need to build.

### Part 1: Existing Components You Will Reuse (You have these)

Your `uiComponentsGuide.md`, `project-doc.md`, and `page.tsx` show you already have a powerful set of reusable components. You will use these extensively.

*   **`NeumorphicCard`**: The main container for every dashboard panel, section, and modal content area.
*   **`NeumorphicBackground`**: The base for every page.
*   **`NeumorphicButton` / `<Button variant="neumorphic-outline">`**: Your primary action buttons. The `neumorphic-outline` variant with its hover/active states is perfect.
*   **`NeumorphicStatsCard`**: Perfect for the "Field Operations Dashboard" KPIs.
*   **`NeumorphicDataTable` / `SimpleDataTableDemo`**: The core of all your queues and databases (Community Members, Verification Queue, etc.). Your `DataTableDemo` is advanced enough for most needs.
*   **`NeumorphicBadge`**: For all status indicators (e.g., Pending, Approved, Flagged).
*   **`SAIdInput`, `AddressInput`, `PhoneInput`**: Essential for the "Onboard New Community Member" form.
*   **`Input` (Neumorphic variant)**: For all standard text inputs.
*   **`Dialog` (Neumorphic variant)**: For detailed views, like the "Review Submissions" modal.
*   **ApexCharts Wrappers (`VettingLineChartsDemo`, etc.)**: Templates for building your dashboard charts.
*   **`LazyLoad`**: Crucial for performance, especially for loading maps and heavy charts.

### Part 2: New Components to Build (Your "Clear Path")

Here is your prioritized build list. I'll provide the purpose, recommended technology, and a clear implementation path for each.

#### 1. `NeumorphicTabs` (Build First - Foundational)

*   **Purpose:** To organize the sub-sections within "Community Canvassing" and "Business Location Verification" without cluttering the sidebar.
*   **Recommended Tech:** **Radix UI Tabs Primitives** (`@radix-ui/react-tabs`).
*   **Implementation Path:**
    1.  Install Radix UI: `npm install @radix-ui/react-tabs`.
    2.  Create a new component: `src/components/ui/neumorphic/NeumorphicTabs.tsx`.
    3.  Structure your component using `Tabs.Root`, `Tabs.List`, `Tabs.Trigger`, and `Tabs.Content` from Radix.
    4.  **Styling is key:**
        *   `Tabs.List`: Style this as a subtle, recessed bar within a `NeumorphicCard`. Use `border-b` with a color like `var(--neumorphic-border)` but with low opacity.
        *   `Tabs.Trigger` (Inactive State): Should be visually flat with `neumorphic-text-secondary` color. No shadow.
        *   **`Tabs.Trigger[data-state='active']` (Active State):** This is where you apply the neumorphic magic.
            *   Set `color: var(--neumorphic-text-primary)`.
            *   Add a `border-bottom` with a solid `var(--neumorphic-border)` color.
            *   Give it a `box-shadow: var(--neumorphic-shadow-convex-sm)` to make it pop *out* slightly, signifying it's the active, raised tab.
*   **Usage Example:**
    ```tsx
    // Inside your Community Canvassing page
    <NeumorphicTabs defaultValue="database">
      <NeumorphicTabs.List>
        <NeumorphicTabs.Trigger value="database">Community Database</NeumorphicTabs.Trigger>
        <NeumorphicTabs.Trigger value="onboard">Onboard New Member</NeumorphicTabs.Trigger>
        <NeumorphicTabs.Trigger value="review">Review Submissions</NeumorphicTabs.Trigger>
      </NeumorphicTabs.List>
      <NeumorphicTabs.Content value="database">
        <CommunityMembersDatabase />
      </NeumorphicTabs.Content>
      <NeumorphicTabs.Content value="onboard">
        <OnboardNewMemberForm />
      </NeumorphicTabs.Content>
      {/* ...etc */}
    </NeumorphicTabs>
    ```

#### 2. `InteractiveMap` (Major Component)

*   **Purpose:** The visual core of the Field Ops Dashboard, Location Verification, and Geofence Management.
*   **Recommended Tech:** **React Leaflet**. It's powerful, open-source, and you've already considered it.
*   **Implementation Path:**
    1.  Install libraries: `npm install react-leaflet leaflet` and `@types/leaflet`.
    2.  **Handle Next.js SSR:** Leaflet directly manipulates the DOM, so it won't work with Server-Side Rendering. You **must** load your map component dynamically.
    3.  Create `src/components/maps/InteractiveMap.tsx`.
    4.  Use `next/dynamic` to import it on any page:
        ```tsx
        const InteractiveMap = dynamic(() => import('@/components/maps/InteractiveMap'), {
          ssr: false,
          loading: () => <NeumorphicCard className="animate-pulse h-96" />
        });
        ```
    5.  Inside `InteractiveMap.tsx`, use `<MapContainer>`, `<TileLayer>`, `<Marker>`, and `<Popup>`.
    6.  **Styling:**
        *   The map's container should have a `border-radius` matching `var(--neumorphic-radius-lg)`.
        *   Style the `<Popup>` content to use your `NeumorphicText` and `NeumorphicBadge` components for a consistent look.
        *   Use custom SVG icons for markers to match your theme.

#### 3. `NeumorphicFileUpload` (Essential for Forms)

*   **Purpose:** To handle uploading ID documents, qualifications, and location photos.
*   **Recommended Tech:** This will be a custom component built with a standard `<input type="file">` and React state.
*   **Implementation Path:**
    1.  Create `src/components/forms/advanced/NeumorphicFileUpload.tsx`.
    2.  The component will render a styled dropzone area that looks like a `NeumorphicCard`.
    3.  This dropzone will be a `<label>` wrapping a hidden `<input type="file" multiple />`.
    4.  Use `onDragEnter`, `onDragLeave`, and `onDrop` event handlers to manage the file drop.
    5.  Use a `data-state` attribute (e.g., `data-state="dragging"`) to apply a visual effect when a file is dragged over it (e.g., a glowing `var(--neumorphic-border)`).
    6.  When files are selected/dropped, store them in a state array and display them below the dropzone in a list. Each list item can show the file name, size, and a remove button.

#### 4. `GeofenceEditor` (Extension of Map)

*   **Purpose:** Allows admins to draw and save operational zones on the map.
*   **Recommended Tech:** **react-leaflet-draw** plugin.
*   **Implementation Path:**
    1.  **First, ensure `InteractiveMap` is working.**
    2.  Install the drawing plugin: `npm install react-leaflet-draw leaflet-draw`.
    3.  Create a new component, `src/components/maps/GeofenceEditor.tsx`, which imports and uses your `InteractiveMap`.
    4.  Inside it, use the `<FeatureGroup>` and `<EditControl>` components from `react-leaflet-draw`.
    5.  Implement the `onCreated` handler to capture the `layer.toGeoJSON()` data of the new shape. This is the data you'll save to your database.
    6.  You will need to import the `leaflet-draw` CSS: `import 'leaflet-draw/dist/leaflet.draw.css'`. You can then override its styles in `custom.css` to make the control buttons look more neumorphic.

---

### Part 3: Compositional Patterns (Using the components you have/will build)

These aren't single new components but rather smart arrangements of your existing library to create the required features.

*   **Multi-Step "Onboard Member" Form:**
    *   **How:** Use state management (`useState` for simple cases, or Zustand/Context for complexity) to track the current step (`const [step, setStep] = useState(0)`).
    *   The form container is a single `<NeumorphicCard>`.
    *   Render the component for the current step (e.g., `Step1_PersonalDetails`, `Step2_UploadDocuments`).
    *   Use "Next" and "Back" `NeumorphicButton`s to update the `step` state.
*   **Detailed "Review Submission" View:**
    *   **How:** This will be a `<DialogContent variant="neumorphic">`.
    *   Inside the dialog, use a two-column grid layout.
    *   The left column contains the submitted data (`NeumorphicText`), the agent's notes, and the uploaded photos.
    *   The right column contains the `InteractiveMap` showing the client's geofence and the submitted GPS pin for easy comparison.
    *   The `<DialogFooter>` will contain the "Approve", "Flag", and "Reject" `NeumorphicButton`s.

### Summary: Your Development Roadmap

1.  **Build `NeumorphicTabs`:** This is a small but critical piece for organizing complex pages. Use Radix UI.
2.  **Build `NeumorphicFileUpload`:** This is essential for your core forms.
3.  **Implement the `InteractiveMap`:** Get a basic map rendering inside a `NeumorphicCard` using `next/dynamic`.
4.  **Compose the "Community Canvassing" pages:** Use your new `NeumorphicTabs`, the `NeumorphicDataTable`, and create the multi-step form pattern for onboarding.
5.  **Compose the "Business Location Verification" pages:** Use `NeumorphicTabs`, the `NeumorphicDataTable` for the queue, and create the `Dialog`-based review view with the `InteractiveMap`.
6.  **Enhance the Map with `GeofenceEditor`:** Once the core map is working, add the drawing capabilities.
7.  **Build the Dashboards and Management Pages:** Assemble the final Agent Management and Field Ops Dashboard pages using your full set of components.