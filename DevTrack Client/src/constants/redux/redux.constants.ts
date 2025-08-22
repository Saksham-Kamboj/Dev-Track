export const REDUX_CONSTANTS = {
  // Slice Names
  SLICE_NAMES: {
    AUTH: "auth",
    ADMIN: "admin",
    ADMIN_TASKS: "adminTasks",
    DEVELOPER: "developer",
    TABLE: "table",
    TASKS: "tasks",
    PROFILE: "profile",
  },

  // Action Type Prefixes
  ACTION_TYPES: {
    AUTH: {
      LOGIN_USER: "auth/loginUser",
      LOGOUT_USER: "auth/logoutUser",
      FORGOT_PASSWORD: "auth/forgotPassword",
      VERIFY_OTP: "auth/verifyOtp",
      SET_NEW_PASSWORD: "auth/setNewPassword",
      VALIDATE_TOKEN: "auth/validateToken",
      REFRESH_TOKEN: "auth/refreshToken",
      INITIALIZE_AUTH: "auth/initializeAuth",
    },
    ADMIN: {
      GET_DASHBOARD_DATA: "admin/getDashboardData",
      GET_DEVELOPERS: "admin/getDevelopers",
      CREATE_USER: "admin/createUser",
      UPDATE_USER: "admin/updateUser",
      DELETE_USER: "admin/deleteUser",
    },
    DEVELOPER: {
      GET_DASHBOARD_DATA: "developer/getDashboardData",
      GET_TASKS: "developer/getTasks",
      CREATE_TASK: "developer/createTask",
      UPDATE_TASK: "developer/updateTask",
      DELETE_TASK: "developer/deleteTask",
    },

    TABLE: {
      FETCH_DATA: "table/fetchData",
      CREATE_ITEM: "table/createItem",
      UPDATE_ITEM: "table/updateItem",
      DELETE_ITEM: "table/deleteItem",
      BULK_DELETE_ITEMS: "table/bulkDeleteItems",
    },
  },

  // Error Messages (Redux-specific)
  ERRORS: {
    // Generic Redux errors
    FETCH_FAILED: "Failed to fetch data",
    CREATE_FAILED: "Failed to create item",
    UPDATE_FAILED: "Failed to update item",
    DELETE_FAILED: "Failed to delete item",
    BULK_DELETE_FAILED: "Failed to delete items",

    // Admin-specific errors
    ADMIN: {
      DASHBOARD_FETCH_FAILED: "Failed to fetch dashboard data",
      DEVELOPERS_FETCH_FAILED: "Failed to fetch developers",
      USER_CREATE_FAILED: "Failed to create user",
      USER_UPDATE_FAILED: "Failed to update user",
      USER_DELETE_FAILED: "Failed to delete user",
    },

    // Developer-specific errors
    DEVELOPER: {
      DASHBOARD_FETCH_FAILED: "Failed to fetch dashboard data",
      TASKS_FETCH_FAILED: "Failed to fetch tasks",
      TASK_CREATE_FAILED: "Failed to create task",
      TASK_UPDATE_FAILED: "Failed to update task",
      TASK_DELETE_FAILED: "Failed to delete task",
    },

    // Table-specific errors
    TABLE: {
      DATA_FETCH_FAILED: "Failed to fetch table data",
      ITEM_CREATE_FAILED: "Failed to create item",
      ITEM_UPDATE_FAILED: "Failed to update item",
      ITEM_DELETE_FAILED: "Failed to delete item",
      BULK_DELETE_FAILED: "Failed to delete items",
    },
  },

  // Loading States
  LOADING_STATES: {
    IDLE: "idle",
    PENDING: "pending",
    FULFILLED: "fulfilled",
    REJECTED: "rejected",
  },

  // Cache Settings
  CACHE: {
    DEFAULT_EXPIRY: 5 * 60 * 1000, // 5 minutes
    TABLE_CACHE_EXPIRY: 5 * 60 * 1000, // 5 minutes
  },

  // Default Values
  DEFAULTS: {
    PAGE_SIZE: 10,
    CURRENT_PAGE: 1,
    UPLOAD_PROGRESS: 0,
    EMPTY_STRING: "",
    EMPTY_ARRAY: [],
    EMPTY_OBJECT: {},
  },

  // Operation States
  OPERATION_STATES: {
    CREATING: "creating",
    UPDATING: "updating",
    DELETING: "deleting",
    UPLOADING: "uploading",
  },
} as const;
