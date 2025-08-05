import type {
  TableData,
  TableColumn,
  SortConfig,
  FilterConfig
} from "@/types"
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from "@/types"

/**
 * TableController class for handling table operations
 * Following the same pattern as AuthController
 */
export class TableController {
  /**
   * Filter data based on search query and filters
   */
  static filterData<T extends TableData>(
    data: T[],
    searchQuery: string,
    filters: FilterConfig
  ): T[] {
    let result = [...data]

    // Apply search query
    if (searchQuery) {
      result = result.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        if (Array.isArray(value) && value.length > 0) {
          result = result.filter((item) => value.includes(String(item[key])))
        } else if (!Array.isArray(value)) {
          result = result.filter((item) =>
            String(item[key]).toLowerCase().includes(String(value).toLowerCase())
          )
        }
      }
    })

    return result
  }

  /**
   * Sort data based on sort configuration
   */
  static sortData<T extends TableData>(
    data: T[],
    sortConfig: SortConfig | null
  ): T[] {
    if (!sortConfig) return data

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1
      }
      return 0
    })
  }

  /**
   * Paginate data
   */
  static paginateData<T extends TableData>(
    data: T[],
    currentPage: number,
    pageSize: number
  ): T[] {
    const startIndex = (currentPage - 1) * pageSize
    return data.slice(startIndex, startIndex + pageSize)
  }

  /**
   * Calculate total pages
   */
  static calculateTotalPages(totalItems: number, pageSize: number): number {
    return Math.ceil(totalItems / pageSize)
  }

  /**
   * Get visible columns based on column visibility settings
   */
  static getVisibleColumns<T extends TableData>(
    columns: TableColumn<T>[],
    columnVisibility: Record<string, boolean>
  ): TableColumn<T>[] {
    return [
      columns[0], // Always include first column (usually ID)
      ...columns.slice(1).filter(column => columnVisibility[column.key] !== false)
    ]
  }

  /**
   * Calculate status option counts for filtering
   */
  static getStatusCounts<T extends TableData & { status: string }>(
    data: T[]
  ): Array<{ value: string; label: string; count: number; variant?: string }> {
    const counts: Record<string, number> = {}
    data.forEach((item) => {
      if (item.status) {
        counts[String(item.status)] = (counts[String(item.status)] || 0) + 1
      }
    })
    return STATUS_OPTIONS.map(option => ({
      ...option,
      count: counts[option.value] || 0
    }))
  }

  /**
   * Calculate priority option counts for filtering
   */
  static getPriorityCounts<T extends TableData & { priority: string }>(
    data: T[]
  ): Array<{ value: string; label: string; count: number; variant?: string }> {
    const counts: Record<string, number> = {}
    data.forEach((item) => {
      if (item.priority) {
        counts[String(item.priority)] = (counts[String(item.priority)] || 0) + 1
      }
    })
    return PRIORITY_OPTIONS.map(option => ({
      ...option,
      count: counts[option.value] || 0
    }))
  }

  /**
   * Check if there are active filters
   */
  static hasActiveFilters(filters: FilterConfig): boolean {
    return Object.values(filters).some(value => {
      if (Array.isArray(value)) {
        return value.length > 0
      }
      return value && value !== ""
    })
  }

  /**
   * Toggle row selection
   */
  static toggleRowSelection(
    selectedRows: string[],
    rowId: string
  ): string[] {
    return selectedRows.includes(rowId)
      ? selectedRows.filter((id) => id !== rowId)
      : [...selectedRows, rowId]
  }

  /**
   * Toggle all rows selection for current page
   */
  static toggleAllRowsSelection(
    selectedRows: string[],
    currentPageData: TableData[]
  ): string[] {
    const allCurrentPageIds = currentPageData.map((row) => row.id)
    const allSelected = allCurrentPageIds.every((id) =>
      selectedRows.includes(id)
    )

    if (allSelected) {
      return selectedRows.filter((id) => !allCurrentPageIds.includes(id))
    } else {
      return [
        ...selectedRows.filter((id) => !allCurrentPageIds.includes(id)),
        ...allCurrentPageIds,
      ]
    }
  }

  /**
   * Handle sort configuration changes
   */
  static handleSort(
    currentSortConfig: SortConfig | null,
    columnKey: string
  ): SortConfig | null {
    if (currentSortConfig?.key === columnKey) {
      return currentSortConfig.direction === "asc"
        ? { key: columnKey, direction: "desc" }
        : null
    }
    return { key: columnKey, direction: "asc" }
  }

  /**
   * Validate page number
   */
  static validatePageNumber(page: number, totalPages: number): number {
    return Math.max(1, Math.min(page, totalPages))
  }
}
