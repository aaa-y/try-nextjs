# Frontend Developer 2: Simulated Use Case

## Role: Page and Integration Specialist

As Frontend Developer 2, you specialize in building pages and integrating UI components with backend services. Your focus is on creating complete user experiences by combining components and connecting them to data sources.

## Current Task: Implementing Product Review Pages

You've been assigned to integrate the review components created by Frontend Developer 1 into the product detail page and create a dedicated page for submitting reviews.

## Step 1: Understanding Requirements

You start by reviewing the requirements for the Product Reviews feature:

- Reviews should be displayed on the product detail page
- Users should be able to navigate to a dedicated page to write a review
- The review submission should validate input and show appropriate feedback
- The UI should handle loading, error, and success states

## Step 2: Updating the Product Detail Page

First, you update the product detail page to include the ReviewList component:

```tsx
// src/app/(shop)/products/[id]/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductService } from '@/core/application/use-cases/ProductService';
import { ApiProductRepository } from '@/infrastructure/repositories/ApiProductRepository';
import Badge from '@/ui/components/atoms/Badge';
import Button from '@/ui/components/atoms/Button';
import ReviewList from '@/ui/components/organisms/ReviewList';
import { getReviewsForProduct } from '@/app/actions/reviewActions';

// Initialize the repository and service
const productRepository = new ApiProductRepository();
const productService = new ProductService(productRepository);

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = params;
  
  // Fetch the product
  const product = await productService.getProductById(id);
  
  // If product not found, show 404 page
  if (!product) {
    notFound();
  }
  
  // Convert domain object to DTO
  const productData = product.toPrimitives();
  
  // Fetch initial reviews
  const { reviews, totalCount } = await getReviewsForProduct(id, 1, 5);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Product Image Placeholder */}
          <div className="md:w-1/2 bg-gray-200 h-64 md:h-auto">
            <div className="h-full flex items-center justify-center text-gray-500">
              <span>Product Image</span>
            </div>
          </div>
          
          {/* Product Details */}
          <div className="md:w-1/2 p-8">
            {/* Product details code (unchanged) */}
            {/* ... */}
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="p-8 border-t border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
            <Link href={`/products/${id}/reviews/new`}>
              <Button>Write a Review</Button>
            </Link>
          </div>
          
          <Suspense fallback={<div>Loading reviews...</div>}>
            <ReviewList 
              initialReviews={reviews} 
              initialTotalCount={totalCount} 
              productId={id} 
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
```

## Step 3: Creating a Client-Side ReviewList Component

You create a client-side wrapper for the ReviewList component to handle loading more reviews:

```tsx
// src/app/(shop)/products/[id]/components/ClientReviewList.tsx
'use client';

import { useReviews } from '@/ui/hooks/useReviews';
import ReviewList from '@/ui/components/organisms/ReviewList';

interface ClientReviewListProps {
  initialReviews: Array<{
    id: string;
    rating: number;
    comment: string;
    authorName: string;
    createdAt: string;
  }>;
  initialTotalCount: number;
  productId: string;
}

export default function ClientReviewList({
  initialReviews,
  initialTotalCount,
  productId,
}: ClientReviewListProps) {
  const {
    reviews,
    totalCount,
    isLoading,
    error,
    loadMore,
  } = useReviews({
    productId,
    initialReviews,
    initialTotalCount,
  });
  
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">Error loading reviews: {error}</p>
      </div>
    );
  }
  
  return (
    <ReviewList
      reviews={reviews}
      totalCount={totalCount}
      onLoadMore={loadMore}
      isLoading={isLoading}
    />
  );
}
```

## Step 4: Creating the Review Submission Page

Next, you create a dedicated page for submitting reviews:

```tsx
// src/app/(shop)/products/[id]/reviews/new/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { ProductService } from '@/core/application/use-cases/ProductService';
import { ApiProductRepository } from '@/infrastructure/repositories/ApiProductRepository';
import ReviewSubmissionForm from './components/ReviewSubmissionForm';

// Initialize the repository and service
const productRepository = new ApiProductRepository();
const productService = new ProductService(productRepository);

interface WriteReviewPageProps {
  params: {
    id: string;
  };
}

export default async function WriteReviewPage({ params }: WriteReviewPageProps) {
  const { id } = params;
  
  // Fetch the product
  const product = await productService.getProductById(id);
  
  // If product not found, show 404 page
  if (!product) {
    notFound();
  }
  
  // Convert domain object to DTO
  const productData = product.toPrimitives();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Write a Review for {productData.name}
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <Suspense fallback={<div>Loading form...</div>}>
            <ReviewSubmissionForm productId={id} productName={productData.name} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
```

