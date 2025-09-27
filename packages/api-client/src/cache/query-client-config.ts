import { QueryClient, DefaultOptions } from '@tanstack/react-query';
import { CacheManager } from './cache-manager';

export function createQueryClient(cacheManager?: CacheManager): QueryClient {
  const cache = cacheManager || new CacheManager();

  const defaultOptions: DefaultOptions = {
    queries: {
      staleTime: cache.getStaleTime('default'),
      gcTime: cache.getGcTime('default'),
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      ...cache.getRetrySettings(),
    },
    mutations: {
      ...cache.getRetrySettings(),
    },
  };

  return new QueryClient({
    defaultOptions,
  });
}

// Pre-configured query client with optimized defaults
export const queryClient = createQueryClient();