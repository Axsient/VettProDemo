"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { 
  NeumorphicBackground,
  NeumorphicCard,
  NeumorphicText,
  NeumorphicHeading,
  NeumorphicBadge,
  NeumorphicTabs,
  NeumorphicButton
} from '@/components/ui/neumorphic';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { NeumorphicDataTable } from '@/components/ui/NeumorphicDataTable';
import LazyLoad from '@/components/ui/LazyLoad';
import { getLocationVerificationTasks } from '@/lib/sample-data/fieldOperationsSample';
import { LocationVerificationTask } from '@/types/field-operations';
import { TableColumn } from '@/types/table';
import { MapPinIcon, CameraIcon, FileTextIcon, AlertTriangleIcon, CheckCircleIcon } from 'lucide-react';
import { toast } from 'sonner';

// Dynamic import for InteractiveMap to handle SSR
const InteractiveMap = dynamic(() => import('@/components/maps/InteractiveMap'), {
  ssr: false,
  loading: () => <NeumorphicCard className="animate-pulse h-96 flex items-center justify-center">
    <NeumorphicText variant="secondary">Loading map...</NeumorphicText>
  </NeumorphicCard>
});

// Extend LocationVerificationTask to satisfy Record<string, unknown>
interface TableVerificationTask extends LocationVerificationTask, Record<string, unknown> {}

