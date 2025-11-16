const API_BASE_URL = 'http://localhost:5001/api';

// Helper function for API requests
async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}

// ==================== PROBLEMS API ====================

export const problemsAPI = {
  getAll: () => apiRequest('/problems'),

  getById: (id) => apiRequest(`/problems/${id}`),

  create: (problem) =>
    apiRequest('/problems', {
      method: 'POST',
      body: JSON.stringify(problem),
    }),

  update: (id, problem) =>
    apiRequest(`/problems/${id}`, {
      method: 'PUT',
      body: JSON.stringify(problem),
    }),

  delete: (id) =>
    apiRequest(`/problems/${id}`, {
      method: 'DELETE',
    }),
};

// ==================== PROGRESS API ====================

export const progressAPI = {
  update: (problemId, progress) =>
    apiRequest(`/progress/${problemId}`, {
      method: 'POST',
      body: JSON.stringify(progress),
    }),

  getAll: () => apiRequest('/progress'),
};

// ==================== LESSONS API ====================

export const lessonsAPI = {
  markComplete: (lessonId) =>
    apiRequest(`/lessons/complete/${lessonId}`, {
      method: 'POST',
    }),

  getCompleted: () => apiRequest('/lessons/completed'),

  seedExercises: (lessonData) =>
    apiRequest('/seed-lesson-exercises', {
      method: 'POST',
      body: JSON.stringify(lessonData),
    }),
};
