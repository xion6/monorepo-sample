import { createContext, useContext } from 'react';
import { ApiClient } from '../client';

export const ApiClientContext = createContext<ApiClient | null>(null);

export function useApiClient(): ApiClient {
  const client = useContext(ApiClientContext);
  
  if (!client) {
    throw new Error(
      'useApiClient must be used within an ApiClientProvider. ' +
      'Wrap your app with <ApiClientProvider client={apiClient}>'
    );
  }
  
  return client;
}