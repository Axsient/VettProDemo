'use client';

import React, { useState, useEffect } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { NeumorphicCard, NeumorphicText } from '@/components/ui/neumorphic';
import { ConsentRequestItem } from '@/types/consent';
import {
  FileSignature,
  Zap,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  Brain,
  TrendingUp,
  Clock,
  Shield
} from 'lucide-react';
import CountUp from 'react-countup';

interface SignatureAnalysisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: ConsentRequestItem;
}

interface FeaturePoint {
  id: string;
  x: number;
  y: number;
  type: 'match' | 'mismatch' | 'unclear';
  label: string;
}

export const SignatureAnalysisModal: React.FC<SignatureAnalysisModalProps> = ({
  open,
  onOpenChange,
  request
}) => {
  const [analysisStage, setAnalysisStage] = useState<'initial' | 'analyzing' | 'complete'>('initial');
  const [currentScore, setCurrentScore] = useState(0);
  const [showFeaturePoints, setShowFeaturePoints] = useState(false);
  const controls = useAnimationControls();

  // Mock feature points for demonstration
  const submittedFeatures: FeaturePoint[] = [
    { id: 'p1', x: 120, y: 80, type: 'match', label: 'Initial stroke' },
    { id: 'p2', x: 180, y: 60, type: 'match', label: 'Loop formation' },
    { id: 'p3', x: 240, y: 90, type: 'mismatch', label: 'Pressure variation' },
    { id: 'p4', x: 300, y: 70, type: 'match', label: 'End flourish' },
  ];

  const referenceFeatures: FeaturePoint[] = [
    { id: 'r1', x: 125, y: 85, type: 'match', label: 'Initial stroke' },
    { id: 'r2', x: 185, y: 65, type: 'match', label: 'Loop formation' },
    { id: 'r3', x: 245, y: 75, type: 'mismatch', label: 'Pressure variation' },
    { id: 'r4', x: 305, y: 72, type: 'match', label: 'End flourish' },
  ];

  const finalScore = request.aiVerificationScore || 85;

  useEffect(() => {
    if (open) {
      setAnalysisStage('initial');
      setCurrentScore(0);
      setShowFeaturePoints(false);
      
      // Start analysis animation after modal opens
      const timer = setTimeout(() => {
        runAnalysisAnimation();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [open]);

  const runAnalysisAnimation = async () => {
    setAnalysisStage('analyzing');

    // Stage 1: Show feature points with delay
    setTimeout(() => {
      setShowFeaturePoints(true);
    }, 800);

    // Stage 2: Animate connecting lines
    setTimeout(async () => {
      await controls.start({
        pathLength: 1,
        opacity: 1,
        transition: { duration: 2, ease: "easeInOut" }
      });
    }, 1500);

    // Stage 3: Count up score
    setTimeout(() => {
      setCurrentScore(finalScore);
    }, 2000);

    // Stage 4: Complete analysis
    setTimeout(() => {
      setAnalysisStage('complete');
    }, 3500);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-blue-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-400/20 border-green-400/40';
    if (score >= 75) return 'bg-blue-400/20 border-blue-400/40';
    if (score >= 60) return 'bg-amber-400/20 border-amber-400/40';
    return 'bg-red-400/20 border-red-400/40';
  };

  const getVerificationStatus = () => {
    if (finalScore >= 90) return { icon: CheckCircle, text: 'Verified', color: 'text-green-400' };
    if (finalScore >= 75) return { icon: Shield, text: 'Likely Match', color: 'text-blue-400' };
    if (finalScore >= 60) return { icon: AlertTriangle, text: 'Manual Review', color: 'text-amber-400' };
    return { icon: XCircle, text: 'Flagged', color: 'text-red-400' };
  };

  const status = getVerificationStatus();
  const StatusIcon = status.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-6xl max-h-[90vh] overflow-hidden"
        style={{
          backgroundColor: 'var(--neumorphic-card)',
          border: '1px solid var(--neumorphic-border)',
          zIndex: 9999
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-neumorphic-text-primary">
            <FileSignature className="w-6 h-6 text-blue-400" />
            AI Signature Verification
          </DialogTitle>
          <DialogDescription className="text-neumorphic-text-secondary">
            Advanced biometric analysis comparing submitted signature with reference
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Analysis Progress Bar */}
          {analysisStage === 'analyzing' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neumorphic-text-secondary">AI Analysis Progress</span>
                <span className="text-blue-400">Processing...</span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-2">
                <motion.div
                  className="bg-blue-400 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                />
              </div>
            </div>
          )}

          {/* Signature Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Submitted Signature */}
            <NeumorphicCard className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <NeumorphicText className="font-medium">Submitted Signature</NeumorphicText>
                  <Badge variant="outline" className="text-xs">
                    {new Date(request.submittedDate || '').toLocaleDateString('en-ZA')}
                  </Badge>
                </div>
                
                <div className="relative bg-white rounded-lg p-4 min-h-[200px] border">
                  {/* Mock signature display */}
                  <div className="absolute inset-4">
                    <svg width="100%" height="100%" viewBox="0 0 400 150">
                      {/* Mock signature path */}
                      <path
                        d="M 50 100 Q 80 60 120 80 Q 160 100 200 70 Q 240 40 280 60 Q 320 80 350 70"
                        stroke="#2563eb"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                      />
                      
                      {/* Feature points */}
                      {showFeaturePoints && submittedFeatures.map((point, index) => (
                        <motion.circle
                          key={point.id}
                          cx={point.x}
                          cy={point.y}
                          r="4"
                          fill={point.type === 'match' ? '#10b981' : point.type === 'mismatch' ? '#ef4444' : '#f59e0b'}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: index * 0.2, duration: 0.3 }}
                        />
                      ))}
                    </svg>
                  </div>
                </div>
              </div>
            </NeumorphicCard>

            {/* Reference Signature */}
            <NeumorphicCard className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <NeumorphicText className="font-medium">Reference Signature</NeumorphicText>
                  <Badge variant="outline" className="text-xs">ID Document</Badge>
                </div>
                
                <div className="relative bg-white rounded-lg p-4 min-h-[200px] border">
                  <div className="absolute inset-4">
                    <svg width="100%" height="100%" viewBox="0 0 400 150">
                      {/* Mock reference signature path */}
                      <path
                        d="M 55 105 Q 85 65 125 85 Q 165 105 205 75 Q 245 35 285 65 Q 325 85 355 75"
                        stroke="#6b7280"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                      />
                      
                      {/* Reference feature points */}
                      {showFeaturePoints && referenceFeatures.map((point, index) => (
                        <motion.circle
                          key={point.id}
                          cx={point.x}
                          cy={point.y}
                          r="4"
                          fill={point.type === 'match' ? '#10b981' : point.type === 'mismatch' ? '#ef4444' : '#f59e0b'}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: index * 0.2, duration: 0.3 }}
                        />
                      ))}
                      
                      {/* Connecting lines */}
                      {showFeaturePoints && submittedFeatures.map((point, index) => {
                        const refPoint = referenceFeatures[index];
                        if (!refPoint) return null;
                        
                        return (
                          <motion.line
                            key={`line-${point.id}`}
                            x1={point.x}
                            y1={point.y}
                            x2={refPoint.x}
                            y2={refPoint.y}
                            stroke={point.type === 'match' ? '#10b981' : '#ef4444'}
                            strokeWidth="2"
                            strokeDasharray="5,5"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={controls}
                          />
                        );
                      })}
                    </svg>
                  </div>
                </div>
              </div>
            </NeumorphicCard>
          </div>

          {/* Analysis Results */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Confidence Score */}
            <NeumorphicCard className="p-4">
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <Brain className="w-5 h-5 text-blue-400" />
                  <NeumorphicText className="font-medium">Match Confidence</NeumorphicText>
                </div>
                
                <div className={`text-4xl font-bold ${getScoreColor(currentScore)}`}>
                  {analysisStage === 'analyzing' || analysisStage === 'complete' ? (
                    <CountUp
                      end={currentScore}
                      duration={1.5}
                      suffix="%"
                      preserveValue
                    />
                  ) : (
                    '0%'
                  )}
                </div>
                
                {analysisStage === 'complete' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Badge className={getScoreBgColor(finalScore)}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {status.text}
                    </Badge>
                  </motion.div>
                )}
              </div>
            </NeumorphicCard>

            {/* Feature Analysis */}
            <NeumorphicCard className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <NeumorphicText className="font-medium">Feature Analysis</NeumorphicText>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neumorphic-text-secondary">Stroke Patterns:</span>
                    <span className="text-green-400 font-medium">95% match</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neumorphic-text-secondary">Pressure Points:</span>
                    <span className="text-amber-400 font-medium">78% match</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neumorphic-text-secondary">Speed Variation:</span>
                    <span className="text-green-400 font-medium">91% match</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neumorphic-text-secondary">Pen Lifts:</span>
                    <span className="text-green-400 font-medium">88% match</span>
                  </div>
                </div>
              </div>
            </NeumorphicCard>

            {/* Processing Info */}
            <NeumorphicCard className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <NeumorphicText className="font-medium">Processing Details</NeumorphicText>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neumorphic-text-secondary">Analysis Time:</span>
                    <span className="text-neumorphic-text-primary">2.3 seconds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neumorphic-text-secondary">Feature Points:</span>
                    <span className="text-neumorphic-text-primary">127 detected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neumorphic-text-secondary">AI Model:</span>
                    <span className="text-neumorphic-text-primary">SigNet v3.2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neumorphic-text-secondary">Confidence Level:</span>
                    <span className="text-green-400 font-medium">High</span>
                  </div>
                </div>
              </div>
            </NeumorphicCard>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-neumorphic-border">
            <div className="flex items-center gap-2 text-sm text-neumorphic-text-secondary">
              <Clock className="w-4 h-4" />
              <span>Analysis completed at {new Date().toLocaleTimeString('en-ZA')}</span>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              {finalScore < 75 && (
                <Button variant="default" className="bg-blue-500 hover:bg-blue-600">
                  <Eye className="w-4 h-4 mr-2" />
                  Manual Review
                </Button>
              )}
              {finalScore >= 75 && (
                <Button variant="default" className="bg-green-500 hover:bg-green-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};