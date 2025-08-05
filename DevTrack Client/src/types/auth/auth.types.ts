export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
} | null;

export type Token = string | null;

export type LoginResponse = {
  success: boolean;
  message: string;
  user: User
  token: string;
};

export type AuthContextType = {
  isAuthenticated: boolean;
  token: Token;
  user: User;
  login: (token: Token, user: User) => void;
  logout: (message?: string) => void;
};

export type AuthProviderProps = {
  children: React.ReactNode;
};

export interface ITextInputFieldData {
  target: {
    value: string;
  };
}

export interface ILogInControllerResponse {
  getters: {
    email: string;
    password: string;
    showPassword: boolean;
    isProcessing: boolean;
    errors: {
      email?: string;
      password?: string;
    };
  };
  handlers: {
    onEmailChange: (event: ITextInputFieldData) => void;
    onPasswordChange: (event: ITextInputFieldData) => void;
    handleShowPassword: () => void;
    handleSubmit: () => Promise<void>;
    sendForgetPassword: () => void;
  };
}
