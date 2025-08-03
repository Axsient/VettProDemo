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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
// Removed Select imports - using native select elements
import { Badge } from '@/components/ui/badge';
import { 
  NeumorphicText,
  NeumorphicCard
} from '@/components/ui/neumorphic';
import { 
  Edit2, 
  Save, 
  X, 
  AlertTriangle,
  User,
  Calendar,
  Flag
} from 'lucide-react';
import { ActiveVettingCase, VettingStatus } from '@/types/vetting';
import { toast } from 'sonner';

interface EditCaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vettingCase: ActiveVettingCase;
  onSave: (updatedCase: Partial<ActiveVettingCase>) => void;
}

interface FormData {
  assignedVettingOfficer: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: VettingStatus;
  estimatedCompletionDate: string;
  notes: string;
  flaggedForReview: boolean;
  flaggedReason: string;
}

interface FormErrors {
  assignedVettingOfficer?: string;
  priority?: string;
  status?: string;
  estimatedCompletionDate?: string;
  flaggedReason?: string;
}

// Sample officers for the dropdown
const availableOfficers = [
  'Mike Stevens',
  'Lisa Chen', 
  'Fatima Patel',
  'Janet Williams',
  'Robert Brown',
  'Emma Thompson',
  'Mark Johnson',
  'Dr. Ahmed Hassan'
];

