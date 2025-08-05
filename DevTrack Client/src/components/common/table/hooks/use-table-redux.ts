import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { TableController } from '../controllers/table.controller'
import {
  setData,
  addItem,
  updateItem,
  removeItem,
  selectRow,
  selectAllRows,
  clearSelection,
  setCurrentPage,
  setPageSize,
  setSearchQuery,
  setFilters,
  setSortConfig,
  resetFilters,
  setColumnVisibility,
  resetColumnVisibility,
  setActionsColumnConfig,
  setCustomActions,
  toggleActionsColumn,
  setLoading,
  setError,
  resetState,
  fetchTableData,
  createTableItem,
  updateTableItem,
  deleteTableItem,
  bulkDeleteTableItems
} from '@/redux/slices/tableSlice'
import {
  selectTableData,
  selectPaginatedTableData,
  selectSelectedRows,
  selectCurrentPage,
  selectTotalPages,
  selectPageSize,
  selectTotalItems,
  selectSearchQuery,
  selectFilters,
  selectSortConfig,
  selectHasActiveFilters,
  selectColumnVisibility,
  selectActionsColumnConfig,
  selectCustomActions,
  selectActionsColumnVisible,
  selectTableLoading,
  selectTableError,
  selectTableOperationLoading,
  selectPaginationInfo,
  selectTableStateSummary
} from '@/redux/selectors/table.selectors'
import type {
  TableData,
  TableColumn,
  SortConfig,
  FilterConfig,
  FetchTableDataParams,
  CreateTableItemParams,
  UpdateTableItemParams,
  DeleteTableItemParams,
  BulkDeleteTableItemsParams
} from '@/types'

/**
 * Custom hook for table Redux operations
 * Provides a clean interface for table state management
 */
