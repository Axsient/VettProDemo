/**
 * Real-time Vetting Cost and Time Calculator Hook
 * 
 * This hook provides real-time calculation of vetting costs, time estimates,
 * and performance optimizations for the Smart Vetting Canvas feature.
 * 
 * @author Claude Code
 * @version 1.0.0
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import {
  VettingEntityType,
  VettingCheckDefinition,
  VettingPackage,
} from '@/types/vetting';
import {
  allVettingChecks,
  vettingPackages,
  calculateTotalCost,
  calculateMaxTurnaround,
} from '@/lib/sample-data/vettingChecksSample';
import {
  calculateProviderPerformance,
  suggestCostOptimizations,
  CostOptimization,
} from '@/lib/vetting-intelligence';

// Hook configuration interface
export interface VettingCalculatorOptions {
  enableRealTimeUpdates?: boolean;
  debounceDelay?: number;
  includeProviderMetrics?: boolean;
  enableOptimizations?: boolean;
  trackChanges?: boolean;
}

// Calculation result interface
export interface VettingCalculation {
  // Basic calculations
  totalCost: number;
  totalTurnaroundDays: number;
  totalChecks: number;
  
  // Breakdown by category
  costByCategory: Record<string, number>;
  turnaroundByCategory: Record<string, number>;
  checksByCategory: Record<string, number>;
  
  // Provider analysis
  providerBreakdown: {
    provider: string;
    checkCount: number;
    totalCost: number;
    averageTurnaround: number;
    performanceScore?: number;
  }[];
  
  // Package analysis
  packageSavings?: {
    potentialSavings: number;
    recommendedPackage?: VettingPackage;
    applicableChecks: string[];
  };
  
  // Cost optimization
  optimization?: CostOptimization;
  
  // Performance metrics
  costPerCheck: number;
  costPerDay: number;
  efficiency: number; // 0-100 score
  
  // Risk assessment
  riskCoverage: {
    high: number;
    medium: number;
    low: number;
    total: number;
  };
  
  // Validation
  errors: string[];
  warnings: string[];
  
  // Metadata
  lastUpdated: Date;
  calculationId: string;
}

// Change tracking interface
export interface CalculationChange {
  timestamp: Date;
  changeType: 'add' | 'remove' | 'replace';
  checkId?: string;
  packageId?: string;
  costDelta: number;
  turnaroundDelta: number;
  description: string;
}

// Main hook
export function useVettingCalculator(
  selectedChecks: string[],
  selectedPackage: string | null,
  entityType: VettingEntityType,
  options: VettingCalculatorOptions = {}
) {
  const {
    enableRealTimeUpdates = true,
    debounceDelay = 300,
    includeProviderMetrics = true,
    enableOptimizations = true,
    trackChanges = false,
  } = options;

  // State
  const [calculation, setCalculation] = useState<VettingCalculation | null>(null);
  const [loading, setLoading] = useState(false);
  const [changes, setChanges] = useState<CalculationChange[]>([]);
  const [optimizationsApplied, setOptimizationsApplied] = useState<string[]>([]);

  // Memoized check definitions
  const selectedCheckDefs = useMemo(() => {
    return allVettingChecks.filter(check => selectedChecks.includes(check.id));
  }, [selectedChecks]);

  // Memoized package definition
  const selectedPackageDef = useMemo(() => {
    return selectedPackage ? vettingPackages.find(pkg => pkg.id === selectedPackage) : null;
  }, [selectedPackage]);

  // Core calculation function
  const performCalculation = useCallback(async (): Promise<VettingCalculation> => {
    const calculationId = `calc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();

    try {
      // Combine package and individual checks
      const allRelevantChecks = [...selectedCheckDefs];
      
      if (selectedPackageDef) {
        const packageChecks = allVettingChecks.filter(check => 
          selectedPackageDef.checkIds.includes(check.id)
        );
        // Merge without duplicates
        const existingIds = new Set(allRelevantChecks.map(c => c.id));
        packageChecks.forEach(check => {
          if (!existingIds.has(check.id)) {
            allRelevantChecks.push(check);
          }
        });
      }

      // Basic calculations
      const totalCost = selectedPackageDef 
        ? (selectedPackageDef.totalEstimatedCostZAR || 0) + calculateTotalCost(
            selectedChecks.filter(id => !selectedPackageDef.checkIds.includes(id))
          )
        : calculateTotalCost(selectedChecks);

      const totalTurnaroundDays = Math.max(
        selectedPackageDef?.totalEstimatedTurnaroundDays || 0,
        calculateMaxTurnaround(selectedChecks)
      );

      const totalChecks = allRelevantChecks.length;

      // Category breakdown
      const costByCategory: Record<string, number> = {};
      const turnaroundByCategory: Record<string, number> = {};
      const checksByCategory: Record<string, number> = {};

      allRelevantChecks.forEach(check => {
        const category = check.category;
        costByCategory[category] = (costByCategory[category] || 0) + (check.estimatedCostZAR || 0);
        turnaroundByCategory[category] = Math.max(
          turnaroundByCategory[category] || 0,
          check.estimatedTurnaroundDays || 0
        );
        checksByCategory[category] = (checksByCategory[category] || 0) + 1;
      });

      // Provider breakdown
      const providerBreakdown = Object.entries(
        allRelevantChecks.reduce((acc, check) => {
          const provider = check.provider || 'Unknown';
          if (!acc[provider]) {
            acc[provider] = {
              provider,
              checkCount: 0,
              totalCost: 0,
              turnarounds: [],
            };
          }
          acc[provider].checkCount++;
          acc[provider].totalCost += check.estimatedCostZAR || 0;
          acc[provider].turnarounds.push(check.estimatedTurnaroundDays || 0);
          return acc;
        }, {} as Record<string, any>)
      ).map(([_, data]) => {
        const result = {
          provider: data.provider,
          checkCount: data.checkCount,
          totalCost: data.totalCost,
          averageTurnaround: data.turnarounds.reduce((sum: number, t: number) => sum + t, 0) / data.turnarounds.length,
        };

        if (includeProviderMetrics) {
          const metrics = calculateProviderPerformance(data.provider.toLowerCase().replace(/[^a-z]/g, ''));
          (result as any).performanceScore = metrics?.overallScore;
        }

        return result;
      });

      // Package analysis
      let packageSavings: VettingCalculation['packageSavings'];
      if (!selectedPackageDef && selectedChecks.length >= 3) {
        const applicablePackages = vettingPackages.filter(pkg => 
          pkg.applicableTo.includes(entityType)
        );
        
        for (const pkg of applicablePackages) {
          const overlap = pkg.checkIds.filter(checkId => selectedChecks.includes(checkId));
          if (overlap.length >= 3) {
            const individualCost = calculateTotalCost(overlap);
            const packageCost = (pkg.totalEstimatedCostZAR || 0) * (overlap.length / pkg.checkIds.length);
            const savings = individualCost - packageCost;
            
            if (savings > (packageSavings?.potentialSavings || 0)) {
              packageSavings = {
                potentialSavings: savings,
                recommendedPackage: pkg,
                applicableChecks: overlap,
              };
            }
          }
        }
      }

      // Cost optimization
      let optimization: CostOptimization | undefined;
      if (enableOptimizations && selectedChecks.length > 0) {
        optimization = suggestCostOptimizations(selectedChecks, entityType);
      }

      // Performance metrics
      const costPerCheck = totalChecks > 0 ? totalCost / totalChecks : 0;
      const costPerDay = totalTurnaroundDays > 0 ? totalCost / totalTurnaroundDays : 0;
      
      // Efficiency calculation (lower cost per check and faster turnaround = higher efficiency)
      const avgCheckCost = allVettingChecks.reduce((sum, check) => sum + (check.estimatedCostZAR || 0), 0) / allVettingChecks.length;
      const avgTurnaround = allVettingChecks.reduce((sum, check) => sum + (check.estimatedTurnaroundDays || 0), 0) / allVettingChecks.length;
      
      const costEfficiency = avgCheckCost > 0 ? Math.max(0, Math.min(100, (1 - (costPerCheck - avgCheckCost) / avgCheckCost) * 100)) : 50;
      const timeEfficiency = avgTurnaround > 0 ? Math.max(0, Math.min(100, (1 - (totalTurnaroundDays - avgTurnaround) / avgTurnaround) * 100)) : 50;
      const efficiency = (costEfficiency + timeEfficiency) / 2;

      // Risk coverage
      const riskCoverage = {
        high: allRelevantChecks.filter(check => check.riskLevel === 'High').length,
        medium: allRelevantChecks.filter(check => check.riskLevel === 'Medium').length,
        low: allRelevantChecks.filter(check => check.riskLevel === 'Low').length,
        total: allRelevantChecks.length,
      };

      // Validation
      const errors: string[] = [];
      const warnings: string[] = [];

      if (totalChecks === 0) {
        warnings.push('No checks selected');
      }

      if (totalCost > 10000) {
        warnings.push('High cost selection - consider optimization');
      }

      if (totalTurnaroundDays > 14) {
        warnings.push('Long turnaround time - consider faster alternatives');
      }

      if (riskCoverage.high === 0 && entityType !== VettingEntityType.INDIVIDUAL) {
        warnings.push('No high-risk checks selected for this entity type');
      }

      const calculation: VettingCalculation = {
        totalCost,
        totalTurnaroundDays,
        totalChecks,
        costByCategory,
        turnaroundByCategory,
        checksByCategory,
        providerBreakdown,
        packageSavings,
        optimization,
        costPerCheck,
        costPerDay,
        efficiency,
        riskCoverage,
        errors,
        warnings,
        lastUpdated: new Date(),
        calculationId,
      };

      return calculation;
    } catch (error) {
      console.error('Calculation error:', error);
      throw error;
    }
  }, [
    selectedCheckDefs,
    selectedPackageDef,
    selectedChecks,
    entityType,
    includeProviderMetrics,
    enableOptimizations,
  ]);

  // Debounced calculation
  const debouncedCalculation = useDebouncedCallback(
    async () => {
      if (!enableRealTimeUpdates) return;
      
      setLoading(true);
      try {
        const result = await performCalculation();
        setCalculation(result);
      } catch (error) {
        console.error('Failed to calculate:', error);
      } finally {
        setLoading(false);
      }
    },
    debounceDelay
  );

  // Track changes
  const trackChange = useCallback((
    changeType: CalculationChange['changeType'],
    checkId?: string,
    packageId?: string,
    description?: string
  ) => {
    if (!trackChanges) return;

    const prevCalculation = calculation;
    if (!prevCalculation) return;

    // Calculate deltas (simplified for demo)
    const costDelta = 0; // Would calculate based on change
    const turnaroundDelta = 0; // Would calculate based on change

    const change: CalculationChange = {
      timestamp: new Date(),
      changeType,
      checkId,
      packageId,
      costDelta,
      turnaroundDelta,
      description: description || `${changeType} ${checkId || packageId}`,
    };

    setChanges(prev => [change, ...prev.slice(0, 99)]); // Keep last 100 changes
  }, [calculation, trackChanges]);

  // Effect for real-time updates
  useEffect(() => {
    debouncedCalculation();
  }, [debouncedCalculation]);

  // Manual calculation trigger
  const recalculate = useCallback(async () => {
    setLoading(true);
    try {
      const result = await performCalculation();
      setCalculation(result);
      return result;
    } catch (error) {
      console.error('Failed to recalculate:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [performCalculation]);

  // Apply optimization
  const applyOptimization = useCallback((optimizationId: string) => {
    if (!calculation?.optimization) return;

    const optimization = calculation.optimization.recommendations.find(r => 
      r.type === optimizationId
    );

    if (optimization) {
      setOptimizationsApplied(prev => [...prev, optimizationId]);
      trackChange('replace', undefined, undefined, `Applied optimization: ${optimization.description}`);
      // In a real implementation, this would modify the selected checks/packages
    }
  }, [calculation, trackChange]);

  // Reset optimizations
  const resetOptimizations = useCallback(() => {
    setOptimizationsApplied([]);
    trackChange('replace', undefined, undefined, 'Reset all optimizations');
  }, [trackChange]);

  // Get formatted cost
  const getFormattedCost = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }, []);

  // Get cost breakdown by category
  const getCostBreakdownData = useCallback(() => {
    if (!calculation) return [];
    
    return Object.entries(calculation.costByCategory).map(([category, cost]) => ({
      category,
      cost,
      percentage: calculation.totalCost > 0 ? (cost / calculation.totalCost) * 100 : 0,
      checks: calculation.checksByCategory[category] || 0,
    }));
  }, [calculation]);

  // Get provider performance comparison
  const getProviderComparison = useCallback(() => {
    if (!calculation) return [];
    
    return calculation.providerBreakdown.sort((a, b) => 
      (b.performanceScore || 0) - (a.performanceScore || 0)
    );
  }, [calculation]);

  return {
    // Core data
    calculation,
    loading,
    
    // Actions
    recalculate,
    applyOptimization,
    resetOptimizations,
    
    // Utilities
    getFormattedCost,
    getCostBreakdownData,
    getProviderComparison,
    
    // Change tracking
    changes: trackChanges ? changes : [],
    optimizationsApplied,
    
    // Status
    hasErrors: calculation?.errors.length || 0 > 0,
    hasWarnings: calculation?.warnings.length || 0 > 0,
    isOptimized: optimizationsApplied.length > 0,
    
    // Performance
    efficiency: calculation?.efficiency || 0,
    lastUpdated: calculation?.lastUpdated,
  };
}