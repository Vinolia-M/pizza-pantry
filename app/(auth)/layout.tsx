'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const pizzaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating pizza animation
      gsap.to(pizzaRef.current, {
        y: -20,
        rotation: 5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div ref={bgRef} className="fixed inset-0 -z-10"/>

      <div ref={pizzaRef} className="fixed top-20 right-20 text-8xl opacity-10 pointer-events-none hidden lg:block" aria-hidden="true">
        🍕
      </div>
      <div className="fixed bottom-20 left-20 text-6xl opacity-10 pointer-events-none hidden lg:block"
        style={{
          animation: 'float 4s ease-in-out infinite',
          animationDelay: '1s',
        }}
        aria-hidden="true">
        🍕
      </div>

      <div ref={containerRef} className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="backdrop-blur-xl bg-white/90 rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <div className="inline-block text-6xl mb-4 animate-bounce">🍕</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Pizza Pantry</h1>
              <p className="text-gray-600">Modern inventory management for your pizza shop</p>
            </div>
            <div>{children}</div>
          </div>

          <p className="text-center text-black/80 text-sm mt-6">© 2025 Pizza Pantry. All rights reserved.</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(-5deg);
          }
        }
      `}</style>
    </div>
  );
}