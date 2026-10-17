import { apiRequest } from './api.js';

export const bookService = {
  /**
   * Fetch books with optional status filter and sort parameters.
   *
   * @param {object} [params={}]
   * @param {string} [params.status]
   * @param {string} [params.sortBy]
   * @param {string} [params.sortOrder]
   * @param {string} [params.authorId]
   */
  async getBooks(params = {}) {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.sortOrder) query.set('sortOrder', params.sortOrder);
    if (params.authorId) query.set('authorId', params.authorId);

    const queryString = query.toString();
    const endpoint = queryString ? `/books?${queryString}` : '/books';
    return apiRequest(endpoint, { method: 'GET' });
  },

  /**
   * Fetch single book by ID.
   *
   * @param {string} id
   */
  async getBookById(id) {
    return apiRequest(`/books/${id}`, { method: 'GET' });
  }
};
