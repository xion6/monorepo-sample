import { GetProductsPort } from '../port/out/GetProductsPort';
import { Product } from '../domain/entities/Product';

export interface HttpClient {
  get<T>(url: string): Promise<T>;
  post<T, U>(url: string, data: U): Promise<T>;
  put<T, U>(url: string, data: U): Promise<T>;
  delete<T>(url: string): Promise<T>;
}

export class HttpProductsAdapter implements GetProductsPort {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly baseUrl: string = '/api/products'
  ) {}

  async findByRank(rank: number): Promise<Product[]> {
    const response = await this.httpClient.get<{ items: Product[] }>(
      `${this.baseUrl}?rank=${rank}`
    );
    return response.items;
  }

  async findById(id: string): Promise<Product | null> {
    try {
      const response = await this.httpClient.get<{ data: Product }>(
        `${this.baseUrl}/${id}`
      );
      return response.data;
    } catch (error) {
      // Assuming 404 means not found
      return null;
    }
  }

  async findAll(): Promise<Product[]> {
    const response = await this.httpClient.get<{ items: Product[] }>(
      this.baseUrl
    );
    return response.items;
  }

  async search(query: string): Promise<Product[]> {
    const response = await this.httpClient.get<{ items: Product[] }>(
      `${this.baseUrl}/search?q=${encodeURIComponent(query)}`
    );
    return response.items;
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    const response = await this.httpClient.get<{ items: Product[] }>(
      `${this.baseUrl}/category/${categoryId}`
    );
    return response.items;
  }

  async create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const response = await this.httpClient.post<{ data: Product }, typeof product>(
      this.baseUrl,
      product
    );
    return response.data;
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    const response = await this.httpClient.put<{ data: Product }, Partial<Product>>(
      `${this.baseUrl}/${id}`,
      product
    );
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }
}