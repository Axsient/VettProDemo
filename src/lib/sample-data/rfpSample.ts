import { RFP, Invoice, InvoiceAnalysis } from '@/types/rfp';

// DNA comparison data for each invoice
export interface DNAComparisonItem {
  rfpLabel?: string;
  rfpValue?: string;
  invoiceLabel?: string;
  invoiceValue?: string;
  status: 'match' | 'mismatch' | 'unsolicited_invoice' | 'rfp_only';
}

export interface InvoiceDNAData {
  invoiceId: string;
  rfpTitle: string;
  dnaItems: DNAComparisonItem[];
}

const createInvoicesForRFP = (rfpId: string): { invoices: Invoice[], analyses: Record<string, InvoiceAnalysis> } => {
  const invoices: Invoice[] = [];
  const analyses: Record<string, InvoiceAnalysis> = {};

  // Case 1: The "Model Supplier"
  if (rfpId === 'RFP-001') {
    const invId = 'INV-101';
    invoices.push({ 
      id: invId, 
      rfpId, 
      supplierId: 'sup-001', 
      supplierName: 'Westonaria Mining Supplies', 
      status: 'Approved', 
      amount: 50000, 
      submissionDate: '2024-04-10' 
    });
    analyses[invId] = { 
      overallConfidenceScore: 6, 
      llmSummary: 'Invoice is fully compliant with RFP terms and pricing. All line items match the original quote perfectly. No discrepancies detected.', 
      llmRecommendation: 'Approve', 
      flags: [] 
    };
  }

  // Case 2: The "Slippery Slope" Supplier
  if (rfpId === 'RFP-002') {
    // First invoice - clean
    invoices.push({ 
      id: 'INV-201', 
      rfpId, 
      supplierId: 'sup-002', 
      supplierName: 'Carletonville Catering', 
      status: 'Approved', 
      amount: 25000, 
      submissionDate: '2024-03-15' 
    });
    analyses['INV-201'] = { 
      overallConfidenceScore: 8, 
      llmSummary: 'Invoice compliant with all RFP requirements. Clean billing with no issues detected.', 
      llmRecommendation: 'Approve', 
      flags: [] 
    };
    
    // Second invoice - showing pattern
    invoices.push({ 
      id: 'INV-202', 
      rfpId, 
      supplierId: 'sup-002', 
      supplierName: 'Carletonville Catering', 
      status: 'Queried', 
      amount: 26500, 
      submissionDate: '2024-04-16' 
    });
    analyses['INV-202'] = { 
      overallConfidenceScore: 56, 
      llmSummary: "Invoice includes an unapproved 'Fuel Surcharge' of R1,500. While minor, this is the second consecutive invoice with a small, unquoted fee. Pattern suggests gradual introduction of unauthorized charges.", 
      llmRecommendation: 'Query Supplier', 
      flags: [{ 
        type: 'Slippery Slope', 
        severity: 'Medium', 
        description: "Detected 'Boiling the Frog' pattern: 2 consecutive invoices with minor, unapproved charges.", 
        details: { 
          pattern: 'Incremental unauthorized fees',
          previous_amount: 'R25,000',
          current_amount: 'R26,500',
          unauthorized_fee: 'R1,500 Fuel Surcharge'
        } 
      }] 
    };
  }
  
  // Case 3: The "Problem Child" Supplier
  if (rfpId === 'RFP-003') {
    // First problematic invoice
    invoices.push({ 
      id: 'INV-301', 
      rfpId, 
      supplierId: 'sup-003', 
      supplierName: 'Randfontein Logistics', 
      status: 'Rejected', 
      amount: 85000, 
      submissionDate: '2024-02-20' 
    });
    analyses['INV-301'] = { 
      overallConfidenceScore: 88, 
      llmSummary: "Invoice contains significant price discrepancy for 'Drill Bits' (25% over quoted price) and an unsolicited 'Admin Fee' of R5,000. The overall supplier risk profile for **'Randfontein Logistics'** is currently **High-Risk** following a failed **Director Credit Check**.", 
      llmRecommendation: 'Reject & Escalate', 
      flags: [
        { 
          type: 'Price Discrepancy', 
          severity: 'Critical', 
          description: 'Drill Bits priced 25% higher than RFP quote', 
          details: { 
            item: 'Industrial Drill Bits',
            rfp_value: 'R60,000',
            invoice_value: 'R75,000'
          } 
        },
        { 
          type: 'Unsolicited Item', 
          severity: 'High', 
          description: 'Admin Fee not included in original RFP', 
          details: { 
            item: 'Administrative Processing Fee',
            invoice_value: 'R5,000'
          } 
        }
      ] 
    };
    
    // Second problematic invoice - post completion billing
    invoices.push({ 
      id: 'INV-302', 
      rfpId, 
      supplierId: 'sup-003', 
      supplierName: 'Randfontein Logistics', 
      status: 'Rejected', 
      amount: 45000, 
      submissionDate: '2024-05-15' 
    });
    analyses['INV-302'] = { 
      overallConfidenceScore: 96, 
      llmSummary: "CRITICAL: Invoice submitted 45 days after project completion date for services not included in the original RFP. High probability of fraudulent billing. Includes charges for 'Emergency Transport Services' and 'Overtime Labor' that were never requested or approved.", 
      llmRecommendation: 'Reject & Escalate', 
      flags: [
        { 
          type: 'Post-Completion Billing', 
          severity: 'Critical', 
          description: 'Invoice submitted 45 days after project completion for unauthorized services', 
          details: { 
            completion_date: '2024-03-31',
            submission_date: '2024-05-15',
            days_late: 45
          } 
        },
        { 
          type: 'Unsolicited Item', 
          severity: 'Critical', 
          description: 'Emergency Transport Services not in original RFP scope', 
          details: { 
            item: 'Emergency Transport Services',
            invoice_value: 'R25,000'
          } 
        }
      ] 
    };
  }

  // Case 4: The "Anomalous but Compliant" Supplier
  if (rfpId === 'RFP-006') {
    const invId = 'INV-601';
    invoices.push({ 
      id: invId, 
      rfpId, 
      supplierId: 'sup-006', 
      supplierName: 'Fochville IT Solutions', 
      status: 'Pending Analysis', 
      amount: 150000, 
      submissionDate: '2024-05-20' 
    });
    analyses[invId] = {
      overallConfidenceScore: 62,
      llmSummary: "This invoice is fully compliant with the RFP's line items and pricing structure. However, the total amount is 275% higher than the historical average for this supplier and service type. All technical specifications match requirements, but the significant cost increase warrants investigation.",
      llmRecommendation: 'Query Supplier',
      flags: [{ 
        type: 'Anomalous Amount', 
        severity: 'Medium', 
        description: 'Invoice total is 275% higher than historical average for this supplier and service type.', 
        details: { 
          historical_average: 'R40,000',
          current_amount: 'R150,000',
          percentage_increase: '275%',
          service_type: 'Network Infrastructure'
        } 
      }]
    };
  }

  return { invoices, analyses };
};

