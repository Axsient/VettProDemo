### **The World-Class Module Blueprint Template (v2 Standard)**

**Instructions for Use:**
Copy and paste this entire template into a new markdown file for each new module or major feature you want to build (e.g., `12ReportingAndAnalytics.md`). Fill in the `[BRACKETED]` placeholders with the specific details for that module.

---

### **The Definitive Master Blueprint: The `[MODULE NAME, e.g., Reporting & Analytics Dashboard]`**

**Overarching Principle & The Grand Narrative:**
*(This is the most important section. Define the soul of the module here.)*

We are not building a series of `[generic module type, e.g., charts and tables]`. We are architecting a single, living ecosystem called the **`[Inspirational Module Name, e.g., VETTPRO Strategic Insights Engine]`**. Its purpose is to transform the abstract concept of `[module's core concept, e.g., "reporting"]` into a tangible, visual, and interactive `[user's new role, e.g., discovery tool for a business strategist]`.

The user is not a `[passive role, e.g., report viewer]`; they are a `[active, powerful role, e.g., data detective, strategic planner, risk forecaster]`. Every pixel, every animation, and every interaction must serve this narrative. The UI must feel intelligent, proactive, and deeply interconnected, as if it's a living partner in the user's workflow.

---

### **Phase 1: `[FEATURE 1 NAME, e.g., The Dynamic C-Suite Dashboard]`**

#### **Part 1.A: The Story & 'Wow' Factor**

**The Narrative:**
*(Describe the user's goal and mindset for this feature. What problem are they trying to solve? How should the UI make them feel?)*
Example: The user is a C-level executive who needs a 30,000-foot view of the entire supplier ecosystem's health. They have 60 seconds to understand the most critical risks. The interface cannot be a spreadsheet; it must be a beautifully summarized, high-impact briefing that tells them exactly where to focus their attention.

**The "Wow" Moments to Engineer:**

1.  **`[WOW FEATURE 1.1 NAME, e.g., The Interactive Risk Heatmap]`:**
    *(Describe the feature and why it's impressive. Focus on the visual and interactive elements.)*
    Example: A stunning, color-coded heatmap that plots supplier risk against business criticality. The user can visually identify high-risk, high-dependency suppliers instantly. **Hovering over a square** on the map causes it to glow, and a tooltip provides a summary. **Clicking the square** doesn't just open a list; it triggers a "Focus Mode" that reconfigures the entire dashboard around that risk segment.

2.  **`[WOW FEATURE 1.2 NAME, e.g., The "Ask VETTPRO" AI Search Bar]`:**
    *(Describe the next innovative feature.)*
    Example: This is not a keyword search; it's a natural language query bar. The user can type, **"Show me all suppliers in the logistics sector with a failing CIPC check in the last 6 months."** The system parses this query and generates a custom, on-the-fly report with the exact data requested. It feels like talking to a human analyst.

3.  **`[WOW FEATURE 1.3 NAME, e.g., The "What-If" Scenario Simulator]`:**
    *(Describe a third standout feature.)*
    Example: A set of sliders that allow a manager to simulate risk scenarios. "What if our risk tolerance for financial checks decreases by 10%?" As the user moves the slider, the charts and KPI cards on the dashboard **animate in real-time** to show how many suppliers would be re-classified as "High-Risk."

#### **Part 1.B: Ultra-Detailed Implementation Manual**

**Target File(s):**
`src/app/[module-path]/page.tsx` and the primary client component `src/components/[module-path]/[ComponentName].tsx`.

**Step 1.1: Prerequisite - Data Models & Sample Data**
*   **Action:** Define all necessary TypeScript interfaces in `src/types/[module-name].ts`.
*   **Action:** Create a rich, narrative-driven sample data file at `src/lib/sample-data/[module-name]Sample.ts`. This data MUST be crafted to specifically enable the "wow" moments described above. Include different archetypes and scenarios.

**Step 1.2: State Management for the Interactive Dashboard**
*   **File:** `src/components/[module-path]/[ComponentName].tsx`
*   **Action:** Define all necessary states at the top of the component (`useState`, `useMemo`). This includes states for filters, search queries, toggle switches, and any global context needed for focus modes.
    ```typescript
    "use client";
    import { useState, useMemo, useContext } from 'react';
    // ...
    export function [ComponentName]({ initialData }) {
      const [timeframeFilter, setTimeframeFilter] = useState('Last 90 Days');
      const [searchQuery, setSearchQuery] = useState('');
      const { focus, setFocus } = useContext(FocusContext); // Example of using a global context
      // ...
    }
    ```

**Step 1.3: Detailed Implementation of [WOW FEATURE 1.1]**
*   **Purpose:** To build the interactive heatmap.
*   **Library:** `[Name of library, e.g., ApexCharts, D3.js]`.
*   **Logic:** Detail the data transformation logic required to convert your sample data into the format needed by the charting library. Explain the `onClick` or `dataPointSelection` event handler.
    ```javascript
    // Example handler
    const handleHeatmapClick = (data) => {
      setFocus({ type: 'RiskSegment', id: data.segmentId });
    };
    ```
*   **UI & Animation:** Describe the exact CSS or `framer-motion` properties needed to achieve the "glow" on hover and the smooth transitions when the data updates.

**Step 1.4: Detailed Implementation of [WOW FEATURE 1.2]**
*   **Purpose:** To build the natural language search bar.
*   **Logic (Simulated):** For the demo, this will be a client-side parser. Create a helper function `parseNaturalLanguageQuery(query: string)`. This function will use regular expressions to look for keywords ("suppliers," "logistics sector," "failing CIPC") and return a filter object.
    ```javascript
    // Example parser
    const filters = parseNaturalLanguageQuery(searchQuery); // returns { industry: 'Logistics', failedChecks: ['CIPC'] }
    ```
*   **UI:** The search bar component will have an `onSubmit` handler that calls this parser and updates the main filter state, causing the entire dashboard to re-render with the results.

**(Continue this pattern for every feature and page in the module)**

---

### **Component Inventory & Build Plan**

#### **Existing Components to be Utilized:**
*   `NeumorphicCard`
*   `NeumorphicTable` (or manual implementation if needed)
*   `NeumorphicButton`
*   `NeumorphicTabs`
*   `CircularProgressRing`
*   `FlagBadge`
*   `(List every other component from your existing library that will be used)`

#### **New Components to be Built:**
*(Only list components that are truly new and reusable. Provide a full build plan for each.)*

**1. Component: `[NewComponentName].tsx`**
*   **Purpose:** `[A clear, one-sentence description of what this component does.]`
*   **Library Installation:** `[If any, e.g., npm install some-library]`
*   **File Path:** `src/components/[category]/[NewComponentName].tsx`
*   **Props Interface:**
    ```typescript
    interface [NewComponentName]Props {
      // ...define all props with types
    }
    ```
*   **Core Logic:** `[Detail the key internal state and logic, including any hooks like useState or useEffect.]`
*   **UI & Styling:** `[Describe the JSX structure and any specific, critical neumorphic styling or animations required.]`
*   **Test Snippet for `ui-elements` page:** Provide a self-contained JSX block that can be pasted into the UI elements page to test this component in isolation.

#### **Required Enhancements to Existing Components:**
*(List any modifications needed for components you already have.)*

1.  **Component: `NeumorphicDataTable`**
*   **Enhancement Required:** `[Describe the needed change, e.g., "Must be modified to accept and apply a `rowClassName` prop to enable the visual triage system."]`
*   **Implementation Detail:** `[Explain how to modify the component's props and internal rendering logic to accommodate the change.]`