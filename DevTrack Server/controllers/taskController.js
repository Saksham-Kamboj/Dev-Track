import Task from "../models/Task.js";
import User from "../models/User.js";

// Create a new task
export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      type,
      dueDate,
      estimatedHours,
      tags,
      assignedTo,
    } = req.body;

    // Validate input
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    // Validate assignedTo user exists
    if (assignedTo) {
      const assignedUser = await User.findById(assignedTo);
      if (!assignedUser) {
        return res.status(400).json({
          success: false,
          message: "Assigned user not found",
        });
      }
    }

    // Generate unique task ID
    let taskId;
    let counter = 1;

    // Get all existing task IDs and find the highest number
    const existingTasks = await Task.find({}, { taskId: 1 }).sort({
      taskId: -1,
    });

    if (existingTasks.length > 0) {
      // Extract numbers from all task IDs and find the maximum
      const taskNumbers = existingTasks
        .map((task) => {
          // Check if taskId exists and is a string
          if (!task.taskId || typeof task.taskId !== "string") {
            return 0;
          }
          const match = task.taskId.match(/TSK-(\d+)/);
          return match ? parseInt(match[1]) : 0;
        })
        .filter((num) => !isNaN(num) && num > 0);

      if (taskNumbers.length > 0) {
        counter = Math.max(...taskNumbers) + 1;
      }
    }

    // Generate the new task ID
    taskId = `TSK-${String(counter).padStart(4, "0")}`;

    // Double-check uniqueness (safety measure)
    const existingTask = await Task.findOne({ taskId });
    if (existingTask) {
      // If somehow still exists, use timestamp-based approach
      const timestamp = Date.now().toString().slice(-4);
      taskId = `TSK-${timestamp}`;
    }

    const taskData = {
      taskId,
      title,
      description,
      status: status || "Todo",
      priority: priority || "Medium",
      type: type || "Task",
      dueDate: dueDate ? new Date(dueDate) : null,
      estimatedHours: estimatedHours || null,
      tags: tags || [],
      assignedTo: assignedTo || req.user._id,
      createdBy: req.user._id,
    };

    // Create task with retry mechanism for race conditions
    let task;
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        task = new Task(taskData);
        await task.save();
        await task.populate([
          { path: "assignedTo", select: "name email role" },
          { path: "createdBy", select: "name email role" },
        ]);
        break; // Success, exit retry loop
      } catch (saveError) {
        if (saveError.code === 11000 && retryCount < maxRetries - 1) {
          // Duplicate key error, regenerate task ID and retry
          retryCount++;
          console.log(
            `Task ID collision, retrying... (attempt ${retryCount + 1})`
          );

          // Generate new task ID with timestamp suffix
          const timestamp = Date.now().toString().slice(-3);
          const newCounter = counter + retryCount;
          taskData.taskId = `TSK-${String(newCounter).padStart(
            4,
            "0"
          )}-${timestamp}`;
        } else {
          throw saveError; // Re-throw if not a duplicate key error or max retries reached
        }
      }
    }

    // Transform task for frontend
    const transformedTask = {
      id: task._id.toString(),
      taskId: task.taskId,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      type: task.type,
      dueDate: task.dueDate,
      estimatedHours: task.estimatedHours,
      actualHours: task.actualHours,
      tags: task.tags,
      assignedTo: task.assignedTo || null,
      createdBy: task.createdBy || null,
      completedAt: task.completedAt,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: transformedTask,
    });
  } catch (error) {
    console.error("Create task error:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Task ID already exists. Please try again.",
        error: "DUPLICATE_TASK_ID",
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while creating task",
    });
  }
};

