
### **Definitive Implementation Guide: RFP & Invoice Module**

#### **Step 1: Enhance the RFP Dashboard (Mission Control)** ✅ **COMPLETE**

**The Story:** A manager needs a high-level, interactive overview. They shouldn't just see data; they should be able to *play* with it. Clicking the pipeline chart should feel like focusing a lens on the table below, creating a seamless link between strategic overview and tactical detail.

**File to Modify:** `src/app/rfp-invoice/rfp-dashboard/page.tsx`

**How to Implement:**

1.  **State Management for Filtering:**
    *   At the top of your component, introduce a state to hold the ID of the selected RFP from the chart.
    ```tsx
    "use client";
    import { useState } from 'react';
    // ... other imports

    export default function RfpDashboardPage() {
      const [selectedRfpId, setSelectedRfpId] = useState<string | null>(null);
      // ...
    }
    ```

2.  **Make the Pipeline Chart Interactive:**
    *   Locate your ApexCharts component for the RFP Pipeline. You need to configure its `chart.events.dataPointSelection` handler.
    *   This event fires when a user clicks on a data point (a bar in our chart).
    *   The handler will update our state with the ID of the clicked RFP.
    ```tsx
    // Inside your ApexCharts options object
    const chartOptions = {
      // ... other options
      chart: {
        events: {
          dataPointSelection: (event, chartContext, config) => {
            // The ID of the RFP is stored in the `w.globals.seriesNames[config.seriesIndex]`
            // or you can pass it in the series data itself.
            const clickedRfpId = chartContext.w.globals.initialSeries[config.seriesIndex].data[config.dataPointIndex].id;
            setSelectedRfpId(clickedRfpId);
          },
        },
      },
      // ...
    };
    ```
    *   **Crucially, your chart series data must now include the RFP ID.** When you map over `getRFPs()`, structure the data like this:
    ```tsx
    const chartSeries = getRFPs().map(rfp => ({
      name: rfp.title,
      data: [{
        x: rfp.title,
        y: [new Date(rfp.startDate).getTime(), new Date(rfp.submissionDeadline).getTime()],
        id: rfp.id // <-- THIS IS THE KEY
      }]
    }));
    ```

3.  **Filter the Data Table:**
    *   Before passing data to your `<NeumorphicDataTable>`, filter it based on the `selectedRfpId` state.
    ```tsx
    // Inside the return statement of RfpDashboardPage
    const allRFPs = getRFPs();
    const displayedRFPs = selectedRfpId 
      ? allRFPs.filter(rfp => rfp.id === selectedRfpId) 
      : allRFPs;

    // ...
    <NeumorphicDataTable data={displayedRFPs} columns={...} />
    ```

4.  **Add a "Clear Filter" Button:**
    *   Place a `<NeumorphicButton>` next to the "RFP Management" heading that only appears when a filter is active.
    ```tsx
    {selectedRfpId && (
      <NeumorphicButton 
        variant="neumorphic-outline" 
        onClick={() => setSelectedRfpId(null)}
        className="ml-4"
      >
        Clear Filter
      </NeumorphicButton>
    )}
    ```

**📝 IMPLEMENTATION NOTES - STEP 1:**

**Issues Encountered & Solutions:**

1. **`getBoundingClientRect` Error in Chart Events:**
   - **Problem:** ApexCharts `dataPointSelection` event was causing `Cannot read properties of null (reading 'getBoundingClientRect')` error
   - **Root Cause:** Chart event handler was interfering with DOM positioning calculations, especially when toast messages were called directly within the event
   - **Solution:** Added `setTimeout(() => { ... }, 0)` wrapper around the event handler logic to defer execution until after DOM updates complete
   - **Code Fix:** 
     ```tsx
     dataPointSelection: (_event, _chartContext, config) => {
       setTimeout(() => {
         if (onDataPointSelection && config && config.dataPointIndex >= 0) {
           const clickedRfp = rfps[config.dataPointIndex];
           if (clickedRfp?.id) {
             onDataPointSelection(clickedRfp.id);
           }
         }
       }, 0);
     }
     ```

2. **Button Component Variant Issues:**
   - **Problem:** `NeumorphicButton` component doesn't support `variant` or `size` props
   - **Solution:** Replaced with enhanced `Button` component from shadcn/ui that supports neumorphic variants
   - **Import Change:** `import { Button } from '@/components/ui/button';`

