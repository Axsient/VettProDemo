/**
 * Risk Scoring Engine for Executive Dashboard
 * 
 * This engine calculates comprehensive risk scores for suppliers and directors
 * based on multiple factors including concentration risk, network effects,
 * contract values, and operational risk factors.
 */

export interface RiskFactors {
  operational: number;
  financial: number;
  compliance: number;
  reputational: number;
  contractual: number;
}

export interface SupplierRiskProfile {
  id: string;
  name: string;
  baseRiskFactors: RiskFactors;
  contractValueZAR: number;
  directorIds: string[];
  category: string;
  geographicRisk: 'low' | 'medium' | 'high';
  linkedMineSiteIds: string[];
}

export interface DirectorRiskProfile {
  id: string;
  name: string;
  boardPositions: string[]; // supplier IDs
  yearsExperience: number;
  hasAdverseMedia: boolean;
  complianceHistory: 'clean' | 'minor' | 'major';
}

export interface RiskScoringConfig {
  // Base risk factor weights (should sum to 1.0)
  baseRiskWeights: {
    operational: number;
    financial: number;
    compliance: number;
    reputational: number;
    contractual: number;
  };
  
  // Concentration risk penalties
  concentrationPenalties: {
    twoBoards: number;
    threeBoards: number;
    fourPlusBoards: number;
  };
  
  // Network effect multipliers
  networkEffects: {
    sharedDirectorMultiplier: number;
    geographicConcentrationMultiplier: number;
    contractValueThresholds: {
      low: number;    // < 50M
      medium: number; // 50M - 100M
      high: number;   // > 100M
    };
  };
  
  // Geographic risk multipliers
  geographicMultipliers: {
    low: number;
    medium: number;
    high: number;
  };
  
  // Director-specific risk factors
  directorRiskFactors: {
    adverseMediaPenalty: number;
    complianceHistoryPenalties: {
      clean: number;
      minor: number;
      major: number;
    };
    experienceBonus: number; // per year, max 10 years
  };
}

export const DEFAULT_RISK_CONFIG: RiskScoringConfig = {
  baseRiskWeights: {
    operational: 0.25,
    financial: 0.20,
    compliance: 0.25,
    reputational: 0.15,
    contractual: 0.15
  },
  
  concentrationPenalties: {
    twoBoards: 5,
    threeBoards: 12,
    fourPlusBoards: 20
  },
  
  networkEffects: {
    sharedDirectorMultiplier: 1.1,
    geographicConcentrationMultiplier: 1.15,
    contractValueThresholds: {
      low: 1.0,
      medium: 1.05,
      high: 1.1
    }
  },
  
  geographicMultipliers: {
    low: 1.0,
    medium: 1.05,
    high: 1.15
  },
  
  directorRiskFactors: {
    adverseMediaPenalty: 8,
    complianceHistoryPenalties: {
      clean: 0,
      minor: 3,
      major: 10
    },
    experienceBonus: -0.5 // reduces risk
  }
};

export class RiskScoringEngine {
  private config: RiskScoringConfig;
  private suppliers: SupplierRiskProfile[];
  private directors: DirectorRiskProfile[];
  
  constructor(
    suppliers: SupplierRiskProfile[],
    directors: DirectorRiskProfile[],
    config: RiskScoringConfig = DEFAULT_RISK_CONFIG
  ) {
    this.config = config;
    this.suppliers = suppliers;
    this.directors = directors;
  }

  /**
   * Calculate base risk score from risk factors
   */
  private calculateBaseRisk(factors: RiskFactors): number {
    const weights = this.config.baseRiskWeights;
    return (
      factors.operational * weights.operational +
      factors.financial * weights.financial +
      factors.compliance * weights.compliance +
      factors.reputational * weights.reputational +
      factors.contractual * weights.contractual
    );
  }

  /**
   * Calculate concentration risk penalty for directors
   */
  private calculateConcentrationPenalty(boardCount: number): number {
    if (boardCount >= 4) return this.config.concentrationPenalties.fourPlusBoards;
    if (boardCount === 3) return this.config.concentrationPenalties.threeBoards;
    if (boardCount === 2) return this.config.concentrationPenalties.twoBoards;
    return 0;
  }

