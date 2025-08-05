import { apiFetch, type ApiRequestOptions } from '@/lib/api';

/**
 * Base API service class that provides common functionality for all API services
 */
export abstract class BaseApiService {
  protected baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  /**
   * Make a GET request
   */
  protected async get<T>(
    endpoint: string,
    options?: Omit<ApiRequestOptions, 'method'>
  ): Promise<T> {
    return apiFetch<T>(this.getFullUrl(endpoint), {
      ...options,
      method: 'GET',
    });
  }

  /**
   * Make a POST request
   */
  protected async post<T, P = unknown>(
    endpoint: string,
    payload?: P,
    options?: Omit<ApiRequestOptions<P>, 'method' | 'payload'>
  ): Promise<T> {
    return apiFetch<T, P>(this.getFullUrl(endpoint), {
      ...options,
      method: 'POST',
      payload,
    });
  }

  /**
   * Make a PUT request
   */
  protected async put<T, P = unknown>(
    endpoint: string,
    payload?: P,
    options?: Omit<ApiRequestOptions<P>, 'method' | 'payload'>
  ): Promise<T> {
    return apiFetch<T, P>(this.getFullUrl(endpoint), {
      ...options,
      method: 'PUT',
      payload,
    });
  }

  /**
   * Make a PATCH request
   */
  protected async patch<T, P = unknown>(
    endpoint: string,
    payload?: P,
    options?: Omit<ApiRequestOptions<P>, 'method' | 'payload'>
  ): Promise<T> {
    return apiFetch<T, P>(this.getFullUrl(endpoint), {
      ...options,
      method: 'PATCH',
      payload,
    });
  }

  /**
   * Make a DELETE request
   */
  protected async delete<T>(
    endpoint: string,
    options?: Omit<ApiRequestOptions, 'method'>
  ): Promise<T> {
    return apiFetch<T>(this.getFullUrl(endpoint), {
      ...options,
      method: 'DELETE',
    });
  }

  /**
   * Get the full URL for an endpoint
   */
  private getFullUrl(endpoint: string): string {
    // If endpoint is already a full URL, return as is
    if (endpoint.startsWith('http')) {
      return endpoint;
    }

    // If baseUrl is provided and endpoint doesn't start with /, append to baseUrl
    if (this.baseUrl && !endpoint.startsWith('/')) {
      return `${this.baseUrl}/${endpoint}`;
    }

    // If baseUrl is provided and endpoint starts with /, append to baseUrl
    if (this.baseUrl && endpoint.startsWith('/')) {
      return `${this.baseUrl}${endpoint}`;
    }

    // Return endpoint as is
    return endpoint;
  }

  /**
   * Get the current auth token from localStorage
   */
  protected getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Check if user is authenticated
   */
  protected isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}
