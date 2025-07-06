'use client';

import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NeumorphicSelect } from '@/components/forms/selection/NeumorphicSelect';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { NeumorphicCard, NeumorphicText } from '@/components/ui/neumorphic';
import { ConsentJourneyStepper } from './ConsentJourneyStepper';
import { SignatureAnalysisModal } from './SignatureAnalysisModal';
import { ConsentRequestItem, ConsentRequestStatus, ConsentChannel } from '@/types/consent';
import { VettingEntityType } from '@/types/vetting';
import {
  Search,
  RefreshCw,
  Send,
  MessageSquare,
  Mail,
  MessageCircle,
  Eye,
  FileSignature,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface ConsentManagementTableProps {
  requests: ConsentRequestItem[];
  onViewRequest?: (requestId: string) => void;
  className?: string;
}

export const ConsentManagementTable: React.FC<ConsentManagementTableProps> = ({
  requests,
  onViewRequest,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ConsentRequestStatus | 'All'>('All');
  const [channelFilter, setChannelFilter] = useState<ConsentChannel | 'All'>('All');
  const [selectedRequest, setSelectedRequest] = useState<ConsentRequestItem | null>(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);

  // Filter requests based on search and filters
  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          request.subjectName.toLowerCase().includes(searchLower) ||
          request.consentId.toLowerCase().includes(searchLower) ||
          request.vettingCaseId.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (statusFilter !== 'All' && request.status !== statusFilter) {
        return false;
      }

      // Channel filter
      if (channelFilter !== 'All' && request.channel !== channelFilter) {
        return false;
      }

      return true;
    });
  }, [requests, searchTerm, statusFilter, channelFilter]);

  const getStatusBadge = (status: ConsentRequestStatus) => {
    switch (status) {
      case ConsentRequestStatus.VERIFIED_APPROVED:
        return <Badge className="bg-green-400/20 text-green-400 border-green-400/40">Approved</Badge>;
      case ConsentRequestStatus.SUBMITTED_AWAITING_VERIFICATION:
        return <Badge className="bg-blue-400/20 text-blue-400 border-blue-400/40">Awaiting Verification</Badge>;
      case ConsentRequestStatus.PENDING_SENT:
        return <Badge className="bg-amber-400/20 text-amber-400 border-amber-400/40">Sent</Badge>;
      case ConsentRequestStatus.LINK_OPENED:
        return <Badge className="bg-blue-400/20 text-blue-400 border-blue-400/40">Opened</Badge>;
      case ConsentRequestStatus.FORM_VIEWED:
        return <Badge className="bg-purple-400/20 text-purple-400 border-purple-400/40">Viewed</Badge>;
      case ConsentRequestStatus.EXPIRED:
        return <Badge className="bg-red-400/20 text-red-400 border-red-400/40">Expired</Badge>;
      case ConsentRequestStatus.DECLINED_BY_SUBJECT:
        return <Badge className="bg-red-400/20 text-red-400 border-red-400/40">Declined</Badge>;
      case ConsentRequestStatus.ERROR_SENDING:
        return <Badge className="bg-red-400/20 text-red-400 border-red-400/40">Send Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getChannelIcon = (channel: ConsentChannel) => {
    switch (channel) {
      case ConsentChannel.EMAIL_LINK:
        return <Mail className="w-4 h-4 text-blue-400" />;
      case ConsentChannel.SMS_LINK:
        return <MessageCircle className="w-4 h-4 text-green-400" />;
      case ConsentChannel.MANUAL_UPLOAD:
        return <FileSignature className="w-4 h-4 text-purple-400" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleResendConsent = (request: ConsentRequestItem, newChannel: ConsentChannel) => {
    // Simulate resend action
    toast.success(`Consent request resent via ${newChannel.replace('_', ' ')} to ${request.subjectName}`);
    
    // In real implementation, this would call an API to resend
    console.log(`Resending consent ${request.consentId} via ${newChannel}`);
  };

  const handleViewSignature = (request: ConsentRequestItem) => {
    if (request.digitalSignatureImageLink) {
      setSelectedRequest(request);
      setShowSignatureModal(true);
    } else {
      toast.error('No signature available for this request');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-ZA', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEntityTypeIcon = (entityType: VettingEntityType) => {
    switch (entityType) {
      case VettingEntityType.INDIVIDUAL:
        return '👤';
      case VettingEntityType.COMPANY:
        return '🏢';
      case VettingEntityType.STAFF_MEDICAL:
        return '⚕️';
      default:
        return '📄';
    }
  };

  return (
    <>
      <div className={`space-y-4 ${className}`}>
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neumorphic-text-secondary" />
            <Input
              placeholder="Search by name, consent ID, or case number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <NeumorphicSelect
              options={[
                { value: 'All', label: 'All Statuses' },
                { value: ConsentRequestStatus.PENDING_SENT, label: 'Sent' },
                { value: ConsentRequestStatus.LINK_OPENED, label: 'Opened' },
                { value: ConsentRequestStatus.FORM_VIEWED, label: 'Viewed' },
                { value: ConsentRequestStatus.SUBMITTED_AWAITING_VERIFICATION, label: 'Awaiting Verification' },
                { value: ConsentRequestStatus.VERIFIED_APPROVED, label: 'Approved' },
                { value: ConsentRequestStatus.EXPIRED, label: 'Expired' },
                { value: ConsentRequestStatus.DECLINED_BY_SUBJECT, label: 'Declined' }
              ]}
              value={statusFilter}
              onChange={(value) => setStatusFilter(value as ConsentRequestStatus | 'All')}
              placeholder="Filter by status"
              className="w-48"
              size="sm"
            />

            <NeumorphicSelect
              options={[
                { value: 'All', label: 'All Channels' },
                { value: ConsentChannel.EMAIL_LINK, label: 'Email' },
                { value: ConsentChannel.SMS_LINK, label: 'SMS' },
                { value: ConsentChannel.MANUAL_UPLOAD, label: 'Manual' }
              ]}
              value={channelFilter}
              onChange={(value) => setChannelFilter(value as ConsentChannel | 'All')}
              placeholder="Filter by channel"
              className="w-40"
              size="sm"
            />

            <Button variant="outline" size="icon">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <NeumorphicText variant="secondary" className="text-sm">
            Showing {filteredRequests.length} of {requests.length} consent requests
          </NeumorphicText>
        </div>

        {/* Table */}
        <div className="space-y-3">
          {filteredRequests.map((request) => (
            <NeumorphicCard key={request.consentId} className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left Column - Request Details */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getEntityTypeIcon(request.entityType)}</span>
                        <NeumorphicText className="font-medium">
                          {request.subjectName}
                        </NeumorphicText>
                      </div>
                      <div className="text-xs text-neumorphic-text-secondary space-y-1">
                        <div>ID: {request.consentId}</div>
                        <div>Case: {request.vettingCaseId}</div>
                        <div>Subject ID: {request.subjectId}</div>
                      </div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-neumorphic-text-secondary">
                    <div className="flex items-center gap-1">
                      {getChannelIcon(request.channel)}
                      <span>{request.channel.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(request.requestSentDate)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onViewRequest?.(request.consentId)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    
                    {request.digitalSignatureImageLink && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewSignature(request)}
                      >
                        <FileSignature className="w-3 h-3 mr-1" />
                        Signature
                      </Button>
                    )}

                    {/* Resend Popover */}
                    {(request.status === ConsentRequestStatus.PENDING_SENT ||
                      request.status === ConsentRequestStatus.EXPIRED ||
                      request.status === ConsentRequestStatus.ERROR_SENDING) && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Send className="w-3 h-3 mr-1" />
                            Resend
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent 
                          className="w-56 bg-neumorphic-card border-neumorphic-border z-[9999]"
                          style={{
                            backgroundColor: 'var(--neumorphic-card)',
                            border: '1px solid var(--neumorphic-border)',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
                          }}
                        >
                          <div className="space-y-2">
                            <NeumorphicText className="font-medium text-sm">Resend via:</NeumorphicText>
                            <div className="space-y-1">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full justify-start"
                                onClick={() => handleResendConsent(request, ConsentChannel.EMAIL_LINK)}
                              >
                                <Mail className="w-3 h-3 mr-2" />
                                Email
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full justify-start"
                                onClick={() => handleResendConsent(request, ConsentChannel.SMS_LINK)}
                              >
                                <MessageCircle className="w-3 h-3 mr-2" />
                                SMS
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </div>

                {/* Middle Column - Consent Journey Stepper */}
                <div className="lg:col-span-1">
                  <ConsentJourneyStepper request={request} />
                </div>

                {/* Right Column - Additional Info */}
                <div className="space-y-3">
                  <div className="text-xs space-y-2">
                    <div className="font-medium text-neumorphic-text-primary">Checks Required:</div>
                    <div className="space-y-1">
                      {request.checksRequiringConsent?.map((check, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {check.checkName}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {request.expiryDate && (
                    <div className="text-xs">
                      <span className="text-neumorphic-text-secondary">Expires: </span>
                      <span className={
                        new Date(request.expiryDate) < new Date() 
                          ? 'text-red-400 font-medium' 
                          : 'text-neumorphic-text-primary'
                      }>
                        {formatDate(request.expiryDate)}
                      </span>
                    </div>
                  )}

                  {request.verificationNotes && (
                    <div className="p-2 bg-amber-400/10 border border-amber-400/20 rounded text-xs">
                      <div className="font-medium text-amber-400 mb-1">Notes:</div>
                      <div className="text-neumorphic-text-secondary">
                        {request.verificationNotes}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </NeumorphicCard>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <NeumorphicCard className="p-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <MessageSquare className="w-12 h-12 text-neumorphic-text-secondary opacity-50" />
              <NeumorphicText variant="secondary">
                No consent requests found matching your criteria
              </NeumorphicText>
            </div>
          </NeumorphicCard>
        )}
      </div>

      {/* Signature Analysis Modal */}
      {selectedRequest && (
        <SignatureAnalysisModal
          open={showSignatureModal}
          onOpenChange={setShowSignatureModal}
          request={selectedRequest}
        />
      )}
    </>
  );
};