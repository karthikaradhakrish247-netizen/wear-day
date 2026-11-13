import React from 'react';
import { useStore } from '../context/StoreContext.js';

export const CategoryBar: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory, setCurrentView, bgTheme } = useStore();

  const handleCategorySelect = (catId: string) => {
    if (selectedCategory === catId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(catId);
    }
    const target = document.getElementById('new-arrivals-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const bgClass =
    bgTheme === 'pista'
      ? 'bg-[#E5EFE2] border-[#D1E2CD]'
      : bgTheme === 'peach'
      ? 'bg-[#FDF2EA] border-[#F8DEC9]'
      : bgTheme === 'chocolate'
      ? 'bg-[#24150E] border-[#3D271D]'
      : 'bg-[#EDF5EA] border-[#D6E6D1]';

  const headingClass =
    bgTheme === 'chocolate' ? 'text-white' : 'text-[#2C1B14]';

  const subClass =
    bgTheme === 'chocolate' ? 'text-stone-300' : 'text-[#553C2F]';

  return (
    <section id="categories-section" className={`py-6 sm:py-8 border-y transition-colors duration-500 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className={`text-lg sm:text-xl font-display font-bold tracking-tight ${headingClass}`}>
              Explore by Category
            </h2>
            <p className={`text-xs ${subClass}`}>Find exactly what you need for your daily wardrobe</p>
          </div>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs font-semibold text-[#9DB08E] hover:text-[#657956] underline"
            >
              Clear filter
            </button>
          )}
        </div>

        {/* Circular Category Strip matching image 1 */}
        <div className="flex items-center gap-4 sm:gap-8 overflow-x-auto pb-3 pt-1 scrollbar-none no-scrollbar">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id || selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className="flex flex-col items-center gap-2 group shrink-0 transition-transform active:scale-95 focus:outline-none"
              >
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-0.5 border-2 transition-all duration-200 overflow-hidden shadow-xs ${
                    isSelected
                      ? 'border-[#2C1B14] ring-2 ring-[#9DB08E] ring-offset-2 scale-105'
                      : 'border-transparent group-hover:border-[#9DB08E] bg-[#F4F7F2]'
                  }`}
                >
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span
                  className={`text-xs font-medium tracking-tight text-center transition-colors whitespace-nowrap ${
                    isSelected
                      ? 'text-[#2C1B14] font-bold'
                      : 'text-[#553C2F] group-hover:text-[#2C1B14]'
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
