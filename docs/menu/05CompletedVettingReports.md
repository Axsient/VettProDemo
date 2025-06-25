**Menu: Vetting Operations > Completed Vetting Reports**

**1. Purpose:**

This section serves as a secure, searchable archive of all finalized vetting reports. It is the single source of truth for historical vetting outcomes. A Super Admin (or other users with appropriate permissions) can use this interface to find, review, and download comprehensive reports on any individual or company that has completed the vetting process. For the demo, this will demonstrate the system's ability to consolidate complex vetting data into a clear, actionable, and shareable format (the PDF report).

## ⚠️ **CRITICAL IMPLEMENTATION WARNING**

**DO NOT USE `NeumorphicDataTable`** - This component has circular JSON serialization issues that cause runtime errors. Instead, use the individual neumorphic table components listed in the implementation section below.

**2. Reference Implementation Patterns:**

Before implementing, study these working examples:
- **UI Elements Page:** `src/app/dashboard/ui-elements/page.tsx` (lines 240-320) - "Recent Vetting Requests" table
- **Working Example:** `src/components/vetting/ActiveVettingCasesDemo.tsx` - Complete table implementation with search and pagination
- **Consent Management:** `src/app/vetting/consent-management/ConsentManagementClient.tsx` - Another working table example

**3. Required File Structure:**

```
src/
├── types/
│   └── reports.ts (create new file)
├── lib/sample-data/
│   └── completedReportsSample.ts (create new file)
├── app/vetting/completed-reports/
│   └── page.tsx (server component)
└── components/vetting/
    └── CompletedReportsTable.tsx (client component)
```

