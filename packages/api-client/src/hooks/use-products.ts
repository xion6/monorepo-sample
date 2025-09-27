import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { ProductService } from '../services';
import { useApiClient } from './use-api-client';
import { ProductEntity } from '@ecommerce/core';
import {
  ProductQueryParams,
  CreateProductRequest,
  UpdateProductRequest,
  PaginatedResponse,
  ApiResponse
} from '../types';

// Query keys for React Query
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params?: ProductQueryParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  search: (query: string) => [...productKeys.all, 'search', query] as const,
};

// Custom hooks for products
export function useProducts(params?: ProductQueryParams) {
  const client = useApiClient();
  const productService = new ProductService(client);

  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productService.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes (renamed from cacheTime)
  });
}

export function useProduct(id: string, enabled = true) {
  const client = useApiClient();
  const productService = new ProductService(client);

  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getProduct(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useProductSearch(query: string, enabled = true) {
  const client = useApiClient();
  const productService = new ProductService(client);

  return useQuery({
    queryKey: productKeys.search(query),
    queryFn: () => productService.searchProducts(query),
    enabled: enabled && !!query.trim(),
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    gcTime: 5 * 60 * 1000,
  });
}

export function useCreateProduct() {
  const client = useApiClient();
  const productService = new ProductService(client);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductRequest) => productService.createProduct(data),
    onSuccess: (response: ApiResponse<ProductEntity>) => {
      // Invalidate and refetch product lists
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      
      // Add the new product to the cache
      queryClient.setQueryData(
        productKeys.detail(response.data.id),
        response
      );
    },
  });
}

export function useUpdateProduct() {
  const client = useApiClient();
  const productService = new ProductService(client);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProductRequest) => productService.updateProduct(data),
    onSuccess: (response: ApiResponse<ProductEntity>, variables) => {
      const productId = variables.id;
      
      // Update the specific product in cache
      queryClient.setQueryData(
        productKeys.detail(productId),
        response
      );
      
      // Invalidate product lists to reflect changes
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

export function useDeleteProduct() {
  const client = useApiClient();
  const productService = new ProductService(client);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: (_, productId) => {
      // Remove the product from cache
      queryClient.removeQueries({ queryKey: productKeys.detail(productId) });
      
      // Invalidate product lists
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

// Utility hooks for common patterns
export function useProductsByCategory(categoryId: string, enabled = true) {
  return useProducts({ categoryId });
}

export function useInfiniteProducts(params?: ProductQueryParams) {
  const client = useApiClient();
  const productService = new ProductService(client);

  return useInfiniteQuery({
    queryKey: productKeys.list(params),
    queryFn: ({ pageParam = 1 }) => 
      productService.getProducts({ ...params, page: pageParam }),
    getNextPageParam: (lastPage: PaginatedResponse<ProductEntity>) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}