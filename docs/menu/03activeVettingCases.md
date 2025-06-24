**Menu: Vetting Operations > Active Vetting Cases**

**1. Purpose:**

This section provides a comprehensive overview and management interface for all vetting processes that are currently in progress. It allows the Super Admin (and other authorized users) to track the status of individual checks and overall case progress, identify bottlenecks or overdue items, view interim findings, and access relevant details for each active case. For the demo, this will showcase the system's ability to monitor complex, multi-stage vetting operations for various entity types.

**2. Sample Data Strategy:**

*   **Storage Location:**
    *   Create a dedicated file: `src/lib/sample-data/activeVettingCasesSample.ts`
*   **Data Structure:**
    *   The data will be an array of objects, each representing an active vetting case. This structure will need to incorporate details about the subject, the overall case, and the status of individual checks within that case.
    *   Define TypeScript interfaces in `src/types/vetting.ts` (or extend existing ones).

    ```typescript
    // In src/types/vetting.ts (extending previous definitions)

    export enum CaseStatus {
      IN_PROGRESS = 'In Progress',
      AWAITING_CONSENT = 'Awaiting Consent',
      CONSENT_RECEIVED = 'Consent Received',
      AWAITING_DOCUMENTS = 'Awaiting Documents',
      INFORMATION_QUERIED = 'Information Queried',
      PENDING_EXTERNAL_PROVIDER = 'Pending External Provider',
      PARTIALLY_COMPLETE = 'Partially Complete',
      FLAGGED_FOR_REVIEW = 'Flagged for Review', // Internal flag before escalating to Admin Task
    }

    export enum IndividualCheckStatus {
      PENDING = 'Pending',
      IN_PROGRESS = 'In Progress',
      AWAITING_SUBJECT_INFO = 'Awaiting Subject Info',
      SUBMITTED_TO_PROVIDER = 'Submitted to Provider',
      RESULTS_RECEIVED = 'Results Received',
      COMPLETE_CLEAR = 'Complete - Clear',
      COMPLETE_ADVERSE = 'Complete - Adverse Finding',
      COMPLETE_NEUTRAL = 'Complete - Neutral/Info Only',
      CANCELLED = 'Cancelled',
      ERROR = 'Error',
    }

    export interface ActiveVettingCheck {
      checkDefinitionId: string; // Links to VettingCheckDefinition.id
      checkName: string; // Denormalized for easy display
      status: IndividualCheckStatus;
      startDate?: string; // ISO Date string
      estimatedCompletionDate?: string; // ISO Date string
      actualCompletionDate?: string; // ISO Date string
      providerReferenceId?: string;
      findingsSummary?: string; // Brief summary of findings if adverse/neutral
      reportLink?: string; // Link to a detailed report for this specific check (if applicable)
      notes?: string;
    }

    export interface ActiveVettingCase {
      caseId: string; // Unique ID for the vetting case, e.g., "VC20250601-001"
      entityType: VettingEntityType;
      subjectName: string; // Individual's full name or Company Name
      subjectId: string; // SA ID, Company Reg No., or Staff ID
      projectId?: string; // For VettingEntityType.STAFF_MEDICAL, links to MiningProject.id
      projectName?: string; // Denormalized project name
      overallCaseStatus: CaseStatus;
      overallProgress: number; // Percentage (0-100)
      initiatedDate: string; // ISO Date string
      estimatedCaseCompletionDate: string; // ISO Date string
      assignedVettingOfficer?: string; // Name or ID of the officer handling the case
      priority: TaskPriority; // Inherited from AdminTaskItem or set during initiation
      individualChecks: ActiveVettingCheck[];
      lastUpdated: string; // ISO Date string
      relatedAdminTaskId?: string; // If this case is linked to an Admin Task
      consentStatus?: 'Pending' | 'Received' | 'Declined' | 'Issue'; // More granular consent status
    }
    ```

