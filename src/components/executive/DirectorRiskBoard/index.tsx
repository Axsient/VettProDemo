'use client';

import React, { useState, useMemo, useCallback } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { NeumorphicText, NeumorphicHeading, NeumorphicCard, NeumorphicBadge } from '@/components/ui/neumorphic';
import { 
  RiskCategory,
  ExecutiveSupplierInfo,
  suppliers,
  directors
} from '@/lib/sample-data/executive-dashboard-data';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getCssVariable = () => '';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getSeverityColor = () => '';
import { 
  Users, 
  Building2, 
  AlertTriangle,
  Filter,
  TrendingUp,
  DollarSign,
  MousePointer,
  Eye,
  Zap,
  Truck,
  Package,
  Wrench,
  Shield,
  Utensils,
  Monitor,
  Briefcase
} from 'lucide-react';

interface DirectorRiskBoardProps {
  activeFilter?: RiskCategory | null;
  onNodeClick?: (supplier: ExecutiveSupplierInfo) => void;
  onDirectorClick?: (directorId: string, suppliers: ExecutiveSupplierInfo[]) => void;
  selectedSupplierId?: string | null;
  selectedMineSiteId?: string | null;
  highlightedEntityIds?: string[];
  hoveredSupplierId?: string | null;
  filteredSuppliers?: ExecutiveSupplierInfo[];
  className?: string;
}

interface DirectorRiskProfile {
  directorId: string;
  directorName: string;
  suppliers: ExecutiveSupplierInfo[];
  boardCount: number;
  totalContractValue: number;
  averageRiskScore: number;
  maxRiskScore: number;
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  isConcentrationRisk: boolean;
  riskFactors: {
    highRiskSuppliers: number;
    criticalRiskSuppliers: number;
    totalExposure: number;
  };
}

