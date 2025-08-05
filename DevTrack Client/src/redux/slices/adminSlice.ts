import { createSlice } from '@reduxjs/toolkit';
import { REDUX_CONSTANTS } from '@/constants';
import {
  getAdminDashboardData,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
} from '../thunks/admin.thunks';

interface AdminState {
  dashboardData: any;
  users: any[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  dashboardData: null,
  users: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: REDUX_CONSTANTS.SLICE_NAMES.ADMIN,
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAdminData: (state) => {
      state.dashboardData = null;
      state.users = [];
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    updateUserInState: (state, action) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    removeUser: (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    // Get dashboard data
    builder
      .addCase(getAdminDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
      })
      .addCase(getAdminDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch dashboard data';
      });

    // Get all users
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.users = action.payload.users;
        }
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch users';
      });

    // Create user
    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.users.push(action.payload.user);
        }
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create user';
      });

    // Update user
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          const index = state.users.findIndex(user => user.id === action.payload.user.id);
          if (index !== -1) {
            state.users[index] = action.payload.user;
          }
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update user';
      });

    // Delete user
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.users = state.users.filter(user => user.id !== action.payload.userId);
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete user';
      });

    // Get user by ID
    builder
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success && action.payload.user) {
          // Update user in the users array if it exists, otherwise add it
          const userIndex = state.users.findIndex(user => user.id === action.payload.user.id);
          if (userIndex !== -1) {
            state.users[userIndex] = action.payload.user;
          } else {
            state.users.push(action.payload.user);
          }
        }
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user';
      });
  },
});

export const {
  clearError,
  clearAdminData,
  setUsers,
  addUser,
  updateUserInState,
  removeUser
} = adminSlice.actions;

// Export async thunks
export {
  getAdminDashboardData,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
} from '../thunks/admin.thunks';
export default adminSlice.reducer;
