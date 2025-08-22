// Auth slice exports
export {
  login,
  logout,
  clearError as clearAuthError,
  clearPasswordResetState,
  setPasswordResetEmail,
  loginUser,
  logoutUser,
  forgotPassword,
  verifyOtp,
  setNewPassword,
  validateToken,
  refreshToken,
  initializeAuth,
} from "./authSlice";

// Admin slice exports
export {
  clearError as clearAdminError,
  clearAdminData,
  setUsers,
  addUser,
  updateUserInState,
  removeUser,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAdminDashboardData,
} from "./adminSlice";

// Developer slice exports
export {
  clearError as clearDeveloperError,
  clearDeveloperData,
  setTasks,
  setCurrentTask,
  addTask,
  updateTaskInState,
  removeTask,
} from "./developerSlice";

// Table slice exports
export {
  default as tableReducer,
  setData,
  addItem,
  updateItem,
  removeItem,
  selectRow,
  selectAllRows,
  clearSelection,
  setCurrentPage,
  setPageSize,
  setSearchQuery,
  setFilters,
  setSortConfig,
  resetFilters,
  setColumnVisibility,
  resetColumnVisibility,
  setActionsColumnConfig,
  setCustomActions,
  toggleActionsColumn,
  setLoading,
  setError,
  resetState,
  fetchTableData,
  createTableItem,
  updateTableItem,
  deleteTableItem,
  bulkDeleteTableItems,
} from "./tableSlice";

// Profile slice exports
export {
  clearError as clearProfileError,
  clearProfile,
  getUserProfile,
  updateUserProfile,
  changePassword,
  uploadProfilePicture,
  deleteProfilePicture,
} from "./profileSlice";

// Export thunks
export * from "../thunks/admin.thunks";
export * from "../thunks/admin-task.thunks";
export * from "../thunks/profile.thunks";
export * from "../thunks/table.thunks";

// Export developer thunks with specific names to avoid conflicts
export {
  getDeveloperDashboardData,
  getTasks as getDeveloperTasks,
  getTaskById as getDeveloperTaskById,
  createTask as createDeveloperTask,
  updateTask as updateDeveloperTask,
  deleteTask as deleteDeveloperTask,
} from "../thunks/developer.thunks";

// Export common task thunks (used by both admin and developer)
export {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskPriority,
} from "../thunks/task.thunks";
