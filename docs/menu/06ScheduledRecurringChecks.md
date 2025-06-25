**Menu: Vetting Operations > Scheduled & Recurring Checks**

**1. Purpose:**

This section provides a powerful interface for the Super Admin to create, manage, and monitor all automated, recurring vetting checks. It is designed to ensure continuous compliance and proactive risk monitoring for suppliers and key staff (e.g., annual CIPC checks, quarterly AML screenings, periodic credit reports). For the demo, this will showcase the system's "set it and forget it" capability, providing long-term value and reducing manual administrative overhead.

## ⚠️ **CRITICAL IMPLEMENTATION WARNING**

1.  **Date/Time Management:** All date calculations, especially for "Next Run Date," MUST be handled using a robust library like `date-fns` to avoid time zone and daylight saving errors. Do not use native `Date` objects for calculations.
2.  **UI Complexity:** This page can become cluttered. Prioritize clarity. The default view should be the "List View" (table). The "Calendar View" is an enhancement and should be implemented carefully to maintain performance.

**2. Reference Implementation Patterns:**

Before implementing, study these working examples for table structure and client-side state management:
- **UI Elements Page:** `src/app/dashboard/ui-elements/page.tsx` (lines 240-320) - "Recent Vetting Requests" table
- **Completed Reports:** `src/components/vetting/CompletedReportsTable.tsx` - Complete table implementation with search, filtering, and pagination.

**3. Required File Structure:**

```
src/
├── types/
│   └── scheduling.ts (create new file)
├── lib/sample-data/
│   └── scheduledChecksSample.ts (create new file)
├── app/vetting/scheduled-checks/
│   └── page.tsx (server component)
└── components/vetting/
    └── ScheduledChecksClient.tsx (client component for interactivity)
```

**4. Sample Data Strategy:**

*   **Storage Location:**
    *   Create a dedicated file: `src/lib/sample-data/scheduledChecksSample.ts`
*   **Data Structure:**
    *   Define TypeScript interfaces in a new file: `src/types/scheduling.ts`.

    ```typescript
    // In src/types/scheduling.ts
    import { VettingEntityType } from './vetting';
    import { RiskLevel } from './reports';

    export enum ScheduleFrequency {
      MONTHLY = 'Monthly',
      QUARTERLY = 'Quarterly',
      BI_ANNUALLY = 'Bi-Annually',
      ANNUALLY = 'Annually',
    }

    export enum ScheduleStatus {
      ACTIVE = 'Active',
      PAUSED = 'Paused',
      OVERDUE = 'Overdue',
      IN_PROGRESS = 'In Progress', // A check is currently running
      COMPLETED = 'Completed', // A one-time schedule that has run
    }

    export interface ScheduledCheckRunHistory {
      runDate: string; // ISO Date string
      outcome: RiskLevel;
      reportId: string; // Link to the generated CompletedVettingReport
    }

    export interface ScheduledCheckItem {
      scheduleId: string; // e.g., "SCH-001"
      subjectName: string; // Individual or Company Name
      subjectId: string; // SA ID, Company Reg No., etc.
      entityType: VettingEntityType;
      checkDefinitionId: string; // e.g., 'cipc_company_check'
      checkName: string; // Denormalized for display
      frequency: ScheduleFrequency;
      status: ScheduleStatus;
      startDate: string; // When the schedule was created/started
      lastRunDate?: string; // ISO Date string
      lastRunOutcome?: RiskLevel;
      nextRunDate: string; // ISO Date string
      notes?: string;
      runHistory: ScheduledCheckRunHistory[];
    }
    ```

