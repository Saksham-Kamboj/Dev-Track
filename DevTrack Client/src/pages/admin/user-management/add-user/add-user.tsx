import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNavigate } from "react-router-dom"
import { PAGE_ROUTES } from "@/constants"
import { useAddUserController } from "./add-user.controller"

const AddUser = () => {
    const navigate = useNavigate()
    const controller = useAddUserController()
    const { getters, handlers } = controller

    const handleBack = () => {
        navigate(PAGE_ROUTES.ADMIN.USER_MANAGEMENT)
    }

    return (
        <div className="space-y-6 mt-2">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Add New User</h1>
                <p className="text-muted-foreground">Create a new user account with appropriate permissions</p>
            </div>

            {/* Add User Form */}
            <Card className="">
                <CardHeader>
                    <CardTitle>User Information</CardTitle>
                    <CardDescription>
                        Fill in the details below to create a new user account
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
                                    value={getters.formData.role}
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

                        {/* Account Settings */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password *</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={getters.formData.password}
                                    onChange={(e) => handlers.onInputChange("password", e.target.value)}
                                    placeholder="Enter password"
                                    required
                                    autoComplete="new-password"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    style={{
                                        backgroundColor: 'transparent !important',
                                        backgroundImage: 'none !important',
                                        transition: 'background-color 5000s ease-in-out 0s'
                                    }}
                                />
                                {getters.errors.password && (
                                    <p className="text-sm text-destructive">{getters.errors.password.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={getters.formData.confirmPassword}
                                    onChange={(e) => handlers.onInputChange("confirmPassword", e.target.value)}
                                    placeholder="Confirm password"
                                    required
                                    autoComplete="new-password"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    style={{
                                        backgroundColor: 'transparent !important',
                                        backgroundImage: 'none !important',
                                        transition: 'background-color 5000s ease-in-out 0s'
                                    }}
                                />
                                {getters.errors.confirmPassword && (
                                    <p className="text-sm text-destructive">{getters.errors.confirmPassword.message}</p>
                                )}
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
                                {getters.isSubmitting ? "Creating User..." : "Create User"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default AddUser
