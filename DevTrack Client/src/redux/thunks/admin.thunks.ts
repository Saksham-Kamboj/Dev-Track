import { createAsyncThunk } from '@reduxjs/toolkit';
import { AdminService } from '@/services';
import { REDUX_CONSTANTS } from '@/constants';

// Get AdminService instance
const adminService = AdminService.getInstance();

/**
 * Async thunk for getting admin dashboard data
 */
export const getAdminDashboardData = createAsyncThunk<
  any,
  void,
  {
    rejectValue: string;
  }
>(REDUX_CONSTANTS.ACTION_TYPES.ADMIN.GET_DASHBOARD_DATA, async (_, { rejectWithValue }) => {
  try {
    const response = await adminService.getDashboardData();
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch dashboard data';
    return rejectWithValue(errorMessage);
  }
});

/**
 * Async thunk for getting all users
 */
export const getAllUsers = createAsyncThunk<
  { success: boolean; users: any[] },
  void,
  {
    rejectValue: string;
  }
>('admin/getAllUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await adminService.getAllUsers();
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
    return rejectWithValue(errorMessage);
  }
});

/**
 * Async thunk for creating a user
 */
export const createUser = createAsyncThunk<
  { success: boolean; message: string; user: any },
  any,
  {
    rejectValue: string;
  }
>('admin/createUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await adminService.createUser(userData);
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
    return rejectWithValue(errorMessage);
  }
});

/**
 * Async thunk for updating a user
 */
export const updateUser = createAsyncThunk<
  { success: boolean; message: string; user: any },
  { userId: string; userData: any },
  {
    rejectValue: string;
  }
>('admin/updateUser', async ({ userId, userData }, { rejectWithValue }) => {
  try {
    const response = await adminService.updateUser(userId, userData);
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update user';
    return rejectWithValue(errorMessage);
  }
});

/**
 * Async thunk for deleting a user
 */
export const deleteUser = createAsyncThunk<
  { success: boolean; message: string; userId: string },
  string,
  {
    rejectValue: string;
  }
>('admin/deleteUser', async (userId, { rejectWithValue }) => {
  try {
    const response = await adminService.deleteUser(userId);
    return { ...response, userId };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete user';
    return rejectWithValue(errorMessage);
  }
});

/**
 * Async thunk for getting user by ID
 */
export const getUserById = createAsyncThunk<
  { success: boolean; user: any },
  string,
  {
    rejectValue: string;
  }
>('admin/getUserById', async (userId, { rejectWithValue }) => {
  try {
    const response = await adminService.getUserById(userId);
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user';
    return rejectWithValue(errorMessage);
  }
});