import type { ReactNode } from "react"

// Base table data structure
export interface TableData {
  id: string
  [key: string]: any
}

// Column definition for the table
export interface TableColumn<T = TableData> {
  key: string
  title: string
  width?: string
  sortable?: boolean
  filterable?: boolean
  render?: (value: any, row: T) => ReactNode
  className?: string
}

// Sort configuration
export interface SortConfig {
  key: string
  direction: "asc" | "desc"
}

// Filter configuration
export interface FilterConfig {
  [key: string]: string | string[]
}

// Table state
export interface TableState<T = TableData> {
  data: T[]
  filteredData: T[]
  selectedRows: string[]
  currentPage: number
  pageSize: number
  totalPages: number
  sortConfig: SortConfig | null
  filters: FilterConfig
  searchQuery: string
  loading: boolean
}

// Table state management actions
export interface TableStateActions<T = TableData> {
  setData: (data: T[]) => void
  setSelectedRows: (rows: string[]) => void
  setCurrentPage: (page: number) => void
  setPageSize: (size: number) => void
  setSortConfig: (config: SortConfig | null) => void
  setFilters: (filters: FilterConfig) => void
  setSearchQuery: (query: string) => void
  setLoading: (loading: boolean) => void
  toggleRowSelection: (rowId: string) => void
  toggleAllRowsSelection: () => void
  resetFilters: () => void
}

// Legacy Task-specific types based on the image (deprecated - use TaskData from task.types.ts)
export interface LegacyTaskData extends TableData {
  id: string
  taskId: string
  description: string
  status: "In Progress" | "Backlog" | "Todo" | "Done" | "Cancelled"
  priority: "High" | "Medium" | "Low"
  type: "Documentation" | "Bug" | "Feature"
}

// Filter option interface
export interface FilterOption {
  value: string
  label: string
  count?: number
  variant?: string
}

// Row action interface - Enhanced for flexible actions
export interface RowAction {
  label: string
  onClick: () => void
  variant?: "default" | "destructive"
  disabled?: boolean
  icon?: React.ComponentType<{ className?: string }>
  shortcut?: string
  separator?: boolean // Add separator after this action
  hidden?: boolean // Conditionally hide action
  tooltip?: string
}

// Custom actions configuration for tables
export interface CustomActionsConfig<T extends TableData = TableData> {
  actions: RowAction[]
  showDefaultActions?: boolean
  showEdit?: boolean
  showDuplicate?: boolean
  showDelete?: boolean
  showView?: boolean
  showDownload?: boolean
  customActionHandlers?: {
    onEdit?: (row: T) => void
    onDuplicate?: (row: T) => void
    onDelete?: (row: T) => void
    onView?: (row: T) => void
    onDownload?: (row: T) => void
  }
}

// Actions column configuration
export interface ActionsColumnConfig<T extends TableData = TableData> {
  show: boolean
  customActions?: CustomActionsConfig<T>
  position?: "start" | "end"
  width?: string
  className?: string
}

// Table action types
export interface ITableActionData {
  target: {
    value: string
  }
}
