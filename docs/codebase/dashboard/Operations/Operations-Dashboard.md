**VettPro Operations Dashboard**.

---



### **Definitive PRD & UX Specification: The Operations Dashboard**

**Page Route:** `/dashboard/operations` (or similar)
**Primary User:** Sarah the Risk Agent, and her manager.

#### **1. Overview & Design Intent**

*   **User Story:** "As a Risk Agent, I need a single, powerful command center that gives me a real-time, actionable overview of all active vetting cases, so I can instantly identify bottlenecks, prioritize my work, and execute tasks with maximum efficiency."
*   **Design Intent:** To create a "Triage & Action" funnel. The dashboard is not a passive report; it is an active workspace. The design prioritizes information density, clarity, and immediate actionability. The core of the page is the `Live Mission Control` data table, augmented by high-level KPIs for situational awareness and personalized task lists to guide the user's focus. Every element is designed to reduce clicks and surface critical information.

#### **2. Layout & Wireframe**

*   **Description:** A three-part layout designed to guide the user from a high-level overview to specific actions.
    ```
    - **Page Layout:** Full-width content area within the main DashboardLayout.
      - **[ROW 1: The "Situation Room" KPIs]** - A responsive grid of 4 NeumorphicCard components.
      - **[ROW 2: The "Mission Control" Hub]** - The main content area.
        - **Page Title:** "Operations Mission Control"
        - **Controls Bar:** A flex container with filters and bulk actions.
        - **Main Component:** The `LiveMissionControl` data table.
      - **[ROW 3: The "Intelligence Feed"]** - A scrolling feed of real-time operational events.
    ```

#### **3. Component Breakdown & Detailed Specification**

**Component 3.1: The "Situation Room" KPI Cards**
*   **Placement:** A single row at the very top of the page.
*   **Components:** A responsive grid of 4 `NeumorphicCard` components, each with an `inset` style.
*   **Content & Functionality:**
    1.  **Card 1: "Total Active Cases"**
        *   **Content:** A large number (e.g., "87") and the label "Active Cases".
        *   **Interaction:** Clicking this card resets all filters on the `LiveMissionControl` table below, showing all active cases.
    2.  **Card 2: "Pending Consent"**
        *   **Content:** A large number (e.g., "15") and the label "Pending Consent".
        *   **Styling:** The number is highlighted in an amber/yellow color (`--neumorphic-severity-medium`) to indicate a potential bottleneck.
        *   **Interaction:** Clicking this card filters the `LiveMissionControl` table to show only cases with the status `Consent Pending`.
    3.  **Card 3: "Overdue Tasks"**
        *   **Content:** A large number (e.g., "3") and the label "Overdue".
        *   **Styling:** The number is highlighted in a critical red color (`--neumorphic-severity-critical`) and has a subtle pulsing glow animation to draw immediate attention.
        *   **Interaction:** Clicking this card filters the `LiveMissionControl` table to show only cases where the `Est. Completion` date is in the past.
    4.  **Card 4: "Reports Ready for Review"**
        *   **Content:** A large number (e.g., "8") and the label "Ready for Review".
        *   **Styling:** The number is highlighted in a success green color (`--neumorphic-severity-low`).
        *   **Interaction:** Clicking this card filters the `LiveMissionControl` table to show only cases with the status `Complete` that are awaiting final approval.

**Component 3.2: The `LiveMissionControl` Data Table & Controls**
Note that we have a working data table that can be reused which is in the src/app/vetting-2/live-mission-board/page.tsx
*   **Placement:** The central, main component of the page.
*   **Component:** Your existing `NeumorphicDataTable` component, configured as seen in your `live-mission-board` screenshot.
*   **Controls Bar (Above the table):**
    *   **Search Input:** A `NeumorphicInput` with a `Search` icon. Filters the table in real-time (with debounce) based on `Case Number`, `Entity`, and `Assigned Officer`.
    *   **Bulk Action Buttons:** A series of `NeumorphicButton`s. These buttons are **disabled** by default and become **enabled** only when one or more rows are selected using the checkboxes.
        *   **`Assign Officer`:** Opens a `Dialog` with a `NeumorphicSelect` to assign a new officer to all selected cases.
        *   **`Update Priority`:** Opens a `Dialog` with a `NeumorphicSelect` to change the priority of all selected cases.
        *   **`Export Selected`:** Triggers a PDF/CSV export for the selected cases.
        *   **`Bulk Approve`:** (Requires confirmation `Dialog`) Approves all selected cases that are in a "Ready for Review" state.
    *   **View Controls:**
        *   **`Columns`:** A `Popover` with checkboxes to show/hide table columns.
        *   **`Density`:** A `NeumorphicRadioGroup` to switch between `Compact`, `Standard`, and `Comfortable` row spacing.
        *   **`Export`:** Exports the *currently visible* data in the table to CSV.
