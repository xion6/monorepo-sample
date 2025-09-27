import { ApiClient } from '../client';
import { ApiResponse, RequestConfig } from '../types';

export abstract class BaseService {
  protected client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  protected async get<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.client.get<T>(url, config);
  }

  protected async post<T, D = any>(url: string, data?: D, config?: RequestConfig): Promise<T> {
    return this.client.post<T>(url, data, config);
  }

  protected async put<T, D = any>(url: string, data?: D, config?: RequestConfig): Promise<T> {
    return this.client.put<T>(url, data, config);
  }

  protected async patch<T, D = any>(url: string, data?: D, config?: RequestConfig): Promise<T> {
    return this.client.patch<T>(url, data, config);
  }

  protected async delete<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.client.delete<T>(url, config);
  }

  protected buildUrl(endpoint: string, params?: Record<string, any>): string {
    if (!params || Object.keys(params).length === 0) {
      return endpoint;
    }

    const url = new URL(endpoint, 'http://localhost'); // Base URL for URL constructor
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    return url.pathname + url.search;
  }
}