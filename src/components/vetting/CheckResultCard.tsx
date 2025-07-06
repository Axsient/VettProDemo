'use client';

import React from 'react';
import { NeumorphicCard, NeumorphicText } from '@/components/ui/neumorphic';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Info,
  Shield
} from 'lucide-react';

interface CheckResult {
  checkName: string;
  status: string;
  summary: string;
}

interface CheckResultCardProps {
  checkResult: CheckResult;
  className?: string;
}

export const CheckResultCard: React.FC<CheckResultCardProps> = ({
  checkResult,
  className = ''
}) => {
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Clear':
        return 'border-l-green-400 bg-green-400/5';
      case 'Adverse Finding':
        return 'border-l-red-400 bg-red-400/5';
      case 'Not Performed':
        return 'border-l-gray-400 bg-gray-400/5';
      case 'Neutral / Info':
        return 'border-l-blue-400 bg-blue-400/5';
      default:
        return 'border-l-yellow-400 bg-yellow-400/5';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Clear':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'Adverse Finding':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'Not Performed':
        return <Clock className="w-4 h-4 text-gray-400" />;
      case 'Neutral / Info':
        return <Info className="w-4 h-4 text-blue-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Clear':
        return (
          <Badge className="bg-green-400/20 text-green-400 border-green-400/40 text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            Clear
          </Badge>
        );
      case 'Adverse Finding':
        return (
          <Badge className="bg-red-400/20 text-red-400 border-red-400/40 text-xs">
            <XCircle className="w-3 h-3 mr-1" />
            Adverse
          </Badge>
        );
      case 'Not Performed':
        return (
          <Badge className="bg-gray-400/20 text-gray-400 border-gray-400/40 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            Not Performed
          </Badge>
        );
      case 'Neutral / Info':
        return (
          <Badge className="bg-blue-400/20 text-blue-400 border-blue-400/40 text-xs">
            <Info className="w-3 h-3 mr-1" />
            Info
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/40 text-xs">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Review
          </Badge>
        );
    }
  };

  const getPriorityLevel = (status: string) => {
    switch (status) {
      case 'Adverse Finding':
        return 'high';
      case 'Not Performed':
        return 'medium';
      case 'Clear':
        return 'low';
      default:
        return 'medium';
    }
  };

  const priority = getPriorityLevel(checkResult.status);

  return (
    <NeumorphicCard 
      className={`
        p-3 border-l-4 transition-all duration-200 hover:shadow-lg 
        ${getStatusColor(checkResult.status)}
        ${priority === 'high' ? 'shadow-red-400/20 hover:shadow-red-400/30' : ''}
        ${className}
      `}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2 flex-1">
            {getStatusIcon(checkResult.status)}
            <div className="flex-1 min-w-0">
              <NeumorphicText className="font-medium text-sm leading-tight">
                {checkResult.checkName}
              </NeumorphicText>
            </div>
          </div>
          {getStatusBadge(checkResult.status)}
        </div>

        {/* Summary */}
        <div className="pl-6">
          <NeumorphicText variant="secondary" className="text-xs leading-relaxed">
            {checkResult.summary}
          </NeumorphicText>
        </div>

        {/* Priority Indicator for High-Risk Findings */}
        {priority === 'high' && (
          <div className="pl-6">
            <div className="flex items-center gap-1 text-xs">
              <Shield className="w-3 h-3 text-red-400" />
              <span className="text-red-400 font-medium">Requires Attention</span>
            </div>
          </div>
        )}

        {/* Special handling for Not Performed checks */}
        {checkResult.status === 'Not Performed' && (
          <div className="pl-6">
            <div className="flex items-center gap-1 text-xs">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span className="text-amber-400 font-medium">Incomplete - Risk Unknown</span>
            </div>
          </div>
        )}
      </div>
    </NeumorphicCard>
  );
};