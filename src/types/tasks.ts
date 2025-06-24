// Task and approval types for VETTPRO Admin Dashboard
// Based on the My Tasks & Approvals specification in menu documentation

export enum TaskPriority {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}

export enum TaskStatus {
  PENDING_ADMIN_REVIEW = 'Pending Admin Review',
  ACTION_REQUIRED = 'Action Required',
  INFORMATION_REQUESTED = 'Information Requested',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  UNDER_REVIEW = 'Under Review',
  COMPLETED = 'Completed',
}

export enum TaskType {
  RISK_ESCALATION = 'Risk Escalation',
  CONSENT_ISSUE = 'Consent Issue',
  OVERDUE_VERIFICATION = 'Overdue Verification',
  REPORT_APPROVAL = 'Report Approval',
  USER_ACCESS_REQUEST = 'User Access Request',
  SYSTEM_ALERT_REVIEW = 'System Alert Review',
  INVOICE_DISCREPANCY_APPROVAL = 'Invoice Discrepancy Approval',
  COMPLIANCE_REVIEW = 'Compliance Review',
  DATA_VALIDATION_REQUIRED = 'Data Validation Required',
  MANUAL_INTERVENTION = 'Manual Intervention',
}

export interface AdminTaskItem {
  id: string; // Unique ID for the task
  type: TaskType;
  subjectName: string; // e.g., Supplier Name, Individual Name, System Module
  subjectId?: string; // ID of the supplier, individual, report, etc.
  description: string; // Brief description of the task
  assignedDate: string; // ISO Date string
  dueDate?: string; // ISO Date string (optional)
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo: string; // Should be the current Super Admin for demo purposes
  relatedLink?: string; // Path to navigate to the relevant section
  notes?: string; // Any additional notes or context
  category?: string; // Group similar tasks
  riskLevel?: 'Low' | 'Medium' | 'High' | 'Critical'; // For risk-related tasks
  estimatedTime?: number; // Estimated time in minutes
  completedDate?: string; // ISO Date string when completed
  completedBy?: string; // User who completed the task
}

// Filter and search types for the tasks table
export interface TaskFilters {
  type?: TaskType[];
  priority?: TaskPriority[];
  status?: TaskStatus[];
  assignedTo?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

// Table column configuration
export interface TaskTableColumn {
  key: keyof AdminTaskItem;
  label: string;
  sortable: boolean;
  filterable: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

// Bulk action types
export type BulkActionType = 
  | 'approve'
  | 'reject' 
  | 'mark-reviewed'
  | 'assign'
  | 'archive'
  | 'delete';

export interface BulkAction {
  type: BulkActionType;
  label: string;
  icon: string;
  variant?: 'default' | 'destructive' | 'success';
  requiresConfirmation: boolean;
}

// Task action results
export interface TaskActionResult {
  success: boolean;
  taskId: string;
  action: string;
  message: string;
  updatedTask?: AdminTaskItem;
}

// Pagination for tasks
export interface TaskPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// Task summary statistics
export interface TaskSummaryStats {
  total: number;
  pending: number;
  actionRequired: number;
  approved: number;
  rejected: number;
  overdue: number;
  highPriority: number;
  byType: Record<TaskType, number>;
  byStatus: Record<TaskStatus, number>;
  byPriority: Record<TaskPriority, number>;
}