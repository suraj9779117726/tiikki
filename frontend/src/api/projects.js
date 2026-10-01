import { api } from './client';

export async function listProjects(token) {
  const data = await api('/api/projects', { token });
  return data.projects;
}

export async function createProject(token, body) {
  const data = await api('/api/projects', { method: 'POST', token, body });
  return data.project;
}

export async function getProject(token, projectId) {
  const data = await api(`/api/projects/${projectId}`, { token });
  return data.project;
}

export async function updateProject(token, projectId, body) {
  const data = await api(`/api/projects/${projectId}`, {
    method: 'PUT',
    token,
    body,
  });
  return data.project;
}

export async function deleteProject(token, projectId) {
  return api(`/api/projects/${projectId}`, { method: 'DELETE', token });
}
