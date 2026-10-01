import { api } from './client';

export async function listTasks(token, projectId) {
  const data = await api(`/api/projects/${projectId}/tasks`, { token });
  return data.tasks;
}

export async function createTask(token, projectId, body) {
  const data = await api(`/api/projects/${projectId}/tasks`, {
    method: 'POST',
    token,
    body,
  });
  return data.task;
}

export async function updateTask(token, taskId, body) {
  const data = await api(`/api/tasks/${taskId}`, {
    method: 'PUT',
    token,
    body,
  });
  return data.task;
}

export async function deleteTask(token, taskId) {
  return api(`/api/tasks/${taskId}`, { method: 'DELETE', token });
}
