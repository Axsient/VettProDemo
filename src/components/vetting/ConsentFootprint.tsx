'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { NeumorphicText } from '@/components/ui/neumorphic';
import { VettingCheckDefinition, VettingEntityType, CheckCategory } from '@/types/vetting';

interface ConsentFootprintProps {
  selectedChecks: VettingCheckDefinition[];
  entityType: VettingEntityType | '';
}

export function ConsentFootprint({ selectedChecks, entityType }: ConsentFootprintProps) {
  // Analyze check categories to determine what gets "lit up"
  const checkAnalysis = useMemo(() => {
    const categories = {
      hasIdentityCheck: false,
      hasCriminalCheck: false,
      hasFinancialCheck: false,
      hasEducationCheck: false,
      hasMedicalCheck: false,
      hasReferenceCheck: false,
      hasComplianceCheck: false
    };

    selectedChecks.forEach(check => {
      switch (check.category) {
        case CheckCategory.IDENTITY:
          categories.hasIdentityCheck = true;
          if (check.name.toLowerCase().includes('education')) {
            categories.hasEducationCheck = true;
          }
          if (check.name.toLowerCase().includes('employment') || check.name.toLowerCase().includes('reference')) {
            categories.hasReferenceCheck = true;
          }
          break;
        case CheckCategory.CRIMINAL:
          categories.hasCriminalCheck = true;
          break;
        case CheckCategory.FINANCIAL:
          categories.hasFinancialCheck = true;
          break;
        case CheckCategory.MEDICAL:
          categories.hasMedicalCheck = true;
          break;
        case CheckCategory.COMPLIANCE:
          categories.hasComplianceCheck = true;
          break;
      }
    });

    return categories;
  }, [selectedChecks]);

  // Generate narrative based on selected checks
  const vettingNarrative = useMemo(() => {
    if (selectedChecks.length === 0) {
      return {
        title: "No Intelligence Operation Configured",
        story: "Select vetting checks to see your intelligence gathering narrative unfold.",
        status: "standby"
      };
    }

    const { hasIdentityCheck, hasCriminalCheck, hasFinancialCheck, hasMedicalCheck, hasComplianceCheck } = checkAnalysis;
    const entityName = entityType === VettingEntityType.COMPANY ? "target organization" : "subject";
    
    let story = `Intelligence operation targeting ${entityName} initiated. `;
    const operations: string[] = [];

    if (hasIdentityCheck) {
      operations.push("Identity verification protocols activated");
    }
    if (hasCriminalCheck) {
      operations.push("Criminal intelligence networks engaged");  
    }
    if (hasFinancialCheck) {
      operations.push("Financial intelligence gathering commenced");
    }
    if (hasMedicalCheck) {
      operations.push("Medical clearance protocols deployed");
    }
    if (hasComplianceCheck) {
      operations.push("Regulatory compliance sweeps initiated");
    }

    story += operations.join(". ") + ". ";
    
    const riskLevel = selectedChecks.some(c => c.riskLevel === 'High') ? 'HIGH' : 
                     selectedChecks.some(c => c.riskLevel === 'Medium') ? 'MEDIUM' : 'LOW';
    
    story += `Operation classified as ${riskLevel} sensitivity. `;
    story += `${selectedChecks.length} intelligence module${selectedChecks.length !== 1 ? 's' : ''} deployed. `;
    story += "Consent protocols will be transmitted to subject upon mission authorization.";

    return {
      title: `Operation: ${entityType?.replace('_', ' ').toUpperCase() || 'UNKNOWN'} VETTING`,
      story,
      status: "active"
    };
  }, [selectedChecks, checkAnalysis, entityType]);

  // Animation variants
  const iconVariants = {
    inactive: { 
      fill: 'var(--neumorphic-card-end)',
      scale: 0.9,
      transition: { duration: 0.3 }
    },
    active: { 
      fill: 'var(--neumorphic-severity-medium)',
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Footprint */}
      <div className="relative">
        <NeumorphicText className="font-medium mb-4">Intelligence Footprint</NeumorphicText>
        
        <div className="flex justify-center space-x-8 mb-6">
          {/* Person/Individual Icon */}
          {(entityType === VettingEntityType.INDIVIDUAL || entityType === VettingEntityType.STAFF_MEDICAL) && (
            <motion.div
              className="relative"
              variants={checkAnalysis.hasIdentityCheck ? pulseVariants : {}}
              animate={checkAnalysis.hasIdentityCheck ? "pulse" : ""}
            >
              <motion.svg
                width="60"
                height="60"
                viewBox="0 0 24 24"
                className="drop-shadow-lg"
                variants={iconVariants}
                animate={checkAnalysis.hasIdentityCheck || checkAnalysis.hasCriminalCheck ? "active" : "inactive"}
              >
                {/* Person silhouette */}
                <motion.path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  variants={iconVariants}
                />
                {/* Scan lines overlay */}
                {(checkAnalysis.hasIdentityCheck || checkAnalysis.hasCriminalCheck) && (
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.7, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <line x1="2" y1="8" x2="22" y2="8" stroke="var(--neumorphic-accent)" strokeWidth="0.5" />
                    <line x1="2" y1="12" x2="22" y2="12" stroke="var(--neumorphic-accent)" strokeWidth="0.5" />
                    <line x1="2" y1="16" x2="22" y2="16" stroke="var(--neumorphic-accent)" strokeWidth="0.5" />
                  </motion.g>
                )}
              </motion.svg>
              {/* Status indicators */}
              {checkAnalysis.hasIdentityCheck && (
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                />
              )}
              {checkAnalysis.hasCriminalCheck && (
                <motion.div
                  className="absolute -bottom-1 -left-1 w-3 h-3 bg-red-500 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                />
              )}
            </motion.div>
          )}

          {/* Building/Company Icon */}
          {entityType === VettingEntityType.COMPANY && (
            <motion.div
              className="relative"
              variants={checkAnalysis.hasComplianceCheck ? pulseVariants : {}}
              animate={checkAnalysis.hasComplianceCheck ? "pulse" : ""}
            >
              <motion.svg
                width="60"
                height="60"
                viewBox="0 0 24 24"
                className="drop-shadow-lg"
                variants={iconVariants}
                animate={checkAnalysis.hasComplianceCheck || checkAnalysis.hasFinancialCheck ? "active" : "inactive"}
              >
                {/* Building silhouette */}
                <motion.path
                  d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"
                  variants={iconVariants}
                />
                {/* Scan grid overlay */}
                {(checkAnalysis.hasComplianceCheck || checkAnalysis.hasFinancialCheck) && (
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <rect x="4" y="5" width="2" height="2" fill="var(--neumorphic-accent)" opacity="0.6" />
                    <rect x="4" y="9" width="2" height="2" fill="var(--neumorphic-accent)" opacity="0.6" />
                    <rect x="8" y="5" width="2" height="2" fill="var(--neumorphic-accent)" opacity="0.6" />
                    <rect x="14" y="11" width="2" height="2" fill="var(--neumorphic-accent)" opacity="0.6" />
                    <rect x="18" y="11" width="2" height="2" fill="var(--neumorphic-accent)" opacity="0.6" />
                  </motion.g>
                )}
              </motion.svg>
              {/* Status indicators */}
              {checkAnalysis.hasComplianceCheck && (
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                />
              )}
              {checkAnalysis.hasFinancialCheck && (
                <motion.div
                  className="absolute -bottom-1 -left-1 w-3 h-3 bg-green-500 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                />
              )}
            </motion.div>
          )}
        </div>

        {/* Connection Lines */}
        {selectedChecks.length > 0 && (
          <motion.div
            className="flex justify-center mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <svg width="100" height="20" className="opacity-60">
              <motion.line
                x1="10" y1="10" x2="90" y2="10"
                stroke="var(--neumorphic-accent)"
                strokeWidth="1"
                strokeDasharray="5,5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            </svg>
          </motion.div>
        )}

        {/* Check Category Indicators */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {Object.entries({
            'Identity Verified': checkAnalysis.hasIdentityCheck,
            'Criminal Cleared': checkAnalysis.hasCriminalCheck,
            'Financial Vetted': checkAnalysis.hasFinancialCheck,
            'Medical Cleared': checkAnalysis.hasMedicalCheck,
            'Compliance Met': checkAnalysis.hasComplianceCheck,
            'References Checked': checkAnalysis.hasReferenceCheck
          }).map(([label, active]) => (
            <motion.div
              key={label}
              className={`flex items-center space-x-2 p-2 rounded transition-all ${
                active ? 'bg-neumorphic-button/20 text-neumorphic-text-primary' : 'text-neumorphic-text-secondary'
              }`}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: active ? 1 : 0.3 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className={`w-2 h-2 rounded-full ${
                  active ? 'bg-green-400' : 'bg-neumorphic-border'
                }`}
                animate={{ scale: active ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.5, repeat: active ? Infinity : 0, repeatDelay: 2 }}
              />
              <NeumorphicText size="sm">{label}</NeumorphicText>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mission Narrative */}
      <div className="space-y-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <NeumorphicText className="font-medium text-center mb-2">
            {vettingNarrative.title}
          </NeumorphicText>
          <div className={`p-4 rounded-lg border-l-4 ${
            vettingNarrative.status === 'active' 
              ? 'bg-blue-500/10 border-blue-500' 
              : 'bg-neumorphic-button/10 border-neumorphic-border'
          }`}>
            <NeumorphicText variant="secondary" size="sm" className="leading-relaxed">
              {vettingNarrative.story}
            </NeumorphicText>
          </div>
        </motion.div>

        {/* Mission Stats */}
        {selectedChecks.length > 0 && (
          <motion.div
            className="grid grid-cols-3 gap-2 text-center text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="space-y-1">
              <div className="text-blue-400 font-semibold">{selectedChecks.length}</div>
              <NeumorphicText variant="secondary" size="sm">Modules</NeumorphicText>
            </div>
            <div className="space-y-1">
              <div className="text-green-400 font-semibold">
                {selectedChecks.filter(c => c.consentRequired).length}
              </div>
              <NeumorphicText variant="secondary" size="sm">Consent Req.</NeumorphicText>
            </div>
            <div className="space-y-1">
              <div className="text-purple-400 font-semibold">
                {[...new Set(selectedChecks.map(c => c.provider))].length}
              </div>
              <NeumorphicText variant="secondary" size="sm">Providers</NeumorphicText>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}