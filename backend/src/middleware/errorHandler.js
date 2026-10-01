import { AppError } from '../utils/AppError.js';

export const notFound = (req, _res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

export const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';

  if (err.code === 11000) {
    statusCode = 409;
    message = 'A record with this value already exists';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid id';
  } else if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Invalid JSON body';
  }

  if (statusCode >= 500) {
    message = 'Something went wrong';
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
