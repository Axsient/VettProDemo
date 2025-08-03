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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  NeumorphicText,
  NeumorphicCard
} from '@/components/ui/neumorphic';
import { 
  Users, 
  ArrowUp, 
  Download,
  CheckCircle,
  AlertTriangle,
  Mail,
  User,
  Clock,
  Shield,
  FileText,
  Send
} from 'lucide-react';
import { ActiveVettingCase } from '@/types/vetting';
import { toast } from 'sonner';

interface BulkActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  action: 'assign' | 'update-priority' | 'export' | 'bulk-approve';
  selectedCases: ActiveVettingCase[];
  onSubmit: (action: string, data: FormData) => void;
}

interface FormData {
  assignedOfficer?: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
  exportFormat?: 'csv' | 'json' | 'pdf';
  notes: string;
  supervisorEmail: string;
  requestReason: string;
}

interface FormErrors {
  assignedOfficer?: string;
  priority?: string;
  exportFormat?: string;
  notes?: string;
  supervisorEmail?: string;
  requestReason?: string;
}

// Sample officers for assignment
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

// Sample supervisors for approval
const availableSupervisors = [
  { name: 'Sarah Mitchell', email: 'sarah.mitchell@company.com', role: 'Operations Manager' },
  { name: 'David Chen', email: 'david.chen@company.com', role: 'Senior Supervisor' },
  { name: 'Maria Rodriguez', email: 'maria.rodriguez@company.com', role: 'Quality Assurance Lead' }
];

