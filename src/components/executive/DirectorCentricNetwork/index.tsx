'use client';

import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NeumorphicText, NeumorphicHeading, NeumorphicCard, NeumorphicButton, NeumorphicBadge } from '@/components/ui/neumorphic';
import { 
  RiskCategory,
  ExecutiveSupplierInfo,
  Director,
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
  MousePointer,
  Zap,
  Package,
  ArrowLeft,
  Home,
  Eye,
  Maximize2,
  X,
  Info,
  ChevronRight,
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

interface ViewHistory {
  state: ViewState;
  mode: NetworkMode;
  focusId?: string;
  timestamp: number;
}

const DirectorCentricNetwork: React.FC<DirectorCentricNetworkProps> = ({
  activeFilter,
  onNodeClick,
  onNodeHover,
  selectedSupplierId,
  selectedMineSiteId,
  highlightedEntityIds = [],
  hoveredSupplierId,
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

  // SVG dimensions
  const SVG_WIDTH = 900;
  const SVG_HEIGHT = 600;
  const CENTER_X = SVG_WIDTH / 2;
  const CENTER_Y = SVG_HEIGHT / 2;

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
      const avgRiskScore = dirSuppliers.reduce((sum, s) => sum + s.riskScore, 0) / dirSuppliers.length;
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
  }, [filteredSuppliers, selectedMineSiteId]);

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

      // Supplier nodes arranged by risk level in concentric circles
      const riskLevels = ['Critical', 'High', 'Medium', 'Low'];
      const ringRadii = [130, 200, 270, 340];
      
      riskLevels.forEach((riskLevel, ringIndex) => {
        const suppliersInRing = supplierProfiles.filter(s => s.riskLevel === riskLevel);
        const ringRadius = ringRadii[ringIndex];
        
        suppliersInRing.forEach((supplier, index) => {
          const angle = (index / suppliersInRing.length) * 2 * Math.PI;
          const x = CENTER_X + ringRadius * Math.cos(angle);
          const y = CENTER_Y + ringRadius * Math.sin(angle);
          
          // Node size based on contract value
          const maxContract = Math.max(...supplierProfiles.map(s => s.contractValueZAR));
          const minRadius = 15;
          const maxRadius = 35;
          const radius = minRadius + ((supplier.contractValueZAR / maxContract) * (maxRadius - minRadius));

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
            radius,
            color: getSeverityColor(supplier.riskLevel)
          });

          // Add connected directors as smaller nodes around suppliers
          supplier.connectedDirectors.forEach((director, dIndex) => {
            const directorRadius = radius + 25;
            const directorAngle = angle + ((dIndex - (supplier.connectedDirectors.length - 1) / 2) * 0.3);
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
  }, [viewState, focusedDirectorId, directorProfiles]);

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

  // Event handlers
  const handleNodeClick = useCallback((node: NetworkNode) => {
    if (node.type === 'director') {
      if (networkMode === 'director-centric' && viewState === 'director-overview') {
        navigateTo('director-focus', node.id);
      } else if (networkMode === 'supplier-centric' && viewState === 'supplier-overview') {
        // In supplier-centric mode, clicking a director switches to director-centric mode
        setNetworkMode('director-centric');
        navigateTo('director-focus', node.id.includes('-') ? node.id.split('-')[0] : node.id);
      }
    } else if (node.type === 'supplier') {
      if (networkMode === 'supplier-centric' && viewState === 'supplier-overview') {
        navigateTo('supplier-focus', node.id);
      } else if (networkMode === 'director-centric' && viewState === 'director-overview') {
        // In director-centric mode, clicking a supplier switches to supplier-centric mode
        setNetworkMode('supplier-centric');
        navigateTo('supplier-focus', node.id.includes('-') ? node.id.split('-')[0] : node.id);
      } else {
        // Always handle external click events for suppliers
        if (onNodeClick) {
          // Extract the original supplier ID from composite ID
          const originalSupplierId = node.id.includes('-') ? node.id.split('-')[0] : node.id;
          const supplier = filteredSuppliers.find(s => s.id === originalSupplierId);
          if (supplier) {
            onNodeClick({
              ...node,
              id: originalSupplierId // Use original ID for external handlers
            });
          }
        }
      }
    } else if (node.type === 'company') {
      resetView();
    }
  }, [networkMode, viewState, navigateTo, resetView, onNodeClick, filteredSuppliers]);

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
      if (e.key === 'Escape' && viewState !== 'overview') {
        navigateBack();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [viewState, navigateBack]);

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
    <div className={`space-y-4 ${className}`}>
      {/* Header with navigation */}
      <div className="flex items-center justify-between">
        <div>
          <NeumorphicHeading size="lg" className="flex items-center gap-2">
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
        <div className="flex items-center gap-2">
          {/* Mode Toggle */}
          <NeumorphicButton
            onClick={toggleNetworkMode}
            className="px-3 py-2"
          >
            {networkMode === 'director-centric' ? (
              <>
                <Building2 className="w-4 h-4 mr-1" />
                Supplier View
              </>
            ) : (
              <>
                <Users className="w-4 h-4 mr-1" />
                Director View
              </>
            )}
          </NeumorphicButton>
          
          {(viewState !== 'director-overview' && viewState !== 'supplier-overview') && (
            <>
              <NeumorphicButton
                onClick={navigateBack}
                className="px-3 py-2"
                disabled={viewHistory.length <= 1}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </NeumorphicButton>
              <NeumorphicButton
                onClick={resetView}
                className="px-3 py-2"
              >
                <Home className="w-4 h-4 mr-1" />
                Overview
              </NeumorphicButton>
            </>
          )}
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <AnimatePresence>
        {(viewState !== 'director-overview' && viewState !== 'supplier-overview') && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 text-sm"
          >
            <span 
              className="text-[var(--neumorphic-accent)] cursor-pointer hover:underline"
              onClick={resetView}
            >
              {networkMode === 'director-centric' ? 'Director Overview' : 'Supplier Overview'}
            </span>
            <ChevronRight className="w-4 h-4 text-[var(--neumorphic-text-secondary)]" />
            {viewState === 'director-focus' && focusedDirectorId && (
              <span className="text-[var(--neumorphic-text-primary)]">
                {directorProfiles.find(p => p.director.id === focusedDirectorId)?.director.name}
              </span>
            )}
            {viewState === 'supplier-focus' && focusedSupplierId && (
              <span className="text-[var(--neumorphic-text-primary)]">
                {supplierProfiles.find(s => s.id === focusedSupplierId)?.name}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[var(--neumorphic-text-secondary)]" />
          <NeumorphicText size="sm">
            {activeFilter ? `Filtering by ${activeFilter} risk` : 
             selectedMineSiteId ? 'Filtered by mine site' :
             filteredSuppliers.length !== suppliers.length ? 'Filtered view' :
             'Showing all relationships'} 
          </NeumorphicText>
        </div>
        
        <div className="flex items-center gap-4">
          <NeumorphicText size="sm" variant="secondary">
            Concentration Risks: {directorProfiles.filter(d => d.isConcentrationRisk).length}
          </NeumorphicText>
        </div>
      </div>

      {/* SVG Network Visualization */}
      <motion.div
        className="relative rounded-[var(--neumorphic-radius-lg)] bg-[var(--neumorphic-card)] shadow-[var(--neumorphic-shadow-concave)] overflow-hidden"
        style={{ height }}
      >
        <NeumorphicCard className="p-0 h-full">
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
            className="overflow-visible"
          >
            {/* Connections */}
            <g className="connections">
              {connections.map((connection, index) => {
                // Connection rendering
                const isHighlighted = 
                  hoveredNode?.id === connection.source || 
                  hoveredNode?.id === connection.target;
                
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
                }

                return (
                  <motion.path
                    key={`connection-${index}`}
                    d={getConnectionPath(connection.source, connection.target)}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    opacity={opacity}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
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
                const isHighlighted = highlightedEntityIds.includes(originalSupplierId);
                
                return (
                  <motion.g
                    key={node.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: animationPhase === 'transitioning' ? 0 : 1, 
                      opacity: animationPhase === 'transitioning' ? 0 : 1 
                    }}
                    transition={{ duration: 0.5, delay: index * 0.02 }}
                    className="cursor-pointer"
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
                    
                    {/* Main node */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.radius}
                      fill={node.color}
                      stroke={isSelected ? getCssVariable('--neumorphic-accent') : 'rgba(255,255,255,0.3)'}
                      strokeWidth={isSelected ? 3 : 1}
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
                        
                        <text
                          x={node.x}
                          y={node.y + node.radius + 12}
                          textAnchor="middle"
                          className="text-xs fill-[var(--neumorphic-text-primary)] pointer-events-none"
                        >
                          {node.name.length > 15 ? node.name.substring(0, 15) + '...' : node.name}
                        </text>
                        <text
                          x={node.x}
                          y={node.y + node.radius + 24}
                          textAnchor="middle"
                          className={`text-xs font-bold pointer-events-none ${
                            node.riskLevel === 'Critical' ? 'fill-red-500' :
                            node.riskLevel === 'High' ? 'fill-orange-500' :
                            node.riskLevel === 'Medium' ? 'fill-yellow-500' :
                            'fill-green-500'
                          }`}
                        >
                          {node.riskScore}% Risk
                        </text>
                      </>
                    )}
                  </motion.g>
                );
              })}
            </g>
            
            {/* Director Labels - Separate group for higher z-index */}
            <g className="labels">
              {networkNodes.map((node) => {
                if (node.type === 'director' && (viewState === 'director-overview' || viewState === 'supplier-overview' || node.id === focusedDirectorId)) {
                  return (
                    <g key={`label-${node.id}`} className="pointer-events-none">
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
                    </g>
                  );
                }
                return null;
              })}
            </g>
          </svg>
          
          {/* View State Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-4 left-4 px-3 py-2 rounded-lg bg-[var(--neumorphic-card)] shadow-md border border-[var(--neumorphic-border)]"
          >
            <NeumorphicText size="sm" className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[var(--neumorphic-accent)]" />
              {viewState === 'director-overview' ? 'Director Overview - Click directors to explore' :
               viewState === 'supplier-overview' ? 'Supplier Overview - Click suppliers to explore' :
               viewState === 'director-focus' ? `Analyzing ${directorProfiles.find(p => p.director.id === focusedDirectorId)?.director.name}` :
               viewState === 'supplier-focus' ? `Analyzing ${supplierProfiles.find(s => s.id === focusedSupplierId)?.name}` :
               'Detailed View'}
            </NeumorphicText>
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
                    <NeumorphicText size="xs" variant="secondary" className="flex items-center gap-1">
                      <MousePointer className="w-3 h-3" />
                      {viewState === 'overview' ? 'Click to analyze network' : 'Director profile'}
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
                    <NeumorphicText size="xs" variant="secondary" className="flex items-center gap-1">
                      <MousePointer className="w-3 h-3" />
                      Click to view full details
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute top-4 right-4 p-3 rounded-lg bg-[var(--neumorphic-card)] shadow-md border border-[var(--neumorphic-border)] w-56 text-xs"
          >
            <NeumorphicText size="xs" className="font-semibold mb-2 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Interactive Guide
            </NeumorphicText>
            
            <div className="space-y-2">
              {viewState === 'director-overview' && (
                <>
                  <div>
                    <NeumorphicText size="xs" className="font-medium mb-1">Director Nodes</NeumorphicText>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <NeumorphicText size="xs">Critical (4+ boards)</NeumorphicText>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-orange-500" />
                        <NeumorphicText size="xs">High Risk (3 boards)</NeumorphicText>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-gray-500" />
                        <NeumorphicText size="xs">Normal (1-2 boards)</NeumorphicText>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[var(--neumorphic-border)]">
                    <NeumorphicText size="xs">
                      <span className="font-medium">Click any director</span> to explore their supplier network
                    </NeumorphicText>
                  </div>
                </>
              )}
              
              {viewState === 'supplier-overview' && (
                <>
                  <div>
                    <NeumorphicText size="xs" className="font-medium mb-1">Supplier Nodes</NeumorphicText>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <NeumorphicText size="xs">Critical Risk (75%+)</NeumorphicText>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-orange-500" />
                        <NeumorphicText size="xs">High Risk (50-74%)</NeumorphicText>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <NeumorphicText size="xs">Medium Risk (25-49%)</NeumorphicText>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <NeumorphicText size="xs">Low Risk (&lt;25%)</NeumorphicText>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[var(--neumorphic-border)]">
                    <NeumorphicText size="xs">
                      <span className="font-medium">Node size</span> = contract value
                    </NeumorphicText>
                  </div>
                </>
              )}
              
              {viewState === 'director-focus' && (
                <>
                  <div>
                    <NeumorphicText size="xs" className="font-medium mb-1">Supplier Nodes</NeumorphicText>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <NeumorphicText size="xs">Critical Risk (75%+)</NeumorphicText>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        <NeumorphicText size="xs">High Risk (50-74%)</NeumorphicText>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        <NeumorphicText size="xs">Medium Risk (25-49%)</NeumorphicText>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[var(--neumorphic-border)]">
                    <NeumorphicText size="xs">
                      <span className="font-medium">Press ESC</span> or use Back button to return
                    </NeumorphicText>
                  </div>
                </>
              )}
              
              {viewState === 'supplier-focus' && (
                <>
                  <div>
                    <NeumorphicText size="xs" className="font-medium mb-1">Network View</NeumorphicText>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <NeumorphicText size="xs">Concentration Risk Directors</NeumorphicText>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-gray-500" />
                        <NeumorphicText size="xs">Connected Directors</NeumorphicText>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <NeumorphicText size="xs">Related Suppliers</NeumorphicText>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[var(--neumorphic-border)]">
                    <NeumorphicText size="xs">
                      <span className="font-medium">Press ESC</span> or use Back button to return
                    </NeumorphicText>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </NeumorphicCard>
      </motion.div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div 
          className="p-4 rounded-[var(--neumorphic-radius-md)] bg-[var(--neumorphic-button)] shadow-[var(--neumorphic-shadow-convex)]"
          whileHover={{ scale: 1.02 }}
        >
          <NeumorphicText size="sm" variant="secondary">Total Directors</NeumorphicText>
          <NeumorphicText className="text-2xl font-bold">{directorProfiles.length}</NeumorphicText>
        </motion.div>
        <motion.div 
          className="p-4 rounded-[var(--neumorphic-radius-md)] bg-[var(--neumorphic-button)] shadow-[var(--neumorphic-shadow-convex)]"
          whileHover={{ scale: 1.02 }}
        >
          <NeumorphicText size="sm" variant="secondary">Concentration Risks</NeumorphicText>
          <NeumorphicText className="text-2xl font-bold text-[var(--neumorphic-severity-critical)]">
            {directorProfiles.filter(d => d.isConcentrationRisk).length}
          </NeumorphicText>
        </motion.div>
        <motion.div 
          className="p-4 rounded-[var(--neumorphic-radius-md)] bg-[var(--neumorphic-button)] shadow-[var(--neumorphic-shadow-convex)]"
          whileHover={{ scale: 1.02 }}
        >
          <NeumorphicText size="sm" variant="secondary">Max Board Count</NeumorphicText>
          <NeumorphicText className="text-2xl font-bold">
            {Math.max(...directorProfiles.map(d => d.boardCount), 0)}
          </NeumorphicText>
        </motion.div>
        <motion.div 
          className="p-4 rounded-[var(--neumorphic-radius-md)] bg-[var(--neumorphic-button)] shadow-[var(--neumorphic-shadow-convex)]"
          whileHover={{ scale: 1.02 }}
        >
          <NeumorphicText size="sm" variant="secondary">Total Exposure</NeumorphicText>
          <NeumorphicText className="text-2xl font-bold">
            R{(directorProfiles.reduce((sum, d) => sum + d.totalExposure, 0) / 1000000).toFixed(0)}M
          </NeumorphicText>
        </motion.div>
      </div>
    </div>
  );
};

export default DirectorCentricNetwork;