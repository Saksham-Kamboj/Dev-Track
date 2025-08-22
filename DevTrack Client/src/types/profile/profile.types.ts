// Profile data interface
export interface ProfileData {
  id: string;
  name: string;
  email: string;
  role: "admin" | "developer";
  phone: string;
  bio: string;
  avatar: string | null;
  status: "active" | "inactive";
  joinDate: string;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

// Profile form data interface (for form state)
export interface ProfileFormData {
  name: string;
  phone?: string;
  bio?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

// Profile update request interface
export interface ProfileUpdateRequest {
  name: string;
  phone?: string;
  bio?: string;
  currentPassword?: string;
  newPassword?: string;
}

// Profile API response interfaces
export interface ProfileResponse {
  success: boolean;
  user: ProfileData;
}

export interface ProfileUpdateResponse {
  success: boolean;
  message: string;
  user: ProfileData;
}

export interface ProfileImageUploadResponse {
  success: boolean;
  message: string;
  imageUrl: string;
  avatar: string;
}

export interface ProfileImageDeleteResponse {
  success: boolean;
  message: string;
}

// Profile state interface for Redux
export interface ProfileState {
  profile: ProfileData | null;
  loading: boolean;
  error: string | null;
  uploadingImage: boolean;
  imageUploadError: string | null;
}

// Profile controller response interface
export interface ProfileControllerResponse {
  getters: {
    profile: ProfileData | null;
    formData: ProfileFormData;
    errors: Record<string, { message?: string }>;
    isLoading: boolean;
    isSubmitting: boolean;
    uploadingImage: boolean;
    imageUploadError: string | null;
    showPasswordFields: boolean;
  };
  handlers: {
    onInputChange: (field: keyof ProfileFormData, value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onImageUpload: (file: File) => void;
    onImageDelete: () => void;
    onTogglePasswordFields: () => void;
    onCancel: () => void;
  };
}
