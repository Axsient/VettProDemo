"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import { NeumorphicCard, NeumorphicHeading, NeumorphicText } from '../ui/neumorphic';
import FlagBadge from '../ui/FlagBadge';
import { DNALink } from './DNALink';
import { InvoiceAnalysis, InvoiceFlag } from '@/types/rfp';
import { DNAComparisonItem } from '@/lib/sample-data/rfpSample';

interface InvoiceAnalysisViewProps {
  rfpTitle: string;
  dnaItems: DNAComparisonItem[];
  analysis: InvoiceAnalysis;
}

export const InvoiceAnalysisView: React.FC<InvoiceAnalysisViewProps> = ({ 
  rfpTitle, 
  dnaItems, 
  analysis 
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      {/* Left Column: DNA View */}
      <NeumorphicCard className="lg:col-span-3 p-4">
        <NeumorphicHeading>Invoice DNA Comparison</NeumorphicHeading>
        <NeumorphicText className="text-sm text-neumorphic-text-secondary mb-4">
          Comparing: {rfpTitle}
        </NeumorphicText>
        <div className="mt-4">
          {dnaItems.map((item, index) => (
            <DNALink 
              key={index}
              rfpLabel={item.rfpLabel || '-'} 
              rfpValue={item.rfpValue} 
              invoiceLabel={item.invoiceLabel || '-'} 
              invoiceValue={item.invoiceValue} 
              status={item.status === 'rfp_only' ? 'unsolicited_rfp' : item.status as 'match' | 'mismatch' | 'unsolicited_rfp' | 'unsolicited_invoice'} 
            />
          ))}
        </div>
      </NeumorphicCard>

      {/* Right Column: LLM Insights */}
      <motion.div
        className="lg:col-span-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <NeumorphicCard className="p-4 border-[var(--neumorphic-severity-low)] h-full">
          <NeumorphicHeading className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            AI Insights
          </NeumorphicHeading>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm font-semibold text-neumorphic-text-secondary mb-1">Summary</p>
              <NeumorphicText>{analysis.llmSummary}</NeumorphicText>
            </div>
            <div>
              <p className="text-sm font-semibold text-neumorphic-text-secondary mb-2">Flags Detected</p>
              <div className="flex flex-wrap gap-2">
                {analysis.flags.map((flag: InvoiceFlag, i: number) => (
                  <FlagBadge key={i} severity={flag.severity}>{flag.type}</FlagBadge>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-[var(--neumorphic-border)] border-opacity-20">
              <p className="text-sm font-semibold text-neumorphic-text-secondary mb-1">Recommendation</p>
              <NeumorphicText size="lg" className={`font-bold ${
                analysis.llmRecommendation === 'Reject & Escalate' ? 'text-[var(--neumorphic-severity-critical)]' :
                analysis.llmRecommendation === 'Query Supplier' ? 'text-[var(--neumorphic-severity-high)]' :
                analysis.llmRecommendation === 'Approve with Adjustment' ? 'text-[var(--neumorphic-severity-medium)]' :
                'text-[var(--neumorphic-severity-low)]'
              }`}>
                {analysis.llmRecommendation.toUpperCase()}
              </NeumorphicText>
            </div>
          </div>
        </NeumorphicCard>
      </motion.div>
    </div>
  );
}; 