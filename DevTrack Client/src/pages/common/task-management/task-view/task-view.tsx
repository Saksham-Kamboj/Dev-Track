import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    ArrowLeft,
    Calendar,
    Clock,
    User,
    Edit,
    AlertCircle,
    Trash2,
    Copy,
    Circle,
    CheckCircle2,
    X
} from "lucide-react"
import { useTaskViewController } from "./task-view.controller"


export default function TaskView() {
    const { getters, handlers, utils } = useTaskViewController()
    const {
        currentTask,
        taskNotFound
    } = getters
    const {
        onBack,
        onEdit,
        onDelete,
        onDuplicate
    } = handlers
    const {
        getStatusColor,
        getPriorityColor,
        getTypeColor,
        formatDate
    } = utils

    // Status icon component
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Todo': return <Circle className="h-4 w-4" />
            case 'In Progress': return <Clock className="h-4 w-4" />
            case 'Backlog': return <AlertCircle className="h-4 w-4" />
            case 'Done': return <CheckCircle2 className="h-4 w-4" />
            case 'Cancelled': return <X className="h-4 w-4" />
            default: return <Circle className="h-4 w-4" />
        }
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
                        <Button onClick={onBack}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Go Back
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-2 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{currentTask.title}</h1>
                    <p className="text-muted-foreground">
                        {currentTask.taskId} • Created {formatDate(currentTask.createdAt)}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={onEdit}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Task
                    </Button>
                    <Button variant="outline" onClick={onDuplicate}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                    </Button>
                    <Button variant="outline" onClick={onDelete} className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                    </Button>
                </div>
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
                        <CardContent className="space-y-4 grid grid-cols-12">
                            <div className="col-span-4">
                                <label className="text-sm font-medium text-muted-foreground">Status</label>
                                <div className="mt-1">
                                    <Badge className={`${getStatusColor(currentTask.status)} flex items-center gap-1 w-fit`}>
                                        {getStatusIcon(currentTask.status)}
                                        {currentTask.status}
                                    </Badge>
                                </div>
                            </div>

                            <div className="col-span-4">
                                <label className="text-sm font-medium text-muted-foreground">Priority</label>
                                <div className="mt-1">
                                    <Badge variant="outline" className={getPriorityColor(currentTask.priority)}>
                                        {currentTask.priority}
                                    </Badge>
                                </div>
                            </div>

                            <div className="col-span-4">
                                <label className="text-sm font-medium text-muted-foreground">Type</label>
                                <div className="mt-1">
                                    <Badge variant="outline" className={getTypeColor(currentTask.type)}>
                                        {currentTask.type}
                                    </Badge>
                                </div>
                            </div>

                            {currentTask.dueDate && (
                                <div className="col-span-6">
                                    <label className="text-sm font-medium text-muted-foreground">Due Date</label>
                                    <div className="mt-1 flex items-center gap-2 text-sm">
                                        <Calendar className="h-4 w-4" />
                                        {formatDate(currentTask.dueDate)}
                                    </div>
                                </div>
                            )}

                            {currentTask.estimatedHours && (
                                <div className="col-span-6">
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
