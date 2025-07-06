/**
 * ProviderIntelligenceCard Component
 * 
 * Provides hover-activated intelligence cards showing provider performance metrics.
 * Part of the Provider Intelligence system for informed vetting decisions.
 * 
 * @author Claude Code
 * @version 1.0.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  NeumorphicCard,
  NeumorphicText,
  NeumorphicBadge,
} from '@/components/ui/neumorphic';
import { 
  Shield, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  Star,
  Calendar,
  Award
} from 'lucide-react';

export interface ProviderMetrics {
  provider: string;
  successRate: number;
  avgTurnaroundDays: number;
  qualityScore: number;
  totalChecksCompleted: number;
  onTimeDelivery: number;
  customerSatisfaction: number;
  certifications: string[];
  specialties: string[];
  lastUpdate: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface ProviderIntelligenceCardProps {
  provider: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

// Sample provider metrics data - in real implementation, this would come from API
const getProviderMetrics = (provider: string): ProviderMetrics => {
  const metricsDatabase: Record<string, ProviderMetrics> = {
    'MIE (Managed Integrity Evaluation)': {
      provider: 'MIE (Managed Integrity Evaluation)',
      successRate: 98.5,
      avgTurnaroundDays: 2.3,
      qualityScore: 9.2,
      totalChecksCompleted: 15420,
      onTimeDelivery: 96.8,
      customerSatisfaction: 4.8,
      certifications: ['ISO 27001', 'POPIA Compliant', 'SAPS Accredited'],
      specialties: ['Identity Verification', 'Criminal Checks', 'Financial Analysis'],
      lastUpdate: '2024-06-25',
      riskLevel: 'Low'
    },
    'International Verification Services': {
      provider: 'International Verification Services',
      successRate: 94.2,
      avgTurnaroundDays: 3.1,
      qualityScore: 8.7,
      totalChecksCompleted: 8650,
      onTimeDelivery: 91.5,
      customerSatisfaction: 4.5,
      certifications: ['ISO 9001', 'Interpol Certified'],
      specialties: ['Passport Verification', 'Immigration Checks', 'International Background'],
      lastUpdate: '2024-06-24',
      riskLevel: 'Medium'
    },
    'LexisNexis Risk Solutions': {
      provider: 'LexisNexis Risk Solutions',
      successRate: 99.1,
      avgTurnaroundDays: 1.8,
      qualityScore: 9.6,
      totalChecksCompleted: 25300,
      onTimeDelivery: 98.2,
      customerSatisfaction: 4.9,
      certifications: ['ISO 27001', 'SOC 2 Type II', 'GDPR Compliant'],
      specialties: ['Risk Intelligence', 'Sanctions Screening', 'PEP Checks'],
      lastUpdate: '2024-06-26',
      riskLevel: 'Low'
    },
    'XDS (Experian)': {
      provider: 'XDS (Experian)',
      successRate: 97.8,
      avgTurnaroundDays: 1.2,
      qualityScore: 9.0,
      totalChecksCompleted: 31200,
      onTimeDelivery: 99.1,
      customerSatisfaction: 4.7,
      certifications: ['NCR Registered', 'ISO 27001', 'POPIA Compliant'],
      specialties: ['Credit Reports', 'Financial Analysis', 'Affordability Assessment'],
      lastUpdate: '2024-06-26',
      riskLevel: 'Low'
    },
    'CPB (Credit Provider Bureau)': {
      provider: 'CPB (Credit Provider Bureau)',
      successRate: 96.4,
      avgTurnaroundDays: 2.8,
      qualityScore: 8.5,
      totalChecksCompleted: 12800,
      onTimeDelivery: 94.3,
      customerSatisfaction: 4.4,
      certifications: ['NCR Registered', 'POPIA Compliant'],
      specialties: ['Business Credit', 'Company Verification', 'Financial Risk'],
      lastUpdate: '2024-06-25',
      riskLevel: 'Medium'
    },
    'Reference Check Specialists': {
      provider: 'Reference Check Specialists',
      successRate: 93.7,
      avgTurnaroundDays: 4.2,
      qualityScore: 8.3,
      totalChecksCompleted: 7890,
      onTimeDelivery: 89.6,
      customerSatisfaction: 4.3,
      certifications: ['ISO 9001', 'POPIA Compliant'],
      specialties: ['Employment Verification', 'Reference Checks', 'Background Screening'],
      lastUpdate: '2024-06-23',
      riskLevel: 'Medium'
    },
    'Advanced Criminal Intelligence': {
      provider: 'Advanced Criminal Intelligence',
      successRate: 95.8,
      avgTurnaroundDays: 3.5,
      qualityScore: 8.9,
      totalChecksCompleted: 11200,
      onTimeDelivery: 92.4,
      customerSatisfaction: 4.6,
      certifications: ['SAPS Accredited', 'POPIA Compliant', 'Private Security Registered'],
      specialties: ['Enhanced Criminal Checks', 'Court Records', 'Investigation Services'],
      lastUpdate: '2024-06-24',
      riskLevel: 'Low'
    },
    'MIE Education Services': {
      provider: 'MIE Education Services',
      successRate: 97.1,
      avgTurnaroundDays: 2.9,
      qualityScore: 8.8,
      totalChecksCompleted: 9340,
      onTimeDelivery: 95.7,
      customerSatisfaction: 4.7,
      certifications: ['SAQA Recognized', 'ISO 9001'],
      specialties: ['Qualification Verification', 'Academic Records', 'Professional Registration'],
      lastUpdate: '2024-06-25',
      riskLevel: 'Low'
    },
    'MIE Banking Services': {
      provider: 'MIE Banking Services',
      successRate: 98.9,
      avgTurnaroundDays: 1.5,
      qualityScore: 9.3,
      totalChecksCompleted: 18750,
      onTimeDelivery: 97.8,
      customerSatisfaction: 4.8,
      certifications: ['SARB Approved', 'ISO 27001', 'POPIA Compliant'],
      specialties: ['Bank Verification', 'Account Validation', 'Financial Standing'],
      lastUpdate: '2024-06-26',
      riskLevel: 'Low'
    },
    'LexisNexis WorldCompliance': {
      provider: 'LexisNexis WorldCompliance',
      successRate: 99.3,
      avgTurnaroundDays: 1.6,
      qualityScore: 9.7,
      totalChecksCompleted: 22100,
      onTimeDelivery: 98.7,
      customerSatisfaction: 4.9,
      certifications: ['ISO 27001', 'SOC 2 Type II', 'SWIFT Certified'],
      specialties: ['PEP Screening', 'Sanctions Lists', 'AML Compliance'],
      lastUpdate: '2024-06-26',
      riskLevel: 'Low'
    }
  };

  return metricsDatabase[provider] || {
    provider,
    successRate: 90.0,
    avgTurnaroundDays: 3.0,
    qualityScore: 8.0,
    totalChecksCompleted: 1000,
    onTimeDelivery: 90.0,
    customerSatisfaction: 4.0,
    certifications: ['Standard Compliance'],
    specialties: ['General Verification'],
    lastUpdate: '2024-06-01',
    riskLevel: 'Medium'
  };
};

const ProviderIntelligenceCard: React.FC<ProviderIntelligenceCardProps> = ({
  provider,
  children,
  className,
  delay = 300
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [metrics, setMetrics] = useState<ProviderMetrics | null>(null);

  useEffect(() => {
    if (isHovered && !metrics) {
      // Simulate loading delay for realistic feel
      const timer = setTimeout(() => {
        setMetrics(getProviderMetrics(provider));
        setIsVisible(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isHovered, metrics, provider, delay]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Keep metrics loaded for smooth re-hover
    setTimeout(() => {
      if (!isHovered) {
        setIsVisible(false);
      }
    }, 200);
  };

  const getScoreColor = (score: number, type: 'percentage' | 'rating' = 'percentage') => {
    if (type === 'rating') {
      if (score >= 4.5) return 'var(--neumorphic-severity-low)';
      if (score >= 4.0) return 'var(--neumorphic-severity-medium)';
      return 'var(--neumorphic-severity-high)';
    } else {
      if (score >= 95) return 'var(--neumorphic-severity-low)';
      if (score >= 90) return 'var(--neumorphic-severity-medium)';
      return 'var(--neumorphic-severity-high)';
    }
  };

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return 'success';
      case 'Medium': return 'warning';
      case 'High': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn("cursor-help", className)}
      >
        {children}
      </div>

      {/* Intelligence Card Overlay */}
      {isHovered && (
        <div className="absolute z-50 top-full left-0 mt-2 w-96 animate-in fade-in-0 zoom-in-95 duration-200">
          <NeumorphicCard className="p-4 shadow-2xl border border-neumorphic-border/30 bg-neumorphic-card/95 backdrop-blur-sm">
            {/* Loading State */}
            {!isVisible && (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-neumorphic-accent-primary border-t-transparent rounded-full animate-spin" />
                  <NeumorphicText size="sm" variant="secondary">
                    Loading provider intelligence...
                  </NeumorphicText>
                </div>
              </div>
            )}

            {/* Intelligence Content */}
            {isVisible && metrics && (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Shield className="w-4 h-4 text-neumorphic-accent-primary" />
                      <NeumorphicText className="font-semibold text-sm">
                        Provider Intelligence
                      </NeumorphicText>
                    </div>
                    <NeumorphicText className="font-medium text-xs text-neumorphic-text-primary">
                      {metrics.provider}
                    </NeumorphicText>
                  </div>
                  <NeumorphicBadge 
                    variant={getRiskBadgeVariant(metrics.riskLevel)}
                    className="text-xs"
                  >
                    {metrics.riskLevel} Risk
                  </NeumorphicBadge>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-neumorphic-accent-secondary" />
                      <NeumorphicText size="xs" variant="secondary">Success Rate</NeumorphicText>
                    </div>
                    <NeumorphicText 
                      size="sm" 
                      className="font-semibold tabular-nums"
                      style={{ color: getScoreColor(metrics.successRate) }}
                    >
                      {metrics.successRate}%
                    </NeumorphicText>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-neumorphic-accent-secondary" />
                      <NeumorphicText size="xs" variant="secondary">Avg Turnaround</NeumorphicText>
                    </div>
                    <NeumorphicText size="sm" className="font-semibold tabular-nums">
                      {metrics.avgTurnaroundDays} days
                    </NeumorphicText>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-neumorphic-accent-secondary" />
                      <NeumorphicText size="xs" variant="secondary">Quality Score</NeumorphicText>
                    </div>
                    <NeumorphicText 
                      size="sm" 
                      className="font-semibold tabular-nums"
                      style={{ color: getScoreColor(metrics.qualityScore, 'rating') }}
                    >
                      {metrics.qualityScore}/10
                    </NeumorphicText>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3 text-neumorphic-accent-secondary" />
                      <NeumorphicText size="xs" variant="secondary">On-Time Rate</NeumorphicText>
                    </div>
                    <NeumorphicText 
                      size="sm" 
                      className="font-semibold tabular-nums"
                      style={{ color: getScoreColor(metrics.onTimeDelivery) }}
                    >
                      {metrics.onTimeDelivery}%
                    </NeumorphicText>
                  </div>
                </div>

                {/* Performance Indicators */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-neumorphic-text-secondary" />
                    <NeumorphicText size="xs" variant="secondary">
                      {metrics.totalChecksCompleted.toLocaleString()} checks completed
                    </NeumorphicText>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-3 h-3",
                            i < Math.floor(metrics.customerSatisfaction)
                              ? "text-yellow-500 fill-current"
                              : "text-neumorphic-text-secondary/30"
                          )}
                        />
                      ))}
                    </div>
                    <NeumorphicText size="xs" variant="secondary">
                      {metrics.customerSatisfaction}/5
                    </NeumorphicText>
                  </div>
                </div>

                {/* Certifications */}
                {metrics.certifications.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-1">
                      <Award className="w-3 h-3 text-neumorphic-accent-primary" />
                      <NeumorphicText size="xs" variant="secondary">Certifications</NeumorphicText>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {metrics.certifications.slice(0, 3).map((cert, index) => (
                        <NeumorphicBadge 
                          key={index} 
                          variant="outline" 
                          className="text-xs px-2 py-0.5"
                        >
                          {cert}
                        </NeumorphicBadge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specialties */}
                {metrics.specialties.length > 0 && (
                  <div className="space-y-2">
                    <NeumorphicText size="xs" variant="secondary">Specialties</NeumorphicText>
                    <div className="flex flex-wrap gap-1">
                      {metrics.specialties.slice(0, 3).map((specialty, index) => (
                        <NeumorphicBadge 
                          key={index} 
                          variant="secondary" 
                          className="text-xs px-2 py-0.5"
                        >
                          {specialty}
                        </NeumorphicBadge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="pt-2 border-t border-neumorphic-border/20">
                  <NeumorphicText size="xs" variant="secondary" className="text-center">
                    Last updated: {new Date(metrics.lastUpdate).toLocaleDateString()}
                  </NeumorphicText>
                </div>
              </div>
            )}
          </NeumorphicCard>
        </div>
      )}
    </div>
  );
};

export default ProviderIntelligenceCard;