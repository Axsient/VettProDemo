"use client";

import React from 'react';
import { 
  RiskCategoriesChart,
  VerificationTypesChart,
  ComplianceStatusChart,
  StackedRiskChart,
  PrePostVettingChart,
} from '../components';

// Error boundary for individual charts
class ChartErrorBoundary extends React.Component<
  { children: React.ReactNode; chartName: string },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; chartName: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Error in ${this.props.chartName}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-500 rounded-lg bg-red-50 dark:bg-red-900/20">
          <h3 className="text-red-800 dark:text-red-200 font-semibold">
            {this.props.chartName} Error
          </h3>
          <p className="text-red-600 dark:text-red-300 text-sm mt-2">
            {this.state.error?.message || 'An error occurred while rendering this chart'}
          </p>
          <button 
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700 
                       text-red-800 dark:text-red-200 rounded text-sm transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

export const VettingBarChartsDemo: React.FC = () => {
  return (
    <div className="space-y-8 p-6 bg-neumorphic-bg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-neumorphic-text-primary mb-2">
          Vetting Bar Charts Dashboard
        </h1>
        <p className="text-neumorphic-text-secondary max-w-2xl mx-auto">
          Comprehensive bar chart visualizations for South African supplier and staff vetting operations.
          These charts demonstrate various bar chart types including vertical, horizontal, grouped, and stacked variations.
        </p>
      </div>

      {/* Risk Categories Distribution - Vertical Bar */}
      <div className="bg-neumorphic-card rounded-lg p-6 shadow-neumorphic">
        <ChartErrorBoundary chartName="Risk Categories Chart">
          <RiskCategoriesChart
            useSampleData={true}
            height={400}
            className="w-full"
          />
        </ChartErrorBoundary>
        <div className="mt-4 text-sm text-neumorphic-text-secondary">
          <p><strong>Chart Type:</strong> Vertical Bar Chart (Basic)</p>
          <p><strong>Use Case:</strong> Distribution analysis of suppliers across risk categories</p>
          <p><strong>Features:</strong> Color-coded risk levels, threshold annotations, percentage tooltips</p>
        </div>
      </div>

      {/* Verification Types Distribution - Horizontal Bar */}
      <div className="bg-neumorphic-card rounded-lg p-6 shadow-neumorphic">
        <ChartErrorBoundary chartName="Verification Types Chart">
          <VerificationTypesChart
            useSampleData={true}
            height={500}
            className="w-full"
          />
        </ChartErrorBoundary>
        <div className="mt-4 text-sm text-neumorphic-text-secondary">
          <p><strong>Chart Type:</strong> Horizontal Bar Chart (Basic)</p>
          <p><strong>Use Case:</strong> Comparison of verification volumes by compliance type</p>
          <p><strong>Features:</strong> South African compliance types, volume thresholds, centered labels</p>
        </div>
      </div>

      {/* Compliance Status by Province - Grouped Bar */}
      <div className="bg-neumorphic-card rounded-lg p-6 shadow-neumorphic">
        <ChartErrorBoundary chartName="Compliance Status Chart">
          <ComplianceStatusChart
            useSampleData={true}
            height={450}
            className="w-full"
          />
        </ChartErrorBoundary>
        <div className="mt-4 text-sm text-neumorphic-text-secondary">
          <p><strong>Chart Type:</strong> Grouped Bar Chart (Multi-series)</p>
          <p><strong>Use Case:</strong> Provincial compliance status comparison across South Africa</p>
          <p><strong>Features:</strong> Multi-status comparison, provincial breakdown, activity thresholds</p>
        </div>
      </div>

      {/* Risk Score Breakdown - Stacked Bar */}
      <div className="bg-neumorphic-card rounded-lg p-6 shadow-neumorphic">
        <ChartErrorBoundary chartName="Stacked Risk Chart">
          <StackedRiskChart
            useSampleData={true}
            height={450}
            className="w-full"
          />
        </ChartErrorBoundary>
        <div className="mt-4 text-sm text-neumorphic-text-secondary">
          <p><strong>Chart Type:</strong> Stacked Bar Chart (Component Analysis)</p>
          <p><strong>Use Case:</strong> Detailed risk score breakdown by contributing factors</p>
          <p><strong>Features:</strong> Component stacking, total scores, risk thresholds, category tooltips</p>
        </div>
      </div>

      {/* Pre vs Post Vetting Comparison - Grouped Bar */}
      <div className="bg-neumorphic-card rounded-lg p-6 shadow-neumorphic">
        <ChartErrorBoundary chartName="Pre vs Post Vetting Chart">
          <PrePostVettingChart
            useSampleData={true}
            height={450}
            className="w-full"
          />
        </ChartErrorBoundary>
        <div className="mt-4 text-sm text-neumorphic-text-secondary">
          <p><strong>Chart Type:</strong> Grouped Bar Chart (Before/After Comparison)</p>
          <p><strong>Use Case:</strong> Demonstrate vetting effectiveness through risk score improvement</p>
          <p><strong>Features:</strong> Pre/post comparison, risk reduction visualization, threshold lines</p>
        </div>
      </div>

      {/* Implementation Notes */}
      <div className="bg-neumorphic-card rounded-lg p-6 shadow-neumorphic">
        <h2 className="text-xl font-semibold text-neumorphic-text-primary mb-4">
          📊 Implementation Notes
        </h2>
        <div className="space-y-4 text-sm text-neumorphic-text-secondary">
          <div>
            <h3 className="font-semibold text-neumorphic-text-primary">Data Architecture</h3>
            <p>All charts use structured sample data that matches the planned API response format. 
               When backend APIs are available, only data fetching logic needs to change.</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-neumorphic-text-primary">Chart Types Demonstrated</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Vertical Bar:</strong> Risk categories with distributed colors</li>
              <li><strong>Horizontal Bar:</strong> Verification types with volume annotations</li>
              <li><strong>Grouped Bar:</strong> Multi-series provincial compliance comparison</li>
              <li><strong>Stacked Bar:</strong> Component risk analysis with totals</li>
              <li><strong>Comparison Bar:</strong> Before/after vetting effectiveness</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-neumorphic-text-primary">South African Context</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>ZAR currency formatting</li>
              <li>Provincial geographic data</li>
              <li>Local compliance types (CIPC, SARS, BEE)</li>
              <li>Realistic vetting scenarios and volumes</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-neumorphic-text-primary">Interactive Features</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Click handlers for drill-down capabilities</li>
              <li>Context-aware tooltips with percentage calculations</li>
              <li>Threshold annotations for business rules</li>
              <li>Neumorphic theme integration with proper contrast</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-neumorphic-text-primary">Error Handling</h3>
            <p>Each chart is wrapped in an error boundary with retry functionality. 
               Charts gracefully handle missing data and provide user-friendly error messages.</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 