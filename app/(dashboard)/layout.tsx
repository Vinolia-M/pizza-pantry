'use client';

import { UserButton } from '@clerk/nextjs';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate header on mount
    if (headerRef.current && logoRef.current) {
      gsap.from(headerRef.current, {
        y: -100,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      });

      gsap.from(logoRef.current, {
        scale: 0,
        rotation: -180,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: 'back.out(1.7)',
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <header ref={headerRef} className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/inventory" className="flex items-center gap-3 group">
              <div ref={logoRef} className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <span className="text-2xl">🍕</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Pizza Pantry</h1>
                <p className="text-xs text-gray-500">Inventory Management</p>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: 'w-10 h-10 ring-2 ring-orange-500 ring-offset-2',
                  },
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}