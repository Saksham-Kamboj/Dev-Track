import { useState, useEffect, useCallback, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { toast } from "sonner"
import { getTaskById, updateTask } from "@/redux/thunks/task.thunks"
import { PAGE_ROUTES } from "@/constants"
import type { TaskFormData, TaskData } from "@/types/task/task.types"

interface TaskEditControllerResponse {
  getters: {
    formData: TaskFormData
    loading: boolean
    saving: boolean
    dueDate: Date | undefined
    newTag: string
    currentTask: TaskData | null
    taskNotFound: boolean
    isFormValid: boolean
    isFormDirty: boolean
    error: string | null
  }
  handlers: {
    onInputChange: (field: keyof TaskFormData, value: any) => void
    onDueDateChange: (date: Date | undefined) => void
    onNewTagChange: (value: string) => void
    onAddTag: () => void
    onRemoveTag: (tag: string) => void
    onSubmit: (e: React.FormEvent) => void
    onCancel: () => void
    onReset: () => void
  }
}

export const useTaskEditController = (): TaskEditControllerResponse => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { id } = useParams<{ id: string }>()
  const { currentTask, loading, error } = useAppSelector((state) => state.tasks)
  const { user } = useAppSelector((state) => state.auth)

  // Role-based properties
  const userRole = user?.role || 'developer'
  const isAdmin = userRole === 'admin'

  const [saving, setSaving] = useState(false)
  const [dueDate, setDueDate] = useState<Date>()
  const [newTag, setNewTag] = useState("")
  const [taskNotFound, setTaskNotFound] = useState(false)
  const [initialFormData, setInitialFormData] = useState<TaskFormData | null>(null)

  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    status: "Todo",
    priority: "Medium",
    type: "Task",
    dueDate: "",
    estimatedHours: undefined,
    tags: []
  })

  // Memoized computed values
  const isFormValid = useMemo(() => {
    return formData.title.trim().length > 0 && formData.description.trim().length > 0
  }, [formData.title, formData.description])

  const isFormDirty = useMemo(() => {
    if (!initialFormData) return false
    return JSON.stringify(formData) !== JSON.stringify(initialFormData) ||
      (dueDate?.toISOString() !== currentTask?.dueDate)
  }, [formData, initialFormData, dueDate, currentTask?.dueDate])

  // Load task data
  useEffect(() => {
    if (id) {
      dispatch(getTaskById(id))
        .unwrap()
        .catch(() => {
          setTaskNotFound(true)
        })
    }
  }, [dispatch, id])

  // Populate form when task loads
  useEffect(() => {
    if (currentTask) {
      const newFormData = {
        title: currentTask.title,
        description: currentTask.description,
        status: currentTask.status,
        priority: currentTask.priority,
        type: currentTask.type,
        dueDate: currentTask.dueDate || "",
        estimatedHours: currentTask.estimatedHours || undefined,
        tags: currentTask.tags || []
      }

      setFormData(newFormData)
      setInitialFormData(newFormData)

      if (currentTask.dueDate) {
        setDueDate(new Date(currentTask.dueDate))
      } else {
        setDueDate(undefined)
      }
      setTaskNotFound(false)
    }
  }, [currentTask])

  // Clear current task on unmount
  useEffect(() => {
    return () => {
      // Cleanup function can be added here if needed
    }
  }, [])

  const handleInputChange = useCallback((field: keyof TaskFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  const handleDueDateChange = useCallback((date: Date | undefined) => {
    setDueDate(date)
  }, [])

  const handleNewTagChange = useCallback((value: string) => {
    setNewTag(value)
  }, [])

  const handleAddTag = useCallback(() => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag("")
    }
  }, [newTag, formData.tags])

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    if (!id) {
      toast.error("Task ID not found")
      return
    }

    setSaving(true)
    try {
      const taskData = {
        ...formData,
        dueDate: dueDate ? dueDate.toISOString() : undefined
      }

      const result = await dispatch(updateTask({ taskId: id, taskData }))

      if (updateTask.fulfilled.match(result)) {
        toast.success("Task updated successfully!")
        // Navigate back to task list based on role
        if (isAdmin) {
          navigate(PAGE_ROUTES.ADMIN.TASK.ALL)
        } else {
          navigate(PAGE_ROUTES.DEVELOPER.TASK.ALL)
        }
      } else {
        toast.error("Failed to update task")
      }
    } catch (error) {
      toast.error("Failed to update task")
    } finally {
      setSaving(false)
    }
  }, [formData, dueDate, id, dispatch, navigate, isAdmin])

  const handleCancel = useCallback(() => {
    if (isFormDirty) {
      const confirmLeave = window.confirm("You have unsaved changes. Are you sure you want to leave?")
      if (!confirmLeave) return
    }
    // Navigate back to task list based on role
    if (isAdmin) {
      navigate(PAGE_ROUTES.ADMIN.TASK.ALL)
    } else {
      navigate(PAGE_ROUTES.DEVELOPER.TASK.ALL)
    }
  }, [navigate, isFormDirty, isAdmin])

  const handleReset = useCallback(() => {
    if (initialFormData) {
      setFormData(initialFormData)
      if (currentTask?.dueDate) {
        setDueDate(new Date(currentTask.dueDate))
      } else {
        setDueDate(undefined)
      }
      setNewTag("")
    }
  }, [initialFormData, currentTask?.dueDate])

  return {
    getters: {
      formData,
      loading,
      saving,
      dueDate,
      newTag,
      currentTask,
      taskNotFound,
      isFormValid,
      isFormDirty,
      error
    },
    handlers: {
      onInputChange: handleInputChange,
      onDueDateChange: handleDueDateChange,
      onNewTagChange: handleNewTagChange,
      onAddTag: handleAddTag,
      onRemoveTag: handleRemoveTag,
      onSubmit: handleSubmit,
      onCancel: handleCancel,
      onReset: handleReset
    }
  }
}
