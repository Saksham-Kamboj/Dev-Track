import * as z from "zod";
import { VALIDATION_MESSAGES } from "@/constants";

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, VALIDATION_MESSAGES.EMAIL.REQUIRED)
    .email(VALIDATION_MESSAGES.EMAIL.INVALID),
  password: z
    .string()
    .min(8, VALIDATION_MESSAGES.PASSWORD.MIN_LENGTH)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      VALIDATION_MESSAGES.PASSWORD.PATTERN
    ),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
