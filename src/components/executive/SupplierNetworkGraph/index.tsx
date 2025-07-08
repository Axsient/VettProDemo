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
  ExecutiveSupplierInfo,
  suppliers,
  directors
} from '@/lib/sample-data/executive-dashboard-data';
import { 
  getCssVariable, 
  getThemeColors,
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
  const graphRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
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

  // Prepare graph data with concentration risk highlighting
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

    // Count connections for each director and supplier
    const directorConnections: Record<string, number> = {};
    const supplierConnections: Record<string, number> = {};
    
    graphSuppliers.forEach(supplier => {
      supplierConnections[supplier.id] = supplier.directorIds.length;
      supplier.directorIds.forEach(directorId => {
        directorConnections[directorId] = (directorConnections[directorId] || 0) + 1;
      });
    });

    // Identify concentration risks (directors with 3+ connections)
    const concentrationRiskDirectors = Object.entries(directorConnections)
      .filter(([, count]) => count >= 3)
      .map(([id]) => id);

    // Add supplier nodes with enhanced sizing and highlighting
    graphSuppliers.forEach(supplier => {
      const isSelected = supplier.id === selectedSupplierId;
      const riskLevel = supplier.riskScore >= 75 ? 'Critical' : 
                       supplier.riskScore >= 50 ? 'High' : 
                       supplier.riskScore >= 25 ? 'Medium' : 'Low';
      
      // Reduced node sizing to prevent overlap while maintaining visibility
      const baseSize = 8; // Smaller base size for better spacing
      const riskFactor = Math.max(1, supplier.riskScore / 25); // 1-4 multiplier
      const contractFactor = Math.max(0.5, supplier.contractValueZAR / 15000000); // 0.5-8 multiplier
      const connectionFactor = Math.max(0.5, supplierConnections[supplier.id] * 1); // Reduced emphasis on connections
      
      // Check if supplier has concentration risk directors
      const hasConcentrationRisk = supplier.directorIds.some(id => concentrationRiskDirectors.includes(id));
      const concentrationFactor = hasConcentrationRisk ? 2 : 1;
      
      const nodeSize = Math.min(20, baseSize + riskFactor + contractFactor + connectionFactor + concentrationFactor);
      
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
        fx: isSelected ? null : null,
        fy: isSelected ? null : null
      });
    });

    // Add director nodes with enhanced sizing and concentration risk highlighting
    const relevantDirectorIds = new Set<string>();
    graphSuppliers.forEach(supplier => {
      supplier.directorIds.forEach(directorId => {
        relevantDirectorIds.add(directorId);
        links.push({
          source: supplier.id,
          target: directorId,
          value: 1.2 // Increased link strength for better visibility
        });
      });
    });

    directors
      .filter(d => relevantDirectorIds.has(d.id))
      .forEach(director => {
        const connections = directorConnections[director.id] || 1;
        const isConcentrationRisk = concentrationRiskDirectors.includes(director.id);
        
        // Reduced director sizing to prevent overlap
        const baseSize = 6;
        const connectionMultiplier = isConcentrationRisk ? 2.5 : 1.5; // Smaller multiplier for better spacing
        const directorSize = Math.min(15, baseSize + connections * connectionMultiplier);
        
        // Special colors for concentration risk directors
        let directorColor = colors.textSecondary;
        if (director.id === 'DIR_04') { // Sipho Ndlovu - Major risk (4 boards)
          directorColor = getCssVariable('--neumorphic-severity-critical');
        } else if (director.id === 'DIR_06') { // Fatima Khan - Secondary risk (3 boards)
          directorColor = getCssVariable('--neumorphic-severity-high');
        } else if (isConcentrationRisk) {
          directorColor = getCssVariable('--neumorphic-severity-medium');
        }
        
        nodes.push({
          id: director.id,
          name: director.name,
          type: 'director',
          val: directorSize,
          color: directorColor,
          connectionsCount: connections
        });
      });

    // Enhanced supplier-to-supplier links through shared directors
    const directorToSuppliers: Record<string, string[]> = {};
    graphSuppliers.forEach(supplier => {
      supplier.directorIds.forEach(directorId => {
        if (!directorToSuppliers[directorId]) {
          directorToSuppliers[directorId] = [];
        }
        directorToSuppliers[directorId].push(supplier.id);
      });
    });

    // Create stronger links between suppliers with shared concentration risk directors
    Object.entries(directorToSuppliers).forEach(([directorId, supplierIds]) => {
      if (supplierIds.length > 1) {
        const isConcentrationDirector = concentrationRiskDirectors.includes(directorId);
        const linkStrength = isConcentrationDirector ? 0.8 : 0.4; // Stronger for concentration risk
        
        for (let i = 0; i < supplierIds.length - 1; i++) {
          for (let j = i + 1; j < supplierIds.length; j++) {
            links.push({
              source: supplierIds[i],
              target: supplierIds[j],
              value: linkStrength
            });
          }
        }
      }
    });

    return { nodes, links };
  }, [filteredSuppliers, selectedSupplierId, selectedMineSiteId]);

  // Enhanced node canvas rendering with concentration risk indicators
  const nodeCanvasObject = useCallback((node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const x = node.x || 0;
    const y = node.y || 0;
    const radius = node.val;
    const isHovered = hoveredNode?.id === node.id;
    const isClicked = clickedNode?.id === node.id;
    const isSelected = selectedSupplierId === node.id;
    const isHighlighted = highlightedEntityIds.includes(node.id);
    const isHoveredFromExternal = hoveredSupplierId === node.id;
    
    // Check for concentration risk
    const isConcentrationRisk = (node.type === 'director' && node.connectionsCount && node.connectionsCount >= 3);
    const isMajorConcentrationRisk = node.id === 'DIR_04'; // Sipho Ndlovu - 4 boards
    const isSecondaryConcentrationRisk = node.id === 'DIR_06'; // Fatima Khan - 3 boards
    
    // Scale-dependent sizing
    const scaledRadius = radius / globalScale;
    const borderWidth = Math.max(1, (isConcentrationRisk ? 3 : 2) / globalScale);
    const fontSize = Math.max(10, 12 / globalScale);
    const iconSize = Math.max(8, 10 / globalScale);
    
    // Enhanced visual feedback
    const glowRadius = scaledRadius + (
      isHovered ? 6 : 
      isClicked ? 4 : 
      isSelected ? 4 : 
      isConcentrationRisk ? 3 :
      isHighlighted ? 2 : 
      isHoveredFromExternal ? 2 : 0
    );
    const shadowOffset = isClicked ? 1 : 2;
    
    ctx.save();
    
    // Draw concentration risk warning aura
    if (isMajorConcentrationRisk) {
      ctx.shadowColor = 'rgba(239, 68, 68, 0.6)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      ctx.beginPath();
      ctx.arc(x, y, scaledRadius + 6, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
      ctx.fill();
    } else if (isSecondaryConcentrationRisk) {
      ctx.shadowColor = 'rgba(245, 158, 11, 0.5)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      ctx.beginPath();
      ctx.arc(x, y, scaledRadius + 4, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(245, 158, 11, 0.1)';
      ctx.fill();
    }
    
    // Draw outer glow for interactions
    if (isHovered || isClicked || isSelected || isHighlighted || isHoveredFromExternal) {
      const glowColor = isHovered ? 'rgba(79, 172, 254, 0.5)' : 
                       isClicked ? 'rgba(16, 185, 129, 0.5)' : 
                       isSelected ? 'rgba(245, 158, 11, 0.5)' :
                       isHighlighted ? 'rgba(147, 51, 234, 0.4)' :
                       isHoveredFromExternal ? 'rgba(59, 130, 246, 0.4)' :
                       'rgba(245, 158, 11, 0.4)';
      
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
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = shadowOffset;
    ctx.shadowOffsetY = shadowOffset;
    
    // Main node circle
    ctx.beginPath();
    ctx.arc(x, y, scaledRadius, 0, 2 * Math.PI);
    ctx.fillStyle = node.color;
    ctx.fill();
    
    // Enhanced border with concentration risk highlighting
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    ctx.beginPath();
    ctx.arc(x, y, scaledRadius, 0, 2 * Math.PI);
    
    let borderColor = 'rgba(255, 255, 255, 0.3)';
    if (isSelected) {
      borderColor = getCssVariable('--neumorphic-accent');
    } else if (isHovered) {
      borderColor = getCssVariable('--neumorphic-text-primary');
    } else if (isMajorConcentrationRisk) {
      borderColor = 'rgba(239, 68, 68, 0.9)';
    } else if (isSecondaryConcentrationRisk) {
      borderColor = 'rgba(245, 158, 11, 0.9)';
    } else if (isHighlighted) {
      borderColor = 'rgba(147, 51, 234, 0.8)';
    } else if (isHoveredFromExternal) {
      borderColor = 'rgba(59, 130, 246, 0.8)';
    }
    
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.stroke();
    
    // Draw enhanced icons and indicators
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    if (node.type === 'director') {
      // Special icons for concentration risk directors
      if (isMajorConcentrationRisk) {
        ctx.fillStyle = 'white';
        ctx.font = `bold ${iconSize * 1.3}px Inter, sans-serif`;
        ctx.fillText('⚠️', x, y - 2);
        ctx.font = `${iconSize * 0.7}px Inter, sans-serif`;
        ctx.fillText('4', x, y + 6);
      } else if (isSecondaryConcentrationRisk) {
        ctx.fillStyle = 'white';
        ctx.font = `bold ${iconSize * 1.2}px Inter, sans-serif`;
        ctx.fillText('⚠️', x, y - 2);
        ctx.font = `${iconSize * 0.7}px Inter, sans-serif`;
        ctx.fillText('3', x, y + 6);
      } else {
        ctx.fillStyle = 'white';
        ctx.font = `${iconSize}px Inter, sans-serif`;
        ctx.fillText('👤', x, y);
      }
    } else if (node.type === 'supplier') {
      // Enhanced risk indicators for suppliers
      if (node.riskScore && node.riskScore >= 75) {
        ctx.fillStyle = 'white';
        ctx.font = `bold ${iconSize * 1.3}px Inter, sans-serif`;
        ctx.fillText('⚠️', x, y);
      } else if (node.riskScore && node.riskScore >= 50) {
        ctx.fillStyle = 'white';
        ctx.font = `bold ${iconSize * 1.1}px Inter, sans-serif`;
        ctx.fillText('!', x, y);
      } else {
        ctx.fillStyle = 'white';
        ctx.font = `${iconSize * 0.8}px Inter, sans-serif`;
        ctx.fillText('🏢', x, y);
      }
    }
    
    // Persistent labels for concentration risk directors
    const shouldShowLabel = isHovered || isSelected || 
                           (node.type === 'director' && isConcentrationRisk && globalScale > 0.4);
    
    if (shouldShowLabel && globalScale > 0.3) {
      const label = node.name;
      const labelFontSize = Math.max(9, fontSize * 0.9);
      ctx.font = `${isConcentrationRisk ? 'bold ' : ''}${labelFontSize}px Inter, sans-serif`;
      
      // Measure text for background
      const textMetrics = ctx.measureText(label);
      const textWidth = textMetrics.width;
      const textHeight = labelFontSize;
      
      // Background positioning
      const bgPadding = 6;
      const bgX = x - (textWidth + bgPadding) / 2;
      const bgY = y - scaledRadius - textHeight - bgPadding - 8;
      const bgWidth = textWidth + bgPadding;
      const bgHeight = textHeight + bgPadding;
      
      // Draw background with concentration risk styling
      let bgColor = getCssVariable('--neumorphic-card');
      let borderColor = getCssVariable('--neumorphic-border');
      
      if (isMajorConcentrationRisk) {
        bgColor = 'rgba(239, 68, 68, 0.9)';
        borderColor = 'rgba(239, 68, 68, 1)';
      } else if (isSecondaryConcentrationRisk) {
        bgColor = 'rgba(245, 158, 11, 0.9)';
        borderColor = 'rgba(245, 158, 11, 1)';
      }
      
      ctx.fillStyle = bgColor;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      
      ctx.fillRect(bgX, bgY, bgWidth, bgHeight);
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      // Draw border
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(bgX, bgY, bgWidth, bgHeight);
      
      // Draw text
      ctx.fillStyle = isConcentrationRisk ? 'white' : getCssVariable('--neumorphic-text-primary');
      ctx.fillText(label, x, bgY + bgHeight / 2);
    }
    
    ctx.restore();
  }, [selectedSupplierId, hoveredNode, clickedNode, highlightedEntityIds, hoveredSupplierId]);

  // Enhanced link canvas rendering with improved visibility
  const linkCanvasObject = useCallback((link: { source: { x: number; y: number }; target: { x: number; y: number }; value: number }, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const colors = getThemeColors();
    const lineWidth = Math.max(1, link.value * 1.5 / globalScale); // Thicker lines
    
    // Improved opacity for better visibility
    const alpha = link.value >= 1.0 ? 0.8 : // Direct connections highly visible
                  link.value >= 0.7 ? 0.7 : // Concentration risk connections
                  link.value >= 0.4 ? 0.6 : // Shared director connections
                  0.4; // Minimum visibility
    
    ctx.save();
    
    // Enhanced colors based on connection strength
    let strokeColor = colors.border;
    if (link.value >= 1.0) {
      strokeColor = colors.textPrimary; // Direct connections
    } else if (link.value >= 0.7) {
      strokeColor = getCssVariable('--neumorphic-accent'); // Concentration risk
    } else if (link.value >= 0.4) {
      strokeColor = colors.textSecondary; // Shared directors
    }
    
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.globalAlpha = alpha;
    
    // Add enhanced gradient for stronger connections
    if (link.value >= 0.7 && 
        isFinite(link.source.x) && isFinite(link.source.y) && 
        isFinite(link.target.x) && isFinite(link.target.y)) {
      try {
        const gradient = ctx.createLinearGradient(
          link.source.x, link.source.y,
          link.target.x, link.target.y
        );
        
        if (link.value >= 1.0) {
          // Direct connections - strong gradient
          gradient.addColorStop(0, colors.textPrimary);
          gradient.addColorStop(0.5, getCssVariable('--neumorphic-accent'));
          gradient.addColorStop(1, colors.textPrimary);
        } else {
          // Concentration risk connections
          gradient.addColorStop(0, getCssVariable('--neumorphic-accent'));
          gradient.addColorStop(0.5, colors.textSecondary);
          gradient.addColorStop(1, getCssVariable('--neumorphic-accent'));
        }
        
        ctx.strokeStyle = gradient;
      } catch {
        // Fallback to solid color if gradient fails
        ctx.strokeStyle = strokeColor;
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

  // Enhanced event handlers with improved responsiveness
  const handleNodeClick = useCallback((node: GraphNode) => {
    // Debug logging to ensure clicks are being detected
    console.log('Node clicked:', node?.id, node?.name, node?.type);
    
    setClickedNode(node);
    
    if (node.type === 'supplier') {
      const supplierData = suppliers.find(s => s.id === node.id);
      if (supplierData && onNodeClick) {
        onNodeClick(node);
      }
    }
    
    // Improved visual feedback - removed problematic timeout
    requestAnimationFrame(() => {
      setClickedNode(null);
    });
  }, [onNodeClick]);

  const handleNodeHover = useCallback((node: GraphNode | null) => {
    // Debug logging to ensure hover is being detected
    console.log('Node hover:', node?.id, node?.name, node?.type);
    
    // Always update hover state for ALL nodes (suppliers and directors)
    setHoveredNode(node);
    
    // Call parent hover handler for suppliers only
    if (node?.type === 'supplier') {
      onNodeHover?.(node.id);
    } else {
      onNodeHover?.(null);
    }
  }, [onNodeHover]);

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

  // Improved auto-fit on data change with better positioning
  useEffect(() => {
    if (graphRef.current && isInitialized && graphData.nodes.length > 0) {
      const timer = setTimeout(() => {
        // Center the view and apply optimal zoom
        graphRef.current.centerAt(0, 0, 300);
        setTimeout(() => {
          handleFitToScreen();
        }, 100);
      }, 600);
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
            nodeRelSize={4}
            linkDirectionalParticles={0} // Disable for better performance
            backgroundColor={getCssVariable('--neumorphic-card')}
            cooldownTicks={200} // More time to settle into proper positions
            warmupTicks={100}   // More time for initial spreading
            onEngineStop={() => {
              // Auto-fit to show all nodes after layout settles
              if (graphRef.current) {
                setTimeout(() => {
                  graphRef.current?.zoomToFit(400, 50);
                }, 100);
              }
            }}
            enableNodeDrag={true}
            enableZoomInteraction={true}
            enablePanInteraction={true}
            d3ForceConfig={{
              charge: { strength: -2500, distanceMax: 500 }, // Much stronger repulsion to separate nodes
              link: { distance: 200, iterations: 3 }, // Much longer links to spread nodes far apart
              center: { strength: 0.05 }, // Very weak centering to allow maximum spreading
              collide: { strength: 2, radius: 40 }, // Stronger collision with larger radius to prevent overlap
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

        {/* Enhanced Hover Info Panel with Concentration Risk Alerts */}
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
                  
                  {/* Concentration Risk Alert */}
                  {hoveredNode.type === 'director' && hoveredNode.connectionsCount && hoveredNode.connectionsCount >= 3 && (
                    <div className={`p-2 rounded-[var(--neumorphic-radius-sm)] ${
                      hoveredNode.id === 'DIR_04' ? 'bg-red-100 border border-red-300' :
                      hoveredNode.id === 'DIR_06' ? 'bg-yellow-100 border border-yellow-300' :
                      'bg-orange-100 border border-orange-300'
                    }`}>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={`w-4 h-4 ${
                          hoveredNode.id === 'DIR_04' ? 'text-red-600' :
                          hoveredNode.id === 'DIR_06' ? 'text-yellow-600' :
                          'text-orange-600'
                        }`} />
                        <NeumorphicText size="sm" className={`font-medium ${
                          hoveredNode.id === 'DIR_04' ? 'text-red-800' :
                          hoveredNode.id === 'DIR_06' ? 'text-yellow-800' :
                          'text-orange-800'
                        }`}>
                          {hoveredNode.id === 'DIR_04' ? 'CRITICAL CONCENTRATION RISK' :
                           hoveredNode.id === 'DIR_06' ? 'SECONDARY CONCENTRATION RISK' :
                           'CONCENTRATION RISK'}
                        </NeumorphicText>
                      </div>
                      <NeumorphicText size="xs" className={`mt-1 ${
                        hoveredNode.id === 'DIR_04' ? 'text-red-700' :
                        hoveredNode.id === 'DIR_06' ? 'text-yellow-700' :
                        'text-orange-700'
                      }`}>
                        {hoveredNode.id === 'DIR_04' ? 
                         'Sits on 4 supplier boards - creates unprecedented risk exposure' :
                         hoveredNode.id === 'DIR_06' ?
                         'Sits on 3 supplier boards - secondary concentration risk' :
                         `Sits on ${hoveredNode.connectionsCount} supplier boards - requires monitoring`}
                      </NeumorphicText>
                    </div>
                  )}
                  
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
                        {hoveredNode.type === 'director' && hoveredNode.connectionsCount >= 3 && (
                          <span className="ml-1 text-red-600 font-medium">⚠️</span>
                        )}
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

        {/* Compact Legend */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute top-4 right-4 p-3 rounded-lg bg-[var(--neumorphic-card)] shadow-md border border-[var(--neumorphic-border)] w-48 max-h-64 overflow-y-auto text-xs"
        >
          <NeumorphicText size="xs" className="font-semibold mb-2 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Legend
          </NeumorphicText>
          
          <div className="space-y-2">
            <div>
              <NeumorphicText size="xs" className="font-medium mb-1">Risk Levels</NeumorphicText>
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <NeumorphicText size="xs">Critical (75%+)</NeumorphicText>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <NeumorphicText size="xs">High (50-74%)</NeumorphicText>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <NeumorphicText size="xs">Medium (25-49%)</NeumorphicText>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <NeumorphicText size="xs">Low (&lt;25%)</NeumorphicText>
                </div>
              </div>
            </div>
            
            <div className="pt-2 border-t border-[var(--neumorphic-border)]">
              <NeumorphicText size="xs" className="font-medium mb-1">Nodes</NeumorphicText>
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded" />
                  <NeumorphicText size="xs">Supplier</NeumorphicText>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full" />
                  <NeumorphicText size="xs">Director</NeumorphicText>
                </div>
              </div>
            </div>
            
            <div className="pt-2 border-t border-[var(--neumorphic-border)]">
              <NeumorphicText size="xs" className="font-medium mb-1">Concentration</NeumorphicText>
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <span className="text-red-500 text-xs">⚠</span>
                  <NeumorphicText size="xs">Critical (4+ boards)</NeumorphicText>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-orange-500 text-xs">△</span>
                  <NeumorphicText size="xs">Secondary (3 boards)</NeumorphicText>
                </div>
              </div>
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
          <NeumorphicText size="sm" variant="secondary">Concentration Risks</NeumorphicText>
          <NeumorphicText className="text-2xl font-bold text-[var(--neumorphic-severity-critical)]">
            {graphData.nodes.filter(n => n.type === 'director' && n.connectionsCount && n.connectionsCount >= 3).length}
          </NeumorphicText>
          <NeumorphicText size="xs" variant="secondary" className="mt-1">
            Directors on 3+ boards
          </NeumorphicText>
        </motion.div>
      </div>
    </div>
  );
};

export default SupplierNetworkGraph;