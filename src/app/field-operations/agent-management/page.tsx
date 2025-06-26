"use client";

import React, { useState } from 'react';
import { 
  NeumorphicBackground,
  NeumorphicCard,
  NeumorphicText,
  NeumorphicHeading,
  NeumorphicBadge,
  NeumorphicButton
} from '@/components/ui/neumorphic';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { NeumorphicDataTable } from '@/components/ui/NeumorphicDataTable';
import { getFieldAgents } from '@/lib/sample-data/fieldOperationsSample';
import { FieldAgent } from '@/types/field-operations';
import { TableColumn } from '@/types/table';
import { UserPlusIcon, EditIcon, UserXIcon } from 'lucide-react';
import { toast } from 'sonner';

// Extend FieldAgent to satisfy table requirements
interface TableFieldAgent extends FieldAgent, Record<string, unknown> {}

export default function FieldAgentManagement() {
  // Properly cast the data to satisfy the table requirements
  const [agents] = useState<TableFieldAgent[]>(
    getFieldAgents().map(agent => ({
      ...agent,
      // Satisfy Record<string, unknown> requirement
      [agent.id]: agent.id
    }))
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAgent, setNewAgent] = useState({
    fullName: '',
    contactNumber: '',
    agentId: ''
  });

  // Define table columns
  const columns: TableColumn<TableFieldAgent>[] = [
    {
      id: 'agent',
      header: "Agent",
      accessorKey: "name",
      sortable: true,
      filterable: true,
      cell: (value: unknown, row: TableFieldAgent) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--neumorphic-button)] bg-opacity-30 rounded-full flex items-center justify-center">
            <NeumorphicText size="sm" className="font-semibold">
              {String(row.name).split(' ').map((n: string) => n[0]).join('')}
            </NeumorphicText>
          </div>
          <div>
            <NeumorphicText className="font-medium">{String(row.name)}</NeumorphicText>
            <NeumorphicText variant="secondary" size="sm">ID: {String(row.id)}</NeumorphicText>
          </div>
        </div>
      ),
    },
    {
      id: 'status',
      header: "Status",
      accessorKey: "status",
      sortable: true,
      filterable: true,
      cell: (value: unknown, row: TableFieldAgent) => {
        const status = String(row.status);
        let variant: "success" | "default" | "warning" | "danger" = "default";
        
        if (status === 'Online') variant = "success";
        else if (status === 'On-Task') variant = "warning";
        else if (status === 'Offline') variant = "default";
        
        return (
          <NeumorphicBadge variant={variant}>
            {status}
          </NeumorphicBadge>
        );
      },
    },
    {
      id: 'activeTasks',
      header: "Active Tasks",
      accessorKey: "activeTasks",
      sortable: true,
      cell: (value: unknown, row: TableFieldAgent) => (
        <NeumorphicText className="font-medium">
          {String(row.activeTasks)}
        </NeumorphicText>
      ),
    },
    {
      id: 'completionRate',
      header: "Completion Rate",
      accessorKey: "completionRate",
      sortable: true,
      cell: (value: unknown, row: TableFieldAgent) => (
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <NeumorphicText size="sm" className="font-medium">
              {String(row.completionRate)}%
            </NeumorphicText>
          </div>
          <div className="w-full bg-[var(--neumorphic-card)] rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-green-500 transition-all duration-300"
              style={{ width: `${Number(row.completionRate)}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'actions',
      header: "Actions",
      accessorKey: "id",
      sortable: false,
      filterable: false,
      cell: (value: unknown, row: TableFieldAgent) => (
        <div className="flex items-center gap-2">
          <NeumorphicButton 
            className="text-xs px-2 py-1"
            onClick={() => {
              toast.success(`Edit Profile for ${row.name} opened`);
            }}
          >
            <EditIcon className="w-3 h-3 mr-1" />
            Edit Profile
          </NeumorphicButton>
          <NeumorphicButton 
            className="text-xs px-2 py-1 bg-red-500 hover:bg-red-600"
            onClick={() => {
              toast.warning(`Deactivate ${row.name} requested`);
            }}
          >
            <UserXIcon className="w-3 h-3 mr-1" />
            Deactivate
          </NeumorphicButton>
        </div>
      ),
    },
  ];

  const handleSaveAgent = () => {
    if (!newAgent.fullName || !newAgent.contactNumber || !newAgent.agentId) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success(`New agent "${newAgent.fullName}" has been onboarded successfully!`);
    setIsDialogOpen(false);
    setNewAgent({ fullName: '', contactNumber: '', agentId: '' });
  };

  return (
    <NeumorphicBackground className="min-h-screen">
      <div className="w-full space-y-2">
        {/* Main Content Card */}
        <NeumorphicCard>
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <NeumorphicHeading>Field Agent Management</NeumorphicHeading>
              <NeumorphicText variant="secondary" className="leading-tight">
                Manage the human workforce conducting field operations, view their performance, and manage their status.
              </NeumorphicText>
            </div>
            <NeumorphicButton 
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <UserPlusIcon className="w-4 h-4" />
              Onboard New Agent
            </NeumorphicButton>
          </div>

          {/* Field Agents Data Table */}
          <NeumorphicDataTable
            data={agents}
            columns={columns}
          />
        </NeumorphicCard>

        {/* Onboard New Agent Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-[var(--neumorphic-card)] border border-[var(--neumorphic-border)] max-w-md">
            <DialogHeader>
              <DialogTitle>
                <NeumorphicText className="text-lg font-semibold">Onboard New Agent</NeumorphicText>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <NeumorphicText size="sm" className="font-medium">Full Name *</NeumorphicText>
                <Input
                  placeholder="Enter agent's full name"
                  value={newAgent.fullName}
                  onChange={(e) => setNewAgent(prev => ({ ...prev, fullName: e.target.value }))}
                  className="bg-[var(--neumorphic-card)] border-[var(--neumorphic-border)]"
                />
              </div>
              
              <div className="space-y-2">
                <NeumorphicText size="sm" className="font-medium">Contact Number *</NeumorphicText>
                <Input
                  placeholder="Enter contact number"
                  value={newAgent.contactNumber}
                  onChange={(e) => setNewAgent(prev => ({ ...prev, contactNumber: e.target.value }))}
                  className="bg-[var(--neumorphic-card)] border-[var(--neumorphic-border)]"
                />
              </div>
              
              <div className="space-y-2">
                <NeumorphicText size="sm" className="font-medium">Agent ID *</NeumorphicText>
                <Input
                  placeholder="Enter unique agent ID"
                  value={newAgent.agentId}
                  onChange={(e) => setNewAgent(prev => ({ ...prev, agentId: e.target.value }))}
                  className="bg-[var(--neumorphic-card)] border-[var(--neumorphic-border)]"
                />
              </div>
            </div>

            <DialogFooter>
              <NeumorphicButton 
                onClick={() => setIsDialogOpen(false)}
                className="mr-2"
              >
                Cancel
              </NeumorphicButton>
              <NeumorphicButton onClick={handleSaveAgent}>
                Save Agent
              </NeumorphicButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </NeumorphicBackground>
  );
} 