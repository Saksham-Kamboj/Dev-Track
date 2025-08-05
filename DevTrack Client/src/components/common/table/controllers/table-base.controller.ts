import { useState, useMemo, useCallback } from "react"
import { TableController } from "./table.controller"
import type {
  TableData,
  TableColumn,
  SortConfig,
  FilterConfig,
  ITableControllerResponse,
  ITableControllerConfig
} from "@/types"

/**
 * Base table controller hook following the auth pattern
 * Provides getters and handlers for table functionality
 */
export function useTableController<T extends TableData>(
  initialData: T[] = [],
  columns: TableColumn<T>[],
  config: ITableControllerConfig = {}
): ITableControllerResponse<T> {
  const {
    pageSize: initialPageSize = 10,
    initialSortConfig = null,
    initialFilters = {}
  } = config

  // State management
  const [data, setData] = useState<T[]>(initialData)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(initialSortConfig)
  const [filters, setFilters] = useState<FilterConfig>(initialFilters)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading] = useState(false)

  // Column visibility state (exclude first column - it's always visible)
  const toggleableColumns = columns.slice(1)
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(
    toggleableColumns.reduce((acc, column) => ({ ...acc, [column.key]: true }), {})
  )

  // Computed values using TableController
  const filteredData = useMemo(() => {
    const filtered = TableController.filterData(data, searchQuery, filters)
    return TableController.sortData(filtered, sortConfig)
  }, [data, searchQuery, filters, sortConfig])

  const paginatedData = useMemo(() => {
    return TableController.paginateData(filteredData, currentPage, pageSize)
  }, [filteredData, currentPage, pageSize])

  const totalPages = useMemo(() => {
    return TableController.calculateTotalPages(filteredData.length, pageSize)
  }, [filteredData.length, pageSize])

  const visibleColumns = useMemo(() => {
    return TableController.getVisibleColumns(columns, columnVisibility)
  }, [columns, columnVisibility])

  const hasActiveFilters = useMemo(() => {
    return TableController.hasActiveFilters(filters)
  }, [filters])

  // Handlers
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query)
    setCurrentPage(1) // Reset to first page when searching
  }, [])

  const handlePageChange = useCallback((page: number) => {
    const validatedPage = TableController.validatePageNumber(page, totalPages)
    setCurrentPage(validatedPage)
  }, [totalPages])

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1) // Reset to first page when changing page size
  }, [])

  const handleSort = useCallback((columnKey: string) => {
    const newSortConfig = TableController.handleSort(sortConfig, columnKey)
    setSortConfig(newSortConfig)
    setCurrentPage(1) // Reset to first page when sorting
  }, [sortConfig])

  const handleFilter = useCallback((key: string, values: string[]) => {
    setFilters(prev => ({ ...prev, [key]: values }))
    setCurrentPage(1) // Reset to first page when filtering
  }, [])

  const handleResetFilters = useCallback(() => {
    setFilters({})
    setSearchQuery("")
    setSortConfig(null)
    setCurrentPage(1)
  }, [])

  const handleRowSelection = useCallback((rowId: string) => {
    setSelectedRows(prev => TableController.toggleRowSelection(prev, rowId))
  }, [])

  const handleAllRowsSelection = useCallback(() => {
    setSelectedRows(prev => TableController.toggleAllRowsSelection(prev, paginatedData))
  }, [paginatedData])

  const handleColumnVisibilityChange = useCallback((columnKey: string) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }))
  }, [])

  // Update data when initialData changes
  useMemo(() => {
    setData(initialData)
  }, [initialData])

  return {
    getters: {
      data: paginatedData,
      filteredData,
      selectedRows,
      currentPage,
      totalPages,
      pageSize,
      searchQuery,
      sortConfig,
      filters,
      loading,
      columns,
      columnVisibility,
      visibleColumns,
      hasActiveFilters,
      totalItems: filteredData.length
    },
    handlers: {
      onSearchChange: handleSearchChange,
      onPageChange: handlePageChange,
      onPageSizeChange: handlePageSizeChange,
      onSort: handleSort,
      onFilter: handleFilter,
      onResetFilters: handleResetFilters,
      onRowSelection: handleRowSelection,
      onAllRowsSelection: handleAllRowsSelection,
      onColumnVisibilityChange: handleColumnVisibilityChange
    }
  }
}
