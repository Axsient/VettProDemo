# Operations Dashboard Components

This directory contains specialized dialog components and interactive elements for the Operations Dashboard. All components are built using the neumorphic design system and follow TypeScript best practices.

## Components Overview

### Dialog Components

#### 1. TimelineDialog.tsx
**Purpose**: Displays a vertical timeline of case events with detailed history

**Features**:
- Vertical timeline with chronological events
- Color-coded severity indicators (success, warning, error, info)
- Expandable event details on click
- Scrollable history with proper overflow handling
- Export functionality (CSV format)
- User attribution for each event
- Timestamp formatting with relative time display

**Props**:
```typescript
interface TimelineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  caseNumber: string;
  entityName: string;
  events: CaseTimelineEvent[];
}
```

**Usage**:
```typescript
import { TimelineDialog } from '@/components/operations';

<TimelineDialog
  isOpen={showTimeline}
  onClose={() => setShowTimeline(false)}
  caseNumber="VET-2024-001234"
  entityName="John Smith"
  events={caseTimelineEvents}
/>
```

#### 2. DossierDialog.tsx
**Purpose**: Comprehensive interim investigation dossier viewer matching the design requirements

**Features**:
- Multi-section navigation (Overview, Check Results, Key Findings, Documents, Subject Info)
- Executive summary with progress indicators
- Risk assessment visualization
- Check results with status badges
- Key findings categorization
- Document management interface
- Export functionality for reports
- Responsive grid layouts

**Props**:
```typescript
interface DossierDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dossier: CaseDossier;
}
```

**Usage**:
```typescript
import { DossierDialog } from '@/components/operations';

<DossierDialog
  isOpen={showDossier}
  onClose={() => setShowDossier(false)}
  dossier={caseDossierData}
/>
```

#### 3. EditCaseDialog.tsx
**Purpose**: Form-based case editing with validation and change tracking

**Features**:
- Priority, status, and officer assignment forms
- Real-time validation with error messages
- Change comparison (current vs new values)
- Dirty state tracking with unsaved changes warning
- Business logic validation (e.g., urgent cases approval rules)
- Audit trail integration
- Loading states and submission feedback

**Props**:
```typescript
interface EditCaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: OpsCase;
  onSave: (updatedCase: Partial<OpsCase>) => void;
}
```

**Usage**:
```typescript
import { EditCaseDialog } from '@/components/operations';

<EditCaseDialog
  isOpen={showEdit}
  onClose={() => setShowEdit(false)}
  caseData={selectedCase}
  onSave={handleCaseUpdate}
/>
```

#### 4. ApproveRejectDialog.tsx
**Purpose**: Approval/rejection workflow with mandatory comments and reason tracking

**Features**:
- Dual-mode UI (approve vs reject styling)
- Mandatory comment validation
- Predefined reason selection for rejections
- Case summary with affected entities
- Post-action workflow information
- Comment length validation (10-1000 characters)
- Confirmation warnings and audit trail

**Props**:
```typescript
interface ApproveRejectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  action: 'approve' | 'reject';
  cases: OpsCase[];
  onSubmit: (action: 'approve' | 'reject', comment: string, metadata?: any) => void;
}
```

**Usage**:
```typescript
import { ApproveRejectDialog } from '@/components/operations';

<ApproveRejectDialog
  isOpen={showApproval}
  onClose={() => setShowApproval(false)}
  action="approve"
  cases={selectedCases}
  onSubmit={handleApprovalDecision}
/>
```

### Interactive Components

#### 5. IntelligenceFeed.tsx
**Purpose**: Real-time intelligence feed with live updates and notifications

**Features**:
- Real-time event simulation (updates every 10 seconds)
- Live/pause toggle functionality
- Event filtering by severity
- Pagination with 10 events per page
- Browser notification support
- Clickable case numbers with navigation
- Event type categorization with icons
- Expandable event details
- Refresh functionality
- Responsive timestamp formatting

**Props**:
```typescript
interface IntelligenceFeedProps {
  onEventClick?: (event: IntelligenceFeedEvent) => void;
  onCaseClick?: (caseNumber: string) => void;
  className?: string;
}
```

**Usage**:
```typescript
import { IntelligenceFeed } from '@/components/operations';

<IntelligenceFeed
  onEventClick={handleEventSelection}
  onCaseClick={navigateToCase}
  className="h-96"
/>
```

## Design System Integration

### Neumorphic Design
All components use the neumorphic design system with:
- CSS custom properties for theming
- Consistent border radius and spacing
- Shadow effects for depth perception
- Theme-aware color schemes
- Smooth transitions and animations

### Component Patterns
- **Error Boundaries**: Components include proper error handling
- **Loading States**: All async operations show loading feedback
- **Validation**: Form components include comprehensive validation
- **Accessibility**: ARIA labels and keyboard navigation support
- **Responsive Design**: Mobile-friendly layouts and breakpoints

