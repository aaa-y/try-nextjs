# QA Engineer: Simulated Use Case

## Role: Quality Assurance Specialist

As the QA Engineer on the Next.js DDD project, you are responsible for ensuring the quality of the application through comprehensive testing. Your focus is on verifying that the application meets requirements, identifying bugs, and providing feedback to the development team.

## Current Task: Testing the Product Reviews Feature

You've been assigned to test the new Product Reviews feature that has been implemented by the frontend and backend developers.

## Step 1: Understanding Requirements

You start by reviewing the requirements for the Product Reviews feature:

- Users can view reviews for a product on the product detail page
- Users can navigate to a dedicated page to write a review
- Each review includes a rating (1-5 stars), comment, author name, and date
- Ratings must be between 1 and 5
- Comments must not be empty and should have a maximum length
- Reviews should be paginated with a "Load More" option
- The UI should handle loading, error, and success states

## Step 2: Creating a Test Plan

You create a comprehensive test plan for the Product Reviews feature:

```markdown
# Test Plan: Product Reviews Feature

## 1. Test Scope

This test plan covers the Product Reviews feature, including:
- Viewing reviews on the product detail page
- Submitting new reviews
- Pagination of reviews
- Error handling and validation

## 2. Test Environments

- Development environment: http://localhost:3000
- Staging environment: https://staging.example.com
- Browsers: Chrome, Firefox, Safari, Edge
- Devices: Desktop, Tablet, Mobile

## 3. Test Types

- Unit Testing: Verify individual components and functions
- Integration Testing: Test API endpoints and their integration with the frontend
- End-to-End Testing: Test complete user flows
- Manual Testing: Verify UI, UX, and edge cases

## 4. Test Cases

### 4.1 Viewing Reviews

| ID | Test Case | Steps | Expected Result |
|----|-----------|-------|-----------------|
| V1 | View reviews on product detail page | 1. Navigate to a product detail page | Reviews section is displayed with existing reviews |
| V2 | Empty reviews state | 1. Navigate to a product with no reviews | "No reviews yet" message is displayed |
| V3 | Pagination | 1. Navigate to a product with many reviews<br>2. Scroll to the bottom of the reviews<br>3. Click "Load More" | Additional reviews are loaded and displayed |
| V4 | Loading state | 1. Navigate to a product detail page with slow network | Loading indicator is shown while reviews are being fetched |
| V5 | Error state | 1. Simulate API error when fetching reviews | Error message is displayed with appropriate styling |

### 4.2 Submitting Reviews

| ID | Test Case | Steps | Expected Result |
|----|-----------|-------|-----------------|
| S1 | Navigate to review form | 1. On product detail page, click "Write a Review" | User is navigated to the review submission page |
| S2 | Submit valid review | 1. Fill in all fields with valid data<br>2. Click "Submit" | Review is submitted successfully<br>User is redirected to product page<br>Success message is displayed |
| S3 | Validation - Empty fields | 1. Leave fields empty<br>2. Click "Submit" | Form submission is prevented<br>Error messages are displayed for empty fields |
| S4 | Validation - Rating | 1. Don't select a rating<br>2. Fill other fields<br>3. Click "Submit" | Form submission is prevented<br>Error message for rating is displayed |
| S5 | Validation - Comment length | 1. Enter a very long comment (>1000 chars)<br>2. Fill other fields<br>3. Click "Submit" | Form submission is prevented<br>Error message for comment length is displayed |
| S6 | Cancel submission | 1. Fill in some fields<br>2. Click "Cancel" | User is navigated back to product page<br>No review is submitted |
| S7 | Error handling | 1. Simulate API error during submission<br>2. Fill all fields<br>3. Click "Submit" | Error message is displayed<br>Form remains filled with user input |

### 4.3 API Testing

| ID | Test Case | Expected Result |
|----|-----------|-----------------|
| A1 | GET /api/products/{id}/reviews | Returns reviews for the specified product with pagination |
| A2 | POST /api/reviews | Creates a new review with valid data |
| A3 | GET /api/reviews/{id} | Returns a specific review by ID |
| A4 | PUT /api/reviews/{id} | Updates an existing review |
| A5 | DELETE /api/reviews/{id} | Deletes a review |
| A6 | API validation | Returns appropriate error responses for invalid inputs |

## 5. Test Data

- Products with reviews: IDs 1, 2, 3
- Products without reviews: IDs 4, 5
- Valid review data:
  - Rating: 1-5
  - Comment: "This is a test review"
  - Author Name: "Test User"
- Invalid review data:
  - Rating: 0, 6, "abc"
  - Comment: "" (empty), [very long string]
  - Author Name: "" (empty)

## 6. Test Schedule

- Unit Testing: During development
- Integration Testing: After backend implementation
- End-to-End Testing: After frontend implementation
- Manual Testing: Before release

## 7. Risks and Mitigations

- Risk: API performance issues with many reviews
  - Mitigation: Test with large datasets and implement pagination

- Risk: Cross-browser compatibility issues
  - Mitigation: Test on multiple browsers and devices

- Risk: Form validation edge cases
  - Mitigation: Comprehensive testing of validation rules
```

