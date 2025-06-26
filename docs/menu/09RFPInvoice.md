

### **Preparation: The "One-of-a-Kind" Sample Data** ✅ COMPLETED

To power this stunning demo, we need meticulously crafted data. The narratives created here are the foundation for the entire user experience.

**1. Update Type Definitions:**
*   **File:** `src/types/rfp.ts`
*   **Action:** Update the interfaces to include `startDate` for the pipeline chart and the new `Anomalous Amount` flag type.

```typescript
// src/types/rfp.ts

export interface RFP {
  id: string;
  title: string;
  status: 'Open for Submission' | 'Under Review' | 'Awarded' | 'Completed' | 'Closed';
  startDate: string; // <-- ADD THIS
  submissionDeadline: string;
  projectCompletionDate?: string;
  awardedToSupplierId?: string;
  associatedInvoices: Invoice[];
}

export interface Invoice {
  id: string;
  rfpId: string;
  supplierId: string;
  supplierName: string;
  status: 'Pending Analysis' | 'Approved' | 'Rejected' | 'Queried';
  amount: number;
  submissionDate: string;
  analysis?: InvoiceAnalysis;
}

export interface InvoiceAnalysis {
  overallConfidenceScore: number; // 0-100
  llmSummary: string;
  llmRecommendation: 'Approve' | 'Approve with Adjustment' | 'Reject & Escalate' | 'Query Supplier';
  flags: InvoiceFlag[];
}

export interface InvoiceFlag {
  type: 'Price Discrepancy' | 'Unsolicited Item' | 'Post-Completion Billing' | 'Anomalous Amount' | 'Slippery Slope'; // <-- ADD 'Anomalous Amount'
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  details: {
    item?: string;
    rfp_value?: string | number;
    invoice_value?: string | number;
    [key: string]: any; // Allow for flexible details
  };
}
```

**2. Create/Update the Sample Data File:**
*   **File:** `src/lib/sample-data/rfpSample.ts`
*   **Action:** Update the file with the complete narratives for all supplier archetypes.

