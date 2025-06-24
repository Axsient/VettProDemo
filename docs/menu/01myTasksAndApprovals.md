 **"My Tasks & Approvals"** section under the main **"Dashboard"** menu. This is a critical area for a Super Admin, as it's their action center.

**Menu: Dashboard > My Tasks & Approvals**

**1. Purpose:**

This section serves as a centralized hub for the logged-in Super Admin to view, prioritize, and action all tasks, approval requests, and escalated items that require their direct attention or intervention. It ensures that critical items don't get missed and that workflows can proceed efficiently. For the demo, this will showcase how the system flags important items for high-level users.

**2. Sample Data Strategy:**

*   **Storage Location:**
    *   Create a dedicated file for this sample data: `src/lib/sample-data/adminTasksSample.ts`
    *   This keeps it organized and easy to replace with an API call later.
*   **Data Structure:**
    *   The data should be an array of objects, where each object represents a task or approval item.
    *   Define a TypeScript interface for these items in `src/types/index.ts` or a new `src/types/tasks.ts`.

    ```typescript
    // In src/types/tasks.ts (or index.ts)
    export enum TaskPriority {
      HIGH = 'High',
      MEDIUM = 'Medium',
      LOW = 'Low',
    }

    export enum TaskStatus {
      PENDING_ADMIN_REVIEW = 'Pending Admin Review',
      ACTION_REQUIRED = 'Action Required',
      INFORMATION_REQUESTED = 'Information Requested',
      APPROVED = 'Approved', // For demo, some might be already actioned
      REJECTED = 'Rejected', // For demo
    }

    export enum TaskType {
      RISK_ESCALATION = 'Risk Escalation',
      CONSENT_ISSUE = 'Consent Issue',
      OVERDUE_VERIFICATION = 'Overdue Verification',
      REPORT_APPROVAL = 'Report Approval',
      USER_ACCESS_REQUEST = 'User Access Request',
      SYSTEM_ALERT_REVIEW = 'System Alert Review',
      INVOICE_DISCREPANCY_APPROVAL = 'Invoice Discrepancy Approval',
    }

    export interface AdminTaskItem {
      id: string; // Unique ID for the task
      type: TaskType;
      subjectName: string; // e.g., Supplier Name, Individual Name, System Module
      subjectId?: string; // ID of the supplier, individual, report, etc.
      description: string; // Brief description of the task
      assignedDate: string; // ISO Date string
      dueDate?: string; // ISO Date string (optional)
      priority: TaskPriority;
      status: TaskStatus;
      assignedTo: string; // Should be the current Super Admin for demo purposes
      relatedLink?: string; // Path to navigate to the relevant section (e.g., /suppliers/[id])
      notes?: string; // Any additional notes or context
    }
    ```

