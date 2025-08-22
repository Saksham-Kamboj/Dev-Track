import { API_ROUTES } from '@/constants'
import { apiFetch } from '@/lib/api'
import type {
  TaskFormData,
  TaskQueryParams,
  TaskApiResponse
} from '@/types/task/task.types'

/**
 * Admin Task Service
 * Uses common task API endpoints with admin role privileges
 */
export class AdminTaskService {
  /**
   * Get all tasks with admin privileges (uses common /api/tasks endpoint)
   * Admin role can see all tasks, not just assigned ones
   */
  static async getAllTasks(params?: TaskQueryParams): Promise<TaskApiResponse> {
    try {
      const queryString = params ? '?' + new URLSearchParams(params as any).toString() : ''
      const response = await apiFetch<TaskApiResponse>(`${API_ROUTES.TASKS.GET_ALL}${queryString}`)
      return response
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch tasks')
    }
  }

  /**
   * Get task by ID (uses common /api/tasks/:id endpoint)
   */
  static async getTaskById(id: string): Promise<TaskApiResponse> {
    try {
      const url = API_ROUTES.TASKS.GET_BY_ID.replace(':id', id)
      const response = await apiFetch<TaskApiResponse>(url)
      return response
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch task')
    }
  }

  /**
   * Create new task (uses common /api/tasks endpoint)
   */
  static async createTask(taskData: TaskFormData): Promise<TaskApiResponse> {
    try {
      const response = await apiFetch<TaskApiResponse>(API_ROUTES.TASKS.CREATE, {
        method: 'POST',
        payload: taskData
      })
      return response
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create task')
    }
  }

  /**
   * Update task (uses common /api/tasks/:id endpoint)
   */
  static async updateTask(id: string, taskData: Partial<TaskFormData>): Promise<TaskApiResponse> {
    try {
      const url = API_ROUTES.TASKS.UPDATE.replace(':id', id)
      const response = await apiFetch<TaskApiResponse>(url, {
        method: 'PUT',
        payload: taskData
      })
      return response
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update task')
    }
  }

  /**
   * Delete task (uses common /api/tasks/:id endpoint)
   */
  static async deleteTask(id: string): Promise<TaskApiResponse> {
    try {
      const url = API_ROUTES.TASKS.DELETE.replace(':id', id)
      const response = await apiFetch<TaskApiResponse>(url, {
        method: 'DELETE'
      })
      return response
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete task')
    }
  }

  /**
   * Get all developers for task assignment
   */
  static async getDevelopers(): Promise<{ success: boolean; developers: Array<{ id: string; name: string; email: string }> }> {
    try {
      const response = await apiFetch<{ success: boolean; developers: Array<{ id: string; name: string; email: string }> }>(API_ROUTES.ADMIN.DEVELOPERS)
      return response
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch developers')
    }
  }
}

export const adminTaskService = AdminTaskService
