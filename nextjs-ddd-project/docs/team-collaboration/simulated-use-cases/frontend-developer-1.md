# Frontend Developer 1: Simulated Use Case

## Role: UI Component Specialist

As Frontend Developer 1, you specialize in creating reusable UI components following atomic design principles. Your focus is on building the core UI library that other developers will use throughout the application.

## Current Task: Implementing Review Components

You've been assigned to create the UI components for the new Product Reviews feature. This includes creating atoms, molecules, and organisms related to reviews.

## Step 1: Understanding Requirements

You start by reviewing the requirements for the Product Reviews feature:

- Users should be able to see reviews for a product
- Each review includes a rating (1-5 stars), comment, author name, and date
- Users should be able to submit their own reviews
- The review form should validate input before submission
- Reviews should be displayed in a paginated list

## Step 2: Planning Component Hierarchy

Based on atomic design principles, you plan the following components:

**Atoms:**
- RatingStars: Display and/or input for star ratings
- ReviewDate: Formatted display of review dates

**Molecules:**
- ReviewCard: Display a single review
- ReviewForm: Form for submitting a review

**Organisms:**
- ReviewList: Display a list of reviews with pagination

## Step 3: Implementing Atoms

You start by implementing the atomic components:

```tsx
// src/ui/components/atoms/RatingStars.tsx
'use client';

import { useState } from 'react';

interface RatingStarsProps {
  value: number;
  max?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function RatingStars({
  value,
  max = 5,
  onChange,
  readOnly = true,
  size = 'md',
}: RatingStarsProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };
  
  const handleClick = (index: number) => {
    if (!readOnly && onChange) {
      onChange(index + 1);
    }
  };
  
  const handleMouseEnter = (index: number) => {
    if (!readOnly) {
      setHoverValue(index + 1);
    }
  };
  
  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverValue(null);
    }
  };
  
  const displayValue = hoverValue !== null ? hoverValue : value;
  
  return (
    <div className="flex">
      {[...Array(max)].map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => handleClick(index)}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          className={`${!readOnly ? 'cursor-pointer' : 'cursor-default'} focus:outline-none`}
          disabled={readOnly}
          aria-label={`${index + 1} stars`}
        >
          <svg
            className={`${sizeClasses[size]} ${
              index < displayValue
                ? 'text-yellow-400'
                : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
}
```

## Step 4: Implementing Molecules

Next, you implement the ReviewCard molecule:

```tsx
// src/ui/components/molecules/ReviewCard.tsx
import { formatDistanceToNow } from 'date-fns';
import RatingStars from '@/ui/components/atoms/RatingStars';

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    comment: string;
    authorName: string;
    createdAt: string;
  };
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const { rating, comment, authorName, createdAt } = review;
  
  const formattedDate = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
  });
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="font-medium text-gray-800">{authorName}</div>
        </div>
        <span className="text-sm text-gray-500">{formattedDate}</span>
      </div>
      
      <div className="mb-2">
        <RatingStars value={rating} readOnly />
      </div>
      
      <p className="text-gray-600">{comment}</p>
    </div>
  );
}
```

## Step 5: Implementing Organisms

Finally, you implement the ReviewList organism:

```tsx
// src/ui/components/organisms/ReviewList.tsx
'use client';

import { useState } from 'react';
import ReviewCard from '@/ui/components/molecules/ReviewCard';
import Button from '@/ui/components/atoms/Button';

interface ReviewListProps {
  reviews: Array<{
    id: string;
    rating: number;
    comment: string;
    authorName: string;
    createdAt: string;
  }>;
  totalCount: number;
  onLoadMore?: () => void;
  isLoading?: boolean;
}

export default function ReviewList({
  reviews,
  totalCount,
  onLoadMore,
  isLoading = false,
}: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">
        Customer Reviews ({totalCount})
      </h3>
      
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
      
      {reviews.length < totalCount && (
        <div className="text-center pt-4">
          <Button
            variant="secondary"
            onClick={onLoadMore}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load More Reviews'}
          </Button>
        </div>
      )}
    </div>
  );
}
```

## Step 6: Creating a Custom Hook

To make it easier for other developers to use these components, you create a custom hook:

```tsx
// src/ui/hooks/useReviews.ts
'use client';

import { useState, useEffect } from 'react';

interface Review {
  id: string;
  productId: string;
  rating: number;
  comment: string;
  authorName: string;
  createdAt: string;
}

interface UseReviewsProps {
  productId: string;
  initialReviews?: Review[];
  initialTotalCount?: number;
}

export function useReviews({
  productId,
  initialReviews = [],
  initialTotalCount = 0,
}: UseReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [totalCount, setTotalCount] = useState<number>(initialTotalCount);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchReviews = async (pageToFetch: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(
        `/api/products/${productId}/reviews?page=${pageToFetch}&limit=5`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      
      const data = await response.json();
      
      if (pageToFetch === 1) {
        setReviews(data.reviews);
      } else {
        setReviews((prev) => [...prev, ...data.reviews]);
      }
      
      setTotalCount(data.totalCount);
      setPage(pageToFetch);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadMore = () => {
    fetchReviews(page + 1);
  };
  
  useEffect(() => {
    if (initialReviews.length === 0) {
      fetchReviews(1);
    }
  }, [productId]);
  
  return {
    reviews,
    totalCount,
    isLoading,
    error,
    loadMore,
    refetch: () => fetchReviews(1),
  };
}
```

## Step 7: Documentation and Testing

You document your components and create tests to ensure they work correctly:

```tsx
// tests/unit/ui/components/atoms/RatingStars.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import RatingStars from '@/ui/components/atoms/RatingStars';

describe('RatingStars', () => {
  it('renders the correct number of stars', () => {
    render(<RatingStars value={3} max={5} />);
    const stars = screen.getAllByRole('button');
    expect(stars).toHaveLength(5);
  });
  
  it('fills the correct number of stars based on value', () => {
    render(<RatingStars value={3} max={5} />);
    const stars = screen.getAllByRole('button');
    
    // First 3 stars should be filled
    expect(stars[0].firstChild).toHaveClass('text-yellow-400');
    expect(stars[1].firstChild).toHaveClass('text-yellow-400');
    expect(stars[2].firstChild).toHaveClass('text-yellow-400');
    
    // Last 2 stars should be empty
    expect(stars[3].firstChild).toHaveClass('text-gray-300');
    expect(stars[4].firstChild).toHaveClass('text-gray-300');
  });
  
  it('calls onChange when clicked and not readOnly', () => {
    const handleChange = jest.fn();
    render(<RatingStars value={3} readOnly={false} onChange={handleChange} />);
    
    const stars = screen.getAllByRole('button');
    fireEvent.click(stars[4]);
    
    expect(handleChange).toHaveBeenCalledWith(5);
  });
});
```

## Step 8: Collaboration with Other Developers

You coordinate with Frontend Developer 2 who is working on integrating your components into the product detail page. You also discuss with Backend Developer 1 about the API contract for reviews to ensure your components will work with the data format.

## Outcome

Your components are now ready to be used by other developers. Frontend Developer 2 can integrate them into the product detail page, and the QA Engineer can test them to ensure they meet the requirements.