3. **TypeScript Linting Errors:**
   - **Problem:** Multiple `any` types in chart event handlers and invoice data structures
   - **Solution:** Added proper TypeScript interfaces and eslint disable comments where external library types aren't available
   - **Added Interfaces:**
     ```tsx
     // Note: ApexCharts config types are not well-defined, using any for chart events
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
     ```

**Enhanced Features Implemented:**

4. **Expandable RFP-to-Invoice Functionality (Bonus Feature):**
   - **Added:** Clickable invoice badges in the "Invoices" column
   - **Component:** `InvoiceBadge` with hover effects and chevron icon
   - **Expansion:** `RFPInvoiceDetails` component showing:
     - Individual invoice details (ID, amount, status)
     - Clickable invoice IDs for navigation to DNA view
     - Color-coded status badges (Approved=green, Queried=yellow, etc.)
     - Total invoice value calculation
   - **Table Configuration:** Added `rowExpansion: true` and `rowDetails` props
   - **Data Structure:** Extended table data to include `associatedInvoices` for expansion

5. **Interactive Chart Implementation:**
   - **Chart Events:** Successfully configured `dataPointSelection` with error handling
   - **State Management:** `selectedRfpId` state for filtering
   - **Visual Feedback:** Toast messages for user guidance
   - **Filter Integration:** Chart selection filters table data and updates KPIs

6. **UI/UX Enhancements:**
   - **Clear Filter Buttons:** Added in both chart and table sections
   - **Dynamic Headings:** Show filtered state in titles
   - **KPI Updates:** Recalculate metrics for filtered data
   - **Visual Indicators:** Show active filter state throughout interface

**Final Implementation Status:**
- ✅ Interactive pipeline chart with click-to-filter
- ✅ State management for RFP filtering
- ✅ Data table filtering based on chart selection
- ✅ Clear filter functionality
- ✅ KPI updates for filtered data
- ✅ **BONUS:** Expandable rows showing invoice details
- ✅ Error handling and TypeScript compliance
- ✅ Neumorphic design system adherence

---

#### **Step 2: Implement the Expandable Row for Invoices** ✅ **COMPLETE** 

**The Story:** The manager has filtered the table. They see an RFP with "2 Invoices." They need immediate, contextual insight into those invoices without leaving the page. The table must open up and reveal this information on command.

**File to Modify:** `src/app/rfp-invoice/rfp-dashboard/page.tsx` (specifically, the data table configuration)

**How to Implement:**

1.  **Leverage Your Existing Expandable Table:**
    *   You mentioned you have an expandable table demo in `@/components/examples/DataTableDemo`. We will reuse this exact pattern.
    *   This pattern typically involves adding a special "expander" column as the first column in your table definition.

2.  **Define the `renderRowSubComponent`:**
    *   Your data table component needs a prop like `renderRowSubComponent`. This function receives the data for the row that was expanded (`row.original`) and returns the JSX to display.
    *   This is where we will render the mini-table of associated invoices.
    ```tsx
    // In RfpDashboardPage.tsx

    const renderInvoiceSubComponent = ({ row }) => {
      const { associatedInvoices } = row.original; // Get invoices from the RFP data

      return (
        <div className="p-4 bg-[var(--neumorphic-card-end)]">
          <h4 className="font-semibold text-neumorphic-text-primary mb-2">Associated Invoices</h4>
          {associatedInvoices.length > 0 ? (
            <ul className="space-y-2">
              {associatedInvoices.map(invoice => (
                <li key={invoice.id} className="flex justify-between items-center">
                  <NeumorphicText>{invoice.id} - {invoice.supplierName}</NeumorphicText>
                  <NeumorphicText>Amount: R{invoice.amount.toLocaleString()}</NeumorphicText>
                  <NeumorphicBadge variant={getInvoiceStatusVariant(invoice.status)}>
                    {invoice.status}
                  </NeumorphicBadge>
                </li>
              ))}
            </ul>
          ) : (
            <NeumorphicText variant="secondary">No invoices associated with this RFP.</NeumorphicText>
          )}
        </div>
      );
    };

    // ... then in your main return
    <NeumorphicDataTable 
      data={displayedRFPs} 
      columns={columns} 
      renderRowSubComponent={renderInvoiceSubComponent} 
    />
    ```

**📝 STEP 2 COMPLETION NOTE:**

**✅ COMPLETED DURING STEP 1 IMPLEMENTATION**

This step was fully implemented as part of the Step 1 enhancement work. The implementation actually **exceeds** the original Step 2 requirements:

**Original Step 2 Plan vs What Was Built:**

| **Step 2 Requirement** | **Status** | **What We Built** |
|------------------------|------------|-------------------|
| Expandable table rows | ✅ Complete | `rowExpansion: true` + `rowDetails` configuration |
| Show invoice details | ✅ Complete | Rich `RFPInvoiceDetails` component with card layout |
| Basic invoice list | ✅ **Enhanced** | Professional card-based layout with hover effects |
| Invoice ID + Amount + Status | ✅ **Enhanced** | + Clickable IDs, color-coded badges, total calculation |
| Simple text display | ✅ **Enhanced** | + Navigation toasts, responsive design, proper spacing |

**Key Enhancements Beyond Step 2:**
- **Clickable Invoice Badges:** The "Invoices" column uses interactive badges instead of plain numbers
- **Rich Expansion Component:** Professional card-based layout with proper neumorphic styling
- **Clickable Invoice IDs:** Ready for navigation to Invoice DNA view
- **Color-Coded Status Badges:** Green (Approved), Yellow (Queried), Blue (Pending), Red (Rejected)
- **Total Value Calculation:** Automatic sum of all invoice amounts
- **Enhanced UX:** Hover effects, transitions, and responsive design

**Implementation Details:**
- Used `NeumorphicDataTable` with `rowExpansion` feature
- Created `InvoiceBadge` component for interactive column display
- Built `RFPInvoiceDetails` component for expansion content
- Integrated with existing filtering system from Step 1
- Maintained neumorphic design system consistency

---

#### **Step 3: Supercharge the Invoice Triage Center** ✅ **COMPLETE**

**The Story:** The risk analyst needs to see the "fires" first. The UI must guide their attention to the most critical invoices instantly. Clicking a row should feel like opening a case file, not just viewing a record.

**File Modified:** `src/app/rfp-invoice/invoice-analysis/page.tsx`

**📝 IMPLEMENTATION NOTES - STEP 3:**

**Enhanced Features Implemented:**

1. **Enhanced Triage Filter Buttons - The User's "To-Do List":**
   - **Dynamic Filter Counts:** Real-time calculation of invoice counts per priority level
   - **Interactive Filter Buttons:** Clear visual distinction between active/inactive filters with icons
   - **Priority Categories:** All, Critical (≤30%), High (31-50%), Medium (51-70%), Low (>70%), Pending Analysis
   - **Clear Filter Functionality:** Easy reset to "All" view with visual indicator when filter is active
   - **Color-Coded Buttons:** Red for Critical, Orange for High, Yellow for Medium, Green for Low, Blue for Pending

2. **Visual Priority Rows with Neumorphic Lift Effects:**
   - **Enhanced NeumorphicDataTable:** Added `rowClassName` prop support to table types and component
   - **Dynamic Row Styling:** `getRowClassName()` function provides risk-based styling:
     - **Critical (≤30%):** Red background with red left border and enhanced hover shadow
     - **High (31-50%):** Orange background with orange left border and lift effect
     - **Medium (51-70%):** Yellow background with yellow left border and smooth transitions
     - **Low (>70%):** Green background with subtle green left border
   - **Neumorphic Hover Effects:** Rows lift with shadow and translate effects on hover
   - **Visual Risk Indicators:** Left border color coding for instant risk recognition

3. **Full-Screen "Click Row to Open" Experience:**
   - **Removed Row Actions Menu:** Entire row is now clickable for modern UX
   - **Enhanced Modal Dialog:** 95vw width for full-screen investigation experience
   - **Rich Dialog Header:** Shows invoice ID, AI risk score (with CircularProgressRing), supplier name, amount, and status badge
   - **User Feedback:** Toast notifications when opening analysis with invoice details
   - **Complete Invoice DNA View:** Full integration with existing InvoiceAnalysisView component

4. **Enhanced Color Legend and UI:**
   - **Descriptive Risk Levels:** Clear action items (Immediate Action Required, Priority Review, etc.)
   - **Professional Legend:** Card-based layout with proper border indicators matching table rows
   - **Dynamic Headings:** Context-aware titles showing filter state and counts
   - **Improved Typography:** Better spacing, icons, and visual hierarchy

**Technical Enhancements:**

5. **Table Component Enhancement:**
   - **Added `rowClassName` prop** to `NeumorphicDataTableProps<T>` interface
   - **Updated table rendering** to use dynamic row classes with fallback hover styles
   - **Maintained backward compatibility** with existing table implementations

