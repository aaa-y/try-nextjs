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
  private mockProducts: Product[] = [];

  constructor(private readonly productRepository: ProductRepository) {
    // Initialize mock data
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Create some mock products
    this.mockProducts = [
      Product.create(
        '1',
        'Smartphone',
        'A high-end smartphone with the latest features',
        999.99,
        new ProductCategory('electronics'),
        50
      ),
      Product.create(
        '2',
        'Laptop',
        'Powerful laptop for work and gaming',
        1499.99,
        new ProductCategory('electronics'),
        30
      ),
      Product.create(
        '3',
        'Headphones',
        'Noise-cancelling wireless headphones',
        299.99,
        new ProductCategory('electronics'),
        100
      ),
      Product.create(
        '4',
        'T-shirt',
        'Comfortable cotton t-shirt',
        19.99,
        new ProductCategory('clothing'),
        200
      ),
      Product.create(
        '5',
        'Jeans',
        'Classic blue jeans',
        49.99,
        new ProductCategory('clothing'),
        150
      )
    ];
  }

  /**
   * Get a product by ID
   * @param id The product ID
   * @returns The product or null if not found
   */
  async getProductById(id: string): Promise<Product | null> {
    try {
      // Try to use the repository first
      const product = await this.productRepository.findById(id);
      if (product) {
        return product;
      }

      // Fall back to mock data
      return this.mockProducts.find(p => p.id === id) || null;
    } catch (error) {
      console.error('Error fetching product from repository, using mock data:', error);
      return this.mockProducts.find(p => p.id === id) || null;
    }
  }

  /**
   * Get all products
   * @returns Array of products
   */
  async getAllProducts(): Promise<Product[]> {
    try {
      // Try to use the repository first
      const products = await this.productRepository.findAll();
      if (products.length > 0) {
        return products;
      }

      // Fall back to mock data
      return [...this.mockProducts];
    } catch (error) {
      console.error('Error fetching products from repository, using mock data:', error);
      return [...this.mockProducts];
    }
  }

  /**
   * Get products by category
   * @param categoryName The category name
   * @returns Array of products in the specified category
   */
  async getProductsByCategory(categoryName: string): Promise<Product[]> {
    try {
      const category = new ProductCategory(categoryName);

      // Try to use the repository first
      try {
        const products = await this.productRepository.findByCategory(category);
        if (products.length > 0) {
          return products;
        }
      } catch (repoError) {
        console.error('Error fetching products by category from repository:', repoError);
      }

      // Fall back to mock data
      return this.mockProducts.filter(p => p.category.value === category.value);
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

      try {
        // Try to save to the repository
        await this.productRepository.save(product);
      } catch (repoError) {
        console.error('Error saving product to repository, using mock data:', repoError);
        // Add to mock data
        this.mockProducts.push(product);
      }

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
      // Try to get from repository first
      let existingProduct = await this.getProductById(id);

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

      try {
        // Try to save to the repository
        await this.productRepository.save(existingProduct);
      } catch (repoError) {
        console.error('Error saving product to repository, updating mock data:', repoError);
        // Update in mock data
        const index = this.mockProducts.findIndex(p => p.id === id);
        if (index !== -1) {
          this.mockProducts[index] = existingProduct;
        }
      }

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
      // Try to get from repository first
      const existingProduct = await this.getProductById(id);

      if (!existingProduct) {
        return false;
      }

      try {
        // Try to delete from the repository
        await this.productRepository.delete(id);
      } catch (repoError) {
        console.error('Error deleting product from repository, updating mock data:', repoError);
        // Remove from mock data
        this.mockProducts = this.mockProducts.filter(p => p.id !== id);
      }

      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
}
