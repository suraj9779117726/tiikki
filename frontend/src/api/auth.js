import { api } from './client';

export function register(body) {
  return api('/api/auth/register', { method: 'POST', body });
}

export function login(body) {
  return api('/api/auth/login', { method: 'POST', body });
}

export function me(token) {
  return api('/api/auth/me', { token });
}
