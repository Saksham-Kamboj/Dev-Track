import { BaseService } from "@/services/base/base.service"
import type {
  TaskFormData,
  TaskApiResponse,
  TaskQueryParams,
  TaskComment
} from "@/types/task/task.types"

/**
 * Task Service
 * Handles all task-related API operations
 */
export class TaskService extends BaseService {
  private readonly baseUrl = '/tasks'

  /**
   * Get all tasks with filtering and pagination
   */
  async getTasks(params?: TaskQueryParams): Promise<TaskApiResponse> {
    try {
      const queryParams = new URLSearchParams()

      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.search) queryParams.append('search', params.search)
      if (params?.assignedTo) queryParams.append('assignedTo', params.assignedTo)
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder)

      // Handle array parameters
      if (params?.status) {
        const statuses = Array.isArray(params.status) ? params.status : [params.status]
        statuses.forEach(status => queryParams.append('status', status))
      }

      if (params?.priority) {
        const priorities = Array.isArray(params.priority) ? params.priority : [params.priority]
        priorities.forEach(priority => queryParams.append('priority', priority))
      }

      if (params?.type) {
        const types = Array.isArray(params.type) ? params.type : [params.type]
        types.forEach(type => queryParams.append('type', type))
      }

      const url = queryParams.toString() ? `${this.baseUrl}?${queryParams}` : this.baseUrl
      return await this.get(url)
    } catch (error) {
      console.error('Get tasks error:', error)
      throw error
    }
  }

  /**
   * Get task by ID
   */
  async getTaskById(taskId: string): Promise<TaskApiResponse> {
    try {
      return await this.get(`${this.baseUrl}/${taskId}`)
    } catch (error) {
      console.error('Get task by ID error:', error)
      throw error
    }
  }

  /**
   * Create a new task
   */
  async createTask(taskData: TaskFormData): Promise<TaskApiResponse> {
    try {
      return await this.post(this.baseUrl, taskData)
    } catch (error) {
      console.error('Create task error:', error)
      throw error
    }
  }

  /**
   * Update task
   */
  async updateTask(taskId: string, taskData: Partial<TaskFormData>): Promise<TaskApiResponse> {
    try {
      return await this.put(`${this.baseUrl}/${taskId}`, taskData)
    } catch (error) {
      console.error('Update task error:', error)
      throw error
    }
  }

  /**
   * Delete task
   */
  async deleteTask(taskId: string): Promise<TaskApiResponse> {
    try {
      return await this.delete(`${this.baseUrl}/${taskId}`)
    } catch (error) {
      console.error('Delete task error:', error)
      throw error
    }
  }

  /**
   * Add comment to task
   */
  async addComment(taskId: string, text: string): Promise<{
    success: boolean
    message: string
    comment: TaskComment
  }> {
    try {
      return await this.post(`${this.baseUrl}/${taskId}/comments`, { text })
    } catch (error) {
      console.error('Add comment error:', error)
      throw error
    }
  }

  /**
   * Update task status
   */
  async updateTaskStatus(taskId: string, status: string): Promise<TaskApiResponse> {
    try {
      return await this.put(`${this.baseUrl}/${taskId}`, { status })
    } catch (error) {
      console.error('Update task status error:', error)
      throw error
    }
  }

  /**
   * Update task priority
   */
  async updateTaskPriority(taskId: string, priority: string): Promise<TaskApiResponse> {
    try {
      return await this.put(`${this.baseUrl}/${taskId}`, { priority })
    } catch (error) {
      console.error('Update task priority error:', error)
      throw error
    }
  }

  /**
   * Assign task to user
   */
  async assignTask(taskId: string, assignedTo: string): Promise<TaskApiResponse> {
    try {
      return await this.put(`${this.baseUrl}/${taskId}`, { assignedTo })
    } catch (error) {
      console.error('Assign task error:', error)
      throw error
    }
  }

  /**
   * Get task statistics
   */
  async getTaskStats(): Promise<{
    success: boolean
    stats: {
      total: number
      todo: number
      inProgress: number
      backlog: number
      done: number
      cancelled: number
      highPriority: number
      mediumPriority: number
      lowPriority: number
      overdue: number
    }
  }> {
    try {
      return await this.get(`${this.baseUrl}/stats`)
    } catch (error) {
      console.error('Get task stats error:', error)
      throw error
    }
  }
}

// Export singleton instance
export const taskService = new TaskService()
