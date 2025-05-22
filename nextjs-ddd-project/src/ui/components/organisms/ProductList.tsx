'use client';

import { useState, useEffect } from 'react';
import { ProductDto } from '@/core/application/dtos/ProductDto';
import ProductCard from '@/ui/components/molecules/ProductCard';

interface ProductListProps {
  initialProducts?: ProductDto[];
  category?: string;
}

/**
 * ProductList component for displaying a list of products
 * 
 * This component follows the Organism pattern from Atomic Design:
 * - It's composed of multiple molecules (ProductCard)
 * - It manages its own state
 * - It handles data fetching
 */
export default function ProductList({ initialProducts, category }: ProductListProps) {
  const [products, setProducts] = useState<ProductDto[]>(initialProducts || []);
  const [loading, setLoading] = useState<boolean>(!initialProducts);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialProducts) {
      fetchProducts();
    }
  }, [initialProducts, category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = category 
        ? `/api/products?category=${encodeURIComponent(category)}` 
        : '/api/products';
        
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }
      
      const data = await response.json();
      setProducts(data);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      setError(error.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-500">
          No products found{category ? ` in ${category}` : ''}
        </h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
