import { Product } from '@/core/domain/entities/Product';
import { ProductCategory } from '@/core/domain/value-objects/ProductCategory';
import { ProductRepository } from '@/core/domain/repositories/ProductRepository';
import { CreateProductDto, UpdateProductDto } from '@/core/application/dtos/ProductDto';

/**
 * Product service that implements use cases related to products
 * 
 * This service follows the application service pattern in DDD:
 * - Orchestrates the execution of use cases
 * - Coordinates between different domain objects
 * - Translates between the domain and the outside world using DTOs
 */
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  /**
   * Get a product by ID
   * @param id The product ID
   * @returns The product or null if not found
   */
  async getProductById(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  /**
   * Get all products
   * @returns Array of products
   */
  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  /**
   * Get products by category
   * @param categoryName The category name
   * @returns Array of products in the specified category
   */
  async getProductsByCategory(categoryName: string): Promise<Product[]> {
    try {
      const category = new ProductCategory(categoryName);
      return this.productRepository.findByCategory(category);
    } catch (error) {
      console.error('Error getting products by category:', error);
      return [];
    }
  }

  /**
   * Create a new product
   * @param productDto The product data
   * @returns The created product
   */
  async createProduct(productDto: CreateProductDto): Promise<Product> {
    try {
      const category = new ProductCategory(productDto.category);
      
      const product = Product.create(
        productDto.id || crypto.randomUUID(),
        productDto.name,
        productDto.description,
        productDto.price,
        category,
        productDto.stockQuantity
      );
      
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  /**
   * Update an existing product
   * @param id The product ID
   * @param productDto The updated product data
   * @returns The updated product or null if not found
   */
  async updateProduct(id: string, productDto: UpdateProductDto): Promise<Product | null> {
    try {
      const existingProduct = await this.productRepository.findById(id);
      
      if (!existingProduct) {
        return null;
      }
      
      if (productDto.name || productDto.description || productDto.category) {
        const category = productDto.category 
          ? new ProductCategory(productDto.category) 
          : existingProduct.category;
          
        existingProduct.updateDetails(
          productDto.name || existingProduct.name,
          productDto.description || existingProduct.description,
          category
        );
      }
      
      if (productDto.price !== undefined) {
        existingProduct.updatePrice(productDto.price);
      }
      
      if (productDto.stockQuantity !== undefined) {
        existingProduct.updateStock(productDto.stockQuantity);
      }
      
      await this.productRepository.save(existingProduct);
      return existingProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  /**
   * Delete a product
   * @param id The product ID
   * @returns True if deleted, false if not found
   */
  async deleteProduct(id: string): Promise<boolean> {
    try {
      const existingProduct = await this.productRepository.findById(id);
      
      if (!existingProduct) {
        return false;
      }
      
      await this.productRepository.delete(id);
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
}
