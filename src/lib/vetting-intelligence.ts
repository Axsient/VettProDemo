/**
 * Smart Vetting Intelligence Engine
 * 
 * This module provides intelligent vetting recommendations, cost optimization,
 * and risk assessment algorithms for the Smart Vetting Canvas feature.
 * 
 * @author Claude Code
 * @version 1.0.0
 */

import { 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  VettingPackage, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  VettingCase, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ActiveVettingCase,
  VettingEntityType,
  CheckCategory,
  VettingCheckDefinition,
} from '@/types/vetting';
import {
  allVettingChecks,
  vettingPackages,
  getChecksByEntityType,
  getPackagesByEntityType,
  calculateTotalCost,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  calculateMaxTurnaround,
} from '@/lib/sample-data/vettingChecksSample';

// Types for intelligence engine
export interface IntelligenceRecommendation {
  id: string;
  type: 'package' | 'check' | 'optimization';
  title: string;
  description: string;
  confidence: number; // 0-100
  potentialSavings?: number;
  riskReduction?: number;
  reasonCode: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface ProviderPerformanceMetrics {
  providerId: string;
  providerName: string;
  averageTurnaroundDays: number;
  successRate: number; // 0-100
  costEfficiency: number; // 0-100
  reliability: number; // 0-100
  overallScore: number; // 0-100
  totalCasesProcessed: number;
  recentPerformanceTrend: 'improving' | 'stable' | 'declining';
}

export interface RiskAssessment {
  overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number; // 0-100
  riskFactors: RiskFactor[];
  recommendedChecks: string[];
  complianceGaps: string[];
  mitigation: string[];
}

export interface RiskFactor {
  category: CheckCategory;
  factor: string;
  impact: 'low' | 'medium' | 'high';
  likelihood: 'low' | 'medium' | 'high';
  description: string;
}

export interface CostOptimization {
  currentCost: number;
  optimizedCost: number;
  savings: number;
  savingsPercentage: number;
  recommendations: OptimizationRecommendation[];
}

export interface OptimizationRecommendation {
  type: 'package_substitution' | 'provider_switch' | 'check_consolidation';
  description: string;
  potentialSavings: number;
  impactOnRisk: 'none' | 'minimal' | 'moderate' | 'significant';
  impactOnTurnaround: number; // days difference
}

// Provider performance data (simulated)
const providerPerformanceData: ProviderPerformanceMetrics[] = [
  {
    providerId: 'mie',
    providerName: 'MIE (Managed Integrity Evaluation)',
    averageTurnaroundDays: 1.8,
    successRate: 98.5,
    costEfficiency: 92,
    reliability: 96,
    overallScore: 95.5,
    totalCasesProcessed: 2847,
    recentPerformanceTrend: 'stable',
  },
  {
    providerId: 'xds',
    providerName: 'XDS (Experian)',
    averageTurnaroundDays: 1.2,
    successRate: 97.8,
    costEfficiency: 88,
    reliability: 94,
    overallScore: 93.3,
    totalCasesProcessed: 1923,
    recentPerformanceTrend: 'improving',
  },
  {
    providerId: 'lexisnexis',
    providerName: 'LexisNexis Risk Solutions',
    averageTurnaroundDays: 1.5,
    successRate: 99.2,
    costEfficiency: 85,
    reliability: 98,
    overallScore: 94.1,
    totalCasesProcessed: 3156,
    recentPerformanceTrend: 'stable',
  },
  {
    providerId: 'cpb',
    providerName: 'CPB (Credit Provider Bureau)',
    averageTurnaroundDays: 1.0,
    successRate: 96.5,
    costEfficiency: 90,
    reliability: 92,
    overallScore: 92.8,
    totalCasesProcessed: 1678,
    recentPerformanceTrend: 'improving',
  },
];

/**
 * Analyzes entity type and suggests appropriate vetting packages
 */
export function analyzeEntityAndSuggestPackages(
  entityType: VettingEntityType,
  riskProfile?: 'low' | 'medium' | 'high'
): IntelligenceRecommendation[] {
  const recommendations: IntelligenceRecommendation[] = [];
  const applicablePackages = getPackagesByEntityType(entityType);
  
  // Sort packages by popularity and applicability
  const sortedPackages = applicablePackages
    .sort((a, b) => {
      // Prioritize popular packages
      if (a.isPopular && !b.isPopular) return -1;
      if (!a.isPopular && b.isPopular) return 1;
      
      // Then by cost efficiency (discount percentage)
      return (b.discountPercentage || 0) - (a.discountPercentage || 0);
    });

  // Generate package recommendations
  sortedPackages.slice(0, 3).forEach((pkg, index) => {
    const confidence = pkg.isPopular ? 85 + (10 - index * 2) : 70 + (10 - index * 2);
    const priority = index === 0 ? 'high' : index === 1 ? 'medium' : 'low';
    
    recommendations.push({
      id: `package_${pkg.id}`,
      type: 'package',
      title: `Recommended: ${pkg.name}`,
      description: `${pkg.description}. Saves ${pkg.discountPercentage}% compared to individual checks.`,
      confidence,
      potentialSavings: calculateIndividualCost(pkg.checkIds) - pkg.totalEstimatedCostZAR!,
      riskReduction: calculateRiskReduction(pkg.checkIds),
      reasonCode: pkg.isPopular ? 'POPULAR_PACKAGE' : 'COST_EFFECTIVE',
      priority: priority as 'low' | 'medium' | 'high',
    });
  });

  // Risk-based recommendations
  if (riskProfile === 'high') {
    const highRiskChecks = getChecksByEntityType(entityType)
      .filter(check => check.riskLevel === 'High')
      .slice(0, 2);
    
    highRiskChecks.forEach(check => {
      recommendations.push({
        id: `risk_${check.id}`,
        type: 'check',
        title: `High-Risk Check: ${check.name}`,
        description: `Recommended for high-risk profiles: ${check.description}`,
        confidence: 90,
        riskReduction: 25,
        reasonCode: 'HIGH_RISK_PROFILE',
        priority: 'critical',
      });
    });
  }

  return recommendations;
}

/**
 * Calculates provider performance metrics
 */
export function calculateProviderPerformance(providerId: string): ProviderPerformanceMetrics | null {
  return providerPerformanceData.find(p => p.providerId === providerId) || null;
}

/**
 * Gets all provider performance metrics sorted by overall score
 */
export function getAllProviderMetrics(): ProviderPerformanceMetrics[] {
  return [...providerPerformanceData].sort((a, b) => b.overallScore - a.overallScore);
}

/**
 * Assesses risk level based on entity type and selected checks
 */
export function assessRiskLevel(
  entityType: VettingEntityType,
  selectedChecks: string[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  entityDetails?: Record<string, string | number | boolean>
): RiskAssessment {
  const selectedCheckDefs = allVettingChecks.filter(check => selectedChecks.includes(check.id));
  
  let baseRiskScore = 50; // Start with medium risk
  const riskFactors: RiskFactor[] = [];
  const recommendedChecks: string[] = [];
  const complianceGaps: string[] = [];
  const mitigation: string[] = [];

  // Adjust risk based on entity type
  switch (entityType) {
    case VettingEntityType.COMPANY:
      baseRiskScore += 10; // Companies have higher inherent risk
      break;
    case VettingEntityType.STAFF_MEDICAL:
      baseRiskScore += 15; // Medical positions have higher risk
      break;
    case VettingEntityType.INDIVIDUAL:
      baseRiskScore -= 5; // Individuals typically lower risk
      break;
  }

  // Assess coverage by category
  const categoryCoverage = Object.values(CheckCategory).reduce((acc, category) => {
    const categoryChecks = selectedCheckDefs.filter(check => check.category === category);
    const totalCategoryChecks = allVettingChecks.filter(check => 
      check.category === category && check.applicableTo.includes(entityType)
    );
    
    acc[category] = totalCategoryChecks.length > 0 
      ? (categoryChecks.length / totalCategoryChecks.length) * 100 
      : 0;
    
    return acc;
  }, {} as Record<CheckCategory, number>);

  // Identify risk factors and gaps
  Object.entries(categoryCoverage).forEach(([category, coverage]) => {
    if (coverage < 50) {
      const categoryEnum = category as CheckCategory;
      riskFactors.push({
        category: categoryEnum,
        factor: `Insufficient ${category.toLowerCase()} checks`,
        impact: coverage < 25 ? 'high' : 'medium',
        likelihood: 'medium',
        description: `Only ${Math.round(coverage)}% of recommended ${category.toLowerCase()} checks are included.`,
      });
      
      complianceGaps.push(`${category} verification incomplete`);
      
      // Recommend additional checks
      const additionalChecks = allVettingChecks
        .filter(check => check.category === categoryEnum && 
                check.applicableTo.includes(entityType) &&
                !selectedChecks.includes(check.id))
        .slice(0, 2);
      
      recommendedChecks.push(...additionalChecks.map(check => check.id));
    }
  });

  // Adjust risk score based on coverage
  const averageCoverage = Object.values(categoryCoverage).reduce((sum, cov) => sum + cov, 0) / Object.values(categoryCoverage).length;
  baseRiskScore = Math.max(10, baseRiskScore - (averageCoverage - 50) * 0.5);

  // Add high-risk check bonus
  const highRiskChecks = selectedCheckDefs.filter(check => check.riskLevel === 'High');
  baseRiskScore -= highRiskChecks.length * 5;

  // Generate mitigation strategies
  if (riskFactors.length > 0) {
    mitigation.push('Consider adding recommended checks to improve coverage');
  }
  if (averageCoverage < 70) {
    mitigation.push('Review and add essential checks for your entity type');
  }
  if (highRiskChecks.length === 0) {
    mitigation.push('Include at least one high-risk check for comprehensive assessment');
  }

  const finalRiskScore = Math.max(0, Math.min(100, baseRiskScore));
  let riskLevel: 'low' | 'medium' | 'high' | 'critical';
  
  if (finalRiskScore < 30) riskLevel = 'low';
  else if (finalRiskScore < 50) riskLevel = 'medium';
  else if (finalRiskScore < 75) riskLevel = 'high';
  else riskLevel = 'critical';

  return {
    overallRiskLevel: riskLevel,
    riskScore: finalRiskScore,
    riskFactors,
    recommendedChecks: [...new Set(recommendedChecks)],
    complianceGaps,
    mitigation,
  };
}

/**
 * Suggests cost optimization opportunities
 */
export function suggestCostOptimizations(
  selectedChecks: string[],
  entityType: VettingEntityType
): CostOptimization {
  const currentCost = calculateTotalCost(selectedChecks);
  let optimizedCost = currentCost;
  const recommendations: OptimizationRecommendation[] = [];

  // Check for package substitutions
  const applicablePackages = getPackagesByEntityType(entityType);
  
  for (const pkg of applicablePackages) {
    const overlap = pkg.checkIds.filter(checkId => selectedChecks.includes(checkId));
    if (overlap.length >= 3) { // Significant overlap
      const individualCost = calculateTotalCost(overlap);
      const packageCost = (pkg.totalEstimatedCostZAR || 0) * (overlap.length / pkg.checkIds.length);
      
      if (packageCost < individualCost) {
        recommendations.push({
          type: 'package_substitution',
          description: `Replace ${overlap.length} individual checks with ${pkg.name}`,
          potentialSavings: individualCost - packageCost,
          impactOnRisk: 'minimal',
          impactOnTurnaround: 0,
        });
        
        optimizedCost -= (individualCost - packageCost);
      }
    }
  }

  // Check for provider optimizations
  const selectedCheckDefs = allVettingChecks.filter(check => selectedChecks.includes(check.id));
  const providerGroups = selectedCheckDefs.reduce((groups, check) => {
    const provider = check.provider || 'Unknown';
    if (!groups[provider]) groups[provider] = [];
    groups[provider].push(check);
    return groups;
  }, {} as Record<string, VettingCheckDefinition[]>);

  Object.entries(providerGroups).forEach(([provider, checks]) => {
    const providerMetrics = calculateProviderPerformance(provider.toLowerCase().replace(/[^a-z]/g, ''));
    if (providerMetrics && checks.length >= 2) {
      // Suggest bulk discount
      const bulkSavings = checks.reduce((sum, check) => sum + (check.estimatedCostZAR || 0), 0) * 0.05;
      
      recommendations.push({
        type: 'provider_switch',
        description: `Negotiate bulk discount with ${provider} for ${checks.length} checks`,
        potentialSavings: bulkSavings,
        impactOnRisk: 'none',
        impactOnTurnaround: 0,
      });
      
      optimizedCost -= bulkSavings;
    }
  });

  return {
    currentCost,
    optimizedCost: Math.max(0, optimizedCost),
    savings: Math.max(0, currentCost - optimizedCost),
    savingsPercentage: currentCost > 0 ? ((currentCost - optimizedCost) / currentCost) * 100 : 0,
    recommendations,
  };
}

/**
 * Generates smart recommendations based on entity analysis
 */
export function generateSmartRecommendations(
  entityType: VettingEntityType,
  selectedChecks: string[],
  riskProfile?: 'low' | 'medium' | 'high',
  budget?: number
): IntelligenceRecommendation[] {
  const recommendations: IntelligenceRecommendation[] = [];
  
  // Get basic package recommendations
  recommendations.push(...analyzeEntityAndSuggestPackages(entityType, riskProfile));
  
  // Add cost optimization suggestions
  const costOpt = suggestCostOptimizations(selectedChecks, entityType);
  if (costOpt.savings > 0) {
    recommendations.push({
      id: 'cost_optimization',
      type: 'optimization',
      title: `Save R${costOpt.savings.toFixed(0)} with smart optimizations`,
      description: `We found ${costOpt.recommendations.length} ways to reduce costs without compromising quality.`,
      confidence: 85,
      potentialSavings: costOpt.savings,
      reasonCode: 'COST_OPTIMIZATION',
      priority: 'medium',
    });
  }
  
  // Budget-based recommendations
  if (budget && budget > 0) {
    const currentCost = calculateTotalCost(selectedChecks);
    if (currentCost > budget) {
      recommendations.push({
        id: 'budget_optimization',
        type: 'optimization',
        title: 'Optimize selection to fit budget',
        description: `Current selection exceeds budget by R${(currentCost - budget).toFixed(0)}. Consider our budget-friendly alternatives.`,
        confidence: 90,
        potentialSavings: currentCost - budget,
        reasonCode: 'BUDGET_CONSTRAINT',
        priority: 'high',
      });
    }
  }
  
  return recommendations.sort((a, b) => b.confidence - a.confidence);
}

// Helper functions

function calculateIndividualCost(checkIds: string[]): number {
  return allVettingChecks
    .filter(check => checkIds.includes(check.id))
    .reduce((total, check) => total + (check.estimatedCostZAR || 0), 0);
}

function calculateRiskReduction(checkIds: string[]): number {
  const highRiskChecks = allVettingChecks
    .filter(check => checkIds.includes(check.id) && check.riskLevel === 'High')
    .length;
  
  const mediumRiskChecks = allVettingChecks
    .filter(check => checkIds.includes(check.id) && check.riskLevel === 'Medium')
    .length;
  
  return (highRiskChecks * 15) + (mediumRiskChecks * 8);
}

/**
 * Gets trending checks based on recent usage patterns
 */
export function getTrendingChecks(entityType: VettingEntityType): VettingCheckDefinition[] {
  // Simulate trending based on cost-effectiveness and recent popularity
  return getChecksByEntityType(entityType)
    .sort((a, b) => {
      const aScore = (a.estimatedCostZAR || 0) / (a.estimatedTurnaroundDays || 1);
      const bScore = (b.estimatedCostZAR || 0) / (b.estimatedTurnaroundDays || 1);
      return aScore - bScore; // Lower cost per day is better
    })
    .slice(0, 5);
}

/**
 * Analyzes market trends and provider performance
 */
export function getMarketInsights(): {
  averageCosts: Record<CheckCategory, number>;
  averageTurnaround: Record<CheckCategory, number>;
  popularityTrends: Record<string, number>;
  providerRankings: ProviderPerformanceMetrics[];
} {
  const categories = Object.values(CheckCategory);
  
  const averageCosts = categories.reduce((acc, category) => {
    const categoryChecks = allVettingChecks.filter(check => check.category === category);
    const avgCost = categoryChecks.reduce((sum, check) => sum + (check.estimatedCostZAR || 0), 0) / categoryChecks.length;
    acc[category] = avgCost || 0;
    return acc;
  }, {} as Record<CheckCategory, number>);
  
  const averageTurnaround = categories.reduce((acc, category) => {
    const categoryChecks = allVettingChecks.filter(check => check.category === category);
    const avgTurnaround = categoryChecks.reduce((sum, check) => sum + (check.estimatedTurnaroundDays || 0), 0) / categoryChecks.length;
    acc[category] = avgTurnaround || 0;
    return acc;
  }, {} as Record<CheckCategory, number>);
  
  // Simulate popularity trends (in a real app, this would come from usage analytics)
  const popularityTrends = vettingPackages.reduce((acc, pkg) => {
    acc[pkg.id] = pkg.isPopular ? Math.random() * 20 + 80 : Math.random() * 40 + 20;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    averageCosts,
    averageTurnaround,
    popularityTrends,
    providerRankings: getAllProviderMetrics(),
  };
}