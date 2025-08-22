import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";
import { createTask, getAllTasks } from "@/redux/thunks/task.thunks";
import { adminGetDevelopers } from "@/redux/thunks/admin-task.thunks";
import { PAGE_ROUTES } from "@/constants";
import type { TaskFormData } from "@/types/task/task.types";

interface TaskCreateControllerResponse {
  getters: {
    formData: TaskFormData;
    loading: boolean;
    dueDate: Date | undefined;
    newTag: string;
    isFormValid: boolean;
    isFormDirty: boolean;
    error: string | null;
    // Role-based properties
    isAdmin: boolean;
    developers: Array<{ id: string; name: string; email: string }>;
  };
  handlers: {
    onInputChange: (
      field: keyof TaskFormData,
      value: TaskFormData[keyof TaskFormData]
    ) => void;
    onDueDateChange: (date: Date | undefined) => void;
    onNewTagChange: (value: string) => void;
    onAddTag: () => void;
    onRemoveTag: (tag: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    onReset: () => void;
  };
}

export const useTaskCreateController = (): TaskCreateControllerResponse => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state) => state.tasks);
  const { user } = useAppSelector((state) => state.auth);
  const { developers } = useAppSelector((state) => state.adminTasks);

  // Role-based properties
  const userRole = user?.role || "developer";
  const isAdmin = userRole === "admin";

  const [loading, setLoading] = useState(false);
  const [dueDate, setDueDate] = useState<Date>();
  const [newTag, setNewTag] = useState("");

  const initialFormData: TaskFormData = useMemo(
    () => ({
      title: "",
      description: "",
      status: "Todo",
      priority: "Medium",
      type: "Task",
      dueDate: "",
      estimatedHours: undefined,
      tags: [],
      assignedTo: undefined,
    }),
    []
  );

  // Load developers for admin users
  useEffect(() => {
    if (isAdmin && developers.length === 0) {
      dispatch(adminGetDevelopers());
    }
  }, [dispatch, isAdmin, developers.length]);

  const [formData, setFormData] = useState<TaskFormData>(initialFormData);

  // Memoized computed values
  const isFormValid = useMemo(() => {
    return (
      formData.title.trim().length > 0 && formData.description.trim().length > 0
    );
  }, [formData.title, formData.description]);

  const isFormDirty = useMemo(() => {
    return (
      JSON.stringify(formData) !== JSON.stringify(initialFormData) ||
      dueDate !== undefined
    );
  }, [formData, dueDate, initialFormData]);

  const handleInputChange = useCallback(
    (field: keyof TaskFormData, value: TaskFormData[keyof TaskFormData]) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handleDueDateChange = useCallback((date: Date | undefined) => {
    setDueDate(date);
  }, []);

  const handleNewTagChange = useCallback((value: string) => {
    setNewTag(value);
  }, []);

  const handleAddTag = useCallback(() => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  }, [newTag, formData.tags]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!isFormValid) {
        toast.error("Please fill in all required fields");
        return;
      }

      setLoading(true);
      try {
        const taskData = {
          ...formData,
          dueDate: dueDate ? dueDate.toISOString() : undefined,
        };

        const result = await dispatch(createTask(taskData));

        if (createTask.fulfilled.match(result)) {
          toast.success("Task created successfully!");

          // Refresh the tasks list
          dispatch(
            getAllTasks({
              page: 1,
              limit: 10,
              sortBy: "createdAt",
              sortOrder: "desc",
            })
          );

          // Navigate back to task list based on role
          if (isAdmin) {
            navigate(PAGE_ROUTES.ADMIN.TASK.ALL);
          } else {
            navigate(PAGE_ROUTES.DEVELOPER.TASK.ALL);
          }
        } else {
          const errorPayload = result.payload as {
            message: string;
            code?: string;
            retry?: boolean;
          };
          const errorMessage = errorPayload?.message || "Failed to create task";

          if (
            errorPayload?.code === "DUPLICATE_TASK_ID" &&
            errorPayload?.retry
          ) {
            toast.error(errorMessage + " Please try again.");
          } else {
            toast.error(errorMessage);
          }
        }
      } catch (error) {
        console.error("Create task error:", error);
        toast.error("Failed to create task");
      } finally {
        setLoading(false);
      }
    },
    [formData, dueDate, dispatch, navigate, isFormValid, isAdmin]
  );

  const handleCancel = useCallback(() => {
    if (isFormDirty) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!confirmLeave) return;
    }
    // Navigate back to task list based on role
    if (isAdmin) {
      navigate(PAGE_ROUTES.ADMIN.TASK.ALL);
    } else {
      navigate(PAGE_ROUTES.DEVELOPER.TASK.ALL);
    }
  }, [navigate, isFormDirty, isAdmin]);

  const handleReset = useCallback(() => {
    setFormData(initialFormData);
    setDueDate(undefined);
    setNewTag("");
  }, [initialFormData]);

  return {
    getters: {
      formData,
      loading,
      dueDate,
      newTag,
      isFormValid,
      isFormDirty,
      error,
      // Role-based properties
      isAdmin,
      developers,
    },
    handlers: {
      onInputChange: handleInputChange,
      onDueDateChange: handleDueDateChange,
      onNewTagChange: handleNewTagChange,
      onAddTag: handleAddTag,
      onRemoveTag: handleRemoveTag,
      onSubmit: handleSubmit,
      onCancel: handleCancel,
      onReset: handleReset,
    },
  };
};
