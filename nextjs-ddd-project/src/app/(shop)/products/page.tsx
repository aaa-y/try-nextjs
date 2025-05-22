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
  const params = await Promise.resolve(searchParams);
  const category = params?.category;

  // Fetch products based on category
  let products;
  try {
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
  } catch (error) {
    console.error('Error loading products:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Products</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> Failed to load products. Please try again later.</span>
        </div>
      </div>
    );
  }
}

// Generate static metadata for the page
export async function generateMetadata({ searchParams }: ProductsPageProps) {
  const params = await Promise.resolve(searchParams);
  const category = params?.category;

  return {
    title: category
      ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products`
      : 'All Products',
    description: category
      ? `Browse our selection of ${category} products`
      : 'Browse our complete product catalog',
  };
}
