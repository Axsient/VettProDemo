"use client";

import LazyLoad from '@/components/ui/LazyLoad';
import { SimpleDataTableDemo } from '@/components/examples/SimpleDataTableDemo';
import { DataTableDemo } from '@/components/examples/DataTableDemo';
import { FormComponentsDemo } from '@/components/forms/examples/FormComponentsDemo';
import SelectionComponentsDemo from '@/components/forms/examples/SelectionComponentsDemo';
import { BasicDemo } from '@/components/charts/apex/examples/BasicDemo';
import { VettingLineChartsDemo } from '@/components/charts/apex/examples/VettingLineChartsDemo';
import { VettingBarChartsDemo } from '@/components/charts/apex/examples/VettingBarChartsDemo';
import { PieDonutChartsDemo } from '@/components/charts/apex/examples/PieDonutChartsDemo';
import dynamic from 'next/dynamic';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import PlaceholderLineChart from "@/components/charts/PlaceholderLineChart";
import { Input } from "@/components/ui/input";
import {
  NeumorphicBackground,
  NeumorphicCard,
  NeumorphicText,
  NeumorphicHeading,
  NeumorphicStatsCard,
  NeumorphicBadge,
  NeumorphicTable,
  NeumorphicTableHeader,
  NeumorphicTableBody,
  NeumorphicTableRow,
  NeumorphicTableHead,
  NeumorphicTableCell,
  NeumorphicButton,
  NeumorphicTabs,
  NeumorphicCalendar,
} from "@/components/ui/neumorphic";
import { ActivityIcon, AlertCircleIcon, CheckCircleIcon, ClockIcon, FileText, TrendingUp, Award } from "lucide-react";
import CircularProgressRing from '@/components/ui/CircularProgressRing';
import FlagBadge from '@/components/ui/FlagBadge';
import { InvoiceAnalysisView } from '@/components/features/InvoiceAnalysisView';

// Dynamic import for InteractiveMap to handle SSR
const InteractiveMap = dynamic(() => import('@/components/maps/InteractiveMap'), {
  ssr: false,
  loading: () => <NeumorphicCard className="animate-pulse h-96 flex items-center justify-center">
    <NeumorphicText variant="secondary">Loading map...</NeumorphicText>
  </NeumorphicCard>
});

