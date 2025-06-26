"use client";

import React from 'react';
import { 
  NeumorphicBackground,
  NeumorphicCard,
  NeumorphicText,
  NeumorphicHeading,
  NeumorphicTable,
  NeumorphicTableHeader,
  NeumorphicTableBody,
  NeumorphicTableRow,
  NeumorphicTableHead,
  NeumorphicTableCell,
  NeumorphicBadge,
  NeumorphicButton
} from '@/components/ui/neumorphic';
import LazyLoad from '@/components/ui/LazyLoad';
import { getSuppliers } from '@/lib/sample-data/supplierSample';
import { useRouter } from 'next/navigation';
import { AlertTriangleIcon, TrendingUpIcon, BarChart3Icon, ShieldAlertIcon } from 'lucide-react';

const SupplierRiskDashboardPage: React.FC = () => {
  const router = useRouter();
  const suppliers = getSuppliers();

  // Calculate risk statistics
  const riskStats = {
    low: suppliers.filter(s => s.overallRiskScore > 0 && s.overallRiskScore <= 3).length,
    medium: suppliers.filter(s => s.overallRiskScore > 3 && s.overallRiskScore <= 6).length,
    high: suppliers.filter(s => s.overallRiskScore > 6).length,
    unassessed: suppliers.filter(s => s.overallRiskScore === 0).length,
  };

  // Get high-risk suppliers
  const highRiskSuppliers = suppliers.filter(s => s.status === 'High-Risk' || s.overallRiskScore > 6);

  // Common red flags data (mock data for demonstration)
  const commonRedFlags = [
    { check: 'Director Credit Check', failures: 8, percentage: 32 },
    { check: 'Location Verification', failures: 6, percentage: 24 },
    { check: 'Annual COID Check', failures: 5, percentage: 20 },
    { check: 'BEE Certificate Validation', failures: 4, percentage: 16 },
    { check: 'Tax Clearance Status', failures: 2, percentage: 8 },
  ];

  // Risk by industry data
  const riskByIndustry = [
    { industry: 'Logistics', avgRisk: 7.2, suppliers: 1 },
    { industry: 'Catering & Hospitality', avgRisk: 4.0, suppliers: 1 },
    { industry: 'Mining Equipment', avgRisk: 2.5, suppliers: 1 },
    { industry: 'IT Services', avgRisk: 1.5, suppliers: 1 },
    { industry: 'Engineering', avgRisk: 0, suppliers: 1 }, // Onboarding
  ];

  const getRiskColor = (score: number) => {
    if (score === 0) return 'text-gray-500';
    if (score <= 3) return 'text-green-500';
    if (score <= 6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getRiskBadgeVariant = (score: number) => {
    if (score === 0) return 'default';
    if (score <= 3) return 'success';
    if (score <= 6) return 'warning';
    return 'danger';
  };

  return (
    <NeumorphicBackground>
      <div className="container mx-auto p-6">
        {/* Header Section */}
        <NeumorphicCard className="p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <NeumorphicHeading>Supplier Risk Dashboard</NeumorphicHeading>
              <NeumorphicText className="text-neumorphic-text-secondary mt-2">
                Comprehensive risk analysis and monitoring across the entire supplier base
              </NeumorphicText>
            </div>
            <div className="flex items-center gap-2">
              <ShieldAlertIcon className="w-8 h-8 text-red-500" />
              <div className="text-right">
                <NeumorphicText className="text-2xl font-bold text-red-500">
                  {highRiskSuppliers.length}
                </NeumorphicText>
                <NeumorphicText size="sm" className="text-neumorphic-text-secondary">
                  High-Risk Suppliers
                </NeumorphicText>
              </div>
            </div>
          </div>
        </NeumorphicCard>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Suppliers by Risk Category */}
          <LazyLoad fallback={<NeumorphicCard className="animate-pulse h-96" />}>
            <NeumorphicCard className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3Icon className="w-5 h-5 text-blue-500" />
                <NeumorphicText className="text-lg font-semibold">Suppliers by Risk Category</NeumorphicText>
              </div>
              <NeumorphicText className="text-neumorphic-text-secondary mb-6">
                Distribution of suppliers across risk levels
              </NeumorphicText>
              
              {/* Risk Category Stats */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <NeumorphicText>Low Risk (0-3)</NeumorphicText>
                  </div>
                  <NeumorphicText className="font-semibold">{riskStats.low}</NeumorphicText>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <NeumorphicText>Medium Risk (3-6)</NeumorphicText>
                  </div>
                  <NeumorphicText className="font-semibold">{riskStats.medium}</NeumorphicText>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <NeumorphicText>High Risk (6+)</NeumorphicText>
                  </div>
                  <NeumorphicText className="font-semibold">{riskStats.high}</NeumorphicText>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-500 rounded"></div>
                    <NeumorphicText>Unassessed</NeumorphicText>
                  </div>
                  <NeumorphicText className="font-semibold">{riskStats.unassessed}</NeumorphicText>
                </div>
              </div>

              {/* Visual Bar Chart */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <NeumorphicText size="sm" className="w-16">Low</NeumorphicText>
                  <div className="flex-1 bg-neumorphic-card rounded-full h-4 overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${(riskStats.low / suppliers.length) * 100}%` }}
                    ></div>
                  </div>
                  <NeumorphicText size="sm" className="w-12 text-right">{riskStats.low}</NeumorphicText>
                </div>
                <div className="flex items-center gap-3">
                  <NeumorphicText size="sm" className="w-16">Medium</NeumorphicText>
                  <div className="flex-1 bg-neumorphic-card rounded-full h-4 overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                      style={{ width: `${(riskStats.medium / suppliers.length) * 100}%` }}
                    ></div>
                  </div>
                  <NeumorphicText size="sm" className="w-12 text-right">{riskStats.medium}</NeumorphicText>
                </div>
                <div className="flex items-center gap-3">
                  <NeumorphicText size="sm" className="w-16">High</NeumorphicText>
                  <div className="flex-1 bg-neumorphic-card rounded-full h-4 overflow-hidden">
                    <div 
                      className="h-full bg-red-500 rounded-full transition-all duration-500"
                      style={{ width: `${(riskStats.high / suppliers.length) * 100}%` }}
                    ></div>
                  </div>
                  <NeumorphicText size="sm" className="w-12 text-right">{riskStats.high}</NeumorphicText>
                </div>
              </div>
            </NeumorphicCard>
          </LazyLoad>

          {/* Card 2: Common Red Flags */}
          <NeumorphicCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangleIcon className="w-5 h-5 text-red-500" />
              <NeumorphicText className="text-lg font-semibold">Common Red Flags</NeumorphicText>
            </div>
            <NeumorphicText className="text-neumorphic-text-secondary mb-6">
              Most frequent failed verification checks
            </NeumorphicText>
            
            <div className="space-y-4">
              {commonRedFlags.map((flag, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <NeumorphicText size="sm" className="font-medium">{flag.check}</NeumorphicText>
                    <div className="flex items-center gap-2">
                      <NeumorphicText size="sm" className="text-red-500 font-semibold">
                        {flag.failures} failures
                      </NeumorphicText>
                      <NeumorphicText size="sm" className="text-neumorphic-text-secondary">
                        ({flag.percentage}%)
                      </NeumorphicText>
                    </div>
                  </div>
                  <div className="w-full bg-neumorphic-card rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-red-500 rounded-full transition-all duration-500"
                      style={{ width: `${flag.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </NeumorphicCard>

          {/* Card 3: Risk by Industry */}
          <NeumorphicCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUpIcon className="w-5 h-5 text-purple-500" />
              <NeumorphicText className="text-lg font-semibold">Risk by Industry</NeumorphicText>
            </div>
            <NeumorphicText className="text-neumorphic-text-secondary mb-6">
              Average risk scores across different industry sectors
            </NeumorphicText>
            
            <div className="space-y-4">
              {riskByIndustry.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-neumorphic-card/30 rounded-[var(--neumorphic-radius)]">
                  <div>
                    <NeumorphicText className="font-medium">{item.industry}</NeumorphicText>
                    <NeumorphicText size="sm" className="text-neumorphic-text-secondary">
                      {item.suppliers} supplier{item.suppliers !== 1 ? 's' : ''}
                    </NeumorphicText>
                  </div>
                  <div className="text-right">
                    <NeumorphicText className={`text-lg font-bold ${getRiskColor(item.avgRisk)}`}>
                      {item.avgRisk === 0 ? 'N/A' : item.avgRisk.toFixed(1)}
                    </NeumorphicText>
                    <NeumorphicBadge variant={getRiskBadgeVariant(item.avgRisk)}>
                      {item.avgRisk === 0 ? 'Unassessed' : 
                       item.avgRisk <= 3 ? 'Low' : 
                       item.avgRisk <= 6 ? 'Medium' : 'High'}
                    </NeumorphicBadge>
                  </div>
                </div>
              ))}
            </div>
          </NeumorphicCard>

          {/* Card 4: High-Risk Supplier Watchlist */}
          <NeumorphicCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlertIcon className="w-5 h-5 text-red-500" />
                <NeumorphicText className="text-lg font-semibold">High-Risk Watchlist</NeumorphicText>
              </div>
              <NeumorphicBadge variant="danger">{highRiskSuppliers.length} suppliers</NeumorphicBadge>
            </div>
            <NeumorphicText className="text-neumorphic-text-secondary mb-6">
              Suppliers requiring immediate attention
            </NeumorphicText>
            
            {highRiskSuppliers.length > 0 ? (
              <div className="overflow-x-auto">
                <NeumorphicTable>
                  <NeumorphicTableHeader>
                    <NeumorphicTableRow>
                      <NeumorphicTableHead>Supplier</NeumorphicTableHead>
                      <NeumorphicTableHead>Risk Score</NeumorphicTableHead>
                      <NeumorphicTableHead>Status</NeumorphicTableHead>
                      <NeumorphicTableHead>Actions</NeumorphicTableHead>
                    </NeumorphicTableRow>
                  </NeumorphicTableHeader>
                  <NeumorphicTableBody>
                    {highRiskSuppliers.map((supplier) => (
                      <NeumorphicTableRow key={supplier.id}>
                        <NeumorphicTableCell>
                          <div>
                            <NeumorphicText className="font-medium">{supplier.name}</NeumorphicText>
                            <NeumorphicText size="sm" className="text-neumorphic-text-secondary">
                              {supplier.industry}
                            </NeumorphicText>
                          </div>
                        </NeumorphicTableCell>
                        <NeumorphicTableCell>
                          <NeumorphicText className={`font-bold ${getRiskColor(supplier.overallRiskScore)}`}>
                            {supplier.overallRiskScore === 0 ? 'N/A' : supplier.overallRiskScore.toFixed(1)}
                          </NeumorphicText>
                        </NeumorphicTableCell>
                        <NeumorphicTableCell>
                          <NeumorphicBadge variant="danger">{supplier.status}</NeumorphicBadge>
                        </NeumorphicTableCell>
                        <NeumorphicTableCell>
                          <NeumorphicButton
                            className="text-xs px-2 py-1"
                            onClick={() => router.push(`/suppliers/${supplier.id}`)}
                          >
                            View Profile
                          </NeumorphicButton>
                        </NeumorphicTableCell>
                      </NeumorphicTableRow>
                    ))}
                  </NeumorphicTableBody>
                </NeumorphicTable>
              </div>
            ) : (
              <div className="text-center py-8">
                <NeumorphicText className="text-neumorphic-text-secondary">
                  No high-risk suppliers currently identified
                </NeumorphicText>
              </div>
            )}
          </NeumorphicCard>
        </div>
      </div>
    </NeumorphicBackground>
  );
};

export default SupplierRiskDashboardPage; 