export const BulkActionDialog: React.FC<BulkActionDialogProps> = ({
  isOpen,
  onClose,
  action,
  selectedCases,
  onSubmit
}) => {
  const [formData, setFormData] = useState<FormData>({
    notes: '',
    supervisorEmail: '',
    requestReason: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        notes: '',
        supervisorEmail: availableSupervisors[0].email,
        requestReason: ''
      });
      setErrors({});
    }
  }, [isOpen, action]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Common validations
    if (!formData.notes.trim()) {
      newErrors.notes = 'Notes are required for bulk actions';
    } else if (formData.notes.trim().length < 20) {
      newErrors.notes = 'Notes must be at least 20 characters long';
    }

    if (!formData.supervisorEmail) {
      newErrors.supervisorEmail = 'Supervisor email is required for approval';
    }

    if (!formData.requestReason.trim()) {
      newErrors.requestReason = 'Reason for bulk action is required';
    }

    // Action-specific validations
    switch (action) {
      case 'assign':
        if (!formData.assignedOfficer) {
          newErrors.assignedOfficer = 'Please select an officer to assign cases to';
        }
        break;
      case 'update-priority':
        if (!formData.priority) {
          newErrors.priority = 'Please select a priority level';
        }
        break;
      case 'export':
        if (!formData.exportFormat) {
          newErrors.exportFormat = 'Please select an export format';
        }
        break;
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Prepare submission data
      const submissionData = {
        ...formData,
        selectedCaseIds: selectedCases.map(c => c.id),
        caseCount: selectedCases.length,
        timestamp: new Date().toISOString(),
        requestedBy: 'Current User',
        caseSummary: selectedCases.map(c => ({
          caseNumber: c.caseNumber,
          entityName: c.entityName,
          currentStatus: c.status,
          priority: c.priority
        }))
      };

      onSubmit(action, submissionData);
      
      // Show success message based on action
      const actionLabels = {
        'assign': 'assignment',
        'update-priority': 'priority update',
        'export': 'export',
        'bulk-approve': 'bulk approval'
      };
      
      toast.success(
        `${actionLabels[action as keyof typeof actionLabels]} request sent to supervisor for approval`
      );
      
      onClose();
    } catch (error) {
      console.error('Bulk action failed:', error);
      toast.error('Failed to perform bulk action');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      notes: '',
      supervisorEmail: '',
      requestReason: ''
    });
    setErrors({});
    onClose();
  };

  const getActionDetails = () => {
    const details = {
      'assign': {
        title: 'Bulk Assign Cases',
        description: 'Assign multiple cases to a vetting officer',
        icon: Users,
        color: 'text-blue-400'
      },
      'update-priority': {
        title: 'Update Priority',
        description: 'Change priority level for multiple cases',
        icon: ArrowUp,
        color: 'text-yellow-400'
      },
      'export': {
        title: 'Export Cases',
        description: 'Export selected cases in specified format',
        icon: Download,
        color: 'text-green-400'
      },
      'bulk-approve': {
        title: 'Bulk Approve Cases',
        description: 'Approve multiple cases simultaneously',
        icon: CheckCircle,
        color: 'text-green-400'
      }
    };
    
    return details[action] || details['assign'];
  };

  const actionDetails = getActionDetails();
  const Icon = actionDetails.icon;

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-3xl bg-[var(--neumorphic-background)] border-[var(--neumorphic-border)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[var(--neumorphic-text-primary)]">
            <Icon className={`w-5 h-5 ${actionDetails.color}`} />
            {actionDetails.title}
          </DialogTitle>
          <NeumorphicText variant="secondary">
            {actionDetails.description} - {selectedCases.length} cases selected
          </NeumorphicText>
        </DialogHeader>

        {/* Selected Cases Summary */}
        <NeumorphicCard className="p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <NeumorphicText className="font-medium">Selected Cases</NeumorphicText>
            <Badge variant="outline">{selectedCases.length} cases</Badge>
          </div>
          
          <div className="max-h-32 overflow-y-auto space-y-2">
            {selectedCases.slice(0, 5).map((vettingCase) => (
              <div key={vettingCase.id} className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-mono">{vettingCase.caseNumber}</span>
                  <span className="ml-2 text-[var(--neumorphic-text-secondary)]">
                    {vettingCase.entityName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {vettingCase.priority}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {vettingCase.status}
                  </Badge>
                </div>
              </div>
            ))}
            {selectedCases.length > 5 && (
              <NeumorphicText size="xs" variant="secondary" className="text-center pt-2">
                ... and {selectedCases.length - 5} more cases
              </NeumorphicText>
            )}
          </div>
        </NeumorphicCard>

        <div className="space-y-4">
          {/* Action-Specific Fields */}
          {action === 'assign' && (
            <div className="space-y-2">
              <Label htmlFor="assignedOfficer" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Assign to Officer *
              </Label>
              <Select 
                value={formData.assignedOfficer} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, assignedOfficer: value }))}
              >
                <SelectTrigger className={errors.assignedOfficer ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select an officer" />
                </SelectTrigger>
                <SelectContent>
                  {availableOfficers.map((officer) => (
                    <SelectItem key={officer} value={officer}>
                      {officer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.assignedOfficer && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {errors.assignedOfficer}
                </p>
              )}
            </div>
          )}

          {action === 'update-priority' && (
            <div className="space-y-2">
              <Label htmlFor="priority" className="flex items-center gap-2">
                <ArrowUp className="w-4 h-4" />
                New Priority Level *
              </Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value: 'Low' | 'Medium' | 'High' | 'Urgent') => 
                  setFormData(prev => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger className={errors.priority ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select priority level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {errors.priority}
                </p>
              )}
            </div>
          )}

          {action === 'export' && (
            <div className="space-y-2">
              <Label htmlFor="exportFormat" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Format *
              </Label>
              <Select 
                value={formData.exportFormat} 
                onValueChange={(value: 'csv' | 'json' | 'pdf') => 
                  setFormData(prev => ({ ...prev, exportFormat: value }))
                }
              >
                <SelectTrigger className={errors.exportFormat ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select export format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV - Comma Separated Values</SelectItem>
                  <SelectItem value="json">JSON - JavaScript Object Notation</SelectItem>
                  <SelectItem value="pdf">PDF - Portable Document Format</SelectItem>
                </SelectContent>
              </Select>
              {errors.exportFormat && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {errors.exportFormat}
                </p>
              )}
            </div>
          )}

          {/* Supervisor Selection */}
          <div className="space-y-2">
            <Label htmlFor="supervisorEmail" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Supervisor for Approval *
            </Label>
            <Select 
              value={formData.supervisorEmail} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, supervisorEmail: value }))}
            >
              <SelectTrigger className={errors.supervisorEmail ? 'border-red-500' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableSupervisors.map((supervisor) => (
                  <SelectItem key={supervisor.email} value={supervisor.email}>
                    <div className="flex flex-col">
                      <span>{supervisor.name}</span>
                      <span className="text-xs text-[var(--neumorphic-text-secondary)]">
                        {supervisor.role}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.supervisorEmail && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {errors.supervisorEmail}
              </p>
            )}
          </div>

          {/* Reason for Request */}
          <div className="space-y-2">
            <Label htmlFor="requestReason" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Reason for Bulk Action *
            </Label>
            <Textarea
              id="requestReason"
              placeholder="Explain why this bulk action is needed..."
              value={formData.requestReason}
              onChange={(e) => setFormData(prev => ({ ...prev, requestReason: e.target.value }))}
              className={errors.requestReason ? 'border-red-500' : ''}
              rows={3}
            />
            {errors.requestReason && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {errors.requestReason}
              </p>
            )}
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Additional Notes *
            </Label>
            <Textarea
              id="notes"
              placeholder="Provide detailed notes about this bulk action request..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className={errors.notes ? 'border-red-500' : ''}
              rows={4}
            />
            {errors.notes && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {errors.notes}
              </p>
            )}
            <NeumorphicText size="xs" variant="secondary">
              These notes will be included in the supervisor approval request.
            </NeumorphicText>
          </div>

          {/* Approval Process Info */}
          <NeumorphicCard className="p-4 bg-blue-500/5 border-blue-400/30">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <NeumorphicText className="font-medium text-blue-400">
                Supervisor Approval Required
              </NeumorphicText>
            </div>
            <NeumorphicText size="sm" variant="secondary">
              This bulk action requires supervisor approval. An email will be sent to the selected supervisor with:
            </NeumorphicText>
            <ul className="mt-2 text-sm text-[var(--neumorphic-text-secondary)] space-y-1">
              <li>• Details of the selected cases</li>
              <li>• Requested action and parameters</li>
              <li>• Your justification and notes</li>
              <li>• Approval/rejection buttons</li>
            </ul>
          </NeumorphicCard>
        </div>

        <DialogFooter className="pt-4 border-t border-[var(--neumorphic-border)]">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--neumorphic-text-secondary)]" />
              <NeumorphicText size="xs" variant="secondary">
                Request will be logged and tracked
              </NeumorphicText>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending Request...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send for Approval
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