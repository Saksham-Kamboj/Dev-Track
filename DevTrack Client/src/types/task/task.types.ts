import type { TableData } from "@/types"

// Task status types
export type TaskStatus = "Todo" | "In Progress" | "Backlog" | "Done" | "Cancelled"

// Task priority types
export type TaskPriority = "High" | "Medium" | "Low"

// Task type categories
export type TaskType = "Feature" | "Bug" | "Documentation" | "Enhancement" | "Task"

// User reference interface
export interface TaskUser {
  _id: string
  name: string
  email: string
  role: string
}

// Task comment interface
export interface TaskComment {
  _id: string
  text: string
  author: TaskUser
  createdAt: string
}

// Task attachment interface
export interface TaskAttachment {
  _id: string
  filename: string
  originalName: string
  path: string
  size: number
  mimetype: string
  uploadedAt: string
}

// Enhanced Task data interface
export interface TaskData extends TableData {
  id: string
  taskId: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  type: TaskType
  dueDate?: string | null
  estimatedHours?: number | null
  actualHours?: number | null
  tags: string[]
  assignedTo: TaskUser
  createdBy: TaskUser
  completedAt?: string | null
  comments?: TaskComment[]
  attachments?: TaskAttachment[]
  createdAt: string
  updatedAt: string
}

// Task form data interface
export interface TaskFormData {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  type: TaskType
  dueDate?: string
  estimatedHours?: number
  tags: string[]
  assignedTo?: string
}

// Task filter options
export interface TaskFilterOptions {
  status: TaskStatus[]
  priority: TaskPriority[]
  type: TaskType[]
  assignedTo?: string[]
}

// Task statistics interface
export interface TaskStats {
  total: number
  todo: number
  inProgress: number
  backlog: number
  done: number
  cancelled: number
  highPriority: number
  mediumPriority: number
  lowPriority: number
  overdue: number
}

// Task API response interfaces
export interface TaskApiResponse {
  success: boolean
  message?: string
  task?: TaskData
  tasks?: TaskData[]
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// Task query parameters
export interface TaskQueryParams {
  page?: number
  limit?: number
  status?: TaskStatus | TaskStatus[]
  priority?: TaskPriority | TaskPriority[]
  type?: TaskType | TaskType[]
  search?: string
  assignedTo?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Task constants
export const TASK_STATUS_OPTIONS = [
  { value: 'Todo', label: 'Todo', color: 'gray' },
  { value: 'In Progress', label: 'In Progress', color: 'blue' },
  { value: 'Backlog', label: 'Backlog', color: 'yellow' },
  { value: 'Done', label: 'Done', color: 'green' },
  { value: 'Cancelled', label: 'Cancelled', color: 'red' }
] as const

export const TASK_PRIORITY_OPTIONS = [
  { value: 'High', label: 'High', color: 'red' },
  { value: 'Medium', label: 'Medium', color: 'yellow' },
  { value: 'Low', label: 'Low', color: 'green' }
] as const

export const TASK_TYPE_OPTIONS = [
  { value: 'Feature', label: 'Feature', color: 'blue' },
  { value: 'Bug', label: 'Bug', color: 'red' },
  { value: 'Documentation', label: 'Documentation', color: 'purple' },
  { value: 'Enhancement', label: 'Enhancement', color: 'green' },
  { value: 'Task', label: 'Task', color: 'gray' }
] as const
