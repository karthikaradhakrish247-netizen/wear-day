import React, { useState } from 'react';
import { Filter, ArrowUpDown, Search, Heart, ExternalLink, ShoppingBag, X } from 'lucide-react';
import { useStore } from '../context/StoreContext.js';

export const ShopPage: React.FC = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    selectedGender,
    setSelectedGender,
    setActiveProductModal,
    trackAndGo,
    wishlist,
    toggleWishlist,
    addToCart,
    bgTheme
  } = useStore();

  const [sortOption, setSortOption] = useState<'featured' | 'price_asc' | 'price_desc' | 'clicks'>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(120);
  const [localSearch, setLocalSearch] = useState('');

  // Filter items
  let filtered = products.filter(p => p.status === 'active');

  if (selectedCategory) {
    filtered = filtered.filter(p => p.category_id === selectedCategory || p.category_name?.toLowerCase() === selectedCategory.toLowerCase());
  }

  if (selectedGender !== 'all') {
    filtered = filtered.filter(p => p.gender === selectedGender || p.gender === 'unisex');
  }

  if (localSearch.trim()) {
    const q = localSearch.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.short_description.toLowerCase().includes(q) ||
      p.category_name?.toLowerCase().includes(q)
    );
  }

  filtered = filtered.filter(p => (p.price || 0) <= maxPrice);

  // Sort
  if (sortOption === 'price_asc') {
    filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sortOption === 'price_desc') {
    filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
  } else if (sortOption === 'clicks') {
    filtered.sort((a, b) => (b.click_count || 0) - (a.click_count || 0));
  }

  const pageBg =
    bgTheme === 'pista'
      ? 'bg-[#E5EFE2]'
      : bgTheme === 'peach'
      ? 'bg-[#FDF2EA]'
      : bgTheme === 'chocolate'
      ? 'bg-[#1D110A]'
      : 'bg-gradient-to-b from-[#EBF3E8] via-[#FAF7F2] to-[#FAF7F2]';

  const headingColor =
    bgTheme === 'chocolate' ? 'text-white' : 'text-[#2C1B14]';

  return (
    <div className={`py-8 sm:py-12 min-h-screen transition-colors duration-500 ${pageBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className={`text-3xl sm:text-4xl font-display font-bold tracking-tight ${headingColor}`}>
            Curated Shop Collection <span className="font-serif-italic font-normal text-[#809770] text-2xl sm:text-3xl ml-1">· Her &amp; Him</span>
          </h1>
          <p className="text-sm text-[#745442] mt-1">
            Handpicked everyday wardrobe staples for women and men, connected directly with verified Amazon affiliate pricing.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EBE3D8] shadow-xs mb-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Gender Switcher */}
            <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#E5EDE2]">
              {(['all', 'women', 'men', 'unisex'] as const).map(g => (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                    selectedGender === g
                      ? 'bg-[#2C1B14] text-white shadow-xs font-bold'
                      : 'text-[#745442] hover:text-[#2C1B14]'
                  }`}
                >
                  {g === 'all' ? 'All Pieces' : g === 'women' ? "Women's" : g === 'men' ? "Men's" : 'Unisex'}
                </button>
              ))}
            </div>

            {/* In-page Search */}
            <div className="relative min-w-[200px] sm:min-w-[260px]">
              <input
                type="text"
                placeholder="Search collection..."
                value={localSearch}
                onChange={e => setLocalSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-[#FAF7F2] border border-[#E5EDE2] text-[#2C1B14] focus:outline-none focus:border-[#9DB08E]"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {localSearch && (
                <button
                  onClick={() => setLocalSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#745442] font-medium hidden sm:inline">Sort:</span>
              <select
                value={sortOption}
                onChange={e => setSortOption(e.target.value as any)}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#FAF7F2] border border-[#E5EDE2] text-[#2C1B14] focus:outline-none focus:border-[#9DB08E]"
              >
                <option value="featured">Featured First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="clicks">Most Clicked on Amazon</option>
              </select>
            </div>
          </div>

          {/* Categories Horizontal Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-[#F4F7F2] pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === null
                  ? 'bg-[#2C1B14] text-white'
                  : 'bg-[#FAF7F2] text-[#553C2F] hover:bg-[#E5EDE2]'
              }`}
            >
              All Categories ({products.filter(p => p.status === 'active').length})
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-[#2C1B14] text-white'
                    : 'bg-[#FAF7F2] text-[#553C2F] hover:bg-[#E5EDE2]'
                }`}
              >
                {cat.name} ({cat.product_count || 0})
              </button>
            ))}
          </div>
        </div>

        {/* Count Bar */}
        <div className="flex items-center justify-between text-xs text-[#745442] mb-6">
          <span>Showing <strong>{filtered.length}</strong> products</span>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-[#9DB08E] font-semibold hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              <span>Clear category filter</span>
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#EBE3D8] text-[#745442] space-y-3">
            <p className="text-base font-bold text-[#2C1B14]">No products match your filters</p>
            <p className="text-xs">Try resetting category or search criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedGender('all');
                setLocalSearch('');
              }}
              className="px-5 py-2 bg-[#2C1B14] text-white text-xs font-semibold rounded-xl"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map(product => {
              const isWishlisted = wishlist.includes(product.id);
              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl border border-[#EBE3D8] overflow-hidden flex flex-col hover:shadow-lg hover:border-[#9DB08E] transition-all duration-300"
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

                    {product.discount_percentage && (
                      <span className="absolute top-2.5 left-2.5 bg-[#E07A4B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {product.discount_percentage}% OFF
                      </span>
                    )}

                    {/* Quick Affiliate Buy Button */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        trackAndGo(product);
                      }}
                      className="absolute bottom-2.5 left-2.5 right-2.5 py-2.5 px-3 bg-[#2C1B14]/95 hover:bg-[#2C1B14] text-white text-xs font-semibold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <span>Buy on Amazon</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9DB08E]">
                        {product.category_name}
                      </span>
                      <h3
                        onClick={() => setActiveProductModal(product)}
                        className="text-sm font-semibold text-[#2C1B14] group-hover:text-[#553C2F] transition-colors cursor-pointer truncate mt-0.5"
                      >
                        {product.name}
                      </h3>
                      <p className="text-xs text-[#745442] line-clamp-1 mt-1">
                        {product.short_description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#F4F7F2]">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold text-[#2C1B14] tabular-nums">
                          ${product.price?.toFixed(2)}
                        </span>
                        {product.original_price && (
                          <span className="text-xs text-[#9C7A65] line-through tabular-nums">
                            ${product.original_price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => addToCart(product)}
                        className="p-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#9DB08E] hover:text-white text-[#2C1B14] transition-colors"
                        title="Add to Saved Bag"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
