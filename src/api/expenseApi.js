const API_BASE = '/api/v1';

async function request(url, options = {}) {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const error = await response.json();
      message = error.message || error.detail || message;
    } catch {
      // use default message
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const expenseApi = {
  getAll: () => request('/expenses'),
  create: (data) =>
    request('/expenses', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/expenses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/expenses/${id}`, { method: 'DELETE' }),
  getMonthlySummary: (year, month) =>
    request(`/expenses/summary/monthly?year=${year}&month=${month}`),
};

export const categoryApi = {
  getAll: () => request('/categories'),
  create: (data) =>
    request('/categories', { method: 'POST', body: JSON.stringify(data) }),
};
