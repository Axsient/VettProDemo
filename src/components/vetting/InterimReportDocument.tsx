'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  User,
  Building,
  MapPin,
  Phone,
  FileText,
  TrendingUp,
  Zap
} from 'lucide-react';
import { ActiveVettingCase } from '@/types/vetting';
import { IndividualDetails, CompanyDetails, VettingEntityType } from '@/types/vetting';

interface InterimReportDocumentProps {
  vettingCase: ActiveVettingCase;
}

export const InterimReportDocument: React.FC<InterimReportDocumentProps> = ({
  vettingCase
}) => {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getOverallRiskLevel = () => {
    const completedChecks = vettingCase.individualChecks.filter(c => c.status === 'Complete');
    if (completedChecks.length === 0) return 'Pending Assessment';
    
    const avgRiskScore = completedChecks.reduce((sum, check) => sum + (check.riskScore || 0), 0) / completedChecks.length;
    
    if (avgRiskScore >= 70) return 'High';
    if (avgRiskScore >= 40) return 'Medium';
    if (avgRiskScore >= 20) return 'Low';
    return 'Minimal';
  };

  const getOverallRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-blue-600';
      case 'Minimal': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const renderEntityDetails = () => {
    if (vettingCase.entityType === VettingEntityType.INDIVIDUAL) {
      const details = vettingCase.entityDetails as IndividualDetails;
      return (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span className="font-medium">Personal Information</span>
            </div>
            <div className="pl-6 space-y-1 text-sm">
              <div><strong>Full Name:</strong> {details.firstName} {details.lastName}</div>
              <div><strong>ID Number:</strong> {details.idNumber || 'Not provided'}</div>
              <div><strong>Nationality:</strong> {details.nationality}</div>
              <div><strong>Date of Birth:</strong> {formatDate(details.dateOfBirth)}</div>
              <div><strong>Place of Birth:</strong> {details.placeOfBirth || 'Not specified'}</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-green-600" />
              <span className="font-medium">Contact Information</span>
            </div>
            <div className="pl-6 space-y-1 text-sm">
              <div><strong>Mobile:</strong> {details.mobileNumber}</div>
              <div><strong>Email:</strong> {details.emailAddress || 'Not provided'}</div>
            </div>
          </div>
        </div>
      );
    }

    if (vettingCase.entityType === VettingEntityType.COMPANY) {
      const details = vettingCase.entityDetails as CompanyDetails;
      return (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" />
              <span className="font-medium">Company Information</span>
            </div>
            <div className="pl-6 space-y-1 text-sm">
              <div><strong>Company Name:</strong> {details.companyName}</div>
              <div><strong>Registration Number:</strong> {details.registrationNumber}</div>
              <div><strong>VAT Number:</strong> {details.vatNumber || 'Not registered'}</div>
              <div><strong>Business Type:</strong> {details.businessType || 'Not specified'}</div>
              <div><strong>Industry:</strong> {details.industry || 'Not specified'}</div>
              <div><strong>Established:</strong> {details.yearEstablished || 'Unknown'}</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="font-medium">Contact & Location</span>
            </div>
            <div className="pl-6 space-y-1 text-sm">
              <div><strong>Primary Contact:</strong> {details.primaryContactName || 'Not provided'}</div>
              <div><strong>Contact Mobile:</strong> {details.primaryContactMobile || 'Not provided'}</div>
              <div><strong>Contact Email:</strong> {details.primaryContactEmail || 'Not provided'}</div>
              <div><strong>Physical Address:</strong> {details.physicalAddress || 'Not provided'}</div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const getCheckStatusIcon = (status: string) => {
    switch (status) {
      case 'Complete': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'In Progress': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'Failed': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'Pending': return <Clock className="w-4 h-4 text-gray-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const riskLevel = getOverallRiskLevel();
  const completedChecks = vettingCase.individualChecks.filter(c => c.status === 'Complete');
  const inProgressChecks = vettingCase.individualChecks.filter(c => c.status === 'In Progress');
  const pendingChecks = vettingCase.individualChecks.filter(c => 
    c.status === 'Pending' || c.status === 'Awaiting Subject Info'
  );

  return (
    <div className="max-w-4xl mx-auto bg-white text-black p-8 relative">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 z-0">
        <div className="text-6xl font-bold text-red-500 transform rotate-45">
          INTERIM REPORT
        </div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">VETTING INVESTIGATION DOSSIER</h1>
          </div>
          <div className="text-lg text-gray-600 font-medium">INTERIM INTELLIGENCE REPORT</div>
          <div className="text-sm text-gray-500 mt-2">Classification: CONFIDENTIAL</div>
        </div>

        {/* Case Information */}
        <div className="mb-8">
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-sm font-medium text-gray-600">Case Reference</div>
                <div className="text-lg font-mono font-bold text-blue-600">{vettingCase.caseNumber}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Entity Type</div>
                <div className="text-lg font-medium">{vettingCase.entityType}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Priority Level</div>
                <Badge 
                  variant={vettingCase.priority === 'Urgent' ? 'destructive' : 'default'}
                  className="text-sm"
                >
                  {vettingCase.priority}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-600">Initiated Date</div>
                <div className="font-medium">{formatDate(vettingCase.initiatedDate)}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Assigned Officer</div>
                <div className="font-medium">{vettingCase.assignedVettingOfficer || 'Unassigned'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Report Generated</div>
                <div className="font-medium">{new Date().toLocaleDateString('en-ZA')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Executive Summary
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Overall Progress:</span>
                    <span className="text-lg font-bold text-blue-600">{vettingCase.overallProgress}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Checks Completed:</span>
                    <span className="font-medium">{vettingCase.completedChecks} of {vettingCase.totalChecks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Current Status:</span>
                    <Badge variant="outline" className="text-sm">{vettingCase.status}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Total Cost:</span>
                    <span className="font-bold">{formatCurrency(vettingCase.totalEstimatedCost)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Risk Assessment:</span>
                    <span className={`font-bold text-lg ${getOverallRiskColor(riskLevel)}`}>
                      {riskLevel}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Days Active:</span>
                    <span className="font-medium">{vettingCase.daysSinceInitiated} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Overdue Status:</span>
                    <span className={`font-medium ${vettingCase.isOverdue ? 'text-red-600' : 'text-green-600'}`}>
                      {vettingCase.isOverdue ? 'OVERDUE' : 'On Schedule'}
                    </span>
                  </div>
                  {vettingCase.flaggedForReview && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Review Flag:</span>
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span className="font-medium text-red-600">FLAGGED</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Information */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Subject Information
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg border">
            {renderEntityDetails()}
          </div>
        </div>

        {/* Investigation Status */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Investigation Status
          </h2>
          
          {/* Status Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Completed</span>
              </div>
              <div className="text-2xl font-bold text-green-800">{completedChecks.length}</div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">In Progress</span>
              </div>
              <div className="text-2xl font-bold text-blue-800">{inProgressChecks.length}</div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">Pending</span>
              </div>
              <div className="text-2xl font-bold text-yellow-800">{pendingChecks.length}</div>
            </div>
          </div>

          {/* Detailed Check Results */}
          <div className="space-y-4">
            {vettingCase.individualChecks.map((check) => (
              <div key={check.checkId} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getCheckStatusIcon(check.status)}
                    <div>
                      <h4 className="font-medium text-gray-800">{check.checkDefinition.name}</h4>
                      <div className="text-sm text-gray-600">{check.provider}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={
                        check.status === 'Complete' ? 'default' :
                        check.status === 'In Progress' ? 'secondary' :
                        check.status === 'Failed' ? 'destructive' : 'outline'
                      }
                    >
                      {check.status}
                    </Badge>
                    {check.urgentFlag && (
                      <div className="flex items-center gap-1 mt-1">
                        <Zap className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs text-yellow-600 font-medium">URGENT</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Started</div>
                    <div className="font-medium">{formatDate(check.actualStartDate)}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Completed</div>
                    <div className="font-medium">
                      {check.actualCompletionDate ? formatDate(check.actualCompletionDate) : 'Pending'}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Cost</div>
                    <div className="font-medium">{check.cost ? formatCurrency(check.cost) : 'TBD'}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Risk Score</div>
                    <div className="font-medium">
                      {check.riskScore !== undefined ? `${check.riskScore}/100` : 'N/A'}
                    </div>
                  </div>
                </div>
                
                {check.result && (
                  <div className="mt-3 p-3 bg-gray-50 rounded">
                    <div className="text-sm font-medium text-gray-700 mb-1">Result:</div>
                    <div className="text-sm text-gray-800">{check.result}</div>
                  </div>
                )}
                
                {check.notes && (
                  <div className="mt-3 p-3 bg-blue-50 rounded">
                    <div className="text-sm font-medium text-blue-700 mb-1">Notes:</div>
                    <div className="text-sm text-blue-800">{check.notes}</div>
                  </div>
                )}
                
                {check.blockerReason && (
                  <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <div className="text-sm font-medium text-red-700">Blocked</div>
                    </div>
                    <div className="text-sm text-red-800">{check.blockerReason}</div>
                  </div>
                )}
                
                {check.providerReference && (
                  <div className="mt-2 text-xs text-gray-500">
                    Provider Reference: {check.providerReference}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Preliminary Assessment & Recommendations
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="space-y-4">
              {vettingCase.flaggedForReview && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-800">ATTENTION REQUIRED</span>
                  </div>
                  <p className="text-sm text-red-700">
                    This case has been flagged for review: {vettingCase.flaggedReason || 'Manual review required due to findings.'}
                  </p>
                </div>
              )}
              
              {vettingCase.isOverdue && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">TIMELINE CONCERN</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Investigation is overdue. Estimated completion was {formatDate(vettingCase.estimatedCompletionDate)}.
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-800">Next Steps:</h4>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {inProgressChecks.length > 0 && (
                    <li>Monitor {inProgressChecks.length} check(s) currently in progress</li>
                  )}
                  {pendingChecks.length > 0 && (
                    <li>Initiate {pendingChecks.length} pending check(s)</li>
                  )}
                  {vettingCase.hasBlockers && (
                    <li>Resolve blockers preventing progress on investigations</li>
                  )}
                  <li>Continue monitoring until all verifications complete</li>
                  <li>Prepare final risk assessment upon completion</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-gray-300 pt-6 text-center text-sm text-gray-600">
          <div className="mb-2">
            <strong>This is an INTERIM report based on investigations completed as of {new Date().toLocaleDateString('en-ZA')}</strong>
          </div>
          <div className="mb-2">
            Final assessment pending completion of all verification checks
          </div>
          <div className="text-xs">
            Generated by: Live Mission Board System | Classification: CONFIDENTIAL | 
            Case: {vettingCase.caseNumber} | Page 1 of 1
          </div>
        </div>
      </div>
    </div>
  );
};