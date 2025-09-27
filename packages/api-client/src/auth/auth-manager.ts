import { AxiosRequestConfig } from 'axios';

export interface AuthConfig {
  type: 'jwt' | 'apikey' | 'bearer';
  token?: string;
  apiKey?: string;
  apiKeyHeader?: string;
  refreshToken?: string;
  refreshEndpoint?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

export class AuthManager {
  private config: AuthConfig;
  private tokens: AuthTokens | null = null;
  private refreshPromise: Promise<AuthTokens> | null = null;

  constructor(config: AuthConfig) {
    this.config = config;
    
    if (config.token) {
      this.setTokens({
        accessToken: config.token,
        refreshToken: config.refreshToken,
      });
    }
  }

  setTokens(tokens: AuthTokens): void {
    this.tokens = tokens;
  }

  getTokens(): AuthTokens | null {
    return this.tokens;
  }

  clearTokens(): void {
    this.tokens = null;
    this.refreshPromise = null;
  }

  isTokenExpired(): boolean {
    if (!this.tokens?.expiresAt) return false;
    return Date.now() >= this.tokens.expiresAt;
  }

  async getValidToken(): Promise<string | null> {
    if (!this.tokens) return null;

    if (this.isTokenExpired() && this.tokens.refreshToken) {
      return this.refreshAccessToken();
    }

    return this.tokens.accessToken;
  }

  private async refreshAccessToken(): Promise<string> {
    if (this.refreshPromise) {
      const tokens = await this.refreshPromise;
      return tokens.accessToken;
    }

    this.refreshPromise = this.performTokenRefresh();
    
    try {
      const tokens = await this.refreshPromise;
      this.setTokens(tokens);
      return tokens.accessToken;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<AuthTokens> {
    if (!this.config.refreshEndpoint || !this.tokens?.refreshToken) {
      throw new Error('Cannot refresh token: missing refresh endpoint or refresh token');
    }

    const response = await fetch(this.config.refreshEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: this.tokens.refreshToken,
      }),
    });

    if (!response.ok) {
      this.clearTokens();
      throw new Error('Token refresh failed');
    }

    const data = await response.json() as {
      accessToken: string;
      refreshToken?: string;
      expiresIn?: number;
    };
    
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken || this.tokens.refreshToken,
      expiresAt: data.expiresIn ? Date.now() + data.expiresIn * 1000 : undefined,
    };
  }

  async applyAuth(config: AxiosRequestConfig): Promise<AxiosRequestConfig> {
    const headers: Record<string, any> = { ...config.headers };

    switch (this.config.type) {
      case 'jwt':
      case 'bearer':
        const token = await this.getValidToken();
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        break;

      case 'apikey':
        if (this.config.apiKey) {
          const headerName = this.config.apiKeyHeader || 'X-API-Key';
          headers[headerName] = this.config.apiKey;
        }
        break;
    }

    return { ...config, headers };
  }
}