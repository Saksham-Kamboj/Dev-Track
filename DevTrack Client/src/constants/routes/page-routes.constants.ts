export const PAGE_ROUTES = {
  // Public routes
  AUTH: {
    LOGIN: "/auth/login",
    SEND_OTP: "/auth/forget-password/send-otp",
    VERIFY_OTP: "/auth/forget-password/verify-otp",
    SET_NEW_PASSWORD: "/auth/forget-password/set-new-password",
  },

  // Protected routes
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    USER_MANAGEMENT: "/admin/user-management",
    USER_MANAGEMENT_ADD_USER: "/admin/user-management/add-user",
    USER_MANAGEMENT_EDIT_USER: "/admin/user-management/edit-user/:id",
    DOCUMENTS: {
      BASE: "/admin/document-management",
      ALL: "/admin/document-management",
      UPLOAD: "/admin/document-management/upload",
      VIEW: "/admin/document-management/:id",
    },
    REPORTS: {
      BASE: "/admin/reports",
      AI_GENERATED: "/admin/reports/ai-generated-report",
      AI_GENERATED_VIEW: "/admin/reports/ai-generated-report/:id",
      AD_HOC_REPORT: "/admin/reports/ad-hoc-report",
      AD_HOC_REPORT_VIEW: "/admin/reports/ad-hoc-report/:id",
    },
    PROFILE: "/admin/profile",
    EDIT_PROFILE: "/admin/profile/edit",
  },



  // Developer routes
  DEVELOPER: {
    DASHBOARD: "/developer/dashboard",
    TASK: {
      BASE: "/developer/task-management",
      ALL: "/developer/task-management",
      UPLOAD: "/developer/task-management/upload",
      VIEW: "/developer/task-management/:id",
    },
    PROFILE: "/developer/profile",
    EDIT_PROFILE: "/developer/profile/edit",
  },



  // Common routes
  COMMON: {
    NOT_FOUND: "*",
  },
} as const;
