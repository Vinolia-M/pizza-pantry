'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, History } from 'lucide-react';

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex gap-2">
                <Link
                  href="/inventory"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    pathname === '/inventory'
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}>
                  <Package size={18} />
                  Inventory
                </Link>
                <Link
                  href="/inventory/audit"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    pathname === '/inventory/audit'
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}>
                  <History size={18} />
                  Audit Log
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}