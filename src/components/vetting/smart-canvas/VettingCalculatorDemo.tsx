/**
 * VettingCalculator Demo Component
 * 
 * Example usage of the VettingCalculator component with sample data
 * to demonstrate the live animations and cost calculations.
 * 
 * @author Claude Code
 * @version 1.0.0
 */

'use client';

import React, { useState } from 'react';
import { VettingCalculator } from './VettingCalculator';
import { VettingEntityType } from '@/types/vetting';
import { NeumorphicCard, NeumorphicText, NeumorphicButton } from '@/components/ui/neumorphic';
import { NeumorphicCheckbox } from '@/components/forms/selection';

const SAMPLE_CHECKS = [
  { id: 'id_verification', name: 'SA ID Verification', cost: 250 },
  { id: 'cipc_check', name: 'CIPC Company Check', cost: 150 },
  { id: 'credit_check', name: 'Credit Bureau Check', cost: 400 },
  { id: 'criminal_check', name: 'Criminal Background Check', cost: 300 },
  { id: 'adverse_media', name: 'Adverse Media Screening', cost: 200 },
  { id: 'sanctions_check', name: 'Sanctions & PEP Check', cost: 350 },
];

const SAMPLE_PACKAGES = [
  { id: 'basic_supplier', name: 'Basic Supplier Package', checks: ['id_verification', 'cipc_check'] },
  { id: 'comprehensive', name: 'Comprehensive Check', checks: ['id_verification', 'cipc_check', 'credit_check', 'criminal_check'] },
];

export const VettingCalculatorDemo: React.FC = () => {
  const [selectedChecks, setSelectedChecks] = useState<string[]>(['id_verification', 'cipc_check']);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [entityType, setEntityType] = useState<VettingEntityType>(VettingEntityType.COMPANY);
  const [showBreakdown, setShowBreakdown] = useState(true);
  const [compact, setCompact] = useState(false);

  const handleCheckToggle = (checkId: string) => {
    setSelectedChecks(prev => 
      prev.includes(checkId) 
        ? prev.filter(id => id !== checkId)
        : [...prev, checkId]
    );
    // Clear package selection when individual checks are modified
    setSelectedPackage(null);
  };

  const handlePackageSelect = (packageId: string) => {
    const pkg = SAMPLE_PACKAGES.find(p => p.id === packageId);
    if (pkg) {
      setSelectedPackage(packageId);
      setSelectedChecks(pkg.checks);
    }
  };

  const handleOptimizationApply = (optimizationId: string) => {
    console.log('Applied optimization:', optimizationId);
    // In a real implementation, this would modify the selections
  };

  return (
    <div className="space-y-6">
      {/* Demo Controls */}
      <NeumorphicCard className="p-6">
        <NeumorphicText className="text-lg font-semibold mb-4">
          VettingCalculator Demo
        </NeumorphicText>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Entity Type Selection */}
          <div className="space-y-2">
            <NeumorphicText variant="secondary" size="sm">Entity Type</NeumorphicText>
            <div className="space-y-2">
              {Object.values(VettingEntityType).map(type => (
                <label key={type} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="entityType"
                    value={type}
                    checked={entityType === type}
                    onChange={(e) => setEntityType(e.target.value as VettingEntityType)}
                    className="rounded border-neumorphic-border"
                  />
                  <NeumorphicText size="sm">{type}</NeumorphicText>
                </label>
              ))}
            </div>
          </div>

          {/* Package Selection */}
          <div className="space-y-2">
            <NeumorphicText variant="secondary" size="sm">Packages</NeumorphicText>
            <div className="space-y-2">
              {SAMPLE_PACKAGES.map(pkg => (
                <NeumorphicButton
                  key={pkg.id}
                  variant={selectedPackage === pkg.id ? "default" : "secondary"}
                  size="sm"
                  onClick={() => handlePackageSelect(pkg.id)}
                  className="w-full justify-start"
                >
                  {pkg.name}
                </NeumorphicButton>
              ))}
            </div>
          </div>

          {/* Individual Checks */}
          <div className="space-y-2">
            <NeumorphicText variant="secondary" size="sm">Individual Checks</NeumorphicText>
            <div className="space-y-2">
              {SAMPLE_CHECKS.map(check => (
                <NeumorphicCheckbox
                  key={check.id}
                  checked={selectedChecks.includes(check.id)}
                  onChange={() => handleCheckToggle(check.id)}
                  label={check.name}
                  className="text-sm"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Display Options */}
        <div className="flex items-center space-x-4 mt-6 pt-4 border-t border-neumorphic-border/20">
          <NeumorphicCheckbox
            checked={showBreakdown}
            onChange={(checked) => setShowBreakdown(checked)}
            label="Show Breakdown"
          />
          <NeumorphicCheckbox
            checked={compact}
            onChange={(checked) => setCompact(checked)}
            label="Compact Mode"
          />
        </div>
      </NeumorphicCard>

      {/* VettingCalculator Component */}
      <VettingCalculator
        selectedChecks={selectedChecks}
        selectedPackage={selectedPackage}
        entityType={entityType}
        onOptimizationApply={handleOptimizationApply}
        showBreakdown={showBreakdown}
        compact={compact}
        className="w-full"
      />

      {/* Selection Summary */}
      <NeumorphicCard className="p-4">
        <NeumorphicText className="font-medium mb-2">Current Selection</NeumorphicText>
        <div className="text-sm text-neumorphic-text-secondary space-y-1">
          <div>Entity Type: {entityType}</div>
          <div>Selected Package: {selectedPackage || 'None'}</div>
          <div>Individual Checks: {selectedChecks.length > 0 ? selectedChecks.join(', ') : 'None'}</div>
        </div>
      </NeumorphicCard>
    </div>
  );
};

export default VettingCalculatorDemo;