// Base API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL

/**
 * Base Service Class
 * Provides common HTTP methods for API communication
 */
export class BaseService {
  protected baseURL: string

  constructor(baseURL: string = '') {
    this.baseURL = baseURL
  }

  /**
   * Get authentication headers
   */
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
    return response.json()
  }

  /**
   * GET request
   */
  protected async get<T>(url: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      })
      return this.handleResponse<T>(response)
    } catch (error) {
      console.error('GET request error:', error)
      throw error
    }
  }

  /**
   * POST request
   */
  protected async post<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: data ? JSON.stringify(data) : undefined
      })
      return this.handleResponse<T>(response)
    } catch (error) {
      console.error('POST request error:', error)
      throw error
    }
  }

  /**
   * PUT request
   */
  protected async put<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: data ? JSON.stringify(data) : undefined
      })
      return this.handleResponse<T>(response)
    } catch (error) {
      console.error('PUT request error:', error)
      throw error
    }
  }

  /**
   * DELETE request
   */
  protected async delete<T>(url: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      })
      return this.handleResponse<T>(response)
    } catch (error) {
      console.error('DELETE request error:', error)
      throw error
    }
  }

  /**
   * PATCH request
   */
  protected async patch<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: data ? JSON.stringify(data) : undefined
      })
      return this.handleResponse<T>(response)
    } catch (error) {
      console.error('PATCH request error:', error)
      throw error
    }
  }
}
