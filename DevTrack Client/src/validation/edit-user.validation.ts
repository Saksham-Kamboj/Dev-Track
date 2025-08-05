import { z } from "zod"
import { VALIDATION_MESSAGES } from "@/constants"

/**
 * Edit User Form Validation Schema
 * Validates user edit form data
 */
export const editUserFormSchema = z.object({
  name: z
    .string()
    .min(1, VALIDATION_MESSAGES.USER.NAME.REQUIRED)
    .min(2, VALIDATION_MESSAGES.USER.NAME.MIN_LENGTH)
    .max(50, VALIDATION_MESSAGES.USER.NAME.MAX_LENGTH)
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),

  email: z
    .string()
    .min(1, VALIDATION_MESSAGES.EMAIL.REQUIRED)
    .email(VALIDATION_MESSAGES.EMAIL.INVALID)
    .max(100, "Email must be less than 100 characters"),

  phone: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value || value.trim() === "") return true
        // Allow various phone number formats
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$|^[\+]?[(]?[\d\s\-\(\)]{10,}$/
        return phoneRegex.test(value.replace(/[\s\-\(\)]/g, ""))
      },
      {
        message: VALIDATION_MESSAGES.USER.PHONE.INVALID,
      }
    ),

  role: z
    .string()
    .min(1, VALIDATION_MESSAGES.USER.ROLE.REQUIRED)
    .refine((value) => ["admin", "developer"].includes(value), {
      message: "Role must be either admin or developer",
    }),

  status: z
    .string()
    .min(1, "Status is required")
    .refine((value) => ["active", "inactive"].includes(value), {
      message: "Status must be either active or inactive",
    }),
})

/**
 * Type definition for edit user form values
 */
export type EditUserFormValues = z.infer<typeof editUserFormSchema>
