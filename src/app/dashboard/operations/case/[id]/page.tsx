'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  NeumorphicBackground,
  NeumorphicCard,
  NeumorphicText,
  NeumorphicHeading
} from '@/components/ui/neumorphic';
import { 
  ArrowLeft,
  Edit2,
  Download,
  Share,
  Clock,
  User,
  Building,
  MapPin,
  Phone,
  AlertTriangle,
  CheckCircle,
  FileText,
  Activity,
  DollarSign,
  TrendingUp,
  Flag,
  Eye,
  History,
  Shield,
  Zap
} from 'lucide-react';
import { operationsVettingCases } from '@/lib/sample-data/operations-dashboard-data';
import { ActiveVettingCase, VettingStatus, IndividualDetails, CompanyDetails, VettingEntityType } from '@/types/vetting';
import { InterimReportDocument } from '@/components/vetting/InterimReportDocument';
import TimelineDialog from '@/components/operations/TimelineDialog';
import { EditCaseDialog } from '@/components/operations/EditCaseDialog';
import CheckProgressIndicator from '@/components/vetting/CheckProgressIndicator';
import IndividualChecksList from '@/components/vetting/IndividualChecksList';
import { toast } from 'sonner';

export default function CaseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.id as string;
  
  const [vettingCase, setVettingCase] = useState<ActiveVettingCase | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'checks' | 'timeline' | 'documents' | 'notes'>('overview');
  const [showTimeline, setShowTimeline] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading the case data
    const loadCase = async () => {
      setLoading(true);
      try {
        // In real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 500));
        const foundCase = operationsVettingCases.find(c => c.id === caseId);
        if (foundCase) {
          setVettingCase(foundCase);
        } else {
          toast.error('Case not found');
          router.push('/dashboard/operations');
        }
      } catch {
        toast.error('Failed to load case details');
        router.push('/dashboard/operations');
      } finally {
        setLoading(false);
      }
    };

    if (caseId) {
      loadCase();
    }
  }, [caseId, router]);

  const handleEditSave = (updatedCase: Partial<ActiveVettingCase>) => {
    // In real app, this would call an API
    console.log('Case updated:', updatedCase);
    toast.success('Case updated successfully');
    setShowEdit(false);
  };

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

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'destructive';
      case 'High':
        return 'secondary';
      case 'Medium':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const renderEntityDetails = () => {
    if (!vettingCase) return null;

    if (vettingCase.entityType === VettingEntityType.INDIVIDUAL) {
      const details = vettingCase.entityDetails as IndividualDetails;
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
                <NeumorphicText className="font-medium">{details.idNumber || 'Not provided'}</NeumorphicText>
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
                <NeumorphicText className="font-medium">{details.mobileNumber}</NeumorphicText>
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

    if (vettingCase.entityType === VettingEntityType.COMPANY) {
      const details = vettingCase.entityDetails as CompanyDetails;
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
                <NeumorphicText className="font-medium">{details.registrationNumber}</NeumorphicText>
              </div>
              <div>
                <NeumorphicText size="sm" variant="secondary">VAT Number</NeumorphicText>
                <NeumorphicText className="font-medium">{details.vatNumber || 'Not registered'}</NeumorphicText>
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
                <NeumorphicText className="font-medium">{details.primaryContactMobile || 'Not provided'}</NeumorphicText>
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

  if (!vettingCase) {
    return (
      <NeumorphicBackground className="min-h-screen">
        <div className="text-center py-12">
          <NeumorphicText>Case not found</NeumorphicText>
        </div>
      </NeumorphicBackground>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'checks', label: 'Checks', icon: CheckCircle },
    { id: 'timeline', label: 'Timeline', icon: History },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'notes', label: 'Notes', icon: Edit2 }
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
                  <Shield className="w-6 h-6 text-blue-400" />
                  {vettingCase.caseNumber}
                  {vettingCase.flaggedForReview && (
                    <Flag className="w-5 h-5 text-red-400" />
                  )}
                  {vettingCase.priority === 'Urgent' && (
                    <Zap className="w-5 h-5 text-yellow-400" />
                  )}
                </NeumorphicHeading>
                <NeumorphicText variant="secondary">
                  {vettingCase.entityName} • {vettingCase.entityType}
                </NeumorphicText>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTimeline(true)}
                className="flex items-center gap-1"
              >
                <Clock className="w-4 h-4" />
                Timeline
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEdit(true)}
                className="flex items-center gap-1"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info('Export functionality')}
                className="flex items-center gap-1"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info('Share functionality')}
                className="flex items-center gap-1"
              >
                <Share className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </NeumorphicCard>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <NeumorphicCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <NeumorphicText size="sm" variant="secondary">Status</NeumorphicText>
                <Badge variant={getStatusVariant(vettingCase.status)} className="mt-1">
                  {vettingCase.status}
                </Badge>
              </div>
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
          </NeumorphicCard>

          <NeumorphicCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <NeumorphicText size="sm" variant="secondary">Priority</NeumorphicText>
                <Badge variant={getPriorityVariant(vettingCase.priority)} className="mt-1">
                  {vettingCase.priority}
                </Badge>
              </div>
              <Flag className="w-6 h-6 text-yellow-400" />
            </div>
          </NeumorphicCard>

          <NeumorphicCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <NeumorphicText size="sm" variant="secondary">Progress</NeumorphicText>
                <NeumorphicText className="text-lg font-bold">{vettingCase.overallProgress}%</NeumorphicText>
              </div>
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
          </NeumorphicCard>

          <NeumorphicCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <NeumorphicText size="sm" variant="secondary">Est. Cost</NeumorphicText>
                <NeumorphicText className="text-lg font-bold">{formatCurrency(vettingCase.totalEstimatedCost)}</NeumorphicText>
              </div>
              <DollarSign className="w-6 h-6 text-blue-400" />
            </div>
          </NeumorphicCard>
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
              {/* Case Overview */}
              <NeumorphicCard className="p-6">
                <NeumorphicText className="text-lg font-semibold mb-4">Case Overview</NeumorphicText>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <NeumorphicText size="sm" variant="secondary">Initiated Date</NeumorphicText>
                    <NeumorphicText className="font-medium">{formatDate(vettingCase.initiatedDate)}</NeumorphicText>
                  </div>
                  <div>
                    <NeumorphicText size="sm" variant="secondary">Assigned Officer</NeumorphicText>
                    <NeumorphicText className="font-medium">{vettingCase.assignedVettingOfficer || 'Not assigned'}</NeumorphicText>
                  </div>
                  <div>
                    <NeumorphicText size="sm" variant="secondary">Days Active</NeumorphicText>
                    <NeumorphicText className="font-medium">{vettingCase.daysSinceInitiated} days</NeumorphicText>
                  </div>
                  <div>
                    <NeumorphicText size="sm" variant="secondary">Checks Completed</NeumorphicText>
                    <NeumorphicText className="font-medium">{vettingCase.completedChecks} of {vettingCase.totalChecks}</NeumorphicText>
                  </div>
                  <div>
                    <NeumorphicText size="sm" variant="secondary">Est. Completion</NeumorphicText>
                    <NeumorphicText className="font-medium">
                      {vettingCase.estimatedCompletionDate ? formatDate(vettingCase.estimatedCompletionDate) : 'Not set'}
                    </NeumorphicText>
                  </div>
                  <div>
                    <NeumorphicText size="sm" variant="secondary">Is Overdue</NeumorphicText>
                    <Badge variant={vettingCase.isOverdue ? 'destructive' : 'default'}>
                      {vettingCase.isOverdue ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                </div>
              </NeumorphicCard>

              {/* Entity Details */}
              <div>
                <NeumorphicText className="text-lg font-semibold mb-4">Entity Details</NeumorphicText>
                {renderEntityDetails()}
              </div>

              {/* Progress Indicator */}
              <NeumorphicCard className="p-6">
                <NeumorphicText className="text-lg font-semibold mb-4">Progress Overview</NeumorphicText>
                <CheckProgressIndicator
                  progress={vettingCase.overallProgress}
                  completedChecks={vettingCase.completedChecks}
                  totalChecks={vettingCase.totalChecks}
                  size="large"
                  showText={true}
                />
              </NeumorphicCard>
            </div>
          )}

          {activeTab === 'checks' && (
            <NeumorphicCard className="p-6">
              <NeumorphicText className="text-lg font-semibold mb-4">Individual Checks</NeumorphicText>
              <IndividualChecksList checks={vettingCase.individualChecks} />
            </NeumorphicCard>
          )}

          {activeTab === 'timeline' && (
            <NeumorphicCard className="p-6">
              <NeumorphicText className="text-lg font-semibold mb-4">Case Timeline</NeumorphicText>
              <NeumorphicText variant="secondary">
                Click the Timeline button in the header to view the detailed case timeline.
              </NeumorphicText>
            </NeumorphicCard>
          )}

          {activeTab === 'documents' && (
            <NeumorphicCard className="p-6">
              <NeumorphicText className="text-lg font-semibold mb-4">Interim Report</NeumorphicText>
              <div className="bg-white rounded-lg p-6">
                <InterimReportDocument vettingCase={vettingCase} />
              </div>
            </NeumorphicCard>
          )}

          {activeTab === 'notes' && (
            <NeumorphicCard className="p-6">
              <NeumorphicText className="text-lg font-semibold mb-4">Case Notes</NeumorphicText>
              <div className="space-y-4">
                {vettingCase.flaggedForReview && vettingCase.flaggedReason && (
                  <div className="p-4 bg-red-500/10 border border-red-400/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <NeumorphicText className="font-medium text-red-400">Flagged for Review</NeumorphicText>
                    </div>
                    <NeumorphicText size="sm">{vettingCase.flaggedReason}</NeumorphicText>
                  </div>
                )}
                
                <NeumorphicText variant="secondary">
                  Additional case notes and comments will be displayed here as they are added during the vetting process.
                </NeumorphicText>
              </div>
            </NeumorphicCard>
          )}
        </div>

        {/* Dialogs */}
        {vettingCase && (
          <>
            <TimelineDialog
              isOpen={showTimeline}
              onClose={() => setShowTimeline(false)}
              vettingCase={vettingCase}
            />
            
            <EditCaseDialog
              isOpen={showEdit}
              onClose={() => setShowEdit(false)}
              vettingCase={vettingCase}
              onSave={handleEditSave}
            />
          </>
        )}
      </div>
    </NeumorphicBackground>
  );
}