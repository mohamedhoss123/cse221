/**
 * Standardized API error handling
 * Eliminates duplicate try-catch blocks in service functions
 */

export interface ApiError {
  message: string;
  statusCode?: number;
  success: boolean;
}

/**
 * Standard API error handler
 * Wraps API calls and provides consistent error handling
 *
 * @param apiCall - Promise containing the API call
 * @returns Promise with response data
 * @throws Error with message from API or default error message
 */
export async function handleApiCall<T>(apiCall: Promise<any>): Promise<T> {
  try {
    const response = await apiCall;

    // Check if response has success flag and it's false
    if (response && typeof response === 'object' && 'success' in response) {
      if (!response.success) {
        throw new Error(response.message || 'API call failed');
      }

      // Return data if it exists, otherwise return the whole response
      return (response as any).data ?? response;
    }

    // For non-standard responses, just return them
    return response;
  } catch (error: any) {
    // Re-throw with a clean error message
    if (error.message) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
}

/**
 * Check if an error is a network error
 * @param error - Error object
 * @returns True if error is network-related
 */
export function isNetworkError(error: any): boolean {
  return (
    error instanceof TypeError &&
    (error.message.includes('fetch') || error.message.includes('network'))
  );
}

/**
 * Check if an error is an authentication error
 * @param error - Error object
 * @returns True if error is auth-related (401/403)
 */
export function isAuthError(error: any): boolean {
  return (
    error.statusCode === 401 ||
    error.statusCode === 403 ||
    error.message?.toLowerCase().includes('unauthorized') ||
    error.message?.toLowerCase().includes('forbidden')
  );
}

/**
 * Extract error message from various error types
 * @param error - Error object
 * @returns User-friendly error message
 */
export function getErrorMessage(error: any): string {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.error?.message) return error.error.message;
  return 'An unexpected error occurred. Please try again.';
}