```typescript
// src/lib/sample-data/rfpSample.ts
import { RFP, Invoice, InvoiceAnalysis } from '@/types/rfp';

const createInvoicesForRFP = (rfpId: string): { invoices: Invoice[], analyses: Record<string, InvoiceAnalysis> } => {
  let invoices: Invoice[] = [];
  let analyses: Record<string, InvoiceAnalysis> = {};

  // Case 1: The "Model Supplier"
  if (rfpId === 'RFP-001') {
    const invId = 'INV-101';
    invoices.push({ id: invId, rfpId, supplierId: 'sup-001', supplierName: 'Westonaria Mining Supplies', status: 'Approved', amount: 50000, submissionDate: '2024-04-10' });
    analyses[invId] = { overallConfidenceScore: 99, llmSummary: 'Invoice is fully compliant with RFP terms and pricing. All line items match the original quote.', llmRecommendation: 'Approve', flags: [] };
  }

  // Case 2: The "Slippery Slope" Supplier
  if (rfpId === 'RFP-002') {
    invoices.push({ id: 'INV-201', rfpId, supplierId: 'sup-002', supplierName: 'Carletonville Catering', status: 'Approved', amount: 25000, submissionDate: '2024-03-15' });
    analyses['INV-201'] = { overallConfidenceScore: 98, llmSummary: 'Invoice compliant.', llmRecommendation: 'Approve', flags: [] };
    invoices.push({ id: 'INV-202', rfpId, supplierId: 'sup-002', supplierName: 'Carletonville Catering', status: 'Queried', amount: 26500, submissionDate: '2024-04-16' });
    analyses['INV-202'] = { overallConfidenceScore: 65, llmSummary: "Invoice includes an unapproved 'Fuel Surcharge'. While minor, this is the second consecutive invoice with a small, unquoted fee.", llmRecommendation: 'Query Supplier', flags: [{ type: 'Slippery Slope', severity: 'Medium', description: "Detected 'Boiling the Frog' pattern: 2 consecutive invoices with minor, unapproved charges.", details: {} }] };
  }
  
  // Case 3: The "Problem Child" Supplier
  if (rfpId === 'RFP-003') {
    invoices.push({ id: 'INV-301', rfpId, supplierId: 'sup-003', supplierName: 'Randfontein Logistics', status: 'Rejected', amount: 85000, submissionDate: '2024-02-20' });
    analyses['INV-301'] = { overallConfidenceScore: 25, llmSummary: "Invoice contains a significant price discrepancy for 'Drill Bits' (25% over quote) and an unsolicited 'Admin Fee'. The overall supplier risk profile for **'Randfontein Logistics'** is currently **High-Risk** following a failed **Director Credit Check**.", llmRecommendation: 'Reject & Escalate', flags: [ /* flags data */] };
    invoices.push({ id: 'INV-302', rfpId, supplierId: 'sup-003', supplierName: 'Randfontein Logistics', status: 'Rejected', amount: 45000, submissionDate: '2024-05-15' });
    analyses['INV-302'] = { overallConfidenceScore: 5, llmSummary: "CRITICAL: Invoice submitted 45 days after project completion date for services not included in the original RFP. High probability of fraudulent billing.", llmRecommendation: 'Reject & Escalate', flags: [/* flags data */] };
  }

  // Case 4: The "Anomalous but Compliant" Supplier
  if (rfpId === 'RFP-006') {
    const invId = 'INV-601';
    invoices.push({ id: invId, rfpId, supplierId: 'sup-006', supplierName: 'Fochville IT Solutions', status: 'Pending Analysis', amount: 150000, submissionDate: '2024-05-20' });
    analyses[invId] = {
      overallConfidenceScore: 70,
      llmSummary: "This invoice is fully compliant with the RFP's line items. However, the total amount is 275% higher than the historical average for this supplier and service type.",
      llmRecommendation: 'Query Supplier',
      flags: [{ type: 'Anomalous Amount', severity: 'Medium', description: 'Invoice total is 275% higher than historical average.', details: { average: 'R40,000', current: 'R150,000' } }]
    };
  }
  return { invoices, analyses };
};

export const getRFPs = (): RFP[] => [
    { id: 'RFP-001', title: 'Q2 Office Supply Contract', status: 'Completed', startDate: '2024-02-01', submissionDeadline: '2024-03-01', awardedToSupplierId: 'sup-001', associatedInvoices: createInvoicesForRFP('RFP-001').invoices },
    { id: 'RFP-002', title: 'Monthly Catering Services', status: 'Awarded', startDate: '2024-02-01', submissionDeadline: '2024-02-15', awardedToSupplierId: 'sup-002', associatedInvoices: createInvoicesForRFP('RFP-002').invoices },
    { id: 'RFP-003', title: 'Heavy Vehicle Drill Bit Supply', status: 'Completed', startDate: '2024-01-01', submissionDeadline: '2024-01-20', projectCompletionDate: '2024-03-31', awardedToSupplierId: 'sup-003', associatedInvoices: createInvoicesForRFP('RFP-003').invoices },
    { id: 'RFP-004', title: 'On-site IT Support Services', status: 'Under Review', startDate: '2024-05-15', submissionDeadline: '2024-06-15', associatedInvoices: [] },
    { id: 'RFP-005', title: 'Community Hall Renovation', status: 'Open for Submission', startDate: '2024-06-01', submissionDeadline: '2024-07-01', associatedInvoices: [] },
    { id: 'RFP-006', title: 'Network Infrastructure Upgrade', status: 'Awarded', startDate: '2024-04-01', submissionDeadline: '2024-04-30', awardedToSupplierId: 'sup-006', associatedInvoices: createInvoicesForRFP('RFP-006').invoices },
];

export const getInvoiceDetails = (invoiceId: string): { invoice: Invoice, analysis: InvoiceAnalysis } | null => {
  // ... (implementation remains the same)
};
```

---

### **Step-by-Step Build Guide (Revised)**

#### **Section 1: The RFP Mission Control (Dashboard)** ✅ PROPERLY COMPLETED

