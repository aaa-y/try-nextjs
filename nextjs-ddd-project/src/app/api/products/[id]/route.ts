import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/core/application/use-cases/ProductService';
import { ApiProductRepository } from '@/infrastructure/repositories/ApiProductRepository';
import { UpdateProductDto } from '@/core/application/dtos/ProductDto';

// Mock data for demonstration purposes
const MOCK_API_URL = 'https://api.example.com/products';

// Initialize the repository and service
const productRepository = new ApiProductRepository(MOCK_API_URL);
const productService = new ProductService(productRepository);

/**
 * GET handler for fetching a product by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const product = await productService.getProductById(id);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product.toPrimitives());
  } catch (error: any) {
    console.error(`Error fetching product ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch product', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT handler for updating a product
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    const updateDto: UpdateProductDto = {
      name: body.name,
      description: body.description,
      price: body.price !== undefined ? Number(body.price) : undefined,
      category: body.category,
      stockQuantity: body.stockQuantity !== undefined ? Number(body.stockQuantity) : undefined
    };

    const updatedProduct = await productService.updateProduct(id, updateDto);

    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProduct.toPrimitives());
  } catch (error: any) {
    console.error(`Error updating product ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update product', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler for deleting a product
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const deleted = await productService.deleteProduct(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Error deleting product ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete product', message: error.message },
      { status: 500 }
    );
  }
}
