'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { NeumorphicCard, NeumorphicText } from '@/components/ui/neumorphic';
import CircularProgressRing from '@/components/ui/CircularProgressRing';
import { CheckResultCard } from './CheckResultCard';
import { CompletedVettingReport, RiskLevel } from '@/types/reports';
import { VettingEntityType } from '@/types/vetting';
import {
  FileText,
  Calendar,
  User,
  Building,
  Download,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Star
} from 'lucide-react';

interface ReportDossierModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: CompletedVettingReport;
}

export const ReportDossierModal: React.FC<ReportDossierModalProps> = ({
  open,
  onOpenChange,
  report
}) => {
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRiskBadge = (riskLevel: RiskLevel) => {
    switch (riskLevel) {
      case RiskLevel.CRITICAL:
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/40 text-lg px-3 py-1">
            <AlertTriangle className="w-4 h-4 mr-1" />
            Critical Risk
          </Badge>
        );
      case RiskLevel.HIGH:
        return (
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/40 text-lg px-3 py-1">
            <AlertTriangle className="w-4 h-4 mr-1" />
            High Risk
          </Badge>
        );
      case RiskLevel.MEDIUM:
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/40 text-lg px-3 py-1">
            <Clock className="w-4 h-4 mr-1" />
            Medium Risk
          </Badge>
        );
      case RiskLevel.LOW:
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/40 text-lg px-3 py-1">
            <CheckCircle className="w-4 h-4 mr-1" />
            Low Risk
          </Badge>
        );
    }
  };

  const getEntityIcon = (entityType: VettingEntityType) => {
    switch (entityType) {
      case VettingEntityType.INDIVIDUAL:
        return <User className="w-5 h-5 text-blue-400" />;
      case VettingEntityType.COMPANY:
        return <Building className="w-5 h-5 text-purple-400" />;
      case VettingEntityType.STAFF_MEDICAL:
        return <Shield className="w-5 h-5 text-green-400" />;
      default:
        return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };


  // Calculate check statistics
  const checkStats = {
    total: report.checkResults.length,
    clear: report.checkResults.filter(c => c.status === 'Clear').length,
    adverse: report.checkResults.filter(c => c.status === 'Adverse Finding').length,
    notPerformed: report.checkResults.filter(c => c.status === 'Not Performed').length,
    other: report.checkResults.filter(c => !['Clear', 'Adverse Finding', 'Not Performed'].includes(c.status)).length
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-hidden"
        style={{
          backgroundColor: 'var(--neumorphic-card)',
          border: '1px solid var(--neumorphic-border)',
          zIndex: 9999
        }}
      >
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-3 text-neumorphic-text-primary">
            <FileText className="w-6 h-6 text-blue-400" />
            Report Dossier
          </DialogTitle>
          <DialogDescription className="text-neumorphic-text-secondary">
            Comprehensive vetting analysis for {report.subjectName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Subject Information */}
          <NeumorphicCard className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {getEntityIcon(report.entityType)}
                  <div>
                    <NeumorphicText className="font-bold text-lg">
                      {report.subjectName}
                    </NeumorphicText>
                    <NeumorphicText variant="secondary" className="text-sm">
                      {report.entityType.replace('_', ' ')}
                    </NeumorphicText>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neumorphic-text-secondary">Report ID:</span>
                    <span className="text-neumorphic-text-primary font-mono">{report.reportId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neumorphic-text-secondary">Subject ID:</span>
                    <span className="text-neumorphic-text-primary font-mono">{report.subjectId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neumorphic-text-secondary">Completed:</span>
                    <span className="text-neumorphic-text-primary">{formatDate(report.completionDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neumorphic-text-secondary">Generated by:</span>
                    <span className="text-neumorphic-text-primary">{report.reportGeneratedBy}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="text-sm text-neumorphic-text-secondary mb-2">Overall Risk Assessment</div>
                  <CircularProgressRing
                    percentage={100 - report.overallRiskScore}
                    size={120}
                    strokeWidth={8}
                  />
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-neumorphic-text-primary">
                      {report.overallRiskScore}/100
                    </div>
                    {getRiskBadge(report.overallRiskLevel)}
                  </div>
                </div>
              </div>
            </div>
          </NeumorphicCard>

          {/* Executive Summary */}
          <NeumorphicCard className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <NeumorphicText className="font-medium text-lg">Executive Summary</NeumorphicText>
              </div>
              <NeumorphicText variant="secondary" className="leading-relaxed">
                {report.summary}
              </NeumorphicText>
            </div>
          </NeumorphicCard>

          {/* Check Results Overview */}
          <NeumorphicCard className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <NeumorphicText className="font-medium text-lg">Check Results Overview</NeumorphicText>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">{checkStats.clear} Clear</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400">{checkStats.adverse} Adverse</span>
                  </div>
                  {checkStats.notPerformed > 0 && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400">{checkStats.notPerformed} Not Performed</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Check Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {report.checkResults.map((checkResult, index) => (
                  <CheckResultCard
                    key={index}
                    checkResult={checkResult}
                  />
                ))}
              </div>
            </div>
          </NeumorphicCard>

          {/* Risk Breakdown */}
          <NeumorphicCard className="p-4">
            <div className="space-y-3">
              <NeumorphicText className="font-medium text-lg">Risk Analysis Breakdown</NeumorphicText>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="font-medium text-neumorphic-text-primary">Financial Risk</div>
                  <div className="text-neumorphic-text-secondary">
                    {checkStats.adverse > 0 && report.checkResults.some(c => 
                      c.checkName.toLowerCase().includes('credit') || 
                      c.checkName.toLowerCase().includes('financial')
                    ) ? 'Elevated due to credit/financial issues' : 'Within acceptable parameters'}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="font-medium text-neumorphic-text-primary">Compliance Risk</div>
                  <div className="text-neumorphic-text-secondary">
                    {checkStats.adverse > 0 && report.checkResults.some(c => 
                      c.checkName.toLowerCase().includes('registration') || 
                      c.checkName.toLowerCase().includes('compliance')
                    ) ? 'Compliance issues identified' : 'Compliant with regulations'}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="font-medium text-neumorphic-text-primary">Operational Risk</div>
                  <div className="text-neumorphic-text-secondary">
                    {report.overallRiskScore > 70 ? 'High operational risk due to adverse findings' :
                     report.overallRiskScore > 40 ? 'Moderate operational considerations' :
                     'Low operational risk profile'}
                  </div>
                </div>
              </div>
            </div>
          </NeumorphicCard>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-neumorphic-border">
          <div className="flex items-center gap-2 text-sm text-neumorphic-text-secondary">
            <Calendar className="w-4 h-4" />
            <span>Report generated on {formatDate(report.completionDate)}</span>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button variant="default" className="bg-blue-500 hover:bg-blue-600">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};