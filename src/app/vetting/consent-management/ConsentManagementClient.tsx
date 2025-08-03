'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  NeumorphicBackground,
  NeumorphicCard, 
  NeumorphicText,
  NeumorphicHeading,
  NeumorphicBadge,
  NeumorphicStatsCard,
  NeumorphicTextarea,
  NeumorphicTable,
  NeumorphicTableHeader,
  NeumorphicTableBody,
  NeumorphicTableRow,
  NeumorphicTableHead,
  NeumorphicTableCell
} from '@/components/ui/neumorphic';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Search, 
  RefreshCw, 
  Plus, 
  Send, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  ExternalLink,
  Download,
  Upload,
  Users
} from 'lucide-react';
import { 
  ConsentRequestItem, 
  ConsentRequestStatus, 
  ConsentChannel,
  ConsentRequestTableRow,
  ConsentFilters,
  ManualConsentForm
} from '@/types/consent';
import { VettingEntityType } from '@/types/vetting';
import { toast } from 'sonner';

interface ConsentManagementClientProps {
  initialData: ConsentRequestItem[];
}

export function ConsentManagementClient({ initialData }: ConsentManagementClientProps) {
  const [data, setData] = useState<ConsentRequestItem[]>(initialData);
  const [filters, setFilters] = useState<ConsentFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Modal states
  const [manualRecordModal, setManualRecordModal] = useState<{ open: boolean; data?: ConsentRequestItem }>({ open: false });

  // Calculate statistics for dashboard cards - exactly as requested
  const stats = useMemo(() => {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
    
    // 1. Total number of checks across all consent requests
    const totalChecks = data.reduce((sum, item) => sum + item.checksRequiringConsent.length, 0);
    
    // 2. Number of checks by channel (breakdown by SMS/Email/Manual)
    const checksByChannel = data.reduce((acc, item) => {
      const channel = item.channel;
      const checksCount = item.checksRequiringConsent.length;
      acc[channel] = (acc[channel] || 0) + checksCount;
      return acc;
    }, {} as Record<ConsentChannel, number>);
    
    // 3. Number of expiring checks (checks in requests that expire within 7 days)
    const expiringChecks = data
      .filter(item => {
        if (!item.expiryDate) return false;
        const expiryDate = new Date(item.expiryDate);
        return expiryDate <= sevenDaysFromNow && expiryDate > now;
      })
      .reduce((sum, item) => sum + item.checksRequiringConsent.length, 0);
    
    // 4. Number of checks by type (breakdown by Individual/Company/Staff Medical)
    const checksByType = data.reduce((acc, item) => {
      const entityType = item.entityType;
      const checksCount = item.checksRequiringConsent.length;
      acc[entityType] = (acc[entityType] || 0) + checksCount;
      return acc;
    }, {} as Record<VettingEntityType, number>);
    
    return {
      totalChecks,
      checksByChannel,
      expiringChecks,
      checksByType
    };
  }, [data]);

  // Convert data to table rows with derived properties
  const tableRows: ConsentRequestTableRow[] = useMemo(() => {
    return data.map(item => {
      const now = new Date();
      const expiryDate = item.expiryDate ? new Date(item.expiryDate) : null;
      const isExpired = expiryDate ? now > expiryDate : false;
      const isNearExpiry = expiryDate ? (expiryDate.getTime() - now.getTime()) < (24 * 60 * 60 * 1000) : false; // Within 24 hours

      return {
        consentId: item.consentId,
        subjectName: item.subjectName,
        subjectId: item.subjectId,
        entityType: item.entityType,
        checksCount: item.checksRequiringConsent.length,
        checksTooltip: item.checksRequiringConsent.map(c => c.checkName).join(', '),
        status: item.status,
        channel: item.channel,
        requestSentDate: item.requestSentDate,
        expiryDate: item.expiryDate,
        lastUpdated: item.lastUpdated,
        isExpired,
        isNearExpiry,
        vettingCaseId: item.vettingCaseId,
        originalData: item
      };
    });
  }, [data]);



  // Apply filters
  const filteredRows = useMemo(() => {
    return tableRows.filter(row => {
      if (filters.status && row.status !== filters.status) return false;
      if (filters.channel && row.channel !== filters.channel) return false;
      if (filters.entityType && row.entityType !== filters.entityType) return false;
      if (filters.showExpiredOnly && !row.isExpired) return false;
      
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return (
          row.consentId.toLowerCase().includes(query) ||
          row.subjectName.toLowerCase().includes(query) ||
          row.subjectId.toLowerCase().includes(query) ||
          row.vettingCaseId.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [tableRows, filters]);

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge variant - using NeumorphicBadge variant types
  const getStatusVariant = (status: ConsentRequestStatus): "default" | "success" | "warning" | "danger" | "info" => {
    switch (status) {
      case ConsentRequestStatus.VERIFIED_APPROVED:
      case ConsentRequestStatus.MANUALLY_RECORDED_APPROVED:
        return 'success';
      case ConsentRequestStatus.PENDING_SENT:
      case ConsentRequestStatus.LINK_OPENED:
      case ConsentRequestStatus.FORM_VIEWED:
        return 'info';
      case ConsentRequestStatus.SUBMITTED_AWAITING_VERIFICATION:
        return 'warning';
      case ConsentRequestStatus.VERIFIED_REJECTED_SIGNATURE_MISMATCH:
      case ConsentRequestStatus.VERIFIED_REJECTED_OTHER:
      case ConsentRequestStatus.DECLINED_BY_SUBJECT:
      case ConsentRequestStatus.ERROR_SENDING:
        return 'danger';
      case ConsentRequestStatus.EXPIRED:
        return 'default';
      default:
        return 'default';
    }
  };

  // Get status icon
  const getStatusIcon = (status: ConsentRequestStatus) => {
    switch (status) {
      case ConsentRequestStatus.VERIFIED_APPROVED:
      case ConsentRequestStatus.MANUALLY_RECORDED_APPROVED:
        return <CheckCircle className="w-3 h-3" />;
      case ConsentRequestStatus.VERIFIED_REJECTED_SIGNATURE_MISMATCH:
      case ConsentRequestStatus.VERIFIED_REJECTED_OTHER:
      case ConsentRequestStatus.DECLINED_BY_SUBJECT:
      case ConsentRequestStatus.ERROR_SENDING:
        return <XCircle className="w-3 h-3" />;
      case ConsentRequestStatus.EXPIRED:
        return <AlertTriangle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast.success('Consent requests refreshed');
  };



  // Handle manual consent recording
  const handleManualRecord = async (form: ManualConsentForm) => {
    const newConsent: ConsentRequestItem = {
      consentId: `CR${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      vettingCaseId: form.vettingCaseId,
      subjectName: form.subjectName,
      subjectId: form.subjectId,
      entityType: form.entityType,
      checksRequiringConsent: form.checksRequiringConsent.map(id => ({ checkId: id, checkName: `Check ${id}` })),
      status: form.outcome === 'approved' 
        ? ConsentRequestStatus.MANUALLY_RECORDED_APPROVED 
        : ConsentRequestStatus.DECLINED_BY_SUBJECT,
      channel: ConsentChannel.MANUAL_UPLOAD,
      requestSentDate: new Date().toISOString(),
      verifiedDate: new Date().toISOString(),
      verificationNotes: form.adminNotes,
      lastUpdated: new Date().toISOString()
    };

    setData(prevData => [newConsent, ...prevData]);
    setManualRecordModal({ open: false });
    toast.success('Manual consent recorded successfully');
  };

  return (
    <NeumorphicBackground className="min-h-screen">
      <div className="w-full space-y-1">
        {/* Header Section */}
        <NeumorphicCard>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <NeumorphicHeading>Consent Management</NeumorphicHeading>
              <NeumorphicText variant="secondary" className="leading-tight">
                Manage consent requests and track approval status for vetting processes.
              </NeumorphicText>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Dialog open={manualRecordModal.open} onOpenChange={(open) => setManualRecordModal({ open })}>
                <DialogTrigger asChild>
                  <Button variant="neumorphic-outline" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Manual Record
                  </Button>
                </DialogTrigger>
                <DialogContent variant="neumorphic" className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Manual Consent Recording</DialogTitle>
                    <DialogDescription>
                      Record consent that was obtained through alternative channels
                    </DialogDescription>
                  </DialogHeader>
                  <ManualRecordForm onSubmit={handleManualRecord} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </NeumorphicCard>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <NeumorphicStatsCard
            title="Total Checks"
            value={stats.totalChecks.toString()}
            icon={<Search className="w-6 h-6 text-blue-400" />}
          />
          <NeumorphicCard className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-neumorphic-text-secondary">By Channel</h3>
              <Send className="w-5 h-5 text-green-400" />
            </div>
            <div className="space-y-1">
              {Object.entries(stats.checksByChannel).map(([channel, count]) => (
                <div key={channel} className="flex justify-between text-sm">
                  <span className="text-neumorphic-text-secondary">
                    {channel.replace('_', ' ').replace('LINK', '').trim()}:
                  </span>
                  <span className="font-medium text-neumorphic-text-primary">{count}</span>
                </div>
              ))}
            </div>
          </NeumorphicCard>
          <NeumorphicStatsCard
            title="Expiring Soon"
            value={stats.expiringChecks.toString()}
            icon={<Clock className="w-6 h-6 text-yellow-400" />}
          />
          <NeumorphicCard className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-neumorphic-text-secondary">By Type</h3>
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div className="space-y-1">
              {Object.entries(stats.checksByType).map(([type, count]) => (
                <div key={type} className="flex justify-between text-sm">
                  <span className="text-neumorphic-text-secondary">
                    {type === 'STAFF_MEDICAL' ? 'Staff Med' : type}:
                  </span>
                  <span className="font-medium text-neumorphic-text-primary">{count}</span>
                </div>
              ))}
            </div>
          </NeumorphicCard>
        </div>

        {/* Main Content Card */}
        <NeumorphicCard className="space-y-6">
          {/* Toolbar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neumorphic-text-secondary w-4 h-4" />
            <Input
              placeholder="Search by ID, name, or case..."
              className="pl-10 w-64"
              value={filters.searchQuery || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              className="px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
              value={filters.status || ''}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                status: e.target.value ? e.target.value as ConsentRequestStatus : undefined 
              }))}
            >
              <option value="">All Statuses</option>
              {Object.values(ConsentRequestStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select
              className="px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
              value={filters.channel || ''}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                channel: e.target.value ? e.target.value as ConsentChannel : undefined 
              }))}
            >
              <option value="">All Channels</option>
              {Object.values(ConsentChannel).map(channel => (
                <option key={channel} value={channel}>{channel}</option>
              ))}
            </select>

            <select
              className="px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
              value={filters.entityType || ''}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                entityType: e.target.value ? e.target.value as VettingEntityType : undefined 
              }))}
            >
              <option value="">All Types</option>
              {Object.values(VettingEntityType).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            variant="neumorphic-outline"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>


        </div>
      </div>

          {/* Consent Requests Table */}
          <NeumorphicTable>
            <NeumorphicTableHeader>
              <NeumorphicTableRow>
                <NeumorphicTableHead className="text-xs font-medium">Consent ID</NeumorphicTableHead>
                <NeumorphicTableHead className="text-xs font-medium">Subject Name</NeumorphicTableHead>
                <NeumorphicTableHead className="text-xs font-medium">Subject ID</NeumorphicTableHead>
                <NeumorphicTableHead className="text-xs font-medium">Type</NeumorphicTableHead>
                <NeumorphicTableHead className="text-xs font-medium">Checks</NeumorphicTableHead>
                <NeumorphicTableHead className="text-xs font-medium">Status</NeumorphicTableHead>
                <NeumorphicTableHead className="text-xs font-medium">Channel</NeumorphicTableHead>
                <NeumorphicTableHead className="text-xs font-medium">Sent</NeumorphicTableHead>
                <NeumorphicTableHead className="text-xs font-medium">Expiry</NeumorphicTableHead>
                <NeumorphicTableHead className="text-xs font-medium">Actions</NeumorphicTableHead>
              </NeumorphicTableRow>
            </NeumorphicTableHeader>
            <NeumorphicTableBody>
              {filteredRows.map((consent) => (
                <NeumorphicTableRow key={consent.consentId}>
                  <NeumorphicTableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="text-blue-600 hover:text-blue-800 font-mono text-xs underline">
                          {consent.consentId}
                        </button>
                      </DialogTrigger>
                      <DialogContent variant="neumorphic" className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Consent Request Details</DialogTitle>
                        </DialogHeader>
                        <ViewDetailsContent data={consent.originalData as ConsentRequestItem} />
                      </DialogContent>
                    </Dialog>
                  </NeumorphicTableCell>
                  
                  <NeumorphicTableCell className="text-sm font-medium">
                    {consent.subjectName}
                  </NeumorphicTableCell>
                  
                  <NeumorphicTableCell className="text-xs font-mono">
                    {consent.subjectId}
                  </NeumorphicTableCell>
                  
                  <NeumorphicTableCell>
                    <NeumorphicBadge variant="info" className="text-xs">
                      {consent.entityType.replace('_', ' ')}
                    </NeumorphicBadge>
                  </NeumorphicTableCell>
                  
                  <NeumorphicTableCell>
                    <div title={consent.checksTooltip} className="cursor-help">
                      <NeumorphicBadge variant="default" className="text-xs">
                        {consent.checksCount} check{consent.checksCount !== 1 ? 's' : ''}
                      </NeumorphicBadge>
                    </div>
                  </NeumorphicTableCell>
                  
                  <NeumorphicTableCell>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(consent.status)}
                      <NeumorphicBadge 
                        variant={getStatusVariant(consent.status)} 
                        className="text-xs"
                      >
                        {consent.status.replace(/_/g, ' ')}
                      </NeumorphicBadge>
                    </div>
                  </NeumorphicTableCell>
                  
                  <NeumorphicTableCell>
                    <NeumorphicBadge variant="default" className="text-xs">
                      {consent.channel.replace('_', ' ')}
                    </NeumorphicBadge>
                  </NeumorphicTableCell>
                  
                  <NeumorphicTableCell className="text-xs">
                    {formatDate(consent.requestSentDate)}
                  </NeumorphicTableCell>
                  
                  <NeumorphicTableCell className="text-xs">
                    {consent.expiryDate ? (
                      <span className={consent.isExpired ? 'text-red-500' : consent.isNearExpiry ? 'text-yellow-500' : ''}>
                        {formatDate(consent.expiryDate)}
                      </span>
                    ) : (
                      <span className="text-neumorphic-text-secondary">N/A</span>
                    )}
                  </NeumorphicTableCell>
                  
                  <NeumorphicTableCell>
                    <div className="flex items-center gap-1">
                      {/* Conditional action buttons based on status */}
                      {[ConsentRequestStatus.PENDING_SENT, ConsentRequestStatus.EXPIRED, ConsentRequestStatus.ERROR_SENDING].includes(consent.status) && (
                        <Button 
                          variant="neumorphic-outline" 
                          className="h-7 w-7 p-0"
                          onClick={() => toast.success(`Consent request resent to ${consent.subjectName}`)}
                          title="Resend"
                        >
                          <Send className="w-3 h-3" />
                        </Button>
                      )}
                      
                      {consent.status === ConsentRequestStatus.SUBMITTED_AWAITING_VERIFICATION && (
                        <Button 
                          variant="neumorphic-outline" 
                          className="h-7 w-7 p-0"
                          onClick={() => console.log('Verify clicked for', consent.consentId)}
                          title="Verify"
                        >
                          <CheckCircle className="w-3 h-3" />
                        </Button>
                      )}
                      
                      <Button 
                        variant="neumorphic-outline" 
                        className="h-7 w-7 p-0"
                        onClick={() => toast.info(`Navigating to vetting case ${consent.vettingCaseId}`)}
                        title="View Case"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </NeumorphicTableCell>
                </NeumorphicTableRow>
              ))}
            </NeumorphicTableBody>
          </NeumorphicTable>
        </NeumorphicCard>
      </div>
    </NeumorphicBackground>
  );
}

// View Details Content Component
function ViewDetailsContent({ data }: { data: ConsentRequestItem }) {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-neumorphic-text-secondary">Consent ID</label>
          <NeumorphicText>{data.consentId}</NeumorphicText>
        </div>
        <div>
          <label className="text-sm font-medium text-neumorphic-text-secondary">Vetting Case ID</label>
          <NeumorphicText>{data.vettingCaseId}</NeumorphicText>
        </div>
        <div>
          <label className="text-sm font-medium text-neumorphic-text-secondary">Subject Name</label>
          <NeumorphicText>{data.subjectName}</NeumorphicText>
        </div>
        <div>
          <label className="text-sm font-medium text-neumorphic-text-secondary">Subject ID</label>
          <NeumorphicText>{data.subjectId}</NeumorphicText>
        </div>
        <div>
          <label className="text-sm font-medium text-neumorphic-text-secondary">Entity Type</label>
          <Badge variant="outline">{data.entityType}</Badge>
        </div>
        <div>
          <label className="text-sm font-medium text-neumorphic-text-secondary">Channel</label>
          <Badge variant="outline">{data.channel}</Badge>
        </div>
      </div>

      {/* Status and Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-neumorphic-text-secondary">Status</label>
          <div className="mt-1">
            <NeumorphicBadge variant="info">{data.status}</NeumorphicBadge>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-neumorphic-text-secondary">Request Sent</label>
          <NeumorphicText>
            {new Date(data.requestSentDate).toLocaleDateString('en-ZA', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </NeumorphicText>
        </div>
        {data.expiryDate && (
          <div>
            <label className="text-sm font-medium text-neumorphic-text-secondary">Expiry Date</label>
            <NeumorphicText>
              {new Date(data.expiryDate).toLocaleDateString('en-ZA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </NeumorphicText>
          </div>
        )}
        {data.verifiedDate && (
          <div>
            <label className="text-sm font-medium text-neumorphic-text-secondary">Verified Date</label>
            <NeumorphicText>
              {new Date(data.verifiedDate).toLocaleDateString('en-ZA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </NeumorphicText>
          </div>
        )}
      </div>

      {/* Contact Information */}
      {(data.recipientMobile || data.recipientEmail) && (
        <div className="grid grid-cols-2 gap-4">
          {data.recipientMobile && (
            <div>
              <label className="text-sm font-medium text-neumorphic-text-secondary">Mobile</label>
              <NeumorphicText>{data.recipientMobile}</NeumorphicText>
            </div>
          )}
          {data.recipientEmail && (
            <div>
              <label className="text-sm font-medium text-neumorphic-text-secondary">Email</label>
              <NeumorphicText>{data.recipientEmail}</NeumorphicText>
            </div>
          )}
        </div>
      )}

      {/* Checks Requiring Consent */}
      <div>
        <label className="text-sm font-medium text-neumorphic-text-secondary">Checks Requiring Consent</label>
        <div className="mt-2 space-y-2">
          {data.checksRequiringConsent.map((check, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-neumorphic-bg rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <NeumorphicText>{check.checkName}</NeumorphicText>
            </div>
          ))}
        </div>
      </div>

      {/* Digital Signature */}
      {data.digitalSignatureImageLink && (
        <div>
          <label className="text-sm font-medium text-neumorphic-text-secondary">Digital Signature</label>
          <div className="mt-2 p-4 bg-neumorphic-bg rounded-lg">
            <Image
              src={data.digitalSignatureImageLink}
              alt="Digital Signature"
              width={300}
              height={200}
              className="max-w-full h-auto border border-neumorphic-border/20 rounded"
            />
            <NeumorphicText variant="secondary" size="sm" className="mt-2">
              Submitted digital signature
            </NeumorphicText>
          </div>
        </div>
      )}

      {/* Uploaded Consent Form */}
      {data.uploadedConsentFormLink && (
        <div>
          <label className="text-sm font-medium text-neumorphic-text-secondary">Consent Form</label>
          <div className="mt-2">
            <Button variant="neumorphic-outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Consent Form
            </Button>
          </div>
        </div>
      )}

      {/* Verification Notes */}
      {data.verificationNotes && (
        <div>
          <label className="text-sm font-medium text-neumorphic-text-secondary">Verification Notes</label>
          <div className="mt-1 p-3 bg-neumorphic-bg rounded-lg">
            <NeumorphicText>{data.verificationNotes}</NeumorphicText>
          </div>
        </div>
      )}
    </div>
  );
}

// Note: VerifyConsentForm component removed as it's not currently in use

// Manual Record Form Component
function ManualRecordForm({ 
  onSubmit 
}: { 
  onSubmit: (form: ManualConsentForm) => void;
}) {
  const [form, setForm] = useState<ManualConsentForm>({
    vettingCaseId: '',
    subjectName: '',
    subjectId: '',
    entityType: VettingEntityType.INDIVIDUAL,
    checksRequiringConsent: [],
    outcome: 'approved',
    adminNotes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    setForm({
      vettingCaseId: '',
      subjectName: '',
      subjectId: '',
      entityType: VettingEntityType.INDIVIDUAL,
      checksRequiringConsent: [],
      outcome: 'approved',
      adminNotes: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Basic Information */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-neumorphic-text-secondary">Vetting Case ID</label>
          <Input
            value={form.vettingCaseId}
            onChange={(e) => setForm(prev => ({ ...prev, vettingCaseId: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-neumorphic-text-secondary">Entity Type</label>
          <select
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
            value={form.entityType}
            onChange={(e) => setForm(prev => ({ ...prev, entityType: e.target.value as VettingEntityType }))}
          >
            {Object.values(VettingEntityType).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-neumorphic-text-secondary">Subject Name</label>
          <Input
            value={form.subjectName}
            onChange={(e) => setForm(prev => ({ ...prev, subjectName: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-neumorphic-text-secondary">Subject ID</label>
          <Input
            value={form.subjectId}
            onChange={(e) => setForm(prev => ({ ...prev, subjectId: e.target.value }))}
            required
          />
        </div>
      </div>

      {/* Consent Outcome */}
      <div>
        <label className="text-sm font-medium text-neumorphic-text-secondary">Consent Outcome</label>
        <div className="mt-2 space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="outcome"
              value="approved"
              checked={form.outcome === 'approved'}
              onChange={(e) => setForm(prev => ({ ...prev, outcome: e.target.value as 'approved' | 'declined' }))}
            />
            <span>Approved</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="outcome"
              value="declined"
              checked={form.outcome === 'declined'}
              onChange={(e) => setForm(prev => ({ ...prev, outcome: e.target.value as 'approved' | 'declined' }))}
            />
            <span>Declined</span>
          </label>
        </div>
      </div>

      {/* Admin Notes */}
      <div>
        <label className="text-sm font-medium text-neumorphic-text-secondary">Admin Notes</label>
        <NeumorphicTextarea
          value={form.adminNotes}
          onChange={(e) => setForm(prev => ({ ...prev, adminNotes: e.target.value }))}
          placeholder="Record how consent was obtained or declined..."
          rows={3}
          className="mt-1"
          required
        />
      </div>

      {/* File Upload Placeholder */}
      <div>
        <label className="text-sm font-medium text-neumorphic-text-secondary">Consent Form (Optional)</label>
        <div className="mt-2 p-4 border-2 border-dashed border-neumorphic-border/30 rounded-lg text-center">
          <Upload className="w-8 h-8 mx-auto text-neumorphic-text-secondary mb-2" />
          <NeumorphicText variant="secondary" size="sm">
            Click to upload scanned consent form (PDF, JPG, PNG)
          </NeumorphicText>
          <NeumorphicText variant="secondary" size="sm" className="text-xs">
            Max file size: 10MB
          </NeumorphicText>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <Button type="submit" variant="neumorphic-outline">
          Save Manual Record
        </Button>
      </div>
    </form>
  );
} 