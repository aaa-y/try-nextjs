import { Product } from '@/core/domain/entities/Product';
import { ProductCategory } from '@/core/domain/value-objects/ProductCategory';
import { ProductRepository } from '@/core/domain/repositories/ProductRepository';

/**
 * API implementation of the ProductRepository
 *
 * This class implements the ProductRepository interface using API calls
 * to interact with the backend service.
 */
export class ApiProductRepository implements ProductRepository {
  private readonly apiUrl: string;
  private readonly baseUrl: string;

  constructor(apiUrl: string = '/api/products') {
    // Check if the URL is already absolute
    if (apiUrl.startsWith('http')) {
      // For absolute URLs, use as is
      this.apiUrl = '';
      this.baseUrl = apiUrl;
    } else {
      // For relative URLs, combine with base URL
      this.apiUrl = apiUrl;
      this.baseUrl = typeof window !== 'undefined'
        ? window.location.origin
        : 'http://localhost:3000';
    }
  }

  async findById(id: string): Promise<Product | null> {
    try {
      const response = await fetch(`${this.baseUrl}${this.apiUrl}/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch product: ${response.statusText}`);
      }

      const data = await response.json();
      return Product.fromPrimitives(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseUrl}${this.apiUrl}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const data = await response.json();
      return data.map((item: any) => Product.fromPrimitives(item));
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async findByCategory(category: ProductCategory): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseUrl}${this.apiUrl}?category=${category.value}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch products by category: ${response.statusText}`);
      }

      const data = await response.json();
      return data.map((item: any) => Product.fromPrimitives(item));
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  }

  async save(product: Product): Promise<void> {
    try {
      const method = await this.findById(product.id) ? 'PUT' : 'POST';
      const url = method === 'PUT'
        ? `${this.baseUrl}${this.apiUrl}/${product.id}`
        : `${this.baseUrl}${this.apiUrl}`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product.toPrimitives()),
      });

      if (!response.ok) {
        throw new Error(`Failed to save product: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}${this.apiUrl}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
}
