import React, { useState } from 'react';
import { Heart, ShoppingBag, ExternalLink, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext.js';
import type { Product } from '../types.js';

export const NewArrivals: React.FC = () => {
  const {
    products,
    selectedCategory,
    selectedGender,
    setSelectedGender,
    setActiveProductModal,
    trackAndGo,
    wishlist,
    toggleWishlist,
    addToCart,
    setCurrentView,
    bgTheme
  } = useStore();

  const [activeTab, setActiveTab] = useState<'all' | 'women' | 'men' | 'unisex'>('all');

  // Filter products by selected category and active gender tab
  let displayProducts: Product[] = [];

  if (selectedCategory) {
    displayProducts = products
      .filter(p => p.status === 'active')
      .filter(p => p.category_id === selectedCategory || p.category_name?.toLowerCase() === selectedCategory.toLowerCase());
  } else if (activeTab === 'all') {
    // Interleave Women and Men pieces so shoppers immediately see both
    const womenPieces = products.filter(p => p.status === 'active' && p.gender === 'women');
    const menPieces = products.filter(p => p.status === 'active' && p.gender === 'men');
    const interleaved: Product[] = [];
    const maxLen = Math.max(womenPieces.length, menPieces.length);
    for (let i = 0; i < maxLen; i++) {
      if (womenPieces[i]) interleaved.push(womenPieces[i]);
      if (menPieces[i]) interleaved.push(menPieces[i]);
    }
    displayProducts = interleaved;
  } else {
    displayProducts = products
      .filter(p => p.status === 'active')
      .filter(p => p.gender === activeTab || p.gender === 'unisex')
      .sort((a, b) => {
        if (a.gender === activeTab && b.gender !== activeTab) return -1;
        if (b.gender === activeTab && a.gender !== activeTab) return 1;
        return 0;
      });
  }

  // Display 6 cards (3 women, 3 men) on desktop for perfect balance
  const visibleCards = displayProducts.slice(0, 6);

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

  const tabLabels: Record<'all' | 'women' | 'men' | 'unisex', string> = {
    all: 'All (Women & Men)',
    women: "Women's Clothes",
    men: "Men's Clothes",
    unisex: 'Shoes & Unisex'
  };

  return (
    <section id="new-arrivals-section" className={`py-8 sm:py-12 border-y transition-colors duration-500 ${sectionBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Tabs and View All matching image 1 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 border-b border-black/5 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            <h2 className={`text-2xl sm:text-3xl font-display font-bold tracking-tight ${headingColor}`}>
              New Arrivals
            </h2>

            {/* Filter Tabs: All (Women & Men) | Women | Men | Unisex */}
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              {(['all', 'women', 'men', 'unisex'] as const).map(tab => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setSelectedGender(tab);
                    }}
                    className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                      isActive
                        ? 'text-[#2C1B14] border-b-2 border-[#2C1B14] bg-white/80 shadow-xs font-bold'
                        : 'text-[#745442] hover:text-[#2C1B14] hover:bg-white/40'
                    }`}
                  >
                    {tabLabels[tab]}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setCurrentView('shop')}
            className="text-xs sm:text-sm font-semibold text-[#553C2F] hover:text-[#2C1B14] flex items-center gap-1 self-start sm:self-auto group cursor-pointer"
          >
            <span>View all</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Product Grid (balanced 6 cards across desktop: 3 women, 3 men) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {visibleCards.map(product => {
            const isWishlisted = wishlist.includes(product.id);
            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-[#EBE3D8] overflow-hidden flex flex-col hover:shadow-md hover:border-[#9DB08E] transition-all duration-300"
              >
                {/* Image Container with Wishlist button */}
                <div className="relative aspect-[3/4] bg-[#FAF6F2] overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                    onClick={() => setActiveProductModal(product)}
                  />

                  {/* Gender Collection Badge */}
                  <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-[#2C1B14] shadow-2xs">
                    {product.gender === 'women' ? "Women" : product.gender === 'men' ? "Men" : "Unisex"}
                  </span>

                  {/* Wishlist Heart Button matching image 1 */}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-xs ${
                      isWishlisted
                        ? 'bg-[#F2A782] text-white'
                        : 'bg-white/90 hover:bg-white text-[#2C1B14]'
                    }`}
                    aria-label="Wishlist toggle"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
                  </button>

                  {/* Quick Affiliate Hover Button */}
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

                {/* Card Details */}
                <div className="p-3.5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3
                      onClick={() => setActiveProductModal(product)}
                      className="text-xs sm:text-sm font-semibold text-[#2C1B14] group-hover:text-[#553C2F] transition-colors cursor-pointer truncate"
                      title={product.name}
                    >
                      {product.name}
                    </h3>

                    {/* Price and Strike-through */}
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

                  {/* Color Swatches matching image 1 */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2.5">
                      {product.colors.map((c, i) => (
                        <span
                          key={i}
                          className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
