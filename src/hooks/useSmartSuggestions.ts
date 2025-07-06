/**
 * Smart Vetting Suggestions Hook
 * 
 * This hook provides intelligent package suggestions, entity-type based recommendations,
 * and cost-benefit analysis for the Smart Vetting Canvas feature.
 * 
 * @author Claude Code
 * @version 1.0.0
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import {
  VettingEntityType,
  CheckCategory,
  VettingCheckDefinition,
  VettingPackage,
} from '@/types/vetting';
import {
  allVettingChecks,
  vettingPackages,
  getChecksByEntityType,
  getPackagesByEntityType,
  calculateTotalCost,
  calculateMaxTurnaround,
} from '@/lib/sample-data/vettingChecksSample';
import {
  generateSmartRecommendations,
  analyzeEntityAndSuggestPackages,
  assessRiskLevel,
  getTrendingChecks,
  getMarketInsights,
  IntelligenceRecommendation,
  RiskAssessment,
} from '@/lib/vetting-intelligence';

// Hook configuration interface
export interface SmartSuggestionsOptions {
  enableRealTimeSuggestions?: boolean;
  debounceDelay?: number;
  maxSuggestions?: number;
  includeMarketTrends?: boolean;
  includeRiskAssessment?: boolean;
  riskProfile?: 'low' | 'medium' | 'high';
  budget?: number;
  prioritizePopular?: boolean;
  enableLearning?: boolean;
}

// Suggestion categories
export enum SuggestionCategory {
  RECOMMENDED_PACKAGES = 'recommended_packages',
  POPULAR_CHECKS = 'popular_checks',
  COST_OPTIMIZATION = 'cost_optimization',
  RISK_MITIGATION = 'risk_mitigation',
  TRENDING = 'trending',
  BUDGET_FRIENDLY = 'budget_friendly',
  COMPREHENSIVE = 'comprehensive',
  QUICK_START = 'quick_start',
}

// Enhanced suggestion interface
export interface SmartSuggestion extends IntelligenceRecommendation {
  category: SuggestionCategory;
  entityTypes: VettingEntityType[];
  checks?: string[];
  packageId?: string;
  estimatedCost?: number;
  estimatedTurnaround?: number;
  discount?: number;
  tags: string[];
  metrics: {
    popularity: number; // 0-100
    costEffectiveness: number; // 0-100
    riskCoverage: number; // 0-100
    timeEfficiency: number; // 0-100
    overallScore: number; // 0-100
  };
  learningFactors?: {
    userPreference: number;
    previousSelection: number;
    industryTrend: number;
  };
}

// Suggestion context for better recommendations
export interface SuggestionContext {
  entityType: VettingEntityType;
  selectedChecks: string[];
  selectedPackage?: string;
  riskProfile?: 'low' | 'medium' | 'high';
  budget?: number;
  timeConstraints?: number; // days
  industry?: string;
  previousSelections?: string[];
  userPreferences?: {
    prioritizeCost: boolean;
    prioritizeSpeed: boolean;
    prioritizeComprehensiveness: boolean;
  };
}

// Popular packages analytics
export interface PopularityAnalytics {
  packages: Array<{
    id: string;
    name: string;
    usageRate: number;
    satisfactionScore: number;
    averageRating: number;
    trend: 'rising' | 'stable' | 'declining';
  }>;
  checks: Array<{
    id: string;
    name: string;
    usageRate: number;
    successRate: number;
    averageCost: number;
    trend: 'rising' | 'stable' | 'declining';
  }>;
  insights: {
    mostPopularCategory: CheckCategory;
    averageBudget: number;
    commonCombinations: string[][];
    seasonalTrends: Record<string, number>;
  };
}

// Main hook
export function useSmartSuggestions(
  context: SuggestionContext,
  options: SmartSuggestionsOptions = {}
) {
  const {
    enableRealTimeSuggestions = true,
    debounceDelay = 500,
    maxSuggestions = 12,
    includeMarketTrends = true,
    includeRiskAssessment = true,
    prioritizePopular = true,
    enableLearning = false,
  } = options;

  // State
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const [popularityAnalytics, setPopularityAnalytics] = useState<PopularityAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Memoized applicable data
  const applicableChecks = useMemo(() => {
    return getChecksByEntityType(context.entityType);
  }, [context.entityType]);

  const applicablePackages = useMemo(() => {
    return getPackagesByEntityType(context.entityType);
  }, [context.entityType]);

  // Generate package suggestions
  const generatePackageSuggestions = useCallback((): SmartSuggestion[] => {
    const suggestions: SmartSuggestion[] = [];
    
    // Sort packages by relevance
    const sortedPackages = applicablePackages
      .map(pkg => {
        const overlap = pkg.checkIds.filter(id => context.selectedChecks.includes(id));
        const overlapScore = overlap.length / Math.max(pkg.checkIds.length, 1) * 100;
        const costScore = context.budget ? 
          Math.max(0, 100 - ((pkg.totalEstimatedCostZAR || 0) - context.budget) / context.budget * 100) : 
          50;
        
        return {
          ...pkg,
          relevanceScore: (overlapScore * 0.4) + (costScore * 0.3) + ((pkg.isPopular ? 100 : 50) * 0.3),
        };
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Generate suggestions for top packages
    sortedPackages.slice(0, 4).forEach((pkg, index) => {
      const costEffectiveness = pkg.discountPercentage || 0;
      const popularity = pkg.isPopular ? 90 : 50;
      const timeEfficiency = Math.max(0, 100 - (pkg.totalEstimatedTurnaroundDays || 0) * 10);
      
      suggestions.push({
        id: `package_${pkg.id}`,
        type: 'package',
        category: index === 0 ? SuggestionCategory.RECOMMENDED_PACKAGES : SuggestionCategory.POPULAR_CHECKS,
        title: pkg.name,
        description: pkg.description,
        confidence: Math.min(95, 70 + pkg.relevanceScore * 0.25),
        potentialSavings: calculateTotalCost(pkg.checkIds) - (pkg.totalEstimatedCostZAR || 0),
        riskReduction: calculateRiskReduction(pkg.checkIds),
        reasonCode: pkg.isPopular ? 'POPULAR_PACKAGE' : 'COST_EFFECTIVE',
        priority: index === 0 ? 'high' : index === 1 ? 'medium' : 'low',
        entityTypes: pkg.applicableTo,
        packageId: pkg.id,
        estimatedCost: pkg.totalEstimatedCostZAR,
        estimatedTurnaround: pkg.totalEstimatedTurnaroundDays,
        discount: pkg.discountPercentage,
        tags: [
          pkg.isPopular ? 'Popular' : 'Value',
          costEffectiveness > 10 ? 'Great Savings' : 'Standard',
          timeEfficiency > 70 ? 'Fast' : 'Standard Time',
        ].filter(Boolean),
        metrics: {
          popularity,
          costEffectiveness,
          riskCoverage: calculateRiskCoverage(pkg.checkIds),
          timeEfficiency,
          overallScore: (popularity + costEffectiveness + timeEfficiency) / 3,
        },
      });
    });

    return suggestions;
  }, [applicablePackages, context.selectedChecks, context.budget]);

  // Generate individual check suggestions
  const generateCheckSuggestions = useCallback((): SmartSuggestion[] => {
    const suggestions: SmartSuggestion[] = [];
    
    // Get trending checks
    const trendingChecks = getTrendingChecks(context.entityType);
    
    // Get missing high-risk checks
    const highRiskChecks = applicableChecks
      .filter(check => 
        check.riskLevel === 'High' && 
        !context.selectedChecks.includes(check.id)
      )
      .slice(0, 3);

    // Get budget-friendly checks
    const budgetFriendlyChecks = applicableChecks
      .filter(check => 
        (check.estimatedCostZAR || 0) < 200 && 
        !context.selectedChecks.includes(check.id)
      )
      .sort((a, b) => (a.estimatedCostZAR || 0) - (b.estimatedCostZAR || 0))
      .slice(0, 3);

    // Add trending suggestions
    trendingChecks.forEach((check, index) => {
      if (context.selectedChecks.includes(check.id)) return;
      
      suggestions.push({
        id: `trending_${check.id}`,
        type: 'check',
        category: SuggestionCategory.TRENDING,
        title: `Trending: ${check.name}`,
        description: `${check.description} - Popular choice this month.`,
        confidence: 80 - index * 5,
        riskReduction: check.riskLevel === 'High' ? 20 : check.riskLevel === 'Medium' ? 10 : 5,
        reasonCode: 'TRENDING_CHECK',
        priority: 'medium',
        entityTypes: check.applicableTo,
        checks: [check.id],
        estimatedCost: check.estimatedCostZAR,
        estimatedTurnaround: check.estimatedTurnaroundDays,
        tags: ['Trending', check.riskLevel || 'Standard', check.category],
        metrics: {
          popularity: 85 - index * 10,
          costEffectiveness: calculateCostEffectiveness(check),
          riskCoverage: check.riskLevel === 'High' ? 90 : check.riskLevel === 'Medium' ? 60 : 30,
          timeEfficiency: Math.max(0, 100 - (check.estimatedTurnaroundDays || 0) * 20),
          overallScore: 75 - index * 5,
        },
      });
    });

    // Add high-risk suggestions
    highRiskChecks.forEach((check, index) => {
      suggestions.push({
        id: `risk_${check.id}`,
        type: 'check',
        category: SuggestionCategory.RISK_MITIGATION,
        title: `Important: ${check.name}`,
        description: `${check.description} - Recommended for comprehensive risk coverage.`,
        confidence: 90 - index * 5,
        riskReduction: 25,
        reasonCode: 'HIGH_RISK_COVERAGE',
        priority: 'high',
        entityTypes: check.applicableTo,
        checks: [check.id],
        estimatedCost: check.estimatedCostZAR,
        estimatedTurnaround: check.estimatedTurnaroundDays,
        tags: ['High Risk', 'Important', check.category],
        metrics: {
          popularity: 70,
          costEffectiveness: calculateCostEffectiveness(check),
          riskCoverage: 95,
          timeEfficiency: Math.max(0, 100 - (check.estimatedTurnaroundDays || 0) * 20),
          overallScore: 85 - index * 5,
        },
      });
    });

    // Add budget-friendly suggestions
    if (context.budget && context.budget > 0) {
      budgetFriendlyChecks.forEach((check, index) => {
        suggestions.push({
          id: `budget_${check.id}`,
          type: 'check',
          category: SuggestionCategory.BUDGET_FRIENDLY,
          title: `Budget-Friendly: ${check.name}`,
          description: `${check.description} - Great value for money.`,
          confidence: 75 - index * 5,
          riskReduction: check.riskLevel === 'High' ? 15 : check.riskLevel === 'Medium' ? 8 : 3,
          reasonCode: 'BUDGET_FRIENDLY',
          priority: 'low',
          entityTypes: check.applicableTo,
          checks: [check.id],
          estimatedCost: check.estimatedCostZAR,
          estimatedTurnaround: check.estimatedTurnaroundDays,
          tags: ['Budget-Friendly', 'Value', check.category],
          metrics: {
            popularity: 60,
            costEffectiveness: 90 - index * 10,
            riskCoverage: check.riskLevel === 'High' ? 80 : check.riskLevel === 'Medium' ? 50 : 25,
            timeEfficiency: Math.max(0, 100 - (check.estimatedTurnaroundDays || 0) * 20),
            overallScore: 70 - index * 5,
          },
        });
      });
    }

    return suggestions;
  }, [applicableChecks, context.selectedChecks, context.entityType, context.budget]);

  // Generate optimization suggestions
  const generateOptimizationSuggestions = useCallback((): SmartSuggestion[] => {
    const suggestions: SmartSuggestion[] = [];
    
    if (context.selectedChecks.length === 0) return suggestions;

    // Check for package substitution opportunities
    for (const pkg of applicablePackages) {
      const overlap = pkg.checkIds.filter(id => context.selectedChecks.includes(id));
      if (overlap.length >= 3) {
        const individualCost = calculateTotalCost(overlap);
        const packageCost = (pkg.totalEstimatedCostZAR || 0) * (overlap.length / pkg.checkIds.length);
        const savings = individualCost - packageCost;
        
        if (savings > 50) {
          suggestions.push({
            id: `optimize_${pkg.id}`,
            type: 'optimization',
            category: SuggestionCategory.COST_OPTIMIZATION,
            title: `Save R${savings.toFixed(0)} with ${pkg.name}`,
            description: `Replace ${overlap.length} individual checks with this package to save money.`,
            confidence: 85,
            potentialSavings: savings,
            reasonCode: 'PACKAGE_OPTIMIZATION',
            priority: 'medium',
            entityTypes: pkg.applicableTo,
            packageId: pkg.id,
            estimatedCost: packageCost,
            discount: (savings / individualCost) * 100,
            tags: ['Cost Savings', 'Package Deal', 'Optimization'],
            metrics: {
              popularity: pkg.isPopular ? 80 : 60,
              costEffectiveness: Math.min(100, (savings / individualCost) * 100),
              riskCoverage: calculateRiskCoverage(pkg.checkIds),
              timeEfficiency: Math.max(0, 100 - (pkg.totalEstimatedTurnaroundDays || 0) * 10),
              overallScore: 75,
            },
          });
        }
      }
    }

    return suggestions;
  }, [applicablePackages, context.selectedChecks]);

  // Main suggestion generation function
  const generateAllSuggestions = useCallback(async (): Promise<SmartSuggestion[]> => {
    try {
      const packageSuggestions = generatePackageSuggestions();
      const checkSuggestions = generateCheckSuggestions();
      const optimizationSuggestions = generateOptimizationSuggestions();

      // Combine and sort by overall score
      let allSuggestions = [
        ...packageSuggestions,
        ...checkSuggestions,
        ...optimizationSuggestions,
      ];

      // Apply learning factors if enabled
      if (enableLearning && context.previousSelections) {
        allSuggestions = allSuggestions.map(suggestion => {
          const learningBoost = calculateLearningBoost(suggestion, context.previousSelections!);
          return {
            ...suggestion,
            confidence: Math.min(100, suggestion.confidence + learningBoost),
            metrics: {
              ...suggestion.metrics,
              overallScore: Math.min(100, suggestion.metrics.overallScore + learningBoost),
            },
          };
        });
      }

      // Sort by priority and confidence
      allSuggestions.sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder];
        const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder];
        
        if (aPriority !== bPriority) {
          return bPriority - aPriority;
        }
        
        return b.confidence - a.confidence;
      });

      // Limit to max suggestions
      return allSuggestions.slice(0, maxSuggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      throw error;
    }
  }, [
    generatePackageSuggestions,
    generateCheckSuggestions,
    generateOptimizationSuggestions,
    enableLearning,
    context.previousSelections,
    maxSuggestions,
  ]);

  // Debounced suggestion generation
  const debouncedGeneration = useDebouncedCallback(
    async () => {
      if (!enableRealTimeSuggestions) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const newSuggestions = await generateAllSuggestions();
        setSuggestions(newSuggestions);
        
        // Generate risk assessment if enabled
        if (includeRiskAssessment) {
          const risk = assessRiskLevel(
            context.entityType,
            context.selectedChecks,
            null
          );
          setRiskAssessment(risk);
        }
        
        // Generate popularity analytics if enabled
        if (includeMarketTrends) {
          const analytics = generatePopularityAnalytics();
          setPopularityAnalytics(analytics);
        }
        
        setLastUpdate(new Date());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate suggestions');
      } finally {
        setLoading(false);
      }
    },
    debounceDelay
  );

  // Effect for real-time suggestions
  useEffect(() => {
    debouncedGeneration();
  }, [debouncedGeneration]);

  // Manual refresh
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const newSuggestions = await generateAllSuggestions();
      setSuggestions(newSuggestions);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh suggestions');
    } finally {
      setLoading(false);
    }
  }, [generateAllSuggestions]);

  // Filter suggestions by category
  const getSuggestionsByCategory = useCallback((category: SuggestionCategory) => {
    return suggestions.filter(s => s.category === category);
  }, [suggestions]);

  // Get top suggestions
  const getTopSuggestions = useCallback((count: number = 3) => {
    return suggestions.slice(0, count);
  }, [suggestions]);

  return {
    // Core data
    suggestions,
    riskAssessment,
    popularityAnalytics,
    
    // Status
    loading,
    error,
    lastUpdate,
    
    // Actions
    refresh,
    getSuggestionsByCategory,
    getTopSuggestions,
    
    // Analytics
    totalSuggestions: suggestions.length,
    highPrioritySuggestions: suggestions.filter(s => s.priority === 'high' || s.priority === 'critical').length,
    averageConfidence: suggestions.length > 0 
      ? suggestions.reduce((sum, s) => sum + s.confidence, 0) / suggestions.length 
      : 0,
    
    // Categories
    availableCategories: Object.values(SuggestionCategory),
    categoryCounts: Object.values(SuggestionCategory).reduce((acc, category) => {
      acc[category] = suggestions.filter(s => s.category === category).length;
      return acc;
    }, {} as Record<SuggestionCategory, number>),
  };
}

// Helper functions

function calculateRiskReduction(checkIds: string[]): number {
  const checks = allVettingChecks.filter(check => checkIds.includes(check.id));
  const highRiskChecks = checks.filter(check => check.riskLevel === 'High').length;
  const mediumRiskChecks = checks.filter(check => check.riskLevel === 'Medium').length;
  
  return (highRiskChecks * 15) + (mediumRiskChecks * 8);
}

function calculateRiskCoverage(checkIds: string[]): number {
  const checks = allVettingChecks.filter(check => checkIds.includes(check.id));
  const totalRiskPoints = checks.reduce((sum, check) => {
    switch (check.riskLevel) {
      case 'High': return sum + 10;
      case 'Medium': return sum + 5;
      case 'Low': return sum + 2;
      default: return sum + 1;
    }
  }, 0);
  
  return Math.min(100, totalRiskPoints * 2);
}

function calculateCostEffectiveness(check: VettingCheckDefinition): number {
  const cost = check.estimatedCostZAR || 0;
  const turnaround = check.estimatedTurnaroundDays || 1;
  const riskValue = check.riskLevel === 'High' ? 10 : check.riskLevel === 'Medium' ? 5 : 2;
  
  return Math.min(100, (riskValue / (cost / 100)) * (5 / turnaround) * 20);
}

function calculateLearningBoost(suggestion: SmartSuggestion, previousSelections: string[]): number {
  // Simple learning algorithm based on previous selections
  let boost = 0;
  
  if (suggestion.packageId && previousSelections.includes(suggestion.packageId)) {
    boost += 10;
  }
  
  if (suggestion.checks) {
    const matchingChecks = suggestion.checks.filter(id => previousSelections.includes(id));
    boost += matchingChecks.length * 5;
  }
  
  return Math.min(20, boost);
}

function generatePopularityAnalytics(): PopularityAnalytics {
  // Simulate analytics data (in a real app, this would come from actual usage data)
  return {
    packages: vettingPackages.map(pkg => ({
      id: pkg.id,
      name: pkg.name,
      usageRate: pkg.isPopular ? Math.random() * 20 + 70 : Math.random() * 30 + 20,
      satisfactionScore: Math.random() * 20 + 80,
      averageRating: Math.random() * 1 + 4,
      trend: ['rising', 'stable', 'declining'][Math.floor(Math.random() * 3)] as any,
    })),
    checks: allVettingChecks.slice(0, 10).map(check => ({
      id: check.id,
      name: check.name,
      usageRate: Math.random() * 40 + 30,
      successRate: Math.random() * 10 + 90,
      averageCost: check.estimatedCostZAR || 0,
      trend: ['rising', 'stable', 'declining'][Math.floor(Math.random() * 3)] as any,
    })),
    insights: {
      mostPopularCategory: CheckCategory.IDENTITY,
      averageBudget: 1500,
      commonCombinations: [
        ['id_verify_sa', 'criminal_record_afis'],
        ['cipc_company_check', 'vat_verify_sars'],
        ['business_credit_report', 'bank_acc_verify_biz'],
      ],
      seasonalTrends: {
        'Q1': 85,
        'Q2': 92,
        'Q3': 88,
        'Q4': 95,
      },
    },
  };
}