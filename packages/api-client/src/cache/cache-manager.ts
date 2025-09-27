export interface CacheConfig {
  defaultStaleTime?: number;
  defaultGcTime?: number;
  maxRetries?: number;
  retryDelay?: number;
}

export interface CacheKey {
  queryKey: readonly unknown[];
  scope: string;
}

export class CacheManager {
  private config: CacheConfig;

  constructor(config: CacheConfig = {}) {
    this.config = {
      defaultStaleTime: 5 * 60 * 1000, // 5 minutes
      defaultGcTime: 10 * 60 * 1000,   // 10 minutes
      maxRetries: 3,
      retryDelay: 1000,
      ...config,
    };
  }

  getStaleTime(key: string): number {
    // Different stale times for different data types
    switch (key) {
      case 'products':
        return 5 * 60 * 1000;  // 5 minutes
      case 'search':
        return 2 * 60 * 1000;  // 2 minutes
      case 'user':
        return 10 * 60 * 1000; // 10 minutes
      case 'config':
        return 30 * 60 * 1000; // 30 minutes
      default:
        return this.config.defaultStaleTime!;
    }
  }

  getGcTime(key: string): number {
    // Different garbage collection times
    switch (key) {
      case 'search':
        return 5 * 60 * 1000;   // 5 minutes
      case 'products':
        return 10 * 60 * 1000;  // 10 minutes
      case 'user':
        return 30 * 60 * 1000;  // 30 minutes
      default:
        return this.config.defaultGcTime!;
    }
  }

  shouldRefetchOnWindowFocus(key: string): boolean {
    // Determine which queries should refetch on window focus
    switch (key) {
      case 'products':
      case 'user':
        return true;
      case 'search':
      case 'config':
        return false;
      default:
        return true;
    }
  }

  getRetrySettings() {
    return {
      retry: (failureCount: number, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        
        // Retry up to maxRetries times for 5xx or network errors
        return failureCount < (this.config.maxRetries || 3);
      },
      retryDelay: (attemptIndex: number) => {
        // Exponential backoff
        return Math.min(1000 * Math.pow(2, attemptIndex), 30000);
      },
    };
  }

  createCacheKey(scope: string, params?: Record<string, any>): readonly unknown[] {
    const baseKey = [scope];
    
    if (params) {
      // Sort params for consistent cache keys
      const sortedParams = Object.keys(params)
        .sort()
        .reduce((obj, key) => {
          if (params[key] !== undefined && params[key] !== null) {
            obj[key] = params[key];
          }
          return obj;
        }, {} as Record<string, any>);
      
      if (Object.keys(sortedParams).length > 0) {
        baseKey.push(JSON.stringify(sortedParams));
      }
    }
    
    return baseKey;
  }

  // Cache invalidation patterns
  getInvalidationPattern(operation: 'create' | 'update' | 'delete', resource: string): string[] {
    const patterns: string[] = [];
    
    switch (operation) {
      case 'create':
        patterns.push(`${resource}:list`);
        patterns.push(`${resource}:search`);
        break;
      case 'update':
        patterns.push(`${resource}:list`);
        patterns.push(`${resource}:detail`);
        patterns.push(`${resource}:search`);
        break;
      case 'delete':
        patterns.push(`${resource}:list`);
        patterns.push(`${resource}:detail`);
        patterns.push(`${resource}:search`);
        break;
    }
    
    return patterns;
  }
}