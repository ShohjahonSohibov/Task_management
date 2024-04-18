import mongoose from 'mongoose';

export enum TaskStatus {
  Start = 'start',
  Completed = 'completed',
}

export interface TaskDocument extends mongoose.Document {
  title: string;
  description?: string;
  status: TaskStatus; // Reference the enum type
  user: mongoose.Schema.Types.ObjectId; // Reference to the User model
  created_at: Date;
  updated_at: Date;
}

const taskSchema = new mongoose.Schema<TaskDocument>(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      required: true,
      enum: TaskStatus,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Reference to User model
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { timestamps: true } // Enable automatic timestamps
);

// Optional validation (if needed)
// taskSchema.pre('save', function (next) {
//   // Add validation logic here
//   next();
// });

const Task = mongoose.model<TaskDocument>('Task', taskSchema);

export { Task,  };