## Step 3: Writing Unit Tests

You write unit tests for the Review entity and value objects:

```typescript
// tests/unit/domain/value-objects/Rating.test.ts
import { Rating } from '@/core/domain/value-objects/Rating';

describe('Rating Value Object', () => {
  it('should create a valid rating', () => {
    const rating = new Rating(4);
    expect(rating.value).toBe(4);
  });
  
  it('should throw an error for rating below minimum', () => {
    expect(() => new Rating(0)).toThrow('Rating must be between 1 and 5');
  });
  
  it('should throw an error for rating above maximum', () => {
    expect(() => new Rating(6)).toThrow('Rating must be between 1 and 5');
  });
  
  it('should throw an error for non-integer rating', () => {
    expect(() => new Rating(3.5)).toThrow('Rating must be an integer');
  });
  
  it('should compare ratings correctly', () => {
    const rating1 = new Rating(4);
    const rating2 = new Rating(4);
    const rating3 = new Rating(5);
    
    expect(rating1.equals(rating2)).toBe(true);
    expect(rating1.equals(rating3)).toBe(false);
  });
});
```

## Step 4: Writing Integration Tests

You write integration tests for the review API endpoints:

```typescript
// tests/integration/api/reviews.test.ts
import { createServer } from 'http';
import { apiResolver } from 'next/dist/server/api-utils/node';
import request from 'supertest';
import { GET, POST } from '@/app/api/reviews/route';
import { GET as getProductReviews } from '@/app/api/products/[id]/reviews/route';

// Mock the ReviewService
jest.mock('@/core/application/use-cases/ReviewService', () => {
  return {
    ReviewService: jest.fn().mockImplementation(() => ({
      getReviewsForProduct: jest.fn().mockImplementation((productId, page, limit) => {
        return Promise.resolve({
          reviews: [
            {
              id: '1',
              productId,
              rating: 4,
              comment: 'Great product!',
              authorName: 'John Doe',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          totalCount: 1,
          page,
          limit,
          totalPages: 1,
        });
      }),
      createReview: jest.fn().mockImplementation((reviewDto) => {
        return Promise.resolve({
          id: '1',
          ...reviewDto,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }),
    })),
  };
});

describe('Reviews API Integration Tests', () => {
  let server;
  
  beforeAll(() => {
    server = createServer((req, res) => {
      if (req.url.startsWith('/api/products/') && req.url.includes('/reviews')) {
        return apiResolver(
          req,
          res,
          { id: req.url.split('/')[3] },
          getProductReviews,
          {},
          false
        );
      }
      
      if (req.url.startsWith('/api/reviews')) {
        if (req.method === 'GET') {
          return apiResolver(req, res, {}, GET, {}, false);
        }
        if (req.method === 'POST') {
          return apiResolver(req, res, {}, POST, {}, false);
        }
      }
      
      res.statusCode = 404;
      res.end('Not Found');
    });
    
    server.listen(0);
  });
  
  afterAll((done) => {
    server.close(done);
  });
  
  it('should fetch reviews for a product', async () => {
    const response = await request(server)
      .get('/api/products/123/reviews?page=1&limit=10');
    
    expect(response.status).toBe(200);
    expect(response.body.reviews).toHaveLength(1);
    expect(response.body.reviews[0].productId).toBe('123');
  });
  
  it('should create a new review', async () => {
    const reviewData = {
      productId: '123',
      rating: 4,
      comment: 'Great product!',
      authorName: 'John Doe',
    };
    
    const response = await request(server)
      .post('/api/reviews')
      .send(reviewData);
    
    expect(response.status).toBe(201);
    expect(response.body.productId).toBe('123');
    expect(response.body.rating).toBe(4);
  });
  
  it('should return 400 for missing fields', async () => {
    const reviewData = {
      productId: '123',
      // Missing rating, comment, and authorName
    };
    
    const response = await request(server)
      .post('/api/reviews')
      .send(reviewData);
    
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing required fields');
  });
});
```

