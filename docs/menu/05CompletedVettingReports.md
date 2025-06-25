**Menu: Vetting Operations > Completed Vetting Reports**

**1. Purpose:**

This section serves as a secure, searchable archive of all finalized vetting reports. It is the single source of truth for historical vetting outcomes. A Super Admin (or other users with appropriate permissions) can use this interface to find, review, and download comprehensive reports on any individual or company that has completed the vetting process. For the demo, this will demonstrate the system's ability to consolidate complex vetting data into a clear, actionable, and shareable format (the PDF report).

**2. Sample Data Strategy:**

*   **Storage Location:**
    *   Create a dedicated file: `src/lib/sample-data/completedReportsSample.ts`
*   **Data Structure:**
    *   The data will be an array of objects, each representing a completed report. This structure should be a final, immutable record of a vetting case.
    *   Define TypeScript interfaces in `src/types/reports.ts` (or extend existing types).

    ```typescript
    // In src/types/reports.ts
    import { VettingEntityType } from './vetting'; // Assuming VettingEntityType is in vetting.ts

    export enum RiskLevel {
      CRITICAL = 'Critical',
      HIGH = 'High',
      MEDIUM = 'Medium',
      LOW = 'Low',
      INFO_ONLY = 'Info Only', // For cases with no scorable risk
    }

    export enum ReportStatus {
      COMPLETE = 'Complete',
      INCOMPLETE_CONSENT_DECLINED = 'Incomplete - Consent Declined',
      INCOMPLETE_DATA_UNAVAILABLE = 'Incomplete - Data Unavailable',
    }

    // A simplified result for the final report summary
    export interface ReportCheckResult {
      checkName: string;
      status: 'Clear' | 'Adverse Finding' | 'Neutral / Info' | 'Not Performed';
      summary: string; // e.g., "Verified.", "Adverse: 3 defaults noted.", "Director link to PEP found."
    }

    export interface CompletedVettingReport {
      reportId: string; // Unique ID for the report, e.g., "VR202505-001"
      vettingCaseId: string; // Links back to the original ActiveVettingCase.caseId
      subjectName: string; // Individual or Company Name
      subjectId: string; // SA ID, Company Reg No., etc.
      entityType: VettingEntityType;
      completionDate: string; // ISO Date string
      reportStatus: ReportStatus;
      overallRiskLevel: RiskLevel;
      overallRiskScore: number; // A score from 0-100
      summary: string; // A concise, AI-generated (simulated) summary of the overall findings.
      reportGeneratedBy: string; // e.g., "System (Automated)" or "SuperAdminUser"
      pdfLink: string; // A placeholder link to a sample PDF for the demo
      checkResults: ReportCheckResult[]; // A final summary of each check performed
    }
    ```

