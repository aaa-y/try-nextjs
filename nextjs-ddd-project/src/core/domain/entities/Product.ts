import { Entity } from '@/core/shared/types/Entity';
import { ProductCategory } from '@/core/domain/value-objects/ProductCategory';

/**
 * Product entity representing a product in the system
 * 
 * Following DDD principles, this entity:
 * - Has a unique identity
 * - Contains business logic related to products
 * - Encapsulates its state
 * - Provides methods to manipulate its state in a controlled way
 */
export class Product implements Entity<string> {
  private _id: string;
  private _name: string;
  private _description: string;
  private _price: number;
  private _category: ProductCategory;
  private _inStock: boolean;
  private _stockQuantity: number;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: string,
    name: string,
    description: string,
    price: number,
    category: ProductCategory,
    stockQuantity: number = 0,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._price = price;
    this._category = category;
    this._stockQuantity = stockQuantity;
    this._inStock = stockQuantity > 0;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;

    this.validateProduct();
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get price(): number {
    return this._price;
  }

  get category(): ProductCategory {
    return this._category;
  }

  get inStock(): boolean {
    return this._inStock;
  }

  get stockQuantity(): number {
    return this._stockQuantity;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business logic methods
  updateStock(quantity: number): void {
    if (quantity < 0) {
      throw new Error('Stock quantity cannot be negative');
    }
    
    this._stockQuantity = quantity;
    this._inStock = quantity > 0;
    this._updatedAt = new Date();
  }

  updatePrice(price: number): void {
    if (price < 0) {
      throw new Error('Price cannot be negative');
    }
    
    this._price = price;
    this._updatedAt = new Date();
  }

  updateDetails(name: string, description: string, category: ProductCategory): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Product name cannot be empty');
    }
    
    this._name = name;
    this._description = description;
    this._category = category;
    this._updatedAt = new Date();
  }

  // Validation logic
  private validateProduct(): void {
    if (!this._id) {
      throw new Error('Product ID is required');
    }
    
    if (!this._name || this._name.trim().length === 0) {
      throw new Error('Product name cannot be empty');
    }
    
    if (this._price < 0) {
      throw new Error('Price cannot be negative');
    }
    
    if (this._stockQuantity < 0) {
      throw new Error('Stock quantity cannot be negative');
    }
  }

  // Factory method for creating a product
  static create(
    id: string,
    name: string,
    description: string,
    price: number,
    category: ProductCategory,
    stockQuantity: number = 0
  ): Product {
    return new Product(
      id,
      name,
      description,
      price,
      category,
      stockQuantity
    );
  }

  // Method to create a product from raw data (e.g., from API or database)
  static fromPrimitives(data: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    stockQuantity?: number;
    createdAt?: string;
    updatedAt?: string;
  }): Product {
    return new Product(
      data.id,
      data.name,
      data.description,
      data.price,
      new ProductCategory(data.category),
      data.stockQuantity || 0,
      data.createdAt ? new Date(data.createdAt) : new Date(),
      data.updatedAt ? new Date(data.updatedAt) : new Date()
    );
  }

  // Method to convert the entity to a plain object
  toPrimitives(): {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    inStock: boolean;
    stockQuantity: number;
    createdAt: string;
    updatedAt: string;
  } {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      price: this._price,
      category: this._category.value,
      inStock: this._inStock,
      stockQuantity: this._stockQuantity,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString()
    };
  }
}
