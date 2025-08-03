'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Download, Shield, AlertTriangle, CheckCircle, Flag, Clock } from 'lucide-react';
import Link from 'next/link';
import { NeumorphicCard } from '@/components/ui/neumorphic-card';
import { NeumorphicTabs } from '@/components/ui/neumorphic/NeumorphicTabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CaseProgressChart } from '@/components/operations/CaseProgressChart';
import { DocumentList } from '@/components/operations/DocumentList';
import { NotesSection } from '@/components/operations/NotesSection';
import { RiskAssessmentWidget } from '@/components/operations/RiskAssessmentWidget';
import { 
  opsCases, 
  getCaseDetails, 
  getCaseTimeline, 
  formatZAR,
  daysSince,
  type OpsCase,
  type CaseDetails,
  type CaseTimelineEvent 
} from '@/lib/sample-data/operations-dashboard-data';

const priorityColors = {
  'Urgent': 'bg-red-500 text-white',
  'High': 'bg-orange-500 text-white',
  'Medium': 'bg-yellow-500 text-black',
  'Low': 'bg-green-500 text-white'
};

const statusColors = {
  'Initiated': 'bg-gray-500 text-white',
  'Consent Pending': 'bg-yellow-500 text-black',
  'In Progress': 'bg-blue-500 text-white',
  'Partially Complete': 'bg-orange-500 text-white',
  'Complete': 'bg-green-500 text-white',
  'Failed': 'bg-red-500 text-white',
  'Cancelled': 'bg-gray-400 text-white'
};


