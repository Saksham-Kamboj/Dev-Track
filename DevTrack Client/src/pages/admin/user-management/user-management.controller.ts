import { useState, useCallback, useMemo, useEffect } from "react"
import { useDataTableController } from "@/components/common/table/controllers/data-table.controller"
import { userColumns } from "./user-columns"
import { USER_ROLE_OPTIONS, USER_STATUS_OPTIONS } from "../../../types/admin/user-management.types"
import type {
  UserData,
  UserManagementControllerConfig,
  UserManagementControllerResponse
} from "../../../types/admin/user-management.types"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { getAllUsers, deleteUser } from "@/redux/thunks/admin.thunks"

import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { PAGE_ROUTES } from "@/constants"

/**
 * UserManagement controller hook following the established controller pattern
 * Consolidates all user management functionality in a single controller
 */
export const useUserManagementController = (
  _initialData: UserData[] = [], // Unused but kept for API compatibility
  config: UserManagementControllerConfig = {}
): UserManagementControllerResponse => {
  const {
    title: initialTitle = "User Management",
    description: initialDescription = "Manage users and their permissions efficiently",
    showCheckboxes = true,
    onUserClick,
    onAddUser,
    onUserEdit,
    onUserDelete,
    onUserActivate,
    onUserDeactivate,
    onTitleChange,
    onDescriptionChange
  } = config

  // Redux integration
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { users } = useAppSelector((state) => state.admin)

  // Local state for title and description
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)

  // Smart data fetching - only fetch if we don't have users data
  useEffect(() => {
    // Only fetch if we don't have users data (caching)
    if (users.length === 0) {
      dispatch(getAllUsers())
    }
  }, [dispatch, users.length])

  // Use data table controller with user-specific configuration
  // Use users from Redux (fetched from API)
  const usersData = users || []

  const dataTableController = useDataTableController(
    usersData,
    userColumns,
    {
      showCheckboxes,
      showStatusFilter: false,
      showPriorityFilter: false,
      showPagination: true,
      showSearch: true,
      pageSize: config.pageSize || 10
    }
  )

  // Calculate role options with counts
  const roleOptions = useMemo(() => {
    if (dataTableController.getters.filteredData.length === 0) {
      return USER_ROLE_OPTIONS.map(option => ({ ...option, count: 0 }))
    }

    const roleCounts = dataTableController.getters.filteredData.reduce((acc: Record<string, number>, user: UserData) => {
      acc[user.role] = (acc[user.role] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return USER_ROLE_OPTIONS.map(option => ({
      value: option.value,
      label: option.label,
      count: roleCounts[option.value] || 0
    }))
  }, [dataTableController.getters.filteredData])

  // Calculate user status options with counts
  const userStatusOptions = useMemo(() => {
    if (dataTableController.getters.filteredData.length === 0) {
      return USER_STATUS_OPTIONS.map(option => ({ ...option, count: 0 }))
    }

    const statusCounts = dataTableController.getters.filteredData.reduce((acc: Record<string, number>, user: UserData) => {
      acc[user.status] = (acc[user.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return USER_STATUS_OPTIONS.map(option => ({
      value: option.value,
      label: option.label,
      count: statusCounts[option.value] || 0
    }))
  }, [dataTableController.getters.filteredData])

  // Get selected filter values
  const selectedRoles = useMemo(() => {
    const roleFilter = dataTableController.getters.filters.role
    return Array.isArray(roleFilter) ? roleFilter : []
  }, [dataTableController.getters.filters.role])

  const selectedUserStatuses = useMemo(() => {
    const statusFilter = dataTableController.getters.filters.status
    return Array.isArray(statusFilter) ? statusFilter : []
  }, [dataTableController.getters.filters.status])

  // Enhanced handlers for user management
  const handleTitleChange = useCallback((newTitle: string) => {
    setTitle(newTitle)
    if (onTitleChange) {
      onTitleChange(newTitle)
    }
  }, [onTitleChange])

  // Handle add user click
  const handleAddUser = useCallback(() => {
    if (onAddUser) {
      onAddUser()
    } else {
      navigate(PAGE_ROUTES.ADMIN.USER_MANAGEMENT_ADD_USER)
    }
  }, [onAddUser])

  const handleDescriptionChange = useCallback((newDescription: string) => {
    setDescription(newDescription)
    if (onDescriptionChange) {
      onDescriptionChange(newDescription)
    }
  }, [onDescriptionChange])

  // Default user management handlers - can be overridden by config
  const handleUserClick = useCallback((user: UserData) => {
    if (onUserClick) {
      onUserClick(user)
    } else {
      toast.success(`User ${user.name} clicked!`)
    }
  }, [onUserClick])

  const handleUserEdit = useCallback((user: UserData) => {
    if (onUserEdit) {
      onUserEdit(user)
    } else {
      // Default behavior: navigate to edit user page
      const editRoute = PAGE_ROUTES.ADMIN.USER_MANAGEMENT_EDIT_USER.replace(':id', user.id)
      navigate(editRoute)
    }
  }, [onUserEdit, navigate])

  const handleUserDelete = useCallback(async (user: UserData) => {
    if (onUserDelete) {
      onUserDelete(user)
    } else {
      try {
        const result = await dispatch(deleteUser(user.id))
        if (deleteUser.fulfilled.match(result)) {
          toast.success(`User ${user.name} deleted successfully!`)
        } else {
          toast.error(result.payload || 'Failed to delete user')
        }
      } catch (error) {
        toast.error('Failed to delete user')
      }
    }
  }, [onUserDelete, dispatch])

  const handleUserActivate = useCallback((user: UserData) => {
    if (onUserActivate) {
      onUserActivate(user)
    } else {
      toast.success(`User ${user.name} activated successfully!`)
    }
  }, [onUserActivate])

  const handleUserDeactivate = useCallback((user: UserData) => {
    if (onUserDeactivate) {
      onUserDeactivate(user)
    } else {
      toast.success(`User ${user.name} deactivated successfully!`)
    }
  }, [onUserDeactivate])

  // User-specific filter handlers
  const handleRoleFilter = useCallback((values: string[]) => {
    dataTableController.handlers.onFilter('role', values)
  }, [dataTableController.handlers])

  const handleUserStatusFilter = useCallback((values: string[]) => {
    dataTableController.handlers.onFilter('status', values)
  }, [dataTableController.handlers])



  return {
    getters: {
      ...dataTableController.getters,
      title,
      description,
      showCheckboxes,
      roleOptions,
      userStatusOptions,
      selectedRoles,
      selectedUserStatuses
    },
    handlers: {
      ...dataTableController.handlers,
      onUserClick: handleUserClick,
      onAddUser: handleAddUser,
      onUserEdit: handleUserEdit,
      onUserDelete: handleUserDelete,
      onUserActivate: handleUserActivate,
      onUserDeactivate: handleUserDeactivate,
      onTitleChange: handleTitleChange,
      onDescriptionChange: handleDescriptionChange,
      onRoleFilter: handleRoleFilter,
      onUserStatusFilter: handleUserStatusFilter
    }
  }
}
