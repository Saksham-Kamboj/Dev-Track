export const SEND_OTP_FORM_TEXTS = {
  WELCOME: {
    TITLE: "Forgot Password",
    DESCRIPTION: "Enter your email address to receive an OTP",
  },
  FORM: {
    EMAIL: {
      LABEL: "Email",
      PLACEHOLDER: "john@example.com",
    },
    SUBMIT: "Send OTP",
  },
  FOOTER: {
    BACK_TO_LOGIN: "Back to Login",
  },
} as const;

export const VERIFY_OTP_FORM_TEXTS = {
  WELCOME: {
    TITLE: "Verify OTP",
    DESCRIPTION: "Enter the 6-digit code sent to your email",
  },
  FORM: {
    EMAIL: {
      LABEL: "Email",
      PLACEHOLDER: "john@example.com",
    },
    OTP: {
      LABEL: "OTP Code",
      PLACEHOLDER: "123456",
    },
    SUBMIT: "Verify OTP",
  },
  FOOTER: {
    BACK_TO_LOGIN: "Back to Login",
    RESEND_OTP: "Resend OTP",
  },
} as const;

export const SET_NEW_PASSWORD_FORM_TEXTS = {
  WELCOME: {
    TITLE: "Set New Password",
    DESCRIPTION: "Create a new password for your account",
  },
  FORM: {
    EMAIL: {
      LABEL: "Email",
      PLACEHOLDER: "john@example.com",
    },
    NEW_PASSWORD: {
      LABEL: "New Password",
      PLACEHOLDER: "Enter new password",
    },
    CONFIRM_PASSWORD: {
      LABEL: "Confirm Password",
      PLACEHOLDER: "Confirm new password",
    },
    SUBMIT: "Set New Password",
  },
  FOOTER: {
    BACK_TO_LOGIN: "Back to Login",
  },
} as const;
