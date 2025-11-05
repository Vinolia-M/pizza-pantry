'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    subtitle: 'FRESH & TASTY',
    title: 'DELICIOUS\nPIZZAS!',
    description: 'Manage your pizza shop inventory with ease. Track ingredients, manage stock levels, and never run out of your essential supplies.',
    color: 'from-orange-900 via-red-900 to-yellow-900',
  },
  {
    id: 2,
    subtitle: 'STAY ORGANIZED',
    title: 'INVENTORY\nCONTROL!',
    description: 'Real-time inventory tracking with smart reorder alerts. Keep your pizza pantry fully stocked and ready for business.',
    color: 'from-purple-900 via-indigo-900 to-blue-900',
  },
  {
    id: 3,
    subtitle: 'TRACK EVERYTHING',
    title: 'SMART\nMANAGEMENT!',
    description: 'Complete audit trail of all inventory changes. Know exactly who added what and when, ensuring accountability.',
    color: 'from-green-900 via-emerald-900 to-teal-900',
  },
  {
    id: 4,
    subtitle: 'GET STARTED',
    title: 'PIZZA\nPANTRY!',
    description: 'Join now and revolutionize how you manage your pizza shop supplies. Simple, beautiful, and powerful.',
    color: 'from-pink-900 via-rose-900 to-red-900',
  },
];

export default function LandingPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const floatingItemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSignedIn) {
      router.push('/inventory');
    }
  }, [isSignedIn, router]);

  useEffect(() => {
    if (titleRef.current && imageRef.current && slideRef.current) {
      const tl = gsap.timeline();

      tl.from(imageRef.current, {
        scale: 0,
        rotation: -180,
        opacity: 0,
        duration: 1,
        ease: 'back.out(1.7)',
      }, '-=0.5');

      gsap.to(imageRef.current, {
        y: -20,
        rotation: 5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Animate floating items
      if (floatingItemsRef.current) {
        const items = floatingItemsRef.current.children;
        Array.from(items).forEach((item, index) => {
          gsap.to(item, {
            y: Math.random() * -30 - 20,
            x: Math.random() * 40 - 20,
            rotation: Math.random() * 20 - 10,
            duration: 2 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.2,
          });
        });
      }
    }
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const slide = slides[currentSlide];

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden">
      <div ref={slideRef} className={`absolute inset-0 bg-gradient-to-br ${slide.color} transition-all duration-1000`}>
        <div className="absolute inset-0 opacity-50 mix-blend-overlay">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
          }} />
        </div>
      </div>

      <header className="container mx-auto absolute top-0 left-0 right-0 z-50 px-8 py-6">
        <div className="max-w-8xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-2xl">🍕</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Pizza Pantry</h1>
            </div>
          </div>
          <Link href="/sign-in" className="inline-block px-8 py-1 text-white border-2 border-white/50 rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300 backdrop-blur-sm"
            style={{ opacity: 1, transform: 'none' }}>
            SIGN IN
          </Link>
        </div>
      </header>

      <div className="container mx-auto relative h-full flex items-center">
        <div className="px-8 w-full md:mt-0 mt-[-28%]">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div ref={titleRef} className="space-y-8">
              <div className="space-y-4">
                <p className="text-orange-300 font-semibold tracking-wider text-sm uppercase">
                  {slide.subtitle}
                </p>
                <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-white leading-none">
                  {slide.title.split('\n').map((line, i) => (
                    <div key={i} className="italic">
                      {line}
                    </div>
                  ))}
                </h1>
              </div>

              <Link href="/sign-up" className="inline-block px-8 py-4 text-white font-semibold border-2 border-white/50 rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300 backdrop-blur-sm"
                style={{ opacity: 1, transform: 'none' }}>
                GET STARTED
              </Link>
            </div>

            <div className="relative">
              <div ref={imageRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[280px] drop-shadow-2xl"></div>

              <div ref={floatingItemsRef} className="absolute inset-0">
                <div className="absolute top-[10%] right-[20%] text-7xl opacity-70">🍅</div>
                <div className="absolute top-[30%] right-[5%] text-5xl opacity-60">🧀</div>
                <div className="absolute bottom-[30%] right-[15%] text-6xl opacity-50">🌿</div>
                <div className="absolute top-[60%] left-[10%] text-5xl opacity-60">🥓</div>
                <div className="absolute top-[20%] left-[5%] text-4xl opacity-50">🫑</div>
              </div>

              <div className="lg:top-[-72px] top-0 lg:right-8 max-w-xl">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <p className="text-6xl font-bold text-white mb-2">
                    {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                  </p>
                  <p className="text-white/80 text-md leading-relaxed">
                    {slide.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-[26%] md:bottom-[14%] lg:left-0 left-1/2 -translate-x-1/2 lg:translate-x-0 flex items-center gap-6 z-50">
        <button onClick={prevSlide}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/20 transition-all">
          <ChevronLeft size={24} />
        </button>

        <div className="flex items-center gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? 'w-8 h-3 bg-white'
                  : 'w-3 h-3 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        <button onClick={nextSlide}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/20 transition-all">
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="absolute md:bottom-[15%] bottom-[20%] right-[11%] lg:left-0 left-1/2 -translate-x-1/2 lg:translate-x-0 w-full flex items-center lg:justify-end justify-center gap-6 z-50">
        <span className="text-white/60 text-sm font-medium">FOLLOW US</span>
        <a href="#" className="text-white/60 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>
        <a href="#" className="text-white/60 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
        <a href="#" className="text-white/60 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </a>
      </div>
      </div>

      <footer className="absolute bottom-0 left-0 right-0 z-40 bbg-white/10 backdrop-blur-md border-t border-white">
        <div className="container mx-auto px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <p className="text-white/60 text-sm">© 2024 Pizza Pantry. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">Privacy Policy</a>
                <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">Terms of Service</a>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-white/60 text-sm">Made with ❤️ for pizza lovers</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}