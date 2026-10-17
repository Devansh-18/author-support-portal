import { GeminiAiProvider } from './geminiProvider.js';
import { MockAiProvider } from './mockAiProvider.js';

let cachedProviderInstance = null;

/**
 * Creates or retrieves the configured AI provider singleton.
 *
 * @param {object} [config]
 * @param {string} [config.aiProvider] - 'gemini' | 'mock'
 * @param {string} [config.geminiApiKey]
 * @param {string} [config.geminiModel]
 * @param {boolean} [forceNew=false]
 * @returns {import('./baseAiProvider.js').BaseAiProvider}
 */
export function getAiProvider(config = {}, forceNew = false) {
  const providerType = (config.aiProvider || process.env.AI_PROVIDER || 'gemini').toLowerCase().trim();

  if (cachedProviderInstance && !forceNew) {
    if (providerType === 'gemini' && cachedProviderInstance instanceof GeminiAiProvider) {
      const activeModel = config.geminiModel || process.env.GEMINI_MODEL || 'gemini-3.8-flash';
      if (cachedProviderInstance.model === activeModel) {
        return cachedProviderInstance;
      }
    } else if (providerType === 'mock' && cachedProviderInstance instanceof MockAiProvider) {
      return cachedProviderInstance;
    }
  }

  let instance;
  if (providerType === 'mock') {
    instance = new MockAiProvider();
  } else if (providerType === 'gemini') {
    const apiKey = config.geminiApiKey || process.env.GEMINI_API_KEY;
    const model = config.geminiModel || process.env.GEMINI_MODEL || 'gemini-3.8-flash';
    instance = new GeminiAiProvider({ apiKey, model });
  } else {
    throw new Error(`Unsupported AI_PROVIDER: "${providerType}". Allowed: "gemini", "mock".`);
  }

  if (!forceNew) {
    cachedProviderInstance = instance;
  }

  return instance;
}

/**
 * Clears cached singleton (useful in unit testing).
 */
export function resetAiProviderCache() {
  cachedProviderInstance = null;
}
