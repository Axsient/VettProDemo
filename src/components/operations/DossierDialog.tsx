'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Download,
  Eye,
  CheckCircle,
  AlertTriangle,
  User,
  Shield,
  Info,
  TrendingUp
} from 'lucide-react';
import { CaseDossier, formatZAR } from '@/lib/sample-data/operations-dashboard-data';
import { cn } from '@/lib/utils';

interface DossierDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dossier: CaseDossier;
}

export default function DossierDialog({
  isOpen,
  onClose,
  dossier
}: DossierDialogProps) {
  const [selectedSection, setSelectedSection] = useState<string>('overview');

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'minimal':
        return 'text-green-400 bg-green-500/20';
      case 'moderate':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'high':
        return 'text-orange-400 bg-orange-500/20';
      case 'critical':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-blue-400 bg-blue-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'complete':
        return 'text-green-400 bg-green-500/20';
      case 'in progress':
        return 'text-blue-400 bg-blue-500/20';
      case 'failed':
        return 'text-red-400 bg-red-500/20';
      case 'pending':
        return 'text-gray-400 bg-gray-500/20';
      default:
        return 'text-blue-400 bg-blue-500/20';
    }
  };

  const getResultColor = (result: string) => {
    switch (result.toLowerCase()) {
      case 'clear':
        return 'text-green-400 bg-green-500/20';
      case 'adverse':
        return 'text-red-400 bg-red-500/20';
      case 'inconclusive':
        return 'text-yellow-400 bg-yellow-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'low':
        return 'text-green-400 bg-green-500/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'high':
        return 'text-orange-400 bg-orange-500/20';
      case 'critical':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-blue-400 bg-blue-500/20';
    }
  };

  const getOverdueStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'on schedule':
        return 'text-green-400 bg-green-500/20';
      case 'at risk':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'overdue':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-blue-400 bg-blue-500/20';
    }
  };

  const exportDossier = () => {
    const content = `
INTERIM INVESTIGATION DOSSIER
Case Reference: ${dossier.caseReference}
Entity: ${dossier.entityName}
Generated: ${new Date().toLocaleString()}

EXECUTIVE SUMMARY
=================
Overall Progress: ${dossier.overallProgress}%
Risk Assessment: ${dossier.riskAssessment}
Checks Completed: ${dossier.checksCompleted}
Days Active: ${dossier.daysActive}
Current Status: ${dossier.currentStatus}
Overdue Status: ${dossier.overdueStatus}
Total Cost: ${formatZAR(dossier.totalCost)}

CHECK RESULTS
=============
${dossier.checkResults.map(check => `
${check.checkType}: ${check.status}${check.result ? ` (${check.result})` : ''}
Provider: ${check.provider}
${check.completedDate ? `Completed: ${check.completedDate}` : ''}
`).join('\n')}

KEY FINDINGS
============
${dossier.keyFindings.map(finding => `
${finding.category}: ${finding.finding} (${finding.severity})
`).join('\n')}

DOCUMENTS
=========
${dossier.documents.map(doc => `
${doc.name} (${doc.type})
Uploaded: ${doc.uploadedDate} by ${doc.uploadedBy}
`).join('\n')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dossier.caseReference}_dossier.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sections = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'checks', label: 'Check Results', icon: CheckCircle },
    { id: 'findings', label: 'Key Findings', icon: AlertTriangle },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'subject', label: 'Subject Info', icon: User },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        variant="neumorphic" 
        className="max-w-6xl max-h-[95vh] flex flex-col"
      >
        <DialogHeader variant="neumorphic">
          <DialogTitle variant="neumorphic" className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            Interim Investigation Dossier
          </DialogTitle>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4 text-sm text-neumorphic-text-secondary">
              <span><strong>Case:</strong> {dossier.caseReference}</span>
              <span><strong>Entity:</strong> {dossier.entityName}</span>
              <span><strong>Type:</strong> {dossier.entityType}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={cn("text-xs", getRiskColor(dossier.riskAssessment))}>
                {dossier.riskAssessment} Risk
              </Badge>
              <Badge className={cn("text-xs", getOverdueStatusColor(dossier.overdueStatus))}>
                {dossier.overdueStatus}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0 flex gap-4">
          {/* Navigation Sidebar */}
          <div className="w-48 flex-shrink-0">
            <div className="bg-neumorphic-card/30 rounded-lg p-3">
              <div className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setSelectedSection(section.id)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                      "hover:bg-neumorphic-button/30",
                      selectedSection === section.id && "bg-neumorphic-accent/20 text-neumorphic-accent"
                    )}
                  >
                    <section.icon className="h-4 w-4" />
                    {section.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <ScrollArea className="h-full pr-4">
              {selectedSection === 'overview' && (
                <div className="space-y-6">
                  {/* Case Information */}
                  <div className="bg-neumorphic-card/30 rounded-lg p-4">
                    <h3 className="font-semibold text-neumorphic-text-primary mb-3 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Case Information
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-neumorphic-text-secondary">Priority Level:</span>
                        <p className="font-medium text-neumorphic-text-primary">{dossier.priorityLevel}</p>
                      </div>
                      <div>
                        <span className="text-neumorphic-text-secondary">Initiated:</span>
                        <p className="font-medium text-neumorphic-text-primary">{dossier.initiatedDate}</p>
                      </div>
                      <div>
                        <span className="text-neumorphic-text-secondary">Assigned Officer:</span>
                        <p className="font-medium text-neumorphic-text-primary">{dossier.assignedOfficer}</p>
                      </div>
                      <div>
                        <span className="text-neumorphic-text-secondary">Report Generated:</span>
                        <p className="font-medium text-neumorphic-text-primary">{dossier.reportGenerated}</p>
                      </div>
                      <div>
                        <span className="text-neumorphic-text-secondary">Days Active:</span>
                        <p className="font-medium text-neumorphic-text-primary">{dossier.daysActive} days</p>
                      </div>
                      <div>
                        <span className="text-neumorphic-text-secondary">Total Cost:</span>
                        <p className="font-medium text-neumorphic-text-primary">{formatZAR(dossier.totalCost)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Executive Summary */}
                  <div className="bg-neumorphic-card/30 rounded-lg p-4">
                    <h3 className="font-semibold text-neumorphic-text-primary mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Executive Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-neumorphic-text-secondary">Overall Progress</span>
                          <span className="text-sm font-medium text-neumorphic-text-primary">{dossier.overallProgress}%</span>
                        </div>
                        <div className="w-full bg-neumorphic-button/20 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${dossier.overallProgress}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-neumorphic-text-secondary">Risk Assessment</span>
                          <Badge className={cn("text-xs", getRiskColor(dossier.riskAssessment))}>
                            {dossier.riskAssessment}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-neumorphic-text-secondary">Checks Completed</span>
                          <span className="text-sm font-medium text-neumorphic-text-primary">{dossier.checksCompleted}</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-neumorphic-text-secondary">Current Status</span>
                          <Badge className={cn("text-xs", getStatusColor(dossier.currentStatus))}>
                            {dossier.currentStatus}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-neumorphic-text-secondary">Schedule Status</span>
                          <Badge className={cn("text-xs", getOverdueStatusColor(dossier.overdueStatus))}>
                            {dossier.overdueStatus}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-neumorphic-text-secondary">Investigation Days</span>
                          <span className="text-sm font-medium text-neumorphic-text-primary">{dossier.daysActive} days</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedSection === 'checks' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-neumorphic-text-primary mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Check Results Summary
                  </h3>
                  {dossier.checkResults.map((check, index) => (
                    <div key={index} className="bg-neumorphic-card/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-neumorphic-text-primary">{check.checkType}</h4>
                        <div className="flex items-center gap-2">
                          <Badge className={cn("text-xs", getStatusColor(check.status))}>
                            {check.status}
                          </Badge>
                          {check.result && (
                            <Badge className={cn("text-xs", getResultColor(check.result))}>
                              {check.result}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-neumorphic-text-secondary">Provider:</span>
                          <p className="font-medium text-neumorphic-text-primary">{check.provider}</p>
                        </div>
                        {check.completedDate && (
                          <div>
                            <span className="text-neumorphic-text-secondary">Completed:</span>
                            <p className="font-medium text-neumorphic-text-primary">{check.completedDate}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedSection === 'findings' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-neumorphic-text-primary mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Key Findings
                  </h3>
                  {dossier.keyFindings.map((finding, index) => (
                    <div key={index} className="bg-neumorphic-card/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-neumorphic-text-primary">{finding.category}</h4>
                        <Badge className={cn("text-xs", getSeverityColor(finding.severity))}>
                          {finding.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-neumorphic-text-secondary">{finding.finding}</p>
                    </div>
                  ))}
                </div>
              )}

              {selectedSection === 'documents' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-neumorphic-text-primary mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Documents
                  </h3>
                  {dossier.documents.map((doc, index) => (
                    <div key={index} className="bg-neumorphic-card/30 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-blue-500" />
                          <div>
                            <h4 className="font-medium text-neumorphic-text-primary text-sm">{doc.name}</h4>
                            <p className="text-xs text-neumorphic-text-secondary">{doc.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-xs text-neumorphic-text-secondary">
                            <p>Uploaded: {doc.uploadedDate}</p>
                            <p>By: {doc.uploadedBy}</p>
                          </div>
                          <Button variant="neumorphic-ghost" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedSection === 'subject' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-neumorphic-text-primary mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Subject Information
                  </h3>
                  <div className="bg-neumorphic-card/30 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-neumorphic-text-secondary">Entity Name:</span>
                        <p className="font-medium text-neumorphic-text-primary">{dossier.entityName}</p>
                      </div>
                      <div>
                        <span className="text-neumorphic-text-secondary">Entity Type:</span>
                        <p className="font-medium text-neumorphic-text-primary">{dossier.entityType}</p>
                      </div>
                      <div>
                        <span className="text-neumorphic-text-secondary">Case Reference:</span>
                        <p className="font-medium text-neumorphic-text-primary">{dossier.caseReference}</p>
                      </div>
                      <div>
                        <span className="text-neumorphic-text-secondary">Priority Level:</span>
                        <p className="font-medium text-neumorphic-text-primary">{dossier.priorityLevel}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter variant="neumorphic">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-sm text-neumorphic-text-secondary">
              <Shield className="h-4 w-4" />
              <span>Confidential Investigation Report</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="neumorphic-outline"
                size="sm"
                onClick={exportDossier}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export Report
              </Button>
              <Button
                variant="neumorphic-ghost"
                size="sm"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}