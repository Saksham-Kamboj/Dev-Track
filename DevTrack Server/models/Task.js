import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  taskId: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Todo', 'In Progress', 'Backlog', 'Done', 'Cancelled'],
    default: 'Todo'
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  type: {
    type: String,
    enum: ['Feature', 'Bug', 'Documentation', 'Enhancement', 'Task'],
    default: 'Task'
  },
  dueDate: {
    type: Date,
    default: null
  },
  estimatedHours: {
    type: Number,
    default: null
  },
  actualHours: {
    type: Number,
    default: null
  },
  tags: [{
    type: String,
    trim: true
  }],
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    text: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Pre-save hook for task status changes
taskSchema.pre('save', async function (next) {
  // Set completedAt when status changes to Done
  if (this.isModified('status')) {
    if (this.status === 'Done' && !this.completedAt) {
      this.completedAt = new Date();
    } else if (this.status !== 'Done') {
      this.completedAt = null;
    }
  }

  next();
});

export default mongoose.model('Task', taskSchema);
