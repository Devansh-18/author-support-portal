/**
 * Base Application Error class for domain and operational errors.
 * Encapsulates status code, operational flag, and JSON serialization.
 */
export class AppError extends Error {
  /**
   * @param {string} message
   * @param {number} statusCode
   * @param {any} [details=null]
   */
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;
    Error.captureStackTrace(this, this.constructor); // for logging correct place in file where err is thrown
  }

  /**
   * Serializes error for client response.
   */
  toJSON() {
    return {
      error: this.name,
      message: this.message,
      ...(this.details !== null && { details: this.details })
    };
  }
}

/**
 * 404 Not Found Error
 */
export class NotFoundError extends AppError {
  /**
   * @param {string} [message='Resource not found']
   * @param {any} [details=null]
   */
  constructor(message = 'Resource not found', details = null) {
    super(message, 404, details);
  }
}

/**
 * 400 Bad Request / Validation Error
 */
export class ValidationError extends AppError {
  /**
   * @param {string} [message='Invalid request payload']
   * @param {any} [details=null]
   */
  constructor(message = 'Invalid request payload', details = null) {
    super(message, 400, details);
  }
}

/**
 * 401 Unauthorized Error
 */
export class UnauthorizedError extends AppError {
  /**
   * @param {string} [message='Unauthorized']
   * @param {any} [details=null]
   */
  constructor(message = 'Unauthorized', details = null) {
    super(message, 401, details);
  }
}

/**
 * 403 Forbidden Error
 */
export class ForbiddenError extends AppError {
  /**
   * @param {string} [message='Forbidden']
   * @param {any} [details=null]
   */
  constructor(message = 'Forbidden', details = null) {
    super(message, 403, details);
  }
}

/**
 * 409 Conflict Error
 */
export class ConflictError extends AppError {
  /**
   * @param {string} [message='Resource conflict']
   * @param {any} [details=null]
   */
  constructor(message = 'Resource conflict', details = null) {
    super(message, 409, details);
  }
}

/**
 * 500 Configuration Error (Fail-fast startup / environment validation error)
 */
export class ConfigurationError extends AppError {
  /**
   * @param {string} message
   * @param {any} [details=null]
   */
  constructor(message, details = null) {
    super(message, 500, details);
  }
}