*   **Sample Data Content (`src/lib/sample-data/completedReportsSample.ts`):**
    Create 8-10 diverse completed reports, ensuring they represent a range of outcomes and link back to the narrative from previous sample data.

    ```typescript
    import { CompletedVettingReport, RiskLevel, ReportStatus, ReportCheckResult, VettingEntityType } from '@/types/reports';

    export const sampleCompletedReports: CompletedVettingReport[] = [
      {
        reportId: 'VR202505-001',
        vettingCaseId: 'VC20250601-001', // QuantumLeap Solutions
        subjectName: 'QuantumLeap Solutions (Pty) Ltd',
        subjectId: '2022/123456/07',
        entityType: VettingEntityType.COMPANY,
        completionDate: '2025-05-28T16:00:00Z',
        reportStatus: ReportStatus.COMPLETE,
        overallRiskLevel: RiskLevel.HIGH,
        overallRiskScore: 82,
        summary: 'High financial risk identified due to multiple credit defaults and adverse findings in director checks. CIPC status is active, but significant concerns regarding financial stability warrant caution.',
        reportGeneratedBy: 'System (Automated)',
        pdfLink: '/sample-data/reports/VR202505-001.pdf',
        checkResults: [
          { checkName: 'CIPC Company Registration Check', status: 'Clear', summary: 'Company is active and in good standing.' },
          { checkName: 'Business Credit Report', status: 'Adverse Finding', summary: 'Report indicates 3 payment defaults in the last 6 months.' },
          { checkName: 'VAT Registration Verification (SARS)', status: 'Clear', summary: 'VAT number is valid and compliant.' },
          { checkName: 'Director PEP & Sanctions Screening', status: 'Adverse Finding', summary: 'One director flagged on a PEP watchlist (low-tier, domestic).' },
        ]
      },
      {
        reportId: 'VR202505-002',
        vettingCaseId: 'VC20250602-001', // Sarah Connor
        subjectName: 'Sarah Connor',
        subjectId: '9003036000085',
        entityType: VettingEntityType.STAFF_MEDICAL,
        completionDate: '2025-06-01T11:00:00Z',
        reportStatus: ReportStatus.COMPLETE,
        overallRiskLevel: RiskLevel.MEDIUM,
        overallRiskScore: 55,
        summary: 'Subject is medically fit for mining work per Certificate of Fitness. However, an adverse finding was noted in the drug & alcohol screening which requires follow-up per company policy. Declared chronic conditions are noted as managed.',
        reportGeneratedBy: 'System (Automated)',
        pdfLink: '/sample-data/reports/VR202505-002.pdf',
        checkResults: [
          { checkName: 'Certificate of Fitness (Mining)', status: 'Clear', summary: 'Subject deemed medically fit for duty.' },
          { checkName: 'Chronic Medication History Review', status: 'Neutral / Info', summary: 'Declared hypertension is managed with medication.' },
          { checkName: 'Drug & Alcohol Screening', status: 'Adverse Finding', summary: 'Positive screening for cannabis. Requires HR intervention as per policy.' },
        ]
      },
      {
        reportId: 'VR202505-003',
        vettingCaseId: 'VC_INCOMPLETE_001', // A case where consent was declined
        subjectName: 'Declined Consent Individual',
        subjectId: '8808080000088',
        entityType: VettingEntityType.INDIVIDUAL,
        completionDate: '2025-05-25T10:00:00Z',
        reportStatus: ReportStatus.INCOMPLETE_CONSENT_DECLINED,
        overallRiskLevel: RiskLevel.CRITICAL, // Incomplete due to refusal is a critical risk
        overallRiskScore: 99,
        summary: 'Vetting process terminated. Subject actively declined to provide consent for mandatory checks. This represents a critical risk and a "No Go" recommendation.',
        reportGeneratedBy: 'System (Automated)',
        pdfLink: '/sample-data/reports/VR202505-003.pdf',
        checkResults: [
          { checkName: 'SA ID Verification', status: 'Not Performed', summary: 'Consent not provided.' },
          { checkName: 'Criminal Record Check (AFIS)', status: 'Not Performed', summary: 'Consent not provided.' },
        ]
      },
      {
        reportId: 'VR202504-005',
        vettingCaseId: 'VC_CLEAN_001',
        subjectName: 'Stellar Logistics SA',
        subjectId: '2018/112233/07',
        entityType: VettingEntityType.COMPANY,
        completionDate: '2025-04-15T12:00:00Z',
        reportStatus: ReportStatus.COMPLETE,
        overallRiskLevel: RiskLevel.LOW,
        overallRiskScore: 18,
        summary: 'All checks completed with clear findings. Supplier demonstrates low financial and compliance risk. Recommended for onboarding.',
        reportGeneratedBy: 'System (Automated)',
        pdfLink: '/sample-data/reports/VR202504-005.pdf',
        checkResults: [
          { checkName: 'CIPC Company Registration Check', status: 'Clear', summary: 'Verified.' },
          { checkName: 'Business Credit Report', status: 'Clear', summary: 'No adverse findings.' },
          { checkName: 'VAT Registration Verification (SARS)', status: 'Clear', summary: 'Verified.' },
        ]
      },
      // ... add more reports with different risk levels and statuses.
    ];
    ```

*   **Data Fetching (Simulated):**
    The page component (`src/app/vetting/completed-reports/page.tsx`) will fetch this data.

    ```typescript
    // In src/app/vetting/completed-reports/page.tsx
    import { sampleCompletedReports } from '@/lib/sample-data/completedReportsSample';
    import { CompletedVettingReport } from '@/types/reports';
    // ... other imports

    async function getCompletedReports(): Promise<CompletedVettingReport[]> {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return sampleCompletedReports;
    }

    export default async function CompletedVettingReportsPage() {
      const reports = await getCompletedReports();
      // Pass reports to a client component for interactive table display
      return <CompletedReportsTable reports={reports} />;
    }
    ```

**3. UI Components & Functionality:**

This page will be dominated by a powerful data table designed for finding and accessing final reports.

