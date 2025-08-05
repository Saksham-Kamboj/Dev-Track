import type {
  TableData,
  TableColumn,
  LegacyTaskData,
  FilterOption,
  RowAction,
  CustomActionsConfig,
  ActionsColumnConfig
} from './core.types'
import type {
  TableConfig,
  TableToolbarConfig,
  TablePaginationConfig,
  TableHeaderConfig,
  FilterDropdownConfig
} from './config.types'

// Main DataTable component props
export interface DataTableProps<T extends TableData> {
  data: T[]
  columns: TableColumn<T>[]
  config?: TableConfig<T>
  className?: string
  onRowClick?: (row: T) => void
  showStatusFilter?: boolean
  showPriorityFilter?: boolean
  showRoleFilter?: boolean
  showUserStatusFilter?: boolean
  showActions?: boolean
  showSerialNumber?: boolean
  controller?: any // Optional external controller

  // New actions object approach
  actions?: TableActions<T>

  // Toolbar configuration
  showAddButton?: boolean
  onAddClick?: () => void
  addButtonText?: string
  toolbarConfig?: TableToolbarConfig

  // Individual action props (for backward compatibility)
  edit?: boolean
  onEdit?: (row: T) => void
  duplicate?: boolean
  onDuplicate?: (row: T) => void
  delete?: boolean
  onDelete?: (row: T) => void
  view?: boolean
  onView?: (row: T) => void
  download?: boolean
  onDownload?: (row: T) => void
  share?: boolean
  onShare?: (row: T) => void
  archive?: boolean
  onArchive?: (row: T) => void

  // Legacy props for backward compatibility
  customActions?: CustomActionsConfig<T>
  actionsColumnConfig?: ActionsColumnConfig<T>
}

// Task table specific props
export interface TaskTableProps {
  data: LegacyTaskData[]
  title: string
  description: string
  onRowClick?: (row: LegacyTaskData) => void
  showCheckboxes?: boolean
  pageSize?: number
}

// Filter chips component props
export interface FilterChipsProps {
  options: FilterOption[]
  selectedValues: string[]
  className?: string
}

// Filter dropdown component props
export interface FilterDropdownProps {
  // Controller-based props
  controller?: any // ReturnType<typeof useFilterDropdownController>

  // Required props
  title: string
  options: FilterOption[]

  // Legacy props (for backward compatibility)
  icon?: React.ReactNode
  selectedValues?: string[]
  onSelectionChange?: (values: string[]) => void
  onClearFilters?: () => void

  // Configuration
  config?: FilterDropdownConfig
  className?: string
}

// Column visibility component props
export interface ColumnVisibilityProps<T extends TableData> {
  columns: TableColumn<T>[]
  columnVisibility: Record<string, boolean>
  onColumnVisibilityChange: (columnKey: string) => void
  excludeFromToggle?: string[]
  className?: string
}

// Simplified actions type
export interface SimplifiedActions<T extends TableData> {
  edit: { enabled: boolean; handler?: (row: T) => void }
  duplicate: { enabled: boolean; handler?: (row: T) => void }
  delete: { enabled: boolean; handler?: (row: T) => void }
  view: { enabled: boolean; handler?: (row: T) => void }
  download: { enabled: boolean; handler?: (row: T) => void }
  share: { enabled: boolean; handler?: (row: T) => void }
  archive: { enabled: boolean; handler?: (row: T) => void }
}

// Actions object interface for cleaner API
export interface TableActions<T extends TableData> {
  edit?: boolean
  onEdit?: (row: T) => void
  duplicate?: boolean
  onDuplicate?: (row: T) => void
  delete?: boolean
  onDelete?: (row: T) => void
  view?: boolean
  onView?: (row: T) => void
  download?: boolean
  onDownload?: (row: T) => void
  share?: boolean
  onShare?: (row: T) => void
  archive?: boolean
  onArchive?: (row: T) => void
}

// Table body component props
export interface TableBodyComponentProps<T extends TableData> {
  data: T[]
  visibleColumns: TableColumn<T>[]
  showCheckboxes?: boolean
  showActions?: boolean
  showSerialNumber?: boolean
  currentPage?: number
  pageSize?: number
  selectedRows: string[]
  onRowClick?: (row: T) => void
  onRowSelection?: (rowId: string) => void
  onAllRowsSelection?: () => void
  onEdit?: (row: T) => void
  onDuplicate?: (row: T) => void
  onDelete?: (row: T) => void
  className?: string
  actionsColumnConfig?: ActionsColumnConfig<T> & { simplifiedActions?: SimplifiedActions<T> }
}

