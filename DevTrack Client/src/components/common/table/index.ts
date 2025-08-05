// Main table components
export { DataTable } from "./data-table"

// Table hook
export { useTable } from "./use-table"

// Sub-components
export * from "./components"
export * from "./filters"

// Controllers
export * from "./controllers"

// Redux hooks
export * from "./hooks/use-table-redux"

// Services
export { TableService } from "@/services"

// Redux exports
export {
    default as tableReducer,
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
} from "@/redux/slices/tableSlice"

// Redux selectors
export * from "@/redux/selectors/table.selectors"

// Re-export types for convenience
export type {
    TableColumn,
    TableConfig,
    TableData,
    TableState,
    TableStateActions,
    TableActions,
    SortConfig,
    FilterConfig,
    FilterOption,
    RowAction,
    ITableControllerResponse,
    IDataTableControllerResponse,
    ITableActionData,
    ITableControllerConfig,
    TableReduxState,
    TableReduxActions,
    FetchTableDataParams,
    CreateTableItemParams,
    UpdateTableItemParams,
    DeleteTableItemParams,
    BulkDeleteTableItemsParams,
    TableDataResponse,
    TableOperationResponse,
    DataTableProps
} from "@/types"
