import { createSlice } from '@reduxjs/toolkit';
import { REDUX_CONSTANTS } from '@/constants';
import {
  getDeveloperDashboardData,
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../thunks/developer.thunks';

interface DeveloperState {
  dashboardData: any;
  tasks: any[];
  currentTask: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: DeveloperState = {
  dashboardData: null,
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,
};

const developerSlice = createSlice({
  name: REDUX_CONSTANTS.SLICE_NAMES.DEVELOPER,
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearDeveloperData: (state) => {
      state.dashboardData = null;
      state.tasks = [];
      state.currentTask = null;
    },
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    setCurrentTask: (state, action) => {
      state.currentTask = action.payload;
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    updateTaskInState: (state, action) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    removeTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    // Get dashboard data
    builder
      .addCase(getDeveloperDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDeveloperDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
      })
      .addCase(getDeveloperDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch dashboard data';
      });

    // Get tasks
    builder
      .addCase(getTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch tasks';
      });

    // Get task by ID
    builder
      .addCase(getTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTask = action.payload;
      })
      .addCase(getTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch task';
      });

    // Create task
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.tasks.push(action.payload.task);
        }
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create task';
      });

    // Update task
    builder
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          const index = state.tasks.findIndex(task => task.id === action.payload.task.id);
          if (index !== -1) {
            state.tasks[index] = action.payload.task;
          }
          if (state.currentTask && state.currentTask.id === action.payload.task.id) {
            state.currentTask = action.payload.task;
          }
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update task';
      });

    // Delete task
    builder
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
        if (state.currentTask && state.currentTask.id === action.payload) {
          state.currentTask = null;
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete task';
      });
  },
});

export const {
  clearError,
  clearDeveloperData,
  setTasks,
  setCurrentTask,
  addTask,
  updateTaskInState,
  removeTask
} = developerSlice.actions;

export default developerSlice.reducer;
