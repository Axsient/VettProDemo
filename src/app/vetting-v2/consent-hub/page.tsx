'use client';

import React, { useState } from 'react';
import { NeumorphicCard, NeumorphicText } from '@/components/ui/neumorphic';
import { Badge } from '@/components/ui/badge';
import { ConsentManagementTable } from '@/components/vetting/ConsentManagementTable';
import { sampleConsentRequests } from '@/lib/sample-data/consentRequestsSample';
import { 
  MessageSquare, 
  Shield, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Users
} from 'lucide-react';

export default function ConsentHubPage() {
  const [, setSelectedRequestId] = useState<string | null>(null);

  // Calculate summary stats from sample data
  const stats = {
    total: sampleConsentRequests.length,
    pending: sampleConsentRequests.filter(r => 
      r.status === 'PENDING_SENT' || 
      r.status === 'LINK_OPENED' || 
      r.status === 'FORM_VIEWED'
    ).length,
    completed: sampleConsentRequests.filter(r => 
      r.status === 'VERIFIED_APPROVED'
    ).length,
    expired: sampleConsentRequests.filter(r => 
      r.status === 'EXPIRED'
    ).length,
    avgResponseTime: '4.2 hours',
    signatureAccuracy: '98.7%'
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-blue-400" />
          <h1 className="text-2xl font-bold text-neumorphic-text-primary">
            Consent Communications Hub
          </h1>
          <Badge variant="outline" className="text-xs">
            Phase 3 - Mission Control
          </Badge>
        </div>
        <NeumorphicText variant="secondary" className="text-sm">
          Visual consent journey tracking with AI-powered signature verification and intelligent channel switching
        </NeumorphicText>
      </div>

      {/* KPI Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <NeumorphicCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-neumorphic-text-secondary mb-1">Total Requests</div>
              <div className="text-2xl font-bold text-neumorphic-text-primary">{stats.total}</div>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-400" />
          </div>
        </NeumorphicCard>

        <NeumorphicCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-neumorphic-text-secondary mb-1">Pending</div>
              <div className="text-2xl font-bold text-amber-400">{stats.pending}</div>
            </div>
            <Clock className="w-8 h-8 text-amber-400" />
          </div>
        </NeumorphicCard>

        <NeumorphicCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-neumorphic-text-secondary mb-1">Completed</div>
              <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </NeumorphicCard>

        <NeumorphicCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-neumorphic-text-secondary mb-1">Avg Response</div>
              <div className="text-2xl font-bold text-neumorphic-text-primary">{stats.avgResponseTime}</div>
            </div>
            <Users className="w-8 h-8 text-purple-400" />
          </div>
        </NeumorphicCard>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <NeumorphicCard className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <NeumorphicText className="font-medium">Channel Performance</NeumorphicText>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neumorphic-text-secondary">SMS Response Rate:</span>
              <span className="text-green-400 font-medium">87%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neumorphic-text-secondary">Email Response Rate:</span>
              <span className="text-blue-400 font-medium">72%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neumorphic-text-secondary">WhatsApp Response Rate:</span>
              <span className="text-purple-400 font-medium">91%</span>
            </div>
          </div>
        </NeumorphicCard>

        <NeumorphicCard className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <NeumorphicText className="font-medium">Attention Required</NeumorphicText>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neumorphic-text-secondary">Overdue Responses:</span>
              <span className="text-red-400 font-medium">{stats.expired}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neumorphic-text-secondary">Channel Failures:</span>
              <span className="text-amber-400 font-medium">3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neumorphic-text-secondary">Signature Issues:</span>
              <span className="text-red-400 font-medium">2</span>
            </div>
          </div>
        </NeumorphicCard>

        <NeumorphicCard className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-4 h-4 text-green-400" />
            <NeumorphicText className="font-medium">AI Verification</NeumorphicText>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neumorphic-text-secondary">Signature Accuracy:</span>
              <span className="text-green-400 font-medium">{stats.signatureAccuracy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neumorphic-text-secondary">Auto-Verified:</span>
              <span className="text-blue-400 font-medium">156</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neumorphic-text-secondary">Manual Review:</span>
              <span className="text-amber-400 font-medium">12</span>
            </div>
          </div>
        </NeumorphicCard>
      </div>

      {/* Main Table */}
      <NeumorphicCard className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <NeumorphicText className="font-medium">
              Consent Communications Overview
            </NeumorphicText>
            <Badge variant="outline" className="text-xs">
              Live Mission Board
            </Badge>
          </div>
          
          <ConsentManagementTable 
            requests={sampleConsentRequests}
            onViewRequest={setSelectedRequestId}
          />
        </div>
      </NeumorphicCard>
    </div>
  );
}