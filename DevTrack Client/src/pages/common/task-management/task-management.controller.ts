import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";

import type {
  TaskData,
  TaskStatus,
  TaskPriority,
  TaskType,
} from "@/types/task/task.types";
import {
  getAllTasks,
  deleteTask,
  updateTask,
} from "@/redux/thunks/task.thunks";
import { adminGetDevelopers } from "@/redux/thunks/admin-task.thunks";
import { setFilters, clearFilters } from "@/redux/slices/taskSlice";
import { PAGE_ROUTES, PAGE_TEXTS } from "@/constants";

interface TaskManagementControllerResponse {
  getters: {
    title: string;
    description: string;
    tasks: TaskData[];
    loading: boolean;
    error: string | null;
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    } | null;
    filters: {
      status: string | null;
      priority: string | null;
      type: string | null;
      search: string;
      assignedTo?: string;
    };
    // Role-based properties
    userRole: string;
    isAdmin: boolean;
    isDeveloper: boolean;
    developers: Array<{ id: string; name: string; email: string }>;
    canCreateTasks: boolean;
    canEditAllTasks: boolean;
    canDeleteTasks: boolean;
    canAssignTasks: boolean;
  };
  handlers: {
    onCreateTask: () => void;
    onEditTask: (task: TaskData) => void;
    onDeleteTask: (taskId: string) => void;
    onViewTask: (task: TaskData) => void;
    onSearchChange: (search: string) => void;
    onStatusFilter: (status: string | null) => void;
    onPriorityFilter: (priority: string | null) => void;
    onTypeFilter: (type: string | null) => void;
    onAssignedToFilter: (assignedTo: string | null) => void;
    onClearFilters: () => void;
    onPageChange: (page: number) => void;
    // Admin-specific handlers
    onAssignTask: (taskId: string, assignedTo: string | null) => void;
    onUpdateTaskStatus: (taskId: string, status: string) => void;
    onUpdateTaskPriority: (taskId: string, priority: string) => void;
  };
}

