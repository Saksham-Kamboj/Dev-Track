import type { TableData, SortConfig, FilterConfig, TableColumn } from "@/types"

// User role types
export type UserRole = "admin" | "developer"

// User status types
export type UserStatus = "active" | "inactive" | "pending" | "suspended"

// User data interface extending TableData for table compatibility
export interface UserData extends TableData {
  id: string
  userId: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  joinDate: string
  lastLogin: string
  avatar?: string
  phone?: string
}

// User management controller types
export interface UserManagementControllerConfig {
  title?: string
  description?: string
  showCheckboxes?: boolean
  pageSize?: number
  onUserClick?: (user: UserData) => void
  onAddUser?: () => void
  onUserEdit?: (user: UserData) => void
  onUserDelete?: (user: UserData) => void
  onUserActivate?: (user: UserData) => void
  onUserDeactivate?: (user: UserData) => void
  onTitleChange?: (title: string) => void
  onDescriptionChange?: (description: string) => void
}

export interface UserManagementControllerResponse {
  getters: {
    // Data
    data: UserData[]
    filteredData: UserData[]
    selectedRows: string[]

    // Pagination
    currentPage: number
    totalPages: number
    pageSize: number
    totalItems: number

    // Search and filters
    searchQuery: string
    filters: FilterConfig
    sortConfig: SortConfig | null
    hasActiveFilters: boolean

    // UI state
    loading: boolean
    columns: TableColumn<UserData>[]
    columnVisibility: Record<string, boolean>
    visibleColumns: TableColumn<UserData>[]

    // User-specific
    title: string
    description: string
    showCheckboxes: boolean
    statusOptions: Array<{ value: string; label: string; count?: number }>
    selectedStatuses: string[]
    roleOptions: Array<{ value: string; label: string; count?: number }>
    userStatusOptions: Array<{ value: string; label: string; count?: number }>
    selectedRoles: string[]
    selectedUserStatuses: string[]
  }

  handlers: {
    // Table handlers
    onSearchChange: (query: string) => void
    onPageChange: (page: number) => void
    onSort: (columnKey: string) => void
    onFilter: (key: string, values: string[]) => void
    onResetFilters: () => void
    onRowSelection: (id: string) => void
    onAllRowsSelection: () => void
    onColumnVisibilityChange: (columnKey: string) => void

    // User-specific handlers
    onStatusFilter: (values: string[]) => void
    onAddUser: () => void
    onRoleFilter: (values: string[]) => void
    onUserStatusFilter: (values: string[]) => void
    onUserClick: (user: UserData) => void
    onUserEdit: (user: UserData) => void
    onUserDelete: (user: UserData) => void
    onUserActivate: (user: UserData) => void
    onUserDeactivate: (user: UserData) => void
    onTitleChange: (title: string) => void
    onDescriptionChange: (description: string) => void
  }
}

// User filter options
export const USER_ROLE_OPTIONS = [
  { value: "admin", label: "Admin", variant: "in-progress" },
  { value: "developer", label: "Developer", variant: "medium" },
] as const

export const USER_STATUS_OPTIONS = [
  { value: "active", label: "Active", variant: "done" },
  { value: "inactive", label: "Inactive", variant: "cancelled" },
] as const
