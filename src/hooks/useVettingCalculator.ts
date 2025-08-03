/**
 * Real-time Vetting Cost and Time Calculator Hook
 * 
 * This hook provides real-time calculation of vetting costs, time estimates,
 * and performance optimizations for the Smart Vetting Canvas feature.
 * 
 * @author Claude Code
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { 
  ActiveVettingCase, 
  VettingEntityType,
  CheckCategory,
  VettingStatus
} from '@/types/vetting';

interface CheckConfiguration {
  id: string;
  name: string;
  category: CheckCategory;
  estimatedCost: number;
  estimatedTurnaroundDays: number;
  isSelected: boolean;
  isRequired: boolean;
  applicableTo: VettingEntityType[];
}

interface CalculatorResult {
  totalCost: number;
  totalTurnaroundDays: number;
  selectedChecks: CheckConfiguration[];
  riskProfile: 'Low' | 'Medium' | 'High';
  complianceScore: number;
}

interface UseVettingCalculatorProps {
  entityType: VettingEntityType;
  initialChecks?: CheckConfiguration[];
}

// Default check configurations - moved outside component to avoid dependency issues
const defaultChecks: CheckConfiguration[] = [
  {
    id: 'id_verification',
    name: 'SA ID Verification',
    category: CheckCategory.IDENTITY,
    estimatedCost: 150,
    estimatedTurnaroundDays: 1,
    isSelected: true,
    isRequired: true,
    applicableTo: [VettingEntityType.INDIVIDUAL]
  },
  {
    id: 'criminal_check',
    name: 'Criminal Record Check',
    category: CheckCategory.CRIMINAL,
    estimatedCost: 300,
    estimatedTurnaroundDays: 3,
    isSelected: false,
    isRequired: false,
    applicableTo: [VettingEntityType.INDIVIDUAL]
  },
  {
    id: 'credit_check',
    name: 'Credit Bureau Check',
    category: CheckCategory.FINANCIAL,
    estimatedCost: 250,
    estimatedTurnaroundDays: 2,
    isSelected: false,
    isRequired: false,
    applicableTo: [VettingEntityType.INDIVIDUAL]
  },
  {
    id: 'cipc_check',
    name: 'CIPC Company Check',
    category: CheckCategory.COMPLIANCE,
    estimatedCost: 200,
    estimatedTurnaroundDays: 2,
    isSelected: true,
    isRequired: true,
    applicableTo: [VettingEntityType.COMPANY]
  },
  {
    id: 'sars_check',
    name: 'SARS Tax Compliance',
    category: CheckCategory.COMPLIANCE,
    estimatedCost: 180,
    estimatedTurnaroundDays: 2,
    isSelected: false,
    isRequired: false,
    applicableTo: [VettingEntityType.COMPANY, VettingEntityType.INDIVIDUAL]
  }
];

export const useVettingCalculator = ({ 
  entityType, 
  initialChecks = [] 
}: UseVettingCalculatorProps) => {
  const [availableChecks, setAvailableChecks] = useState<CheckConfiguration[]>(initialChecks);
  const [selectedChecks, setSelectedChecks] = useState<Set<string>>(new Set());
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<CalculatorResult | null>(null);

  // Initialize checks when component mounts or entity type changes
  useEffect(() => {
    if (initialChecks.length === 0) {
      const applicableChecks = defaultChecks.filter(check => 
        check.applicableTo.includes(entityType)
      );
      setAvailableChecks(applicableChecks);
      
      // Auto-select required checks
      const requiredCheckIds = applicableChecks
        .filter(check => check.isRequired)
        .map(check => check.id);
      setSelectedChecks(new Set(requiredCheckIds));
    }
  }, [entityType, initialChecks]);

  // Calculate results when selected checks change
  useEffect(() => {
    if (selectedChecks.size === 0) {
      setResult(null);
      return;
    }

    setIsCalculating(true);

    // Simulate calculation delay
    const timer = setTimeout(() => {
      const selectedCheckConfigs = availableChecks.filter(check => 
        selectedChecks.has(check.id)
      );

      const totalCost = selectedCheckConfigs.reduce((sum, check) => sum + check.estimatedCost, 0);
      const totalTurnaroundDays = Math.max(...selectedCheckConfigs.map(check => check.estimatedTurnaroundDays));

      // Risk calculation based on selected checks
      const riskFactors: Record<CheckCategory, number> = {
        [CheckCategory.CRIMINAL]: 40,
        [CheckCategory.FINANCIAL]: 30,
        [CheckCategory.IDENTITY]: 20,
        [CheckCategory.COMPLIANCE]: 10,
        [CheckCategory.OPERATIONAL]: 15,
        [CheckCategory.REPUTATIONAL]: 25,
        [CheckCategory.MEDICAL]: 35,
        [CheckCategory.BUSINESS_SPECIFIC]: 20
      };

      const coverageScore = selectedCheckConfigs.reduce((score, check) => {
        return score + (riskFactors[check.category] || 0);
      }, 0);

      let riskProfile: 'Low' | 'Medium' | 'High' = 'Medium';
      if (coverageScore >= 70) riskProfile = 'Low';
      else if (coverageScore <= 30) riskProfile = 'High';

      const complianceScore = Math.min(100, (coverageScore / 100) * 100);

      setResult({
        totalCost,
        totalTurnaroundDays,
        selectedChecks: selectedCheckConfigs,
        riskProfile,
        complianceScore
      });

      setIsCalculating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedChecks, availableChecks]);

  const toggleCheck = (checkId: string) => {
    const check = availableChecks.find(c => c.id === checkId);
    if (!check || check.isRequired) return;

    setSelectedChecks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(checkId)) {
        newSet.delete(checkId);
      } else {
        newSet.add(checkId);
      }
      return newSet;
    });
  };

  const selectAllChecks = () => {
    const allCheckIds = availableChecks.map(check => check.id);
    setSelectedChecks(new Set(allCheckIds));
  };

  const clearAllChecks = () => {
    const requiredCheckIds = availableChecks
      .filter(check => check.isRequired)
      .map(check => check.id);
    setSelectedChecks(new Set(requiredCheckIds));
  };

  const generateVettingCase = (): Partial<ActiveVettingCase> => {
    if (!result) return {};

    return {
      entityType,
      totalEstimatedCost: result.totalCost,
      estimatedCompletionDate: new Date(
        Date.now() + result.totalTurnaroundDays * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: VettingStatus.INITIATED,
      overallProgress: 0,
      completedChecks: 0,
      totalChecks: result.selectedChecks.length
    };
  };

  // Smart recommendations based on entity type and risk tolerance
  const getRecommendations = () => {
    const recommendations: string[] = [];

    if (entityType === VettingEntityType.INDIVIDUAL) {
      if (!selectedChecks.has('criminal_check')) {
        recommendations.push('Consider adding Criminal Record Check for comprehensive screening');
      }
      if (!selectedChecks.has('credit_check')) {
        recommendations.push('Financial verification recommended for positions involving money handling');
      }
    }

    if (entityType === VettingEntityType.COMPANY) {
      if (!selectedChecks.has('sars_check')) {
        recommendations.push('SARS Tax Compliance check recommended for all business entities');
      }
    }

    return recommendations;
  };

  const exportConfiguration = () => {
    return {
      entityType,
      selectedChecks: Array.from(selectedChecks),
      result,
      timestamp: new Date().toISOString()
    };
  };

  const importConfiguration = (config: Record<string, unknown>) => {
    try {
      if (config.selectedChecks && Array.isArray(config.selectedChecks)) {
        setSelectedChecks(new Set(config.selectedChecks as string[]));
      }
    } catch {
      console.error('Failed to import configuration');
    }
  };

  return {
    availableChecks,
    selectedChecks: Array.from(selectedChecks),
    isCalculating,
    result,
    toggleCheck,
    selectAllChecks,
    clearAllChecks,
    generateVettingCase,
    getRecommendations,
    exportConfiguration,
    importConfiguration
  };
};