# Backend Developer 1: Simulated Use Case

## Role: Domain Modeling Specialist

As Backend Developer 1, you specialize in domain modeling and core business logic. Your focus is on creating robust domain entities, value objects, and repository interfaces that accurately represent the business domain.

## Current Task: Implementing Review Domain Model

You've been assigned to create the domain model for the new Product Reviews feature. This includes defining the Review entity, value objects, and repository interfaces.

## Step 1: Understanding Requirements

You start by reviewing the requirements for the Product Reviews feature:

- Users can submit reviews for products
- Each review includes a rating (1-5 stars), comment, author name, and date
- Reviews must be associated with a specific product
- Ratings must be between 1 and 5
- Comments must not be empty and should have a maximum length
- Reviews should be sortable by date or rating

## Step 2: Creating the Rating Value Object

You start by implementing the Rating value object to encapsulate the rating logic:

```typescript
// src/core/domain/value-objects/Rating.ts
import { ValueObject } from '@/core/shared/types/ValueObject';

/**
 * Rating value object representing a product rating
 * 
 * Following DDD principles, this value object:
 * - Is immutable
 * - Has no identity
 * - Is defined by its attributes
 * - Encapsulates validation logic
 */
export class Rating implements ValueObject<number> {
  private readonly _value: number;
  
  private static readonly MIN_RATING = 1;
  private static readonly MAX_RATING = 5;

  constructor(value: number) {
    this.validateRating(value);
    this._value = value;
  }

  get value(): number {
    return this._value;
  }

  private validateRating(rating: number): void {
    if (!Number.isInteger(rating)) {
      throw new Error('Rating must be an integer');
    }
    
    if (rating < Rating.MIN_RATING || rating > Rating.MAX_RATING) {
      throw new Error(`Rating must be between ${Rating.MIN_RATING} and ${Rating.MAX_RATING}`);
    }
  }

  equals(other: Rating): boolean {
    return this._value === other.value;
  }

  toString(): string {
    return this._value.toString();
  }
}
```

## Step 3: Creating the Review Entity

Next, you implement the Review entity:

```typescript
// src/core/domain/entities/Review.ts
import { Entity } from '@/core/shared/types/Entity';
import { Rating } from '@/core/domain/value-objects/Rating';

/**
 * Review entity representing a product review
 * 
 * Following DDD principles, this entity:
 * - Has a unique identity
 * - Contains business logic related to reviews
 * - Encapsulates its state
 * - Provides methods to manipulate its state in a controlled way
 */
export class Review implements Entity<string> {
  private _id: string;
  private _productId: string;
  private _rating: Rating;
  private _comment: string;
  private _authorName: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  private static readonly MAX_COMMENT_LENGTH = 1000;
  private static readonly MAX_AUTHOR_NAME_LENGTH = 100;

  constructor(
    id: string,
    productId: string,
    rating: Rating,
    comment: string,
    authorName: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this._id = id;
    this._productId = productId;
    this._rating = rating;
    this._comment = comment;
    this._authorName = authorName;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;

    this.validateReview();
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get productId(): string {
    return this._productId;
  }

  get rating(): Rating {
    return this._rating;
  }

  get comment(): string {
    return this._comment;
  }

  get authorName(): string {
    return this._authorName;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business logic methods
  updateComment(comment: string): void {
    this.validateComment(comment);
    this._comment = comment;
    this._updatedAt = new Date();
  }

  updateRating(rating: Rating): void {
    this._rating = rating;
    this._updatedAt = new Date();
  }

  // Validation logic
  private validateReview(): void {
    if (!this._id) {
      throw new Error('Review ID is required');
    }
    
    if (!this._productId) {
      throw new Error('Product ID is required');
    }
    
    this.validateComment(this._comment);
    this.validateAuthorName(this._authorName);
  }

  private validateComment(comment: string): void {
    if (!comment || comment.trim().length === 0) {
      throw new Error('Comment cannot be empty');
    }
    
    if (comment.length > Review.MAX_COMMENT_LENGTH) {
      throw new Error(`Comment cannot exceed ${Review.MAX_COMMENT_LENGTH} characters`);
    }
  }

  private validateAuthorName(authorName: string): void {
    if (!authorName || authorName.trim().length === 0) {
      throw new Error('Author name cannot be empty');
    }
    
    if (authorName.length > Review.MAX_AUTHOR_NAME_LENGTH) {
      throw new Error(`Author name cannot exceed ${Review.MAX_AUTHOR_NAME_LENGTH} characters`);
    }
  }

  // Factory method for creating a review
  static create(
    id: string,
    productId: string,
    rating: number,
    comment: string,
    authorName: string
  ): Review {
    return new Review(
      id,
      productId,
      new Rating(rating),
      comment,
      authorName
    );
  }

  // Method to create a review from raw data (e.g., from API or database)
  static fromPrimitives(data: {
    id: string;
    productId: string;
    rating: number;
    comment: string;
    authorName: string;
    createdAt?: string;
    updatedAt?: string;
  }): Review {
    return new Review(
      data.id,
      data.productId,
      new Rating(data.rating),
      data.comment,
      data.authorName,
      data.createdAt ? new Date(data.createdAt) : new Date(),
      data.updatedAt ? new Date(data.updatedAt) : new Date()
    );
  }

  // Method to convert the entity to a plain object
  toPrimitives(): {
    id: string;
    productId: string;
    rating: number;
    comment: string;
    authorName: string;
    createdAt: string;
    updatedAt: string;
  } {
    return {
      id: this._id,
      productId: this._productId,
      rating: this._rating.value,
      comment: this._comment,
      authorName: this._authorName,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString()
    };
  }
}
```