*   **Sample Data Content (`src/lib/sample-data/adminTasksSample.ts`):**
    Create 10-15 diverse task items to showcase variety.

    ```typescript
    import { AdminTaskItem, TaskPriority, TaskStatus, TaskType } from '@/types/tasks';

    export const sampleAdminTasks: AdminTaskItem[] = [
      {
        id: 'task_001',
        type: TaskType.RISK_ESCALATION,
        subjectName: 'QuantumLeap Solutions (Pty) Ltd',
        subjectId: 'supplier_QLS001',
        description: 'High financial risk detected post-vetting. Multiple red flags on credit report. Requires immediate review and decision on supplier status.',
        assignedDate: '2025-06-20T10:00:00Z',
        dueDate: '2025-06-22T17:00:00Z',
        priority: TaskPriority.HIGH,
        status: TaskStatus.PENDING_ADMIN_REVIEW,
        assignedTo: 'SuperAdminUser',
        relatedLink: '/suppliers/supplier_QLS001/risk-analysis',
        notes: 'CFO has been notified. Awaiting your go/no-go.'
      },
      {
        id: 'task_002',
        type: TaskType.CONSENT_ISSUE,
        subjectName: 'Thabo Mbeki (Individual)',
        subjectId: 'ind_TM005',
        description: 'Digital consent for medical history check failed verification. Signature mismatch. Manual review of uploaded consent form needed.',
        assignedDate: '2025-06-21T09:15:00Z',
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.ACTION_REQUIRED,
        assignedTo: 'SuperAdminUser',
        relatedLink: '/vetting/consent-management/ind_TM005',
      },
      {
        id: 'task_003',
        type: TaskType.OVERDUE_VERIFICATION,
        subjectName: 'EcoBuild Construction CC',
        subjectId: 'supplier_EBC002',
        description: 'CIPC verification overdue by 3 days. API provider (MIE) reported intermittent issues. Follow up required.',
        assignedDate: '2025-06-18T14:00:00Z',
        dueDate: '2025-06-19T17:00:00Z', // Already past due
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.PENDING_ADMIN_REVIEW,
        assignedTo: 'SuperAdminUser',
        relatedLink: '/vetting/active-cases/supplier_EBC002',
        notes: 'Vetting officer attempted manual check, awaiting feedback.'
      },
      {
        id: 'task_004',
        type: TaskType.REPORT_APPROVAL,
        subjectName: 'Quarterly Supplier Risk Summary Q2 2024',
        subjectId: 'report_QSR002',
        description: 'Generated quarterly risk report requires final approval before distribution to stakeholders.',
        assignedDate: '2025-06-22T11:00:00Z',
        priority: TaskPriority.HIGH,
        status: TaskStatus.ACTION_REQUIRED,
        assignedTo: 'SuperAdminUser',
        relatedLink: '/reporting/standard-reports/report_QSR002',
      },
      {
        id: 'task_005',
        type: TaskType.USER_ACCESS_REQUEST,
        subjectName: 'Jane Doe (Procurement Officer)',
        subjectId: 'user_JD010',
        description: 'Request for elevated permissions to access invoice analysis module for Sibanye Gold project.',
        assignedDate: '2025-06-22T08:30:00Z',
        priority: TaskPriority.LOW,
        status: TaskStatus.PENDING_ADMIN_REVIEW,
        assignedTo: 'SuperAdminUser',
        relatedLink: '/administration/user-management/user_JD010',
      },
      {
        id: 'task_006',
        type: TaskType.SYSTEM_ALERT_REVIEW,
        subjectName: 'MIE API Connectivity',
        description: 'Multiple failed API calls to MIE over the last hour. Investigate potential outage or configuration issue.',
        assignedDate: '2025-06-22T14:00:00Z',
        priority: TaskPriority.HIGH,
        status: TaskStatus.ACTION_REQUIRED,
        assignedTo: 'SuperAdminUser',
        relatedLink: '/administration/platform-health',
        notes: 'Automated retry mechanism has failed 3 times.'
      },
      {
        id: 'task_007',
        type: TaskType.INVOICE_DISCREPANCY_APPROVAL,
        subjectName: 'Invoice INV00789 (Alpha Miners Ltd)',
        subjectId: 'invoice_AM00789',
        description: 'AI flagged 25% invoice value discrepancy vs. RFP for contract C0012. Requires manual review and approval/rejection of payment.',
        assignedDate: '2025-06-19T16:30:00Z',
        priority: TaskPriority.HIGH,
        status: TaskStatus.PENDING_ADMIN_REVIEW,
        assignedTo: 'SuperAdminUser',
        relatedLink: '/rfp-invoice/invoice-analysis/invoice_AM00789',
      },
      // ... add more tasks with varying priorities, statuses, and types
      {
        id: 'task_008',
        type: TaskType.RISK_ESCALATION,
        subjectName: 'Future Forward Tech',
        subjectId: 'supplier_FFT003',
        description: 'New supplier flagged for potential PEP involvement during initial screening. Needs urgent review.',
        assignedDate: '2025-06-22T15:00:00Z',
        priority: TaskPriority.HIGH,
        status: TaskStatus.PENDING_ADMIN_REVIEW,
        assignedTo: 'SuperAdminUser',
        relatedLink: '/suppliers/supplier_FFT003',
      },
    ];
    ```

*   **Data Fetching (Simulated):**
    In `src/app/dashboard/my-tasks-approvals/page.tsx` (or a similar server component that renders this section), you'll "fetch" this data.

    ```typescript
    // In src/app/dashboard/my-tasks-approvals/page.tsx (or a client component if interactive filtering is needed on client)
    import { sampleAdminTasks } from '@/lib/sample-data/adminTasksSample';
    import { AdminTaskItem } from '@/types/tasks';
    // ... other imports for UI components

    async function getAdminTasks(): Promise<AdminTaskItem[]> {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return sampleAdminTasks;
    }

    export default async function MyTasksAndApprovalsPage() {
      const tasks = await getAdminTasks();

      // ... rest of the component rendering the tasks
      return (
        // ... JSX using Neumorphic components to display tasks
      );
    }
    ```

**3. UI Components & Functionality:**

This page will primarily be a sophisticated data table within a `NeumorphicCard`.

*   **Main Container:**
    *   `NeumorphicCard`: Encloses the entire "My Tasks & Approvals" section.
    *   **Header:** A title like "My Tasks & Approvals" (`<h2>` or `<h3>` styled neumorphically).
    *   **Toolbar (above the table):**
        *   `NeumorphicInput` (with Lucide search icon): For free-text search across all task fields.
        *   `NeumorphicSelect` / `DropdownMenu` (shadcn/ui): For filtering by:
            *   Task Type (`TaskType` enum)
            *   Priority (`TaskPriority` enum)
            *   Status (`TaskStatus` enum)
        *   `NeumorphicButton` (with Lucide filter icon): To apply filters.
        *   `NeumorphicButton` (with Lucide refresh icon): To "refresh" the task list (simulated).
        *   Potentially a "Bulk Actions" `DropdownMenu` (e.g., "Mark as Reviewed," "Archive Selected" - for demo, these would just show a Sonner toast).

*   **Tasks Table (`NeumorphicTable` - enhanced shadcn/ui Table):**
    *   **Purpose:** Display the list of tasks.
    *   **Columns:**
        1.  **Priority:** Displayed visually (e.g., colored `NeumorphicBadge` or icon).
            *   High: Red
            *   Medium: Orange/Yellow
            *   Low: Blue/Green
        2.  **Task Type:** Text (`TaskType`).
        3.  **Subject:** `subjectName` (clickable if `relatedLink` exists, navigating to that page).
        4.  **Description:** `description` (can be truncated with a tooltip for full view).
        5.  **Assigned Date:** Formatted date (`assignedDate`).
        6.  **Due Date:** Formatted date (`dueDate`), highlighted if overdue.
        7.  **Status:** `NeumorphicBadge` with appropriate color for `TaskStatus`.
        8.  **Actions:** A column with `NeumorphicButton`s or a `DropdownMenu` (shadcn/ui `DropdownMenuTrigger` with a Lucide "more-horizontal" icon) per row:
            *   **View Details:** Opens a `NeumorphicDialog` (Modal) showing all task information, including `notes`.
            *   **Go to Item:** Navigates to `relatedLink` (if present).
            *   **Approve:** (Simulated - shows Sonner toast "Task Approved" and might optimistically update the row's status in the demo UI).
            *   **Reject:** (Simulated - shows Sonner toast "Task Rejected").
            *   **Request More Info:** (Simulated - opens a small modal to "type" a request).
            *   **Mark as Reviewed:** (Simulated - updates status).
    *   **Table Features:**
        *   **Sorting:** Clickable column headers to sort by Priority, Assigned Date, Due Date, Status.
        *   **Pagination:** If the sample data is large enough (e.g., >10 items).
        *   **Row Selection:** Checkboxes for potential bulk actions (though bulk actions might be out of scope for initial demo functionality beyond showing the UI).
        *   **Responsive Design:** Table should adapt to smaller screens (e.g., horizontal scrolling or card-based layout for rows on mobile).

*   **Modals / Dialogs (`NeumorphicDialog` - shadcn/ui Dialog styled neumorphically):**
    *   **View Task Details Modal:**
        *   **Triggered by:** "View Details" action button in the table.
        *   **Content:** Displays all fields of the `AdminTaskItem` in a well-formatted way. `NeumorphicCard` sections within the modal for clarity.
        *   **Actions:** "Close" button. Potentially primary action buttons like "Approve," "Reject" directly in the modal.
    *   **Confirmation Modals (`NeumorphicAlertDialog`):** For critical actions like "Approve" or "Reject" if not handled directly by a toast. "Are you sure you want to approve this task?"

*   **Notifications (`Sonner` with neumorphic variants):**
    *   Used to provide feedback for actions taken (e.g., "Task 'XYZ' approved successfully," "Filter applied," "Error: Could not perform action").

**4. Functionality to be Seen/Simulated for Demo:**

*   **Loading State:** When the page loads or filters are applied, show a `NeumorphicSkeleton` loader for the table area or a global page loader.
*   **Filtering:**
    *   User selects filter criteria from dropdowns/search.
    *   Clicking "Apply Filters" re-filters the `sampleAdminTasks` array and updates the table display.
*   **Sorting:**
    *   Clicking table headers sorts the displayed tasks.
*   **Navigation:**
    *   Clicking on a `subjectName` (if `relatedLink` exists) or "Go to Item" button should use Next.js `Link` or `router.push` to navigate to the placeholder page for that item (e.g., `/suppliers/supplier_QLS001/risk-analysis`). These target pages don't need to be fully functional for this specific "My Tasks" demo, but the navigation should work.
*   **Actions (Simulated):**
    *   Clicking "Approve," "Reject," "Mark as Reviewed" should:
        1.  Show a `Sonner` toast confirming the action.
        2.  (Optional for demo complexity) Optimistically update the status of that task in the displayed table. This makes the demo feel more interactive. The actual data in `sampleAdminTasks` won't change unless you implement client-side state management for the displayed list.
*   **Responsive Behavior:** Show how the table and toolbar adapt to different screen sizes.

**5. Adherence to Project Documentation:**

*   **Neumorphic Design:** All components (`NeumorphicCard`, `NeumorphicTable`, `NeumorphicButton`, `NeumorphicInput`, `NeumorphicSelect`, `NeumorphicDialog`, `NeumorphicBadge`, `NeumorphicProgress`, `NeumorphicSkeleton`) must use the defined neumorphic styling (multi-layer dark shadows, recessed inputs, consistent spacing, etc.) from `styles/themes/neumorphic.css`.
*   **Tailwind CSS:** Used for layout and any custom styling within components.
*   **TypeScript:** All data and props strictly typed.
*   **Lucide Icons:** Used for all icons.
*   **Accessibility:** Ensure keyboard navigation for the table and interactive elements, ARIA labels where appropriate.
*   **Performance:** Simulate loading states.
