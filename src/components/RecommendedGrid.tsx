import React from 'react';
import { Heart, ExternalLink } from 'lucide-react';
import { useStore } from '../context/StoreContext.js';
import type { Product } from '../types.js';

export const RecommendedGrid: React.FC = () => {
  const { products, wishlist, toggleWishlist, setActiveProductModal, trackAndGo, bgTheme } = useStore();

  // Find the recommended items matching Her & Him essentials
  const recSlugs = [
    'ribbed-knit-midi-dress',
    'relaxed-fit-tee',
    'structured-tailored-blazer',
    'easy-chino-pants',
    'clean-sneakers'
  ];
  let recommendedItems = recSlugs
    .map(slug => products.find(p => p.slug === slug))
    .filter((p): p is Product => Boolean(p));

  // If not all found, fallback to first 5 products
  if (recommendedItems.length < 5) {
    recommendedItems = products.slice(0, 5);
  }

  const sectionBg =
    bgTheme === 'pista'
      ? 'bg-[#E5EFE2] border-[#D1E2CD]'
      : bgTheme === 'peach'
      ? 'bg-[#FDF2EA] border-[#F8DEC9]'
      : bgTheme === 'chocolate'
      ? 'bg-[#1D110A] border-[#3D271D]'
      : 'bg-[#EDF5EA] border-[#D6E6D1]';

  const headingColor =
    bgTheme === 'chocolate' ? 'text-white' : 'text-[#2C1B14]';

  return (
    <section className={`py-8 sm:py-14 border-b transition-colors duration-500 ${sectionBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-2xl sm:text-3xl font-display font-bold tracking-tight ${headingColor}`}>
              Recommended For You <span className="font-serif-italic font-normal text-[#809770] text-xl sm:text-2xl ml-1">· Everyday Staples</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#745442]">Personalized picks tailored for both women and men</p>
          </div>
        </div>

        {/* 5-Column Grid matching image 1 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {recommendedItems.map(product => {
            const isWishlisted = wishlist.includes(product.id);
            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-[#EBE3D8] overflow-hidden flex flex-col hover:shadow-md hover:border-[#9DB08E] transition-all duration-300"
              >
                <div className="relative aspect-[3/4] bg-[#FAF6F2] overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                    onClick={() => setActiveProductModal(product)}
                  />

                  {/* Wishlist Heart */}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-xs ${
                      isWishlisted ? 'bg-[#F2A782] text-white' : 'bg-white/90 hover:bg-white text-[#2C1B14]'
                    }`}
                    aria-label="Wishlist toggle"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
                  </button>

                  {/* Buy Now hover button */}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      trackAndGo(product);
                    }}
                    className="absolute bottom-2.5 left-2.5 right-2.5 py-2 px-3 bg-[#2C1B14]/90 hover:bg-[#2C1B14] text-white text-xs font-semibold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 shadow-md backdrop-blur-xs cursor-pointer"
                  >
                    <span>Buy Now</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-3.5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3
                      onClick={() => setActiveProductModal(product)}
                      className="text-xs sm:text-sm font-semibold text-[#2C1B14] group-hover:text-[#553C2F] transition-colors cursor-pointer truncate"
                    >
                      {product.name}
                    </h3>

                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-xs sm:text-sm font-bold text-[#2C1B14] tabular-nums">
                        ${product.price?.toFixed(2)}
                      </span>
                      {product.original_price && (
                        <span className="text-[11px] text-[#9C7A65] line-through tabular-nums">
                          ${product.original_price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
