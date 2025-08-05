import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthService } from '@/services';
import { MESSAGES } from '@/constants';
import type { LoginFormValues } from '@/validation';
import type { LoginResponse, User } from '@/types';

// Get AuthService instance
const authService = AuthService.getInstance();

/**
 * Async thunk for user login
 */
export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginFormValues,
  {
    rejectValue: string;
  }
>('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authService.login(credentials);
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : MESSAGES.ERROR.LOGIN_FAILED;
    return rejectWithValue(errorMessage);
  }
});

/**
 * Async thunk for user logout
 */
export const logoutUser = createAsyncThunk<
  { message?: string },
  { message?: string; navigate?: (path: string) => void } | undefined,
  {
    rejectValue: string;
  }
>('auth/logoutUser', async (params, { rejectWithValue }) => {
  try {
    // Clear auth data from service
    authService.logout();

    // Return message for the component to handle
    return {
      message: params?.message
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Logout failed';
    return rejectWithValue(errorMessage);
  }
});

/**
 * Async thunk for forgot password
 */
export const forgotPassword = createAsyncThunk<
  { success: boolean; message: string; otp_sent: boolean },
  string,
  {
    rejectValue: string;
  }
>('auth/forgotPassword', async (email, { rejectWithValue }) => {
  try {
    const response = await authService.sendOtp(email);
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : MESSAGES.ERROR.OTP_SEND_FAILED;
    return rejectWithValue(errorMessage);
  }
});

/**
 * Async thunk for OTP verification
 */
export const verifyOtp = createAsyncThunk<
  { success: boolean; message: string; reset_token: string },
  { email: string; otp_code: string },
  {
    rejectValue: string;
  }
>('auth/verifyOtp', async ({ email, otp_code }, { rejectWithValue }) => {
  try {
    const response = await authService.verifyOtp(email, otp_code);
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : MESSAGES.ERROR.OTP_VERIFICATION_FAILED;
    return rejectWithValue(errorMessage);
  }
});

/**
 * Async thunk for setting new password
 */
export const setNewPassword = createAsyncThunk<
  { success: boolean; message: string },
  { email: string; reset_token: string; new_password: string },
  {
    rejectValue: string;
  }
>('auth/setNewPassword', async ({ email, reset_token, new_password }, { rejectWithValue }) => {
  try {
    const response = await authService.setNewPassword(email, reset_token, new_password);
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : MESSAGES.ERROR.PASSWORD_SET_FAILED;
    return rejectWithValue(errorMessage);
  }
});

/**
 * Async thunk for token validation
 */
export const validateToken = createAsyncThunk<
  { valid: boolean; user?: User },
  void,
  {
    rejectValue: string;
  }
>('auth/validateToken', async (_, { rejectWithValue }) => {
  try {
    const response = await authService.validateToken();
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Token validation failed';
    return rejectWithValue(errorMessage);
  }
});

/**
 * Async thunk for token refresh
 */
export const refreshToken = createAsyncThunk<
  { success: boolean; token?: string },
  void,
  {
    rejectValue: string;
  }
>('auth/refreshToken', async (_, { rejectWithValue }) => {
  try {
    const response = await authService.refreshToken();
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Token refresh failed';
    return rejectWithValue(errorMessage);
  }
});

/**
 * Thunk to initialize auth state from storage
 */
export const initializeAuth = createAsyncThunk<
  { user: User; token: string | null; isAuthenticated: boolean },
  void
>('auth/initializeAuth', async () => {
  const user = authService.getCurrentUser();
  const token = authService.getToken();
  const isAuthenticated = authService.isAuthenticated();

  return {
    user,
    token,
    isAuthenticated,
  };
});