export const getRFPs = (): RFP[] => [
  { 
    id: 'RFP-001', 
    title: 'Q2 Office Supply Contract', 
    status: 'Completed', 
    startDate: '2024-02-01', 
    submissionDeadline: '2024-03-01', 
    projectCompletionDate: '2024-04-15',
    awardedToSupplierId: 'sup-001', 
    associatedInvoices: createInvoicesForRFP('RFP-001').invoices 
  },
  { 
    id: 'RFP-002', 
    title: 'Monthly Catering Services', 
    status: 'Awarded', 
    startDate: '2024-02-01', 
    submissionDeadline: '2024-02-15', 
    awardedToSupplierId: 'sup-002', 
    associatedInvoices: createInvoicesForRFP('RFP-002').invoices 
  },
  { 
    id: 'RFP-003', 
    title: 'Heavy Vehicle Drill Bit Supply', 
    status: 'Completed', 
    startDate: '2024-01-01', 
    submissionDeadline: '2024-01-20', 
    projectCompletionDate: '2024-03-31', 
    awardedToSupplierId: 'sup-003', 
    associatedInvoices: createInvoicesForRFP('RFP-003').invoices 
  },
  { 
    id: 'RFP-004', 
    title: 'On-site IT Support Services', 
    status: 'Under Review', 
    startDate: '2024-05-15', 
    submissionDeadline: '2024-06-15', 
    associatedInvoices: [] 
  },
  { 
    id: 'RFP-005', 
    title: 'Community Hall Renovation', 
    status: 'Open for Submission', 
    startDate: '2024-06-01', 
    submissionDeadline: '2024-07-01', 
    associatedInvoices: [] 
  },
  { 
    id: 'RFP-006', 
    title: 'Network Infrastructure Upgrade', 
    status: 'Awarded', 
    startDate: '2024-04-01', 
    submissionDeadline: '2024-04-30', 
    awardedToSupplierId: 'sup-006', 
    associatedInvoices: createInvoicesForRFP('RFP-006').invoices 
  },
];

