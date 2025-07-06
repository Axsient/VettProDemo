'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { NeumorphicCard, NeumorphicText } from '@/components/ui/neumorphic';
import { CompletedReportsTable } from '@/components/vetting/CompletedReportsTable';
import { sampleCompletedReports } from '@/lib/sample-data/completedReportsSample';
import { 
  Library, 
  Database,
  Brain,
  BarChart3,
  Shield
} from 'lucide-react';

export default function IntelligenceLibraryPage() {
  // Calculate summary stats from completed reports
  const stats = {
    totalReports: sampleCompletedReports.length,
    criticalRisk: sampleCompletedReports.filter(r => r.overallRiskLevel === 'CRITICAL').length,
    highRisk: sampleCompletedReports.filter(r => r.overallRiskLevel === 'HIGH').length,
    averageRiskScore: Math.round(
      sampleCompletedReports.reduce((sum, r) => sum + r.overallRiskScore, 0) / sampleCompletedReports.length
    ),
    recentReports: sampleCompletedReports.filter(r => {
      const completionDate = new Date(r.completionDate);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return completionDate >= thirtyDaysAgo;
    }).length,
    aiAccuracy: '96.8%'
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Library className="w-6 h-6 text-indigo-400" />
          <h1 className="text-2xl font-bold text-neumorphic-text-primary">
            VETTPRO Intelligence Library
          </h1>
          <Badge variant="outline" className="text-xs">
            Phase 4 - Strategic Intelligence
          </Badge>
        </div>
        <NeumorphicText variant="secondary" className="text-sm">
          Transform historical data into strategic foresight with interactive risk analysis and AI-powered deep search
        </NeumorphicText>
      </div>

      {/* Intelligence Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <NeumorphicCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-neumorphic-text-secondary mb-1">Total Reports</div>
              <div className="text-2xl font-bold text-neumorphic-text-primary">{stats.totalReports}</div>
            </div>
            <Database className="w-8 h-8 text-blue-400" />
          </div>
        </NeumorphicCard>

        <NeumorphicCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-neumorphic-text-secondary mb-1">Critical Risk</div>
              <div className="text-2xl font-bold text-red-400">{stats.criticalRisk}</div>
            </div>
            <Shield className="w-8 h-8 text-red-400" />
          </div>
        </NeumorphicCard>

        <NeumorphicCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-neumorphic-text-secondary mb-1">Avg Risk Score</div>
              <div className="text-2xl font-bold text-neumorphic-text-primary">{stats.averageRiskScore}</div>
            </div>
            <BarChart3 className="w-8 h-8 text-green-400" />
          </div>
        </NeumorphicCard>

        <NeumorphicCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-neumorphic-text-secondary mb-1">AI Accuracy</div>
              <div className="text-2xl font-bold text-neumorphic-text-primary">{stats.aiAccuracy}</div>
            </div>
            <Brain className="w-8 h-8 text-purple-400" />
          </div>
        </NeumorphicCard>
      </div>

      {/* Main Intelligence Table */}
      <NeumorphicCard className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <NeumorphicText className="font-medium">
              Intelligence Archive & Analysis
            </NeumorphicText>
            <Badge variant="outline" className="text-xs">
              Strategic Research Tool
            </Badge>
          </div>
          
          <CompletedReportsTable 
            reports={sampleCompletedReports}
          />
        </div>
      </NeumorphicCard>
    </div>
  );
}