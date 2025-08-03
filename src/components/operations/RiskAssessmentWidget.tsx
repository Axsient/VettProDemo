'use client';

import React from 'react';
import { AlertTriangle, CheckCircle, Shield, Info } from 'lucide-react';
import { NeumorphicCard } from '@/components/ui/neumorphic-card';
import { Badge } from '@/components/ui/badge';
import { BarChart } from '@/components/charts/apex/components/BarChart';
import { DonutChart } from '@/components/charts/apex/components/DonutChart';

interface RiskFactor {
  factor: string;
  level: 'Low' | 'Medium' | 'High';
  description: string;
}

interface RiskAssessment {
  overallRiskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  riskFactors: RiskFactor[];
  recommendation: string;
}

interface RiskAssessmentWidgetProps {
  riskAssessment: RiskAssessment;
  showCharts?: boolean;
}

const riskColors = {
  'Low': 'bg-green-500 text-white',
  'Medium': 'bg-yellow-500 text-black',
  'High': 'bg-orange-500 text-white',
  'Critical': 'bg-red-500 text-white'
};

const riskTextColors = {
  'Low': 'text-green-600',
  'Medium': 'text-yellow-600',
  'High': 'text-orange-600',
  'Critical': 'text-red-600'
};

const riskIcons = {
  'Low': CheckCircle,
  'Medium': Info,
  'High': AlertTriangle,
  'Critical': AlertTriangle
};

export const RiskAssessmentWidget: React.FC<RiskAssessmentWidgetProps> = ({ 
  riskAssessment, 
  showCharts = true 
}) => {
  // Calculate risk score
  const riskScore = React.useMemo(() => {
    const scores: Record<string, number> = {
      'Low': 25,
      'Medium': 50,
      'High': 75,
      'Critical': 100
    };

    const overallScore = scores[riskAssessment.overallRiskLevel];
    const factorScores = riskAssessment.riskFactors.map(factor => scores[factor.level]);
    const averageFactorScore = factorScores.reduce((sum, score) => sum + score, 0) / factorScores.length;
    
    return Math.round((overallScore + averageFactorScore) / 2);
  }, [riskAssessment]);

  // Prepare chart data for risk factors
  const riskFactorChartData = React.useMemo(() => {
    return riskAssessment.riskFactors.map(factor => ({
      x: factor.factor,
      y: factor.level === 'Low' ? 25 : factor.level === 'Medium' ? 50 : factor.level === 'High' ? 75 : 100
    }));
  }, [riskAssessment.riskFactors]);

  // Prepare donut chart data for risk distribution
  const riskDistributionData = React.useMemo(() => {
    const distribution = riskAssessment.riskFactors.reduce((acc, factor) => {
      acc[factor.level] = (acc[factor.level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([level, count]) => ({
      x: `${level} Risk`,
      y: count
    }));
  }, [riskAssessment.riskFactors]);

  const getRiskStatusInfo = () => {
    switch (riskAssessment.overallRiskLevel) {
      case 'Low':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          message: 'Low risk profile - proceed with standard processes'
        };
      case 'Medium':
        return {
          icon: Info,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          message: 'Medium risk profile - additional monitoring recommended'
        };
      case 'High':
        return {
          icon: AlertTriangle,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          message: 'High risk profile - enhanced due diligence required'
        };
      case 'Critical':
        return {
          icon: AlertTriangle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          message: 'Critical risk profile - immediate attention required'
        };
      default:
        return {
          icon: Info,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          message: 'Risk assessment pending'
        };
    }
  };

  const statusInfo = getRiskStatusInfo();

  return (
    <div className="space-y-4">
      {/* Overall Risk Assessment */}
      <NeumorphicCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {React.createElement(statusInfo.icon, {
              className: `w-6 h-6 ${statusInfo.color}`
            })}
            <div>
              <h4 className="text-lg font-semibold text-neumorphic-text">Overall Risk Level</h4>
              <Badge className={`mt-1 ${riskColors[riskAssessment.overallRiskLevel]}`}>
                {riskAssessment.overallRiskLevel}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="w-16 h-16 rounded-full bg-neumorphic-bg flex items-center justify-center">
              <span className={`text-lg font-bold ${riskTextColors[riskAssessment.overallRiskLevel]}`}>
                {riskScore}
              </span>
            </div>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${statusInfo.bgColor} border border-opacity-20`}>
          <p className="text-sm text-neumorphic-text">{statusInfo.message}</p>
        </div>
      </NeumorphicCard>

      {/* Risk Factors */}
      <NeumorphicCard className="p-6">
        <h4 className="text-lg font-semibold text-neumorphic-text mb-4">Risk Factors</h4>
        <div className="space-y-3">
          {riskAssessment.riskFactors.map((factor, index) => {
            const Icon = riskIcons[factor.level];
            return (
              <div key={index} className="flex items-start gap-3 p-3 bg-neumorphic-bg/50 rounded-lg">
                <Icon className={`w-5 h-5 mt-0.5 ${riskTextColors[factor.level]}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-medium text-neumorphic-text">{factor.factor}</h5>
                    <Badge className={`${riskColors[factor.level]}`}>
                      {factor.level}
                    </Badge>
                  </div>
                  <p className="text-sm text-neumorphic-text/70">{factor.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </NeumorphicCard>

      {/* Recommendation */}
      <NeumorphicCard className="p-6">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-neumorphic-primary mt-0.5" />
          <div>
            <h4 className="text-lg font-semibold text-neumorphic-text mb-2">Recommendation</h4>
            <p className="text-neumorphic-text/80">{riskAssessment.recommendation}</p>
          </div>
        </div>
      </NeumorphicCard>

      {/* Risk Charts */}
      {showCharts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Risk Factor Levels */}
          <NeumorphicCard className="p-6">
            <h4 className="text-lg font-semibold text-neumorphic-text mb-4">Risk Factor Levels</h4>
            <BarChart
              data={riskFactorChartData}
              title="Risk Factors by Level"
              height={300}
              customOptions={{
                yaxis: {
                  min: 0,
                  max: 100,
                  labels: {
                    formatter: (value: number) => {
                      if (value <= 25) return 'Low';
                      if (value <= 50) return 'Medium';
                      if (value <= 75) return 'High';
                      return 'Critical';
                    }
                  }
                }
              }}
            />
          </NeumorphicCard>

          {/* Risk Distribution */}
          <NeumorphicCard className="p-6">
            <h4 className="text-lg font-semibold text-neumorphic-text mb-4">Risk Distribution</h4>
            <DonutChart
              data={riskDistributionData}
              title="Risk Factor Distribution"
              height={300}
            />
          </NeumorphicCard>
        </div>
      )}
    </div>
  );
};