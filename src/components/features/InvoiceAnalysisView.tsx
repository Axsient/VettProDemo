"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { NeumorphicCard, NeumorphicHeading, NeumorphicText } from '../ui/neumorphic';
import FlagBadge from '../ui/FlagBadge';
import { DNALink } from './DNALink';

// Sample data for a single invoice - you'd pass this in as props
const sampleAnalysisData = {
  rfpItems: [
    { label: "Drill Bits (x50)", value: "R1,500 / unit" },
    { label: "Safety Gloves (x100)", value: "R50 / pair" },
    { label: "Logistics", value: "R5,000" }
  ],
  invoiceItems: [
    { label: "Drill Bits (x50)", value: "R1,875 / unit" },
    { label: "Safety Gloves (x100)", value: "R50 / pair" },
    { label: "Logistics", value: "R5,000" },
    { label: "Admin Fee", value: "R2,500" }
  ],
  llmSummary: "Invoice contains a significant price discrepancy for 'Drill Bits' (25% over quote) and an unsolicited 'Admin Fee'.",
  flags: [
    { severity: 'High', type: 'Price Discrepancy' },
    { severity: 'Medium', type: 'Unsolicited Item' }
  ]
};

export const InvoiceAnalysisView = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      {/* Left Column: DNA View */}
      <NeumorphicCard className="lg:col-span-3 p-4">
        <NeumorphicHeading>Invoice DNA Comparison</NeumorphicHeading>
        <div className="mt-4">
          <DNALink rfpLabel="Drill Bits (x50)" rfpValue="R1,500 / unit" invoiceLabel="Drill Bits (x50)" invoiceValue="R1,875 / unit" status="mismatch" />
          <DNALink rfpLabel="Safety Gloves (x100)" rfpValue="R50 / pair" invoiceLabel="Safety Gloves (x100)" invoiceValue="R50 / pair" status="match" />
          <DNALink rfpLabel="Logistics" rfpValue="R5,000" invoiceLabel="Logistics" invoiceValue="R5,000" status="match" />
          <DNALink rfpLabel="-" invoiceLabel="Admin Fee" invoiceValue="R2,500" status="unsolicited_invoice" />
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
          <NeumorphicHeading>AI Insights</NeumorphicHeading>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm font-semibold text-neumorphic-text-secondary mb-1">Summary</p>
              <NeumorphicText>{sampleAnalysisData.llmSummary}</NeumorphicText>
            </div>
            <div>
              <p className="text-sm font-semibold text-neumorphic-text-secondary mb-2">Flags Detected</p>
              <div className="flex flex-wrap gap-2">
                {sampleAnalysisData.flags.map((flag, i) => (
                  <FlagBadge key={i} severity={flag.severity as 'Critical' | 'High' | 'Medium' | 'Low'}>{flag.type}</FlagBadge>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-[var(--neumorphic-border)] border-opacity-20">
              <p className="text-sm font-semibold text-neumorphic-text-secondary mb-1">Recommendation</p>
              <NeumorphicText size="lg" className="font-bold text-[var(--neumorphic-severity-critical)]">
                REJECT & ESCALATE
              </NeumorphicText>
            </div>
          </div>
        </NeumorphicCard>
      </motion.div>
    </div>
  );
}; 