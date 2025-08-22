import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
  X,
  Eye,
  Edit,
  Trash2,
  ChevronDown,
  UserCheck,
  Flag,
  Settings,
} from "lucide-react";
import {
  TASK_STATUS_OPTIONS,
  TASK_PRIORITY_OPTIONS,
  TASK_TYPE_OPTIONS,
} from "@/types/task/task.types";
import { useTaskManagementController } from "./task-management.controller";

/**
 * Task Management Page Component
 * Displays and manages tasks with filtering, sorting, and CRUD operations
 */
export default function TaskManagement() {
  const { getters, handlers } = useTaskManagementController();
  const {
    title,
    description,
    tasks,
    pagination,
    filters,
    isAdmin,
    developers,
    canCreateTasks,
    canEditAllTasks,
    canDeleteTasks,
  } = getters;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Todo":
        return <Circle className="h-4 w-4" />;
      case "In Progress":
        return <Clock className="h-4 w-4" />;
      case "Backlog":
        return <Pause className="h-4 w-4" />;
      case "Done":
        return <CheckCircle2 className="h-4 w-4" />;
      case "Cancelled":
        return <X className="h-4 w-4" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Todo":
        return "bg-gray-100 text-gray-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Backlog":
        return "bg-yellow-100 text-yellow-800";
      case "Done":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Feature":
        return "bg-blue-100 text-blue-800";
      case "Bug":
        return "bg-red-100 text-red-800";
      case "Documentation":
        return "bg-purple-100 text-purple-800";
      case "Enhancement":
        return "bg-green-100 text-green-800";
      case "Task":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-3 mt-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {canCreateTasks && (
          <Button
            onClick={handlers.onCreateTask}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        )}
      </div>

      {/* Filters and Search */}
      <Card className="flex flex-col p-4 gap-0">
        <div className=" flex justify-between w-full">
          <CardHeader className="p-0 w-40">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
            <CardDescription>
              {tasks.length} / {pagination?.total || 0} tasks found
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 w-full">
            <div
              className={`grid grid-cols-1 md:grid-cols-2 ${
                isAdmin ? "lg:grid-cols-5" : "lg:grid-cols-4"
              } gap-4`}
            >
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks..."
                    value={filters.search}
                    onChange={(e) => handlers.onSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {!filters.status ? "All Statuses" : filters.status}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-full p-0 select-none"
                    align="start"
                  >
                    <div className="p-2">
                      <div className="flex items-center space-x-2 p-2 rounded dark:hover:bg-background/50">
                        <Checkbox
                          id="status-all"
                          checked={!filters.status}
                          onCheckedChange={() => handlers.onStatusFilter(null)}
                        />
                        <label
                          htmlFor="status-all"
                          className="text-sm font-medium cursor-pointer flex-1"
                        >
                          All Statuses
                        </label>
                      </div>
                      {TASK_STATUS_OPTIONS.map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-2 p-2 rounded dark:hover:bg-background/50"
                        >
                          <Checkbox
                            id={`status-${option.value}`}
                            checked={filters.status === option.value}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handlers.onStatusFilter(option.value);
                              } else {
                                handlers.onStatusFilter(null);
                              }
                            }}
                          />
                          <label
                            htmlFor={`status-${option.value}`}
                            className="text-sm cursor-pointer flex-1"
                          >
                            {option.label}
                          </label>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(option.value)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Priority Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {!filters.priority ? "All Priorities" : filters.priority}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-full p-0 select-none"
                    align="start"
                  >
                    <div className="p-2">
                      <div className="flex items-center space-x-2 p-2 rounded dark:hover:bg-background/50">
                        <Checkbox
                          id="priority-all"
                          checked={!filters.priority}
                          onCheckedChange={() =>
                            handlers.onPriorityFilter(null)
                          }
                        />
                        <label
                          htmlFor="priority-all"
                          className="text-sm font-medium cursor-pointer flex-1"
                        >
                          All Priorities
                        </label>
                      </div>
                      {TASK_PRIORITY_OPTIONS.map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-2 p-2 rounded dark:hover:bg-background/50"
                        >
                          <Checkbox
                            id={`priority-${option.value}`}
                            checked={filters.priority === option.value}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handlers.onPriorityFilter(option.value);
                              } else {
                                handlers.onPriorityFilter(null);
                              }
                            }}
                          />
                          <label
                            htmlFor={`priority-${option.value}`}
                            className="text-sm cursor-pointer flex-1"
                          >
                            {option.label}
                          </label>
                          <Badge
                            variant="outline"
                            className={`${getPriorityColor(
                              option.value
                            )} text-xs px-2 py-0`}
                          >
                            {option.value}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {!filters.type ? "All Types" : filters.type}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-full p-0 select-none"
                    align="start"
                  >
                    <div className="p-2">
                      <div className="flex items-center space-x-2 p-2 rounded dark:hover:bg-background/50">
                        <Checkbox
                          id="type-all"
                          checked={!filters.type}
                          onCheckedChange={() => handlers.onTypeFilter(null)}
                        />
                        <label
                          htmlFor="type-all"
                          className="text-sm font-medium cursor-pointer flex-1"
                        >
                          All Types
                        </label>
                      </div>
                      {TASK_TYPE_OPTIONS.map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-2 p-2 rounded dark:hover:bg-background/50"
                        >
                          <Checkbox
                            id={`type-${option.value}`}
                            checked={filters.type === option.value}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handlers.onTypeFilter(option.value);
                              } else {
                                handlers.onTypeFilter(null);
                              }
                            }}
                          />
                          <label
                            htmlFor={`type-${option.value}`}
                            className="text-sm cursor-pointer flex-1"
                          >
                            {option.label}
                          </label>
                          <Badge
                            variant="outline"
                            className={`${getTypeColor(
                              option.value
                            )} text-xs px-2 py-0`}
                          >
                            {option.value}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Assigned To Filter - Admin Only */}
              {isAdmin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Assigned To</label>
                  <Select
                    value={filters.assignedTo || "all"}
                    onValueChange={(value) =>
                      handlers.onAssignedToFilter(
                        value === "all" ? null : value
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Developers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Developers</SelectItem>
                      {developers.map((dev) => (
                        <SelectItem key={dev.id} value={dev.id}>
                          {dev.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </div>
        <CardFooter className="p-0">
          {/* Active Filters Summary */}
          {(filters.search ||
            filters.status ||
            filters.priority ||
            filters.type ||
            filters.assignedTo) && (
            <div className="mt-2 space-y-1 w-full">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Filters:</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlers.onClearFilters}
                >
                  Clear All
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.search && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    Search: "{filters.search}"
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handlers.onSearchChange("")}
                    />
                  </Badge>
                )}
                {filters.status && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    Status: {filters.status}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handlers.onStatusFilter(null)}
                    />
                  </Badge>
                )}
                {filters.priority && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    Priority: {filters.priority}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handlers.onPriorityFilter(null)}
                    />
                  </Badge>
                )}
                {filters.type && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    Type: {filters.type}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handlers.onTypeFilter(null)}
                    />
                  </Badge>
                )}
                {filters.assignedTo && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    Assigned:{" "}
                    {developers.find((d) => d.id === filters.assignedTo)
                      ?.name || "Unknown"}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handlers.onAssignedToFilter(null)}
                    />
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardFooter>
      </Card>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.length === 0 ? (
          // Empty state
          <div className="col-span-full">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {filters.search ||
                  filters.status ||
                  filters.priority ||
                  filters.type ||
                  filters.assignedTo
                    ? "No tasks match your current filters. Try adjusting your search criteria."
                    : "Get started by creating your first task."}
                </p>
                {canCreateTasks && (
                  <Button onClick={handlers.onCreateTask}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Task
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          // Tasks list
          tasks.map((task) => (
            <Card
              key={task.id}
              className="hover:shadow-md transition-shadow gap-0"
            >
              <CardHeader className="pb-0">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg leading-tight text-primary">
                      <button
                        onClick={() => handlers.onViewTask(task)}
                        className="text-left hover:underline focus:outline-none"
                      >
                        {task.title.length > 30
                          ? task.title.slice(0, 30) + "..."
                          : task.title}
                      </button>
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{task.taskId}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {task.assignedTo?.name || "Unassigned"}
                      </span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handlers.onViewTask(task)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      {canEditAllTasks && (
                        <DropdownMenuItem
                          onClick={() => handlers.onEditTask(task)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      )}

                      {/* Admin-specific actions */}
                      {isAdmin && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              // Quick assign functionality can be added here
                            }}
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            Assign
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              // Quick status update can be added here
                            }}
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Update Status
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              // Quick priority update can be added here
                            }}
                          >
                            <Flag className="mr-2 h-4 w-4" />
                            Update Priority
                          </DropdownMenuItem>
                        </>
                      )}

                      {canDeleteTasks && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Are you sure you want to delete "${task.title}"? This action cannot be undone.`
                                )
                              ) {
                                handlers.onDeleteTask(task.id);
                              }
                            }}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="line-clamp-2">
                  {task.description}
                </CardDescription>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge
                    className={`${getStatusColor(
                      task.status
                    )} flex items-center gap-1`}
                  >
                    {getStatusIcon(task.status)}
                    {task.status}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={getPriorityColor(task.priority)}
                  >
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
                    <span>
                      Due {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Created {new Date(task.createdAt).toLocaleDateString()}
                  </span>
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
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => handlers.onPageChange(pagination!.page - 1)}
            disabled={pagination!.page <= 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pagination!.page} of {pagination!.pages}
          </span>
          <Button
            variant="outline"
            onClick={() => handlers.onPageChange(pagination!.page + 1)}
            disabled={pagination!.page >= pagination!.pages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
