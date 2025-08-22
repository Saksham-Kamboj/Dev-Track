import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  uploadProfilePicture,
  deleteProfilePicture,
  clearProfileError,
} from "@/redux/slices";
import type {
  ProfileControllerResponse,
  ProfileFormData,
} from "@/types/profile/profile.types";
import {
  profileFormSchema,
  type ProfileFormValues,
  validateImageFile,
} from "@/validation";

export const useProfileController = (): ProfileControllerResponse => {
  const dispatch = useAppDispatch();

  // Redux state
  const { profile, loading, error, uploadingImage, imageUploadError } =
    useAppSelector((state) => state.profile);

  // Local state
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  // Form setup
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      phone: "",
      bio: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const formData = watch();

  // Load profile data on component mount
  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  // Reset form when profile data is loaded
  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [profile, reset]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearProfileError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (imageUploadError) {
      toast.error(imageUploadError);
      dispatch(clearProfileError());
    }
  }, [imageUploadError, dispatch]);

  // Handlers
  const handleInputChange = useCallback(
    (field: keyof ProfileFormData, value: string) => {
      setValue(field, value, { shouldValidate: true });
    },
    [setValue]
  );

  const handleFormSubmit = useCallback(
    async (data: ProfileFormValues) => {
      try {
        const updateData = {
          name: data.name,
          phone: data.phone || undefined,
          bio: data.bio || undefined,
        };

        const profileResult = await dispatch(updateUserProfile(updateData));

        if (updateUserProfile.fulfilled.match(profileResult)) {
          toast.success("Profile updated successfully");

          // Handle password change if provided
          if (
            data.newPassword &&
            data.currentPassword &&
            data.confirmPassword
          ) {
            const passwordData = {
              currentPassword: data.currentPassword,
              newPassword: data.newPassword,
              confirmPassword: data.confirmPassword,
            };

            const passwordResult = await dispatch(changePassword(passwordData));

            if (changePassword.fulfilled.match(passwordResult)) {
              toast.success("Password changed successfully");
            }
          }

          // Reset password fields
          setValue("currentPassword", "");
          setValue("newPassword", "");
          setValue("confirmPassword", "");
          setShowPasswordFields(false);
        }
      } catch (error) {
        console.error("Profile update error:", error);
        toast.error("Failed to update profile");
      }
    },
    [dispatch, setValue]
  );

  const handleImageUpload = useCallback(
    async (file: File) => {
      // Validate file
      const validationError = validateImageFile(file);
      if (validationError) {
        toast.error(validationError);
        return;
      }

      try {
        const formData = new FormData();
        formData.append("avatar", file);

        const result = await dispatch(uploadProfilePicture(formData));

        if (uploadProfilePicture.fulfilled.match(result)) {
          toast.success("Profile image updated successfully");
        }
      } catch (error) {
        console.error("Image upload error:", error);
        toast.error("Failed to upload image");
      }
    },
    [dispatch]
  );

  const handleImageDelete = useCallback(async () => {
    try {
      const result = await dispatch(deleteProfilePicture());

      if (deleteProfilePicture.fulfilled.match(result)) {
        toast.success("Profile image deleted successfully");
      }
    } catch (error) {
      console.error("Image delete error:", error);
      toast.error("Failed to delete image");
    }
  }, [dispatch]);

  const handleTogglePasswordFields = useCallback(() => {
    setShowPasswordFields((prev) => {
      if (prev) {
        // Clear password fields when hiding
        setValue("currentPassword", "");
        setValue("newPassword", "");
        setValue("confirmPassword", "");
      }
      return !prev;
    });
  }, [setValue]);

  const handleCancel = useCallback(() => {
    if (profile) {
      reset({
        name: profile.name || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordFields(false);
    }
  }, [profile, reset]);

  return {
    getters: {
      profile,
      formData,
      errors,
      isLoading: loading,
      isSubmitting,
      uploadingImage,
      imageUploadError,
      showPasswordFields,
    },
    handlers: {
      onInputChange: handleInputChange,
      onSubmit: handleSubmit(handleFormSubmit),
      onImageUpload: handleImageUpload,
      onImageDelete: handleImageDelete,
      onTogglePasswordFields: handleTogglePasswordFields,
      onCancel: handleCancel,
    },
  };
};
