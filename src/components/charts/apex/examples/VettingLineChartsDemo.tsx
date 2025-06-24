"use client";

import React from 'react';
import {
  TrendAnalysisChart,
  PerformanceMonitoringChart,
  DualAxisSupplierChart,
} from '../components';
import { TestChart } from '../components/TestChart';

/**
 * VettingLineChartsDemo - Comprehensive demonstration of all vetting line chart components
 * 
 * **Purpose:**
 * - Showcase all implemented line chart components
 * - Validate charts work correctly in dashboard environment
 * - Demonstrate real vetting use cases with sample data
 * - Provide examples for developers
 * 
 * **Usage:**
 * - Add to dashboard page for validation
 * - Use as reference for implementing charts in other parts of the app
 * - Test theme switching and responsive behavior
 */

class ChartErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean; error?: Error}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Chart Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-500 rounded-lg bg-red-50">
          <h3 className="text-red-800 font-semibold">Chart Error</h3>
          <p className="text-red-600 text-sm">
            {this.state.error?.message || 'An error occurred while rendering the chart'}
          </p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export const VettingLineChartsDemo: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-neumorphic-text-primary mb-2">
          Vetting Line Charts Demo
        </h1>
        <p className="text-neumorphic-text-secondary">
          Comprehensive showcase of specialized line charts for South African vetting operations
        </p>
      </div>

      {/* Test Chart Section */}
      <section className="space-y-6">
        <div className="border-l-4 border-red-500 pl-4">
          <h2 className="text-2xl font-semibold text-neumorphic-text-primary mb-2">
            Test Chart (Debug)
          </h2>
          <p className="text-neumorphic-text-secondary">
            Simple test chart to verify ApexCharts integration
          </p>
        </div>
        
        <div className="bg-neumorphic-bg rounded-neumorphic-radius shadow-neumorphic-convex p-6">
          <ChartErrorBoundary>
            <TestChart />
          </ChartErrorBoundary>
        </div>
      </section>

      {/* Single-Axis Line Charts Section */}
      <section className="space-y-6">
        <div className="border-l-4 border-neumorphic-accent pl-4">
          <h2 className="text-2xl font-semibold text-neumorphic-text-primary mb-2">
            Single-Axis Line Charts
          </h2>
          <p className="text-neumorphic-text-secondary">
            Charts tracking single metrics over time for trend analysis
          </p>
        </div>

        {/* Trend Analysis Chart */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-neumorphic-bg rounded-neumorphic-radius shadow-neumorphic-convex p-6">
            <ChartErrorBoundary>
              <TrendAnalysisChart />
            </ChartErrorBoundary>
            <div className="mt-4 text-sm text-neumorphic-text-secondary">
              <p><strong>Use Case:</strong> Track supplier risk score improvements over time to measure vetting program effectiveness.</p>
            </div>
          </div>

          <div className="bg-neumorphic-bg rounded-neumorphic-radius shadow-neumorphic-convex p-6">
            <ChartErrorBoundary>
              <PerformanceMonitoringChart />
            </ChartErrorBoundary>
            <div className="mt-4 text-sm text-neumorphic-text-secondary">
              <p><strong>Use Case:</strong> Monitor daily verification processing capacity and identify operational bottlenecks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Axis Line Charts Section */}
      <section className="space-y-6">
        <div className="border-l-4 border-neumorphic-accent pl-4">
          <h2 className="text-2xl font-semibold text-neumorphic-text-primary mb-2">
            Multi-Axis Line Charts
          </h2>
          <p className="text-neumorphic-text-secondary">
            Charts comparing multiple metrics with different scales for correlation analysis
          </p>
        </div>

        {/* Dual Axis Charts */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-neumorphic-bg rounded-neumorphic-radius shadow-neumorphic-convex p-6">
            <ChartErrorBoundary>
              <DualAxisSupplierChart />
            </ChartErrorBoundary>
            <div className="mt-4 text-sm text-neumorphic-text-secondary">
              <p><strong>Use Case:</strong> Analyze relationship between vetting volume and quality to optimize resource allocation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features and Notes Section */}
      <section className="bg-neumorphic-bg rounded-neumorphic-radius shadow-neumorphic-inset p-6">
        <h3 className="text-xl font-semibold text-neumorphic-text-primary mb-4">
          Chart Features & Implementation Notes
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-neumorphic-text-primary mb-2">✨ Features Implemented:</h4>
            <ul className="space-y-1 text-sm text-neumorphic-text-secondary">
              <li>• Neumorphic theme integration with CSS bridge</li>
              <li>• South African number formatting (R for ZAR)</li>
              <li>• Responsive design for mobile/tablet/desktop</li>
              <li>• Interactive tooltips with context-aware formatting</li>
              <li>• Zoom and pan capabilities for detailed analysis</li>
              <li>• Custom color schemes per chart type</li>
              <li>• Weekend pattern recognition (for daily data)</li>
              <li>• Target threshold annotations</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-neumorphic-text-primary mb-2">🔄 Data Architecture:</h4>
            <ul className="space-y-1 text-sm text-neumorphic-text-secondary">
              <li>• Currently using structured sample data</li>
              <li>• Sample data mirrors expected API response format</li>
              <li>• Easy migration to real API calls when backend ready</li>
              <li>• TypeScript interfaces ensure data consistency</li>
              <li>• Realistic vetting scenarios for testing</li>
              <li>• South African business context (provinces, ZAR, etc.)</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-neumorphic-accent/10 rounded-neumorphic-radius border border-neumorphic-accent/20">
          <p className="text-sm text-neumorphic-text-secondary">
            <strong>Next Steps:</strong> Add these charts to your dashboard pages by importing the specific components 
            and replacing <code>useSampleData={`{true}`}</code> with real data fetching when APIs are available.
          </p>
        </div>
      </section>
    </div>
  );
}; 