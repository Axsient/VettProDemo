'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { 
  Brain, 
  Command, 
  Shield, 
  Library,
  ArrowRight,
  Zap,
  Users,
  Globe,
  Target,
  MessageSquare,
  Database,
  TrendingUp
} from 'lucide-react';
import { 
  NeumorphicBackground,
  NeumorphicCard,
  NeumorphicText,
  NeumorphicHeading,
} from '@/components/ui/neumorphic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function VettingOperationsV2() {
  const router = useRouter();

  const features = [
    {
      id: 'smart-canvas',
      title: 'Smart Vetting Canvas',
      description: 'AI-powered intelligent vetting workflow with real-time risk assessment and automated recommendations',
      icon: Brain,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      highlights: [
        'AI Workflow Engine',
        'Real-time Risk Assessment',
        'Collaborative Workspace',
        'Smart Insights Panel'
      ],
      href: '/vetting-v2/smart-canvas'
    },
    {
      id: 'live-mission-board',
      title: 'Live Mission Board',
      description: 'Real-time mission control center for field operations and vetting activities',
      icon: Command,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      highlights: [
        'Real-time Mission Tracking',
        'Agent Location Monitoring',
        'Performance Dashboard',
        'Emergency Protocols'  
      ],
      href: '/vetting-v2/live-mission-board'
    },
    {
      id: 'consent-hub',
      title: 'Consent Communications Hub',
      description: 'Comprehensive consent management system with automated communication workflows and compliance tracking',
      icon: Shield,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      highlights: [
        'POPIA/GDPR Compliance',
        'Automated Communications',
        'Multi-channel Messaging',
        'Audit Trail Management'
      ],
      href: '/vetting-v2/consent-hub'
    },
    {
      id: 'intelligence-library',
      title: 'Intelligence Library',
      description: 'Centralized intelligence repository with advanced search capabilities and automated data aggregation',
      icon: Library,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-400/10',
      highlights: [
        'Advanced Search Engine',
        'Multi-source Integration',
        'Confidence Scoring',
        'Real-time Updates'
      ],
      href: '/vetting-v2/intelligence-library'
    }
  ];

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  return (
    <NeumorphicBackground className="min-h-screen">
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <Breadcrumb variant="neumorphic">
          <BreadcrumbList variant="neumorphic">
            <BreadcrumbItem>
              <BreadcrumbLink variant="neumorphic" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator variant="neumorphic" />
            <BreadcrumbItem>
              <BreadcrumbPage variant="neumorphic">Vetting Operations Command Center v2</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header Section */}
        <NeumorphicCard>
          <div className="text-center max-w-4xl mx-auto">
            <NeumorphicHeading className="text-4xl mb-4">
              Vetting Operations Command Center v2
            </NeumorphicHeading>
            <NeumorphicText variant="secondary" className="text-lg leading-relaxed mb-6">
              Next-generation vetting operations platform combining artificial intelligence, 
              real-time field coordination, comprehensive consent management, and advanced intelligence gathering 
              into a unified command center for maximum operational efficiency.
            </NeumorphicText>
            
            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="text-center">
                <NeumorphicText className="text-2xl font-bold text-blue-400">94.2%</NeumorphicText>
                <NeumorphicText variant="secondary" size="sm">AI Accuracy</NeumorphicText>
              </div>
              <div className="text-center">
                <NeumorphicText className="text-2xl font-bold text-green-400">24/7</NeumorphicText>
                <NeumorphicText variant="secondary" size="sm">Live Operations</NeumorphicText>
              </div>
              <div className="text-center">
                <NeumorphicText className="text-2xl font-bold text-purple-400">100%</NeumorphicText>
                <NeumorphicText variant="secondary" size="sm">POPIA Compliant</NeumorphicText>
              </div>
              <div className="text-center">
                <NeumorphicText className="text-2xl font-bold text-indigo-400">28</NeumorphicText>
                <NeumorphicText variant="secondary" size="sm">Data Sources</NeumorphicText>
              </div>
            </div>
          </div>
        </NeumorphicCard>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <NeumorphicCard key={feature.id} className="group hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-lg ${feature.bgColor}`}>
                    <IconComponent className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <div className="flex-1">
                    <NeumorphicText size="lg" className="font-semibold mb-2 group-hover:text-neumorphic-accent transition-colors">
                      {feature.title}
                    </NeumorphicText>
                    <NeumorphicText variant="secondary" className="leading-relaxed">
                      {feature.description}
                    </NeumorphicText>
                  </div>
                </div>

                {/* Feature Highlights */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {feature.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${feature.color.replace('text-', 'bg-')}`} />
                      <NeumorphicText size="sm" variant="secondary">
                        {highlight}
                      </NeumorphicText>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <Button 
                  variant="neumorphic" 
                  className="w-full gap-2 group-hover:shadow-md transition-all"
                  onClick={() => handleNavigate(feature.href)}
                >
                  Launch {feature.title}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </NeumorphicCard>
            );
          })}
        </div>

        {/* System Architecture Overview */}
        <NeumorphicCard>
          <NeumorphicText size="lg" className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            System Architecture & Integration
          </NeumorphicText>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <NeumorphicText className="font-medium flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                AI & Automation
              </NeumorphicText>
              <div className="space-y-2 text-sm text-neumorphic-text-secondary">
                <div>• Machine Learning Risk Models</div>
                <div>• Automated Workflow Routing</div>
                <div>• Predictive Analytics Engine</div>
                <div>• Natural Language Processing</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <NeumorphicText className="font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-green-400" />
                Field Integration
              </NeumorphicText>
              <div className="space-y-2 text-sm text-neumorphic-text-secondary">
                <div>• Real-time GPS Tracking</div>
                <div>• Mobile Agent Applications</div>
                <div>• Secure Communication Channels</div>
                <div>• Emergency Response Protocols</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <NeumorphicText className="font-medium flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-400" />
                Data Ecosystem
              </NeumorphicText>
              <div className="space-y-2 text-sm text-neumorphic-text-secondary">
                <div>• Multi-source Data Aggregation</div>
                <div>• Real-time Synchronization</div>
                <div>• Advanced Search Algorithms</div>
                <div>• Comprehensive Audit Trails</div>
              </div>
            </div>
          </div>
        </NeumorphicCard>

        {/* Quick Access Actions */}
        <NeumorphicCard>
          <NeumorphicText size="lg" className="font-semibold mb-4">
            Quick Access
          </NeumorphicText>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="neumorphic-outline" className="h-16 flex-col gap-2">
              <Target className="w-5 h-5" />
              <span className="text-sm">Active Cases</span>
            </Button>
            <Button variant="neumorphic-outline" className="h-16 flex-col gap-2">
              <MessageSquare className="w-5 h-5" />
              <span className="text-sm">Communications</span>
            </Button>
            <Button variant="neumorphic-outline" className="h-16 flex-col gap-2">
              <Database className="w-5 h-5" />
              <span className="text-sm">Intelligence Search</span>
            </Button>
            <Button variant="neumorphic-outline" className="h-16 flex-col gap-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">Analytics</span>
            </Button>
          </div>
        </NeumorphicCard>

        {/* Implementation Status */}
        <NeumorphicCard>
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <NeumorphicText size="sm" className="font-medium mb-1">
                Vetting Operations Command Center v2 - Development Status
              </NeumorphicText>
              <NeumorphicText variant="secondary" size="sm">
                This advanced vetting operations platform represents the next evolution of VettPro&apos;s capabilities. 
                Each component is designed with scalability, security, and user experience as core principles. 
                The unified interface provides seamless integration between AI-powered automation, real-time field operations, 
                comprehensive consent management, and intelligent data aggregation for maximum operational efficiency.
              </NeumorphicText>
            </div>
          </div>
        </NeumorphicCard>
      </div>
    </NeumorphicBackground>
  );
}