import { createSlice } from "@reduxjs/toolkit";
import { REDUX_CONSTANTS } from "@/constants";
import type { ProfileData } from "@/types/profile/profile.types";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  uploadProfilePicture,
  deleteProfilePicture,
} from "../thunks/profile.thunks";

interface ProfileState {
  profile: ProfileData | null;
  loading: boolean;
  error: string | null;
  uploadingImage: boolean;
  imageUploadError: string | null;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
  uploadingImage: false,
  imageUploadError: null,
};

const profileSlice = createSlice({
  name: REDUX_CONSTANTS.SLICE_NAMES.PROFILE || "profile",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.imageUploadError = null;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
      state.imageUploadError = null;
    },
  },
  extraReducers: (builder) => {
    // Get user profile
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update user profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.user;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Change password
    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Upload profile picture
    builder
      .addCase(uploadProfilePicture.pending, (state) => {
        state.uploadingImage = true;
        state.imageUploadError = null;
      })
      .addCase(uploadProfilePicture.fulfilled, (state, action) => {
        state.uploadingImage = false;
        if (state.profile) {
          state.profile.avatar = action.payload.imageUrl;
        }
        state.imageUploadError = null;
      })
      .addCase(uploadProfilePicture.rejected, (state, action) => {
        state.uploadingImage = false;
        state.imageUploadError = action.payload as string;
      });

    // Delete profile picture
    builder
      .addCase(deleteProfilePicture.pending, (state) => {
        state.uploadingImage = true;
        state.imageUploadError = null;
      })
      .addCase(deleteProfilePicture.fulfilled, (state) => {
        state.uploadingImage = false;
        if (state.profile) {
          state.profile.avatar = null;
        }
        state.imageUploadError = null;
      })
      .addCase(deleteProfilePicture.rejected, (state, action) => {
        state.uploadingImage = false;
        state.imageUploadError = action.payload as string;
      });
  },
});

export const { clearError, clearProfile } = profileSlice.actions;

// Export async thunks
export {
  getUserProfile,
  updateUserProfile,
  changePassword,
  uploadProfilePicture,
  deleteProfilePicture,
} from "../thunks/profile.thunks";

export default profileSlice.reducer;
