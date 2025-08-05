import * as z from "zod";
import { VALIDATION_MESSAGES } from "@/constants";

export const addUserFormSchema = z.object({
  name: z
    .string()
    .min(1, VALIDATION_MESSAGES.USER.NAME.REQUIRED)
    .min(2, VALIDATION_MESSAGES.USER.NAME.MIN_LENGTH)
    .max(50, VALIDATION_MESSAGES.USER.NAME.MAX_LENGTH)
    .trim(),

  email: z
    .string()
    .min(1, VALIDATION_MESSAGES.EMAIL.REQUIRED)
    .email(VALIDATION_MESSAGES.EMAIL.INVALID)
    .toLowerCase(),

  phone: z
    .string()
    .optional()
    .refine((phone) => {
      if (!phone || phone.trim() === "") return true;
      // Allow various phone number formats
      const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)]{7,15}$/;
      return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }, VALIDATION_MESSAGES.USER.PHONE.INVALID),

  role: z
    .string()
    .min(1, VALIDATION_MESSAGES.USER.ROLE.REQUIRED)
    .refine((role) => ["admin", "developer"].includes(role), {
      message: "Please select a valid user role",
    }),

  password: z
    .string()
    .min(1, VALIDATION_MESSAGES.PASSWORD.REQUIRED)
    .min(8, VALIDATION_MESSAGES.PASSWORD.MIN_LENGTH)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      VALIDATION_MESSAGES.PASSWORD.PATTERN
    ),

  confirmPassword: z
    .string()
    .min(1, VALIDATION_MESSAGES.PASSWORD.CONFIRM_REQUIRED),
}).refine((data) => data.password === data.confirmPassword, {
  message: VALIDATION_MESSAGES.PASSWORD.MISMATCH,
  path: ["confirmPassword"],
});

export type AddUserFormValues = z.infer<typeof addUserFormSchema>;
