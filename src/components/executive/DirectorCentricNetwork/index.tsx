'use client';

import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NeumorphicText, NeumorphicHeading, NeumorphicCard, NeumorphicButton } from '@/components/ui/neumorphic';
import { 
  RiskCategory,
  ExecutiveSupplierInfo,
  Director,
  suppliers,
  directors
} from '@/lib/sample-data/executive-dashboard-data';
import { getCssVariable, getSeverityColor } from '@/lib/executive/theme-bridge';
import { applyRiskScoring } from '@/lib/executive/apply-risk-scoring';
import { 
  Building2, 
  User, 
  AlertTriangle,
  MousePointer,
  ArrowLeft,
  Home,
  Info,
  ChevronRight,
  ChevronUp,
  Target,
  Users
} from 'lucide-react';

interface DirectorCentricNetworkProps {
  activeFilter?: RiskCategory | null;
  onNodeClick?: (nodeData: NetworkNode) => void;
  onNodeHover?: (supplierId: string | null) => void;
  selectedSupplierId?: string | null;
  selectedMineSiteId?: string | null;
  highlightedEntityIds?: string[];
  hoveredSupplierId?: string | null;
  filteredSuppliers?: ExecutiveSupplierInfo[];
  className?: string;
  height?: string;
}

interface NetworkNode {
  id: string;
  name: string;
  type: 'company' | 'director' | 'supplier';
  riskScore?: number;
  riskLevel?: 'Critical' | 'High' | 'Medium' | 'Low';
  boardCount?: number;
  contractValue?: number;
  category?: string;
  directorIds?: string[];
  x: number;
  y: number;
  radius: number;
  color: string;
  isConcentrationRisk?: boolean;
}

interface DirectorProfile {
  director: Director;
  suppliers: ExecutiveSupplierInfo[];
  boardCount: number;
  totalExposure: number;
  avgRiskScore: number;
  maxRiskScore: number;
  isConcentrationRisk: boolean;
}

type ViewState = 'director-overview' | 'supplier-overview' | 'director-focus' | 'supplier-focus';
type NetworkMode = 'director-centric' | 'supplier-centric';

// SVG dimensions for collision detection
const SVG_WIDTH = 800;
const SVG_HEIGHT = 600;

// Layout constants
const CENTER_X = SVG_WIDTH / 2;
const CENTER_Y = SVG_HEIGHT / 2;

interface ViewHistory {
  state: ViewState;
  mode: NetworkMode;
  focusId?: string;
  timestamp: number;
}