*   **Sample Data Content (`src/lib/sample-data/scheduledChecksSample.ts`):**
    Create 10-15 diverse schedules. Use `date-fns` to calculate realistic dates based on the "early June 2025" context.

    ```typescript
    import { ScheduledCheckItem, ScheduleFrequency, ScheduleStatus } from '@/types/scheduling';
    import { VettingEntityType } from '@/types/vetting';
    import { RiskLevel } from '@/types/reports';
    import { formatISO, subMonths, addMonths, addQuarters, addYears } from 'date-fns';

    const now = new Date('2025-06-05T10:00:00Z');

    export const sampleScheduledChecks: ScheduledCheckItem[] = [
      {
        scheduleId: 'SCH-001',
        subjectName: 'QuantumLeap Solutions (Pty) Ltd',
        subjectId: '2022/123456/07',
        entityType: VettingEntityType.COMPANY,
        checkDefinitionId: 'cipc_company_check',
        checkName: 'CIPC Company Check',
        frequency: ScheduleFrequency.ANNUALLY,
        status: ScheduleStatus.ACTIVE,
        startDate: '2024-07-01T00:00:00Z',
        lastRunDate: '2024-07-01T00:00:00Z',
        lastRunOutcome: RiskLevel.LOW,
        nextRunDate: formatISO(addYears(new Date('2024-07-01T00:00:00Z'), 1)), // July 1, 2025
        runHistory: [{ runDate: '2024-07-01T00:00:00Z', outcome: RiskLevel.LOW, reportId: 'VR202407-010' }],
      },
      {
        scheduleId: 'SCH-002',
        subjectName: 'Stellar Logistics SA',
        subjectId: '2018/112233/07',
        entityType: VettingEntityType.COMPANY,
        checkDefinitionId: 'business_credit_report',
        checkName: 'Business Credit Report',
        frequency: ScheduleFrequency.QUARTERLY,
        status: ScheduleStatus.OVERDUE,
        startDate: '2024-09-01T00:00:00Z',
        lastRunDate: '2025-03-01T00:00:00Z',
        lastRunOutcome: RiskLevel.LOW,
        nextRunDate: formatISO(addQuarters(new Date('2025-03-01T00:00:00Z'), 1)), // June 1, 2025 (Overdue)
        runHistory: [
          { runDate: '2024-12-01T00:00:00Z', outcome: RiskLevel.LOW, reportId: 'VR202412-050' },
          { runDate: '2025-03-01T00:00:00Z', outcome: RiskLevel.LOW, reportId: 'VR202503-025' },
        ],
        notes: 'Provider API was down on due date. Manual trigger required.'
      },
      {
        scheduleId: 'SCH-003',
        subjectName: 'Johnathan Doe (Director)',
        subjectId: '8501015000080',
        entityType: VettingEntityType.INDIVIDUAL,
        checkDefinitionId: 'pep_sanctions_ind',
        checkName: 'PEP & Sanctions Screening',
        frequency: ScheduleFrequency.MONTHLY,
        status: ScheduleStatus.PAUSED,
        startDate: '2025-01-15T00:00:00Z',
        lastRunDate: '2025-05-15T00:00:00Z',
        lastRunOutcome: RiskLevel.INFO_ONLY,
        nextRunDate: formatISO(addMonths(new Date('2025-05-15T00:00:00Z'), 1)), // June 15, 2025
        runHistory: [],
        notes: 'Paused pending outcome of related high-risk investigation.'
      },
      {
        scheduleId: 'SCH-004',
        subjectName: 'EcoBuild Construction CC',
        subjectId: 'supplier_EBC002',
        entityType: VettingEntityType.COMPANY,
        checkDefinitionId: 'aml_cft_monitoring',
        checkName: 'AML/CFT Monitoring',
        frequency: ScheduleFrequency.QUARTERLY,
        status: ScheduleStatus.IN_PROGRESS,
        startDate: '2024-09-02T00:00:00Z',
        lastRunDate: '2025-03-02T00:00:00Z',
        lastRunOutcome: RiskLevel.LOW,
        nextRunDate: formatISO(addQuarters(new Date('2025-03-02T00:00:00Z'), 1)), // June 2, 2025
        runHistory: [],
      },
      // ... add more schedules with different frequencies, statuses, and entities.
    ];
    ```

*   **Data Fetching (Simulated):**
    The page component (`src/app/vetting/scheduled-checks/page.tsx`) will fetch this data.

    ```typescript
    // In src/app/vetting/scheduled-checks/page.tsx
    import { sampleScheduledChecks } from '@/lib/sample-data/scheduledChecksSample';
    import { ScheduledCheckItem } from '@/types/scheduling';
    import { ScheduledChecksClient } from '@/components/vetting/ScheduledChecksClient';
    // ... other imports

    async function getScheduledChecks(): Promise<ScheduledCheckItem[]> {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return sampleScheduledChecks;
    }

    export default async function ScheduledChecksPage() {
      const schedules = await getScheduledChecks();
      // Pass data to the client component for interactivity
      return <ScheduledChecksClient schedules={schedules} />;
    }
    ```

**5. Required Component Imports:**

Follow the pattern from `05CompletedVettingReports.md`, importing individual neumorphic table components, `Badge`, `Button`, `Dialog`, and Lucide icons. Add imports for any new components like `Calendar` if you use a library.

**6. UI Components & Functionality:**

*   **Main Container:**
    *   `NeumorphicCard`: Encloses the entire section.
    *   **Header:** Title "Scheduled & Recurring Checks".
    *   **View Toggle:**
        *   `NeumorphicRadioGroup` or segmented control to switch between "List View" and "Calendar View". This state will be managed in `ScheduledChecksClient.tsx`.
    *   **Toolbar (above the table/calendar):**
        *   **Search Input:** Use the specified native HTML input with neumorphic styling to search by Subject Name or Check Name.
        *   **Filter Controls:** `NeumorphicSelect` / `DropdownMenu` to filter by Status, Frequency, and Entity Type.
        *   `NeumorphicButton` (plus icon): "Create New Schedule" - opens a modal.