const DirectorRiskBoard: React.FC<DirectorRiskBoardProps> = ({
  activeFilter,
  onNodeClick,
  onDirectorClick,
  selectedSupplierId,
  selectedMineSiteId,
  highlightedEntityIds = [],
  hoveredSupplierId,
  filteredSuppliers = suppliers,
  className = ''
}) => {
  const [hoveredDirector, setHoveredDirector] = useState<string | null>(null);
  const [hoveredSupplier, setHoveredSupplier] = useState<string | null>(null);

  // Category icons mapping
  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'Explosives & Blasting': <Zap className="w-4 h-4" />,
      'Heavy Equipment Leasing': <Truck className="w-4 h-4" />,
      'Logistics': <Package className="w-4 h-4" />,
      'General Supplies': <Briefcase className="w-4 h-4" />,
      'Chemical Supplies': <AlertTriangle className="w-4 h-4" />,
      'Refining Services': <Wrench className="w-4 h-4" />,
      'Water Treatment': <Shield className="w-4 h-4" />,
      'Engineering & Maintenance': <Wrench className="w-4 h-4" />,
      'Personal Protective Equipment': <Shield className="w-4 h-4" />,
      'Catering Services': <Utensils className="w-4 h-4" />,
      'Transportation': <Truck className="w-4 h-4" />,
      'IT Services': <Monitor className="w-4 h-4" />,
      'Security': <Shield className="w-4 h-4" />
    };
    return iconMap[category] || <Building2 className="w-4 h-4" />;
  };

  // Process directors and their risk profiles
  const directorProfiles = useMemo<DirectorRiskProfile[]>(() => {
    // Use passed filtered suppliers or apply additional filtering
    let processSuppliers = filteredSuppliers;
    
    // Apply additional mine site filtering if selected
    if (selectedMineSiteId) {
      processSuppliers = processSuppliers.filter(s => 
        s.linkedMineSiteIds.includes(selectedMineSiteId)
      );
    }

    const directorToSuppliers: Record<string, ExecutiveSupplierInfo[]> = {};

    // Group suppliers by directors
    processSuppliers.forEach(supplier => {
      supplier.directorIds.forEach(directorId => {
        if (!directorToSuppliers[directorId]) {
          directorToSuppliers[directorId] = [];
        }
        directorToSuppliers[directorId].push(supplier);
      });
    });

    // Create director profiles
    const profiles: DirectorRiskProfile[] = [];

    Object.entries(directorToSuppliers).forEach(([directorId, directorSuppliers]) => {
      if (directorSuppliers.length === 0) return;

      const director = directors.find(d => d.id === directorId);
      if (!director) return;

      const boardCount = directorSuppliers.length;
      const totalContractValue = directorSuppliers.reduce((sum, s) => sum + s.contractValueZAR, 0);
      const averageRiskScore = directorSuppliers.reduce((sum, s) => sum + s.riskScore, 0) / directorSuppliers.length;
      const maxRiskScore = Math.max(...directorSuppliers.map(s => s.riskScore));
      
      const criticalRiskSuppliers = directorSuppliers.filter(s => s.riskScore >= 75).length;
      const highRiskSuppliers = directorSuppliers.filter(s => s.riskScore >= 50).length;
      
      // Determine director risk level
      const isConcentrationRisk = boardCount >= 3;
      let riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
      
      if (boardCount >= 4 && maxRiskScore >= 75) {
        riskLevel = 'Critical';
      } else if (boardCount >= 3 && (maxRiskScore >= 50 || criticalRiskSuppliers > 0)) {
        riskLevel = 'High';
      } else if (boardCount >= 2 && averageRiskScore >= 50) {
        riskLevel = 'Medium';
      } else {
        riskLevel = 'Low';
      }

      profiles.push({
        directorId,
        directorName: director.name,
        suppliers: directorSuppliers.sort((a, b) => b.riskScore - a.riskScore), // Sort by risk score
        boardCount,
        totalContractValue,
        averageRiskScore,
        maxRiskScore,
        riskLevel,
        isConcentrationRisk,
        riskFactors: {
          highRiskSuppliers,
          criticalRiskSuppliers,
          totalExposure: totalContractValue
        }
      });
    });

    // Sort profiles by risk level and board count
    return profiles.sort((a, b) => {
      const riskPriority = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
      const aPriority = riskPriority[a.riskLevel];
      const bPriority = riskPriority[b.riskLevel];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority; // Higher risk first
      }
      
      return b.boardCount - a.boardCount; // More boards first
    });
  }, [filteredSuppliers, selectedMineSiteId]);

  // Event handlers
  const handleSupplierClick = useCallback((supplier: ExecutiveSupplierInfo) => {
    if (onNodeClick) {
      onNodeClick(supplier);
    }
  }, [onNodeClick]);

  const handleDirectorClick = useCallback((directorId: string, suppliers: ExecutiveSupplierInfo[]) => {
    if (onDirectorClick) {
      onDirectorClick(directorId, suppliers);
    }
  }, [onDirectorClick]);

  const handleSupplierHover = useCallback((supplierId: string | null) => {
    setHoveredSupplier(supplierId);
  }, []);

  const handleDirectorHover = useCallback((directorId: string | null) => {
    setHoveredDirector(directorId);
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <NeumorphicHeading className="flex items-center justify-center gap-2">
          <Users className="w-6 h-6 text-[var(--neumorphic-accent)]" />
          Director Risk Board
        </NeumorphicHeading>
        <NeumorphicText variant="secondary" size="sm" className="mt-1">
          Board-by-board view of director concentration risks and supplier exposure
        </NeumorphicText>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[var(--neumorphic-text-secondary)]" />
          <NeumorphicText size="sm">
            {activeFilter ? `Filtering by ${activeFilter} risk` : 
             selectedMineSiteId ? 'Filtered by mine site' :
             filteredSuppliers.length !== suppliers.length ? 'Filtered view' :
             'Showing all directors'} 
            ({directorProfiles.length} directors)
          </NeumorphicText>
        </div>
        
        <div className="flex items-center gap-4">
          <NeumorphicText size="sm" variant="secondary">
            Concentration Risks: {directorProfiles.filter(d => d.isConcentrationRisk).length}
          </NeumorphicText>
        </div>
      </div>

      {/* Director Risk Boards */}
      <div className="space-y-4">
        {directorProfiles.map((profile, index) => {
          const isHovered = hoveredDirector === profile.directorId;
          const hasHighlightedSuppliers = profile.suppliers.some(s => highlightedEntityIds.includes(s.id));
          
          return (
            <motion.div
              key={profile.directorId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`transition-all duration-300 ${
                isHovered || hasHighlightedSuppliers ? 'scale-[1.02]' : ''
              }`}
            >
              <NeumorphicCard className={`p-6 overflow-hidden ${
                profile.isConcentrationRisk ? 'ring-2 ring-red-500 ring-opacity-30' : ''
              }`}>
                {/* Director Header */}
                <div 
                  className="flex items-center justify-between mb-4 cursor-pointer"
                  onClick={() => handleDirectorClick(profile.directorId, profile.suppliers)}
                  onMouseEnter={() => handleDirectorHover(profile.directorId)}
                  onMouseLeave={() => handleDirectorHover(null)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-full ${
                        profile.isConcentrationRisk ? 'bg-red-100' : 'bg-[var(--neumorphic-button)]'
                      } shadow-[var(--neumorphic-shadow-convex)]`}>
                        <Users className={`w-6 h-6 ${
                          profile.isConcentrationRisk ? 'text-red-600' : 'text-[var(--neumorphic-accent)]'
                        }`} />
                      </div>
                      <div>
                        <NeumorphicHeading className="mb-1">
                          {profile.directorName}
                        </NeumorphicHeading>
                        <NeumorphicText size="sm" variant="secondary">
                          Board Director • {profile.boardCount} Position{profile.boardCount !== 1 ? 's' : ''}
                        </NeumorphicText>
                      </div>
                    </div>
                    
                    {profile.isConcentrationRisk && (
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          opacity: [0.7, 1, 0.7] 
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          ease: "easeInOut" 
                        }}
                        className="flex items-center gap-2 px-3 py-2 bg-red-100 rounded-lg border border-red-300"
                      >
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <NeumorphicText size="sm" className="font-medium text-red-800">
                          CONCENTRATION RISK
                        </NeumorphicText>
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <NeumorphicBadge variant={
                        profile.riskLevel === 'Critical' ? 'danger' :
                        profile.riskLevel === 'High' ? 'warning' :
                        profile.riskLevel === 'Medium' ? 'info' : 'success'
                      }>
                        {profile.riskLevel} Risk
                      </NeumorphicBadge>
                      <NeumorphicText size="sm" variant="secondary" className="mt-1">
                        Avg Risk: {Math.round(profile.averageRiskScore)}%
                      </NeumorphicText>
                    </div>
                    <div className="text-right">
                      <NeumorphicText className="text-lg font-bold">
                        R{(profile.totalContractValue / 1000000).toFixed(1)}M
                      </NeumorphicText>
                      <NeumorphicText size="sm" variant="secondary">
                        Total Exposure
                      </NeumorphicText>
                    </div>
                  </div>
                </div>

                {/* Risk Summary Bar */}
                <div className="flex items-center gap-4 mb-4 p-3 bg-[var(--neumorphic-bg)] rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <NeumorphicText size="sm">
                      <span className="font-semibold text-red-600">{profile.riskFactors.criticalRiskSuppliers}</span> Critical Risk
                    </NeumorphicText>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    <NeumorphicText size="sm">
                      <span className="font-semibold text-orange-600">{profile.riskFactors.highRiskSuppliers}</span> High Risk
                    </NeumorphicText>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-blue-500" />
                    <NeumorphicText size="sm">
                      Max Risk: <span className="font-semibold">{Math.round(profile.maxRiskScore)}%</span>
                    </NeumorphicText>
                  </div>
                </div>

                {/* Supplier Board - Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {profile.suppliers.map((supplier) => {
                    const isSelected = selectedSupplierId === supplier.id;
                    const isHighlighted = highlightedEntityIds.includes(supplier.id);
                    const isHoveredSupplier = hoveredSupplier === supplier.id || hoveredSupplierId === supplier.id;
                    
                    const supplierRiskLevel = supplier.riskScore >= 75 ? 'Critical' :
                                            supplier.riskScore >= 50 ? 'High' :
                                            supplier.riskScore >= 25 ? 'Medium' : 'Low';

                    return (
                      <motion.div
                        key={supplier.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                          isSelected ? 'border-[var(--neumorphic-accent)] bg-blue-50' :
                          isHighlighted ? 'border-purple-400 bg-purple-50' :
                          isHoveredSupplier ? 'border-gray-400 bg-gray-50' :
                          supplierRiskLevel === 'Critical' ? 'border-red-300 bg-red-50' :
                          supplierRiskLevel === 'High' ? 'border-orange-300 bg-orange-50' :
                          'border-[var(--neumorphic-border)] bg-[var(--neumorphic-card)]'
                        }`}
                        onClick={() => handleSupplierClick(supplier)}
                        onMouseEnter={() => handleSupplierHover(supplier.id)}
                        onMouseLeave={() => handleSupplierHover(null)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Supplier Header */}
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`p-2 rounded-lg ${
                            supplierRiskLevel === 'Critical' ? 'bg-red-100' :
                            supplierRiskLevel === 'High' ? 'bg-orange-100' :
                            supplierRiskLevel === 'Medium' ? 'bg-yellow-100' :
                            'bg-green-100'
                          }`}>
                            {getCategoryIcon(supplier.category)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <NeumorphicText className="font-semibold text-sm leading-tight">
                              {supplier.name}
                            </NeumorphicText>
                            <NeumorphicText size="sm" variant="secondary" className="mt-1">
                              {supplier.category}
                            </NeumorphicText>
                          </div>
                        </div>

                        {/* Risk Score with Visual Indicator */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <NeumorphicText size="sm" className="font-medium">
                              Risk Score
                            </NeumorphicText>
                            <NeumorphicBadge variant={
                              supplierRiskLevel === 'Critical' ? 'danger' :
                              supplierRiskLevel === 'High' ? 'warning' :
                              supplierRiskLevel === 'Medium' ? 'info' : 'success'
                            } className="text-xs">
                              {supplier.riskScore}%
                            </NeumorphicBadge>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                supplierRiskLevel === 'Critical' ? 'bg-red-500' :
                                supplierRiskLevel === 'High' ? 'bg-orange-500' :
                                supplierRiskLevel === 'Medium' ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${supplier.riskScore}%` }}
                            />
                          </div>
                        </div>

                        {/* Contract Value */}
                        <div className="flex items-center justify-between">
                          <NeumorphicText size="sm" variant="secondary">
                            Contract Value
                          </NeumorphicText>
                          <NeumorphicText className="font-bold">
                            R{(supplier.contractValueZAR / 1000000).toFixed(1)}M
                          </NeumorphicText>
                        </div>

                        {/* Click Hint */}
                        <div className="flex items-center gap-1 mt-3 pt-2 border-t border-[var(--neumorphic-border)]">
                          <MousePointer className="w-3 h-3 text-[var(--neumorphic-text-secondary)]" />
                          <NeumorphicText size="sm" variant="secondary">
                            Click to view details
                          </NeumorphicText>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Director Action Bar */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--neumorphic-border)]">
                  <NeumorphicText size="sm" variant="secondary" className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Click director name to view full network analysis
                  </NeumorphicText>
                  
                  {profile.isConcentrationRisk && (
                    <NeumorphicText size="sm" className="text-red-600 font-medium">
                      ⚠️ Requires immediate risk review
                    </NeumorphicText>
                  )}
                </div>
              </NeumorphicCard>
            </motion.div>
          );
        })}

        {/* Empty State */}
        {directorProfiles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <NeumorphicCard className="p-8">
              <Users className="w-12 h-12 mx-auto mb-4 text-[var(--neumorphic-text-secondary)]" />
              <NeumorphicHeading className="mb-2">
                No Directors Found
              </NeumorphicHeading>
              <NeumorphicText variant="secondary">
                No directors match the current filter criteria.
              </NeumorphicText>
            </NeumorphicCard>
          </motion.div>
        )}
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div 
          className="p-4 rounded-[var(--neumorphic-radius-md)] bg-[var(--neumorphic-button)] shadow-[var(--neumorphic-shadow-convex)]"
          whileHover={{ scale: 1.02 }}
        >
          <NeumorphicText size="sm" variant="secondary">Total Directors</NeumorphicText>
          <NeumorphicText className="text-2xl font-bold">{directorProfiles.length}</NeumorphicText>
        </motion.div>
        <motion.div 
          className="p-4 rounded-[var(--neumorphic-radius-md)] bg-[var(--neumorphic-button)] shadow-[var(--neumorphic-shadow-convex)]"
          whileHover={{ scale: 1.02 }}
        >
          <NeumorphicText size="sm" variant="secondary">Concentration Risks</NeumorphicText>
          <NeumorphicText className="text-2xl font-bold text-[var(--neumorphic-severity-critical)]">
            {directorProfiles.filter(d => d.isConcentrationRisk).length}
          </NeumorphicText>
        </motion.div>
        <motion.div 
          className="p-4 rounded-[var(--neumorphic-radius-md)] bg-[var(--neumorphic-button)] shadow-[var(--neumorphic-shadow-convex)]"
          whileHover={{ scale: 1.02 }}
        >
          <NeumorphicText size="sm" variant="secondary">Total Exposure</NeumorphicText>
          <NeumorphicText className="text-2xl font-bold">
            R{(directorProfiles.reduce((sum, d) => sum + d.totalContractValue, 0) / 1000000).toFixed(0)}M
          </NeumorphicText>
        </motion.div>
        <motion.div 
          className="p-4 rounded-[var(--neumorphic-radius-md)] bg-[var(--neumorphic-button)] shadow-[var(--neumorphic-shadow-convex)]"
          whileHover={{ scale: 1.02 }}
        >
          <NeumorphicText size="sm" variant="secondary">Avg Risk Score</NeumorphicText>
          <NeumorphicText className="text-2xl font-bold">
            {directorProfiles.length > 0 ? 
              Math.round(directorProfiles.reduce((sum, d) => sum + d.averageRiskScore, 0) / directorProfiles.length) 
              : 0}%
          </NeumorphicText>
        </motion.div>
      </div>
    </div>
  );
};

export default DirectorRiskBoard;