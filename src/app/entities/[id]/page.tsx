'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Download, Building, User, MapPin, Shield, TrendingUp, Calendar, AlertTriangle, CheckCircle, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import { NeumorphicCard } from '@/components/ui/neumorphic-card';
import { NeumorphicTabs } from '@/components/ui/neumorphic/NeumorphicTabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart } from '@/components/charts/apex/components/LineChart';
import { BarChart } from '@/components/charts/apex/components/BarChart';
import { DonutChart } from '@/components/charts/apex/components/DonutChart';
import { 
  opsCases, 
  getEntityDetails, 
  type EntityDetails,
  VettingEntityType
} from '@/lib/sample-data/operations-dashboard-data';

const complianceStatusColors = {
  'Up to Date': 'bg-green-500 text-white',
  'Compliant': 'bg-green-500 text-white',
  'Registered': 'bg-green-500 text-white',
  'Overdue': 'bg-red-500 text-white',
  'Non-Compliant': 'bg-red-500 text-white',
  'Deregistered': 'bg-red-500 text-white',
  'Under Review': 'bg-yellow-500 text-black',
  'Not Required': 'bg-gray-500 text-white',
  'Not Registered': 'bg-gray-500 text-white',
  'Not Applicable': 'bg-gray-500 text-white'
};

