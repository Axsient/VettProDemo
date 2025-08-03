'use client';

import React, { useMemo, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NeumorphicText, NeumorphicHeading, NeumorphicCard } from '@/components/ui/neumorphic';
import { 
  RiskCategory,
  ExecutiveSupplierInfo,
  suppliers,
  directors
} from '@/lib/sample-data/executive-dashboard-data';
import { getCssVariable, getSeverityColor } from '@/lib/executive/theme-bridge';
import { 
  Network, 
  Building2, 
  User, 
  AlertTriangle,
  Filter,
  Info,
  MousePointer,
  Zap,
  Truck,
  Package,
  Wrench,
  Shield,
  Utensils,
  Monitor,
  Briefcase
} from 'lucide-react';

interface HierarchicalNetworkTreeProps {
  activeFilter?: RiskCategory | null;
  onNodeClick?: (nodeData: SupplierNode) => void;
  onNodeHover?: (supplierId: string | null) => void;
  selectedSupplierId?: string | null;
  selectedMineSiteId?: string | null;
  highlightedEntityIds?: string[];
  hoveredSupplierId?: string | null;
  filteredSuppliers?: ExecutiveSupplierInfo[];
  className?: string;
  height?: string;
}

interface SupplierNode {
  id: string;
  name: string;
  riskScore: number;
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  contractValue: number;
  category: string;
  directorIds: string[];
  ring: number;
  angle: number;
  x: number;
  y: number;
  radius: number;
  color: string;
}

interface DirectorConnection {
  directorId: string;
  directorName: string;
  supplierIds: string[];
  connectionCount: number;
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  path: string;
  isConcentrationRisk: boolean;
}

