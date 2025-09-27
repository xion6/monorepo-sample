export interface PerformanceMetrics {
  requestDuration: number;
  responseSize?: number;
  timestamp: Date;
  method: string;
  url: string;
  status?: number;
  success: boolean;
}

export interface PerformanceStats {
  averageResponseTime: number;
  successRate: number;
  totalRequests: number;
  errors: number;
  slowRequests: number; // > 2 seconds
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private readonly maxMetrics = 1000;
  private readonly slowRequestThreshold = 2000; // 2 seconds

  recordMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric);
    
    // Limit storage
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  getStats(timeWindow?: number): PerformanceStats {
    let relevantMetrics = this.metrics;
    
    // Filter by time window if provided (in milliseconds)
    if (timeWindow) {
      const cutoff = new Date(Date.now() - timeWindow);
      relevantMetrics = this.metrics.filter(m => m.timestamp >= cutoff);
    }

    if (relevantMetrics.length === 0) {
      return {
        averageResponseTime: 0,
        successRate: 0,
        totalRequests: 0,
        errors: 0,
        slowRequests: 0,
      };
    }

    const totalRequests = relevantMetrics.length;
    const successfulRequests = relevantMetrics.filter(m => m.success).length;
    const errors = totalRequests - successfulRequests;
    const slowRequests = relevantMetrics.filter(m => m.requestDuration > this.slowRequestThreshold).length;
    
    const averageResponseTime = relevantMetrics.reduce((sum, m) => sum + m.requestDuration, 0) / totalRequests;
    const successRate = (successfulRequests / totalRequests) * 100;

    return {
      averageResponseTime: Math.round(averageResponseTime),
      successRate: Math.round(successRate * 100) / 100,
      totalRequests,
      errors,
      slowRequests,
    };
  }

  getSlowRequests(threshold?: number): PerformanceMetrics[] {
    const limit = threshold || this.slowRequestThreshold;
    return this.metrics.filter(m => m.requestDuration > limit);
  }

  getErrorRequests(): PerformanceMetrics[] {
    return this.metrics.filter(m => !m.success);
  }

  // Get metrics for specific endpoint
  getEndpointStats(url: string): PerformanceStats {
    const endpointMetrics = this.metrics.filter(m => m.url === url);
    
    if (endpointMetrics.length === 0) {
      return {
        averageResponseTime: 0,
        successRate: 0,
        totalRequests: 0,
        errors: 0,
        slowRequests: 0,
      };
    }

    const totalRequests = endpointMetrics.length;
    const successfulRequests = endpointMetrics.filter(m => m.success).length;
    const errors = totalRequests - successfulRequests;
    const slowRequests = endpointMetrics.filter(m => m.requestDuration > this.slowRequestThreshold).length;
    
    const averageResponseTime = endpointMetrics.reduce((sum, m) => sum + m.requestDuration, 0) / totalRequests;
    const successRate = (successfulRequests / totalRequests) * 100;

    return {
      averageResponseTime: Math.round(averageResponseTime),
      successRate: Math.round(successRate * 100) / 100,
      totalRequests,
      errors,
      slowRequests,
    };
  }

  clearMetrics(): void {
    this.metrics = [];
  }

  // Export metrics for external analysis
  exportMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }
}