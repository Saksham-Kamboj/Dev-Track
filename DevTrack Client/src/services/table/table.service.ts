import { BaseApiService } from '@/services'
import type { TableData, TaskData } from '@/types'

/**
 * TableService class for handling table-related API operations
 * Following the same pattern as AuthService
 */
export class TableService extends BaseApiService {
  private static instance: TableService

  constructor() {
    super()
  }

  /**
   * Get singleton instance of TableService
   */
  static getInstance(): TableService {
    if (!TableService.instance) {
      TableService.instance = new TableService()
    }
    return TableService.instance
  }

  /**
   * Fetch table data with pagination and filters
   */
  async fetchTableData<T extends TableData>(
    endpoint: string,
    params?: {
      page?: number
      pageSize?: number
      search?: string
      filters?: Record<string, unknown>
      sort?: { key: string; direction: 'asc' | 'desc' }
    }
  ): Promise<{
    data: T[]
    total: number
    page: number
    pageSize: number
  }> {
    try {
      const queryParams = new URLSearchParams()

      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())
      if (params?.search) queryParams.append('search', params.search)
      if (params?.sort) {
        queryParams.append('sortKey', params.sort.key)
        queryParams.append('sortDirection', params.sort.direction)
      }
      if (params?.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(`filter_${key}`, String(value))
          }
        })
      }

      const url = `${endpoint}?${queryParams.toString()}`
      return await this.get<{
        data: T[]
        total: number
        page: number
        pageSize: number
      }>(url)
    } catch (error) {
      console.error('Fetch table data error:', error)
      throw error
    }
  }

  /**
   * Create new table record
   */
  async createRecord<T extends TableData>(
    endpoint: string,
    data: Omit<T, 'id'>
  ): Promise<{ success: boolean; message: string; data: T }> {
    try {
      return await this.post<{ success: boolean; message: string; data: T }, Omit<T, 'id'>>(
        endpoint,
        data
      )
    } catch (error) {
      console.error('Create record error:', error)
      throw error
    }
  }

  /**
   * Update table record
   */
  async updateRecord<T extends TableData>(
    endpoint: string,
    id: string,
    data: Partial<T>
  ): Promise<{ success: boolean; message: string; data: T }> {
    try {
      return await this.put<{ success: boolean; message: string; data: T }, Partial<T>>(
        `${endpoint}/${id}`,
        data
      )
    } catch (error) {
      console.error('Update record error:', error)
      throw error
    }
  }

  /**
   * Delete table record
   */
  async deleteRecord(
    endpoint: string,
    id: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      return await this.delete<{ success: boolean; message: string }>(`${endpoint}/${id}`)
    } catch (error) {
      console.error('Delete record error:', error)
      throw error
    }
  }

  /**
   * Bulk delete table records
   */
  async bulkDeleteRecords(
    endpoint: string,
    ids: string[]
  ): Promise<{ success: boolean; message: string; deletedCount: number }> {
    try {
      return await this.post<
        { success: boolean; message: string; deletedCount: number },
        { ids: string[] }
      >(`${endpoint}/bulk-delete`, { ids })
    } catch (error) {
      console.error('Bulk delete records error:', error)
      throw error
    }
  }



  /**
   * Get task data (specific implementation for TaskData)
   */
  async fetchTasks(params?: {
    page?: number
    pageSize?: number
    search?: string
    status?: string[]
    priority?: string[]
    type?: string[]
    sort?: { key: string; direction: 'asc' | 'desc' }
  }): Promise<{
    data: TaskData[]
    total: number
    page: number
    pageSize: number
  }> {
    const filters: Record<string, unknown> = {}
    if (params?.status) filters.status = params.status
    if (params?.priority) filters.priority = params.priority
    if (params?.type) filters.type = params.type

    return this.fetchTableData<TaskData>('/api/tasks', {
      page: params?.page,
      pageSize: params?.pageSize,
      search: params?.search,
      filters,
      sort: params?.sort
    })
  }

  /**
   * Create new task
   */
  async createTask(
    taskData: Omit<TaskData, 'id'>
  ): Promise<{ success: boolean; message: string; data: TaskData }> {
    return this.createRecord<TaskData>('/api/tasks', taskData)
  }

  /**
   * Update task
   */
  async updateTask(
    id: string,
    taskData: Partial<TaskData>
  ): Promise<{ success: boolean; message: string; data: TaskData }> {
    return this.updateRecord<TaskData>('/api/tasks', id, taskData)
  }

  /**
   * Delete task
   */
  async deleteTask(id: string): Promise<{ success: boolean; message: string }> {
    return this.deleteRecord('/api/tasks', id)
  }
}
