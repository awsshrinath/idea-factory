export class ApiError extends Error {
  public readonly status?: number;
  public readonly code?: string;
  public readonly details?: unknown;
  public readonly isApiClientError = true;
  public readonly timestamp: string;

  constructor(
    message: string,
    status?: number,
    code?: string,
    details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();

    // This is for correctly setting the prototype in environments like Node.js
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  /**
   * Provides a plain object representation of the error, useful for logging.
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      code: this.code,
      details: this.details,
      timestamp: this.timestamp,
      stack: this.stack,
    };
  }

  /**
   * Creates an error for network-related issues (e.g., fetch failed).
   */
  static networkError(originalError?: Error): ApiError {
    return new ApiError(
      'Network error: Please check your internet connection.',
      undefined,
      'NETWORK_ERROR',
      originalError
    );
  }

  /**
   * Creates an error for when the request is cancelled.
   */
  static cancelled(message = 'Request was cancelled'): ApiError {
    return new ApiError(message, undefined, 'REQUEST_CANCELLED');
  }

  /**
   * Creates an error for unexpected issues during the request setup or response processing.
   */
  static unknown(details?: unknown): ApiError {
    return new ApiError(
      'An unknown error occurred.',
      undefined,
      'UNKNOWN_ERROR',
      details
    );
  }
}

/**
 * Type guard to check if an error is an instance of ApiError.
 * This is useful because `instanceof` can fail across different JS realms (e.g., iframes, workers).
 * @param {unknown} error The error to check.
 * @returns {boolean} True if the error is an ApiError.
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    error instanceof ApiError ||
    (typeof error === 'object' &&
      error !== null &&
      (error as ApiError).isApiClientError === true)
  );
} 