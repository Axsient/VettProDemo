import React, { useState } from 'react';
import RiskConcentrationMap from './index';
import { MineSite, ExecutiveSupplierInfo } from '@/lib/sample-data/executive-dashboard-data';
import { NeumorphicCard, NeumorphicText, NeumorphicBadge } from '@/components/ui/neumorphic';
import { Building, MapPin, DollarSign, AlertTriangle, X } from 'lucide-react';

const RiskConcentrationMapExample: React.FC = () => {
  const [selectedSupplier, setSelectedSupplier] = useState<ExecutiveSupplierInfo | null>(null);
  const [selectedMine, setSelectedMine] = useState<MineSite | null>(null);

  const handleSupplierClick = (supplier: ExecutiveSupplierInfo) => {
    setSelectedSupplier(supplier);
    setSelectedMine(null);
  };

  const handleMineSiteClick = (mineSite: MineSite) => {
    setSelectedMine(mineSite);
    setSelectedSupplier(null);
  };

  const closeModal = () => {
    setSelectedSupplier(null);
    setSelectedMine(null);
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[var(--neumorphic-text-primary)]">
          Risk Concentration Map
        </h2>
        <p className="text-[var(--neumorphic-text-secondary)]">
          Interactive visualization of South African mining operations and supplier risk concentration.
          Click on mine sites to see supplier connections.
        </p>
      </div>

      <div className="relative">
        <RiskConcentrationMap
          height="600px"
          onSupplierClick={handleSupplierClick}
          onMineSiteClick={handleMineSiteClick}
          className="rounded-lg shadow-[var(--neumorphic-shadow-convex)]"
        />

        {/* Supplier Details Modal */}
        {selectedSupplier && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <NeumorphicCard className="p-6 m-4 max-w-md w-full">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-[var(--neumorphic-accent)]" />
                  <NeumorphicText className="text-lg font-semibold">
                    Supplier Details
                  </NeumorphicText>
                </div>
                <button
                  onClick={closeModal}
                  className="p-1 hover:bg-[var(--neumorphic-button)] rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <NeumorphicText className="font-semibold">
                    {selectedSupplier.name}
                  </NeumorphicText>
                  <NeumorphicText size="sm" className="text-[var(--neumorphic-text-secondary)]">
                    {selectedSupplier.category}
                  </NeumorphicText>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <NeumorphicText size="sm" className="text-[var(--neumorphic-text-secondary)]">
                      Risk Score
                    </NeumorphicText>
                    <NeumorphicBadge 
                      variant={
                        selectedSupplier.riskScore >= 75 ? 'danger' :
                        selectedSupplier.riskScore >= 50 ? 'warning' : 'success'
                      }
                    >
                      {selectedSupplier.riskScore.toFixed(0)}
                    </NeumorphicBadge>
                  </div>
                  <div>
                    <NeumorphicText size="sm" className="text-[var(--neumorphic-text-secondary)]">
                      Contract Value
                    </NeumorphicText>
                    <NeumorphicText className="font-semibold">
                      R{(selectedSupplier.contractValueZAR / 1000000).toFixed(1)}M
                    </NeumorphicText>
                  </div>
                </div>

                <div>
                  <NeumorphicText size="sm" className="text-[var(--neumorphic-text-secondary)] mb-2">
                    Risk Factors
                  </NeumorphicText>
                  <div className="space-y-2">
                    {Object.entries(selectedSupplier.riskFactors).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <NeumorphicText size="sm" className="capitalize">
                          {key}
                        </NeumorphicText>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-[var(--neumorphic-card)] rounded-full overflow-hidden">
                            <div 
                              className="h-full transition-all duration-300"
                              style={{ 
                                width: `${value}%`,
                                backgroundColor: value >= 75 ? 'var(--neumorphic-severity-critical)' :
                                                value >= 50 ? 'var(--neumorphic-severity-high)' :
                                                value >= 25 ? 'var(--neumorphic-severity-medium)' :
                                                'var(--neumorphic-severity-low)'
                              }}
                            />
                          </div>
                          <NeumorphicText size="sm" className="w-8 text-right">
                            {value}
                          </NeumorphicText>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <NeumorphicText size="sm" className="text-[var(--neumorphic-text-secondary)]">
                    Connected Mine Sites: {selectedSupplier.linkedMineSiteIds.length}
                  </NeumorphicText>
                </div>
              </div>
            </NeumorphicCard>
          </div>
        )}

        {/* Mine Site Details Modal */}
        {selectedMine && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <NeumorphicCard className="p-6 m-4 max-w-md w-full">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[var(--neumorphic-accent)]" />
                  <NeumorphicText className="text-lg font-semibold">
                    Mine Site Details
                  </NeumorphicText>
                </div>
                <button
                  onClick={closeModal}
                  className="p-1 hover:bg-[var(--neumorphic-button)] rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <NeumorphicText className="font-semibold">
                    {selectedMine.name}
                  </NeumorphicText>
                  <NeumorphicText size="sm" className="text-[var(--neumorphic-text-secondary)]">
                    {selectedMine.province}
                  </NeumorphicText>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <NeumorphicText size="sm" className="text-[var(--neumorphic-text-secondary)]">
                      Risk Score
                    </NeumorphicText>
                    <NeumorphicBadge 
                      variant={
                        selectedMine.aggregatedRiskScore >= 75 ? 'danger' :
                        selectedMine.aggregatedRiskScore >= 50 ? 'warning' : 'success'
                      }
                    >
                      {selectedMine.aggregatedRiskScore.toFixed(1)}
                    </NeumorphicBadge>
                  </div>
                  <div>
                    <NeumorphicText size="sm" className="text-[var(--neumorphic-text-secondary)]">
                      Active Suppliers
                    </NeumorphicText>
                    <NeumorphicText className="font-semibold">
                      {selectedMine.activeSuppliers}
                    </NeumorphicText>
                  </div>
                </div>

                <div>
                  <NeumorphicText size="sm" className="text-[var(--neumorphic-text-secondary)] mb-2">
                    Metals Extracted
                  </NeumorphicText>
                  <div className="flex flex-wrap gap-2">
                    {selectedMine.metals.map((metal) => (
                      <NeumorphicBadge key={metal} variant="info">
                        {metal}
                      </NeumorphicBadge>
                    ))}
                  </div>
                </div>

                <div>
                  <NeumorphicText size="sm" className="text-[var(--neumorphic-text-secondary)]">
                    Location: {selectedMine.coordinates[0].toFixed(3)}°, {selectedMine.coordinates[1].toFixed(3)}°
                  </NeumorphicText>
                </div>
              </div>
            </NeumorphicCard>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NeumorphicCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--neumorphic-severity-critical)] bg-opacity-20 rounded">
              <AlertTriangle className="w-5 h-5 text-[var(--neumorphic-severity-critical)]" />
            </div>
            <div>
              <NeumorphicText className="font-semibold">High Risk Areas</NeumorphicText>
              <NeumorphicText size="sm" className="text-[var(--neumorphic-text-secondary)]">
                North West Province
              </NeumorphicText>
            </div>
          </div>
        </NeumorphicCard>

        <NeumorphicCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--neumorphic-accent)] bg-opacity-20 rounded">
              <DollarSign className="w-5 h-5 text-[var(--neumorphic-accent)]" />
            </div>
            <div>
              <NeumorphicText className="font-semibold">Total Value</NeumorphicText>
              <NeumorphicText size="sm" className="text-[var(--neumorphic-text-secondary)]">
                R498M in contracts
              </NeumorphicText>
            </div>
          </div>
        </NeumorphicCard>

        <NeumorphicCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--neumorphic-border)] bg-opacity-20 rounded">
              <Building className="w-5 h-5 text-[var(--neumorphic-border)]" />
            </div>
            <div>
              <NeumorphicText className="font-semibold">Supply Chain</NeumorphicText>
              <NeumorphicText size="sm" className="text-[var(--neumorphic-text-secondary)]">
                764 active suppliers
              </NeumorphicText>
            </div>
          </div>
        </NeumorphicCard>
      </div>
    </div>
  );
};

export default RiskConcentrationMapExample;