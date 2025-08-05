import { useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "@/redux/hooks"
import { createUser } from "@/redux/thunks/admin.thunks"
import { toast } from "sonner"
import { PAGE_ROUTES } from "@/constants"

import type { AddUserFormValues } from "@/validation"
import { addUserFormSchema } from "@/validation"

// Controller response interface
interface AddUserControllerResponse {
    getters: {
        formData: AddUserFormValues
        errors: any
        isSubmitting: boolean
    }
    handlers: {
        onInputChange: (name: keyof AddUserFormValues, value: string) => void
        onRoleChange: (value: string) => void
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
    }
}

/**
 * Add User controller hook following the established controller pattern
 * Handles form state, validation, and submission for adding new users
 */
export const useAddUserController = (): AddUserControllerResponse => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    // React Hook Form with Zod validation
    const {
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        setValue,
    } = useForm<AddUserFormValues>({
        resolver: zodResolver(addUserFormSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            role: "",
            password: "",
            confirmPassword: "",
        },
    })

    // Watch all form values
    const formData = watch()

    // Input change handler
    const handleInputChange = useCallback((name: keyof AddUserFormValues, value: string) => {
        setValue(name, value, { shouldValidate: true })
    }, [setValue])

    // Role change handler
    const handleRoleChange = useCallback((value: string) => {
        setValue("role", value, { shouldValidate: true })
    }, [setValue])



    // Form submission handler
    const onSubmit = useCallback(async (data: AddUserFormValues) => {
        try {
            // Prepare user data for API
            const userData = {
                name: data.name.trim(),
                email: data.email.trim().toLowerCase(),
                password: data.password,
                role: data.role,
                phone: data.phone?.trim() || undefined,
            }

            // Create user via API
            const result = await dispatch(createUser(userData))

            if (createUser.fulfilled.match(result)) {
                const response = result.payload
                if (response.success) {
                    toast.success(response.message || `User ${userData.name} has been created successfully!`)
                    navigate(PAGE_ROUTES.ADMIN.USER_MANAGEMENT)
                } else {
                    toast.error(response.message || "Failed to create user")
                }
            } else if (createUser.rejected.match(result)) {
                toast.error(result.payload || "Failed to create user")
            }

        } catch (error) {
            console.error("Error creating user:", error)
            toast.error("Failed to create user. Please try again.")
        }
    }, [dispatch, navigate])

    return {
        getters: {
            formData,
            errors,
            isSubmitting
        },
        handlers: {
            onInputChange: handleInputChange,
            onRoleChange: handleRoleChange,
            onSubmit: handleSubmit(onSubmit)
        }
    }
}
