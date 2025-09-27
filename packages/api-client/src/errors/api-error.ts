import { AxiosError } from 'axios';

export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: any;
  public readonly originalError?: AxiosError;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: any,
    originalError?: AxiosError
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.originalError = originalError;
    
    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  public isNetworkError(): boolean {
    return this.status === 0 || !this.status;
  }

  public isServerError(): boolean {
    return this.status >= 500;
  }

  public isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  public isUnauthorized(): boolean {
    return this.status === 401;
  }

  public isForbidden(): boolean {
    return this.status === 403;
  }

  public isNotFound(): boolean {
    return this.status === 404;
  }

  public toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      code: this.code,
      details: this.details,
    };
  }
}