export const useTaskManagementController =
  (): TaskManagementControllerResponse => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { tasks, loading, error, pagination, filters, isInitialized } =
      useAppSelector((state) => state.tasks);
    const { user } = useAppSelector((state) => state.auth);
    const { developers } = useAppSelector((state) => state.adminTasks);

    // Role-based properties
    const userRole = user?.role || "developer";
    const isAdmin = userRole === "admin";
    const isDeveloper = userRole === "developer";
    const canCreateTasks = isAdmin;
    const canEditAllTasks = isAdmin;
    const canDeleteTasks = isAdmin;
    const canAssignTasks = isAdmin;

    // Debounce timer ref for search
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Load tasks and developers (for admin) on mount
    useEffect(() => {
      if (!isInitialized && !loading) {
        dispatch(
          getAllTasks({
            page: 1,
            limit: 12,
            sortBy: "createdAt",
            sortOrder: "desc",
          })
        );

        // Load developers if admin
        if (isAdmin) {
          dispatch(adminGetDevelopers());
        }
      }
    }, [dispatch, isInitialized, loading, isAdmin]);

    // Cleanup search timeout on unmount
    useEffect(() => {
      return () => {
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }
      };
    }, []);

    // Create task handler - role-based routing
    const handleCreateTask = useCallback(() => {
      if (isAdmin) {
        navigate(PAGE_ROUTES.ADMIN.TASK.UPLOAD);
      } else {
        navigate(PAGE_ROUTES.DEVELOPER.TASK.UPLOAD);
      }
    }, [navigate, isAdmin]);

    // Edit task handler - role-based routing
    const handleEditTask = useCallback(
      (task: TaskData) => {
        if (isAdmin) {
          navigate(PAGE_ROUTES.ADMIN.TASK.EDIT.replace(":id", task.id));
        } else {
          navigate(PAGE_ROUTES.DEVELOPER.TASK.EDIT.replace(":id", task.id));
        }
      },
      [navigate, isAdmin]
    );

    // Delete task handler
    const handleDeleteTask = useCallback(
      async (taskId: string) => {
        try {
          const result = await dispatch(deleteTask(taskId));
          if (deleteTask.fulfilled.match(result)) {
            toast.success("Task deleted successfully!");
          }
        } catch (error) {
          console.error("Delete task error:", error);
          toast.error((error as Error).message || "Failed to delete task");
        }
      },
      [dispatch]
    );

    // View task handler - role-based routing
    const handleViewTask = useCallback(
      (task: TaskData) => {
        if (isAdmin) {
          navigate(PAGE_ROUTES.ADMIN.TASK.VIEW.replace(":id", task.id));
        } else {
          navigate(PAGE_ROUTES.DEVELOPER.TASK.VIEW.replace(":id", task.id));
        }
      },
      [navigate, isAdmin]
    );

    // Filter handlers with automatic data refresh
    const handleSearchChange = useCallback(
      (search: string) => {
        dispatch(setFilters({ search }));

        // Clear existing timeout
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }

        // Debounce search API call by 500ms
        searchTimeoutRef.current = setTimeout(() => {
          dispatch(
            getAllTasks({
              page: 1, // Reset to first page when searching
              limit: pagination?.limit || 12,
              search: search || undefined,
              status: (filters.status as TaskStatus) || undefined,
              priority: (filters.priority as TaskPriority) || undefined,
              type: (filters.type as TaskType) || undefined,
              assignedTo: filters.assignedTo || undefined,
              sortBy: "createdAt",
              sortOrder: "desc",
            })
          );
        }, 500);
      },
      [dispatch, pagination?.limit, filters]
    );

    const handleStatusFilter = useCallback(
      (status: string | null) => {
        dispatch(setFilters({ status }));
        // Trigger new API call with updated filters
        dispatch(
          getAllTasks({
            page: 1, // Reset to first page when filtering
            limit: pagination?.limit || 12,
            search: filters.search || undefined,
            status: (status as TaskStatus) || undefined,
            priority: (filters.priority as TaskPriority) || undefined,
            type: (filters.type as TaskType) || undefined,
            assignedTo: filters.assignedTo || undefined,
            sortBy: "createdAt",
            sortOrder: "desc",
          })
        );
      },
      [dispatch, pagination?.limit, filters]
    );

    const handlePriorityFilter = useCallback(
      (priority: string | null) => {
        dispatch(setFilters({ priority }));
        // Trigger new API call with updated filters
        dispatch(
          getAllTasks({
            page: 1, // Reset to first page when filtering
            limit: pagination?.limit || 12,
            search: filters.search || undefined,
            status: (filters.status as TaskStatus) || undefined,
            priority: (priority as TaskPriority) || undefined,
            type: (filters.type as TaskType) || undefined,
            assignedTo: filters.assignedTo || undefined,
            sortBy: "createdAt",
            sortOrder: "desc",
          })
        );
      },
      [dispatch, pagination?.limit, filters]
    );

    const handleTypeFilter = useCallback(
      (type: string | null) => {
        dispatch(setFilters({ type }));
        // Trigger new API call with updated filters
        dispatch(
          getAllTasks({
            page: 1, // Reset to first page when filtering
            limit: pagination?.limit || 12,
            search: filters.search || undefined,
            status: (filters.status as TaskStatus) || undefined,
            priority: (filters.priority as TaskPriority) || undefined,
            type: (type as TaskType) || undefined,
            assignedTo: filters.assignedTo || undefined,
            sortBy: "createdAt",
            sortOrder: "desc",
          })
        );
      },
      [dispatch, pagination?.limit, filters]
    );

    const handleClearFilters = useCallback(() => {
      dispatch(clearFilters());
      // Trigger new API call with cleared filters
      dispatch(
        getAllTasks({
          page: 1,
          limit: pagination?.limit || 12,
          sortBy: "createdAt",
          sortOrder: "desc",
        })
      );
    }, [dispatch, pagination?.limit]);

    const handlePageChange = useCallback(
      (page: number) => {
        dispatch(
          getAllTasks({
            page,
            limit: pagination?.limit || 12,
            search: filters.search || undefined,
            status: (filters.status as TaskStatus) || undefined,
            priority: (filters.priority as TaskPriority) || undefined,
            type: (filters.type as TaskType) || undefined,
            assignedTo: filters.assignedTo || undefined,
            sortBy: "createdAt",
            sortOrder: "desc",
          })
        );
      },
      [dispatch, pagination?.limit, filters]
    );

    // Admin-specific handlers
    const handleAssignedToFilter = useCallback(
      (assignedTo: string | null) => {
        dispatch(setFilters({ assignedTo: assignedTo || undefined }));
        // Trigger new API call with updated filters
        dispatch(
          getAllTasks({
            page: 1, // Reset to first page when filtering
            limit: pagination?.limit || 12,
            search: filters.search || undefined,
            status: (filters.status as TaskStatus) || undefined,
            priority: (filters.priority as TaskPriority) || undefined,
            type: (filters.type as TaskType) || undefined,
            assignedTo: assignedTo || undefined,
            sortBy: "createdAt",
            sortOrder: "desc",
          })
        );
      },
      [dispatch, pagination?.limit, filters]
    );

    const handleAssignTask = useCallback(
      (taskId: string, assignedTo: string | null) => {
        if (!isAdmin) return;
        dispatch(
          updateTask({
            taskId,
            taskData: { assignedTo: assignedTo || undefined },
          })
        );
      },
      [dispatch, isAdmin]
    );

    const handleUpdateTaskStatus = useCallback(
      (taskId: string, status: string) => {
        if (!isAdmin) return;
        dispatch(
          updateTask({ taskId, taskData: { status: status as TaskStatus } })
        );
      },
      [dispatch, isAdmin]
    );

    const handleUpdateTaskPriority = useCallback(
      (taskId: string, priority: string) => {
        if (!isAdmin) return;
        dispatch(
          updateTask({
            taskId,
            taskData: { priority: priority as TaskPriority },
          })
        );
      },
      [dispatch, isAdmin]
    );

    return {
      getters: {
        title: PAGE_TEXTS.TASK_MANAGEMENT.TITLE,
        description: PAGE_TEXTS.TASK_MANAGEMENT.DESCRIPTION,
        tasks,
        loading,
        error,
        pagination,
        filters,
        // Role-based properties
        userRole,
        isAdmin,
        isDeveloper,
        developers,
        canCreateTasks,
        canEditAllTasks,
        canDeleteTasks,
        canAssignTasks,
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
        onAssignedToFilter: handleAssignedToFilter,
        onClearFilters: handleClearFilters,
        onPageChange: handlePageChange,
        // Admin-specific handlers
        onAssignTask: handleAssignTask,
        onUpdateTaskStatus: handleUpdateTaskStatus,
        onUpdateTaskPriority: handleUpdateTaskPriority,
      },
    };
  };
