import { notFound } from 'next/navigation';
import { ProductService } from '@/core/application/use-cases/ProductService';
import { ApiProductRepository } from '@/infrastructure/repositories/ApiProductRepository';
import Badge from '@/ui/components/atoms/Badge';
import Button from '@/ui/components/atoms/Button';

// Initialize the repository and service
const productRepository = new ApiProductRepository();
const productService = new ProductService(productRepository);

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

/**
 * Product detail page component
 * 
 * This is a Server Component that:
 * - Fetches a specific product's data on the server
 * - Renders the product details
 * - Uses Next.js's notFound for 404 handling
 */
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
  
  // Format price
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(productData.price);
  
  // Format dates
  const formattedCreatedAt = new Date(productData.createdAt).toLocaleDateString();
  
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
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold text-gray-800">{productData.name}</h1>
              <Badge color={productData.inStock ? 'green' : 'red'}>
                {productData.inStock ? 'In Stock' : 'Out of Stock'}
              </Badge>
            </div>
            
            <div className="mt-2">
              <Badge color="blue">{productData.category}</Badge>
            </div>
            
            <p className="mt-4 text-gray-600">{productData.description}</p>
            
            <div className="mt-6">
              <div className="text-3xl font-bold text-gray-900">{formattedPrice}</div>
              {productData.inStock && (
                <div className="mt-1 text-sm text-gray-500">
                  {productData.stockQuantity} items available
                </div>
              )}
            </div>
            
            <div className="mt-8">
              <Button 
                disabled={!productData.inStock}
                size="lg"
                className="w-full"
              >
                Add to Cart
              </Button>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">Product Details</h3>
              <dl className="mt-2 text-sm">
                <div className="flex justify-between py-1">
                  <dt className="text-gray-500">SKU</dt>
                  <dd className="text-gray-900">{productData.id.substring(0, 8).toUpperCase()}</dd>
                </div>
                <div className="flex justify-between py-1">
                  <dt className="text-gray-500">Category</dt>
                  <dd className="text-gray-900">{productData.category}</dd>
                </div>
                <div className="flex justify-between py-1">
                  <dt className="text-gray-500">Added on</dt>
                  <dd className="text-gray-900">{formattedCreatedAt}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate static metadata for the page
export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { id } = params;
  const product = await productService.getProductById(id);
  
  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }
  
  const productData = product.toPrimitives();
  
  return {
    title: productData.name,
    description: productData.description,
  };
}
