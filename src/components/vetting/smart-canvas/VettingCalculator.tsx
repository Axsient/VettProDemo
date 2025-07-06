/**
 * VettingCalculator Component - Smart Vetting Canvas
 * 
 * Live cost calculator with animations for the Smart Vetting Canvas.
 * Provides real-time cost calculations, time estimates, and visual progress indicators
 * with smooth CountUp animations and responsive design.
 * 
 * @author Claude Code
 * @version 1.0.0
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { VettingEntityType } from '@/types/vetting';
import { useVettingCalculator } from '@/hooks/useVettingCalculator';
import {
  COUNTUP_CONFIGS,
  HOVER_ANIMATIONS,
  ANIMATION_CLASSES,
  withConditionalAnimation,
} from '@/lib/vetting-animations';
import {
  NeumorphicCard,
  NeumorphicText,
  NeumorphicBadge,
  NeumorphicButton,
} from '@/components/ui/neumorphic';
import CircularProgressRing from '@/components/ui/CircularProgressRing';
import ProviderIntelligenceCard from '../ProviderIntelligenceCard';
import { Clock, Calculator, TrendingUp, AlertCircle, CheckCircle, Info, Zap, Shield } from 'lucide-react';

// CountUp component interface
interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  onEnd?: () => void;
}

// Simple CountUp implementation
const CountUp: React.FC<CountUpProps> = ({
  end,
  start = 0,
  duration = 2000,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
  onEnd,
}) => {
  const [current, setCurrent] = useState(start);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOutCubic(progress);
      
      const value = start + (end - start) * easedProgress;
      setCurrent(value);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        onEnd?.();
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, start, duration, onEnd]);

  const formattedValue = current.toFixed(decimals);
  
  return (
    <span className={className}>
      {prefix}{formattedValue}{suffix}
    </span>
  );
};

export interface VettingCalculatorProps {
  selectedChecks: string[];
  selectedPackage?: string | null;
  entityType: VettingEntityType;
  className?: string;
  onOptimizationApply?: (optimizationId: string) => void;
  showBreakdown?: boolean;
  compact?: boolean;
}

export const VettingCalculator: React.FC<VettingCalculatorProps> = ({
  selectedChecks,
  selectedPackage = null,
  entityType,
  className,
  onOptimizationApply,
  showBreakdown = true,
  compact = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showOptimizations, setShowOptimizations] = useState(false);

  const {
    calculation,
    loading,
    getCostBreakdownData,
    getProviderComparison,
    hasWarnings,
    hasErrors,
    efficiency,
    applyOptimization,
  } = useVettingCalculator(selectedChecks, selectedPackage, entityType, {
    enableRealTimeUpdates: true,
    includeProviderMetrics: true,
    enableOptimizations: true,
    trackChanges: false,
  });

  // Animation trigger
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Cost breakdown data
  const breakdownData = useMemo(() => getCostBreakdownData(), [getCostBreakdownData]);
  const providerData = useMemo(() => getProviderComparison(), [getProviderComparison]);

  // Efficiency color and status
  const getEfficiencyStatus = (efficiency: number) => {
    if (efficiency >= 80) return { color: 'var(--neumorphic-severity-low)', status: 'Excellent', icon: CheckCircle };
    if (efficiency >= 60) return { color: 'var(--neumorphic-severity-medium)', status: 'Good', icon: TrendingUp };
    if (efficiency >= 40) return { color: 'var(--neumorphic-severity-high)', status: 'Fair', icon: AlertCircle };
    return { color: 'var(--neumorphic-severity-critical)', status: 'Poor', icon: AlertCircle };
  };

  const efficiencyStatus = getEfficiencyStatus(efficiency);

  if (!calculation && !loading) {
    return (
      <NeumorphicCard 
        className={cn(
          "p-6 text-center",
          withConditionalAnimation(ANIMATION_CLASSES.fadeIn, isVisible),
          className
        )}
      >
        <Calculator className="w-12 h-12 mx-auto mb-4 text-neumorphic-text-secondary" />
        <NeumorphicText variant="secondary">
          Select checks or packages to see cost calculations
        </NeumorphicText>
      </NeumorphicCard>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Calculator Card */}
      <NeumorphicCard 
        className={cn(
          "relative overflow-hidden",
          withConditionalAnimation(ANIMATION_CLASSES.fadeInUp, isVisible),
          !compact && "p-6",
          compact && "p-4"
        )}
        style={withConditionalAnimation(HOVER_ANIMATIONS.card)}
      >
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-neumorphic-card/80 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-neumorphic-accent-primary border-t-transparent rounded-full animate-spin" />
              <NeumorphicText size="sm">Calculating...</NeumorphicText>
            </div>
          </div>
        )}

        <div className={cn("grid gap-4", compact ? "grid-cols-2" : "grid-cols-1 md:grid-cols-3")}>
          {/* Total Cost */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calculator className="w-4 h-4 text-neumorphic-accent-primary" />
              <NeumorphicText variant="secondary" size="sm">Total Cost</NeumorphicText>
            </div>
            <div className="text-2xl font-bold text-neumorphic-text-primary">
              {calculation ? (
                <CountUp
                  end={calculation.totalCost}
                  prefix="R"
                  duration={COUNTUP_CONFIGS.currency.duration}
                  className="tabular-nums"
                />
              ) : (
                'R0'
              )}
            </div>
            {calculation && calculation.packageSavings && (
              <NeumorphicBadge variant="success" className="text-xs">
                Save R{calculation.packageSavings.potentialSavings.toLocaleString()}
              </NeumorphicBadge>
            )}
          </div>

          {/* Turnaround Time */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-neumorphic-accent-secondary" />
              <NeumorphicText variant="secondary" size="sm">Turnaround</NeumorphicText>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-2xl font-bold text-neumorphic-text-primary">
                {calculation ? (
                  <CountUp
                    end={calculation.totalTurnaroundDays}
                    suffix=" days"
                    duration={COUNTUP_CONFIGS.days.duration}
                    className="tabular-nums"
                  />
                ) : (
                  '0 days'
                )}
              </div>
              {calculation && (
                <CircularProgressRing
                  percentage={Math.min(100, (14 / Math.max(calculation.totalTurnaroundDays, 1)) * 100)}
                  size={32}
                  strokeWidth={3}
                  animate={isVisible}
                />
              )}
            </div>
          </div>

          {/* Efficiency Score */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <efficiencyStatus.icon className="w-4 h-4" style={{ color: efficiencyStatus.color }} />
              <NeumorphicText variant="secondary" size="sm">Efficiency</NeumorphicText>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-2xl font-bold" style={{ color: efficiencyStatus.color }}>
                <CountUp
                  end={efficiency}
                  suffix="/100"
                  duration={COUNTUP_CONFIGS.score.duration}
                  className="tabular-nums"
                />
              </div>
              <CircularProgressRing
                percentage={efficiency}
                size={32}
                strokeWidth={3}
                animate={isVisible}
              />
            </div>
            <NeumorphicBadge 
              variant={efficiency >= 80 ? "success" : efficiency >= 60 ? "warning" : "danger"}
              className="text-xs"
            >
              {efficiencyStatus.status}
            </NeumorphicBadge>
          </div>
        </div>

        {/* Quick Stats Row */}
        {calculation && !compact && (
          <div className={cn(
            "flex justify-between items-center pt-4 mt-4 border-t border-neumorphic-border/20",
            withConditionalAnimation(ANIMATION_CLASSES.fadeInUp, isVisible)
          )}>
            <div className="flex items-center space-x-4 text-sm text-neumorphic-text-secondary">
              <span>{calculation.totalChecks} checks</span>
              <span>•</span>
              <span>R{calculation.costPerCheck.toFixed(0)} per check</span>
              <span>•</span>
              <span>{Object.keys(calculation.providerBreakdown).length} providers</span>
            </div>
            
            {(hasWarnings || hasErrors) && (
              <div className="flex items-center space-x-2">
                {hasErrors && (
                  <NeumorphicBadge variant="danger" className="text-xs">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Errors
                  </NeumorphicBadge>
                )}
                {hasWarnings && (
                  <NeumorphicBadge variant="warning" className="text-xs">
                    <Info className="w-3 h-3 mr-1" />
                    Warnings
                  </NeumorphicBadge>
                )}
              </div>
            )}
          </div>
        )}
      </NeumorphicCard>

      {/* Cost Breakdown */}
      {showBreakdown && calculation && breakdownData.length > 0 && !compact && (
        <NeumorphicCard 
          className={cn(
            "p-4",
            withConditionalAnimation(ANIMATION_CLASSES.fadeInUp, isVisible)
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-neumorphic-accent-primary" />
              <NeumorphicText className="font-medium">Cost Breakdown</NeumorphicText>
            </div>
            {calculation.optimization && (
              <NeumorphicButton
                size="sm"
                onClick={() => setShowOptimizations(!showOptimizations)}
                className="text-xs"
              >
                <Zap className="w-3 h-3 mr-1" />
                Optimize
              </NeumorphicButton>
            )}
          </div>

          <div className="space-y-3">
            {breakdownData.map((item, index) => (
              <div 
                key={item.category}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg bg-neumorphic-button/30",
                  withConditionalAnimation(ANIMATION_CLASSES.slideInLeft, isVisible)
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ 
                      backgroundColor: `hsl(${(index * 45) % 360}, 60%, 60%)`,
                    }}
                  />
                  <div>
                    <NeumorphicText size="sm" className="font-medium">
                      {item.category}
                    </NeumorphicText>
                    <NeumorphicText variant="secondary" size="sm">
                      {item.checks} check{item.checks !== 1 ? 's' : ''}
                    </NeumorphicText>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-neumorphic-text-primary">
                    <CountUp
                      end={item.cost}
                      prefix="R"
                      duration={1500}
                      className="tabular-nums text-sm"
                    />
                  </div>
                  <div className="text-xs text-neumorphic-text-secondary">
                    {item.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </NeumorphicCard>
      )}

      {/* Provider Performance */}
      {calculation && providerData.length > 0 && !compact && (
        <NeumorphicCard 
          className={cn(
            "p-4",
            withConditionalAnimation(ANIMATION_CLASSES.fadeInUp, isVisible)
          )}
        >
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="w-4 h-4 text-neumorphic-accent-secondary" />
            <NeumorphicText className="font-medium">Provider Performance</NeumorphicText>
          </div>

          <div className="space-y-3">
            {providerData.slice(0, 3).map((provider, index) => (
              <div 
                key={provider.provider}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg bg-neumorphic-button/30",
                  withConditionalAnimation(ANIMATION_CLASSES.slideInRight, isVisible)
                )}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center space-x-3">
                  <CircularProgressRing
                    percentage={provider.performanceScore || 75}
                    size={24}
                    strokeWidth={2}
                    animate={isVisible}
                  />
                  <div>
                    <ProviderIntelligenceCard provider={provider.provider}>
                      <NeumorphicText 
                        size="sm" 
                        className="font-medium underline decoration-dotted hover:text-neumorphic-accent-primary transition-colors cursor-help"
                      >
                        {provider.provider}
                      </NeumorphicText>
                    </ProviderIntelligenceCard>
                    <NeumorphicText variant="secondary" size="sm">
                      {provider.checkCount} checks • ~{provider.averageTurnaround.toFixed(0)} days
                    </NeumorphicText>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-neumorphic-text-primary text-sm">
                    <CountUp
                      end={provider.totalCost}
                      prefix="R"
                      duration={1200}
                      className="tabular-nums"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </NeumorphicCard>
      )}

      {/* Optimization Suggestions */}
      {showOptimizations && calculation?.optimization && (
        <NeumorphicCard 
          className={cn(
            "p-4 border-l-4 border-neumorphic-accent-primary",
            withConditionalAnimation(ANIMATION_CLASSES.scaleIn, showOptimizations)
          )}
        >
          <div className="flex items-center space-x-2 mb-3">
            <Zap className="w-4 h-4 text-neumorphic-accent-primary" />
            <NeumorphicText className="font-medium">Optimization Suggestions</NeumorphicText>
          </div>

          <div className="space-y-3">
            {calculation.optimization.recommendations.map((rec, index) => (
              <div 
                key={index}
                className="flex items-start justify-between p-3 rounded-lg bg-neumorphic-button/20"
              >
                <div className="flex-1">
                  <NeumorphicText size="sm" className="font-medium mb-1">
                    {rec.type.replace('_', ' ').toUpperCase()}
                  </NeumorphicText>
                  <NeumorphicText variant="secondary" size="sm">
                    {rec.description}
                  </NeumorphicText>
                  {rec.potentialSavings > 0 && (
                    <NeumorphicBadge variant="success" className="text-xs mt-2">
                      Save R{rec.potentialSavings.toLocaleString()}
                    </NeumorphicBadge>
                  )}
                </div>
                <NeumorphicButton
                  size="sm"
                  onClick={() => {
                    applyOptimization(rec.type);
                    onOptimizationApply?.(rec.type);
                  }}
                  className="ml-3 text-xs"
                >
                  Apply
                </NeumorphicButton>
              </div>
            ))}
          </div>
        </NeumorphicCard>
      )}

      {/* Risk Coverage Summary */}
      {calculation && !compact && (
        <NeumorphicCard 
          className={cn(
            "p-4",
            withConditionalAnimation(ANIMATION_CLASSES.fadeIn, isVisible)
          )}
        >
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="w-4 h-4 text-neumorphic-accent-primary" />
            <NeumorphicText className="font-medium">Risk Coverage</NeumorphicText>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { level: 'High', count: calculation.riskCoverage.high, color: 'var(--neumorphic-severity-critical)' },
              { level: 'Medium', count: calculation.riskCoverage.medium, color: 'var(--neumorphic-severity-high)' },
              { level: 'Low', count: calculation.riskCoverage.low, color: 'var(--neumorphic-severity-low)' },
              { level: 'Total', count: calculation.riskCoverage.total, color: 'var(--neumorphic-accent-primary)' },
            ].map((risk, index) => (
              <div 
                key={risk.level}
                className={cn(
                  "text-center p-3 rounded-lg bg-neumorphic-button/30",
                  withConditionalAnimation(ANIMATION_CLASSES.scaleIn, isVisible)
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div 
                  className="text-lg font-bold mb-1"
                  style={{ color: risk.color }}
                >
                  <CountUp
                    end={risk.count}
                    duration={1000}
                    className="tabular-nums"
                  />
                </div>
                <NeumorphicText variant="secondary" size="sm">
                  {risk.level} Risk
                </NeumorphicText>
              </div>
            ))}
          </div>
        </NeumorphicCard>
      )}
    </div>
  );
};

export default VettingCalculator;