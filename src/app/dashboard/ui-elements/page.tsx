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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
} from "@/components/ui/neumorphic";
import { ActivityIcon, AlertCircleIcon, CheckCircleIcon, ClockIcon } from "lucide-react";

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
                <DialogContent variant="neumorphic">
                  <DialogHeader>
                    <DialogTitle>Neumorphic Dialog</DialogTitle>
                    <DialogDescription>
                      This is a test of the neumorphic effect on a dialog.
                    </DialogDescription>
                  </DialogHeader>
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