*   **Sample Data Content (`src/lib/sample-data/activeVettingCasesSample.ts`):**
    Create 8-12 diverse active cases with varying progress, statuses, and types of checks. Ensure some checks are overdue based on "June 2025" context.

    ```typescript
    import { ActiveVettingCase, CaseStatus, VettingEntityType, IndividualCheckStatus, TaskPriority } from '@/types/vetting'; // Assuming TaskPriority is in vetting.ts or imported
    import { allVettingChecks } from './vettingChecksSample'; // To get check names

    // Helper to get check name
    const getCheckName = (id: string) => allVettingChecks.find(c => c.id === id)?.name || 'Unknown Check';

    export const sampleActiveVettingCases: ActiveVettingCase[] = [
      {
        caseId: 'VC20250601-001',
        entityType: VettingEntityType.COMPANY,
        subjectName: 'QuantumLeap Solutions (Pty) Ltd',
        subjectId: '2022/123456/07',
        overallCaseStatus: CaseStatus.IN_PROGRESS,
        overallProgress: 60,
        initiatedDate: '2025-05-15T10:00:00Z',
        estimatedCaseCompletionDate: '2025-06-10T17:00:00Z',
        assignedVettingOfficer: 'Alice Wonderland',
        priority: TaskPriority.HIGH,
        consentStatus: 'Received',
        individualChecks: [
          { checkDefinitionId: 'cipc_company_check', checkName: getCheckName('cipc_company_check'), status: IndividualCheckStatus.COMPLETE_CLEAR, actualCompletionDate: '2025-05-16T00:00:00Z' },
          { checkDefinitionId: 'business_credit_report', checkName: getCheckName('business_credit_report'), status: IndividualCheckStatus.COMPLETE_ADVERSE, actualCompletionDate: '2025-05-20T00:00:00Z', findingsSummary: 'Multiple defaults in last 6 months.' },
          { checkDefinitionId: 'vat_verify_sars', checkName: getCheckName('vat_verify_sars'), status: IndividualCheckStatus.SUBMITTED_TO_PROVIDER, estimatedCompletionDate: '2025-06-05T00:00:00Z' }, // Overdue
          { checkDefinitionId: 'bank_acc_verify_biz', checkName: getCheckName('bank_acc_verify_biz'), status: IndividualCheckStatus.PENDING },
          { checkDefinitionId: 'physical_loc_verify', checkName: getCheckName('physical_loc_verify'), status: IndividualCheckStatus.AWAITING_SUBJECT_INFO, notes: 'Awaiting gate access confirmation from supplier.' },
        ],
        lastUpdated: '2025-06-03T14:30:00Z',
        relatedAdminTaskId: 'task_001' // From previous sample
      },
      {
        caseId: 'VC20250601-002',
        entityType: VettingEntityType.INDIVIDUAL,
        subjectName: 'Johnathan Doe',
        subjectId: '8501015000080',
        overallCaseStatus: CaseStatus.AWAITING_CONSENT,
        overallProgress: 10,
        initiatedDate: '2025-06-01T09:00:00Z',
        estimatedCaseCompletionDate: '2025-06-15T17:00:00Z',
        assignedVettingOfficer: 'Bob The Builder',
        priority: TaskPriority.MEDIUM,
        consentStatus: 'Pending',
        individualChecks: [
          { checkDefinitionId: 'id_verify_sa', checkName: getCheckName('id_verify_sa'), status: IndividualCheckStatus.PENDING },
          { checkDefinitionId: 'criminal_record_afis', checkName: getCheckName('criminal_record_afis'), status: IndividualCheckStatus.PENDING },
        ],
        lastUpdated: '2025-06-01T09:05:00Z',
      },
      {
        caseId: 'VC20250602-001',
        entityType: VettingEntityType.STAFF_MEDICAL,
        subjectName: 'Sarah Connor',
        subjectId: '9003036000085',
        projectId: 'proj_SB001',
        projectName: 'Marikana K4 Expansion',
        overallCaseStatus: CaseStatus.PARTIALLY_COMPLETE,
        overallProgress: 75,
        initiatedDate: '2025-05-20T11:00:00Z',
        estimatedCaseCompletionDate: '2025-06-05T17:00:00Z',
        assignedVettingOfficer: 'Alice Wonderland',
        priority: TaskPriority.MEDIUM,
        consentStatus: 'Received',
        individualChecks: [
          { checkDefinitionId: 'id_verify_sa', checkName: getCheckName('id_verify_sa'), status: IndividualCheckStatus.COMPLETE_CLEAR, actualCompletionDate: '2025-05-21T00:00:00Z' },
          { checkDefinitionId: 'med_fitness_cert', checkName: getCheckName('med_fitness_cert'), status: IndividualCheckStatus.COMPLETE_CLEAR, actualCompletionDate: '2025-05-28T00:00:00Z' },
          { checkDefinitionId: 'chronic_med_history', checkName: getCheckName('chronic_med_history'), status: IndividualCheckStatus.RESULTS_RECEIVED, findingsSummary: 'Declared hypertension, managed.' },
          { checkDefinitionId: 'drug_alcohol_screen', checkName: getCheckName('drug_alcohol_screen'), status: IndividualCheckStatus.COMPLETE_ADVERSE, actualCompletionDate: '2025-05-22T00:00:00Z', findingsSummary: 'Positive for cannabis. Follow-up required.', reportLink: '/reports/medical/SC001_drugtest.pdf' },
        ],
        lastUpdated: '2025-06-02T10:15:00Z',
      },
      // Add more cases:
      // - A company case that is 'Awaiting Documents'
      // - An individual case that is 'Flagged for Review' with a few checks completed, some adverse.
      // - A case with many checks, some 'Pending External Provider'
      // - A case that is almost complete, 95% progress.
      {
        caseId: 'VC20250603-001',
        entityType: VettingEntityType.COMPANY,
        subjectName: 'GreenTech Innovations',
        subjectId: '2020/987654/07',
        overallCaseStatus: CaseStatus.AWAITING_DOCUMENTS,
        overallProgress: 25,
        initiatedDate: '2025-05-28T14:00:00Z',
        estimatedCaseCompletionDate: '2025-06-20T17:00:00Z',
        assignedVettingOfficer: 'Bob The Builder',
        priority: TaskPriority.MEDIUM,
        consentStatus: 'Received', // Assuming consent for initial checks was given
        individualChecks: [
          { checkDefinitionId: 'cipc_company_check', checkName: getCheckName('cipc_company_check'), status: IndividualCheckStatus.COMPLETE_CLEAR, actualCompletionDate: '2025-05-29T00:00:00Z' },
          { checkDefinitionId: 'business_credit_report', checkName: getCheckName('business_credit_report'), status: IndividualCheckStatus.PENDING, notes: 'Awaiting signed POPIA consent for directors.' },
        ],
        lastUpdated: '2025-06-03T08:00:00Z',
        notes: 'Requested proof of address and latest financials from supplier.'
      },
    ];
    ```

