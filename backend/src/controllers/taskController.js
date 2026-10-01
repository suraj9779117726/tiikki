import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const toTask = (task) => ({
  id: task._id,
  title: task.title,
  description: task.description,
  status: task.status,
  projectId: task.project,
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
});

const findOwnedProject = async (projectId, userId) => {
  const project = await Project.findOne({ _id: projectId, owner: userId });
  if (!project) {
    throw new AppError('Project not found', 404);
  }
  return project;
};

export const listTasks = asyncHandler(async (req, res) => {
  const project = await findOwnedProject(req.params.projectId, req.user._id);
  const tasks = await Task.find({
    project: project._id,
    owner: req.user._id,
  }).sort({
    createdAt: -1,
  });

  res.json({
    success: true,
    data: { tasks: tasks.map(toTask) },
  });
});

export const createTask = asyncHandler(async (req, res) => {
  const project = await findOwnedProject(req.params.projectId, req.user._id);
  const task = await Task.create({
    title: req.body.title,
    description: req.body.description || '',
    status: req.body.status || 'todo',
    project: project._id,
    owner: req.user._id,
  });

  res.status(201).json({
    success: true,
    data: { task: toTask(task) },
  });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
  if (!task) {
    throw new AppError('Task not found', 404);
  }

  if (req.body.title !== undefined) task.title = req.body.title;
  if (req.body.description !== undefined)
    task.description = req.body.description;
  if (req.body.status !== undefined) task.status = req.body.status;

  await task.save();

  res.json({
    success: true,
    data: { task: toTask(task) },
  });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    owner: req.user._id,
  });
  if (!task) {
    throw new AppError('Task not found', 404);
  }

  res.json({
    success: true,
    data: { id: task._id },
  });
});
