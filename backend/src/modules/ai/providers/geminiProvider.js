import { BaseAiProvider } from './baseAiProvider.js';
import { buildTicketAnalysisPrompt, buildTicketAnalysisSchema } from '../templates/promptTemplates.js';
import { BOOKLEAF_SYSTEM_INSTRUCTION } from '../templates/knowledgeBase.js';
import { EDITABLE_TICKET_CATEGORIES, EDITABLE_TICKET_PRIORITIES } from '@author-support/contracts';

/**
 * Custom error wrapper for AI provider operations.
 */
export class AiProviderError extends Error {
  /**
   * @param {string} message
   * @param {object} options
   * @param {number} [options.statusCode]
   * @param {boolean} options.isRetryable
   * @param {any} [options.cause]
   */
  constructor(message, { statusCode = null, isRetryable = false, cause = null } = {}) {
    super(message);
    this.name = 'AiProviderError';
    this.statusCode = statusCode;
    this.isRetryable = isRetryable;
    this.cause = cause;
  }
}

/**
 * Concrete AI Provider communicating with Google Gemini REST API.
 */
export class GeminiAiProvider extends BaseAiProvider {
  /**
   * @param {object} config
   * @param {string} config.apiKey
   * @param {string} [config.model='gemini-3.5-flash-lite']
   * @param {number} [config.timeoutMs=15000]
   * @param {typeof fetch} [config.fetchClient=fetch]
   */
  constructor({ apiKey, model = 'gemini-3.5-flash-lite', timeoutMs = 15000, fetchClient = fetch }) {
    super();
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
      throw new Error('GeminiAiProvider requires a valid API key.');
    }
    this.apiKey = apiKey.trim();
    this.model = model.trim();
    this.timeoutMs = timeoutMs;
    this.fetchClient = fetchClient;
  }

  /**
   * Classifies error as retryable (transient) or permanent.
   *
   * @param {Error|any} error
   * @returns {boolean}
   */
  isRetryable(error) {
    if (error instanceof AiProviderError) {
      return error.isRetryable;
    }

    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      return true;
    }

    const code = error.code || (error.cause && error.cause.code);
    if (['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'EAI_AGAIN'].includes(code)) {
      return true;
    }

    return false;
  }

  /**
   * Sends prompt to Gemini REST API and parses structured analysis result.
   *
   * @param {object} params
   * @param {object} params.ticket
   * @param {object|null} [params.book]
   * @param {object} params.author
   * @returns {Promise<{ category: string, priority: string, draftResponse: string }>}
   */
  async analyzeTicket({ ticket, book = null, author }) {
    const prompt = buildTicketAnalysisPrompt({ ticket, book, author });
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(this.model)}:generateContent?key=${encodeURIComponent(this.apiKey)}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    // Gemini 3.5 & 3.1 Flash-Lite support 'minimal' for near-instant latency; 3.8 supports 'low'
    const thinkingLevel = (this.model.includes('3.5') || this.model.includes('3.1')) ? 'minimal' : 'low';

    let response;
    try {
      response = await this.fetchClient(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': this.apiKey
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: BOOKLEAF_SYSTEM_INSTRUCTION }]
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 800,
            responseMimeType: 'application/json',
            responseSchema: buildTicketAnalysisSchema(),
            thinkingConfig: {
              thinkingLevel
            }
          }
        }),
        signal: controller.signal
      });
    } catch (networkError) {
      clearTimeout(timeoutId);
      const isRetry = this.isRetryable(networkError);
      throw new AiProviderError(`Gemini Network Request Failed: ${networkError.message}`, {
        isRetryable: isRetry,
        cause: networkError
      });
    } finally {
      clearTimeout(timeoutId);
    }

    // Handle HTTP error statuses
    if (!response.ok) {
      const status = response.status;
      let errorBody = '';
      try {
        errorBody = await response.text();
      } catch (_) {
        // ignore read failure
      }

      // 429 and 5xx are retryable
      const isRetry = status === 429 || (status >= 500 && status <= 599);
      throw new AiProviderError(
        `Gemini API HTTP ${status} error: ${errorBody.slice(0, 300)}`,
        { statusCode: status, isRetryable: isRetry }
      );
    }

    const data = await response.json();

    const candidate = data.candidates && data.candidates[0];
    if (!candidate) {
      throw new AiProviderError('Gemini API returned no candidates in response', {
        isRetryable: false
      });
    }

    if (candidate.finishReason === 'SAFETY') {
      throw new AiProviderError('Gemini API blocked response due to safety policies', {
        isRetryable: false
      });
    }

    // Find the substantive non-thought text part (Google Gemini 3+ returns thoughts in parts with thought: true)
    const parts = candidate.content?.parts || [];
    const textPart = parts.find((p) => p.text && !p.thought) || parts[0];
    const rawText = textPart && textPart.text ? textPart.text.trim() : '';

    if (!rawText) {
      throw new AiProviderError('Gemini API returned empty text part', {
        isRetryable: false
      });
    }

    // Strip optional markdown json code blocks: ```json ... ```
    let cleanJson = rawText.trim();
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    }

    // Extract JSON substring if wrapped in any stray surrounding text
    const firstBrace = cleanJson.indexOf('{');
    const lastBrace = cleanJson.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
    }

    let parsed;
    try {
      parsed = JSON.parse(cleanJson);
    } catch (parseError) {
      throw new AiProviderError(
        `Gemini returned non-JSON format: ${rawText.slice(0, 150)}`,
        { isRetryable: false, cause: parseError }
      );
    }

    // Validate category and priority strictly against operational enums
    const category = EDITABLE_TICKET_CATEGORIES.includes(parsed.category)
      ? parsed.category
      : 'General Inquiry';

    const priority = EDITABLE_TICKET_PRIORITIES.includes(parsed.priority)
      ? parsed.priority
      : 'Medium';

    const draftResponse = typeof parsed.draftResponse === 'string' && parsed.draftResponse.trim() !== ''
      ? parsed.draftResponse.trim()
      : `Hello ${author.name}, thank you for reaching out to BookLeaf Publishing. Our support team is reviewing your ticket and will follow up shortly.`;

    return {
      category,
      priority,
      draftResponse
    };
  }
}
