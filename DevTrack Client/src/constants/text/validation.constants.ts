export const VALIDATION_MESSAGES = {
  // Email validation
  EMAIL: {
    REQUIRED: "Email is required",
    INVALID: "Please enter a valid email address",
  },

  // Password validation
  PASSWORD: {
    REQUIRED: "Password is required",
    MIN_LENGTH: "Password must be at least 8 characters",
    PATTERN: "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
    CONFIRM_REQUIRED: "Please confirm your password",
    MISMATCH: "Passwords don't match",
  },

  // OTP validation
  OTP: {
    REQUIRED: "OTP is required",
    LENGTH: "OTP must be 6 digits",
    NUMBERS_ONLY: "OTP must contain only numbers",
  },

  // Reset token validation
  RESET_TOKEN: {
    REQUIRED: "Reset token is required",
  },

  // User management validation
  USER: {
    NAME: {
      REQUIRED: "Full name is required",
      MIN_LENGTH: "Name must be at least 2 characters",
      MAX_LENGTH: "Name must be less than 50 characters",
    },
    PHONE: {
      INVALID: "Please enter a valid phone number",
    },
    ROLE: {
      REQUIRED: "Please select a user role",
    },
  },

  // Upload document validation
  UPLOAD_DOCUMENT: {
    // File validation
    FILE: {
      REQUIRED: "Please select a file to upload",
      EMPTY: "File cannot be empty",
      SIZE_LIMIT: "File size must be less than 10MB",
      TYPE_NOT_SUPPORTED: "File type not supported. Please upload PDF, DOC, DOCX, TXT, JPG, PNG, MP4, or MP3 files",
    },

    // Document information
    TITLE: {
      REQUIRED: "Document title is required",
      MAX_LENGTH: "Title must be less than 200 characters",
    },

    DOCUMENT_TYPE: {
      REQUIRED: "Document type is required",
    },

    DOCUMENT_CATEGORY: {
      REQUIRED: "Document category is required",
    },

    CLASSIFICATION_LEVEL: {
      REQUIRED: "Classification level is required",
    },

    ORIGIN: {
      REQUIRED: "Origin is required",
      MAX_LENGTH: "Origin must be less than 100 characters",
    },

    SOURCE: {
      REQUIRED: "Source is required",
      MAX_LENGTH: "Source must be less than 100 characters",
    },

    // Content description
    EXECUTIVE_SUMMARY: {
      REQUIRED: "Executive summary is required",
      MAX_LENGTH: "Executive summary must be less than 500 characters",
    },

    DETAILED_DESCRIPTION: {
      REQUIRED: "Detailed description is required",
      MAX_LENGTH: "Detailed description must be less than 2000 characters",
    },

    // Related topics
    RELATED_TOPICS: {
      MIN_SELECTION: "Please select at least one related topic",
      MAX_SELECTION: "Maximum 10 topics allowed",
    },

    // Severity assessment
    SOURCE_SEVERITY: {
      RANGE: "Source severity must be between 1 and 10",
    },

    REVIEW_SEVERITY: {
      RANGE: "Review severity must be between 1 and 10",
    },
  },

  // Task management validation
  TASK: {
    TITLE: {
      REQUIRED: "Task title is required",
      MIN_LENGTH: "Title must be at least 3 characters",
      MAX_LENGTH: "Title must be less than 100 characters",
    },
    DESCRIPTION: {
      REQUIRED: "Task description is required",
      MIN_LENGTH: "Description must be at least 10 characters",
      MAX_LENGTH: "Description must be less than 1000 characters",
    },
    STATUS: {
      REQUIRED: "Task status is required",
    },
    PRIORITY: {
      REQUIRED: "Task priority is required",
    },
    TYPE: {
      REQUIRED: "Task type is required",
    },
    ESTIMATED_HOURS: {
      MIN_VALUE: "Estimated hours must be greater than 0",
      MAX_VALUE: "Estimated hours must be less than 1000",
      INVALID: "Please enter a valid number for estimated hours",
    },
    DUE_DATE: {
      INVALID: "Please select a valid due date",
      PAST_DATE: "Due date cannot be in the past",
    },
    TAGS: {
      MAX_COUNT: "Maximum 10 tags allowed",
      DUPLICATE: "Tag already exists",
      INVALID_CHARACTERS: "Tags can only contain letters, numbers, and hyphens",
    },
  },
} as const
