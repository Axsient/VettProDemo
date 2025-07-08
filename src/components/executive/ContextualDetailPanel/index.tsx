'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  NeumorphicText, 
  NeumorphicHeading, 
  NeumorphicBadge,
  NeumorphicButton,
  NeumorphicStatsCard 
} from '@/components/ui/neumorphic';
import { 
  MineSite, 
  ExecutiveSupplierInfo, 
  Director, 
  StrategicEvent 
} from '@/lib/sample-data/executive-dashboard-data';
import { getSeverityColor } from '@/lib/executive/theme-bridge';
import { 
  Building, 
  MapPin, 
  DollarSign, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  FileText,
  Clock,
  Activity,
  Eye,
  ExternalLink,
  ChevronRight,
  PieChart
} from 'lucide-react';

// Animation variants
const slideInFromRightVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.2 } }
};

const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const staggerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

interface ContextualDetailPanelProps {
  selectedMineSite?: MineSite | null;
  selectedEntity?: ExecutiveSupplierInfo | Director | null;
  selectedEvent?: StrategicEvent | null;
  suppliers?: ExecutiveSupplierInfo[];
  events?: StrategicEvent[];
  className?: string;
}

const ContextualDetailPanel: React.FC<ContextualDetailPanelProps> = ({
  selectedMineSite,
  selectedEntity,
  selectedEvent,
  suppliers = [],
  events = [],
  className = '',
}) => {
  // Calculate stats for mine site
  const mineSiteStats = useMemo(() => {
    if (!selectedMineSite || !suppliers.length) return null;
    
    const linkedSuppliers = suppliers.filter(s => 
      s.linkedMineSiteIds.includes(selectedMineSite.id)
    );
    
    const totalValue = linkedSuppliers.reduce((sum, s) => sum + s.contractValueZAR, 0);
    const avgRisk = linkedSuppliers.reduce((sum, s) => sum + s.riskScore, 0) / linkedSuppliers.length;
    const highRiskSuppliers = linkedSuppliers.filter(s => s.riskScore >= 75).length;
    
    return {
      totalSuppliers: linkedSuppliers.length,
      totalValue,
      averageRisk: avgRisk,
      highRiskCount: highRiskSuppliers,
      topSuppliers: linkedSuppliers
        .sort((a, b) => b.riskScore - a.riskScore)
        .slice(0, 5),
    };
  }, [selectedMineSite, suppliers]);

  // Default content when nothing is selected
  const renderDefaultContent = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 text-center"
    >
      <div className="mb-6">
        <PieChart className="w-16 h-16 mx-auto mb-4 text-[var(--neumorphic-accent)] opacity-50" />
        <NeumorphicHeading size="lg">Executive Intelligence</NeumorphicHeading>
        <NeumorphicText variant="secondary" className="mt-2">
          Select a mine site, supplier, or event to view detailed insights
        </NeumorphicText>
      </div>

      <div className="space-y-4">
        <NeumorphicStatsCard
          title="Total Suppliers"
          value={suppliers.length.toString()}
          icon={<Building className="w-5 h-5 text-blue-400" />}
        />
        
        <NeumorphicStatsCard
          title="Active Events"
          value={events.filter(e => e.severity === 'Critical' || e.severity === 'High').length.toString()}
          icon={<AlertTriangle className="w-5 h-5 text-red-400" />}
        />
        
        <NeumorphicStatsCard
          title="Risk Score"
          value="60.8%"
          icon={<TrendingUp className="w-5 h-5 text-orange-400" />}
          trend="up"
          trendValue="+2.3%"
        />
      </div>

      <div className="mt-6">
        <NeumorphicText size="sm" variant="secondary">
          💡 Tip: Click on map markers or network nodes to drill down into specific data
        </NeumorphicText>
      </div>
    </motion.div>
  );

  // Mine site detail content
  const renderMineSiteContent = () => {
    if (!selectedMineSite || !mineSiteStats) return null;

    return (
      <motion.div
        variants={slideInFromRightVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="p-6 space-y-6"
      >
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-[var(--neumorphic-radius-md)] bg-[var(--neumorphic-accent)] bg-opacity-20">
              <MapPin className="w-5 h-5 text-[var(--neumorphic-accent)]" />
            </div>
            <div>
              <NeumorphicHeading size="lg">{selectedMineSite.name}</NeumorphicHeading>
              <NeumorphicText variant="secondary" size="sm">
                {selectedMineSite.province} • {selectedMineSite.metals.join(', ')}
              </NeumorphicText>
            </div>
          </div>
          
          <div 
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
            style={{
              backgroundColor: getSeverityColor(
                selectedMineSite.aggregatedRiskScore >= 75 ? 'Critical' :
                selectedMineSite.aggregatedRiskScore >= 50 ? 'High' :
                selectedMineSite.aggregatedRiskScore >= 25 ? 'Medium' : 'Low'
              ),
              color: 'white',
              opacity: 0.9,
            }}
          >
            <Activity className="w-4 h-4" />
            Risk Score: {selectedMineSite.aggregatedRiskScore.toFixed(1)}%
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <NeumorphicStatsCard
            title="Total Suppliers"
            value={mineSiteStats.totalSuppliers.toString()}
            icon={<Building className="w-5 h-5 text-blue-400" />}
          />
          
          <NeumorphicStatsCard
            title="Contract Value"
            value={`R${(mineSiteStats.totalValue / 1000000).toFixed(1)}M`}
            icon={<DollarSign className="w-5 h-5 text-green-400" />}
          />
          
          <NeumorphicStatsCard
            title="Avg Risk Score"
            value={`${mineSiteStats.averageRisk.toFixed(1)}%`}
            icon={<TrendingUp className="w-5 h-5 text-orange-400" />}
          />
          
          <NeumorphicStatsCard
            title="High Risk"
            value={mineSiteStats.highRiskCount.toString()}
            icon={<AlertTriangle className="w-5 h-5 text-red-400" />}
          />
        </div>

        {/* Top Risk Suppliers */}
        <div>
          <NeumorphicHeading size="md" className="mb-3">
            Top Risk Suppliers
          </NeumorphicHeading>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {mineSiteStats.topSuppliers.map((supplier, index) => (
              <motion.div
                key={supplier.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-[var(--neumorphic-radius-md)] bg-[var(--neumorphic-button)] bg-opacity-30"
              >
                <div className="flex-1">
                  <NeumorphicText className="font-medium">
                    {supplier.name}
                  </NeumorphicText>
                  <NeumorphicText variant="secondary" size="sm">
                    {supplier.category}
                  </NeumorphicText>
                </div>
                
                <div className="text-right">
                  <div 
                    className="text-sm font-bold"
                    style={{ 
                      color: getSeverityColor(
                        supplier.riskScore >= 75 ? 'Critical' :
                        supplier.riskScore >= 50 ? 'High' :
                        supplier.riskScore >= 25 ? 'Medium' : 'Low'
                      )
                    }}
                  >
                    {supplier.riskScore.toFixed(1)}%
                  </div>
                  <NeumorphicText variant="secondary" size="sm">
                    R{(supplier.contractValueZAR / 1000000).toFixed(1)}M
                  </NeumorphicText>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <NeumorphicButton className="w-full justify-between">
            <span>View Full Site Report</span>
            <ExternalLink className="w-4 h-4" />
          </NeumorphicButton>
          
          <NeumorphicButton variant="outline" className="w-full justify-between">
            <span>Schedule Risk Review</span>
            <Clock className="w-4 h-4" />
          </NeumorphicButton>
        </div>
      </motion.div>
    );
  };

  // Supplier/Director detail content
  const renderEntityContent = () => {
    if (!selectedEntity) return null;

    const isSupplier = 'contractValueZAR' in selectedEntity;
    const supplier = isSupplier ? selectedEntity as ExecutiveSupplierInfo : null;
    const director = !isSupplier ? selectedEntity as Director : null;

    if (supplier) {
      return (
        <motion.div
          variants={slideInFromRightVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="p-6 space-y-6"
        >
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-[var(--neumorphic-radius-md)] bg-[var(--neumorphic-accent)] bg-opacity-20">
                <Building className="w-5 h-5 text-[var(--neumorphic-accent)]" />
              </div>
              <div>
                <NeumorphicHeading size="lg">{supplier.name}</NeumorphicHeading>
                <NeumorphicText variant="secondary" size="sm">
                  {supplier.category}
                </NeumorphicText>
              </div>
            </div>
            
            <NeumorphicBadge 
              variant={
                supplier.riskScore >= 75 ? 'danger' :
                supplier.riskScore >= 50 ? 'warning' :
                supplier.riskScore >= 25 ? 'info' : 'success'
              }
            >
              Risk Score: {supplier.riskScore.toFixed(1)}%
            </NeumorphicBadge>
          </div>

          {/* Risk Breakdown */}
          <div>
            <NeumorphicHeading size="md" className="mb-3">
              Risk Factor Breakdown
            </NeumorphicHeading>
            <div className="space-y-3">
              {Object.entries(supplier.riskFactors).map(([factor, value]) => (
                <div key={factor} className="flex items-center justify-between">
                  <NeumorphicText className="capitalize">
                    {factor} Risk
                  </NeumorphicText>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-[var(--neumorphic-text-secondary)] bg-opacity-20 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${value}%`,
                          backgroundColor: getSeverityColor(
                            value >= 75 ? 'Critical' :
                            value >= 50 ? 'High' :
                            value >= 25 ? 'Medium' : 'Low'
                          ),
                        }}
                      />
                    </div>
                    <NeumorphicText 
                      size="sm" 
                      className="w-10 text-right font-medium"
                      style={{
                        color: getSeverityColor(
                          value >= 75 ? 'Critical' :
                          value >= 50 ? 'High' :
                          value >= 25 ? 'Medium' : 'Low'
                        ),
                      }}
                    >
                      {value}%
                    </NeumorphicText>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contract Info */}
          <div className="grid grid-cols-2 gap-3">
            <NeumorphicStatsCard
              title="Contract Value"
              value={`R${(supplier.contractValueZAR / 1000000).toFixed(1)}M`}
              icon={<DollarSign className="w-5 h-5 text-green-400" />}
            />
            
            <NeumorphicStatsCard
              title="Mine Sites"
              value={supplier.linkedMineSiteIds.length.toString()}
              icon={<MapPin className="w-5 h-5 text-blue-400" />}
            />
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <NeumorphicButton className="w-full justify-between">
              <span>View Supplier Profile</span>
              <ExternalLink className="w-4 h-4" />
            </NeumorphicButton>
            
            <NeumorphicButton variant="outline" className="w-full justify-between">
              <span>Initiate Risk Review</span>
              <AlertTriangle className="w-4 h-4" />
            </NeumorphicButton>
          </div>
        </motion.div>
      );
    }

    if (director) {
      return (
        <motion.div
          variants={slideInFromRightVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="p-6 space-y-6"
        >
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-[var(--neumorphic-radius-md)] bg-[var(--neumorphic-accent)] bg-opacity-20">
                <Users className="w-5 h-5 text-[var(--neumorphic-accent)]" />
              </div>
              <div>
                <NeumorphicHeading size="lg">{director.name}</NeumorphicHeading>
                <NeumorphicText variant="secondary" size="sm">
                  Board Director
                </NeumorphicText>
              </div>
            </div>
          </div>

          {/* Board Positions */}
          <div>
            <NeumorphicHeading size="md" className="mb-3">
              Board Positions
            </NeumorphicHeading>
            <div className="space-y-2">
              {suppliers
                .filter(s => s.directorIds.includes(director.id))
                .map(supplier => (
                  <div 
                    key={supplier.id}
                    className="flex items-center justify-between p-3 rounded-[var(--neumorphic-radius-md)] bg-[var(--neumorphic-button)] bg-opacity-30"
                  >
                    <div>
                      <NeumorphicText className="font-medium">
                        {supplier.name}
                      </NeumorphicText>
                      <NeumorphicText variant="secondary" size="sm">
                        {supplier.category}
                      </NeumorphicText>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--neumorphic-text-secondary)]" />
                  </div>
                ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <NeumorphicButton className="w-full justify-between">
              <span>View Network Analysis</span>
              <Eye className="w-4 h-4" />
            </NeumorphicButton>
          </div>
        </motion.div>
      );
    }

    return null;
  };

  // Event detail content
  const renderEventContent = () => {
    if (!selectedEvent) return null;

    return (
      <motion.div
        variants={slideInFromRightVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="p-6 space-y-6"
      >
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="p-2 rounded-[var(--neumorphic-radius-md)]"
              style={{
                backgroundColor: getSeverityColor(selectedEvent.severity),
                color: 'white',
                opacity: 0.9,
              }}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <NeumorphicHeading size="lg">{selectedEvent.title}</NeumorphicHeading>
              <NeumorphicText variant="secondary" size="sm">
                {new Date(selectedEvent.timestamp).toLocaleString()}
              </NeumorphicText>
            </div>
          </div>
          
          <NeumorphicBadge 
            variant={
              selectedEvent.severity === 'Critical' ? 'danger' :
              selectedEvent.severity === 'High' ? 'warning' :
              selectedEvent.severity === 'Medium' ? 'info' : 'default'
            }
          >
            {selectedEvent.severity} Priority
          </NeumorphicBadge>
        </div>

        {/* Description */}
        <div>
          <NeumorphicText>{selectedEvent.description}</NeumorphicText>
        </div>

        {/* Related Entities */}
        {selectedEvent.relatedEntityIds.length > 0 && (
          <div>
            <NeumorphicHeading size="md" className="mb-3">
              Related Entities
            </NeumorphicHeading>
            <div className="space-y-1">
              {selectedEvent.relatedEntityIds.map(entityId => (
                <div 
                  key={entityId}
                  className="text-sm text-[var(--neumorphic-accent)] font-mono"
                >
                  {entityId}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action */}
        <div>
          <NeumorphicButton className="w-full justify-between">
            <span>{selectedEvent.action.label}</span>
            {selectedEvent.action.type === 'DRILL_DOWN' ? 
              <Eye className="w-4 h-4" /> : 
              <FileText className="w-4 h-4" />
            }
          </NeumorphicButton>
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`h-full overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        {selectedEvent ? (
          <div key="event">{renderEventContent()}</div>
        ) : selectedEntity ? (
          <div key="entity">{renderEntityContent()}</div>
        ) : selectedMineSite ? (
          <div key="mine">{renderMineSiteContent()}</div>
        ) : (
          <div key="default">{renderDefaultContent()}</div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContextualDetailPanel;