import { AxiosError } from 'axios';
import { ApiError } from './api-error';

export interface ErrorResponse {
  message: string;
  code?: string;
  details?: any;
}

export class ErrorHandler {
  static handle(error: AxiosError): never {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      const errorData = data as ErrorResponse;
      
      throw new ApiError(
        status,
        errorData.code || `HTTP_${status}`,
        errorData.message || error.message,
        errorData.details,
        error
      );
    } else if (error.request) {
      // Request was made but no response received
      throw new ApiError(
        0,
        'NETWORK_ERROR',
        'Network error: Unable to reach the server',
        { request: error.request },
        error
      );
    } else {
      // Error in setting up the request
      throw new ApiError(
        0,
        'REQUEST_SETUP_ERROR',
        'Error setting up the request',
        { message: error.message },
        error
      );
    }
  }

  static isRetryable(error: ApiError): boolean {
    // Retry on network errors or 5xx server errors
    return error.isNetworkError() || error.isServerError();
  }

  static getRetryDelay(attempt: number): number {
    // Exponential backoff: 1s, 2s, 4s, 8s, 16s
    return Math.min(1000 * Math.pow(2, attempt), 16000);
  }
}