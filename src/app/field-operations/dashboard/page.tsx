"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { 
  NeumorphicBackground,
  NeumorphicCard,
  NeumorphicText,
  NeumorphicHeading,
  NeumorphicStatsCard,
  NeumorphicBadge,
  NeumorphicTable,
  NeumorphicTableHeader,
  NeumorphicTableBody,
  NeumorphicTableRow,
  NeumorphicTableHead,
  NeumorphicTableCell,
  NeumorphicButton
} from '@/components/ui/neumorphic';
import LazyLoad from '@/components/ui/LazyLoad';
import { getFieldAgents, getLocationVerificationTasks } from '@/lib/sample-data/fieldOperationsSample';
import { ActivityIcon, CheckCircleIcon, ClockIcon, AlertCircleIcon, MapPinIcon } from 'lucide-react';

// Dynamic import for InteractiveMap to handle SSR
const InteractiveMap = dynamic(() => import('@/components/maps/InteractiveMap'), {
  ssr: false,
  loading: () => <NeumorphicCard className="animate-pulse h-96 flex items-center justify-center">
    <NeumorphicText variant="secondary">Loading map...</NeumorphicText>
  </NeumorphicCard>
});

// Task Status Chart Component
const TaskStatusChart = () => {
  const verificationTasks = getLocationVerificationTasks();
  
  // Count tasks by status
  const statusCounts = verificationTasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = verificationTasks.length;
  
  // Define colors for each status
  const statusColors = {
    'Submitted': '#10B981', // green
    'In Progress': '#F59E0B', // yellow
    'Overdue': '#EF4444', // red
    'Pending Assignment': '#6B7280', // gray
    'Completed': '#3B82F6' // blue
  };

  return (
    <div className="space-y-4">
      {/* Simple status breakdown */}
      <div className="space-y-3">
        {Object.entries(statusCounts).map(([status, count]) => {
          const percentage = Math.round((count / total) * 100);
          return (
            <div key={status} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: statusColors[status as keyof typeof statusColors] || '#6B7280' }}
                  />
                  <NeumorphicText size="sm">{status}</NeumorphicText>
                </div>
                <NeumorphicText size="sm" className="font-medium">
                  {count} ({percentage}%)
                </NeumorphicText>
              </div>
              <div className="w-full bg-[var(--neumorphic-card)] rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: statusColors[status as keyof typeof statusColors] || '#6B7280'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Summary stats */}
      <div className="mt-4 p-3 bg-[var(--neumorphic-card)] bg-opacity-30 rounded-lg">
        <div className="flex justify-between items-center">
          <NeumorphicText size="sm" variant="secondary">Total Tasks</NeumorphicText>
          <NeumorphicText size="sm" className="font-semibold">{total}</NeumorphicText>
        </div>
      </div>
    </div>
  );
};

export default function FieldOperationsDashboard() {
  const fieldAgents = getFieldAgents();
  const verificationTasks = getLocationVerificationTasks();
  
  // Calculate stats
  const activeAgents = fieldAgents.filter(agent => agent.status !== 'Offline').length;
  const pendingVerifications = verificationTasks.filter(task => task.status === 'Pending Assignment').length;
  const overdueTasks = verificationTasks.filter(task => task.status === 'Overdue').length;
  const newCommunityMembers = 4; // Hardcoded as per guide
  const recentSubmissions = verificationTasks.filter(task => 
    task.status === 'Submitted' || task.status === 'Completed'
  ).slice(0, 3);

  return (
    <NeumorphicBackground className="min-h-screen">
      <div className="w-full space-y-2">
        {/* Header Section */}
        <NeumorphicCard>
          <div>
            <NeumorphicHeading>Field Operations Dashboard</NeumorphicHeading>
            <NeumorphicText variant="secondary" className="leading-tight">
              Real-time command center for field operations team with live status updates and task management.
            </NeumorphicText>
          </div>
        </NeumorphicCard>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <NeumorphicStatsCard
            title="Active Agents"
            value={activeAgents.toString()}
            icon={<ActivityIcon className="w-6 h-6 text-green-400" />}
          />
          <NeumorphicStatsCard
            title="Pending Verifications"
            value={pendingVerifications.toString()}
            icon={<ClockIcon className="w-6 h-6 text-yellow-400" />}
          />
          <NeumorphicStatsCard
            title="Overdue Tasks"
            value={overdueTasks.toString()}
            icon={<AlertCircleIcon className="w-6 h-6 text-red-400" />}
          />
          <NeumorphicStatsCard
            title="New Community Members"
            value={newCommunityMembers.toString()}
            icon={<CheckCircleIcon className="w-6 h-6 text-blue-400" />}
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          
          {/* Left Side - Map (2 columns wide) */}
          <div className="lg:col-span-2">
            <LazyLoad fallback={<NeumorphicCard className="animate-pulse h-96" />}>
              <NeumorphicCard>
                <div className="mb-4">
                  <NeumorphicText size="lg" className="font-semibold mb-2">Live Field Operations Map</NeumorphicText>
                  <NeumorphicText variant="secondary" size="sm">
                    Real-time tracking of field agents and verification locations with geofence monitoring.
                  </NeumorphicText>
                </div>
                <InteractiveMap 
                  height="500px"
                  showControls={true}
                  showGeofences={true}
                  onMarkerClick={(marker) => {
                    console.log('Marker clicked:', marker);
                  }}
                />
              </NeumorphicCard>
            </LazyLoad>
          </div>

          {/* Right Side - Charts and Tables (1 column wide) */}
          <div className="space-y-2">
            
            {/* Task Status Breakdown Chart */}
            <NeumorphicCard>
              <div className="mb-4">
                <NeumorphicText size="lg" className="font-semibold mb-2">Task Status Breakdown</NeumorphicText>
                <NeumorphicText variant="secondary" size="sm">
                  Distribution of verification task statuses across all active operations.
                </NeumorphicText>
              </div>
              <TaskStatusChart />
            </NeumorphicCard>

            {/* Recent Submissions Table */}
            <NeumorphicCard>
              <div className="mb-4">
                <NeumorphicText size="lg" className="font-semibold mb-2">Recent Submissions</NeumorphicText>
                <NeumorphicText variant="secondary" size="sm">
                  Latest completed verification tasks from field agents.
                </NeumorphicText>
              </div>
              
              {recentSubmissions.length > 0 ? (
                <div className="overflow-x-auto">
                  <NeumorphicTable>
                    <NeumorphicTableHeader>
                      <NeumorphicTableRow>
                        <NeumorphicTableHead>Supplier</NeumorphicTableHead>
                        <NeumorphicTableHead>Agent</NeumorphicTableHead>
                        <NeumorphicTableHead>Status</NeumorphicTableHead>
                        <NeumorphicTableHead>Action</NeumorphicTableHead>
                      </NeumorphicTableRow>
                    </NeumorphicTableHeader>
                    <NeumorphicTableBody>
                      {recentSubmissions.map((task) => (
                        <NeumorphicTableRow key={task.id}>
                          <NeumorphicTableCell>
                            <div>
                              <NeumorphicText className="font-medium">{task.supplierName}</NeumorphicText>
                              <NeumorphicText variant="secondary" size="sm" className="flex items-center gap-1">
                                <MapPinIcon className="w-3 h-3" />
                                {task.address.split(',')[0]}
                              </NeumorphicText>
                            </div>
                          </NeumorphicTableCell>
                          <NeumorphicTableCell>
                            <NeumorphicText size="sm">{task.agent?.name || 'Unassigned'}</NeumorphicText>
                          </NeumorphicTableCell>
                          <NeumorphicTableCell>
                            <NeumorphicBadge 
                              variant={task.status === 'Submitted' ? 'success' : 'info'}
                            >
                              {task.status}
                            </NeumorphicBadge>
                          </NeumorphicTableCell>
                          <NeumorphicTableCell>
                            <NeumorphicButton className="text-xs px-2 py-1">
                              View Task
                            </NeumorphicButton>
                          </NeumorphicTableCell>
                        </NeumorphicTableRow>
                      ))}
                    </NeumorphicTableBody>
                  </NeumorphicTable>
                </div>
              ) : (
                <div className="text-center py-8">
                  <NeumorphicText variant="secondary">No recent submissions found</NeumorphicText>
                </div>
              )}
            </NeumorphicCard>
          </div>
        </div>
      </div>
    </NeumorphicBackground>
  );
} 