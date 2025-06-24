'use client';

import React from 'react';
import {
  PieChart,
  DonutChart,
  RiskLevelDistributionChart,
  VerificationStatusDonutChart,
  ServiceTypeDistributionChart,
  ProvincialSupplierDonutChart,
} from '../index';

/**
 * PieDonutChartsDemo - Comprehensive Demo Page
 * 
 * Showcases all pie and donut chart components for the South African vetting application.
 * Demonstrates various use cases, styling options, and data visualization patterns.
 */
export const PieDonutChartsDemo: React.FC = () => {
  return (
    <div className="p-6 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Pie & Donut Charts Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Comprehensive showcase of pie and donut charts for South African supplier vetting and compliance monitoring.
        </p>
      </div>

      {/* Basic Pie Chart - TEMPORARILY REMOVED */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Basic Pie Chart - Temporarily Disabled
        </h2>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Charts Temporarily Removed
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p><strong>Removed Charts:</strong></p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Supplier Status Distribution (Basic Pie Chart)</li>
                  <li>Compliance Verification Rates (Custom Colors Pie Chart)</li>
                </ul>
                <p className="mt-3"><strong>Reason:</strong> Runtime error &quot;Cannot read properties of undefined (reading &apos;offsetY&apos;)&quot; in ApexCharts configuration. These charts will be restored once the underlying configuration issue is resolved.</p>
                <p className="mt-2"><strong>Status:</strong> Under investigation - Issue appears to be related to ApexCharts pie chart dataLabels configuration in React/Next.js environment.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Basic Donut Chart - TEMPORARILY REMOVED */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Basic Donut Chart - Temporarily Disabled
        </h2>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Charts Temporarily Removed
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p><strong>Removed Charts:</strong></p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Verification Process Status (Donut Chart with Center Text)</li>
                  <li>Overall Pass Rate (Completion Rate Focus Donut Chart)</li>
                </ul>
                <p className="mt-3"><strong>Reason:</strong> Runtime error &quot;Cannot read properties of undefined (reading &apos;offsetY&apos;)&quot; in ApexCharts configuration. These charts will be restored once the underlying configuration issue is resolved.</p>
                <p className="mt-2"><strong>Status:</strong> Under investigation - Issue appears to be related to ApexCharts donut chart center labels configuration in React/Next.js environment.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialized Charts - Risk Analysis */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Risk Analysis Charts
        </h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
              Supplier Risk Level Distribution
            </h3>
            <RiskLevelDistributionChart
              useSampleData={true}
              height={400}
            />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
              Verification Status Overview
            </h3>
            <VerificationStatusDonutChart
              useSampleData={true}
              showCompletionRate={true}
              height={400}
            />
          </div>
        </div>
      </section>

      {/* Specialized Charts - Service & Geographic Analysis */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Service & Geographic Analysis
        </h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
              Vetting Service Types
            </h3>
            <ServiceTypeDistributionChart
              useSampleData={true}
              showRevenue={false}
              height={450}
            />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
              Provincial Distribution
            </h3>
            <ProvincialSupplierDonutChart
              useSampleData={true}
              height={450}
            />
          </div>
        </div>
      </section>

      {/* Interactive Features Demo */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Interactive Features
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
              Click Handler Demo - Temporarily Disabled
            </h3>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 h-[350px] flex items-center justify-center">
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <svg className="h-8 w-8 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                  Chart Temporarily Removed
                </h4>
                <div className="text-xs text-yellow-700 dark:text-yellow-300">
                  <p><strong>Removed:</strong> Supplier Distribution (Click to interact)</p>
                  <p className="mt-1"><strong>Reason:</strong> Runtime error &quot;Cannot read properties of undefined (reading &apos;offsetY&apos;)&quot;</p>
                  <p className="mt-1"><strong>Status:</strong> Under investigation</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
              Loading & Error States
            </h3>
            <div className="space-y-4">
              {/* Loading State */}
              <div>
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Loading State:
                </h4>
                <DonutChart
                  data={[]}
                  title="Loading Example"
                  height={150}
                  loading={true}
                />
              </div>
              
              {/* Error State */}
              <div>
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Error State:
                </h4>
                <DonutChart
                  data={[]}
                  title="Error Example"
                  height={150}
                  error="Failed to load chart data"
                />
              </div>
              
              {/* Empty State */}
              <div>
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Empty State:
                </h4>
                <PieChart
                  data={[]}
                  title="Empty Data Example"
                  height={150}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Notes */}
      <section className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
          Implementation Notes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Key Features:</h3>
            <ul className="space-y-1 text-blue-700 dark:text-blue-300">
              <li>• Neumorphic theme integration</li>
              <li>• Dark theme support with proper contrast</li>
              <li>• Responsive design (mobile-first)</li>
              <li>• Interactive tooltips and legends</li>
              <li>• Click event handling</li>
              <li>• Loading, error, and empty states</li>
              <li>• South African business context</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Use Cases:</h3>
            <ul className="space-y-1 text-blue-700 dark:text-blue-300">
              <li>• Risk level distributions</li>
              <li>• Verification status tracking</li>
              <li>• Service type analysis</li>
              <li>• Geographic supplier mapping</li>
              <li>• Compliance monitoring</li>
              <li>• Performance dashboards</li>
              <li>• Executive reporting</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PieDonutChartsDemo; 