6. **Hydration Error Fix:**
   - **Resolved HTML nesting issue:** Replaced `DialogDescription` with `div` to prevent `<p>` containing `<div>` error
   - **Clean component structure** for proper React hydration

**User Experience Achievements:**

7. **"Wow" Moments Delivered:**
   - **One-Click Triage:** Filter buttons instantly show priority workload
   - **Visual Risk Assessment:** Color-coded rows with hover effects create immediate visual feedback
   - **Seamless Investigation:** Click any row to open full DNA analysis without hunting for buttons
   - **Professional Interface:** Neumorphic design with smooth animations and proper feedback

**Final Implementation Status:**
- ✅ Enhanced triage filter buttons with dynamic counts and clear filter functionality
- ✅ Visual priority rows with neumorphic lift effects and color coding
- ✅ Full-screen click-to-open modal experience
- ✅ Removed row actions menu for streamlined UX
- ✅ Professional color legend with risk descriptions
- ✅ Enhanced table component with rowClassName support
- ✅ Fixed hydration errors for production readiness
- ✅ Maintained neumorphic design system consistency

---

#### **Step 4: Implement the Interactive LLM View with Evidence Links**

**The Story:** The analyst is now in the case file. They need to trust the AI. The AI must show its work. Every claim it makes must be backed by a clickable piece of evidence, proving its intelligence and making the analyst's job faster.

**File to Modify:** `src/components/features/InvoiceAnalysisView.tsx`

**How to Implement:**

1.  **Make the Component Data-Driven:**
    *   Modify the component to accept an `invoiceId` prop.
    *   Inside the component, fetch the full invoice details using this ID.
    ```tsx
    // InvoiceAnalysisView.tsx
    import { getInvoiceDetails } from '@/lib/sample-data/rfpSample';

    export const InvoiceAnalysisView = ({ invoiceId }: { invoiceId: string }) => {
      const invoiceData = getInvoiceDetails(invoiceId);

      if (!invoiceData) return <div>Invoice not found.</div>;

      const { invoice, analysis } = invoiceData;
      // ... rest of the component
    }
    ```

2.  **Create the "Evidence Link" Parser:**
    *   This is a new utility component or function. It will take the LLM summary string and use a regular expression to find and replace keywords with `<Link>` components.
    *   **Path:** `src/components/ui/InteractiveText.tsx`
    ```typescript
    // src/components/ui/InteractiveText.tsx
    import Link from 'next/link';

    const InteractiveText = ({ text }: { text: string }) => {
      const parts = text.split(/(\*\*'.*?'\*\*)/g); // Regex to find **'keywords'**

      return (
        <p className="text-neumorphic-text-primary">
          {parts.map((part, index) => {
            if (part.startsWith("**'") && part.endsWith("'**")) {
              const keyword = part.slice(3, -3);
              // In a real app, you'd have a mapping of keywords to URLs
              const url = keyword === 'Randfontein Logistics' ? `/suppliers/sup-003` : `/reports/director-check.pdf`;
              return (
                <Link key={index} href={url} target="_blank" className="text-blue-400 font-bold hover:underline">
                  {keyword}
                </Link>
              );
            }
            return part;
          })}
        </p>
      );
    };
    export default InteractiveText;
    ```
    *   **In `InvoiceAnalysisView.tsx`**, use this component to render the summary:
    ```tsx
    // Instead of <NeumorphicText>{analysis.llmSummary}</NeumorphicText>
    <InteractiveText text={analysis.llmSummary} />
    ```

3.  **Implement Hover-to-Highlight Interactivity:**
    *   Use state to track the hovered flag.
    ```tsx
    // In InvoiceAnalysisView.tsx
    const [hoveredFlag, setHoveredFlag] = useState<string | null>(null);
    ```
    *   In the `DNALink` component, add `onMouseEnter` and `onMouseLeave` handlers that update this state with the flag type (e.g., 'Price Discrepancy').
    *   In the `FlagBadge` component, check if its type matches the `hoveredFlag` state. If it does, add a glowing border class.
    ```tsx
    // In DNALink
    <div onMouseEnter={() => setHoveredFlag('Price Discrepancy')} onMouseLeave={() => setHoveredFlag(null)}>...</div>

    // In FlagBadge
    <div className={cn(..., { 'shadow-[0_0_10px_var(--neumorphic-severity-high)]': hoveredFlag === flag.type })}>...</div>
    ```