*   **Data Fetching (Simulated):**
    Similar to "My Tasks & Approvals," the page component (`src/app/vetting/active-cases/page.tsx`) will fetch this data.

    ```typescript
    // In src/app/vetting/active-cases/page.tsx
    import { sampleActiveVettingCases } from '@/lib/sample-data/activeVettingCasesSample';
    import { ActiveVettingCase } from '@/types/vetting';
    // ... other imports

    async function getActiveVettingCases(): Promise<ActiveVettingCase[]> {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      return sampleActiveVettingCases;
    }

    export default async function ActiveVettingCasesPage() {
      const cases = await getActiveVettingCases();
      // Pass cases to a client component for interactive table display
      return <ActiveCasesTable cases={cases} />;
    }
    ```

**3. UI Components & Functionality:**

This page will feature a powerful data table with capabilities for expanding rows to see details of individual checks.

*   **Main Container:**
    *   `NeumorphicCard`: Encloses the "Active Vetting Cases" section.
    *   **Header:** Title "Active Vetting Cases" (`<h2>` or `<h3>`).
    *   **Toolbar (above the table):**
        *   `NeumorphicInput` (with Lucide search icon): Search by Case ID, Subject Name, Subject ID.
        *   `NeumorphicSelect` / `DropdownMenu`: Filter by:
            *   Entity Type (`VettingEntityType`)
            *   Overall Case Status (`CaseStatus`)
            *   Priority (`TaskPriority`)
            *   Assigned Vetting Officer (if you add more officers in sample data)
            *   Project Name (for Staff Medical cases)
        *   `NeumorphicDatePicker` / `DateRangePicker` (shadcn/ui based): Filter by Initiated Date range.
        *   `NeumorphicButton` (filter icon): Apply filters.
        *   `NeumorphicButton` (refresh icon): Refresh list.
        *   `NeumorphicButton` (plus icon, "Initiate New Vetting"): Navigates to the "Initiate New Vetting" page.

