# Next.js 15 DDD Project

A Next.js 15 application built with Domain-Driven Design principles and clean architecture. This project demonstrates how to structure a Next.js application for multi-developer collaboration with clear boundaries, modular components, and well-defined interfaces.

## Features

- **Domain-Driven Design (DDD)** - Focus on the core domain logic with clear boundaries
- **Clean Architecture** - Separation of concerns with layers that depend inward
- **TypeScript** - Type safety and better developer experience
- **Next.js 15 App Router** - Modern routing with server components
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Multi-Developer Support** - Designed for team collaboration

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/               # Auth route group
│   ├── (shop)/               # Shop route group
│   ├── api/                  # API routes
│   └── layout.tsx            # Root layout
├── core/                     # Core domain logic
│   ├── domain/               # Domain models and interfaces
│   ├── application/          # Application services
│   └── shared/               # Shared domain logic
├── infrastructure/           # Infrastructure implementations
│   ├── repositories/         # Repository implementations
│   ├── services/             # External service implementations
│   ├── database/             # Database configuration
│   └── api/                  # API clients
├── ui/                       # UI components
│   ├── components/           # Shared UI components
│   ├── hooks/                # Custom React hooks
│   ├── providers/            # Context providers
│   └── layouts/              # Layout components
├── lib/                      # Library code
│   ├── utils/                # Utility functions
│   └── config/               # Configuration
└── features/                 # Feature modules
    ├── auth/                 # Authentication feature
    └── products/             # Products feature
```

## Architecture Overview

### Domain Layer

The domain layer contains the core business logic, entities, value objects, and repository interfaces. It's independent of any external frameworks or technologies.

### Application Layer

The application layer orchestrates the flow of data to and from the domain layer. It contains use cases, application services, and DTOs.

### Infrastructure Layer

The infrastructure layer implements the interfaces defined in the domain layer. It contains repository implementations, external service integrations, and database configurations.

### UI Layer

The UI layer is responsible for presenting data to the user and handling user interactions. It contains React components, hooks, and context providers.

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/nextjs-ddd-project.git
cd nextjs-ddd-project
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development Workflow

### Feature Development Process

1. **Domain Modeling**: Define entities, value objects, and domain services
2. **Application Layer**: Implement use cases and application services
3. **Infrastructure Layer**: Implement repositories and external services
4. **UI Layer**: Develop UI components and pages
5. **Integration**: Connect all layers and test the feature

### Collaboration Guidelines

- Each feature should be developed in a separate branch
- Use Pull Requests for code reviews
- Write unit tests for domain and application layers
- Document public APIs and interfaces
- Follow the established coding standards

## Best Practices

### Domain-Driven Design

- Use ubiquitous language throughout the codebase
- Define clear bounded contexts
- Implement entities with identity and value objects
- Use domain events for cross-boundary communication

### Clean Architecture

- Maintain separation of concerns between layers
- Ensure dependencies point inward
- Use dependency injection for better testability
- Keep domain logic pure and free from infrastructure concerns

### Code Organization

- Group code by feature and layer
- Use barrel exports for cleaner imports
- Keep components small and focused
- Follow the Single Responsibility Principle

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Domain-Driven Design](https://domainlanguage.com/ddd/) - learn about DDD principles.
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) - learn about clean architecture principles.
