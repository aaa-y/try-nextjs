# Backend Developer 2: Simulated Use Case

## Role: Application Services and Infrastructure Specialist

As Backend Developer 2, you specialize in implementing application services and infrastructure components. Your focus is on creating the bridge between the domain model and the outside world, including API routes, repositories, and external service integrations.

## Current Task: Implementing Review Application Services and Infrastructure

You've been assigned to implement the application services and infrastructure for the new Product Reviews feature, building on the domain model created by Backend Developer 1.

## Step 1: Understanding Requirements

You start by reviewing the requirements for the Product Reviews feature and the domain model created by Backend Developer 1:

- The Review entity and Rating value object have been defined
- The ReviewRepository interface has been created
- You need to implement the application services and infrastructure components
- The feature needs API routes for creating, retrieving, and managing reviews

## Step 2: Creating Data Transfer Objects (DTOs)

First, you create DTOs to define the data contracts between the application and the outside world:

```typescript
// src/core/application/dtos/ReviewDto.ts
/**
 * Data Transfer Object for creating a review
 */
export interface CreateReviewDto {
  productId: string;
  rating: number;
  comment: string;
  authorName: string;
}

/**
 * Data Transfer Object for updating a review
 */
export interface UpdateReviewDto {
  rating?: number;
  comment?: string;
}

/**
 * Data Transfer Object for returning a review
 */
export interface ReviewDto {
  id: string;
  productId: string;
  rating: number;
  comment: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Data Transfer Object for returning a paginated list of reviews
 */
export interface PaginatedReviewsDto {
  reviews: ReviewDto[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

## Step 3: Implementing the Review Service

Next, you implement the application service for reviews:

```typescript
// src/core/application/use-cases/ReviewService.ts
import { Review } from '@/core/domain/entities/Review';
import { Rating } from '@/core/domain/value-objects/Rating';
import { ReviewRepository } from '@/core/domain/repositories/ReviewRepository';
import { 
  CreateReviewDto, 
  UpdateReviewDto, 
  ReviewDto, 
  PaginatedReviewsDto 
} from '@/core/application/dtos/ReviewDto';
import { ReviewCreatedEvent, ReviewUpdatedEvent, ReviewDeletedEvent } from '@/core/domain/events/ReviewEvents';
import { EventBus } from '@/core/shared/types/EventBus';

