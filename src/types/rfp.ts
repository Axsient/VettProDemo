export interface RFP {
  id: string;
  title: string;
  status: 'Open for Submission' | 'Under Review' | 'Awarded' | 'Completed' | 'Closed';
  startDate: string; // Added for pipeline chart
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
  type: 'Price Discrepancy' | 'Unsolicited Item' | 'Post-Completion Billing' | 'Anomalous Amount' | 'Slippery Slope'; // Added 'Anomalous Amount'
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  details: {
    item?: string;
    rfp_value?: string | number;
    invoice_value?: string | number;
    [key: string]: string | number | boolean | undefined; // Allow for flexible details
  };
} 