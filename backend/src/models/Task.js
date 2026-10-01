import mongoose from 'mongoose';
import { TASK_STATUSES, limits } from '../config/constants.js';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: limits.taskTitle.min,
      maxlength: limits.taskTitle.max,
    },
    description: {
      type: String,
      trim: true,
      maxlength: limits.taskDescription.max,
      default: '',
    },
    status: {
      type: String,
      enum: TASK_STATUSES,
      default: 'todo',
      index: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

export const Task = mongoose.model('Task', taskSchema);
