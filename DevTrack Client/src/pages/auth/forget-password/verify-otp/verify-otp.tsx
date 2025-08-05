
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
import { VERIFY_OTP_FORM_TEXTS, MESSAGES } from "@/constants";
import { useVerifyOtpController } from "./verify-otp.controller";

const VerifyOtp = ({ className, ...props }: React.ComponentProps<"div">) => {
  const { getters, handlers } = useVerifyOtpController();
  const { email, otp_code, errors, isProcessing } = getters;
  const { handleSubmit, onEmailChange, onOtpChange, backToLogin, resendOtp } = handlers;

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
              {VERIFY_OTP_FORM_TEXTS.WELCOME.TITLE}
            </CardTitle>
            <CardDescription>
              {VERIFY_OTP_FORM_TEXTS.WELCOME.DESCRIPTION}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">
                      {VERIFY_OTP_FORM_TEXTS.FORM.EMAIL.LABEL}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={onEmailChange}
                      placeholder={VERIFY_OTP_FORM_TEXTS.FORM.EMAIL.PLACEHOLDER}
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
                    <Label htmlFor="otp_code">
                      {VERIFY_OTP_FORM_TEXTS.FORM.OTP.LABEL}
                    </Label>
                    <Input
                      id="otp_code"
                      type="text"
                      value={otp_code}
                      onChange={onOtpChange}
                      placeholder={VERIFY_OTP_FORM_TEXTS.FORM.OTP.PLACEHOLDER}
                      className={errors.otp_code ? "border-destructive" : ""}
                      disabled={isProcessing}
                      autoComplete="off"
                      style={{ backgroundColor: "transparent" }}
                      maxLength={6}
                    />
                    {errors.otp_code && (
                      <p className="text-sm text-destructive">
                        {errors.otp_code}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full text-white"
                    disabled={isProcessing}
                  >
                    {isProcessing ? MESSAGES.LOADING.VERIFYING_OTP : VERIFY_OTP_FORM_TEXTS.FORM.SUBMIT}
                  </Button>
                </div>
              </div>
            </form>
            <div className="mt-4 text-center space-y-2">
              <button
                type="button"
                onClick={resendOtp}
                className="text-sm underline-offset-4 hover:underline text-blue-600"
                disabled={isProcessing}
              >
                {VERIFY_OTP_FORM_TEXTS.FOOTER.RESEND_OTP}
              </button>
              <div>
                <button
                  type="button"
                  onClick={backToLogin}
                  className="text-sm underline-offset-4 hover:underline text-blue-600"
                >
                  {VERIFY_OTP_FORM_TEXTS.FOOTER.BACK_TO_LOGIN}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyOtp;
