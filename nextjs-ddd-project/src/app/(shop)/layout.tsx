import { ReactNode } from 'react';
import Link from 'next/link';

interface ShopLayoutProps {
  children: ReactNode;
}

/**
 * Shop layout component
 * 
 * This layout is applied to all routes in the (shop) group.
 * It provides a consistent header and navigation for the shop section.
 */
export default function ShopLayout({ children }: ShopLayoutProps) {
  // List of product categories
  const categories = [
    'electronics',
    'clothing',
    'books',
    'home',
    'sports',
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Shop Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/products" className="text-xl font-bold text-blue-600">
              DDD Shop
            </Link>
            
            <nav className="hidden md:flex space-x-4">
              <Link href="/products" className="text-gray-600 hover:text-blue-600">
                All Products
              </Link>
              {categories.map((category) => (
                <Link 
                  key={category}
                  href={`/products?category=${category}`}
                  className="text-gray-600 hover:text-blue-600"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Link>
              ))}
            </nav>
            
            <div className="flex items-center space-x-4">
              <Link href="/cart" className="text-gray-600 hover:text-blue-600">
                Cart (0)
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Category Navigation */}
      <div className="md:hidden bg-gray-100 overflow-x-auto">
        <div className="flex px-4 py-2 space-x-4">
          <Link href="/products" className="whitespace-nowrap text-sm text-gray-600">
            All
          </Link>
          {categories.map((category) => (
            <Link 
              key={category}
              href={`/products?category=${category}`}
              className="whitespace-nowrap text-sm text-gray-600"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Link>
          ))}
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-grow bg-gray-50">
        {children}
      </main>
      
      {/* Shop Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} DDD Shop. All rights reserved.
              </p>
            </div>
            
            <div className="flex space-x-6">
              <Link href="/about" className="text-sm text-gray-500 hover:text-blue-600">
                About
              </Link>
              <Link href="/contact" className="text-sm text-gray-500 hover:text-blue-600">
                Contact
              </Link>
              <Link href="/terms" className="text-sm text-gray-500 hover:text-blue-600">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-blue-600">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
