import { LIMITS } from '../constants/limits';

const lengthError = (label, length, min, max) => {
  if (min && (length < min || length > max)) {
    return `${label} must be between ${min} and ${max} characters`;
  }
  if (!min && length > max) {
    return `${label} must be at most ${max} characters`;
  }
  return '';
};

export function validateLogin(email, password) {
  const errors = {};
  if (!email.trim()) errors.email = 'Email is required';
  if (!password) errors.password = 'Password is required';
  return errors;
}

export function validateAccount({ name, email, password }) {
  const errors = {};
  const nameMessage = lengthError(
    'Name',
    name.trim().length,
    LIMITS.name.min,
    LIMITS.name.max,
  );
  if (nameMessage) errors.name = nameMessage;
  if (!email.trim() || !email.includes('@'))
    errors.email = 'Enter a valid email';
  const passwordMessage = lengthError(
    'Password',
    password.length,
    LIMITS.password.min,
    LIMITS.password.max,
  );
  if (passwordMessage) errors.password = passwordMessage;
  return errors;
}

export function validateProject(name, description) {
  const errors = {};
  const nameMessage = lengthError(
    'Project name',
    name.trim().length,
    LIMITS.projectName.min,
    LIMITS.projectName.max,
  );
  if (nameMessage) errors.name = nameMessage;
  const descriptionMessage = lengthError(
    'Description',
    description.trim().length,
    0,
    LIMITS.projectDescription.max,
  );
  if (descriptionMessage) errors.description = descriptionMessage;
  return errors;
}

export function validateTask(title, description) {
  const errors = {};
  const titleMessage = lengthError(
    'Title',
    title.trim().length,
    LIMITS.taskTitle.min,
    LIMITS.taskTitle.max,
  );
  if (titleMessage) errors.title = titleMessage;
  const descriptionMessage = lengthError(
    'Description',
    description.trim().length,
    0,
    LIMITS.taskDescription.max,
  );
  if (descriptionMessage) errors.description = descriptionMessage;
  return errors;
}
