/**
 * VettingStoryPanel Component - Smart Vetting Canvas
 * 
 * Advanced consent footprint visualization and vetting story generation component
 * for the Smart Vetting Canvas. Provides dynamic narrative text, visual consent
 * requirements, and interactive SVG-based person/building icons with animated
 * data flow connections.
 * 
 * Features:
 * - Consent footprint visualization with SVG animations
 * - Dynamic vetting story generation based on selected checks
 * - Color-coded elements by check type and risk level
 * - Interactive hover effects and detailed tooltips
 * - South African compliance context (POPIA)
 * - Real-time updates when selections change
 * - Mobile responsive design with accessible interactions
 * 
 * @author Claude Code
 * @version 1.0.0
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { VettingEntityType, CheckCategory } from '@/types/vetting';
import { allVettingChecks, VettingCheckDefinition } from '@/lib/sample-data/vettingChecksSample';
import {
  ANIMATION_CLASSES,
  HOVER_ANIMATIONS,
  withConditionalAnimation,
  createStaggerDelay,
} from '@/lib/vetting-animations';
import {
  NeumorphicCard,
  NeumorphicText,
  NeumorphicBadge,
  NeumorphicButton,
  NeumorphicTabs,
} from '@/components/ui/neumorphic';
import {
  User,
  Building,
  Shield,
  FileText,
  Clock,
  AlertTriangle,
  Info,
  Phone,
  Mail,
  FileCheck,
  Lock,
  Users,
  Globe,
  Activity,
  Heart,
  Scale,
  Briefcase,
} from 'lucide-react';

// Type definitions
export interface VettingStoryPanelProps {
  selectedChecks: string[];
  selectedPackage?: string | null;
  entityType: VettingEntityType;
  className?: string;
  onCheckInteraction?: (checkId: string, action: 'view' | 'consent') => void;
  showConsentDetails?: boolean;
  compact?: boolean;
}

interface ConsentRequirement {
  id: string;
  type: 'explicit' | 'implicit' | 'third_party';
  description: string;
  authority: string;
  timeline: string;
  critical: boolean;
}

interface StorySection {
  id: string;
  title: string;
  content: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  category: CheckCategory;
  consentRequired: boolean;
  estimatedDays: number;
}

interface ConsentFootprintData {
  personIcon: boolean;
  buildingIcon: boolean;
  connections: Array<{
    from: string;
    to: string;
    type: CheckCategory;
    animated: boolean;
    critical: boolean;
  }>;
  dataPoints: Array<{
    id: string;
    position: { x: number; y: number };
    category: CheckCategory;
    critical: boolean;
    consentRequired: boolean;
  }>;
}

// Category to icon mapping
const getCategoryIcon = (category: CheckCategory) => {
  const iconMap = {
    [CheckCategory.IDENTITY]: User,
    [CheckCategory.FINANCIAL]: Briefcase,
    [CheckCategory.CRIMINAL]: Shield,
    [CheckCategory.COMPLIANCE]: Scale,
    [CheckCategory.OPERATIONAL]: Activity,
    [CheckCategory.REPUTATIONAL]: Globe,
    [CheckCategory.MEDICAL]: Heart,
    [CheckCategory.BUSINESS_SPECIFIC]: Building,
  };
  return iconMap[category] || FileText;
};

// Category to color mapping
const getCategoryColor = (category: CheckCategory) => {
  const colorMap = {
    [CheckCategory.IDENTITY]: 'var(--neumorphic-accent-primary)',
    [CheckCategory.FINANCIAL]: 'var(--neumorphic-severity-medium)',
    [CheckCategory.CRIMINAL]: 'var(--neumorphic-severity-critical)',
    [CheckCategory.COMPLIANCE]: 'var(--neumorphic-accent-secondary)',
    [CheckCategory.OPERATIONAL]: 'var(--neumorphic-accent-tertiary)',
    [CheckCategory.REPUTATIONAL]: 'var(--neumorphic-text-primary)',
    [CheckCategory.MEDICAL]: 'var(--neumorphic-severity-high)',
    [CheckCategory.BUSINESS_SPECIFIC]: 'var(--neumorphic-accent-primary)',
  };
  return colorMap[category] || 'var(--neumorphic-text-secondary)';
};

// Generate dynamic vetting story
const generateVettingStory = (
  selectedChecks: VettingCheckDefinition[],
  entityType: VettingEntityType
): StorySection[] => {
  const sections: StorySection[] = [];
  
  if (selectedChecks.length === 0) {
    return [{
      id: 'empty',
      title: 'No Checks Selected',
      content: 'Select vetting checks to see your personalized vetting story and consent requirements.',
      riskLevel: 'Low',
      category: CheckCategory.IDENTITY,
      consentRequired: false,
      estimatedDays: 0,
    }];
  }

  // Group checks by category
  const checksByCategory = selectedChecks.reduce((acc, check) => {
    if (!acc[check.category]) acc[check.category] = [];
    acc[check.category].push(check);
    return acc;
  }, {} as Record<CheckCategory, VettingCheckDefinition[]>);

  // Generate story sections for each category
  Object.entries(checksByCategory).forEach(([category, checks]) => {
    const categoryEnum = category as CheckCategory;
    const totalCost = checks.reduce((sum, check) => sum + (check.estimatedCostZAR || 0), 0);
    const maxDays = Math.max(...checks.map(check => check.estimatedTurnaroundDays || 0));
    const hasConsentRequired = checks.some(check => check.consentRequired);
    const highRiskChecks = checks.filter(check => check.riskLevel === 'High');
    
    let storyContent = '';
    let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';

    switch (categoryEnum) {
      case CheckCategory.IDENTITY:
        storyContent = `We'll verify the identity of your ${entityType.toLowerCase()} through ${checks.length} comprehensive check${checks.length > 1 ? 's' : ''}. This includes confirming identity documents, cross-referencing official databases, and ensuring authenticity. ${hasConsentRequired ? 'Explicit consent will be required as per POPIA regulations.' : ''} Expected completion: ${maxDays} business day${maxDays > 1 ? 's' : ''}.`;
        riskLevel = highRiskChecks.length > 0 ? 'High' : 'Low';
        break;
        
      case CheckCategory.FINANCIAL:
        storyContent = `Financial verification will assess creditworthiness and payment history through ${checks.length} specialized check${checks.length > 1 ? 's' : ''}. We'll review credit reports, bank account verification, and financial stability indicators. Total cost: R${totalCost.toLocaleString()}. ${hasConsentRequired ? 'Financial consent authorization required.' : ''}`;
        riskLevel = 'Medium';
        break;
        
      case CheckCategory.CRIMINAL:
        storyContent = `Criminal background screening involves ${checks.length} security check${checks.length > 1 ? 's' : ''} through SAPS databases and court records. This is a critical risk assessment that requires careful handling of sensitive information. ${hasConsentRequired ? 'Mandatory consent and fingerprint authorization required.' : ''} Processing time: ${maxDays} day${maxDays > 1 ? 's' : ''}.`;
        riskLevel = 'High';
        break;
        
      case CheckCategory.COMPLIANCE:
        storyContent = `Compliance verification ensures adherence to South African regulatory requirements through ${checks.length} check${checks.length > 1 ? 's' : ''}. This includes SARS verification, regulatory standing, and statutory compliance. ${hasConsentRequired ? 'Regulatory consent protocols apply.' : ''} Timeline: ${maxDays} business day${maxDays > 1 ? 's' : ''}.`;
        riskLevel = 'Medium';
        break;
        
      case CheckCategory.OPERATIONAL:
        storyContent = `Operational assessment will evaluate business capacity and infrastructure through ${checks.length} comprehensive review${checks.length > 1 ? 's' : ''}. This includes site visits, capacity assessments, and operational readiness verification. Investment: R${totalCost.toLocaleString()}.`;
        riskLevel = 'Medium';
        break;
        
      case CheckCategory.REPUTATIONAL:
        storyContent = `Reputational analysis involves ${checks.length} digital and media screening${checks.length > 1 ? 's' : ''} to assess public perception and online presence. We'll search news archives, social media, and public records. ${hasConsentRequired ? 'Digital privacy consent required.' : ''} Duration: ${maxDays} day${maxDays > 1 ? 's' : ''}.`;
        riskLevel = 'Low';
        break;
        
      case CheckCategory.MEDICAL:
        storyContent = `Medical fitness assessment includes ${checks.length} specialized evaluation${checks.length > 1 ? 's' : ''} for occupational health and safety compliance. This covers physical, psychological, and substance screening as required for mining operations. ${hasConsentRequired ? 'Medical consent and privacy authorization mandatory.' : ''} Processing: ${maxDays} day${maxDays > 1 ? 's' : ''}.`;
        riskLevel = 'High';
        break;
        
      case CheckCategory.BUSINESS_SPECIFIC:
        storyContent = `Business-specific verification involves ${checks.length} specialized check${checks.length > 1 ? 's' : ''} tailored to your industry requirements. This includes professional licenses, certifications, and sector-specific compliance. Cost: R${totalCost.toLocaleString()}.`;
        riskLevel = 'Medium';
        break;
    }

    sections.push({
      id: categoryEnum,
      title: `${categoryEnum} Verification`,
      content: storyContent,
      riskLevel,
      category: categoryEnum,
      consentRequired: hasConsentRequired,
      estimatedDays: maxDays,
    });
  });

  return sections;
};

// Generate consent footprint visualization data
const generateConsentFootprint = (
  selectedChecks: VettingCheckDefinition[],
  entityType: VettingEntityType
): ConsentFootprintData => {
  const personIcon = entityType === VettingEntityType.INDIVIDUAL || entityType === VettingEntityType.STAFF_MEDICAL;
  const buildingIcon = entityType === VettingEntityType.COMPANY || selectedChecks.some(check => 
    check.category === CheckCategory.BUSINESS_SPECIFIC || check.category === CheckCategory.OPERATIONAL
  );

  const connections: ConsentFootprintData['connections'] = [];
  const dataPoints: ConsentFootprintData['dataPoints'] = [];

  // Generate data points for each check
  selectedChecks.forEach((check, index) => {
    const angle = (index / selectedChecks.length) * 2 * Math.PI;
    const radius = 120;
    const centerX = 200;
    const centerY = 150;
    
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    dataPoints.push({
      id: check.id,
      position: { x, y },
      category: check.category,
      critical: check.riskLevel === 'High',
      consentRequired: check.consentRequired,
    });

    // Generate connections
    if (check.consentRequired) {
      connections.push({
        from: personIcon ? 'person' : 'building',
        to: check.id,
        type: check.category,
        animated: true,
        critical: check.riskLevel === 'High',
      });
    }
  });

  return {
    personIcon,
    buildingIcon,
    connections,
    dataPoints,
  };
};

// Generate consent requirements
const generateConsentRequirements = (selectedChecks: VettingCheckDefinition[]): ConsentRequirement[] => {
  const requirements: ConsentRequirement[] = [];
  
  const consentChecks = selectedChecks.filter(check => check.consentRequired);
  
  if (consentChecks.length === 0) return requirements;

  // Group by provider for consent optimization
  const providerGroups = consentChecks.reduce((acc, check) => {
    const provider = check.provider || 'Unknown';
    if (!acc[provider]) acc[provider] = [];
    acc[provider].push(check);
    return acc;
  }, {} as Record<string, VettingCheckDefinition[]>);

  Object.entries(providerGroups).forEach(([provider, checks]) => {
    const hasHighRisk = checks.some(check => check.riskLevel === 'High');
    const categories = [...new Set(checks.map(check => check.category))];
    
    requirements.push({
      id: `consent-${provider.toLowerCase().replace(/\s+/g, '-')}`,
      type: hasHighRisk ? 'explicit' : 'implicit',
      description: `Consent required for ${checks.length} check${checks.length > 1 ? 's' : ''} across ${categories.length} categor${categories.length > 1 ? 'ies' : 'y'} with ${provider}`,
      authority: provider,
      timeline: `Before ${Math.min(...checks.map(check => check.estimatedTurnaroundDays || 1))} day${Math.min(...checks.map(check => check.estimatedTurnaroundDays || 1)) > 1 ? 's' : ''}`,
      critical: hasHighRisk,
    });
  });

  return requirements;
};

// SVG Animation Component
const ConsentFootprintSVG: React.FC<{
  data: ConsentFootprintData;
  isVisible: boolean;
  onDataPointClick: (pointId: string) => void;
}> = ({ data, isVisible, onDataPointClick }) => {
  return (
    <div className="w-full h-80 flex items-center justify-center">
      <svg
        width="400"
        height="300"
        viewBox="0 0 400 300"
        className="max-w-full h-auto"
      >
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="consentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--neumorphic-accent-primary)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--neumorphic-accent-secondary)" stopOpacity="0.8" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background connections */}
        {data.connections.map((connection, index) => {
          const startPoint = data.personIcon ? { x: 100, y: 150 } : { x: 100, y: 150 };
          const endPoint = data.dataPoints.find(point => point.id === connection.to);
          
          if (!endPoint) return null;

          return (
            <g key={`connection-${index}`}>
              <line
                x1={startPoint.x}
                y1={startPoint.y}
                x2={endPoint.position.x}
                y2={endPoint.position.y}
                stroke={getCategoryColor(connection.type)}
                strokeWidth={connection.critical ? 3 : 2}
                strokeDasharray={connection.animated ? "5,5" : "none"}
                opacity={0.6}
                className={cn(
                  "transition-all duration-500",
                  withConditionalAnimation(
                    connection.animated ? "animate-pulse" : "",
                    isVisible
                  )
                )}
                style={{
                  animationDelay: `${createStaggerDelay(index, 200)}ms`,
                }}
              />
              {/* Data flow particles */}
              {connection.animated && (
                <circle
                  r="3"
                  fill={getCategoryColor(connection.type)}
                  opacity="0.8"
                  filter="url(#glow)"
                >
                  <animateMotion
                    dur={`${2 + index * 0.5}s`}
                    repeatCount="indefinite"
                    path={`M ${startPoint.x} ${startPoint.y} L ${endPoint.position.x} ${endPoint.position.y}`}
                  />
                </circle>
              )}
            </g>
          );
        })}

        {/* Central entity icon */}
        <g transform="translate(100, 150)">
          <circle
            cx="0"
            cy="0"
            r="25"
            fill="url(#consentGradient)"
            className={cn(
              "transition-all duration-500",
              withConditionalAnimation(ANIMATION_CLASSES.scaleIn, isVisible)
            )}
          />
          {data.personIcon ? (
            <User
              size={24}
              className="text-white"
              style={{
                transform: 'translate(-12px, -12px)',
              }}
            />
          ) : (
            <Building
              size={24}
              className="text-white"
              style={{
                transform: 'translate(-12px, -12px)',
              }}
            />
          )}
        </g>

        {/* Data points */}
        {data.dataPoints.map((point, index) => {
          const IconComponent = getCategoryIcon(point.category);
          
          return (
            <g
              key={point.id}
              transform={`translate(${point.position.x}, ${point.position.y})`}
              className="cursor-pointer group"
              onClick={() => onDataPointClick(point.id)}
            >
              <circle
                cx="0"
                cy="0"
                r={point.critical ? 18 : 15}
                fill={getCategoryColor(point.category)}
                opacity="0.2"
                className={cn(
                  "transition-all duration-300 group-hover:opacity-40",
                  withConditionalAnimation(ANIMATION_CLASSES.scaleIn, isVisible)
                )}
                style={{
                  animationDelay: `${createStaggerDelay(index, 150)}ms`,
                }}
              />
              <circle
                cx="0"
                cy="0"
                r={point.critical ? 12 : 10}
                fill={getCategoryColor(point.category)}
                className={cn(
                  "transition-all duration-300 group-hover:scale-110",
                  withConditionalAnimation(ANIMATION_CLASSES.fadeIn, isVisible)
                )}
                style={{
                  animationDelay: `${createStaggerDelay(index, 100)}ms`,
                }}
              />
              <foreignObject
                x={point.critical ? -8 : -6}
                y={point.critical ? -8 : -6}
                width={point.critical ? 16 : 12}
                height={point.critical ? 16 : 12}
              >
                <IconComponent
                  size={point.critical ? 16 : 12}
                  className="text-white"
                />
              </foreignObject>
              
              {/* Consent indicator */}
              {point.consentRequired && (
                <circle
                  cx="8"
                  cy="-8"
                  r="4"
                  fill="var(--neumorphic-severity-high)"
                  className={cn(
                    "transition-all duration-300",
                    withConditionalAnimation(ANIMATION_CLASSES.pulse, isVisible)
                  )}
                />
              )}
            </g>
          );
        })}

        {/* Legend */}
        <g transform="translate(320, 20)">
          <rect
            x="0"
            y="0"
            width="70"
            height="60"
            fill="var(--neumorphic-card)"
            stroke="var(--neumorphic-border)"
            strokeWidth="1"
            rx="8"
            opacity="0.9"
          />
          <text x="35" y="15" textAnchor="middle" className="text-xs font-medium fill-current text-neumorphic-text-primary">
            Legend
          </text>
          <circle cx="10" cy="25" r="3" fill="var(--neumorphic-severity-high)" />
          <text x="18" y="29" className="text-xs fill-current text-neumorphic-text-secondary">
            Consent
          </text>
          <circle cx="10" cy="40" r="3" fill="var(--neumorphic-accent-primary)" />
          <text x="18" y="44" className="text-xs fill-current text-neumorphic-text-secondary">
            Standard
          </text>
        </g>
      </svg>
    </div>
  );
};