// Get all tasks (with filtering and pagination)
export const getTasks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      status,
      priority,
      type,
      search,
      assignedTo,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter query
    const filter = {};

    // Role-based filtering
    if (req.user.role === "developer") {
      filter.assignedTo = req.user._id;
    } else if (assignedTo) {
      filter.assignedTo = assignedTo;
    }

    // Status filter
    if (status) {
      filter.status = Array.isArray(status) ? { $in: status } : status;
    }

    // Priority filter
    if (priority) {
      filter.priority = Array.isArray(priority) ? { $in: priority } : priority;
    }

    // Type filter
    if (type) {
      filter.type = Array.isArray(type) ? { $in: type } : type;
    }

    // Search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { taskId: { $regex: search, $options: "i" } },
        { assignedTo: { $regex: search, $options: "i" } },
        { createdBy: { $regex: search, $options: "i" } },
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sort configuration
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query
    const tasks = await Task.find(filter)
      .populate([
        { path: "assignedTo", select: "name email role" },
        { path: "createdBy", select: "name email role" },
      ])
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Task.countDocuments(filter);

    // Transform tasks for frontend
    const transformedTasks = tasks.map((task) => ({
      id: task._id.toString(),
      taskId: task.taskId,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      type: task.type,
      dueDate: task.dueDate,
      estimatedHours: task.estimatedHours,
      actualHours: task.actualHours,
      tags: task.tags,
      assignedTo: task.assignedTo || null,
      createdBy: task.createdBy || null,
      completedAt: task.completedAt,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }));

    res.json({
      success: true,
      tasks: transformedTasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      status,
      priority,
      type,
      dueDate,
      estimatedHours,
      actualHours,
      tags,
      assignedTo,
    } = req.body;

    // Find task
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check permissions
    const canEdit =
      req.user.role === "admin" ||
      task.assignedTo.toString() === req.user._id.toString() ||
      task.createdBy.toString() === req.user._id.toString();

    if (!canEdit) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this task",
      });
    }

    // Validate assignedTo user if provided
    if (assignedTo && assignedTo !== task.assignedTo?.toString()) {
      const assignedUser = await User.findById(assignedTo);
      if (!assignedUser) {
        return res.status(400).json({
          success: false,
          message: "Assigned user not found",
        });
      }
    }

    // Update task fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (type !== undefined) task.type = type;
    if (dueDate !== undefined)
      task.dueDate = dueDate ? new Date(dueDate) : null;
    if (estimatedHours !== undefined) task.estimatedHours = estimatedHours;
    if (actualHours !== undefined) task.actualHours = actualHours;
    if (tags !== undefined) task.tags = tags;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;

    await task.save();
    await task.populate([
      { path: "assignedTo", select: "name email role" },
      { path: "createdBy", select: "name email role" },
    ]);

    // Transform task for frontend
    const transformedTask = {
      id: task._id.toString(),
      taskId: task.taskId,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      type: task.type,
      dueDate: task.dueDate,
      estimatedHours: task.estimatedHours,
      actualHours: task.actualHours,
      tags: task.tags,
      assignedTo: task.assignedTo || null,
      createdBy: task.createdBy || null,
      completedAt: task.completedAt,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };

    res.json({
      success: true,
      message: "Task updated successfully",
      task: transformedTask,
    });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Find task
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check permissions
    const canDelete =
      req.user.role === "admin" ||
      task.createdBy.toString() === req.user._id.toString();

    if (!canDelete) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this task",
      });
    }

    await Task.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get task by ID
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id).populate([
      { path: "assignedTo", select: "name email role" },
      { path: "createdBy", select: "name email role" },
      { path: "comments.author", select: "name email role" },
    ]);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check permissions
    const canView =
      req.user.role === "admin" ||
      (task.assignedTo &&
        task.assignedTo._id.toString() === req.user._id.toString()) ||
      (task.createdBy &&
        task.createdBy._id.toString() === req.user._id.toString());

    if (!canView) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to view this task",
      });
    }

    // Transform task for frontend
    const transformedTask = {
      id: task._id.toString(),
      taskId: task.taskId,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      type: task.type,
      dueDate: task.dueDate,
      estimatedHours: task.estimatedHours,
      actualHours: task.actualHours,
      tags: task.tags,
      assignedTo: task.assignedTo || null,
      createdBy: task.createdBy || null,
      completedAt: task.completedAt,
      comments: task.comments,
      attachments: task.attachments,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };

    res.json({
      success: true,
      task: transformedTask,
    });
  } catch (error) {
    console.error("Get task by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Add comment to task
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check permissions
    const canComment =
      req.user.role === "admin" ||
      (task.assignedTo &&
        task.assignedTo.toString() === req.user._id.toString()) ||
      (task.createdBy && task.createdBy.toString() === req.user._id.toString());

    if (!canComment) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to comment on this task",
      });
    }

    task.comments.push({
      text: text.trim(),
      author: req.user._id,
    });

    await task.save();
    await task.populate("comments.author", "name email role");

    res.json({
      success: true,
      message: "Comment added successfully",
      comment: task.comments[task.comments.length - 1],
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Utility function to get next available task ID
export const getNextTaskId = async () => {
  try {
    // Get all existing task IDs and find the highest number
    const existingTasks = await Task.find({}, { taskId: 1 }).sort({
      taskId: -1,
    });
    let counter = 1;

    if (existingTasks.length > 0) {
      // Extract numbers from all task IDs and find the maximum
      const taskNumbers = existingTasks
        .map((task) => {
          const match = task.taskId.match(/TSK-(\d+)/);
          return match ? parseInt(match[1]) : 0;
        })
        .filter((num) => !isNaN(num));

      if (taskNumbers.length > 0) {
        counter = Math.max(...taskNumbers) + 1;
      }
    }

    return `TSK-${String(counter).padStart(4, "0")}`;
  } catch (error) {
    console.error("Error generating task ID:", error);
    // Fallback to timestamp-based ID
    const timestamp = Date.now().toString().slice(-4);
    return `TSK-${timestamp}`;
  }
};

// Utility function to validate task ID uniqueness
export const isTaskIdUnique = async (taskId) => {
  try {
    const existingTask = await Task.findOne({ taskId });
    return !existingTask;
  } catch (error) {
    console.error("Error checking task ID uniqueness:", error);
    return false;
  }
};