## Data Integration

### Sample Data Usage
Components integrate with the operations dashboard sample data:
- `operations-dashboard-data.ts` provides structured data
- Type-safe interfaces for all data structures
- Helper functions for formatting and calculations
- South African business context (ZAR currency, provinces, etc.)

### API Migration Path
- Components designed for easy API integration
- Props match expected API response structures
- Async operation patterns for future backend integration
- Error handling for network requests

## Error Handling

### Validation Patterns
- Field-level validation with immediate feedback
- Form-level validation before submission
- Business logic validation (priority/status combinations)
- Length and format validation for text inputs

### Error States
- Loading spinners for async operations
- Error messages with specific guidance
- Fallback UI for component failures
- Network error handling with retry options

## Performance Considerations

### Optimization Techniques
- React.memo for expensive components
- Lazy loading for large datasets
- Debounced search and filter operations
- Virtualization for long lists (if needed)
- Efficient re-rendering patterns

### Memory Management
- Cleanup of intervals and timers
- Event listener removal on unmount
- Proper dependency arrays in useEffect
- Avoiding memory leaks in real-time updates

## Testing Guidelines

### Component Testing
- Unit tests for validation logic
- Integration tests for dialog workflows
- Snapshot tests for UI consistency
- Accessibility testing with screen readers

### Data Flow Testing
- Props validation and type checking
- Event handler testing
- State management verification
- Error boundary testing

## Usage Examples

### Basic Implementation
```typescript
import { 
  TimelineDialog,
  DossierDialog,
  EditCaseDialog,
  ApproveRejectDialog,
  IntelligenceFeed 
} from '@/components/operations';

function OperationsDashboard() {
  const [selectedCase, setSelectedCase] = useState<OpsCase | null>(null);
  const [dialogState, setDialogState] = useState({
    timeline: false,
    dossier: false,
    edit: false,
    approval: false
  });

  return (
    <div className="operations-dashboard">
      {/* Main dashboard content */}
      
      {/* Intelligence Feed */}
      <IntelligenceFeed
        onEventClick={handleEventClick}
        onCaseClick={handleCaseNavigation}
      />

      {/* Dialog Components */}
      {selectedCase && (
        <>
          <TimelineDialog
            isOpen={dialogState.timeline}
            onClose={() => setDialogState(prev => ({ ...prev, timeline: false }))}
            caseNumber={selectedCase.caseNumber}
            entityName={selectedCase.entity.name}
            events={getCaseTimeline(selectedCase.id)}
          />

          <DossierDialog
            isOpen={dialogState.dossier}
            onClose={() => setDialogState(prev => ({ ...prev, dossier: false }))}
            dossier={getCaseDossier(selectedCase.id)}
          />

          <EditCaseDialog
            isOpen={dialogState.edit}
            onClose={() => setDialogState(prev => ({ ...prev, edit: false }))}
            caseData={selectedCase}
            onSave={handleCaseUpdate}
          />
        </>
      )}
    </div>
  );
}
```

### Advanced Integration
```typescript
// Custom hooks for operations management
function useOperationsDialogs() {
  const [dialogs, setDialogs] = useState({
    timeline: { open: false, caseId: null },
    dossier: { open: false, caseId: null },
    edit: { open: false, caseId: null },
    approval: { open: false, action: null, cases: [] }
  });

  const openDialog = useCallback((type: string, payload: any) => {
    setDialogs(prev => ({
      ...prev,
      [type]: { open: true, ...payload }
    }));
  }, []);

  const closeDialog = useCallback((type: string) => {
    setDialogs(prev => ({
      ...prev,
      [type]: { ...prev[type], open: false }
    }));
  }, []);

  return { dialogs, openDialog, closeDialog };
}
```

## Future Enhancements

### Planned Features
- Real backend API integration
- Advanced filtering and search
- Bulk operation improvements
- Enhanced mobile responsiveness
- Offline capability support

### Performance Improvements
- Virtual scrolling for large datasets
- Optimistic updates for better UX
- Caching strategies for frequently accessed data
- Background sync for real-time updates

## Dependencies

### Required UI Components
- `Dialog` components with neumorphic variants
- `Button`, `Input`, `Badge` components
- `ScrollArea`, `Label`, `Select` components
- `NeumorphicTextarea` from neumorphic system

### External Libraries
- Lucide React for icons
- Date manipulation utilities
- CSV export functionality
- Notification API (browser)

## Troubleshooting

### Common Issues
1. **Dialog not opening**: Check `isOpen` prop and parent state management
2. **Validation errors**: Verify form data structure and validation rules
3. **Real-time updates not working**: Check interval setup and cleanup
4. **Export functionality failing**: Verify browser support for File API

### Debug Tips
- Use React DevTools for state inspection
- Check console for validation errors
- Verify sample data structure matches interfaces
- Test with different browser notification settings