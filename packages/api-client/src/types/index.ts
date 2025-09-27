// Core API types for type-safe HTTP communication

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
  timestamp?: string;
  requestId?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
}

export interface RequestConfig {
  timeout?: number;
  headers?: Record<string, string>;
  retries?: number;
  retryDelay?: number;
}

export interface HttpClientConfig extends RequestConfig {
  baseURL: string;
  authToken?: string;
  apiKey?: string;
}

// Common query parameters
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  filters?: Record<string, any>;
}

export type QueryParams = PaginationParams & FilterParams & Record<string, any>;

// HTTP method types for better type safety
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestOptions<TData = any> {
  method: HttpMethod;
  url: string;
  data?: TData;
  params?: QueryParams;
  config?: RequestConfig;
}

// Re-export product types
export type * from './product.types';