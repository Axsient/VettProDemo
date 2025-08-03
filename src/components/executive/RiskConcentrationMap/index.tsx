'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  fadeInVariants, 
  slideUpVariants, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hoverScaleVariants,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ANIMATION_DURATIONS 
} from '@/lib/animation-utils';
import Map, { NavigationControl, ScaleControl, Marker } from 'react-map-gl/maplibre';
import { 
  mineSites, 
  suppliers, 
  MineSite, 
  ExecutiveSupplierInfo,
  RiskCategory
} from '@/lib/sample-data/executive-dashboard-data';
import { NeumorphicCard, NeumorphicText, NeumorphicBadge } from '@/components/ui/neumorphic';
import { MapPin, Building, Users } from 'lucide-react';
import 'maplibre-gl/dist/maplibre-gl.css';

interface RiskConcentrationMapProps {
  className?: string;
  height?: string;
  onSupplierClick?: (supplier: ExecutiveSupplierInfo) => void;
  onMineSiteClick?: (mineSite: MineSite) => void;
  selectedMineSiteId?: string | null;
  selectedSupplierId?: string | null;
  highlightedSupplierIds?: string[];
  filteredMineSites?: MineSite[];
  filteredSuppliers?: ExecutiveSupplierInfo[];
  activeRiskFilter?: RiskCategory | null;
}

interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

interface HoverInfo {
  object: MineSite | ExecutiveSupplierInfo | null;
  x: number;
  y: number;
  type: 'mine' | 'supplier' | null;
}

