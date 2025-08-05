import type { TablePaginationConfig, TablePaginationController, TablePaginationGetters, TablePaginationHandlers, UseTablePaginationControllerProps } from '@/types'
import { useState, useCallback, useMemo, useEffect } from 'react'

export function useTablePaginationController({
  totalItems,
  selectedRowsCount = 0,
  initialPage = 1,
  initialPageSize,
  config = {},
  onPageChange: externalOnPageChange,
  onPageSizeChange: externalOnPageSizeChange,
}: UseTablePaginationControllerProps): TablePaginationController {
  // Configuration with defaults
  const finalConfig: TablePaginationConfig = {
    pageSizeOptions: [10, 20, 40, 50],
    showPageSizeSelector: true,
    showPageInfo: true,
    showItemRange: true,
    showSelectedCount: true,
    defaultPageSize: 10,
    ...config,
  }

  // State management
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize || finalConfig.defaultPageSize || 10)

  // Update current page when totalItems changes (e.g., due to filtering)
  useEffect(() => {
    const newTotalPages = Math.max(1, Math.ceil(totalItems / pageSize))
    if (currentPage > newTotalPages) {
      setCurrentPage(1) // Reset to first page if current page is beyond new total pages
      externalOnPageChange?.(1) // Notify external handler
    }
  }, [totalItems, pageSize, currentPage, externalOnPageChange])

  // Computed getters - recalculated whenever totalItems, currentPage, or pageSize changes
  const getters = useMemo((): TablePaginationGetters => {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
    const startItem = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0
    const endItem = Math.min(currentPage * pageSize, totalItems)
    const hasItems = totalItems > 0
    const hasPreviousPage = currentPage > 1
    const hasNextPage = currentPage < totalPages
    const isFirstPage = currentPage === 1
    const isLastPage = currentPage === totalPages

    const canGoToPage = (page: number) => {
      return page >= 1 && page <= totalPages
    }

    return {
      currentPage,
      pageSize,
      totalItems, // This will always reflect the current totalItems prop
      totalPages,
      selectedRowsCount,
      startItem,
      endItem,
      hasItems,
      hasPreviousPage,
      hasNextPage,
      isFirstPage,
      isLastPage,
      pageSizeOptions: finalConfig.pageSizeOptions || [10, 20, 40, 50],
      canGoToPage,
    }
  }, [currentPage, pageSize, totalItems, selectedRowsCount, finalConfig.pageSizeOptions])

  // Event handlers
  const handlePageChange = useCallback((page: number) => {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
    const canGoToPage = page >= 1 && page <= totalPages

    if (canGoToPage) {
      setCurrentPage(page)
      externalOnPageChange?.(page)
    }
  }, [totalItems, pageSize, externalOnPageChange])

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize)
    // Reset to first page when changing page size
    setCurrentPage(1)
    externalOnPageSizeChange?.(newPageSize)
    externalOnPageChange?.(1)
  }, [externalOnPageSizeChange, externalOnPageChange])

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1)
    }
  }, [currentPage, handlePageChange])

  const handleNextPage = useCallback(() => {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1)
    }
  }, [currentPage, totalItems, pageSize, handlePageChange])

  const handleFirstPage = useCallback(() => {
    if (currentPage !== 1) {
      handlePageChange(1)
    }
  }, [currentPage, handlePageChange])

  const handleLastPage = useCallback(() => {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
    if (currentPage !== totalPages) {
      handlePageChange(totalPages)
    }
  }, [currentPage, totalItems, pageSize, handlePageChange])

  const handleGoToPage = useCallback((page: number) => {
    handlePageChange(page)
  }, [handlePageChange])

  const handlers: TablePaginationHandlers = {
    onPageChange: handlePageChange,
    onPageSizeChange: handlePageSizeChange,
    onPreviousPage: handlePreviousPage,
    onNextPage: handleNextPage,
    onFirstPage: handleFirstPage,
    onLastPage: handleLastPage,
    onGoToPage: handleGoToPage,
  }

  return {
    getters,
    handlers,
    config: finalConfig,
  }
}
