import React, { ReactNode } from 'react';
import { ApiClient } from '../client';
import { ApiClientContext } from './use-api-client';

interface ApiClientProviderProps {
  client: ApiClient;
  children: ReactNode;
}

export function ApiClientProvider({ client, children }: ApiClientProviderProps) {
  return (
    <ApiClientContext.Provider value={client}>
      {children}
    </ApiClientContext.Provider>
  );
}