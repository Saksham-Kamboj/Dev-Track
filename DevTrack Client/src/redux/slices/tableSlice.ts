import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { TableController } from '@/components/common/table/controllers/table.controller'
import { REDUX_CONSTANTS } from '@/constants'
import type {
  TableData,
  TableReduxState,
  SortConfig,
  FilterConfig
} from '@/types'
import {
  fetchTableData,
  createTableItem,
  updateTableItem,
  deleteTableItem,
  bulkDeleteTableItems
} from '../thunks/table.thunks'

const initialState: TableReduxState = {
  // Data state
  data: [],
  originalData: [],
  filteredData: [],
  paginatedData: [],

  // UI state
  selectedRows: [],
  currentPage: REDUX_CONSTANTS.DEFAULTS.CURRENT_PAGE,
  totalPages: REDUX_CONSTANTS.DEFAULTS.CURRENT_PAGE,
  pageSize: REDUX_CONSTANTS.DEFAULTS.PAGE_SIZE,
  totalItems: 0,

  // Filter and search state
  searchQuery: REDUX_CONSTANTS.DEFAULTS.EMPTY_STRING,
  filters: {},
  sortConfig: null,

  // Column state
  columnVisibility: {},

  // Actions column state
  actionsColumnConfig: {
    show: true,
    position: 'end',
    width: '80px'
  },
  customActions: null,

  // Loading and error state
  loading: false,
  error: null,

  // Operation states
  creating: false,
  updating: false,
  deleting: false,

  // Cache and metadata
  lastFetch: null,
  cacheExpiry: REDUX_CONSTANTS.CACHE.TABLE_CACHE_EXPIRY,
  lastUpdate: Date.now(),
}

