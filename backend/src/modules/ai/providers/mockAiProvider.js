import { BaseAiProvider } from './baseAiProvider.js';
import { TICKET_CATEGORIES, TICKET_PRIORITIES } from '@author-support/contracts';

/**
 * Deterministic offline AI Provider for Hermetic Testing (Rule 4 of AGENTS.md).
 */
export class MockAiProvider extends BaseAiProvider {
  /**
   * @param {object} [options]
   * @param {boolean} [options.shouldFail=false]
   * @param {boolean} [options.isRetryableError=false]
   */
  constructor({ shouldFail = false, isRetryableError = false } = {}) {
    super();
    this.shouldFail = shouldFail;
    this.isRetryableError = isRetryableError;
    this.callCount = 0;
  }

  isRetryable(error) {
    return Boolean(error && error.isRetryable);
  }

  async analyzeTicket({ ticket, book, author }) {
    this.callCount++;

    if (this.shouldFail) {
      const err = new Error('Mock AI Provider intentional failure');
      err.isRetryable = this.isRetryableError;
      throw err;
    }

    const text = `${ticket.subject} ${ticket.description}`.toLowerCase();

    let category = TICKET_CATEGORIES.GENERAL_INQUIRY;
    let priority = TICKET_PRIORITIES.MEDIUM;

    if (text.includes('royalty') || text.includes('payout') || text.includes('payment')) {
      category = TICKET_CATEGORIES.ROYALTY_AND_PAYMENTS;
      priority = text.includes('delay') || text.includes('not received') || text.includes('haven\'t')
        ? TICKET_PRIORITIES.HIGH
        : TICKET_PRIORITIES.MEDIUM;
    } else if (text.includes('isbn') || text.includes('barcode')) {
      category = TICKET_CATEGORIES.ISBN_AND_METADATA;
      priority = TICKET_PRIORITIES.CRITICAL;
    } else if (text.includes('print') || text.includes('blurry') || text.includes('defect') || text.includes('quality')) {
      category = TICKET_CATEGORIES.PRINTING_AND_QUALITY;
      priority = TICKET_PRIORITIES.HIGH;
    } else if (text.includes('amazon') || text.includes('unavailable') || text.includes('flipkart') || text.includes('stock')) {
      category = TICKET_CATEGORIES.DISTRIBUTION_AND_AVAILABILITY;
      priority = TICKET_PRIORITIES.CRITICAL;
    } else if (text.includes('typesetting') || text.includes('cover') || text.includes('stage') || text.includes('proof')) {
      category = TICKET_CATEGORIES.BOOK_STATUS_AND_PRODUCTION;
      priority = TICKET_PRIORITIES.MEDIUM;
    }

    const draftResponse = `Hello ${author.name}, thank you for reaching out to BookLeaf Publishing regarding "${ticket.subject}". Our team is reviewing your query and will update you shortly.`;

    return {
      category,
      priority,
      draftResponse
    };
  }
}
