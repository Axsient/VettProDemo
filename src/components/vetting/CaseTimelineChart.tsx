'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  NeumorphicCard,
  NeumorphicText,
} from '@/components/ui/neumorphic';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Play,
  Pause,
  Target,
  Zap
} from 'lucide-react';
import { ActiveVettingCase, ActiveVettingCheck } from '@/lib/sample-data/activeVettingCasesSample';

// Dynamic import to prevent SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface CaseTimelineChartProps {
  vettingCase: ActiveVettingCase;
  onProviderFocus?: (provider: string) => void;
}

interface TimelineItem {
  x: string;
  y: [number, number];
  fillColor: string;
  strokeColor: string;
  check: ActiveVettingCheck;
}

export const CaseTimelineChart: React.FC<CaseTimelineChartProps> = ({
  vettingCase,
  onProviderFocus
}) => {
  const [selectedCheck, setSelectedCheck] = useState<ActiveVettingCheck | null>(null);
  const [hoveredCheck, setHoveredCheck] = useState<string | null>(null);

  // Convert dates to timestamps for ApexCharts
  const baseDate = new Date(vettingCase.initiatedDate).getTime();
  const oneDayMs = 24 * 60 * 60 * 1000;

  // Status colors with animation classes
  const getStatusColor = (status: string, priority?: boolean) => {
    const colors = {
      'Complete': priority ? '#22c55e' : '#16a34a',
      'In Progress': priority ? '#3b82f6' : '#2563eb', 
      'Pending': priority ? '#f59e0b' : '#d97706',
      'Awaiting Subject Info': priority ? '#f59e0b' : '#d97706',
      'Failed': priority ? '#ef4444' : '#dc2626',
      'Cancelled': priority ? '#6b7280' : '#4b5563',
      'Submitted to Provider': priority ? '#8b5cf6' : '#7c3aed'
    };
    return colors[status as keyof typeof colors] || '#6b7280';
  };

  const getStatusAnimation = (status: string) => {
    switch (status) {
      case 'In Progress': return 'pulse-blue';
      case 'Awaiting Subject Info': return 'throb-amber';
      case 'Failed': return 'flash-red';
      default: return '';
    }
  };

  // Prepare timeline data
  const timelineData: TimelineItem[] = vettingCase.individualChecks.map((check, index) => {
    const startTime = check.actualStartDate 
      ? new Date(check.actualStartDate).getTime()
      : baseDate + (index * oneDayMs);
      
    const endTime = check.actualCompletionDate
      ? new Date(check.actualCompletionDate).getTime()
      : check.estimatedCompletionDate
      ? new Date(check.estimatedCompletionDate).getTime()
      : startTime + (2 * oneDayMs);

    return {
      x: check.checkDefinition.name,
      y: [startTime, endTime],
      fillColor: getStatusColor(check.status, check.urgentFlag),
      strokeColor: getStatusColor(check.status, true),
      check
    };
  });

  // Chart configuration
  const chartOptions = {
    chart: {
      type: 'rangeBar' as const,
      height: 300,
      background: 'transparent',
      fontFamily: 'var(--font-family)',
      toolbar: {
        show: false,
      },
      events: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dataPointSelection: (event: any, chartContext: any, config: any) => {
          try {
            if (config?.dataPointIndex >= 0 && timelineData[config.dataPointIndex]) {
              const selectedItem = timelineData[config.dataPointIndex];
              if (selectedItem?.check) {
                setSelectedCheck(selectedItem.check);
              }
            }
          } catch (error) {
            console.warn('Chart selection error:', error);
          }
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dataPointMouseEnter: (event: any, chartContext: any, config: any) => {
          try {
            if (config?.dataPointIndex >= 0 && timelineData[config.dataPointIndex]) {
              const selectedItem = timelineData[config.dataPointIndex];
              if (selectedItem?.check?.checkId) {
                setHoveredCheck(selectedItem.check.checkId);
              }
            }
          } catch (error) {
            console.warn('Chart hover error:', error);
          }
        },
        dataPointMouseLeave: () => {
          try {
            setHoveredCheck(null);
          } catch (error) {
            console.warn('Chart leave error:', error);
          }
        }
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        rangeBarGroupRows: true,
        barHeight: '70%',
        distributed: false
      }
    },
    colors: timelineData.map(item => item.fillColor),
    fill: {
      type: 'solid',
      opacity: 0.8
    },
    stroke: {
      width: 2,
      colors: timelineData.map(item => item.strokeColor)
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: 'var(--neumorphic-text-secondary)',
          fontSize: '12px'
        },
        format: 'dd MMM'
      },
      axisBorder: {
        color: 'var(--neumorphic-border)'
      },
      axisTicks: {
        color: 'var(--neumorphic-border)'
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: 'var(--neumorphic-text-primary)',
          fontSize: '11px'
        },
        maxWidth: 150
      }
    },
    grid: {
      borderColor: 'var(--neumorphic-border)',
      strokeDashArray: 3,
      opacity: 0.3
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      style: {
        fontSize: '12px',
        backgroundColor: 'var(--neumorphic-card)',
        color: 'var(--neumorphic-text-primary)'
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      custom: function({ dataPointIndex }: any) {
        if (!timelineData[dataPointIndex]) return '';
        const item = timelineData[dataPointIndex];
        const check = item?.check;
        if (!check) return '';
        
        const startDate = new Date(item.y[0]).toLocaleDateString('en-ZA');
        const endDate = new Date(item.y[1]).toLocaleDateString('en-ZA');
        
        return `
          <div style="
            padding: 12px; 
            background: var(--neumorphic-card); 
            border: 1px solid var(--neumorphic-border); 
            border-radius: 8px; 
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            z-index: 9999;
          ">
            <div style="font-weight: 600; color: var(--neumorphic-text-primary); margin-bottom: 8px;">
              ${check.checkDefinition?.name || 'Check'}
            </div>
            <div style="font-size: 11px; line-height: 1.4;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="color: var(--neumorphic-text-secondary);">Status:</span>
                <span style="color: var(--neumorphic-text-primary);">${check.status}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="color: var(--neumorphic-text-secondary);">Provider:</span>
                <span style="color: var(--neumorphic-text-primary);">${check.provider || 'N/A'}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="color: var(--neumorphic-text-secondary);">Start:</span>
                <span style="color: var(--neumorphic-text-primary);">${startDate}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--neumorphic-text-secondary);">End:</span>
                <span style="color: var(--neumorphic-text-primary);">${endDate}</span>
              </div>
              ${check.cost ? `
              <div style="display: flex; justify-content: space-between; margin-top: 4px;">
                <span style="color: var(--neumorphic-text-secondary);">Cost:</span>
                <span style="color: var(--neumorphic-text-primary);">R${check.cost}</span>
              </div>
              ` : ''}
            </div>
          </div>
        `;
      }
    },
    legend: {
      show: false
    },
    responsive: [{
      breakpoint: 768,
      options: {
        chart: {
          height: 400
        },
        yaxis: {
          labels: {
            maxWidth: 100
          }
        }
      }
    }]
  };

  const chartSeries = [{
    name: 'Investigation Timeline',
    data: timelineData
  }];

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-ZA', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Complete': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'In Progress': return <Play className="w-4 h-4 text-blue-400" />;
      case 'Pending': return <Pause className="w-4 h-4 text-yellow-400" />;
      case 'Awaiting Subject Info': return <Clock className="w-4 h-4 text-amber-400" />;
      case 'Failed': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Target className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Timeline Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <NeumorphicText size="sm" className="font-medium">
            Heartbeat of the Investigation
          </NeumorphicText>
          <Badge variant="outline" className="text-xs">
            {vettingCase.overallProgress}% Complete
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-xs text-neumorphic-text-secondary">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-400 rounded animate-pulse" />
            In Progress
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-amber-400 rounded animate-pulse" />
            Awaiting Info
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-400 rounded animate-pulse" />
            Overdue
          </div>
        </div>
      </div>

      {/* Gantt Chart */}
      <NeumorphicCard className="p-4">
        <div className="h-80" style={{ position: 'relative' }}>
          {typeof window !== 'undefined' && (
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="rangeBar"
              height="100%"
              key={`chart-${vettingCase.caseNumber}`}
            />
          )}
        </div>
      </NeumorphicCard>

      {/* Check Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {vettingCase.individualChecks.map((check) => (
          <ContextMenu key={check.checkId}>
            <ContextMenuTrigger>
              <div 
                className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer
                  ${hoveredCheck === check.checkId 
                    ? 'border-neumorphic-accent-primary shadow-neumorphic' 
                    : 'border-neumorphic-border'
                  }
                  ${check.status === 'In Progress' ? 'bg-blue-50/10' : ''}
                  ${check.status === 'Awaiting Subject Info' ? 'bg-amber-50/10' : ''}
                  ${check.status === 'Failed' ? 'bg-red-50/10' : ''}
                  ${getStatusAnimation(check.status)}
                `}
                onMouseEnter={() => setHoveredCheck(check.checkId)}
                onMouseLeave={() => setHoveredCheck(null)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(check.status)}
                    <NeumorphicText size="xs" className="font-medium">
                      {check.checkDefinition.name}
                    </NeumorphicText>
                  </div>
                  {check.urgentFlag && <Zap className="w-3 h-3 text-yellow-400" />}
                </div>
                
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neumorphic-text-secondary">Provider:</span>
                    <Badge variant="outline" className="text-xs">
                      {check.provider?.split(' ')[0] || 'Unknown'}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-neumorphic-text-secondary">Status:</span>
                    <Badge 
                      variant={
                        check.status === 'Complete' ? 'default' :
                        check.status === 'In Progress' ? 'secondary' :
                        check.status === 'Failed' ? 'destructive' : 'outline'
                      }
                      className="text-xs"
                    >
                      {check.status}
                    </Badge>
                  </div>
                  
                  {check.cost && (
                    <div className="flex justify-between">
                      <span className="text-neumorphic-text-secondary">Cost:</span>
                      <span className="text-neumorphic-text-primary font-medium">
                        R{check.cost.toLocaleString()}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-neumorphic-text-secondary">Updated:</span>
                    <span className="text-neumorphic-text-primary">
                      {formatDate(check.statusUpdatedDate)}
                    </span>
                  </div>
                  
                  {check.blockerReason && (
                    <div className="mt-2 p-2 bg-red-50/20 border border-red-200/30 rounded">
                      <div className="flex items-center gap-1 mb-1">
                        <AlertTriangle className="w-3 h-3 text-red-400" />
                        <span className="text-xs font-medium text-red-400">Blocked</span>
                      </div>
                      <p className="text-xs text-neumorphic-text-secondary">
                        {check.blockerReason}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </ContextMenuTrigger>
            
            <ContextMenuContent 
              className="w-56 z-[9999]" 
              style={{ 
                backgroundColor: 'var(--neumorphic-card)', 
                border: '1px solid var(--neumorphic-border)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                zIndex: 9999
              }}
            >
              <ContextMenuItem 
                className="text-neumorphic-text-primary hover:bg-neumorphic-surface-secondary"
                onClick={() => {
                  const provider = check.provider?.split(' ')[0];
                  if (provider && onProviderFocus) {
                    onProviderFocus(provider);
                  }
                }}
              >
                <Target className="w-4 h-4 mr-2" />
                Focus on Provider: {check.provider?.split(' ')[0]}
              </ContextMenuItem>
              <ContextMenuItem 
                className="text-neumorphic-text-primary hover:bg-neumorphic-surface-secondary"
                onClick={() => setSelectedCheck(check)}
              >
                <Play className="w-4 h-4 mr-2" />
                View Check Details
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </div>

      {/* Selected Check Details */}
      {selectedCheck && (
        <NeumorphicCard className="p-4 border border-neumorphic-accent-primary">
          <div className="flex items-center justify-between mb-3">
            <NeumorphicText className="font-medium">
              {selectedCheck.checkDefinition.name}
            </NeumorphicText>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedCheck(null)}
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-neumorphic-text-secondary">Provider:</span>
                  <span className="text-neumorphic-text-primary">{selectedCheck.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neumorphic-text-secondary">Status:</span>
                  <Badge variant="outline">{selectedCheck.status}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-neumorphic-text-secondary">Started:</span>
                  <span className="text-neumorphic-text-primary">
                    {formatDate(selectedCheck.actualStartDate)}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-neumorphic-text-secondary">Cost:</span>
                  <span className="text-neumorphic-text-primary font-medium">
                    R{selectedCheck.cost?.toLocaleString() || 'TBD'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neumorphic-text-secondary">Risk Score:</span>
                  <Badge 
                    variant={
                      (selectedCheck.riskScore || 0) > 50 ? 'destructive' :
                      (selectedCheck.riskScore || 0) > 25 ? 'secondary' : 'default'
                    }
                  >
                    {selectedCheck.riskScore || 0}/100
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-neumorphic-text-secondary">Reference:</span>
                  <span className="text-neumorphic-text-primary text-xs font-mono">
                    {selectedCheck.providerReference || 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {selectedCheck.notes && (
            <div className="mt-3 p-2 bg-neumorphic-surface-secondary rounded">
              <NeumorphicText size="xs" className="font-medium mb-1">Notes:</NeumorphicText>
              <NeumorphicText size="xs" variant="secondary">
                {selectedCheck.notes}
              </NeumorphicText>
            </div>
          )}
        </NeumorphicCard>
      )}
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes pulse-blue {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
          50% { box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
        }
        @keyframes throb-amber {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes flash-red {
          0%, 100% { background-color: transparent; }
          50% { background-color: rgba(239, 68, 68, 0.1); }
        }
        .pulse-blue { animation: pulse-blue 2s infinite; }
        .throb-amber { animation: throb-amber 1.5s infinite; }
        .flash-red { animation: flash-red 1s infinite; }
      `}</style>
    </div>
  );
};