  /**
   * Calculate network effect for suppliers based on shared directors
   */
  private calculateNetworkEffect(supplier: SupplierRiskProfile): number {
    let networkMultiplier = 1.0;
    
    // Check for shared directors with other suppliers
    const sharedDirectorCount = this.suppliers.filter(s => 
      s.id !== supplier.id && 
      s.directorIds.some(dirId => supplier.directorIds.includes(dirId))
    ).length;
    
    if (sharedDirectorCount > 0) {
      networkMultiplier *= this.config.networkEffects.sharedDirectorMultiplier;
    }
    
    // Geographic concentration check
    const sameRegionSuppliers = this.suppliers.filter(s => 
      s.id !== supplier.id && 
      s.geographicRisk === supplier.geographicRisk &&
      s.linkedMineSiteIds.some(siteId => supplier.linkedMineSiteIds.includes(siteId))
    ).length;
    
    if (sameRegionSuppliers > 2) {
      networkMultiplier *= this.config.networkEffects.geographicConcentrationMultiplier;
    }
    
    return networkMultiplier;
  }

  /**
   * Calculate contract value multiplier
   */
  private calculateContractValueMultiplier(contractValue: number): number {
    const thresholds = this.config.networkEffects.contractValueThresholds;
    
    if (contractValue > 100000000) return thresholds.high;
    if (contractValue > 50000000) return thresholds.medium;
    return thresholds.low;
  }

  /**
   * Calculate supplier risk score
   */
  public calculateSupplierRisk(supplierId: string): number {
    const supplier = this.suppliers.find(s => s.id === supplierId);
    if (!supplier) throw new Error(`Supplier ${supplierId} not found`);
    
    // 1. Base risk from operational factors
    let riskScore = this.calculateBaseRisk(supplier.baseRiskFactors);
    
    // 2. Geographic risk multiplier
    const geoMultiplier = this.config.geographicMultipliers[supplier.geographicRisk];
    riskScore *= geoMultiplier;
    
    // 3. Contract value multiplier
    const contractMultiplier = this.calculateContractValueMultiplier(supplier.contractValueZAR);
    riskScore *= contractMultiplier;
    
    // 4. Director concentration penalty
    supplier.directorIds.forEach(directorId => {
      const director = this.directors.find(d => d.id === directorId);
      if (director) {
        const concentrationPenalty = this.calculateConcentrationPenalty(director.boardPositions.length);
        riskScore += concentrationPenalty;
      }
    });
    
    // 5. Network effect multiplier
    const networkMultiplier = this.calculateNetworkEffect(supplier);
    riskScore *= networkMultiplier;
    
    // 6. Director-specific risk factors
    supplier.directorIds.forEach(directorId => {
      const director = this.directors.find(d => d.id === directorId);
      if (director) {
        // Adverse media penalty
        if (director.hasAdverseMedia) {
          riskScore += this.config.directorRiskFactors.adverseMediaPenalty;
        }
        
        // Compliance history penalty
        riskScore += this.config.directorRiskFactors.complianceHistoryPenalties[director.complianceHistory];
        
        // Experience bonus (capped at 10 years)
        const experienceYears = Math.min(director.yearsExperience, 10);
        riskScore += experienceYears * this.config.directorRiskFactors.experienceBonus;
      }
    });
    
    // Ensure score is within 0-100 range
    return Math.max(0, Math.min(100, Math.round(riskScore)));
  }

  /**
   * Calculate director risk score
   */
  public calculateDirectorRisk(directorId: string): number {
    const director = this.directors.find(d => d.id === directorId);
    if (!director) throw new Error(`Director ${directorId} not found`);
    
    // 1. Base risk from associated suppliers
    const associatedSuppliers = this.suppliers.filter(s => s.directorIds.includes(directorId));
    const avgSupplierRisk = associatedSuppliers.reduce((sum, supplier) => {
      return sum + this.calculateBaseRisk(supplier.baseRiskFactors);
    }, 0) / associatedSuppliers.length;
    
    let riskScore = avgSupplierRisk;
    
    // 2. Concentration risk penalty
    const concentrationPenalty = this.calculateConcentrationPenalty(director.boardPositions.length);
    riskScore += concentrationPenalty;
    
    // 3. Network effect - amplifies risk for multiple high-risk suppliers
    const highRiskSuppliers = associatedSuppliers.filter(s => 
      this.calculateBaseRisk(s.baseRiskFactors) > 60
    );
    if (highRiskSuppliers.length > 1) {
      riskScore *= (1 + (highRiskSuppliers.length - 1) * 0.15); // 15% per additional high-risk supplier
    }
    
    // 4. Total contract value exposure
    const totalContractValue = associatedSuppliers.reduce((sum, s) => sum + s.contractValueZAR, 0);
    const contractMultiplier = this.calculateContractValueMultiplier(totalContractValue);
    riskScore *= contractMultiplier;
    
    // 5. Personal risk factors
    if (director.hasAdverseMedia) {
      riskScore += this.config.directorRiskFactors.adverseMediaPenalty;
    }
    
    riskScore += this.config.directorRiskFactors.complianceHistoryPenalties[director.complianceHistory];
    
    // Experience bonus (capped at 10 years)
    const experienceYears = Math.min(director.yearsExperience, 10);
    riskScore += experienceYears * this.config.directorRiskFactors.experienceBonus;
    
    // 6. Geographic concentration risk
    const geographicRegions = [...new Set(associatedSuppliers.map(s => s.geographicRisk))];
    if (geographicRegions.length === 1 && geographicRegions[0] === 'high') {
      riskScore *= 1.1; // 10% penalty for high-risk geographic concentration
    }
    
    // Ensure score is within 0-100 range
    return Math.max(0, Math.min(100, Math.round(riskScore)));
  }

