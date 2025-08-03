'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  NeumorphicText,
  NeumorphicCard
} from '@/components/ui/neumorphic';
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Play,
  User,
  FileText,
  Send,
  Bell,
  Zap
} from 'lucide-react';
import { ActiveVettingCase } from '@/types/vetting';

interface TimelineEvent {
  id: string;
  timestamp: string;
  event: string;
  user: string;
  details?: string;
  type: 'created' | 'consent' | 'check_started' | 'check_completed' | 'adverse' | 'assignment' | 'approval' | 'system';
}

interface TimelineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vettingCase: ActiveVettingCase;
}

// Generate timeline events from vetting case data
const generateTimelineEvents = (vettingCase: ActiveVettingCase): TimelineEvent[] => {
  const events: TimelineEvent[] = [];
  
  // Case creation event
  events.push({
    id: 'evt_created',
    timestamp: vettingCase.initiatedDate,
    event: 'Case Created',
    user: vettingCase.initiatedBy || 'System',
    details: `Initial vetting case created for ${vettingCase.entityName}`,
    type: 'created'
  });
  
  // Assignment event
  if (vettingCase.assignedDate && vettingCase.assignedVettingOfficer) {
    events.push({
      id: 'evt_assigned',
      timestamp: vettingCase.assignedDate,
      event: 'Case Assigned',
      user: 'System',
      details: `Assigned to ${vettingCase.assignedVettingOfficer}`,
      type: 'assignment'
    });
  }
  
  // Consent events (simulated)
  if (vettingCase.status !== 'Consent Pending') {
    const consentTime = new Date(new Date(vettingCase.initiatedDate).getTime() + 6 * 60 * 60 * 1000).toISOString();
    events.push({
      id: 'evt_consent_sent',
      timestamp: consentTime,
      event: 'Consent Request Sent',
      user: 'System',
      details: 'Digital consent link sent to entity',
      type: 'consent'
    });
    
    const consentReceivedTime = new Date(new Date(consentTime).getTime() + 4 * 60 * 60 * 1000).toISOString();
    events.push({
      id: 'evt_consent_received',
      timestamp: consentReceivedTime,
      event: 'Consent Received',
      user: 'System',
      details: 'Digital signature submitted and verified',
      type: 'consent'
    });
  }
  
  // Individual check events
  vettingCase.individualChecks.forEach((check, index) => {
    if (check.actualStartDate) {
      events.push({
        id: `evt_check_start_${check.checkId || index}`,
        timestamp: check.actualStartDate,
        event: 'Check Dispatched',
        user: 'System',
        details: `${check.checkDefinition.name} sent to ${check.provider}`,
        type: 'check_started'
      });
    }
    
    if (check.completedDate) {
      const isAdverse = check.result?.includes('Adverse') || check.status === 'Complete - Adverse Finding';
      events.push({
        id: `evt_check_complete_${check.checkId || index}`,
        timestamp: check.completedDate,
        event: isAdverse ? 'Adverse Finding' : 'Check Completed',
        user: `${check.provider} Webhook`,
        details: `${check.checkDefinition.name} - Result: ${check.result || 'Clear'}`,
        type: isAdverse ? 'adverse' : 'check_completed'
      });
    }
  });
  
  // Flagged for review event
  if (vettingCase.flaggedForReview && vettingCase.flaggedReason) {
    const flaggedTime = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
    events.push({
      id: 'evt_flagged',
      timestamp: flaggedTime,
      event: 'Case Flagged for Review',
      user: vettingCase.assignedVettingOfficer || 'System',
      details: vettingCase.flaggedReason,
      type: 'adverse'
    });
  }
  
  // Sort events by timestamp
  return events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

const getEventIcon = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'created': return <FileText className="w-4 h-4 text-blue-400" />;
    case 'consent': return <Send className="w-4 h-4 text-purple-400" />;
    case 'check_started': return <Play className="w-4 h-4 text-yellow-400" />;
    case 'check_completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
    case 'adverse': return <AlertTriangle className="w-4 h-4 text-red-400" />;
    case 'assignment': return <User className="w-4 h-4 text-blue-400" />;
    case 'approval': return <CheckCircle className="w-4 h-4 text-green-400" />;
    case 'system': return <Bell className="w-4 h-4 text-gray-400" />;
    default: return <Clock className="w-4 h-4 text-gray-400" />;
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getEventColor = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'created': return 'bg-blue-500/10 border-blue-400/30 shadow-[var(--neumorphic-shadow-sm)]';
    case 'consent': return 'bg-purple-500/10 border-purple-400/30 shadow-[var(--neumorphic-shadow-sm)]';
    case 'check_started': return 'bg-yellow-500/10 border-yellow-400/30 shadow-[var(--neumorphic-shadow-sm)]';
    case 'check_completed': return 'bg-green-500/10 border-green-400/30 shadow-[var(--neumorphic-shadow-sm)]';
    case 'adverse': return 'bg-red-500/10 border-red-400/30 shadow-[var(--neumorphic-shadow-sm)]';
    case 'assignment': return 'bg-blue-500/10 border-blue-400/30 shadow-[var(--neumorphic-shadow-sm)]';
    case 'approval': return 'bg-green-500/10 border-green-400/30 shadow-[var(--neumorphic-shadow-sm)]';
    case 'system': return 'bg-[var(--neumorphic-surface-secondary)] border-[var(--neumorphic-border)] shadow-[var(--neumorphic-shadow-sm)]';
    default: return 'bg-[var(--neumorphic-surface-secondary)] border-[var(--neumorphic-border)] shadow-[var(--neumorphic-shadow-sm)]';
  }
};