const DirectorCentricNetwork: React.FC<DirectorCentricNetworkProps> = ({
  onNodeClick,
  onNodeHover,
  selectedSupplierId,
  selectedMineSiteId,
  highlightedEntityIds = [],
  filteredSuppliers = suppliers,
  className = '',
  height = '600px'
}) => {
  const [networkMode, setNetworkMode] = useState<NetworkMode>('director-centric');
  const [viewState, setViewState] = useState<ViewState>('director-overview');
  const [focusedDirectorId, setFocusedDirectorId] = useState<string | null>(null);
  const [focusedSupplierId, setFocusedSupplierId] = useState<string | null>(null);
  const [viewHistory, setViewHistory] = useState<ViewHistory[]>([{ state: 'director-overview', mode: 'director-centric', timestamp: Date.now() }]);
  const [hoveredNode, setHoveredNode] = useState<NetworkNode | null>(null);
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'transitioning'>('idle');
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(false);
  
  // Zoom and Pan state
  const [transform, setTransform] = useState({ scale: 1.5, translateX: 0, translateY: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastTransform, setLastTransform] = useState({ translateX: 0, translateY: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate proper risk scores using the risk scoring engine
  const riskScoringResults = useMemo(() => {
    return applyRiskScoring();
  }, []);

  // Process directors and their relationships
  const directorProfiles = useMemo<DirectorProfile[]>(() => {
    let processSuppliers = filteredSuppliers;
    
    if (selectedMineSiteId) {
      processSuppliers = processSuppliers.filter(s => 
        s.linkedMineSiteIds.includes(selectedMineSiteId)
      );
    }

    const profiles: DirectorProfile[] = [];
    const directorToSuppliers: Record<string, ExecutiveSupplierInfo[]> = {};

    processSuppliers.forEach(supplier => {
      supplier.directorIds.forEach(directorId => {
        if (!directorToSuppliers[directorId]) {
          directorToSuppliers[directorId] = [];
        }
        directorToSuppliers[directorId].push(supplier);
      });
    });

    Object.entries(directorToSuppliers).forEach(([directorId, dirSuppliers]) => {
      const director = directors.find(d => d.id === directorId);
      if (!director || dirSuppliers.length === 0) return;

      const boardCount = dirSuppliers.length;
      const totalExposure = dirSuppliers.reduce((sum, s) => sum + s.contractValueZAR, 0);
      
      // Use risk scoring engine result instead of simple average
      const directorRiskResult = riskScoringResults.directors.find(d => d.id === directorId);
      const avgRiskScore = directorRiskResult ? directorRiskResult.riskScore : 
                          dirSuppliers.reduce((sum, s) => sum + s.riskScore, 0) / dirSuppliers.length;
      
      const maxRiskScore = Math.max(...dirSuppliers.map(s => s.riskScore));

      profiles.push({
        director,
        suppliers: dirSuppliers,
        boardCount,
        totalExposure,
        avgRiskScore,
        maxRiskScore,
        isConcentrationRisk: boardCount >= 3
      });
    });

    return profiles.sort((a, b) => b.boardCount - a.boardCount);
  }, [filteredSuppliers, selectedMineSiteId, riskScoringResults]);

  // Process suppliers for supplier-centric view
  const supplierProfiles = useMemo(() => {
    let processSuppliers = filteredSuppliers;
    
    if (selectedMineSiteId) {
      processSuppliers = processSuppliers.filter(s => 
        s.linkedMineSiteIds.includes(selectedMineSiteId)
      );
    }

    return processSuppliers
      .map(supplier => ({
        ...supplier,
        riskLevel: supplier.riskScore >= 75 ? 'Critical' :
                  supplier.riskScore >= 50 ? 'High' :
                  supplier.riskScore >= 25 ? 'Medium' : 'Low' as 'Critical' | 'High' | 'Medium' | 'Low',
        connectedDirectors: supplier.directorIds.map(id => directors.find(d => d.id === id)).filter(Boolean) as Director[],
        isHighValue: supplier.contractValueZAR > 50000000,
        isMultiDirector: supplier.directorIds.length > 1
      }))
      .sort((a, b) => {
        // Sort by risk score first, then by contract value
        if (a.riskScore !== b.riskScore) {
          return b.riskScore - a.riskScore;
        }
        return b.contractValueZAR - a.contractValueZAR;
      });
  }, [filteredSuppliers, selectedMineSiteId]);

  // Generate nodes based on current view state
  const networkNodes = useMemo<NetworkNode[]>(() => {
    const nodes: NetworkNode[] = [];

    if (viewState === 'director-overview') {
      // Company node at center
      nodes.push({
        id: 'sibanye',
        name: 'Sibanye-Stillwater',
        type: 'company',
        x: CENTER_X,
        y: CENTER_Y,
        radius: 50,
        color: getCssVariable('--neumorphic-accent')
      });

      // Director nodes in a circle
      const directorRadius = 200;
      directorProfiles.forEach((profile, index) => {
        const angle = (index / directorProfiles.length) * 2 * Math.PI;
        const x = CENTER_X + directorRadius * Math.cos(angle);
        const y = CENTER_Y + directorRadius * Math.sin(angle);
        
        // Node size based on board count and risk
        const baseSize = 20;
        const sizeMultiplier = profile.isConcentrationRisk ? 2 : 1.5;
        const radius = baseSize + (profile.boardCount * 5 * sizeMultiplier);

        let color = getCssVariable('--neumorphic-text-secondary');
        if (profile.boardCount >= 4) {
          color = getCssVariable('--neumorphic-severity-critical');
        } else if (profile.boardCount >= 3) {
          color = getCssVariable('--neumorphic-severity-high');
        } else if (profile.avgRiskScore >= 50) {
          color = getCssVariable('--neumorphic-severity-medium');
        }

        nodes.push({
          id: profile.director.id,
          name: profile.director.name,
          type: 'director',
          boardCount: profile.boardCount,
          riskScore: profile.avgRiskScore,
          x,
          y,
          radius,
          color,
          isConcentrationRisk: profile.isConcentrationRisk
        });

        // Add small supplier indicators around directors
        const supplierRadius = radius + 30;
        profile.suppliers.forEach((supplier, sIndex) => {
          const sAngle = angle + ((sIndex - (profile.suppliers.length - 1) / 2) * 0.2);
          const sx = x + supplierRadius * Math.cos(sAngle);
          const sy = y + supplierRadius * Math.sin(sAngle);

          // Use composite key to ensure uniqueness when suppliers appear for multiple directors
          const nodeId = `${supplier.id}-${profile.director.id}`;
          
          nodes.push({
            id: nodeId,
            name: supplier.name,
            type: 'supplier',
            riskScore: supplier.riskScore,
            riskLevel: supplier.riskScore >= 75 ? 'Critical' :
                      supplier.riskScore >= 50 ? 'High' :
                      supplier.riskScore >= 25 ? 'Medium' : 'Low',
            contractValue: supplier.contractValueZAR,
            category: supplier.category,
            directorIds: supplier.directorIds,
            x: sx,
            y: sy,
            radius: 8,
            color: getSeverityColor(
              supplier.riskScore >= 75 ? 'Critical' :
              supplier.riskScore >= 50 ? 'High' :
              supplier.riskScore >= 25 ? 'Medium' : 'Low'
            )
          });
        });
      });
    } else if (viewState === 'supplier-overview') {
      // Company node at center
      nodes.push({
        id: 'sibanye',
        name: 'Sibanye-Stillwater',
        type: 'company',
        x: CENTER_X,
        y: CENTER_Y,
        radius: 40,
        color: getCssVariable('--neumorphic-accent')
      });

      // Dynamic supplier node layout with proper spacing
      const allSuppliers = [...supplierProfiles];
      const baseRingRadius = 200;
      const ringSpacing = 150;
      let currentRing = 0;
      let currentRingNodes = 0;
      
      allSuppliers.forEach((supplier) => {
        // Calculate required space for this node (node + label + margins)
        const nodeRadius = 15 + ((supplier.contractValueZAR / Math.max(...supplierProfiles.map(s => s.contractValueZAR))) * 20);
        const labelWidth = supplier.name.length * 8; // Approximate label width
        const requiredSpace = Math.max(nodeRadius * 2 + 40, labelWidth + 20); // Space needed including margins
        
        // Calculate current ring radius and circumference
        const ringRadius = baseRingRadius + (currentRing * ringSpacing);
        const circumference = 2 * Math.PI * ringRadius;
        
        // Calculate maximum nodes that can fit in current ring
        const maxNodesInRing = Math.floor(circumference / requiredSpace);
        
        // If current ring is full, move to next ring
        if (currentRingNodes >= maxNodesInRing) {
          currentRing++;
          currentRingNodes = 0;
        }
        
        // Calculate position in current ring
        const finalRingRadius = baseRingRadius + (currentRing * ringSpacing);
        const angle = (currentRingNodes / Math.max(maxNodesInRing, 1)) * 2 * Math.PI;
        const x = CENTER_X + finalRingRadius * Math.cos(angle);
        const y = CENTER_Y + finalRingRadius * Math.sin(angle);
        
        currentRingNodes++;
        
        // Create supplier node with calculated position
        nodes.push({
          id: supplier.id,
          name: supplier.name,
          type: 'supplier',
          riskScore: supplier.riskScore,
          riskLevel: supplier.riskLevel,
          contractValue: supplier.contractValueZAR,
          category: supplier.category,
          directorIds: supplier.directorIds,
          x,
          y,
          radius: nodeRadius,
          color: getSeverityColor(supplier.riskLevel)
        });

        // Add connected directors as smaller nodes around suppliers
        supplier.connectedDirectors.forEach((director, dIndex) => {
          const directorRadius = nodeRadius + 70;
          const directorAngle = angle + ((dIndex - (supplier.connectedDirectors.length - 1) / 2) * 1.0);
          const dx = x + directorRadius * Math.cos(directorAngle);
          const dy = y + directorRadius * Math.sin(directorAngle);

          // Check if this director is a concentration risk
          const directorProfile = directorProfiles.find(p => p.director.id === director.id);
          const isConcentrationRisk = directorProfile?.isConcentrationRisk || false;

          // Use composite ID to avoid duplicates
          const directorNodeId = `${director.id}-${supplier.id}`;
          
          nodes.push({
            id: directorNodeId,
            name: director.name,
            type: 'director',
            boardCount: directorProfile?.boardCount || 1,
            riskScore: directorProfile?.avgRiskScore || 0,
            x: dx,
            y: dy,
            radius: isConcentrationRisk ? 12 : 8,
            color: isConcentrationRisk ? 
              getCssVariable('--neumorphic-severity-critical') : 
              getCssVariable('--neumorphic-text-secondary'),
            isConcentrationRisk
          });
        });
      });
    } else if (viewState === 'supplier-focus' && focusedSupplierId) {
      // Focused supplier at center
      const supplier = supplierProfiles.find(s => s.id === focusedSupplierId);
      if (supplier) {
        nodes.push({
          id: supplier.id,
          name: supplier.name,
          type: 'supplier',
          riskScore: supplier.riskScore,
          riskLevel: supplier.riskLevel,
          contractValue: supplier.contractValueZAR,
          category: supplier.category,
          directorIds: supplier.directorIds,
          x: CENTER_X,
          y: CENTER_Y,
          radius: 40,
          color: getSeverityColor(supplier.riskLevel)
        });

        // Connected directors in a circle
        const directorRadius = 180;
        supplier.connectedDirectors.forEach((director, index) => {
          const angle = (index / supplier.connectedDirectors.length) * 2 * Math.PI;
          const x = CENTER_X + directorRadius * Math.cos(angle);
          const y = CENTER_Y + directorRadius * Math.sin(angle);
          
          const directorProfile = directorProfiles.find(p => p.director.id === director.id);
          const isConcentrationRisk = directorProfile?.isConcentrationRisk || false;

          nodes.push({
            id: director.id,
            name: director.name,
            type: 'director',
            boardCount: directorProfile?.boardCount || 1,
            riskScore: directorProfile?.avgRiskScore || 0,
            x,
            y,
            radius: isConcentrationRisk ? 25 : 20,
            color: isConcentrationRisk ? 
              getCssVariable('--neumorphic-severity-critical') : 
              getCssVariable('--neumorphic-text-secondary'),
            isConcentrationRisk
          });

          // Add other suppliers connected to this director
          if (directorProfile) {
            const otherSuppliers = directorProfile.suppliers.filter(s => s.id !== focusedSupplierId);
            const supplierRadius = 60;
            
            otherSuppliers.forEach((otherSupplier, sIndex) => {
              const supplierAngle = angle + ((sIndex - (otherSuppliers.length - 1) / 2) * 0.4);
              const sx = x + supplierRadius * Math.cos(supplierAngle);
              const sy = y + supplierRadius * Math.sin(supplierAngle);

              nodes.push({
                id: `${otherSupplier.id}-${director.id}`,
                name: otherSupplier.name,
                type: 'supplier',
                riskScore: otherSupplier.riskScore,
                riskLevel: otherSupplier.riskScore >= 75 ? 'Critical' :
                          otherSupplier.riskScore >= 50 ? 'High' :
                          otherSupplier.riskScore >= 25 ? 'Medium' : 'Low',
                contractValue: otherSupplier.contractValueZAR,
                category: otherSupplier.category,
                directorIds: otherSupplier.directorIds,
                x: sx,
                y: sy,
                radius: 12,
                color: getSeverityColor(
                  otherSupplier.riskScore >= 75 ? 'Critical' :
                  otherSupplier.riskScore >= 50 ? 'High' :
                  otherSupplier.riskScore >= 25 ? 'Medium' : 'Low'
                )
              });
            });
          }
        });
      }
    } else if (viewState === 'director-focus' && focusedDirectorId) {
      // Focused director at center
      const profile = directorProfiles.find(p => p.director.id === focusedDirectorId);
      if (profile) {
        nodes.push({
          id: profile.director.id,
          name: profile.director.name,
          type: 'director',
          boardCount: profile.boardCount,
          riskScore: profile.avgRiskScore,
          x: CENTER_X,
          y: CENTER_Y,
          radius: 40,
          color: profile.isConcentrationRisk ? 
            getCssVariable('--neumorphic-severity-critical') : 
            getCssVariable('--neumorphic-accent'),
          isConcentrationRisk: profile.isConcentrationRisk
        });

        // Suppliers in a circle around the director
        const supplierRadius = 180;
        profile.suppliers.forEach((supplier, index) => {
          const angle = (index / profile.suppliers.length) * 2 * Math.PI;
          const x = CENTER_X + supplierRadius * Math.cos(angle);
          const y = CENTER_Y + supplierRadius * Math.sin(angle);
          
          const maxContract = Math.max(...profile.suppliers.map(s => s.contractValueZAR));
          const radiusScale = 15 + ((supplier.contractValueZAR / maxContract) * 20);

          nodes.push({
            id: supplier.id,
            name: supplier.name,
            type: 'supplier',
            riskScore: supplier.riskScore,
            riskLevel: supplier.riskScore >= 75 ? 'Critical' :
                      supplier.riskScore >= 50 ? 'High' :
                      supplier.riskScore >= 25 ? 'Medium' : 'Low',
            contractValue: supplier.contractValueZAR,
            category: supplier.category,
            directorIds: supplier.directorIds,
            x,
            y,
            radius: radiusScale,
            color: getSeverityColor(
              supplier.riskScore >= 75 ? 'Critical' :
              supplier.riskScore >= 50 ? 'High' :
              supplier.riskScore >= 25 ? 'Medium' : 'Low'
            )
          });
        });

        // Add other directors who share suppliers
        const sharedDirectors = new Set<string>();
        profile.suppliers.forEach(supplier => {
          supplier.directorIds.forEach(dirId => {
            if (dirId !== focusedDirectorId) {
              sharedDirectors.add(dirId);
            }
          });
        });

        const outerRadius = 300;
        Array.from(sharedDirectors).forEach((dirId, index) => {
          const dir = directors.find(d => d.id === dirId);
          if (!dir) return;

          const angle = (index / sharedDirectors.size) * 2 * Math.PI;
          const x = CENTER_X + outerRadius * Math.cos(angle);
          const y = CENTER_Y + outerRadius * Math.sin(angle);

          nodes.push({
            id: dir.id,
            name: dir.name,
            type: 'director',
            x,
            y,
            radius: 15,
            color: getCssVariable('--neumorphic-text-secondary')
          });
        });
      }
    }

    return nodes;
  }, [viewState, focusedDirectorId, focusedSupplierId, directorProfiles, supplierProfiles, CENTER_X, CENTER_Y]);

  // Zoom and Pan functionality
  const zoomIn = useCallback(() => {
    if (!containerRef.current) return;
    
    const scaleFactor = 1.2;
    const newScale = Math.min(transform.scale * scaleFactor, 3);
    
    // Use container dimensions for proper centering
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const scaleChange = newScale / transform.scale;
    const newTranslateX = centerX - (centerX - transform.translateX) * scaleChange;
    const newTranslateY = centerY - (centerY - transform.translateY) * scaleChange;
    
    setTransform({
      scale: newScale,
      translateX: newTranslateX,
      translateY: newTranslateY
    });
  }, [transform]);

  const zoomOut = useCallback(() => {
    if (!containerRef.current) return;
    
    const scaleFactor = 1 / 1.2;
    const newScale = Math.max(transform.scale * scaleFactor, 0.5);
    
    // Use container dimensions for proper centering
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const scaleChange = newScale / transform.scale;
    const newTranslateX = centerX - (centerX - transform.translateX) * scaleChange;
    const newTranslateY = centerY - (centerY - transform.translateY) * scaleChange;
    
    setTransform({
      scale: newScale,
      translateX: newTranslateX,
      translateY: newTranslateY
    });
  }, [transform]);

  const resetZoom = useCallback(() => {
    setTransform({ scale: 1.5, translateX: 0, translateY: 0 });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setLastTransform({ translateX: transform.translateX, translateY: transform.translateY });
  }, [transform]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    setTransform(prev => ({
      ...prev,
      translateX: lastTransform.translateX + deltaX,
      translateY: lastTransform.translateY + deltaY
    }));
  }, [isDragging, dragStart, lastTransform]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Proper wheel event handling to prevent page scrolling
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!containerRef.current) return;
      
      // Check if the mouse is over the container
      const rect = containerRef.current.getBoundingClientRect();
      const isOverContainer = e.clientX >= rect.left && e.clientX <= rect.right && 
                             e.clientY >= rect.top && e.clientY <= rect.bottom;
      
      if (isOverContainer) {
        e.preventDefault();
        e.stopPropagation();
        
        const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.min(Math.max(transform.scale * scaleFactor, 0.5), 3);
        
        // Calculate center-point zooming
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Adjust translation to keep zoom centered
        const scaleChange = newScale / transform.scale;
        const newTranslateX = centerX - (centerX - transform.translateX) * scaleChange;
        const newTranslateY = centerY - (centerY - transform.translateY) * scaleChange;
        
        setTransform({
          scale: newScale,
          translateX: newTranslateX,
          translateY: newTranslateY
        });
      }
    };

    // Add wheel event listener to document to capture all wheel events
    document.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, [transform]);

  // Generate connections between nodes
  const connections = useMemo(() => {
    const links: Array<{ source: string; target: string; strength: number; type: string }> = [];

    if (viewState === 'director-overview') {
      // Connect company to directors
      directorProfiles.forEach(profile => {
        links.push({
          source: 'sibanye',
          target: profile.director.id,
          strength: profile.isConcentrationRisk ? 3 : 1,
          type: 'company-director'
        });

        // Connect directors to their suppliers (using composite IDs)
        profile.suppliers.forEach(supplier => {
          const supplierNodeId = `${supplier.id}-${profile.director.id}`;
          links.push({
            source: profile.director.id,
            target: supplierNodeId,
            strength: supplier.riskScore >= 75 ? 2 : 1,
            type: 'director-supplier'
          });
        });
      });

      // Connect directors who share suppliers
      directorProfiles.forEach((profile1, i) => {
        directorProfiles.slice(i + 1).forEach(profile2 => {
          const sharedSuppliers = profile1.suppliers.filter(s1 =>
            profile2.suppliers.some(s2 => s2.id === s1.id)
          );
          if (sharedSuppliers.length > 0) {
            links.push({
              source: profile1.director.id,
              target: profile2.director.id,
              strength: sharedSuppliers.length,
              type: 'shared-suppliers'
            });
          }
        });
      });
    } else if (viewState === 'director-focus' && focusedDirectorId) {
      const profile = directorProfiles.find(p => p.director.id === focusedDirectorId);
      if (profile) {
        // Connect focused director to suppliers
        profile.suppliers.forEach(supplier => {
          links.push({
            source: focusedDirectorId,
            target: supplier.id,
            strength: supplier.riskScore >= 75 ? 3 : 2,
            type: 'director-supplier'
          });

          // Connect suppliers to other directors
          supplier.directorIds.forEach(dirId => {
            if (dirId !== focusedDirectorId && networkNodes.some(n => n.id === dirId)) {
              links.push({
                source: supplier.id,
                target: dirId,
                strength: 1,
                type: 'supplier-otherdirector'
              });
            }
          });
        });
      }
    } else if (viewState === 'supplier-overview') {
      // Connect company to suppliers
      supplierProfiles.forEach(supplier => {
        const strength = supplier.riskScore >= 75 ? 3 : 
                        supplier.riskScore >= 50 ? 2 : 1;
        links.push({
          source: 'sibanye',
          target: supplier.id,
          strength,
          type: 'company-supplier'
        });

        // Connect suppliers to their directors (using composite IDs)
        supplier.connectedDirectors.forEach(director => {
          const directorNodeId = `${director.id}-${supplier.id}`;
          links.push({
            source: supplier.id,
            target: directorNodeId,
            strength: supplier.isMultiDirector ? 2 : 1,
            type: 'supplier-director'
          });
        });
      });

      // Connect suppliers who share directors
      supplierProfiles.forEach((supplier1, i) => {
        supplierProfiles.slice(i + 1).forEach(supplier2 => {
          const sharedDirectors = supplier1.directorIds.filter(id =>
            supplier2.directorIds.includes(id)
          );
          if (sharedDirectors.length > 0) {
            // Check if any shared director is a concentration risk
            const hasConcentrationRisk = sharedDirectors.some(id => 
              directorProfiles.find(p => p.director.id === id)?.isConcentrationRisk
            );
            
            links.push({
              source: supplier1.id,
              target: supplier2.id,
              strength: hasConcentrationRisk ? 3 : sharedDirectors.length,
              type: 'shared-directors'
            });
          }
        });
      });
    } else if (viewState === 'supplier-focus' && focusedSupplierId) {
      const supplier = supplierProfiles.find(s => s.id === focusedSupplierId);
      if (supplier) {
        // Connect focused supplier to directors
        supplier.connectedDirectors.forEach(director => {
          links.push({
            source: focusedSupplierId,
            target: director.id,
            strength: supplier.riskScore >= 75 ? 3 : 2,
            type: 'supplier-director'
          });

          // Connect directors to their other suppliers
          const directorProfile = directorProfiles.find(p => p.director.id === director.id);
          if (directorProfile) {
            directorProfile.suppliers.forEach(otherSupplier => {
              if (otherSupplier.id !== focusedSupplierId) {
                const otherSupplierNodeId = `${otherSupplier.id}-${director.id}`;
                links.push({
                  source: director.id,
                  target: otherSupplierNodeId,
                  strength: otherSupplier.riskScore >= 75 ? 2 : 1,
                  type: 'director-othersupplier'
                });
              }
            });
          }
        });
      }
    }

    // Connection generation complete
    
    return links;
  }, [viewState, focusedDirectorId, focusedSupplierId, directorProfiles, supplierProfiles, networkNodes]);

  // Navigation functions
  const navigateTo = useCallback((newState: ViewState, focusId?: string) => {
    setAnimationPhase('transitioning');
    
    setTimeout(() => {
      setViewState(newState);
      if (newState === 'director-focus') {
        setFocusedDirectorId(focusId || null);
        setFocusedSupplierId(null);
      } else if (newState === 'supplier-focus') {
        setFocusedSupplierId(focusId || null);
        setFocusedDirectorId(null);
      } else {
        setFocusedDirectorId(null);
        setFocusedSupplierId(null);
      }
      
      const newHistory = [...viewHistory, { state: newState, mode: networkMode, focusId, timestamp: Date.now() }];
      setViewHistory(newHistory.slice(-5)); // Keep last 5 states
      
      setTimeout(() => setAnimationPhase('idle'), 300);
    }, 300);
  }, [viewHistory, networkMode]);

  const navigateBack = useCallback(() => {
    if (viewHistory.length > 1) {
      const newHistory = viewHistory.slice(0, -1);
      const previousState = newHistory[newHistory.length - 1];
      
      setAnimationPhase('transitioning');
      setTimeout(() => {
        setViewState(previousState.state);
        if (previousState.state === 'director-focus') {
          setFocusedDirectorId(previousState.focusId || null);
        } else if (previousState.state === 'supplier-focus') {
          setFocusedSupplierId(previousState.focusId || null);
        } else {
          setFocusedDirectorId(null);
          setFocusedSupplierId(null);
        }
        setViewHistory(newHistory);
        setTimeout(() => setAnimationPhase('idle'), 300);
      }, 300);
    }
  }, [viewHistory]);

  const resetView = useCallback(() => {
    const overviewState = networkMode === 'director-centric' ? 'director-overview' : 'supplier-overview';
    navigateTo(overviewState);
  }, [navigateTo, networkMode]);

  const toggleNetworkMode = useCallback(() => {
    setAnimationPhase('transitioning');
    
    setTimeout(() => {
      const newMode = networkMode === 'director-centric' ? 'supplier-centric' : 'director-centric';
      const newOverviewState = newMode === 'director-centric' ? 'director-overview' : 'supplier-overview';
      
      setNetworkMode(newMode);
      setViewState(newOverviewState);
      setFocusedDirectorId(null);
      setFocusedSupplierId(null);
      setViewHistory([{ state: newOverviewState, mode: newMode, timestamp: Date.now() }]);
      
      setTimeout(() => setAnimationPhase('idle'), 300);
    }, 300);
  }, [networkMode]);

  // Get all connected node IDs for a given node
  const getConnectedNodeIds = useCallback((nodeId: string): Set<string> => {
    const connected = new Set<string>();
    connected.add(nodeId); // Include the node itself
    
    connections.forEach(conn => {
      if (conn.source === nodeId) {
        connected.add(conn.target);
      } else if (conn.target === nodeId) {
        connected.add(conn.source);
      }
    });
    
    return connected;
  }, [connections]);

  // Check if a node can be navigated to from current view
  const isNodeNavigable = useCallback((node: NetworkNode): boolean => {
    // Company node always navigates to overview
    if (node.type === 'company') return true;
    
    // In overview modes, all nodes are navigable
    if (viewState === 'director-overview' || viewState === 'supplier-overview') return true;
    
    // In focus modes, only connected nodes are navigable
    if (viewState === 'director-focus' || viewState === 'supplier-focus') {
      // Get the currently focused node ID
      const focusedId = viewState === 'director-focus' ? focusedDirectorId : focusedSupplierId;
      if (!focusedId) return false;
      
      // Check if this node is connected to the focused node
      const connectedNodeIds = getConnectedNodeIds(focusedId);
      const nodeId = node.id.includes('-') ? node.id.split('-')[0] : node.id;
      return connectedNodeIds.has(nodeId) || connectedNodeIds.has(node.id);
    }
    
    return false;
  }, [viewState, focusedDirectorId, focusedSupplierId, getConnectedNodeIds]);

  // Event handlers
  const handleNodeClick = useCallback((node: NetworkNode) => {
    // Check if node is navigable
    if (!isNodeNavigable(node)) {
      // If not navigable but has external handler, still call it
      if (node.type === 'supplier' && onNodeClick) {
        const originalSupplierId = node.id.includes('-') ? node.id.split('-')[0] : node.id;
        const supplier = filteredSuppliers.find(s => s.id === originalSupplierId);
        if (supplier) {
          onNodeClick({
            ...node,
            id: originalSupplierId
          });
        }
      }
      return;
    }

    if (node.type === 'director') {
      const directorId = node.id.includes('-') ? node.id.split('-')[0] : node.id;
      
      // If we're in supplier-centric mode, switch to director-centric for director focus
      if (networkMode === 'supplier-centric') {
        setNetworkMode('director-centric');
      }
      navigateTo('director-focus', directorId);
      
    } else if (node.type === 'supplier') {
      const supplierId = node.id.includes('-') ? node.id.split('-')[0] : node.id;
      
      // If we're in director-centric mode, switch to supplier-centric for supplier focus
      if (networkMode === 'director-centric') {
        setNetworkMode('supplier-centric');
      }
      navigateTo('supplier-focus', supplierId);
      
      // Also handle external click events for suppliers
      if (onNodeClick) {
        const supplier = filteredSuppliers.find(s => s.id === supplierId);
        if (supplier) {
          onNodeClick({
            ...node,
            id: supplierId
          });
        }
      }
    } else if (node.type === 'company') {
      resetView();
    }
  }, [isNodeNavigable, networkMode, navigateTo, resetView, onNodeClick, filteredSuppliers]);

  const handleNodeHover = useCallback((node: NetworkNode | null) => {
    setHoveredNode(node);
    if (node?.type === 'supplier' && onNodeHover) {
      // Extract the original supplier ID from composite ID
      const originalSupplierId = node.id.includes('-') ? node.id.split('-')[0] : node.id;
      onNodeHover(originalSupplierId);
    } else if (onNodeHover) {
      onNodeHover(null);
    }
  }, [onNodeHover]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && viewState !== 'director-overview' && viewState !== 'supplier-overview') {
        navigateBack();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [viewState, navigateBack]);

  // Check if two nodes are connected
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const areNodesConnected = useCallback((nodeId1: string, nodeId2: string): boolean => {
    return connections.some(conn => 
      (conn.source === nodeId1 && conn.target === nodeId2) ||
      (conn.source === nodeId2 && conn.target === nodeId1)
    );
  }, [connections]);

  // Generate SVG path for connections
  const getConnectionPath = (sourceId: string, targetId: string) => {
    const source = networkNodes.find(n => n.id === sourceId);
    const target = networkNodes.find(n => n.id === targetId);
    if (!source || !target) {
      return '';
    }

    // Curved path for better visibility
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const dr = Math.sqrt(dx * dx + dy * dy);
    
    return `M ${source.x},${source.y} Q ${(source.x + target.x) / 2},${(source.y + target.y) / 2 - dr * 0.15} ${target.x},${target.y}`;
  };

  return (
    <div className={className}>
      {/* Combined Header and Visualization Card */}
      <NeumorphicCard className="overflow-hidden">
        {/* Header with navigation */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--neumorphic-border)]">
          <div>
            <NeumorphicHeading className="flex items-center gap-2">
              {networkMode === 'director-centric' ? (
                <Users className="w-6 h-6 text-[var(--neumorphic-accent)]" />
              ) : (
                <Building2 className="w-6 h-6 text-[var(--neumorphic-accent)]" />
              )}
              {networkMode === 'director-centric' ? 'Director-Centric Risk Network' : 'Supplier-Centric Risk Network'}
            </NeumorphicHeading>
            <NeumorphicText variant="secondary" size="sm" className="mt-1">
              {networkMode === 'director-centric' 
                ? 'Interactive constellation view of director concentration risks'
                : 'Interactive constellation view of supplier risk and contract exposure'
              }
            </NeumorphicText>
          </div>
          
          {/* Navigation Controls */}
          <div className="flex items-center gap-1.5">
            {/* Mode Toggle */}
            <NeumorphicButton
              onClick={toggleNetworkMode}
              className="px-3 py-1.5 text-sm min-w-[110px]"
            >
              {networkMode === 'director-centric' ? (
                <>
                  <Building2 className="w-3 h-3 mr-1" />
                  <span>Supplier View</span>
                </>
              ) : (
                <>
                  <Users className="w-3 h-3 mr-1" />
                  <span>Director View</span>
                </>
              )}
            </NeumorphicButton>
            
            {(viewState !== 'director-overview' && viewState !== 'supplier-overview') && (
              <>
                <NeumorphicButton
                  onClick={navigateBack}
                  className="px-3 py-1.5 text-sm min-w-[75px]"
                  disabled={viewHistory.length <= 1}
                >
                  <ArrowLeft className="w-3 h-3 mr-1" />
                  <span>Back</span>
                </NeumorphicButton>
                <NeumorphicButton
                  onClick={resetView}
                  className="px-3 py-1.5 text-sm min-w-[90px]"
                >
                  <Home className="w-3 h-3 mr-1" />
                  <span>Overview</span>
                </NeumorphicButton>
              </>
            )}
          </div>
        </div>

        {/* SVG Network Visualization */}
        <motion.div
          ref={containerRef}
          className="relative"
          style={{ height }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
            className="overflow-hidden cursor-grab"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <g transform={`translate(${transform.translateX}, ${transform.translateY}) translate(${SVG_WIDTH / 2}, ${SVG_HEIGHT / 2}) scale(${transform.scale}) translate(${-SVG_WIDTH / 2}, ${-SVG_HEIGHT / 2})`}>
            {/* Connections */}
            <g className="connections">
              {connections.map((connection, index) => {
                // Connection rendering
                const isHighlighted = 
                  hoveredNode?.id === connection.source || 
                  hoveredNode?.id === connection.target;
                
                // Dim connections that don't involve the hovered node
                const shouldDimConnection = hoveredNode && !isHighlighted;
                
                let strokeColor = getCssVariable('--neumorphic-border');
                let strokeWidth = Math.max(1, connection.strength);
                let opacity = 0.4;

                if (connection.type === 'shared-suppliers') {
                  strokeColor = getCssVariable('--neumorphic-accent');
                  opacity = 0.6;
                } else if (connection.type === 'company-director') {
                  strokeColor = getCssVariable('--neumorphic-accent');
                  opacity = 0.5;
                  strokeWidth = connection.strength >= 3 ? 3 : 2;
                } else if (connection.type === 'director-supplier') {
                  strokeColor = getCssVariable('--neumorphic-text-secondary');
                  opacity = 0.4;
                  strokeWidth = connection.strength >= 2 ? 2 : 1;
                } else if (connection.strength >= 3) {
                  strokeColor = getCssVariable('--neumorphic-severity-critical');
                  opacity = 0.7;
                } else if (connection.strength >= 2) {
                  strokeColor = getCssVariable('--neumorphic-severity-high');
                  opacity = 0.6;
                }

                if (isHighlighted) {
                  opacity = 1;
                  strokeWidth *= 1.5;
                } else if (shouldDimConnection) {
                  opacity = 0.1; // Heavily dim non-connected lines
                }

                return (
                  <motion.path
                    key={`connection-${index}`}
                    d={getConnectionPath(connection.source, connection.target)}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    initial={{ pathLength: 0 }}
                    animate={{ 
                      pathLength: 1,
                      opacity: opacity 
                    }}
                    transition={{ duration: 1, delay: index * 0.05 }}
                  />
                );
              })}
            </g>

            {/* Nodes */}
            <g className="nodes">
              {networkNodes.map((node, index) => {
                const isHovered = hoveredNode?.id === node.id;
                // For suppliers, check both composite ID and original ID
                const originalSupplierId = node.type === 'supplier' && node.id.includes('-') ? 
                  node.id.split('-')[0] : node.id;
                const isSelected = selectedSupplierId === originalSupplierId;
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const isHighlighted = highlightedEntityIds.includes(originalSupplierId);
                
                // Determine if this node should be dimmed when another node is hovered
                const connectedNodeIds = hoveredNode ? getConnectedNodeIds(hoveredNode.id) : new Set();
                const isConnectedToHovered = hoveredNode ? connectedNodeIds.has(node.id) : false;
                const shouldDim = hoveredNode && !isConnectedToHovered;
                
                // Check if this node is navigable for visual styling
                const isNavigable = isNodeNavigable(node);
                
                return (
                  <motion.g
                    key={node.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: animationPhase === 'transitioning' ? 0 : 1, 
                      opacity: animationPhase === 'transitioning' ? 0 : 
                               shouldDim ? 0.2 : 1 
                    }}
                    transition={{ duration: 0.5, delay: index * 0.02 }}
                    className={isNavigable ? "cursor-pointer" : "cursor-default"}
                    onClick={() => handleNodeClick(node)}
                    onMouseEnter={() => handleNodeHover(node)}
                    onMouseLeave={() => handleNodeHover(null)}
                  >
                    {/* Glow effect for important nodes */}
                    {(node.isConcentrationRisk || isHovered || isSelected) && (
                      <motion.circle
                        cx={node.x}
                        cy={node.y}
                        r={node.radius + 10}
                        fill={node.color}
                        opacity="0.3"
                        filter="blur(8px)"
                        animate={node.isConcentrationRisk ? {
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.5, 0.3]
                        } : {}}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    )}
                    
                    {/* Navigation indicator for clickable nodes */}
                    {isNavigable && !isHovered && !isSelected && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.radius + 2}
                        fill="none"
                        stroke={getCssVariable('--neumorphic-accent')}
                        strokeWidth="1"
                        opacity="0.5"
                        strokeDasharray="3,3"
                      />
                    )}
                    
                    {/* Main node */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.radius}
                      fill={node.color}
                      stroke={isSelected ? getCssVariable('--neumorphic-accent') : 
                              isNavigable && isHovered ? getCssVariable('--neumorphic-accent') :
                              'rgba(255,255,255,0.3)'}
                      strokeWidth={isSelected ? 3 : isNavigable && isHovered ? 2 : 1}
                      filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
                    />
                    
                    {/* Icons and labels */}
                    {node.type === 'company' && (
                      <>
                        <text
                          x={node.x}
                          y={node.y - 5}
                          textAnchor="middle"
                          className="text-sm font-bold fill-white pointer-events-none"
                        >
                          Sibanye
                        </text>
                        <text
                          x={node.x}
                          y={node.y + 8}
                          textAnchor="middle"
                          className="text-sm font-bold fill-white pointer-events-none"
                        >
                          Stillwater
                        </text>
                      </>
                    )}
                    
                    {node.type === 'director' && (
                      <>
                        <foreignObject
                          x={node.x - 10}
                          y={node.y - 10}
                          width="20"
                          height="20"
                          className="pointer-events-none"
                        >
                          <div className="flex items-center justify-center w-full h-full text-white">
                            <User className="w-4 h-4" />
                          </div>
                        </foreignObject>
                        
                        {/* Director labels are now rendered in a separate group after nodes */}
                        
                        {/* Concentration risk indicator */}
                        {node.isConcentrationRisk && (
                          <motion.g
                            animate={{
                              scale: [1, 1.2, 1],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            <circle
                              cx={node.x - node.radius * 0.7}
                              cy={node.y - node.radius * 0.7}
                              r="8"
                              fill="red"
                              stroke="white"
                              strokeWidth="2"
                            />
                            <text
                              x={node.x - node.radius * 0.7}
                              y={node.y - node.radius * 0.7 + 3}
                              textAnchor="middle"
                              className="text-xs font-bold fill-white pointer-events-none"
                            >
                              !
                            </text>
                          </motion.g>
                        )}
                      </>
                    )}
                    
                    {node.type === 'supplier' && viewState === 'director-focus' && (
                      <>
                        <foreignObject
                          x={node.x - 8}
                          y={node.y - 8}
                          width="16"
                          height="16"
                          className="pointer-events-none"
                        >
                          <div className="flex items-center justify-center w-full h-full text-white">
                            <Building2 className="w-3 h-3" />
                          </div>
                        </foreignObject>
                      </>
                    )}
                  </motion.g>
                );
              })}
            </g>
            
            {/* Labels */}
            <g className="labels">
              {networkNodes.map((node) => {
                // Apply same dimming logic to labels
                const connectedNodeIds = hoveredNode ? getConnectedNodeIds(hoveredNode.id) : new Set();
                const isConnectedToHovered = hoveredNode ? connectedNodeIds.has(node.id) : false;
                const shouldDim = hoveredNode && !isConnectedToHovered;
                
                // Calculate label opacity based on focus state and hover
                const getFocusOpacity = () => {
                  // In focus modes, dim non-connected nodes more
                  if (viewState === 'director-focus' || viewState === 'supplier-focus') {
                    const focusedId = viewState === 'director-focus' ? focusedDirectorId : focusedSupplierId;
                    if (focusedId) {
                      const connectedToFocused = getConnectedNodeIds(focusedId);
                      const nodeId = node.id.includes('-') ? node.id.split('-')[0] : node.id;
                      if (!connectedToFocused.has(nodeId) && !connectedToFocused.has(node.id)) {
                        return 0.3; // Dim but still visible
                      }
                    }
                  }
                  return 1;
                };
                
                const baseOpacity = getFocusOpacity();
                const finalOpacity = shouldDim ? Math.min(baseOpacity, 0.2) : baseOpacity;
                
                if (node.type === 'director') {
                  return (
                    <motion.g 
                      key={`label-${node.id}`} 
                      className="pointer-events-none"
                      animate={{ opacity: finalOpacity }}
                      transition={{ duration: 0.3 }}
                    >
                      <text
                        x={node.x}
                        y={node.y + node.radius + 12}
                        textAnchor="middle"
                        className="text-xs fill-[var(--neumorphic-text-primary)] font-medium"
                      >
                        {node.name}
                      </text>
                      {node.boardCount && (
                        <text
                          x={node.x}
                          y={node.y + node.radius + 24}
                          textAnchor="middle"
                          className="text-xs fill-[var(--neumorphic-text-secondary)]"
                        >
                          {node.boardCount} boards
                        </text>
                      )}
                    </motion.g>
                  );
                }
                if (node.type === 'supplier') {
                  return (
                    <motion.g 
                      key={`label-${node.id}`} 
                      className="pointer-events-none"
                      animate={{ opacity: finalOpacity }}
                      transition={{ duration: 0.3 }}
                    >
                      <text
                        x={node.x}
                        y={node.y + node.radius + 12}
                        textAnchor="middle"
                        className="text-xs fill-[var(--neumorphic-text-primary)] font-medium"
                      >
                        {node.name.length > 15 ? node.name.substring(0, 15) + '...' : node.name}
                      </text>
                      {node.riskScore && (
                        <text
                          x={node.x}
                          y={node.y + node.radius + 24}
                          textAnchor="middle"
                          className="text-xs fill-[var(--neumorphic-text-secondary)]"
                        >
                          {node.riskScore}% Risk
                        </text>
                      )}
                    </motion.g>
                  );
                }
                return null;
              })}
            </g>
            </g>
          </svg>
          
          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-1">
            <button
              onClick={zoomIn}
              className="w-8 h-8 rounded-md bg-[var(--neumorphic-card)] shadow-[var(--neumorphic-shadow-convex)] border border-[var(--neumorphic-border)] flex items-center justify-center text-xs font-semibold text-[var(--neumorphic-text-primary)] hover:shadow-[var(--neumorphic-shadow-concave)] transition-all duration-200"
              title="Zoom In"
            >
              +
            </button>
            <button
              onClick={zoomOut}
              className="w-8 h-8 rounded-md bg-[var(--neumorphic-card)] shadow-[var(--neumorphic-shadow-convex)] border border-[var(--neumorphic-border)] flex items-center justify-center text-xs font-semibold text-[var(--neumorphic-text-primary)] hover:shadow-[var(--neumorphic-shadow-concave)] transition-all duration-200"
              title="Zoom Out"
            >
              −
            </button>
            <button
              onClick={resetZoom}
              className="w-8 h-8 rounded-md bg-[var(--neumorphic-card)] shadow-[var(--neumorphic-shadow-convex)] border border-[var(--neumorphic-border)] flex items-center justify-center text-xs text-[var(--neumorphic-text-primary)] hover:shadow-[var(--neumorphic-shadow-concave)] transition-all duration-200"
              title="Reset Zoom"
            >
              ⌂
            </button>
          </div>
          
          
          {/* View State Indicator with Enhanced Breadcrumbs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-4 left-4 px-3 py-2 rounded-lg bg-[var(--neumorphic-card)] shadow-md border border-[var(--neumorphic-border)] max-w-md"
          >
            {(viewState === 'director-overview' || viewState === 'supplier-overview') ? (
              <NeumorphicText size="sm" className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[var(--neumorphic-accent)]" />
                {viewState === 'director-overview' ? 'Director Overview - Click nodes to explore network' :
                 'Supplier Overview - Click nodes to explore network'}
              </NeumorphicText>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                <Target className="w-4 h-4 text-[var(--neumorphic-accent)]" />
                
                {/* Build breadcrumb trail from history */}
                {viewHistory.length > 1 && (
                  <>
                    <span 
                      className="text-[var(--neumorphic-accent)] text-sm cursor-pointer hover:underline"
                      onClick={resetView}
                    >
                      {viewHistory[0].mode === 'director-centric' ? 'Director Overview' : 'Supplier Overview'}
                    </span>
                    
                    {viewHistory.slice(1).map((historyItem, index) => (
                      <React.Fragment key={`${historyItem.focusId}-${historyItem.timestamp}`}>
                        <ChevronRight className="w-3 h-3 text-[var(--neumorphic-text-secondary)]" />
                        {index === viewHistory.length - 2 ? (
                          // Current (last) item - not clickable
                          <NeumorphicText size="sm" className="font-medium">
                            {historyItem.state === 'director-focus' ? 
                              directorProfiles.find(p => p.director.id === historyItem.focusId)?.director.name :
                              supplierProfiles.find(s => s.id === historyItem.focusId)?.name
                            }
                          </NeumorphicText>
                        ) : (
                          // Previous items - clickable to navigate back to
                          <span 
                            className="text-[var(--neumorphic-accent)] text-sm cursor-pointer hover:underline"
                            onClick={() => {
                              // Navigate back to this point in history
                              const targetHistory = viewHistory.slice(0, index + 2);
                              const targetState = targetHistory[targetHistory.length - 1];
                              setViewHistory(targetHistory);
                              setViewState(targetState.state);
                              if (targetState.state === 'director-focus') {
                                setFocusedDirectorId(targetState.focusId || null);
                                setFocusedSupplierId(null);
                              } else if (targetState.state === 'supplier-focus') {
                                setFocusedSupplierId(targetState.focusId || null);
                                setFocusedDirectorId(null);
                              }
                            }}
                          >
                            {historyItem.state === 'director-focus' ? 
                              directorProfiles.find(p => p.director.id === historyItem.focusId)?.director.name :
                              supplierProfiles.find(s => s.id === historyItem.focusId)?.name
                            }
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </>
                )}
                
                {/* Help text */}
                <span className="text-[var(--neumorphic-text-secondary)] text-xs ml-2">
                  Click connected nodes to explore
                </span>
              </div>
            )}
          </motion.div>
          
          {/* Hover Tooltip */}
          <AnimatePresence>
            {hoveredNode && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                className="absolute bottom-4 left-4 p-3 rounded-lg bg-[var(--neumorphic-card)] shadow-lg max-w-xs border border-[var(--neumorphic-border)] z-50"
              >
                {hoveredNode.type === 'director' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-[var(--neumorphic-accent)]" />
                      <NeumorphicText className="font-semibold">
                        {hoveredNode.name}
                      </NeumorphicText>
                    </div>
                    {hoveredNode.boardCount && (
                      <>
                        <NeumorphicText size="sm">
                          Board Positions: <span className="font-bold">{hoveredNode.boardCount}</span>
                        </NeumorphicText>
                        {hoveredNode.riskScore && (
                          <NeumorphicText size="sm">
                            Avg Risk Score: <span className="font-bold">{Math.round(hoveredNode.riskScore)}%</span>
                          </NeumorphicText>
                        )}
                        {hoveredNode.isConcentrationRisk && (
                          <div className="p-2 bg-red-100 rounded border border-red-300">
                            <NeumorphicText size="sm" className="text-red-800 font-medium">
                              ⚠️ CONCENTRATION RISK
                            </NeumorphicText>
                          </div>
                        )}
                      </>
                    )}
                    <NeumorphicText size="sm" variant="secondary" className="flex items-center gap-1">
                      <MousePointer className="w-3 h-3" />
                      {isNodeNavigable(hoveredNode) ? 'Click to analyze network' : 'Director profile'}
                    </NeumorphicText>
                  </div>
                )}
                
                {hoveredNode.type === 'supplier' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-[var(--neumorphic-accent)]" />
                      <NeumorphicText className="font-semibold">
                        {hoveredNode.name}
                      </NeumorphicText>
                    </div>
                    {hoveredNode.category && (
                      <NeumorphicText size="sm" variant="secondary">
                        {hoveredNode.category}
                      </NeumorphicText>
                    )}
                    {hoveredNode.riskScore && (
                      <div className="flex items-center gap-2">
                        <AlertTriangle 
                          className="w-4 h-4" 
                          style={{ color: hoveredNode.color }}
                        />
                        <NeumorphicText size="sm">
                          Risk: {hoveredNode.riskScore}% ({hoveredNode.riskLevel})
                        </NeumorphicText>
                      </div>
                    )}
                    {hoveredNode.contractValue && (
                      <NeumorphicText size="sm">
                        Contract: R{(hoveredNode.contractValue / 1000000).toFixed(1)}M
                      </NeumorphicText>
                    )}
                    <NeumorphicText size="sm" variant="secondary" className="flex items-center gap-1">
                      <MousePointer className="w-3 h-3" />
                      {isNodeNavigable(hoveredNode) ? 'Click to explore connections' : 'View details'}
                    </NeumorphicText>
                  </div>
                )}
                
                {hoveredNode.type === 'company' && (
                  <div className="space-y-2">
                    <NeumorphicText className="font-semibold">
                      {hoveredNode.name}
                    </NeumorphicText>
                    <NeumorphicText size="sm" variant="secondary">
                      Click to reset to overview
                    </NeumorphicText>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Legend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`absolute bottom-4 right-4 rounded-lg bg-[var(--neumorphic-card)] shadow-[var(--neumorphic-shadow-convex)] border border-[var(--neumorphic-border)] text-xs ${
              isLegendCollapsed ? 'w-auto' : 'w-56'
            }`}
          >
            <div className="p-3">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsLegendCollapsed(!isLegendCollapsed)}
              >
                <NeumorphicText size="sm" className="font-semibold flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Interactive Guide
                </NeumorphicText>
                <motion.div
                  animate={{ rotate: isLegendCollapsed ? 0 : 180 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronUp className="w-4 h-4 text-[var(--neumorphic-text-secondary)]" />
                </motion.div>
              </div>
              
              <AnimatePresence>
                {!isLegendCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2 mt-2">
              {viewState === 'director-overview' && (
                <>
                  <div>
                    <NeumorphicText size="sm" className="font-medium mb-1">Director Nodes</NeumorphicText>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <NeumorphicText size="sm">Critical (4+ boards)</NeumorphicText>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-orange-500" />
                        <NeumorphicText size="sm">High Risk (3 boards)</NeumorphicText>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-gray-500" />
                        <NeumorphicText size="sm">Normal (1-2 boards)</NeumorphicText>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[var(--neumorphic-border)]">
                    <NeumorphicText size="sm" className="font-medium mb-1">Connection Lines</NeumorphicText>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <svg width="30" height="2" className="flex-shrink-0">
                          <line x1="0" y1="1" x2="30" y2="1" stroke="var(--neumorphic-accent)" strokeWidth="2" opacity="0.6" />
                        </svg>
                        <NeumorphicText size="sm">Shared suppliers between directors</NeumorphicText>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg width="30" height="2" className="flex-shrink-0">
                          <line x1="0" y1="1" x2="30" y2="1" stroke="var(--neumorphic-text-secondary)" strokeWidth="1" opacity="0.4" />
                        </svg>
                        <NeumorphicText size="sm">Director to supplier</NeumorphicText>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[var(--neumorphic-border)]">
                    <NeumorphicText size="sm">
                      <span className="font-medium">Click any director</span> to explore their supplier network
                    </NeumorphicText>
                  </div>
                </>
              )}
              
              {viewState === 'supplier-overview' && (
                <>
                  <div>
                    <NeumorphicText size="sm" className="font-medium mb-1">Supplier Nodes</NeumorphicText>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <NeumorphicText size="sm">Critical Risk (75%+)</NeumorphicText>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-orange-500" />
                        <NeumorphicText size="sm">High Risk (50-74%)</NeumorphicText>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <NeumorphicText size="sm">Medium Risk (25-49%)</NeumorphicText>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <NeumorphicText size="sm">Low Risk (&lt;25%)</NeumorphicText>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[var(--neumorphic-border)]">
                    <NeumorphicText size="sm" className="font-medium mb-1">Connection Lines</NeumorphicText>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <svg width="30" height="2" className="flex-shrink-0">
                          <line x1="0" y1="1" x2="30" y2="1" stroke="var(--neumorphic-accent)" strokeWidth="3" opacity="0.6" />
                        </svg>
                        <NeumorphicText size="sm">Shared directors (concentration risk)</NeumorphicText>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg width="30" height="2" className="flex-shrink-0">
                          <line x1="0" y1="1" x2="30" y2="1" stroke="var(--neumorphic-text-secondary)" strokeWidth="1" opacity="0.4" />
                        </svg>
                        <NeumorphicText size="sm">Supplier to director</NeumorphicText>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[var(--neumorphic-border)]">
                    <NeumorphicText size="sm">
                      <span className="font-medium">Node size</span> = contract value
                    </NeumorphicText>
                  </div>
                </>
              )}
              
              {viewState === 'director-focus' && (
                <>
                  <div>
                    <NeumorphicText size="sm" className="font-medium mb-1">Supplier Nodes</NeumorphicText>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <NeumorphicText size="sm">Critical Risk (75%+)</NeumorphicText>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        <NeumorphicText size="sm">High Risk (50-74%)</NeumorphicText>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        <NeumorphicText size="sm">Medium Risk (25-49%)</NeumorphicText>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[var(--neumorphic-border)]">
                    <NeumorphicText size="sm">
                      <span className="font-medium">Press ESC</span> or use Back button to return
                    </NeumorphicText>
                  </div>
                </>
              )}
              
              {viewState === 'supplier-focus' && (
                <>
                  <div>
                    <NeumorphicText size="sm" className="font-medium mb-1">Network View</NeumorphicText>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <NeumorphicText size="sm">Concentration Risk Directors</NeumorphicText>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-gray-500" />
                        <NeumorphicText size="sm">Connected Directors</NeumorphicText>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <NeumorphicText size="sm">Related Suppliers</NeumorphicText>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[var(--neumorphic-border)]">
                    <NeumorphicText size="sm">
                      <span className="font-medium">Press ESC</span> or use Back button to return
                    </NeumorphicText>
                  </div>
                </>
              )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </NeumorphicCard>
    </div>
  );
};

export default DirectorCentricNetwork;