import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { MESSAGES, REDUX_CONSTANTS } from "@/constants";
import type { User, Token } from "@/types";
import {
  loginUser,
  logoutUser,
  forgotPassword,
  verifyOtp,
  setNewPassword,
  validateToken,
  refreshToken,
  initializeAuth,
} from "../thunks/auth.thunks";

interface AuthState {
  user: User;
  token: Token;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  // Password reset flow state
  passwordResetEmail: string | null;
  otpVerified: boolean;
  resetToken: string | null;
  // Initialization state
  isInitialized: boolean;
  isInitializing: boolean;
}

const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  passwordResetEmail: null,
  otpVerified: false,
  resetToken: null,
  isInitialized: false,
  isInitializing: false,
};

const authSlice = createSlice({
  name: REDUX_CONSTANTS.SLICE_NAMES.AUTH,
  initialState: initialAuthState,
  reducers: {
    // Synchronous actions
    clearError: (state) => {
      state.error = null;
    },
    clearPasswordResetState: (state) => {
      state.passwordResetEmail = null;
      state.otpVerified = false;
      state.resetToken = null;
    },
    setPasswordResetEmail: (state, action: PayloadAction<string>) => {
      state.passwordResetEmail = action.payload;
    },
    // Legacy actions for backward compatibility (will be deprecated)
    login: (state, action: PayloadAction<{ user: User; token: Token }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = !!action.payload.token;
      state.loading = false;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.passwordResetEmail = null;
      state.otpVerified = false;
    },
  },
  extraReducers: (builder) => {
    // Login user
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload.success) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || MESSAGES.ERROR.LOGIN_FAILED;
        state.isAuthenticated = false;
      });

    // Logout user
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state,) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        state.passwordResetEmail = null;
        state.otpVerified = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || MESSAGES.ERROR.LOGIN_FAILED;
      });

    // Initialize auth
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.isInitializing = true;
        state.isInitialized = false;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = action.payload.isAuthenticated;
        state.isInitializing = false;
        state.isInitialized = true;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.isInitializing = false;
        state.isInitialized = true;
        state.isAuthenticated = false;
      });

    // Forgot password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload.success) {
          // passwordResetEmail is already set by the setPasswordResetEmail action
          // No need to modify it here
        }
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || MESSAGES.ERROR.OTP_SEND_FAILED;
      });

    // Verify OTP
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload.success) {
          state.otpVerified = true;
          state.resetToken = action.payload.reset_token;
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || MESSAGES.ERROR.OTP_VERIFICATION_FAILED;
      });

    // Set new password
    builder
      .addCase(setNewPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setNewPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload.success) {
          state.passwordResetEmail = null;
          state.otpVerified = false;
          state.resetToken = null;
        }
      })
      .addCase(setNewPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || MESSAGES.ERROR.PASSWORD_SET_FAILED;
      });

    // Validate token
    builder
      .addCase(validateToken.fulfilled, (state, action) => {
        if (action.payload.valid && action.payload.user) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        }
      });

    // Refresh token
    builder
      .addCase(refreshToken.fulfilled, (state, action) => {
        if (action.payload.success && action.payload.token) {
          state.token = action.payload.token;
        }
      });
  },
});

export const {
  login,
  logout,
  clearError,
  clearPasswordResetState,
  setPasswordResetEmail
} = authSlice.actions;

// Export async thunks
export {
  loginUser,
  logoutUser,
  forgotPassword,
  verifyOtp,
  setNewPassword,
  validateToken,
  refreshToken,
  initializeAuth,
} from "../thunks/auth.thunks";

export default authSlice.reducer;
