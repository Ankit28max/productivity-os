import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Normalize a MongoDB document so it always has both `id` and `_id` set.
 * This fixes the site-wide issue where .id is used but MongoDB returns ._id.
 */
function normalizeDoc(doc) {
  if (!doc || typeof doc !== 'object') return doc;
  if (doc._id && !doc.id) {
    doc.id = doc._id;
  } else if (doc.id && !doc._id) {
    doc._id = doc.id;
  }
  return doc;
}

function normalizeResponse(data) {
  if (!data || typeof data !== 'object') return data;

  // Normalize top-level arrays
  const arrayKeys = ['tasks', 'habits', 'goals', 'notes'];
  for (const key of arrayKeys) {
    if (Array.isArray(data[key])) {
      data[key] = data[key].map(normalizeDoc);
    }
  }

  // Normalize top-level single documents
  const singleKeys = ['task', 'habit', 'goal', 'note', 'user'];
  for (const key of singleKeys) {
    if (data[key] && typeof data[key] === 'object') {
      data[key] = normalizeDoc(data[key]);
      // Normalize nested milestones inside goals
      if (key === 'goal' && Array.isArray(data[key].milestones)) {
        data[key].milestones = data[key].milestones.map(normalizeDoc);
      }
    }
  }

  return data;
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('productivityos_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => normalizeResponse(response.data),
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('productivityos_auth');
      localStorage.removeItem('productivityos_token');
      window.location.href = '/login';
    }
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
