import { createSelector } from '@reduxjs/toolkit'
import { TableController } from '@/components/common/table/controllers/table.controller'
import type { RootState } from '../store'
import type { TableColumn, TaskData } from '@/types'
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '@/types'

// Base selectors - direct property access to avoid identity function warnings
export const selectTableState = (state: RootState) => state.table
export const selectTableData = (state: RootState) => state.table.data
export const selectOriginalTableData = (state: RootState) => state.table.originalData
export const selectFilteredTableData = (state: RootState) => state.table.filteredData
export const selectPaginatedTableData = (state: RootState) => state.table.paginatedData

// UI state selectors - direct property access
export const selectSelectedRows = (state: RootState) => state.table.selectedRows || []
export const selectCurrentPage = (state: RootState) => state.table.currentPage
export const selectTotalPages = (state: RootState) => state.table.totalPages
export const selectPageSize = (state: RootState) => state.table.pageSize
export const selectTotalItems = (state: RootState) => state.table.totalItems

// Filter and search selectors - direct property access
export const selectSearchQuery = (state: RootState) => state.table.searchQuery
export const selectFilters = (state: RootState) => state.table.filters
export const selectSortConfig = (state: RootState) => state.table.sortConfig

// Column selectors - direct property access
export const selectColumnVisibility = (state: RootState) => state.table.columnVisibility

// Actions column selectors
export const selectActionsColumnConfig = (state: RootState) => state.table.actionsColumnConfig
export const selectCustomActions = (state: RootState) => state.table.customActions
export const selectActionsColumnVisible = (state: RootState) => state.table.actionsColumnConfig.show

// Loading and error selectors - direct property access
export const selectTableLoading = (state: RootState) => state.table.loading
export const selectTableError = (state: RootState) => state.table.error
export const selectTableCreating = (state: RootState) => state.table.creating
export const selectTableUpdating = (state: RootState) => state.table.updating
export const selectTableDeleting = (state: RootState) => state.table.deleting

// Cache selectors - direct property access
export const selectLastFetch = (state: RootState) => state.table.lastFetch
export const selectCacheExpiry = (state: RootState) => state.table.cacheExpiry

// Computed selectors with meaningful transformations
export const selectHasActiveFilters = createSelector(
  [selectFilters, selectSearchQuery],
  (filters, searchQuery) => {
    return TableController.hasActiveFilters(filters) || searchQuery.length > 0
  }
)

export const selectTableOperationLoading = createSelector(
  [selectTableCreating, selectTableUpdating, selectTableDeleting],
  (creating, updating, deleting) => creating || updating || deleting
)

export const selectIsCacheValid = createSelector(
  [selectLastFetch, selectCacheExpiry],
  (lastFetch, cacheExpiry) => {
    if (!lastFetch) return false
    return Date.now() - lastFetch < cacheExpiry
  }
)

// Factory function for visible columns selector
export const makeSelectVisibleColumns = () => createSelector(
  [selectColumnVisibility, (_state: RootState, columns: TableColumn[]) => columns],
  (columnVisibility, columns) => {
    return TableController.getVisibleColumns(columns, columnVisibility)
  }
)

// Task-specific selectors - properly memoized to avoid unnecessary rerenders
export const selectSelectedStatuses = createSelector(
  [selectFilters],
  (filters) => {
    const statusFilter = filters.status
    return Array.isArray(statusFilter) ? statusFilter : []
  }
)

export const selectSelectedPriorities = createSelector(
  [selectFilters],
  (filters) => {
    const priorityFilter = filters.priority
    return Array.isArray(priorityFilter) ? priorityFilter : []
  }
)

// Task-specific computed selectors with meaningful transformations
export const selectStatusOptions = createSelector(
  [selectTableData],
  (data) => {
    const tasks = data as TaskData[]
    if (tasks.length === 0) return STATUS_OPTIONS.map(option => ({ ...option, count: 0 }))
    return TableController.getStatusCounts(tasks)
  }
)

export const selectPriorityOptions = createSelector(
  [selectTableData],
  (data) => {
    const tasks = data as TaskData[]
    if (tasks.length === 0) return PRIORITY_OPTIONS.map(option => ({ ...option, count: 0 }))
    return TableController.getPriorityCounts(tasks)
  }
)

// Computed task data selector for when you need typed TaskData[]
export const selectTaskData = createSelector(
  [selectTableData],
  (data) => data as TaskData[]
)

// Pagination info selector
export const selectPaginationInfo = createSelector(
  [selectCurrentPage, selectTotalPages, selectPageSize, selectTotalItems, selectSelectedRows],
  (currentPage, totalPages, pageSize, totalItems, selectedRows) => ({
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    selectedRowsCount: selectedRows.length,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1
  })
)

// Table state summary selector
export const selectTableStateSummary = createSelector(
  [
    selectTableLoading,
    selectTableError,
    selectTableOperationLoading,
    selectHasActiveFilters,
    selectTotalItems,
    selectSelectedRows,
    selectIsCacheValid
  ],
  (loading, error, operationLoading, hasActiveFilters, totalItems, selectedRows, isCacheValid) => ({
    loading,
    error,
    operationLoading,
    hasActiveFilters,
    totalItems,
    selectedRowsCount: selectedRows.length,
    isCacheValid,
    isEmpty: totalItems === 0,
    hasSelection: selectedRows.length > 0
  })
)
