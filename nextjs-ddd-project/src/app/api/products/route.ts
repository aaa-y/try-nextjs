import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/core/application/use-cases/ProductService';
import { ApiProductRepository } from '@/infrastructure/repositories/ApiProductRepository';
import { CreateProductDto } from '@/core/application/dtos/ProductDto';

// Mock data for demonstration purposes
// In a real application, this would come from a database
const MOCK_API_URL = 'https://api.example.com/products';

// Initialize the repository and service
const productRepository = new ApiProductRepository(MOCK_API_URL);
const productService = new ProductService(productRepository);

/**
 * GET handler for fetching all products or products by category
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');

    let products;
    if (category) {
      products = await productService.getProductsByCategory(category);
    } else {
      products = await productService.getAllProducts();
    }

    // Convert domain objects to DTOs
    const productDtos = products.map(product => product.toPrimitives());

    return NextResponse.json(productDtos);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST handler for creating a new product
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const productDto: CreateProductDto = {
      name: body.name,
      description: body.description || '',
      price: Number(body.price),
      category: body.category,
      stockQuantity: body.stockQuantity !== undefined ? Number(body.stockQuantity) : 0
    };

    const product = await productService.createProduct(productDto);

    return NextResponse.json(product.toPrimitives(), { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product', message: error.message },
      { status: 500 }
    );
  }
}
