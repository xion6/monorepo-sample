// Centralized API route management for better maintainability and type safety

export const API_ROUTES = {
  // Product API endpoints
  products: {
    base: '/api/products',
    list: '/api/products',
    detail: (id: string) => `/api/products/${id}`,
    create: '/api/products',
    update: (id: string) => `/api/products/${id}`,
    delete: (id: string) => `/api/products/${id}`,
    search: '/api/products/search',
    byCategory: (category: string) => `/api/products/category/${category}`,
  },
  
  // User API endpoints (example for future expansion)
  users: {
    base: '/api/users',
    profile: '/api/users/profile',
    list: '/api/users',
    detail: (id: string) => `/api/users/${id}`,
    create: '/api/users',
    update: (id: string) => `/api/users/${id}`,
    delete: (id: string) => `/api/users/${id}`,
  },

  // Authentication endpoints (example)
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
    register: '/api/auth/register',
    resetPassword: '/api/auth/reset-password',
    verifyEmail: '/api/auth/verify-email',
  },

  // Order endpoints (example for e-commerce)
  orders: {
    base: '/api/orders',
    list: '/api/orders',
    detail: (id: string) => `/api/orders/${id}`,
    create: '/api/orders',
    update: (id: string) => `/api/orders/${id}`,
    cancel: (id: string) => `/api/orders/${id}/cancel`,
    history: '/api/orders/history',
    byUser: (userId: string) => `/api/orders/user/${userId}`,
  },

  // Category endpoints
  categories: {
    base: '/api/categories',
    list: '/api/categories',
    detail: (id: string) => `/api/categories/${id}`,
    create: '/api/categories',
    update: (id: string) => `/api/categories/${id}`,
    delete: (id: string) => `/api/categories/${id}`,
    tree: '/api/categories/tree',
  },
} as const;

// Type helpers for better developer experience
export type ApiRoutes = typeof API_ROUTES;
export type ProductRoutes = typeof API_ROUTES.products;
export type UserRoutes = typeof API_ROUTES.users;
export type AuthRoutes = typeof API_ROUTES.auth;
export type OrderRoutes = typeof API_ROUTES.orders;
export type CategoryRoutes = typeof API_ROUTES.categories;