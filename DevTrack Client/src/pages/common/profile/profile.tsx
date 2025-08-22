import React, { useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  Camera,
} from "lucide-react";
import { useProfileController } from "./profile.controller";

const Profile: React.FC = () => {
  const { getters, handlers } = useProfileController();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handlers.onImageUpload(file);
    }
    // Reset input value to allow selecting the same file again
    event.target.value = "";
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  if (getters.isLoading && !getters.profile) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!getters.profile) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-muted-foreground">Profile not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="relative mx-auto">
              <Avatar className="h-24 w-24 mx-auto">
                <AvatarImage
                  src={getters.profile.avatar || undefined}
                  alt={getters.profile.name}
                />
                <AvatarFallback className="text-lg">
                  {getters.profile.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Image upload/delete buttons */}
              <div className="absolute -bottom-2 -right-2 flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={triggerFileSelect}
                  disabled={getters.uploadingImage}
                >
                  {getters.uploadingImage ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b border-current" />
                  ) : (
                    <Camera className="h-3 w-3" />
                  )}
                </Button>

                {getters.profile.avatar && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 rounded-full"
                    onClick={handlers.onImageDelete}
                    disabled={getters.uploadingImage}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            <div className="space-y-2">
              <CardTitle className="text-xl">{getters.profile.name}</CardTitle>
              <Badge
                variant={
                  getters.profile.role === "admin" ? "default" : "secondary"
                }
              >
                {getters.profile.role.charAt(0).toUpperCase() +
                  getters.profile.role.slice(1)}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{getters.profile.email}</span>
            </div>

            {getters.profile.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{getters.profile.phone}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Joined {getters.profile.joinDate}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <Badge
                variant={
                  getters.profile.status === "active" ? "default" : "secondary"
                }
              >
                {getters.profile.status}
              </Badge>
            </div>

            {getters.profile.bio && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium mb-1">Bio</p>
                  <p className="text-sm text-muted-foreground">
                    {getters.profile.bio}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>
              Update your personal information and account settings
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handlers.onSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={getters.formData.name}
                      onChange={(e) =>
                        handlers.onInputChange("name", e.target.value)
                      }
                      placeholder="Enter your full name"
                      disabled={getters.isSubmitting}
                    />
                    {getters.errors.name && (
                      <p className="text-sm text-destructive">
                        {getters.errors.name.message || "Invalid name"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={getters.formData.phone || ""}
                      onChange={(e) =>
                        handlers.onInputChange("phone", e.target.value)
                      }
                      placeholder="Enter your phone number"
                      disabled={getters.isSubmitting}
                    />
                    {getters.errors.phone && (
                      <p className="text-sm text-destructive">
                        {getters.errors.phone.message || "Invalid phone number"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={getters.formData.bio || ""}
                    onChange={(e) =>
                      handlers.onInputChange("bio", e.target.value)
                    }
                    placeholder="Tell us about yourself..."
                    rows={3}
                    disabled={getters.isSubmitting}
                  />
                  <p className="text-xs text-muted-foreground">
                    {(getters.formData.bio || "").length}/500 characters
                  </p>
                  {getters.errors.bio && (
                    <p className="text-sm text-destructive">
                      {getters.errors.bio.message || "Invalid bio"}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Password Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Password</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handlers.onTogglePasswordFields}
                  >
                    {getters.showPasswordFields ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Change Password
                      </>
                    )}
                  </Button>
                </div>

                {getters.showPasswordFields && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={getters.formData.currentPassword || ""}
                        onChange={(e) =>
                          handlers.onInputChange(
                            "currentPassword",
                            e.target.value
                          )
                        }
                        placeholder="Enter current password"
                        disabled={getters.isSubmitting}
                      />
                      {getters.errors.currentPassword && (
                        <p className="text-sm text-destructive">
                          {getters.errors.currentPassword.message ||
                            "Invalid current password"}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={getters.formData.newPassword || ""}
                        onChange={(e) =>
                          handlers.onInputChange("newPassword", e.target.value)
                        }
                        placeholder="Enter new password"
                        disabled={getters.isSubmitting}
                      />
                      {getters.errors.newPassword && (
                        <p className="text-sm text-destructive">
                          {getters.errors.newPassword.message ||
                            "Invalid new password"}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={getters.formData.confirmPassword || ""}
                        onChange={(e) =>
                          handlers.onInputChange(
                            "confirmPassword",
                            e.target.value
                          )
                        }
                        placeholder="Confirm new password"
                        disabled={getters.isSubmitting}
                      />
                      {getters.errors.confirmPassword && (
                        <p className="text-sm text-destructive">
                          {getters.errors.confirmPassword.message ||
                            "Invalid password confirmation"}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex items-center gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={getters.isSubmitting || getters.isLoading}
                  className="min-w-[120px]"
                >
                  {getters.isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b border-current mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handlers.onCancel}
                  disabled={getters.isSubmitting}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
