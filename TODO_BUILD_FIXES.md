# Build Error Fixes TODO List

## High Priority - Critical Errors

### 1. DirectorCentricNetwork - Unused Variables
- **File**: `src/components/executive/DirectorCentricNetwork/index.tsx`
- **Issue**: `CENTER_X` and `CENTER_Y` are assigned but never used
- **Fix**: Add eslint-disable comments for these constants

### 2. LiveMissionControl - React Hooks Rules Violation
- **File**: `src/components/operations/LiveMissionControl.tsx`
- **Issue**: useState called at top level (line 30)
- **Fix**: Move useState inside the component function

### 3. LiveMissionControl - Unused Variables
- **File**: `src/components/operations/LiveMissionControl.tsx`
- **Issue**: Multiple unused variables (Button, activeFilter, onFilterChange, index)
- **Fix**: Add eslint-disable comments or remove unused imports

### 4. NotesSection - Unused Imports
- **File**: `src/components/operations/NotesSection.tsx`
- **Issue**: Unused imports (Download, Upload, XCircle, Clock)
- **Fix**: Remove unused imports

### 5. DocumentList - Unused Variable
- **File**: `src/components/operations/DocumentList.tsx`
- **Issue**: 'type' parameter unused in getDocumentIcon function
- **Fix**: Add eslint-disable comment

## Medium Priority - Warnings

### 6. HierarchicalNetworkTree - useMemo Dependencies
- **File**: `src/components/executive/HierarchicalNetworkTree/index.tsx`
- **Issue**: RISK_RINGS array causes useMemo dependencies to change on every render
- **Fix**: Wrap RISK_RINGS initialization in useMemo

### 7. SignatureAnalysisModal - useCallback Dependencies
- **File**: `src/components/vetting/SignatureAnalysisModal.tsx`
- **Issue**: runAnalysisAnimation function changes on every render
- **Fix**: Wrap in useCallback or move inside useEffect

## Low Priority - Minor Issues

### 8. UI Components - Unused Imports
- **File**: `src/components/ui/toast.tsx`
- **Issue**: Unused imports (Filter, Eye, RotateCcw, getCssVariable)
- **Fix**: Remove unused imports

### 9. UI Components - Empty Interface
- **File**: `src/components/ui/textarea.tsx`
- **Issue**: Empty interface declaration
- **Fix**: Remove empty interface or add properties

### 10. SignatureAnalysisModal - Unused Import
- **File**: `src/components/vetting/SignatureAnalysisModal.tsx`
- **Issue**: useCallback imported but not used
- **Fix**: Remove unused import

## Fix Strategy
1. Start with critical errors (1-5)
2. Move to warnings (6-7)
3. Finish with minor issues (8-10)
4. Use eslint-disable comments for unused variables to preserve functionality
5. Remove truly unused imports
6. Fix React Hooks violations by moving code to proper locations 