import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext.js';

export const GenderDepartmentShowcase: React.FC = () => {
  const { setSelectedGender, setCurrentView, bgTheme } = useStore();

  const handleSelect = (gender: 'women' | 'men') => {
    setSelectedGender(gender);
    const target = document.getElementById('new-arrivals-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      setCurrentView('shop');
    }
  };

  const sectionBg =
    bgTheme === 'pista'
      ? 'bg-[#E5EFE2]'
      : bgTheme === 'peach'
      ? 'bg-[#FDF2EA]'
      : bgTheme === 'chocolate'
      ? 'bg-[#1D110A]'
      : 'bg-[#FAF7F2]';

  return (
    <section className={`py-6 sm:py-10 transition-colors duration-500 ${sectionBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-[#E5EDE2] text-[11px] font-bold tracking-widest uppercase text-[#9DB08E] mb-2 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Collections</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-[#2C1B14] tracking-tight">
            Curated For Women & Men
          </h2>
          <p className="text-xs sm:text-sm text-[#745442] mt-1.5">
            Discover intentional pieces designed for everyday comfort, timeless tailoring, and effortless styling.
          </p>
        </div>

        {/* Dual Split Cards: Women & Men */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* Women's Department Card */}
          <div
            onClick={() => handleSelect('women')}
            className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-[#E8DFD3] cursor-pointer transition-all duration-500 bg-white min-h-[340px] sm:min-h-[400px] flex flex-col justify-end p-6 sm:p-8"
          >
            {/* Background Image of Woman in Clothes */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80"
                alt="Women's Fashion Collection"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C1B14]/90 via-[#2C1B14]/40 to-transparent" />
            </div>

            {/* Content overlay */}
            <div className="relative z-10 text-white space-y-2">
              <span className="text-[11px] uppercase tracking-widest font-bold text-[#F7C5AB] bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-full">
                Women's Collection
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
                Effortless Feminine Tailoring
              </h3>
              <p className="text-xs sm:text-sm text-stone-200 line-clamp-2 max-w-md">
                Knit midi dresses, fluid high-rise trousers, structured blazers, and breezy linen blouses.
              </p>

              <div className="pt-2 flex items-center gap-3">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#2C1B14] group-hover:bg-[#FDF2EA] text-xs font-bold rounded-xl transition-all shadow-md">
                  <span>Shop Women's Clothes</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[11px] text-stone-300 font-medium hidden sm:inline">
                  Verified Amazon Affiliate
                </span>
              </div>
            </div>
          </div>

          {/* Men's Department Card */}
          <div
            onClick={() => handleSelect('men')}
            className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-[#E8DFD3] cursor-pointer transition-all duration-500 bg-white min-h-[340px] sm:min-h-[400px] flex flex-col justify-end p-6 sm:p-8"
          >
            {/* Background Image of Man in Clothes */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80"
                alt="Men's Fashion Collection"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C1B14]/90 via-[#2C1B14]/40 to-transparent" />
            </div>

            {/* Content overlay */}
            <div className="relative z-10 text-white space-y-2">
              <span className="text-[11px] uppercase tracking-widest font-bold text-[#9DB08E] bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-full">
                Men's Collection
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
                Modern Daily Essentials
              </h3>
              <p className="text-xs sm:text-sm text-stone-200 line-clamp-2 max-w-md">
                Heavyweight cotton tees, flexible stretch chinos, utility overshirts, and raw selvedge denim.
              </p>

              <div className="pt-2 flex items-center gap-3">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#2C1B14] group-hover:bg-[#E5EFE2] text-xs font-bold rounded-xl transition-all shadow-md">
                  <span>Shop Men's Clothes</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[11px] text-stone-300 font-medium hidden sm:inline">
                  Verified Amazon Affiliate
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
