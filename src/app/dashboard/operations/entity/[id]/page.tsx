'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  NeumorphicBackground,
  NeumorphicCard,
  NeumorphicText,
  NeumorphicHeading,
  NeumorphicStatsCard
} from '@/components/ui/neumorphic';
import { 
  ArrowLeft,
  Eye,
  User,
  Building,
  MapPin,
  Phone,
  Shield,
  AlertTriangle,
  CheckCircle,
  Target,
  TrendingUp,
  History,
  FileText,
  Download,
  Share,
  ExternalLink,
  Zap,
  Flag,
  Users,
  ChevronRight,
  DollarSign
} from 'lucide-react';
import { operationsVettingCases } from '@/lib/sample-data/operations-dashboard-data';
import { ActiveVettingCase, VettingStatus, IndividualDetails, CompanyDetails, VettingEntityType } from '@/types/vetting';
import { toast } from 'sonner';

// Entity 360 interfaces
interface EntityCaseHistory {
  totalCases: number;
  completedCases: number;
  ongoingCases: number;
  failedCases: number;
  totalValue: number;
  avgProcessingTime: number;
  latestCaseDate: string;
  overallRiskScore: number;
  flaggedCases: number;
}

interface EntityRelationship {
  id: string;
  type: 'director' | 'shareholder' | 'employee' | 'associate' | 'related_entity';
  relationshipTo: string;
  relationship: string;
  since: string;
  status: 'active' | 'inactive' | 'pending';
  percentage?: number;
}

interface EntityRiskProfile {
  overallRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  riskFactors: string[];
  riskScore: number;
  lastAssessment: string;
  adverseFindings: number;
  complianceIssues: number;
  reputationalRisks: number;
}

