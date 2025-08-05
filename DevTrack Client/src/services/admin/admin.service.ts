import { BaseApiService } from '../base-api.service';
import { API_ROUTES } from '@/constants';

/**
 * Admin service for handling admin-specific API calls
 */
export class AdminService extends BaseApiService {
  private static instance: AdminService;

  constructor() {
    super();
  }

  /**
   * Get singleton instance of AdminService
   */
  static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  /**
   * Get admin dashboard data
   */
  async getDashboardData(): Promise<any> {
    try {
      return await this.get(API_ROUTES.ADMIN.DASHBOARD);
    } catch (error) {
      console.error('Get admin dashboard data error:', error);
      throw error;
    }
  }

  /**
   * Get all developers
   */
  async getDevelopers(): Promise<any[]> {
    try {
      return await this.get(API_ROUTES.ADMIN.DEVELOPERS);
    } catch (error) {
      console.error('Get developers error:', error);
      throw error;
    }
  }

  /**
   * Get all users
   */
  async getAllUsers(): Promise<{ success: boolean; users: any[] }> {
    try {
      const response = await this.get<{ success: boolean; users: any[] }>(API_ROUTES.ADMIN.USERS.GET_ALL);
      return response;
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<{ success: boolean; user: any }> {
    try {
      const url = API_ROUTES.ADMIN.USERS.GET_BY_ID.replace(':id', userId);
      return await this.get(url);
    } catch (error) {
      console.error('Get user by ID error:', error);
      throw error;
    }
  }

  /**
   * Create new user
   */
  async createUser(userData: any): Promise<{ success: boolean; message: string; user: any }> {
    try {
      return await this.post(API_ROUTES.ADMIN.USERS.CREATE, userData);
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  }

  /**
   * Update user
   */
  async updateUser(userId: string, userData: any): Promise<{ success: boolean; message: string; user: any }> {
    try {
      const url = API_ROUTES.ADMIN.USERS.UPDATE.replace(':id', userId);
      return await this.put(url, userData);
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  /**
   * Delete user
   */
  async deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      const url = API_ROUTES.ADMIN.USERS.DELETE.replace(':id', userId);
      return await this.delete(url);
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  }
}
