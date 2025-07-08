"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { NeumorphicBackground, NeumorphicCard, NeumorphicButton } from '@/components/ui/neumorphic';
import RiskConcentrationMap from '@/components/executive/RiskConcentrationMap';
import RiskPostureGauges from '@/components/executive/RiskPostureGauges';
import ContextualDetailPanel from '@/components/executive/ContextualDetailPanel';
import DirectorCentricNetwork from '@/components/executive/DirectorCentricNetwork';
import StrategicEventFeed from '@/components/executive/StrategicEventFeed';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Filter, X } from 'lucide-react';
import { 
  slideUpVariants, 
  slideInFromLeftVariants, 
  slideInFromRightVariants,
  staggerContainerVariants,
  hoverScaleVariants,
  buttonPressVariants
} from '@/lib/animation-utils';
import { toast, ToastProvider } from '@/components/ui/toast';
import { DashboardSkeleton } from '@/components/ui/skeleton';
import { 
  suppliers, 
  mineSites,
  directors,
  overallRiskPosture, 
  strategicEvents,
  type MineSite,
  type ExecutiveSupplierInfo,
  type Director,
  type StrategicEvent,
  type RiskCategory
} from '@/lib/sample-data/executive-dashboard-data';

export default function ExecutiveDashboardPage() {
  // Enhanced state management for component interactions
  const [selectedMineSite, setSelectedMineSite] = useState<MineSite | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<ExecutiveSupplierInfo | Director | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<StrategicEvent | null>(null);
  const [activeRiskFilter, setActiveRiskFilter] = useState<RiskCategory | null>(null);
  const [hoveredSupplierId, setHoveredSupplierId] = useState<string | null>(null);
  const [highlightedEntityIds, setHighlightedEntityIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_lastAction, setLastAction] = useState<string | null>(null);

  // Simulate initial data loading with enhanced feedback
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      toast.success('Dashboard loaded successfully', {
        title: 'Welcome to Executive Dashboard',
        description: 'All systems are operational'
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Enhanced refresh functionality
  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      // Simulate data refresh
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.dataRefreshed();
      setLastAction('refresh');
    } catch {
      toast.error('Failed to refresh dashboard data', {
        title: 'Refresh Error',
        action: {
          label: 'Retry',
          onClick: handleRefresh
        }
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Computed data with interconnected filtering
  const filteredData = useMemo(() => {
    let filteredSuppliers = [...suppliers];
    let filteredMineSites = [...mineSites];
    const filteredEvents = [...strategicEvents];
    let entityHighlights: string[] = [];

    // Apply mine site filter
    if (selectedMineSite) {
      filteredSuppliers = filteredSuppliers.filter(s => 
        s.linkedMineSiteIds.includes(selectedMineSite.id)
      );
      entityHighlights = [...entityHighlights, ...filteredSuppliers.map(s => s.id)];
    }

    // Apply risk category filter
    if (activeRiskFilter) {
      // Filter key should match the exact riskFactors property name (without "Risk" suffix)
      const filterKey = activeRiskFilter as keyof typeof suppliers[0]['riskFactors'];
      filteredSuppliers = filteredSuppliers.filter(s => 
        s.riskFactors[filterKey] >= 50
      );
      filteredMineSites = filteredMineSites.filter(site => {
        const siteSuppliers = suppliers.filter(s => 
          s.linkedMineSiteIds.includes(site.id) && 
          s.riskFactors[filterKey] >= 50
        );
        return siteSuppliers.length > 0;
      });
      entityHighlights = [...entityHighlights, ...filteredSuppliers.map(s => s.id)];
    }

    // Apply entity selection filter
    if (selectedEntity && 'contractValueZAR' in selectedEntity) {
      const selectedSupplier = selectedEntity as ExecutiveSupplierInfo;
      entityHighlights = [...entityHighlights, selectedSupplier.id];
      
      // Highlight related mine sites
      filteredMineSites = mineSites.filter(site => 
        selectedSupplier.linkedMineSiteIds.includes(site.id)
      );
      
      // Highlight suppliers with shared directors
      const sharedDirectors = selectedSupplier.directorIds;
      const relatedSuppliers = suppliers.filter(s => 
        s.id !== selectedSupplier.id && 
        s.directorIds.some(dirId => sharedDirectors.includes(dirId))
      );
      entityHighlights = [...entityHighlights, ...relatedSuppliers.map(s => s.id)];
    }

    // Apply event-based filtering
    if (selectedEvent && selectedEvent.relatedEntityIds.length > 0) {
      const eventEntityIds = selectedEvent.relatedEntityIds;
      
      // Filter suppliers related to event
      const eventSuppliers = suppliers.filter(s => 
        eventEntityIds.includes(s.id)
      );
      
      // Filter mine sites related to event
      const eventMineSites = mineSites.filter(site => 
        eventEntityIds.includes(site.id) || 
        eventSuppliers.some(s => s.linkedMineSiteIds.includes(site.id))
      );
      
      filteredSuppliers = eventSuppliers;
      filteredMineSites = eventMineSites;
      entityHighlights = [...entityHighlights, ...eventEntityIds];
    }

    return {
      suppliers: filteredSuppliers,
      mineSites: filteredMineSites,
      events: filteredEvents,
      highlights: [...new Set(entityHighlights)] // Remove duplicates
    };
  }, [selectedMineSite, selectedEntity, selectedEvent, activeRiskFilter]);

  // Update highlights when filtered data changes
  useEffect(() => {
    setHighlightedEntityIds(filteredData.highlights);
  }, [filteredData.highlights]);

  // Enhanced event handlers with cross-component updates and user feedback
  const handleMineSiteSelect = useCallback((site: MineSite | null) => {
    setSelectedMineSite(site);
    setSelectedEntity(null);
    setSelectedEvent(null);
    
    if (site) {
      // Highlight suppliers for this mine site
      const siteSuppliers = suppliers.filter(s => 
        s.linkedMineSiteIds.includes(site.id)
      );
      setHighlightedEntityIds(siteSuppliers.map(s => s.id));
      
      toast.selectionMade('Mine Site', site.name);
      setLastAction('mine-site-selected');
      
      // Show risk alert if high risk
      if (site.aggregatedRiskScore >= 75) {
        toast.riskAlert(site.name, site.aggregatedRiskScore);
      }
    } else {
      setHighlightedEntityIds([]);
      toast.info('Mine site selection cleared');
    }
  }, []);

  const handleEntitySelect = useCallback((entity: ExecutiveSupplierInfo | Director | null) => {
    setSelectedEntity(entity);
    setSelectedMineSite(null);
    setSelectedEvent(null);
    
    if (entity && 'contractValueZAR' in entity) {
      const supplier = entity as ExecutiveSupplierInfo;
      // Highlight related entities
      const relatedSuppliers = suppliers.filter(s => 
        s.id !== supplier.id && 
        s.directorIds.some(dirId => supplier.directorIds.includes(dirId))
      );
      setHighlightedEntityIds([supplier.id, ...relatedSuppliers.map(s => s.id)]);
      
      toast.selectionMade('Supplier', supplier.name);
      setLastAction('supplier-selected');
      
      // Network analysis notification
      if (relatedSuppliers.length > 0) {
        toast.networkConnection(supplier.name, relatedSuppliers.length);
      }
      
      // Risk alert for high risk suppliers
      if (supplier.riskScore >= 75) {
        toast.riskAlert(supplier.name, supplier.riskScore);
      }
    } else if (entity) {
      // Director selected
      const director = entity as Director;
      toast.selectionMade('Director', director.name);
      setLastAction('director-selected');
    } else {
      setHighlightedEntityIds([]);
      toast.info('Entity selection cleared');
    }
  }, []);

  const handleEventSelect = useCallback((event: StrategicEvent | null) => {
    setSelectedEvent(event);
    setSelectedMineSite(null);
    setSelectedEntity(null);
    
    if (event && event.relatedEntityIds.length > 0) {
      setHighlightedEntityIds(event.relatedEntityIds);
      
      toast.selectionMade('Strategic Event', event.title);
      setLastAction('event-selected');
      
      // Critical event warning
      if (event.severity === 'Critical') {
        toast.warning(`Critical event requires immediate attention: ${event.title}`, {
          title: 'Critical Alert',
          duration: 8000,
          action: {
            label: 'Review Now',
            onClick: () => {
              // Would navigate to detailed event view
            }
          }
        });
      }
    } else {
      setHighlightedEntityIds([]);
      if (event) {
        toast.selectionMade('Strategic Event', event.title);
      } else {
        toast.info('Event selection cleared');
      }
    }
  }, []);

  const handleRiskFilterChange = useCallback((category: RiskCategory | null) => {
    setActiveRiskFilter(category);
    // Clear selections when applying filter
    setSelectedMineSite(null);
    setSelectedEntity(null);
    setSelectedEvent(null);
    
    if (category) {
      const affectedSuppliers = suppliers.filter(s => s.riskFactors[category] >= 50);
      toast.filterApplied(`${category.charAt(0).toUpperCase() + category.slice(1)} Risk`, affectedSuppliers.length);
      setLastAction('filter-applied');
    } else {
      toast.filterCleared();
      setLastAction('filter-cleared');
    }
  }, []);

  // Supplier hover handler for network graph
  const handleSupplierHover = useCallback((supplierId: string | null) => {
    setHoveredSupplierId(supplierId);
  }, []);

  // Clear all filters and selections with enhanced feedback
  const handleClearAll = useCallback(() => {
    setSelectedMineSite(null);
    setSelectedEntity(null);
    setSelectedEvent(null);
    setActiveRiskFilter(null);
    setHoveredSupplierId(null);
    setHighlightedEntityIds([]);
    
    toast.success('All filters and selections cleared', {
      title: 'Dashboard Reset',
      description: 'Showing all available data'
    });
    setLastAction('all-cleared');
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return !!(selectedMineSite || selectedEntity || selectedEvent || activeRiskFilter);
  }, [selectedMineSite, selectedEntity, selectedEvent, activeRiskFilter]);

  // Calculate totals for KPI cards
  const dashboardTotals = useMemo(() => {
    const totalDirectors = directors.length;
    const totalSuppliers = suppliers.length;
    const totalExposureZAR = suppliers.reduce((sum, supplier) => sum + supplier.contractValueZAR, 0);
    
    return {
      totalDirectors,
      totalSuppliers,
      totalExposureZAR
    };
  }, []);

  if (isLoading) {
    return (
      <ToastProvider>
        <DashboardSkeleton />
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <NeumorphicBackground className="min-h-screen">
      <div className="w-full max-w-[1920px] mx-auto px-4 lg:px-6">
        
        {/* Global Filter Controls */}
        <motion.div 
          className="py-4"
          variants={slideUpVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-[var(--neumorphic-text-primary)]">
                Executive Dashboard
              </h1>
              
              {hasActiveFilters && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--neumorphic-radius-md)] bg-[var(--neumorphic-card)] shadow-[var(--neumorphic-shadow-convex)]"
                >
                  <Filter className="w-4 h-4 text-[var(--neumorphic-accent)]" />
                  <span className="text-sm text-[var(--neumorphic-text-primary)] font-medium">
                    Filters Active
                  </span>
                  <NeumorphicButton 
                    onClick={handleClearAll}
                    className="px-2 py-1 text-xs"
                    variant="outline"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Clear All
                  </NeumorphicButton>
                </motion.div>
              )}
            </div>
            
            <motion.button
              {...buttonPressVariants}
              className="p-2 rounded-[var(--neumorphic-radius-md)] bg-[var(--neumorphic-button)] shadow-[var(--neumorphic-shadow-convex)] hover:shadow-[var(--neumorphic-shadow-concave)] disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <motion.div
                animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
                transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: "linear" } : { duration: 0.3 }}
              >
                <RefreshCw className="w-4 h-4 text-[var(--neumorphic-text-secondary)]" />
              </motion.div>
            </motion.button>
          </div>
        </motion.div>

        {/* Executive Dashboard New Layout */}
        <div className="space-y-4 pb-6">
          
          {/* Row 1: Risk KPI Cards - Full Width */}
          <motion.div 
            className="w-full"
            variants={slideInFromLeftVariants}
            initial="hidden"
            animate="visible"
          >
            <RiskPostureGauges
              riskPosture={overallRiskPosture}
              activeFilter={activeRiskFilter}
              onFilterChange={handleRiskFilterChange}
              totalDirectors={dashboardTotals.totalDirectors}
              totalSuppliers={dashboardTotals.totalSuppliers}
              totalExposureZAR={dashboardTotals.totalExposureZAR}
              filteredSuppliers={filteredData.suppliers}
            />
          </motion.div>
          
          {/* Row 2: Map and Executive Intelligence Grid */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6"
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
          >
            
            {/* Left: Risk Concentration Map - 65% Width */}
            <motion.div
              className="w-full lg:col-span-8"
              variants={slideUpVariants}
            >
              <NeumorphicCard className="p-0 overflow-hidden h-[375px] lg:h-[450px]">
                <RiskConcentrationMap
                  height="100%"
                  onMineSiteClick={handleMineSiteSelect}
                  onSupplierClick={handleEntitySelect}
                  selectedMineSiteId={selectedMineSite?.id || null}
                  selectedSupplierId={selectedEntity && 'contractValueZAR' in selectedEntity ? selectedEntity.id : null}
                  highlightedSupplierIds={highlightedEntityIds}
                  filteredMineSites={filteredData.mineSites}
                  filteredSuppliers={filteredData.suppliers}
                  activeRiskFilter={activeRiskFilter}
                />
              </NeumorphicCard>
            </motion.div>
            
            {/* Right: Executive Intelligence - 35% Width */}
            <motion.div 
              className="w-full lg:col-span-4"
              variants={slideInFromRightVariants}
            >
              <AnimatePresence mode="wait">
                <NeumorphicCard className="h-[375px] lg:h-[450px]">
                  <ContextualDetailPanel
                    selectedMineSite={selectedMineSite}
                    selectedEntity={selectedEntity}
                    selectedEvent={selectedEvent}
                    suppliers={filteredData.suppliers}
                    events={filteredData.events}
                    activeFilter={activeRiskFilter}
                  />
                </NeumorphicCard>
              </AnimatePresence>
            </motion.div>
          </motion.div>
          
          {/* Row 3: Director-Centric Network and Strategic Events Grid */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6"
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
          >
            
            {/* Left: Director-Centric Network - 65% Width */}
            <motion.div 
              className="w-full lg:col-span-8"
              variants={slideUpVariants}
            >
              <DirectorCentricNetwork
                activeFilter={activeRiskFilter}
                onNodeClick={handleEntitySelect}
                onNodeHover={handleSupplierHover}
                selectedSupplierId={selectedEntity && 'contractValueZAR' in selectedEntity ? selectedEntity.id : null}
                selectedMineSiteId={selectedMineSite?.id || null}
                highlightedEntityIds={highlightedEntityIds}
                hoveredSupplierId={hoveredSupplierId}
                filteredSuppliers={filteredData.suppliers}
                height="600px"
                className="w-full"
              />
            </motion.div>
            
            {/* Right: Strategic Events - 35% Width */}
            <motion.div 
              className="w-full lg:col-span-4"
              variants={slideInFromRightVariants}
            >
              <NeumorphicCard className="p-0 h-[600px]">
                <StrategicEventFeed
                  events={strategicEvents}
                  selectedEvent={selectedEvent}
                  onEventSelect={handleEventSelect}
                />
              </NeumorphicCard>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Loading Overlay for Refresh */}
        <AnimatePresence>
          {isRefreshing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-[var(--neumorphic-card)] p-6 rounded-[var(--neumorphic-radius-lg)] shadow-[var(--neumorphic-shadow-convex)] text-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 mx-auto mb-4 border-4 border-[var(--neumorphic-accent)] border-t-transparent rounded-full"
                />
                <p className="text-[var(--neumorphic-text-primary)] font-medium">Refreshing Dashboard...</p>
                <p className="text-[var(--neumorphic-text-secondary)] text-sm mt-1">Updating all components</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </NeumorphicBackground>
    </ToastProvider>
  );
}