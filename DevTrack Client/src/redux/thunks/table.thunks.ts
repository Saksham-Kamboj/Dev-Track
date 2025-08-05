import { createAsyncThunk } from '@reduxjs/toolkit'
import { TableService } from '@/services'
import { REDUX_CONSTANTS } from '@/constants'
import type {
  TableData,
  FetchTableDataParams,
  CreateTableItemParams,
  UpdateTableItemParams,
  DeleteTableItemParams,
  BulkDeleteTableItemsParams,
  TableDataResponse,
  TableOperationResponse
} from '@/types'

// Get TableService instance
const tableService = TableService.getInstance()

/**
 * Fetch table data with pagination, filtering, and sorting
 */
export const fetchTableData = createAsyncThunk<
  TableDataResponse<TableData>,
  FetchTableDataParams & { endpoint: string },
  {
    rejectValue: string
  }
>(REDUX_CONSTANTS.ACTION_TYPES.TABLE.FETCH_DATA, async (params, { rejectWithValue }) => {
  try {
    const { endpoint, ...fetchParams } = params
    const response = await tableService.fetchTableData(endpoint, fetchParams)
    
    return {
      data: response.data,
      total: response.total,
      page: response.page,
      pageSize: response.pageSize,
      hasMore: response.page * response.pageSize < response.total
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : REDUX_CONSTANTS.ERRORS.TABLE.DATA_FETCH_FAILED
    return rejectWithValue(errorMessage)
  }
})



/**
 * Create new table item
 */
export const createTableItem = createAsyncThunk<
  TableOperationResponse<TableData>,
  CreateTableItemParams<TableData> & { endpoint: string },
  {
    rejectValue: string
  }
>(REDUX_CONSTANTS.ACTION_TYPES.TABLE.CREATE_ITEM, async (params, { rejectWithValue }) => {
  try {
    const { endpoint, data } = params
    const response = await tableService.createRecord(endpoint, data)
    
    return {
      success: response.success,
      message: response.message,
      data: response.data
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : REDUX_CONSTANTS.ERRORS.TABLE.ITEM_CREATE_FAILED
    return rejectWithValue(errorMessage)
  }
})



/**
 * Update table item
 */
export const updateTableItem = createAsyncThunk<
  TableOperationResponse<TableData>,
  UpdateTableItemParams<TableData> & { endpoint: string },
  {
    rejectValue: string
  }
>(REDUX_CONSTANTS.ACTION_TYPES.TABLE.UPDATE_ITEM, async (params, { rejectWithValue }) => {
  try {
    const { endpoint, id, data } = params
    const response = await tableService.updateRecord(endpoint, id, data)
    
    return {
      success: response.success,
      message: response.message,
      data: response.data
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : REDUX_CONSTANTS.ERRORS.TABLE.ITEM_UPDATE_FAILED
    return rejectWithValue(errorMessage)
  }
})



/**
 * Delete table item
 */
export const deleteTableItem = createAsyncThunk<
  TableOperationResponse<never>,
  DeleteTableItemParams & { endpoint: string },
  {
    rejectValue: string
  }
>(REDUX_CONSTANTS.ACTION_TYPES.TABLE.DELETE_ITEM, async (params, { rejectWithValue }) => {
  try {
    const { endpoint, id } = params
    const response = await tableService.deleteRecord(endpoint, id)
    
    return {
      success: response.success,
      message: response.message
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : REDUX_CONSTANTS.ERRORS.TABLE.ITEM_DELETE_FAILED
    return rejectWithValue(errorMessage)
  }
})



/**
 * Bulk delete table items
 */
export const bulkDeleteTableItems = createAsyncThunk<
  { success: boolean; message: string; deletedCount: number },
  BulkDeleteTableItemsParams & { endpoint: string },
  {
    rejectValue: string
  }
>(REDUX_CONSTANTS.ACTION_TYPES.TABLE.BULK_DELETE_ITEMS, async (params, { rejectWithValue }) => {
  try {
    const { endpoint, ids } = params
    const response = await tableService.bulkDeleteRecords(endpoint, ids)
    
    return response
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : REDUX_CONSTANTS.ERRORS.TABLE.BULK_DELETE_FAILED
    return rejectWithValue(errorMessage)
  }
})
