import { useMemo, useCallback, useEffect, useRef } from "react"
import { useTableRedux } from "../hooks/use-table-redux"
import { TableController } from "./table.controller"
import type {
  TableData,
  TableColumn,
  TaskData,
  IDataTableControllerResponse,
  ITableControllerConfig
} from "@/types"

/**
 * DataTable controller hook using Redux for state management
 * Adds status and priority filtering functionality
 */
export function useDataTableController<T extends TableData>(
  initialData: T[],
  columns: TableColumn<T>[],
  config: ITableControllerConfig<T> & {
    showStatusFilter?: boolean
    showPriorityFilter?: boolean
    onRowClick?: (row: T) => void
    onEdit?: (row: T) => void
    onDuplicate?: (row: T) => void
    onDelete?: (row: T) => void
  } = {}
): IDataTableControllerResponse<T> {
  const {
    showStatusFilter = false,
    showPriorityFilter = false,
    onRowClick,
    onEdit,
    onDuplicate,
    onDelete,
    pageSize = 10,
    initialSortConfig,
    initialFilters = {}
  } = config

  // Use Redux for table state management
  const redux = useTableRedux<T>()

  // Track last data to prevent unnecessary updates
  const lastDataRef = useRef<string>('')

  // Initialize data and configuration
  useEffect(() => {
    // Create a simple hash of the data to detect changes
    const dataHash = JSON.stringify(initialData.map(item => item.id))

    if (lastDataRef.current !== dataHash) {
      redux.actions.setData(initialData)
      lastDataRef.current = dataHash
    }
  }, [initialData])

  // Initialize configuration only once
  useEffect(() => {
    if (pageSize !== 10) { // Only set if different from default
      redux.actions.setPageSize(pageSize)
    }
    if (initialSortConfig) {
      redux.actions.setSortConfig(initialSortConfig)
    }
    if (Object.keys(initialFilters).length > 0) {
      redux.actions.setFilters(initialFilters)
    }

    // Initialize column visibility - exclude first column (always visible)
    const toggleableColumns = columns.slice(1)
    const initialColumnVisibility = toggleableColumns.reduce(
      (acc, column) => ({ ...acc, [column.key]: true }),
      {}
    )

    // Set column visibility
    Object.entries(initialColumnVisibility).forEach(([columnKey, visible]) => {
      redux.actions.setColumnVisibility(columnKey, visible as boolean)
    })
  }, []) // Only run once on mount

  // Initialize configuration only once
  useEffect(() => {
    if (pageSize !== 10) { // Only set if different from default
      redux.actions.setPageSize(pageSize)
    }
    if (initialSortConfig) {
      redux.actions.setSortConfig(initialSortConfig)
    }
    if (Object.keys(initialFilters).length > 0) {
      redux.actions.setFilters(initialFilters)
    }

    // Initialize column visibility - exclude first column (always visible)
    const toggleableColumns = columns.slice(1)
    const initialColumnVisibility = toggleableColumns.reduce(
      (acc, column) => ({ ...acc, [column.key]: true }),
      {}
    )

    // Only set if not already initialized
    if (Object.keys(redux.columnVisibility).length === 0) {
      Object.entries(initialColumnVisibility).forEach(([columnKey, visible]) => {
        redux.actions.setColumnVisibility(columnKey, visible as boolean)
      })
    }
  }, []) // Empty dependency array - only run once on mount

  // Type guard to check if data is TaskData
  const isTaskData = (item: T): item is T & TaskData => {
    return 'status' in item && 'priority' in item && 'taskId' in item
  }

  // Calculate status and priority options (only for TaskData)
  const statusOptions = useMemo(() => {
    if (showStatusFilter && redux.allData.length > 0 && isTaskData(redux.allData[0])) {
      const taskData = redux.allData.filter(isTaskData) as (T & TaskData)[]
      return TableController.getStatusCounts(taskData)
    }
    return []
  }, [redux.allData, showStatusFilter])

  const priorityOptions = useMemo(() => {
    if (showPriorityFilter && redux.allData.length > 0 && isTaskData(redux.allData[0])) {
      const taskData = redux.allData.filter(isTaskData) as (T & TaskData)[]
      return TableController.getPriorityCounts(taskData)
    }
    return []
  }, [redux.allData, showPriorityFilter])

  const roleOptions = useMemo(() => {
    if (redux.allData.length > 0) {
      const roles = Array.from(new Set(redux.allData.map(item => 'role' in item ? item.role : null).filter(Boolean)))
      return roles.map(role => ({
        value: role as string,
        label: (role as string).charAt(0).toUpperCase() + (role as string).slice(1),
        count: redux.allData.filter(item => 'role' in item && item.role === role).length,
        variant: role === 'admin' ? 'destructive' : 'default'
      }))
    }
    return []
  }, [redux.allData])

  const userStatusOptions = useMemo(() => {
    if (redux.allData.length > 0) {
      const statuses = Array.from(new Set(redux.allData.map(item => 'status' in item ? item.status : null).filter(Boolean)))
      return statuses.map(status => ({
        value: status as string,
        label: (status as string).charAt(0).toUpperCase() + (status as string).slice(1),
        count: redux.allData.filter(item => 'status' in item && item.status === status).length,
        variant: status === 'active' ? 'default' : 'secondary'
      }))
    }
    return []
  }, [redux.allData])

  // Get selected filter values
  const selectedStatuses = useMemo(() => {
    const statusFilter = redux.filters.status
    return Array.isArray(statusFilter) ? statusFilter : []
  }, [redux.filters.status])

  const selectedPriorities = useMemo(() => {
    const priorityFilter = redux.filters.priority
    return Array.isArray(priorityFilter) ? priorityFilter : []
  }, [redux.filters.priority])

  const selectedRoles = useMemo(() => {
    const roleFilter = redux.filters.role
    return Array.isArray(roleFilter) ? roleFilter : []
  }, [redux.filters.role])

  const selectedUserStatuses = useMemo(() => {
    const userStatusFilter = redux.filters.userStatus
    return Array.isArray(userStatusFilter) ? userStatusFilter : []
  }, [redux.filters.userStatus])

  // Enhanced handlers
  const handleStatusFilter = useCallback((values: string[]) => {
    redux.actions.setFilters({ ...redux.filters, status: values })
  }, [redux.actions, redux.filters])

  const handlePriorityFilter = useCallback((values: string[]) => {
    redux.actions.setFilters({ ...redux.filters, priority: values })
  }, [redux.actions, redux.filters])

  const handleRoleFilter = useCallback((values: string[]) => {
    redux.actions.setFilters({ ...redux.filters, role: values })
  }, [redux.actions, redux.filters])

  const handleUserStatusFilter = useCallback((values: string[]) => {
    redux.actions.setFilters({ ...redux.filters, userStatus: values })
  }, [redux.actions, redux.filters])

  const handleRowClick = useCallback((row: T) => {
    if (onRowClick) {
      onRowClick(row)
    }
  }, [onRowClick])

  const handleEdit = useCallback((row: T) => {
    if (onEdit) {
      onEdit(row)
    }
  }, [onEdit])

  const handleDuplicate = useCallback((row: T) => {
    if (onDuplicate) {
      onDuplicate(row)
    }
  }, [onDuplicate])

  const handleDelete = useCallback((row: T) => {
    if (onDelete) {
      onDelete(row)
    }
  }, [onDelete])

  const handleSort = useCallback((columnKey: string) => {
    const newSortConfig = TableController.handleSort(redux.sortConfig, columnKey)
    redux.actions.setSortConfig(newSortConfig)
  }, [redux.actions, redux.sortConfig])

  return {
    getters: {
      data: redux.data,
      filteredData: redux.allData, // Use allData for filtered data
      selectedRows: redux.selectedRows,
      currentPage: redux.currentPage,
      totalPages: redux.totalPages,
      pageSize: redux.pageSize,
      searchQuery: redux.searchQuery,
      sortConfig: redux.sortConfig,
      filters: redux.filters,
      loading: redux.loading,
      columns, // Add the full columns array
      columnVisibility: redux.columnVisibility,
      visibleColumns: redux.helpers.getVisibleColumns(columns),
      hasActiveFilters: redux.hasActiveFilters,
      totalItems: redux.totalItems,
      statusOptions,
      priorityOptions,
      roleOptions,
      userStatusOptions,
      selectedStatuses,
      selectedPriorities,
      selectedRoles,
      selectedUserStatuses
    },
    handlers: {
      onSearchChange: redux.actions.setSearchQuery,
      onPageChange: redux.actions.setCurrentPage,
      onPageSizeChange: redux.actions.setPageSize,
      onSort: handleSort,
      onFilter: (key: string, values: string[]) => {
        redux.actions.setFilters({ ...redux.filters, [key]: values })
      },
      onResetFilters: redux.actions.resetFilters,
      onRowSelection: redux.actions.selectRow,
      onAllRowsSelection: redux.actions.selectAllRows,
      onColumnVisibilityChange: (columnKey: string) => {
        const currentVisibility = redux.columnVisibility[columnKey] ?? true
        redux.actions.setColumnVisibility(columnKey, !currentVisibility)
      },
      onStatusFilter: handleStatusFilter,
      onPriorityFilter: handlePriorityFilter,
      onRoleFilter: handleRoleFilter,
      onUserStatusFilter: handleUserStatusFilter,
      onRowClick: handleRowClick,
      onEdit: handleEdit,
      onDuplicate: handleDuplicate,
      onDelete: handleDelete
    }
  }
}
