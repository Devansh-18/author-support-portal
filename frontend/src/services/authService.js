import { apiRequest } from './api.js';

export const authService = {
  /**
   * Log in with email and password.
   */
  async login({ email, password }) {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data.token) {
      localStorage.setItem('bookleaf_token', data.token);
      localStorage.setItem('bookleaf_user', JSON.stringify(data.user));
    }
    return data;
  },

  /**
   * Fetch current session profile.
   */
  async getMe() {
    return apiRequest('/auth/me', { method: 'GET' });
  },

  /**
   * Log out.
   */
  logout() {
    localStorage.removeItem('bookleaf_token');
    localStorage.removeItem('bookleaf_user');
  },

  /**
   * Get cached user from localStorage.
   */
  getCachedUser() {
    try {
      const raw = localStorage.getItem('bookleaf_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
};