## Step 5: Writing End-to-End Tests

You write end-to-end tests using Cypress to test the complete user flow:

```typescript
// cypress/e2e/reviews.spec.ts
describe('Product Reviews Feature', () => {
  beforeEach(() => {
    // Mock API responses
    cy.intercept('GET', '/api/products/1', {
      statusCode: 200,
      body: {
        id: '1',
        name: 'Test Product',
        description: 'This is a test product',
        price: 99.99,
        category: 'electronics',
        inStock: true,
        stockQuantity: 10,
      },
    });
    
    cy.intercept('GET', '/api/products/1/reviews*', {
      statusCode: 200,
      body: {
        reviews: [
          {
            id: '1',
            productId: '1',
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
      },
    });
    
    cy.intercept('POST', '/api/reviews', {
      statusCode: 201,
      body: {
        id: '2',
        productId: '1',
        rating: 5,
        comment: 'Excellent product!',
        authorName: 'Test User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  });
  
  it('should display reviews on product detail page', () => {
    cy.visit('/products/1');
    
    cy.contains('Customer Reviews');
    cy.contains('John Doe');
    cy.contains('Great product!');
    
    // Check for rating stars
    cy.get('[aria-label="4 stars"]').should('exist');
  });
  
  it('should navigate to review form and submit a review', () => {
    cy.visit('/products/1');
    
    // Click on "Write a Review" button
    cy.contains('Write a Review').click();
    
    // Verify we're on the review form page
    cy.url().should('include', '/products/1/reviews/new');
    cy.contains('Write a Review for Test Product');
    
    // Fill in the form
    cy.get('[aria-label="5 stars"]').click();
    cy.get('#authorName').type('Test User');
    cy.get('#comment').type('Excellent product!');
    
    // Submit the form
    cy.contains('Submit Review').click();
    
    // Verify we're redirected back to product page
    cy.url().should('include', '/products/1');
    cy.url().should('include', 'reviewSubmitted=true');
    
    // Verify success message
    cy.contains('Your review has been submitted successfully!');
  });
  
  it('should validate the review form', () => {
    cy.visit('/products/1/reviews/new');
    
    // Try to submit without filling in the form
    cy.contains('Submit Review').should('be.disabled');
    
    // Fill in only some fields
    cy.get('#authorName').type('Test User');
    cy.contains('Submit Review').should('be.disabled');
    
    // Add comment but no rating
    cy.get('#comment').type('Excellent product!');
    cy.contains('Submit Review').should('be.disabled');
    
    // Add rating
    cy.get('[aria-label="5 stars"]').click();
    cy.contains('Submit Review').should('not.be.disabled');
  });
  
  it('should handle API errors when fetching reviews', () => {
    // Override the intercept to return an error
    cy.intercept('GET', '/api/products/1/reviews*', {
      statusCode: 500,
      body: {
        error: 'Internal Server Error',
      },
    });
    
    cy.visit('/products/1');
    
    // Verify error message
    cy.contains('Error loading reviews');
  });
  
  it('should handle API errors when submitting a review', () => {
    // Override the intercept to return an error
    cy.intercept('POST', '/api/reviews', {
      statusCode: 500,
      body: {
        error: 'Internal Server Error',
      },
    });
    
    cy.visit('/products/1/reviews/new');
    
    // Fill in the form
    cy.get('[aria-label="5 stars"]').click();
    cy.get('#authorName').type('Test User');
    cy.get('#comment').type('Excellent product!');
    
    // Submit the form
    cy.contains('Submit Review').click();
    
    // Verify error message
    cy.contains('Failed to submit review');
    
    // Verify form still has our input
    cy.get('#authorName').should('have.value', 'Test User');
    cy.get('#comment').should('have.value', 'Excellent product!');
  });
});
```

