/**
 * User roles in the Author Support Portal.
 */
export const USER_ROLES = Object.freeze({
  AUTHOR: 'author',
  ADMIN: 'admin'
});

/**
 * Lifecycle statuses for books.
 */
export const BOOK_STATUSES = Object.freeze({
  PUBLISHED_AND_LIVE: 'Published & Live',
  IN_PRODUCTION_COVER_DESIGN: 'In Production - Cover Design',
  IN_PRODUCTION_TYPESETTING: 'In Production - Typesetting'
});

/**
 * Print partners available in the system.
 */
export const PRINT_PARTNERS = Object.freeze({
  IN_HOUSE: 'In-House',
  REPRO_INDIA: 'Repro India',
  EPITOME_BOOKS: 'Epitome Books'
});

/**
 * Sales platforms where books are distributed.
 */
export const SALES_PLATFORMS = Object.freeze({
  AMAZON_INDIA: 'Amazon India',
  FLIPKART: 'Flipkart',
  AMAZON_US: 'Amazon US',
  AMAZON_UK: 'Amazon UK',
  BOOKLEAF_STORE: 'BookLeaf Store'
});

/**
 * Support ticket lifecycle statuses.
 */
export const TICKET_STATUSES = Object.freeze({
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed'
});

/**
 * Support ticket inquiry categories.
 */
export const TICKET_CATEGORIES = Object.freeze({
  NOT_APPLICABLE: 'N/A',
  ROYALTY_AND_PAYMENTS: 'Royalty & Payments',
  ISBN_AND_METADATA: 'ISBN & Metadata Issues',
  PRINTING_AND_QUALITY: 'Printing & Quality',
  DISTRIBUTION_AND_AVAILABILITY: 'Distribution & Availability',
  BOOK_STATUS_AND_PRODUCTION: 'Book Status & Production Updates',
  GENERAL_INQUIRY: 'General Inquiry'
});

/**
 * Operational ticket categories that an admin or AI can assign (strictly excludes 'N/A').
 */
export const EDITABLE_TICKET_CATEGORIES = Object.freeze(
  Object.values(TICKET_CATEGORIES).filter((cat) => cat !== TICKET_CATEGORIES.NOT_APPLICABLE)
);

/**
 * Support ticket priority scores.
 */
export const TICKET_PRIORITIES = Object.freeze({
  NOT_APPLICABLE: 'N/A',
  CRITICAL: 'Critical',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low'
});

/**
 * Operational ticket priorities that an admin or AI can assign (strictly excludes 'N/A').
 */
export const EDITABLE_TICKET_PRIORITIES = Object.freeze(
  Object.values(TICKET_PRIORITIES).filter((pri) => pri !== TICKET_PRIORITIES.NOT_APPLICABLE)
);

/**
 * Background AI analysis processing statuses.
 */
export const AI_STATUSES = Object.freeze({
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed'
});

