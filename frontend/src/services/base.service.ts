/**
 * Base API service wrapper
 * Provides consistent API call patterns across all services
 */

import apiClient from '#/lib/api-client';
import { handleApiCall, isAuthError } from '#/lib/api/errorHandler';

/**
 * Standard API response structure
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * API request configuration
 */
export interface ApiRequestConfig {
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

/**
 * Base service class with common CRUD operations
 */
export class BaseService {
  /**
   * Make a GET request
   * @param endpoint - API endpoint path
   * @param config - Request configuration
   * @returns Promise with response data
   */
  static async get<T>(endpoint: string, config?: ApiRequestConfig): Promise<T> {
    return handleApiCall<T>(apiClient.get(endpoint, config));
  }

  /**
   * Make a POST request
   * @param endpoint - API endpoint path
   * @param data - Request body data
   * @param config - Request configuration
   * @returns Promise with response data
   */
  static async post<T>(endpoint: string, data?: any, config?: ApiRequestConfig): Promise<T> {
    return handleApiCall<T>(apiClient.post(endpoint, data, config));
  }

  /**
   * Make a PUT request
   * @param endpoint - API endpoint path
   * @param data - Request body data
   * @param config - Request configuration
   * @returns Promise with response data
   */
  static async put<T>(endpoint: string, data?: any, config?: ApiRequestConfig): Promise<T> {
    return handleApiCall<T>(apiClient.put(endpoint, data, config));
  }

  /**
   * Make a PATCH request
   * @param endpoint - API endpoint path
   * @param data - Request body data
   * @param config - Request configuration
   * @returns Promise with response data
   */
  static async patch<T>(endpoint: string, data?: any, config?: ApiRequestConfig): Promise<T> {
    return handleApiCall<T>(apiClient.patch(endpoint, data, config));
  }

  /**
   * Make a DELETE request
   * @param endpoint - API endpoint path
   * @param config - Request configuration
   * @returns Promise with response data
   */
  static async delete<T>(endpoint: string, config?: ApiRequestConfig): Promise<T> {
    return handleApiCall<T>(apiClient.delete(endpoint, config));
  }
}

/**
 * Helper function for building endpoint URLs
 * @param base - Base endpoint
 * @param params - Query parameters
 * @returns Full endpoint URL with query string
 */
export function buildEndpoint(base: string, params?: Record<string, any>): string {
  if (!params || Object.keys(params).length === 0) {
    return base;
  }

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${base}?${queryString}` : base;
}

export default BaseService;
