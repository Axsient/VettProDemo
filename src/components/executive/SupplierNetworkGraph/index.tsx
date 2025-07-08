'use client';

import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--neumorphic-accent)]"></div>
    </div>
  )
});
import { motion, AnimatePresence } from 'framer-motion';
import { NeumorphicText, NeumorphicHeading } from '@/components/ui/neumorphic';
import { 
  RiskCategory,
  suppliers,
  directors
} from '@/lib/sample-data/executive-dashboard-data';
import { 
  getCssVariable, 
  getThemeColors,
  applyNeumorphicToCanvas,
  getSeverityColor
} from '@/lib/executive/theme-bridge';
import { 
  Network, 
  Building2, 
  User, 
  AlertTriangle,
  Filter,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Info,
  MousePointer,
  Move
} from 'lucide-react';

interface SupplierNetworkGraphProps {
  activeFilter?: RiskCategory | null;
  onNodeClick?: (nodeData: GraphNode) => void;
  onNodeHover?: (supplierId: string | null) => void;
  selectedSupplierId?: string | null;
  selectedMineSiteId?: string | null;
  highlightedEntityIds?: string[];
  hoveredSupplierId?: string | null;
  filteredSuppliers?: ExecutiveSupplierInfo[];
  className?: string;
  height?: string;
}

interface GraphNode {
  id: string;
  name: string;
  type: 'supplier' | 'director';
  riskScore?: number;
  riskCategory?: string;
  val: number; // Node size
  color: string;
  fx?: number | null;
  fy?: number | null;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  contractValue?: number;
  connectionsCount?: number;
}

