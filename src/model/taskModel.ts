import mongoose, { Document, Schema } from 'mongoose';

type TaskDocument = Document & {
  user: mongoose.Types.ObjectId;
  name: string;
  completed: boolean;
  due: number;
  priority: 'Low' | 'Medium' | 'High';
  list: string;
  tags: string[];
  description?: string; 
};

const tagPattern = /^[a-zA-Z0-9-_]+$/;

const taskSchema = new Schema<TaskDocument>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Task name is required'],
  },
  completed: {
    type: Boolean,
    required: true,
    default: false,
  },
  due: {
    type: Number, // Unix timestamp
    required: true,
    default: Date.now,
  },
  priority: {
    type: String,
    required: true,
    default: 'Medium',
    enum: {
      values: ['Low', 'Medium', 'High'],
      message: 'Priority must be one of the following values: Low, Medium, High',
    },
  },
  list: {
    type: String,
    required: true,
    default: 'Inbox',
  },
  tags: {
    type: [String],
    required: true,
    default: [],
    validate: {
      validator: (tags: string[]) => tags.every(tag => tagPattern.test(tag)),
      message: 'Tags can only contain letters, numbers, hyphens, and underscores',
    },
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
}, {
  timestamps: true,
});

const Task = mongoose.model<TaskDocument>('Task', taskSchema);

export default Task;