import { Product } from '../../domain/entities/Product';

export interface GetProductsPort {
  findByRank(rank: number): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  search(query: string): Promise<Product[]>;
  findByCategory(categoryId: string): Promise<Product[]>;
  create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product>;
  update(id: string, product: Partial<Product>): Promise<Product>;
  delete(id: string): Promise<void>;
}