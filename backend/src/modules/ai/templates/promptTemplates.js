import { EDITABLE_TICKET_CATEGORIES, EDITABLE_TICKET_PRIORITIES } from '@author-support/contracts';
import { BOOKLEAF_KNOWLEDGE_BASE } from './knowledgeBase.js';

/**
 * Regex keyword patterns for 3-Tier dynamic context routing.
 */
export const ROUTE_KEYWORD_PATTERNS = Object.freeze({
  Royalty: /\b(royalt|payout|payment|commission|threshold|earning|earnings|money|quarter|quarterly|profit|split|bank|remittance|statement|net profit)\b/i,
  ISBN: /\b(isbn|barcode|imprint|metadata|catalog|mismatch|assigned)\b/i,
  Printing: /\b(print|printing|quality|defect|binding|blurry|misprint|misprints|damage|damaged|cover color|page|pages|paper|smudge)\b/i,
  Distribution: /\b(unavailable|currently unavailable|out of stock|stock|amazon|flipkart|listing|buy button|store|live listing)\b/i,
  Production: /\b(typeset|typesetting|proof|proofreading|editing|manuscript|pipeline|delay|delayed|stage|stages|timeline|schedule|turnaround|when will)\b/i,
  General: /\b(account|login|dashboard|profile|contact|support|help|question|process|guide|package|bestseller|standard free|portal)\b/i
});

/**
 * Resolves context route based on ticket text using 3-Tier strategy:
 * Tier 1: Domain-specific category match ('Royalty', 'ISBN', 'Printing', 'Distribution', 'Production')
 * Tier 2: General inquiry match ('General')
 * Tier 3: Ambiguous / unmatched fallback ('All' - whole knowledge base calibration exemplars)
 *
 * @param {object} params
 * @param {string} [params.subject='']
 * @param {string} [params.description='']
 * @returns {{ route: string, exemplars: Array<object> }}
 */
export function resolveContextRoute({ subject = '', description = '' }) {
  const text = `${subject} ${description}`;

  // Tier 1: Check Domain-Specific Categories
  if (ROUTE_KEYWORD_PATTERNS.Royalty.test(text)) {
    return {
      route: 'Royalty',
      exemplars: [BOOKLEAF_KNOWLEDGE_BASE.calibrationExamples[0], BOOKLEAF_KNOWLEDGE_BASE.calibrationExamples[1]]
    };
  }
  if (ROUTE_KEYWORD_PATTERNS.ISBN.test(text)) {
    return {
      route: 'ISBN',
      exemplars: [BOOKLEAF_KNOWLEDGE_BASE.calibrationExamples[2]]
    };
  }
  if (ROUTE_KEYWORD_PATTERNS.Printing.test(text)) {
    return {
      route: 'Printing',
      exemplars: [BOOKLEAF_KNOWLEDGE_BASE.calibrationExamples[3]]
    };
  }
  if (ROUTE_KEYWORD_PATTERNS.Distribution.test(text)) {
    return {
      route: 'Distribution',
      exemplars: [BOOKLEAF_KNOWLEDGE_BASE.calibrationExamples[4]]
    };
  }
  if (ROUTE_KEYWORD_PATTERNS.Production.test(text)) {
    return {
      route: 'Production',
      exemplars: [BOOKLEAF_KNOWLEDGE_BASE.calibrationExamples[5]]
    };
  }

  // Tier 2: Check General Query
  if (ROUTE_KEYWORD_PATTERNS.General.test(text)) {
    return {
      route: 'General',
      exemplars: [BOOKLEAF_KNOWLEDGE_BASE.calibrationExamples[6]]
    };
  }

  // Tier 3: Ambiguous / Unmatched Query -> Fallback to Whole Knowledge Base
  return {
    route: 'All',
    exemplars: BOOKLEAF_KNOWLEDGE_BASE.calibrationExamples
  };
}

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
 * Builds a policy-aware prompt for ticket classification, priority scoring,
 * and empathetic draft response generation with selective projection and route exemplars.
 *
 * @param {object} params
 * @param {object} params.ticket - { ticketNumber, subject, description }
 * @param {object|null} [params.book] - Selective book details { title, isbn, status, mrp, royaltyPending }
 * @param {object} params.author - { name, email? }
 * @param {Array<object>} [params.exemplars] - Route-specific calibration exemplars
 * @returns {string} Formatted prompt text for LLM
 */
export function buildTicketAnalysisPrompt({ ticket, book, author, exemplars = [] }) {
  const allowedCategories = EDITABLE_TICKET_CATEGORIES.join(', ');
  const allowedPriorities = EDITABLE_TICKET_PRIORITIES.join(', ');

  let bookContext = 'None / General account inquiry';
  if (book && book.title) {
    const parts = [`"${book.title}"`];
    if (book.isbn) parts.push(`ISBN: ${book.isbn}`);
    if (book.status) parts.push(`Status: ${book.status}`);
    if (book.mrp !== undefined) parts.push(`MRP: ₹${book.mrp}`);
    if (book.totalCopiesSold !== undefined) parts.push(`Copies Sold: ${book.totalCopiesSold}`);
    if (book.royaltyPending !== undefined) parts.push(`Pending Royalty: ₹${book.royaltyPending}`);
    bookContext = parts.join(' | ');
  }

  const authorContext = author.email
    ? `${author.name} (${author.email})`
    : author.name;

  let exemplarsSection = '';
  if (Array.isArray(exemplars) && exemplars.length > 0) {
    const lines = exemplars.map(
      (e) => `- Policy Area: ${e.category}\n  Guideline: ${e.guideline}`
    );
    exemplarsSection = `\nReference Policy Guidelines & Calibration:\n${lines.join('\n')}\n`;
  }

  return `
Author Support Inquiry:
- Author: ${authorContext}
- Associated Book: ${bookContext}
- Ticket Number: ${ticket.ticketNumber}
- Subject: ${ticket.subject}
- Description: ${ticket.description}
${exemplarsSection}
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
