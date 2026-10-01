// Shared with backend/src/config/constants.js. Change both together.
export const LIMITS = {
  name: { min: 2, max: 50 },
  email: { max: 120 },
  password: { min: 6, max: 72 },
  projectName: { min: 2, max: 80 },
  projectDescription: { max: 300 },
  taskTitle: { min: 2, max: 120 },
  taskDescription: { max: 500 },
};
