"use client";

import React, { useState } from 'react';
import { 
  NeumorphicBackground,
  NeumorphicCard,
  NeumorphicText,
  NeumorphicHeading,
  NeumorphicStatsCard,
  NeumorphicBadge,
  NeumorphicTabs,
  NeumorphicButton
} from '@/components/ui/neumorphic';
import SelectionComponentsDemo from '@/components/forms/examples/SelectionComponentsDemo';
import { SAIdInput } from '@/components/forms/identity/SAIdInput';
import { PhoneInput } from '@/components/forms/identity/PhoneInput';
import { AddressInput } from '@/components/forms/identity/AddressInput';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getCommunityMembers, getCanvassingDrives } from '@/lib/sample-data/fieldOperationsSample';
import { ActivityIcon, CheckCircleIcon, ClockIcon, UserPlusIcon, FileText, MapIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function CommunityCanvassing() {
  const communityMembers = getCommunityMembers();
  const canvassingDrives = getCanvassingDrives();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter community members based on search
  const filteredMembers = communityMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.idNumber.includes(searchTerm) ||
    member.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const totalMembers = communityMembers.length;
  const verifiedMembers = communityMembers.filter(m => m.vettingStatus === 'Verified').length;
  const pendingMembers = communityMembers.filter(m => m.vettingStatus === 'Pending').length;
  const flaggedMembers = communityMembers.filter(m => m.vettingStatus === 'Flagged').length;

  const handleSubmitNewMember = () => {
    toast("Record submitted for admin approval", {
      description: "The new community member application has been submitted for review.",
      duration: 3000,
    });
  };

  return (
    <NeumorphicBackground className="min-h-screen">
      <div className="w-full space-y-2">
        {/* Header Section */}
        <NeumorphicCard>
          <div>
            <NeumorphicHeading>Community Canvassing</NeumorphicHeading>
            <NeumorphicText variant="secondary" className="leading-tight">
              Manage the entire lifecycle of the community skills database program and outreach initiatives.
            </NeumorphicText>
          </div>
        </NeumorphicCard>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <NeumorphicStatsCard
            title="Total Members"
            value={totalMembers.toString()}
            icon={<ActivityIcon className="w-6 h-6 text-blue-400" />}
          />
          <NeumorphicStatsCard
            title="Verified"
            value={verifiedMembers.toString()}
            icon={<CheckCircleIcon className="w-6 h-6 text-green-400" />}
          />
          <NeumorphicStatsCard
            title="Pending"
            value={pendingMembers.toString()}
            icon={<ClockIcon className="w-6 h-6 text-yellow-400" />}
          />
          <NeumorphicStatsCard
            title="Flagged"
            value={flaggedMembers.toString()}
            icon={<UserPlusIcon className="w-6 h-6 text-red-400" />}
          />
        </div>

        {/* Main Content with Tabs */}
        <NeumorphicCard>
          <NeumorphicTabs defaultValue="database">
            <NeumorphicTabs.List>
              <NeumorphicTabs.Trigger value="database">Community Members Database</NeumorphicTabs.Trigger>
              <NeumorphicTabs.Trigger value="onboard">Onboard New Member</NeumorphicTabs.Trigger>
              <NeumorphicTabs.Trigger value="drives">Manage Canvassing Drives</NeumorphicTabs.Trigger>
            </NeumorphicTabs.List>
            
            {/* Tab 1: Community Members Database */}
            <NeumorphicTabs.Content value="database">
              <NeumorphicCard className="p-6">
                <NeumorphicText size="lg" className="font-semibold mb-4">Community Members Database</NeumorphicText>
                
                {/* Search Input */}
                <div className="mb-4">
                  <Input
                    placeholder="Search by name, ID number, or address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md"
                  />
                </div>

                {/* Members Table */}
                <div className="space-y-4">
                  {filteredMembers.map((member) => (
                    <NeumorphicCard key={member.id} className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[var(--neumorphic-button)] bg-opacity-30 rounded-full flex items-center justify-center">
                            <NeumorphicText className="font-semibold">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </NeumorphicText>
                          </div>
                          <div>
                            <NeumorphicText className="font-semibold">{member.name}</NeumorphicText>
                            <NeumorphicText variant="secondary" size="sm">ID: {member.idNumber}</NeumorphicText>
                            <NeumorphicText variant="secondary" size="sm">{member.address}</NeumorphicText>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                          <div className="flex flex-wrap gap-1">
                            {member.skills.map((skill, index) => (
                              <NeumorphicBadge key={index} variant="info" className="text-xs">
                                {skill}
                              </NeumorphicBadge>
                            ))}
                          </div>
                          <NeumorphicBadge 
                            variant={
                              member.vettingStatus === 'Verified' ? 'success' :
                              member.vettingStatus === 'Pending' ? 'warning' :
                              member.vettingStatus === 'Flagged' ? 'danger' : 'default'
                            }
                          >
                            {member.vettingStatus}
                          </NeumorphicBadge>
                          <div className="flex gap-2">
                            <Button variant="neumorphic-outline" size="sm">View Profile</Button>
                            <Button variant="neumorphic-outline" size="sm">Initiate Vetting</Button>
                          </div>
                        </div>
                      </div>
                    </NeumorphicCard>
                  ))}
                </div>
              </NeumorphicCard>
            </NeumorphicTabs.Content>
            
            {/* Tab 2: Onboard New Community Member */}
            <NeumorphicTabs.Content value="onboard">
              <NeumorphicCard className="p-6">
                <NeumorphicHeading className="mb-4">Onboard New Community Member</NeumorphicHeading>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <NeumorphicText size="sm" className="mb-2 font-medium">South African ID Number</NeumorphicText>
                      <SAIdInput showDetails={true} />
                    </div>
                    <div>
                      <NeumorphicText size="sm" className="mb-2 font-medium">Full Name</NeumorphicText>
                      <Input placeholder="Enter full name" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <NeumorphicText size="sm" className="mb-2 font-medium">Contact Number</NeumorphicText>
                      <PhoneInput showType={true} />
                    </div>
                    <div>
                      <NeumorphicText size="sm" className="mb-2 font-medium">Physical Address</NeumorphicText>
                      <AddressInput />
                    </div>
                  </div>

                  <div>
                    <NeumorphicText size="sm" className="mb-2 font-medium">Skills & Qualifications</NeumorphicText>
                    <SelectionComponentsDemo />
                  </div>

                  <div>
                    <NeumorphicText size="sm" className="mb-2 font-medium">Document Upload</NeumorphicText>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                             <div>
                         <NeumorphicText size="sm" variant="secondary" className="mb-2">ID Document Copy</NeumorphicText>
                         <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                       </div>
                       <div>
                         <NeumorphicText size="sm" variant="secondary" className="mb-2">Qualification Certificates</NeumorphicText>
                         <Input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple />
                       </div>
                    </div>
                  </div>

                  <NeumorphicButton 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={handleSubmitNewMember}
                  >
                    Submit for Review
                  </NeumorphicButton>
                </div>
              </NeumorphicCard>
            </NeumorphicTabs.Content>
            
            {/* Tab 3: Manage Canvassing Drives */}
            <NeumorphicTabs.Content value="drives">
              <NeumorphicCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <NeumorphicText size="lg" className="font-semibold">Manage Canvassing Drives</NeumorphicText>
                  <NeumorphicButton className="bg-blue-600 hover:bg-blue-700 text-white">
                    Create New Drive
                  </NeumorphicButton>
                </div>
                
                <div className="space-y-4">
                  {canvassingDrives.map((drive) => (
                    <NeumorphicCard key={drive.id} className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <MapIcon className="w-5 h-5 text-[var(--neumorphic-text-secondary)]" />
                            <NeumorphicText className="font-semibold">{drive.name}</NeumorphicText>
                                                         <NeumorphicBadge 
                               variant={
                                 drive.status === 'Active' ? 'success' :
                                 drive.status === 'Planned' ? 'info' : 'default'
                               }
                             >
                              {drive.status}
                            </NeumorphicBadge>
                          </div>
                          <NeumorphicText variant="secondary" size="sm" className="mb-2">
                            Target Area: {drive.targetArea}
                          </NeumorphicText>
                          
                          {/* Progress Bar */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <NeumorphicText size="sm">Progress</NeumorphicText>
                              <NeumorphicText size="sm">
                                {drive.currentSignups} / {drive.signupGoal}
                              </NeumorphicText>
                            </div>
                            <div className="w-full bg-[var(--neumorphic-button)] bg-opacity-30 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${Math.min((drive.currentSignups / drive.signupGoal) * 100, 100)}%` 
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="neumorphic-outline" size="sm">
                            <FileText className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                          <Button variant="neumorphic-outline" size="sm">Edit</Button>
                        </div>
                      </div>
                    </NeumorphicCard>
                  ))}
                </div>
              </NeumorphicCard>
            </NeumorphicTabs.Content>
          </NeumorphicTabs>
        </NeumorphicCard>
      </div>
    </NeumorphicBackground>
  );
} 