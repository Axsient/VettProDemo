/**
 * AISmartSuggestion Component
 * 
 * Provides AI-powered smart suggestions for additional vetting checks
 * with animated glowing + icons and contextual tooltips.
 * 
 * @author Claude Code
 * @version 1.0.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { VettingEntityType, CheckCategory } from '@/types/vetting';
import {
  NeumorphicText,
  NeumorphicBadge,
} from '@/components/ui/neumorphic';
import { 
  Plus, 
  Sparkles, 
  Brain, 
  AlertTriangle,
  Shield,
  TrendingUp,
  Users,
  Building,
  Stethoscope
} from 'lucide-react';

export interface SmartSuggestion {
  id: string;
  checkId: string;
  checkName: string;
  reason: string;
  confidence: number;
  category: CheckCategory;
  urgency: 'low' | 'medium' | 'high';
  estimatedCost?: number;
  estimatedDays?: number;
}

export interface AISmartSuggestionProps {
  checkId: string;
  checkName: string;
  entityType: VettingEntityType;
  selectedPackage?: string;
  selectedChecks: string[];
  onSuggestionClick?: (suggestion: SmartSuggestion) => void;
  className?: string;
}

// AI Suggestion Logic Engine
const generateSmartSuggestions = (
  checkId: string,
  checkName: string,
  entityType: VettingEntityType,
  selectedPackage?: string,
  selectedChecks: string[] = []
): SmartSuggestion[] => {
  const suggestions: SmartSuggestion[] = [];

  // High-Risk Individual Package Suggestions
  if (selectedPackage === 'pkg_high_risk_ind') {
    // Show suggestion on any check in the package
    if (checkId && !selectedChecks.includes('social_media_screening')) {
      suggestions.push({
        id: 'ai_suggest_social_media',
        checkId: 'social_media_screening',
        checkName: 'Social Media Screening',
        reason: 'AI Suggestion: Recommended for high-visibility roles',
        confidence: 94,
        category: CheckCategory.DIGITAL,
        urgency: 'high',
        estimatedCost: 180,
        estimatedDays: 2
      });
    }
    
    if (checkId === 'criminal_record_afis') {
      suggestions.push({
        id: 'ai_suggest_enhanced_criminal',
        checkId: 'criminal_record_enhanced',
        checkName: 'Enhanced Criminal Record Check',
        reason: 'Higher risk profiles benefit from comprehensive magistrate court records and pending cases.',
        confidence: 88,
        category: CheckCategory.CRIMINAL,
        urgency: 'high',
        estimatedCost: 300,
        estimatedDays: 5
      });
    }
  }

  // Company Package Suggestions
  if (entityType === VettingEntityType.COMPANY) {
    if (checkId === 'business_credit_report') {
      suggestions.push({
        id: 'ai_suggest_director_checks',
        checkId: 'director_background_check',
        checkName: 'Director Background Checks',
        reason: 'Companies with credit concerns often benefit from individual director verification.',
        confidence: 85,
        category: CheckCategory.COMPLIANCE,
        urgency: 'medium',
        estimatedCost: 450,
        estimatedDays: 3
      });
    }

    if (checkId === 'company_registration_check') {
      suggestions.push({
        id: 'ai_suggest_bee_certificate',
        checkId: 'bee_certificate_verify',
        checkName: 'BEE Certificate Verification',
        reason: 'Most procurement processes require verified BEE status for compliance.',
        confidence: 90,
        category: CheckCategory.COMPLIANCE,
        urgency: 'medium',
        estimatedCost: 200,
        estimatedDays: 2
      });
    }

    if (checkId === 'pep_sanctions_company' && !selectedChecks.includes('business_reputation_check')) {
      suggestions.push({
        id: 'ai_suggest_reputation_check',
        checkId: 'business_reputation_check',
        checkName: 'Business Reputation Analysis',
        reason: 'PEP screening pairs well with comprehensive business reputation assessment.',
        confidence: 83,
        category: CheckCategory.COMPLIANCE,
        urgency: 'medium',
        estimatedCost: 320,
        estimatedDays: 4
      });
    }
  }

  // Staff Medical Suggestions
  if (entityType === VettingEntityType.STAFF_MEDICAL) {
    if (checkId === 'medical_fitness_cert') {
      suggestions.push({
        id: 'ai_suggest_substance_screening',
        checkId: 'substance_abuse_screening',
        checkName: 'Substance Abuse Screening',
        reason: 'Mining environments require comprehensive substance screening for safety compliance.',
        confidence: 94,
        category: CheckCategory.MEDICAL,
        urgency: 'high',
        estimatedCost: 250,
        estimatedDays: 1
      });
    }

    if (checkId === 'occupational_health_assess') {
      suggestions.push({
        id: 'ai_suggest_mental_health',
        checkId: 'mental_health_assessment',
        checkName: 'Mental Health Assessment',
        reason: 'High-stress environments benefit from psychological fitness evaluation.',
        confidence: 78,
        category: CheckCategory.MEDICAL,
        urgency: 'medium',
        estimatedCost: 350,
        estimatedDays: 3
      });
    }
  }

  // Individual Entity Suggestions
  if (entityType === VettingEntityType.INDIVIDUAL) {
    if (checkId === 'employment_verify' && !selectedChecks.includes('reference_check_professional')) {
      suggestions.push({
        id: 'ai_suggest_professional_refs',
        checkId: 'reference_check_professional',
        checkName: 'Professional Reference Check',
        reason: 'Employment verification pairs well with professional character references.',
        confidence: 82,
        category: CheckCategory.IDENTITY,
        urgency: 'medium',
        estimatedCost: 120,
        estimatedDays: 3
      });
    }

    if (checkId === 'criminal_record_afis' && !selectedChecks.includes('watchlist_screening')) {
      suggestions.push({
        id: 'ai_suggest_watchlist',
        checkId: 'watchlist_screening',
        checkName: 'Watchlist & Sanctions Screening',
        reason: 'Criminal checks are more comprehensive when combined with international watchlist screening.',
        confidence: 87,
        category: CheckCategory.CRIMINAL,
        urgency: 'medium',
        estimatedCost: 100,
        estimatedDays: 1
      });
    }
  }

  // Package-specific cross-recommendations
  if (selectedPackage === 'pkg_standard_individual' && !selectedChecks.includes('social_media_screening')) {
    if (checkId === 'criminal_record_afis') {
      suggestions.push({
        id: 'ai_suggest_digital_footprint',
        checkId: 'social_media_screening',
        checkName: 'Social Media Screening',
        reason: 'Standard packages benefit from digital footprint analysis for comprehensive assessment.',
        confidence: 76,
        category: CheckCategory.DIGITAL,
        urgency: 'low',
        estimatedCost: 180,
        estimatedDays: 2
      });
    }
  }

  if (selectedPackage === 'pkg_comprehensive_company' && !selectedChecks.includes('supply_chain_assessment')) {
    if (checkId === 'business_credit_report') {
      suggestions.push({
        id: 'ai_suggest_supply_chain',
        checkId: 'supply_chain_assessment',
        checkName: 'Supply Chain Risk Assessment',
        reason: 'Comprehensive company packages often include supply chain vulnerability analysis.',
        confidence: 88,
        category: CheckCategory.COMPLIANCE,
        urgency: 'medium',
        estimatedCost: 520,
        estimatedDays: 5
      });
    }
  }

  // Filter out suggestions for checks already selected
  return suggestions.filter(suggestion => !selectedChecks.includes(suggestion.checkId));
};

const AISmartSuggestion: React.FC<AISmartSuggestionProps> = ({
  checkId,
  checkName,
  entityType,
  selectedPackage,
  selectedChecks,
  onSuggestionClick,
  className
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);

  useEffect(() => {
    const generatedSuggestions = generateSmartSuggestions(
      checkId,
      checkName,
      entityType,
      selectedPackage,
      selectedChecks
    );
    
    setSuggestions(generatedSuggestions);

    if (generatedSuggestions.length > 0) {
      // Delay appearance for realistic AI processing feel
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, Math.random() * 1000 + 500); // 500-1500ms delay

      return () => clearTimeout(timer);
    }
  }, [checkId, checkName, entityType, selectedPackage, selectedChecks]);

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  const primarySuggestion = suggestions[0];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'var(--neumorphic-severity-critical)';
      case 'medium': return 'var(--neumorphic-severity-high)';
      case 'low': return 'var(--neumorphic-severity-medium)';
      default: return 'var(--neumorphic-accent-primary)';
    }
  };

  const getEntityIcon = (entityType: VettingEntityType) => {
    switch (entityType) {
      case VettingEntityType.INDIVIDUAL: return Users;
      case VettingEntityType.COMPANY: return Building;
      case VettingEntityType.STAFF_MEDICAL: return Stethoscope;
      default: return Shield;
    }
  };

  const EntityIcon = getEntityIcon(entityType);

  return (
    <div className={cn("relative inline-flex items-center", className)}>
      {/* AI Suggestion Icon */}
      <div
        className="relative cursor-pointer group"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => onSuggestionClick?.(primarySuggestion)}
      >
        {/* Glowing Animation */}
        <div 
          className={cn(
            "absolute inset-0 rounded-full transition-all duration-1000",
            isAnimating 
              ? "animate-ping opacity-75" 
              : "opacity-0 group-hover:opacity-50"
          )}
          style={{ 
            backgroundColor: getUrgencyColor(primarySuggestion.urgency),
            boxShadow: `0 0 20px ${getUrgencyColor(primarySuggestion.urgency)}40`
          }}
        />

        {/* Main Icon */}
        <div 
          className={cn(
            "relative w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
            "group-hover:scale-110 group-hover:shadow-lg",
            isAnimating ? "animate-pulse" : ""
          )}
          style={{ 
            backgroundColor: getUrgencyColor(primarySuggestion.urgency),
            boxShadow: `0 0 10px ${getUrgencyColor(primarySuggestion.urgency)}60`
          }}
        >
          <Plus className="w-3 h-3 text-white" />
        </div>

        {/* Sparkle Effects */}
        {isAnimating && (
          <>
            <Sparkles 
              className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400 animate-bounce" 
              style={{ animationDelay: '0.5s' }}
            />
            <Sparkles 
              className="absolute -bottom-1 -left-1 w-2 h-2 text-blue-400 animate-bounce" 
              style={{ animationDelay: '1s' }}
            />
          </>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-80 animate-in fade-in-0 zoom-in-95 duration-200 z-50">
          <div className="bg-neumorphic-card border border-neumorphic-border rounded-lg p-4 shadow-2xl backdrop-blur-sm" style={{ backgroundColor: 'var(--neumorphic-card)', border: '1px solid var(--neumorphic-border)' }}>
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-neumorphic-accent-primary" />
                <NeumorphicText className="font-semibold text-sm">
                  AI Suggestion
                </NeumorphicText>
                <NeumorphicBadge variant="secondary" className="text-xs px-2 py-0.5">
                  {primarySuggestion.confidence}% confident
                </NeumorphicBadge>
              </div>
              <div className="flex items-center space-x-1">
                <EntityIcon className="w-3 h-3 text-neumorphic-text-secondary" />
                <NeumorphicBadge 
                  variant={primarySuggestion.urgency === 'high' ? 'danger' : 
                           primarySuggestion.urgency === 'medium' ? 'warning' : 'default'}
                  className="text-xs"
                >
                  {primarySuggestion.urgency} priority
                </NeumorphicBadge>
              </div>
            </div>

            {/* Suggestion Content */}
            <div className="space-y-3">
              <div>
                <NeumorphicText className="font-medium text-sm mb-1">
                  {primarySuggestion.checkName}
                </NeumorphicText>
                <NeumorphicText variant="secondary" size="sm">
                  {primarySuggestion.reason}
                </NeumorphicText>
              </div>

              {/* Estimated Details */}
              {(primarySuggestion.estimatedCost || primarySuggestion.estimatedDays) && (
                <div className="flex items-center justify-between text-xs pt-2 border-t border-neumorphic-border/20">
                  {primarySuggestion.estimatedCost && (
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3 text-neumorphic-accent-secondary" />
                      <NeumorphicText size="xs" variant="secondary">
                        +R{primarySuggestion.estimatedCost}
                      </NeumorphicText>
                    </div>
                  )}
                  {primarySuggestion.estimatedDays && (
                    <div className="flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3 text-neumorphic-accent-secondary" />
                      <NeumorphicText size="xs" variant="secondary">
                        +{primarySuggestion.estimatedDays} days
                      </NeumorphicText>
                    </div>
                  )}
                </div>
              )}

              {/* Click to Add */}
              <div className="pt-2 border-t border-neumorphic-border/20">
                <NeumorphicText size="xs" variant="secondary" className="text-center">
                  Click to add this suggestion to your selection
                </NeumorphicText>
              </div>
            </div>

            {/* Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-neumorphic-border/30" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AISmartSuggestion;