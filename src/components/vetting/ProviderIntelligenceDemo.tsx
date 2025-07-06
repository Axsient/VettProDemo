/**
 * ProviderIntelligenceDemo Component
 * 
 * Demo component showcasing the Provider Intelligence features including
 * hover cards with performance metrics and AI smart suggestions.
 * 
 * @author Claude Code
 * @version 1.0.0
 */

'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { VettingEntityType, CheckCategory } from '@/types/vetting';
import {
  NeumorphicCard,
  NeumorphicText,
  NeumorphicHeading,
  NeumorphicBadge,
  NeumorphicButton,
} from '@/components/ui/neumorphic';
import ProviderIntelligenceCard from './ProviderIntelligenceCard';
import AISmartSuggestion from './AISmartSuggestion';
import { 
  Brain, 
  Shield, 
  TrendingUp, 
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Building,
  User,
  Stethoscope
} from 'lucide-react';

const sampleChecks = [
  {
    id: 'id_verify_sa',
    name: 'SA ID Verification',
    provider: 'MIE (Managed Integrity Evaluation)',
    category: CheckCategory.IDENTITY,
    riskLevel: 'Low',
    cost: 50,
    days: 1
  },
  {
    id: 'criminal_record_afis',
    name: 'Criminal Record Check (AFIS)',
    provider: 'MIE Criminal Services',
    category: CheckCategory.CRIMINAL,
    riskLevel: 'High',
    cost: 150,
    days: 2
  },
  {
    id: 'watchlist_screening',
    name: 'Watchlist & Sanctions Screening',
    provider: 'LexisNexis Risk Solutions',
    category: CheckCategory.CRIMINAL,
    riskLevel: 'High',
    cost: 100,
    days: 1
  },
  {
    id: 'business_credit_report',
    name: 'Business Credit Report',
    provider: 'CPB (Credit Provider Bureau)',
    category: CheckCategory.FINANCIAL,
    riskLevel: 'Medium',
    cost: 300,
    days: 1
  },
  {
    id: 'education_verify',
    name: 'Education Qualification Verification',
    provider: 'MIE Education Services',
    category: CheckCategory.IDENTITY,
    riskLevel: 'Low',
    cost: 200,
    days: 3
  }
];

const samplePackages = [
  {
    id: 'pkg_high_risk_individual',
    name: 'High-Risk Individual Package',
    entityType: VettingEntityType.INDIVIDUAL,
    checks: ['id_verify_sa', 'criminal_record_afis', 'education_verify']
  },
  {
    id: 'pkg_standard_company',
    name: 'Standard Company Package',
    entityType: VettingEntityType.COMPANY,
    checks: ['business_credit_report', 'company_registration_check']
  },
  {
    id: 'pkg_staff_medical',
    name: 'Staff Medical Package',
    entityType: VettingEntityType.STAFF_MEDICAL,
    checks: ['medical_fitness_cert', 'occupational_health_assess']
  }
];

