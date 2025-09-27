export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
  error?: Error;
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableStorage: boolean;
  maxStorageEntries: number;
  customHandler?: (entry: LogEntry) => void;
}

export class Logger {
  private config: LoggerConfig;
  private storage: LogEntry[] = [];
  private readonly levelPriority: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: 'info',
      enableConsole: true,
      enableStorage: false,
      maxStorageEntries: 1000,
      ...config,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levelPriority[level] >= this.levelPriority[this.config.level];
  }

  private createEntry(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): LogEntry {
    return {
      level,
      message,
      timestamp: new Date(),
      context,
      error,
    };
  }

  private logToConsole(entry: LogEntry): void {
    if (!this.config.enableConsole) return;

    const { level, message, timestamp, context, error } = entry;
    const timeStr = timestamp.toISOString();
    const prefix = `[${timeStr}] [${level.toUpperCase()}]`;

    switch (level) {
      case 'debug':
        console.debug(prefix, message, context, error);
        break;
      case 'info':
        console.info(prefix, message, context);
        break;
      case 'warn':
        console.warn(prefix, message, context, error);
        break;
      case 'error':
        console.error(prefix, message, context, error);
        break;
    }
  }

  private storeEntry(entry: LogEntry): void {
    if (!this.config.enableStorage) return;

    this.storage.push(entry);
    
    // Limit storage size
    if (this.storage.length > this.config.maxStorageEntries) {
      this.storage = this.storage.slice(-this.config.maxStorageEntries);
    }
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void {
    if (!this.shouldLog(level)) return;

    const entry = this.createEntry(level, message, context, error);
    
    this.logToConsole(entry);
    this.storeEntry(entry);
    
    if (this.config.customHandler) {
      this.config.customHandler(entry);
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, any>, error?: Error): void {
    this.log('warn', message, context, error);
  }

  error(message: string, context?: Record<string, any>, error?: Error): void {
    this.log('error', message, context, error);
  }

  // API request/response logging
  logRequest(method: string, url: string, data?: any): void {
    this.debug('API Request', {
      method: method.toUpperCase(),
      url,
      data: data ? { ...data } : undefined,
    });
  }

  logResponse(method: string, url: string, status: number, duration: number): void {
    const level = status >= 400 ? 'warn' : 'debug';
    this.log(level, 'API Response', {
      method: method.toUpperCase(),
      url,
      status,
      duration: `${duration}ms`,
    });
  }

  logError(method: string, url: string, error: Error, duration: number): void {
    this.error('API Error', {
      method: method.toUpperCase(),
      url,
      duration: `${duration}ms`,
    }, error);
  }

  // Get stored logs
  getLogs(level?: LogLevel): LogEntry[] {
    if (!level) return [...this.storage];
    return this.storage.filter(entry => entry.level === level);
  }

  // Clear stored logs
  clearLogs(): void {
    this.storage = [];
  }

  // Update configuration
  updateConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }
}