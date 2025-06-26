"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { NeumorphicCard, NeumorphicText } from '@/components/ui/neumorphic';

// Dynamically import InteractiveMap to avoid SSR issues
const InteractiveMap = dynamic(() => import('@/components/maps/InteractiveMap'), {
  loading: () => (
    <div className="flex items-center justify-center h-[600px] bg-[var(--neumorphic-card)] rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--neumorphic-text-primary)] mx-auto mb-4"></div>
        <NeumorphicText className="text-neumorphic-text-secondary">Loading Interactive Map...</NeumorphicText>
      </div>
    </div>
  )
});

export default function MapOverview() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Field Operations Map</h1>
          <NeumorphicText variant="secondary">
            Real-time visualization of verification activities, geofences, and field operations across South Africa
          </NeumorphicText>
        </div>
      </div>

      <NeumorphicCard className="p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Interactive Map</h2>
          <NeumorphicText variant="secondary" size="sm">
            Field operations map with animated markers, geofences, and real-time verification status.
          </NeumorphicText>
        </div>
        
        <div className="relative">
          <InteractiveMap 
            height="600px"
            showControls={true}
            showGeofences={true}
            className="rounded-lg overflow-hidden"
          />
        </div>
      </NeumorphicCard>

      {/* Map Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <NeumorphicCard className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🎯</span>
            <h3 className="font-semibold">Animated Markers</h3>
          </div>
          <NeumorphicText variant="secondary" size="sm">
            Pulsing and glowing markers with status-based colors and animations
          </NeumorphicText>
        </NeumorphicCard>

        <NeumorphicCard className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">💬</span>
            <h3 className="font-semibold">Rich Popups</h3>
          </div>
          <NeumorphicText variant="secondary" size="sm">
            Detailed information cards with neumorphic styling and actions
          </NeumorphicText>
        </NeumorphicCard>

        <NeumorphicCard className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🛡️</span>
            <h3 className="font-semibold">Geofences</h3>
          </div>
          <NeumorphicText variant="secondary" size="sm">
            Visual boundary areas for enhanced monitoring and alerts
          </NeumorphicText>
        </NeumorphicCard>

        <NeumorphicCard className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">📊</span>
            <h3 className="font-semibold">Live Stats</h3>
          </div>
          <NeumorphicText variant="secondary" size="sm">
            Real-time counters and status indicators for active operations
          </NeumorphicText>
        </NeumorphicCard>

        <NeumorphicCard className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🎨</span>
            <h3 className="font-semibold">Theme Integration</h3>
          </div>
          <NeumorphicText variant="secondary" size="sm">
            Full neumorphic theme support with dark/light mode compatibility
          </NeumorphicText>
        </NeumorphicCard>

        <NeumorphicCard className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">⚡</span>
            <h3 className="font-semibold">Performance</h3>
          </div>
          <NeumorphicText variant="secondary" size="sm">
            Optimized rendering with SSR support and lazy loading
          </NeumorphicText>
        </NeumorphicCard>
      </div>
    </div>
  );
} 