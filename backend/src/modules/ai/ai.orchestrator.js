import { logger } from '../../utils/logger.js';
import { getAiProvider } from './providers/aiProviderFactory.js';
import { resolveContextRoute } from './templates/promptTemplates.js';
import { Ticket } from '../tickets/ticket.model.js';
import '../users/user.model.js';
import '../books/book.model.js';
import { AI_STATUSES } from '@author-support/contracts';

/**
 * Executes background AI analysis for a ticket with exponential backoff retries.
 *
 * @param {object} params
 * @param {string} params.ticketId - MongoDB ObjectId or ticketNumber
 * @param {import('mongoose').Model} [params.ticketModel=Ticket]
 * @param {import('./providers/baseAiProvider.js').BaseAiProvider} [params.aiProvider]
 * @param {number} [params.maxRetries=3]
 * @param {number} [params.initialDelayMs=1000]
 * @param {number} [params.maxDelayMs=8000]
 * @returns {Promise<boolean>} True if analysis succeeded, false otherwise
 */
export async function analyzeTicketInBackground({
  ticketId,
  ticketModel = Ticket,
  aiProvider = null,
  maxRetries = 3,
  initialDelayMs = 1000,
  maxDelayMs = 8000
}) {
  let ticketDoc;
  try {
    let query = ticketModel.findById(ticketId);
    if (typeof query.select === 'function') {
      query = query.select('ticketNumber subject description author book');
    }
    ticketDoc = await query
      .populate('author', 'name')
      .populate('book', 'title isbn status mrp royaltyPending');

    if (!ticketDoc) {
      logger.warn('AI analysis skipped: Ticket not found', { ticketId });
      return false;
    }

    // Mark status as processing
    await ticketModel.findByIdAndUpdate(ticketDoc._id, {
      $set: { aiStatus: AI_STATUSES.PROCESSING }
    });
  } catch (dbError) {
    logger.error('Failed to initialize AI analysis for ticket', { ticketId, error: dbError.message });
    return false;
  }

  // Resolve 3-Tier context route and log route selection
  const { route, exemplars } = resolveContextRoute({
    subject: ticketDoc.subject,
    description: ticketDoc.description
  });

  logger.info('AI knowledge routing', {
    ticketNumber: ticketDoc.ticketNumber,
    route
  });

  const provider = aiProvider || getAiProvider();
  let attempts = 0;
  let analysisResult = null;
  let lastError = null;

  while (attempts <= maxRetries) {
    try {
      attempts++;
      analysisResult = await provider.analyzeTicket({
        ticket: {
          ticketNumber: ticketDoc.ticketNumber,
          subject: ticketDoc.subject,
          description: ticketDoc.description
        },
        book: ticketDoc.book ? {
          title: ticketDoc.book.title,
          isbn: ticketDoc.book.isbn,
          status: ticketDoc.book.status,
          mrp: ticketDoc.book.mrp,
          royaltyPending: ticketDoc.book.royaltyPending
        } : null,
        author: {
          name: ticketDoc.author ? ticketDoc.author.name : 'Author'
        },
        exemplars
      });

      // Succeeded! Break loop
      break;
    } catch (err) {
      lastError = err;
      const isRetryable = typeof provider.isRetryable === 'function' ? provider.isRetryable(err) : false;

      logger.warn('AI ticket analysis attempt encountered an error', {
        ticketNumber: ticketDoc.ticketNumber,
        attempt: attempts,
        maxRetries,
        isRetryable,
        errorMessage: err.message
      });

      if (!isRetryable || attempts > maxRetries) {
        // Permanent error or exhausted retries: stop immediately
        break;
      }

      // Calculate exponential backoff delay with jitter
      const exponentialDelay = initialDelayMs * Math.pow(2, attempts - 1);
      const jitter = Math.floor(Math.random() * 250);
      const delayMs = Math.min(exponentialDelay + jitter, maxDelayMs);

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  // Handle final result
  try {
    if (analysisResult) {
      await ticketModel.findByIdAndUpdate(ticketDoc._id, {
        $set: {
          category: analysisResult.category,
          priority: analysisResult.priority,
          aiDraftResponse: analysisResult.draftResponse,
          aiStatus: AI_STATUSES.COMPLETED
        }
      });

      logger.info('AI ticket analysis completed successfully', {
        ticketNumber: ticketDoc.ticketNumber,
        category: analysisResult.category,
        priority: analysisResult.priority
      });
      return true;
    } else {
      // Mark as failed, keep category and priority as 'N/A'
      await ticketModel.findByIdAndUpdate(ticketDoc._id, {
        $set: {
          aiStatus: AI_STATUSES.FAILED
        }
      });

      logger.error('AI ticket analysis permanently failed', {
        ticketNumber: ticketDoc.ticketNumber,
        totalAttempts: attempts,
        error: lastError ? lastError.message : 'Unknown failure'
      });
      return false;
    }
  } catch (updateError) {
    logger.error('Failed to persist AI analysis status to ticket', {
      ticketNumber: ticketDoc.ticketNumber,
      error: updateError.message
    });
    return false;
  }
}
