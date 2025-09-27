import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string(),
  price: z.number().positive(),
  categoryId: z.string(),
  imageUrl: z.string().url(),
  stock: z.number().int().min(0),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ProductArraySchema = z.array(ProductSchema);

export type Product = z.infer<typeof ProductSchema>;
export type Products = z.infer<typeof ProductArraySchema>;

export class ProductEntity {
  constructor(private product: Product) { }

  get id() { return this.product.id; }
  get name() { return this.product.name; }
  get price() { return this.product.price; }

  isInStock(): boolean {
    return this.product.stock > 0;
  }

  canPurchase(quantity: number): boolean {
    return this.product.stock >= quantity;
  }

  updateStock(newStock: number): ProductEntity {
    return new ProductEntity({
      ...this.product,
      stock: newStock,
      updatedAt: new Date(),
    });
  }
}

export class ProductsEntity {
  constructor(private products: Products) { }

  get all() { return this.products; }

  findById(id: string): ProductEntity | undefined {
    const product = this.products.find((p: Product) => p.id === id);
    return product ? new ProductEntity(product) : undefined;
  }

  filterByCategory(categoryId: string): ProductsEntity {
    const filtered = this.products.filter((p: Product) => p.categoryId === categoryId);
    return new ProductsEntity(filtered);
  }

  sortByPrice(ascending: boolean = true): ProductsEntity {
    const sorted = [...this.products].sort((a, b) => ascending ? a.price - b.price : b.price - a.price);
    return new ProductsEntity(sorted);
  }

  toArray(): Products {
    return this.products;
  }
}