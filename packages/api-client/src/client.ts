import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { ErrorHandler } from './errors';
import { AuthManager, AuthConfig } from './auth';
import { Logger, PerformanceMonitor } from './monitoring';

export class ApiClient {
  private client: AxiosInstance;
  private authManager?: AuthManager;
  private logger: Logger;
  private performanceMonitor: PerformanceMonitor;
  
  constructor(baseURL: string, config?: AxiosRequestConfig & { auth?: AuthConfig }) {
    const { auth, ...axiosConfig } = config || {};
    
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      ...axiosConfig,
    });
    
    if (auth) {
      this.authManager = new AuthManager(auth);
    }
    
    this.logger = new Logger({
      level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    });
    
    this.performanceMonitor = new PerformanceMonitor();
    
    this.setupInterceptors();
  }
  
  private setupInterceptors(): void {
    // Request interceptor for auth and logging
    this.client.interceptors.request.use(
      async (config) => {
        // Add start time for performance monitoring
        (config as any).metadata = { startTime: Date.now() };
        
        // Apply authentication
        if (this.authManager) {
          const authConfig = await this.authManager.applyAuth(config);
          Object.assign(config, authConfig);
        }
        
        // Log request
        this.logger.logRequest(
          config.method || 'GET',
          config.url || '',
          config.data
        );
        
        return config;
      },
      (error) => {
        this.logger.error('Request interceptor error', {}, error);
        return Promise.reject(error);
      }
    );
    
    // Response interceptor for error handling and performance monitoring
    this.client.interceptors.response.use(
      (response) => {
        const config = response.config as any;
        const duration = Date.now() - (config.metadata?.startTime || Date.now());
        
        // Log successful response
        this.logger.logResponse(
          config.method || 'GET',
          config.url || '',
          response.status,
          duration
        );
        
        // Record performance metrics
        this.performanceMonitor.recordMetric({
          requestDuration: duration,
          responseSize: JSON.stringify(response.data).length,
          timestamp: new Date(),
          method: config.method || 'GET',
          url: config.url || '',
          status: response.status,
          success: true,
        });
        
        return response;
      },
      (error: AxiosError) => {
        const config = error.config as any;
        const duration = Date.now() - (config?.metadata?.startTime || Date.now());
        
        // Log error
        this.logger.logError(
          config?.method || 'GET',
          config?.url || '',
          error,
          duration
        );
        
        // Record performance metrics for errors
        this.performanceMonitor.recordMetric({
          requestDuration: duration,
          timestamp: new Date(),
          method: config?.method || 'GET',
          url: config?.url || '',
          status: error.response?.status,
          success: false,
        });
        
        return Promise.reject(ErrorHandler.handle(error));
      }
    );
  }
  
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }
  
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }
  
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }
  
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }
  
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  // Monitoring and utility methods
  getLogger(): Logger {
    return this.logger;
  }

  getPerformanceMonitor(): PerformanceMonitor {
    return this.performanceMonitor;
  }

  // Auth management
  setAuth(config: AuthConfig): void {
    this.authManager = new AuthManager(config);
  }

  clearAuth(): void {
    if (this.authManager) {
      this.authManager.clearTokens();
    }
    this.authManager = undefined;
  }

  // Request with retry logic
  async requestWithRetry<T>(
    requestFn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error: any) {
        lastError = error;

        // Don't retry on client errors (4xx)
        if (error.status >= 400 && error.status < 500) {
          throw error;
        }

        // Don't retry on last attempt
        if (attempt === maxRetries) {
          throw error;
        }

        // Exponential backoff with jitter
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
        this.logger.warn(`Request failed, retrying in ${delay}ms`, {
          attempt: attempt + 1,
          maxRetries,
          error: error.message,
        });

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }
}
  