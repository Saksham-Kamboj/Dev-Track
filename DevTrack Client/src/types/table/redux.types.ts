import type {
  TableData,
  SortConfig,
  FilterConfig,
  ActionsColumnConfig,
  CustomActionsConfig
} from './core.types'

// Redux Table State Types
export interface TableReduxState<T extends TableData = TableData> {
  // Data state
  data: T[]
  originalData: T[]
  filteredData: T[]
  paginatedData: T[]

  // UI state
  selectedRows: string[]
  currentPage: number
  totalPages: number
  pageSize: number
  totalItems: number

  // Filter and search state
  searchQuery: string
  filters: FilterConfig
  sortConfig: SortConfig | null

  // Column state
  columnVisibility: Record<string, boolean>

  // Actions column state
  actionsColumnConfig: ActionsColumnConfig<T>
  customActions: CustomActionsConfig<T> | null

  // Loading and error state
  loading: boolean
  error: string | null

  // Operation states
  creating: boolean
  updating: boolean
  deleting: boolean

  // Cache and metadata
  lastFetch: number | null
  cacheExpiry: number
  lastUpdate: number
}

// Redux Table Actions
export interface TableReduxActions {
  // Data actions
  setData: (data: TableData[]) => void
  addItem: (item: TableData) => void
  updateItem: (id: string, updates: Partial<TableData>) => void
  removeItem: (id: string) => void

  // Selection actions
  selectRow: (id: string) => void
  selectAllRows: () => void
  clearSelection: () => void

  // Pagination actions
  setCurrentPage: (page: number) => void
  setPageSize: (size: number) => void

  // Filter and search actions
  setSearchQuery: (query: string) => void
  setFilters: (filters: FilterConfig) => void
  setSortConfig: (config: SortConfig | null) => void
  resetFilters: () => void

  // Column actions
  setColumnVisibility: (columnKey: string, visible: boolean) => void
  resetColumnVisibility: () => void

  // Loading actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

// Async thunk types
export interface FetchTableDataParams {
  page?: number
  pageSize?: number
  search?: string
  filters?: FilterConfig
  sort?: SortConfig
  forceRefresh?: boolean
}

export interface CreateTableItemParams<T extends TableData> {
  data: Omit<T, 'id'>
  optimistic?: boolean
}

export interface UpdateTableItemParams<T extends TableData> {
  id: string
  data: Partial<T>
  optimistic?: boolean
}

export interface DeleteTableItemParams {
  id: string
  optimistic?: boolean
}

export interface BulkDeleteTableItemsParams {
  ids: string[]
  optimistic?: boolean
}

// Table Redux response types
export interface TableDataResponse<T extends TableData> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface TableOperationResponse<T extends TableData> {
  success: boolean
  message: string
  data?: T
  error?: string
}
