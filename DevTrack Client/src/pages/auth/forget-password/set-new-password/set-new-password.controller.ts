import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PAGE_ROUTES, MESSAGES } from "@/constants";
import type { SetNewPasswordFormValues } from "@/validation";
import { setNewPasswordFormSchema } from "@/validation";
import type { ITextInputFieldData, ISetNewPasswordControllerResponse } from "@/types";
import { setNewPassword, clearPasswordResetState } from "@/redux/slices/";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export const useSetNewPasswordController = (): ISetNewPasswordControllerResponse => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Get state from Redux
  const { loading: isProcessing, passwordResetEmail, otpVerified, resetToken } = useAppSelector((state) => state.auth);

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SetNewPasswordFormValues>({
    resolver: zodResolver(setNewPasswordFormSchema),
    mode: "onChange",
    defaultValues: {
      email: passwordResetEmail || "",
      reset_token: resetToken || "",
    },
  });

  // Update form values when Redux state changes
  useEffect(() => {
    if (passwordResetEmail) {
      setValue("email", passwordResetEmail);
    }
    if (resetToken) {
      setValue("reset_token", resetToken);
    }
  }, [passwordResetEmail, resetToken, setValue]);

  const email = watch("email") || "";
  const new_password = watch("new_password") || "";
  const confirm_password = watch("confirm_password") || "";

  // If no email or OTP not verified, redirect to appropriate page
  useEffect(() => {
    if (!passwordResetEmail) {
      navigate(PAGE_ROUTES.AUTH.SEND_OTP);
    } else if (!otpVerified || !resetToken) {
      navigate(PAGE_ROUTES.AUTH.VERIFY_OTP);
    }
  }, [passwordResetEmail, otpVerified, resetToken, navigate]);

  const onEmailChange = (event: ITextInputFieldData) => {
    setValue("email", event.target.value, { shouldValidate: true });
  };

  const onNewPasswordChange = (event: ITextInputFieldData) => {
    setValue("new_password", event.target.value, { shouldValidate: true });
  };

  const onConfirmPasswordChange = (event: ITextInputFieldData) => {
    setValue("confirm_password", event.target.value, { shouldValidate: true });
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onSubmit = async (formData: SetNewPasswordFormValues) => {
    try {
      const result = await dispatch(setNewPassword({
        email: formData.email,
        reset_token: formData.reset_token,
        new_password: formData.new_password,
      }));

      if (setNewPassword.fulfilled.match(result)) {
        const response = result.payload;

        if (response.success) {
          // Clear password reset state
          dispatch(clearPasswordResetState());
          // Show success message
          toast.success(response.message || MESSAGES.SUCCESS.PASSWORD_UPDATED);
          // Navigate to login page with a small delay to ensure state is cleared
          setTimeout(() => {
            navigate(PAGE_ROUTES.AUTH.LOGIN, { replace: true });
          }, 100);
        } else {
          toast.error(response.message || MESSAGES.ERROR.PASSWORD_UPDATE_FAILED);
        }
      } else if (setNewPassword.rejected.match(result)) {
        toast.error(result.payload || MESSAGES.ERROR.PASSWORD_UPDATE_FAILED);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : MESSAGES.ERROR.PASSWORD_UPDATE_FAILED;
      toast.error(errorMessage);
    }
  };

  const handleSubmitWrapper = () => {
    return handleSubmit(onSubmit)();
  };

  const backToLogin = () => {
    dispatch(clearPasswordResetState());
    navigate(PAGE_ROUTES.AUTH.LOGIN);
  };

  return {
    getters: {
      email,
      new_password,
      confirm_password,
      showPassword,
      showConfirmPassword,
      isProcessing,
      errors: {
        email: errors.email?.message,
        new_password: errors.new_password?.message,
        confirm_password: errors.confirm_password?.message,
      },
    },
    handlers: {
      onEmailChange,
      onNewPasswordChange,
      onConfirmPasswordChange,
      handleShowPassword,
      handleShowConfirmPassword,
      handleSubmit: handleSubmitWrapper,
      backToLogin,
    },
  };
};
