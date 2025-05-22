/**
 * Data Transfer Object for creating a product
 * 
 * DTOs are used to transfer data between the application layer and the outside world.
 * They help to decouple the domain model from the client interface.
 */
export interface CreateProductDto {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stockQuantity?: number;
}

/**
 * Data Transfer Object for updating a product
 * 
 * All fields are optional since we may want to update only some fields.
 */
export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stockQuantity?: number;
}

/**
 * Data Transfer Object for returning a product
 * 
 * This DTO represents how products are presented to clients.
 */
export interface ProductDto {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
}
