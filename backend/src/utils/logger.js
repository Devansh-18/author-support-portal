export const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

const DEFAULT_TRANSPORT = (entry) => {
  const line = JSON.stringify(entry);
  if (entry.level === 'error') {
    console.error(line);
  } else if (entry.level === 'warn') {
    console.warn(line);
  } else {
    console.log(line);
  }
};

/**
 * Normalizes input metadata or error into structured format.
 *
 * @param {any} metaOrError
 * @returns {{ meta?: any, error?: { name: string, message: string, stack?: string } }}
 */
function normalizePayload(metaOrError) {
  if (metaOrError === null || metaOrError === undefined) {
    return {};
  }

  if (metaOrError instanceof Error) {
    return {
      error: {
        name: metaOrError.name,
        message: metaOrError.message,
        stack: metaOrError.stack
      }
    };
  }

  if (typeof metaOrError === 'object' && !Array.isArray(metaOrError)) {
    return { meta: metaOrError };
  }

  return { meta: { value: metaOrError } };
}

/**
 * Creates a functional structured logger.
 *
 * @param {object} [options={}]
 * @param {string} [options.name='author-support-backend']
 * @param {keyof typeof LOG_LEVELS} [options.minLevel='info']
 * @param {(entry: object) => void} [options.transport=DEFAULT_TRANSPORT]
 */
export function createLogger(options = {}) {
  const name = options.name || 'author-support-backend';
  const initialMinLevel = options.minLevel || 'info';
  const transport = options.transport || DEFAULT_TRANSPORT;

  if (LOG_LEVELS[initialMinLevel] === undefined) {
    throw new Error(
      `Invalid minLevel "${initialMinLevel}". Allowed levels: ${Object.keys(LOG_LEVELS).join(', ')}`
    );
  }

  let currentMinLevel = initialMinLevel;

  function log(level, message, metaOrError) {
    if (LOG_LEVELS[level] < LOG_LEVELS[currentMinLevel]) {
      return;
    }

    const payload = normalizePayload(metaOrError);

    const entry = {
      timestamp: new Date().toISOString(),
      level,
      service: name,
      message: typeof message === 'string' ? message : String(message),
      ...payload
    };

    transport(entry);
  }

  return {
    debug: (msg, meta) => log('debug', msg, meta),
    info: (msg, meta) => log('info', msg, meta),
    warn: (msg, meta) => log('warn', msg, meta),
    error: (msg, meta) => log('error', msg, meta),
    getMinLevel: () => currentMinLevel,
    setMinLevel: (level) => {
      if (LOG_LEVELS[level] === undefined) {
        throw new Error(`Invalid log level "${level}". Allowed levels: ${Object.keys(LOG_LEVELS).join(', ')}`);
      }
      currentMinLevel = level;
    }
  };
}

/**
 * Shared backend application logger instance for all apis, configs, and modules.
 */
export const logger = createLogger({
  name: 'author-support-backend',
  minLevel: 'info'
});

/**
 * Dynamically configures the logger minimum level based on validated environment config.
 *
 * @param {string} level
 */
export function configureLoggerLevel(level) {
  logger.setMinLevel(level);
}
