### **Pre-requisite: Update Your Neumorphic Theme ✅ COMPLETED**

To support the new components, let's add a few color variables to `neumorphic.css`. This ensures all colors are managed centrally.

Add these variables inside your `:root { ... }` and `.light { ... }` blocks in `src/styles/themes/neumorphic.css`.

```css
/* Add to :root in neumorphic.css */
--neumorphic-severity-critical: #ef4444; /* red-500 */
--neumorphic-severity-high: #f97316;     /* orange-500 */
--neumorphic-severity-medium: #eab308;  /* yellow-500 */
--neumorphic-severity-low: #3b82f6;      /* blue-500 */

/* Add to .light in neumorphic.css */
--neumorphic-severity-critical: #dc2626; /* red-600 */
--neumorphic-severity-high: #ea580c;     /* orange-600 */
--neumorphic-severity-medium: #ca8a04;  /* yellow-600 */
--neumorphic-severity-low: #2563eb;      /* blue-600 */
```

---

### **Component 1: `CircularProgressRing` ✅ COMPLETED**

This component is essential for visually representing the AI Risk Score. We'll use SVG for crisp, scalable graphics.

**Step 1: Create the Component File**
*   **Path:** `src/components/ui/CircularProgressRing.tsx`

**Step 2: Add the Component Code**
This component calculates the SVG path for the progress ring and applies theme-aware colors.

```typescript
// src/components/ui/CircularProgressRing.tsx
import React from 'react';

interface CircularProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const CircularProgressRing: React.FC<CircularProgressRingProps> = ({
  percentage,
  size = 40,
  strokeWidth = 4,
  className,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const getRingColor = () => {
    if (percentage >= 90) return 'var(--neumorphic-severity-low)'; // Blue/Green for good scores
    if (percentage >= 60) return 'var(--neumorphic-severity-medium)'; // Yellow for caution
    return 'var(--neumorphic-severity-critical)'; // Red for low scores
  };

  return (
    <div className={className} style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="var(--neumorphic-card-end)" // Use a subtle background color from your theme
          strokeWidth={strokeWidth}
          strokeOpacity={0.5}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={getRingColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.5s ease-out, stroke 0.5s ease' }}
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center text-xs font-semibold"
        style={{ color: 'var(--neumorphic-text-primary)' }}
      >
        {Math.round(percentage)}
      </div>
    </div>
  );
};

export default CircularProgressRing;
```

**Step 3: Test on UI Elements Page**
*   **Path:** `src/app/dashboard/ui-elements/page.tsx`
*   **Add this code snippet:**

```tsx
// At the top of page.tsx
import CircularProgressRing from '@/components/ui/CircularProgressRing';

// Inside the return statement, within a NeumorphicCard
<NeumorphicCard>
  <NeumorphicHeading>Circular Progress Rings</NeumorphicHeading>
  <div className="flex items-center gap-6 mt-4">
    <CircularProgressRing percentage={95} />
    <CircularProgressRing percentage={75} />
    <CircularProgressRing percentage={45} />
  </div>
</NeumorphicCard>
```

---

### **Component 2: `FlagBadge` ✅ COMPLETED**

A more visually impactful badge specifically for displaying risk flags.

**Step 1: Create the Component File**
*   **Path:** `src/components/ui/FlagBadge.tsx`

**Step 2: Add the Component Code**
This component combines a Lucide icon with colored text and a subtle background.

```typescript
// src/components/ui/FlagBadge.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, ShieldAlert, BadgeCheck, Info } from 'lucide-react';

type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

interface FlagBadgeProps {
  severity: Severity;
  children: React.ReactNode;
  className?: string;
}

const severityConfig = {
  Critical: {
    icon: ShieldAlert,
    color: 'var(--neumorphic-severity-critical)',
    bgOpacity: 'bg-opacity-15',
  },
  High: {
    icon: AlertTriangle,
    color: 'var(--neumorphic-severity-high)',
    bgOpacity: 'bg-opacity-15',
  },
  Medium: {
    icon: Info,
    color: 'var(--neumorphic-severity-medium)',
    bgOpacity: 'bg-opacity-15',
  },
  Low: {
    icon: BadgeCheck,
    color: 'var(--neumorphic-severity-low)',
    bgOpacity: 'bg-opacity-15',
  },
};

const FlagBadge: React.FC<FlagBadgeProps> = ({ severity, children, className }) => {
  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium',
        'border',
        config.bgOpacity,
        className
      )}
      style={{
        color: config.color,
        borderColor: config.color,
        backgroundColor: `${config.color.slice(0,-1)}, 0.1)`, // Manually create rgba
      }}
    >
      <Icon className="h-3.5 w-3.5" />
      {children}
    </div>
  );
};

export default FlagBadge;
```