// Table header component props
export interface TableHeaderProps {
  // Controller-based props
  controller?: any // ReturnType<typeof useTableHeaderController>

  // Legacy props (for backward compatibility)
  searchQuery?: string
  onSearchChange?: (query: string) => void
  showSearch?: boolean
  showStatusFilter?: boolean
  showPriorityFilter?: boolean
  showRoleFilter?: boolean
  showUserStatusFilter?: boolean
  statusOptions?: FilterOption[]
  priorityOptions?: FilterOption[]
  roleOptions?: FilterOption[]
  userStatusOptions?: FilterOption[]
  selectedStatuses?: string[]
  selectedPriorities?: string[]
  selectedRoles?: string[]
  selectedUserStatuses?: string[]
  onStatusFilter?: (values: string[]) => void
  onPriorityFilter?: (values: string[]) => void
  onRoleFilter?: (values: string[]) => void
  onUserStatusFilter?: (values: string[]) => void
  onResetFilters?: () => void
  hasActiveFilters?: boolean

  // Configuration
  config?: TableHeaderConfig
  className?: string
}

// Table pagination component props
export interface TablePaginationProps {
  // Controller-based props
  controller?: any // ReturnType<typeof useTablePaginationController>

  // Legacy props (for backward compatibility)
  currentPage?: number
  totalPages?: number
  pageSize?: number
  totalItems?: number
  selectedRowsCount?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void

  // Configuration
  config?: TablePaginationConfig
  className?: string
}

// Table toolbar component props
export interface TableToolbarProps<T extends TableData> {
  // Controller-based props
  controller?: any // ReturnType<typeof useTableToolbarController<T>>

  // Legacy props (for backward compatibility)
  columns?: TableColumn<T>[]
  columnVisibility?: Record<string, boolean>
  onColumnVisibilityChange?: (columnKey: string) => void
  hasActiveFilters?: boolean
  onResetFilters?: () => void
  showAddButton?: boolean
  onAddClick?: () => void
  addButtonText?: string
  selectedRowsCount?: number

  // Configuration
  config?: TableToolbarConfig
  className?: string
}

// Controller hook props
export interface UseTableToolbarControllerProps<T extends TableData> {
  columns: TableColumn<T>[]
  initialColumnVisibility?: Record<string, boolean>
  columnVisibility?: Record<string, boolean> // Add external column visibility
  selectedRowsCount?: number
  config?: TableToolbarConfig
  onColumnVisibilityChange?: (columnKey: string, visible: boolean) => void
  onAddClick?: () => void
  onBulkDelete?: () => void
  onBulkAction?: (action: string) => void
}

export interface UseTablePaginationControllerProps {
  totalItems: number
  selectedRowsCount?: number
  initialPage?: number
  initialPageSize?: number
  config?: TablePaginationConfig
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
}

export interface UseTableHeaderControllerProps {
  initialState?: Partial<any> // TableHeaderState
  config?: TableHeaderConfig
  // External selected values (from Redux)
  externalSelectedStatuses?: string[]
  externalSelectedPriorities?: string[]
  externalSelectedRoles?: string[]
  externalSelectedUserStatuses?: string[]
  // Event handlers
  onSearchChange?: (query: string) => void
  onStatusFilter?: (values: string[]) => void
  onPriorityFilter?: (values: string[]) => void
  onRoleFilter?: (values: string[]) => void
  onUserStatusFilter?: (values: string[]) => void
  onResetFilters?: () => void
  onFiltersChange?: (filters: any) => void // Partial<TableHeaderState>
}

export interface UseRowActionsControllerProps<T extends TableData> {
  row: T
  customActions?: RowAction[]
  config?: any // RowActionsConfig
  onEdit?: (row: T) => void
  onDuplicate?: (row: T) => void
  onDelete?: (row: T) => void
  onView?: (row: T) => void
  onDownload?: (row: T) => void
  onCustomAction?: (action: RowAction, row: T) => void
}

export interface UseFilterDropdownControllerProps {
  options: FilterOption[]
  selectedValues?: string[] // External selected values (from parent/Redux)
  title: string
  config?: FilterDropdownConfig
  onSelectionChange?: (values: string[]) => void
  onOpen?: () => void
  onClose?: () => void
  useExternalState?: boolean // Flag to use external state only (no internal state)
}
