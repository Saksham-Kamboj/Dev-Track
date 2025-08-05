
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
import { SET_NEW_PASSWORD_FORM_TEXTS, MESSAGES } from "@/constants";
import { useSetNewPasswordController } from "./set-new-password.controller";

const SetNewPassword = ({ className, ...props }: React.ComponentProps<"div">) => {
  const { getters, handlers } = useSetNewPasswordController();
  const {
    email,
    new_password,
    confirm_password,
    showPassword,
    showConfirmPassword,
    errors,
    isProcessing
  } = getters;
  const {
    handleSubmit,
    onEmailChange,
    onNewPasswordChange,
    onConfirmPasswordChange,
    handleShowPassword,
    handleShowConfirmPassword,
    backToLogin
  } = handlers;

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
              {SET_NEW_PASSWORD_FORM_TEXTS.WELCOME.TITLE}
            </CardTitle>
            <CardDescription>
              {SET_NEW_PASSWORD_FORM_TEXTS.WELCOME.DESCRIPTION}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">
                      {SET_NEW_PASSWORD_FORM_TEXTS.FORM.EMAIL.LABEL}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={onEmailChange}
                      placeholder={SET_NEW_PASSWORD_FORM_TEXTS.FORM.EMAIL.PLACEHOLDER}
                      className={errors.email ? "border-destructive" : ""}
                      disabled={true} // Email should be readonly
                      autoComplete="off"
                      style={{ backgroundColor: "transparent" }}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="new_password">
                      {SET_NEW_PASSWORD_FORM_TEXTS.FORM.NEW_PASSWORD.LABEL}
                    </Label>
                    <div className="relative">
                      <Input
                        id="new_password"
                        type={showPassword ? "text" : "password"}
                        value={new_password}
                        onChange={onNewPasswordChange}
                        placeholder={SET_NEW_PASSWORD_FORM_TEXTS.FORM.NEW_PASSWORD.PLACEHOLDER}
                        className={errors.new_password ? "border-destructive pr-10" : "pr-10"}
                        disabled={isProcessing}
                        autoComplete="off"
                        style={{ backgroundColor: "transparent" }}
                      />
                      <button
                        type="button"
                        onClick={handleShowPassword}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        disabled={isProcessing}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.new_password && (
                      <p className="text-sm text-destructive">
                        {errors.new_password}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="confirm_password">
                      {SET_NEW_PASSWORD_FORM_TEXTS.FORM.CONFIRM_PASSWORD.LABEL}
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm_password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirm_password}
                        onChange={onConfirmPasswordChange}
                        placeholder={SET_NEW_PASSWORD_FORM_TEXTS.FORM.CONFIRM_PASSWORD.PLACEHOLDER}
                        className={errors.confirm_password ? "border-destructive pr-10" : "pr-10"}
                        disabled={isProcessing}
                        autoComplete="off"
                        style={{ backgroundColor: "transparent" }}
                      />
                      <button
                        type="button"
                        onClick={handleShowConfirmPassword}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        disabled={isProcessing}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirm_password && (
                      <p className="text-sm text-destructive">
                        {errors.confirm_password}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full text-white"
                    disabled={isProcessing}
                  >
                    {isProcessing ? MESSAGES.LOADING.UPDATING_PASSWORD : SET_NEW_PASSWORD_FORM_TEXTS.FORM.SUBMIT}
                  </Button>
                </div>
              </div>
            </form>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={backToLogin}
                className="text-sm underline-offset-4 hover:underline text-blue-600"
              >
                {SET_NEW_PASSWORD_FORM_TEXTS.FOOTER.BACK_TO_LOGIN}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SetNewPassword;
