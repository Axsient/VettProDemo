'use client';

import React, { useState, useEffect, useCallback } from 'react';
// import { toast } from 'sonner'; // Unused for now
import { Brain } from 'lucide-react';
import { 
  NeumorphicBackground,
  NeumorphicCard,
  NeumorphicHeading,
  NeumorphicText,
} from '@/components/ui/neumorphic';
import { InitiateVettingForm } from '@/components/vetting/InitiateVettingForm';
import { SummaryPanel } from '@/components/vetting/SummaryPanel';
import { 
  allVettingChecks, 
  vettingPackages, 
  getChecksByEntityType,
  calculateTotalCost,
  calculateMaxTurnaround
} from '@/lib/sample-data/vettingChecksSample';
import { sampleMiningProjects } from '@/lib/sample-data/projectsSample';
import { CheckCategory, VettingEntityType } from '@/types/vetting';

interface SmartCanvasState {
  selectedCheckIds: Set<string>;
  entityType: VettingEntityType | '';
  selectionType: 'package' | 'individual';
  selectedPackage: string;
}

export default function SmartVettingCanvas() {
  // const [loading] = useState(false); // Unused for now
  const [state, setState] = useState<SmartCanvasState>({
    selectedCheckIds: new Set<string>(),
    entityType: '',
    selectionType: 'package',
    selectedPackage: ''
  });

  // Load data - simplified since we're using static sample data
  useEffect(() => {
    // Data is already loaded from sample data imports
  }, []);

  // Calculate real-time metrics
  const totalCost = state.selectionType === 'package' && state.selectedPackage 
    ? vettingPackages.find(p => p.id === state.selectedPackage)?.totalEstimatedCostZAR || 0
    : calculateTotalCost(Array.from(state.selectedCheckIds));

  const totalTurnaround = state.selectionType === 'package' && state.selectedPackage
    ? vettingPackages.find(p => p.id === state.selectedPackage)?.totalEstimatedTurnaroundDays || 0
    : calculateMaxTurnaround(Array.from(state.selectedCheckIds));

  // Get available checks for selected entity type
  const availableChecks = state.entityType ? getChecksByEntityType(state.entityType) : [];
  const checkCategories = [...new Set(availableChecks.map(check => check.category))];

  // Provider performance metrics (simulated)
  const providerMetrics = {
    averagePerformance: 92.3,
    reliability: 96.8,
    speed: 87.5
  };

  // Handle state updates from form
  const handleStateUpdate = useCallback((updates: Partial<SmartCanvasState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  return (
    <NeumorphicBackground className="min-h-screen">
      <div className="space-y-6">

        {/* Header Section */}
        <NeumorphicCard>
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-blue-400" />
            <div>
              <NeumorphicHeading>Smart Vetting Canvas</NeumorphicHeading>
              <NeumorphicText variant="secondary" className="text-sm">
                Mission planning interface for intelligence-driven vetting operations
              </NeumorphicText>
            </div>
          </div>
        </NeumorphicCard>

        {/* Main Canvas Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Enhanced Form */}
          <div className="lg:col-span-2">
            <InitiateVettingForm 
              checks={allVettingChecks}
              packages={vettingPackages}
              projects={sampleMiningProjects}
              categories={Object.values(CheckCategory)}
              entityTypes={Object.values(VettingEntityType)}
              onStateChange={handleStateUpdate}
            />
          </div>

          {/* Right Column - Summary Panel */}
          <div className="lg:col-span-1">
            <SummaryPanel 
              totalCost={totalCost}
              totalTurnaround={totalTurnaround}
              selectedCheckIds={state.selectedCheckIds}
              entityType={state.entityType}
              selectionType={state.selectionType}
              selectedPackage={state.selectedPackage}
              checkCategories={checkCategories}
              providerMetrics={providerMetrics}
            />
          </div>
        </div>
      </div>
    </NeumorphicBackground>
  );
}