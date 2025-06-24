import React from 'react';
import { getVettingSetupData } from '@/lib/sample-data/vettingChecksSample';
import { getMiningProjectsData } from '@/lib/sample-data/projectsSample';
import { InitiateVettingForm } from '@/components/vetting/InitiateVettingForm';
import { NeumorphicHeading, NeumorphicText } from '@/components/ui/neumorphic';

// Server component that fetches data and passes to client component
export default async function InitiateNewVettingPage() {
  try {
    // Fetch vetting setup data and projects in parallel
    const [vettingData, projectsData] = await Promise.all([
      getVettingSetupData(),
      getMiningProjectsData()
    ]);

    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <NeumorphicHeading className="text-3xl">Initiate New Vetting</NeumorphicHeading>
          <NeumorphicText variant="primary" className="opacity-80">
            Begin a new vetting process for individuals, companies, or staff medical clearance. 
            Select entity type, provide details, and choose verification checks.
          </NeumorphicText>
        </div>

        {/* Main Form Component */}
        <InitiateVettingForm 
          checks={vettingData.checks}
          packages={vettingData.packages}
          projects={projectsData.projects}
          categories={vettingData.categories}
          entityTypes={vettingData.entityTypes}
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading vetting setup data:', error);
    
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <NeumorphicHeading className="text-3xl">Initiate New Vetting</NeumorphicHeading>
          <NeumorphicText className="text-red-500">
            Failed to load vetting configuration. Please try again later.
          </NeumorphicText>
        </div>
      </div>
    );
  }
}