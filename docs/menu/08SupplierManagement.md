### **Preparation: Data and Types Structure**

First, let's define the data structures to ensure a clean separation between the UI and the data layer.

**1. Create Type Definitions:**
In `src/types/`, create a new file named `supplier.ts`.

```typescript
// src/types/supplier.ts

export type SupplierSource = 'Coupa' | 'SAP' | 'VETTPRO Internal';

export interface Supplier {
  id: string;
  name: string;
  registrationNumber: string;
  contactPerson: string;
  contactEmail: string;
  status: 'Active' | 'Onboarding' | 'Archived' | 'High-Risk';
  overallRiskScore: number; // A score from 0 to 10
  lastVettedDate: string;
  source: SupplierSource;
  beeStatus: string; // e.g., "Level 1"
  industry: string;
}

export interface VettingHistoryItem {
  id: string;
  checkName: string;
  status: 'Completed' | 'Pending' | 'Failed';
  dateCompleted: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'None';
  reportUrl: string; // Link to the PDF report
}

export interface SupplierDocument {
  id: string;
  name:string;
  category: 'Contract' | 'Certificate' | 'Invoice' | 'Compliance';
  uploadDate: string;
  fileUrl: string;
}
```

**2. Create the Sample Data File:**
In `src/lib/sample-data/`, create a new file named `supplierSample.ts`. This data is designed to showcase the variety you requested.

```typescript
// src/lib/sample-data/supplierSample.ts
import { Supplier, VettingHistoryItem, SupplierDocument } from '@/types/supplier';

// --- Suppliers ---
export const getSuppliers = (): Supplier[] => [
  { id: 'sup-001', name: 'Westonaria Mining Supplies', registrationNumber: '2010/012345/07', contactPerson: 'John Smith', contactEmail: 'john@wms.co.za', status: 'Active', overallRiskScore: 2.5, lastVettedDate: '2024-03-15', source: 'Coupa', beeStatus: 'Level 2', industry: 'Mining Equipment' },
  { id: 'sup-002', name: 'Carletonville Catering', registrationNumber: '2015/056789/07', contactPerson: 'Jane Doe', contactEmail: 'jane@ccatering.co.za', status: 'Active', overallRiskScore: 4.0, lastVettedDate: '2024-01-20', source: 'Coupa', beeStatus: 'Level 1', industry: 'Catering & Hospitality' },
  { id: 'sup-003', name: 'Randfontein Logistics', registrationNumber: '2018/098765/07', contactPerson: 'Peter Jones', contactEmail: 'peter@rlogistics.co.za', status: 'High-Risk', overallRiskScore: 8.7, lastVettedDate: '2024-05-01', source: 'SAP', beeStatus: 'Non-Compliant', industry: 'Logistics' },
  { id: 'sup-004', name: 'Libanon Engineering', registrationNumber: '2022/112233/07', contactPerson: 'Susan Williams', contactEmail: 'susan@le.co.za', status: 'Onboarding', overallRiskScore: 0, lastVettedDate: 'N/A', source: 'VETTPRO Internal', beeStatus: 'Pending', industry: 'Engineering' },
  { id: 'sup-005', name: 'Fochville IT Solutions', registrationNumber: '2019/445566/07', contactPerson: 'Mike Brown', contactEmail: 'mike@fit.co.za', status: 'Archived', overallRiskScore: 1.5, lastVettedDate: '2022-11-30', source: 'Coupa', beeStatus: 'Level 4', industry: 'IT Services' },
];

// --- Vetting History (Example for one supplier) ---
export const getVettingHistoryForSupplier = (supplierId: string): VettingHistoryItem[] => {
  if (supplierId === 'sup-003') { // High-Risk Supplier
    return [
      { id: 'vh-1', checkName: 'CIPC Commercial Report', status: 'Completed', dateCompleted: '2024-05-01', riskLevel: 'High', reportUrl: '/reports/report-001.pdf' },
      { id: 'vh-2', checkName: 'Director Credit Check', status: 'Completed', dateCompleted: '2024-05-01', riskLevel: 'High', reportUrl: '/reports/report-002.pdf' },
      { id: 'vh-3', checkName: 'Location Verification', status: 'Failed', dateCompleted: '2024-04-28', riskLevel: 'High', reportUrl: '/reports/report-003.pdf' },
      { id: 'vh-4', checkName: 'Annual COID Check', status: 'Pending', dateCompleted: 'N/A', riskLevel: 'None', reportUrl: '#' },
    ];
  }
  return [
      { id: 'vh-5', checkName: 'CIPC Commercial Report', status: 'Completed', dateCompleted: '2024-03-15', riskLevel: 'Low', reportUrl: '/reports/report-004.pdf' },
      { id: 'vh-6', checkName: 'Director Sanctions Screening', status: 'Completed', dateCompleted: '2024-03-15', riskLevel: 'Low', reportUrl: '/reports/report-005.pdf' },
  ];
};

// --- Documents (Example for one supplier) ---
export const getDocumentsForSupplier = (supplierId: string): SupplierDocument[] => [
    { id: 'doc-1', name: 'Master Service Agreement 2024', category: 'Contract', uploadDate: '2024-01-10', fileUrl: '/docs/msa.pdf' },
    { id: 'doc-2', name: 'BEE Certificate 2024', category: 'Certificate', uploadDate: '2024-02-05', fileUrl: '/docs/bee.pdf' },
    { id: 'doc-3', name: 'Tax Clearance Certificate', category: 'Compliance', uploadDate: '2024-02-05', fileUrl: '/docs/tax.pdf' },
];

// --- Risk Data for Charts ---
export const getRiskTrendData = () => ({
  series: [{ name: 'Overall Risk Score', data: [8.5, 8.8, 8.7, 8.6, 8.9, 8.7] }],
  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
});
export const getRiskBreakdownData = () => ({
  series: [{ name: 'Risk Breakdown', data: [9, 5, 8, 4, 7] }],
  categories: ['Financial', 'Compliance', 'Reputational', 'Operational', 'Location'],
});
```

