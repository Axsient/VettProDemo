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
  name: string;
  category: 'Contract' | 'Certificate' | 'Invoice' | 'Compliance';
  uploadDate: string;
  fileUrl: string;
} 