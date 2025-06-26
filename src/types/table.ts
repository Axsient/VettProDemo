export interface TableColumn<T = Record<string, unknown>> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  accessorFn?: (row: T) => unknown;
  cell?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  align?: 'left' | 'center' | 'right';
  sticky?: 'left' | 'right';
  hidden?: boolean;
  filterType?: 'text' | 'select' | 'date' | 'number';
  filterOptions?: Array<{ label: string; value: unknown }>;
  meta?: {
    filterType?: 'text' | 'select' | 'date' | 'number';
    filterOptions?: Array<{ label: string; value: unknown }>;
  };
}

export interface TableAction<T = Record<string, unknown>> {
  id: string;
  label: string;
  icon?: React.ComponentType<Record<string, unknown>>;
  variant?: 'default' | 'destructive' | 'secondary';
  onClick: (row: T) => void;
  disabled?: (row: T) => boolean;
  hidden?: (row: T) => boolean;
  condition?: (row: T) => boolean;
}

export interface BulkAction<T = Record<string, unknown>> {
  id: string;
  label: string;
  icon?: React.ComponentType<Record<string, unknown>>;
  variant?: 'default' | 'destructive' | 'secondary';
  onClick: (rows: T[]) => void;
  disabled?: (rows: T[]) => boolean;
  condition?: (rows: T[]) => boolean;
}

export interface TablePagination {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  totalRows: number;
  showSizeSelector?: boolean;
  pageSizeOptions?: number[];
}

export interface TableSorting {
  id: string;
  desc: boolean;
}

export interface TableFilters {
  [columnId: string]: unknown;
}

export interface TableSelection<T = Record<string, unknown>> {
  mode: 'none' | 'single' | 'multiple';
  selectedRows: T[];
  isRowSelected: (row: T) => boolean;
  toggleRowSelection: (row: T) => void;
  toggleAllSelection: () => void;
  clearSelection: () => void;
}

export interface TableFeatures {
  search?: boolean;
  sorting?: boolean;
  filtering?: boolean;
  pagination?: boolean;
  selection?: 'none' | 'single' | 'multiple';
  columnVisibility?: boolean;
  columnResizing?: boolean;
  export?: boolean;
  density?: boolean;
  bulkActions?: boolean;
  rowActions?: boolean;
  rowExpansion?: boolean;
}

export interface TableDensity {
  mode: 'compact' | 'normal' | 'comfortable';
  spacing: {
    compact: string;
    normal: string;
    comfortable: string;
  };
}

export interface TableState<T = Record<string, unknown>> {
  data: T[];
  pagination: TablePagination;
  sorting: TableSorting[];
  filters: TableFilters;
  globalFilter: string;
  selection: TableSelection<T>;
  columnVisibility: Record<string, boolean>;
  columnSizing: Record<string, number>;
  density: TableDensity;
  loading: boolean;
  error?: string;
}

export interface NeumorphicDataTableProps<T = Record<string, unknown>> {
  // Core data
  data: T[];
  columns: TableColumn<T>[];
  
  // Features configuration
  features?: Partial<TableFeatures>;
  
  // Actions
  rowActions?: TableAction<T>[];
  bulkActions?: BulkAction<T>[];
  
  // Pagination
  pagination?: Partial<TablePagination> & {
    manual?: boolean;
    onPaginationChange?: (pagination: TablePagination) => void;
  };
  
  // Sorting
  sorting?: {
    manual?: boolean;
    multiSort?: boolean;
    onSortingChange?: (sorting: TableSorting[]) => void;
  };
  
  // Filtering
  filtering?: {
    manual?: boolean;
    onFiltersChange?: (filters: TableFilters) => void;
    onGlobalFilterChange?: (filter: string) => void;
  };
  
  // Selection
  selection?: {
    onSelectionChange?: (selection: TableSelection<T>) => void;
  };
  
  // Row details
  rowDetails?: {
    component: React.ComponentType<{ row: T; onClose: () => void }>;
    title?: (row: T) => string;
  };
  
  // Export
  export?: {
    filename?: string;
    formats?: ('csv' | 'excel' | 'json')[];
  };
  
  // Styling
  className?: string;
  tableClassName?: string;
  rowClassName?: (row: T) => string;
  
  // Loading & Empty states
  loading?: boolean;
  loadingComponent?: React.ComponentType;
  emptyComponent?: React.ComponentType;
  errorComponent?: React.ComponentType<{ error: string }>;
  
  // Callbacks
  onRowClick?: (row: T) => void;
  onRowDoubleClick?: (row: T) => void;
}

export interface UseNeumorphicTableOptions<T = Record<string, unknown>> 
  extends Omit<NeumorphicDataTableProps<T>, 'data' | 'columns'> {
  initialData?: T[];
  initialPageSize?: number;
  initialSorting?: TableSorting[];
  initialFilters?: TableFilters;
}

// Utility types for better type safety
export type TableCellValue<T, K extends keyof T> = T[K];
export type TableRowData<T> = T & { _id?: string | number };
export type TableColumnDef<T> = TableColumn<T>;
export type TableActionDef<T> = TableAction<T>; 