export function useTableRedux<T extends TableData = TableData>() {
  const dispatch = useAppDispatch()

  // Selectors
  const data = useAppSelector(selectPaginatedTableData) as T[]
  const allData = useAppSelector(selectTableData) as T[]
  const selectedRows = useAppSelector(selectSelectedRows)
  const currentPage = useAppSelector(selectCurrentPage)
  const totalPages = useAppSelector(selectTotalPages)
  const pageSize = useAppSelector(selectPageSize)
  const totalItems = useAppSelector(selectTotalItems)
  const searchQuery = useAppSelector(selectSearchQuery)
  const filters = useAppSelector(selectFilters)
  const sortConfig = useAppSelector(selectSortConfig)
  const hasActiveFilters = useAppSelector(selectHasActiveFilters)
  const columnVisibility = useAppSelector(selectColumnVisibility)
  const actionsColumnConfig = useAppSelector(selectActionsColumnConfig)
  const customActions = useAppSelector(selectCustomActions)
  const actionsColumnVisible = useAppSelector(selectActionsColumnVisible)
  const loading = useAppSelector(selectTableLoading)
  const error = useAppSelector(selectTableError)
  const operationLoading = useAppSelector(selectTableOperationLoading)
  const paginationInfo = useAppSelector(selectPaginationInfo)
  const stateSummary = useAppSelector(selectTableStateSummary)

  // Actions
  const actions = {
    // Data actions
    setData: useCallback((data: T[]) => {
      dispatch(setData(data))
    }, [dispatch]),

    addItem: useCallback((item: T) => {
      dispatch(addItem(item))
    }, [dispatch]),

    updateItem: useCallback((id: string, updates: Partial<T>) => {
      dispatch(updateItem({ id, updates }))
    }, [dispatch]),

    removeItem: useCallback((id: string) => {
      dispatch(removeItem(id))
    }, [dispatch]),

    // Selection actions
    selectRow: useCallback((id: string) => {
      dispatch(selectRow(id))
    }, [dispatch]),

    selectAllRows: useCallback(() => {
      dispatch(selectAllRows())
    }, [dispatch]),

    clearSelection: useCallback(() => {
      dispatch(clearSelection())
    }, [dispatch]),

    // Pagination actions
    setCurrentPage: useCallback((page: number) => {
      dispatch(setCurrentPage(page))
    }, [dispatch]),

    setPageSize: useCallback((size: number) => {
      dispatch(setPageSize(size))
    }, [dispatch]),

    // Filter and search actions
    setSearchQuery: useCallback((query: string) => {
      dispatch(setSearchQuery(query))
    }, [dispatch]),

    setFilters: useCallback((filters: FilterConfig) => {
      dispatch(setFilters(filters))
    }, [dispatch]),

    setSortConfig: useCallback((config: SortConfig | null) => {
      dispatch(setSortConfig(config))
    }, [dispatch]),

    resetFilters: useCallback(() => {
      dispatch(resetFilters())
    }, [dispatch]),

    // Column actions
    setColumnVisibility: useCallback((columnKey: string, visible: boolean) => {
      dispatch(setColumnVisibility({ columnKey, visible }))
    }, [dispatch]),

    resetColumnVisibility: useCallback(() => {
      dispatch(resetColumnVisibility())
    }, [dispatch]),

    // Loading actions
    setLoading: useCallback((loading: boolean) => {
      dispatch(setLoading(loading))
    }, [dispatch]),

    setError: useCallback((error: string | null) => {
      dispatch(setError(error))
    }, [dispatch]),

    // Reset state
    resetState: useCallback(() => {
      dispatch(resetState())
    }, [dispatch]),

    // Actions column actions
    setActionsColumnConfig: useCallback((config: any) => {
      dispatch(setActionsColumnConfig(config))
    }, [dispatch]),

    setCustomActions: useCallback((actions: any) => {
      dispatch(setCustomActions(actions))
    }, [dispatch]),

    toggleActionsColumn: useCallback(() => {
      dispatch(toggleActionsColumn())
    }, [dispatch])
  }

  // Async actions
  const asyncActions = {
    // Fetch data
    fetchData: useCallback((params: FetchTableDataParams & { endpoint: string }) => {
      return dispatch(fetchTableData(params))
    }, [dispatch]),

    // Create operations
    createItem: useCallback((params: CreateTableItemParams<T> & { endpoint: string }) => {
      return dispatch(createTableItem(params))
    }, [dispatch]),

    // Update operations
    updateItem: useCallback((params: UpdateTableItemParams<T> & { endpoint: string }) => {
      return dispatch(updateTableItem(params))
    }, [dispatch]),

    // Delete operations
    deleteItem: useCallback((params: DeleteTableItemParams & { endpoint: string }) => {
      return dispatch(deleteTableItem(params))
    }, [dispatch]),

    // Bulk operations
    bulkDeleteItems: useCallback((params: BulkDeleteTableItemsParams & { endpoint: string }) => {
      return dispatch(bulkDeleteTableItems(params))
    }, [dispatch])
  }

  // Helper functions
  const helpers = {
    getVisibleColumns: useCallback((columns: TableColumn<T>[]) => {
      return TableController.getVisibleColumns(columns, columnVisibility)
    }, [columnVisibility]),

    isRowSelected: useCallback((id: string) => {
      return selectedRows.includes(id)
    }, [selectedRows]),

    getSelectedRowsData: useCallback(() => {
      return allData.filter(item => selectedRows.includes(item.id))
    }, [allData, selectedRows]),

    hasSelection: useCallback(() => {
      return selectedRows.length > 0
    }, [selectedRows]),

    isAllCurrentPageSelected: useCallback(() => {
      return data.length > 0 && data.every(item => selectedRows.includes(item.id))
    }, [data, selectedRows])
  }

  return {
    // State
    data,
    allData,
    selectedRows,
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    searchQuery,
    filters,
    sortConfig,
    hasActiveFilters,
    columnVisibility,
    actionsColumnConfig,
    customActions,
    actionsColumnVisible,
    loading,
    error,
    operationLoading,
    paginationInfo,
    stateSummary,

    // Actions
    actions,
    asyncActions,
    helpers
  }
}


