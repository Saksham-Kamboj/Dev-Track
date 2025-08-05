import { useState, useMemo, useCallback } from "react"
import type {
  TableData,
  TableState,
  TableStateActions,
  SortConfig,
  FilterConfig,
} from "@/types"

export function useTable<T extends TableData>(
  initialData: T[] = [],
  initialPageSize: number = 10
) {
  const [data, setData] = useState<T[]>(initialData)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)
  const [filters, setFilters] = useState<FilterConfig>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)

  // Filter and sort data
  const filteredData = useMemo(() => {
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

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
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

    return result
  }, [data, searchQuery, filters, sortConfig])

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / pageSize)
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredData.slice(startIndex, startIndex + pageSize)
  }, [filteredData, currentPage, pageSize])

  // Actions
  const toggleRowSelection = useCallback((rowId: string) => {
    setSelectedRows((prev) =>
      prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId]
    )
  }, [])

  const toggleAllRowsSelection = useCallback(() => {
    const allCurrentPageIds = paginatedData.map((row) => row.id)
    const allSelected = allCurrentPageIds.every((id) =>
      selectedRows.includes(id)
    )

    if (allSelected) {
      setSelectedRows((prev) =>
        prev.filter((id) => !allCurrentPageIds.includes(id))
      )
    } else {
      setSelectedRows((prev) => [
        ...prev.filter((id) => !allCurrentPageIds.includes(id)),
        ...allCurrentPageIds,
      ])
    }
  }, [paginatedData, selectedRows])

  const resetFilters = useCallback(() => {
    setFilters({})
    setSearchQuery("")
    setSortConfig(null)
    setCurrentPage(1)
  }, [])

  const handleSort = useCallback((key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return prev.direction === "asc"
          ? { key, direction: "desc" }
          : null
      }
      return { key, direction: "asc" }
    })
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }, [totalPages])

  const state: TableState<T> = {
    data: paginatedData,
    filteredData,
    selectedRows,
    currentPage,
    pageSize,
    totalPages,
    sortConfig,
    filters,
    searchQuery,
    loading,
  }

  const actions: TableStateActions<T> = {
    setData,
    setSelectedRows,
    setCurrentPage: handlePageChange,
    setPageSize,
    setSortConfig,
    setFilters,
    setSearchQuery,
    setLoading,
    toggleRowSelection,
    toggleAllRowsSelection,
    resetFilters,
  }

  return {
    state,
    actions,
    handleSort,
    totalItems: filteredData.length,
  }
}
