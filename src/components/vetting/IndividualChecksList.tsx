'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, AlertCircle, XCircle, Eye, AlertTriangle } from 'lucide-react';
import { ActiveVettingCheck } from '@/types/vetting';
import CheckProgressIndicator from './CheckProgressIndicator';

interface IndividualChecksListProps {
  checks: ActiveVettingCheck[];
  className?: string;
  onViewCheckDetails?: (checkId: string) => void;
}

const IndividualChecksList: React.FC<IndividualChecksListProps> = ({
  checks,
  className = '',
  onViewCheckDetails
}) => {
  // Status configuration
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Complete':
        return {
          icon: CheckCircle,
          variant: 'default' as const,
          color: 'text-green-600',
          bgColor: 'bg-green-50 dark:bg-green-950'
        };
      case 'In Progress':
        return {
          icon: Clock,
          variant: 'secondary' as const,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50 dark:bg-blue-950'
        };
      case 'Error':
        return {
          icon: XCircle,
          variant: 'destructive' as const,
          color: 'text-red-600',
          bgColor: 'bg-red-50 dark:bg-red-950'
        };
      case 'Pending':
        return {
          icon: Clock,
          variant: 'outline' as const,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50 dark:bg-gray-950'
        };
      default:
        return {
          icon: AlertCircle,
          variant: 'outline' as const,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50 dark:bg-gray-950'
        };
    }
  };

  // Result configuration
  const getResultConfig = (result?: string) => {
    switch (result) {
      case 'Pass':
        return {
          variant: 'default' as const,
          color: 'text-green-600'
        };
      case 'Fail':
        return {
          variant: 'destructive' as const,
          color: 'text-red-600'
        };
      case 'Requires Review':
        return {
          variant: 'secondary' as const,
          color: 'text-yellow-600'
        };
      default:
        return {
          variant: 'outline' as const,
          color: 'text-gray-600'
        };
    }
  };

  // Format currency
  const formatCurrency = (amount?: number) => {
    if (!amount) return 'R 0';
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate overall progress
  const completedChecks = checks.filter(check => check.status === 'Complete').length;
  const overallProgress = Math.round((completedChecks / checks.length) * 100);

  return (
    <div className={`p-6 bg-gradient-to-br from-[var(--neumorphic-background)] to-[var(--neumorphic-background-secondary)]
      rounded-lg border border-[var(--neumorphic-border)] 
      shadow-[inset_2px_2px_4px_var(--neumorphic-shadow-dark),inset_-2px_-2px_4px_var(--neumorphic-shadow-light)]
      ${className}`}>
      
      {/* Header with overall progress */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-[var(--neumorphic-foreground)]">
            Individual Checks ({checks.length})
          </h3>
          <CheckProgressIndicator
            progress={overallProgress}
            completedChecks={completedChecks}
            totalChecks={checks.length}
            size="small"
            showText={false}
          />
        </div>
        <div className="text-sm text-[var(--neumorphic-muted-foreground)]">
          {completedChecks} of {checks.length} complete
        </div>
      </div>

      {/* Checks Grid */}
      <div className="grid gap-4">
        {checks.map((check) => {
          const statusConfig = getStatusConfig(check.status);
          const resultConfig = getResultConfig(check.result);
          const StatusIcon = statusConfig.icon;

          return (
            <div
              key={check.checkId}
              className={`p-4 rounded-lg border border-[var(--neumorphic-border)]
                bg-gradient-to-br from-[var(--neumorphic-background)] to-[var(--neumorphic-background-secondary)]
                shadow-[2px_2px_4px_var(--neumorphic-shadow-dark),-2px_-2px_4px_var(--neumorphic-shadow-light)]
                hover:shadow-[4px_4px_8px_var(--neumorphic-shadow-dark),-4px_-4px_8px_var(--neumorphic-shadow-light)]
                transition-all duration-200 ${statusConfig.bgColor}`}
            >
              <div className="flex items-start justify-between">
                {/* Check Information */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                    <h4 className="font-medium text-[var(--neumorphic-foreground)] truncate">
                      {check.checkDefinition.name}
                    </h4>
                    {check.urgentFlag && (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                  </div>

                  <p className="text-sm text-[var(--neumorphic-muted-foreground)] mb-3 line-clamp-2">
                    {check.checkDefinition.description}
                  </p>

                  {/* Status and Result Badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant={statusConfig.variant} className="text-xs">
                      {check.status}
                    </Badge>
                    {check.result && (
                      <Badge variant={resultConfig.variant} className="text-xs">
                        {check.result}
                      </Badge>
                    )}
                    {check.riskScore !== undefined && (
                      <Badge variant="outline" className="text-xs">
                        Risk: {check.riskScore}/100
                      </Badge>
                    )}
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-[var(--neumorphic-muted-foreground)]">Provider:</span>
                      <p className="font-medium text-[var(--neumorphic-foreground)] truncate">
                        {check.provider || 'Not assigned'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[var(--neumorphic-muted-foreground)]">Cost:</span>
                      <p className="font-medium text-[var(--neumorphic-foreground)]">
                        {formatCurrency(check.cost)}
                      </p>
                    </div>
                    <div>
                      <span className="text-[var(--neumorphic-muted-foreground)]">Started:</span>
                      <p className="font-medium text-[var(--neumorphic-foreground)]">
                        {formatDate(check.actualStartDate)}
                      </p>
                    </div>
                    <div>
                      <span className="text-[var(--neumorphic-muted-foreground)]">
                        {check.status === 'Complete' ? 'Completed:' : 'Est. Complete:'}
                      </span>
                      <p className="font-medium text-[var(--neumorphic-foreground)]">
                        {formatDate(check.actualCompletionDate || check.estimatedCompletionDate)}
                      </p>
                    </div>
                  </div>

                  {/* Provider Reference */}
                  {check.providerReference && (
                    <div className="mt-2 text-xs">
                      <span className="text-[var(--neumorphic-muted-foreground)]">Reference:</span>
                      <span className="ml-1 font-mono text-[var(--neumorphic-foreground)]">
                        {check.providerReference}
                      </span>
                    </div>
                  )}

                  {/* Notes */}
                  {(check.notes || check.internalNotes || check.blockerReason) && (
                    <div className="mt-3 p-2 rounded 
                      bg-gradient-to-br from-[var(--neumorphic-background-secondary)] to-[var(--neumorphic-background)]
                      border border-[var(--neumorphic-border)]">
                      <div className="text-xs text-[var(--neumorphic-muted-foreground)] mb-1">
                        {check.blockerReason ? 'Blocker:' : 'Notes:'}
                      </div>
                      <p className="text-sm text-[var(--neumorphic-foreground)]">
                        {check.blockerReason || check.notes || check.internalNotes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 ml-4">
                  {onViewCheckDetails && (
                    <Button
                      variant="neumorphic-outline"
                      size="sm"
                      onClick={() => onViewCheckDetails(check.checkId)}
                      className="w-9 h-9 p-0"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {checks.length === 0 && (
        <div className="text-center py-8 text-[var(--neumorphic-muted-foreground)]">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">No Checks Found</p>
          <p className="text-sm">This case doesn&apos;t have any individual checks configured.</p>
        </div>
      )}
    </div>
  );
};

export default IndividualChecksList;