*   **Table Columns & Interactivity:**
    *   **`Checkbox`:** For row selection and bulk actions. A master checkbox in the header selects/deselects all visible rows.
    *   **`Case Number`:** Text. Clickable, navigates to the detailed case view.
    *   **`Entity`:** Text. Clickable, navigates to the `Supplier 360° View`.
    *   **`Status`:** The interactive `Badge` components as shown in your screenshot.
    *   **`Priority`:** A colored `Badge`.
    *   **`Progress`:** The visual progress bar component.
    *   **`Assigned Officer`:** Text.
    *   **`Primary Provider`:** Text (e.g., "MIE").
    *   **`Initiated` / `Est. Completion`:** Dates. Overdue dates are rendered in red text.
    *   **`Est. Cost`:** Currency formatted text.
    *   **`Actions` (The `...` button):** This is a `ContextMenu` trigger. Clicking it opens the menu with the following **fully functional** options:
        1.  **`View Details`:** Navigates to the full, detailed case page for this specific case.
        2.  **`View Timeline`:** Opens a `Dialog` modal that shows a vertical timeline of all events for this case (e.g., "Case Created," "Consent Sent," "Check A Completed," "Check B Failed").
        3.  **`View Dossier`:** Opens the `Interim Investigation Dossier` `Dialog` modal, as shown in your screenshot. This modal will be populated with the specific data for the selected case.
        4.  **`Edit Case`:** Opens a `Dialog` allowing the agent to edit key case details, like the assigned officer or priority.
        5.  **`Approve`:** (Enabled only if status is 'Ready for Review'). Triggers the approval workflow.
        6.  **`Reject`:** (Enabled only if status is 'Ready for Review'). Opens a `Dialog` requiring the agent to enter a reason for rejection.

**Component 3.3: The "Intelligence Feed"**
*   **Placement:** A distinct section below the `LiveMissionControl` table.
*   **Component:** A `NeumorphicCard` containing a vertically scrolling list.
*   **Content & Functionality:**
    *   A real-time feed of the last 10-15 operational events.
    *   **Example Events:**
        *   "**Consent Received:** Consent for case `VET-2024-001235` was just submitted digitally."
        *   "**Check Completed:** MIE CIPC check for `VET-2024-001234` is complete. Result: `Clear`."
        *   "**Adverse Finding:** MIE Criminal Check for `VET-2024-001236` returned an `Adverse` finding." (This item would be highlighted in red).
    *   **Interaction:** Every item in the feed is a clickable link that navigates to the corresponding case detail page.

---

#### **4. Dedicated Sample Data for the Operations Dashboard**

To power this dashboard, we need a new, dedicated sample data file. This data must be rich enough to populate every component and interaction.

**File Location:** `/src/lib/sample-data/operations-dashboard-data.ts`

