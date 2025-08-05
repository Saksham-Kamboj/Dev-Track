import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PAGE_ROUTES, MESSAGES } from "@/constants";
import type { SendOtpFormValues } from "@/validation";
import { sendOtpFormSchema } from "@/validation";
import type { ITextInputFieldData, ISendOtpControllerResponse } from "@/types";
import { forgotPassword, setPasswordResetEmail } from "@/redux/slices/";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export const useSendOtpController = (): ISendOtpControllerResponse => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Get loading state from Redux
  const { loading: isProcessing } = useAppSelector((state) => state.auth);

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SendOtpFormValues>({
    resolver: zodResolver(sendOtpFormSchema),
    mode: "onChange",
  });

  const email = watch("email") || "";

  const onEmailChange = (event: ITextInputFieldData) => {
    setValue("email", event.target.value, { shouldValidate: true });
  };

  const onSubmit = async (formData: SendOtpFormValues) => {
    try {
      const result = await dispatch(forgotPassword(formData.email));

      if (forgotPassword.fulfilled.match(result)) {
        const response = result.payload;
        if (response.success) {
          // Store email for next step
          dispatch(setPasswordResetEmail(formData.email));
          navigate(PAGE_ROUTES.AUTH.VERIFY_OTP);
          toast.success(response.message || MESSAGES.SUCCESS.OTP_SENT);
        } else {
          toast.error(response.message || MESSAGES.ERROR.OTP_SEND_FAILED);
        }
      } else if (forgotPassword.rejected.match(result)) {
        toast.error(result.payload || MESSAGES.ERROR.OTP_SEND_FAILED);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : MESSAGES.ERROR.OTP_SEND_FAILED;
      toast.error(errorMessage);
    }
  };

  const handleSubmitWrapper = () => {
    return handleSubmit(onSubmit)();
  };

  const backToLogin = () => {
    navigate(PAGE_ROUTES.AUTH.LOGIN);
  };

  return {
    getters: {
      email,
      isProcessing,
      errors: {
        email: errors.email?.message,
      },
    },
    handlers: {
      onEmailChange,
      handleSubmit: handleSubmitWrapper,
      backToLogin,
    },
  };
};
