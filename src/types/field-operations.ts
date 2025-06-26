// src/types/field-operations.ts

export interface FieldAgent {
  id: string;
  name: string;
  avatarUrl: string;
  status: 'Online' | 'Offline' | 'On-Task';
  activeTasks: number;
  completionRate: number; // as a percentage
}

export interface CommunityMember {
  id: string;
  name: string;
  idNumber: string; // SA ID Number
  address: string;
  skills: string[];
  vettingStatus: 'Pending' | 'Verified' | 'Flagged' | 'Not Started';
  dateAdded: string;
  avatarUrl: string;
}

export interface LocationVerificationTask {
  id: string;
  supplierName: string;
  address: string;
  status: 'Pending Assignment' | 'In Progress' | 'Submitted' | 'Overdue' | 'Completed';
  agent?: FieldAgent;
  dueDate: string;
  geofenceZone: 'Sibanye-Westonaria' | 'Sibanye-Libanon';
  // For the review dialog
  capturedGps?: { lat: number; lng: number };
  submittedPhotos?: string[];
  agentNotes?: string;
}

export interface CanvassingDrive {
  id: string;
  name: string;
  targetArea: string;
  status: 'Active' | 'Planned' | 'Completed';
  signupGoal: number;
  currentSignups: number;
} 