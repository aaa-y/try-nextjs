# Implementation Guide: Product & User Management

This guide provides detailed implementation instructions for both teams working on Product Management and User Management features.

## Architecture Overview

We'll maintain our DDD architecture with clear separation between:

1. **Domain Layer**: Entities, value objects, repository interfaces
2. **Application Layer**: Use cases, services, DTOs
3. **Infrastructure Layer**: Repository implementations, external services
4. **UI Layer**: Pages, components, hooks

## Team A: Product Management Implementation

### Step 1: Domain Layer Implementation

#### Product Entity

```typescript
// src/core/domain/entities/Product.ts
import { Entity } from '@/core/shared/types/Entity';
import { Category } from './Category';
import { Inventory } from '@/core/domain/value-objects/Inventory';
import { ProductTag } from '@/core/domain/value-objects/ProductTag';

export class Product implements Entity<string> {
  private _id: string;
  private _name: string;
  private _description: string;
  private _price: number;
  private _images: string[];
  private _categories: Category[];
  private _tags: ProductTag[];
  private _inventory: Inventory;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: string,
    name: string,
    description: string,
    price: number,
    images: string[],
    categories: Category[],
    tags: ProductTag[],
    inventory: Inventory,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    // Implementation with validation
  }

  // Getters, business methods, factory methods
}
```

#### Category Entity

```typescript
// src/core/domain/entities/Category.ts
import { Entity } from '@/core/shared/types/Entity';

export class Category implements Entity<string> {
  private _id: string;
  private _name: string;
  private _description: string;
  private _parentCategoryId: string | null;

  constructor(
    id: string,
    name: string,
    description: string,
    parentCategoryId: string | null = null
  ) {
    // Implementation with validation
  }

  // Getters, business methods, factory methods
}
```

#### Inventory Value Object

```typescript
// src/core/domain/value-objects/Inventory.ts
import { ValueObject } from '@/core/shared/types/ValueObject';

export enum InventoryStatus {
  IN_STOCK = 'in_stock',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock'
}

export class Inventory implements ValueObject<number> {
  private readonly _quantity: number;
  private readonly _status: InventoryStatus;

  constructor(quantity: number) {
    this._quantity = quantity;
    this._status = this.calculateStatus(quantity);
  }

  // Implementation with methods
}
```

#### Repository Interfaces

```typescript
// src/core/domain/repositories/ProductRepository.ts
import { Product } from '@/core/domain/entities/Product';
import { ProductTag } from '@/core/domain/value-objects/ProductTag';

export interface ProductFilters {
  categoryIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  inStock?: boolean;
}

export interface ProductRepository {
  findById(id: string): Promise<Product | null>;
  findAll(filters?: ProductFilters, page?: number, limit?: number): Promise<{
    products: Product[];
    totalCount: number;
  }>;
  search(query: string, filters?: ProductFilters): Promise<Product[]>;
  save(product: Product): Promise<void>;
  delete(id: string): Promise<void>;
}
```

### Step 2: Application Layer Implementation

#### Product Service

```typescript
// src/core/application/use-cases/ProductService.ts
import { Product } from '@/core/domain/entities/Product';
import { ProductRepository, ProductFilters } from '@/core/domain/repositories/ProductRepository';
import { CreateProductDto, UpdateProductDto } from '@/core/application/dtos/ProductDto';

export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getProducts(filters?: ProductFilters, page: number = 1, limit: number = 10): Promise<{
    products: Product[];
    totalCount: number;
  }> {
    return this.productRepository.findAll(filters, page, limit);
  }

  // Other methods: getProductById, createProduct, updateProduct, deleteProduct, searchProducts
}
```

### Step 3: Infrastructure Layer Implementation

#### API Product Repository

```typescript
// src/infrastructure/repositories/ApiProductRepository.ts
import { Product } from '@/core/domain/entities/Product';
import { ProductRepository, ProductFilters } from '@/core/domain/repositories/ProductRepository';

export class ApiProductRepository implements ProductRepository {
  private readonly baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3000/api') {
    this.baseUrl = baseUrl;
  }

  // Implementation of repository methods
}
```

### Step 4: UI Layer Implementation

#### Product Listing Page

```typescript
// src/app/(shop)/products/page.tsx
import { ProductService } from '@/core/application/use-cases/ProductService';
import { ApiProductRepository } from '@/infrastructure/repositories/ApiProductRepository';
import ProductList from '@/ui/components/organisms/ProductList';
import ProductFilters from '@/ui/components/organisms/ProductFilters';

// Implementation of the products page with filtering and pagination
```

## Team B: User Management Implementation

### Step 1: Domain Layer Implementation

