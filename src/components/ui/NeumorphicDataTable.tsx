'use client';

import React, { useState, useRef, useCallback } from 'react';
import { ChevronUp, ChevronDown, Search, Filter, Eye, Download, MoreHorizontal, Settings, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, GripVertical, Plus, Minus } from 'lucide-react';
import { NeumorphicDataTableProps, TableSorting } from '@/types/table';
import { useNeumorphicTable } from '@/hooks/useNeumorphicTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function NeumorphicDataTable<T extends Record<string, unknown>>({
  data,
  columns,
  features = {},
  rowActions = [],
  bulkActions = [],
  pagination: paginationOptions,
  sorting: sortingOptions,
  filtering: filteringOptions,
  selection: selectionOptions,
  rowDetails,
  export: exportOptions,
  className = '',
  tableClassName = '',
  rowClassName,
  loading = false,
  loadingComponent: LoadingComponent,
  emptyComponent: EmptyComponent,

  onRowClick,
  onRowDoubleClick,
}: NeumorphicDataTableProps<T>) {
  const [detailsRow, setDetailsRow] = useState<T | null>(null);
  const [columnFiltersOpen, setColumnFiltersOpen] = useState<Record<string, boolean>>({});
  const [columnVisibilityOpen, setColumnVisibilityOpen] = useState(false);
  const [densityMenuOpen, setDensityMenuOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [resizing, setResizing] = useState<{ columnId: string; startX: number; startWidth: number } | null>(null);
  
  const tableRef = useRef<HTMLTableElement>(null);

  // Initialize table with all features
  const table = useNeumorphicTable(data, columns, {
    features: {
      search: true,
      sorting: true,
      filtering: true,
      pagination: true,
      selection: 'multiple',
      columnVisibility: true,
      columnResizing: true,
      export: true,
      density: true,
      bulkActions: true,
      rowActions: true,
      rowExpansion: true,
      ...features,
    },
    pagination: paginationOptions,
    sorting: sortingOptions,
    filtering: filteringOptions,
    selection: selectionOptions,
  });

  // Handle sorting
  const handleSort = (columnId: string) => {
    const existingSort = table.state.sorting.find(s => s.id === columnId);
    let newSorting: TableSorting[];

    if (!existingSort) {
      // Add new sort
      if (sortingOptions?.multiSort) {
        newSorting = [...table.state.sorting, { id: columnId, desc: false }];
      } else {
        newSorting = [{ id: columnId, desc: false }];
      }
    } else {
      // Toggle existing sort
      if (!existingSort.desc) {
        newSorting = table.state.sorting.map(s => 
          s.id === columnId ? { ...s, desc: true } : s
        );
      } else {
        // Remove sort
        newSorting = table.state.sorting.filter(s => s.id !== columnId);
      }
    }

    table.setSorting(newSorting);
  };

  // Handle column filter
  const handleColumnFilter = (columnId: string, value: string) => {
    table.setFilters({
      ...table.state.filters,
      [columnId]: value,
    });
  };

  // Get sort direction for column
  const getSortDirection = (columnId: string) => {
    const sort = table.state.sorting.find(s => s.id === columnId);
    if (!sort) return null;
    return sort.desc ? 'desc' : 'asc';
  };

  // Get sort index for multi-sort
  const getSortIndex = (columnId: string) => {
    const index = table.state.sorting.findIndex(s => s.id === columnId);
    return index >= 0 ? index + 1 : null;
  };

  // Handle row click
  const handleRowClick = (row: T, event: React.MouseEvent) => {
    if (event.detail === 2) {
      // Double click
      onRowDoubleClick?.(row);
      if (rowDetails) {
        setDetailsRow(row);
      }
    } else {
      // Single click
      onRowClick?.(row);
      if (table.selection.mode !== 'none') {
        table.selection.toggleRowSelection(row);
      }
    }
  };

  // Handle row expansion
  const toggleRowExpansion = useCallback((rowId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  }, []);

  // Handle column resizing
  const handleResizeStart = useCallback((columnId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    const startX = event.clientX;
    const currentWidth = table.state.columnSizing[columnId] || 150;
    
    setResizing({
      columnId,
      startX,
      startWidth: typeof currentWidth === 'string' ? parseInt(currentWidth) : currentWidth,
    });
  }, [table.state.columnSizing]);

  // Handle mouse move during resize
  const handleResizeMove = useCallback((event: MouseEvent) => {
    if (!resizing) return;
    
    const deltaX = event.clientX - resizing.startX;
    const newWidth = Math.max(50, resizing.startWidth + deltaX);
    
    table.setColumnSizing({
      ...table.state.columnSizing,
      [resizing.columnId]: newWidth,
    });
  }, [resizing, table]);

  // Handle resize end
  const handleResizeEnd = useCallback(() => {
    setResizing(null);
  }, []);

  // Add global mouse event listeners for resizing
  React.useEffect(() => {
    if (resizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [resizing, handleResizeMove, handleResizeEnd]);

  // Export functionality
  const handleExport = (format: 'csv' | 'excel' | 'json') => {
    const exportData = table.allData;
    const filename = exportOptions?.filename || 'table-data';
    
    if (format === 'csv') {
      const csv = [
        table.columns.map(col => col.header).join(','),
        ...exportData.map(row => 
          table.columns.map(col => {
            const value = col.accessorFn 
              ? col.accessorFn(row)
              : col.accessorKey 
              ? row[col.accessorKey]
              : '';
            return `"${String(value).replace(/"/g, '""')}"`;
          }).join(',')
        )
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'json') {
      const json = JSON.stringify(exportData, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className={`neumorphic-card p-8 ${className}`}>
        {LoadingComponent ? (
          <LoadingComponent />
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
            <span className="ml-3 text-muted-foreground">Loading...</span>
          </div>
        )}
      </div>
    );
  }

  // Render empty state
  if (!data.length) {
    return (
      <div className={`neumorphic-card p-8 ${className}`}>
        {EmptyComponent ? (
          <EmptyComponent />
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No data found</h3>
            <p className="text-muted-foreground">There are no items to display in this table.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left side - Search and Filters */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {/* Global Search */}
          {features.search && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search all columns..."
                value={table.state.globalFilter}
                onChange={(e) => table.setGlobalFilter(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
          )}

          {/* Active Filters Indicator */}
          {Object.keys(table.state.filters).length > 0 && (
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">
                {Object.keys(table.state.filters).length} filter(s) active
              </span>
              <Button
                variant="neumorphic-outline"
                size="sm"
                onClick={() => table.setFilters({})}
                className="h-6 px-2 text-xs"
              >
                Clear
              </Button>
            </div>
          )}
        </div>

        {/* Right side - Actions and Controls */}
        <div className="flex items-center gap-2">
          {/* Bulk Actions */}
          {features.bulkActions && table.selectedCount > 0 && bulkActions.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {table.selectedCount} selected
              </span>
              {bulkActions.map((action) => (
                <Button
                  key={action.id}
                  variant={action.variant === 'destructive' ? 'destructive' : 'neumorphic-outline'}
                  size="sm"
                  onClick={() => action.onClick(table.selection.selectedRows)}
                  disabled={action.disabled?.(table.selection.selectedRows)}
                  className="h-8"
                >
                  {action.icon && <action.icon className="w-4 h-4 mr-1" />}
                  {action.label}
                </Button>
              ))}
              <Button
                variant="neumorphic-outline"
                size="sm"
                onClick={table.selection.clearSelection}
                className="h-8"
              >
                Clear
              </Button>
            </div>
          )}

          {/* Column Visibility */}
          {features.columnVisibility && (
            <Popover open={columnVisibilityOpen} onOpenChange={setColumnVisibilityOpen}>
              <PopoverTrigger asChild>
                <Button variant="neumorphic-outline" size="sm" className="h-8">
                  <Eye className="w-4 h-4 mr-1" />
                  Columns
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-3 neumorphic-card">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Toggle Columns</h4>
                  {table.allColumns.map((column) => (
                    <label key={column.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={table.state.columnVisibility[column.id] !== false}
                        onChange={(e) => {
                          table.setColumnVisibility({
                            ...table.state.columnVisibility,
                            [column.id]: e.target.checked,
                          });
                        }}
                        className="rounded neumorphic-checkbox"
                      />
                      <span className="text-sm">{column.header}</span>
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Density Control */}
          {features.density && (
            <Popover open={densityMenuOpen} onOpenChange={setDensityMenuOpen}>
              <PopoverTrigger asChild>
                <Button variant="neumorphic-outline" size="sm" className="h-8">
                  <Settings className="w-4 h-4 mr-1" />
                  Density
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-3 neumorphic-card">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Row Density</h4>
                  {['compact', 'normal', 'comfortable'].map((density) => (
                    <label key={density} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="density"
                        checked={table.state.density.mode === density}
                        onChange={() => table.setDensity(density as 'compact' | 'normal' | 'comfortable')}
                        className="neumorphic-radio"
                      />
                      <span className="text-sm capitalize">{density}</span>
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Export */}
          {features.export && exportOptions && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="neumorphic-outline" size="sm" className="h-8">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-3 neumorphic-card">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Export Format</h4>
                  {(exportOptions.formats || ['csv', 'json']).map((format) => (
                    <Button
                      key={format}
                      variant="neumorphic-outline"
                      size="sm"
                      onClick={() => handleExport(format)}
                      className="w-full justify-start h-8"
                    >
                      {format.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {/* Table */}
      <div className={`neumorphic-card overflow-hidden ${tableClassName}`}>
        <div className="overflow-x-auto">
          <table ref={tableRef} className="w-full">
            {/* Header */}
            <thead>
              <tr key="header-row" className="border-b border-border/50">
                {/* Row Expansion Header */}
                {features.rowExpansion && (
                  <th key="expansion-header" className="w-12 p-3 text-center">
                    <span className="sr-only">Expand</span>
                  </th>
                )}

                {/* Selection Header */}
                {table.selection.mode === 'multiple' && (
                  <th key="selection-header" className="w-12 p-3 text-left">
                    <input
                      type="checkbox"
                      checked={table.data.length > 0 && table.data.every(row => table.selection.isRowSelected(row))}
                      onChange={table.selection.toggleAllSelection}
                      className="rounded neumorphic-checkbox"
                    />
                  </th>
                )}

                {/* Column Headers */}
                {table.columns.map((column) => (
                  <th
                    key={column.id}
                    className={`relative p-3 text-left font-medium transition-colors ${
                      column.sortable !== false ? 'cursor-pointer hover:bg-purple-500/10' : ''
                    }`}
                    style={{
                      width: table.state.columnSizing[column.id],
                      textAlign: column.align || 'left',
                      padding: table.state.density.spacing[table.state.density.mode],
                    }}
                    onClick={() => column.sortable !== false && handleSort(column.id)}
                  >
                    <div className="flex items-center gap-2">
                      <span>{column.header}</span>
                      
                      {/* Sort Indicator */}
                      {column.sortable !== false && (
                        <div className="flex items-center">
                          {getSortDirection(column.id) === 'asc' ? (
                            <ChevronUp className="w-4 h-4 text-purple-500" />
                          ) : getSortDirection(column.id) === 'desc' ? (
                            <ChevronDown className="w-4 h-4 text-purple-500" />
                          ) : (
                            <div className="w-4 h-4 opacity-30 flex flex-col">
                              <ChevronUp className="w-4 h-2" />
                              <ChevronDown className="w-4 h-2 -mt-1" />
                            </div>
                          )}
                          
                          {/* Multi-sort index */}
                          {sortingOptions?.multiSort && getSortIndex(column.id) && (
                            <span className="text-xs text-purple-500 font-bold ml-1">
                              {getSortIndex(column.id)}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Column Filter */}
                      {column.filterable !== false && features.filtering && (
                        <Popover 
                          open={columnFiltersOpen[column.id]} 
                          onOpenChange={(open) => 
                            setColumnFiltersOpen(prev => ({ ...prev, [column.id]: open }))
                          }
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`h-6 w-6 p-0 ${
                                table.state.filters[column.id] ? 'text-purple-500' : 'text-muted-foreground'
                              }`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Filter className="w-3 h-3" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-3 neumorphic-card" onClick={(e) => e.stopPropagation()}>
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm">Filter {column.header}</h4>
                              {column.meta?.filterType === 'select' ? (
                                <select
                                  value={String(table.state.filters[column.id] || '')}
                                  onChange={(e) => handleColumnFilter(column.id, e.target.value)}
                                  className="w-full p-2 border rounded neumorphic-select"
                                >
                                  <option value="">All</option>
                                  {column.meta.filterOptions?.map((option) => (
                                    <option key={String(option.value)} value={String(option.value)}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <Input
                                  placeholder={`Filter ${column.header.toLowerCase()}...`}
                                  value={String(table.state.filters[column.id] || '')}
                                  onChange={(e) => handleColumnFilter(column.id, e.target.value)}
                                />
                              )}
                              {table.state.filters[column.id] !== undefined && table.state.filters[column.id] !== '' && (
                                <Button
                                  variant="neumorphic-outline"
                                  size="sm"
                                  onClick={() => handleColumnFilter(column.id, '')}
                                  className="w-full h-8"
                                >
                                  Clear Filter
                                </Button>
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                    
                    {/* Column Resize Handle */}
                    {column.resizable !== false && features.columnResizing && (
                      <div
                        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-purple-500/30 group"
                        onMouseDown={(e) => handleResizeStart(column.id, e)}
                      >
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <GripVertical className="w-3 h-3 text-purple-500" />
                        </div>
                      </div>
                    )}
                  </th>
                ))}

                {/* Actions Header */}
                {features.rowActions && rowActions.length > 0 && (
                  <th key="actions-header" className="w-16 p-3 text-center">Actions</th>
                )}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {table.data.map((row) => {
                const rowId = table.getRowId(row);
                const isExpanded = expandedRows.has(rowId);
                
                return (
                  <React.Fragment key={rowId}>
                    <tr
                      key={`row-${rowId}`}
                      className={`
                        border-b border-border/30 transition-colors cursor-pointer
                        ${table.selection.isRowSelected(row) ? 'bg-purple-500/10' : ''}
                        ${rowClassName ? rowClassName(row) : 'hover:bg-purple-500/5'}
                      `}
                      onClick={(e) => handleRowClick(row, e)}
                      style={{
                        padding: table.state.density.spacing[table.state.density.mode],
                      }}
                    >
                      {/* Row Expansion Cell */}
                      {features.rowExpansion && (
                        <td className="w-12 p-3 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-purple-500/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRowExpansion(rowId);
                            }}
                          >
                            {isExpanded ? (
                              <Minus className="w-4 h-4" />
                            ) : (
                              <Plus className="w-4 h-4" />
                            )}
                          </Button>
                        </td>
                      )}

                      {/* Selection Cell */}
                      {table.selection.mode === 'multiple' && (
                        <td className="w-12 p-3">
                          <input
                            type="checkbox"
                            checked={table.selection.isRowSelected(row)}
                            onChange={() => table.selection.toggleRowSelection(row)}
                            onClick={(e) => e.stopPropagation()}
                            className="rounded neumorphic-checkbox"
                          />
                        </td>
                      )}

                  {/* Data Cells */}
                  {table.columns.map((column) => {
                    const value = column.accessorFn 
                      ? column.accessorFn(row)
                      : column.accessorKey 
                      ? row[column.accessorKey]
                      : '';

                    return (
                      <td
                        key={column.id}
                        className="p-3"
                        style={{
                          textAlign: column.align || 'left',
                          padding: table.state.density.spacing[table.state.density.mode],
                        }}
                      >
{column.cell ? column.cell(value, row) : String(value)}
                      </td>
                    );
                  })}

                      {/* Actions Cell */}
                      {features.rowActions && rowActions.length > 0 && (
                        <td className="w-16 p-3 text-center">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-purple-500/10"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-48 p-2 neumorphic-card" onClick={(e) => e.stopPropagation()}>
                              <div className="space-y-1">
                                {rowActions
                                  .filter(action => !action.hidden?.(row))
                                  .map((action) => (
                                    <Button
                                      key={action.id}
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => action.onClick(row)}
                                      disabled={action.disabled?.(row)}
                                      className="w-full justify-start h-8 hover:bg-purple-500/10"
                                    >
                                      {action.icon && <action.icon className="w-4 h-4 mr-2" />}
                                      {action.label}
                                    </Button>
                                  ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </td>
                      )}
                    </tr>

                    {/* Expanded Row Content */}
                    {features.rowExpansion && isExpanded && rowDetails && (
                      <tr key={`expanded-${rowId}`} className="border-b border-border/30">
                        <td 
                          colSpan={
                            table.columns.length + 
                            (features.rowExpansion ? 1 : 0) +
                            (table.selection.mode === 'multiple' ? 1 : 0) + 
                            (features.rowActions && rowActions.length > 0 ? 1 : 0)
                          }
                          className="p-0"
                        >
                          <div className="p-4 bg-purple-500/5 border-l-4 border-purple-500/20">
                            <rowDetails.component row={row} onClose={() => toggleRowExpansion(rowId)} />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {features.pagination && (
          <div className="flex items-center justify-between p-4 border-t border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                Showing {table.state.pagination.pageIndex * table.state.pagination.pageSize + 1} to{' '}
                {Math.min(
                  (table.state.pagination.pageIndex + 1) * table.state.pagination.pageSize,
                  table.totalRows
                )}{' '}
                of {table.totalRows} entries
              </span>
              {table.state.pagination.showSizeSelector && (
                <div className="flex items-center gap-2 ml-4">
                  <span>Show</span>
                  <select
                    value={table.state.pagination.pageSize}
                    onChange={(e) => table.setPagination({ pageSize: Number(e.target.value), pageIndex: 0 })}
                    className="border rounded px-2 py-1 neumorphic-select"
                  >
                    {table.state.pagination.pageSizeOptions?.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                  <span>entries</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="neumorphic-outline"
                size="sm"
                onClick={() => table.setPagination({ pageIndex: 0 })}
                disabled={!table.canPreviousPage}
                className="h-8 w-8 p-0"
              >
                <ChevronsLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="neumorphic-outline"
                size="sm"
                onClick={() => table.setPagination({ pageIndex: table.state.pagination.pageIndex - 1 })}
                disabled={!table.canPreviousPage}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <span className="text-sm font-medium px-3">
                Page {table.state.pagination.pageIndex + 1} of {table.state.pagination.pageCount}
              </span>
              
              <Button
                variant="neumorphic-outline"
                size="sm"
                onClick={() => table.setPagination({ pageIndex: table.state.pagination.pageIndex + 1 })}
                disabled={!table.canNextPage}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="neumorphic-outline"
                size="sm"
                onClick={() => table.setPagination({ pageIndex: table.state.pagination.pageCount - 1 })}
                disabled={!table.canNextPage}
                className="h-8 w-8 p-0"
              >
                <ChevronsRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Row Details Modal */}
      {rowDetails && detailsRow && (
        <Dialog open={!!detailsRow} onOpenChange={() => setDetailsRow(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto neumorphic-card">
            <DialogHeader>
              <DialogTitle>
                {rowDetails.title ? rowDetails.title(detailsRow) : 'Row Details'}
              </DialogTitle>
            </DialogHeader>
            <rowDetails.component row={detailsRow} onClose={() => setDetailsRow(null)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 