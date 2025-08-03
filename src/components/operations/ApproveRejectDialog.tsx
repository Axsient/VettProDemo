'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  NeumorphicText,
  NeumorphicCard
} from '@/components/ui/neumorphic';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Shield,
  User,
  FileText
} from 'lucide-react';
import { ActiveVettingCase } from '@/types/vetting';
import { toast } from 'sonner';

interface ApproveRejectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vettingCase: ActiveVettingCase;
  action: 'approve' | 'reject';
  onApprove: (caseId: string, comment: string) => void;
  onReject: (caseId: string, comment: string) => void;
}

interface FormData {
  comment: string;
  confirmAction: boolean;
}

interface FormErrors {
  comment?: string;
  confirmAction?: string;
}

export const ApproveRejectDialog: React.FC<ApproveRejectDialogProps> = ({
  isOpen,
  onClose,
  vettingCase,
  action,
  onApprove,
  onReject
}) => {
  const [formData, setFormData] = useState<FormData>({
    comment: '',
    confirmAction: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        comment: '',
        confirmAction: false
      });
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.comment.trim()) {
      newErrors.comment = `Comment is required when ${action === 'approve' ? 'approving' : 'rejecting'} a case`;
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = 'Comment must be at least 10 characters long';
    }

    if (!formData.confirmAction) {
      newErrors.confirmAction = `You must confirm this ${action} action`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (action === 'approve') {
        onApprove(vettingCase.id, formData.comment);
        toast.success(`Case ${vettingCase.caseNumber} approved successfully`);
      } else {
        onReject(vettingCase.id, formData.comment);
        toast.success(`Case ${vettingCase.caseNumber} rejected successfully`);
      }
      
      onClose();
    } catch {
      toast.error(`Failed to ${action} case`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      comment: '',
      confirmAction: false
    });
    setErrors({});
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getOverallRiskLevel = () => {
    if (!vettingCase) return 'Pending Assessment';
    const completedChecks = vettingCase.individualChecks.filter(c => c.status === 'Complete');
    if (completedChecks.length === 0) return 'Pending Assessment';
    
    const avgRiskScore = completedChecks.reduce((sum, check) => sum + (check.riskScore || 0), 0) / completedChecks.length;
    
    if (avgRiskScore >= 70) return 'High';
    if (avgRiskScore >= 40) return 'Medium';
    if (avgRiskScore >= 20) return 'Low';
    return 'Minimal';
  };

  const riskLevel = getOverallRiskLevel();
  const completedChecks = vettingCase?.individualChecks.filter(c => c.status === 'Complete') || [];

  // Don't render if no vetting case
  if (!vettingCase) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-2xl bg-[var(--neumorphic-background)] border-[var(--neumorphic-border)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[var(--neumorphic-text-primary)]">
            {action === 'approve' ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
            {action === 'approve' ? 'Approve' : 'Reject'} Case - {vettingCase.caseNumber}
          </DialogTitle>
        </DialogHeader>

        {/* Case Summary */}
        <NeumorphicCard className="p-4 mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <NeumorphicText size="xs" variant="secondary">Entity</NeumorphicText>
              <NeumorphicText className="font-medium">{vettingCase.entityName}</NeumorphicText>
            </div>
            <div>
              <NeumorphicText size="xs" variant="secondary">Type</NeumorphicText>
              <Badge variant="outline" className="mt-1">
                {vettingCase.entityType}
              </Badge>
            </div>
            <div>
              <NeumorphicText size="xs" variant="secondary">Current Status</NeumorphicText>
              <Badge variant="outline" className="mt-1">
                {vettingCase.status}
              </Badge>
            </div>
            <div>
              <NeumorphicText size="xs" variant="secondary">Priority</NeumorphicText>
              <Badge 
                variant={vettingCase.priority === 'Urgent' ? 'destructive' : 'outline'}
                className="mt-1"
              >
                {vettingCase.priority}
              </Badge>
            </div>
          </div>

          {/* Risk Assessment Summary */}
          <div className="pt-4 border-t border-[var(--neumorphic-border)]">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <NeumorphicText size="xs" variant="secondary">Progress</NeumorphicText>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2 bg-[var(--neumorphic-surface-secondary)] rounded-full flex-1">
                    <div 
                      className="h-full bg-blue-400 rounded-full transition-all duration-300"
                      style={{ width: `${vettingCase.overallProgress}%` }}
                    />
                  </div>
                  <NeumorphicText className="font-medium">{vettingCase.overallProgress}%</NeumorphicText>
                </div>
              </div>
              <div>
                <NeumorphicText size="xs" variant="secondary">Checks Complete</NeumorphicText>
                <NeumorphicText className="font-medium">
                  {completedChecks.length} of {vettingCase.individualChecks.length}
                </NeumorphicText>
              </div>
              <div>
                <NeumorphicText size="xs" variant="secondary">Risk Level</NeumorphicText>
                <Badge 
                  variant={riskLevel === 'High' ? 'destructive' : riskLevel === 'Medium' ? 'secondary' : 'outline'}
                  className="mt-1"
                >
                  {riskLevel}
                </Badge>
              </div>
            </div>
          </div>
        </NeumorphicCard>

        {/* Action Details */}
        <NeumorphicCard className={`p-4 mb-4 ${action === 'approve' ? 'bg-green-500/5 border-green-400/30' : 'bg-red-500/5 border-red-400/30'}`}>
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-blue-400" />
            <NeumorphicText className="font-medium">
              {action === 'approve' ? 'Approval' : 'Rejection'} Summary
            </NeumorphicText>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Action:</span>
              <span className={`font-medium ${action === 'approve' ? 'text-green-400' : 'text-red-400'}`}>
                {action === 'approve' ? 'APPROVE CASE' : 'REJECT CASE'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>New Status:</span>
              <Badge variant={action === 'approve' ? 'default' : 'destructive'}>
                {action === 'approve' ? 'Approved' : 'Rejected'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Final Cost:</span>
              <span className="font-medium">{formatCurrency(vettingCase.totalEstimatedCost || 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Processing Time:</span>
              <span className="font-medium">{vettingCase.daysSinceInitiated} days</span>
            </div>
          </div>
        </NeumorphicCard>

        <div className="space-y-4">
          {/* Comment Section */}
          <div className="space-y-2">
            <Label htmlFor="comment" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {action === 'approve' ? 'Approval' : 'Rejection'} Comment *
            </Label>
            <Textarea
              id="comment"
              placeholder={`Provide detailed ${action === 'approve' ? 'approval' : 'rejection'} reason and any additional notes...`}
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              className={errors.comment ? 'border-red-500' : ''}
              rows={4}
            />
            {errors.comment && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {errors.comment}
              </p>
            )}
            <NeumorphicText size="xs" variant="secondary">
              This comment will be permanently recorded in the case timeline.
            </NeumorphicText>
          </div>

          {/* Confirmation Checkbox */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="confirmAction"
                checked={formData.confirmAction}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, confirmAction: checked as boolean }))}
              />
              <Label htmlFor="confirmAction" className="text-sm">
                I confirm that I want to {action} this case. This action cannot be undone.
              </Label>
            </div>
            {errors.confirmAction && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {errors.confirmAction}
              </p>
            )}
          </div>

          {/* Warning for rejection */}
          {action === 'reject' && (
            <div className="p-3 bg-red-500/10 border border-red-400/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <NeumorphicText className="font-medium text-red-400">
                  Warning: Rejection Action
                </NeumorphicText>
              </div>
              <NeumorphicText size="sm" variant="secondary">
                Rejecting this case will permanently mark it as failed. The entity will be notified of the rejection.
              </NeumorphicText>
            </div>
          )}
        </div>

        <DialogFooter className="pt-4 border-t border-[var(--neumorphic-border)]">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[var(--neumorphic-text-secondary)]" />
              <NeumorphicText size="xs" variant="secondary">
                Action by: Current User
              </NeumorphicText>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                variant={action === 'approve' ? 'default' : 'destructive'}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {action === 'approve' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    {action === 'approve' ? 'Approve Case' : 'Reject Case'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};