export default function Entity360Page() {
  const params = useParams();
  const router = useRouter();
  const entityId = params.id as string;
  
  const [entity, setEntity] = useState<ActiveVettingCase | null>(null);
  const [allCases, setAllCases] = useState<ActiveVettingCase[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'relationships' | 'risk' | 'documents'>('overview');
  const [loading, setLoading] = useState(true);

  // Calculate entity statistics
  const calculateEntityStats = (cases: ActiveVettingCase[]): EntityCaseHistory => {
    const totalCases = cases.length;
    const completedCases = cases.filter(c => c.status === VettingStatus.COMPLETE).length;
    const ongoingCases = cases.filter(c => [VettingStatus.IN_PROGRESS, VettingStatus.PARTIALLY_COMPLETE].includes(c.status)).length;
    const failedCases = cases.filter(c => c.status === VettingStatus.FAILED).length;
    const totalValue = cases.reduce((sum, c) => sum + c.totalEstimatedCost, 0);
    const avgProcessingTime = cases.reduce((sum, c) => sum + c.daysSinceInitiated, 0) / totalCases;
    const latestCaseDate = cases.sort((a, b) => new Date(b.initiatedDate).getTime() - new Date(a.initiatedDate).getTime())[0]?.initiatedDate || '';
    const flaggedCases = cases.filter(c => c.flaggedForReview).length;
    
    // Calculate overall risk score
    const completedChecks = cases.flatMap(c => c.individualChecks.filter(check => check.status === 'Complete'));
    const overallRiskScore = completedChecks.length > 0 
      ? completedChecks.reduce((sum, check) => sum + (check.riskScore || 0), 0) / completedChecks.length
      : 0;

    return {
      totalCases,
      completedCases,
      ongoingCases,
      failedCases,
      totalValue,
      avgProcessingTime,
      latestCaseDate,
      overallRiskScore,
      flaggedCases
    };
  };

  // Generate mock relationships
  const generateRelationships = (entity: ActiveVettingCase): EntityRelationship[] => {
    if (entity.entityType === VettingEntityType.COMPANY) {
      return [
        {
          id: '1',
          type: 'director',
          relationshipTo: 'John Smith',
          relationship: 'Executive Director',
          since: '2020-01-15',
          status: 'active'
        },
        {
          id: '2',
          type: 'shareholder',
          relationshipTo: 'Investment Holdings Ltd',
          relationship: 'Major Shareholder',
          since: '2019-06-01',
          status: 'active',
          percentage: 35
        },
        {
          id: '3',
          type: 'associate',
          relationshipTo: 'Tech Solutions Corp',
          relationship: 'Business Partner',
          since: '2021-03-10',
          status: 'active'
        }
      ];
    } else {
      return [
        {
          id: '1',
          type: 'employee',
          relationshipTo: 'ABC Company Ltd',
          relationship: 'Senior Manager',
          since: '2018-09-01',
          status: 'active'
        },
        {
          id: '2',
          type: 'director',
          relationshipTo: 'XYZ Holdings',
          relationship: 'Non-Executive Director',
          since: '2020-12-01',
          status: 'active'
        }
      ];
    }
  };

  // Generate risk profile
  const generateRiskProfile = (entity: ActiveVettingCase, stats: EntityCaseHistory): EntityRiskProfile => {
    const riskFactors = [];
    if (stats.flaggedCases > 0) riskFactors.push('Previous flags for review');
    if (stats.failedCases > 0) riskFactors.push('History of failed cases');
    if (stats.overallRiskScore > 50) riskFactors.push('High risk score indicators');
    if (entity.isOverdue) riskFactors.push('Current overdue case');
    
    const overallRisk = stats.overallRiskScore > 70 ? 'High' : 
                       stats.overallRiskScore > 40 ? 'Medium' : 'Low';

    return {
      overallRisk: overallRisk as 'Low' | 'Medium' | 'High' | 'Critical',
      riskFactors,
      riskScore: stats.overallRiskScore,
      lastAssessment: entity.initiatedDate,
      adverseFindings: Math.floor(stats.overallRiskScore / 20),
      complianceIssues: stats.flaggedCases,
      reputationalRisks: stats.failedCases
    };
  };

  useEffect(() => {
    const loadEntity = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Find primary entity (current case)
        const primaryEntity = operationsVettingCases.find(c => c.id === entityId);
        if (!primaryEntity) {
          toast.error('Entity not found');
          router.push('/dashboard/operations');
          return;
        }

        // Find all cases for this entity (mock: same entity name)
        const entityCases = operationsVettingCases.filter(c => 
          c.entityName === primaryEntity.entityName && 
          c.entityType === primaryEntity.entityType
        );

        setEntity(primaryEntity);
        setAllCases(entityCases);
        
        toast.success('Entity 360 view loaded');
      } catch {
        toast.error('Failed to load entity details');
        router.push('/dashboard/operations');
      } finally {
        setLoading(false);
      }
    };

    if (entityId) {
      loadEntity();
    }
  }, [entityId, router]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusVariant = (status: VettingStatus) => {
    switch (status) {
      case VettingStatus.COMPLETE:
        return 'default';
      case VettingStatus.IN_PROGRESS:
        return 'secondary';
      case VettingStatus.FAILED:
      case VettingStatus.CANCELLED:
        return 'destructive';
      case VettingStatus.CONSENT_PENDING:
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getRiskVariant = (risk: string) => {
    switch (risk) {
      case 'High':
      case 'Critical':
        return 'destructive';
      case 'Medium':
        return 'secondary';
      case 'Low':
        return 'default';
      default:
        return 'outline';
    }
  };

  const renderEntityDetails = () => {
    if (!entity) return null;

    if (entity.entityType === VettingEntityType.INDIVIDUAL) {
      const details = entity.entityDetails as IndividualDetails;
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NeumorphicCard className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-blue-400" />
              <NeumorphicText className="font-semibold">Personal Information</NeumorphicText>
            </div>
            <div className="space-y-3">
              <div>
                <NeumorphicText size="sm" variant="secondary">Full Name</NeumorphicText>
                <NeumorphicText className="font-medium">{details.firstName} {details.lastName}</NeumorphicText>
              </div>
              <div>
                <NeumorphicText size="sm" variant="secondary">ID Number</NeumorphicText>
                <NeumorphicText className="font-medium font-mono">{details.idNumber || 'Not provided'}</NeumorphicText>
              </div>
              <div>
                <NeumorphicText size="sm" variant="secondary">Nationality</NeumorphicText>
                <NeumorphicText className="font-medium">{details.nationality}</NeumorphicText>
              </div>
              <div>
                <NeumorphicText size="sm" variant="secondary">Date of Birth</NeumorphicText>
                <NeumorphicText className="font-medium">{details.dateOfBirth ? formatDate(details.dateOfBirth) : 'Not provided'}</NeumorphicText>
              </div>
            </div>
          </NeumorphicCard>

          <NeumorphicCard className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Phone className="w-5 h-5 text-green-400" />
              <NeumorphicText className="font-semibold">Contact Information</NeumorphicText>
            </div>
            <div className="space-y-3">
              <div>
                <NeumorphicText size="sm" variant="secondary">Mobile Number</NeumorphicText>
                <NeumorphicText className="font-medium font-mono">{details.mobileNumber}</NeumorphicText>
              </div>
              <div>
                <NeumorphicText size="sm" variant="secondary">Email Address</NeumorphicText>
                <NeumorphicText className="font-medium">{details.emailAddress || 'Not provided'}</NeumorphicText>
              </div>
              <div>
                <NeumorphicText size="sm" variant="secondary">Place of Birth</NeumorphicText>
                <NeumorphicText className="font-medium">{details.placeOfBirth || 'Not specified'}</NeumorphicText>
              </div>
            </div>
          </NeumorphicCard>
        </div>
      );
    }

    if (entity.entityType === VettingEntityType.COMPANY) {
      const details = entity.entityDetails as CompanyDetails;
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NeumorphicCard className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Building className="w-5 h-5 text-blue-400" />
              <NeumorphicText className="font-semibold">Company Information</NeumorphicText>
            </div>
            <div className="space-y-3">
              <div>
                <NeumorphicText size="sm" variant="secondary">Company Name</NeumorphicText>
                <NeumorphicText className="font-medium">{details.companyName}</NeumorphicText>
              </div>
              <div>
                <NeumorphicText size="sm" variant="secondary">Registration Number</NeumorphicText>
                <NeumorphicText className="font-medium font-mono">{details.registrationNumber}</NeumorphicText>
              </div>
              <div>
                <NeumorphicText size="sm" variant="secondary">VAT Number</NeumorphicText>
                <NeumorphicText className="font-medium font-mono">{details.vatNumber || 'Not registered'}</NeumorphicText>
              </div>
              <div>
                <NeumorphicText size="sm" variant="secondary">Business Type</NeumorphicText>
                <NeumorphicText className="font-medium">{details.businessType || 'Not specified'}</NeumorphicText>
              </div>
              <div>
                <NeumorphicText size="sm" variant="secondary">Industry</NeumorphicText>
                <NeumorphicText className="font-medium">{details.industry || 'Not specified'}</NeumorphicText>
              </div>
            </div>
          </NeumorphicCard>

          <NeumorphicCard className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-green-400" />
              <NeumorphicText className="font-semibold">Contact & Location</NeumorphicText>
            </div>
            <div className="space-y-3">
              <div>
                <NeumorphicText size="sm" variant="secondary">Primary Contact</NeumorphicText>
                <NeumorphicText className="font-medium">{details.primaryContactName || 'Not provided'}</NeumorphicText>
              </div>
              <div>
                <NeumorphicText size="sm" variant="secondary">Contact Mobile</NeumorphicText>
                <NeumorphicText className="font-medium font-mono">{details.primaryContactMobile || 'Not provided'}</NeumorphicText>
              </div>
              <div>
                <NeumorphicText size="sm" variant="secondary">Contact Email</NeumorphicText>
                <NeumorphicText className="font-medium">{details.primaryContactEmail || 'Not provided'}</NeumorphicText>
              </div>
              <div>
                <NeumorphicText size="sm" variant="secondary">Physical Address</NeumorphicText>
                <NeumorphicText className="font-medium">{details.physicalAddress || 'Not provided'}</NeumorphicText>
              </div>
              <div>
                <NeumorphicText size="sm" variant="secondary">Year Established</NeumorphicText>
                <NeumorphicText className="font-medium">{details.yearEstablished || 'Unknown'}</NeumorphicText>
              </div>
            </div>
          </NeumorphicCard>
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <NeumorphicBackground className="min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        </div>
      </NeumorphicBackground>
    );
  }

  if (!entity) {
    return (
      <NeumorphicBackground className="min-h-screen">
        <div className="text-center py-12">
          <NeumorphicText>Entity not found</NeumorphicText>
        </div>
      </NeumorphicBackground>
    );
  }

  const stats = calculateEntityStats(allCases);
  const relationships = generateRelationships(entity);
  const riskProfile = generateRiskProfile(entity, stats);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'history', label: 'Case History', icon: History },
    { id: 'relationships', label: 'Relationships', icon: Users },
    { id: 'risk', label: 'Risk Profile', icon: Shield },
    { id: 'documents', label: 'Documents', icon: FileText }
  ];

  return (
    <NeumorphicBackground className="min-h-screen">
      <div className="space-y-6">
        {/* Header */}
        <NeumorphicCard>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/dashboard/operations')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Operations
              </Button>
              
              <div>
                <NeumorphicHeading className="flex items-center gap-3">
                  {entity.entityType === VettingEntityType.INDIVIDUAL ? (
                    <User className="w-6 h-6 text-blue-400" />
                  ) : (
                    <Building className="w-6 h-6 text-blue-400" />
                  )}
                  Entity 360° View
                  {stats.flaggedCases > 0 && (
                    <Flag className="w-5 h-5 text-red-400" />
                  )}
                </NeumorphicHeading>
                <NeumorphicText variant="secondary">
                  {entity.entityName} • {entity.entityType}
                </NeumorphicText>
                <NeumorphicText size="sm" variant="secondary">
                  {stats.totalCases} total cases • Last activity: {formatDate(stats.latestCaseDate)}
                </NeumorphicText>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/dashboard/operations/case/${entity.id}`)}
                className="flex items-center gap-1"
              >
                <ExternalLink className="w-4 h-4" />
                View Current Case
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info('Export entity profile')}
                className="flex items-center gap-1"
              >
                <Download className="w-4 h-4" />
                Export Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info('Share entity profile')}
                className="flex items-center gap-1"
              >
                <Share className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </NeumorphicCard>

        {/* Entity Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <NeumorphicStatsCard
            title="Total Cases"
            value={stats.totalCases.toString()}
            icon={<Target className="w-6 h-6 text-blue-400" />}
          />
          
          <NeumorphicStatsCard
            title="Success Rate"
            value={`${Math.round((stats.completedCases / stats.totalCases) * 100)}%`}
            icon={<CheckCircle className="w-6 h-6 text-green-400" />}
          />
          
          <NeumorphicStatsCard
            title="Total Value"
            value={formatCurrency(stats.totalValue)}
            icon={<DollarSign className="w-6 h-6 text-yellow-400" />}
          />
          
          <NeumorphicStatsCard
            title="Risk Score"
            value={`${Math.round(stats.overallRiskScore)}/100`}
            icon={<Shield className="w-6 h-6 text-red-400" />}
          />
        </div>

        {/* Navigation Tabs */}
        <NeumorphicCard>
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`
                    flex items-center gap-2 px-4 py-3 whitespace-nowrap transition-colors
                    ${activeTab === tab.id 
                      ? 'text-blue-400 border-b-2 border-blue-400' 
                      : 'text-[var(--neumorphic-text-secondary)] hover:text-[var(--neumorphic-text-primary)]'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </NeumorphicCard>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <NeumorphicText className="text-lg font-semibold mb-4">Entity Details</NeumorphicText>
                {renderEntityDetails()}
              </div>
              
              <NeumorphicCard className="p-6">
                <NeumorphicText className="text-lg font-semibold mb-4">Quick Summary</NeumorphicText>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <NeumorphicText size="sm" variant="secondary">Average Processing Time</NeumorphicText>
                    <NeumorphicText className="font-medium">{Math.round(stats.avgProcessingTime)} days</NeumorphicText>
                  </div>
                  <div>
                    <NeumorphicText size="sm" variant="secondary">Failed Cases</NeumorphicText>
                    <NeumorphicText className="font-medium">{stats.failedCases}</NeumorphicText>
                  </div>
                  <div>
                    <NeumorphicText size="sm" variant="secondary">Flagged Cases</NeumorphicText>
                    <NeumorphicText className="font-medium">{stats.flaggedCases}</NeumorphicText>
                  </div>
                </div>
              </NeumorphicCard>
            </div>
          )}

          {activeTab === 'history' && (
            <NeumorphicCard className="p-6">
              <NeumorphicText className="text-lg font-semibold mb-4">Case History</NeumorphicText>
              <div className="space-y-4">
                {allCases.map((caseItem) => (
                  <div key={caseItem.id} className="border border-[var(--neumorphic-border)] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <NeumorphicText className="font-medium">{caseItem.caseNumber}</NeumorphicText>
                        <Badge variant={getStatusVariant(caseItem.status)}>
                          {caseItem.status}
                        </Badge>
                        {caseItem.priority === 'Urgent' && (
                          <Badge variant="destructive">
                            <Zap className="w-3 h-3 mr-1" />
                            Urgent
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/dashboard/operations/case/${caseItem.id}`)}
                        className="flex items-center gap-1"
                      >
                        View Details
                        <ChevronRight className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <NeumorphicText size="sm" variant="secondary">Initiated</NeumorphicText>
                        <NeumorphicText>{formatDate(caseItem.initiatedDate)}</NeumorphicText>
                      </div>
                      <div>
                        <NeumorphicText size="sm" variant="secondary">Progress</NeumorphicText>
                        <NeumorphicText>{caseItem.overallProgress}%</NeumorphicText>
                      </div>
                      <div>
                        <NeumorphicText size="sm" variant="secondary">Officer</NeumorphicText>
                        <NeumorphicText>{caseItem.assignedVettingOfficer || 'Not assigned'}</NeumorphicText>
                      </div>
                      <div>
                        <NeumorphicText size="sm" variant="secondary">Cost</NeumorphicText>
                        <NeumorphicText>{formatCurrency(caseItem.totalEstimatedCost)}</NeumorphicText>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </NeumorphicCard>
          )}

          {activeTab === 'relationships' && (
            <NeumorphicCard className="p-6">
              <NeumorphicText className="text-lg font-semibold mb-4">Entity Relationships</NeumorphicText>
              <div className="space-y-4">
                {relationships.map((relationship) => (
                  <div key={relationship.id} className="border border-[var(--neumorphic-border)] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="capitalize">
                          {relationship.type.replace('_', ' ')}
                        </Badge>
                        <NeumorphicText className="font-medium">{relationship.relationshipTo}</NeumorphicText>
                        <Badge variant={relationship.status === 'active' ? 'default' : 'outline'}>
                          {relationship.status}
                        </Badge>
                      </div>
                      {relationship.percentage && (
                        <NeumorphicText size="sm" variant="secondary">
                          {relationship.percentage}%
                        </NeumorphicText>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <NeumorphicText size="sm" variant="secondary">Relationship</NeumorphicText>
                        <NeumorphicText>{relationship.relationship}</NeumorphicText>
                      </div>
                      <div>
                        <NeumorphicText size="sm" variant="secondary">Since</NeumorphicText>
                        <NeumorphicText>{formatDate(relationship.since)}</NeumorphicText>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </NeumorphicCard>
          )}

          {activeTab === 'risk' && (
            <div className="space-y-6">
              <NeumorphicCard className="p-6">
                <NeumorphicText className="text-lg font-semibold mb-4">Risk Profile</NeumorphicText>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div>
                    <NeumorphicText size="sm" variant="secondary">Overall Risk</NeumorphicText>
                    <Badge variant={getRiskVariant(riskProfile.overallRisk)} className="mt-1">
                      {riskProfile.overallRisk}
                    </Badge>
                  </div>
                  <div>
                    <NeumorphicText size="sm" variant="secondary">Risk Score</NeumorphicText>
                    <NeumorphicText className="font-medium">{Math.round(riskProfile.riskScore)}/100</NeumorphicText>
                  </div>
                  <div>
                    <NeumorphicText size="sm" variant="secondary">Last Assessment</NeumorphicText>
                    <NeumorphicText>{formatDate(riskProfile.lastAssessment)}</NeumorphicText>
                  </div>
                  <div>
                    <NeumorphicText size="sm" variant="secondary">Adverse Findings</NeumorphicText>
                    <NeumorphicText className="font-medium">{riskProfile.adverseFindings}</NeumorphicText>
                  </div>
                </div>
                
                <div>
                  <NeumorphicText className="font-medium mb-2">Risk Factors</NeumorphicText>
                  <div className="space-y-2">
                    {riskProfile.riskFactors.length > 0 ? (
                      riskProfile.riskFactors.map((factor, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          <NeumorphicText size="sm">{factor}</NeumorphicText>
                        </div>
                      ))
                    ) : (
                      <NeumorphicText size="sm" variant="secondary">
                        No significant risk factors identified
                      </NeumorphicText>
                    )}
                  </div>
                </div>
              </NeumorphicCard>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <NeumorphicCard className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <NeumorphicText className="font-medium">Adverse Findings</NeumorphicText>
                  </div>
                  <NeumorphicText className="text-2xl font-bold">{riskProfile.adverseFindings}</NeumorphicText>
                </NeumorphicCard>

                <NeumorphicCard className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-yellow-400" />
                    <NeumorphicText className="font-medium">Compliance Issues</NeumorphicText>
                  </div>
                  <NeumorphicText className="text-2xl font-bold">{riskProfile.complianceIssues}</NeumorphicText>
                </NeumorphicCard>

                <NeumorphicCard className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    <NeumorphicText className="font-medium">Reputational Risks</NeumorphicText>
                  </div>
                  <NeumorphicText className="text-2xl font-bold">{riskProfile.reputationalRisks}</NeumorphicText>
                </NeumorphicCard>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <NeumorphicCard className="p-6">
              <NeumorphicText className="text-lg font-semibold mb-4">Document Library</NeumorphicText>
              <div className="space-y-4">
                {allCases.map((caseItem) => (
                  <div key={caseItem.id} className="border border-[var(--neumorphic-border)] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-400" />
                        <NeumorphicText className="font-medium">
                          Interim Report - {caseItem.caseNumber}
                        </NeumorphicText>
                        <Badge variant="outline" className="text-xs">
                          PDF
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/dashboard/operations/case/${caseItem.id}`)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </Button>
                    </div>
                    <NeumorphicText size="sm" variant="secondary">
                      Generated: {formatDate(caseItem.initiatedDate)} • Status: {caseItem.status}
                    </NeumorphicText>
                  </div>
                ))}
              </div>
            </NeumorphicCard>
          )}
        </div>
      </div>
    </NeumorphicBackground>
  );
}