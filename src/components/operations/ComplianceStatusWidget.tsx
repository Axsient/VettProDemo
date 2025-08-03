'use client';

import React from 'react';
import { NeumorphicCard } from '@/components/ui/neumorphic-card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, X, RefreshCw } from 'lucide-react';
import { DonutChart } from '@/components/charts/apex/components/DonutChart';

interface ComplianceStatus {
  cipcAnnualReturns: 'Up to Date' | 'Overdue' | 'Not Required';
  taxStatus: 'Compliant' | 'Non-Compliant' | 'Under Review';
  vatStatus: 'Registered' | 'Not Registered' | 'Deregistered';
  uifStatus: 'Compliant' | 'Non-Compliant' | 'Not Applicable';
}

interface ComplianceStatusWidgetProps {
  complianceStatus: ComplianceStatus;
  showChart?: boolean;
}

const statusColors = {
  'Up to Date': 'bg-green-500 text-white',
  'Compliant': 'bg-green-500 text-white',
  'Registered': 'bg-green-500 text-white',
  'Overdue': 'bg-red-500 text-white',
  'Non-Compliant': 'bg-red-500 text-white',
  'Deregistered': 'bg-red-500 text-white',
  'Under Review': 'bg-yellow-500 text-black',
  'Not Required': 'bg-gray-500 text-white',
  'Not Registered': 'bg-gray-500 text-white',
  'Not Applicable': 'bg-gray-500 text-white'
};

const statusIcons = {
  'Up to Date': CheckCircle,
  'Compliant': CheckCircle,
  'Registered': CheckCircle,
  'Overdue': X,
  'Non-Compliant': X,
  'Deregistered': X,
  'Under Review': RefreshCw,
  'Not Required': RefreshCw,
  'Not Registered': RefreshCw,
  'Not Applicable': RefreshCw
};

