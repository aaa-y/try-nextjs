# Frontend Developer Guide

## Role Overview

As a Frontend Developer on the Next.js DDD project, you are responsible for:

1. Building UI components following atomic design principles
2. Implementing page layouts and client-side interactions
3. Consuming data from application services
4. Ensuring responsive and accessible user interfaces

## Project Structure for Frontend Developers

```
src/
├── app/                      # Next.js App Router (pages and layouts)
├── ui/                       # UI components
│   ├── components/           # Shared UI components
│   │   ├── atoms/            # Basic building blocks (buttons, inputs, etc.)
│   │   ├── molecules/        # Combinations of atoms (cards, form groups, etc.)
│   │   └── organisms/        # Complex UI sections (forms, lists, etc.)
│   ├── hooks/                # Custom React hooks
│   └── providers/            # Context providers
└── features/                 # Feature-specific UI components
    └── [feature-name]/ui/    # UI components for specific features
```

## Development Workflow

### 1. Component Development

1. Start by understanding the design requirements
2. Identify which atomic design level your component belongs to (atom, molecule, organism)
3. Create the component in the appropriate directory
4. Implement the component using TypeScript and Tailwind CSS
5. Add proper typing for props and state
6. Ensure the component is responsive and accessible

### 2. Page Implementation

1. Create the page component in the appropriate app directory
2. Import and use the necessary UI components
3. Implement data fetching using the application services
4. Add proper error handling and loading states
5. Implement client-side interactions if needed

### 3. Testing

1. Write unit tests for your components using React Testing Library
2. Test different states and interactions
3. Ensure your components work correctly with different props
4. Test responsive behavior

## Collaboration Guidelines

### Working with Backend Developers

1. **Interface-First Approach**: Agree on DTOs and API contracts before implementation
2. **Mock Data**: Use mock data for development while backend APIs are being built
3. **Type Sharing**: Share TypeScript interfaces for data models

### Working with Other Frontend Developers

1. **Component Library**: Reuse existing components before creating new ones
2. **Style Consistency**: Follow the established design system and Tailwind conventions
3. **State Management**: Coordinate on shared state management approaches

### Working with QA

1. **Testability**: Design components with testability in mind
2. **Acceptance Criteria**: Ensure your implementation meets all acceptance criteria
3. **Bug Fixes**: Prioritize fixing UI bugs reported by QA

## Example: Implementing a New Feature

Let's say we need to add a "Product Reviews" feature:

1. **Understand the Domain**: Work with backend developers to understand the Review entity and its relationships
2. **Create UI Components**:
   - Create atoms: Rating stars, review date formatter
   - Create molecules: Review card, review form
   - Create organisms: Review list, review section
3. **Implement Pages**:
   - Add review section to product detail page
   - Create a "Write Review" page
4. **Connect with Backend**:
   - Use application services to fetch and submit reviews
   - Handle loading, error, and success states

## Best Practices

1. **Component Composition**: Prefer composition over inheritance
2. **Prop Drilling**: Avoid excessive prop drilling; use context when appropriate
3. **Server vs. Client Components**: Understand when to use each in Next.js
4. **Performance**: Be mindful of performance implications (memoization, code splitting)
5. **Accessibility**: Ensure all components are accessible (keyboard navigation, screen readers)
6. **Responsive Design**: Use Tailwind's responsive utilities consistently

## Common Pitfalls to Avoid

1. Mixing UI concerns with application logic
2. Creating overly complex components that should be broken down
3. Duplicating components instead of making them reusable
4. Ignoring TypeScript types or using `any`
5. Direct API calls from components instead of using application services

## Getting Help

If you're stuck or have questions:
1. Check the component documentation
2. Review existing similar components
3. Discuss with other frontend developers
4. Consult with the tech lead for architectural guidance
