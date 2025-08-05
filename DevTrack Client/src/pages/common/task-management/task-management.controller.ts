import { useCallback, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { toast } from "sonner"

import type { TaskData } from "@/types/task/task.types"
import { getAllTasks, deleteTask } from "@/redux/thunks/task.thunks"
import { setFilters, clearFilters } from "@/redux/slices/taskSlice"
import { PAGE_ROUTES, PAGE_TEXTS } from "@/constants"

interface TaskManagementControllerResponse {
  getters: {
    title: string
    description: string
    tasks: TaskData[]
    loading: boolean
    error: string | null
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    } | null
    filters: {
      status: string[]
      priority: string[]
      type: string[]
      search: string
      assignedTo?: string
    }
  }
  handlers: {
    onCreateTask: () => void
    onEditTask: (task: TaskData) => void
    onDeleteTask: (taskId: string) => void
    onViewTask: (task: TaskData) => void
    onSearchChange: (search: string) => void
    onStatusFilter: (statuses: string[]) => void
    onPriorityFilter: (priorities: string[]) => void
    onTypeFilter: (types: string[]) => void
    onClearFilters: () => void
    onPageChange: (page: number) => void
  }
}

export const useTaskManagementController = (): TaskManagementControllerResponse => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { tasks, loading, error, pagination, filters, isInitialized } = useAppSelector((state) => state.tasks)

  // Debounce timer ref for search
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Load tasks only once when component mounts
  useEffect(() => {
    if (!isInitialized && !loading) {
      dispatch(getAllTasks({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      }))
    }
  }, [dispatch, isInitialized, loading])

  // Cleanup search timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  // Create task handler
  const handleCreateTask = useCallback(() => {
    navigate(PAGE_ROUTES.DEVELOPER.TASK.UPLOAD)
  }, [navigate])

  // Edit task handler
  const handleEditTask = useCallback((task: TaskData) => {
    navigate(PAGE_ROUTES.DEVELOPER.TASK.EDIT.replace(":id", task.id))
  }, [navigate])

  // Delete task handler
  const handleDeleteTask = useCallback(async (taskId: string) => {
    try {
      const result = await dispatch(deleteTask(taskId))
      if (deleteTask.fulfilled.match(result)) {
        toast.success('Task deleted successfully!')
      }
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }, [dispatch])

  // View task handler
  const handleViewTask = useCallback((task: TaskData) => {
    navigate(PAGE_ROUTES.DEVELOPER.TASK.VIEW.replace(":id", task.id))
  }, [navigate])

  // Filter handlers with automatic data refresh
  const handleSearchChange = useCallback((search: string) => {
    dispatch(setFilters({ search }))

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Debounce search API call by 500ms
    searchTimeoutRef.current = setTimeout(() => {
      dispatch(getAllTasks({
        page: 1, // Reset to first page when searching
        limit: pagination?.limit || 10,
        search: search || undefined,
        status: filters.status.length > 0 ? filters.status as any : undefined,
        priority: filters.priority.length > 0 ? filters.priority as any : undefined,
        type: filters.type.length > 0 ? filters.type as any : undefined,
        assignedTo: filters.assignedTo || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      }))
    }, 500)
  }, [dispatch, pagination?.limit, filters])

  const handleStatusFilter = useCallback((statuses: string[]) => {
    dispatch(setFilters({ status: statuses }))
    // Trigger new API call with updated filters
    dispatch(getAllTasks({
      page: 1, // Reset to first page when filtering
      limit: pagination?.limit || 10,
      search: filters.search || undefined,
      status: statuses.length > 0 ? statuses as any : undefined,
      priority: filters.priority.length > 0 ? filters.priority as any : undefined,
      type: filters.type.length > 0 ? filters.type as any : undefined,
      assignedTo: filters.assignedTo || undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }))
  }, [dispatch, pagination?.limit, filters])

  const handlePriorityFilter = useCallback((priorities: string[]) => {
    dispatch(setFilters({ priority: priorities }))
    // Trigger new API call with updated filters
    dispatch(getAllTasks({
      page: 1, // Reset to first page when filtering
      limit: pagination?.limit || 10,
      search: filters.search || undefined,
      status: filters.status.length > 0 ? filters.status as any : undefined,
      priority: priorities.length > 0 ? priorities as any : undefined,
      type: filters.type.length > 0 ? filters.type as any : undefined,
      assignedTo: filters.assignedTo || undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }))
  }, [dispatch, pagination?.limit, filters])

  const handleTypeFilter = useCallback((types: string[]) => {
    dispatch(setFilters({ type: types }))
    // Trigger new API call with updated filters
    dispatch(getAllTasks({
      page: 1, // Reset to first page when filtering
      limit: pagination?.limit || 10,
      search: filters.search || undefined,
      status: filters.status.length > 0 ? filters.status as any : undefined,
      priority: filters.priority.length > 0 ? filters.priority as any : undefined,
      type: types.length > 0 ? types as any : undefined,
      assignedTo: filters.assignedTo || undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }))
  }, [dispatch, pagination?.limit, filters])

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters())
    // Trigger new API call with cleared filters
    dispatch(getAllTasks({
      page: 1,
      limit: pagination?.limit || 10,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }))
  }, [dispatch, pagination?.limit])

  const handlePageChange = useCallback((page: number) => {
    dispatch(getAllTasks({
      page,
      limit: pagination?.limit || 10,
      search: filters.search || undefined,
      status: filters.status.length > 0 ? filters.status as any : undefined,
      priority: filters.priority.length > 0 ? filters.priority as any : undefined,
      type: filters.type.length > 0 ? filters.type as any : undefined,
      assignedTo: filters.assignedTo || undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }))
  }, [dispatch, pagination?.limit, filters])

  return {
    getters: {
      title: PAGE_TEXTS.TASK_MANAGEMENT.TITLE,
      description: PAGE_TEXTS.TASK_MANAGEMENT.DESCRIPTION,
      tasks,
      loading,
      error,
      pagination,
      filters
    },
    handlers: {
      onCreateTask: handleCreateTask,
      onEditTask: handleEditTask,
      onDeleteTask: handleDeleteTask,
      onViewTask: handleViewTask,
      onSearchChange: handleSearchChange,
      onStatusFilter: handleStatusFilter,
      onPriorityFilter: handlePriorityFilter,
      onTypeFilter: handleTypeFilter,
      onClearFilters: handleClearFilters,
      onPageChange: handlePageChange
    }
  }
}