export default function CaseDetailsPage() {
  const params = useParams();
  const caseId = params.id as string;
  
  const [caseData, setCaseData] = useState<OpsCase | null>(null);
  const [detailsData, setDetailsData] = useState<CaseDetails | null>(null);
  const [timelineData, setTimelineData] = useState<CaseTimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadCaseData = async () => {
      try {
        // Find the case
        const foundCase = opsCases.find(c => c.id === caseId);
        if (!foundCase) {
          throw new Error('Case not found');
        }

        // Get detailed case data
        const details = getCaseDetails(caseId);
        const timeline = getCaseTimeline(caseId);

        setCaseData(foundCase);
        setDetailsData(details);
        setTimelineData(timeline);
      } catch (error) {
        console.error('Error loading case data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCaseData();
  }, [caseId]);

  const handleExport = () => {
    // Export functionality
    const exportData = {
      case: caseData,
      details: detailsData,
      timeline: timelineData
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `case-${caseData?.caseNumber}-details.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

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

  if (!caseData) {
    return (
      <div className="min-h-screen p-6 bg-neumorphic-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-neumorphic-text mb-4">Case Not Found</h1>
            <p className="text-neumorphic-text/70 mb-6">The requested case could not be found.</p>
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
                {caseData.caseNumber}
              </h1>
              <p className="text-neumorphic-text/70">
                {caseData.entityName} • {caseData.entityType}
              </p>
            </div>
          </div>
          <Button onClick={handleExport} size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Case
          </Button>
        </div>

        {/* Case Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <NeumorphicCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neumorphic-text/70">Status</p>
                <Badge className={`mt-1 ${statusColors[caseData.status]}`}>
                  {caseData.status}
                </Badge>
              </div>
              <div className="p-2 bg-neumorphic-primary/10 rounded-full">
                <Shield className="w-5 h-5 text-neumorphic-primary" />
              </div>
            </div>
          </NeumorphicCard>

          <NeumorphicCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neumorphic-text/70">Priority</p>
                <Badge className={`mt-1 ${priorityColors[caseData.priority]}`}>
                  {caseData.priority}
                </Badge>
              </div>
              <div className="p-2 bg-neumorphic-severity-medium/10 rounded-full">
                <Flag className="w-5 h-5 text-neumorphic-severity-medium" />
              </div>
            </div>
          </NeumorphicCard>

          <NeumorphicCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neumorphic-text/70">Progress</p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-neumorphic-bg rounded-full">
                    <div 
                      className="h-2 bg-neumorphic-primary rounded-full transition-all duration-300"
                      style={{ width: `${caseData.overallProgress}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-neumorphic-text">
                    {caseData.overallProgress}%
                  </span>
                </div>
              </div>
              <div className="p-2 bg-neumorphic-severity-low/10 rounded-full">
                <CheckCircle className="w-5 h-5 text-neumorphic-severity-low" />
              </div>
            </div>
          </NeumorphicCard>

          <NeumorphicCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neumorphic-text/70">Estimated Cost</p>
                <p className="text-lg font-semibold text-neumorphic-text mt-1">
                  {formatZAR(caseData.totalEstimatedCost)}
                </p>
              </div>
              <div className="p-2 bg-neumorphic-accent/10 rounded-full">
                <Clock className="w-5 h-5 text-neumorphic-accent" />
              </div>
            </div>
          </NeumorphicCard>
        </div>

        {/* Main Content Tabs */}
        <NeumorphicCard className="p-6">
          <NeumorphicTabs value={activeTab} onValueChange={setActiveTab}>
            <NeumorphicTabs.List className="mb-6">
              <NeumorphicTabs.Trigger value="overview">Overview</NeumorphicTabs.Trigger>
              <NeumorphicTabs.Trigger value="timeline">Timeline</NeumorphicTabs.Trigger>
              <NeumorphicTabs.Trigger value="checks">Checks</NeumorphicTabs.Trigger>
              <NeumorphicTabs.Trigger value="documents">Documents</NeumorphicTabs.Trigger>
              <NeumorphicTabs.Trigger value="notes">Notes</NeumorphicTabs.Trigger>
            </NeumorphicTabs.List>

            {/* Overview Tab */}
            <NeumorphicTabs.Content value="overview">
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Case Summary */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-neumorphic-text">Case Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-neumorphic-text/70">Case Number:</span>
                        <span className="font-medium text-neumorphic-text">{caseData.caseNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neumorphic-text/70">Entity:</span>
                        <span className="font-medium text-neumorphic-text">{caseData.entityName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neumorphic-text/70">Entity Type:</span>
                        <span className="font-medium text-neumorphic-text">{caseData.entityType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neumorphic-text/70">Identifier:</span>
                        <span className="font-medium text-neumorphic-text">{caseData.entityIdentifier}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neumorphic-text/70">Assigned Officer:</span>
                        <span className="font-medium text-neumorphic-text">{caseData.assignedVettingOfficer || 'Unassigned'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neumorphic-text/70">Primary Provider:</span>
                        <span className="font-medium text-neumorphic-text">MIE</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neumorphic-text/70">Initiated Date:</span>
                        <span className="font-medium text-neumorphic-text">
                          {new Date(caseData.initiatedDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neumorphic-text/70">Days Active:</span>
                        <span className="font-medium text-neumorphic-text">
                          {daysSince(caseData.initiatedDate)} days
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Chart */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-neumorphic-text">Progress Overview</h3>
                    <CaseProgressChart caseId={caseId} />
                  </div>
                </div>

                {/* Risk Assessment */}
                {detailsData && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-neumorphic-text">Risk Assessment</h3>
                    <RiskAssessmentWidget 
                      riskAssessment={{
                        overallRiskLevel: detailsData.riskScore < 30 ? 'Low' : 
                                         detailsData.riskScore < 60 ? 'Medium' : 
                                         detailsData.riskScore < 80 ? 'High' : 'Critical',
                        riskFactors: [
                          {
                            factor: 'Overall Risk Score',
                            level: detailsData.riskScore < 30 ? 'Low' : 
                                   detailsData.riskScore < 60 ? 'Medium' : 'High',
                            description: `Risk score: ${detailsData.riskScore}`
                          }
                        ],
                        recommendation: detailsData.riskScore < 30 ? 'Proceed with standard processes' :
                                       detailsData.riskScore < 60 ? 'Additional monitoring recommended' :
                                       detailsData.riskScore < 80 ? 'Enhanced due diligence required' : 'High risk - manual review required'
                      }} 
                    />
                  </div>
                )}

                {/* Risk Score Display */}
                {detailsData && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-neumorphic-text flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-neumorphic-severity-critical" />
                      Risk Score
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-3 bg-neumorphic-severity-critical/10 rounded-md">
                        <AlertTriangle className="w-4 h-4 text-neumorphic-severity-critical" />
                        <span className="text-neumorphic-text">Risk Score: {detailsData.riskScore}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </NeumorphicTabs.Content>

            {/* Timeline Tab */}
            <NeumorphicTabs.Content value="timeline">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neumorphic-text">Case Timeline</h3>
                {timelineData.length > 0 ? (
                  <div className="space-y-4">
                    {timelineData.map((event, index) => (
                      <div key={event.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${
                            event.type === 'completed' ? 'bg-green-500' :
                            event.type === 'flagged' ? 'bg-yellow-500' :
                            event.type === 'check_completed' ? 'bg-blue-500' : 'bg-gray-500'
                          }`} />
                          {index < timelineData.length - 1 && (
                            <div className="w-0.5 h-8 bg-neumorphic-border mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-neumorphic-text">{event.title}</span>
                            <span className="text-sm text-neumorphic-text/70">{event.timestamp}</span>
                          </div>
                          <div className="text-sm text-neumorphic-text/70 mb-1">By: {event.user}</div>
                          {event.description && (
                            <div className="text-sm text-neumorphic-text">{event.description}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-neumorphic-text/70">
                    No timeline data available
                  </div>
                )}
              </div>
            </NeumorphicTabs.Content>

            {/* Checks Tab */}
            <NeumorphicTabs.Content value="checks">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neumorphic-text">Case Information</h3>
                {detailsData && (
                  <div className="space-y-4">
                    <NeumorphicCard className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-neumorphic-text">Case Details</h4>
                          <div className="flex items-center gap-2">
                            <Badge className={`
                              ${detailsData.status === 'Complete' ? 'bg-green-500 text-white' :
                                detailsData.status === 'In Progress' ? 'bg-blue-500 text-white' :
                                detailsData.status === 'Failed' ? 'bg-red-500 text-white' :
                                'bg-gray-500 text-white'
                              }
                            `}>
                              {detailsData.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-neumorphic-text/70">Case Number:</span>
                            <span className="ml-2 text-neumorphic-text">{detailsData.caseNumber}</span>
                          </div>
                          <div>
                            <span className="text-neumorphic-text/70">Entity:</span>
                            <span className="ml-2 text-neumorphic-text">{detailsData.entityName}</span>
                          </div>
                          <div>
                            <span className="text-neumorphic-text/70">Progress:</span>
                            <span className="ml-2 text-neumorphic-text">{detailsData.progress}%</span>
                          </div>
                          <div>
                            <span className="text-neumorphic-text/70">Risk Score:</span>
                            <span className="ml-2 text-neumorphic-text">{detailsData.riskScore}</span>
                          </div>
                          <div>
                            <span className="text-neumorphic-text/70">Compliance Status:</span>
                            <span className="ml-2 text-neumorphic-text">{detailsData.complianceStatus}</span>
                          </div>
                          <div>
                            <span className="text-neumorphic-text/70">Total Cost:</span>
                            <span className="ml-2 text-neumorphic-text">R{detailsData.totalCost}</span>
                          </div>
                        </div>
                        {detailsData.notes && detailsData.notes.length > 0 && (
                          <div className="space-y-2">
                            <h5 className="font-medium text-neumorphic-text">Notes:</h5>
                            <ul className="list-disc list-inside space-y-1 text-sm text-neumorphic-text/70">
                              {detailsData.notes.map((note: string, index: number) => (
                                <li key={index}>{note}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </NeumorphicCard>
                  </div>
                )}
              </div>
            </NeumorphicTabs.Content>

            {/* Documents Tab */}
            <NeumorphicTabs.Content value="documents">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neumorphic-text">Case Documents</h3>
                <DocumentList caseId={caseId} />
              </div>
            </NeumorphicTabs.Content>

            {/* Notes Tab */}
            <NeumorphicTabs.Content value="notes">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neumorphic-text">Case Notes</h3>
                <NotesSection caseId={caseId} />
              </div>
            </NeumorphicTabs.Content>
          </NeumorphicTabs>
        </NeumorphicCard>
      </div>
    </div>
  );
}