/**
 * Provider Intelligence Demo Page
 * 
 * Demonstrates Phase 1 implementation of the Provider Intelligence system
 * including hover cards with performance metrics and AI smart suggestions.
 */

import { Metadata } from 'next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProviderIntelligenceDemo from '@/components/vetting/ProviderIntelligenceDemo';

export const metadata: Metadata = {
  title: 'Provider Intelligence Demo | Axsient Vetting Platform',
  description: 'AI-powered provider insights and smart check suggestions for informed vetting decisions',
};

export default function ProviderIntelligencePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neumorphic-text-primary">
              Provider Intelligence Demo
            </h1>
            <p className="text-neumorphic-text-secondary mt-1">
              Experience AI-powered provider insights and smart vetting suggestions
            </p>
          </div>
        </div>

        <ProviderIntelligenceDemo />
      </div>
    </DashboardLayout>
  );
}