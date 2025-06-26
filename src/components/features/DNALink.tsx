"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type DNAStatus = 'match' | 'mismatch' | 'unsolicited_rfp' | 'unsolicited_invoice';

interface DNALinkProps {
  rfpLabel: string;
  rfpValue?: string;
  invoiceLabel: string;
  invoiceValue?: string;
  status: DNAStatus;
}

export const DNALink: React.FC<DNALinkProps> = ({ rfpLabel, rfpValue, invoiceLabel, invoiceValue, status }) => {
  const statusConfig = {
    match: {
      lineColor: 'var(--neumorphic-severity-low)', // Use low severity color (green)
      glowColor: 'var(--neumorphic-severity-low)',
      glow: false,
    },
    mismatch: {
      lineColor: 'var(--neumorphic-severity-high)', // Use high severity color (orange)
      glowColor: 'var(--neumorphic-severity-high)',
      glow: true,
    },
    unsolicited_rfp: {
      lineColor: 'transparent',
      glowColor: 'var(--neumorphic-severity-critical)', // Red glow for unsolicited
      glow: false,
    },
    unsolicited_invoice: {
      lineColor: 'transparent',
      glowColor: 'var(--neumorphic-severity-critical)', // Red glow for unsolicited
      glow: true,
    },
  };

  const config = statusConfig[status];

  return (
    <div className="relative flex items-center justify-between my-3 h-12">
      {/* Left Side (RFP) */}
      <div className={cn("text-right w-5/12", status === 'unsolicited_invoice' && 'opacity-30')}>
        <p className="text-sm font-medium text-neumorphic-text-primary">{rfpLabel}</p>
        {rfpValue && <p className="text-xs text-neumorphic-text-secondary">{rfpValue}</p>}
      </div>

      {/* Center Connector */}
      <div className="absolute left-1/2 top-1/2 w-2/12 h-px -translate-x-1/2 -translate-y-1/2" style={{ backgroundColor: config.lineColor }}>
        {config.glow && (
            <>
              {/* Main glow effect */}
              <motion.div 
                  className="absolute left-1/2 top-1/2 w-full h-2 -translate-x-1/2 -translate-y-1/2"
                  style={{ 
                    background: `linear-gradient(90deg, transparent, ${config.glowColor}, transparent)`,
                    filter: 'blur(3px)',
                    borderRadius: '2px'
                  }}
                  animate={{ opacity: [0.3, 0.9, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Stronger outer glow */}
              <motion.div 
                  className="absolute left-1/2 top-1/2 w-full h-4 -translate-x-1/2 -translate-y-1/2"
                  style={{ 
                    background: `linear-gradient(90deg, transparent, ${config.glowColor}, transparent)`,
                    filter: 'blur(6px)',
                    borderRadius: '4px'
                  }}
                  animate={{ opacity: [0.1, 0.5, 0.1] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </>
        )}
      </div>

      {/* Right Side (Invoice) */}
      <div className={cn("text-left w-5/12", status === 'unsolicited_rfp' && 'opacity-30')}>
        <p className={cn("text-sm font-medium text-neumorphic-text-primary", config.glow && "text-[var(--neumorphic-severity-high)]")}>{invoiceLabel}</p>
        {invoiceValue && <p className={cn("text-xs text-neumorphic-text-secondary", config.glow && "text-[var(--neumorphic-severity-high)]")}>{invoiceValue}</p>}
      </div>
    </div>
  );
}; 