## Step 5: Implementing the Review Submission Form

You create a client-side form component for submitting reviews:

```tsx
// src/app/(shop)/products/[id]/reviews/new/components/ReviewSubmissionForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RatingStars from '@/ui/components/atoms/RatingStars';
import Button from '@/ui/components/atoms/Button';
import { submitReview } from '@/app/actions/reviewActions';

interface ReviewSubmissionFormProps {
  productId: string;
  productName: string;
}

export default function ReviewSubmissionForm({
  productId,
  productName,
}: ReviewSubmissionFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [authorName, setAuthorName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form validation
  const isFormValid = rating > 0 && comment.trim().length > 0 && authorName.trim().length > 0;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      setError('Please fill out all fields');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      await submitReview({
        productId,
        rating,
        comment,
        authorName,
      });
      
      // Redirect back to product page after successful submission
      router.push(`/products/${productId}?reviewSubmitted=true`);
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Rating
        </label>
        <RatingStars
          value={rating}
          readOnly={false}
          onChange={setRating}
          size="lg"
        />
        {rating === 0 && (
          <p className="mt-1 text-sm text-red-600">Please select a rating</p>
        )}
      </div>
      
      <div>
        <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-1">
          Your Name
        </label>
        <input
          type="text"
          id="authorName"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
          Your Review
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button
          variant="secondary"
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </div>
    </form>
  );
}
```

## Step 6: Creating Server Actions for Reviews

You implement server actions to handle review data fetching and submission:

```tsx
// src/app/actions/reviewActions.ts
'use server';

import { revalidatePath } from 'next/cache';

interface SubmitReviewParams {
  productId: string;
  rating: number;
  comment: string;
  authorName: string;
}

export async function getReviewsForProduct(
  productId: string,
  page: number = 1,
  limit: number = 5
) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/api/products/${productId}/reviews?page=${page}&limit=${limit}`,
      { next: { revalidate: 60 } } // Cache for 60 seconds
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return { reviews: [], totalCount: 0 };
  }
}

export async function submitReview({
  productId,
  rating,
  comment,
  authorName,
}: SubmitReviewParams) {
  try {
    // Validate input
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    
    if (!comment.trim()) {
      throw new Error('Comment is required');
    }
    
    if (!authorName.trim()) {
      throw new Error('Name is required');
    }
    
    const response = await fetch(`${process.env.API_URL}/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId,
        rating,
        comment,
        authorName,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit review');
    }
    
    // Revalidate the product page to show the new review
    revalidatePath(`/products/${productId}`);
    
    return await response.json();
  } catch (error: any) {
    console.error('Error submitting review:', error);
    throw new Error(error.message || 'Failed to submit review');
  }
}
```

## Step 7: Adding Success Notification

You update the product detail page to show a success message when a review is submitted:

```tsx
// src/app/(shop)/products/[id]/components/ReviewSuccessNotification.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ReviewSuccessNotification() {
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  
  useEffect(() => {
    if (searchParams.get('reviewSubmitted') === 'true') {
      setIsVisible(true);
      
      // Hide notification after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams]);
  
  if (!isVisible) {
    return null;
  }
  
  return (
    <div className="bg-green-50 p-4 rounded-md mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-green-800">
            Your review has been submitted successfully!
          </p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={() => setIsVisible(false)}
              className="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Step 8: Collaboration with Other Developers

You coordinate with Frontend Developer 1 who created the UI components you're using. You also work with Backend Developer 2 to ensure the API endpoints for reviews are implemented correctly and match your expectations.

## Outcome

You've successfully integrated the review components into the product detail page and created a dedicated page for submitting reviews. The UI handles loading, error, and success states, and provides a good user experience for viewing and submitting reviews.
