import { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "@/redux/hooks"
import { toast } from "sonner"
import { createTask } from "@/redux/thunks/task.thunks"
import type { TaskFormData } from "@/types/task/task.types"
import { PAGE_ROUTES } from "@/constants"

interface TaskCreateControllerResponse {
  getters: {
    formData: TaskFormData
    loading: boolean
    dueDate: Date | undefined
    newTag: string
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

export const useTaskCreateController = (): TaskCreateControllerResponse => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  
  const [loading, setLoading] = useState(false)
  const [dueDate, setDueDate] = useState<Date>()
  const [newTag, setNewTag] = useState("")
  
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

    setLoading(true)
    try {
      const taskData = {
        ...formData,
        dueDate: dueDate ? dueDate.toISOString() : undefined
      }

      const result = await dispatch(createTask(taskData))
      
      if (createTask.fulfilled.match(result)) {
        toast.success("Task created successfully!")
        navigate(PAGE_ROUTES.DEVELOPER.TASK.ALL)
      } else {
        toast.error("Failed to create task")
      }
    } catch (error) {
      toast.error("Failed to create task")
    } finally {
      setLoading(false)
    }
  }, [formData, dueDate, dispatch, navigate])

  const handleCancel = useCallback(() => {
    navigate(PAGE_ROUTES.DEVELOPER.TASK.ALL)
  }, [navigate])

  return {
    getters: {
      formData,
      loading,
      dueDate,
      newTag
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
