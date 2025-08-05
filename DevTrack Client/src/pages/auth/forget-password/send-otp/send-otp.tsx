
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
import { SEND_OTP_FORM_TEXTS, MESSAGES } from "@/constants";
import { useSendOtpController } from "./send-otp.controller";

const SendOtp = ({ className, ...props }: React.ComponentProps<"div">) => {
  const { getters, handlers } = useSendOtpController();
  const { email, errors, isProcessing } = getters;
  const { handleSubmit, onEmailChange, backToLogin } = handlers;

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
              {SEND_OTP_FORM_TEXTS.WELCOME.TITLE}
            </CardTitle>
            <CardDescription>
              {SEND_OTP_FORM_TEXTS.WELCOME.DESCRIPTION}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">
                      {SEND_OTP_FORM_TEXTS.FORM.EMAIL.LABEL}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={onEmailChange}
                      placeholder={SEND_OTP_FORM_TEXTS.FORM.EMAIL.PLACEHOLDER}
                      className={errors.email ? "border-destructive" : ""}
                      disabled={isProcessing}
                      autoComplete="off"
                      style={{ backgroundColor: "transparent" }}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full text-white"
                    disabled={isProcessing}
                  >
                    {isProcessing ? MESSAGES.LOADING.SENDING_OTP : SEND_OTP_FORM_TEXTS.FORM.SUBMIT}
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
                {SEND_OTP_FORM_TEXTS.FOOTER.BACK_TO_LOGIN}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SendOtp;
