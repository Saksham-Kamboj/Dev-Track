import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    ArrowLeft,
    Calendar,
    Clock,
    User,
    Edit,
    CheckCircle2,
    Circle,
    Pause,
    X,
    AlertCircle
} from "lucide-react"
import { getTaskById } from "@/redux/thunks/task.thunks"
import type { TaskData } from "@/types/task/task.types"

export default function TaskView() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { currentTask, loading } = useAppSelector((state) => state.tasks)
    const [taskNotFound, setTaskNotFound] = useState(false)

    useEffect(() => {
        if (id) {
            dispatch(getTaskById(id))
                .unwrap()
                .catch(() => {
                    setTaskNotFound(true)
                })
        }
    }, [dispatch, id])

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

    const handleBack = () => {
        navigate(-1)
    }

    const handleEdit = () => {
        if (currentTask) {
            navigate(`/tasks/edit/${currentTask.id}`)
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto py-6 space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                    <div className="space-y-4">
                        <div className="h-32 bg-gray-200 rounded"></div>
                        <div className="h-24 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (taskNotFound || !currentTask) {
        return (
            <div className="container mx-auto py-6">
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Task not found</h3>
                        <p className="text-muted-foreground text-center mb-4">
                            The task you're looking for doesn't exist or you don't have permission to view it.
                        </p>
                        <Button onClick={handleBack}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Go Back
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={handleBack}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{currentTask.title}</h1>
                        <p className="text-muted-foreground">
                            {currentTask.taskId} • Created {new Date(currentTask.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <Button onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Task
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {currentTask.description}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Tags */}
                    {currentTask.tags && currentTask.tags.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Tags</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {currentTask.tags.map((tag, index) => (
                                        <Badge key={index} variant="outline">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status & Priority */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Status</label>
                                <div className="mt-1">
                                    <Badge className={`${getStatusColor(currentTask.status)} flex items-center gap-1 w-fit`}>
                                        {getStatusIcon(currentTask.status)}
                                        {currentTask.status}
                                    </Badge>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Priority</label>
                                <div className="mt-1">
                                    <Badge variant="outline" className={getPriorityColor(currentTask.priority)}>
                                        {currentTask.priority}
                                    </Badge>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Type</label>
                                <div className="mt-1">
                                    <Badge variant="outline" className={getTypeColor(currentTask.type)}>
                                        {currentTask.type}
                                    </Badge>
                                </div>
                            </div>

                            {currentTask.dueDate && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Due Date</label>
                                    <div className="mt-1 flex items-center gap-2 text-sm">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(currentTask.dueDate).toLocaleDateString()}
                                    </div>
                                </div>
                            )}

                            {currentTask.estimatedHours && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Estimated Hours</label>
                                    <div className="mt-1 flex items-center gap-2 text-sm">
                                        <Clock className="h-4 w-4" />
                                        {currentTask.estimatedHours}h
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* People */}
                    <Card>
                        <CardHeader>
                            <CardTitle>People</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Assigned To</label>
                                <div className="mt-1 flex items-center gap-2 text-sm">
                                    <User className="h-4 w-4" />
                                    {currentTask.assignedTo.name}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Created By</label>
                                <div className="mt-1 flex items-center gap-2 text-sm">
                                    <User className="h-4 w-4" />
                                    {currentTask.createdBy.name}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
