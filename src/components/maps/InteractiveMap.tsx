import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import * as L from 'leaflet';
import { NeumorphicCard, NeumorphicText, NeumorphicBadge, NeumorphicButton } from '@/components/ui/neumorphic';
import { Navigation, Clock, Users, AlertTriangle, Building2, Users2, Search, Shield, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
interface MarkerData {
  id: string;
  position: [number, number];
  type: 'verification' | 'community' | 'risk' | 'completed' | 'geofence';
  title: string;
  description: string;
  status: 'active' | 'pending' | 'risk' | 'completed' | 'scheduled';
  timestamp?: string;
  assignee?: string;
  priority?: 'high' | 'medium' | 'low';
}

interface InteractiveMapProps {
  className?: string;
  height?: string;
  markers?: MarkerData[];
  center?: [number, number];
  zoom?: number;
  showControls?: boolean;
  showGeofences?: boolean;
  onMarkerClick?: (marker: MarkerData) => void;
}

// Sample marker data for South African locations
const sampleMarkers: MarkerData[] = [
  {
    id: '1',
    position: [-26.2041, 28.0473], // Johannesburg
    type: 'verification',
    title: 'ABC Manufacturing',
    description: 'Business verification in progress for new supplier registration.',
    status: 'active',
    timestamp: '2024-01-15 14:30',
    assignee: 'John Smith',
    priority: 'high'
  },
  {
    id: '2',
    position: [-25.7479, 28.2293], // Pretoria
    type: 'community',
    title: 'Community Center Check',
    description: 'Community verification for local service provider assessment.',
    status: 'pending',
    timestamp: '2024-01-15 12:00',
    assignee: 'Sarah Johnson',
    priority: 'medium'
  },
  {
    id: '3',
    position: [-26.1367, 27.9392], // Randburg
    type: 'risk',
    title: 'Risk Alert - XYZ Corp',
    description: 'High-risk location flagged for immediate attention and review.',
    status: 'risk',
    timestamp: '2024-01-15 16:45',
    assignee: 'Mike Wilson',
    priority: 'high'
  },
  {
    id: '4',
    position: [-26.1076, 28.0567], // Sandton
    type: 'completed',
    title: 'Tech Solutions Ltd',
    description: 'Verification completed successfully. All requirements met.',
    status: 'completed',
    timestamp: '2024-01-14 11:20',
    assignee: 'Lisa Brown',
    priority: 'low'
  },
  {
    id: '5',
    position: [-26.2678, 27.8546], // Soweto
    type: 'geofence',
    title: 'Geofence Monitoring',
    description: 'Scheduled monitoring area for ongoing compliance checks.',
    status: 'scheduled',
    timestamp: '2024-01-16 09:00',
    assignee: 'David Lee',
    priority: 'medium'
  }
];

// Geofence areas
const geofenceAreas = [
  {
    id: 'geo1',
    center: [-26.2041, 28.0473],
    radius: 3000,
    color: '#3B82F6',
    name: 'Johannesburg Central'
  },
  {
    id: 'geo2',
    center: [-26.1076, 28.0567],
    radius: 2000,
    color: '#10B981',
    name: 'Sandton Business District'
  }
];

// Create animated marker icons with pulsing effects
const createAnimatedIcon = (type: MarkerData['type'], status: MarkerData['status']) => {
  const getIconColor = () => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'active': return '#3B82F6';
      case 'pending': return '#F59E0B';
      case 'risk': return '#EF4444';
      case 'scheduled': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getIconSymbol = () => {
    switch (type) {
      case 'verification': return '🏢';
      case 'community': return '👥';
      case 'geofence': return '🔍';
      case 'risk': return '⚠️';
      case 'completed': return '✅';
      default: return '📍';
    }
  };

  const color = getIconColor();
  const symbol = getIconSymbol();
  const uniqueId = Math.random().toString(36).substr(2, 9);

  // Create animated divIcon with pulsing ring
  return L.divIcon({
    className: 'animated-marker-icon',
    html: `
      <style>
        .pulse-ring-${uniqueId} {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          border: 3px solid ${color};
          background: ${color}20;
          border-radius: 50%;
          animation: pulse-${status} 2s infinite;
          pointer-events: none;
        }
        
        @keyframes pulse-${status} {
          0% {
            transform: translate(-50%, -50%) scale(0.1);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.7;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }
        
        .marker-dot-${uniqueId} {
          width: 24px;
          height: 24px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50%;
          position: relative;
          z-index: 10;
          box-shadow: 0 0 15px ${color}80;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }
        
        .marker-container-${uniqueId} {
          position: relative;
          display: inline-block;
        }
      </style>
      <div class="marker-container-${uniqueId}">
        <div class="pulse-ring-${uniqueId}"></div>
        <div class="marker-dot-${uniqueId}">${symbol}</div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
    className: `animated-marker marker-${status} marker-${type}`
  });
};

// Main InteractiveMap component
const InteractiveMap: React.FC<InteractiveMapProps> = ({
  className = "",
  height = '500px',
  markers = sampleMarkers,
  center = [-26.2041, 28.0473] as [number, number],
  zoom = 10,
  showControls = true,
  showGeofences = true,
  onMarkerClick
}) => {
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    console.log('InteractiveMap loaded with markers:', markers);
    
    // Fix Leaflet default icons
    // @ts-ignore - Leaflet workaround for default icons
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, [markers]);

  const handleMarkerClick = (marker: MarkerData) => {
    console.log('Marker clicked:', marker);
    onMarkerClick?.(marker);
  };

  const getStatusBadgeVariant = (status: MarkerData['status']): "default" | "success" | "warning" | "danger" | "info" => {
    switch (status) {
      case 'completed': return 'success';
      case 'active': return 'info';
      case 'pending': return 'warning';
      case 'risk': return 'danger';
      case 'scheduled': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: MarkerData['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getTypeIcon = (type: MarkerData['type']) => {
    switch (type) {
      case 'verification': return <Building2 className="w-4 h-4" />;
      case 'community': return <Users2 className="w-4 h-4" />;
      case 'geofence': return <Search className="w-4 h-4" />;
      case 'risk': return <Shield className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Navigation className="w-4 h-4" />;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div 
        style={{ height }} 
        className="rounded-lg overflow-hidden shadow-lg border border-gray-200"
      >
        <MapContainer
          ref={mapRef}
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Geofence Areas */}
          {showGeofences && geofenceAreas.map((area) => (
            <Circle
              key={area.id}
              center={area.center}
              radius={area.radius}
              pathOptions={{
                color: area.color,
                fillColor: area.color,
                fillOpacity: 0.1,
                weight: 2,
                dashArray: '10, 10'
              }}
            />
          ))}

          {/* Animated Markers */}
          {markers.map((marker) => {
            console.log('Rendering marker:', marker.id, marker.position);
            return (
              <Marker
                key={marker.id}
                position={marker.position}
                icon={createAnimatedIcon(marker.type, marker.status)}
                eventHandlers={{
                  click: () => handleMarkerClick(marker)
                }}
              >
                <Popup className="neumorphic-map-popup">
                  <div className="p-4 min-w-[280px] space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn("text-muted-foreground", getPriorityColor(marker.priority))}>
                          {getTypeIcon(marker.type)}
                        </div>
                        <h4 className="text-foreground font-semibold">{marker.title}</h4>
                      </div>
                      <NeumorphicBadge variant={getStatusBadgeVariant(marker.status)}>
                        {marker.status}
                      </NeumorphicBadge>
                    </div>

                    <p className="text-muted-foreground text-sm">
                      {marker.description}
                    </p>

                    <div className="space-y-2">
                      {marker.timestamp && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {marker.timestamp}
                          </span>
                        </div>
                      )}
                      
                      {marker.assignee && (
                        <div className="flex items-center gap-2">
                          <Users className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Assigned to: {marker.assignee}
                          </span>
                        </div>
                      )}

                      {marker.priority && (
                        <div className="flex items-center gap-2">
                          <AlertTriangle className={cn("w-3 h-3", getPriorityColor(marker.priority))} />
                          <span className="text-sm text-muted-foreground">
                            Priority: <span className={getPriorityColor(marker.priority)}>{marker.priority}</span>
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <NeumorphicButton className="flex-1 px-3 py-1 text-sm">
                        View Details
                      </NeumorphicButton>
                      {marker.status === 'pending' && (
                        <NeumorphicButton className="bg-green-600 hover:bg-green-700 px-3 py-1 text-sm">
                          Start Verification
                        </NeumorphicButton>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Map Controls - Legend */}
      {showControls && (
        <div className="absolute bottom-4 left-4 z-[1000] space-y-2">
          <NeumorphicCard className="p-3 max-w-[220px]">
            <div className="flex items-center gap-2 mb-3">
              <Navigation className="w-4 h-4 text-[var(--neumorphic-text-primary)]" />
              <NeumorphicText size="sm" className="font-medium">Legend</NeumorphicText>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                <NeumorphicText size="sm">Active Verification</NeumorphicText>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <NeumorphicText size="sm">Completed</NeumorphicText>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
                <NeumorphicText size="sm">Pending</NeumorphicText>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                <NeumorphicText size="sm">Risk Alert</NeumorphicText>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
                <NeumorphicText size="sm">Scheduled</NeumorphicText>
              </div>
            </div>
          </NeumorphicCard>
        </div>
      )}

      {/* Map Stats */}
      <div className="absolute bottom-4 right-4 z-[1000]">
        <NeumorphicCard className="p-3 min-w-[140px]">
          <NeumorphicText size="sm" className="font-medium mb-3">Live Stats</NeumorphicText>
          <div className="space-y-2">
            <div className="flex justify-between gap-4">
              <NeumorphicText size="sm">Active:</NeumorphicText>
              <NeumorphicText size="sm" className="font-medium text-blue-400">
                {markers.filter(m => m.status === 'active').length}
              </NeumorphicText>
            </div>
            <div className="flex justify-between gap-4">
              <NeumorphicText size="sm">Pending:</NeumorphicText>
              <NeumorphicText size="sm" className="font-medium text-yellow-400">
                {markers.filter(m => m.status === 'pending').length}
              </NeumorphicText>
            </div>
            <div className="flex justify-between gap-4">
              <NeumorphicText size="sm">Risk:</NeumorphicText>
              <NeumorphicText size="sm" className="font-medium text-red-400">
                {markers.filter(m => m.status === 'risk').length}
              </NeumorphicText>
            </div>
            <div className="flex justify-between gap-4">
              <NeumorphicText size="sm">Completed:</NeumorphicText>
              <NeumorphicText size="sm" className="font-medium text-green-400">
                {markers.filter(m => m.status === 'completed').length}
              </NeumorphicText>
            </div>
          </div>
        </NeumorphicCard>
      </div>

      {/* CSS for animations and styling */}
      <style jsx global>{`
        .custom-popup .leaflet-popup-content-wrapper {
          background: transparent !important;
          border-radius: 8px !important;
          box-shadow: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        
        .custom-popup .leaflet-popup-content {
          margin: 0 !important;
          padding: 0 !important;
          background: transparent !important;
        }
        
        .custom-popup .leaflet-popup-tip {
          background: white !important;
          border: 1px solid #e5e7eb !important;
        }

        .custom-popup .leaflet-popup-close-button {
          color: #374151 !important;
          background: #f9fafb !important;
          border-radius: 50% !important;
          width: 24px !important;
          height: 24px !important;
          font-size: 14px !important;
          font-weight: bold !important;
          right: 8px !important;
          top: 8px !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
        }

        .custom-popup .leaflet-popup-close-button:hover {
          background: #f3f4f6 !important;
        }

        .leaflet-marker-icon.animated-marker {
          background: transparent !important;
          border: none !important;
        }

        .leaflet-container {
          background: #f8fafc !important;
          border-radius: 8px !important;
        }

        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
          border-radius: 6px !important;
          overflow: hidden;
          background: white !important;
          border: 1px solid #e5e7eb !important;
        }

        .leaflet-control-zoom a {
          background: white !important;
          color: #374151 !important;
          border: none !important;
          width: 40px !important;
          height: 40px !important;
          line-height: 38px !important;
          font-size: 18px !important;
          font-weight: bold !important;
          transition: all 0.2s ease !important;
          text-decoration: none !important;
        }

        .leaflet-control-zoom a:hover {
          background: #f9fafb !important;
          transform: scale(0.95);
        }

        .leaflet-control-attribution {
          background: rgba(255, 255, 255, 0.9) !important;
          color: #6b7280 !important;
          border-radius: 6px !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
          border: 1px solid #e5e7eb !important;
          font-size: 11px !important;
          backdrop-filter: blur(4px);
        }

        .leaflet-control-attribution a {
          color: #374151 !important;
        }
      `}</style>
    </div>
  );
};

export default InteractiveMap;