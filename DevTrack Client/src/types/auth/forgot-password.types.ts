import type { ITextInputFieldData } from "./auth.types";

export interface ISendOtpControllerResponse {
  getters: {
    email: string;
    isProcessing: boolean;
    errors: {
      email?: string;
    };
  };
  handlers: {
    onEmailChange: (event: ITextInputFieldData) => void;
    handleSubmit: () => Promise<void>;
    backToLogin: () => void;
  };
}

export interface IVerifyOtpControllerResponse {
  getters: {
    email: string;
    otp_code: string;
    isProcessing: boolean;
    errors: {
      email?: string;
      otp_code?: string;
    };
  };
  handlers: {
    onEmailChange: (event: ITextInputFieldData) => void;
    onOtpChange: (event: ITextInputFieldData) => void;
    handleSubmit: () => Promise<void>;
    backToLogin: () => void;
    resendOtp: () => Promise<void>;
  };
}

export interface ISetNewPasswordControllerResponse {
  getters: {
    email: string;
    new_password: string;
    confirm_password: string;
    showPassword: boolean;
    showConfirmPassword: boolean;
    isProcessing: boolean;
    errors: {
      email?: string;
      new_password?: string;
      confirm_password?: string;
    };
  };
  handlers: {
    onEmailChange: (event: ITextInputFieldData) => void;
    onNewPasswordChange: (event: ITextInputFieldData) => void;
    onConfirmPasswordChange: (event: ITextInputFieldData) => void;
    handleShowPassword: () => void;
    handleShowConfirmPassword: () => void;
    handleSubmit: () => Promise<void>;
    backToLogin: () => void;
  };
}
