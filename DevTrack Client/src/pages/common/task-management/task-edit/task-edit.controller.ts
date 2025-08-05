import { useState, useEffect, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { toast } from "sonner"
import { getTaskById, updateTask } from "@/redux/thunks/task.thunks"
import type { TaskFormData } from "@/types/task/task.types"

interface TaskEditControllerResponse {
  getters: {
    formData: TaskFormData
    loading: boolean
    saving: boolean
    dueDate: Date | undefined
    newTag: string
    currentTask: any
    taskNotFound: boolean
  }
  handlers: {
    onInputChange: (field: keyof TaskFormData, value: any) => void
    onDueDateChange: (date: Date | undefined) => void
    onNewTagChange: (value: string) => void
    onAddTag: () => void
    onRemoveTag: (tag: string) => void
    onSubmit: (e: React.FormEvent) => void
    onCancel: () => void
  }
}

export const useTaskEditController = (): TaskEditControllerResponse => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { id } = useParams<{ id: string }>()
  const { currentTask, loading } = useAppSelector((state) => state.tasks)
  
  const [saving, setSaving] = useState(false)
  const [dueDate, setDueDate] = useState<Date>()
  const [newTag, setNewTag] = useState("")
  const [taskNotFound, setTaskNotFound] = useState(false)
  
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
      setFormData({
        title: currentTask.title,
        description: currentTask.description,
        status: currentTask.status,
        priority: currentTask.priority,
        type: currentTask.type,
        dueDate: currentTask.dueDate || "",
        estimatedHours: currentTask.estimatedHours || undefined,
        tags: currentTask.tags
      })
      
      if (currentTask.dueDate) {
        setDueDate(new Date(currentTask.dueDate))
      }
      setTaskNotFound(false)
    }
  }, [currentTask])

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
        navigate("/task-management")
      } else {
        toast.error("Failed to update task")
      }
    } catch (error) {
      toast.error("Failed to update task")
    } finally {
      setSaving(false)
    }
  }, [formData, dueDate, id, dispatch, navigate])

  const handleCancel = useCallback(() => {
    navigate("/task-management")
  }, [navigate])

  return {
    getters: {
      formData,
      loading,
      saving,
      dueDate,
      newTag,
      currentTask,
      taskNotFound
    },
    handlers: {
      onInputChange: handleInputChange,
      onDueDateChange: handleDueDateChange,
      onNewTagChange: handleNewTagChange,
      onAddTag: handleAddTag,
      onRemoveTag: handleRemoveTag,
      onSubmit: handleSubmit,
      onCancel: handleCancel
    }
  }
}
