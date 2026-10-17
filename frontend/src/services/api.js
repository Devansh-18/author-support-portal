const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Centralized fetch client for BookLeaf Support Portal.
 * Handles JWT header injection, response assertions, and standardized AppError parsing.
 *
 * @param {string} endpoint
 * @param {RequestInit} [options={}]
 * @returns {Promise<any>}
 */
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('bookleaf_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const url = `${API_BASE_URL}${endpoint}`;

  let response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch (netErr) {
    throw new Error(`Network connection error: Unable to reach BookLeaf server at ${API_BASE_URL}`);
  }

  let data = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  }

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || `HTTP error ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.details = data?.details || null;
    err.name = data?.error || 'ApiError';

    if (response.status === 401) {
      localStorage.removeItem('bookleaf_token');
      localStorage.removeItem('bookleaf_user');
      window.dispatchEvent(new Event('bookleaf_auth_expired'));
    }

    throw err;
  }

  return data;
}