export default function UIElementsPage() {
  return (
    <NeumorphicBackground className="min-h-screen">
      <div className="w-full space-y-1">
        {/* Header Section */}
        <NeumorphicCard>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <NeumorphicHeading>UI Elements</NeumorphicHeading>
              <NeumorphicText variant="secondary" className="leading-tight">
                Comprehensive showcase of VETTPRO neumorphic UI components and features.
              </NeumorphicText>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="neumorphic-outline">New Vetting Request</Button>
                                            <Dialog>
                <DialogTrigger asChild>
                  <Button variant="neumorphic-outline">Test Dialog</Button>
                </DialogTrigger>
                <DialogContent variant="neumorphic" className="sm:max-w-[600px]">
                  <DialogHeader variant="neumorphic">
                    <DialogTitle variant="neumorphic">Enhanced Neumorphic Dialog</DialogTitle>
                    <DialogDescription variant="neumorphic">
                      This is an example of the improved neumorphic dialog with better readability and visual appeal.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-6 py-4">
                    {/* Sample Form Content */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="name" className="text-right text-neumorphic-text-primary font-medium">
                        Name
                      </label>
                      <input
                        id="name"
                        defaultValue="John Doe"
                        className="col-span-3 px-3 py-2 rounded-md"
                        placeholder="Enter your name"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="email" className="text-right text-neumorphic-text-primary font-medium">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        defaultValue="john@example.com"
                        className="col-span-3 px-3 py-2 rounded-md"
                        placeholder="Enter your email"
                      />
                    </div>

                    {/* Sample Card Content */}
                    <NeumorphicCard className="p-4">
                      <h4 className="text-neumorphic-text-primary font-semibold mb-2">Sample Information</h4>
                      <p className="text-neumorphic-text-secondary text-sm mb-3">
                        This card demonstrates how nested content appears within the enhanced modal background.
                      </p>
                      <div className="flex gap-2">
                        <NeumorphicBadge variant="success">Active</NeumorphicBadge>
                        <NeumorphicBadge variant="info">Verified</NeumorphicBadge>
                      </div>
                    </NeumorphicCard>

                    {/* Sample Textarea */}
                    <div className="grid grid-cols-4 items-start gap-4">
                      <label htmlFor="message" className="text-right text-neumorphic-text-primary font-medium pt-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        className="col-span-3 px-3 py-2 rounded-md resize-none"
                        placeholder="Enter your message here..."
                        defaultValue="This is a sample message to demonstrate how text areas appear in the enhanced neumorphic dialog."
                      />
                    </div>

                                         {/* Sample Stats */}
                     <div className="grid grid-cols-3 gap-4">
                       <NeumorphicStatsCard
                         title="Tasks"
                         value="24"
                         icon={<FileText className="w-5 h-5" />}
                         trend="up"
                         trendValue="+12%"
                       />
                       <NeumorphicStatsCard
                         title="Progress"
                         value="87%"
                         icon={<TrendingUp className="w-5 h-5" />}
                         trend="up"
                         trendValue="+5%"
                       />
                       <NeumorphicStatsCard
                         title="Score"
                         value="9.2"
                         icon={<Award className="w-5 h-5" />}
                         trend="up"
                         trendValue="+0.3"
                       />
                     </div>
                  </div>

                                     <DialogFooter variant="neumorphic">
                     <NeumorphicButton className="mr-2" onClick={() => {}}>
                       Cancel
                     </NeumorphicButton>
                     <NeumorphicButton className="bg-purple-600 hover:bg-purple-700" onClick={() => {}}>
                       Save Changes
                     </NeumorphicButton>
                   </DialogFooter>
                </DialogContent>
              </Dialog>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="neumorphic-outline">Test Popover</Button>
                </PopoverTrigger>
                <PopoverContent variant="neumorphic">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none text-neumorphic-text-primary">Neumorphic</h4>
                      <NeumorphicText variant="secondary" size="sm">
                        This is a test of the neumorphic effect on a popover.
                      </NeumorphicText>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Button
                variant="neumorphic-outline"
                onClick={() =>
                  toast("Neumorphic Toast", {
                    description: "This is a test of the neumorphic effect.",
                    action: {
                      label: "Undo",
                      onClick: () => console.log("Undo"),
                    },
                  })
                }
              >
                Test Toast
              </Button>
            </div>
          </div>
        </NeumorphicCard>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <NeumorphicStatsCard
            title="Active Requests"
            value="24"
            icon={<ActivityIcon className="w-6 h-6 text-blue-400" />}
          />
          <NeumorphicStatsCard
            title="Completed Today"
            value="12"
            icon={<CheckCircleIcon className="w-6 h-6 text-green-400" />}
          />
          <NeumorphicStatsCard
            title="Pending Review"
            value="8"
            icon={<ClockIcon className="w-6 h-6 text-yellow-400" />}
          />
          <NeumorphicStatsCard
            title="Risk Alerts"
            value="3"
            icon={<AlertCircleIcon className="w-6 h-6 text-red-400" />}
          />
        </div>

        {/* Circular Progress Rings */}
        <NeumorphicCard>
          <NeumorphicHeading>Circular Progress Rings</NeumorphicHeading>
          <NeumorphicText variant="secondary" size="sm" className="mt-1 mb-4">
            AI Risk Score indicators with 4-tier color system: 🟢 Excellent (90+), 🟡 Good (75-89), 🟠 Caution (50-74), 🔴 Critical (&lt;50).
          </NeumorphicText>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-4">
            <div className="flex flex-col items-center space-y-3">
              <CircularProgressRing percentage={95} size={60} strokeWidth={5} />
              <div className="text-center">
                <NeumorphicText size="sm" className="font-medium">Excellent</NeumorphicText>
                <NeumorphicText size="sm" variant="secondary">95% Score</NeumorphicText>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-3">
              <CircularProgressRing percentage={82} size={60} strokeWidth={5} />
              <div className="text-center">
                <NeumorphicText size="sm" className="font-medium">Good</NeumorphicText>
                <NeumorphicText size="sm" variant="secondary">82% Score</NeumorphicText>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-3">
              <CircularProgressRing percentage={65} size={60} strokeWidth={5} />
              <div className="text-center">
                <NeumorphicText size="sm" className="font-medium">Caution</NeumorphicText>
                <NeumorphicText size="sm" variant="secondary">65% Score</NeumorphicText>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-3">
              <CircularProgressRing percentage={35} size={60} strokeWidth={5} />
              <div className="text-center">
                <NeumorphicText size="sm" className="font-medium">Critical</NeumorphicText>
                <NeumorphicText size="sm" variant="secondary">35% Score</NeumorphicText>
              </div>
            </div>
          </div>
        </NeumorphicCard>

        {/* Flag Badges */}
        <NeumorphicCard>
          <NeumorphicHeading>Flag Badges</NeumorphicHeading>
          <NeumorphicText variant="secondary" size="sm" className="mt-1 mb-4">
            Visually impactful badges for displaying risk flags with severity-based colors and icons.
          </NeumorphicText>
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <FlagBadge severity="Critical">Post-Completion Billing</FlagBadge>
            <FlagBadge severity="High">Price Discrepancy</FlagBadge>
            <FlagBadge severity="Medium">Slippery Slope Pattern</FlagBadge>
            <FlagBadge severity="Low">Minor Compliance Issue</FlagBadge>
          </div>
        </NeumorphicCard>

        {/* Invoice DNA Analysis */}
        <NeumorphicCard>
          <div className="mb-4">
            <NeumorphicHeading>Invoice DNA Analysis</NeumorphicHeading>
            <NeumorphicText variant="secondary" size="sm" className="mt-1">
              Advanced RFP vs Invoice comparison with AI-powered insights, animated connections, and risk flag detection.
            </NeumorphicText>
          </div>
          <InvoiceAnalysisView 
            rfpTitle="Q2 Office Supply Contract"
            dnaItems={[
              { rfpLabel: "Drill Bits (x50)", rfpValue: "R1,500 / unit", invoiceLabel: "Drill Bits (x50)", invoiceValue: "R1,875 / unit", status: "mismatch" },
              { rfpLabel: "Safety Gloves (x100)", rfpValue: "R50 / pair", invoiceLabel: "Safety Gloves (x100)", invoiceValue: "R50 / pair", status: "match" },
              { rfpLabel: "Logistics", rfpValue: "R5,000", invoiceLabel: "Logistics", invoiceValue: "R5,000", status: "match" },
              { invoiceLabel: "Admin Fee", invoiceValue: "R2,500", status: "unsolicited_invoice" }
            ]}
            analysis={{
              overallConfidenceScore: 25,
              llmSummary: "Invoice contains a significant price discrepancy for 'Drill Bits' (25% over quote) and an unsolicited 'Admin Fee'. This demonstrates the component's ability to highlight critical issues.",
              llmRecommendation: "Reject & Escalate",
              flags: [
                { type: "Price Discrepancy", severity: "High", description: "Drill Bits priced 25% higher than RFP quote", details: { item: "Drill Bits", rfp_value: "R1,500", invoice_value: "R1,875" } },
                { type: "Unsolicited Item", severity: "Medium", description: "Admin Fee not included in original RFP", details: { item: "Admin Fee", invoice_value: "R2,500" } }
              ]
            }}
          />
        </NeumorphicCard>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <LazyLoad fallback={<NeumorphicCard className="animate-pulse h-64" />}>
            <NeumorphicCard>
              <PlaceholderLineChart />
            </NeumorphicCard>
          </LazyLoad>

          <LazyLoad fallback={<NeumorphicCard className="animate-pulse h-64" />}>
            <NeumorphicCard className="flex flex-col justify-between h-full">
              <div>
                <NeumorphicText size="lg" className="font-semibold">Component Examples</NeumorphicText>
                <NeumorphicText variant="secondary" size="sm" className="mt-1">
                  Testing the updated button and input styles.
                </NeumorphicText>
              </div>
              <div className="space-y-2 mt-2">
                <Input type="email" placeholder="Email with neumorphic effect" />
                <Button variant="neumorphic-outline" className="w-full">Neumorphic Button</Button>
              </div>
            </NeumorphicCard>
          </LazyLoad>
        </div>

        {/* ApexCharts Demo Section */}
        <LazyLoad fallback={<NeumorphicCard className="animate-pulse h-96" />}>
          <NeumorphicCard>
            <BasicDemo />
          </NeumorphicCard>
        </LazyLoad>

        {/* Vetting Line Charts Demo Section */}
        <LazyLoad fallback={<NeumorphicCard className="animate-pulse h-96" />}>
          <NeumorphicCard>
            <VettingLineChartsDemo />
          </NeumorphicCard>
        </LazyLoad>

        {/* Vetting Bar Charts Demo Section */}
        <LazyLoad fallback={<NeumorphicCard className="animate-pulse h-96" />}>
          <NeumorphicCard>
            <VettingBarChartsDemo />
          </NeumorphicCard>
        </LazyLoad>

        {/* Pie & Donut Charts Demo Section */}
        <LazyLoad fallback={<NeumorphicCard className="animate-pulse h-96" />}>
          <NeumorphicCard>
            <PieDonutChartsDemo />
          </NeumorphicCard>
        </LazyLoad>

        {/* Recent Activity Table */}
        <LazyLoad fallback={<NeumorphicCard className="animate-pulse h-48" />}>
          <NeumorphicCard>
            <div className="flex items-center justify-between mb-2">
              <NeumorphicText size="lg" className="font-semibold">Recent Vetting Requests</NeumorphicText>
              <Button variant="neumorphic-outline" className="text-neumorphic-text-secondary hover:text-neumorphic-text-primary text-sm">
                View All
              </Button>
            </div>
            
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <NeumorphicTable>
                <NeumorphicTableHeader>
                  <NeumorphicTableRow>
                    <NeumorphicTableHead>ID</NeumorphicTableHead>
                    <NeumorphicTableHead>Supplier</NeumorphicTableHead>
                    <NeumorphicTableHead className="hidden md:table-cell">Type</NeumorphicTableHead>
                    <NeumorphicTableHead>Status</NeumorphicTableHead>
                    <NeumorphicTableHead className="hidden lg:table-cell">Date</NeumorphicTableHead>
                    <NeumorphicTableHead>Actions</NeumorphicTableHead>
                  </NeumorphicTableRow>
                </NeumorphicTableHeader>
                <NeumorphicTableBody>
                  <NeumorphicTableRow>
                    <NeumorphicTableCell className="font-medium">#VET-001</NeumorphicTableCell>
                    <NeumorphicTableCell>Acme Corp Ltd</NeumorphicTableCell>
                    <NeumorphicTableCell className="hidden md:table-cell">
                      <NeumorphicText variant="secondary" size="sm">Financial</NeumorphicText>
                    </NeumorphicTableCell>
                    <NeumorphicTableCell>
                      <NeumorphicBadge variant="warning">Pending</NeumorphicBadge>
                    </NeumorphicTableCell>
                    <NeumorphicTableCell className="hidden lg:table-cell">
                      <NeumorphicText variant="secondary" size="sm">2024-01-15</NeumorphicText>
                    </NeumorphicTableCell>
                    <NeumorphicTableCell>
                      <Button variant="neumorphic-outline" className="text-neumorphic-text-secondary hover:text-neumorphic-text-primary text-sm">
                        View
                      </Button>
                    </NeumorphicTableCell>
                  </NeumorphicTableRow>
                  <NeumorphicTableRow>
                    <NeumorphicTableCell className="font-medium">#VET-002</NeumorphicTableCell>
                    <NeumorphicTableCell>TechFlow Ltd</NeumorphicTableCell>
                    <NeumorphicTableCell className="hidden md:table-cell">
                      <NeumorphicText variant="secondary" size="sm">Technical</NeumorphicText>
                    </NeumorphicTableCell>
                    <NeumorphicTableCell>
                      <NeumorphicBadge variant="success">Completed</NeumorphicBadge>
                    </NeumorphicTableCell>
                    <NeumorphicTableCell className="hidden lg:table-cell">
                      <NeumorphicText variant="secondary" size="sm">2024-01-14</NeumorphicText>
                    </NeumorphicTableCell>
                    <NeumorphicTableCell>
                      <Button variant="neumorphic-outline" className="text-neumorphic-text-secondary hover:text-neumorphic-text-primary text-sm">
                        View
                      </Button>
                    </NeumorphicTableCell>
                  </NeumorphicTableRow>
                  <NeumorphicTableRow>
                    <NeumorphicTableCell className="font-medium">#VET-003</NeumorphicTableCell>
                    <NeumorphicTableCell>Global Solutions</NeumorphicTableCell>
                    <NeumorphicTableCell className="hidden md:table-cell">
                      <NeumorphicText variant="secondary" size="sm">Compliance</NeumorphicText>
                    </NeumorphicTableCell>
                    <NeumorphicTableCell>
                      <NeumorphicBadge variant="danger">Risk Alert</NeumorphicBadge>
                    </NeumorphicTableCell>
                    <NeumorphicTableCell className="hidden lg:table-cell">
                      <NeumorphicText variant="secondary" size="sm">2024-01-13</NeumorphicText>
                    </NeumorphicTableCell>
                    <NeumorphicTableCell>
                      <Button variant="neumorphic-outline" className="text-neumorphic-text-secondary hover:text-neumorphic-text-primary text-sm">
                        View
                      </Button>
                    </NeumorphicTableCell>
                  </NeumorphicTableRow>
                </NeumorphicTableBody>
              </NeumorphicTable>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-2">
              <NeumorphicCard className="p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <NeumorphicText className="font-medium">#VET-001</NeumorphicText>
                    <NeumorphicText variant="secondary" size="sm">Acme Corp Ltd</NeumorphicText>
                  </div>
                  <NeumorphicBadge variant="warning">Pending</NeumorphicBadge>
                </div>
                <Button variant="neumorphic-outline" className="text-neumorphic-text-secondary hover:text-neumorphic-text-primary text-sm">
                  View Details
                </Button>
              </NeumorphicCard>
              
              <NeumorphicCard className="p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <NeumorphicText className="font-medium">#VET-002</NeumorphicText>
                    <NeumorphicText variant="secondary" size="sm">TechFlow Ltd</NeumorphicText>
                  </div>
                  <NeumorphicBadge variant="success">Completed</NeumorphicBadge>
                </div>
                <Button variant="neumorphic-outline" className="text-neumorphic-text-secondary hover:text-neumorphic-text-primary text-sm">
                  View Details
                </Button>
              </NeumorphicCard>
            </div>
          </NeumorphicCard>
        </LazyLoad>

        {/* Simple Data Table Demo */}
        <LazyLoad fallback={<NeumorphicCard className="animate-pulse h-96" />}>
          <NeumorphicCard>
            <div className="mb-4">
              <NeumorphicText size="lg" className="font-semibold">Simple Data Table</NeumorphicText>
              <NeumorphicText variant="secondary" size="sm" className="mt-1">
                Clean, production-ready table with core features and standard display.
              </NeumorphicText>
            </div>
            <SimpleDataTableDemo />
          </NeumorphicCard>
        </LazyLoad>

        {/* Advanced Data Table Demo */}
        <LazyLoad fallback={<NeumorphicCard className="animate-pulse h-96" />}>
          <NeumorphicCard>
            <div className="mb-4">
              <NeumorphicText size="lg" className="font-semibold">Advanced Data Table</NeumorphicText>
              <NeumorphicText variant="secondary" size="sm" className="mt-1">
                Feature-rich table with custom cells, avatars, badges, row expansion, and column resizing.
              </NeumorphicText>
            </div>
            <DataTableDemo />
          </NeumorphicCard>
        </LazyLoad>

        {/* Form Components Demo */}
        <LazyLoad fallback={<NeumorphicCard className="animate-pulse h-96" />}>
          <NeumorphicCard>
            <div className="mb-4">
              <NeumorphicText size="lg" className="font-semibold">🇿🇦 South African Form Components</NeumorphicText>
              <NeumorphicText variant="secondary" size="sm" className="mt-1">
                Comprehensive form components for South African vetting and verification systems with real-time validation.
              </NeumorphicText>
            </div>
            <FormComponentsDemo />
          </NeumorphicCard>
        </LazyLoad>

        {/* Selection Components Demo */}
        <LazyLoad fallback={<NeumorphicCard className="animate-pulse h-96" />}>
          <NeumorphicCard>
            <div className="mb-4">
              <NeumorphicText size="lg" className="font-semibold">🎯 Selection Components</NeumorphicText>
              <NeumorphicText variant="secondary" size="sm" className="mt-1">
                Radio buttons, checkboxes, dropdowns, and multi-select components with search, grouping, and validation.
              </NeumorphicText>
            </div>
            <SelectionComponentsDemo />
          </NeumorphicCard>
        </LazyLoad>

        {/* Neumorphic Tabs Demo */}
        <LazyLoad fallback={<NeumorphicCard className="animate-pulse h-96" />}>
          <NeumorphicCard>
            <div className="mb-4">
              <NeumorphicText size="lg" className="font-semibold">📑 Neumorphic Tabs</NeumorphicText>
              <NeumorphicText variant="secondary" size="sm" className="mt-1">
                Tab navigation with neumorphic styling, elevated active states, and smooth transitions.
              </NeumorphicText>
            </div>

            {/* Basic Tabs Example */}
            <div className="space-y-6">
              <div>
                <NeumorphicText className="font-medium mb-3">Community Canvassing Example</NeumorphicText>
                <NeumorphicTabs defaultValue="database">
                  <NeumorphicTabs.List>
                    <NeumorphicTabs.Trigger value="database">Community Database</NeumorphicTabs.Trigger>
                    <NeumorphicTabs.Trigger value="onboard">Onboard New Member</NeumorphicTabs.Trigger>
                    <NeumorphicTabs.Trigger value="review">Review Submissions</NeumorphicTabs.Trigger>
                  </NeumorphicTabs.List>
                  
                  <NeumorphicTabs.Content value="database">
                    <NeumorphicCard className="p-6">
                      <NeumorphicText size="lg" className="font-semibold mb-2">Community Members Database</NeumorphicText>
                      <NeumorphicText variant="secondary" className="mb-4">
                        View and manage community members, their verification status, and contact information.
                      </NeumorphicText>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <NeumorphicStatsCard
                          title="Total Members"
                          value="1,247"
                          icon={<ActivityIcon className="w-5 h-5 text-blue-400" />}
                        />
                        <NeumorphicStatsCard
                          title="Verified"
                          value="1,089"
                          icon={<CheckCircleIcon className="w-5 h-5 text-green-400" />}
                        />
                        <NeumorphicStatsCard
                          title="Pending"
                          value="158"
                          icon={<ClockIcon className="w-5 h-5 text-yellow-400" />}
                        />
                      </div>
                    </NeumorphicCard>
                  </NeumorphicTabs.Content>
                  
                  <NeumorphicTabs.Content value="onboard">
                    <NeumorphicCard className="p-6">
                      <NeumorphicText size="lg" className="font-semibold mb-2">Onboard New Member</NeumorphicText>
                      <NeumorphicText variant="secondary" className="mb-4">
                        Register new community members and initiate their vetting process.
                      </NeumorphicText>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <NeumorphicText size="sm" className="mb-2 font-medium">Full Name</NeumorphicText>
                            <Input placeholder="Enter full name" />
                          </div>
                          <div>
                            <NeumorphicText size="sm" className="mb-2 font-medium">ID Number</NeumorphicText>
                            <Input placeholder="SA ID Number" />
                          </div>
                        </div>
                        <div>
                          <NeumorphicText size="sm" className="mb-2 font-medium">Address</NeumorphicText>
                          <Input placeholder="Physical address" />
                        </div>
                        <Button variant="neumorphic-outline" className="w-full">
                          Begin Onboarding Process
                        </Button>
                      </div>
                    </NeumorphicCard>
                  </NeumorphicTabs.Content>
                  
                  <NeumorphicTabs.Content value="review">
                    <NeumorphicCard className="p-6">
                      <NeumorphicText size="lg" className="font-semibold mb-2">Review Submissions</NeumorphicText>
                      <NeumorphicText variant="secondary" className="mb-4">
                        Review and approve pending member applications and documentation.
                      </NeumorphicText>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-[var(--neumorphic-button)] bg-opacity-30 rounded-[var(--neumorphic-radius-md)]">
                          <div>
                            <NeumorphicText className="font-medium">John Doe</NeumorphicText>
                            <NeumorphicText variant="secondary" size="sm">ID: 8901234567890</NeumorphicText>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="neumorphic-outline" size="sm">Review</Button>
                            <NeumorphicBadge variant="warning">Pending</NeumorphicBadge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-[var(--neumorphic-button)] bg-opacity-30 rounded-[var(--neumorphic-radius-md)]">
                          <div>
                            <NeumorphicText className="font-medium">Jane Smith</NeumorphicText>
                            <NeumorphicText variant="secondary" size="sm">ID: 8912345678901</NeumorphicText>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="neumorphic-outline" size="sm">Review</Button>
                            <NeumorphicBadge variant="info">Documents Received</NeumorphicBadge>
                          </div>
                        </div>
                      </div>
                    </NeumorphicCard>
                  </NeumorphicTabs.Content>
                </NeumorphicTabs>
              </div>

              {/* Business Location Verification Example */}
              <div>
                <NeumorphicText className="font-medium mb-3">Business Location Verification Example</NeumorphicText>
                <NeumorphicTabs defaultValue="overview">
                  <NeumorphicTabs.List>
                    <NeumorphicTabs.Trigger value="overview">Overview</NeumorphicTabs.Trigger>
                    <NeumorphicTabs.Trigger value="field-checks">Field Checks</NeumorphicTabs.Trigger>
                    <NeumorphicTabs.Trigger value="documentation">Documentation</NeumorphicTabs.Trigger>
                    <NeumorphicTabs.Trigger value="reports" disabled>Reports</NeumorphicTabs.Trigger>
                  </NeumorphicTabs.List>
                  
                  <NeumorphicTabs.Content value="overview">
                    <NeumorphicCard className="p-6">
                      <NeumorphicText size="lg" className="font-semibold mb-2">Verification Overview</NeumorphicText>
                      <NeumorphicText variant="secondary" className="mb-4">
                        Comprehensive business location verification dashboard with real-time status updates.
                      </NeumorphicText>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <NeumorphicStatsCard
                          title="Active Verifications"
                          value="34"
                          icon={<ActivityIcon className="w-5 h-5 text-blue-400" />}
                        />
                        <NeumorphicStatsCard
                          title="Completed Today"
                          value="12"
                          icon={<CheckCircleIcon className="w-5 h-5 text-green-400" />}
                        />
                        <NeumorphicStatsCard
                          title="Field Visits"
                          value="8"
                          icon={<ClockIcon className="w-5 h-5 text-purple-400" />}
                        />
                        <NeumorphicStatsCard
                          title="Risk Flags"
                          value="2"
                          icon={<AlertCircleIcon className="w-5 h-5 text-red-400" />}
                        />
                      </div>
                    </NeumorphicCard>
                  </NeumorphicTabs.Content>
                  
                  <NeumorphicTabs.Content value="field-checks">
                    <NeumorphicCard className="p-6">
                      <NeumorphicText size="lg" className="font-semibold mb-2">Field Verification Checks</NeumorphicText>
                      <NeumorphicText variant="secondary" className="mb-4">
                        Schedule and manage physical location verification visits.
                      </NeumorphicText>
                      <div className="space-y-4">
                        <Button variant="neumorphic-outline" className="w-full">
                          Schedule New Field Visit
                        </Button>
                        <div className="space-y-2">
                          <NeumorphicText size="sm" className="font-medium">Upcoming Visits</NeumorphicText>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 bg-[var(--neumorphic-button)] bg-opacity-30 rounded-[var(--neumorphic-radius-md)]">
                              <div>
                                <NeumorphicText className="font-medium">ABC Manufacturing</NeumorphicText>
                                <NeumorphicText variant="secondary" size="sm">Tomorrow, 10:00 AM</NeumorphicText>
                              </div>
                              <NeumorphicBadge variant="info">Scheduled</NeumorphicBadge>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-[var(--neumorphic-button)] bg-opacity-30 rounded-[var(--neumorphic-radius-md)]">
                              <div>
                                <NeumorphicText className="font-medium">XYZ Services</NeumorphicText>
                                <NeumorphicText variant="secondary" size="sm">Friday, 2:00 PM</NeumorphicText>
                              </div>
                              <NeumorphicBadge variant="warning">Pending Confirmation</NeumorphicBadge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </NeumorphicCard>
                  </NeumorphicTabs.Content>
                  
                  <NeumorphicTabs.Content value="documentation">
                    <NeumorphicCard className="p-6">
                      <NeumorphicText size="lg" className="font-semibold mb-2">Documentation Management</NeumorphicText>
                      <NeumorphicText variant="secondary" className="mb-4">
                        Upload, review, and manage verification documentation and evidence.
                      </NeumorphicText>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Button variant="neumorphic-outline">Upload Documents</Button>
                          <Button variant="neumorphic-outline">Generate Report</Button>
                        </div>
                        <div>
                          <NeumorphicText size="sm" className="font-medium mb-2">Recent Documents</NeumorphicText>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3 p-2">
                              <FileText className="w-4 h-4 text-[var(--neumorphic-text-secondary)]" />
                              <NeumorphicText size="sm">Business Registration Certificate.pdf</NeumorphicText>
                            </div>
                            <div className="flex items-center gap-3 p-2">
                              <FileText className="w-4 h-4 text-[var(--neumorphic-text-secondary)]" />
                              <NeumorphicText size="sm">Location Photos.zip</NeumorphicText>
                            </div>
                          </div>
                        </div>
                      </div>
                    </NeumorphicCard>
                  </NeumorphicTabs.Content>
                  
                  <NeumorphicTabs.Content value="reports">
                    <NeumorphicCard className="p-6">
                      <NeumorphicText size="lg" className="font-semibold mb-2">Verification Reports</NeumorphicText>
                      <NeumorphicText variant="secondary">
                        This section is currently disabled for demonstration purposes.
                      </NeumorphicText>
                    </NeumorphicCard>
                  </NeumorphicTabs.Content>
                </NeumorphicTabs>
              </div>
            </div>
          </NeumorphicCard>
        </LazyLoad>

        {/* Neumorphic Calendar Demo */}
        <LazyLoad fallback={<NeumorphicCard className="animate-pulse h-96" />}>
          <NeumorphicCard>
            <div className="mb-4">
              <NeumorphicText size="lg" className="font-semibold">📅 Neumorphic Calendar</NeumorphicText>
              <NeumorphicText variant="secondary" size="sm" className="mt-1">
                Full-featured calendar with neumorphic styling, event management, and theme integration.
              </NeumorphicText>
            </div>

            {/* Calendar Component */}
            <div className="space-y-6">
              <div>
                <NeumorphicText className="font-medium mb-3">Vetting Schedule Calendar</NeumorphicText>
                <NeumorphicCalendar
                  events={[
                    {
                      id: 'event-1',
                      title: 'Financial Check - Acme Corp',
                      date: '2024-01-15',
                      backgroundColor: '#10b981',
                      borderColor: '#10b981',
                      textColor: '#ffffff'
                    },
                    {
                      id: 'event-2',
                      title: 'Background Verification - John Doe',
                      date: '2024-01-18',
                      backgroundColor: '#3b82f6',
                      borderColor: '#3b82f6',
                      textColor: '#ffffff'
                    },
                    {
                      id: 'event-3',
                      title: 'Compliance Review - TechFlow Ltd',
                      date: '2024-01-20',
                      backgroundColor: '#f59e0b',
                      borderColor: '#f59e0b',
                      textColor: '#ffffff'
                    },
                    {
                      id: 'event-4',
                      title: 'Risk Assessment - Global Solutions',
                      date: '2024-01-22',
                      backgroundColor: '#ef4444',
                      borderColor: '#ef4444',
                      textColor: '#ffffff'
                    },
                    {
                      id: 'event-5',
                      title: 'Medical Check - Dr. Smith',
                      date: '2024-01-25',
                      backgroundColor: '#8b5cf6',
                      borderColor: '#8b5cf6',
                      textColor: '#ffffff'
                    },
                    {
                      id: 'event-6',
                      title: 'Document Review - ABC Manufacturing',
                      date: '2024-01-28',
                      backgroundColor: '#06b6d4',
                      borderColor: '#06b6d4',
                      textColor: '#ffffff'
                    },
                    {
                      id: 'event-7',
                      title: 'Field Verification - Construction Co',
                      date: '2024-01-30',
                      backgroundColor: '#84cc16',
                      borderColor: '#84cc16',
                      textColor: '#ffffff'
                    }
                  ]}
                  onEventClick={(eventApi) => {
                    toast(`Event Selected: ${eventApi.title}`, {
                      description: `Date: ${eventApi.startStr}`,
                      action: {
                        label: "View Details",
                        onClick: () => console.log('View details:', eventApi)
                      }
                    });
                  }}
                  height="500px"
                  initialDate={new Date('2024-01-15')}
                />
              </div>

              {/* Calendar Features Overview */}
              <NeumorphicCard className="p-4">
                <NeumorphicText size="lg" className="font-semibold mb-3">Calendar Features</NeumorphicText>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <NeumorphicText className="font-medium">🎨 Neumorphic Design</NeumorphicText>
                    <NeumorphicText variant="secondary" size="sm">
                      Fully integrated with the neumorphic theme system, supporting both light and dark modes
                    </NeumorphicText>
                  </div>
                  <div className="space-y-2">
                    <NeumorphicText className="font-medium">📊 Event Management</NeumorphicText>
                    <NeumorphicText variant="secondary" size="sm">
                      Color-coded events with click handlers, custom styling, and extended properties
                    </NeumorphicText>
                  </div>
                  <div className="space-y-2">
                    <NeumorphicText className="font-medium">🌙 Theme Integration</NeumorphicText>
                    <NeumorphicText variant="secondary" size="sm">
                      Seamless theme switching with CSS variables and automatic color adaptation
                    </NeumorphicText>
                  </div>
                  <div className="space-y-2">
                    <NeumorphicText className="font-medium">🔘 Interactive Elements</NeumorphicText>
                    <NeumorphicText variant="secondary" size="sm">
                      Neumorphic buttons, tooltips, and hover effects throughout the calendar interface
                    </NeumorphicText>
                  </div>
                  <div className="space-y-2">
                    <NeumorphicText className="font-medium">📱 Responsive Design</NeumorphicText>
                    <NeumorphicText variant="secondary" size="sm">
                      Mobile-optimized layout with touch-friendly interactions and adaptive sizing
                    </NeumorphicText>
                  </div>
                  <div className="space-y-2">
                    <NeumorphicText className="font-medium">⚡ Performance</NeumorphicText>
                    <NeumorphicText variant="secondary" size="sm">
                      Optimized FullCalendar integration with lazy loading and efficient event rendering
                    </NeumorphicText>
                  </div>
                </div>
              </NeumorphicCard>

              {/* Event Legend */}
              <NeumorphicCard className="p-4">
                <NeumorphicText size="lg" className="font-semibold mb-3">Event Legend</NeumorphicText>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <NeumorphicText size="sm">Financial Checks</NeumorphicText>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <NeumorphicText size="sm">Background Verification</NeumorphicText>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-amber-500 rounded"></div>
                    <NeumorphicText size="sm">Compliance Review</NeumorphicText>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <NeumorphicText size="sm">Risk Assessment</NeumorphicText>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                    <NeumorphicText size="sm">Medical Checks</NeumorphicText>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-cyan-500 rounded"></div>
                    <NeumorphicText size="sm">Document Review</NeumorphicText>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-lime-500 rounded"></div>
                    <NeumorphicText size="sm">Field Verification</NeumorphicText>
                  </div>
                </div>
              </NeumorphicCard>
            </div>
          </NeumorphicCard>
        </LazyLoad>

        {/* Interactive Map Demo */}
        <LazyLoad fallback={<NeumorphicCard className="animate-pulse h-96" />}>
          <NeumorphicCard>
            <div className="mb-4">
              <NeumorphicText size="lg" className="font-semibold">🗺️ Interactive Map</NeumorphicText>
              <NeumorphicText variant="secondary" size="sm" className="mt-1">
                Field operations map with animated markers, geofences, and real-time verification status.
              </NeumorphicText>
            </div>

            {/* Interactive Map Component */}
            <div className="space-y-6">
              <div>
                <NeumorphicText className="font-medium mb-3">Field Operations Dashboard</NeumorphicText>
                <InteractiveMap 
                  height="400px"
                  showControls={true}
                  showGeofences={true}
                  onMarkerClick={(marker) => {
                    console.log('Marker clicked:', marker);
                    toast(`Selected: ${marker.title}`, {
                      description: marker.description
                    });
                  }}
                />
              </div>

              {/* Map Features Overview */}
              <NeumorphicCard className="p-4">
                <NeumorphicText size="lg" className="font-semibold mb-3">Map Features</NeumorphicText>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <NeumorphicText className="font-medium">🎯 Animated Markers</NeumorphicText>
                    <NeumorphicText variant="secondary" size="sm">
                      Pulsing and glowing markers with status-based colors and animations
                    </NeumorphicText>
                  </div>
                  <div className="space-y-2">
                    <NeumorphicText className="font-medium">🛡️ Geofences</NeumorphicText>
                    <NeumorphicText variant="secondary" size="sm">
                      Visual boundary areas for enhanced monitoring and alerts
                    </NeumorphicText>
                  </div>
                  <div className="space-y-2">
                    <NeumorphicText className="font-medium">📊 Live Stats</NeumorphicText>
                    <NeumorphicText variant="secondary" size="sm">
                      Real-time counters and status indicators for active operations
                    </NeumorphicText>
                  </div>
                  <div className="space-y-2">
                    <NeumorphicText className="font-medium">💬 Rich Popups</NeumorphicText>
                    <NeumorphicText variant="secondary" size="sm">
                      Detailed information cards with neumorphic styling and actions
                    </NeumorphicText>
                  </div>
                  <div className="space-y-2">
                    <NeumorphicText className="font-medium">🎨 Theme Integration</NeumorphicText>
                    <NeumorphicText variant="secondary" size="sm">
                      Full neumorphic theme support with dark/light mode compatibility
                    </NeumorphicText>
                  </div>
                  <div className="space-y-2">
                    <NeumorphicText className="font-medium">⚡ Performance</NeumorphicText>
                    <NeumorphicText variant="secondary" size="sm">
                      Optimized rendering with SSR support and lazy loading
                    </NeumorphicText>
                  </div>
                </div>
              </NeumorphicCard>
            </div>
          </NeumorphicCard>
        </LazyLoad>

        {/* Responsive Testing Indicator */}
        <NeumorphicCard className="fixed bottom-4 right-4 p-3 z-50">
          <NeumorphicText size="sm" className="font-mono">
            <span className="block sm:hidden">📱 Mobile</span>
            <span className="hidden sm:block md:hidden">📱 Tablet</span>
            <span className="hidden md:block lg:hidden">💻 Desktop</span>
            <span className="hidden lg:block">🖥️ Large</span>
          </NeumorphicText>
        </NeumorphicCard>
      </div>
    </NeumorphicBackground>
  );
} 