export const ComplianceStatusWidget: React.FC<ComplianceStatusWidgetProps> = ({ 
  complianceStatus, 
  showChart = true 
}) => {
  // Calculate overall compliance score
  const complianceScore = React.useMemo(() => {
    const scores: Record<string, number> = {
      'Up to Date': 100,
      'Compliant': 100,
      'Registered': 100,
      'Overdue': 0,
      'Non-Compliant': 0,
      'Deregistered': 0,
      'Under Review': 50,
      'Not Required': 75,
      'Not Registered': 75,
      'Not Applicable': 75
    };

    const statuses = Object.values(complianceStatus);
    const totalScore = statuses.reduce((sum, status) => sum + scores[status], 0);
    return Math.round(totalScore / statuses.length);
  }, [complianceStatus]);

  // Prepare chart data
  const chartData = React.useMemo(() => {
    const compliantCount = Object.values(complianceStatus).filter(status => 
      ['Up to Date', 'Compliant', 'Registered'].includes(status)
    ).length;
    
    const nonCompliantCount = Object.values(complianceStatus).filter(status => 
      ['Overdue', 'Non-Compliant', 'Deregistered'].includes(status)
    ).length;
    
    const underReviewCount = Object.values(complianceStatus).filter(status => 
      ['Under Review'].includes(status)
    ).length;
    
    const notApplicableCount = Object.values(complianceStatus).filter(status => 
      ['Not Required', 'Not Registered', 'Not Applicable'].includes(status)
    ).length;

    return [
      { name: 'Compliant', y: compliantCount },
      { name: 'Non-Compliant', y: nonCompliantCount },
      { name: 'Under Review', y: underReviewCount },
      { name: 'Not Applicable', y: notApplicableCount }
    ].filter(item => item.y > 0);
  }, [complianceStatus]);

  const getOverallStatus = () => {
    if (complianceScore >= 90) return { status: 'Excellent', color: 'text-green-600' };
    if (complianceScore >= 75) return { status: 'Good', color: 'text-green-500' };
    if (complianceScore >= 50) return { status: 'Fair', color: 'text-yellow-500' };
    return { status: 'Poor', color: 'text-red-500' };
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="space-y-4">
      {/* Overall Score */}
      <NeumorphicCard className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-neumorphic-text">Overall Compliance</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-neumorphic-text">{complianceScore}%</span>
              <span className={`text-sm font-medium ${overallStatus.color}`}>
                {overallStatus.status}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="w-16 h-16 rounded-full bg-neumorphic-bg flex items-center justify-center">
              <span className="text-lg font-bold text-neumorphic-text">{complianceScore}%</span>
            </div>
          </div>
        </div>
      </NeumorphicCard>

      {/* Detailed Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CIPC Annual Returns */}
        <NeumorphicCard className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {React.createElement(statusIcons[complianceStatus.cipcAnnualReturns], {
                className: `w-5 h-5 ${
                  ['Up to Date', 'Compliant', 'Registered'].includes(complianceStatus.cipcAnnualReturns)
                    ? 'text-green-500'
                    : ['Overdue', 'Non-Compliant', 'Deregistered'].includes(complianceStatus.cipcAnnualReturns)
                    ? 'text-red-500'
                    : 'text-yellow-500'
                }`
              })}
              <div>
                <p className="text-sm font-medium text-neumorphic-text">CIPC Annual Returns</p>
                <Badge className={`mt-1 ${statusColors[complianceStatus.cipcAnnualReturns]}`}>
                  {complianceStatus.cipcAnnualReturns}
                </Badge>
              </div>
            </div>
          </div>
        </NeumorphicCard>

        {/* Tax Status */}
        <NeumorphicCard className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {React.createElement(statusIcons[complianceStatus.taxStatus], {
                className: `w-5 h-5 ${
                  ['Up to Date', 'Compliant', 'Registered'].includes(complianceStatus.taxStatus)
                    ? 'text-green-500'
                    : ['Overdue', 'Non-Compliant', 'Deregistered'].includes(complianceStatus.taxStatus)
                    ? 'text-red-500'
                    : 'text-yellow-500'
                }`
              })}
              <div>
                <p className="text-sm font-medium text-neumorphic-text">Tax Status</p>
                <Badge className={`mt-1 ${statusColors[complianceStatus.taxStatus]}`}>
                  {complianceStatus.taxStatus}
                </Badge>
              </div>
            </div>
          </div>
        </NeumorphicCard>

        {/* VAT Status */}
        <NeumorphicCard className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {React.createElement(statusIcons[complianceStatus.vatStatus], {
                className: `w-5 h-5 ${
                  ['Up to Date', 'Compliant', 'Registered'].includes(complianceStatus.vatStatus)
                    ? 'text-green-500'
                    : ['Overdue', 'Non-Compliant', 'Deregistered'].includes(complianceStatus.vatStatus)
                    ? 'text-red-500'
                    : 'text-yellow-500'
                }`
              })}
              <div>
                <p className="text-sm font-medium text-neumorphic-text">VAT Status</p>
                <Badge className={`mt-1 ${statusColors[complianceStatus.vatStatus]}`}>
                  {complianceStatus.vatStatus}
                </Badge>
              </div>
            </div>
          </div>
        </NeumorphicCard>

        {/* UIF Status */}
        <NeumorphicCard className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {React.createElement(statusIcons[complianceStatus.uifStatus], {
                className: `w-5 h-5 ${
                  ['Up to Date', 'Compliant', 'Registered'].includes(complianceStatus.uifStatus)
                    ? 'text-green-500'
                    : ['Overdue', 'Non-Compliant', 'Deregistered'].includes(complianceStatus.uifStatus)
                    ? 'text-red-500'
                    : 'text-yellow-500'
                }`
              })}
              <div>
                <p className="text-sm font-medium text-neumorphic-text">UIF Status</p>
                <Badge className={`mt-1 ${statusColors[complianceStatus.uifStatus]}`}>
                  {complianceStatus.uifStatus}
                </Badge>
              </div>
            </div>
          </div>
        </NeumorphicCard>
      </div>

      {/* Compliance Chart */}
      {showChart && chartData.length > 0 && (
        <NeumorphicCard className="p-4">
          <h4 className="text-lg font-semibold text-neumorphic-text mb-4">Compliance Distribution</h4>
          <DonutChart
            data={chartData}
            title="Compliance Status Breakdown"
            height={300}
          />
        </NeumorphicCard>
      )}
    </div>
  );
};