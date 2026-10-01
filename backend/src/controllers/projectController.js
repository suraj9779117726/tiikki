import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const toProject = (project, counts = {}) => ({
  id: project._id,
  name: project.name,
  description: project.description,
  taskCount: counts.total || 0,
  doneCount: counts.done || 0,
  createdAt: project.createdAt,
  updatedAt: project.updatedAt,
});

export const listProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ owner: req.user._id }).sort({
    updatedAt: -1,
  });
  const counts = await Task.aggregate([
    {
      $match: {
        owner: req.user._id,
        project: { $in: projects.map((project) => project._id) },
      },
    },
    {
      $group: {
        _id: '$project',
        total: { $sum: 1 },
        done: {
          $sum: {
            $cond: [{ $eq: ['$status', 'done'] }, 1, 0],
          },
        },
      },
    },
  ]);
  const countById = new Map(counts.map((row) => [String(row._id), row]));

  res.json({
    success: true,
    data: {
      projects: projects.map((project) =>
        toProject(project, countById.get(String(project._id))),
      ),
    },
  });
});

export const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create({
    name: req.body.name,
    description: req.body.description || '',
    owner: req.user._id,
  });

  res.status(201).json({
    success: true,
    data: { project: toProject(project) },
  });
});

export const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findOne({
    _id: req.params.id,
    owner: req.user._id,
  });
  if (!project) {
    throw new AppError('Project not found', 404);
  }

  res.json({
    success: true,
    data: { project: toProject(project) },
  });
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    { name: req.body.name, description: req.body.description || '' },
    { new: true, runValidators: true },
  );

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  res.json({
    success: true,
    data: { project: toProject(project) },
  });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findOneAndDelete({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  await Task.deleteMany({ project: project._id, owner: req.user._id });

  res.json({
    success: true,
    data: { id: project._id },
  });
});
