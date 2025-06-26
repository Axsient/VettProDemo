"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { 
  NeumorphicBackground,
  NeumorphicCard,
  NeumorphicText,
  NeumorphicHeading,
  NeumorphicButton,
  NeumorphicTable,
  NeumorphicTableHeader,
  NeumorphicTableBody,
  NeumorphicTableRow,
  NeumorphicTableHead,
  NeumorphicTableCell
} from '@/components/ui/neumorphic';
import { Input } from '@/components/ui/input';
import LazyLoad from '@/components/ui/LazyLoad';
import { getGeofences } from '@/lib/sample-data/fieldOperationsSample';
import { MapPinIcon, EditIcon, TrashIcon, SaveIcon } from 'lucide-react';
import { toast } from 'sonner';

// Dynamic import for InteractiveMap to handle SSR
const InteractiveMap = dynamic(() => import('@/components/maps/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <NeumorphicCard className="animate-pulse h-96">
      <div className="flex items-center justify-center h-full">
        <NeumorphicText variant="secondary">Loading Map...</NeumorphicText>
      </div>
    </NeumorphicCard>
  ),
});

interface Geofence {
  id: string;
  name: string;
  client: string;
}

interface GeoJsonData {
  type: string;
  coordinates: number[][][];
  properties?: Record<string, unknown>;
}

export default function GeofenceManagement() {
  const [geofences] = useState<Geofence[]>(getGeofences());
  const [zoneName, setZoneName] = useState('');
  const [drawnPolygon, setDrawnPolygon] = useState<GeoJsonData | null>(null);

  // Handle map drawing events (functionality to be implemented)
  // const handlePolygonCreated = (geoJsonData: GeoJsonData) => {
  //   console.log('Polygon created:', geoJsonData);
  //   setDrawnPolygon(geoJsonData);
  //   toast.success('Geofence polygon drawn successfully! You can now save it.');
  // };

  const handleSaveGeofence = () => {
    if (!zoneName.trim()) {
      toast.error('Please enter a zone name');
      return;
    }

    if (!drawnPolygon) {
      toast.warning('Please draw a geofence polygon on the map first');
      return;
    }

    toast.success(`Geofence "${zoneName}" has been saved successfully!`);
    setZoneName('');
    setDrawnPolygon(null);
  };

  const handleEditGeofence = (geofence: Geofence) => {
    toast.info(`Edit functionality for "${geofence.name}" would open here`);
  };

  const handleDeleteGeofence = (geofence: Geofence) => {
    toast.warning(`Delete confirmation for "${geofence.name}" would appear here`);
  };

  // Map configuration for South Africa (Westonaria area)
  const mapConfig = {
    center: [-26.3195, 27.6499] as [number, number], // Westonaria coordinates
    zoom: 10,
    markers: [
      {
        id: "westonaria-1",
        position: [-26.3195, 27.6499] as [number, number],
        type: "geofence" as const,
        title: "Westonaria Area",
        description: "Primary geofence monitoring area for supplier verification",
        status: "active" as const,
        priority: "medium" as const
      }
    ]
  };

  return (
    <NeumorphicBackground className="min-h-screen">
      <div className="w-full space-y-2">
        {/* Two-column responsive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          
          {/* Left Column (1 column wide) - Managed Geofences */}
          <div className="lg:col-span-1">
            <NeumorphicCard>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5 text-[var(--neumorphic-text-primary)]" />
                  <NeumorphicHeading>Managed Geofences</NeumorphicHeading>
                </div>
                
                <NeumorphicText variant="secondary" className="leading-tight">
                  View and manage the geographic boundaries for supplier location verification.
                </NeumorphicText>

                {/* Geofences Table */}
                <NeumorphicTable>
                  <NeumorphicTableHeader>
                    <NeumorphicTableRow>
                      <NeumorphicTableHead>Zone Name</NeumorphicTableHead>
                      <NeumorphicTableHead>Client</NeumorphicTableHead>
                      <NeumorphicTableHead>Actions</NeumorphicTableHead>
                    </NeumorphicTableRow>
                  </NeumorphicTableHeader>
                  <NeumorphicTableBody>
                    {geofences.map((geofence) => (
                      <NeumorphicTableRow key={geofence.id}>
                        <NeumorphicTableCell>
                          <NeumorphicText className="font-medium">
                            {geofence.name}
                          </NeumorphicText>
                        </NeumorphicTableCell>
                        <NeumorphicTableCell>
                          <NeumorphicText variant="secondary">
                            {geofence.client}
                          </NeumorphicText>
                        </NeumorphicTableCell>
                        <NeumorphicTableCell>
                          <div className="flex items-center gap-1">
                            <NeumorphicButton
                              className="text-xs px-2 py-1"
                              onClick={() => handleEditGeofence(geofence)}
                            >
                              <EditIcon className="w-3 h-3 mr-1" />
                              Edit
                            </NeumorphicButton>
                            <NeumorphicButton
                              className="text-xs px-2 py-1 bg-red-500 hover:bg-red-600"
                              onClick={() => handleDeleteGeofence(geofence)}
                            >
                              <TrashIcon className="w-3 h-3 mr-1" />
                              Delete
                            </NeumorphicButton>
                          </div>
                        </NeumorphicTableCell>
                      </NeumorphicTableRow>
                    ))}
                  </NeumorphicTableBody>
                </NeumorphicTable>
              </div>
            </NeumorphicCard>
          </div>

          {/* Right Column (2 columns wide) - Geofence Editor */}
          <div className="lg:col-span-2">
            <NeumorphicCard>
              <div className="space-y-4">
                <NeumorphicHeading>Geofence Editor</NeumorphicHeading>
                <NeumorphicText variant="secondary" className="leading-tight">
                  Use the drawing tools on the map to create new geofence boundaries. Click and drag to draw a polygon around the desired area.
                </NeumorphicText>

                {/* Interactive Map with Drawing Tools */}
                <div className="h-96">
                  <LazyLoad 
                    fallback={
                      <NeumorphicCard className="animate-pulse h-96">
                        <div className="flex items-center justify-center h-full">
                          <NeumorphicText variant="secondary">Loading Geofence Editor...</NeumorphicText>
                        </div>
                      </NeumorphicCard>
                    }
                  >
                    <InteractiveMap {...mapConfig} />
                  </LazyLoad>
                </div>

                {/* Save Form */}
                <div className="border-t border-[var(--neumorphic-border)] pt-4">
                  <div className="space-y-3">
                    <NeumorphicText className="font-medium">Save New Geofence</NeumorphicText>
                    <div className="flex gap-3 items-end">
                      <div className="flex-1">
                        <NeumorphicText size="sm" className="font-medium mb-1">Zone Name *</NeumorphicText>
                        <Input
                          placeholder="Enter zone name (e.g., Sibanye-Carletonville Zone)"
                          value={zoneName}
                          onChange={(e) => setZoneName(e.target.value)}
                          className="bg-[var(--neumorphic-card)] border-[var(--neumorphic-border)]"
                        />
                      </div>
                      <NeumorphicButton 
                        onClick={handleSaveGeofence}
                        className="flex items-center gap-2"
                      >
                        <SaveIcon className="w-4 h-4" />
                        Save New Geofence
                      </NeumorphicButton>
                    </div>
                    {drawnPolygon && (
                      <NeumorphicText size="sm" className="text-green-600">
                        ✓ Polygon drawn and ready to save
                      </NeumorphicText>
                    )}
                  </div>
                </div>
              </div>
            </NeumorphicCard>
          </div>
        </div>
      </div>
    </NeumorphicBackground>
  );
} 