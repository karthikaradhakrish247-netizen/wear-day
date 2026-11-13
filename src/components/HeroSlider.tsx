import React, { useState, useEffect } from 'react';
import { ArrowRight, Shirt, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext.js';

export const HeroSlider: React.FC = () => {
  const { heroSlides, setCurrentView, setSelectedGender, setSelectedCategory, bgTheme } = useStore();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Auto-advance slides every 6 seconds
  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const activeSlide = heroSlides[currentSlideIndex] || {
    title: 'Everyday Looks. Made Effortless.',
    description: 'Practical pieces. Real comfort. For every part of your day.',
    cta_text: 'Shop Now',
    cta_url: '/shop',
    image_url: '/public/assets/aistudio/image_4dafd9e5.png'
  };

  const handleCtaClick = (url: string) => {
    if (url.startsWith('#')) {
      const el = document.querySelector(url);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (url.includes('gender=')) {
      const g = url.split('gender=')[1] as any;
      setSelectedGender(g);
      setCurrentView('shop');
    } else if (url.includes('category=')) {
      const catSlug = url.split('category=')[1];
      setSelectedCategory(catSlug);
      setCurrentView('shop');
    } else {
      setCurrentView('shop');
    }
  };

  // Compute background classes based on theme
  const sectionBgClass =
    bgTheme === 'pista'
      ? 'bg-[#EBF3E8]'
      : bgTheme === 'peach'
      ? 'bg-[#FDF2EA]'
      : bgTheme === 'chocolate'
      ? 'bg-[#1D110A]'
      : 'bg-gradient-to-b from-[#EBF3E8] via-[#FAF7F2] to-[#FAF7F2]';

  const cardBgClass =
    bgTheme === 'chocolate'
      ? 'bg-[#281810] border-[#3D271D] text-white'
      : 'bg-gradient-to-br from-[#E2EDDD] via-[#FDF5EE] to-[#FCEADE] border-[#D9E5D3]';

  const titleClass =
    bgTheme === 'chocolate' ? 'text-white' : 'text-[#2C1B14]';

  const descClass =
    bgTheme === 'chocolate' ? 'text-stone-300' : 'text-[#553C2F]/90';

  return (
    <section className={`relative overflow-hidden pt-4 sm:pt-6 pb-8 sm:pb-12 transition-colors duration-500 ${sectionBgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`relative rounded-3xl overflow-hidden shadow-sm border transition-all duration-500 ${cardBgClass}`}>
          {/* Grid Layout matching image 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[440px] sm:min-h-[520px] lg:min-h-[580px]">
            {/* Left Content Column */}
            <div className="lg:col-span-5 p-6 sm:p-10 lg:p-14 z-10 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#8FA382]" />
                <span className="text-xs font-semibold tracking-wider uppercase text-[#745442]">
                  New Season Collection
                </span>
              </div>

              <h1 className={`font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight mb-4 text-balance ${titleClass}`}>
                {activeSlide.title.includes('Made Effortless') ? (
                  <>
                    Everyday Looks. <span className="font-serif-italic font-normal text-[#809770] block sm:inline">Made Effortless.</span>
                  </>
                ) : (
                  activeSlide.title
                )}
              </h1>

              <p className={`text-base sm:text-lg leading-relaxed max-w-md mb-8 ${descClass}`}>
                {activeSlide.description}
              </p>

              {/* Action Buttons matching boutique experience */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  onClick={() => {
                    setSelectedGender('women');
                    setCurrentView('shop');
                  }}
                  className="px-6 py-3.5 bg-[#2C1B14] hover:bg-[#422E23] text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all transform active:scale-95 flex items-center gap-2 group cursor-pointer"
                >
                  <span>Shop Women</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => {
                    setSelectedGender('men');
                    setCurrentView('shop');
                  }}
                  className="px-6 py-3.5 bg-white/95 hover:bg-[#FDEEE7] text-[#2C1B14] text-sm font-semibold rounded-xl border border-[#D5C2B4] shadow-xs transition-all transform active:scale-95 flex items-center gap-2 group cursor-pointer"
                >
                  <span>Shop Men</span>
                  <ArrowRight className="w-4 h-4 text-[#8C7A6B] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Slide indicators / pagination dots */}
              {heroSlides.length > 1 && (
                <div className="flex items-center gap-2 mt-8">
                  {heroSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlideIndex(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentSlideIndex
                          ? 'w-8 bg-[#2C1B14]'
                          : 'w-2 bg-[#D5C2B4] hover:bg-[#745442]'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right Media Column matching image 1 */}
            <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-full min-h-[380px] lg:min-h-[580px] w-full">
              <img
                src={activeSlide.image_url}
                alt={activeSlide.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain sm:object-cover lg:object-cover object-center select-none transition-transform duration-700"
              />

              {/* Soft gradient scrim on left for smooth blend */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#FAF6F2] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#FAF6F2] lg:via-transparent lg:to-transparent opacity-80" />

              {/* Floating conversion trust badges matching image 1 */}
              <div className="absolute top-6 right-6 flex flex-col gap-3 z-20">
                {/* Badge 1: Free Shipping */}
                <div className="bg-white/95 backdrop-blur-md border border-[#E5EDE2] p-3.5 rounded-2xl shadow-lg flex items-center gap-3 max-w-[210px] transform hover:scale-105 transition-transform">
                  <div className="w-10 h-10 rounded-xl bg-[#F4F7F2] text-[#657956] flex items-center justify-center shrink-0">
                    <Shirt className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#2C1B14] leading-tight">Free Shipping</p>
                    <p className="text-[11px] text-[#745442] leading-tight">on orders $50+</p>
                  </div>
                </div>

                {/* Badge 2: Easy Returns */}
                <div className="bg-white/95 backdrop-blur-md border border-[#E5EDE2] p-3.5 rounded-2xl shadow-lg flex items-center gap-3 max-w-[210px] transform hover:scale-105 transition-transform">
                  <div className="w-10 h-10 rounded-xl bg-[#FDEEE7] text-[#D26736] flex items-center justify-center shrink-0">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#2C1B14] leading-tight">Easy Returns</p>
                    <p className="text-[11px] text-[#745442] leading-tight">30-day returns</p>
                  </div>
                </div>
              </div>

              {/* Slider Nav Arrows */}
              {heroSlides.length > 1 && (
                <div className="absolute bottom-6 right-6 flex items-center gap-2 z-20">
                  <button
                    onClick={() => setCurrentSlideIndex(prev => (prev - 1 + heroSlides.length) % heroSlides.length)}
                    aria-label="Previous slide"
                    className="p-2.5 rounded-full bg-white/90 hover:bg-white text-[#2C1B14] shadow-md transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentSlideIndex(prev => (prev + 1) % heroSlides.length)}
                    aria-label="Next slide"
                    className="p-2.5 rounded-full bg-white/90 hover:bg-white text-[#2C1B14] shadow-md transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
