import { createAsyncThunk } from '@reduxjs/toolkit';
import { DeveloperService } from '@/services';

// Get DeveloperService instance
const developerService = DeveloperService.getInstance();

/**
 * Async thunk for getting developer dashboard data
 */
export const getDeveloperDashboardData = createAsyncThunk<
  any,
  void,
  {
    rejectValue: string;
  }
>('developer/getDashboardData', async (_, { rejectWithValue }) => {
  try {
    const response = await developerService.getDashboardData();
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch dashboard data';
    return rejectWithValue(errorMessage);
  }
});

/**
 * Async thunk for getting all tasks
 */
export const getTasks = createAsyncThunk<
  any[],
  void,
  {
    rejectValue: string;
  }
>('developer/getTasks', async (_, { rejectWithValue }) => {
  try {
    const response = await developerService.getTasks();
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tasks';
    return rejectWithValue(errorMessage);
  }
});

/**
 * Async thunk for getting task by ID
 */
export const getTaskById = createAsyncThunk<
  any,
  string,
  {
    rejectValue: string;
  }
>('developer/getTaskById', async (taskId, { rejectWithValue }) => {
  try {
    const response = await developerService.getTaskById(taskId);
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch task';
    return rejectWithValue(errorMessage);
  }
});

/**
 * Async thunk for creating a new task
 */
export const createTask = createAsyncThunk<
  any,
  any,
  {
    rejectValue: string;
  }
>('developer/createTask', async (taskData, { rejectWithValue }) => {
  try {
    const response = await developerService.createTask(taskData);
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create task';
    return rejectWithValue(errorMessage);
  }
});

/**
 * Async thunk for updating a task
 */
export const updateTask = createAsyncThunk<
  any,
  { taskId: string; taskData: any },
  {
    rejectValue: string;
  }
>('developer/updateTask', async ({ taskId, taskData }, { rejectWithValue }) => {
  try {
    const response = await developerService.updateTask(taskId, taskData);
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update task';
    return rejectWithValue(errorMessage);
  }
});

/**
 * Async thunk for deleting a task
 */
export const deleteTask = createAsyncThunk<
  string,
  string,
  {
    rejectValue: string;
  }
>('developer/deleteTask', async (taskId, { rejectWithValue }) => {
  try {
    await developerService.deleteTask(taskId);
    return taskId;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete task';
    return rejectWithValue(errorMessage);
  }
});
