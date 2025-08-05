import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { PAGE_ROUTES } from "@/constants"
import { useEditUserController } from "./edit-user.controller"

const EditUser = () => {
  const navigate = useNavigate()
  const { getters, handlers } = useEditUserController()

  const handleBack = () => {
    navigate(PAGE_ROUTES.ADMIN.USER_MANAGEMENT)
  }

  if (getters.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading user data...</span>
        </div>
      </div>
    )
  }

  if (!getters.user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">User Not Found</h2>
          <p className="text-muted-foreground mb-4">The user you're looking for doesn't exist.</p>
          <Button onClick={handleBack} variant="outline">
            Back to User Management
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 mt-2">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit User</h1>
        <p className="text-muted-foreground">Update user information and account status</p>
      </div>

      {/* Edit User Form */}
      <Card className="">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>
            Update the user's details and account status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlers.onSubmit} className="space-y-6" autoComplete="off">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={getters.formData.name}
                  onChange={(e) => handlers.onInputChange("name", e.target.value)}
                  placeholder="Enter full name"
                  required
                  autoComplete="off"
                />
                {getters.errors.name && (
                  <p className="text-sm text-destructive">{getters.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={getters.formData.email}
                  onChange={(e) => handlers.onInputChange("email", e.target.value)}
                  placeholder="Enter email address"
                  required
                  autoComplete="new-email"
                  autoCorrect="off"
                  autoCapitalize="off"
                  style={{
                    backgroundColor: 'transparent !important',
                    backgroundImage: 'none !important',
                    transition: 'background-color 5000s ease-in-out 0s'
                  }}
                />
                {getters.errors.email && (
                  <p className="text-sm text-destructive">{getters.errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={getters.formData.phone || ""}
                  onChange={(e) => handlers.onInputChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                  autoComplete="off"
                />
                {getters.errors.phone && (
                  <p className="text-sm text-destructive">{getters.errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={getters.formData.role || ""}
                  onValueChange={handlers.onRoleChange}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select user role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                  </SelectContent>
                </Select>
                {getters.errors.role && (
                  <p className="text-sm text-destructive">{getters.errors.role.message}</p>
                )}
              </div>
            </div>

            {/* Account Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Account Status *</Label>
                <Select
                  value={getters.formData.status || "active"}
                  onValueChange={handlers.onStatusChange}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select account status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        Active
                      </div>
                    </SelectItem>
                    <SelectItem value="inactive">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full" />
                        Inactive
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {getters.errors.status && (
                  <p className="text-sm text-destructive">{getters.errors.status.message}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Inactive users cannot log in to the system
                </p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={getters.isSubmitting}
                className="text-white"
              >
                {getters.isSubmitting ? "Updating User..." : "Update User"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditUser