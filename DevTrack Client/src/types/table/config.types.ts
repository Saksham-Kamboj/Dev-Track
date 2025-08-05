import type { SortConfig, FilterConfig, ActionsColumnConfig, TableData } from './core.types'

// Table configuration
export interface TableConfig<T extends TableData = TableData> {
  showCheckboxes?: boolean
  showPagination?: boolean
  showSearch?: boolean
  showFilters?: boolean
  showActions?: boolean
  showSerialNumber?: boolean
  pageSize?: number
  sortable?: boolean
  selectable?: boolean
  actionsColumn?: ActionsColumnConfig<T>
}

// Table configuration for controllers
export interface ITableControllerConfig<T extends TableData = TableData> {
  showCheckboxes?: boolean
  showPagination?: boolean
  showSearch?: boolean
  showStatusFilter?: boolean
  showPriorityFilter?: boolean
  pageSize?: number
  initialSortConfig?: SortConfig
  initialFilters?: FilterConfig
  actionsColumn?: ActionsColumnConfig<T>
}

// Table toolbar configuration
export interface TableToolbarConfig {
  showAddButton?: boolean
  showColumnVisibility?: boolean
  showBulkActions?: boolean
  addButtonText?: string
  excludeColumnsFromToggle?: string[]
}

// Table pagination configuration
export interface TablePaginationConfig {
  pageSizeOptions?: number[]
  showPageSizeSelector?: boolean
  showPageInfo?: boolean
  showItemRange?: boolean
  showSelectedCount?: boolean
  defaultPageSize?: number
}

// Table header configuration
export interface TableHeaderConfig {
  showSearch?: boolean
  showStatusFilter?: boolean
  showPriorityFilter?: boolean
  showRoleFilter?: boolean
  showUserStatusFilter?: boolean
  searchPlaceholder?: string
}

// Row actions configuration
export interface RowActionsConfig {
  showEdit?: boolean
  showDuplicate?: boolean
  showDelete?: boolean
  showCustomActions?: boolean
  confirmDelete?: boolean
  deleteConfirmMessage?: string
}

// Filter dropdown configuration
export interface FilterDropdownConfig {
  multiSelect?: boolean
  showSelectAll?: boolean
  showClearAll?: boolean
  showSearch?: boolean
  maxDisplayItems?: number
  closeOnSelect?: boolean
}
