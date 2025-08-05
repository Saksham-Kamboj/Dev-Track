import { BaseApiService } from '../base-api.service';
import { API_ROUTES } from '@/constants';
import type { LoginFormValues } from '@/validation';
import type { LoginResponse, User } from '@/types';

/**
 * Authentication service for handling all auth-related API calls
 */
export class AuthService extends BaseApiService {
  private static instance: AuthService;

  constructor() {
    super();
  }

  /**
   * Get singleton instance of AuthService
   */
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Login user with email and password
   */
  async login(credentials: LoginFormValues): Promise<LoginResponse> {

    try {
      const response = await this.post<LoginResponse, LoginFormValues>(
        API_ROUTES.AUTH.LOGIN,
        credentials
      );

      // Store auth data if login successful
      if (response.success && response.token) {
        this.storeAuthData(response.token, response.user);
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Logout user and clear stored data
   */
  logout(): void {
    this.clearAuthData();
  }

  /**
   * Send forgot password request
   */
  async sendOtp(email: string): Promise<{ success: boolean; message: string; otp_sent: boolean }> {

    try {
      return await this.post<{ success: boolean; message: string; otp_sent: boolean }, { email: string }>(
        API_ROUTES.AUTH.SEND_OTP,
        { email }
      );
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  /**
     * Verify OTP for password reset
     */
  async verifyOtp(email: string, otp_code: string): Promise<{ success: boolean; message: string; reset_token: string }> {

    try {
      return await this.post<{ success: boolean; message: string; reset_token: string }, { email: string; otp_code: string }>(
        `${API_ROUTES.AUTH.VERIFY_OTP}`,
        { email, otp_code }
      );
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw error;
    }
  }

  /**
   * Set new password after OTP verification
   */
  async setNewPassword(
    email: string,
    reset_token: string,
    new_password: string
  ): Promise<{ success: boolean; message: string }> {

    try {
      return await this.post<{ success: boolean; message: string }, {
        email: string;
        reset_token: string;
        new_password: string
      }>(
        `${API_ROUTES.AUTH.SET_NEW_PASSWORD}`,
        { email, reset_token, new_password }
      );
    } catch (error) {
      console.error('Set new password error:', error);
      throw error;
    }
  }


  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): boolean {

    const token = this.getAuthToken();
    const isAuth = localStorage.getItem('isAuthenticated');
    const user = this.getCurrentUser();

    // Check if session has expired
    if (this.isSessionExpired()) {
      this.clearAuthData();
      return false;
    }

    return !!(token && isAuth === 'true' && user);
  }

  /**
   * Get current user data from localStorage
   */
  getCurrentUser(): User {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Get current auth token
   */
  getToken(): string | null {
    return this.getAuthToken();
  }

  /**
   * Store authentication data in localStorage
   */
  private storeAuthData(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('sessionStartTime', Date.now().toString());
  }

  /**
   * Clear all authentication data from localStorage
   */
  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('sessionStartTime');
  }

  /**
   * Check if session has expired (60 minutes of inactivity)
   */
  isSessionExpired(): boolean {

    const sessionStart = localStorage.getItem('sessionStartTime');
    if (!sessionStart) return true;

    const sessionStartTime = parseInt(sessionStart);
    const currentTime = Date.now();
    const sessionDuration = currentTime - sessionStartTime;

    // 60 minutes in milliseconds
    const maxSessionDuration = 60 * 60 * 1000;

    return sessionDuration >= maxSessionDuration;
  }

  /**
   * Refresh session timestamp
   */
  refreshSession(): void {
    if (this.isAuthenticated()) {
      localStorage.setItem('sessionStartTime', Date.now().toString());
    }
  }

  /**
   * Get user profile
   */
  async getProfile(): Promise<User> {
    try {
      return await this.get<User>('/api/profile');
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
        '/api/profile/edit',
        profileData
      );
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  /**
   * Validate token with server
   */
  async validateToken(): Promise<{ valid: boolean; user?: User }> {

    try {
      const token = this.getAuthToken();
      if (!token) {
        return { valid: false };
      }

      return await this.get<{ valid: boolean; user?: User }>('/api/auth/validate-token');
    } catch (error) {
      console.error('Token validation error:', error);
      return { valid: false };
    }
  }

  /**
   * Refresh auth token
   */
  async refreshToken(): Promise<{ success: boolean; token?: string }> {

    try {
      return await this.post<{ success: boolean; token?: string }>('/api/auth/refresh-token');
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }
}
