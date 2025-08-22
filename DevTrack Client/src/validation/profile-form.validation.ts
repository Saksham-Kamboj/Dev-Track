import { z } from "zod";

// Profile form validation schema
export const profileFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\+?[\d\s\-\(\)]+$/.test(val), {
      message: "Please enter a valid phone number"
    })
    .refine((val) => !val || val.length >= 10, {
      message: "Phone number must be at least 10 digits"
    }),
  
  bio: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 500, {
      message: "Bio must not exceed 500 characters"
    }),
  
  currentPassword: z
    .string()
    .optional(),
  
  newPassword: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 8, {
      message: "New password must be at least 8 characters"
    })
    .refine((val) => !val || /(?=.*[a-z])/.test(val), {
      message: "New password must contain at least one lowercase letter"
    })
    .refine((val) => !val || /(?=.*[A-Z])/.test(val), {
      message: "New password must contain at least one uppercase letter"
    })
    .refine((val) => !val || /(?=.*\d)/.test(val), {
      message: "New password must contain at least one number"
    }),
  
  confirmPassword: z
    .string()
    .optional()
}).refine((data) => {
  // If new password is provided, current password is required
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: "Current password is required when setting a new password",
  path: ["currentPassword"]
}).refine((data) => {
  // If new password is provided, confirm password must match
  if (data.newPassword && data.newPassword !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Image upload validation
export const validateImageFile = (file: File): string | null => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return 'Please select a valid image file (JPEG, PNG, or GIF)';
  }
  
  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return 'Image size must be less than 5MB';
  }
  
  return null;
};