export default function Entity360ViewPage() {
  const params = useParams();
  const entityId = params.id as string;
  
  const [entityData, setEntityData] = useState<EntityDetails | null>(null);
  const [relatedCases, setRelatedCases] = useState<typeof opsCases>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadEntityData = async () => {
      try {
        // Get entity details
        const entity = getEntityDetails(entityId);
        if (!entity) {
          throw new Error('Entity not found');
        }

        // Find related cases
        const cases = opsCases.filter(c => c.entityIdentifier === entityId);

        setEntityData(entity);
        setRelatedCases(cases);
      } catch (error) {
        console.error('Error loading entity data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEntityData();
  }, [entityId]);

  const handleExport = () => {
    const exportData = {
      entity: entityData,
      relatedCases: relatedCases
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `entity-${entityId}-360-view.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Sample data for charts
  const historicalVettingData = [
    { x: '2024-01', y: 2 },
    { x: '2024-02', y: 1 },
    { x: '2024-03', y: 3 },
    { x: '2024-04', y: 0 },
    { x: '2024-05', y: 2 },
    { x: '2024-06', y: 1 },
    { x: '2024-07', y: 4 },
    { x: '2024-08', y: 2 },
    { x: '2024-09', y: 1 },
    { x: '2024-10', y: 3 },
    { x: '2024-11', y: 2 },
    { x: '2024-12', y: 1 }
  ];

  const riskDistributionData = [
    { x: 'Low Risk', y: 65 },
    { x: 'Medium Risk', y: 25 },
    { x: 'High Risk', y: 8 },
    { x: 'Critical Risk', y: 2 }
  ];

  const complianceMetricsData = [
    { x: 'CIPC Compliance', y: 95 },
    { x: 'Tax Compliance', y: 88 },
    { x: 'VAT Compliance', y: 92 },
    { x: 'UIF Compliance', y: 85 }
  ];

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-neumorphic-bg">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!entityData) {
    return (
      <div className="min-h-screen p-6 bg-neumorphic-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-neumorphic-text mb-4">Entity Not Found</h1>
            <p className="text-neumorphic-text/70 mb-6">The requested entity could not be found.</p>
            <Link href="/dashboard/operations">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Operations
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isCompany = entityData.type === VettingEntityType.COMPANY;

  return (
    <div className="min-h-screen p-6 bg-neumorphic-bg">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/operations">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Operations
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-neumorphic-text">
                {entityData.name}
              </h1>
              <p className="text-neumorphic-text/70">
                {isCompany ? 'Company Profile' : 'Individual Profile'} • Entity 360° View
              </p>
            </div>
          </div>
          <Button onClick={handleExport} size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Profile
          </Button>
        </div>

        {/* Entity Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <NeumorphicCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neumorphic-text/70">Entity Type</p>
                <p className="text-lg font-semibold text-neumorphic-text mt-1">
                  {isCompany ? 'Company' : 'Individual'}
                </p>
              </div>
              <div className="p-2 bg-neumorphic-primary/10 rounded-full">
                {isCompany ? 
                  <Building className="w-5 h-5 text-neumorphic-primary" /> :
                  <User className="w-5 h-5 text-neumorphic-primary" />
                }
              </div>
            </div>
          </NeumorphicCard>

          <NeumorphicCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neumorphic-text/70">Related Cases</p>
                <p className="text-lg font-semibold text-neumorphic-text mt-1">
                  {relatedCases.length}
                </p>
              </div>
              <div className="p-2 bg-neumorphic-accent/10 rounded-full">
                <Shield className="w-5 h-5 text-neumorphic-accent" />
              </div>
            </div>
          </NeumorphicCard>

          <NeumorphicCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neumorphic-text/70">Risk Level</p>
                <p className="text-lg font-semibold text-neumorphic-severity-low mt-1">
                  Low
                </p>
              </div>
              <div className="p-2 bg-neumorphic-severity-low/10 rounded-full">
                <TrendingUp className="w-5 h-5 text-neumorphic-severity-low" />
              </div>
            </div>
          </NeumorphicCard>

          <NeumorphicCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neumorphic-text/70">Last Updated</p>
                <p className="text-lg font-semibold text-neumorphic-text mt-1">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="p-2 bg-neumorphic-severity-medium/10 rounded-full">
                <Calendar className="w-5 h-5 text-neumorphic-severity-medium" />
              </div>
            </div>
          </NeumorphicCard>
        </div>

        {/* Main Content Tabs */}
        <NeumorphicCard className="p-6">
          <NeumorphicTabs value={activeTab} onValueChange={setActiveTab}>
            <NeumorphicTabs.List className="mb-6">
              <NeumorphicTabs.Trigger value="overview">Overview</NeumorphicTabs.Trigger>
              <NeumorphicTabs.Trigger value="compliance">Compliance</NeumorphicTabs.Trigger>
              <NeumorphicTabs.Trigger value="history">History</NeumorphicTabs.Trigger>
              <NeumorphicTabs.Trigger value="risk">Risk Analysis</NeumorphicTabs.Trigger>
              <NeumorphicTabs.Trigger value="analytics">Analytics</NeumorphicTabs.Trigger>
            </NeumorphicTabs.List>

            {/* Overview Tab */}
            <NeumorphicTabs.Content value="overview">
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Entity Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-neumorphic-text">
                      {isCompany ? 'Company Information' : 'Personal Information'}
                    </h3>
                    <div className="space-y-3">
                      {isCompany ? (
                        <>
                          <div className="flex justify-between">
                            <span className="text-neumorphic-text/70">Company Name:</span>
                            <span className="font-medium text-neumorphic-text">{entityData.entityDetails.companyName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neumorphic-text/70">Registration Number:</span>
                            <span className="font-medium text-neumorphic-text">{entityData.entityDetails.registrationNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neumorphic-text/70">Company Type:</span>
                            <span className="font-medium text-neumorphic-text">{entityData.entityDetails.companyType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neumorphic-text/70">Incorporation Date:</span>
                            <span className="font-medium text-neumorphic-text">
                              {entityData.entityDetails.incorporationDate && typeof entityData.entityDetails.incorporationDate === 'string' ? 
                                new Date(entityData.entityDetails.incorporationDate).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neumorphic-text/70">Province:</span>
                            <span className="font-medium text-neumorphic-text">{entityData.entityDetails.province}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neumorphic-text/70">VAT Number:</span>
                            <span className="font-medium text-neumorphic-text">{entityData.entityDetails.vatNumber || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neumorphic-text/70">BEE Level:</span>
                            <span className="font-medium text-neumorphic-text">{entityData.entityDetails.beeLevel || 'N/A'}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <span className="text-neumorphic-text/70">Full Name:</span>
                            <span className="font-medium text-neumorphic-text">{entityData.entityDetails?.fullName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neumorphic-text/70">ID Number:</span>
                            <span className="font-medium text-neumorphic-text">{entityData.entityDetails?.idNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neumorphic-text/70">Date of Birth:</span>
                            <span className="font-medium text-neumorphic-text">
                              {entityData.entityDetails?.dateOfBirth && typeof entityData.entityDetails.dateOfBirth === 'string' ? 
                                new Date(entityData.entityDetails.dateOfBirth).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neumorphic-text/70">Nationality:</span>
                            <span className="font-medium text-neumorphic-text">{entityData.entityDetails?.nationality}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neumorphic-text/70">Province:</span>
                            <span className="font-medium text-neumorphic-text">{entityData.entityDetails?.province}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-neumorphic-text">Contact Information</h3>
                    <div className="space-y-3">
                      {isCompany ? (
                        <>
                          <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-neumorphic-text/70" />
                            <div>
                              <p className="text-sm text-neumorphic-text/70">Registered Address</p>
                              <p className="text-neumorphic-text">{entityData.entityDetails.registeredAddress}</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-neumorphic-text/70" />
                            <div>
                              <p className="text-sm text-neumorphic-text/70">Email Address</p>
                              <p className="text-neumorphic-text">{entityData.entityDetails?.emailAddress}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-neumorphic-text/70" />
                            <div>
                              <p className="text-sm text-neumorphic-text/70">Mobile Number</p>
                              <p className="text-neumorphic-text">{entityData.entityDetails?.mobileNumber}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-neumorphic-text/70" />
                            <div>
                              <p className="text-sm text-neumorphic-text/70">Physical Address</p>
                              <p className="text-neumorphic-text">{entityData.entityDetails?.physicalAddress}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Directors (for companies) - Temporarily disabled due to type issues */}
                {/* {isCompany && false && entityData && entityData.entityDetails?.directors && Array.isArray(entityData.entityDetails.directors) && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-neumorphic-text">Directors</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {entityData.entityDetails.directors.map((director: any, index: number) => (
                        <NeumorphicCard key={index} className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-neumorphic-text">{director.name}</h4>
                              <Badge className={`
                                ${director.status === 'Active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}
                              `}>
                                {director.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-neumorphic-text/70">
                              <p>ID: {director.idNumber}</p>
                              <p>Appointed: {new Date(director.appointmentDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </NeumorphicCard>
                      ))}
                    </div>
                  </div>
                )} */}
              </div>
            </NeumorphicTabs.Content>

            {/* Compliance Tab */}
            <NeumorphicTabs.Content value="compliance">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-neumorphic-text">Compliance Status</h3>
                
                {/* Compliance Status - Temporarily disabled due to type issues */}
                <div className="text-center py-8 text-neumorphic-text/70">
                  Compliance data not available for this entity
                </div>

                {/* Compliance Metrics Chart */}
                <NeumorphicCard className="p-6">
                  <h4 className="text-lg font-semibold text-neumorphic-text mb-4">Compliance Metrics</h4>
                  <BarChart
                    data={complianceMetricsData}
                    title="Compliance Score by Category"
                    height={350}
                  />
                </NeumorphicCard>
              </div>
            </NeumorphicTabs.Content>

            {/* History Tab */}
            <NeumorphicTabs.Content value="history">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-neumorphic-text">Vetting History</h3>
                
                {/* Historical Vetting Chart */}
                <NeumorphicCard className="p-6">
                  <h4 className="text-lg font-semibold text-neumorphic-text mb-4">Vetting Cases Over Time</h4>
                  <LineChart
                    data={historicalVettingData}
                    title="Monthly Vetting Cases"
                    height={350}
                  />
                </NeumorphicCard>

                {/* Related Cases */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-neumorphic-text">Related Cases</h4>
                  {relatedCases.length > 0 ? (
                    <div className="space-y-3">
                      {relatedCases.map((case_) => (
                        <NeumorphicCard key={case_.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-neumorphic-text">{case_.caseNumber}</h5>
                              <div className="flex items-center gap-4 mt-1 text-sm text-neumorphic-text/70">
                                <span>Status: {case_.status}</span>
                                <span>Priority: {case_.priority}</span>
                                <span>Progress: {case_.overallProgress}%</span>
                              </div>
                            </div>
                            <Link href={`/cases/${case_.id}`}>
                              <Button variant="ghost" size="sm">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </NeumorphicCard>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-neumorphic-text/70">
                      No related cases found
                    </div>
                  )}
                </div>
              </div>
            </NeumorphicTabs.Content>

            {/* Risk Analysis Tab */}
            <NeumorphicTabs.Content value="risk">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-neumorphic-text">Risk Analysis</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Risk Distribution */}
                  <NeumorphicCard className="p-6">
                    <h4 className="text-lg font-semibold text-neumorphic-text mb-4">Risk Distribution</h4>
                    <DonutChart
                      data={riskDistributionData}
                      title="Risk Level Distribution"
                      height={350}
                    />
                  </NeumorphicCard>

                  {/* Risk Factors */}
                  <NeumorphicCard className="p-6">
                    <h4 className="text-lg font-semibold text-neumorphic-text mb-4">Risk Factors</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-neumorphic-severity-low/10 rounded-md">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-neumorphic-severity-low" />
                          <span className="text-neumorphic-text">Financial Standing</span>
                        </div>
                        <Badge className="bg-green-500 text-white">Low</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-neumorphic-severity-low/10 rounded-md">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-neumorphic-severity-low" />
                          <span className="text-neumorphic-text">Compliance History</span>
                        </div>
                        <Badge className="bg-green-500 text-white">Low</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-neumorphic-severity-medium/10 rounded-md">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="w-5 h-5 text-neumorphic-severity-medium" />
                          <span className="text-neumorphic-text">Market Exposure</span>
                        </div>
                        <Badge className="bg-yellow-500 text-black">Medium</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-neumorphic-severity-low/10 rounded-md">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-neumorphic-severity-low" />
                          <span className="text-neumorphic-text">Regulatory Compliance</span>
                        </div>
                        <Badge className="bg-green-500 text-white">Low</Badge>
                      </div>
                    </div>
                  </NeumorphicCard>
                </div>
              </div>
            </NeumorphicTabs.Content>

            {/* Analytics Tab */}
            <NeumorphicTabs.Content value="analytics">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-neumorphic-text">Analytics & Insights</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Performance Metrics */}
                  <NeumorphicCard className="p-6">
                    <h4 className="text-lg font-semibold text-neumorphic-text mb-4">Performance Metrics</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-neumorphic-text/70">Average Case Duration</span>
                        <span className="font-medium text-neumorphic-text">7.2 days</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neumorphic-text/70">Success Rate</span>
                        <span className="font-medium text-neumorphic-text">94%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neumorphic-text/70">Average Cost</span>
                        <span className="font-medium text-neumorphic-text">R1,450</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neumorphic-text/70">Compliance Score</span>
                        <span className="font-medium text-neumorphic-text">8.7/10</span>
                      </div>
                    </div>
                  </NeumorphicCard>

                  {/* Trends */}
                  <NeumorphicCard className="p-6">
                    <h4 className="text-lg font-semibold text-neumorphic-text mb-4">Key Insights</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-neumorphic-severity-low/10 rounded-md">
                        <TrendingUp className="w-5 h-5 text-neumorphic-severity-low" />
                        <span className="text-sm text-neumorphic-text">Consistent compliance history</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-neumorphic-severity-low/10 rounded-md">
                        <CheckCircle className="w-5 h-5 text-neumorphic-severity-low" />
                        <span className="text-sm text-neumorphic-text">No adverse findings in last 12 months</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-neumorphic-severity-medium/10 rounded-md">
                        <Calendar className="w-5 h-5 text-neumorphic-severity-medium" />
                        <span className="text-sm text-neumorphic-text">Next compliance review due in 30 days</span>
                      </div>
                    </div>
                  </NeumorphicCard>
                </div>
              </div>
            </NeumorphicTabs.Content>
          </NeumorphicTabs>
        </NeumorphicCard>
      </div>
    </div>
  );
}