import { createAsyncThunk } from '@reduxjs/toolkit';
import { ProfileService } from '@/services';
import type { User } from '@/types';

// Get ProfileService instance
const profileService = ProfileService.getInstance();

/**
 * Async thunk for getting user profile
 */
export const getUserProfile = createAsyncThunk<
  User,
  void,
  {
    rejectValue: string;
  }
>('profile/getUserProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await profileService.getProfile();
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile';
    return rejectWithValue(errorMessage);
  }
});

/**
 * Async thunk for updating user profile
 */
export const updateUserProfile = createAsyncThunk<
  { success: boolean; message: string; user: User },
  Partial<User>,
  {
    rejectValue: string;
  }
>('profile/updateUserProfile', async (profileData, { rejectWithValue }) => {
  try {
    const response = await profileService.updateProfile(profileData);
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
    return rejectWithValue(errorMessage);
  }
});

/**
 * Async thunk for changing password
 */
export const changePassword = createAsyncThunk<
  { success: boolean; message: string },
  {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  },
  {
    rejectValue: string;
  }
>('profile/changePassword', async (passwordData, { rejectWithValue }) => {
  try {
    const response = await profileService.changePassword(passwordData);
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to change password';
    return rejectWithValue(errorMessage);
  }
});

/**
 * Async thunk for uploading profile picture
 */
export const uploadProfilePicture = createAsyncThunk<
  { success: boolean; message: string; imageUrl: string },
  FormData,
  {
    rejectValue: string;
  }
>('profile/uploadProfilePicture', async (formData, { rejectWithValue }) => {
  try {
    const response = await profileService.uploadProfilePicture(formData);
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload profile picture';
    return rejectWithValue(errorMessage);
  }
});

/**
 * Async thunk for deleting profile picture
 */
export const deleteProfilePicture = createAsyncThunk<
  { success: boolean; message: string },
  void,
  {
    rejectValue: string;
  }
>('profile/deleteProfilePicture', async (_, { rejectWithValue }) => {
  try {
    const response = await profileService.deleteProfilePicture();
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete profile picture';
    return rejectWithValue(errorMessage);
  }
});
