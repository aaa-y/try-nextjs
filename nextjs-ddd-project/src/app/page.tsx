import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Home page component
 *
 * This component serves as a landing page that introduces the DDD architecture
 * and provides links to the products section.
 */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold text-blue-600">DDD Next.js Shop</div>
            <nav className="hidden md:flex space-x-4">
              <Link href="/products" className="text-gray-600 hover:text-blue-600">
                Products
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-blue-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Domain-Driven Design with Next.js 15</h1>
            <p className="text-xl mb-8">A clean architecture approach for scalable applications</p>
            <Link
              href="/products"
              className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Architecture Features</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Domain-Driven Design</h3>
                <p className="text-gray-600">
                  Focused on the core domain logic with clear boundaries between different contexts.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Clean Architecture</h3>
                <p className="text-gray-600">
                  Separation of concerns with layers that depend inward, making the system more maintainable.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Multi-Developer Support</h3>
                <p className="text-gray-600">
                  Designed for team collaboration with clear boundaries and modular components.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} DDD Next.js Shop. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