*   **Active Cases Table (`NeumorphicTable` with row expansion):**
    *   **Purpose:** Display the list of active vetting cases.
    *   **Columns (Main Row - some might be hidden on smaller screens):**
        1.  **Expand Icon:** (e.g., Lucide `chevron-right`/`chevron-down`) To expand/collapse the row and show individual checks.
        2.  **Case ID:** `caseId` (Clickable, opens a detailed case view modal or navigates to a dedicated case page).
        3.  **Subject Name:** `subjectName`.
        4.  **Entity Type:** `entityType` (perhaps with a relevant Lucide icon).
        5.  **Project Name:** `projectName` (if `STAFF_MEDICAL`).
        6.  **Overall Progress:** `NeumorphicProgress` bar showing `overallProgress`%.
        7.  **Overall Status:** `NeumorphicBadge` for `overallCaseStatus`.
        8.  **Priority:** Visual `NeumorphicBadge` for `priority`.
        9.  **Initiated Date:** Formatted `initiatedDate`.
        10. **Est. Completion:** Formatted `estimatedCaseCompletionDate`, highlighted if overdue.
        11. **Last Updated:** Formatted `lastUpdated`.
        12. **Actions:** `DropdownMenu` (more-horizontal icon) per row:
            *   **View Case Details:** Opens a `NeumorphicDialog` with full case summary and individual check details.
            *   **Update Status:** (Simulated) Opens a small modal to change `overallCaseStatus`.
            *   **Add Note:** (Simulated) Opens a modal to add a note to the case.
            *   **Request Consent Resend:** (Simulated, if `consentStatus` is 'Pending').
            *   **Escalate Issue:** (Simulated) Creates a new task in "My Tasks & Approvals".
    *   **Expanded Row Content (displays `individualChecks`):**
        *   A nested `NeumorphicTable` (simpler version) or a list of `NeumorphicCard`s, one for each check.
        *   **Details for each check:**
            *   Check Name (`checkName`)
            *   Status (`NeumorphicBadge` for `IndividualCheckStatus`)
            *   Provider (`provider` from `VettingCheckDefinition` - requires joining data or denormalizing)
            *   Est. Completion / Actual Completion Date
            *   Findings Summary (if any)
            *   Action buttons for individual checks (e.g., "View Check Report," "Query Provider" - simulated).

*   **Modals / Dialogs (`NeumorphicDialog` / `NeumorphicAlertDialog`):**
    *   **View Case Details Modal:**
        *   **Triggered by:** Clicking Case ID or "View Case Details" action.
        *   **Content:**
            *   Top section: Key case info (Subject, Status, Progress, Dates).
            *   Tabs (`NeumorphicTabs`):
                *   **Summary:** Overall case notes, key findings.
                *   **Checks Details:** The full list of `individualChecks` with all their details (similar to expanded row but potentially more info).
                *   **Documents:** (Simulated) List of documents related to the case (e.g., uploaded consent forms).
                *   **Audit Trail:** (Simulated) Log of changes to this case.
        *   **Actions:** "Close," "Edit Case" (simulated), "Generate Interim Report" (simulated).
    *   Other modals for "Update Status," "Add Note," etc., would be simpler forms.

*   **Notifications (`Sonner` with neumorphic variants):**
    *   Feedback for actions like status updates, escalations, etc.

**4. Functionality to be Seen/Simulated for Demo:**

*   **Loading State:** `NeumorphicSkeleton` for the table.
*   **Filtering & Searching:** Dynamically filters the `sampleActiveVettingCases` array.
*   **Sorting:** Main table sorts by clickable headers.
*   **Row Expansion:** Clicking the expand icon smoothly reveals/hides the individual checks details.
*   **Progress Bar Updates:** (Simulated) If an action on an individual check is performed (e.g., "Mark as Complete"), the `overallProgress` bar for the case could be updated optimistically.
*   **Status Highlighting:** Overdue dates or "FLAGGED_FOR_REVIEW" statuses should be visually distinct.
*   **Navigation:** Links from Case ID or action buttons should navigate to placeholder detailed views or trigger modals.
*   **Responsive Behavior:** The main table and expanded content should adapt to screen sizes. Consider how much detail to show in the main row vs. expanded row on smaller screens.

**5. Adherence to Project Documentation:**

*   **Neumorphic Design:** Consistent application across all elements.
*   **Tailwind CSS, TypeScript, Lucide Icons, shadcn/ui, Radix UI:** As per project standards.
*   **Data Table Features:** Implement sorting, filtering, pagination (if >10-15 sample items), and row expansion as key features.
*   **Accessibility:** Keyboard navigation for table rows, expansion, and actions.