interface GraphLink {
  source: string;
  target: string;
  value: number;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

const SupplierNetworkGraph: React.FC<SupplierNetworkGraphProps> = ({
  activeFilter,
  onNodeClick,
  onNodeHover,
  selectedSupplierId,
  selectedMineSiteId,
  highlightedEntityIds = [],
  hoveredSupplierId,
  filteredSuppliers = suppliers,
  className = '',
  height = '400px'
}) => {
  const graphRef = useRef<any>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [clickedNode, setClickedNode] = useState<GraphNode | null>(null);
  const [graphDimensions, setGraphDimensions] = useState({ width: 800, height: 400 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate graph dimensions based on container
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setGraphDimensions({
          width: rect.width,
          height: rect.height
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    // Initialize graph after first render
    const timer = setTimeout(() => {
      setIsInitialized(true);
      updateDimensions();
    }, 100);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(timer);
    };
  }, []);

  // Prepare graph data
  const graphData = useMemo<GraphData>(() => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const colors = getThemeColors();

    // Use passed filtered suppliers or apply additional filtering
    let graphSuppliers = filteredSuppliers;
    
    // Apply additional mine site filtering if selected
    if (selectedMineSiteId) {
      graphSuppliers = graphSuppliers.filter(s => 
        s.linkedMineSiteIds.includes(selectedMineSiteId)
      );
    }

    // Count connections for each supplier
    const supplierConnections: Record<string, number> = {};
    graphSuppliers.forEach(supplier => {
      supplierConnections[supplier.id] = supplier.directorIds.length;
    });

    // Add supplier nodes with improved sizing and highlighting
    graphSuppliers.forEach(supplier => {
      const isSelected = supplier.id === selectedSupplierId;
      const riskLevel = supplier.riskScore >= 75 ? 'Critical' : 
                       supplier.riskScore >= 50 ? 'High' : 
                       supplier.riskScore >= 25 ? 'Medium' : 'Low';
      
      // Better node sizing: base size + risk factor + contract value factor
      const baseSize = 8;
      const riskFactor = Math.max(1, supplier.riskScore / 25); // 1-4 multiplier
      const contractFactor = Math.max(1, supplier.contractValueZAR / 5000000); // 1-20 multiplier
      const connectionFactor = Math.max(1, supplierConnections[supplier.id] / 2); // 1-5 multiplier
      
      const nodeSize = Math.min(25, baseSize + riskFactor + contractFactor + connectionFactor);
      
      nodes.push({
        id: supplier.id,
        name: supplier.name,
        type: 'supplier',
        riskScore: supplier.riskScore,
        riskCategory: supplier.category,
        val: nodeSize,
        color: getSeverityColor(riskLevel),
        contractValue: supplier.contractValueZAR,
        connectionsCount: supplierConnections[supplier.id],
        fx: isSelected ? null : null, // Don't fix position initially
        fy: isSelected ? null : null
      });
    });

    // Add director nodes and links
    const relevantDirectorIds = new Set<string>();
    const directorConnections: Record<string, number> = {};
    
    graphSuppliers.forEach(supplier => {
      supplier.directorIds.forEach(directorId => {
        relevantDirectorIds.add(directorId);
        directorConnections[directorId] = (directorConnections[directorId] || 0) + 1;
        links.push({
          source: supplier.id,
          target: directorId,
          value: 1
        });
      });
    });

    // Add director nodes with sizing based on connections
    directors
      .filter(d => relevantDirectorIds.has(d.id))
      .forEach(director => {
        const connections = directorConnections[director.id] || 1;
        const directorSize = Math.min(15, 4 + connections * 2); // 4-15 size range
        
        nodes.push({
          id: director.id,
          name: director.name,
          type: 'director',
          val: directorSize,
          color: colors.textSecondary,
          connectionsCount: connections
        });
      });

    // Add supplier-to-supplier links through shared directors (lighter weight)
    const directorToSuppliers: Record<string, string[]> = {};
    graphSuppliers.forEach(supplier => {
      supplier.directorIds.forEach(directorId => {
        if (!directorToSuppliers[directorId]) {
          directorToSuppliers[directorId] = [];
        }
        directorToSuppliers[directorId].push(supplier.id);
      });
    });

    // Create weaker links between suppliers with shared directors
    Object.values(directorToSuppliers).forEach(supplierIds => {
      if (supplierIds.length > 1) {
        for (let i = 0; i < supplierIds.length - 1; i++) {
          for (let j = i + 1; j < supplierIds.length; j++) {
            links.push({
              source: supplierIds[i],
              target: supplierIds[j],
              value: 0.5 // Weaker connection
            });
          }
        }
      }
    });

    return { nodes, links };
  }, [activeFilter, selectedSupplierId, selectedMineSiteId, filteredSuppliers, graphDimensions.width, graphDimensions.height]);

  // Custom node canvas rendering with improved visuals and interactions
  const nodeCanvasObject = useCallback((node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const x = node.x || 0;
    const y = node.y || 0;
    const radius = node.val;
    const isHovered = hoveredNode?.id === node.id;
    const isClicked = clickedNode?.id === node.id;
    const isSelected = selectedSupplierId === node.id;
    const isHighlighted = highlightedEntityIds.includes(node.id);
    const isHoveredFromExternal = hoveredSupplierId === node.id;
    
    // Scale-dependent sizing
    const scaledRadius = radius / globalScale;
    const borderWidth = Math.max(1, 2 / globalScale);
    const fontSize = Math.max(10, 12 / globalScale);
    const iconSize = Math.max(8, 10 / globalScale);
    
    // Enhanced visual feedback with highlighting support
    const glowRadius = scaledRadius + (
      isHovered ? 4 : 
      isClicked ? 3 : 
      isSelected ? 3 : 
      isHighlighted ? 2 : 
      isHoveredFromExternal ? 2 : 0
    );
    const shadowOffset = isClicked ? 1 : 2;
    
    ctx.save();
    
    // Draw outer glow for interactions and highlighting
    if (isHovered || isClicked || isSelected || isHighlighted || isHoveredFromExternal) {
      const glowColor = isHovered ? 'rgba(79, 172, 254, 0.4)' : 
                       isClicked ? 'rgba(16, 185, 129, 0.4)' : 
                       isSelected ? 'rgba(245, 158, 11, 0.4)' :
                       isHighlighted ? 'rgba(147, 51, 234, 0.3)' :
                       isHoveredFromExternal ? 'rgba(59, 130, 246, 0.3)' :
                       'rgba(245, 158, 11, 0.3)';
      
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      ctx.beginPath();
      ctx.arc(x, y, glowRadius, 0, 2 * Math.PI);
      ctx.fillStyle = glowColor;
      ctx.fill();
    }
    
    // Draw main node with neumorphic shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = shadowOffset;
    ctx.shadowOffsetY = shadowOffset;
    
    // Main node circle
    ctx.beginPath();
    ctx.arc(x, y, scaledRadius, 0, 2 * Math.PI);
    ctx.fillStyle = node.color;
    ctx.fill();
    
    // Node border
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    ctx.beginPath();
    ctx.arc(x, y, scaledRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = isSelected ? getCssVariable('--neumorphic-accent') : 
                     isHovered ? getCssVariable('--neumorphic-text-primary') : 
                     isHighlighted ? 'rgba(147, 51, 234, 0.8)' :
                     isHoveredFromExternal ? 'rgba(59, 130, 246, 0.8)' :
                     'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = borderWidth;
    ctx.stroke();
    
    // Draw icons and indicators
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    if (node.type === 'director') {
      // Director icon
      ctx.fillStyle = 'white';
      ctx.font = `${iconSize}px Inter, sans-serif`;
      ctx.fillText('👤', x, y);
    } else if (node.type === 'supplier') {
      // Risk indicator for suppliers
      if (node.riskScore && node.riskScore >= 75) {
        ctx.fillStyle = 'white';
        ctx.font = `${iconSize * 1.2}px Inter, sans-serif`;
        ctx.fillText('⚠️', x, y);
      } else if (node.riskScore && node.riskScore >= 50) {
        ctx.fillStyle = 'white';
        ctx.font = `${iconSize}px Inter, sans-serif`;
        ctx.fillText('!', x, y);
      }
    }
    
    // Draw label for hovered or selected nodes
    if ((isHovered || isSelected) && globalScale > 0.5) {
      const label = node.name;
      const labelFontSize = Math.max(10, fontSize);
      ctx.font = `${labelFontSize}px Inter, sans-serif`;
      
      // Measure text for background
      const textMetrics = ctx.measureText(label);
      const textWidth = textMetrics.width;
      const textHeight = labelFontSize;
      
      // Background positioning
      const bgPadding = 6;
      const bgX = x - (textWidth + bgPadding) / 2;
      const bgY = y - scaledRadius - textHeight - bgPadding - 5;
      const bgWidth = textWidth + bgPadding;
      const bgHeight = textHeight + bgPadding;
      
      // Draw background
      ctx.fillStyle = getCssVariable('--neumorphic-card');
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      
      ctx.fillRect(bgX, bgY, bgWidth, bgHeight);
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      // Draw border
      ctx.strokeStyle = getCssVariable('--neumorphic-border');
      ctx.lineWidth = 1;
      ctx.strokeRect(bgX, bgY, bgWidth, bgHeight);
      
      // Draw text
      ctx.fillStyle = getCssVariable('--neumorphic-text-primary');
      ctx.fillText(label, x, bgY + bgHeight / 2);
    }
    
    ctx.restore();
  }, [selectedSupplierId, hoveredNode, clickedNode, highlightedEntityIds, hoveredSupplierId]);

  // Custom link canvas rendering with improved visuals
  const linkCanvasObject = useCallback((link: { source: { x: number; y: number }; target: { x: number; y: number }; value: number }, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const colors = getThemeColors();
    const lineWidth = Math.max(0.5, link.value / globalScale);
    const alpha = link.value > 0.5 ? 0.4 : 0.2; // Stronger links more visible
    
    ctx.save();
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = lineWidth;
    ctx.globalAlpha = alpha;
    
    // Add subtle gradient for stronger connections
    if (link.value > 0.5 && 
        isFinite(link.source.x) && isFinite(link.source.y) && 
        isFinite(link.target.x) && isFinite(link.target.y)) {
      try {
        const gradient = ctx.createLinearGradient(
          link.source.x, link.source.y,
          link.target.x, link.target.y
        );
        gradient.addColorStop(0, colors.border);
        gradient.addColorStop(0.5, colors.textSecondary);
        gradient.addColorStop(1, colors.border);
        ctx.strokeStyle = gradient;
      } catch (error) {
        // Fallback to solid color if gradient fails
        ctx.strokeStyle = colors.border;
      }
    }
    
    // Only draw if coordinates are valid
    if (isFinite(link.source.x) && isFinite(link.source.y) && 
        isFinite(link.target.x) && isFinite(link.target.y)) {
      ctx.beginPath();
      ctx.moveTo(link.source.x, link.source.y);
      ctx.lineTo(link.target.x, link.target.y);
      ctx.stroke();
    }
    
    ctx.restore();
  }, []);

  // Enhanced event handlers with better responsiveness
  const handleNodeClick = useCallback((node: GraphNode) => {
    setClickedNode(node);
    
    if (node.type === 'supplier') {
      const supplierData = suppliers.find(s => s.id === node.id);
      if (supplierData && onNodeClick) {
        onNodeClick(node);
      }
    }
    
    // Visual feedback timeout
    setTimeout(() => {
      setClickedNode(null);
    }, 200);
  }, [onNodeClick]);

  const handleNodeHover = useCallback((node: GraphNode | null) => {
    setHoveredNode(node);
    
    // Call parent hover handler for suppliers
    if (node?.type === 'supplier') {
      onNodeHover?.(node.id);
    } else {
      onNodeHover?.(null);
    }
    
    // Only reheat simulation if node state changed
    if (graphRef.current && node !== hoveredNode) {
      graphRef.current.d3ReheatSimulation();
    }
  }, [hoveredNode, onNodeHover]);

  const handleNodeDragStart = useCallback((node: GraphNode) => {
    setIsDragging(true);
    setClickedNode(node);
    
    // Fix node position during drag
    if (graphRef.current) {
      node.fx = node.x;
      node.fy = node.y;
      graphRef.current.d3ReheatSimulation();
    }
  }, []);

  const handleNodeDrag = useCallback((node: GraphNode, translate: { x: number; y: number }) => {
    if (isDragging && node.fx !== undefined && node.fy !== undefined) {
      node.fx = translate.x;
      node.fy = translate.y;
      
      // Smooth simulation update
      if (graphRef.current) {
        graphRef.current.d3ReheatSimulation();
      }
    }
  }, [isDragging]);

  const handleNodeDragEnd = useCallback((node: GraphNode) => {
    setIsDragging(false);
    setClickedNode(null);
    
    // Release node or keep it fixed based on selection
    if (selectedSupplierId !== node.id) {
      node.fx = null;
      node.fy = null;
    }
    
    if (graphRef.current) {
      graphRef.current.d3ReheatSimulation();
    }
  }, [selectedSupplierId]);

  // Enhanced zoom controls with better responsiveness
  const handleZoomIn = useCallback(() => {
    if (graphRef.current) {
      const newZoom = Math.min(zoomLevel * 1.3, 4);
      graphRef.current.zoom(newZoom, 300);
      setZoomLevel(newZoom);
    }
  }, [zoomLevel]);

  const handleZoomOut = useCallback(() => {
    if (graphRef.current) {
      const newZoom = Math.max(zoomLevel / 1.3, 0.2);
      graphRef.current.zoom(newZoom, 300);
      setZoomLevel(newZoom);
    }
  }, [zoomLevel]);

  const handleFitToScreen = useCallback(() => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(800, 50); // Longer duration, padding
      setZoomLevel(1);
    }
  }, []);

