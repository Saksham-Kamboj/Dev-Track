import { BaseApiService } from '../base-api.service';
import { API_ROUTES } from '@/constants';

/**
 * Developer service for handling developer-specific API calls
 */
export class DeveloperService extends BaseApiService {
  private static instance: DeveloperService;

  constructor() {
    super();
  }

  /**
   * Get singleton instance of DeveloperService
   */
  static getInstance(): DeveloperService {
    if (!DeveloperService.instance) {
      DeveloperService.instance = new DeveloperService();
    }
    return DeveloperService.instance;
  }

  /**
   * Get developer dashboard data
   */
  async getDashboardData(): Promise<any> {
    try {
      return await this.get(API_ROUTES.DEVELOPER.DASHBOARD);
    } catch (error) {
      console.error('Get developer dashboard data error:', error);
      throw error;
    }
  }

  /**
   * Get all tasks
   */
  async getTasks(): Promise<any[]> {
    try {
      return await this.get(API_ROUTES.DEVELOPER.TASKS.GET_ALL);
    } catch (error) {
      console.error('Get tasks error:', error);
      throw error;
    }
  }

  /**
   * Get task by ID
   */
  async getTaskById(taskId: string): Promise<any> {
    try {
      const url = API_ROUTES.DEVELOPER.TASKS.GET_BY_ID.replace(':id', taskId);
      return await this.get(url);
    } catch (error) {
      console.error('Get task by ID error:', error);
      throw error;
    }
  }

  /**
   * Create a new task
   */
  async createTask(taskData: any): Promise<{ success: boolean; message: string; task: any }> {
    try {
      return await this.post(API_ROUTES.DEVELOPER.TASKS.CREATE, taskData);
    } catch (error) {
      console.error('Create task error:', error);
      throw error;
    }
  }

  /**
   * Update a task
   */
  async updateTask(taskId: string, taskData: any): Promise<{ success: boolean; message: string; task: any }> {
    try {
      const url = API_ROUTES.DEVELOPER.TASKS.UPDATE.replace(':id', taskId);
      return await this.put(url, taskData);
    } catch (error) {
      console.error('Update task error:', error);
      throw error;
    }
  }

  /**
   * Delete a task
   */
  async deleteTask(taskId: string): Promise<{ success: boolean; message: string }> {
    try {
      const url = API_ROUTES.DEVELOPER.TASKS.DELETE.replace(':id', taskId);
      return await this.delete(url);
    } catch (error) {
      console.error('Delete task error:', error);
      throw error;
    }
  }
}
