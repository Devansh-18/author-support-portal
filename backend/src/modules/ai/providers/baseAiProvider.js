/**
 * Abstract Base Class for AI Providers.
 * Adheres to Strategy/Adapter pattern for extensible third-party integrations (Rule 1 of AGENTS.md).
 */
export class BaseAiProvider {
  /**
   * Analyzes an author support query to produce category classification, priority score, and draft reply.
   *
   * @param {object} params
   * @param {object} params.ticket - { ticketNumber, subject, description }
   * @param {object|null} [params.book] - Optional book details { title, isbn, status, mrp, totalCopiesSold, royaltyPending }
   * @param {object} params.author - Author details { name, email, authorId }
   * @returns {Promise<{ category: string, priority: string, draftResponse: string }>}
   */
  async analyzeTicket({ ticket, book, author }) {
    throw new Error('Method analyzeTicket() must be implemented by concrete AI provider');
  }
}
