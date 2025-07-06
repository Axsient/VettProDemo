'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Eye, 
  FileText, 
  CheckCircle, 
  Clock,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { ConsentRequestItem, ConsentRequestStatus } from '@/types/consent';
import { Badge } from '@/components/ui/badge';

interface ConsentJourneyStepperProps {
  request: ConsentRequestItem;
  className?: string;
}

interface JourneyStep {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'completed' | 'current' | 'pending' | 'failed';
  timestamp?: string;
  description?: string;
}

export const ConsentJourneyStepper: React.FC<ConsentJourneyStepperProps> = ({
  request,
  className = ''
}) => {
  
  // Generate journey steps based on request status and timestamps
  const generateJourneySteps = (): JourneyStep[] => {
    const steps: JourneyStep[] = [
      {
        id: 'sent',
        label: 'Sent',
        icon: Send,
        status: request.requestSentDate ? 'completed' : 'pending',
        timestamp: request.requestSentDate,
        description: `Via ${request.channel.replace('_', ' ')}`
      },
      {
        id: 'opened',
        label: 'Opened',
        icon: Eye,
        status: request.linkOpenedDate ? 'completed' : 
                request.requestSentDate ? 'pending' : 'pending',
        timestamp: request.linkOpenedDate,
        description: 'Link clicked'
      },
      {
        id: 'viewed',
        label: 'Viewed',
        icon: FileText,
        status: request.formViewedDate ? 'completed' :
                request.linkOpenedDate ? 'pending' : 'pending',
        timestamp: request.formViewedDate,
        description: 'Form accessed'
      },
      {
        id: 'submitted',
        label: 'Submitted',
        icon: CheckCircle,
        status: request.submittedDate ? 'completed' :
                request.formViewedDate ? 'pending' : 'pending',
        timestamp: request.submittedDate,
        description: 'Consent provided'
      }
    ];

    // Handle special status cases
    if (request.status === ConsentRequestStatus.EXPIRED) {
      const lastActiveStep = steps.findIndex(s => s.status === 'pending');
      if (lastActiveStep > 0) {
        steps[lastActiveStep].status = 'failed';
        steps[lastActiveStep].description = 'Expired';
      }
    }

    if (request.status === ConsentRequestStatus.DECLINED_BY_SUBJECT) {
      const viewedStepIndex = steps.findIndex(s => s.id === 'viewed');
      if (viewedStepIndex >= 0 && request.formViewedDate) {
        steps[viewedStepIndex + 1] = {
          id: 'declined',
          label: 'Declined',
          icon: XCircle,
          status: 'failed',
          timestamp: request.lastUpdated,
          description: 'Subject declined'
        };
      }
    }

    if (request.status === ConsentRequestStatus.ERROR_SENDING) {
      steps[0].status = 'failed';
      steps[0].description = 'Send failed';
    }

    return steps;
  };

  const steps = generateJourneySteps();

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'current': return 'text-blue-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStepBgColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-400/20 border-green-400/40';
      case 'current': return 'bg-blue-400/20 border-blue-400/40';
      case 'failed': return 'bg-red-400/20 border-red-400/40';
      default: return 'bg-gray-400/20 border-gray-400/20';
    }
  };

  const getConnectorColor = (prevStatus: string, currentStatus: string) => {
    if (prevStatus === 'completed') {
      return currentStatus === 'completed' ? 'bg-green-400' : 'bg-gray-300';
    }
    return 'bg-gray-300';
  };

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-ZA', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getStatusBadge = () => {
    switch (request.status) {
      case ConsentRequestStatus.VERIFIED_APPROVED:
        return <Badge className="bg-green-400/20 text-green-400 border-green-400/40">Verified</Badge>;
      case ConsentRequestStatus.SUBMITTED_AWAITING_VERIFICATION:
        return <Badge className="bg-blue-400/20 text-blue-400 border-blue-400/40">Awaiting Verification</Badge>;
      case ConsentRequestStatus.EXPIRED:
        return <Badge className="bg-red-400/20 text-red-400 border-red-400/40">Expired</Badge>;
      case ConsentRequestStatus.DECLINED_BY_SUBJECT:
        return <Badge className="bg-red-400/20 text-red-400 border-red-400/40">Declined</Badge>;
      case ConsentRequestStatus.ERROR_SENDING:
        return <Badge className="bg-red-400/20 text-red-400 border-red-400/40">Send Failed</Badge>;
      default:
        return <Badge className="bg-amber-400/20 text-amber-400 border-amber-400/40">In Progress</Badge>;
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header with status */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium text-neumorphic-text-secondary">
          Consent Journey
        </div>
        {getStatusBadge()}
      </div>

      {/* Steps */}
      <div className="relative">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isLast = index === steps.length - 1;
            const prevStep = index > 0 ? steps[index - 1] : null;
            
            return (
              <div key={step.id} className="flex items-center">
                {/* Step Circle */}
                <div className="relative">
                  <motion.div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${getStepBgColor(step.status)}`}
                    animate={{
                      scale: step.status === 'current' ? [1, 1.1, 1] : 1,
                      opacity: step.status === 'pending' ? 0.6 : 1
                    }}
                    transition={{
                      scale: {
                        duration: 2,
                        repeat: step.status === 'current' ? Infinity : 0
                      }
                    }}
                  >
                    <IconComponent className={`w-4 h-4 ${getStepColor(step.status)}`} />
                  </motion.div>
                  
                  {/* Pulse animation for active steps */}
                  {step.status === 'current' && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-blue-400"
                      animate={{
                        scale: [1, 1.5],
                        opacity: [0.5, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity
                      }}
                    />
                  )}
                </div>

                {/* Connector Line */}
                {!isLast && (
                  <div className="relative">
                    <div className="w-12 h-0.5 bg-gray-300 mx-2" />
                    {prevStep && (
                      <motion.div
                        className={`absolute top-0 left-2 h-0.5 ${getConnectorColor(prevStep.status, step.status)}`}
                        initial={{ width: 0 }}
                        animate={{ 
                          width: prevStep.status === 'completed' ? '48px' : 0 
                        }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Step Labels */}
        <div className="flex items-start justify-between mt-2">
          {steps.map((step) => (
            <div key={`label-${step.id}`} className="flex flex-col items-center text-center min-w-0">
              <div className={`text-xs font-medium ${getStepColor(step.status)}`}>
                {step.label}
              </div>
              {step.timestamp && (
                <div className="text-xs text-neumorphic-text-secondary mt-0.5">
                  {formatTime(step.timestamp)}
                </div>
              )}
              {step.description && (
                <div className="text-xs text-neumorphic-text-secondary mt-0.5 opacity-75">
                  {step.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-neumorphic-text-secondary mb-1">
          <span>Progress</span>
          <span>{Math.round((steps.filter(s => s.status === 'completed').length / steps.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-1.5">
          <motion.div
            className="bg-blue-400 h-1.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ 
              width: `${(steps.filter(s => s.status === 'completed').length / steps.length) * 100}%` 
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Additional Info */}
      {(request.status === ConsentRequestStatus.VERIFIED_REJECTED_SIGNATURE_MISMATCH ||
        request.status === ConsentRequestStatus.VERIFIED_REJECTED_OTHER) && (
        <div className="mt-3 p-2 bg-red-400/10 border border-red-400/20 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-red-400">
              <div className="font-medium mb-1">Verification Failed</div>
              <div className="opacity-90">
                {request.verificationNotes || 'Verification failed. Manual review required.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {request.status === ConsentRequestStatus.EXPIRED && (
        <div className="mt-3 p-2 bg-amber-400/10 border border-amber-400/20 rounded-lg">
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-amber-400">
              <div className="font-medium mb-1">Consent Expired</div>
              <div className="opacity-90">
                Request expired on {new Date(request.expiryDate || '').toLocaleDateString('en-ZA')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};