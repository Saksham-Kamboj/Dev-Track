import { createAsyncThunk } from '@reduxjs/toolkit'
import { adminTaskService } from '@/services/admin/admin-task.service'

/**
 * Admin Task Thunks
 * Uses common task thunks but with admin-specific naming for clarity
 * The actual API calls use the same endpoints but with admin role privileges
 */

/**
 * Get developers for task assignment (Admin only)
 */
export const adminGetDevelopers = createAsyncThunk<
  { success: boolean; developers: Array<{ id: string; name: string; email: string }> },
  void,
  { rejectValue: string }
>(
  'admin/tasks/getDevelopers',
  async (_, { rejectWithValue }) => {
    try {
      return await adminTaskService.getDevelopers()
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

// Note: For other task operations (CRUD), we use the existing task thunks:
// - getAllTasks (from task.thunks.ts)
// - getTaskById (from task.thunks.ts)
// - createTask (from task.thunks.ts)
// - updateTask (from task.thunks.ts)
// - deleteTask (from task.thunks.ts)
//
// These thunks already have role-based logic in the backend,
// so admin users automatically get admin privileges when using them.
