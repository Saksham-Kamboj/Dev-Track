// Upload document form options and constants

// Related topics options for upload form
export const UPLOAD_RELATED_TOPICS_OPTIONS = [
  { value: "Political Developments", label: "Political Developments" },
  { value: "Military Operations", label: "Military Operations" },
  { value: "Intelligence", label: "Intelligence" },
  { value: "Terrorism", label: "Terrorism" },
  { value: "Infrastructure", label: "Infrastructure" },
  { value: "Technology", label: "Technology" },
  { value: "Economic", label: "Economic" },
  { value: "Social", label: "Social" },
  { value: "Environmental", label: "Environmental" },
] as const;

// Document type options for upload form
export const UPLOAD_DOCUMENT_TYPE_OPTIONS = [
  { value: "Report", label: "Report" },
  { value: "Memo", label: "Memo" },
  { value: "Analysis", label: "Analysis" },
  { value: "Intelligence", label: "Intelligence" },
  { value: "Assessment", label: "Assessment" },
] as const;

// Document category options for upload form
export const UPLOAD_DOCUMENT_CATEGORY_OPTIONS = [
  { value: "confidential", label: "Confidential" },
  { value: "secret", label: "Secret" },
  { value: "top-secret", label: "Top Secret" },
  { value: "unclassified", label: "Unclassified" },
  { value: "restricted", label: "Restricted" },
] as const;

// Classification level options for upload form
export const UPLOAD_CLASSIFICATION_LEVEL_OPTIONS = [
  { value: "Confidential", label: "Confidential" },
  { value: "Secret", label: "Secret" },
  { value: "Top Secret", label: "Top Secret" },
  { value: "Unclassified", label: "Unclassified" },
  { value: "Restricted", label: "Restricted" },
] as const;

// File upload constants
export const UPLOAD_FILE_CONSTANTS = {
  // File size limits
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB in bytes
  
  // Allowed file types
  ALLOWED_FILE_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "image/jpeg",
    "image/png",
    "video/mp4",
    "audio/mpeg"
  ],
  
  // File extensions for display
  ALLOWED_EXTENSIONS: "PDF, DOC, DOCX, TXT, JPG, PNG, MP4, MP3",
  
  // Default values
  DEFAULT_SOURCE_SEVERITY: 5,
  DEFAULT_REVIEW_SEVERITY: 5,
  
  // Character limits
  TITLE_MAX_LENGTH: 200,
  ORIGIN_MAX_LENGTH: 100,
  SOURCE_MAX_LENGTH: 100,
  EXECUTIVE_SUMMARY_MAX_LENGTH: 500,
  DETAILED_DESCRIPTION_MAX_LENGTH: 2000,
  
  // Topic limits
  MIN_TOPICS: 1,
  MAX_TOPICS: 10,
  
  // Severity range
  MIN_SEVERITY: 1,
  MAX_SEVERITY: 10,
} as const;

// Upload document form messages
export const UPLOAD_DOCUMENT_MESSAGES = {
  SUCCESS: {
    UPLOAD_SUCCESS: "Document uploaded successfully!",
  },
  
  ERROR: {
    UPLOAD_FAILED: "Failed to upload document",
    UNEXPECTED_ERROR: "An unexpected error occurred",
  },
  
  LOADING: {
    UPLOADING: "Uploading...",
  },
  
  PLACEHOLDERS: {
    DOCUMENT_TITLE: "Enter document title",
    SELECT_DOCUMENT_TYPE: "Select document type",
    SELECT_DOCUMENT_CATEGORY: "Select document category",
    SELECT_CLASSIFICATION_LEVEL: "Select classification level",
    ORIGIN_EXAMPLE: "e.g., Intelligence Division",
    SOURCE_EXAMPLE: "e.g., Field Operations",
    EXECUTIVE_SUMMARY: "Provide a brief executive summary of the document content...",
    DETAILED_DESCRIPTION: "Provide a detailed description of the document content, analysis, and key findings...",
  },
  
  LABELS: {
    DOCUMENT_FILE: "Document File",
    DOCUMENT_TITLE: "Document Title",
    DOCUMENT_TYPE: "Document Type",
    DOCUMENT_CATEGORY: "Document Category",
    CLASSIFICATION_LEVEL: "Classification Level",
    ORIGIN: "Origin",
    SOURCE: "Source",
    EXECUTIVE_SUMMARY: "Executive Summary",
    DETAILED_DESCRIPTION: "Detailed Description",
    AVAILABLE_TOPICS: "Available Topics",
    SELECTED_TOPICS: "Selected Topics",
    SOURCE_SEVERITY: "Source Severity (1-10)",
    REVIEW_SEVERITY: "Review Severity (1-10)",
  },
  
  DESCRIPTIONS: {
    FILE_UPLOAD: "Drag and drop or click to browse",
    FILE_SUPPORT: "Supports: PDF, DOC, DOCX, TXT, JPG, PNG, MP4, MP3 (Max 10MB)",
    SEVERITY_LOW: "Low (1)",
    SEVERITY_HIGH: "High (10)",
  },
  
  BUTTONS: {
    BROWSE_FILES: "Browse Files",
    REMOVE_FILE: "Remove File",
    CANCEL: "Cancel",
    UPLOAD_DOCUMENT: "Upload Document",
  },
} as const;
