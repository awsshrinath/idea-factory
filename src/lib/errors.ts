const errorMap: Record<string, string> = {
  // Network Errors
  'UNEXPECTED_ERROR': 'An unexpected error occurred. Please try again later.',
  'NETWORK_ERROR': 'A network error occurred. Please check your connection.',

  // Authentication Errors
  'UNAUTHENTICATED': 'You are not authenticated. Please log in.',
  'FORBIDDEN': 'You do not have permission to perform this action.',
  'TOKEN_EXPIRED': 'Your session has expired. Please log in again.',

  // Validation Errors
  'VALIDATION_FAILED': 'The information provided is invalid. Please check and try again.',
  'MISSING_FIELD': 'A required field is missing.',

  // Server Errors
  'INTERNAL_SERVER_ERROR': 'The server encountered an error. Please try again later.',
  'SERVICE_UNAVAILABLE': 'The service is currently unavailable. Please try again later.',

  // Add other specific error codes from your backend here
};

export const getErrorMessage = (errorCode?: string): string => {
  if (errorCode && errorMap[errorCode]) {
    return errorMap[errorCode];
  }
  return errorMap['UNEXPECTED_ERROR'];
}; 