*   **Main Container:**
    *   `NeumorphicCard`: Encloses the "Completed Vetting Reports" section.
    *   **Header:** Title "Completed Vetting Reports" (`<h2>` or `<h3>`).
    *   **Toolbar (above the table):**
        *   `NeumorphicInput` (with Lucide search icon): Search by Report ID, Case ID, Subject Name, Subject ID.
        *   `NeumorphicSelect` / `DropdownMenu`: Filter by:
            *   Overall Risk Level (`RiskLevel`)
            *   Entity Type (`VettingEntityType`)
            *   Report Status (`ReportStatus`)
        *   `NeumorphicDatePicker` / `DateRangePicker`: Filter by Completion Date range.
        *   `NeumorphicButton` (filter icon): Apply filters.
        *   `NeumorphicButton` (refresh icon): Refresh list.

*   **Completed Reports Table (`NeumorphicTable`):**
    *   **Purpose:** Display the archive of finalized reports.
    *   **Columns:**
        1.  **Report ID:** `reportId`.
        2.  **Subject Name:** `subjectName`.
        3.  **Subject ID:** `subjectId`.
        4.  **Entity Type:** `entityType` (with an icon).
        5.  **Risk Level:** `NeumorphicBadge` for `overallRiskLevel`. This is the most important visual cue.
            *   Critical: Dark Red
            *   High: Red
            *   Medium: Orange/Yellow
            *   Low: Green
            *   Info Only: Blue
        6.  **Report Status:** `NeumorphicBadge` for `reportStatus`.
        7.  **Completion Date:** Formatted `completionDate`.
        8.  **Actions:** `DropdownMenu` (more-horizontal icon) per row:
            *   **View Summary:** Opens a `NeumorphicDialog` with the full report summary.
            *   **Download PDF:** Directly triggers the download of the linked sample PDF.
            *   **View Vetting Case:** Navigates to a (read-only) view of the original `ActiveVettingCase` for audit purposes.
            *   **Archive Report:** (Simulated) Shows a `Sonner` toast and could optimistically remove the row from the UI.

*   **Modals / Dialogs (`NeumorphicDialog`):**
    *   **View Report Summary Modal:**
        *   **Triggered by:** "View Summary" action.
        *   **Content:** This is the core of the page's interactivity.
            *   **Header Section:**
                *   Title: "Vetting Report Summary: [Subject Name]"
                *   Key Details: Report ID, Completion Date.
                *   Large `NeumorphicBadge` or KPI Card displaying the `overallRiskLevel` and `overallRiskScore`.
            *   **AI Summary Section:**
                *   A `NeumorphicCard` inside the modal containing the detailed `summary` text.
            *   **Check Results Section:**
                *   A nested `NeumorphicTable` or a clean list displaying the `checkResults` array.
                *   Columns: "Check Name", "Status" (with a small `NeumorphicBadge`), "Summary of Findings".
        *   **Actions (at the bottom of the modal):**
            *   `NeumorphicButton` (Primary, with Lucide download icon): "Download Full PDF Report".
            *   `NeumorphicButton` (Secondary): "Close".

*   **Notifications (`Sonner` with neumorphic variants):**
    *   Feedback for actions: "Report VR202505-001.pdf download started...", "Report archived."

**4. Functionality to be Seen/Simulated for Demo:**

*   **Loading State:** `NeumorphicSkeleton` for the table.
*   **Filtering & Searching:** Must be fully functional, operating on the `sampleCompletedReports` array.
*   **Sorting:** Table sorts by clickable headers (e.g., Risk Level, Completion Date, Subject Name).
*   **Modal Interaction:** Clicking "View Summary" opens the detailed modal, populated with the correct data for that row. The modal itself should be a rich display of the final outcome.
*   **PDF Download Simulation:** Clicking "Download PDF" (either from the table action or the modal) should trigger a download. For the demo, you can link to a generic placeholder PDF, or for extra polish, use a library like `jsPDF` to generate a simple text-based PDF on the fly using the `summary` and `checkResults` data.
*   **Visual Cues:** The color-coded risk badges are essential for quick assessment by the user.
*   **Navigation:** Link to the original vetting case should work, leading to a read-only view of its history.
*   **Responsive Behavior:** The table and modal must be fully responsive.

**5. Adherence to Project Documentation:**

*   **Neumorphic Design:** All UI elements must strictly adhere to the VETTPRO neumorphic design system.
*   **Technology Stack:** Consistent use of Tailwind, TypeScript, Lucide Icons, shadcn/ui (with neumorphic variants), Radix UI primitives, Sonner.
*   **Accessibility:** Keyboard navigable, ARIA attributes.