const HierarchicalNetworkTree: React.FC<HierarchicalNetworkTreeProps> = ({
  activeFilter,
  onNodeClick,
  onNodeHover,
  selectedSupplierId,
  selectedMineSiteId,
  highlightedEntityIds = [],
  hoveredSupplierId,
  filteredSuppliers = suppliers,
  className = '',
  height = '500px'
}) => {
  const [hoveredNode, setHoveredNode] = useState<SupplierNode | null>(null);
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null);

  // SVG dimensions
  const SVG_WIDTH = 800;
  const SVG_HEIGHT = 500;
  const CENTER_X = SVG_WIDTH / 2;
  const CENTER_Y = SVG_HEIGHT / 2;
  const CENTER_RADIUS = 40;

  // Risk ring configuration
  const RISK_RINGS = [
    { level: 'Critical', minRisk: 75, radius: 120, color: getCssVariable('--neumorphic-severity-critical') },
    { level: 'High', minRisk: 50, radius: 180, color: getCssVariable('--neumorphic-severity-high') },
    { level: 'Medium', minRisk: 25, radius: 240, color: getCssVariable('--neumorphic-severity-medium') },
    { level: 'Low', minRisk: 0, radius: 300, color: getCssVariable('--neumorphic-severity-low') }
  ];

  // Category icons mapping
  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'Explosives & Blasting': <Zap className="w-3 h-3" />,
      'Heavy Equipment Leasing': <Truck className="w-3 h-3" />,
      'Logistics': <Package className="w-3 h-3" />,
      'General Supplies': <Briefcase className="w-3 h-3" />,
      'Chemical Supplies': <AlertTriangle className="w-3 h-3" />,
      'Refining Services': <Wrench className="w-3 h-3" />,
      'Water Treatment': <Shield className="w-3 h-3" />,
      'Engineering & Maintenance': <Wrench className="w-3 h-3" />,
      'Personal Protective Equipment': <Shield className="w-3 h-3" />,
      'Catering Services': <Utensils className="w-3 h-3" />,
      'Transportation': <Truck className="w-3 h-3" />,
      'IT Services': <Monitor className="w-3 h-3" />,
      'Security': <Shield className="w-3 h-3" />
    };
    return iconMap[category] || <Building2 className="w-3 h-3" />;
  };

  // Process suppliers into positioned nodes
  const supplierNodes = useMemo<SupplierNode[]>(() => {
    // Use passed filtered suppliers or apply additional filtering
    let processSuppliers = filteredSuppliers;
    
    // Apply additional mine site filtering if selected
    if (selectedMineSiteId) {
      processSuppliers = processSuppliers.filter(s => 
        s.linkedMineSiteIds.includes(selectedMineSiteId)
      );
    }

    const nodesByRing: Record<number, SupplierNode[]> = {};

    // Group suppliers by risk level and assign to rings
    processSuppliers.forEach(supplier => {
      const riskLevel = supplier.riskScore >= 75 ? 'Critical' : 
                       supplier.riskScore >= 50 ? 'High' : 
                       supplier.riskScore >= 25 ? 'Medium' : 'Low';
      
      const ringIndex = RISK_RINGS.findIndex(ring => ring.level === riskLevel);
      const ring = RISK_RINGS[ringIndex];
      
      // Calculate node size based on contract value
      const maxContract = Math.max(...processSuppliers.map(s => s.contractValueZAR));
      const minRadius = 8;
      const maxRadius = 25;
      const radius = minRadius + ((supplier.contractValueZAR / maxContract) * (maxRadius - minRadius));

      const node: SupplierNode = {
        id: supplier.id,
        name: supplier.name,
        riskScore: supplier.riskScore,
        riskLevel: riskLevel as 'Critical' | 'High' | 'Medium' | 'Low',
        contractValue: supplier.contractValueZAR,
        category: supplier.category,
        directorIds: supplier.directorIds,
        ring: ringIndex,
        angle: 0, // Will be calculated below
        x: 0, // Will be calculated below
        y: 0, // Will be calculated below
        radius,
        color: ring.color
      };

      if (!nodesByRing[ringIndex]) {
        nodesByRing[ringIndex] = [];
      }
      nodesByRing[ringIndex].push(node);
    });

    // Position nodes around their rings
    const positionedNodes: SupplierNode[] = [];
    
    Object.entries(nodesByRing).forEach(([ringIndex, ringNodes]) => {
      const ring = RISK_RINGS[parseInt(ringIndex)];
      const angleStep = (2 * Math.PI) / ringNodes.length;
      
      ringNodes.forEach((node, index) => {
        const angle = index * angleStep;
        const x = CENTER_X + ring.radius * Math.cos(angle);
        const y = CENTER_Y + ring.radius * Math.sin(angle);
        
        positionedNodes.push({
          ...node,
          angle,
          x,
          y
        });
      });
    });

    return positionedNodes;
  }, [filteredSuppliers, selectedMineSiteId, CENTER_X, CENTER_Y, RISK_RINGS]);

  // Generate director connections
  const directorConnections = useMemo<DirectorConnection[]>(() => {
    const connections: DirectorConnection[] = [];
    const directorToSuppliers: Record<string, string[]> = {};

    // Group suppliers by directors
    supplierNodes.forEach(supplier => {
      supplier.directorIds.forEach(directorId => {
        if (!directorToSuppliers[directorId]) {
          directorToSuppliers[directorId] = [];
        }
        directorToSuppliers[directorId].push(supplier.id);
      });
    });

    // Create connections for directors with multiple suppliers
    Object.entries(directorToSuppliers).forEach(([directorId, supplierIds]) => {
      if (supplierIds.length > 1) {
        const director = directors.find(d => d.id === directorId);
        if (!director) return;

        const connectionCount = supplierIds.length;
        const isConcentrationRisk = connectionCount >= 3;
        
        // Determine risk level based on connection count
        const riskLevel = connectionCount >= 4 ? 'Critical' :
                         connectionCount >= 3 ? 'High' : 
                         connectionCount >= 2 ? 'Medium' : 'Low';

        // Generate SVG path connecting all suppliers for this director
        const supplierPositions = supplierIds
          .map(id => supplierNodes.find(n => n.id === id))
          .filter(Boolean) as SupplierNode[];

        if (supplierPositions.length > 1) {
          // Create a smooth curve through all connected suppliers
          let path = `M ${supplierPositions[0].x} ${supplierPositions[0].y}`;
          
          for (let i = 1; i < supplierPositions.length; i++) {
            const curr = supplierPositions[i];
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const prev = supplierPositions[i - 1];
            
            // Create curved connection through center area
            const controlX = CENTER_X;
            const controlY = CENTER_Y;
            
            path += ` Q ${controlX} ${controlY} ${curr.x} ${curr.y}`;
            
            // Add line to next supplier if not the last one
            if (i < supplierPositions.length - 1) {
              path += ` M ${curr.x} ${curr.y}`;
            }
          }

          connections.push({
            directorId,
            directorName: director.name,
            supplierIds,
            connectionCount,
            riskLevel: riskLevel as 'Critical' | 'High' | 'Medium' | 'Low',
            path,
            isConcentrationRisk
          });
        }
      }
    });

    return connections;
  }, [supplierNodes, CENTER_X, CENTER_Y]);

  // Event handlers
  const handleNodeClick = useCallback((node: SupplierNode) => {
    if (onNodeClick) {
      onNodeClick(node);
    }
  }, [onNodeClick]);

  const handleNodeHover = useCallback((node: SupplierNode | null) => {
    setHoveredNode(node);
    if (onNodeHover) {
      onNodeHover(node?.id || null);
    }
  }, [onNodeHover]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <NeumorphicHeading className="flex items-center justify-center gap-2">
          <Network className="w-6 h-6 text-[var(--neumorphic-accent)]" />
          Hierarchical Risk Network
        </NeumorphicHeading>
        <NeumorphicText variant="secondary" size="sm" className="mt-1">
          Solar system view of supplier risk proximity to Sibanye-Stillwater
        </NeumorphicText>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[var(--neumorphic-text-secondary)]" />
          <NeumorphicText size="sm">
            {activeFilter ? `Filtering by ${activeFilter} risk` : 
             selectedMineSiteId ? 'Filtered by mine site' :
             filteredSuppliers.length !== suppliers.length ? 'Filtered view' :
             'Showing all suppliers'} 
            ({supplierNodes.length} suppliers)
          </NeumorphicText>
        </div>
      </div>

      {/* SVG Network Tree */}
      <motion.div
        className="relative rounded-[var(--neumorphic-radius-lg)] bg-[var(--neumorphic-card)] shadow-[var(--neumorphic-shadow-concave)] overflow-hidden"
        style={{ height }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <NeumorphicCard className="p-0 h-full">
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
            className="overflow-visible"
          >
            {/* Risk Ring Indicators */}
            {RISK_RINGS.map((ring, index) => (
              <circle
                key={`ring-${index}`}
                cx={CENTER_X}
                cy={CENTER_Y}
                r={ring.radius}
                fill="none"
                stroke={ring.color}
                strokeWidth="1"
                strokeOpacity="0.2"
                strokeDasharray="5,5"
              />
            ))}

            {/* Director Connections */}
            {directorConnections.map((connection) => {
              const isHovered = hoveredConnection === connection.directorId;
              const strokeWidth = connection.isConcentrationRisk ? 4 : 
                                 connection.connectionCount >= 2 ? 3 : 2;
              const opacity = isHovered ? 1 : 
                             connection.isConcentrationRisk ? 0.8 : 0.5;

              return (
                <g key={`connection-${connection.directorId}`}>
                  <path
                    d={connection.path}
                    fill="none"
                    stroke={getSeverityColor(connection.riskLevel)}
                    strokeWidth={strokeWidth}
                    opacity={opacity}
                    className="cursor-pointer transition-all duration-300"
                    onMouseEnter={() => setHoveredConnection(connection.directorId)}
                    onMouseLeave={() => setHoveredConnection(null)}
                  />
                  {connection.isConcentrationRisk && (
                    <motion.circle
                      cx={CENTER_X}
                      cy={CENTER_Y}
                      r="8"
                      fill={getSeverityColor(connection.riskLevel)}
                      opacity={0.6}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.6, 0.9, 0.6]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </g>
              );
            })}

            {/* Central Hub - Sibanye-Stillwater */}
            <g>
              <circle
                cx={CENTER_X}
                cy={CENTER_Y}
                r={CENTER_RADIUS}
                fill={getCssVariable('--neumorphic-accent')}
                stroke={getCssVariable('--neumorphic-border')}
                strokeWidth="3"
                filter="drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
              />
              <text
                x={CENTER_X}
                y={CENTER_Y - 5}
                textAnchor="middle"
                className="text-xs font-bold fill-white"
              >
                Sibanye
              </text>
              <text
                x={CENTER_X}
                y={CENTER_Y + 8}
                textAnchor="middle"
                className="text-xs font-bold fill-white"
              >
                Stillwater
              </text>
            </g>

            {/* Supplier Nodes */}
            {supplierNodes.map((node) => {
              const isSelected = selectedSupplierId === node.id;
              const isHovered = hoveredNode?.id === node.id;
              const isHighlighted = highlightedEntityIds.includes(node.id);
              const isHoveredExternal = hoveredSupplierId === node.id;

              const nodeOpacity = isSelected || isHovered || isHighlighted || isHoveredExternal ? 1 : 0.8;
              const strokeWidth = isSelected ? 4 : isHovered ? 3 : 2;
              const glowRadius = isHovered ? node.radius + 6 : node.radius;

              return (
                <g key={`node-${node.id}`}>
                  {/* Glow effect for interacted nodes */}
                  {(isHovered || isSelected || isHighlighted) && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={glowRadius}
                      fill={node.color}
                      opacity="0.3"
                      filter="blur(4px)"
                    />
                  )}
                  
                  {/* Main node */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.radius}
                    fill={node.color}
                    stroke={isSelected ? getCssVariable('--neumorphic-accent') : 'rgba(255,255,255,0.3)'}
                    strokeWidth={strokeWidth}
                    opacity={nodeOpacity}
                    className="cursor-pointer transition-all duration-300"
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
                    onClick={() => handleNodeClick(node)}
                    onMouseEnter={() => handleNodeHover(node)}
                    onMouseLeave={() => handleNodeHover(null)}
                  />
                  
                  {/* Category icon */}
                  <foreignObject
                    x={node.x - 8}
                    y={node.y - 8}
                    width="16"
                    height="16"
                    className="pointer-events-none"
                  >
                    <div className="flex items-center justify-center w-full h-full text-white">
                      {getCategoryIcon(node.category)}
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>
        </NeumorphicCard>

        {/* Hover Tooltip */}
        <AnimatePresence>
          {hoveredNode && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute top-4 left-4 p-3 rounded-lg bg-[var(--neumorphic-card)] shadow-lg max-w-xs border border-[var(--neumorphic-border)] z-50"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-[var(--neumorphic-radius-sm)] bg-[var(--neumorphic-button)] shadow-[var(--neumorphic-shadow-convex)]">
                  <Building2 className="w-5 h-5 text-[var(--neumorphic-accent)]" />
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <NeumorphicText className="font-semibold text-base">
                      {hoveredNode.name}
                    </NeumorphicText>
                    <NeumorphicText size="sm" variant="secondary">
                      {hoveredNode.category}
                    </NeumorphicText>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <AlertTriangle 
                        className="w-4 h-4" 
                        style={{ color: hoveredNode.color }}
                      />
                      <NeumorphicText size="sm">
                        Risk: {hoveredNode.riskScore}% ({hoveredNode.riskLevel})
                      </NeumorphicText>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <span className="text-xs">💰</span>
                      </div>
                      <NeumorphicText size="sm">
                        Value: R{(hoveredNode.contractValue / 1000000).toFixed(1)}M
                      </NeumorphicText>
                    </div>

                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <NeumorphicText size="sm">
                        {hoveredNode.directorIds.length} director{hoveredNode.directorIds.length !== 1 ? 's' : ''}
                      </NeumorphicText>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-[var(--neumorphic-border)]">
                    <NeumorphicText size="sm" variant="secondary" className="flex items-center gap-1">
                      <MousePointer className="w-3 h-3" />
                      Click to select and view details
                    </NeumorphicText>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Connection Tooltip */}
        <AnimatePresence>
          {hoveredConnection && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute top-4 right-4 p-3 rounded-lg bg-[var(--neumorphic-card)] shadow-lg max-w-xs border border-[var(--neumorphic-border)] z-50"
            >
              {(() => {
                const connection = directorConnections.find(c => c.directorId === hoveredConnection);
                if (!connection) return null;

                return (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-[var(--neumorphic-radius-sm)] bg-[var(--neumorphic-button)] shadow-[var(--neumorphic-shadow-convex)]">
                      <User className="w-5 h-5 text-[var(--neumorphic-text-secondary)]" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div>
                        <NeumorphicText className="font-semibold text-base">
                          {connection.directorName}
                        </NeumorphicText>
                        <NeumorphicText size="sm" variant="secondary">
                          Board Director
                        </NeumorphicText>
                      </div>
                      
                      {connection.isConcentrationRisk && (
                        <div className="p-2 rounded-[var(--neumorphic-radius-sm)] bg-red-100 border border-red-300">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            <NeumorphicText size="sm" className="font-medium text-red-800">
                              CONCENTRATION RISK
                            </NeumorphicText>
                          </div>
                          <NeumorphicText size="sm" className="mt-1 text-red-700">
                            Sits on {connection.connectionCount} supplier boards
                          </NeumorphicText>
                        </div>
                      )}
                      
                      <div className="space-y-1">
                        <NeumorphicText size="sm">
                          Connected to {connection.connectionCount} suppliers
                        </NeumorphicText>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-4 right-4 p-3 rounded-lg bg-[var(--neumorphic-card)] shadow-md border border-[var(--neumorphic-border)] w-48 text-xs"
        >
          <NeumorphicText size="sm" className="font-semibold mb-2 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Risk Proximity
          </NeumorphicText>
          
          <div className="space-y-2">
            <div>
              <NeumorphicText size="sm" className="font-medium mb-1">Distance from Center</NeumorphicText>
              <div className="space-y-1">
                                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <NeumorphicText size="sm">Critical (Closest)</NeumorphicText>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <NeumorphicText size="sm">High Risk</NeumorphicText>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <NeumorphicText size="sm">Medium Risk</NeumorphicText>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <NeumorphicText size="sm">Low (Farthest)</NeumorphicText>
                  </div>
              </div>
            </div>
            
            <div className="pt-2 border-t border-[var(--neumorphic-border)]">
              <NeumorphicText size="sm" className="font-medium mb-1">Connections</NeumorphicText>
              <div className="space-y-1">
                                  <div className="flex items-center gap-1">
                    <div className="w-2 h-0.5 bg-red-500" />
                    <NeumorphicText size="sm">Critical (4+ boards)</NeumorphicText>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-0.5 bg-orange-500" />
                    <NeumorphicText size="sm">High (3 boards)</NeumorphicText>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-0.5 bg-gray-500" />
                    <NeumorphicText size="sm">Normal (2 boards)</NeumorphicText>
                  </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div 
          className="p-4 rounded-[var(--neumorphic-radius-md)] bg-[var(--neumorphic-button)] shadow-[var(--neumorphic-shadow-convex)]"
          whileHover={{ scale: 1.02 }}
        >
          <NeumorphicText size="sm" variant="secondary">Total Suppliers</NeumorphicText>
          <NeumorphicText className="text-2xl font-bold">{supplierNodes.length}</NeumorphicText>
        </motion.div>
        <motion.div 
          className="p-4 rounded-[var(--neumorphic-radius-md)] bg-[var(--neumorphic-button)] shadow-[var(--neumorphic-shadow-convex)]"
          whileHover={{ scale: 1.02 }}
        >
          <NeumorphicText size="sm" variant="secondary">Director Connections</NeumorphicText>
          <NeumorphicText className="text-2xl font-bold">{directorConnections.length}</NeumorphicText>
        </motion.div>
        <motion.div 
          className="p-4 rounded-[var(--neumorphic-radius-md)] bg-[var(--neumorphic-button)] shadow-[var(--neumorphic-shadow-convex)]"
          whileHover={{ scale: 1.02 }}
        >
          <NeumorphicText size="sm" variant="secondary">Concentration Risks</NeumorphicText>
          <NeumorphicText className="text-2xl font-bold text-[var(--neumorphic-severity-critical)]">
            {directorConnections.filter(c => c.isConcentrationRisk).length}
          </NeumorphicText>
          <NeumorphicText size="sm" variant="secondary" className="mt-1">
            Directors on 3+ boards
          </NeumorphicText>
        </motion.div>
        <motion.div 
          className="p-4 rounded-[var(--neumorphic-radius-md)] bg-[var(--neumorphic-button)] shadow-[var(--neumorphic-shadow-convex)]"
          whileHover={{ scale: 1.02 }}
        >
          <NeumorphicText size="sm" variant="secondary">Critical Proximity</NeumorphicText>
          <NeumorphicText className="text-2xl font-bold text-[var(--neumorphic-severity-critical)]">
            {supplierNodes.filter(n => n.riskLevel === 'Critical').length}
          </NeumorphicText>
          <NeumorphicText size="sm" variant="secondary" className="mt-1">
            High-risk suppliers near center
          </NeumorphicText>
        </motion.div>
      </div>
    </div>
  );
};

export default HierarchicalNetworkTree;