import { TOKEN_KEY } from '../constants/storage';

function apiUrl() {
  const configured = import.meta.env.VITE_API_URL;
  if (!configured) {
    throw new Error('VITE_API_URL is not set');
  }
  return configured.replace(/\/$/, '');
}

export async function api(path, { method = 'GET', body, token } = {}) {
  let response;
  try {
    response = await fetch(`${apiUrl()}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error(
      'Unable to reach the server. Check your connection and try again.',
    );
  }

  let payload = {};
  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  if (response.status === 401 && token) {
    localStorage.removeItem(TOKEN_KEY);
    if (!window.location.pathname.startsWith('/login')) {
      window.location.assign('/login');
    }
  }

  if (!response.ok) {
    throw new Error(payload.message || 'Request failed');
  }

  return payload.data;
}
