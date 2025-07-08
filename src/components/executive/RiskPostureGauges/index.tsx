'use client';

import React, { useMemo, useCallback } from 'react';
import { BaseChart } from '@/components/charts/apex/components/BaseChart';
import { 
  NeumorphicText, 
  NeumorphicHeading, 
  NeumorphicCard,
  NeumorphicBadge,
  NeumorphicButton
} from '@/components/ui/neumorphic';
import { motion } from 'framer-motion';
import { 
  RiskPosture, 
  RiskCategory
} from '@/lib/sample-data/executive-dashboard-data';
import { getCssVariable } from '@/lib/executive/theme-bridge';
import { TrendingUp, AlertTriangle, Shield, DollarSign, FileCheck, Cog, Users, X } from 'lucide-react';

interface RiskPostureGaugesProps {
  riskPosture: RiskPosture;
  activeFilter?: RiskCategory | null;
  onFilterChange?: (category: RiskCategory | null) => void;
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

  // Dynamic color based on risk level
  const getGaugeColor = useCallback((riskValue: number): string => {
    if (riskValue >= 75) return getCssVariable('--neumorphic-severity-critical');
    if (riskValue >= 50) return getCssVariable('--neumorphic-severity-high');
    if (riskValue >= 25) return getCssVariable('--neumorphic-severity-medium');
    return getCssVariable('--neumorphic-severity-low');
  }, []);

  // Create individual gauge component using proper neumorphic components
  const createGauge = useCallback((config: GaugeConfig, value: number) => {
    const isActive = activeFilter === config.key;
    
        const series = [Math.round(value)];
    const options = {
      chart: {
        type: 'radialBar' as const,
        sparkline: {
          enabled: true,
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        }
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          hollow: {
            size: '45%',
            background: 'transparent',
          },
          track: {
            background: getCssVariable('--neumorphic-text-secondary'),
            strokeWidth: '100%',
            opacity: 0.15,
            margin: 3,
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              show: true,
              fontSize: '18px',
              fontWeight: '700',
              color: getCssVariable('--neumorphic-text-primary'),
              offsetY: 4,
              formatter: function (val: number) {
                return val + '%';
              },
            },
          },
        },
      },
      fill: {
        colors: [getGaugeColor(value)],
      },
      stroke: {
        lineCap: 'round' as const,
      },
      tooltip: {
        enabled: false,
      },
    };

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
        <NeumorphicCard className={`h-full ${isActive ? 'ring-1 ring-[var(--neumorphic-accent)]' : ''}`}>
          {/* Header with Icon and Title */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <div 
              className="p-2 rounded-full"
              style={{
                backgroundColor: getGaugeColor(value),
                color: 'white',
                opacity: 0.9
              }}
            >
              {React.cloneElement(config.icon as React.ReactElement, { className: 'w-4 h-4' })}
            </div>
            <NeumorphicText>
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

          {/* Gauge Chart */}
          <div className="h-20 flex items-center justify-center risk-gauge-container">
            <BaseChart
              options={options}
              series={series}
              type="radialBar"
              height={80}
            />
          </div>

          {/* Description and Badge */}
          <div className="mt-3 space-y-2">
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
      className={`space-y-4 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <NeumorphicCard className="text-center">
        <NeumorphicHeading className="flex items-center justify-center gap-2">
          <Shield className="w-5 h-5 text-[var(--neumorphic-accent)]" />
          Risk Posture Overview
        </NeumorphicHeading>
        <NeumorphicText variant="secondary" size="sm" className="mt-1">
          Click any gauge to filter dashboard by risk category
        </NeumorphicText>
      </NeumorphicCard>

      {/* KPI Cards Grid - 5 cards horizontally */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Risk Category Gauges */}
        {gaugeConfigs.map(config => 
          createGauge(config, staticRiskPosture[`${config.key}Risk` as keyof RiskPosture])
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
          <NeumorphicCard className="h-full text-center">
            {/* Header with Icon and Title */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <div 
                className="p-2 rounded-full"
                style={{
                  backgroundColor: getGaugeColor(overallRisk),
                  color: 'white',
                  opacity: 0.9
                }}
              >
                <Shield className="w-4 h-4" />
              </div>
              <NeumorphicText className="font-semibold text-sm">
                Overall Risk
              </NeumorphicText>
            </div>

            {/* Overall Risk Score Display */}
            <div className="h-20 flex items-center justify-center">
              <div className="text-center">
                <div 
                  className="text-3xl font-bold"
                  style={{ 
                    color: getGaugeColor(overallRisk)
                  }}
                >
                  {overallRisk}%
                </div>
              </div>
            </div>

                         {/* Description and Trend */}
             <div className="mt-3 space-y-2">
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

      {/* Active Filter Indicator */}
      {activeFilter && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <NeumorphicCard className="text-center">
            <div className="flex items-center justify-center gap-3">
              <NeumorphicText size="sm" className="font-medium">
                Filtering by {gaugeConfigs.find(g => g.key === activeFilter)?.title}
              </NeumorphicText>
                             <NeumorphicButton
                 onClick={() => onFilterChange?.(null)}
                 className="px-3 py-1 text-xs"
               >
                 <X className="w-3 h-3 mr-1" />
                 Clear
               </NeumorphicButton>
            </div>
          </NeumorphicCard>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RiskPostureGauges;