```typescript
export interface OpsCase {
  id: string;
  caseNumber: string;
  entity: {
    id: string;
    name: string;
    type: 'Company' | 'Staff Medical' | 'Individual';
    identifier: string;
  };
  status: 'In Progress' | 'Partially Complete & Flagged' | 'Consent Pending' | 'Complete';
  priority: 'High' | 'Urgent' | 'Medium' | 'Low';
  progress: number; // e.g., 75 for 75%
  checksCompleted: string; // e.g., "3/5 Checks Complete"
  assignedOfficer: {
    id: string;
    name: string;
  };
  primaryProvider: 'MIE';
  initiatedDate: string; // ISO Date
  estCompletionDate: string; // ISO Date
  estCost: number;
  isOverdue: boolean;
}

export interface CaseTimelineEvent {
  id: string;
  timestamp: string;
  event: string;
  user: string;
  details?: string;
}

export interface CaseDossier {
  caseReference: string;
  entityType: string;
  priorityLevel: string;
  initiatedDate: string;
  assignedOfficer: string;
  reportGenerated: string;
  // Executive Summary data
  overallProgress: number;
  riskAssessment: 'Minimal' | 'Moderate' | 'High';
  checksCompleted: string;
  daysActive: number;
  currentStatus: string;
  overdueStatus: string;
  totalCost: number;
}

// Sample Data for the Live Mission Control Table
export const opsCases: OpsCase[] = [
  {
    id: 'case_001',
    caseNumber: 'VET-2024-001234',
    entity: { id: 'sup_001', name: 'Thabo Mthembu', type: 'Individual', identifier: '8503025432087' },
    status: 'In Progress',
    priority: 'High',
    progress: 75,
    checksCompleted: '3/5 Checks Complete',
    assignedOfficer: { id: 'user_01', name: 'Mike Stevens' },
    primaryProvider: 'MIE',
    initiatedDate: '2024-01-15',
    estCompletionDate: '2024-01-22',
    estCost: 1050,
    isOverdue: false,
  },
  {
    id: 'case_002',
    caseNumber: 'VET-2024-001235',
    entity: { id: 'sup_002', name: 'Johannesburg Mining Supplies (Pty) Ltd', type: 'Company', identifier: '2019/123456/07' },
    status: 'Partially Complete & Flagged',
    priority: 'Medium',
    progress: 60,
    checksCompleted: '3/5 Checks Complete',
    assignedOfficer: { id: 'user_02', name: 'Lisa Chen' },
    primaryProvider: 'MIE',
    initiatedDate: '2025-01-05',
    estCompletionDate: '2025-01-25',
    estCost: 1420,
    isOverdue: false,
  },
  {
    id: 'case_003',
    caseNumber: 'VET-2024-001236',
    entity: { id: 'sup_003', name: 'Sipho Ndlovu', type: 'Staff Medical', identifier: '8201156789012' },
    status: 'In Progress',
    priority: 'Urgent',
    progress: 50,
    checksCompleted: '2/4 Checks Complete',
    assignedOfficer: { id: 'user_03', name: 'Fatima Patel' },
    primaryProvider: 'MIE',
    initiatedDate: '2025-01-20',
    estCompletionDate: '2025-01-22',
    estCost: 1150,
    isOverdue: true, // This will make the date red
  },
  // ... add more cases to match the screenshot and cover all statuses
];

// Sample Data for the "View Timeline" drill-down for Case VET-2024-001234
export const caseTimeline_001: CaseTimelineEvent[] = [
    { id: 'evt_1', timestamp: '2025-01-15 09:00', event: 'Case Created', user: 'Sarah Jones', details: 'Initial pre-vetting for individual.'},
    { id: 'evt_2', timestamp: '2025-01-15 09:05', event: 'Consent Request Sent', user: 'System', details: 'Digital consent link sent to entity.'},
    { id: 'evt_3', timestamp: '2025-01-16 11:30', event: 'Consent Received', user: 'System', details: 'Digital signature submitted.'},
    { id: 'evt_4', timestamp: '2025-01-16 11:31', event: 'Checks Dispatched to MIE', user: 'System'},
    { id: 'evt_5', timestamp: '2025-01-17 14:00', event: 'Check Completed: ID Verification', user: 'MIE Webhook', details: 'Result: Clear'},
    { id: 'evt_6', timestamp: '2025-01-18 10:00', event: 'Check Completed: Criminal Record', user: 'MIE Webhook', details: 'Result: Clear'},
    { id: 'evt_7', timestamp: '2025-01-19 16:20', event: 'Check Completed: Credit Report', user: 'MIE Webhook', details: 'Result: Adverse - 1 Judgment'},
];

// Sample Data for the "View Dossier" drill-down for Case VET-2024-001234
export const caseDossier_001: CaseDossier = {
    caseReference: 'VET-2024-001234',
    entityType: 'Individual',
    priorityLevel: 'High',
    initiatedDate: '15 January 2025',
    assignedOfficer: 'Mike Stevens',
    reportGenerated: '2025/07/10', // Assuming current date
    // Executive Summary data
    overallProgress: 75,
    riskAssessment: 'Minimal', // This could be 'Moderate' due to adverse credit
    checksCompleted: '3 of 5',
    daysActive: 177,
    currentStatus: 'In Progress',
    overdueStatus: 'On Schedule',
    totalCost: 1050,
};
```

This comprehensive specification provides the decisive and complete blueprint needed to build the Operations Dashboard, leveraging your existing components while defining all new interactions and the data required to make them functional.