// Base API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const API_ROUTES = {
  // Public api routes
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    SEND_OTP: `${API_BASE_URL}/auth/forget-password/sendotp/`,
    VERIFY_OTP: `${API_BASE_URL}/auth/forget-password/verify-otp/`,
    SET_NEW_PASSWORD: `${API_BASE_URL}/auth/forget-password/reset-password/`,
  },

  // Admin api routes
  ADMIN: {
    DASHBOARD: `${API_BASE_URL}/admin/dashboard`,
    USERS: {
      BASE: `${API_BASE_URL}/admin/users`,
      GET_ALL: `${API_BASE_URL}/admin/users`,
      GET_BY_ID: `${API_BASE_URL}/admin/users/:id`,
      CREATE: `${API_BASE_URL}/admin/users`,
      UPDATE: `${API_BASE_URL}/admin/users/:id`,
      DELETE: `${API_BASE_URL}/admin/users/:id`,
    },
    DEVELOPERS: `${API_BASE_URL}/admin/developers`,
    TASKS: `${API_BASE_URL}/admin/tasks`,
  },



  // Developer api routes
  DEVELOPER: {
    DASHBOARD: `${API_BASE_URL}/developer`,
    TASKS: {
      BASE: `${API_BASE_URL}/developer/tasks`,
      GET_ALL: `${API_BASE_URL}/developer/tasks`,
      GET_BY_ID: `${API_BASE_URL}/developer/tasks/:id`,
      CREATE: `${API_BASE_URL}/developer/tasks`,
      UPDATE: `${API_BASE_URL}/developer/tasks/:id`,
      DELETE: `${API_BASE_URL}/developer/tasks/:id`,
    },
  },

  // Common api routes
  COMMON: {
    PROFILE: `${API_BASE_URL}/profile`,
    EDIT_PROFILE: `${API_BASE_URL}/profile/edit`,
  },
} as const;

// Export the base URL for use in other parts of the application
export { API_BASE_URL };
