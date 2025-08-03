'use client';

import React, { useState } from 'react';
import { NeumorphicBackground } from '@/components/ui/neumorphic';
import { intelligenceFeedEvents, type IntelligenceFeedEvent } from '@/lib/sample-data/operations-dashboard-data';

interface IntelligenceFeedProps {
  events?: IntelligenceFeedEvent[];
  maxHeight?: string;
  realTimeMode?: boolean;
  refreshInterval?: number;
  onEventClick?: (event: IntelligenceFeedEvent) => void;
  onRealTimeModeChange?: (enabled: boolean) => void;
  showControls?: boolean;
  compact?: boolean;
  className?: string;
}

export function IntelligenceFeed({
  events = intelligenceFeedEvents,
  maxHeight = '400px',
  realTimeMode = true,
  refreshInterval = 30000,
  onEventClick,
}: IntelligenceFeedProps) {
  const [searchTerm] = useState('');
  const [selectedTypes] = useState<string[]>([]);
  const [selectedSeverities] = useState<string[]>([]);
  const [isPaused] = useState(false);

  // Real-time filtering logic would go here in production
  const filteredEvents = events.filter(event => {
    // Search filter
    if (searchTerm && !event.message.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Type filter
    if (selectedTypes.length > 0 && !selectedTypes.includes(event.type)) {
      return false;
    }
    
    // Severity filter
    if (selectedSeverities.length > 0 && !selectedSeverities.includes(event.severity)) {
      return false;
    }
    
    return true;
  });

  // Auto-refresh logic would be implemented here
  React.useEffect(() => {
    if (!realTimeMode || isPaused) return;
    
    const interval = setInterval(() => {
      // In production, this would fetch new events
      console.log('Refreshing intelligence feed...');
    }, refreshInterval);
    
    return () => clearInterval(interval);
  }, [realTimeMode, isPaused, refreshInterval]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success':
        return 'text-green-400 border-green-500/30';
      case 'warning':
        return 'text-yellow-400 border-yellow-500/30';
      case 'error':
        return 'text-red-400 border-red-500/30';
      default:
        return 'text-blue-400 border-blue-500/30';
    }
  };

  const getTypeIcon = () => {
    // Return appropriate icon based on type
    return '•';
  };

  return (
    <NeumorphicBackground>
      <div className="space-y-2">
        <div className="text-sm font-medium text-neumorphic-text-primary mb-3">
          Intelligence Feed ({filteredEvents.length} events)
        </div>
        
        <div 
          className="space-y-2 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neumorphic-border scrollbar-track-transparent"
          style={{ maxHeight }}
        >
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => onEventClick?.(event)}
              className={`
                p-3 rounded-lg border-l-4 cursor-pointer transition-all duration-200
                bg-neumorphic-card/50 hover:bg-neumorphic-card/80
                ${getSeverityColor(event.severity)}
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs">{getTypeIcon()}</span>
                    <span className="text-xs font-medium uppercase tracking-wide text-neumorphic-text-secondary">
                      {event.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-neumorphic-text-muted">{event.caseNumber}</span>
                  </div>
                  <p className="text-sm text-neumorphic-text-primary leading-relaxed">
                    {event.message}
                  </p>
                </div>
                <div className="text-xs text-neumorphic-text-muted ml-4 flex-shrink-0">
                  {new Date(event.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {filteredEvents.length === 0 && (
            <div className="text-center py-8 text-neumorphic-text-muted">
              <div className="text-sm">No intelligence events found</div>
              <div className="text-xs mt-1 opacity-70">Events will appear here as they occur</div>
            </div>
          )}
        </div>
      </div>
    </NeumorphicBackground>
  );
}