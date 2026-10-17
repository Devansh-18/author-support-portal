import { apiRequest } from './api.js';

export const ticketService = {
  /**
   * List tickets with optional enum filters and sort parameters.
   *
   * @param {object} [params={}]
   * @param {string} [params.status]
   * @param {string} [params.category]
   * @param {string} [params.priority]
   * @param {string} [params.sortBy]
   * @param {string} [params.sortOrder]
   * @param {string} [params.authorId]
   */
  async getTickets(params = {}) {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.category) query.set('category', params.category);
    if (params.priority) query.set('priority', params.priority);
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.sortOrder) query.set('sortOrder', params.sortOrder);
    if (params.authorId) query.set('authorId', params.authorId);

    const queryString = query.toString();
    const endpoint = queryString ? `/tickets?${queryString}` : '/tickets';
    return apiRequest(endpoint, { method: 'GET' });
  },

  /**
   * Get ticket details with replies.
   *
   * @param {string} id
   */
  async getTicketById(id) {
    return apiRequest(`/tickets/${id}`, { method: 'GET' });
  },

  /**
   * Create a new support ticket (author only).
   *
   * @param {object} payload
   * @param {string} [payload.bookId]
   * @param {string} payload.subject
   * @param {string} payload.description
   * @param {Array<object>} [payload.attachments]
   */
  async createTicket(payload) {
    return apiRequest('/tickets', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  /**
   * Add a message reply to a ticket thread.
   *
   * @param {string} ticketId
   * @param {string} message
   */
  async addReply(ticketId, message) {
    return apiRequest(`/tickets/${ticketId}/replies`, {
      method: 'POST',
      body: JSON.stringify({ message })
    });
  },

  /**
   * Fetch internal ops team notes (admin only).
   *
   * @param {string} ticketId
   */
  async getInternalNotes(ticketId) {
    return apiRequest(`/tickets/${ticketId}/notes`, { method: 'GET' });
  },

  /**
   * Add internal ops team note (admin only).
   *
   * @param {string} ticketId
   * @param {string} content
   */
  async addInternalNote(ticketId, content) {
    return apiRequest(`/tickets/${ticketId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ content })
    });
  },

  /**
   * Update ticket status (admin only).
   *
   * @param {string} ticketId
   * @param {string} status
   */
  async updateStatus(ticketId, status) {
    return apiRequest(`/tickets/${ticketId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  /**
   * Update ticket metadata (category, priority, assignedTo) (admin only).
   *
   * @param {string} ticketId
   * @param {object} metadata
   */
  async updateMetadata(ticketId, metadata) {
    return apiRequest(`/tickets/${ticketId}/metadata`, {
      method: 'PATCH',
      body: JSON.stringify(metadata)
    });
  }
};