  /**
   * Calculate risk scores for all suppliers and directors
   */
  public calculateAllRiskScores(): {
    suppliers: { id: string; riskScore: number }[];
    directors: { id: string; riskScore: number }[];
  } {
    const supplierRisks = this.suppliers.map(supplier => ({
      id: supplier.id,
      riskScore: this.calculateSupplierRisk(supplier.id)
    }));
    
    const directorRisks = this.directors.map(director => ({
      id: director.id,
      riskScore: this.calculateDirectorRisk(director.id)
    }));
    
    return {
      suppliers: supplierRisks,
      directors: directorRisks
    };
  }

  /**
   * Get risk level from score
   */
  public static getRiskLevel(score: number): 'Low' | 'Medium' | 'High' | 'Critical' {
    if (score >= 75) return 'Critical';
    if (score >= 50) return 'High';
    if (score >= 25) return 'Medium';
    return 'Low';
  }

  /**
   * Get concentration risk indicators
   */
  public getConcentrationRisks(): {
    directors: { id: string; boardCount: number; riskScore: number }[];
    suppliers: { id: string; sharedDirectorCount: number; riskScore: number }[];
  } {
    const directorRisks = this.directors
      .filter(d => d.boardPositions.length >= 3)
      .map(d => ({
        id: d.id,
        boardCount: d.boardPositions.length,
        riskScore: this.calculateDirectorRisk(d.id)
      }))
      .sort((a, b) => b.riskScore - a.riskScore);
    
    const supplierRisks = this.suppliers
      .map(s => ({
        id: s.id,
        sharedDirectorCount: this.suppliers.filter(other => 
          other.id !== s.id && 
          other.directorIds.some(dirId => s.directorIds.includes(dirId))
        ).length,
        riskScore: this.calculateSupplierRisk(s.id)
      }))
      .filter(s => s.sharedDirectorCount > 0)
      .sort((a, b) => b.riskScore - a.riskScore);
    
    return {
      directors: directorRisks,
      suppliers: supplierRisks
    };
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<RiskScoringConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get detailed risk breakdown for a supplier
   */
  public getSupplierRiskBreakdown(supplierId: string): {
    baseRisk: number;
    geographicMultiplier: number;
    contractMultiplier: number;
    concentrationPenalty: number;
    networkMultiplier: number;
    directorPenalties: number;
    finalScore: number;
  } {
    const supplier = this.suppliers.find(s => s.id === supplierId);
    if (!supplier) throw new Error(`Supplier ${supplierId} not found`);
    
    const baseRisk = this.calculateBaseRisk(supplier.baseRiskFactors);
    const geographicMultiplier = this.config.geographicMultipliers[supplier.geographicRisk];
    const contractMultiplier = this.calculateContractValueMultiplier(supplier.contractValueZAR);
    const networkMultiplier = this.calculateNetworkEffect(supplier);
    
    let concentrationPenalty = 0;
    let directorPenalties = 0;
    
    supplier.directorIds.forEach(directorId => {
      const director = this.directors.find(d => d.id === directorId);
      if (director) {
        concentrationPenalty += this.calculateConcentrationPenalty(director.boardPositions.length);
        
        if (director.hasAdverseMedia) {
          directorPenalties += this.config.directorRiskFactors.adverseMediaPenalty;
        }
        
        directorPenalties += this.config.directorRiskFactors.complianceHistoryPenalties[director.complianceHistory];
        
        const experienceYears = Math.min(director.yearsExperience, 10);
        directorPenalties += experienceYears * this.config.directorRiskFactors.experienceBonus;
      }
    });
    
    const finalScore = this.calculateSupplierRisk(supplierId);
    
    return {
      baseRisk: Math.round(baseRisk),
      geographicMultiplier,
      contractMultiplier,
      concentrationPenalty,
      networkMultiplier,
      directorPenalties,
      finalScore
    };
  }
}

export default RiskScoringEngine;