## Step 4: Creating the Review Repository Interface

You define the repository interface for reviews:

```typescript
// src/core/domain/repositories/ReviewRepository.ts
import { Review } from '@/core/domain/entities/Review';

/**
 * Repository interface for Review entity
 * 
 * Following DDD principles, repositories:
 * - Provide a collection-like interface for accessing domain objects
 * - Abstract the underlying persistence mechanism
 * - Work with domain objects (entities and value objects)
 */
export interface ReviewRepository {
  /**
   * Find a review by its ID
   * @param id The review ID
   * @returns A Promise that resolves to the review or null if not found
   */
  findById(id: string): Promise<Review | null>;

  /**
   * Find reviews for a specific product
   * @param productId The product ID
   * @param page The page number (for pagination)
   * @param limit The number of reviews per page
   * @returns A Promise that resolves to an object with reviews and total count
   */
  findByProductId(
    productId: string,
    page?: number,
    limit?: number
  ): Promise<{
    reviews: Review[];
    totalCount: number;
  }>;

  /**
   * Save a review (create or update)
   * @param review The review to save
   * @returns A Promise that resolves when the operation is complete
   */
  save(review: Review): Promise<void>;

  /**
   * Delete a review
   * @param id The ID of the review to delete
   * @returns A Promise that resolves when the operation is complete
   */
  delete(id: string): Promise<void>;
}
```

## Step 5: Updating the Product Entity

You update the Product entity to include a relationship with reviews:

```typescript
// src/core/domain/entities/Product.ts (partial update)
import { Review } from '@/core/domain/entities/Review';

export class Product implements Entity<string> {
  // Existing properties...
  
  private _reviews: Review[] = [];
  
  // Existing constructor and methods...
  
  // New methods for reviews
  get reviews(): Review[] {
    return [...this._reviews]; // Return a copy to prevent direct modification
  }
  
  addReview(review: Review): void {
    if (review.productId !== this.id) {
      throw new Error('Review does not belong to this product');
    }
    
    this._reviews.push(review);
    this._updatedAt = new Date();
  }
  
  removeReview(reviewId: string): void {
    const index = this._reviews.findIndex(review => review.id === reviewId);
    
    if (index !== -1) {
      this._reviews.splice(index, 1);
      this._updatedAt = new Date();
    }
  }
  
  getAverageRating(): number | null {
    if (this._reviews.length === 0) {
      return null;
    }
    
    const sum = this._reviews.reduce((total, review) => total + review.rating.value, 0);
    return sum / this._reviews.length;
  }
  
  // Update toPrimitives method to include reviews
  toPrimitives(): {
    // Existing properties...
    reviews?: {
      id: string;
      rating: number;
      comment: string;
      authorName: string;
      createdAt: string;
    }[];
    averageRating?: number | null;
  } {
    return {
      // Existing properties...
      reviews: this._reviews.length > 0
        ? this._reviews.map(review => ({
            id: review.id,
            rating: review.rating.value,
            comment: review.comment,
            authorName: review.authorName,
            createdAt: review.createdAt.toISOString(),
          }))
        : undefined,
      averageRating: this.getAverageRating(),
    };
  }
}
```