  // Auto-fit on data change
  useEffect(() => {
    if (graphRef.current && isInitialized && graphData.nodes.length > 0) {
      const timer = setTimeout(() => {
        handleFitToScreen();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [graphData.nodes.length, isInitialized, handleFitToScreen]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <NeumorphicHeading size="lg" className="flex items-center justify-center gap-2">
          <Network className="w-6 h-6 text-[var(--neumorphic-accent)]" />
          Supplier Network Graph
        </NeumorphicHeading>
        <NeumorphicText variant="secondary" size="sm" className="mt-1">
          Visualizing connections between suppliers and directors
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
            ({graphData.nodes.filter(n => n.type === 'supplier').length} suppliers)
          </NeumorphicText>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleZoomIn}
            className="p-2 rounded-[var(--neumorphic-radius-md)] bg-[var(--neumorphic-button)] shadow-[var(--neumorphic-shadow-convex)] hover:shadow-[var(--neumorphic-shadow-concave)]"
          >
            <ZoomIn className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleZoomOut}
            className="p-2 rounded-[var(--neumorphic-radius-md)] bg-[var(--neumorphic-button)] shadow-[var(--neumorphic-shadow-convex)] hover:shadow-[var(--neumorphic-shadow-concave)]"
          >
            <ZoomOut className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleFitToScreen}
            className="p-2 rounded-[var(--neumorphic-radius-md)] bg-[var(--neumorphic-button)] shadow-[var(--neumorphic-shadow-convex)] hover:shadow-[var(--neumorphic-shadow-concave)]"
          >
            <Maximize2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Graph Container */}
      <motion.div
        ref={containerRef}
        className="relative rounded-[var(--neumorphic-radius-lg)] bg-[var(--neumorphic-card)] shadow-[var(--neumorphic-shadow-concave)] overflow-hidden"
        style={{ height }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {isInitialized && (
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
            width={graphDimensions.width}
            height={graphDimensions.height}
            nodeLabel={() => ''} // We handle labels in custom rendering
            nodeCanvasObject={nodeCanvasObject}
            linkCanvasObject={linkCanvasObject}
            onNodeClick={handleNodeClick}
            onNodeHover={handleNodeHover}
            onNodeDragStart={handleNodeDragStart}
            onNodeDrag={handleNodeDrag}
            onNodeDragEnd={handleNodeDragEnd}
            nodeRelSize={1}
            linkDirectionalParticles={0} // Disable for better performance
            backgroundColor={getCssVariable('--neumorphic-card')}
            cooldownTicks={200}
            warmupTicks={100}
            enableNodeDrag={true}
            enableZoomInteraction={true}
            enablePanInteraction={true}
            d3Force={{
              charge: -300,
              link: 80,
              center: 0.3,
              collision: 10
            }}
          />
        )}
        
        {/* Loading State */}
        {!isInitialized && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--neumorphic-card)]">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--neumorphic-accent)]"></div>
              <NeumorphicText size="sm" variant="secondary">
                Initializing network graph...
              </NeumorphicText>
            </div>
          </div>
        )}
        
        {/* Status Indicator */}
        {isDragging && (
          <div className="absolute top-4 left-4 px-3 py-2 rounded-[var(--neumorphic-radius-md)] bg-[var(--neumorphic-card)] shadow-[var(--neumorphic-shadow-convex)] border border-[var(--neumorphic-border)]">
            <NeumorphicText size="sm" className="flex items-center gap-2">
              <Move className="w-4 h-4 text-[var(--neumorphic-accent)]" />
              Dragging node...
            </NeumorphicText>
          </div>
        )}

        {/* Enhanced Hover Info Panel */}
        <AnimatePresence>
          {hoveredNode && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-4 left-4 p-4 rounded-[var(--neumorphic-radius-md)] bg-[var(--neumorphic-card)] shadow-[var(--neumorphic-shadow-convex)] max-w-xs border border-[var(--neumorphic-border)]"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-[var(--neumorphic-radius-sm)] bg-[var(--neumorphic-button)] shadow-[var(--neumorphic-shadow-convex)]">
                  {hoveredNode.type === 'supplier' ? (
                    <Building2 className="w-5 h-5 text-[var(--neumorphic-accent)]" />
                  ) : (
                    <User className="w-5 h-5 text-[var(--neumorphic-text-secondary)]" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <NeumorphicText className="font-semibold text-base">
                      {hoveredNode.name}
                    </NeumorphicText>
                    {hoveredNode.type === 'supplier' && hoveredNode.riskCategory && (
                      <NeumorphicText size="sm" variant="secondary">
                        {hoveredNode.riskCategory}
                      </NeumorphicText>
                    )}
                    {hoveredNode.type === 'director' && (
                      <NeumorphicText size="sm" variant="secondary">
                        Board Member
                      </NeumorphicText>
                    )}
                  </div>
                  
                  {hoveredNode.type === 'supplier' && hoveredNode.riskScore !== undefined && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <AlertTriangle 
                          className="w-4 h-4" 
                          style={{ color: hoveredNode.color }}
                        />
                        <NeumorphicText size="sm">
                          Risk Score: {hoveredNode.riskScore}%
                        </NeumorphicText>
                      </div>
                      
                      {hoveredNode.contractValue && (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 flex items-center justify-center">
                            <span className="text-xs">💰</span>
                          </div>
                          <NeumorphicText size="sm">
                            Value: R{(hoveredNode.contractValue / 1000000).toFixed(1)}M
                          </NeumorphicText>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {hoveredNode.connectionsCount && (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <span className="text-xs">🔗</span>
                      </div>
                      <NeumorphicText size="sm">
                        {hoveredNode.connectionsCount} connection{hoveredNode.connectionsCount !== 1 ? 's' : ''}
                      </NeumorphicText>
                    </div>
                  )}
                  
                  <div className="pt-2 border-t border-[var(--neumorphic-border)]">
                    <NeumorphicText size="xs" variant="secondary" className="flex items-center gap-1">
                      {hoveredNode.type === 'supplier' ? (
                        <>
                          <MousePointer className="w-3 h-3" />
                          Click to select • Drag to move
                        </>
                      ) : (
                        <>
                          <Move className="w-3 h-3" />
                          Drag to move
                        </>
                      )}
                    </NeumorphicText>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Legend */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute top-4 right-4 p-4 rounded-[var(--neumorphic-radius-md)] bg-[var(--neumorphic-card)] shadow-[var(--neumorphic-shadow-convex)] border border-[var(--neumorphic-border)] min-w-[200px]"
        >
          <NeumorphicText size="sm" className="font-semibold mb-3 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Legend
          </NeumorphicText>
          
          <div className="space-y-3">
            <div className="space-y-2">
              <NeumorphicText size="xs" variant="secondary" className="font-medium">
                Risk Levels
              </NeumorphicText>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full shadow-sm"
                    style={{ backgroundColor: getCssVariable('--neumorphic-severity-critical') }}
                  />
                  <NeumorphicText size="xs">Critical (75%+) ⚠️</NeumorphicText>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full shadow-sm"
                    style={{ backgroundColor: getCssVariable('--neumorphic-severity-high') }}
                  />
                  <NeumorphicText size="xs">High (50-74%) !</NeumorphicText>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full shadow-sm"
                    style={{ backgroundColor: getCssVariable('--neumorphic-severity-medium') }}
                  />
                  <NeumorphicText size="xs">Medium (25-49%)</NeumorphicText>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full shadow-sm"
                    style={{ backgroundColor: getCssVariable('--neumorphic-severity-low') }}
                  />
                  <NeumorphicText size="xs">Low (&lt;25%)</NeumorphicText>
                </div>
              </div>
            </div>
            
            <div className="pt-3 border-t border-[var(--neumorphic-border)]">
              <NeumorphicText size="xs" variant="secondary" className="font-medium mb-2">
                Node Types
              </NeumorphicText>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[var(--neumorphic-accent)]" />
                  <NeumorphicText size="xs">Supplier</NeumorphicText>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[var(--neumorphic-text-secondary)]" />
                  <NeumorphicText size="xs">Director</NeumorphicText>
                </div>
              </div>
            </div>
            
            <div className="pt-3 border-t border-[var(--neumorphic-border)]">
              <NeumorphicText size="xs" variant="secondary" className="font-medium mb-2">
                Node Size
              </NeumorphicText>
              <NeumorphicText size="xs">
                Based on risk score, contract value, and connections
              </NeumorphicText>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div 
          className="p-4 rounded-[var(--neumorphic-radius-md)] bg-[var(--neumorphic-button)] shadow-[var(--neumorphic-shadow-convex)]"
          whileHover={{ scale: 1.02 }}
        >
          <NeumorphicText size="sm" variant="secondary">Total Nodes</NeumorphicText>
          <NeumorphicText className="text-2xl font-bold">{graphData.nodes.length}</NeumorphicText>
        </motion.div>
        <motion.div 
          className="p-4 rounded-[var(--neumorphic-radius-md)] bg-[var(--neumorphic-button)] shadow-[var(--neumorphic-shadow-convex)]"
          whileHover={{ scale: 1.02 }}
        >
          <NeumorphicText size="sm" variant="secondary">Connections</NeumorphicText>
          <NeumorphicText className="text-2xl font-bold">{graphData.links.length}</NeumorphicText>
        </motion.div>
        <motion.div 
          className="p-4 rounded-[var(--neumorphic-radius-md)] bg-[var(--neumorphic-button)] shadow-[var(--neumorphic-shadow-convex)]"
          whileHover={{ scale: 1.02 }}
        >
          <NeumorphicText size="sm" variant="secondary">High Risk</NeumorphicText>
          <NeumorphicText className="text-2xl font-bold text-[var(--neumorphic-severity-high)]">
            {graphData.nodes.filter(n => n.type === 'supplier' && n.riskScore && n.riskScore >= 50).length}
          </NeumorphicText>
        </motion.div>
      </div>
    </div>
  );
};

export default SupplierNetworkGraph;