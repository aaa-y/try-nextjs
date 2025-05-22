import { ValueObject } from '@/core/shared/types/ValueObject';

/**
 * ProductCategory value object
 * 
 * Following DDD principles, this value object:
 * - Is immutable
 * - Has no identity
 * - Is defined by its attributes
 * - Can be replaced rather than modified
 */
export class ProductCategory implements ValueObject<string> {
  private readonly _value: string;
  
  // List of valid categories
  private static readonly VALID_CATEGORIES = [
    'electronics',
    'clothing',
    'books',
    'home',
    'sports',
    'toys',
    'food',
    'health',
    'beauty',
    'other'
  ];

  constructor(value: string) {
    this.validateCategory(value);
    this._value = value.toLowerCase();
  }

  get value(): string {
    return this._value;
  }

  private validateCategory(category: string): void {
    if (!category || category.trim().length === 0) {
      throw new Error('Category cannot be empty');
    }

    const normalizedCategory = category.toLowerCase();
    
    if (!ProductCategory.VALID_CATEGORIES.includes(normalizedCategory)) {
      throw new Error(`Invalid category: ${category}. Valid categories are: ${ProductCategory.VALID_CATEGORIES.join(', ')}`);
    }
  }

  equals(other: ProductCategory): boolean {
    return this._value === other.value;
  }

  toString(): string {
    return this._value;
  }
}
