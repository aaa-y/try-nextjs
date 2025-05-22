import { Product } from '@/core/domain/entities/Product';
import { ProductCategory } from '@/core/domain/value-objects/ProductCategory';

/**
 * Repository interface for Product entity
 * 
 * Following DDD principles, repositories:
 * - Provide a collection-like interface for accessing domain objects
 * - Abstract the underlying persistence mechanism
 * - Work with domain objects (entities and value objects)
 */
export interface ProductRepository {
  /**
   * Find a product by its ID
   * @param id The product ID
   * @returns A Promise that resolves to the product or null if not found
   */
  findById(id: string): Promise<Product | null>;

  /**
   * Find all products
   * @returns A Promise that resolves to an array of products
   */
  findAll(): Promise<Product[]>;

  /**
   * Find products by category
   * @param category The product category
   * @returns A Promise that resolves to an array of products
   */
  findByCategory(category: ProductCategory): Promise<Product[]>;

  /**
   * Save a product (create or update)
   * @param product The product to save
   * @returns A Promise that resolves when the operation is complete
   */
  save(product: Product): Promise<void>;

  /**
   * Delete a product
   * @param id The ID of the product to delete
   * @returns A Promise that resolves when the operation is complete
   */
  delete(id: string): Promise<void>;
}