## Step 6: Manual Testing

You perform manual testing to verify the UI, UX, and edge cases:

### Manual Test Checklist

1. **Cross-Browser Testing**
   - [x] Chrome
   - [x] Firefox
   - [x] Safari
   - [x] Edge

2. **Responsive Design**
   - [x] Desktop
   - [x] Tablet
   - [x] Mobile

3. **Accessibility**
   - [x] Keyboard navigation
   - [x] Screen reader compatibility
   - [x] Color contrast

4. **Edge Cases**
   - [x] Very long review comments
   - [x] Special characters in reviews
   - [x] Many reviews (pagination)
   - [x] No reviews
   - [x] Slow network conditions

## Step 7: Bug Reporting

You identify and report bugs to the development team:

```markdown
# Bug Report: Review Submission Form

## Bug ID: REV-001

**Severity:** Medium
**Priority:** High
**Status:** Open
**Reported By:** QA Engineer
**Assigned To:** Frontend Developer 2

**Description:**
When submitting a review with a very long comment (>500 characters), the form submits successfully but the UI doesn't show the full comment in the review list.

**Steps to Reproduce:**
1. Navigate to a product detail page
2. Click "Write a Review"
3. Fill in all fields, including a comment with >500 characters
4. Submit the review
5. Observe the review in the review list

**Expected Result:**
The full comment should be displayed, possibly with a "Read More" option for very long comments.

**Actual Result:**
The comment is truncated after approximately 200 characters with no indication that there's more content.

**Environment:**
- Browser: Chrome 115.0.5790.171
- OS: Windows 11
- Device: Desktop

**Screenshots:**
[Attached screenshot showing the truncated comment]

**Additional Notes:**
This issue affects the user experience as important information in reviews might be hidden from users.
```

## Step 8: Collaboration with Developers

You work closely with the development team to ensure bugs are fixed and requirements are met:

1. **Daily Standups**: Share testing progress and report any blockers
2. **Bug Triage**: Discuss bug severity and priority with the team
3. **Pair Testing**: Work with developers to reproduce and fix issues
4. **Regression Testing**: Verify bug fixes and ensure no new issues are introduced

## Step 9: Test Report

You create a test report summarizing the testing activities and results:

```markdown
# Test Report: Product Reviews Feature

## Summary

The Product Reviews feature has been tested according to the test plan. Overall, the feature meets the requirements with a few minor issues that have been reported and are being addressed.

## Test Coverage

- **Unit Tests**: 45 tests, 100% pass
- **Integration Tests**: 12 tests, 100% pass
- **End-to-End Tests**: 8 tests, 100% pass
- **Manual Tests**: All test cases executed

## Issues Found

- 3 bugs identified (2 medium, 1 low)
- 2 bugs fixed, 1 in progress
- No blocking issues

## Recommendations

1. Add more comprehensive error handling for network issues
2. Improve the UI for very long comments
3. Add sorting options for reviews (newest, highest rated, etc.)

## Conclusion

The Product Reviews feature is ready for release with the understanding that the remaining bug will be fixed in the next sprint.
```

## Outcome

You've successfully tested the Product Reviews feature and provided valuable feedback to the development team. Your testing activities have helped ensure that the feature meets requirements, is free of critical bugs, and provides a good user experience.
