import { Suspense } from 'react';
import { ProductService } from '@/core/application/use-cases/ProductService';
import { ApiProductRepository } from '@/infrastructure/repositories/ApiProductRepository';
import ProductList from '@/ui/components/organisms/ProductList';

// Initialize the repository and service
// In a real application, this would be done using dependency injection
const productRepository = new ApiProductRepository();
const productService = new ProductService(productRepository);

interface ProductsPageProps {
  searchParams: {
    category?: string;
  };
}

/**
 * Products page component
 * 
 * This is a Server Component that:
 * - Fetches products data on the server
 * - Passes the data to client components
 * - Uses Suspense for loading states
 */
export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Get the category from the search params
  const { category } = searchParams;
  
  // Fetch products based on category
  let products;
  if (category) {
    products = await productService.getProductsByCategory(category);
  } else {
    products = await productService.getAllProducts();
  }
  
  // Convert domain objects to DTOs
  const productDtos = products.map(product => product.toPrimitives());

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products` : 'All Products'}
      </h1>
      
      <Suspense fallback={<div>Loading products...</div>}>
        <ProductList initialProducts={productDtos} category={category} />
      </Suspense>
    </div>
  );
}

// Generate static metadata for the page
export function generateMetadata({ searchParams }: ProductsPageProps) {
  const { category } = searchParams;
  
  return {
    title: category 
      ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products` 
      : 'All Products',
    description: category
      ? `Browse our selection of ${category} products`
      : 'Browse our complete product catalog',
  };
}
