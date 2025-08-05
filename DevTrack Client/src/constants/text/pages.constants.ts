export const PAGE_TEXTS = {
  // User Management Page
  USER_MANAGEMENT: {
    TITLE: "User Management",
    DESCRIPTION: "Manage users and their permissions efficiently",
  },

  // User Management Page
  DOCUMENT_MANAGEMENT: {
    TITLE: "Document Management",
    DESCRIPTION: "Manage documents and their permissions efficiently",
  },

  // Document View Page
  DOCUMENT_VIEW: {
    TITLE: "Document Details",
    DESCRIPTION: "View document information and metadata",
    BACK_TO_DOCUMENTS: "Back to Documents",
    DOCUMENT_NOT_FOUND: "Document Not Found",
    DOCUMENT_NOT_FOUND_DESCRIPTION: "The document you're looking for doesn't exist or has been removed.",
    ACTIONS: {
      DOWNLOAD: "Download",
      EDIT: "Edit",
      SHARE: "Share",
      ARCHIVE: "Archive",
    },
    SECTIONS: {
      OVERVIEW: "Document Overview",
      EXECUTIVE_SUMMARY: "Executive Summary",
      DETAILED_DESCRIPTION: "Detailed Description",
      RELATED_TOPICS: "Related Topics",
      SEVERITY_ASSESSMENT: "Severity Assessment",
      FILE_INFORMATION: "File Information",
    },
    FIELDS: {
      UPLOAD_DATE: "Upload Date",
      CREATOR: "Creator",
      ORIGIN: "Origin",
      SOURCE: "Source",
      DOCUMENT_TYPE: "Document Type",
      CATEGORY: "Category",
      ORIGINAL_NAME: "Original Name",
      FILE_SIZE: "File Size",
      CONTENT_TYPE: "Content Type",
      FILE_EXTENSION: "File Extension",
      SOURCE_SEVERITY: "Source Severity",
      REVIEW_SEVERITY: "Review Severity",
    },
  },

  // Upload Document Page
  UPLOAD_DOCUMENT: {
    TITLE: "Upload Document",
    DESCRIPTION: "Upload and classify a new document for the intelligence system",
    FILE_UPLOAD: {
      TITLE: "File Upload",
      DESCRIPTION: "Select a document file to upload (PDF, DOC, DOCX, TXT, JPG, PNG, MP4, MP3)",
      LABEL: "Document File",
    },
    DOCUMENT_INFO: {
      TITLE: "Document Information",
      DESCRIPTION: "Provide basic information about the document",
    },
    CLASSIFICATION: {
      TITLE: "Classification & Security",
      DESCRIPTION: "Set the security classification and category for this document",
    },
    CONTENT_DESCRIPTION: {
      TITLE: "Content Description",
      DESCRIPTION: "Provide detailed information about the document content",
    },
    RELATED_TOPICS: {
      TITLE: "Related Topics",
      DESCRIPTION: "Select topics that are relevant to this document (minimum 1, maximum 10)",
    },
    SEVERITY_ASSESSMENT: {
      TITLE: "Severity Assessment",
      DESCRIPTION: "Rate the severity levels for source reliability and review priority (1-10 scale)",
    },
  },


  // User Management Page
  AI_GENERATED_REPORT: {
    TITLE: "AI Generated Report",
    DESCRIPTION: "Manage and view AI-generated intelligence reports",
  },

  // Ad-hoc Report Page
  AD_HOC_REPORT: {
    TITLE: "Ad-hoc Reports",
    DESCRIPTION: "Manage and track manually created reports and investigations",
  },

  // Ad-hoc Report View Page
  AD_HOC_REPORT_VIEW: {
    TITLE: "Ad-hoc Report Details",
    DESCRIPTION: "View detailed information about manually created report",
    REPORT_NOT_FOUND: "Report Not Found",
    REPORT_NOT_FOUND_DESCRIPTION: "The ad-hoc report you're looking for doesn't exist or has been removed.",
    BACK_TO_REPORTS: "Back to Reports",
    ACTIONS: {
      DOWNLOAD: "Download",
      EDIT: "Edit",
      SHARE: "Share",
      ARCHIVE: "Archive",
      EXPORT: "Export",
      ASSIGN: "Assign",
    },
    FIELDS: {
      CREATED_DATE: "Created Date",
      DEADLINE: "Deadline",
      CREATED_BY: "Created By",
      ASSIGNED_TO: "Assigned To",
      REQUESTED_BY: "Requested By",
      DEPARTMENT: "Department",
      REPORT_TYPE: "Report Type",
      CLASSIFICATION: "Classification",
      PRIORITY: "Priority",
      FILE_SIZE: "File Size",
      PAGE_COUNT: "Page Count",
      STATUS: "Status",
      ESTIMATED_HOURS: "Estimated Hours",
      ACTUAL_HOURS: "Actual Hours",
      COMPLETION: "Completion",
    },
    SECTIONS: {
      REPORT_OVERVIEW: "Report Overview",
      EXECUTIVE_SUMMARY: "Executive Summary",
      CONTENT_PREVIEW: "Content Preview",
      SOURCE_DOCUMENTS: "Source Documents",
      KEYWORDS: "Keywords",
      ASSIGNMENT_INFO: "Assignment Information",
      PROGRESS_INFO: "Progress Information",
    },
    MESSAGES: {
      REPORT_NOT_FOUND: "Ad-hoc report not found",
      NO_REPORT_ID: "No report ID provided",
      FETCH_ERROR: "Failed to load ad-hoc report",
      DOWNLOAD_ERROR: "Failed to download ad-hoc report",
      DOWNLOAD_SUCCESS: "downloaded successfully!",
      EDITING: "Opening editor for",
      SHARE_SUCCESS: "Share link copied to clipboard!",
      SHARE_FALLBACK: "Share link:",
      ARCHIVE_SUCCESS: "archived successfully",
      EXPORT_COMING_SOON: "Export functionality for",
      ASSIGN_COMING_SOON: "Assignment functionality for",
    },
    UNITS: {
      PAGES: "pages",
      MEGABYTES: "MB",
      PERCENTAGE: "%",
      HOURS: "hours",
    },
  },

  // AI Generated Report View Page
  AI_REPORT_VIEW: {
    TITLE: "AI Generated Report Details",
    DESCRIPTION: "View detailed information about AI-generated intelligence report",
    REPORT_NOT_FOUND: "Report Not Found",
    REPORT_NOT_FOUND_DESCRIPTION: "The AI report you're looking for doesn't exist or has been removed.",
    BACK_TO_REPORTS: "Back to Reports",
    ACTIONS: {
      DOWNLOAD: "Download",
      REGENERATE: "Regenerate",
      SHARE: "Share",
      ARCHIVE: "Archive",
      EXPORT: "Export",
    },
    FIELDS: {
      GENERATED_DATE: "Generated Date",
      AI_MODEL: "AI Model",
      CONFIDENCE_SCORE: "Confidence Score",
      GENERATED_BY: "Generated By",
      REPORT_TYPE: "Report Type",
      CLASSIFICATION: "Classification",
      PRIORITY: "Priority",
      FILE_SIZE: "File Size",
      PAGE_COUNT: "Page Count",
      STATUS: "Status",
    },
    SECTIONS: {
      REPORT_OVERVIEW: "Report Overview",
      EXECUTIVE_SUMMARY: "Executive Summary",
      CONTENT_PREVIEW: "Content Preview",
      SOURCE_DOCUMENTS: "Source Documents",
      KEYWORDS: "Keywords",
      AI_ANALYSIS: "AI Analysis Details",
      GENERATION_INFO: "Generation Information",
    },
    CONFIDENCE_LEVELS: {
      EXCELLENT: "Excellent",
      GOOD: "Good",
      FAIR: "Fair",
      LOW: "Low",
      NOT_AVAILABLE: "N/A",
    },
    UNITS: {
      PAGES: "pages",
      MEGABYTES: "MB",
      PERCENTAGE: "%",
    },
    GENERATION_FIELDS: {
      REPORT_TYPE: "Report Type",
      CATEGORY: "Category",
      CREATED_AT: "Created At",
      LAST_UPDATED: "Last Updated",
    },
    MESSAGES: {
      REPORT_NOT_FOUND: "AI report not found",
      NO_REPORT_ID: "No report ID provided",
      FETCH_ERROR: "Failed to load AI report",
      DOWNLOAD_ERROR: "Failed to download AI report",
      DOWNLOAD_SUCCESS: "downloaded successfully!",
      REGENERATING: "Regenerating",
      SHARE_SUCCESS: "Share link copied to clipboard!",
      SHARE_FALLBACK: "Share link:",
      ARCHIVE_SUCCESS: "archived successfully",
      EXPORT_COMING_SOON: "Export functionality for",
    },
  },

  // Not Found Page
  NOT_FOUND: {
    TITLE: "Oops! Page Not Found",
    DESCRIPTION: "The page you're looking for doesn't exist or has been moved. Let's get you back on track!",
    GO_TO_DASHBOARD: "Go to Dashboard",
    GO_BACK: "Go Back",
    SUPPORT_TEXT: "If you believe this is an error, please contact support.",
  },



  // Dashboard Pages
  ADMIN_DASHBOARD: {
    TITLE: "Admin Dashboard",
    DESCRIPTION: "Overview of system administration",
  },

  DEVELOPER_DASHBOARD: {
    TITLE: "Developer Dashboard",
    DESCRIPTION: "Manage your tasks and projects",
  },
} as const