---

### **Page Build Instructions**

Here's how to build each page in `src/app/suppliers/`.

#### **1. All Suppliers Page**

*   **File Path:** `src/app/suppliers/all-suppliers/page.tsx` ✅ COMPLETED
*   **Purpose:** The main listing page for all suppliers in the system.
*   **Page Layout & UI Components:** ✅ COMPLETED
    1.  Use `<NeumorphicBackground>` and a main `<NeumorphicCard>`.
    2.  Header section with title "All Suppliers" and "Add New Supplier" button.
    3.  Search and filter section with external search handling.
    4.  Statistics cards showing Total, Active, High-Risk, and Onboarding suppliers.
    5.  Advanced `<NeumorphicDataTable>` with proper column definitions.
*   **Component Functionality:** ✅ COMPLETED
    *   Display data from `getSuppliers()` sample data.
    *   Columns: Supplier Name (with registration number), Status (badges), Risk Score (color-coded), Industry, BEE Status (badges), Last Vetted, Actions.
    *   Row action to "View Profile" which navigates to `/suppliers/[id]`.
    *   External search functionality filtering by name, registration number, and industry.
    *   Statistics cards with real-time counts based on supplier status.

#### **2. Supplier Profile View**

*   **File Path:** `src/app/suppliers/[id]/page.tsx`
*   **Purpose:** The central hub for every piece of information related to a single supplier. This is your most feature-rich page.
*   **Page Layout & UI Components:**
    1.  Wrap in `<NeumorphicBackground>`.
    2.  **Profile Header Card:** A `<NeumorphicCard>` at the top.
        *   Use a `flex` layout. On the left: a large supplier logo/initials, the supplier name (`NeumorphicHeading`), and their registration number (`NeumorphicText variant="secondary"`).
        *   On the right: The overall risk score displayed prominently in a circular progress component (reuse from your charts library) and the "Source" badge.
    3.  **Main Content Card:** A second large `<NeumorphicCard>` containing the **`<NeumorphicTabs>`** component.