## Step 6: Creating Domain Events

You define domain events for reviews to enable loose coupling between components:

```typescript
// src/core/domain/events/ReviewEvents.ts
import { DomainEvent } from '@/core/shared/types/DomainEvent';
import { Review } from '@/core/domain/entities/Review';

export class ReviewCreatedEvent implements DomainEvent {
  readonly name = 'review.created';
  readonly occurredOn: Date;
  
  constructor(
    public readonly review: Review
  ) {
    this.occurredOn = new Date();
  }
}

export class ReviewUpdatedEvent implements DomainEvent {
  readonly name = 'review.updated';
  readonly occurredOn: Date;
  
  constructor(
    public readonly review: Review
  ) {
    this.occurredOn = new Date();
  }
}

export class ReviewDeletedEvent implements DomainEvent {
  readonly name = 'review.deleted';
  readonly occurredOn: Date;
  
  constructor(
    public readonly reviewId: string,
    public readonly productId: string
  ) {
    this.occurredOn = new Date();
  }
}
```

## Step 7: Creating the Domain Event Interface

You define the domain event interface:

```typescript
// src/core/shared/types/DomainEvent.ts
export interface DomainEvent {
  readonly name: string;
  readonly occurredOn: Date;
}
```

## Step 8: Writing Unit Tests

You write unit tests to ensure your domain model works correctly:

```typescript
// tests/unit/domain/entities/Review.test.ts
import { Review } from '@/core/domain/entities/Review';
import { Rating } from '@/core/domain/value-objects/Rating';

describe('Review Entity', () => {
  const validReviewData = {
    id: '123',
    productId: '456',
    rating: 4,
    comment: 'Great product!',
    authorName: 'John Doe',
  };
  
  it('should create a valid review', () => {
    const review = Review.create(
      validReviewData.id,
      validReviewData.productId,
      validReviewData.rating,
      validReviewData.comment,
      validReviewData.authorName
    );
    
    expect(review.id).toBe(validReviewData.id);
    expect(review.productId).toBe(validReviewData.productId);
    expect(review.rating.value).toBe(validReviewData.rating);
    expect(review.comment).toBe(validReviewData.comment);
    expect(review.authorName).toBe(validReviewData.authorName);
  });
  
  it('should throw an error for invalid rating', () => {
    expect(() => {
      Review.create(
        validReviewData.id,
        validReviewData.productId,
        6, // Invalid rating (> 5)
        validReviewData.comment,
        validReviewData.authorName
      );
    }).toThrow('Rating must be between 1 and 5');
  });
  
  it('should throw an error for empty comment', () => {
    expect(() => {
      Review.create(
        validReviewData.id,
        validReviewData.productId,
        validReviewData.rating,
        '', // Empty comment
        validReviewData.authorName
      );
    }).toThrow('Comment cannot be empty');
  });
  
  it('should throw an error for empty author name', () => {
    expect(() => {
      Review.create(
        validReviewData.id,
        validReviewData.productId,
        validReviewData.rating,
        validReviewData.comment,
        '' // Empty author name
      );
    }).toThrow('Author name cannot be empty');
  });
  
  it('should update comment correctly', () => {
    const review = Review.create(
      validReviewData.id,
      validReviewData.productId,
      validReviewData.rating,
      validReviewData.comment,
      validReviewData.authorName
    );
    
    const newComment = 'Updated comment';
    review.updateComment(newComment);
    
    expect(review.comment).toBe(newComment);
  });
  
  it('should update rating correctly', () => {
    const review = Review.create(
      validReviewData.id,
      validReviewData.productId,
      validReviewData.rating,
      validReviewData.comment,
      validReviewData.authorName
    );
    
    const newRating = new Rating(5);
    review.updateRating(newRating);
    
    expect(review.rating.value).toBe(5);
  });
});
```

## Step 9: Collaboration with Other Developers

You coordinate with Backend Developer 2 who will implement the application services and infrastructure for reviews. You also discuss with Frontend Developer 1 about the data model to ensure it meets the UI requirements.

## Outcome

You've successfully created a robust domain model for the Product Reviews feature. The model includes:

1. A Rating value object that encapsulates rating validation
2. A Review entity with business rules and validation
3. A ReviewRepository interface for data access
4. Domain events for loose coupling
5. Unit tests to verify the model's correctness

This domain model provides a solid foundation for the application services and infrastructure implementations that will be built by Backend Developer 2.
