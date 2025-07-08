import React, { useState } from 'react';
import SupplierNetworkGraph from './index';
import { RiskCategory, ExecutiveSupplierInfo } from '@/lib/sample-data/executive-dashboard-data';
import { NeumorphicHeading, NeumorphicText } from '@/components/ui/neumorphic';
import { motion } from 'framer-motion';

const SupplierNetworkGraphExample: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<RiskCategory | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<ExecutiveSupplierInfo | null>(null);

  const handleNodeClick = (supplier: ExecutiveSupplierInfo) => {
    setSelectedSupplier(supplier);
  };

  const filterOptions: { value: RiskCategory | null; label: string }[] = [
    { value: null, label: 'All Categories' },
    { value: 'financial', label: 'Financial Risk' },
    { value: 'compliance', label: 'Compliance Risk' },
    { value: 'operational', label: 'Operational Risk' },
    { value: 'reputational', label: 'Reputational Risk' },
  ];

  return (
    <div className="p-8 bg-[var(--neumorphic-bg)] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <NeumorphicHeading size="xl">
            Supplier Network Graph Demo
          </NeumorphicHeading>
          <NeumorphicText variant="secondary" className="mt-2">
            Interactive force-directed graph showing supplier-director relationships
          </NeumorphicText>
        </div>

        {/* Filter Controls */}
        <div className="flex justify-center">
          <div className="flex gap-2 p-2 bg-[var(--neumorphic-card)] rounded-[var(--neumorphic-radius-lg)] shadow-[var(--neumorphic-shadow-concave)]">
            {filterOptions.map((option) => (
              <motion.button
                key={option.value || 'all'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(option.value)}
                className={`
                  px-4 py-2 rounded-[var(--neumorphic-radius-md)] transition-all duration-200
                  ${activeFilter === option.value
                    ? 'bg-[var(--neumorphic-accent)] text-white shadow-[var(--neumorphic-shadow-concave)]'
                    : 'bg-[var(--neumorphic-button)] shadow-[var(--neumorphic-shadow-convex)] hover:shadow-[var(--neumorphic-shadow-concave)]'
                  }
                `}
              >
                <NeumorphicText size="sm" className={activeFilter === option.value ? 'text-white' : ''}>
                  {option.label}
                </NeumorphicText>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Graph Component */}
        <SupplierNetworkGraph
          activeFilter={activeFilter}
          onNodeClick={handleNodeClick}
          selectedSupplierId={selectedSupplier?.id}
        />

        {/* Selected Supplier Details */}
        {selectedSupplier && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-[var(--neumorphic-card)] rounded-[var(--neumorphic-radius-lg)] shadow-[var(--neumorphic-shadow-convex)]"
          >
            <NeumorphicHeading size="md" className="mb-4">
              Selected Supplier Details
            </NeumorphicHeading>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <NeumorphicText variant="secondary" size="sm">Name</NeumorphicText>
                <NeumorphicText className="font-semibold">{selectedSupplier.name}</NeumorphicText>
              </div>
              <div>
                <NeumorphicText variant="secondary" size="sm">Category</NeumorphicText>
                <NeumorphicText className="font-semibold">{selectedSupplier.category}</NeumorphicText>
              </div>
              <div>
                <NeumorphicText variant="secondary" size="sm">Risk Score</NeumorphicText>
                <NeumorphicText className="font-semibold text-[var(--neumorphic-severity-high)]">
                  {selectedSupplier.riskScore}%
                </NeumorphicText>
              </div>
              <div>
                <NeumorphicText variant="secondary" size="sm">Contract Value</NeumorphicText>
                <NeumorphicText className="font-semibold">
                  R {(selectedSupplier.contractValueZAR / 1000000).toFixed(1)}M
                </NeumorphicText>
              </div>
            </div>
            <div className="mt-4">
              <NeumorphicText variant="secondary" size="sm">Risk Breakdown</NeumorphicText>
              <div className="grid grid-cols-4 gap-2 mt-2">
                <div className="text-center p-2 bg-[var(--neumorphic-button)] rounded-[var(--neumorphic-radius-sm)]">
                  <NeumorphicText size="xs">Financial</NeumorphicText>
                  <NeumorphicText className="font-bold">{selectedSupplier.riskFactors.financial}%</NeumorphicText>
                </div>
                <div className="text-center p-2 bg-[var(--neumorphic-button)] rounded-[var(--neumorphic-radius-sm)]">
                  <NeumorphicText size="xs">Compliance</NeumorphicText>
                  <NeumorphicText className="font-bold">{selectedSupplier.riskFactors.compliance}%</NeumorphicText>
                </div>
                <div className="text-center p-2 bg-[var(--neumorphic-button)] rounded-[var(--neumorphic-radius-sm)]">
                  <NeumorphicText size="xs">Operational</NeumorphicText>
                  <NeumorphicText className="font-bold">{selectedSupplier.riskFactors.operational}%</NeumorphicText>
                </div>
                <div className="text-center p-2 bg-[var(--neumorphic-button)] rounded-[var(--neumorphic-radius-sm)]">
                  <NeumorphicText size="xs">Reputational</NeumorphicText>
                  <NeumorphicText className="font-bold">{selectedSupplier.riskFactors.reputational}%</NeumorphicText>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SupplierNetworkGraphExample;