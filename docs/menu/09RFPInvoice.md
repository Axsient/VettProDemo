Challenge accepted. Let's architect a world-class "RFP & Invoice Management" module that is not only functionally brilliant but also a masterpiece of user experience, leveraging your unique neumorphic design system to its absolute fullest.

This guide is your definitive blueprint. We will craft every page, every component, and every piece of data to tell a compelling story of control, intelligence, and fraud prevention.

---

### **Preparation: The "One-of-a-Kind" Sample Data**

To power this stunning demo, we need meticulously crafted data. The goal is to create clear, distinct narratives for each supplier.

**1. Update Type Definitions:**
In `src/types/`, create a new file named `rfp.ts` and update `supplier.ts` if needed.

```typescript
// src/types/rfp.ts

export interface RFP {
  id: string;
  title: string;
  status: 'Open for Submission' | 'Under Review' | 'Awarded' | 'Completed' | 'Closed';
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
  type: 'Price Discrepancy' | 'Unsolicited Item' | 'Post-Completion Billing' | 'Anomalous Amount' | 'Slippery Slope';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  details: {
    item?: string;
    rfp_value?: string | number;
    invoice_value?: string | number;
  };
}
```

**2. Create the Sample Data File:**
In `src/lib/sample-data/`, create `rfpSample.ts`. This is the most important data file for this module.

```typescript
// src/lib/sample-data/rfpSample.ts
import { RFP, Invoice, InvoiceAnalysis } from '@/types/rfp';

const createInvoicesForRFP = (rfpId: string): { invoices: Invoice[], analyses: Record<string, InvoiceAnalysis> } => {
  let invoices: Invoice[] = [];
  let analyses: Record<string, InvoiceAnalysis> = {};

  if (rfpId === 'RFP-001') { // The "Model Supplier"
    const invId = 'INV-101';
    invoices.push({ id: invId, rfpId, supplierId: 'sup-001', supplierName: 'Westonaria Mining Supplies', status: 'Approved', amount: 50000, submissionDate: '2024-04-10' });
    analyses[invId] = {
      overallConfidenceScore: 99,
      llmSummary: 'Invoice is fully compliant with RFP terms and pricing. All line items match the original quote.',
      llmRecommendation: 'Approve',
      flags: []
    };
  }

  if (rfpId === 'RFP-002') { // The "Slippery Slope" Supplier
    const invId1 = 'INV-201', invId2 = 'INV-202';
    invoices.push({ id: invId1, rfpId, supplierId: 'sup-002', supplierName: 'Carletonville Catering', status: 'Approved', amount: 25000, submissionDate: '2024-03-15' });
    analyses[invId1] = { overallConfidenceScore: 98, llmSummary: 'Invoice compliant.', llmRecommendation: 'Approve', flags: [] };
    invoices.push({ id: invId2, rfpId, supplierId: 'sup-002', supplierName: 'Carletonville Catering', status: 'Queried', amount: 26500, submissionDate: '2024-04-16' });
    analyses[invId2] = {
      overallConfidenceScore: 65,
      llmSummary: "Invoice includes an unapproved 'Fuel Surcharge'. While minor, this is the second consecutive invoice with a small, unquoted fee.",
      llmRecommendation: 'Query Supplier',
      flags: [{ type: 'Slippery Slope', severity: 'Medium', description: "Detected 'Boiling the Frog' pattern: 2 consecutive invoices with minor, unapproved charges.", details: {} }]
    };
  }
  
  if (rfpId === 'RFP-003') { // The "Problem Child" Supplier
    const invId1 = 'INV-301', invId2 = 'INV-302';
    invoices.push({ id: invId1, rfpId, supplierId: 'sup-003', supplierName: 'Randfontein Logistics', status: 'Rejected', amount: 85000, submissionDate: '2024-02-20' });
    analyses[invId1] = {
      overallConfidenceScore: 25,
      llmSummary: "Invoice contains a significant price discrepancy for 'Drill Bits' (25% over quote) and an unsolicited 'Admin Fee'.",
      llmRecommendation: 'Reject & Escalate',
      flags: [
        { type: 'Price Discrepancy', severity: 'High', description: 'Unit price for Drill Bits is 25% over quote.', details: { item: 'Drill Bits', rfp_value: 'R1,500', invoice_value: 'R1,875' } },
        { type: 'Unsolicited Item', severity: 'Medium', description: "Unapproved 'Admin Fee' of R2,500 added.", details: { item: 'Admin Fee', invoice_value: 'R2,500' } }
      ]
    };
    invoices.push({ id: invId2, rfpId, supplierId: 'sup-003', supplierName: 'Randfontein Logistics', status: 'Rejected', amount: 45000, submissionDate: '2024-05-15' }); // Note date is after project completion
    analyses[invId2] = {
      overallConfidenceScore: 5,
      llmSummary: "CRITICAL: Invoice submitted 45 days after project completion date for services not included in the original RFP. High probability of fraudulent billing.",
      llmRecommendation: 'Reject & Escalate',
      flags: [
        { type: 'Post-Completion Billing', severity: 'Critical', description: 'Invoice submitted 45 days after project completion date.', details: { rfp_value: '2024-03-31', invoice_value: '2024-05-15' } },
        { type: 'Unsolicited Item', severity: 'High', description: "Billed for 'Emergency Repair Services', which was not in the RFP scope.", details: { item: 'Emergency Repair Services' } }
      ]
    };
  }
  return { invoices, analyses };
};


export const getRFPs = (): RFP[] => {
  const rfp3Data = createInvoicesForRFP('RFP-003');
  return [
    { id: 'RFP-001', title: 'Q2 Office Supply Contract', status: 'Completed', submissionDeadline: '2024-03-01', projectCompletionDate: '2024-06-30', awardedToSupplierId: 'sup-001', associatedInvoices: createInvoicesForRFP('RFP-001').invoices },
    { id: 'RFP-002', title: 'Monthly Catering Services', status: 'Awarded', submissionDeadline: '2024-02-15', projectCompletionDate: '2024-12-31', awardedToSupplierId: 'sup-002', associatedInvoices: createInvoicesForRFP('RFP-002').invoices },
    { id: 'RFP-003', title: 'Heavy Vehicle Drill Bit Supply', status: 'Completed', submissionDeadline: '2024-01-20', projectCompletionDate: '2024-03-31', awardedToSupplierId: 'sup-003', associatedInvoices: rfp3Data.invoices },
    { id: 'RFP-004', title: 'On-site IT Support Services', status: 'Under Review', submissionDeadline: '2024-06-15', associatedInvoices: [] },
    { id: 'RFP-005', title: 'Community Hall Renovation', status: 'Open for Submission', submissionDeadline: '2024-07-01', associatedInvoices: [] },
  ];
};

export const getInvoiceDetails = (invoiceId: string): { invoice: Invoice, analysis: InvoiceAnalysis } | null => {
  const allRFPs = getRFPs();
  for (const rfp of allRFPs) {
    const invoice = rfp.associatedInvoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      const { analyses } = createInvoicesForRFP(rfp.id);
      return { invoice, analysis: analyses[invoiceId] };
    }
  }
  return null;
};
```