export const getInvoiceDetails = (invoiceId: string): { invoice: Invoice, analysis: InvoiceAnalysis } | null => {
  const allRFPs = getRFPs();
  const allAnalyses: Record<string, InvoiceAnalysis> = {};
  
  // Collect all analyses
  allRFPs.forEach(rfp => {
    const { analyses } = createInvoicesForRFP(rfp.id);
    Object.assign(allAnalyses, analyses);
  });

  // Find the invoice
  for (const rfp of allRFPs) {
    const invoice = rfp.associatedInvoices.find(inv => inv.id === invoiceId);
    if (invoice && allAnalyses[invoiceId]) {
      return {
        invoice,
        analysis: allAnalyses[invoiceId]
      };
    }
  }
  
  return null;
};

// Get all invoices with their analyses
export const getAllInvoices = (): Array<Invoice & { analysis?: InvoiceAnalysis }> => {
  const allRFPs = getRFPs();
  const allAnalyses: Record<string, InvoiceAnalysis> = {};
  
  // Collect all analyses
  allRFPs.forEach(rfp => {
    const { analyses } = createInvoicesForRFP(rfp.id);
    Object.assign(allAnalyses, analyses);
  });

  // Combine invoices with analyses
  const allInvoices: Array<Invoice & { analysis?: InvoiceAnalysis }> = [];
  allRFPs.forEach(rfp => {
    rfp.associatedInvoices.forEach(invoice => {
      allInvoices.push({
        ...invoice,
        analysis: allAnalyses[invoice.id]
      });
    });
  });

  return allInvoices;
};

