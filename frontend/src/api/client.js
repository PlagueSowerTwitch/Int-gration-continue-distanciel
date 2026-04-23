const BASE_URL = import.meta.env.VITE_API_URL || '';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Erreur réseau');
  }
  return data;
}

export const api = {
  // Auth
  register: (email, password) =>
    request('/api/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) }),

  login: (email, password) =>
    request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  // Todos
  getTodos: () => request('/api/todos'),

  createTodo: (title) =>
    request('/api/todos', { method: 'POST', body: JSON.stringify({ title }) }),

  updateTodo: (id, data) =>
    request(`/api/todos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteTodo: (id) =>
    request(`/api/todos/${id}`, { method: 'DELETE' }),
};
