import { useState, useEffect, useCallback, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { toast } from "sonner"
import { getTaskById, deleteTask } from "@/redux/thunks/task.thunks"
import { PAGE_ROUTES, PAGE_TEXTS } from "@/constants"
import type { TaskData } from "@/types/task/task.types"

interface TaskViewControllerResponse {
  getters: {
    title: string
    description: string
    currentTask: TaskData | null
    loading: boolean
    error: string | null
    taskNotFound: boolean
    taskId: string | undefined
  }
  handlers: {
    onBack: () => void
    onEdit: () => void
    onDelete: () => void
    onDuplicate: () => void
  }
  utils: {
    getStatusIconType: (status: string) => string
    getStatusColor: (status: string) => string
    getPriorityColor: (priority: string) => string
    getTypeColor: (type: string) => string
    formatDate: (date: string) => string
  }
}

/**
 * Task View controller hook following the established controller pattern
 * Handles task viewing, navigation, and utility functions
 */
export const useTaskViewController = (): TaskViewControllerResponse => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { currentTask, loading, error } = useAppSelector((state) => state.tasks)
  const { user } = useAppSelector((state) => state.auth)

  const [taskNotFound, setTaskNotFound] = useState(false)

  // Role-based properties
  const userRole = user?.role || 'developer'
  const isAdmin = userRole === 'admin'

  // Load task data when component mounts
  useEffect(() => {
    if (id) {
      dispatch(getTaskById(id))
        .unwrap()
        .catch(() => {
          setTaskNotFound(true)
        })
    }
  }, [dispatch, id])

  // Navigation handlers - role-based routing
  const handleBack = useCallback(() => {
    if (isAdmin) {
      navigate(PAGE_ROUTES.ADMIN.TASK.ALL)
    } else {
      navigate(PAGE_ROUTES.DEVELOPER.TASK.ALL)
    }
  }, [navigate, isAdmin])

  const handleEdit = useCallback(() => {
    if (currentTask) {
      if (isAdmin) {
        navigate(PAGE_ROUTES.ADMIN.TASK.EDIT.replace(":id", currentTask.id))
      } else {
        navigate(PAGE_ROUTES.DEVELOPER.TASK.EDIT.replace(":id", currentTask.id))
      }
    }
  }, [navigate, currentTask, isAdmin])

  const handleDelete = useCallback(async () => {
    if (!currentTask) return

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${currentTask.title}"? This action cannot be undone.`
    )

    if (confirmDelete) {
      try {
        const result = await dispatch(deleteTask(currentTask.id))
        if (deleteTask.fulfilled.match(result)) {
          toast.success('Task deleted successfully!')
          if (isAdmin) {
            navigate(PAGE_ROUTES.ADMIN.TASK.ALL)
          } else {
            navigate(PAGE_ROUTES.DEVELOPER.TASK.ALL)
          }
        } else {
          toast.error('Failed to delete task')
        }
      } catch (error) {
        console.error('Delete task error:', error)
        toast.error('Failed to delete task')
      }
    }
  }, [dispatch, currentTask, navigate, isAdmin])

  const handleDuplicate = useCallback(() => {
    if (currentTask) {
      // Navigate to create page with pre-filled data (could be implemented later)
      if (isAdmin) {
        navigate(PAGE_ROUTES.ADMIN.TASK.UPLOAD)
      } else {
        navigate(PAGE_ROUTES.DEVELOPER.TASK.UPLOAD)
      }
      toast.info('Duplicate functionality coming soon!')
    }
  }, [navigate, currentTask, isAdmin])

  // Utility functions for styling and formatting
  const getStatusIconType = useCallback((status: string): string => {
    switch (status) {
      case 'Todo': return 'todo'
      case 'In Progress': return 'in-progress'
      case 'Backlog': return 'backlog'
      case 'Done': return 'done'
      case 'Cancelled': return 'cancelled'
      default: return 'todo'
    }
  }, [])

  const getStatusColor = useCallback((status: string): string => {
    switch (status) {
      case 'Todo': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Backlog': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Done': return 'bg-green-100 text-green-800 border-green-200'
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }, [])

  const getPriorityColor = useCallback((priority: string): string => {
    switch (priority) {
      case 'High': return 'bg-red-50 text-red-700 border-red-200'
      case 'Medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'Low': return 'bg-green-50 text-green-700 border-green-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }, [])

  const getTypeColor = useCallback((type: string): string => {
    switch (type) {
      case 'Feature': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'Bug': return 'bg-red-50 text-red-700 border-red-200'
      case 'Documentation': return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'Enhancement': return 'bg-green-50 text-green-700 border-green-200'
      case 'Task': return 'bg-gray-50 text-gray-700 border-gray-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }, [])

  const formatDate = useCallback((date: string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }, [])

  // Memoized computed values
  const title = useMemo(() => {
    return currentTask ? `${PAGE_TEXTS.TASK_VIEW.TITLE} - ${currentTask.taskId}` : PAGE_TEXTS.TASK_VIEW.TITLE
  }, [currentTask])

  const description = useMemo(() => {
    return currentTask ? currentTask.title : PAGE_TEXTS.TASK_VIEW.DESCRIPTION
  }, [currentTask])

  return {
    getters: {
      title,
      description,
      currentTask,
      loading,
      error,
      taskNotFound,
      taskId: id
    },
    handlers: {
      onBack: handleBack,
      onEdit: handleEdit,
      onDelete: handleDelete,
      onDuplicate: handleDuplicate
    },
    utils: {
      getStatusIconType,
      getStatusColor,
      getPriorityColor,
      getTypeColor,
      formatDate
    }
  }
}
