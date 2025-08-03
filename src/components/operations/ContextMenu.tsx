'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// import { TimelineDialog } from '@/components/operations/TimelineDialog';
// import { DossierDialog } from '@/components/operations/DossierDialog';
// import { EditCaseDialog } from '@/components/operations/EditCaseDialog';
// import { ApproveRejectDialog } from '@/components/operations/ApproveRejectDialog';
import { type OpsCase } from '@/lib/sample-data/operations-dashboard-data';
import {
  MoreHorizontal,
  Eye,
  Clock,
  FileText,
  Edit,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface ContextMenuProps {
  case: OpsCase;
}

export function ContextMenu({ case: caseData }: ContextMenuProps) {
  const handleViewDetails = () => {
    // Navigate to case details page
    window.open(`/cases/${caseData.id}`, '_blank');
  };

  const handleViewTimeline = () => {
    console.log('View Timeline for case:', caseData.caseNumber);
  };

  const handleViewDossier = () => {
    console.log('View Dossier for case:', caseData.caseNumber);
  };

  const handleEditCase = () => {
    console.log('Edit case:', caseData.caseNumber);
  };

  const handleApprove = () => {
    console.log('Approve case:', caseData.caseNumber);
  };

  const handleReject = () => {
    console.log('Reject case:', caseData.caseNumber);
  };

  const isReadyForReview = caseData.status === 'Complete';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleViewDetails}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleViewTimeline}>
            <Clock className="mr-2 h-4 w-4" />
            View Timeline
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleViewDossier}>
            <FileText className="mr-2 h-4 w-4" />
            View Dossier
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleEditCase}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Case
          </DropdownMenuItem>
          
          {isReadyForReview && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleApprove}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleReject}>
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog components will be added later */}
    </>
  );
}