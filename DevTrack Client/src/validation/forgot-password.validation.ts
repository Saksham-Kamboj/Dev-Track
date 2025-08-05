import * as z from "zod";
import { VALIDATION_MESSAGES } from "@/constants";

export const sendOtpFormSchema = z.object({
  email: z
    .string()
    .min(1, VALIDATION_MESSAGES.EMAIL.REQUIRED)
    .email(VALIDATION_MESSAGES.EMAIL.INVALID),
});

export const verifyOtpFormSchema = z.object({
  email: z
    .string()
    .min(1, VALIDATION_MESSAGES.EMAIL.REQUIRED)
    .email(VALIDATION_MESSAGES.EMAIL.INVALID),
  otp_code: z
    .string()
    .min(6, VALIDATION_MESSAGES.OTP.LENGTH)
    .max(6, VALIDATION_MESSAGES.OTP.LENGTH)
    .regex(/^\d{6}$/, VALIDATION_MESSAGES.OTP.NUMBERS_ONLY),
});

export const setNewPasswordFormSchema = z.object({
  email: z
    .string()
    .min(1, VALIDATION_MESSAGES.EMAIL.REQUIRED)
    .email(VALIDATION_MESSAGES.EMAIL.INVALID),
  reset_token: z
    .string()
    .min(1, VALIDATION_MESSAGES.RESET_TOKEN.REQUIRED),
  new_password: z
    .string()
    .min(8, VALIDATION_MESSAGES.PASSWORD.MIN_LENGTH)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      VALIDATION_MESSAGES.PASSWORD.PATTERN
    ),
  confirm_password: z
    .string()
    .min(1, VALIDATION_MESSAGES.PASSWORD.CONFIRM_REQUIRED),
}).refine((data) => data.new_password === data.confirm_password, {
  message: VALIDATION_MESSAGES.PASSWORD.MISMATCH,
  path: ["confirm_password"],
});

export type SendOtpFormValues = z.infer<typeof sendOtpFormSchema>;
export type VerifyOtpFormValues = z.infer<typeof verifyOtpFormSchema>;
export type SetNewPasswordFormValues = z.infer<typeof setNewPasswordFormSchema>;
