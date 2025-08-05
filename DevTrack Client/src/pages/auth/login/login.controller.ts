import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PAGE_ROUTES, MESSAGES } from "@/constants";
import type { LoginFormValues } from "@/validation";
import { loginFormSchema } from "@/validation";
import type { ILogInControllerResponse, ITextInputFieldData, LoginResponse } from "@/types";
import { getDashboardRouteForRole } from "@/helper";
import { loginUser } from "@/redux/slices/";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { AuthService } from "@/services";

/**
 * Consolidated Login Controller
 * Combines both form controller and auth service functionality
 */

// Static auth service methods
export class LoginController {
  private static authService = AuthService.getInstance();

  static async login(credentials: LoginFormValues): Promise<LoginResponse> {
    return this.authService.login(credentials);
  }

  /**
   * @deprecated Use useLogout hook instead for proper logout handling
   */
  static logout(): void {
    this.authService.logout();
  }

  static isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  static getCurrentUser() {
    return this.authService.getCurrentUser();
  }

  static getToken(): string | null {
    return this.authService.getToken();
  }

  static isSessionExpired(): boolean {
    return this.authService.isSessionExpired();
  }

  static refreshSession(): void {
    this.authService.refreshSession();
  }
}

// Form controller hook following the established pattern
export const useLoginController = (): ILogInControllerResponse => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Get loading state from Redux
  const { loading: isProcessing, } = useAppSelector((state) => state.auth);

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    mode: "onChange",
  });

  const email = watch("email") || "";
  const password = watch("password") || "";

  const onEmailChange = (event: ITextInputFieldData) => {
    setValue("email", event.target.value, { shouldValidate: true });
  };

  const onPasswordChange = (event: ITextInputFieldData) => {
    setValue("password", event.target.value, { shouldValidate: true });
  };

  const handleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const onSubmit = async (credentials: LoginFormValues) => {
    try {
      const result = await dispatch(loginUser(credentials));

      if (loginUser.fulfilled.match(result)) {
        const response = result.payload;
        if (response.success && response.token && response.user) {
          const navigateToDashboard = getDashboardRouteForRole(response.user.role);
          navigate(navigateToDashboard);
          toast.success(response.message || MESSAGES.SUCCESS.LOGIN_SUCCESS);
        } else {
          toast.error(response.message || MESSAGES.ERROR.LOGIN_CREDENTIALS_INVALID);
        }
      } else if (loginUser.rejected.match(result)) {
        toast.error(result.payload || MESSAGES.ERROR.LOGIN_FAILED);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : MESSAGES.ERROR.LOGIN_FAILED;
      toast.error(errorMessage);
    }
  };

  const handleSubmitWrapper = () => {
    return handleSubmit(onSubmit)();
  };

  const sendForgetPassword = () => {
    navigate(PAGE_ROUTES.AUTH.SEND_OTP);
  };

  return {
    getters: {
      email,
      password,
      showPassword,
      isProcessing,
      errors: {
        email: errors.email?.message,
        password: errors.password?.message,
      },
    },
    handlers: {
      onEmailChange,
      onPasswordChange,
      handleShowPassword,
      handleSubmit: handleSubmitWrapper,
      sendForgetPassword,
    },
  };
};