*   **File Path:** `src/app/rfp-invoice/rfp-dashboard/page.tsx`
*   **Purpose:** A strategic command center for the entire procurement pipeline.
*   **UI Layout & Components:**
    1.  `<NeumorphicBackground>`.
    2.  **Top Row: KPIs (`grid`)**: Use four `<NeumorphicStatsCard>` as planned.
    3.  **Second Row: RFP Pipeline Chart**
        *   A full-width `<NeumorphicCard>` with `<NeumorphicHeading>`: "RFP Pipeline".
        *   Inside, use `<LazyLoad>` to render an **ApexCharts Range Bar Chart**.
        *   **Chart Data:** Map over `getRFPs()` to create a series where each RFP is a bar spanning from its `startDate` to its `submissionDeadline`. Color-code the bars by status.
        *   **Why it's a "Wow":** Provides an instant, visual overview of workload and strategic planning.
    4.  **Main Content: RFP Table (`<NeumorphicCard>` with `<NeumorphicDataTable>`)**: As planned.

#### **Section 2: The Invoice Triage Center**✅ PROPERLY COMPLETED

*   **File Path:** `src/app/rfp-invoice/invoice-analysis/page.tsx`
*   **Purpose:** An intelligent, prioritized workspace for the finance/risk team.
*   **UI Layout & Components:**
    1.  `<NeumorphicBackground>`.
    2.  A `<NeumorphicCard>` with `<NeumorphicHeading>`: "Invoice Triage Center".
    3.  **Triage Filter Buttons:** Above the table, add a `div` with `<NeumorphicButton>`s: `[ All ]`, `[ Critical (2) ]`, `[ Medium (1) ]`, etc.
    4.  **Invoice Table (`<NeumorphicDataTable>`)**:
        *   **Enhancement:** Your `<NeumorphicDataTable>` component must be updated to accept a `rowClassName` function prop. This function will receive the row data and return a CSS class.
        *   **Implementation:** `rowClassName={(row) => getRowColor(row.analysis.overallConfidenceScore)}`. The `getRowColor` function returns `bg-red-500/10` or `bg-yellow-500/10`.
        *   **Columns:**
            *   **`AI Risk Score`:** Use your new `<CircularProgressRing>` component here.
            *   Other columns as planned.
    *   **Why it's a "Wow":** The combination of quick filters and color-coded rows turns a boring list into a powerful, intuitive triage system that guides the user's attention.

#### **Section 3: The "Invoice DNA & Interactive LLM" View**✅ PROPERLY COMPLETED

*   **File Path:** `src/components/features/InvoiceAnalysisView.tsx` (to be used in a Dialog).
*   **Purpose:** The ultimate "wow" moment, showcasing deep analysis and seamless action.
*   **UI Layout & Components:**
    1.  **Dialog Layout:** Two-column grid (`lg:grid-cols-5`) as planned.
    2.  **Left Column: "Invoice DNA"**
        *   Use the `<DNALink>` component as planned.
        *   **Enhancement:** Update the `DNALink` `status` prop to handle `'rfp_only'` to show items that were quoted but not delivered/invoiced.
    3.  **Right Column: The Interactive LLM Panel**
        *   `<NeumorphicCard>` with a subtle glow as planned.
        *   `<NeumorphicHeading>`: "LLM Insights".
        *   **Interactive Summary:**
            *   Instead of a simple string, the `llmSummary` should be parsed. Create a small utility function or component that takes the summary text and turns keywords (like supplier names or check names) into interactive `<Link>` components.
        *   **Flags:** Use your new `<FlagBadge>` component as planned.
        *   **Actionable Recommendation:**
            *   Display the recommendation text boldly.
            *   **Directly below the text**, render the corresponding `<NeumorphicButton>`. For `Reject & Escalate`, show a red-tinted button.
            *   **Why it's a "Wow":** The user reads the recommendation and the tool to execute it is *right there*. It feels like the AI is an active partner in the workflow.

---

### **Component Inventory (Revised)**

This plan leverages your existing library and the new components you've already built.


#### **Required Component Enhancements (No New Builds):**✅ PROPERLY COMPLETED

1.  **`NeumorphicDataTable`**: Needs to be modified to accept and apply a `rowClassName` prop to enable the visual triage system. This is an enhancement, not a new component.
2.  **`DNALink.tsx`**: Update the internal logic to handle the `'rfp_only'` status for a more complete comparison.