const RiskConcentrationMap: React.FC<RiskConcentrationMapProps> = ({
  className = '',
  height = '600px',
  onSupplierClick,
  onMineSiteClick,
  selectedMineSiteId = null,
  selectedSupplierId = null,
  highlightedSupplierIds = [],
  filteredMineSites = mineSites,
  filteredSuppliers = suppliers,
  activeRiskFilter = null,
}) => {
  // South Africa centered view
  const [viewState, setViewState] = useState<ViewState>({
    longitude: 24.991639,
    latitude: -28.8166,
    zoom: 5.5,
    pitch: 0,
    bearing: 0,
  });

  const [hoverInfo, setHoverInfo] = useState<HoverInfo>({ 
    object: null, 
    x: 0, 
    y: 0, 
    type: null 
  });
  const [mapError, setMapError] = useState<string | null>(null);

  // Handle view state changes
  const handleViewStateChange = useCallback((evt: { viewState: ViewState }) => {
    setViewState(evt.viewState);
  }, []);

  // Animate markers when component mounts or data changes
  useEffect(() => {
    const timer = setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const animateMarkers = true;
    }, 500);
    return () => clearTimeout(timer);
  }, [filteredMineSites, filteredSuppliers]);

  // Handle map load event
  const handleMapLoad = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const isMapLoaded = true;
  }, []);

  // Handle mine site click
  const handleMineSiteClick = useCallback((mineSite: MineSite) => {
    onMineSiteClick?.(mineSite);
  }, [onMineSiteClick]);

  // Handle supplier click
  const handleSupplierClick = useCallback((supplier: ExecutiveSupplierInfo) => {
    onSupplierClick?.(supplier);
  }, [onSupplierClick]);

  // Check if supplier is highlighted
  const isSupplierHighlighted = useCallback((supplierId: string): boolean => {
    return highlightedSupplierIds.includes(supplierId) || 
           supplierId === selectedSupplierId;
  }, [highlightedSupplierIds, selectedSupplierId]);

  // Check if mine site is highlighted
  const isMineSiteHighlighted = useCallback((mineSiteId: string): boolean => {
    return Boolean(selectedMineSiteId && mineSiteId === selectedMineSiteId) ||
           Boolean(selectedSupplierId && 
            filteredSuppliers.some(s => 
              s.id === selectedSupplierId && 
              s.linkedMineSiteIds.includes(mineSiteId)
            ));
  }, [selectedMineSiteId, selectedSupplierId, filteredSuppliers]);

  // Get marker color based on risk score
  const getRiskMarkerColor = useCallback((riskScore: number): string => {
    if (riskScore >= 75) return '#ef4444'; // Critical - Red
    if (riskScore >= 50) return '#f59e0b'; // High - Orange
    if (riskScore >= 25) return '#eab308'; // Medium - Yellow
    return '#22c55e'; // Low - Green
  }, []);

  // Get marker size based on value/importance
  const getMarkerSize = useCallback((value: number, type: 'mine' | 'supplier'): number => {
    if (type === 'mine') {
      return Math.max(20, Math.min(40, value / 5)); // Scale based on active suppliers
    } else {
      return Math.max(8, Math.min(16, Math.sqrt(value / 1000000) * 2)); // Scale based on contract value
    }
  }, []);

  // Render enhanced tooltip with smart positioning
  const renderTooltip = () => {
    if (!hoverInfo.object) return null;

    // Smart positioning to keep tooltip within bounds
    const tooltipWidth = 200; // min-w-[200px]
    const offset = 10;
    
    // Get map container bounds
    const mapContainer = document.querySelector('.maplibregl-map');
    const containerRect = mapContainer?.getBoundingClientRect();
    const containerWidth = containerRect?.width || 800;
    
    // Convert global coordinates to container-relative coordinates
    const relativeX = containerRect ? hoverInfo.x - containerRect.left : hoverInfo.x;
    const relativeY = containerRect ? hoverInfo.y - containerRect.top : hoverInfo.y;
    
    // Calculate optimal position
    let leftPos = relativeX + offset;
    let transformX = '0%';
    
    // If tooltip would overflow on the right, position it to the left of cursor
    if (leftPos + tooltipWidth > containerWidth - 20) {
      leftPos = relativeX - offset;
      transformX = '-100%';
    }
    
    // Ensure tooltip doesn't go off left edge
    if (leftPos < 20) {
      leftPos = 20;
      transformX = '0%';
    }

    return (
      <AnimatePresence>
        <motion.div 
          key={hoverInfo.object.id}
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute pointer-events-none z-30 min-w-[200px] max-w-[250px]"
          style={{
            left: leftPos,
            top: relativeY - offset,
            transform: `translate(${transformX}, -100%)`,
          }}
        >
          <NeumorphicCard className="backdrop-blur-md border border-[var(--neumorphic-border)]">
            {hoverInfo.type === 'mine' ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[var(--neumorphic-accent)]" />
                  <NeumorphicText className="font-semibold">
                    {(hoverInfo.object as MineSite).name}
                  </NeumorphicText>
                </div>
                <div className="flex items-center justify-between">
                  <NeumorphicText size="sm" className="text-[var(--neumorphic-text-secondary)]">
                    Risk Score:
                  </NeumorphicText>
                  <NeumorphicBadge 
                    variant={
                      (hoverInfo.object as MineSite).aggregatedRiskScore >= 75 ? 'danger' :
                      (hoverInfo.object as MineSite).aggregatedRiskScore >= 50 ? 'warning' :
                      'success'
                    }
                  >
                    {(hoverInfo.object as MineSite).aggregatedRiskScore.toFixed(1)}
                  </NeumorphicBadge>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3 h-3 text-[var(--neumorphic-text-secondary)]" />
                  <NeumorphicText size="sm">
                    {(hoverInfo.object as MineSite).activeSuppliers} Active Suppliers
                  </NeumorphicText>
                </div>
                <div className="pt-1 border-t border-[var(--neumorphic-border)]">
                  <NeumorphicText size="sm" className="text-[var(--neumorphic-text-secondary)]">
                    Metals: {(hoverInfo.object as MineSite).metals.join(', ')}
                  </NeumorphicText>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-[var(--neumorphic-accent)]" />
                  <NeumorphicText className="font-semibold text-sm">
                    {(hoverInfo.object as ExecutiveSupplierInfo).name}
                  </NeumorphicText>
                </div>
                <NeumorphicText size="sm" className="text-[var(--neumorphic-text-secondary)]">
                  {(hoverInfo.object as ExecutiveSupplierInfo).category}
                </NeumorphicText>
                <div className="flex items-center justify-between">
                  <NeumorphicText size="sm" className="text-[var(--neumorphic-text-secondary)]">
                    Risk Score:
                  </NeumorphicText>
                  <NeumorphicBadge 
                    variant={
                      (hoverInfo.object as ExecutiveSupplierInfo).riskScore >= 75 ? 'danger' :
                      (hoverInfo.object as ExecutiveSupplierInfo).riskScore >= 50 ? 'warning' :
                      'success'
                    }
                  >
                    {(hoverInfo.object as ExecutiveSupplierInfo).riskScore.toFixed(0)}
                  </NeumorphicBadge>
                </div>
                <div className="pt-1 border-t border-[var(--neumorphic-border)]">
                  <NeumorphicText size="sm" className="text-[var(--neumorphic-text-secondary)]">
                    Contract: R{((hoverInfo.object as ExecutiveSupplierInfo).contractValueZAR / 1000000).toFixed(1)}M
                  </NeumorphicText>
                </div>
              </div>
            )}
          </NeumorphicCard>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className={`relative ${className}`} style={{ height }}>
      {mapError && (
        <div className="absolute top-2 left-2 z-20 bg-yellow-100 border border-yellow-400 text-yellow-700 px-2 py-1 rounded text-xs">
          {mapError}
        </div>
      )}
      <Map
        {...viewState}
        onMove={handleViewStateChange}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        style={{ width: '100%', height: '100%' }}
        onLoad={() => handleMapLoad()}
        onError={(error) => {
          console.warn('Map loading error:', error);
          setMapError('Map tiles failed to load. Using basic view.');
        }}
      >
        {/* Mine Site Markers */}
        {filteredMineSites.map((mineSite) => {
          const isHighlighted = isMineSiteHighlighted(mineSite.id);
          const isSelected = selectedMineSiteId === mineSite.id;
          const opacity = activeRiskFilter && !isHighlighted ? 0.3 : 1;
          
          return (
            <Marker
              key={mineSite.id}
              longitude={mineSite.coordinates[1]}
              latitude={mineSite.coordinates[0]}
              anchor="bottom"
            >
              <div
                className={`
                  relative cursor-pointer transform transition-all duration-300 hover:scale-110
                  ${isSelected ? 'scale-110' : ''}
                  ${isHighlighted ? 'z-20' : 'z-10'}
                `}
                style={{
                  width: getMarkerSize(mineSite.activeSuppliers, 'mine'),
                  height: getMarkerSize(mineSite.activeSuppliers, 'mine'),
                  opacity,
                }}
                onClick={() => handleMineSiteClick(mineSite)}
                onMouseEnter={(e) => {
                  setHoverInfo({
                    object: mineSite,
                    x: e.clientX,
                    y: e.clientY,
                    type: 'mine'
                  });
                }}
                onMouseLeave={() => setHoverInfo({ object: null, x: 0, y: 0, type: null })}
              >
                <div
                  className={`
                    w-full h-full rounded-full border-2 shadow-lg flex items-center justify-center
                    ${isSelected ? 'border-yellow-400' : 'border-white'}
                    ${isHighlighted && !isSelected ? 'border-blue-400' : ''}
                  `}
                  style={{
                    backgroundColor: getRiskMarkerColor(mineSite.aggregatedRiskScore),
                    boxShadow: isSelected 
                      ? `0 0 20px ${getRiskMarkerColor(mineSite.aggregatedRiskScore)}` 
                      : isHighlighted
                      ? `0 0 15px rgba(59, 130, 246, 0.5)`
                      : undefined,
                  }}
                >
                  <MapPin className="w-3 h-3 text-white" />
                </div>
                {(isSelected || isHighlighted) && (
                  <div 
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{
                      backgroundColor: isSelected 
                        ? getRiskMarkerColor(mineSite.aggregatedRiskScore)
                        : 'rgba(59, 130, 246, 0.5)',
                      opacity: 0.3,
                    }}
                  />
                )}
              </div>
            </Marker>
          );
        })}

        {/* Supplier Markers */}
        {filteredSuppliers.map((supplier) => {
          const isHighlighted = isSupplierHighlighted(supplier.id);
          const isSelected = selectedSupplierId === supplier.id;
          const opacity = activeRiskFilter || selectedMineSiteId ? 
            (isHighlighted ? 1 : 0.3) : 
            (isHighlighted ? 1 : 0.8);
          
          return (
            <Marker
              key={supplier.id}
              longitude={supplier.coordinates[1]}
              latitude={supplier.coordinates[0]}
              anchor="center"
            >
              <div
                className={`
                  cursor-pointer transform transition-all duration-300 hover:scale-125 rounded-full border shadow-md
                  ${isSelected ? 'scale-125 z-30' : isHighlighted ? 'z-20' : 'z-10'}
                  ${isHighlighted ? 'animate-pulse' : ''}
                  ${isSelected ? 'border-yellow-400 border-2' : 
                    isHighlighted ? 'border-blue-400 border-2' : 'border-white'}
                `}
                style={{
                  width: getMarkerSize(supplier.contractValueZAR, 'supplier'),
                  height: getMarkerSize(supplier.contractValueZAR, 'supplier'),
                  backgroundColor: getRiskMarkerColor(supplier.riskScore),
                  opacity,
                  boxShadow: isSelected 
                    ? `0 0 15px ${getRiskMarkerColor(supplier.riskScore)}`
                    : isHighlighted
                    ? '0 0 10px rgba(59, 130, 246, 0.5)'
                    : undefined,
                }}
                onClick={() => handleSupplierClick(supplier)}
                onMouseEnter={(e) => {
                  setHoverInfo({
                    object: supplier,
                    x: e.clientX,
                    y: e.clientY,
                    type: 'supplier'
                  });
                }}
                onMouseLeave={() => setHoverInfo({ object: null, x: 0, y: 0, type: null })}
              />
            </Marker>
          );
        })}

        <NavigationControl position="top-right" />
        <ScaleControl position="bottom-right" />
      </Map>

      {renderTooltip()}

      {/* Enhanced Legend with Animation */}
      <motion.div 
        className="absolute bottom-4 left-4 z-10"
        variants={slideUpVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 1 }}
      >
        <NeumorphicCard className="p-4 backdrop-blur-md">
          <NeumorphicText className="font-semibold mb-3">Risk Legend</NeumorphicText>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <NeumorphicText size="sm">Critical (75-100)</NeumorphicText>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <NeumorphicText size="sm">High (50-74)</NeumorphicText>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <NeumorphicText size="sm">Medium (25-49)</NeumorphicText>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <NeumorphicText size="sm">Low (0-24)</NeumorphicText>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-[var(--neumorphic-border)]">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-[var(--neumorphic-accent)]" />
              <NeumorphicText size="sm">Mine Sites</NeumorphicText>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-[var(--neumorphic-text-secondary)]" />
              <NeumorphicText size="sm">Suppliers</NeumorphicText>
            </div>
          </div>
        </NeumorphicCard>
      </motion.div>

      {/* Enhanced Status Indicators */}
      <motion.div 
        className="absolute top-4 left-4 z-10 space-y-2"
        variants={slideUpVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.5 }}
      >
        <AnimatePresence>
          {selectedMineSiteId && (
            <motion.div
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <NeumorphicCard className="p-3 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <motion.div 
                    className="w-2 h-2 bg-yellow-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <NeumorphicText size="sm" className="font-medium">
                    Selected: {filteredMineSites.find(m => m.id === selectedMineSiteId)?.name}
                  </NeumorphicText>
                </div>
              </NeumorphicCard>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {selectedSupplierId && (
            <motion.div
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <NeumorphicCard className="p-3 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <motion.div 
                    className="w-2 h-2 bg-blue-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <NeumorphicText size="sm" className="font-medium">
                    Selected: {filteredSuppliers.find(s => s.id === selectedSupplierId)?.name}
                  </NeumorphicText>
                </div>
              </NeumorphicCard>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {activeRiskFilter && (
            <motion.div
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <NeumorphicCard className="p-3 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <motion.div 
                    className="w-2 h-2 bg-purple-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <NeumorphicText size="sm" className="font-medium">
                    Risk Filter: {activeRiskFilter.charAt(0).toUpperCase() + activeRiskFilter.slice(1)}
                  </NeumorphicText>
                </div>
              </NeumorphicCard>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {highlightedSupplierIds.length > 0 && !selectedSupplierId && !selectedMineSiteId && (
            <motion.div
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <NeumorphicCard className="p-3 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <motion.div 
                    className="w-2 h-2 bg-green-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <NeumorphicText size="sm" className="font-medium">
                    Highlighting {highlightedSupplierIds.length} related entities
                  </NeumorphicText>
                </div>
              </NeumorphicCard>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default RiskConcentrationMap;