**Step 3: Test on UI Elements Page**
*   **Path:** `src/app/dashboard/ui-elements/page.tsx`
*   **Add this code snippet:**

```tsx
// At the top of page.tsx
import FlagBadge from '@/components/ui/FlagBadge';

// Inside the return statement, within a NeumorphicCard
<NeumorphicCard>
  <NeumorphicHeading>Flag Badges</NeumorphicHeading>
  <div className="flex flex-wrap items-center gap-4 mt-4">
    <FlagBadge severity="Critical">Post-Completion Billing</FlagBadge>
    <FlagBadge severity="High">Price Discrepancy</FlagBadge>
    <FlagBadge severity="Medium">Slippery Slope Pattern</FlagBadge>
    <FlagBadge severity="Low">Minor Compliance Issue</FlagBadge>
  </div>
</NeumorphicCard>
```

---

### **Component 3: `DNALink` and the `InvoiceAnalysisView` ✅ COMPLETED**

These two are built together as they are co-dependent. `DNALink` is the visual element, and `InvoiceAnalysisView` is the container that orchestrates the entire scene.

**Step 1: Installation**
You will need a library for smooth animations. `Framer Motion` is perfect and works well with Next.js and Tailwind.
```bash
npm install framer-motion
```

**Step 2: Create `DNALink` Component**
*   **Path:** `src/components/features/DNALink.tsx`

```typescript
// src/components/features/DNALink.tsx
"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type DNAStatus = 'match' | 'mismatch' | 'unsolicited_rfp' | 'unsolicited_invoice';

interface DNALinkProps {
  rfpLabel: string;
  rfpValue?: string;
  invoiceLabel: string;
  invoiceValue?: string;
  status: DNAStatus;
}

export const DNALink: React.FC<DNALinkProps> = ({ rfpLabel, rfpValue, invoiceLabel, invoiceValue, status }) => {
  const statusConfig = {
    match: {
      lineColor: 'var(--neumorphic-severity-low)', // Use low severity color (blue/green)
      glow: false,
    },
    mismatch: {
      lineColor: 'var(--neumorphic-severity-high)', // Use high severity color (orange)
      glow: true,
    },
    unsolicited_rfp: {
      lineColor: 'transparent',
      glow: false,
    },
    unsolicited_invoice: {
      lineColor: 'transparent',
      glow: true,
    },
  };

  const config = statusConfig[status];

  return (
    <div className="relative flex items-center justify-between my-3 h-12">
      {/* Left Side (RFP) */}
      <div className={cn("text-right w-5/12", status === 'unsolicited_invoice' && 'opacity-30')}>
        <p className="text-sm font-medium text-neumorphic-text-primary">{rfpLabel}</p>
        {rfpValue && <p className="text-xs text-neumorphic-text-secondary">{rfpValue}</p>}
      </div>

      {/* Center Connector */}
      <div className="absolute left-1/2 top-1/2 w-2/12 h-px -translate-x-1/2 -translate-y-1/2" style={{ backgroundColor: config.lineColor }}>
        {config.glow && (
            <motion.div 
                className="absolute inset-0 h-full w-full"
                style={{ background: config.lineColor, filter: 'blur(4px)' }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
        )}
      </div>

      {/* Right Side (Invoice) */}
      <div className={cn("text-left w-5/12", status === 'unsolicited_rfp' && 'opacity-30')}>
        <p className={cn("text-sm font-medium text-neumorphic-text-primary", config.glow && "text-[var(--neumorphic-severity-high)]")}>{invoiceLabel}</p>
        {invoiceValue && <p className={cn("text-xs text-neumorphic-text-secondary", config.glow && "text-[var(--neumorphic-severity-high)]")}>{invoiceValue}</p>}
      </div>
    </div>
  );
};
```

**Step 3: Create `InvoiceAnalysisView` Component**
*   **Path:** `src/components/features/InvoiceAnalysisView.tsx`

```typescript
// src/components/features/InvoiceAnalysisView.tsx
"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { NeumorphicCard, NeumorphicHeading, NeumorphicText } from '../ui/neumorphic';
import FlagBadge from '../ui/FlagBadge';
import { DNALink } from './DNALink';

// Sample data for a single invoice - you'd pass this in as props
const sampleAnalysisData = {
  rfpItems: [
    { label: "Drill Bits (x50)", value: "R1,500 / unit" },
    { label: "Safety Gloves (x100)", value: "R50 / pair" },
    { label: "Logistics", value: "R5,000" }
  ],
  invoiceItems: [
    { label: "Drill Bits (x50)", value: "R1,875 / unit" },
    { label: "Safety Gloves (x100)", value: "R50 / pair" },
    { label: "Logistics", value: "R5,000" },
    { label: "Admin Fee", value: "R2,500" }
  ],
  llmSummary: "Invoice contains a significant price discrepancy for 'Drill Bits' (25% over quote) and an unsolicited 'Admin Fee'.",
  flags: [
    { severity: 'High', type: 'Price Discrepancy' },
    { severity: 'Medium', type: 'Unsolicited Item' }
  ]
};

export const InvoiceAnalysisView = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      {/* Left Column: DNA View */}
      <NeumorphicCard className="lg:col-span-3 p-4">
        <NeumorphicHeading>Invoice DNA Comparison</NeumorphicHeading>
        <div className="mt-4">
          <DNALink rfpLabel="Drill Bits (x50)" rfpValue="R1,500 / unit" invoiceLabel="Drill Bits (x50)" invoiceValue="R1,875 / unit" status="mismatch" />
          <DNALink rfpLabel="Safety Gloves (x100)" rfpValue="R50 / pair" invoiceLabel="Safety Gloves (x100)" invoiceValue="R50 / pair" status="match" />
          <DNALink rfpLabel="Logistics" rfpValue="R5,000" invoiceLabel="Logistics" invoiceValue="R5,000" status="match" />
          <DNALink rfpLabel="-" invoiceLabel="Admin Fee" invoiceValue="R2,500" status="unsolicited_invoice" />
        </div>
      </NeumorphicCard>

      {/* Right Column: LLM Insights */}
      <motion.div
        className="lg:col-span-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <NeumorphicCard className="p-4 border-[var(--neumorphic-severity-low)] h-full">
          <NeumorphicHeading>LLM Insights</NeumorphicHeading>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm font-semibold text-neumorphic-text-secondary mb-1">Summary</p>
              <NeumorphicText>{sampleAnalysisData.llmSummary}</NeumorphicText>
            </div>
            <div>
              <p className="text-sm font-semibold text-neumorphic-text-secondary mb-2">Flags Detected</p>
              <div className="flex flex-wrap gap-2">
                {sampleAnalysisData.flags.map((flag, i) => (
                  <FlagBadge key={i} severity={flag.severity as any}>{flag.type}</FlagBadge>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-[var(--neumorphic-border)] border-opacity-20">
              <p className="text-sm font-semibold text-neumorphic-text-secondary mb-1">Recommendation</p>
              <NeumorphicText size="lg" className="font-bold text-[var(--neumorphic-severity-critical)]">
                REJECT & ESCALATE
              </NeumorphicText>
            </div>
          </div>
        </NeumorphicCard>
      </motion.div>
    </div>
  );
};
```

**Step 4: Test on UI Elements Page**
*   **Path:** `src/app/dashboard/ui-elements/page.tsx`
*   **Add this code snippet:**

```tsx
// At the top of page.tsx
import { InvoiceAnalysisView } from '@/components/features/InvoiceAnalysisView';

// Inside the return statement, preferably in its own section
<div className="w-full space-y-1"> // Add this if you don't have a root container
  {/* ... other components */}
  <InvoiceAnalysisView />
</div>
```