export default function ProviderIntelligenceDemo() {
  const [selectedEntityType, setSelectedEntityType] = useState<VettingEntityType>(VettingEntityType.INDIVIDUAL);
  const [selectedPackage, setSelectedPackage] = useState('pkg_high_risk_individual');
  const [selectedChecks, setSelectedChecks] = useState<string[]>(['id_verify_sa', 'criminal_record_afis']);
  const [showFeatures, setShowFeatures] = useState(false);

  const handleSuggestionClick = (suggestion: { checkId: string; checkName: string }) => {
    if (!selectedChecks.includes(suggestion.checkId)) {
      setSelectedChecks(prev => [...prev, suggestion.checkId]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <NeumorphicCard className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-neumorphic-accent-primary/10">
              <Brain className="w-6 h-6 text-neumorphic-accent-primary" />
            </div>
            <div>
              <NeumorphicHeading size="lg" className="mb-1">
                Provider Intelligence System
              </NeumorphicHeading>
              <NeumorphicText variant="secondary">
                AI-powered provider insights and smart check suggestions for informed vetting decisions
              </NeumorphicText>
            </div>
          </div>
          <NeumorphicButton
            onClick={() => setShowFeatures(!showFeatures)}
            className="flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{showFeatures ? 'Hide' : 'Show'} Features</span>
          </NeumorphicButton>
        </div>
      </NeumorphicCard>

      {/* Feature Overview */}
      {showFeatures && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NeumorphicCard className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Shield className="w-5 h-5 text-neumorphic-accent-primary" />
              <NeumorphicText className="font-semibold">Provider Intelligence Cards</NeumorphicText>
            </div>
            <NeumorphicText variant="secondary" size="sm" className="mb-3">
              Hover over any provider name to see real-time performance metrics, certifications, and quality scores.
            </NeumorphicText>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                <NeumorphicText size="sm">Success rates and turnaround times</NeumorphicText>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                <NeumorphicText size="sm">Quality scores and certifications</NeumorphicText>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                <NeumorphicText size="sm">Customer satisfaction ratings</NeumorphicText>
              </div>
            </div>
          </NeumorphicCard>

          <NeumorphicCard className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Brain className="w-5 h-5 text-neumorphic-accent-secondary" />
              <NeumorphicText className="font-semibold">AI Smart Suggestions</NeumorphicText>
            </div>
            <NeumorphicText variant="secondary" size="sm" className="mb-3">
              Watch for glowing + icons that appear next to relevant checks with AI-powered recommendations.
            </NeumorphicText>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs">
                <Sparkles className="w-3 h-3 text-yellow-500" />
                <NeumorphicText size="sm">Context-aware check suggestions</NeumorphicText>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <TrendingUp className="w-3 h-3 text-blue-500" />
                <NeumorphicText size="sm">Package optimization recommendations</NeumorphicText>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <AlertTriangle className="w-3 h-3 text-orange-500" />
                <NeumorphicText size="sm">Risk-based priority scoring</NeumorphicText>
              </div>
            </div>
          </NeumorphicCard>
        </div>
      )}

      {/* Entity Type Selector */}
      <NeumorphicCard className="p-6">
        <NeumorphicText className="font-semibold mb-4">Demo Configuration</NeumorphicText>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {[
            { type: VettingEntityType.INDIVIDUAL, label: 'Individual', icon: User },
            { type: VettingEntityType.COMPANY, label: 'Company', icon: Building },
            { type: VettingEntityType.STAFF_MEDICAL, label: 'Staff Medical', icon: Stethoscope }
          ].map(({ type, label, icon: Icon }) => (
            <NeumorphicCard
              key={type}
              className={cn(
                "p-4 cursor-pointer transition-all",
                selectedEntityType === type ? "ring-2 ring-neumorphic-accent-primary" : "hover:shadow-lg"
              )}
              onClick={() => setSelectedEntityType(type)}
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5 text-neumorphic-accent-primary" />
                <NeumorphicText className="font-medium">{label}</NeumorphicText>
              </div>
            </NeumorphicCard>
          ))}
        </div>

        {/* Package Selector */}
        <div className="space-y-3">
          <NeumorphicText className="font-medium">Select Package:</NeumorphicText>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {samplePackages
              .filter(pkg => pkg.entityType === selectedEntityType)
              .map(pkg => (
                <NeumorphicCard
                  key={pkg.id}
                  className={cn(
                    "p-3 cursor-pointer transition-all",
                    selectedPackage === pkg.id ? "ring-2 ring-neumorphic-accent-secondary" : "hover:shadow-md"
                  )}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  <NeumorphicText size="sm" className="font-medium">
                    {pkg.name}
                  </NeumorphicText>
                </NeumorphicCard>
              ))}
          </div>
        </div>
      </NeumorphicCard>

      {/* Provider Intelligence Demo */}
      <NeumorphicCard className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="w-5 h-5 text-neumorphic-accent-primary" />
          <NeumorphicText className="font-semibold">
            Provider Intelligence in Action
          </NeumorphicText>
          <NeumorphicBadge variant="secondary" className="text-xs">
            Hover over provider names
          </NeumorphicBadge>
        </div>

        <div className="space-y-4">
          {sampleChecks.slice(0, 3).map((check) => (
            <NeumorphicCard key={check.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <NeumorphicText className="font-medium">{check.name}</NeumorphicText>
                    <NeumorphicBadge
                      variant={check.riskLevel === 'High' ? 'danger' : 
                               check.riskLevel === 'Medium' ? 'warning' : 'default'}
                      className="text-xs"
                    >
                      {check.riskLevel}
                    </NeumorphicBadge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <NeumorphicText variant="secondary" size="sm">
                      Provider:
                    </NeumorphicText>
                    <ProviderIntelligenceCard provider={check.provider}>
                      <NeumorphicText 
                        variant="secondary" 
                        size="sm" 
                        className="underline decoration-dotted hover:text-neumorphic-accent-primary transition-colors cursor-help font-medium"
                      >
                        {check.provider}
                      </NeumorphicText>
                    </ProviderIntelligenceCard>
                    <div className="flex items-center space-x-3 text-xs text-neumorphic-text-secondary">
                      <span>R{check.cost}</span>
                      <span>•</span>
                      <span>{check.days} days</span>
                    </div>
                  </div>
                </div>
                <AISmartSuggestion
                  checkId={check.id}
                  checkName={check.name}
                  entityType={selectedEntityType}
                  selectedPackage={selectedPackage}
                  selectedChecks={selectedChecks}
                  onSuggestionClick={handleSuggestionClick}
                />
              </div>
            </NeumorphicCard>
          ))}
        </div>
      </NeumorphicCard>

      {/* Selected Checks Summary */}
      <NeumorphicCard className="p-6">
        <NeumorphicText className="font-semibold mb-3">
          AI Suggestions Added ({selectedChecks.length} checks selected)
        </NeumorphicText>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {selectedChecks.map((checkId) => {
            const check = sampleChecks.find(c => c.id === checkId);
            return check ? (
              <NeumorphicBadge key={checkId} variant="outline" className="text-xs p-2">
                {check.name}
              </NeumorphicBadge>
            ) : null;
          })}
        </div>
      </NeumorphicCard>

      {/* Instructions */}
      <NeumorphicCard className="p-6 bg-neumorphic-accent-primary/5">
        <div className="flex items-start space-x-3">
          <TrendingUp className="w-5 h-5 text-neumorphic-accent-primary mt-0.5" />
          <div>
            <NeumorphicText className="font-semibold mb-2">
              How to Use Provider Intelligence
            </NeumorphicText>
            <div className="space-y-2 text-sm">
              <NeumorphicText variant="secondary" size="sm">
                1. <strong>Hover over provider names</strong> to see real-time performance metrics, success rates, and certifications
              </NeumorphicText>
              <NeumorphicText variant="secondary" size="sm">
                2. <strong>Look for glowing + icons</strong> that appear next to checks with AI recommendations
              </NeumorphicText>
              <NeumorphicText variant="secondary" size="sm">
                3. <strong>Click AI suggestions</strong> to automatically add recommended checks to your selection
              </NeumorphicText>
              <NeumorphicText variant="secondary" size="sm">
                4. <strong>Try different entity types and packages</strong> to see contextual suggestions change
              </NeumorphicText>
            </div>
          </div>
        </div>
      </NeumorphicCard>
    </div>
  );
}