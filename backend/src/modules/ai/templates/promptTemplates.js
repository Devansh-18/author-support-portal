import { EDITABLE_TICKET_CATEGORIES, EDITABLE_TICKET_PRIORITIES } from '@author-support/contracts';
import { BOOKLEAF_SYSTEM_INSTRUCTION } from './knowledgeBase.js';

/**
 * Builds the native OpenAPI/JSON schema for Gemini Structured Output.
 * Restricts output strictly to operational category and priority enums.
 *
 * @returns {object} JSON Schema specification
 */
export function buildTicketAnalysisSchema() {
  return {
    type: 'OBJECT',
    properties: {
      category: {
        type: 'STRING',
        enum: [...EDITABLE_TICKET_CATEGORIES]
      },
      priority: {
        type: 'STRING',
        enum: [...EDITABLE_TICKET_PRIORITIES]
      },
      draftResponse: {
        type: 'STRING',
        description: 'Empathetic, professional response (2 to 4 sentences, strictly under 60 words) addressing the author by first name, citing specific BookLeaf policy timelines or steps, and ending with a clear action.'
      }
    },
    required: ['category', 'priority', 'draftResponse']
  };
}

/**
 * Builds a comprehensive, policy-aware prompt for ticket classification, priority scoring,
 * and empathetic draft response generation.
 *
 * @param {object} params
 * @param {object} params.ticket - { ticketNumber, subject, description }
 * @param {object|null} [params.book] - Optional book details { title, isbn, status, mrp, ... }
 * @param {object} params.author - { name, email, authorId }
 * @returns {string} Formatted prompt text for LLM
 */
export function buildTicketAnalysisPrompt({ ticket, book, author }) {
  const allowedCategories = EDITABLE_TICKET_CATEGORIES.join(', ');
  const allowedPriorities = EDITABLE_TICKET_PRIORITIES.join(', ');

  let bookContext = 'None / General account inquiry';
  if (book && book.title) {
    const parts = [`"${book.title}"`];
    if (book.isbn) parts.push(`ISBN: ${book.isbn}`);
    if (book.status) parts.push(`Status: ${book.status}`);
    if (book.mrp) parts.push(`MRP: ₹${book.mrp}`);
    if (book.totalCopiesSold !== undefined) parts.push(`Copies Sold: ${book.totalCopiesSold}`);
    if (book.royaltyPending !== undefined) parts.push(`Pending Royalty: ₹${book.royaltyPending}`);
    bookContext = parts.join(' | ');
  }

  return `
Author Support Inquiry:
- Author: ${author.name} (${author.email})
- Associated Book: ${bookContext}
- Ticket Number: ${ticket.ticketNumber}
- Subject: ${ticket.subject}
- Description: ${ticket.description}

Task Requirements:
1. Classify the inquiry into exactly one category: [${allowedCategories}]
2. Assign an operational priority: [${allowedPriorities}]
3. Draft an empathetic, professional reply addressed to ${author.name} (first name):
   - Acknowledge their concern empathetically.
   - Accurately apply BookLeaf policies (80/20 royalty, ₹1,000 threshold, 45-day quarterly window, 5-7 days print, 24-48h stock sync, 48h ISBN escalation, free reprints on photos).
   - Be specific with operational timelines and end with a concrete next step.
   - Keep draft response concise: 2 to 4 sentences maximum (strictly under 60 words).

Return ONLY valid JSON matching this structure:
{
  "category": "one of the allowed categories",
  "priority": "one of the allowed priorities",
  "draftResponse": "empathetic 2-4 sentence draft response"
}
`.trim();
}