---

### **Step-by-Step Build Guide**

#### **Section 1: The RFP Dashboard**

*   **File Path:** `src/app/rfp/dashboard/page.tsx`
*   **Purpose:** The command center. A beautiful, at-a-glance view of the entire RFP landscape.
*   **UI Layout & Components:**
    1.  Wrap the page in `<NeumorphicBackground>`.
    2.  **Top Row: KPI Grid (`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2`)**
        *   Use four `<NeumorphicStatsCard>` components.
            *   Card 1: Title "Open for Submission", Value "1", Icon `<FileText>`.
            *   Card 2: Title "Under Review", Value "1", Icon `<ClockIcon>`.
            *   Card 3: Title "Invoices Pending Analysis", Value "1", Icon `<AlertCircleIcon>` with `text-yellow-400`.
            *   Card 4: Title "Critical Flags This Month", Value "3", Icon `<AlertCircleIcon>` with `text-red-400`.
    3.  **Main Content: RFP Table**
        *   A full-width `<NeumorphicCard>` containing your advanced `<NeumorphicDataTable>`.
        *   **Header:** `<NeumorphicHeading>`: "Active & Recent RFPs". On the right, `<NeumorphicButton variant="neumorphic-outline">`: "Create New RFP".
*   **Interactivity & Functionality:**
    *   **Data Table:**
        *   Populate with `getRFPs()`.
        *   **Columns:**
            *   `RFP Title`: `NeumorphicText` with `font-semibold`.
            *   `Status`: `<NeumorphicBadge>` (e.g., `Open for Submission`=info, `Awarded`=success, `Completed`=secondary).
            *   `Submission Deadline`: `NeumorphicText variant="secondary"`.
            *   `Associated Invoices`: A small count with a link, e.g., "3 Invoices".
    *   **On Row Click:** Clicking an RFP row navigates to `rfp/manage/[id]`. This is a key user flow.

#### **Section 2: The Invoice Analysis Center**

