import { body, param, validationResult } from 'express-validator';
import { TASK_STATUSES, limits } from '../config/constants.js';
import { AppError } from '../utils/AppError.js';

const handleValidation = (req, _res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    next();
    return;
  }
  const message = result
    .array()
    .map((issue) => issue.msg)
    .join(' ');
  next(new AppError(message, 400));
};

const nameRule = body('name')
  .trim()
  .isLength({ min: limits.name.min, max: limits.name.max })
  .withMessage(
    `Name must be between ${limits.name.min} and ${limits.name.max} characters`,
  );

const emailRule = body('email')
  .trim()
  .isEmail()
  .withMessage('Enter a valid email')
  .isLength({ max: limits.email.max })
  .withMessage(`Email must be at most ${limits.email.max} characters`)
  .normalizeEmail({ gmail_remove_dots: false });

const passwordRule = body('password')
  .isLength({ min: limits.password.min, max: limits.password.max })
  .withMessage(
    `Password must be between ${limits.password.min} and ${limits.password.max} characters`,
  );

const projectNameRule = body('name')
  .trim()
  .isLength({ min: limits.projectName.min, max: limits.projectName.max })
  .withMessage(
    `Project name must be between ${limits.projectName.min} and ${limits.projectName.max} characters`,
  );

const projectDescriptionRule = body('description')
  .optional()
  .trim()
  .isLength({ max: limits.projectDescription.max })
  .withMessage(
    `Description must be at most ${limits.projectDescription.max} characters`,
  );

const taskTitleRule = body('title')
  .trim()
  .isLength({ min: limits.taskTitle.min, max: limits.taskTitle.max })
  .withMessage(
    `Title must be between ${limits.taskTitle.min} and ${limits.taskTitle.max} characters`,
  );

const taskDescriptionRule = body('description')
  .optional()
  .trim()
  .isLength({ max: limits.taskDescription.max })
  .withMessage(
    `Description must be at most ${limits.taskDescription.max} characters`,
  );

const statusRule = body('status')
  .optional()
  .isIn(TASK_STATUSES)
  .withMessage('Status must be Todo, In Progress, or Done');

export const registerValidation = [
  nameRule,
  emailRule,
  passwordRule,
  handleValidation,
];

export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .normalizeEmail({ gmail_remove_dots: false }),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation,
];

export const createProjectValidation = [
  projectNameRule,
  projectDescriptionRule,
  handleValidation,
];

export const updateProjectValidation = [
  param('id').isMongoId().withMessage('Invalid id'),
  projectNameRule,
  projectDescriptionRule,
  handleValidation,
];

export const projectIdValidation = [
  param('id').isMongoId().withMessage('Invalid id'),
  handleValidation,
];

export const listTasksValidation = [
  param('projectId').isMongoId().withMessage('Invalid id'),
  handleValidation,
];

export const createTaskValidation = [
  param('projectId').isMongoId().withMessage('Invalid id'),
  taskTitleRule,
  taskDescriptionRule,
  statusRule,
  handleValidation,
];

export const updateTaskValidation = [
  param('id').isMongoId().withMessage('Invalid id'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: limits.taskTitle.min, max: limits.taskTitle.max })
    .withMessage(
      `Title must be between ${limits.taskTitle.min} and ${limits.taskTitle.max} characters`,
    ),
  taskDescriptionRule,
  statusRule,
  body().custom((value) => {
    if (
      value.title === undefined &&
      value.description === undefined &&
      value.status === undefined
    ) {
      throw new Error('Provide a title, description, or status to update');
    }
    return true;
  }),
  handleValidation,
];

export const taskIdValidation = [
  param('id').isMongoId().withMessage('Invalid id'),
  handleValidation,
];
