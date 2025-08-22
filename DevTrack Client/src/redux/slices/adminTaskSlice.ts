import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { REDUX_CONSTANTS } from '@/constants'
import type { TaskData } from '@/types/task/task.types'
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} from '../thunks/task.thunks'
import { adminGetDevelopers } from '../thunks/admin-task.thunks'

interface AdminTaskState {
  tasks: TaskData[]
  currentTask: TaskData | null
  developers: Array<{ id: string; name: string; email: string }>
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  } | null
  filters: {
    status: string | null
    priority: string | null
    type: string | null
    search: string
    assignedTo?: string
  }
  isInitialized: boolean
  lastFetch: number | null
}

const initialState: AdminTaskState = {
  tasks: [],
  currentTask: null,
  developers: [],
  loading: false,
  error: null,
  pagination: null,
  filters: {
    status: null,
    priority: null,
    type: null,
    search: '',
    assignedTo: undefined
  },
  isInitialized: false,
  lastFetch: null
}

const adminTaskSlice = createSlice({
  name: REDUX_CONSTANTS.SLICE_NAMES.ADMIN_TASKS || 'adminTasks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearTasks: (state) => {
      state.tasks = []
      state.currentTask = null
      state.pagination = null
    },
    setTasks: (state, action: PayloadAction<TaskData[]>) => {
      state.tasks = action.payload
    },
    setCurrentTask: (state, action: PayloadAction<TaskData | null>) => {
      state.currentTask = action.payload
    },
    addTask: (state, action: PayloadAction<TaskData>) => {
      state.tasks.unshift(action.payload)
    },
    updateTaskInState: (state, action: PayloadAction<TaskData>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id)
      if (index !== -1) {
        state.tasks[index] = action.payload
      }
      if (state.currentTask?.id === action.payload.id) {
        state.currentTask = action.payload
      }
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload)
      if (state.currentTask?.id === action.payload) {
        state.currentTask = null
      }
    },
    setFilters: (state, action: PayloadAction<Partial<AdminTaskState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {
        status: null,
        priority: null,
        type: null,
        search: '',
        assignedTo: undefined
      }
    },
    setDevelopers: (state, action: PayloadAction<Array<{ id: string; name: string; email: string }>>) => {
      state.developers = action.payload
    }
  },
  extraReducers: (builder) => {
    // Get all tasks (using common task thunk)
    builder
      .addCase(getAllTasks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAllTasks.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload.success && action.payload.tasks) {
          state.tasks = action.payload.tasks
          state.pagination = action.payload.pagination || null
          state.isInitialized = true
          state.lastFetch = Date.now()
        }
      })
      .addCase(getAllTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch tasks'
      })

    // Get task by ID (using common task thunk)
    builder
      .addCase(getTaskById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getTaskById.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload.success && action.payload.task) {
          state.currentTask = action.payload.task
        }
      })
      .addCase(getTaskById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch task'
      })

    // Create task (using common task thunk)
    builder
      .addCase(createTask.fulfilled, (state, action) => {
        if (action.payload.success && action.payload.task) {
          state.tasks.unshift(action.payload.task)
        }
      })

    // Update task (using common task thunk)
    builder
      .addCase(updateTask.fulfilled, (state, action) => {
        if (action.payload.success && action.payload.task) {
          const index = state.tasks.findIndex(task => task.id === action.payload.task!.id)
          if (index !== -1) {
            state.tasks[index] = action.payload.task
          }
          if (state.currentTask?.id === action.payload.task.id) {
            state.currentTask = action.payload.task
          }
        }
      })

    // Delete task (using common task thunk)
    builder
      .addCase(deleteTask.fulfilled, (state, action) => {
        if (action.payload.success) {
          // Remove from tasks array - we need to get the ID from the meta
          const taskId = action.meta.arg
          state.tasks = state.tasks.filter(task => task.id !== taskId)
          if (state.currentTask?.id === taskId) {
            state.currentTask = null
          }
        }
      })

    // Get developers (admin-specific)
    builder
      .addCase(adminGetDevelopers.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.developers = action.payload.developers
        }
      })
  }
})

export const {
  clearError,
  clearTasks,
  setTasks,
  setCurrentTask,
  addTask,
  updateTaskInState,
  removeTask,
  setFilters,
  clearFilters,
  setDevelopers
} = adminTaskSlice.actions

export default adminTaskSlice.reducer