export default function TimelineDialog({
  isOpen,
  onClose,
  vettingCase
}: TimelineDialogProps) {
  const timelineEvents = generateTimelineEvents(vettingCase);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden neumorphic-card border-[var(--neumorphic-border)] z-[9999]">
        <DialogHeader className="pb-4 border-b border-[var(--neumorphic-border)]">
          <DialogTitle className="flex items-center gap-2 text-[var(--neumorphic-text-primary)]">
            <Clock className="w-5 h-5 text-blue-400" />
            Case Timeline - {vettingCase.caseNumber}
          </DialogTitle>
          <DialogDescription className="text-[var(--neumorphic-text-secondary)]">
            Complete chronological timeline of all events for {vettingCase.entityName}
          </DialogDescription>
        </DialogHeader>

        {/* Case Summary */}
        <NeumorphicCard className="p-4 mb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <NeumorphicText size="xs" variant="secondary">Status</NeumorphicText>
              <Badge variant="outline" className="mt-1">
                {vettingCase.status}
              </Badge>
            </div>
            <div>
              <NeumorphicText size="xs" variant="secondary">Priority</NeumorphicText>
              <Badge 
                variant={vettingCase.priority === 'Urgent' ? 'destructive' : 'outline'}
                className="mt-1"
              >
                {vettingCase.priority}
              </Badge>
            </div>
            <div>
              <NeumorphicText size="xs" variant="secondary">Progress</NeumorphicText>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-2 bg-[var(--neumorphic-surface-secondary)] rounded-full flex-1">
                  <div 
                    className="h-full bg-blue-400 rounded-full transition-all duration-300"
                    style={{ width: `${vettingCase.overallProgress}%` }}
                  />
                </div>
                <NeumorphicText size="xs">{vettingCase.overallProgress}%</NeumorphicText>
              </div>
            </div>
            <div>
              <NeumorphicText size="xs" variant="secondary">Officer</NeumorphicText>
              <NeumorphicText size="sm" className="mt-1">
                {vettingCase.assignedVettingOfficer || 'Unassigned'}
              </NeumorphicText>
            </div>
          </div>
        </NeumorphicCard>

        {/* Timeline */}
        <div className="flex-1 overflow-auto max-h-[50vh]">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400/30 via-[var(--neumorphic-border)] to-blue-400/30" />
            
            <div className="space-y-4">
              {timelineEvents.map((event, index) => {
                const { date, time } = formatTimestamp(event.timestamp);
                const isUrgent = event.type === 'adverse' || vettingCase.priority === 'Urgent';
                
                return (
                  <div key={event.id} className="relative flex items-start gap-4">
                    {/* Timeline dot */}
                    <div className={`
                      relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2
                      bg-[var(--neumorphic-card)] border-[var(--neumorphic-border)]
                      shadow-[var(--neumorphic-shadow)] hover:shadow-[var(--neumorphic-shadow-lg)]
                      transition-all duration-200
                      ${isUrgent ? 'animate-pulse ring-2 ring-yellow-400/30' : ''}
                    `}>
                      {getEventIcon(event.type)}
                      {isUrgent && (
                        <Zap className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400" />
                      )}
                    </div>
                    
                    {/* Event content */}
                    <div className="flex-1 min-w-0">
                      <NeumorphicCard className={`
                        p-3 transition-all duration-200
                        ${isUrgent ? 'ring-2 ring-yellow-400/30' : ''}
                      `}>
                        <div className="flex items-center justify-between mb-2">
                          <NeumorphicText className="font-medium">
                            {event.event}
                          </NeumorphicText>
                          <div className="text-right">
                            <NeumorphicText size="xs" variant="secondary" suppressHydrationWarning>
                              {date}
                            </NeumorphicText>
                            <NeumorphicText size="xs" variant="secondary" suppressHydrationWarning>
                              {time}
                            </NeumorphicText>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-3 h-3 text-[var(--neumorphic-text-secondary)]" />
                          <NeumorphicText size="xs" variant="secondary">
                            {event.user}
                          </NeumorphicText>
                        </div>
                        
                        {event.details && (
                          <NeumorphicText size="sm" variant="secondary">
                            {event.details}
                          </NeumorphicText>
                        )}
                        
                        {/* Add some context for specific event types */}
                        {event.type === 'adverse' && (
                          <div className="mt-2 p-2 bg-red-500/10 rounded border border-red-400/30">
                            <div className="flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-red-400" />
                              <NeumorphicText size="xs" className="font-medium text-red-400">
                                Requires Review
                              </NeumorphicText>
                            </div>
                          </div>
                        )}
                        
                        {event.type === 'check_completed' && index === timelineEvents.length - 1 && (
                          <div className="mt-2 p-2 bg-blue-500/10 rounded border border-blue-400/30">
                            <NeumorphicText size="xs" className="text-blue-400">
                              Most recent update
                            </NeumorphicText>
                          </div>
                        )}
                      </NeumorphicCard>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Future events indicator */}
            {vettingCase.status !== 'Complete' && (
              <div className="relative flex items-start gap-4 mt-4 opacity-50">
                <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 border-dashed border-[var(--neumorphic-border)] bg-[var(--neumorphic-surface-secondary)]">
                  <Clock className="w-4 h-4 text-[var(--neumorphic-text-secondary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <NeumorphicCard className="p-3 border-dashed">
                    <NeumorphicText variant="secondary">
                      Awaiting next update...
                    </NeumorphicText>
                  </NeumorphicCard>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer stats */}
        <div className="pt-4 border-t border-[var(--neumorphic-border)]">
          <div className="flex items-center justify-between text-xs">
            <NeumorphicText variant="secondary">
              {timelineEvents.length} events recorded
            </NeumorphicText>
            <NeumorphicText variant="secondary">
              Last updated: {formatTimestamp(vettingCase.lastStatusUpdate).date} at {formatTimestamp(vettingCase.lastStatusUpdate).time}
            </NeumorphicText>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}