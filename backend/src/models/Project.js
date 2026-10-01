import mongoose from 'mongoose';
import { limits } from '../config/constants.js';

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: limits.projectName.min,
      maxlength: limits.projectName.max,
    },
    description: {
      type: String,
      trim: true,
      maxlength: limits.projectDescription.max,
      default: '',
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

export const Project = mongoose.model('Project', projectSchema);
