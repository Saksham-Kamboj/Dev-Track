import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PAGE_ROUTES, MESSAGES } from "@/constants";
import type { VerifyOtpFormValues } from "@/validation";
import { verifyOtpFormSchema } from "@/validation";
import type { ITextInputFieldData, IVerifyOtpControllerResponse } from "@/types";
import { verifyOtp, forgotPassword, setPasswordResetEmail } from "@/redux/slices/";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export const useVerifyOtpController = (): IVerifyOtpControllerResponse => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Get state from Redux
  const { loading: isProcessing, passwordResetEmail } = useAppSelector((state) => state.auth);

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpFormSchema),
    mode: "onChange",
    defaultValues: {
      email: passwordResetEmail || "",
    },
  });

  const email = watch("email") || "";
  const otp_code = watch("otp_code") || "";

  // If no email in state, redirect to send OTP
  useEffect(() => {
    if (!passwordResetEmail) {
      navigate(PAGE_ROUTES.AUTH.SEND_OTP);
    }
  }, [passwordResetEmail, navigate]);

  const onEmailChange = (event: ITextInputFieldData) => {
    setValue("email", event.target.value, { shouldValidate: true });
  };

  const onOtpChange = (event: ITextInputFieldData) => {
    // Only allow numbers and limit to 6 digits
    const value = event.target.value.replace(/\D/g, '').slice(0, 6);
    setValue("otp_code", value, { shouldValidate: true });
  };

  const onSubmit = async (formData: VerifyOtpFormValues) => {
    try {
      const result = await dispatch(verifyOtp({
        email: formData.email,
        otp_code: formData.otp_code,
      }));

      if (verifyOtp.fulfilled.match(result)) {
        const response = result.payload;
        if (response.success) {
          navigate(PAGE_ROUTES.AUTH.SET_NEW_PASSWORD);
          toast.success(response.message || MESSAGES.SUCCESS.OTP_VERIFIED);
        } else {
          toast.error(response.message || MESSAGES.ERROR.OTP_INVALID);
        }
      } else if (verifyOtp.rejected.match(result)) {
        toast.error(result.payload || MESSAGES.ERROR.OTP_VERIFICATION_FAILED);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : MESSAGES.ERROR.OTP_VERIFICATION_FAILED;
      toast.error(errorMessage);
    }
  };

  const handleSubmitWrapper = () => {
    return handleSubmit(onSubmit)();
  };

  const backToLogin = () => {
    navigate(PAGE_ROUTES.AUTH.LOGIN);
  };

  const resendOtp = async () => {
    if (!email) {
      toast.error(MESSAGES.ERROR.EMAIL_REQUIRED);
      return;
    }

    try {
      const result = await dispatch(forgotPassword(email));

      if (forgotPassword.fulfilled.match(result)) {
        const response = result.payload;
        if (response.success) {
          dispatch(setPasswordResetEmail(email));
          toast.success(MESSAGES.SUCCESS.OTP_RESENT);
        } else {
          toast.error(response.message || MESSAGES.ERROR.OTP_RESEND_FAILED);
        }
      } else if (forgotPassword.rejected.match(result)) {
        toast.error(result.payload || MESSAGES.ERROR.OTP_RESEND_FAILED);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : MESSAGES.ERROR.OTP_RESEND_FAILED;
      toast.error(errorMessage);
    }
  };

  return {
    getters: {
      email,
      otp_code,
      isProcessing,
      errors: {
        email: errors.email?.message,
        otp_code: errors.otp_code?.message,
      },
    },
    handlers: {
      onEmailChange,
      onOtpChange,
      handleSubmit: handleSubmitWrapper,
      backToLogin,
      resendOtp,
    },
  };
};