*   **Tabs Functionality:**
    *   **Tab 1: Overview**
        *   A grid of key details: Contact Person, Email, BEE Status, Industry.
        *   A section for "Key Actions":
            *   A `<NeumorphicButton>` "Initiate New Vetting" (links to `/vetting-operations/initiate`).
            *   A `<NeumorphicButton>` "Schedule Recurring Check".
    *   **Tab 2: Vetting History**
        *   A `<NeumorphicDataTable>` populated by `getVettingHistoryForSupplier(supplierId)`.
        *   Columns: Check Name, Date, Status (`NeumorphicBadge`), Risk Level (`NeumorphicBadge`), and a "View Report" button (an icon button).
    *   **Tab 3: Documents**
        *   A header with a `<NeumorphicFileUpload>` button labeled "Upload Document".
        *   A `<NeumorphicDataTable>` populated by `getDocumentsForSupplier(supplierId)`.
        *   Columns: Document Name, Category (`NeumorphicBadge`), Upload Date, and a "Download" action.
    *   **Tab 4: Risk Analysis (The "WOW" Tab)**
        *   Use a responsive grid (`grid-cols-1 lg:grid-cols-2 gap-2`).
        *   **Left Card:** A `<NeumorphicCard>` containing a line chart for "Risk Trend Over Time". Use the `<VettingLineChartsDemo>` as a template and feed it `getRiskTrendData()`.
        *   **Right Card:** A `<NeumorphicCard>` containing a **Radar Chart** for "Current Risk Breakdown". Use ApexCharts for this; it's perfect for showing how different factors contribute to a score. Feed it `getRiskBreakdownData()`.
*   **Required Sample Data:** `getSuppliers()` (to get the supplier by ID), `getVettingHistoryForSupplier()`, `getDocumentsForSupplier()`, and the risk chart data functions.

#### **3. Add New Supplier Page**

*   **File Path:** `src/app/suppliers/add-new-supplier/page.tsx` ✅ COMPLETED
*   **Purpose:** A comprehensive form for registering new suppliers.
*   **Page Layout & UI Components:** ✅ COMPLETED
    1.  Use `<NeumorphicBackground>` and a main `<NeumorphicCard>`.
    2.  Header with back button and page title.
    3.  Form sections: Company Information, Contact Information, Address Information, Additional Information.
*   **Component Functionality:** ✅ COMPLETED
    *   **Company Information:** Company Name, Registration Number (using `CompanyRegistrationInput`), Industry (using `NeumorphicSelect`), BEE Level.
    *   **Contact Information:** Contact Person, Email, Phone Number (using `PhoneInput`).
    *   **Address Information:** Physical Address (using `AddressInput`).
    *   **Additional Information:** Notes & Comments textarea.
    *   Form validation and submission with success toast and navigation to new supplier profile.

#### **4. Supplier Risk Dashboard**

*   **File Path:** `src/app/suppliers/risk-dashboard/page.tsx`
*   **Purpose:** An aggregate, C-level view of risk across the entire supplier base.
*   **Page Layout & UI Components:**
    1.  `<NeumorphicBackground>`.
    2.  A responsive grid layout (`grid-cols-1 lg:grid-cols-2 gap-2`).
    3.  **Card 1: Suppliers by Risk Category:** A bar chart. Use `<VettingBarChartsDemo>` as a template. The data will be a count of suppliers in each risk bracket (Low, Medium, High).
    4.  **Card 2: Common Red Flags:** A horizontal bar chart showing the most common failed checks (e.g., "Director Credit Check," "Location Verification").
    5.  **Card 3: Risk by Industry:** A grouped bar chart comparing the average risk score across different industries ("Mining Equipment," "Logistics," "Catering").
    6.  **Card 4: High-Risk Supplier Watchlist:** A simple `<NeumorphicTable>` listing only the suppliers with `status: 'High-Risk'`.
*   **Functionality:** This page is primarily for data visualization. Clicking on a bar in a chart or a row in the watchlist should navigate to that supplier's profile or a pre-filtered list.
*   **Required Sample Data:** `getSuppliers()` (the dashboard will perform aggregations on this data).