export const EditCaseDialog: React.FC<EditCaseDialogProps> = ({
  isOpen,
  onClose,
  vettingCase,
  onSave
}) => {
  const [formData, setFormData] = useState<FormData>({
    assignedVettingOfficer: '',
    priority: 'Medium',
    status: VettingStatus.IN_PROGRESS,
    estimatedCompletionDate: '',
    notes: '',
    flaggedForReview: false,
    flaggedReason: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form data when dialog opens
  useEffect(() => {
    if (isOpen && vettingCase) {
      setFormData({
        assignedVettingOfficer: vettingCase.assignedVettingOfficer || '',
        priority: vettingCase.priority,
        status: vettingCase.status,
        estimatedCompletionDate: vettingCase.estimatedCompletionDate ? 
          new Date(vettingCase.estimatedCompletionDate).toISOString().split('T')[0] : '',
        notes: '', // This would be new notes for the edit
        flaggedForReview: vettingCase.flaggedForReview || false,
        flaggedReason: vettingCase.flaggedReason || ''
      });
      setErrors({});
    }
  }, [isOpen, vettingCase]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.assignedVettingOfficer.trim()) {
      newErrors.assignedVettingOfficer = 'Assigned officer is required';
    }

    if (!formData.estimatedCompletionDate) {
      newErrors.estimatedCompletionDate = 'Estimated completion date is required';
    } else {
      const selectedDate = new Date(formData.estimatedCompletionDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.estimatedCompletionDate = 'Completion date cannot be in the past';
      }
    }

    if (formData.flaggedForReview && !formData.flaggedReason.trim()) {
      newErrors.flaggedReason = 'Reason is required when flagging for review';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    setIsSaving(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updates: Partial<ActiveVettingCase> = {
        assignedVettingOfficer: formData.assignedVettingOfficer,
        priority: formData.priority,
        status: formData.status,
        estimatedCompletionDate: formData.estimatedCompletionDate,
        flaggedForReview: formData.flaggedForReview,
        flaggedReason: formData.flaggedForReview ? formData.flaggedReason : undefined,
        lastStatusUpdate: new Date().toISOString(),
        lastStatusUpdateBy: 'Current User' // In real app, this would be the logged-in user
      };

      onSave(updates);
      toast.success('Case updated successfully');
      onClose();
    } catch (error) {
      console.error('Failed to update case:', error);
      toast.error('Failed to update case');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      assignedVettingOfficer: '',
      priority: 'Medium',
      status: VettingStatus.IN_PROGRESS,
      estimatedCompletionDate: '',
      notes: '',
      flaggedForReview: false,
      flaggedReason: ''
    });
    setErrors({});
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-2xl bg-[var(--neumorphic-background)] border-[var(--neumorphic-border)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[var(--neumorphic-text-primary)]">
            <Edit2 className="w-5 h-5 text-blue-400" />
            Edit Case - {vettingCase?.caseNumber}
          </DialogTitle>
        </DialogHeader>

        {/* Case Summary */}
        <NeumorphicCard className="p-4 mb-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <NeumorphicText size="xs" variant="secondary">Entity</NeumorphicText>
              <NeumorphicText className="font-medium">{vettingCase?.entityName}</NeumorphicText>
            </div>
            <div>
              <NeumorphicText size="xs" variant="secondary">Type</NeumorphicText>
              <Badge variant="outline" className="mt-1">
                {vettingCase?.entityType}
              </Badge>
            </div>
            <div>
              <NeumorphicText size="xs" variant="secondary">Progress</NeumorphicText>
              <NeumorphicText className="font-medium">{vettingCase?.overallProgress}%</NeumorphicText>
            </div>
            <div>
              <NeumorphicText size="xs" variant="secondary">Initiated</NeumorphicText>
              <NeumorphicText className="font-medium">
                {vettingCase?.initiatedDate ? formatDate(vettingCase.initiatedDate) : 'Unknown'}
              </NeumorphicText>
            </div>
          </div>
        </NeumorphicCard>

        <div className="space-y-4">
          {/* Assigned Officer */}
          <div className="space-y-2">
            <Label htmlFor="assignedOfficer" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Assigned Vetting Officer *
            </Label>
            <select 
              value={formData.assignedVettingOfficer} 
              onChange={(e) => setFormData(prev => ({ ...prev, assignedVettingOfficer: e.target.value }))}
              className={`flex h-9 w-full items-center justify-between rounded-md border px-3 py-2 text-sm text-neumorphic-text-primary placeholder:text-neumorphic-text-secondary focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.assignedVettingOfficer ? 'border-red-500' : 'border-neumorphic-border/20'
              } bg-neumorphic-button`}
            >
              <option value="">Select an officer</option>
              {availableOfficers.map((officer) => (
                <option key={officer} value={officer}>
                  {officer}
                </option>
              ))}
            </select>
            {errors.assignedVettingOfficer && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {errors.assignedVettingOfficer}
              </p>
            )}
          </div>

          {/* Priority and Status Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority" className="flex items-center gap-2">
                <Flag className="w-4 h-4" />
                Priority
              </Label>
              <select 
                value={formData.priority} 
                onChange={(e) => 
                  setFormData(prev => ({ ...prev, priority: e.target.value as 'Low' | 'Medium' | 'High' | 'Urgent' }))
                }
                className="flex h-9 w-full items-center justify-between rounded-md border border-neumorphic-border/20 bg-neumorphic-button px-3 py-2 text-sm text-neumorphic-text-primary placeholder:text-neumorphic-text-secondary focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select 
                value={formData.status} 
                onChange={(e) => 
                  setFormData(prev => ({ ...prev, status: e.target.value as VettingStatus }))
                }
                className="flex h-9 w-full items-center justify-between rounded-md border border-neumorphic-border/20 bg-neumorphic-button px-3 py-2 text-sm text-neumorphic-text-primary placeholder:text-neumorphic-text-secondary focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value={VettingStatus.INITIATED}>Initiated</option>
                <option value={VettingStatus.CONSENT_PENDING}>Consent Pending</option>
                <option value={VettingStatus.IN_PROGRESS}>In Progress</option>
                <option value={VettingStatus.PARTIALLY_COMPLETE}>Partially Complete</option>
                <option value={VettingStatus.COMPLETE}>Complete</option>
                <option value={VettingStatus.CANCELLED}>Cancelled</option>
              </select>
            </div>
          </div>

          {/* Estimated Completion Date */}
          <div className="space-y-2">
            <Label htmlFor="completionDate" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Estimated Completion Date *
            </Label>
            <Input
              id="completionDate"
              type="date"
              value={formData.estimatedCompletionDate}
              onChange={(e) => setFormData(prev => ({ ...prev, estimatedCompletionDate: e.target.value }))}
              className={errors.estimatedCompletionDate ? 'border-red-500' : ''}
            />
            {errors.estimatedCompletionDate && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {errors.estimatedCompletionDate}
              </p>
            )}
          </div>

          {/* Review Flag Section */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="flaggedForReview"
                checked={formData.flaggedForReview}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  flaggedForReview: e.target.checked,
                  flaggedReason: e.target.checked ? prev.flaggedReason : ''
                }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="flaggedForReview" className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                Flag for Review
              </Label>
            </div>
            
            {formData.flaggedForReview && (
              <div className="space-y-2 ml-6">
                <Label htmlFor="flaggedReason">Reason for Review *</Label>
                <Textarea
                  id="flaggedReason"
                  placeholder="Explain why this case requires review..."
                  value={formData.flaggedReason}
                  onChange={(e) => setFormData(prev => ({ ...prev, flaggedReason: e.target.value }))}
                  className={errors.flaggedReason ? 'border-red-500' : ''}
                  rows={3}
                />
                {errors.flaggedReason && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {errors.flaggedReason}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes about this case edit..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="pt-4 border-t border-[var(--neumorphic-border)]">
          <div className="flex items-center justify-between w-full">
            <NeumorphicText size="xs" variant="secondary">
              Changes will be logged in the case timeline
            </NeumorphicText>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
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