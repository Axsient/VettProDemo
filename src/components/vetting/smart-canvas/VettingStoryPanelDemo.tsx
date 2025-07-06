/**
 * VettingStoryPanel Demo Component
 * 
 * Demonstration component showcasing the VettingStoryPanel with interactive
 * controls and sample data. Shows how to integrate the story panel with
 * vetting form selections and demonstrates all major features.
 * 
 * @author Claude Code
 * @version 1.0.0
 */

'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { VettingEntityType } from '@/types/vetting';
import { allVettingChecks, vettingPackages } from '@/lib/sample-data/vettingChecksSample';
import { VettingStoryPanel } from './VettingStoryPanel';
import {
  NeumorphicCard,
  NeumorphicText,
  NeumorphicButton,
  NeumorphicBadge,
} from '@/components/ui/neumorphic';
import { NeumorphicCheckbox } from '@/components/forms/selection';
import {
  User,
  Building,
  Stethoscope,
  RotateCcw,
  Eye,
  Settings,
} from 'lucide-react';

export interface VettingStoryPanelDemoProps {
  className?: string;
}

// Sample configurations for quick testing
const SAMPLE_CONFIGURATIONS = [
  {
    id: 'basic_individual',
    name: 'Basic Individual',
    entityType: VettingEntityType.INDIVIDUAL,
    checks: ['id_verify_sa', 'criminal_record_afis', 'credit_check_ind'],
    description: 'Standard individual verification with basic checks',
  },
  {
    id: 'comprehensive_supplier',
    name: 'Comprehensive Supplier',
    entityType: VettingEntityType.COMPANY,
    checks: ['cipc_company_check', 'vat_verify_sars', 'business_credit_report', 'physical_loc_verify', 'bee_verification'],
    description: 'Full supplier due diligence with operational assessment',
  },
  {
    id: 'mining_medical',
    name: 'Mining Medical Package',
    entityType: VettingEntityType.STAFF_MEDICAL,
    checks: ['id_verify_sa', 'med_fitness_cert', 'drug_alcohol_screen', 'infectious_disease_screen'],
    description: 'Complete medical clearance for mining operations',
  },
  {
    id: 'high_risk_director',
    name: 'High-Risk Director',
    entityType: VettingEntityType.INDIVIDUAL,
    checks: ['id_verify_sa', 'criminal_record_enhanced', 'pep_sanctions_ind', 'lifestyle_audit_ind', 'litigation_search'],
    description: 'Enhanced checks for senior executive positions',
  },
];