const tableSlice = createSlice({
  name: REDUX_CONSTANTS.SLICE_NAMES.TABLE,
  initialState,
  reducers: {
    // Data actions
    setData: (state, action: PayloadAction<TableData[]>) => {
      state.data = action.payload
      state.originalData = action.payload
      state.lastFetch = Date.now()
      // Recalculate derived data
      tableSlice.caseReducers.recalculateData(state)
    },

    addItem: (state, action: PayloadAction<TableData>) => {
      state.data.unshift(action.payload)
      state.originalData.unshift(action.payload)
      tableSlice.caseReducers.recalculateData(state)
    },

    updateItem: (state, action: PayloadAction<{ id: string; updates: Partial<TableData> }>) => {
      const { id, updates } = action.payload
      const index = state.data.findIndex(item => item.id === id)
      if (index !== -1) {
        state.data[index] = { ...state.data[index], ...updates }
        const originalIndex = state.originalData.findIndex(item => item.id === id)
        if (originalIndex !== -1) {
          state.originalData[originalIndex] = { ...state.originalData[originalIndex], ...updates }
        }
        tableSlice.caseReducers.recalculateData(state)
      }
    },

    removeItem: (state, action: PayloadAction<string>) => {
      const id = action.payload
      state.data = state.data.filter(item => item.id !== id)
      state.originalData = state.originalData.filter(item => item.id !== id)
      state.selectedRows = state.selectedRows.filter(rowId => rowId !== id)
      tableSlice.caseReducers.recalculateData(state)
    },

    // Selection actions
    selectRow: (state, action: PayloadAction<string>) => {
      const id = action.payload
      state.selectedRows = TableController.toggleRowSelection(state.selectedRows, id)
    },

    selectAllRows: (state) => {
      state.selectedRows = TableController.toggleAllRowsSelection(state.selectedRows, state.paginatedData)
    },

    clearSelection: (state) => {
      state.selectedRows = []
    },

    // Pagination actions
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = TableController.validatePageNumber(action.payload, state.totalPages)
      tableSlice.caseReducers.recalculateData(state)
    },

    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload
      state.currentPage = 1 // Reset to first page
      tableSlice.caseReducers.recalculateData(state)
    },

    // Filter and search actions
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      state.currentPage = 1 // Reset to first page
      tableSlice.caseReducers.recalculateData(state)
    },

    setFilters: (state, action: PayloadAction<FilterConfig>) => {
      state.filters = action.payload
      state.currentPage = 1 // Reset to first page
      state.lastUpdate = Date.now() // Force re-render
      tableSlice.caseReducers.recalculateData(state)
    },

    setSortConfig: (state, action: PayloadAction<SortConfig | null>) => {
      state.sortConfig = action.payload
      state.currentPage = 1 // Reset to first page
      tableSlice.caseReducers.recalculateData(state)
    },

    resetFilters: (state) => {
      state.searchQuery = ''
      state.filters = {}
      state.sortConfig = null
      state.currentPage = 1
      state.lastUpdate = Date.now() // Force re-render
      tableSlice.caseReducers.recalculateData(state)
    },

    // Column actions
    setColumnVisibility: (state, action: PayloadAction<{ columnKey: string; visible: boolean }>) => {
      const { columnKey, visible } = action.payload
      state.columnVisibility[columnKey] = visible
    },

    resetColumnVisibility: (state) => {
      state.columnVisibility = {}
    },

    // Actions column actions
    setActionsColumnConfig: (state, action: PayloadAction<Partial<any>>) => {
      state.actionsColumnConfig = { ...state.actionsColumnConfig, ...action.payload }
    },

    setCustomActions: (state, action: PayloadAction<any>) => {
      state.customActions = action.payload
    },

    toggleActionsColumn: (state) => {
      state.actionsColumnConfig.show = !state.actionsColumnConfig.show
    },

    // Loading actions
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },

    // Internal helper to recalculate derived data
    recalculateData: (state) => {
      // Apply filters and search
      let filtered = TableController.filterData(state.originalData, state.searchQuery, state.filters)

      // Apply sorting
      filtered = TableController.sortData(filtered, state.sortConfig)

      state.filteredData = filtered
      state.totalItems = filtered.length
      state.totalPages = TableController.calculateTotalPages(filtered.length, state.pageSize)

      // Apply pagination
      state.paginatedData = TableController.paginateData(filtered, state.currentPage, state.pageSize)
    },

    // Reset state
    resetState: () => initialState
  },

  extraReducers: (builder) => {
    // Fetch table data
    builder
      .addCase(fetchTableData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTableData.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload.data
        state.originalData = action.payload.data
        state.totalItems = action.payload.total
        state.currentPage = action.payload.page
        state.pageSize = action.payload.pageSize
        state.lastFetch = Date.now()
        tableSlice.caseReducers.recalculateData(state)
      })
      .addCase(fetchTableData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || REDUX_CONSTANTS.ERRORS.TABLE.DATA_FETCH_FAILED
      })



    // Create operations
    builder
      .addCase(createTableItem.pending, (state) => {
        state.creating = true
        state.error = null
      })
      .addCase(createTableItem.fulfilled, (state, action) => {
        state.creating = false
        if (action.payload.success && action.payload.data) {
          tableSlice.caseReducers.addItem(state, { payload: action.payload.data, type: 'addItem' })
        }
      })
      .addCase(createTableItem.rejected, (state, action) => {
        state.creating = false
        state.error = action.payload || REDUX_CONSTANTS.ERRORS.TABLE.ITEM_CREATE_FAILED
      })



    // Update operations
    builder
      .addCase(updateTableItem.pending, (state) => {
        state.updating = true
        state.error = null
      })
      .addCase(updateTableItem.fulfilled, (state, action) => {
        state.updating = false
        if (action.payload.success && action.payload.data) {
          tableSlice.caseReducers.updateItem(state, {
            payload: { id: action.payload.data.id, updates: action.payload.data },
            type: 'updateItem'
          })
        }
      })
      .addCase(updateTableItem.rejected, (state, action) => {
        state.updating = false
        state.error = action.payload || REDUX_CONSTANTS.ERRORS.TABLE.ITEM_UPDATE_FAILED
      })



    // Delete operations
    builder
      .addCase(deleteTableItem.pending, (state) => {
        state.deleting = true
        state.error = null
      })
      .addCase(deleteTableItem.fulfilled, (state) => {
        state.deleting = false
        // Note: We need to track the deleted ID separately since it's not in the response
      })
      .addCase(deleteTableItem.rejected, (state, action) => {
        state.deleting = false
        state.error = action.payload || REDUX_CONSTANTS.ERRORS.TABLE.ITEM_DELETE_FAILED
      })



    // Bulk delete operations
    builder
      .addCase(bulkDeleteTableItems.pending, (state) => {
        state.deleting = true
        state.error = null
      })
      .addCase(bulkDeleteTableItems.fulfilled, (state) => {
        state.deleting = false
        // Note: We need to track the deleted IDs separately
      })
      .addCase(bulkDeleteTableItems.rejected, (state, action) => {
        state.deleting = false
        state.error = action.payload || REDUX_CONSTANTS.ERRORS.TABLE.BULK_DELETE_FAILED
      })
  }
})

export const {
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
  resetState
} = tableSlice.actions

export default tableSlice.reducer

// Export thunks for convenience
export {
  fetchTableData,
  createTableItem,
  updateTableItem,
  deleteTableItem,
  bulkDeleteTableItems
} from '../thunks/table.thunks'