// Main component
export const VettingStoryPanel: React.FC<VettingStoryPanelProps> = ({
  selectedChecks,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  selectedPackage,
  entityType,
  className,
  onCheckInteraction,
  showConsentDetails = true,
  compact = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('story');
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  // Get selected check definitions
  const selectedCheckDefinitions = useMemo(() => {
    return allVettingChecks.filter(check => selectedChecks.includes(check.id));
  }, [selectedChecks]);

  // Generate story sections
  const storySections = useMemo(() => {
    return generateVettingStory(selectedCheckDefinitions, entityType);
  }, [selectedCheckDefinitions, entityType]);

  // Generate consent footprint
  const consentFootprint = useMemo(() => {
    return generateConsentFootprint(selectedCheckDefinitions, entityType);
  }, [selectedCheckDefinitions, entityType]);

  // Generate consent requirements
  const consentRequirements = useMemo(() => {
    return generateConsentRequirements(selectedCheckDefinitions);
  }, [selectedCheckDefinitions]);

  // Animation trigger
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Handle data point interaction
  const handleDataPointClick = (pointId: string) => {
    onCheckInteraction?.(pointId, 'view');
  };

  const handleConsentAction = (checkId: string) => {
    onCheckInteraction?.(checkId, 'consent');
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Story Panel */}
      <NeumorphicCard 
        className={cn(
          "relative overflow-hidden",
          withConditionalAnimation(ANIMATION_CLASSES.fadeInUp, isVisible),
          !compact && "p-6",
          compact && "p-4"
        )}
        style={withConditionalAnimation(HOVER_ANIMATIONS.card)}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-neumorphic-accent-primary" />
            <NeumorphicText className="font-medium text-lg">
              Your Vetting Story
            </NeumorphicText>
          </div>
          <div className="flex items-center space-x-2">
            {consentRequirements.length > 0 && (
              <NeumorphicBadge variant="warning" className="text-xs">
                <Lock className="w-3 h-3 mr-1" />
                {consentRequirements.length} Consent{consentRequirements.length > 1 ? 's' : ''}
              </NeumorphicBadge>
            )}
            <NeumorphicBadge variant="info" className="text-xs">
              {selectedCheckDefinitions.length} Check{selectedCheckDefinitions.length > 1 ? 's' : ''}
            </NeumorphicBadge>
          </div>
        </div>

        {/* Tabs */}
        <NeumorphicTabs value={activeTab} onValueChange={setActiveTab}>
          <NeumorphicTabs.List>
            <NeumorphicTabs.Trigger value="story">
              <FileText className="w-4 h-4 mr-2" />
              Story
            </NeumorphicTabs.Trigger>
            <NeumorphicTabs.Trigger value="consent">
              <Shield className="w-4 h-4 mr-2" />
              Consent Map
            </NeumorphicTabs.Trigger>
            {showConsentDetails && (
              <NeumorphicTabs.Trigger value="details">
                <Info className="w-4 h-4 mr-2" />
                Details
              </NeumorphicTabs.Trigger>
            )}
          </NeumorphicTabs.List>

          {/* Story Tab */}
          <NeumorphicTabs.Content value="story">
            <div className="space-y-4">
              {storySections.map((section, index) => {
                const IconComponent = getCategoryIcon(section.category);
                
                return (
                  <div
                    key={section.id}
                    className={cn(
                      "p-4 rounded-lg border border-neumorphic-border/20 transition-all duration-300",
                      "hover:border-neumorphic-border/40 hover:shadow-neumorphic-convex-sm",
                      hoveredSection === section.id && "bg-neumorphic-button/10",
                      withConditionalAnimation(ANIMATION_CLASSES.slideInLeft, isVisible)
                    )}
                    style={{
                      animationDelay: `${createStaggerDelay(index, 150)}ms`,
                    }}
                    onMouseEnter={() => setHoveredSection(section.id)}
                    onMouseLeave={() => setHoveredSection(null)}
                  >
                    <div className="flex items-start space-x-3">
                      <div 
                        className="p-2 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: `${getCategoryColor(section.category)}20`,
                        }}
                      >
                        <IconComponent 
                          className="w-4 h-4"
                          style={{ color: getCategoryColor(section.category) }}
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <NeumorphicText className="font-medium">
                            {section.title}
                          </NeumorphicText>
                          <div className="flex items-center space-x-2">
                            <NeumorphicBadge 
                              variant={
                                section.riskLevel === 'High' ? 'danger' :
                                section.riskLevel === 'Medium' ? 'warning' : 'success'
                              }
                              className="text-xs"
                            >
                              {section.riskLevel} Risk
                            </NeumorphicBadge>
                            {section.consentRequired && (
                              <Lock className="w-3 h-3 text-neumorphic-severity-high" />
                            )}
                          </div>
                        </div>
                        <NeumorphicText variant="secondary" size="sm">
                          {section.content}
                        </NeumorphicText>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-xs text-neumorphic-text-secondary">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{section.estimatedDays} day{section.estimatedDays > 1 ? 's' : ''}</span>
                            </span>
                          </div>
                          {section.consentRequired && (
                            <NeumorphicButton
                              size="sm"
                              onClick={() => {
                                const sectionChecks = selectedCheckDefinitions.filter(
                                  check => check.category === section.category
                                );
                                sectionChecks.forEach(check => handleConsentAction(check.id));
                              }}
                              className="text-xs"
                            >
                              <FileCheck className="w-3 h-3 mr-1" />
                              Review Consent
                            </NeumorphicButton>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </NeumorphicTabs.Content>

          {/* Consent Map Tab */}
          <NeumorphicTabs.Content value="consent">
            <div className="space-y-4">
              <div className="text-center">
                <NeumorphicText variant="secondary" size="sm" className="mb-4">
                  Interactive consent footprint showing data flow and authorization requirements
                </NeumorphicText>
              </div>
              
              <ConsentFootprintSVG
                data={consentFootprint}
                isVisible={isVisible}
                onDataPointClick={handleDataPointClick}
              />

              {/* Consent Requirements Summary */}
              {consentRequirements.length > 0 && (
                <div className="space-y-3">
                  <NeumorphicText className="font-medium flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-neumorphic-accent-primary" />
                    Consent Requirements Summary
                  </NeumorphicText>
                  
                  {consentRequirements.map((requirement, index) => (
                    <div
                      key={requirement.id}
                      className={cn(
                        "p-3 rounded-lg bg-neumorphic-button/20 border border-neumorphic-border/10",
                        requirement.critical && "border-neumorphic-severity-high/30",
                        withConditionalAnimation(ANIMATION_CLASSES.slideInRight, isVisible)
                      )}
                      style={{
                        animationDelay: `${createStaggerDelay(index, 100)}ms`,
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <NeumorphicBadge
                              variant={requirement.type === 'explicit' ? 'danger' : 'warning'}
                              className="text-xs"
                            >
                              {requirement.type.replace('_', ' ').toUpperCase()}
                            </NeumorphicBadge>
                            {requirement.critical && (
                              <AlertTriangle className="w-3 h-3 text-neumorphic-severity-high" />
                            )}
                          </div>
                          <NeumorphicText size="sm" className="font-medium mb-1">
                            {requirement.description}
                          </NeumorphicText>
                          <div className="flex items-center space-x-4 text-xs text-neumorphic-text-secondary">
                            <span className="flex items-center space-x-1">
                              <Building className="w-3 h-3" />
                              <span>{requirement.authority}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{requirement.timeline}</span>
                            </span>
                          </div>
                        </div>
                        <NeumorphicButton
                          size="sm"
                          onClick={() => {
                            // Handle consent management
                            console.log('Manage consent for:', requirement.id);
                          }}
                          className="text-xs ml-3"
                        >
                          <Lock className="w-3 h-3 mr-1" />
                          Manage
                        </NeumorphicButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </NeumorphicTabs.Content>

          {/* Details Tab */}
          {showConsentDetails && (
            <NeumorphicTabs.Content value="details">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* POPIA Compliance */}
                  <div className="p-4 rounded-lg bg-neumorphic-button/10 border border-neumorphic-border/20">
                    <NeumorphicText className="font-medium flex items-center mb-2">
                      <Scale className="w-4 h-4 mr-2 text-neumorphic-accent-primary" />
                      POPIA Compliance
                    </NeumorphicText>
                    <NeumorphicText variant="secondary" size="sm">
                      All selected checks comply with the Protection of Personal Information Act (POPIA). 
                      Explicit consent is required for {selectedCheckDefinitions.filter(c => c.consentRequired).length} checks 
                      involving personal information processing.
                    </NeumorphicText>
                  </div>

                  {/* Data Security */}
                  <div className="p-4 rounded-lg bg-neumorphic-button/10 border border-neumorphic-border/20">
                    <NeumorphicText className="font-medium flex items-center mb-2">
                      <Lock className="w-4 h-4 mr-2 text-neumorphic-accent-secondary" />
                      Data Security
                    </NeumorphicText>
                    <NeumorphicText variant="secondary" size="sm">
                      All data transmission is encrypted using industry-standard protocols. 
                      Information is processed only by authorized personnel and stored securely 
                      in compliance with South African data protection regulations.
                    </NeumorphicText>
                  </div>
                </div>

                {/* Contact Methods */}
                <div className="p-4 rounded-lg bg-neumorphic-button/10 border border-neumorphic-border/20">
                  <NeumorphicText className="font-medium flex items-center mb-3">
                    <Users className="w-4 h-4 mr-2 text-neumorphic-accent-primary" />
                    Consent Communication Methods
                  </NeumorphicText>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-neumorphic-text-secondary" />
                      <NeumorphicText size="sm">SMS Authorization</NeumorphicText>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-neumorphic-text-secondary" />
                      <NeumorphicText size="sm">Email Consent</NeumorphicText>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileCheck className="w-4 h-4 text-neumorphic-text-secondary" />
                      <NeumorphicText size="sm">Digital Signature</NeumorphicText>
                    </div>
                  </div>
                </div>

                {/* Risk Assessment Summary */}
                <div className="p-4 rounded-lg bg-neumorphic-button/10 border border-neumorphic-border/20">
                  <NeumorphicText className="font-medium flex items-center mb-3">
                    <Activity className="w-4 h-4 mr-2 text-neumorphic-accent-primary" />
                    Risk Assessment Summary
                  </NeumorphicText>
                  <div className="grid grid-cols-3 gap-4">
                    {(['Low', 'Medium', 'High'] as const).map(level => {
                      const count = selectedCheckDefinitions.filter(check => check.riskLevel === level).length;
                      const color = level === 'High' ? 'var(--neumorphic-severity-critical)' :
                                   level === 'Medium' ? 'var(--neumorphic-severity-high)' :
                                   'var(--neumorphic-severity-low)';
                      
                      return (
                        <div key={level} className="text-center">
                          <div 
                            className="text-2xl font-bold mb-1"
                            style={{ color }}
                          >
                            {count}
                          </div>
                          <NeumorphicText variant="secondary" size="sm">
                            {level} Risk
                          </NeumorphicText>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </NeumorphicTabs.Content>
          )}
        </NeumorphicTabs>
      </NeumorphicCard>
    </div>
  );
};

export default VettingStoryPanel;