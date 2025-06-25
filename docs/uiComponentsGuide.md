# VETTPRO UI Components Guide

## Table of Contents
1. [Overview](#overview)
2. [Folder Structure](#folder-structure)
3. [Neumorphic Design System](#neumorphic-design-system)
4. [Core Components](#core-components)
5. [Data Display Components](#data-display-components)
6. [Form Components](#form-components)
7. [Chart Components](#chart-components)
8. [Layout Patterns](#layout-patterns)
9. [Component Reuse Guidelines](#component-reuse-guidelines)
10. [Common Mistakes to Avoid](#common-mistakes-to-avoid)

---

## Overview

VETTPRO uses a comprehensive neumorphic design system with pre-built components that should be reused rather than recreated. This guide provides detailed instructions on how to properly use existing components, understand their props, and follow established patterns.

### Key Principles
- **Reuse over Recreation**: Always check existing components before creating new ones
- **Neumorphic First**: All components must follow the neumorphic design theme
- **TypeScript Strict**: Full type safety with proper interfaces
- **Responsive Design**: Mobile-first approach with proper breakpoints
- **Accessibility**: WCAG AA compliance with proper ARIA support

---

## Folder Structure

### Component Organization
```
src/
├── components/
│   ├── ui/
│   │   ├── neumorphic/           # Core neumorphic components
│   │   ├── NeumorphicDataTable.tsx
│   │   ├── LazyLoad.tsx
│   │   └── ...
│   ├── forms/                    # Form-specific components
│   │   ├── identity/             # SA ID, Phone, Address
│   │   ├── business/             # Company Reg, VAT
│   │   ├── advanced/             # DatePicker, etc.
│   │   ├── selection/            # Dropdowns, Multi-select
│   │   └── examples/             # Form demos
│   ├── charts/
│   │   ├── apex/                 # ApexCharts components
│   │   └── PlaceholderLineChart.tsx
│   ├── examples/                 # Component demos
│   └── layout/                   # Layout components
├── types/                        # TypeScript interfaces
│   ├── table.ts
│   ├── consent.ts
│   ├── vetting.ts
│   └── ...
└── lib/
    ├── sample-data/              # Sample data for demos
    └── utils/                    # Utility functions
```

### File Naming Conventions
- **Components**: PascalCase (e.g., `NeumorphicCard.tsx`)
- **Types**: camelCase with descriptive names (e.g., `consentTypes.ts`)
- **Sample Data**: camelCase ending in "Sample" (e.g., `consentRequestsSample.ts`)
- **Examples**: PascalCase ending in "Demo" (e.g., `FormComponentsDemo.tsx`)

---

## Neumorphic Design System

### Core Principles
The neumorphic design system creates soft, tactile interfaces using:
- **Multi-layer shadows**: Dark shadows only (no light shadows)
- **Glass-morphism integration**: Backdrop blur effects
- **Ultra-compact spacing**: CSS custom properties for consistent spacing
- **Subtle gradients**: Soft background transitions

### CSS Variables Usage
Always use CSS custom properties for consistency:

```css
/* Spacing */
var(--neumorphic-spacing-xs)    /* 4px */
var(--neumorphic-spacing-sm)    /* 8px */
var(--neumorphic-spacing-md)    /* 16px */
var(--neumorphic-spacing-lg)    /* 24px */
var(--neumorphic-spacing-xl)    /* 32px */

/* Shadows */
var(--neumorphic-shadow-convex)
var(--neumorphic-shadow-concave)
var(--neumorphic-card)

/* Colors */
var(--neumorphic-text-primary)
var(--neumorphic-text-secondary)
var(--neumorphic-border)
var(--neumorphic-bg)
```

### Theme Integration
Use `next-themes` for light/dark mode:
```tsx
import { useTheme } from 'next-themes';

// Components automatically respect theme via CSS variables
// No manual theme handling needed in most cases
```

---

## Core Components

### NeumorphicBackground
**Purpose**: Page/section container with neumorphic styling
**Location**: `src/components/ui/neumorphic/index.tsx`

```tsx
import { NeumorphicBackground } from '@/components/ui/neumorphic';

<NeumorphicBackground className="min-h-screen">
  {/* Page content */}
</NeumorphicBackground>
```

**Props**:
- `className?`: Additional CSS classes
- `children`: React nodes
- Standard HTML div attributes

### NeumorphicCard
**Purpose**: Primary container for content sections
**Location**: `src/components/ui/neumorphic/index.tsx`

```tsx
import { NeumorphicCard } from '@/components/ui/neumorphic';

<NeumorphicCard>
  <NeumorphicHeading>Section Title</NeumorphicHeading>
  <NeumorphicText>Content goes here</NeumorphicText>
</NeumorphicCard>
```

**Props**:
- `className?`: Additional CSS classes
- `children`: React nodes
- Standard HTML div attributes

### NeumorphicHeading
**Purpose**: Section headings with consistent styling
**Location**: `src/components/ui/neumorphic/index.tsx`

```tsx
<NeumorphicHeading>Page Title</NeumorphicHeading>
```

**Props**:
- `className?`: Additional CSS classes
- `children`: React nodes
- Standard HTML h1 attributes

### NeumorphicText
**Purpose**: Body text with variant support
**Location**: `src/components/ui/neumorphic/index.tsx`

```tsx
<NeumorphicText variant="primary" size="md">
  Primary text content
</NeumorphicText>

<NeumorphicText variant="secondary" size="sm">
  Secondary/muted text
</NeumorphicText>
```

**Props**:
- `variant?`: `"primary" | "secondary"` (default: "primary")
- `size?`: `"sm" | "md" | "lg"` (default: "md")
- `className?`: Additional CSS classes
- `children`: React nodes

### NeumorphicStatsCard
**Purpose**: Display key metrics with icons
**Location**: `src/components/ui/neumorphic/index.tsx`

```tsx
import { CheckCircleIcon } from 'lucide-react';

<NeumorphicStatsCard
  title="Completed Today"
  value="12"
  icon={<CheckCircleIcon className="w-6 h-6 text-green-400" />}
/>
```

**Props**:
- `title`: string - Card title
- `value`: string - Main metric value
- `icon`: ReactElement - Icon component
- `className?`: Additional CSS classes

### NeumorphicBadge
**Purpose**: Status indicators and labels
**Location**: `src/components/ui/neumorphic/index.tsx`

```tsx
<NeumorphicBadge variant="success">Approved</NeumorphicBadge>
<NeumorphicBadge variant="warning">Pending</NeumorphicBadge>
<NeumorphicBadge variant="danger">Rejected</NeumorphicBadge>
<NeumorphicBadge variant="secondary">Draft</NeumorphicBadge>
<NeumorphicBadge variant="outline">Type</NeumorphicBadge>
```

**Props**:
- `variant`: `"success" | "warning" | "danger" | "secondary" | "outline"`
- `className?`: Additional CSS classes
- `children`: React nodes

---

## Data Display Components

### NeumorphicDataTable
**Purpose**: Feature-rich data tables with pagination, sorting, filtering
**Location**: `src/components/ui/NeumorphicDataTable.tsx`

```tsx
import { NeumorphicDataTable } from '@/components/ui/NeumorphicDataTable';
import { TableColumn, TableAction } from '@/types/table';

// Define columns
const columns: TableColumn<DataType>[] = [
  {
    id: 'id',
    header: 'ID',
    accessorKey: 'id',
    sortable: true,
    filterable: true,
    width: 100,
  },
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
    sortable: true,
    filterable: true,
    width: 200,
    cell: (value, row) => (
      <span className="font-medium">{value}</span>
    ),
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    sortable: true,
    width: 120,
    cell: (value, row) => (
      <NeumorphicBadge variant={getStatusVariant(value)}>
        {value}
      </NeumorphicBadge>
    ),
  },
];

// Define actions
const rowActions: TableAction<DataType>[] = [
  {
    id: 'edit',
    label: 'Edit',
    icon: Edit,
    onClick: (row) => handleEdit(row),
    visible: (row) => row.status !== 'completed',
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: Trash,
    onClick: (row) => handleDelete(row),
    variant: 'destructive',
  },
];

<NeumorphicDataTable
  data={tableData}
  columns={columns}
  rowActions={rowActions}
  features={{
    pagination: true,
    sorting: true,
    filtering: false, // Use custom filters
    search: false,    // Use custom search
    columnVisibility: true,
    export: true,
    density: true,
  }}
  onRowClick={(row) => handleRowClick(row)}
  loading={isLoading}
/>
```

**Key Props**:
- `data`: Array of data objects
- `columns`: Column definitions with accessors and renderers
- `rowActions?`: Action buttons for each row
- `features?`: Enable/disable table features
- `onRowClick?`: Row click handler
- `loading?`: Loading state

### NeumorphicTable (Basic)
**Purpose**: Simple table without advanced features
**Location**: `src/components/ui/neumorphic/index.tsx`

```tsx
import { 
  NeumorphicTable,
  NeumorphicTableHeader,
  NeumorphicTableBody,
  NeumorphicTableRow,
  NeumorphicTableHead,
  NeumorphicTableCell,
} from '@/components/ui/neumorphic';

<NeumorphicTable>
  <NeumorphicTableHeader>
    <NeumorphicTableRow>
      <NeumorphicTableHead>ID</NeumorphicTableHead>
      <NeumorphicTableHead>Name</NeumorphicTableHead>
      <NeumorphicTableHead>Status</NeumorphicTableHead>
    </NeumorphicTableRow>
  </NeumorphicTableHeader>
  <NeumorphicTableBody>
    {data.map(item => (
      <NeumorphicTableRow key={item.id}>
        <NeumorphicTableCell>{item.id}</NeumorphicTableCell>
        <NeumorphicTableCell>{item.name}</NeumorphicTableCell>
        <NeumorphicTableCell>
          <NeumorphicBadge variant="success">
            {item.status}
          </NeumorphicBadge>
        </NeumorphicTableCell>
      </NeumorphicTableRow>
    ))}
  </NeumorphicTableBody>
</NeumorphicTable>
```

---

## Form Components

### South African Identity Components

#### SAIdInput
**Purpose**: South African ID number validation with demographic extraction
**Location**: `src/components/forms/identity/SAIdInput.tsx`

```tsx
import { SAIdInput } from '@/components/forms/identity/SAIdInput';

<SAIdInput
  value={formData.idNumber}
  onChange={(value) => setFormData(prev => ({ ...prev, idNumber: value }))}
  showDetails={true} // Shows extracted demographics
/>
```

**Props**:
- `value`: string - Current ID value
- `onChange`: (value: string) => void - Change handler
- `showDetails?`: boolean - Show demographic extraction
- `className?`: Additional CSS classes

#### PhoneInput
**Purpose**: SA phone number validation and formatting
**Location**: `src/components/forms/identity/PhoneInput.tsx`

```tsx
import { PhoneInput } from '@/components/forms/identity/PhoneInput';

<PhoneInput
  value={formData.phone}
  onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
  showType={true} // Shows mobile/landline detection
/>
```

**Props**:
- `value`: string - Current phone value
- `onChange`: (value: string) => void - Change handler
- `showType?`: boolean - Show phone type detection
- `className?`: Additional CSS classes

#### AddressInput
**Purpose**: SA address input with province validation
**Location**: `src/components/forms/identity/AddressInput.tsx`

```tsx
import { AddressInput } from '@/components/forms/identity/AddressInput';

<AddressInput
  value={formData.address}
  onChange={(address) => setFormData(prev => ({ ...prev, address }))}
  label="Residential Address"
/>
```

**Props**:
- `value`: AddressData object
- `onChange`: (address: AddressData) => void
- `label?`: string - Field label
- `className?`: Additional CSS classes

### Business Components

#### CompanyRegistrationInput
**Purpose**: SA company registration validation
**Location**: `src/components/forms/business/CompanyRegistrationInput.tsx`

```tsx
import { CompanyRegistrationInput } from '@/components/forms/business/CompanyRegistrationInput';

<CompanyRegistrationInput
  value={formData.companyReg}
  onChange={(value) => setFormData(prev => ({ ...prev, companyReg: value }))}
/>
```

#### VATInput
**Purpose**: SA VAT number validation
**Location**: `src/components/forms/business/VATInput.tsx`

```tsx
import { VATInput } from '@/components/forms/business/VATInput';

<VATInput
  value={formData.vatNumber}
  onChange={(value) => setFormData(prev => ({ ...prev, vatNumber: value }))}
/>
```

### Advanced Form Components

#### DatePicker
**Purpose**: Date selection with neumorphic styling
**Location**: `src/components/forms/advanced/DatePicker.tsx`

```tsx
import { DatePicker } from '@/components/forms/advanced/DatePicker';

<DatePicker
  value={formData.dateOfBirth}
  onChange={(date) => setFormData(prev => ({ ...prev, dateOfBirth: date }))}
  label="Date of Birth"
  placeholder="Select your date of birth"
  maxDate={new Date()} // Validation
/>
```

**Props**:
- `value`: Date | undefined
- `onChange`: (date: Date | undefined) => void
- `label?`: string - Field label
- `placeholder?`: string - Placeholder text
- `minDate?`: Date - Minimum selectable date
- `maxDate?`: Date - Maximum selectable date

### Basic Input Components

#### NeumorphicInput
**Purpose**: Standard text input with neumorphic styling
**Location**: `src/components/ui/neumorphic/index.tsx`

```tsx
import { NeumorphicInput } from '@/components/ui/neumorphic';

<NeumorphicInput
  type="email"
  value={formData.email}
  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
  placeholder="john@example.com"
  className="w-full"
/>
```

#### NeumorphicTextarea
**Purpose**: Multi-line text input
**Location**: `src/components/ui/neumorphic/NeumorphicTextarea.tsx`

```tsx
import { NeumorphicTextarea } from '@/components/ui/neumorphic';

<NeumorphicTextarea
  value={formData.notes}
  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
  placeholder="Enter notes..."
  rows={4}
/>
```

---

## Chart Components

### ApexCharts Integration
**Location**: `src/components/charts/apex/`

#### Basic Chart Usage
```tsx
import { BasicDemo } from '@/components/charts/apex/examples/BasicDemo';
import { VettingLineChartsDemo } from '@/components/charts/apex/examples/VettingLineChartsDemo';

// Wrap charts in LazyLoad for performance
<LazyLoad fallback={<NeumorphicCard className="animate-pulse h-96" />}>
  <NeumorphicCard>
    <VettingLineChartsDemo />
  </NeumorphicCard>
</LazyLoad>
```

#### Available Chart Types
- `BasicDemo`: Simple line/bar charts
- `VettingLineChartsDemo`: 5 different line chart variations
- `VettingBarChartsDemo`: 6 different bar chart variations  
- `PieDonutChartsDemo`: Pie and donut charts

### Placeholder Charts
**Purpose**: Loading states and fallbacks
**Location**: `src/components/charts/PlaceholderLineChart.tsx`

```tsx
import PlaceholderLineChart from '@/components/charts/PlaceholderLineChart';

<NeumorphicCard>
  <PlaceholderLineChart />
</NeumorphicCard>
```

---

## Layout Patterns

### Standard Page Layout
```tsx
import { 
  NeumorphicBackground,
  NeumorphicCard,
  NeumorphicHeading,
  NeumorphicText,
  NeumorphicStatsCard
} from '@/components/ui/neumorphic';

export default function MyPage() {
  return (
    <NeumorphicBackground className="min-h-screen">
      <div className="w-full space-y-1">
        {/* Header Section */}
        <NeumorphicCard>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <NeumorphicHeading>Page Title</NeumorphicHeading>
              <NeumorphicText variant="secondary" className="leading-tight">
                Page description and context.
              </NeumorphicText>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Action buttons */}
            </div>
          </div>
        </NeumorphicCard>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <NeumorphicStatsCard title="Metric 1" value="24" icon={<Icon />} />
          {/* More stats cards */}
        </div>

        {/* Main Content */}
        <NeumorphicCard>
          {/* Table, forms, or other content */}
        </NeumorphicCard>
      </div>
    </NeumorphicBackground>
  );
}
```

### Grid Layouts
```tsx
{/* Responsive grid */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
  <NeumorphicCard>Content 1</NeumorphicCard>
  <NeumorphicCard>Content 2</NeumorphicCard>
</div>

{/* Stats grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
  {statsCards.map(card => (
    <NeumorphicStatsCard key={card.id} {...card} />
  ))}
</div>
```

---

## Component Reuse Guidelines

### Before Creating New Components

1. **Check Existing Components**: Always search the codebase first
   ```bash
   # Search for similar components
   grep -r "ComponentName" src/components/
   ```

2. **Review UI Elements Page**: Check `src/app/dashboard/ui-elements/page.tsx` for examples

3. **Check Component Libraries**:
   - `src/components/ui/neumorphic/` - Core components
   - `src/components/forms/` - Form components
   - `src/components/charts/` - Chart components

### Extending Existing Components

Instead of creating new components, extend existing ones:

```tsx
// ❌ Don't create a new component
const MyCustomCard = ({ children }) => (
  <div className="custom-card-styles">
    {children}
  </div>
);

// ✅ Extend existing component
<NeumorphicCard className="additional-custom-styles">
  {children}
</NeumorphicCard>
```

### Component Composition

Use composition to build complex UIs:

```tsx
// ✅ Good: Compose existing components
const ConsentStatusCard = ({ data }) => (
  <NeumorphicCard>
    <div className="flex items-center justify-between">
      <NeumorphicText size="lg" className="font-semibold">
        Consent Status
      </NeumorphicText>
      <NeumorphicBadge variant={getStatusVariant(data.status)}>
        {data.status}
      </NeumorphicBadge>
    </div>
    <NeumorphicText variant="secondary" className="mt-2">
      Last updated: {formatDate(data.lastUpdated)}
    </NeumorphicText>
  </NeumorphicCard>
);
```

### TypeScript Best Practices

1. **Extend Existing Interfaces**:
```tsx
interface MyTableRow extends Record<string, unknown> {
  id: string;
  name: string;
  status: ConsentRequestStatus;
}
```

2. **Use Proper Prop Types**:
```tsx
interface MyComponentProps {
  data: ConsentRequestItem[];
  onSelect: (item: ConsentRequestItem) => void;
  loading?: boolean;
}
```

3. **Import Types Correctly**:
```tsx
import { TableColumn, TableAction } from '@/types/table';
import { ConsentRequestStatus } from '@/types/consent';
```

---

## Common Mistakes to Avoid

### 1. Creating Duplicate Components
❌ **Wrong**:
```tsx
// Don't create when NeumorphicCard exists
const MyCard = ({ children }) => (
  <div className="p-6 rounded-lg bg-card shadow-lg">
    {children}
  </div>
);
```

✅ **Correct**:
```tsx
<NeumorphicCard className="additional-styles">
  {children}
</NeumorphicCard>
```

### 2. Ignoring Neumorphic Design System
❌ **Wrong**:
```tsx
<div className="bg-white shadow-md p-4 rounded">
  Content
</div>
```

✅ **Correct**:
```tsx
<NeumorphicCard>
  Content
</NeumorphicCard>
```

### 3. Manual Table Implementation
❌ **Wrong**:
```tsx
<table className="custom-table">
  <thead>
    <tr>
      <th>Header</th>
    </tr>
  </thead>
  <tbody>
    {data.map(item => (
      <tr key={item.id}>
        <td>{item.name}</td>
      </tr>
    ))}
  </tbody>
</table>
```

✅ **Correct**:
```tsx
<NeumorphicDataTable
  data={data}
  columns={columns}
  features={{ pagination: true, sorting: true }}
/>
```

### 4. Inconsistent Spacing
❌ **Wrong**:
```tsx
<div className="p-4 m-2 gap-3">
```

✅ **Correct**:
```tsx
<div className="p-[var(--neumorphic-spacing-lg)] space-y-[var(--neumorphic-spacing-sm)]">
```

### 5. Missing TypeScript Types
❌ **Wrong**:
```tsx
const handleClick = (data: any) => {
  // Process data
};
```

✅ **Correct**:
```tsx
const handleClick = (data: ConsentRequestItem) => {
  // Process data with type safety
};
```

### 6. Not Using Existing Sample Data
❌ **Wrong**:
```tsx
const data = [
  { id: 1, name: 'Test' },
  // Hardcoded data
];
```

✅ **Correct**:
```tsx
import { getConsentRequests } from '@/lib/sample-data/consentRequestsSample';

const data = await getConsentRequests();
```

### 7. Improper Import Paths
❌ **Wrong**:
```tsx
import { NeumorphicCard } from '../../../components/ui/neumorphic/NeumorphicCard';
```

✅ **Correct**:
```tsx
import { NeumorphicCard } from '@/components/ui/neumorphic';
```

### 8. Missing LazyLoad for Heavy Components
❌ **Wrong**:
```tsx
<NeumorphicCard>
  <VettingLineChartsDemo />
</NeumorphicCard>
```

✅ **Correct**:
```tsx
<LazyLoad fallback={<NeumorphicCard className="animate-pulse h-96" />}>
  <NeumorphicCard>
    <VettingLineChartsDemo />
  </NeumorphicCard>
</LazyLoad>
```

---

## Quick Reference Checklist

### Before Creating a Component:
- [ ] Searched existing components in `/ui/neumorphic/`
- [ ] Checked form components in `/forms/`
- [ ] Reviewed UI Elements page for examples
- [ ] Confirmed no existing component meets the need
- [ ] Planned to extend existing component instead

### When Using Components:
- [ ] Imported from correct path using `@/` alias
- [ ] Used proper TypeScript interfaces
- [ ] Applied neumorphic design principles
- [ ] Used CSS custom properties for spacing/colors
- [ ] Added proper accessibility attributes
- [ ] Implemented responsive design

### For Tables:
- [ ] Used `NeumorphicDataTable` for complex tables
- [ ] Defined proper `TableColumn` interfaces
- [ ] Implemented pagination with `features.pagination: true`
- [ ] Added row actions if needed
- [ ] Used cell renderers for custom formatting

### For Forms:
- [ ] Used SA-specific components for local data
- [ ] Implemented proper validation
- [ ] Used `NeumorphicInput` for basic inputs
- [ ] Added error states and feedback
- [ ] Followed form layout patterns

### For Charts:
- [ ] Wrapped in `LazyLoad` for performance
- [ ] Used existing chart demos as templates
- [ ] Applied neumorphic theme integration
- [ ] Added proper fallback components

---

This guide should be referenced whenever creating new UI components or modifying existing ones. Always prioritize reusing existing components over creating new ones, and ensure all components follow the established neumorphic design system and architectural patterns.
