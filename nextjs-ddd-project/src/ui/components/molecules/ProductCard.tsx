'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProductDto } from '@/core/application/dtos/ProductDto';
import Badge from '@/ui/components/atoms/Badge';
import Button from '@/ui/components/atoms/Button';

interface ProductCardProps {
  product: ProductDto;
}

/**
 * ProductCard component for displaying a product
 * 
 * This component follows the Molecule pattern from Atomic Design:
 * - It's composed of multiple atoms (Badge, Button)
 * - It has a specific purpose
 * - It's reusable across the application
 */
export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
        isHovered ? 'shadow-lg transform -translate-y-1' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 bg-gray-200">
        {/* Placeholder for product image */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <span className="text-sm">Product Image</span>
        </div>
        
        {/* Category badge */}
        <div className="absolute top-2 left-2">
          <Badge color="blue">{product.category}</Badge>
        </div>
        
        {/* Stock badge */}
        <div className="absolute top-2 right-2">
          <Badge color={product.inStock ? 'green' : 'red'}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </Badge>
        </div>
      </div>
      
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="mt-1 text-gray-600 text-sm line-clamp-2">
          {product.description}
        </p>
        
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          
          <Button 
            disabled={!product.inStock}
            onClick={() => {
              // Add to cart functionality would go here
              console.log(`Added ${product.name} to cart`);
            }}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
