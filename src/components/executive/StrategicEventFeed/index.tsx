'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  NeumorphicText, 
  NeumorphicHeading, 
  NeumorphicBadge,
  NeumorphicButton 
} from '@/components/ui/neumorphic';
import { StrategicEvent } from '@/lib/sample-data/executive-dashboard-data';
import { getSeverityColor } from '@/lib/executive/theme-bridge';
import { 
  AlertTriangle, 
  Clock, 
  Eye, 
  FileText, 
  CheckCircle,
  Info,
  Zap,
  ChevronRight,
  Filter,
  RefreshCw
} from 'lucide-react';

interface StrategicEventFeedProps {
  events: StrategicEvent[];
  selectedEvent?: StrategicEvent | null;
  onEventSelect?: (event: StrategicEvent | null) => void;
  maxHeight?: string;
  showFilters?: boolean;
  className?: string;
}

interface EventItemProps {
  event: StrategicEvent;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

// Event item component
const EventItem: React.FC<EventItemProps> = ({
  event,
  isSelected,
  onClick,
  index,
}) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return <AlertTriangle className="w-4 h-4 text-[var(--neumorphic-severity-critical)]" />;
      case 'High':
        return <AlertTriangle className="w-4 h-4 text-[var(--neumorphic-severity-high)]" />;
      case 'Medium':
        return <Info className="w-4 h-4 text-[var(--neumorphic-severity-medium)]" />;
      default:
        return <CheckCircle className="w-4 h-4 text-[var(--neumorphic-severity-low)]" />;
    }
  };

  const isCritical = event.severity === 'Critical';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`
        p-4 rounded-[var(--neumorphic-radius-md)] cursor-pointer transition-all duration-300 mb-3
        ${isSelected 
          ? 'bg-[var(--neumorphic-accent)] bg-opacity-10 shadow-[var(--neumorphic-shadow-concave)]' 
          : 'bg-[var(--neumorphic-card)] shadow-[var(--neumorphic-shadow-convex)] hover:shadow-[var(--neumorphic-shadow-concave)]'
        }
        ${isCritical ? 'border-2 border-[var(--neumorphic-severity-critical)] border-opacity-20' : ''}
      `}
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {getSeverityIcon(event.severity)}
            <NeumorphicText className="font-semibold text-sm">
              {event.title}
            </NeumorphicText>
            <NeumorphicBadge 
              variant={
                event.severity === 'Critical' ? 'danger' :
                event.severity === 'High' ? 'warning' :
                event.severity === 'Medium' ? 'info' : 'default'
              }
              size="sm"
            >
              {event.severity}
            </NeumorphicBadge>
          </div>
          
          <NeumorphicText variant="secondary" size="sm" className="mb-2">
            {event.description}
          </NeumorphicText>
          
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{new Date(event.timestamp).toLocaleString()}</span>
            </div>
            
            {event.relatedEntityIds.length > 0 && (
              <div className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                <span>{event.relatedEntityIds.length} entities</span>
              </div>
            )}
          </div>
          
          {/* Action Button */}
          <div className="mt-3">
            <NeumorphicButton
              variant="outline" 
              size="sm"
              className="text-xs flex items-center gap-1"
            >
              {event.action.type === 'DRILL_DOWN' ? (
                <>
                  <Eye className="w-3 h-3" />
                  {event.action.label}
                </>
              ) : (
                <>
                  <FileText className="w-3 h-3" />
                  {event.action.label}
                </>
              )}
            </NeumorphicButton>
          </div>
        </div>
        
        <ChevronRight className="w-4 h-4 text-[var(--neumorphic-text-secondary)] flex-shrink-0 ml-2" />
      </div>
      
      {isCritical && (
        <motion.div
          className="absolute inset-0 rounded-[var(--neumorphic-radius-md)] pointer-events-none"
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(239, 68, 68, 0.3)',
              '0 0 0 4px rgba(239, 68, 68, 0.1)',
              '0 0 0 0 rgba(239, 68, 68, 0.3)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.div>
  );
};