*   **List View (Default):**
    *   **`NeumorphicTable`:**
        *   **Columns:**
            1.  **Subject:** `subjectName` with `subjectId` underneath in smaller text.
            2.  **Check Name:** `checkName`.
            3.  **Frequency:** `frequency`.
            4.  **Status:** `NeumorphicBadge` for `ScheduleStatus` (color-coded: Active=green, Paused=gray, Overdue=red, In-Progress=blue).
            5.  **Last Run:** `lastRunDate` with a `NeumorphicBadge` for `lastRunOutcome`.
            6.  **Next Run:** `nextRunDate`. Highlight this cell's background if the status is `OVERDUE` or if the date is within the next 7 days.
            7.  **Actions:** `DropdownMenu` per row:
                *   **View Details:** Opens a `NeumorphicDialog` with full schedule details.
                *   **Run Now:** (Simulated) Shows a confirmation `NeumorphicAlertDialog`. On confirm, shows a `Sonner` toast "Manual run for [Check Name] on [Subject Name] has been initiated." and temporarily changes the row's status to `IN_PROGRESS`.
                *   **Pause/Resume Schedule:** Toggles the `status` between `ACTIVE` and `PAUSED`.
                *   **Edit Schedule:** Opens the "Create/Edit Schedule" modal pre-filled with the item's data.
                *   **View Run History:** Opens a modal showing the `runHistory` in a simple table.
                *   **Delete Schedule:** Shows a confirmation dialog.

*   **Calendar View:**
    *   **Implementation:** Use a library like `FullCalendar` via its React wrapper.
    *   **Styling:** Apply extensive CSS overrides to style the calendar components (header, day cells, event blocks) to match the neumorphic theme. This is critical for visual consistency.
    *   **Functionality:**
        *   Events on the calendar will be the `ScheduledCheckItem`s, placed on their `nextRunDate`.
        *   Event blocks should be color-coded based on `status`.
        *   Display the `subjectName` and `checkName` on the event block.
        *   Clicking an event opens the same "View Details" modal as the table view.

*   **Modals / Dialogs (`NeumorphicDialog` with `variant="neumorphic"`):**
    *   **Create/Edit Schedule Modal:**
        *   A multi-step form.
        *   **Step 1:** Select Subject (searchable dropdown/autocomplete) and Check Type (`NeumorphicSelect` populated from `vettingChecksSample.ts`).
        *   **Step 2:** Configure Schedule (`NeumorphicSelect` for Frequency, `NeumorphicDatePicker` for Start Date).
        *   **Step 3:** Review and Confirm.
        *   **Action:** "Save Schedule" button.
    *   **View Details Modal:**
        *   A read-only summary of the `ScheduledCheckItem`. Includes all key details and a "Run History" summary.
    *   **View Run History Modal:**
        *   A simple `NeumorphicTable` showing `runHistory` with columns: "Run Date", "Outcome", "Report ID" (link to the report).

**7. Decisive Instructions & Pitfalls:**

*   **PDF Generation:** The toolbar should include a "Download Schedule Report" button.
    *   **Instruction:** Use `jsPDF` and `jspdf-autotable`. This function should generate a PDF of the *currently filtered list* from the table view. The PDF should include columns for Subject, Check Name, Status, and Next Run Date. This provides a tangible "compliance schedule" report for the demo.
*   **Avoid:** Do not attempt to build a calendar from scratch. Use a mature library. Be prepared to spend time on CSS overrides for the calendar.
*   **State Management:** All filtering, sorting, pagination, and view-toggling state must be managed within the `ScheduledChecksClient.tsx` component using `useState` and `useMemo`.

**8. Functionality to be Seen/Simulated for Demo:**

*   **Loading State:** `NeumorphicSkeleton` for the table/calendar area.
*   **View Switching:** User can seamlessly toggle between the List and Calendar views.
*   **Interactive Table:** Filtering, sorting, and pagination work flawlessly.
*   **Interactive Calendar:** Events are displayed correctly, and clicking them opens the details modal.
*   **Simulated Actions:** "Run Now," "Pause/Resume," and "Edit" actions provide immediate visual feedback in the UI (status changes, toasts).
*   **Modal Functionality:** All modals open with the correct data and allow for simulated interaction.
*   **PDF Report Generation:** The download button generates a clean PDF of the current view.
*   **Visual Cues:** Overdue/upcoming checks are clearly highlighted.

**9. Adherence to Project Documentation:**

*   **Neumorphic Design:** All custom UI must strictly follow the VETTPRO design system.
*   **Technology Stack:** Consistent use of specified libraries and versions.
*   **Accessibility:** Ensure both table and calendar views are reasonably accessible.

**10. Testing Checklist:**

*   [ ] List/Calendar view toggle works.
*   [ ] Filtering applies to both views correctly.
*   [ ] "Run Now" action correctly simulates a status change.
*   [ ] "Pause/Resume" action toggles status and is reflected visually.
*   [ ] "Edit Schedule" modal pre-fills with correct data.
*   [ ] "View Run History" modal shows correct historical data.
*   [ ] PDF report generates with the correct filtered data.
*   [ ] All date-based highlighting (overdue, upcoming) is accurate based on the "June 2025" context.