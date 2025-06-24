import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  TableState,
  TableColumn,
  TableSorting,
  TableFilters,
  TableSelection,
  TablePagination,
  TableDensity,
  UseNeumorphicTableOptions,
} from '@/types/table';

export function useNeumorphicTable<T extends Record<string, unknown>>(
  data: T[],
  columns: TableColumn<T>[],
  options: UseNeumorphicTableOptions<T> = {}
) {
  // Initialize state
  const [state, setState] = useState<TableState<T>>(() => ({
    data: options.initialData || data,
    pagination: {
      pageIndex: 0,
      pageSize: options.initialPageSize || 10,
      pageCount: Math.ceil((options.initialData || data).length / (options.initialPageSize || 10)),
      totalRows: (options.initialData || data).length,
      showSizeSelector: true,
      pageSizeOptions: [5, 10, 20, 50, 100],
    },
    sorting: options.initialSorting || [],
    filters: options.initialFilters || {},
    globalFilter: '',
    selection: {
      mode: options.features?.selection || 'none',
      selectedRows: [],
      isRowSelected: () => false,
      toggleRowSelection: () => {},
      toggleAllSelection: () => {},
      clearSelection: () => {},
    },
    columnVisibility: columns.reduce((acc, col) => {
      acc[col.id] = !col.hidden;
      return acc;
    }, {} as Record<string, boolean>),
    columnSizing: columns.reduce((acc, col) => {
      if (col.width) acc[col.id] = col.width;
      return acc;
    }, {} as Record<string, number>),
    density: {
      mode: 'normal',
      spacing: {
        compact: 'var(--neumorphic-spacing-xs)',
        normal: 'var(--neumorphic-spacing-sm)',
        comfortable: 'var(--neumorphic-spacing-md)',
      },
    },
    loading: false,
  }));

  // Update data when prop changes
  useEffect(() => {
    setState(prev => ({
      ...prev,
      data,
      pagination: {
        ...prev.pagination,
        totalRows: data.length,
        pageCount: Math.ceil(data.length / prev.pagination.pageSize),
      },
    }));
  }, [data]);

  // Filtered data
  const filteredData = useMemo(() => {
    let result = state.data;

    // Apply global filter
    if (state.globalFilter) {
      const searchTerm = state.globalFilter.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => {
          const value = col.accessorFn 
            ? col.accessorFn(row)
            : col.accessorKey 
            ? row[col.accessorKey]
            : '';
          return String(value).toLowerCase().includes(searchTerm);
        })
      );
    }

    // Apply column filters
    Object.entries(state.filters).forEach(([columnId, filterValue]) => {
      if (filterValue !== undefined && filterValue !== '') {
        const column = columns.find(col => col.id === columnId);
        if (column) {
          result = result.filter((row) => {
            const value = column.accessorFn 
              ? column.accessorFn(row)
              : column.accessorKey 
              ? row[column.accessorKey]
              : '';
            
            if (column.meta?.filterType === 'select') {
              return value === filterValue;
            } else {
              return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
            }
          });
        }
      }
    });

    return result;
  }, [state.data, state.globalFilter, state.filters, columns]);

  // Sorted data
  const sortedData = useMemo(() => {
    if (!state.sorting.length) return filteredData;

    return [...filteredData].sort((a, b) => {
      for (const sort of state.sorting) {
        const column = columns.find(col => col.id === sort.id);
        if (!column) continue;

        const aValue = column.accessorFn 
          ? column.accessorFn(a)
          : column.accessorKey 
          ? a[column.accessorKey]
          : '';
        const bValue = column.accessorFn 
          ? column.accessorFn(b)
          : column.accessorKey 
          ? b[column.accessorKey]
          : '';

        let comparison = 0;
        const aStr = String(aValue);
        const bStr = String(bValue);
        if (aStr < bStr) comparison = -1;
        if (aStr > bStr) comparison = 1;

        if (comparison !== 0) {
          return sort.desc ? -comparison : comparison;
        }
      }
      return 0;
    });
  }, [filteredData, state.sorting, columns]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const start = state.pagination.pageIndex * state.pagination.pageSize;
    const end = start + state.pagination.pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, state.pagination.pageIndex, state.pagination.pageSize]);

  // Update pagination when filtered data changes
  useEffect(() => {
    setState(prev => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        pageCount: Math.ceil(filteredData.length / prev.pagination.pageSize),
        totalRows: filteredData.length,
        pageIndex: Math.min(prev.pagination.pageIndex, Math.max(0, Math.ceil(filteredData.length / prev.pagination.pageSize) - 1)),
      },
    }));
  }, [filteredData.length]);

  // Selection management
  const selection = useMemo<TableSelection<T>>(() => {
    const isRowSelected = (row: T) => {
      return state.selection.selectedRows.some(selected => 
        JSON.stringify(selected) === JSON.stringify(row)
      );
    };

    const toggleRowSelection = (row: T) => {
      setState(prev => {
        const isSelected = isRowSelected(row);
        let newSelectedRows: T[];

        if (prev.selection.mode === 'single') {
          newSelectedRows = isSelected ? [] : [row];
        } else {
          newSelectedRows = isSelected
            ? prev.selection.selectedRows.filter(selected => 
                JSON.stringify(selected) !== JSON.stringify(row)
              )
            : [...prev.selection.selectedRows, row];
        }

        const newSelection = {
          ...prev.selection,
          selectedRows: newSelectedRows,
        };

        options.selection?.onSelectionChange?.(newSelection);

        return {
          ...prev,
          selection: newSelection,
        };
      });
    };

    const toggleAllSelection = () => {
      setState(prev => {
        const allSelected = paginatedData.every(row => isRowSelected(row));
        const newSelectedRows = allSelected 
          ? prev.selection.selectedRows.filter(selected => 
              !paginatedData.some(row => JSON.stringify(row) === JSON.stringify(selected))
            )
          : [
              ...prev.selection.selectedRows.filter(selected => 
                !paginatedData.some(row => JSON.stringify(row) === JSON.stringify(selected))
              ),
              ...paginatedData,
            ];

        const newSelection = {
          ...prev.selection,
          selectedRows: newSelectedRows,
        };

        options.selection?.onSelectionChange?.(newSelection);

        return {
          ...prev,
          selection: newSelection,
        };
      });
    };

    const clearSelection = () => {
      setState(prev => {
        const newSelection = {
          ...prev.selection,
          selectedRows: [],
        };

        options.selection?.onSelectionChange?.(newSelection);

        return {
          ...prev,
          selection: newSelection,
        };
      });
    };

    return {
      ...state.selection,
      isRowSelected,
      toggleRowSelection,
      toggleAllSelection,
      clearSelection,
    };
  }, [state.selection, paginatedData, options.selection]);

  // Action handlers
  const setSorting = useCallback((sorting: TableSorting[]) => {
    setState(prev => ({ ...prev, sorting }));
    options.sorting?.onSortingChange?.(sorting);
  }, [options.sorting]);

  const setGlobalFilter = useCallback((filter: string) => {
    setState(prev => ({ ...prev, globalFilter: filter, pagination: { ...prev.pagination, pageIndex: 0 } }));
    options.filtering?.onGlobalFilterChange?.(filter);
  }, [options.filtering]);

  const setFilters = useCallback((filters: TableFilters) => {
    setState(prev => ({ ...prev, filters, pagination: { ...prev.pagination, pageIndex: 0 } }));
    options.filtering?.onFiltersChange?.(filters);
  }, [options.filtering]);

  const setPagination = useCallback((pagination: Partial<TablePagination>) => {
    setState(prev => {
      const newPagination = { ...prev.pagination, ...pagination };
      options.pagination?.onPaginationChange?.(newPagination);
      return { ...prev, pagination: newPagination };
    });
  }, [options.pagination]);

  const setColumnVisibility = useCallback((visibility: Record<string, boolean>) => {
    setState(prev => ({ ...prev, columnVisibility: visibility }));
  }, []);

  const setColumnSizing = useCallback((sizing: Record<string, number>) => {
    setState(prev => ({ ...prev, columnSizing: sizing }));
  }, []);

  const setDensity = useCallback((density: TableDensity['mode']) => {
    setState(prev => ({
      ...prev,
      density: { ...prev.density, mode: density },
    }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  // Visible columns
  const visibleColumns = useMemo(() => {
    return columns.filter(col => state.columnVisibility[col.id] !== false);
  }, [columns, state.columnVisibility]);

  return {
    // Data
    data: paginatedData,
    allData: sortedData,
    originalData: state.data,
    
    // Columns
    columns: visibleColumns,
    allColumns: columns,
    
    // State
    state,
    
    // Computed values
    selection,
    
    // Actions
    setSorting,
    setGlobalFilter,
    setFilters,
    setPagination,
    setColumnVisibility,
    setColumnSizing,
    setDensity,
    setLoading,
    
    // Utilities
    getRowId: (row: T) => JSON.stringify(row),
    canPreviousPage: state.pagination.pageIndex > 0,
    canNextPage: state.pagination.pageIndex < state.pagination.pageCount - 1,
    
    // Stats
    totalRows: filteredData.length,
    selectedCount: selection.selectedRows.length,
  };
} 