const StrategicEventFeed: React.FC<StrategicEventFeedProps> = ({
  events,
  selectedEvent,
  onEventSelect,
  maxHeight = '600px',
  showFilters = true,
  className = '',
}) => {
  const [severityFilter, setSeverityFilter] = React.useState<string | null>(null);
  const [sortBy, setSortBy] = React.useState<'timestamp' | 'severity'>('timestamp');

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let filtered = [...events];
    
    if (severityFilter) {
      filtered = filtered.filter(event => event.severity === severityFilter);
    }
    
    return filtered.sort((a, b) => {
      if (sortBy === 'timestamp') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      } else {
        const severityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
        return severityOrder[b.severity as keyof typeof severityOrder] - 
               severityOrder[a.severity as keyof typeof severityOrder];
      }
    });
  }, [events, severityFilter, sortBy]);

  // Calculate event statistics
  const eventStats = useMemo(() => {
    const total = events.length;
    const critical = events.filter(e => e.severity === 'Critical').length;
    const high = events.filter(e => e.severity === 'High').length;
    const recent = events.filter(e => 
      new Date(e.timestamp).getTime() > Date.now() - (24 * 60 * 60 * 1000)
    ).length;
    
    return { total, critical, high, recent };
  }, [events]);

  const handleEventClick = (event: StrategicEvent) => {
    const newSelection = selectedEvent?.id === event.id ? null : event;
    onEventSelect?.(newSelection);
  };

  return (
    <motion.div 
      className={`h-full flex flex-col ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-[var(--neumorphic-border)] border-opacity-20">
        <div className="flex items-center justify-between mb-3">
          <NeumorphicHeading size="lg" className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-[var(--neumorphic-accent)]" />
            Strategic Events
          </NeumorphicHeading>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-[var(--neumorphic-radius-md)] bg-[var(--neumorphic-button)] shadow-[var(--neumorphic-shadow-convex)] hover:shadow-[var(--neumorphic-shadow-concave)]"
          >
            <RefreshCw className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-[var(--neumorphic-text-primary)]">
              {eventStats.total}
            </div>
            <div className="text-xs text-[var(--neumorphic-text-secondary)]">Total</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-[var(--neumorphic-severity-critical)]">
              {eventStats.critical}
            </div>
            <div className="text-xs text-[var(--neumorphic-text-secondary)]">Critical</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-[var(--neumorphic-severity-high)]">
              {eventStats.high}
            </div>
            <div className="text-xs text-[var(--neumorphic-text-secondary)]">High</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-[var(--neumorphic-accent)]">
              {eventStats.recent}
            </div>
            <div className="text-xs text-[var(--neumorphic-text-secondary)]">Recent</div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[var(--neumorphic-text-secondary)]" />
            
            <select
              value={severityFilter || 'All Severities'}
              onChange={(e) => setSeverityFilter(e.target.value === 'All Severities' ? null : e.target.value)}
              className="px-2 py-1 text-xs rounded-[var(--neumorphic-radius-sm)] bg-[var(--neumorphic-button)] border border-[var(--neumorphic-border)]"
            >
              <option value="All Severities">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            
            <select
              value={sortBy === 'timestamp' ? 'Sort by Time' : 'Sort by Severity'}
              onChange={(e) => setSortBy(e.target.value === 'Sort by Time' ? 'timestamp' : 'severity')}
              className="px-2 py-1 text-xs rounded-[var(--neumorphic-radius-sm)] bg-[var(--neumorphic-button)] border border-[var(--neumorphic-border)]"
            >
              <option value="Sort by Time">Sort by Time</option>
              <option value="Sort by Severity">Sort by Severity</option>
            </select>
          </div>
        )}
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--neumorphic-text-secondary)] scrollbar-track-[var(--neumorphic-bg)] hover:scrollbar-thumb-[var(--neumorphic-accent)] relative">
        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-[var(--neumorphic-text-secondary)] opacity-50" />
            <NeumorphicText variant="secondary">
              No events match your current filters
            </NeumorphicText>
          </div>
        ) : (
          <AnimatePresence>
            {filteredEvents.map((event, index) => (
              <EventItem
                key={event.id}
                event={event}
                isSelected={selectedEvent?.id === event.id}
                onClick={() => handleEventClick(event)}
                index={index}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Fade effect at bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-6 pointer-events-none"
        style={{
          background: `linear-gradient(transparent, var(--neumorphic-card))`,
        }}
      />
    </motion.div>
  );
};

export default StrategicEventFeed;