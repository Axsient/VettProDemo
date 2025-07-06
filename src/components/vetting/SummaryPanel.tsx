'use client';

import React, { useState, useEffect, useMemo } from 'react';
import CountUp from 'react-countup';
import { 
  NeumorphicCard, 
  NeumorphicText,
  NeumorphicHeading,
  NeumorphicBadge,
  NeumorphicTabs 
} from '@/components/ui/neumorphic';
import { Clock, DollarSign, Shield, Target, TrendingUp, Award } from 'lucide-react';
import { VettingEntityType } from '@/types/vetting';
import { ConsentFootprint } from './ConsentFootprint';
import { 
  allVettingChecks, 
  // vettingPackages, // Not used directly in this component
  getChecksInPackage 
} from '@/lib/sample-data/vettingChecksSample';

interface SummaryPanelProps {
  totalCost: number;
  totalTurnaround: number;
  selectedCheckIds: Set<string>;
  entityType: VettingEntityType | '';
  selectionType: 'package' | 'individual';
  selectedPackage: string;
  checkCategories: string[];
  providerMetrics: {
    averagePerformance: number;
    reliability: number;
    speed: number;
  };
}

export function SummaryPanel({
  totalCost,
  totalTurnaround,
  selectedCheckIds,
  entityType,
  selectionType,
  selectedPackage,
  checkCategories: _checkCategories,
  providerMetrics
}: SummaryPanelProps) {
  // Suppress unused variable warning for checkCategories
  void _checkCategories;
  const [activeTab, setActiveTab] = useState('cost-time');
  const [previousCost, setPreviousCost] = useState(0);
  const [costChange, setCostChange] = useState(0);

  // Track cost changes for animation
  useEffect(() => {
    if (totalCost !== previousCost) {
      setCostChange(totalCost - previousCost);
      setPreviousCost(totalCost);
    }
  }, [totalCost, previousCost]);

  // Get selected checks for analysis
  const selectedChecks = useMemo(() => {
    if (selectionType === 'package' && selectedPackage) {
      return getChecksInPackage(selectedPackage);
    }
    return allVettingChecks.filter(check => selectedCheckIds.has(check.id));
  }, [selectionType, selectedPackage, selectedCheckIds]);

  // Calculate cost breakdown by category
  const costBreakdown = useMemo(() => {
    const breakdown: Record<string, { cost: number; count: number }> = {};
    
    selectedChecks.forEach(check => {
      if (!breakdown[check.category]) {
        breakdown[check.category] = { cost: 0, count: 0 };
      }
      breakdown[check.category].cost += check.estimatedCostZAR;
      breakdown[check.category].count += 1;
    });
    
    return Object.entries(breakdown).map(([category, data]) => ({
      category,
      cost: data.cost,
      count: data.count,
      percentage: totalCost > 0 ? (data.cost / totalCost) * 100 : 0
    }));
  }, [selectedChecks, totalCost]);

  // Calculate risk level
  const riskAnalysis = useMemo(() => {
    const riskCounts = { High: 0, Medium: 0, Low: 0 };
    selectedChecks.forEach(check => {
      riskCounts[check.riskLevel as keyof typeof riskCounts]++;
    });
    
    const totalChecks = selectedChecks.length;
    if (totalChecks === 0) return { level: 'None', score: 0, color: 'bg-gray-500' };
    
    const riskScore = (riskCounts.High * 3 + riskCounts.Medium * 2 + riskCounts.Low * 1) / totalChecks;
    
    if (riskScore >= 2.5) return { level: 'High Coverage', score: riskScore, color: 'bg-red-500' };
    if (riskScore >= 1.5) return { level: 'Medium Coverage', score: riskScore, color: 'bg-yellow-500' };
    return { level: 'Basic Coverage', score: riskScore, color: 'bg-green-500' };
  }, [selectedChecks]);

  return (
    <div className="lg:sticky lg:top-4">
      <NeumorphicCard className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20">
            <Target className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <NeumorphicHeading className="text-lg mb-0">Mission Brief</NeumorphicHeading>
            <NeumorphicText variant="secondary" size="sm">
              Intelligence Operation Summary
            </NeumorphicText>
          </div>
        </div>

        {/* Tabs */}
        <NeumorphicTabs value={activeTab} onValueChange={setActiveTab}>
          <NeumorphicTabs.List>
            <NeumorphicTabs.Trigger value="cost-time">
              <DollarSign className="w-4 h-4 mr-2" />
              Cost & Time
            </NeumorphicTabs.Trigger>
            <NeumorphicTabs.Trigger value="vetting-story">
              <Shield className="w-4 h-4 mr-2" />
              Vetting Story
            </NeumorphicTabs.Trigger>
          </NeumorphicTabs.List>

          {/* Cost & Time Tab */}
          <NeumorphicTabs.Content value="cost-time" className="space-y-6">
            {/* Live Cost Display */}
            <div className="text-center space-y-2">
              <NeumorphicText variant="secondary" size="sm">Total Investment</NeumorphicText>
              <div className="text-3xl font-bold text-neumorphic-text-primary flex items-center justify-center gap-1">
                <span>R</span>
                <CountUp 
                  end={totalCost} 
                  duration={0.75} 
                  separator="," 
                  preserveValue
                />
              </div>
              {costChange !== 0 && (
                <div className={`text-sm flex items-center justify-center gap-1 ${
                  costChange > 0 ? 'text-red-400' : 'text-green-400'
                }`}>
                  <TrendingUp className={`w-3 h-3 ${costChange < 0 ? 'rotate-180' : ''}`} />
                  R{Math.abs(costChange).toLocaleString()}
                </div>
              )}
            </div>

            {/* Time Estimate */}
            <div className="text-center space-y-2">
              <NeumorphicText variant="secondary" size="sm">Maximum Turnaround</NeumorphicText>
              <div className="text-2xl font-semibold text-neumorphic-text-primary flex items-center justify-center gap-2">
                <Clock className="w-5 h-5" />
                <CountUp 
                  end={totalTurnaround} 
                  duration={0.75} 
                  preserveValue
                />
                <span className="text-base">days</span>
              </div>
            </div>

            {/* Cost Breakdown */}
            {costBreakdown.length > 0 && (
              <div className="space-y-3">
                <NeumorphicText className="font-medium">Cost Breakdown</NeumorphicText>
                {costBreakdown.map(({ category, cost, count, percentage }) => (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <NeumorphicText size="sm">{category}</NeumorphicText>
                      <div className="flex items-center gap-2">
                        <NeumorphicText size="sm">R{cost.toLocaleString()}</NeumorphicText>
                        <NeumorphicBadge variant="info" className="text-xs">
                          {count} check{count !== 1 ? 's' : ''}
                        </NeumorphicBadge>
                      </div>
                    </div>
                    <div className="w-full bg-neumorphic-button/30 rounded-full h-1">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Provider Performance */}
            <div className="space-y-3">
              <NeumorphicText className="font-medium flex items-center gap-2">
                <Award className="w-4 h-4" />
                Provider Performance
              </NeumorphicText>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-lg font-semibold text-green-400">
                    <CountUp end={providerMetrics.averagePerformance} duration={1} decimals={1} />%
                  </div>
                  <NeumorphicText variant="secondary" size="sm">Quality</NeumorphicText>
                </div>
                <div>
                  <div className="text-lg font-semibold text-blue-400">
                    <CountUp end={providerMetrics.reliability} duration={1} decimals={1} />%
                  </div>
                  <NeumorphicText variant="secondary" size="sm">Reliability</NeumorphicText>
                </div>
                <div>
                  <div className="text-lg font-semibold text-purple-400">
                    <CountUp end={providerMetrics.speed} duration={1} decimals={1} />%
                  </div>
                  <NeumorphicText variant="secondary" size="sm">Speed</NeumorphicText>
                </div>
              </div>
            </div>

            {/* Risk Level */}
            <div className="space-y-2">
              <NeumorphicText className="font-medium">Risk Coverage Level</NeumorphicText>
              <div className="flex items-center justify-between">
                <NeumorphicBadge 
                  variant={riskAnalysis.level.includes('High') ? 'danger' : 
                          riskAnalysis.level.includes('Medium') ? 'warning' : 'success'}
                >
                  {riskAnalysis.level}
                </NeumorphicBadge>
                <NeumorphicText size="sm">
                  Score: {riskAnalysis.score.toFixed(1)}/3.0
                </NeumorphicText>
              </div>
            </div>
          </NeumorphicTabs.Content>

          {/* Vetting Story Tab */}
          <NeumorphicTabs.Content value="vetting-story" className="space-y-4">
            <ConsentFootprint 
              selectedChecks={selectedChecks}
              entityType={entityType}
            />
          </NeumorphicTabs.Content>
        </NeumorphicTabs>
      </NeumorphicCard>
    </div>
  );
}