import type {
  TableData,
  TableColumn,
  SortConfig,
  FilterConfig,
  LegacyTaskData,
  FilterOption,
  RowAction
} from './core.types'
import type {
  TableToolbarConfig,
  TablePaginationConfig,
  TableHeaderConfig,
  RowActionsConfig,
  FilterDropdownConfig
} from './config.types'

// Controller types following auth pattern
export interface ITableControllerResponse<T extends TableData> {
  getters: {
    data: T[]
    filteredData: T[]
    selectedRows: string[]
    currentPage: number
    totalPages: number
    pageSize: number
    searchQuery: string
    sortConfig: SortConfig | null
    filters: FilterConfig
    loading: boolean
    columns: TableColumn<T>[]
    columnVisibility: Record<string, boolean>
    visibleColumns: TableColumn<T>[]
    hasActiveFilters: boolean
    totalItems: number
  }
  handlers: {
    onSearchChange: (query: string) => void
    onPageChange: (page: number) => void
    onPageSizeChange: (pageSize: number) => void
    onSort: (columnKey: string) => void
    onFilter: (key: string, values: string[]) => void
    onResetFilters: () => void
    onRowSelection: (rowId: string) => void
    onAllRowsSelection: () => void
    onColumnVisibilityChange: (columnKey: string) => void
    onRowClick?: (row: T) => void
    onEdit?: (row: T) => void
    onDuplicate?: (row: T) => void
    onDelete?: (row: T) => void
  }
}

export interface IDataTableControllerResponse<T extends TableData> extends ITableControllerResponse<T> {
  getters: ITableControllerResponse<T>['getters'] & {
    statusOptions: Array<{ value: string; label: string; count: number; variant?: string }>
    priorityOptions: Array<{ value: string; label: string; count: number; variant?: string }>
    roleOptions: Array<{ value: string; label: string; count: number; variant?: string }>
    userStatusOptions: Array<{ value: string; label: string; count: number; variant?: string }>
    selectedStatuses: string[]
    selectedPriorities: string[]
    selectedRoles: string[]
    selectedUserStatuses: string[]
  }
  handlers: ITableControllerResponse<T>['handlers'] & {
    onStatusFilter: (values: string[]) => void
    onPriorityFilter: (values: string[]) => void
    onRoleFilter: (values: string[]) => void
    onUserStatusFilter: (values: string[]) => void
  }
}

export interface ITaskTableControllerResponse extends IDataTableControllerResponse<LegacyTaskData> {
  getters: IDataTableControllerResponse<LegacyTaskData>['getters'] & {
    title: string
    description: string
    showCheckboxes: boolean
  }
  handlers: IDataTableControllerResponse<LegacyTaskData>['handlers'] & {
    onTitleChange?: (title: string) => void
    onDescriptionChange?: (description: string) => void
  }
}

// Table toolbar controller types
export interface TableToolbarState {
  columnVisibility: Record<string, boolean>
  selectedRowsCount: number
}

export interface TableToolbarGetters<T extends TableData> {
  columns: TableColumn<T>[]
  columnVisibility: Record<string, boolean>
  visibleColumns: TableColumn<T>[]
  hiddenColumns: TableColumn<T>[]
  toggleableColumns: TableColumn<T>[]
  selectedRowsCount: number
  hasSelectedRows: boolean
  allColumnsVisible: boolean
  someColumnsHidden: boolean
}

export interface TableToolbarHandlers {
  onColumnVisibilityChange: (columnKey: string) => void
  onShowAllColumns: () => void
  onHideAllColumns: () => void
  onResetColumnVisibility: () => void
  onAddClick?: () => void
  onBulkDelete?: () => void
  onBulkAction?: (action: string) => void
}

export interface TableToolbarController<T extends TableData> {
  getters: TableToolbarGetters<T>
  handlers: TableToolbarHandlers
  config: TableToolbarConfig
}

// Table pagination controller types
export interface TablePaginationState {
  currentPage: number
  pageSize: number
  totalItems: number
  selectedRowsCount: number
}

export interface TablePaginationGetters {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
  selectedRowsCount: number
  startItem: number
  endItem: number
  hasItems: boolean
  hasPreviousPage: boolean
  hasNextPage: boolean
  isFirstPage: boolean
  isLastPage: boolean
  pageSizeOptions: number[]
  canGoToPage: (page: number) => boolean
}

export interface TablePaginationHandlers {
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onPreviousPage: () => void
  onNextPage: () => void
  onFirstPage: () => void
  onLastPage: () => void
  onGoToPage: (page: number) => void
}

export interface TablePaginationController {
  getters: TablePaginationGetters
  handlers: TablePaginationHandlers
  config: TablePaginationConfig
}

// Table header controller types
export interface TableHeaderState {
  searchQuery: string
  selectedStatuses: string[]
  selectedPriorities: string[]
  selectedRoles: string[]
  selectedUserStatuses: string[]
}

export interface TableHeaderGetters {
  searchQuery: string
  selectedStatuses: string[]
  selectedPriorities: string[]
  selectedRoles: string[]
  selectedUserStatuses: string[]
  hasActiveFilters: boolean
  hasActiveSearch: boolean
  totalActiveFilters: number
}

export interface TableHeaderHandlers {
  onSearchChange: (query: string) => void
  onStatusFilter: (values: string[]) => void
  onPriorityFilter: (values: string[]) => void
  onRoleFilter: (values: string[]) => void
  onUserStatusFilter: (values: string[]) => void
  onResetFilters: () => void
  onResetSearch: () => void
  onResetAll: () => void
}

export interface TableHeaderController {
  getters: TableHeaderGetters
  handlers: TableHeaderHandlers
  config: TableHeaderConfig
}

// Row actions controller types
export interface RowActionsState {
  isOpen: boolean
  isConfirmingDelete: boolean
  selectedAction: string | null
}

export interface RowActionsGetters {
  isOpen: boolean
  isConfirmingDelete: boolean
  selectedAction: string | null
  availableActions: RowAction[]
  hasActions: boolean
  canEdit: boolean
  canDuplicate: boolean
  canDelete: boolean
}

export interface RowActionsHandlers {
  onToggleOpen: () => void
  onClose: () => void
  onEdit: () => void
  onDuplicate: () => void
  onDelete: () => void
  onConfirmDelete: () => void
  onCancelDelete: () => void
  onCustomAction: (action: RowAction) => void
  onActionClick: (action: RowAction) => void
}

export interface RowActionsController {
  getters: RowActionsGetters
  handlers: RowActionsHandlers
  config: RowActionsConfig
}

// Filter dropdown controller types
export interface FilterDropdownState {
  isOpen: boolean
  searchQuery: string
  selectedValues: string[]
}

export interface FilterDropdownGetters {
  isOpen: boolean
  searchQuery: string
  selectedValues: string[]
  selectedCount: number
  hasSelection: boolean
  filteredOptions: FilterOption[]
  selectedOptions: FilterOption[]
  unselectedOptions: FilterOption[]
  allSelected: boolean
  noneSelected: boolean
  displayText: string
}

export interface FilterDropdownHandlers {
  onToggleOpen: () => void
  onClose: () => void
  onOpen: () => void
  onSearchChange: (query: string) => void
  onToggleOption: (value: string) => void
  onSelectAll: () => void
  onClearAll: () => void
  onSelectionChange: (values: string[]) => void
}

export interface FilterDropdownController {
  getters: FilterDropdownGetters
  handlers: FilterDropdownHandlers
  config: FilterDropdownConfig
}
