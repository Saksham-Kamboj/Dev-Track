import { createAsyncThunk } from '@reduxjs/toolkit'
import { taskService } from '@/services/task/task.service'
import type {
  TaskFormData,
  TaskQueryParams,
  TaskApiResponse
} from '@/types/task/task.types'

/**
 * Async thunk for getting all tasks
 */
export const getAllTasks = createAsyncThunk<
  TaskApiResponse,
  TaskQueryParams | undefined,
  {
    rejectValue: string
  }
>('tasks/getAllTasks', async (params, { rejectWithValue }) => {
  try {
    const response = await taskService.getTasks(params)
    return response
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tasks'
    return rejectWithValue(errorMessage)
  }
})

/**
 * Async thunk for getting task by ID
 */
export const getTaskById = createAsyncThunk<
  TaskApiResponse,
  string,
  {
    rejectValue: string
  }
>('tasks/getTaskById', async (taskId, { rejectWithValue }) => {
  try {
    const response = await taskService.getTaskById(taskId)
    return response
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch task'
    return rejectWithValue(errorMessage)
  }
})

/**
 * Async thunk for creating a new task
 */
export const createTask = createAsyncThunk<
  TaskApiResponse,
  TaskFormData,
  {
    rejectValue: string
  }
>('tasks/createTask', async (taskData, { rejectWithValue }) => {
  try {
    const response = await taskService.createTask(taskData)
    return response
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create task'
    return rejectWithValue(errorMessage)
  }
})

/**
 * Async thunk for updating a task
 */
export const updateTask = createAsyncThunk<
  TaskApiResponse,
  { taskId: string; taskData: Partial<TaskFormData> },
  {
    rejectValue: string
  }
>('tasks/updateTask', async ({ taskId, taskData }, { rejectWithValue }) => {
  try {
    const response = await taskService.updateTask(taskId, taskData)
    return response
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update task'
    return rejectWithValue(errorMessage)
  }
})

/**
 * Async thunk for deleting a task
 */
export const deleteTask = createAsyncThunk<
  { success: boolean; message: string; taskId: string },
  string,
  {
    rejectValue: string
  }
>('tasks/deleteTask', async (taskId, { rejectWithValue }) => {
  try {
    const response = await taskService.deleteTask(taskId)
    return {
      success: response.success,
      message: response.message || 'Task deleted successfully',
      taskId
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete task'
    return rejectWithValue(errorMessage)
  }
})

/**
 * Async thunk for updating task status
 */
export const updateTaskStatus = createAsyncThunk<
  TaskApiResponse,
  { taskId: string; status: string },
  {
    rejectValue: string
  }
>('tasks/updateTaskStatus', async ({ taskId, status }, { rejectWithValue }) => {
  try {
    const response = await taskService.updateTaskStatus(taskId, status)
    return response
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update task status'
    return rejectWithValue(errorMessage)
  }
})

/**
 * Async thunk for updating task priority
 */
export const updateTaskPriority = createAsyncThunk<
  TaskApiResponse,
  { taskId: string; priority: string },
  {
    rejectValue: string
  }
>('tasks/updateTaskPriority', async ({ taskId, priority }, { rejectWithValue }) => {
  try {
    const response = await taskService.updateTaskPriority(taskId, priority)
    return response
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update task priority'
    return rejectWithValue(errorMessage)
  }
})

/**
 * Async thunk for assigning task to user
 */
export const assignTask = createAsyncThunk<
  TaskApiResponse,
  { taskId: string; assignedTo: string },
  {
    rejectValue: string
  }
>('tasks/assignTask', async ({ taskId, assignedTo }, { rejectWithValue }) => {
  try {
    const response = await taskService.assignTask(taskId, assignedTo)
    return response
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to assign task'
    return rejectWithValue(errorMessage)
  }
})

/**
 * Async thunk for adding comment to task
 */
export const addTaskComment = createAsyncThunk<
  { success: boolean; message: string; comment: any },
  { taskId: string; text: string },
  {
    rejectValue: string
  }
>('tasks/addTaskComment', async ({ taskId, text }, { rejectWithValue }) => {
  try {
    const response = await taskService.addComment(taskId, text)
    return response
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to add comment'
    return rejectWithValue(errorMessage)
  }
})