export const VettingStoryPanelDemo: React.FC<VettingStoryPanelDemoProps> = ({
  className,
}) => {
  const [selectedChecks, setSelectedChecks] = useState<string[]>(['id_verify_sa', 'criminal_record_afis']);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [entityType, setEntityType] = useState<VettingEntityType>(VettingEntityType.INDIVIDUAL);
  const [showConsentDetails, setShowConsentDetails] = useState(true);
  const [compact, setCompact] = useState(false);
  const [lastInteraction, setLastInteraction] = useState<string>('');

  // Filter checks by entity type
  const availableChecks = allVettingChecks.filter(check => 
    check.applicableTo.includes(entityType)
  );

  // Filter packages by entity type
  const availablePackages = vettingPackages.filter(pkg => 
    pkg.applicableTo.includes(entityType)
  );

  // Handle check selection
  const handleCheckToggle = (checkId: string) => {
    setSelectedChecks(prev => 
      prev.includes(checkId)
        ? prev.filter(id => id !== checkId)
        : [...prev, checkId]
    );
    setSelectedPackage(null); // Clear package when individual checks are selected
  };

  // Handle package selection
  const handlePackageSelect = (packageId: string) => {
    const pkg = availablePackages.find(p => p.id === packageId);
    if (pkg) {
      setSelectedPackage(packageId);
      setSelectedChecks(pkg.checkIds);
    }
  };

  // Handle sample configuration
  const applySampleConfiguration = (configId: string) => {
    const config = SAMPLE_CONFIGURATIONS.find(c => c.id === configId);
    if (config) {
      setEntityType(config.entityType);
      setSelectedChecks(config.checks);
      setSelectedPackage(null);
    }
  };

  // Handle story panel interactions
  const handleCheckInteraction = (checkId: string, action: 'view' | 'consent') => {
    const check = allVettingChecks.find(c => c.id === checkId);
    setLastInteraction(`${action.toUpperCase()}: ${check?.name || checkId}`);
  };

  // Reset all selections
  const resetSelections = () => {
    setSelectedChecks([]);
    setSelectedPackage(null);
    setEntityType(VettingEntityType.INDIVIDUAL);
    setLastInteraction('');
  };

  // Get entity type icon
  const getEntityIcon = (type: VettingEntityType) => {
    switch (type) {
      case VettingEntityType.INDIVIDUAL:
        return User;
      case VettingEntityType.COMPANY:
        return Building;
      case VettingEntityType.STAFF_MEDICAL:
        return Stethoscope;
      default:
        return User;
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Demo Header */}
      <NeumorphicCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <NeumorphicText className="text-xl font-bold mb-2">
              VettingStoryPanel Demo
            </NeumorphicText>
            <NeumorphicText variant="secondary">
              Interactive demonstration of consent footprint visualization and dynamic vetting story generation
            </NeumorphicText>
          </div>
          <div className="flex items-center space-x-2">
            <NeumorphicButton
              onClick={resetSelections}
              className="flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </NeumorphicButton>
          </div>
        </div>

        {/* Quick Sample Configurations */}
        <div className="space-y-3">
          <NeumorphicText className="font-medium">Quick Start Configurations:</NeumorphicText>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {SAMPLE_CONFIGURATIONS.map((config) => {
              const IconComponent = getEntityIcon(config.entityType);
              
              return (
                <NeumorphicButton
                  key={config.id}
                  onClick={() => applySampleConfiguration(config.id)}
                  className="p-3 text-left h-auto flex flex-col items-start space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <IconComponent className="w-4 h-4" />
                    <span className="font-medium text-sm">{config.name}</span>
                  </div>
                  <span className="text-xs text-neumorphic-text-secondary">
                    {config.description}
                  </span>
                  <NeumorphicBadge variant="info" className="text-xs">
                    {config.checks.length} checks
                  </NeumorphicBadge>
                </NeumorphicButton>
              );
            })}
          </div>
        </div>
      </NeumorphicCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Controls */}
        <div className="space-y-4">
          {/* Entity Type Selection */}
          <NeumorphicCard className="p-4">
            <NeumorphicText className="font-medium mb-3">Entity Type</NeumorphicText>
            <div className="space-y-2">
              {Object.values(VettingEntityType).map((type) => {
                const IconComponent = getEntityIcon(type);
                
                return (
                  <label
                    key={type}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-neumorphic-button/20 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="entityType"
                      value={type}
                      checked={entityType === type}
                      onChange={(e) => setEntityType(e.target.value as VettingEntityType)}
                      className="sr-only"
                    />
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 transition-colors",
                      entityType === type 
                        ? "border-neumorphic-accent-primary bg-neumorphic-accent-primary" 
                        : "border-neumorphic-border"
                    )} />
                    <IconComponent className="w-4 h-4" />
                    <NeumorphicText size="sm">{type}</NeumorphicText>
                  </label>
                );
              })}
            </div>
          </NeumorphicCard>

          {/* Package Selection */}
          <NeumorphicCard className="p-4">
            <NeumorphicText className="font-medium mb-3">Quick Packages</NeumorphicText>
            <div className="space-y-2">
              {availablePackages.slice(0, 3).map((pkg) => (
                <NeumorphicButton
                  key={pkg.id}
                  onClick={() => handlePackageSelect(pkg.id)}
                  className={cn(
                    "w-full text-left p-3 h-auto",
                    selectedPackage === pkg.id && "border-neumorphic-accent-primary"
                  )}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{pkg.name}</span>
                      {pkg.isPopular && (
                        <NeumorphicBadge variant="success" className="text-xs">
                          Popular
                        </NeumorphicBadge>
                      )}
                    </div>
                    <div className="text-xs text-neumorphic-text-secondary">
                      {pkg.checkIds.length} checks • R{pkg.totalEstimatedCostZAR?.toLocaleString()}
                    </div>
                  </div>
                </NeumorphicButton>
              ))}
            </div>
          </NeumorphicCard>

          {/* Individual Check Selection */}
          <NeumorphicCard className="p-4">
            <NeumorphicText className="font-medium mb-3">Individual Checks</NeumorphicText>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {availableChecks.slice(0, 8).map((check) => (
                <label
                  key={check.id}
                  className="flex items-start space-x-3 p-2 rounded-lg hover:bg-neumorphic-button/20 cursor-pointer"
                >
                  <NeumorphicCheckbox
                    checked={selectedChecks.includes(check.id)}
                    onChange={() => handleCheckToggle(check.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <NeumorphicText size="sm" className="font-medium">
                        {check.name}
                      </NeumorphicText>
                      <NeumorphicBadge
                        variant={
                          check.riskLevel === 'High' ? 'danger' :
                          check.riskLevel === 'Medium' ? 'warning' : 'success'
                        }
                        className="text-xs"
                      >
                        {check.riskLevel}
                      </NeumorphicBadge>
                    </div>
                    <NeumorphicText variant="secondary" size="sm" className="mt-1">
                      R{check.estimatedCostZAR} • {check.estimatedTurnaroundDays} day{check.estimatedTurnaroundDays !== 1 ? 's' : ''}
                    </NeumorphicText>
                  </div>
                </label>
              ))}
            </div>
          </NeumorphicCard>

          {/* Display Options */}
          <NeumorphicCard className="p-4">
            <NeumorphicText className="font-medium mb-3 flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Display Options
            </NeumorphicText>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <NeumorphicCheckbox
                  checked={showConsentDetails}
                  onChange={(checked) => setShowConsentDetails(checked)}
                />
                <NeumorphicText size="sm">Show Consent Details Tab</NeumorphicText>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <NeumorphicCheckbox
                  checked={compact}
                  onChange={(checked) => setCompact(checked)}
                />
                <NeumorphicText size="sm">Compact Mode</NeumorphicText>
              </label>
            </div>
          </NeumorphicCard>

          {/* Interaction Log */}
          {lastInteraction && (
            <NeumorphicCard className="p-4">
              <NeumorphicText className="font-medium mb-2 flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                Last Interaction
              </NeumorphicText>
              <NeumorphicText variant="secondary" size="sm" className="font-mono">
                {lastInteraction}
              </NeumorphicText>
            </NeumorphicCard>
          )}
        </div>

        {/* Story Panel Display */}
        <div className="lg:col-span-2">
          <VettingStoryPanel
            selectedChecks={selectedChecks}
            selectedPackage={selectedPackage}
            entityType={entityType}
            onCheckInteraction={handleCheckInteraction}
            showConsentDetails={showConsentDetails}
            compact={compact}
          />
        </div>
      </div>

      {/* Current Selection Summary */}
      <NeumorphicCard className="p-4">
        <NeumorphicText className="font-medium mb-3">Current Selection Summary</NeumorphicText>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-neumorphic-accent-primary">
              {selectedChecks.length}
            </div>
            <NeumorphicText variant="secondary" size="sm">
              Selected Checks
            </NeumorphicText>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-neumorphic-accent-secondary">
              R{selectedChecks.reduce((sum, checkId) => {
                const check = allVettingChecks.find(c => c.id === checkId);
                return sum + (check?.estimatedCostZAR || 0);
              }, 0).toLocaleString()}
            </div>
            <NeumorphicText variant="secondary" size="sm">
              Estimated Cost
            </NeumorphicText>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-neumorphic-text-primary">
              {Math.max(...selectedChecks.map(checkId => {
                const check = allVettingChecks.find(c => c.id === checkId);
                return check?.estimatedTurnaroundDays || 0;
              }), 0)}
            </div>
            <NeumorphicText variant="secondary" size="sm">
              Max Days
            </NeumorphicText>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-neumorphic-severity-high">
              {selectedChecks.filter(checkId => {
                const check = allVettingChecks.find(c => c.id === checkId);
                return check?.consentRequired;
              }).length}
            </div>
            <NeumorphicText variant="secondary" size="sm">
              Consent Required
            </NeumorphicText>
          </div>
        </div>
      </NeumorphicCard>
    </div>
  );
};

export default VettingStoryPanelDemo;