// Get DNA comparison data for a specific invoice
export const getInvoiceDNAData = (invoiceId: string): InvoiceDNAData | null => {
  const allRFPs = getRFPs();
  
  // Find the RFP and invoice
  for (const rfp of allRFPs) {
    const invoice = rfp.associatedInvoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      // Create DNA comparison based on invoice ID
      let dnaItems: DNAComparisonItem[] = [];
      
      switch (invoiceId) {
        case 'INV-101': // Perfect compliance
          dnaItems = [
            { rfpLabel: "Office Supplies (Bulk)", rfpValue: "R25,000", invoiceLabel: "Office Supplies (Bulk)", invoiceValue: "R25,000", status: "match" },
            { rfpLabel: "Filing Cabinets (x10)", rfpValue: "R15,000", invoiceLabel: "Filing Cabinets (x10)", invoiceValue: "R15,000", status: "match" },
            { rfpLabel: "Delivery & Setup", rfpValue: "R10,000", invoiceLabel: "Delivery & Setup", invoiceValue: "R10,000", status: "match" }
          ];
          break;
          
        case 'INV-201': // Clean catering
          dnaItems = [
            { rfpLabel: "Monthly Catering (50 people)", rfpValue: "R20,000", invoiceLabel: "Monthly Catering (50 people)", invoiceValue: "R20,000", status: "match" },
            { rfpLabel: "Dietary Accommodations", rfpValue: "R3,000", invoiceLabel: "Dietary Accommodations", invoiceValue: "R3,000", status: "match" },
            { rfpLabel: "Service Staff", rfpValue: "R2,000", invoiceLabel: "Service Staff", invoiceValue: "R2,000", status: "match" }
          ];
          break;
          
        case 'INV-202': // Slippery slope pattern
          dnaItems = [
            { rfpLabel: "Monthly Catering (50 people)", rfpValue: "R20,000", invoiceLabel: "Monthly Catering (50 people)", invoiceValue: "R20,000", status: "match" },
            { rfpLabel: "Dietary Accommodations", rfpValue: "R3,000", invoiceLabel: "Dietary Accommodations", invoiceValue: "R3,000", status: "match" },
            { rfpLabel: "Service Staff", rfpValue: "R2,000", invoiceLabel: "Service Staff", invoiceValue: "R2,000", status: "match" },
            { invoiceLabel: "Fuel Surcharge", invoiceValue: "R1,500", status: "unsolicited_invoice" }
          ];
          break;
          
        case 'INV-301': // Problem child - price discrepancy
          dnaItems = [
            { rfpLabel: "Industrial Drill Bits (x50)", rfpValue: "R60,000", invoiceLabel: "Industrial Drill Bits (x50)", invoiceValue: "R75,000", status: "mismatch" },
            { rfpLabel: "Safety Equipment", rfpValue: "R5,000", invoiceLabel: "Safety Equipment", invoiceValue: "R5,000", status: "match" },
            { invoiceLabel: "Administrative Processing Fee", invoiceValue: "R5,000", status: "unsolicited_invoice" }
          ];
          break;
          
        case 'INV-302': // Post-completion fraudulent billing
          dnaItems = [
            { rfpLabel: "Standard Transport Services", rfpValue: "R15,000", status: "rfp_only" },
            { rfpLabel: "Regular Labor Hours", rfpValue: "R5,000", status: "rfp_only" },
            { invoiceLabel: "Emergency Transport Services", invoiceValue: "R25,000", status: "unsolicited_invoice" },
            { invoiceLabel: "Overtime Labor (Unauthorized)", invoiceValue: "R20,000", status: "unsolicited_invoice" }
          ];
          break;
          
        case 'INV-601': // Anomalous but compliant
          dnaItems = [
            { rfpLabel: "Network Hardware", rfpValue: "R80,000", invoiceLabel: "Network Hardware", invoiceValue: "R80,000", status: "match" },
            { rfpLabel: "Installation Services", rfpValue: "R30,000", invoiceLabel: "Installation Services", invoiceValue: "R30,000", status: "match" },
            { rfpLabel: "Configuration & Testing", rfpValue: "R20,000", invoiceLabel: "Configuration & Testing", invoiceValue: "R20,000", status: "match" },
            { rfpLabel: "Documentation", rfpValue: "R10,000", invoiceLabel: "Documentation", invoiceValue: "R20,000", status: "mismatch" }
          ];
          break;
          
        default:
          // Fallback for unknown invoices
          dnaItems = [
            { rfpLabel: "Service Item 1", rfpValue: "R10,000", invoiceLabel: "Service Item 1", invoiceValue: "R10,000", status: "match" },
            { rfpLabel: "Service Item 2", rfpValue: "R5,000", invoiceLabel: "Service Item 2", invoiceValue: "R5,000", status: "match" }
          ];
      }
      
      return {
        invoiceId,
        rfpTitle: rfp.title,
        dnaItems
      };
    }
  }
  
  return null;
}; 
