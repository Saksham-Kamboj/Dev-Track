import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateUser, getUserById } from "@/redux/thunks/admin.thunks";
import { toast } from "sonner";
import { PAGE_ROUTES } from "@/constants";
import type { EditUserFormValues } from "@/validation";
import { editUserFormSchema } from "@/validation";
import type { UserData } from "@/types/admin/user-management.types";
import type { FieldErrors } from "react-hook-form";

// Controller response interface
interface EditUserControllerResponse {
  getters: {
    formData: EditUserFormValues;
    errors: FieldErrors<EditUserFormValues>;
    isSubmitting: boolean;
    isLoading: boolean;
    user: UserData | undefined;
  };
  handlers: {
    onInputChange: (field: keyof EditUserFormValues, value: string) => void;
    onRoleChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onSubmit: () => Promise<void>;
    onCancel: () => void;
  };
}

/**
 * Edit User Controller Hook
 * Handles edit user form logic, validation, and API calls
 */
export const useEditUserController = (): EditUserControllerResponse => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const { users, loading } = useAppSelector((state) => state.admin);

  // Find user from Redux store or fetch if not available
  const user = users.find((u) => u.id === id);

  // React Hook Form setup
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserFormSchema),
    mode: "onChange",
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      role: user?.role || "",
      status: user?.status || "active",
    },
  });

  // Watch form data
  const formData = watch();

  // Load user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      // Reset form with user data
      reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "",
        status: user.status || "active",
      });
    } else if (id && !loading) {
      // Fetch user if not in Redux store and not already loading
      dispatch(getUserById(id));
    }
  }, [user, id, reset, dispatch, loading]);

  // Additional effect to ensure form is reset when user data becomes available
  useEffect(() => {
    if (user && user.role) {
      // Explicitly set the role value to ensure Select component updates
      setValue("role", user.role, { shouldValidate: false });
    }
  }, [user, setValue]);

  // Input change handler
  const handleInputChange = useCallback(
    (field: keyof EditUserFormValues, value: string) => {
      setValue(field, value, { shouldValidate: true });
    },
    [setValue]
  );

  // Cancel handler
  const handleCancel = useCallback(() => {
    navigate(PAGE_ROUTES.ADMIN.USER_MANAGEMENT);
  }, [navigate]);

  // Role change handler
  const handleRoleChange = useCallback(
    (value: string) => {
      setValue("role", value, { shouldValidate: true });
    },
    [setValue]
  );

  // Status change handler
  const handleStatusChange = useCallback(
    (value: string) => {
      setValue("status", value, { shouldValidate: true });
    },
    [setValue]
  );

  // Form submission handler
  const onSubmit = useCallback(
    async (data: EditUserFormValues) => {
      if (!id) {
        toast.error("User ID is missing");
        return;
      }

      try {
        // Prepare user data for API
        const userData = {
          name: data.name.trim(),
          email: data.email.trim().toLowerCase(),
          role: data.role,
          phone: data.phone?.trim() || undefined,
          status: data.status,
        };

        // Update user via API
        const result = await dispatch(updateUser({ userId: id, userData }));

        if (updateUser.fulfilled.match(result)) {
          const response = result.payload;
          if (response.success) {
            toast.success(
              response.message ||
                `User ${userData.name} has been updated successfully!`
            );
            navigate(PAGE_ROUTES.ADMIN.USER_MANAGEMENT);
          } else {
            toast.error(response.message || "Failed to update user");
          }
        } else if (updateUser.rejected.match(result)) {
          toast.error(result.payload || "Failed to update user");
        }
      } catch (error) {
        console.error("Error updating user:", error);
        toast.error("Failed to update user. Please try again.");
      }
    },
    [dispatch, navigate, id]
  );

  return {
    getters: {
      formData,
      errors,
      isSubmitting,
      isLoading: loading,
      user,
    },
    handlers: {
      onInputChange: handleInputChange,
      onRoleChange: handleRoleChange,
      onStatusChange: handleStatusChange,
      onSubmit: handleSubmit(onSubmit),
      onCancel: handleCancel,
    },
  };
};
