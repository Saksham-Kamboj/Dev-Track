import { BaseApiService } from '../base-api.service';
import { API_ROUTES } from '@/constants';
import type { User } from '@/types';

/**
 * Profile service for handling user profile-related API calls
 */
export class ProfileService extends BaseApiService {
  private static instance: ProfileService;

  constructor() {
    super();
  }

  /**
   * Get singleton instance of ProfileService
   */
  static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService();
    }
    return ProfileService.instance;
  }

  /**
   * Get user profile
   */
  async getProfile(): Promise<User> {
    try {
      return await this.get<User>(API_ROUTES.COMMON.PROFILE);
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData: Partial<User>): Promise<{ success: boolean; message: string; user: User }> {
    try {
      return await this.put<{ success: boolean; message: string; user: User }, Partial<User>>(
        API_ROUTES.COMMON.EDIT_PROFILE,
        profileData
      );
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  /**
   * Change password
   */
  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      return await this.post<{ success: boolean; message: string }, typeof passwordData>(
        `${API_ROUTES.COMMON.PROFILE}/change-password`,
        passwordData
      );
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  /**
   * Upload profile picture
   */
  async uploadProfilePicture(formData: FormData): Promise<{ success: boolean; message: string; imageUrl: string }> {
    try {
      return await this.post<{ success: boolean; message: string; imageUrl: string }, FormData>(
        `${API_ROUTES.COMMON.PROFILE}/upload-picture`,
        formData,
        {
          headers: {
            // Don't set Content-Type for FormData, let browser set it with boundary
          }
        }
      );
    } catch (error) {
      console.error('Upload profile picture error:', error);
      throw error;
    }
  }

  /**
   * Delete profile picture
   */
  async deleteProfilePicture(): Promise<{ success: boolean; message: string }> {
    try {
      return await this.delete<{ success: boolean; message: string }>(
        `${API_ROUTES.COMMON.PROFILE}/delete-picture`
      );
    } catch (error) {
      console.error('Delete profile picture error:', error);
      throw error;
    }
  }
}
