import axios, { AxiosInstance } from 'axios';
import { HttpClient } from '@ecommerce/core';

export class AxiosHttpClient implements HttpClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string, timeout: number = 10000) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add authentication token if available
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response.data,
      (error) => {
        // Handle common HTTP errors
        if (error.response?.status === 401) {
          // Handle unauthorized
          this.handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }

  private getAuthToken(): string | null {
    // Implement token retrieval logic
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem('auth_token');
      }
    } catch {
      // Fall back if localStorage is not available
    }
    return null;
  }

  private handleUnauthorized(): void {
    // Implement logout logic
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem('auth_token');
      }
    } catch {
      // Fall back if localStorage is not available
    }
    // Redirect to login or emit event
  }

  async get<T>(url: string): Promise<T> {
    return this.axiosInstance.get<T, T>(url);
  }

  async post<T, U>(url: string, data: U): Promise<T> {
    return this.axiosInstance.post<T, T>(url, data);
  }

  async put<T, U>(url: string, data: U): Promise<T> {
    return this.axiosInstance.put<T, T>(url, data);
  }

  async delete<T>(url: string): Promise<T> {
    return this.axiosInstance.delete<T, T>(url);
  }
}