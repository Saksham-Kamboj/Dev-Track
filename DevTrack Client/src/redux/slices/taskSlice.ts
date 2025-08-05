import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { REDUX_CONSTANTS } from '@/constants'
import type { TaskData } from '@/types/task/task.types'
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskPriority,
  assignTask
} from '../thunks/task.thunks'

interface TaskState {
  tasks: TaskData[]
  currentTask: TaskData | null
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

const initialState: TaskState = {
  tasks: [],
  currentTask: null,
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

const taskSlice = createSlice({
  name: REDUX_CONSTANTS.SLICE_NAMES.TASKS || 'tasks',
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
    setFilters: (state, action: PayloadAction<Partial<TaskState['filters']>>) => {
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
    }
  },
  extraReducers: (builder) => {
    // Get all tasks
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

    // Get task by ID
    builder
      .addCase(getTaskById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getTaskById.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload.success && action.payload.task) {
          state.currentTask = action.payload.task
          // Update task in tasks array if it exists
          const index = state.tasks.findIndex(task => task.id === action.payload.task!.id)
          if (index !== -1) {
            state.tasks[index] = action.payload.task
          }
        }
      })
      .addCase(getTaskById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch task'
      })

    // Create task
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload.success && action.payload.task) {
          state.tasks.unshift(action.payload.task)
        }
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false
        const errorPayload = action.payload as { message: string; code?: string; retry?: boolean } | undefined
        state.error = errorPayload?.message || 'Failed to create task'
      })

    // Update task
    builder
      .addCase(updateTask.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false
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
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to update task'
      })

    // Delete task
    builder
      .addCase(deleteTask.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload.success) {
          state.tasks = state.tasks.filter(task => task.id !== action.payload.taskId)
          if (state.currentTask?.id === action.payload.taskId) {
            state.currentTask = null
          }
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string || 'Failed to delete task'
      })

    // Update task status
    builder
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
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

    // Update task priority
    builder
      .addCase(updateTaskPriority.fulfilled, (state, action) => {
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

    // Assign task
    builder
      .addCase(assignTask.fulfilled, (state, action) => {
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
  clearFilters
} = taskSlice.actions

export default taskSlice.reducer
