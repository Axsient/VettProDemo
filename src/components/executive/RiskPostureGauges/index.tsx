'use client';

import React, { useMemo, useCallback } from 'react';
import CircularProgressRing from '@/components/ui/CircularProgressRing';
import { 
  NeumorphicText, 
  NeumorphicHeading, 
  NeumorphicCard,
  NeumorphicBadge
} from '@/components/ui/neumorphic';
import { motion } from 'framer-motion';
import { 
  RiskPosture, 
  RiskCategory
} from '@/lib/sample-data/executive-dashboard-data';
import { getCssVariable } from '@/lib/executive/theme-bridge';
import { TrendingUp, AlertTriangle, Shield, DollarSign, FileCheck, Cog, Users, Building, Wallet } from 'lucide-react';

interface RiskPostureGaugesProps {
  riskPosture: RiskPosture;
  activeFilter?: RiskCategory | null;
  onFilterChange?: (category: RiskCategory | null) => void;
  totalDirectors?: number;
  totalSuppliers?: number;
  totalExposureZAR?: number;
  filteredSuppliers?: ExecutiveSupplierInfo[];
  className?: string;
}

interface GaugeConfig {
  key: RiskCategory;
  title: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const RiskPostureGauges: React.FC<RiskPostureGaugesProps> = ({
  riskPosture,
  activeFilter,
  onFilterChange,
  totalDirectors = 0,
  totalSuppliers = 0,
  totalExposureZAR = 0,
  filteredSuppliers = [],
  className = '',
}) => {
  // KPI cards should always show static overall risk posture, not dynamic filtered values
  // The filtering affects other components (map, network, events) but KPI cards remain constant
  const staticRiskPosture = riskPosture;

  // Gauge configurations
  const gaugeConfigs: GaugeConfig[] = useMemo(() => [
    {
      key: 'financial',
      title: 'Financial Risk',
      icon: <DollarSign className="w-5 h-5" />,
      color: getCssVariable('--neumorphic-severity-high'),
      description: 'Contract values & payment risks',
    },
    {
      key: 'compliance',
      title: 'Compliance Risk',
      icon: <FileCheck className="w-5 h-5" />,
      color: getCssVariable('--neumorphic-severity-critical'),
      description: 'Regulatory & certification status',
    },
    {
      key: 'operational',
      title: 'Operational Risk',
      icon: <Cog className="w-5 h-5" />,
      color: getCssVariable('--neumorphic-severity-medium'),
      description: 'Service delivery & performance',
    },
    {
      key: 'reputational',
      title: 'Reputational Risk',
      icon: <Users className="w-5 h-5" />,
      color: getCssVariable('--neumorphic-severity-low'),
      description: 'Media coverage & public perception',
    },
  ], []);

  // Get severity badge variant based on risk level
  const getSeverityVariant = (value: number) => {
    if (value >= 75) return 'danger';
    if (value >= 50) return 'warning';
    if (value >= 25) return 'info';
    return 'success';
  };

  // Get severity label based on risk level
  const getSeverityLabel = (value: number) => {
    if (value >= 75) return 'High';
    if (value >= 50) return 'Medium';
    if (value >= 25) return 'Medium';
    return 'Low';
  };

  // Format ZAR values for display
  const formatZAR = (amount: number): string => {
    if (amount >= 1000000000) {
      return `R${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `R${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `R${(amount / 1000).toFixed(1)}K`;
    } else {
      return `R${amount.toFixed(0)}`;
    }
  };

  // Dynamic color based on risk level
  const getGaugeColor = useCallback((riskValue: number): string => {
    if (riskValue >= 75) return getCssVariable('--neumorphic-severity-critical');
    if (riskValue >= 50) return getCssVariable('--neumorphic-severity-high');
    if (riskValue >= 25) return getCssVariable('--neumorphic-severity-medium');
    return getCssVariable('--neumorphic-severity-low');
  }, []);

  // Create metric card for non-risk KPIs
  const createMetricCard = useCallback((title: string, value: string, icon: React.ReactNode, color: string, description: string) => {
    return (
      <motion.div
        className="cursor-pointer transition-all duration-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <NeumorphicCard className="h-full py-3 px-2 text-center">
          {/* Header with Icon and Title */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <div 
              className="p-1 rounded-full"
              style={{
                backgroundColor: color,
                color: 'white',
                opacity: 0.9
              }}
            >
              {React.cloneElement(icon as React.ReactElement, { className: 'w-3 h-3' })}
            </div>
            <NeumorphicText className="text-sm">
              {title}
            </NeumorphicText>
          </div>

          {/* Value Display */}
          <div className="mb-2">
            <NeumorphicText className="text-2xl font-bold text-[var(--neumorphic-text-primary)]">
              {value}
            </NeumorphicText>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <NeumorphicText variant="secondary" size="sm" className="text-center text-xs">
              {description}
            </NeumorphicText>
          </div>
        </NeumorphicCard>
      </motion.div>
    );
  }, []);

  // Create individual gauge component using CircularProgressRing
  const createGauge = useCallback((config: GaugeConfig, value: number) => {
    const isActive = activeFilter === config.key;
    
    return (
      <motion.div
        key={config.key}
        className={`cursor-pointer transition-all duration-300 ${
          isActive ? 'ring-2 ring-[var(--neumorphic-accent)] ring-opacity-50' : ''
        }`}
        onClick={() => onFilterChange?.(isActive ? null : config.key)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <NeumorphicCard className={`h-full py-3 px-2 ${isActive ? 'ring-1 ring-[var(--neumorphic-accent)]' : ''}`}>
          {/* Header with Icon and Title */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <div 
              className="p-1 rounded-full"
              style={{
                backgroundColor: getGaugeColor(value),
                color: 'white',
                opacity: 0.9
              }}
            >
              {React.cloneElement(config.icon as React.ReactElement, { className: 'w-3 h-3' })}
            </div>
            <NeumorphicText className="text-sm">
              {config.title}
            </NeumorphicText>
            {value >= 75 && (
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
              >
                <AlertTriangle className="w-3 h-3 text-[var(--neumorphic-severity-critical)]" />
              </motion.div>
            )}
          </div>

          {/* Circular Progress Ring */}
          <div className="flex items-center justify-center mb-2">
            <CircularProgressRing 
              percentage={Math.round(value)} 
              size={50} 
              strokeWidth={4} 
              animate={true}
              colorMode="risk"
            />
          </div>

          {/* Description and Badge */}
          <div className="space-y-1">
            <NeumorphicText variant="secondary" size="sm" className="text-center text-xs">
              {config.description}
            </NeumorphicText>
            <div className="flex justify-center">
              <NeumorphicBadge variant={getSeverityVariant(value)}>
                {getSeverityLabel(value)}
              </NeumorphicBadge>
            </div>
          </div>
        </NeumorphicCard>
      </motion.div>
    );
  }, [activeFilter, onFilterChange, getGaugeColor]);

  // Calculate overall risk score
  const overallRisk = useMemo(() => {
    return Math.round(
      (staticRiskPosture.financialRisk + staticRiskPosture.complianceRisk + 
       staticRiskPosture.operationalRisk + staticRiskPosture.reputationalRisk) / 4
    );
  }, [staticRiskPosture]);

  return (
    <motion.div 
      className={`space-y-2 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <NeumorphicCard className="text-center py-2">
        <NeumorphicHeading className="flex items-center justify-center gap-2">
          <Shield className="w-5 h-5 text-[var(--neumorphic-accent)]" />
          Risk Posture Overview
        </NeumorphicHeading>
      </NeumorphicCard>

      {/* KPI Cards Grid - 8 cards horizontally */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-3">
        {/* Risk Category Gauges */}
        {gaugeConfigs.map(config => 
          createGauge(config, staticRiskPosture[`${config.key}Risk` as keyof RiskPosture])
        )}

        {/* Total Directors Card */}
        {createMetricCard(
          'Total Directors',
          totalDirectors.toString(),
          <Users className="w-5 h-5" />,
          getCssVariable('--neumorphic-accent'),
          'Board members across all suppliers'
        )}

        {/* Total Suppliers Card */}
        {createMetricCard(
          'Total Suppliers',
          totalSuppliers.toString(),
          <Building className="w-5 h-5" />,
          getCssVariable('--neumorphic-info'),
          'Active suppliers in portfolio'
        )}

        {/* Total Exposure Card */}
        {createMetricCard(
          'Total Exposure',
          formatZAR(totalExposureZAR),
          <Wallet className="w-5 h-5" />,
          getCssVariable('--neumorphic-success'),
          'Combined contract value'
        )}
        
        {/* Overall Risk Summary Card */}
        <motion.div 
          className="cursor-pointer"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <NeumorphicCard className="h-full text-center py-3 px-2">
            {/* Header with Icon and Title */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <div 
                className="p-1 rounded-full"
                style={{
                  backgroundColor: getGaugeColor(overallRisk),
                  color: 'white',
                  opacity: 0.9
                }}
              >
                <Shield className="w-3 h-3" />
              </div>
              <NeumorphicText className="font-semibold text-sm">
                Overall Risk
              </NeumorphicText>
            </div>

            {/* Overall Risk Score Display */}
            <div className="flex items-center justify-center mb-2">
              <CircularProgressRing 
                percentage={overallRisk} 
                size={50} 
                strokeWidth={4} 
                animate={true}
                colorMode="risk"
              />
            </div>

                         {/* Description and Trend */}
             <div className="space-y-1">
               <NeumorphicText variant="secondary" size="sm" className="text-center text-xs">
                 Weighted average across all categories
               </NeumorphicText>
               <div className="flex items-center justify-center gap-2">
                 <NeumorphicBadge variant={getSeverityVariant(overallRisk)}>
                   {getSeverityLabel(overallRisk)}
                 </NeumorphicBadge>
                 <div className="flex items-center gap-1">
                   <TrendingUp className="w-3 h-3 text-[var(--neumorphic-text-secondary)]" />
                   <NeumorphicText size="sm" variant="secondary" className="text-xs">+2.3%</NeumorphicText>
                 </div>
               </div>
             </div>
          </NeumorphicCard>
        </motion.div>
      </div>

    </motion.div>
  );
};

export default RiskPostureGauges;