
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Calendar,
    Clock,
    User,
    AlertCircle,
    CheckCircle2,
    Circle,
    Pause,
    X
} from "lucide-react"
import { TASK_STATUS_OPTIONS, TASK_PRIORITY_OPTIONS, TASK_TYPE_OPTIONS } from "@/types/task/task.types"
import { useTaskManagementController } from "./task-management.controller"

/**
 * Task Management Page Component
 * Displays and manages tasks with filtering, sorting, and CRUD operations
 */
export default function TaskManagement() {
    const { getters, handlers } = useTaskManagementController()

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Todo': return <Circle className="h-4 w-4" />
            case 'In Progress': return <Clock className="h-4 w-4" />
            case 'Backlog': return <Pause className="h-4 w-4" />
            case 'Done': return <CheckCircle2 className="h-4 w-4" />
            case 'Cancelled': return <X className="h-4 w-4" />
            default: return <Circle className="h-4 w-4" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Todo': return 'bg-gray-100 text-gray-800'
            case 'In Progress': return 'bg-blue-100 text-blue-800'
            case 'Backlog': return 'bg-yellow-100 text-yellow-800'
            case 'Done': return 'bg-green-100 text-green-800'
            case 'Cancelled': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High': return 'bg-red-100 text-red-800'
            case 'Medium': return 'bg-yellow-100 text-yellow-800'
            case 'Low': return 'bg-green-100 text-green-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Feature': return 'bg-blue-100 text-blue-800'
            case 'Bug': return 'bg-red-100 text-red-800'
            case 'Documentation': return 'bg-purple-100 text-purple-800'
            case 'Enhancement': return 'bg-green-100 text-green-800'
            case 'Task': return 'bg-gray-100 text-gray-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="space-y-6 mt-2">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Task Management</h1>
                    <p className="text-muted-foreground">
                        Manage and track your development tasks
                    </p>
                </div>
                <Button onClick={handlers.onCreateTask} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    New Task
                </Button>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filters
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search tasks..."
                                    value={getters.filters.search}
                                    onChange={(e) => handlers.onSearchChange(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <Select
                                value={getters.filters.status[0] || "all"}
                                onValueChange={(value) => handlers.onStatusFilter(value === "all" ? [] : [value])}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    {TASK_STATUS_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Priority Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Priority</label>
                            <Select
                                value={getters.filters.priority[0] || "all"}
                                onValueChange={(value) => handlers.onPriorityFilter(value === "all" ? [] : [value])}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Priorities" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Priorities</SelectItem>
                                    {TASK_PRIORITY_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Type Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Type</label>
                            <Select
                                value={getters.filters.type[0] || "all"}
                                onValueChange={(value) => handlers.onTypeFilter(value === "all" ? [] : [value])}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    {TASK_TYPE_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Clear Filters */}
                    {(getters.filters.search ||
                        getters.filters.status.length > 0 ||
                        getters.filters.priority.length > 0 ||
                        getters.filters.type.length > 0) && (
                            <div className="mt-4">
                                <Button variant="outline" onClick={handlers.onClearFilters}>
                                    Clear Filters
                                </Button>
                            </div>
                        )}
                </CardContent>
            </Card>

            {/* Tasks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getters.loading ? (
                    // Loading skeleton
                    Array.from({ length: 6 }).map((_, index) => (
                        <Card key={index} className="animate-pulse">
                            <CardHeader>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="h-3 bg-gray-200 rounded"></div>
                                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : getters.tasks.length === 0 ? (
                    // Empty state
                    <div className="col-span-full">
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
                                <p className="text-muted-foreground text-center mb-4">
                                    {getters.filters.search ||
                                        getters.filters.status.length > 0 ||
                                        getters.filters.priority.length > 0 ||
                                        getters.filters.type.length > 0
                                        ? "No tasks match your current filters. Try adjusting your search criteria."
                                        : "Get started by creating your first task."}
                                </p>
                                <Button onClick={handlers.onCreateTask}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Task
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    // Tasks list
                    getters.tasks.map((task) => (
                        <Card key={task.id} className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg leading-tight">
                                            {task.title}
                                        </CardTitle>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <span>{task.taskId}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                {task.assignedTo.name}
                                            </span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <CardDescription className="line-clamp-2">
                                    {task.description}
                                </CardDescription>

                                {/* Badges */}
                                <div className="flex flex-wrap gap-2">
                                    <Badge className={`${getStatusColor(task.status)} flex items-center gap-1`}>
                                        {getStatusIcon(task.status)}
                                        {task.status}
                                    </Badge>
                                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                        {task.priority}
                                    </Badge>
                                    <Badge variant="outline" className={getTypeColor(task.type)}>
                                        {task.type}
                                    </Badge>
                                </div>

                                {/* Due Date */}
                                {task.dueDate && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
                                    {task.estimatedHours && (
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {task.estimatedHours}h
                                        </span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Pagination */}
            {getters.pagination && getters.pagination.pages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => handlers.onPageChange(getters.pagination!.page - 1)}
                        disabled={getters.pagination.page <= 1}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {getters.pagination.page} of {getters.pagination.pages}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => handlers.onPageChange(getters.pagination!.page + 1)}
                        disabled={getters.pagination.page >= getters.pagination.pages}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    )
}