#### User Entity

```typescript
// src/core/domain/entities/User.ts
import { Entity } from '@/core/shared/types/Entity';
import { Role } from './Role';
import { Email } from '@/core/domain/value-objects/Email';
import { Password } from '@/core/domain/value-objects/Password';

export class User implements Entity<string> {
  private _id: string;
  private _email: Email;
  private _password: Password;
  private _name: string;
  private _roles: Role[];
  private _preferences: Record<string, any>;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: string,
    email: Email,
    password: Password,
    name: string,
    roles: Role[] = [],
    preferences: Record<string, any> = {},
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    // Implementation with validation
  }

  // Getters, business methods, factory methods
}
```

#### Role Entity

```typescript
// src/core/domain/entities/Role.ts
import { Entity } from '@/core/shared/types/Entity';
import { Permission } from '@/core/domain/value-objects/Permission';

export class Role implements Entity<string> {
  private _id: string;
  private _name: string;
  private _permissions: Permission[];

  constructor(
    id: string,
    name: string,
    permissions: Permission[] = []
  ) {
    // Implementation with validation
  }

  // Getters, business methods, factory methods
}
```

#### Repository Interfaces

```typescript
// src/core/domain/repositories/UserRepository.ts
import { User } from '@/core/domain/entities/User';
import { Email } from '@/core/domain/value-objects/Email';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findAll(page?: number, limit?: number): Promise<{
    users: User[];
    totalCount: number;
  }>;
  save(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}
```

### Step 2: Application Layer Implementation

#### User Service

```typescript
// src/core/application/use-cases/UserService.ts
import { User } from '@/core/domain/entities/User';
import { UserRepository } from '@/core/domain/repositories/UserRepository';
import { RegisterUserDto, UpdateUserDto } from '@/core/application/dtos/UserDto';
import { Email } from '@/core/domain/value-objects/Email';
import { Password } from '@/core/domain/value-objects/Password';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async registerUser(userDto: RegisterUserDto): Promise<User> {
    // Implementation
  }

  // Other methods: getUserById, updateUser, deleteUser
}
```

#### Auth Service

```typescript
// src/core/application/use-cases/AuthService.ts
import { UserRepository } from '@/core/domain/repositories/UserRepository';
import { Email } from '@/core/domain/value-objects/Email';
import { TokenService } from '@/infrastructure/services/TokenService';

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService
  ) {}

  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    // Implementation
  }

  // Other methods: logout, refreshToken, verifyPermission
}
```

### Step 3: Infrastructure Layer Implementation

#### API User Repository

```typescript
// src/infrastructure/repositories/ApiUserRepository.ts
import { User } from '@/core/domain/entities/User';
import { UserRepository } from '@/core/domain/repositories/UserRepository';
import { Email } from '@/core/domain/value-objects/Email';

export class ApiUserRepository implements UserRepository {
  private readonly baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3000/api') {
    this.baseUrl = baseUrl;
  }

  // Implementation of repository methods
}
```

### Step 4: UI Layer Implementation

#### Registration Page

```typescript
// src/app/(auth)/register/page.tsx
import { RegisterForm } from '@/ui/components/organisms/RegisterForm';

// Implementation of the registration page
```

## Integration Points

### Shared Types

```typescript
// src/core/shared/types/Entity.ts
export interface Entity<T> {
  readonly id: T;
}

// src/core/shared/types/ValueObject.ts
export interface ValueObject<T> {
  readonly value: T;
  equals(other: ValueObject<T>): boolean;
}
```

### Cross-Domain Events

```typescript
// src/core/shared/events/EventBus.ts
import { DomainEvent } from '@/core/shared/types/DomainEvent';

export interface EventBus {
  publish(event: DomainEvent): Promise<void>;
  subscribe(eventName: string, callback: (event: DomainEvent) => void): void;
}
```

### Permission-Based UI Components

```typescript
// src/ui/components/molecules/PermissionGuard.tsx
import { useAuth } from '@/ui/hooks/useAuth';

interface PermissionGuardProps {
  requiredPermission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGuard({ requiredPermission, children, fallback }: PermissionGuardProps) {
  const { hasPermission } = useAuth();
  
  if (hasPermission(requiredPermission)) {
    return <>{children}</>;
  }
  
  return fallback ? <>{fallback}</> : null;
}
```

## Testing Strategy

### Unit Testing

- Test domain entities and value objects
- Test application services
- Mock dependencies

### Integration Testing

- Test repository implementations
- Test API endpoints
- Use test database

### End-to-End Testing

- Test complete user flows
- Test cross-feature interactions
- Use Cypress or Playwright
