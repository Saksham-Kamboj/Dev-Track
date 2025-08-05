import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LOGIN_FORM_TEXTS, MESSAGES } from "@/constants";
import { useLoginController } from "./login.controller";

const Login = ({ className, ...props }: React.ComponentProps<"div">) => {
  const { getters, handlers } = useLoginController();
  const { email, errors, isProcessing, password, showPassword } = getters;
  const { handleShowPassword, handleSubmit, onEmailChange, onPasswordChange, sendForgetPassword } = handlers;

  return (
    <div
      className={cn(
        "flex items-center justify-center h-screen w-full",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-6 w-sm">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">
              {LOGIN_FORM_TEXTS.WELCOME.TITLE}
            </CardTitle>
            <CardDescription>
              {LOGIN_FORM_TEXTS.WELCOME.DESCRIPTION}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">
                      {LOGIN_FORM_TEXTS.FORM.EMAIL.LABEL}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={onEmailChange}
                      placeholder={LOGIN_FORM_TEXTS.FORM.EMAIL.PLACEHOLDER}
                      className={errors.email ? "border-destructive" : ""}
                      disabled={isProcessing}
                      autoComplete="off"
                      style={{ backgroundColor: "transparent" }}
                    />
                    {errors.email && (
                      <span className="text-sm text-destructive">
                        {errors.email}
                      </span>
                    )}
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">
                        {LOGIN_FORM_TEXTS.FORM.PASSWORD.LABEL}
                      </Label>
                      <button
                        type="button"
                        onClick={sendForgetPassword}
                        className="ml-auto text-sm underline-offset-4 hover:underline text-blue-600"
                      >
                        {LOGIN_FORM_TEXTS.FORM.PASSWORD.FORGOT_PASSWORD}
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={onPasswordChange}
                        placeholder={LOGIN_FORM_TEXTS.FORM.PASSWORD.PLACEHOLDER}
                        className={errors.password ? "border-destructive pr-10" : "pr-10"}
                        disabled={isProcessing}
                        autoComplete="off"
                        style={{ backgroundColor: "transparent" }}
                      />
                      <button
                        type="button"
                        onClick={handleShowPassword}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        disabled={isProcessing}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <span className="text-sm text-destructive">
                        {errors.password}
                      </span>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full text-white"
                    disabled={isProcessing}
                  >
                    {isProcessing ? MESSAGES.LOADING.LOGGING_IN : LOGIN_FORM_TEXTS.FORM.SUBMIT}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs *:[a]:underline *:[a]:underline-offset-4">
          {LOGIN_FORM_TEXTS.FOOTER.TERMS_TEXT_DESCRIPTION}{" "}
          <Link to={LOGIN_FORM_TEXTS.FOOTER.TERMS_LINK}>
            {LOGIN_FORM_TEXTS.FOOTER.TERMS_TEXT}
          </Link>{" "}
          and{" "}
          <Link to={LOGIN_FORM_TEXTS.FOOTER.PRIVACY_LINK}>
            {LOGIN_FORM_TEXTS.FOOTER.PRIVACY_TEXT}
          </Link>
          .
        </div>
      </div>
    </div>
  );
};

export default Login;
