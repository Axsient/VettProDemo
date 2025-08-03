'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { NeumorphicButton } from '@/components/ui/neumorphic-button';
import { NeumorphicInput } from '@/components/ui/neumorphic-input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Mail, User } from 'lucide-react';

interface SupervisorApprovalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  action: string;
  title: string;
  selectedCount: number;
  onApprove: () => void;
}

export function SupervisorApprovalDialog({
  isOpen,
  onClose,
  action,
  title,
  selectedCount,
  onApprove,
}: SupervisorApprovalDialogProps) {
  const [supervisorEmail, setSupervisorEmail] = useState('sarah.jones@vettpro.co.za');
  const [requestReason, setRequestReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!requestReason.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate sending email notification
    console.log('Supervisor approval request sent:', {
      action,
      selectedCount,
      supervisorEmail,
      requestReason,
      timestamp: new Date().toISOString(),
    });

    setIsSubmitting(false);
    onApprove();
    
    // Reset form
    setRequestReason('');
  };

  const getActionIcon = () => {
    switch (action) {
      case 'assign':
        return <User className="h-5 w-5" />;
      case 'priority':
        return <AlertTriangle className="h-5 w-5" />;
      case 'export':
        return <Mail className="h-5 w-5" />;
      case 'approve':
        return <Mail className="h-5 w-5" />;
      default:
        return <Mail className="h-5 w-5" />;
    }
  };

  const getActionDescription = () => {
    switch (action) {
      case 'assign':
        return `Assign new officers to ${selectedCount} selected cases`;
      case 'priority':
        return `Update priority levels for ${selectedCount} selected cases`;
      case 'export':
        return `Export data for ${selectedCount} selected cases`;
      case 'approve':
        return `Bulk approve ${selectedCount} selected cases`;
      default:
        return `Perform bulk action on ${selectedCount} selected cases`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getActionIcon()}
            Supervisor Approval Required
          </DialogTitle>
          <p className="text-sm text-neumorphic-text/70">
            This action requires supervisor approval before execution.
          </p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Action Summary */}
          <div className="bg-neumorphic-surface/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Action Summary</h4>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{title}</Badge>
              <span className="text-sm text-neumorphic-text/70">
                {selectedCount} cases selected
              </span>
            </div>
            <p className="text-sm text-neumorphic-text/70">
              {getActionDescription()}
            </p>
          </div>

          {/* Supervisor Email */}
          <div className="space-y-2">
            <Label htmlFor="supervisor-email">Supervisor Email</Label>
            <NeumorphicInput
              id="supervisor-email"
              type="email"
              value={supervisorEmail}
              onChange={(e) => setSupervisorEmail(e.target.value)}
              placeholder="supervisor@vettpro.co.za"
            />
          </div>

          {/* Request Reason */}
          <div className="space-y-2">
            <Label htmlFor="request-reason">
              Request Reason <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="request-reason"
              value={requestReason}
              onChange={(e) => setRequestReason(e.target.value)}
              placeholder="Please provide a reason for this bulk action request..."
              className="min-h-[100px]"
            />
          </div>

          {/* Notice */}
          <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-700">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-800 dark:text-amber-200">
                  Approval Required
                </p>
                <p className="text-amber-700 dark:text-amber-300">
                  An email notification will be sent to the supervisor for approval. 
                  You will be notified once the request is processed.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <NeumorphicButton
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </NeumorphicButton>
          <NeumorphicButton
            onClick={handleSubmit}
            disabled={!requestReason.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Mail className="h-4 w-4 mr-2 animate-spin" />
                Sending Request...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Send Approval Request
              </>
            )}
          </NeumorphicButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}