**4. Sample Data Strategy:**

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
      // Additional properties for UI display
      daysSinceCompletion?: number; // For "X days ago" display
      generatedBy?: string; // Who generated the report
      fileSize?: string; // For PDF download info
      checksPerformed?: number; // Total number of checks
      checksCleared?: number; // Number of clear checks
    }
    ```

*   **Sample Data Content (`src/lib/sample-data/completedReportsSample.ts`):**
    Create 8-10 diverse completed reports, ensuring they represent a range of outcomes and link back to the narrative from previous sample data.

    ```typescript
    import { CompletedVettingReport, RiskLevel, ReportStatus, ReportCheckResult } from '@/types/reports';
    import { VettingEntityType } from '@/types/vetting';

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
        daysSinceCompletion: 15,
        fileSize: '2.4 MB',
        checksPerformed: 4,
        checksCleared: 2,
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
        daysSinceCompletion: 8,
        fileSize: '1.8 MB',
        checksPerformed: 3,
        checksCleared: 2,
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
        daysSinceCompletion: 18,
        fileSize: '0.8 MB',
        checksPerformed: 2,
        checksCleared: 0,
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
        daysSinceCompletion: 45,
        fileSize: '1.2 MB',
        checksPerformed: 3,
        checksCleared: 3,
        checkResults: [
          { checkName: 'CIPC Company Registration Check', status: 'Clear', summary: 'Verified.' },
          { checkName: 'Business Credit Report', status: 'Clear', summary: 'No adverse findings.' },
          { checkName: 'VAT Registration Verification (SARS)', status: 'Clear', summary: 'Verified.' },
        ]
      },
      // ... add more reports with different risk levels and statuses.
    ];

    // Helper function for getting reports with stats
    export const getCompletedReportsStats = () => {
      const total = sampleCompletedReports.length;
      const byRiskLevel = sampleCompletedReports.reduce((acc, report) => {
        acc[report.overallRiskLevel] = (acc[report.overallRiskLevel] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      return {
        total,
        byRiskLevel,
        averageScore: Math.round(sampleCompletedReports.reduce((sum, r) => sum + r.overallRiskScore, 0) / total),
        recentCount: sampleCompletedReports.filter(r => (r.daysSinceCompletion || 0) <= 30).length
      };
    };
    ```

*   **Data Fetching (Simulated):**
    The page component (`src/app/vetting/completed-reports/page.tsx`) will fetch this data.

    ```typescript
    // In src/app/vetting/completed-reports/page.tsx
    import { sampleCompletedReports } from '@/lib/sample-data/completedReportsSample';
    import { CompletedVettingReport } from '@/types/reports';
    import { CompletedReportsTable } from '@/components/vetting/CompletedReportsTable';
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

**5. Required Component Imports:**

```typescript
// Correct imports for neumorphic table implementation
import { 
  NeumorphicTable,
  NeumorphicTableHeader,
  NeumorphicTableBody,
  NeumorphicTableRow,
  NeumorphicTableHead,
  NeumorphicTableCell,
  NeumorphicCard,
  NeumorphicText,
  NeumorphicStatsCard
} from '@/components/ui/neumorphic';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { 
  Search,
  Filter,
  Download,
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
```

**6. UI Components & Functionality:**

This page will be dominated by a powerful data table designed for finding and accessing final reports.

*   **Main Container:**
    *   `NeumorphicCard`: Encloses the "Completed Vetting Reports" section.
    *   **Header:** Title "Completed Vetting Reports" (`<h2>` or `<h3>`).
    *   **Toolbar (above the table):**

### **Search Input Implementation (CRITICAL):**
Use native HTML input with proper neumorphic styling - NOT `NeumorphicInput`:

```typescript
<div className="relative flex-1">
  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neumorphic-text-secondary" />
  <input
    type="text"
    placeholder="Search by Report ID, Case ID, Subject Name, Subject ID..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full pl-10 pr-4 py-2 text-sm
      bg-neumorphic-card-gradient border border-neumorphic-border/20
      rounded-lg shadow-neumorphic-inset-sm
      text-neumorphic-text-primary placeholder-neumorphic-text-secondary
      focus:outline-none focus:ring-2 focus:ring-neumorphic-accent-primary/50
      transition-all duration-200"
  />
</div>
```

### **Filter Controls:**
*   `NeumorphicSelect` / `DropdownMenu`: Filter by:
    *   Overall Risk Level (`RiskLevel`)
    *   Entity Type (`VettingEntityType`)
    *   Report Status (`ReportStatus`)
*   `NeumorphicDatePicker` / `DateRangePicker`: Filter by Completion Date range.
*   `NeumorphicButton` (filter icon): Apply filters.
*   `NeumorphicButton` (refresh icon): Refresh list.

### **Pagination Implementation:**
```typescript
// State management
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(10);

// Pagination logic
const totalPages = Math.ceil(filteredData.length / pageSize);
const startIndex = (currentPage - 1) * pageSize;
const endIndex = startIndex + pageSize;
const paginatedData = filteredData.slice(startIndex, endIndex);

// Pagination controls
<div className="flex items-center justify-between px-2">
  <div className="flex items-center gap-2">
    <NeumorphicText variant="secondary" size="sm">Show</NeumorphicText>
    <select
      value={pageSize}
      onChange={(e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
      }}
      className="px-2 py-1 text-sm rounded border
        bg-neumorphic-card-gradient border-neumorphic-border/20
        text-neumorphic-text-primary
        focus:outline-none focus:ring-2 focus:ring-neumorphic-accent-primary/50"
    >
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={20}>20</option>
      <option value={50}>50</option>
    </select>
    <NeumorphicText variant="secondary" size="sm">
      of {filteredData.length} entries
    </NeumorphicText>
  </div>

  <div className="flex items-center gap-2">
    {/* First, Previous, Page Numbers, Next, Last buttons */}
    {/* All buttons use variant="neumorphic-outline" with proper disabled states */}
  </div>
</div>
```

*   **Completed Reports Table (`NeumorphicTable`):**
    *   **Purpose:** Display the archive of finalized reports.

### **Table Styling Requirements:**
- Use `text-xs` for headers and most content
- Use `text-sm` for main entity names  
- Button actions: `h-7 w-7 p-0` for compact look
- Icon sizes: `w-3 h-3` for table icons, `w-4 h-4` for search icon
- Badge classes: `text-xs` for compact appearance

    *   **Columns:**
        1.  **Report ID:** `reportId`.
        2.  **Subject Name:** `subjectName`.
        3.  **Subject ID:** `subjectId`.
        4.  **Entity Type:** `entityType` (with an icon).
        5.  **Risk Level:** `NeumorphicBadge` for `overallRiskLevel`. This is the most important visual cue.
            *   Critical: Dark Red (`variant="destructive"`)
            *   High: Red (`variant="destructive"`)
            *   Medium: Orange/Yellow (`variant="secondary"`)
            *   Low: Green (`variant="default"`)
            *   Info Only: Blue (`variant="outline"`)
        6.  **Report Status:** `NeumorphicBadge` for `reportStatus`.
        7.  **Completion Date:** Formatted `completionDate`.
        8.  **Actions:** `DropdownMenu` (more-horizontal icon) per row:
            *   **View Summary:** Opens a `NeumorphicDialog` with the full report summary.
            *   **Download PDF:** Directly triggers the download of the linked sample PDF.
            *   **View Vetting Case:** Navigates to a (read-only) view of the original `ActiveVettingCase` for audit purposes.
            *   **Archive Report:** (Simulated) Shows a `Sonner` toast and could optimistically remove the row from the UI.

### **Modal Implementation Pattern:**
```typescript
<Dialog>
  <DialogContent variant="neumorphic" className="sm:max-w-[600px]">
    <DialogHeader variant="neumorphic">
      <DialogTitle variant="neumorphic">Vetting Report Summary: {report.subjectName}</DialogTitle>
      <DialogDescription variant="neumorphic">
        Report ID: {report.reportId} | Completed: {formatDate(report.completionDate)}
      </DialogDescription>
    </DialogHeader>
    
    <div className="grid gap-6 py-4">
      {/* Risk Level Display */}
      <NeumorphicStatsCard
        title="Overall Risk Assessment"
        value={report.overallRiskLevel}
        icon={<AlertTriangle className="w-5 h-5" />}
        trend="neutral"
        trendValue={`Score: ${report.overallRiskScore}/100`}
      />
      
      {/* AI Summary */}
      <NeumorphicCard className="p-4">
        <h4 className="text-neumorphic-text-primary font-semibold mb-2">Executive Summary</h4>
        <p className="text-neumorphic-text-secondary text-sm">{report.summary}</p>
      </NeumorphicCard>
      
      {/* Check Results Table */}
      <div>
        <h4 className="text-neumorphic-text-primary font-semibold mb-3">Check Results</h4>
        <NeumorphicTable>
          <NeumorphicTableHeader>
            <NeumorphicTableRow>
              <NeumorphicTableHead className="text-xs">Check Name</NeumorphicTableHead>
              <NeumorphicTableHead className="text-xs">Status</NeumorphicTableHead>
              <NeumorphicTableHead className="text-xs">Summary</NeumorphicTableHead>
            </NeumorphicTableRow>
          </NeumorphicTableHeader>
          <NeumorphicTableBody>
            {report.checkResults.map((check, index) => (
              <NeumorphicTableRow key={index}>
                <NeumorphicTableCell className="text-xs">{check.checkName}</NeumorphicTableCell>
                <NeumorphicTableCell>
                  <Badge variant={getCheckStatusVariant(check.status)} className="text-xs">
                    {check.status}
                  </Badge>
                </NeumorphicTableCell>
                <NeumorphicTableCell className="text-xs">{check.summary}</NeumorphicTableCell>
              </NeumorphicTableRow>
            ))}
          </NeumorphicTableBody>
        </NeumorphicTable>
      </div>
    </div>

    <DialogFooter variant="neumorphic">
      <Button variant="neumorphic-outline" onClick={() => setShowModal(false)}>
        Close
      </Button>
      <Button 
        variant="neumorphic" 
        className="gap-2"
        onClick={() => handleDownloadPDF(report.pdfLink)}
      >
        <Download className="w-4 h-4" />
        Download Full PDF Report
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### **Responsive Design:**
- **Mobile:** Stack cards instead of table rows
- **Tablet:** Hide non-essential columns using `hidden sm:table-cell`
- **Desktop:** Full table with all columns
- Use progressive disclosure for better mobile experience

*   **Notifications (`Sonner` with neumorphic variants):**
    *   Feedback for actions: "Report VR202505-001.pdf download started...", "Report archived."

**7. Common Implementation Pitfalls:**

### **Avoid These Errors:**
1. **Don't use `NeumorphicDataTable`** - causes JSON serialization errors
2. **Search input** needs native HTML input with neumorphic classes, not `NeumorphicInput`
3. **Table rows** need proper key props to avoid React warnings
4. **Badge variants** must match the enum values exactly
5. **Pagination state** must reset when search/filter changes
6. **Modal dialogs** need proper variant props for neumorphic styling
7. **Remove unused imports** immediately to avoid linter errors
8. **Don't define `columns` or `rowActions` arrays** if using manual table implementation

### **Linting and Error Prevention:**
- Remove unused imports immediately
- Use proper TypeScript interfaces for all props
- Ensure all icon components are imported from 'lucide-react'
- Test pagination edge cases (empty results, single page)
- Verify modal opens/closes properly
- Test responsive behavior on different screen sizes

**8. Functionality to be Seen/Simulated for Demo:**

*   **Loading State:** `NeumorphicSkeleton` for the table.
*   **Filtering & Searching:** Must be fully functional, operating on the `sampleCompletedReports` array.
*   **Sorting:** Table sorts by clickable headers (e.g., Risk Level, Completion Date, Subject Name).
*   **Modal Interaction:** Clicking "View Summary" opens the detailed modal, populated with the correct data for that row. The modal itself should be a rich display of the final outcome.
*   **PDF Download Simulation:** Clicking "Download PDF" (either from the table action or the modal) should trigger a download. For the demo, you can link to a generic placeholder PDF, or for extra polish, use a library like `jsPDF` to generate a simple text-based PDF on the fly using the `summary` and `checkResults` data.
*   **Visual Cues:** The color-coded risk badges are essential for quick assessment by the user.
*   **Navigation:** Link to the original vetting case should work, leading to a read-only view of its history.
*   **Responsive Behavior:** The table and modal must be fully responsive.

**9. Adherence to Project Documentation:**

*   **Neumorphic Design:** All UI elements must strictly adhere to the VETTPRO neumorphic design system.
*   **Technology Stack:** Consistent use of Tailwind, TypeScript, Lucide Icons, shadcn/ui (with neumorphic variants), Radix UI primitives, Sonner.
*   **Accessibility:** Keyboard navigable, ARIA attributes.

**10. Testing Checklist:**

Before considering the implementation complete, verify:
- [ ] Search functionality works across all columns
- [ ] Pagination controls work correctly
- [ ] Modal opens with correct data for each row
- [ ] PDF download simulation works
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] No linting errors
- [ ] All badges display correct colors
- [ ] Loading states display properly
- [ ] Error handling for edge cases
- [ ] Keyboard navigation works
- [ ] Screen reader accessibility