export default function BusinessLocationVerification() {
  const verificationTasks = getLocationVerificationTasks() as TableVerificationTask[];
  const [selectedTask, setSelectedTask] = useState<LocationVerificationTask | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  // Sample task for review demonstration (using loc-3 which has complete submission data)
  const reviewTask = verificationTasks.find((task: LocationVerificationTask) => task.id === 'loc-3');

  const handleViewSubmission = (task: LocationVerificationTask) => {
    setSelectedTask(task);
    setIsReviewDialogOpen(true);
  };

  const handleApproveVerification = () => {
    toast("Verification Approved", {
      description: "The location verification has been approved and marked as completed.",
      duration: 3000,
    });
    setIsReviewDialogOpen(false);
  };

  const handleFlagForInvestigation = () => {
    toast("Flagged for Investigation", {
      description: "This verification has been flagged and escalated for further investigation.",
      duration: 3000,
    });
    setIsReviewDialogOpen(false);
  };

  const handleRejectVerification = () => {
    toast("Verification Rejected", {
      description: "The verification has been rejected. Agent will be notified for re-submission.",
      duration: 3000,
    });
    setIsReviewDialogOpen(false);
  };

  // Create columns for the data table with proper typing
  const columns: TableColumn<TableVerificationTask>[] = [
    {
      id: 'supplier',
      header: "Supplier",
      accessorKey: "supplierName",
      sortable: true,
      filterable: true,
      cell: (value: unknown, row: TableVerificationTask) => (
        <div>
          <NeumorphicText className="font-medium">{row.supplierName}</NeumorphicText>
          <NeumorphicText variant="secondary" size="sm" className="flex items-center gap-1">
            <MapPinIcon className="w-3 h-3" />
            {row.address}
          </NeumorphicText>
        </div>
      ),
    },
    {
      id: 'agent',
      header: "Assigned Agent",
      accessorKey: "agent",
      sortable: true,
      filterable: true,
      cell: (value: unknown, row: TableVerificationTask) => (
        <div>
          {row.agent ? (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[var(--neumorphic-button)] bg-opacity-30 rounded-full flex items-center justify-center">
                <NeumorphicText size="sm" className="font-semibold">
                  {String(row.agent.name).split(' ').map((n: string) => n[0]).join('')}
                </NeumorphicText>
              </div>
              <NeumorphicText size="sm">{String(row.agent.name)}</NeumorphicText>
            </div>
          ) : (
            <NeumorphicText variant="secondary" size="sm">Unassigned</NeumorphicText>
          )}
        </div>
      ),
    },
    {
      id: 'status',
      header: "Status",
      accessorKey: "status",
      sortable: true,
      filterable: true,
      cell: (value: unknown, row: TableVerificationTask) => (
        <NeumorphicBadge 
          variant={
            row.status === 'Completed' ? 'success' :
            row.status === 'Submitted' ? 'info' :
            row.status === 'In Progress' ? 'warning' :
            row.status === 'Overdue' ? 'danger' : 'default'
          }
        >
          {row.status}
        </NeumorphicBadge>
      ),
    },
    {
      id: 'dueDate',
      header: "Due Date",
      accessorKey: "dueDate",
      sortable: true,
      filterable: true,
      cell: (value: unknown, row: TableVerificationTask) => (
        <NeumorphicText size="sm">{row.dueDate}</NeumorphicText>
      ),
    },
    {
      id: 'actions',
      header: "Action",
      accessorKey: "id",
      sortable: false,
      filterable: false,
      cell: (value: unknown, row: TableVerificationTask) => (
        <NeumorphicButton 
          className="text-xs px-2 py-1"
          onClick={() => handleViewSubmission(row)}
        >
          {row.status === 'Submitted' ? 'Review Submission' : 'View Details'}
        </NeumorphicButton>
      ),
    },
  ];

  return (
    <NeumorphicBackground className="min-h-screen">
      <div className="w-full space-y-2">
        {/* Header Section */}
        <NeumorphicCard>
          <div>
            <NeumorphicHeading>Business Location Verification</NeumorphicHeading>
            <NeumorphicText variant="secondary" className="leading-tight">
              Central hub for managing and tracking the physical verification of supplier premises.
            </NeumorphicText>
          </div>
        </NeumorphicCard>

        {/* Main Content with Tabs */}
        <NeumorphicCard>
          <NeumorphicTabs defaultValue="queue">
            <NeumorphicTabs.List>
              <NeumorphicTabs.Trigger value="queue">Verification Queue</NeumorphicTabs.Trigger>
              <NeumorphicTabs.Trigger value="review">Review Submissions</NeumorphicTabs.Trigger>
            </NeumorphicTabs.List>
            
            {/* Tab 1: Verification Queue */}
            <NeumorphicTabs.Content value="queue">
              <NeumorphicCard className="p-6">
                <NeumorphicText size="lg" className="font-semibold mb-4">Verification Queue</NeumorphicText>
                
                <NeumorphicDataTable
                  data={verificationTasks}
                  columns={columns}
                  features={{
                    search: true,
                    sorting: true,
                    filtering: true,
                    pagination: true,
                    selection: 'single',
                    columnVisibility: true,
                    export: true,
                  }}
                />
              </NeumorphicCard>
            </NeumorphicTabs.Content>
            
            {/* Tab 2: Review Submission Demo */}
            <NeumorphicTabs.Content value="review">
              <NeumorphicCard className="p-6">
                <NeumorphicText size="lg" className="font-semibold mb-4">Review Submission Demo</NeumorphicText>
                <NeumorphicText variant="secondary" className="mb-4">
                  This tab demonstrates the review workflow. In production, this would typically be accessed via the queue.
                </NeumorphicText>
                
                {reviewTask && (
                  <NeumorphicButton 
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => handleViewSubmission(reviewTask)}
                  >
                    Review Sample Submission ({reviewTask.supplierName})
                  </NeumorphicButton>
                )}
              </NeumorphicCard>
            </NeumorphicTabs.Content>
          </NeumorphicTabs>
        </NeumorphicCard>

        {/* Review Submission Dialog */}
        <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
          <DialogContent variant="neumorphic" className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
            <DialogHeader variant="neumorphic">
              <DialogTitle variant="neumorphic">
                Review Location Verification
              </DialogTitle>
            </DialogHeader>

            {selectedTask && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                {/* Left Column - Submission Details */}
                <div className="space-y-4">
                  <div>
                    <NeumorphicHeading>{selectedTask.supplierName}</NeumorphicHeading>
                    <NeumorphicText variant="secondary" className="flex items-center gap-1">
                      <MapPinIcon className="w-4 h-4" />
                      {selectedTask.address}
                    </NeumorphicText>
                  </div>

                  <NeumorphicCard className="p-4">
                    <NeumorphicText className="font-semibold mb-2 flex items-center gap-2">
                      <FileTextIcon className="w-4 h-4" />
                      Agent Submission
                    </NeumorphicText>
                    
                    {selectedTask.submittedPhotos && (
                      <div className="mb-3">
                        <NeumorphicText size="sm" className="font-medium mb-2">Submitted Photos:</NeumorphicText>
                        <div className="flex gap-2">
                          {selectedTask.submittedPhotos.map((photo: string, index: number) => (
                            <div key={index} className="w-16 h-16 bg-[var(--neumorphic-button)] bg-opacity-30 rounded-md flex items-center justify-center">
                              <CameraIcon className="w-6 h-6 text-[var(--neumorphic-text-secondary)]" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedTask.agentNotes && (
                      <div>
                        <NeumorphicText size="sm" className="font-medium mb-1">Agent Notes:</NeumorphicText>
                        <NeumorphicText variant="secondary" size="sm">
                          {selectedTask.agentNotes}
                        </NeumorphicText>
                      </div>
                    )}
                  </NeumorphicCard>
                </div>

                {/* Right Column - Map */}
                <div className="space-y-4">
                  <NeumorphicCard className="p-4">
                    <LazyLoad fallback={<div className="animate-pulse h-64 bg-[var(--neumorphic-button)] bg-opacity-30 rounded-md" />}>
                      <div className="mb-3">
                        {/* Geofence Status Indicator */}
                        {selectedTask.capturedGps && (
                          <div className="mb-3">
                            {selectedTask.id === 'loc-3' ? (
                              <div className="flex items-center gap-2 p-2 bg-red-500/20 rounded-md border border-red-500/30">
                                <AlertTriangleIcon className="w-5 h-5 text-red-500" />
                                <NeumorphicText className="text-red-600 font-semibold">
                                  STATUS: OUTSIDE GEOFENCE - FLAGGED
                                </NeumorphicText>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 p-2 bg-green-500/20 rounded-md border border-green-500/30">
                                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                <NeumorphicText className="text-green-600 font-semibold">
                                  STATUS: WITHIN GEOFENCE
                                </NeumorphicText>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <InteractiveMap 
                        height="300px"
                        showControls={false}
                        showGeofences={true}
                        center={selectedTask.capturedGps ? [selectedTask.capturedGps.lat, selectedTask.capturedGps.lng] : [-26.3195, 27.6499]}
                        markers={selectedTask.capturedGps ? [{
                          id: selectedTask.id,
                          position: [selectedTask.capturedGps.lat, selectedTask.capturedGps.lng],
                          title: selectedTask.supplierName,
                          description: selectedTask.address,
                          type: selectedTask.id === 'loc-3' ? 'risk' : 'completed',
                          status: selectedTask.id === 'loc-3' ? 'risk' : 'completed'
                        }] : []}
                      />
                    </LazyLoad>
                  </NeumorphicCard>
                </div>
              </div>
            )}

            <DialogFooter variant="neumorphic">
              <div className="flex gap-2">
                <NeumorphicButton 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleApproveVerification}
                >
                  Approve Verification
                </NeumorphicButton>
                <NeumorphicButton 
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  onClick={handleFlagForInvestigation}
                >
                  Flag for Investigation
                </NeumorphicButton>
                <NeumorphicButton 
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleRejectVerification}
                >
                  Reject
                </NeumorphicButton>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </NeumorphicBackground>
  );
} 