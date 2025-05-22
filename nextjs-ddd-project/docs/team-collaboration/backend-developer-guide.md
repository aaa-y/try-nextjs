# Backend Developer Guide

## Role Overview

As a Backend Developer on the Next.js DDD project, you are responsible for:

1. Implementing domain models, entities, and value objects
2. Creating application services and use cases
3. Building repository implementations and infrastructure services
4. Developing API routes and server-side logic

## Project Structure for Backend Developers

```
src/
├── core/                     # Core domain logic
│   ├── domain/               # Domain models and interfaces
│   │   ├── entities/         # Domain entities
│   │   ├── value-objects/    # Value objects
│   │   ├── repositories/     # Repository interfaces
│   │   └── services/         # Domain services
│   ├── application/          # Application services
│   │   ├── use-cases/        # Use cases/application services
│   │   └── dtos/             # Data Transfer Objects
│   └── shared/               # Shared domain logic
├── infrastructure/           # Infrastructure implementations
│   ├── repositories/         # Repository implementations
│   ├── services/             # External service implementations
│   ├── database/             # Database configuration
│   └── api/                  # API clients
├── app/api/                  # Next.js API routes
└── features/                 # Feature-specific backend code
    └── [feature-name]/       # Backend code for specific features
        ├── domain/           # Feature-specific domain models
        ├── application/      # Feature-specific application services
        └── infrastructure/   # Feature-specific infrastructure
```

## Development Workflow

### 1. Domain Modeling

1. Identify domain entities, value objects, and aggregates
2. Define clear boundaries and relationships
3. Implement business rules and invariants
4. Create repository interfaces

### 2. Application Services

1. Implement use cases as application services
2. Define DTOs for input and output
3. Orchestrate domain objects to fulfill use cases
4. Handle validation and error cases

### 3. Infrastructure Implementation

1. Implement repository interfaces
2. Create data mappers between domain objects and persistence models
3. Implement external service integrations
4. Set up database connections and queries

### 4. API Routes

1. Create Next.js API routes in the app/api directory
2. Use application services to handle business logic
3. Implement proper error handling and status codes
4. Document API endpoints

## Collaboration Guidelines

### Working with Frontend Developers

1. **API Contracts**: Define and document API contracts early
2. **DTOs**: Create clear DTOs that frontend can consume
3. **Mock Data**: Provide mock data for frontend development

### Working with Other Backend Developers

1. **Domain Boundaries**: Respect bounded contexts and domain boundaries
2. **Code Reviews**: Thoroughly review domain logic implementations
3. **Shared Infrastructure**: Coordinate on shared infrastructure components

### Working with QA

1. **Testability**: Design your code with testability in mind
2. **Test Data**: Provide test data and scenarios for QA
3. **Bug Fixes**: Prioritize fixing backend bugs reported by QA

## Example: Implementing a New Feature

Let's say we need to add a "Product Reviews" feature:

1. **Domain Modeling**:
   - Create Review entity with properties like rating, comment, author
   - Define relationships with Product entity
   - Implement business rules (e.g., rating range validation)

2. **Application Services**:
   - Create ReviewService with methods like getReviewsForProduct, addReview
   - Define DTOs for review creation and retrieval
   - Implement validation logic

3. **Infrastructure**:
   - Implement ReviewRepository for data persistence
   - Create data mappers for Review entity

4. **API Routes**:
   - Create API endpoints for fetching and submitting reviews
   - Connect endpoints to application services
   - Implement proper error handling

## Best Practices

1. **Domain-Driven Design**: Focus on the domain model and business rules
2. **Clean Architecture**: Maintain separation of concerns between layers
3. **SOLID Principles**: Follow SOLID principles in your code
4. **Error Handling**: Implement consistent error handling across the application
5. **Validation**: Validate input at the application service level
6. **Testing**: Write unit tests for domain and application logic

## Common Pitfalls to Avoid

1. Mixing domain logic with infrastructure concerns
2. Anemic domain models (models without behavior)
3. Bypassing application services from API routes
4. Inconsistent error handling
5. Lack of validation
6. Tight coupling between layers

## Getting Help

If you're stuck or have questions:
1. Review the domain model documentation
2. Discuss with other backend developers
3. Consult with the tech lead for architectural guidance
4. Check existing similar implementations
