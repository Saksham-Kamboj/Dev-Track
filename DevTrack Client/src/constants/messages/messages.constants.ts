export const MESSAGES = {
  // Success Messages
  SUCCESS: {
    OTP_SENT: "OTP sent successfully!",
    OTP_VERIFIED: "OTP verified successfully!",
    OTP_RESENT: "OTP resent successfully!",
    PASSWORD_UPDATED: "Password updated successfully! Please login with your new password.",
    LOGIN_SUCCESS: "User logged in successfully!",
    LOGOUT_SUCCESS: "Logged out successfully",
  },

  // Error Messages
  ERROR: {
    // OTP Related
    OTP_SEND_FAILED: "Failed to send OTP. Please try again.",
    OTP_VERIFICATION_FAILED: "OTP verification failed",
    OTP_INVALID: "Invalid OTP. Please try again.",
    OTP_RESEND_FAILED: "Failed to resend OTP",

    // Password Related
    PASSWORD_UPDATE_FAILED: "Failed to update password. Please try again.",
    PASSWORD_SET_FAILED: "Set new password failed",

    // Login Related
    LOGIN_FAILED: "Login failed",
    LOGIN_CREDENTIALS_INVALID: "Login failed. Please check your credentials.",
    LOGOUT_FAILED: "Logout failed",

    // Form Validation
    EMAIL_REQUIRED: "Please enter your email address",

    // Generic
    SOMETHING_WENT_WRONG: "Something went wrong. Please try again.",
    NETWORK_ERROR: "Network error. Please check your connection.",
  },

  // Loading Messages
  LOADING: {
    SENDING_OTP: "Sending...",
    VERIFYING_OTP: "Verifying...",
    UPDATING_PASSWORD: "Updating...",
    LOGGING_IN: "Logging in...",
    PROCESSING: "Processing...",
  },

  // Session Messages
  SESSION: {
    EXPIRED_INACTIVITY: "Your session has expired due to inactivity. Please log in again.",
    EXPIRED: "Your session has expired. Please log in again.",
    INVALID: "Invalid session. Please log in again.",
  },

  // Forgot Password Flow Messages
  FORGOT_PASSWORD: {
    OTP_SENT_TO_EMAIL: "OTP has been sent to your email address",
    ENTER_OTP_RECEIVED: "Enter the 6-digit code sent to your email",
    OTP_EXPIRED: "OTP has expired. Please request a new one.",
    INVALID_RESET_TOKEN: "Invalid reset token. Please start the process again.",
    PASSWORD_RESET_SUCCESS: "Your password has been reset successfully",
  },
} as const;