*   **File Path:** `src/app/rfp/invoice-analysis/page.tsx`
*   **Purpose:** The dedicated workspace for the finance/risk team. This is where the magic happens.
*   **UI Layout & Components:**
    1.  `<NeumorphicBackground>`.
    2.  A single, full-width `<NeumorphicCard>` containing a `<NeumorphicDataTable>`.
    3.  **Header:** `<NeumorphicHeading>`: "Invoice Analysis Center". On the right, `<NeumorphicFileUpload>` button: "Upload Manual Invoice".
*   **Interactivity & Functionality:**
    *   **Data Table:**
        *   This table should be populated by finding all invoices with status `Pending Analysis` or `Queried`.
        *   **Columns:**
            *   `Invoice ID`: `NeumorphicText` with `font-mono`.
            *   `Supplier Name`: Should link to the supplier's profile page.
            *   `Amount`: Formatted as currency.
            *   `AI Risk Score`: A special cell. Display the number from `analysis.overallConfidenceScore`. Use a colored circular progress ring around the number (Green 90+, Yellow 60+, Red <60).
            *   `Status`: `<NeumorphicBadge>` for "Pending Analysis", "Queried".
    *   **On Row Click:** This is the most important interaction. Clicking a row **MUST** open a full-screen `<Dialog variant="neumorphic">` which contains the **Invoice DNA & LLM Insights View**.

#### **Section 3: The "Invoice DNA & LLM Insights" View**

*   **File Path:** This is a new component, e.g., `src/components/features/InvoiceAnalysisView.tsx`. It will be rendered inside the `Dialog` from the previous step.
*   **Purpose:** The "Wow" moment. This is where you showcase the fraud detection capabilities in a stunning, intuitive interface.
*   **UI Layout & Components:**
    1.  **Dialog Layout:** A two-column grid (`grid-cols-1 lg:grid-cols-5 gap-4`) for the main content.
    2.  **Left Column (`lg:col-span-3`): The "Invoice DNA"**
        *   `<NeumorphicHeading>`: "Invoice DNA Comparison".
        *   A container `div` where you will render the visual comparison.
            *   Use two vertical divs side-by-side, one for "RFP Terms" and one for "Invoice Items".
            *   **Build a new component `DNALink.tsx`:** This component will take props like `rfp_value`, `invoice_value`, and `status ('match', 'mismatch', 'unsolicited')` and render the correct visual (green solid line, red broken line, etc.).
            *   Render a list of these links for each item to create the "strand" effect.
    3.  **Right Column (`lg:col-span-2`): The LLM Panel**
        *   A `<NeumorphicCard>` with a subtle glow (use `glow-subtle-blue` from `custom.css` but with a purple color variable) to signify "AI-Powered".
        *   Inside the card:
            *   `<NeumorphicHeading>`: "LLM Insights & Recommendation".
            *   `LLM Summary`: A `<NeumorphicText>` displaying the summary.
            *   `Flags`: A list where each item is a **new component `FlagBadge.tsx`** that shows the severity (`Critical`=red, `High`=orange) and the flag type.
            *   `Recommendation`: Display the `llmRecommendation` text boldly, e.g., "Recommendation: **REJECT & ESCALATE**".
    4.  **Dialog Footer (`<DialogFooter variant="neumorphic">`)**
        *   Render `<NeumorphicButton>`s that correspond to the LLM's recommendation (e.g., "Approve", "Reject").

---

### **Component Inventory**

#### **Existing Components Used:**

*   `NeumorphicBackground`
*   `NeumorphicCard`
*   `NeumorphicStatsCard`
*   `NeumorphicDataTable`
*   `NeumorphicHeading`
*   `NeumorphicText`
*   `NeumorphicButton`
*   `NeumorphicBadge`
*   `NeumorphicFileUpload`
*   `Dialog` (with `neumorphic` variant)
*   `Lucide Icons` (FileText, ClockIcon, AlertCircleIcon)

#### **New Components to Build:**

1.  **`InvoiceAnalysisView.tsx`**: The main container for the DNA/LLM view inside the dialog. This is mostly compositional.
2.  **`DNALink.tsx`**: **(Visual - Key Feature)**. A component that visually connects RFP and Invoice line items. It will use `div`s and clever CSS `::before` pseudo-elements to draw the connecting lines, colored based on status.
3.  **`FlagBadge.tsx`**: A specialized version of `<NeumorphicBadge>` that includes an icon and uses a more vibrant color scale based on severity (`Critical`, `High`, etc.) to draw the user's eye.
4.  **`CircularProgressRing.tsx`**: A small component using SVG to display a circular progress bar. You'll use this in the invoice table to show the AI Risk Score visually. It should be theme-aware.