/**
 * Review service that implements use cases related to reviews
 */
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly eventBus?: EventBus
  ) {}

  /**
   * Get a review by ID
   * @param id The review ID
   * @returns The review or null if not found
   */
  async getReviewById(id: string): Promise<ReviewDto | null> {
    const review = await this.reviewRepository.findById(id);
    return review ? review.toPrimitives() : null;
  }

  /**
   * Get reviews for a product
   * @param productId The product ID
   * @param page The page number (for pagination)
   * @param limit The number of reviews per page
   * @returns Paginated reviews
   */
  async getReviewsForProduct(
    productId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedReviewsDto> {
    const { reviews, totalCount } = await this.reviewRepository.findByProductId(
      productId,
      page,
      limit
    );
    
    const totalPages = Math.ceil(totalCount / limit);
    
    return {
      reviews: reviews.map(review => review.toPrimitives()),
      totalCount,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Create a new review
   * @param reviewDto The review data
   * @returns The created review
   */
  async createReview(reviewDto: CreateReviewDto): Promise<ReviewDto> {
    try {
      const review = Review.create(
        crypto.randomUUID(),
        reviewDto.productId,
        reviewDto.rating,
        reviewDto.comment,
        reviewDto.authorName
      );
      
      await this.reviewRepository.save(review);
      
      // Publish domain event
      if (this.eventBus) {
        await this.eventBus.publish(new ReviewCreatedEvent(review));
      }
      
      return review.toPrimitives();
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  /**
   * Update an existing review
   * @param id The review ID
   * @param reviewDto The updated review data
   * @returns The updated review or null if not found
   */
  async updateReview(id: string, reviewDto: UpdateReviewDto): Promise<ReviewDto | null> {
    try {
      const existingReview = await this.reviewRepository.findById(id);
      
      if (!existingReview) {
        return null;
      }
      
      if (reviewDto.comment !== undefined) {
        existingReview.updateComment(reviewDto.comment);
      }
      
      if (reviewDto.rating !== undefined) {
        existingReview.updateRating(new Rating(reviewDto.rating));
      }
      
      await this.reviewRepository.save(existingReview);
      
      // Publish domain event
      if (this.eventBus) {
        await this.eventBus.publish(new ReviewUpdatedEvent(existingReview));
      }
      
      return existingReview.toPrimitives();
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  }

  /**
   * Delete a review
   * @param id The review ID
   * @returns True if deleted, false if not found
   */
  async deleteReview(id: string): Promise<boolean> {
    try {
      const existingReview = await this.reviewRepository.findById(id);
      
      if (!existingReview) {
        return false;
      }
      
      const productId = existingReview.productId;
      
      await this.reviewRepository.delete(id);
      
      // Publish domain event
      if (this.eventBus) {
        await this.eventBus.publish(new ReviewDeletedEvent(id, productId));
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }
}
```

## Step 4: Implementing the Event Bus Interface

You define the event bus interface for publishing domain events:

```typescript
// src/core/shared/types/EventBus.ts
import { DomainEvent } from '@/core/shared/types/DomainEvent';

export interface EventBus {
  publish(event: DomainEvent): Promise<void>;
  subscribe(eventName: string, callback: (event: DomainEvent) => void): void;
}
```

## Step 5: Implementing the Review Repository

You implement the repository for reviews:

```typescript
// src/infrastructure/repositories/ApiReviewRepository.ts
import { Review } from '@/core/domain/entities/Review';
import { ReviewRepository } from '@/core/domain/repositories/ReviewRepository';

/**
 * API implementation of the ReviewRepository
 */
export class ApiReviewRepository implements ReviewRepository {
  private readonly apiUrl: string;

  constructor(apiUrl: string = '/api/reviews') {
    this.apiUrl = apiUrl;
  }

  async findById(id: string): Promise<Review | null> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch review: ${response.statusText}`);
      }
      
      const data = await response.json();
      return Review.fromPrimitives(data);
    } catch (error) {
      console.error('Error fetching review:', error);
      return null;
    }
  }

  async findByProductId(
    productId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    reviews: Review[];
    totalCount: number;
  }> {
    try {
      const response = await fetch(
        `${this.apiUrl}?productId=${productId}&page=${page}&limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch reviews: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return {
        reviews: data.reviews.map((item: any) => Review.fromPrimitives(item)),
        totalCount: data.totalCount,
      };
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return {
        reviews: [],
        totalCount: 0,
      };
    }
  }

  async save(review: Review): Promise<void> {
    try {
      const method = await this.findById(review.id) ? 'PUT' : 'POST';
      const url = method === 'PUT' ? `${this.apiUrl}/${review.id}` : this.apiUrl;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(review.toPrimitives()),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save review: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error saving review:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete review: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }
}
```

## Step 6: Implementing API Routes

You create API routes for reviews:

```typescript
// src/app/api/reviews/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ReviewService } from '@/core/application/use-cases/ReviewService';
import { ApiReviewRepository } from '@/infrastructure/repositories/ApiReviewRepository';
import { CreateReviewDto } from '@/core/application/dtos/ReviewDto';

// Initialize the repository and service
const reviewRepository = new ApiReviewRepository();
const reviewService = new ReviewService(reviewRepository);

/**
 * GET handler for fetching reviews
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('productId');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const result = await reviewService.getReviewsForProduct(productId, page, limit);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST handler for creating a new review
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    if (!body.productId || !body.rating || !body.comment || !body.authorName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const reviewDto: CreateReviewDto = {
      productId: body.productId,
      rating: Number(body.rating),
      comment: body.comment,
      authorName: body.authorName
    };

    const review = await reviewService.createReview(reviewDto);

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review', message: error.message },
      { status: 500 }
    );
  }
}
```

```typescript
// src/app/api/reviews/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ReviewService } from '@/core/application/use-cases/ReviewService';
import { ApiReviewRepository } from '@/infrastructure/repositories/ApiReviewRepository';
import { UpdateReviewDto } from '@/core/application/dtos/ReviewDto';

// Initialize the repository and service
const reviewRepository = new ApiReviewRepository();
const reviewService = new ReviewService(reviewRepository);

/**
 * GET handler for fetching a review by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const review = await reviewService.getReviewById(id);

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(review);
  } catch (error: any) {
    console.error(`Error fetching review ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch review', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT handler for updating a review
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    const updateDto: UpdateReviewDto = {
      rating: body.rating !== undefined ? Number(body.rating) : undefined,
      comment: body.comment
    };

    const updatedReview = await reviewService.updateReview(id, updateDto);

    if (!updatedReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedReview);
  } catch (error: any) {
    console.error(`Error updating review ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update review', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler for deleting a review
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const deleted = await reviewService.deleteReview(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Review deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Error deleting review ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete review', message: error.message },
      { status: 500 }
    );
  }
}
```

```typescript
// src/app/api/products/[id]/reviews/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ReviewService } from '@/core/application/use-cases/ReviewService';
import { ApiReviewRepository } from '@/infrastructure/repositories/ApiReviewRepository';

// Initialize the repository and service
const reviewRepository = new ApiReviewRepository();
const reviewService = new ReviewService(reviewRepository);

/**
 * GET handler for fetching reviews for a specific product
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const result = await reviewService.getReviewsForProduct(productId, page, limit);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error(`Error fetching reviews for product ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews', message: error.message },
      { status: 500 }
    );
  }
}
```

## Step 7: Writing Integration Tests

You write integration tests to ensure your implementation works correctly:

```typescript
// tests/integration/api/reviews.test.ts
import { createRequest, createResponse } from 'node-mocks-http';
import { GET, POST } from '@/app/api/reviews/route';
import { ReviewService } from '@/core/application/use-cases/ReviewService';

// Mock the ReviewService
jest.mock('@/core/application/use-cases/ReviewService');

describe('Reviews API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('GET /api/reviews', () => {
    it('should return reviews for a product', async () => {
      // Mock data
      const mockReviews = {
        reviews: [
          {
            id: '1',
            productId: '123',
            rating: 4,
            comment: 'Great product!',
            authorName: 'John Doe',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        totalCount: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
      
      // Mock the service method
      (ReviewService.prototype.getReviewsForProduct as jest.Mock).mockResolvedValue(mockReviews);
      
      // Create mock request and response
      const req = createRequest({
        method: 'GET',
        url: '/api/reviews?productId=123&page=1&limit=10',
      });
      const res = createResponse();
      
      // Call the handler
      await GET(req, res);
      
      // Check the response
      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(mockReviews);
      expect(ReviewService.prototype.getReviewsForProduct).toHaveBeenCalledWith('123', 1, 10);
    });
    
    it('should return 400 if productId is missing', async () => {
      // Create mock request and response
      const req = createRequest({
        method: 'GET',
        url: '/api/reviews',
      });
      const res = createResponse();
      
      // Call the handler
      await GET(req, res);
      
      // Check the response
      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toHaveProperty('error', 'Product ID is required');
    });
  });
  
  describe('POST /api/reviews', () => {
    it('should create a new review', async () => {
      // Mock data
      const mockReviewDto = {
        productId: '123',
        rating: 4,
        comment: 'Great product!',
        authorName: 'John Doe',
      };
      
      const mockCreatedReview = {
        id: '1',
        ...mockReviewDto,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Mock the service method
      (ReviewService.prototype.createReview as jest.Mock).mockResolvedValue(mockCreatedReview);
      
      // Create mock request and response
      const req = createRequest({
        method: 'POST',
        url: '/api/reviews',
        body: mockReviewDto,
      });
      const res = createResponse();
      
      // Call the handler
      await POST(req, res);
      
      // Check the response
      expect(res._getStatusCode()).toBe(201);
      expect(JSON.parse(res._getData())).toEqual(mockCreatedReview);
      expect(ReviewService.prototype.createReview).toHaveBeenCalledWith(mockReviewDto);
    });
    
    it('should return 400 if required fields are missing', async () => {
      // Create mock request and response with missing fields
      const req = createRequest({
        method: 'POST',
        url: '/api/reviews',
        body: {
          productId: '123',
          // Missing rating, comment, and authorName
        },
      });
      const res = createResponse();
      
      // Call the handler
      await POST(req, res);
      
      // Check the response
      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toHaveProperty('error', 'Missing required fields');
    });
  });
});
```

## Step 8: Collaboration with Other Developers

You coordinate with Backend Developer 1 who created the domain model. You also work with Frontend Developer 2 to ensure the API endpoints meet the requirements of the UI components.

## Outcome

You've successfully implemented the application services and infrastructure for the Product Reviews feature. Your implementation includes:

1. DTOs for data transfer between layers
2. The ReviewService for handling use cases
3. The ApiReviewRepository for data access
4. API routes for creating, retrieving, and managing reviews
5. Integration tests to verify the API endpoints

These components provide the necessary functionality for the frontend to interact with the review data, while maintaining the separation of concerns and following DDD principles.
