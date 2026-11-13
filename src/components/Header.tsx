import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingBag, Heart, User, Menu, X, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext.js';

export const Header: React.FC = () => {
  const {
    settings,
    cartCount,
    setIsCartOpen,
    wishlist,
    setIsWishlistOpen,
    products,
    categories,
    setSelectedCategory,
    selectedGender,
    setSelectedGender,
    setActiveProductModal,
    currentView,
    setCurrentView,
    bgTheme,
    setBgTheme
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [paletteMenuOpen, setPaletteMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = searchTerm.trim()
    ? products
        .filter(p =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.short_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8EDE4] transition-all">
      {/* Top micro announcement banner */}
      {announcementVisible && (
        <div className="bg-[#2C1B14] text-[#FDEEE7] text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-3 tracking-wide">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9DB08E]" />
            Free Shipping on orders ${settings.free_shipping_threshold || 50}+ · 30-Day Easy Returns
          </span>
          <button
            onClick={() => setAnnouncementVisible(false)}
            className="text-stone-400 hover:text-white ml-2 text-xs"
            aria-label="Dismiss banner"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Header Container matching image 1 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4 sm:gap-8">
          {/* Left Zone: Hamburger + Brand Wordmark */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 text-[#2C1B14] hover:bg-[#F4F7F2] rounded-lg transition-colors md:hidden"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <button
              onClick={() => {
                setCurrentView('home');
                setSelectedCategory(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 group text-left cursor-pointer"
            >
              <div className="font-display font-bold text-2xl sm:text-3xl text-[#2C1B14] tracking-tight group-hover:text-[#553C2F] transition-colors flex items-center">
                <span>{settings.brand_name || 'WearDay'}</span>
                <span className="w-2 h-2 rounded-full bg-[#9DB08E] ml-1 inline-block" />
              </div>
            </button>
          </div>

          {/* Center Zone: Search bar matching image 1 ("Search everyday essentials...") */}
          <div className="flex-1 max-w-xl relative" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search everyday essentials..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="w-full pl-10 pr-10 py-2.5 bg-[#FAF7F2] hover:bg-[#F4F7F2] focus:bg-white text-sm text-[#2C1B14] placeholder-[#8C7A6B] rounded-full border border-[#E5EDE2] focus:border-[#9DB08E] focus:outline-none focus:ring-2 focus:ring-[#9DB08E]/20 transition-all"
              />
              <Search className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Instant Live Search Results Popover */}
            {searchFocused && searchTerm.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#E5EDE2] overflow-hidden z-50">
                <div className="p-3 border-b border-[#F4F7F2] text-xs font-semibold text-[#745442] flex justify-between items-center">
                  <span>Products matching "{searchTerm}"</span>
                  <span className="text-stone-400">{searchResults.length} found</span>
                </div>
                {searchResults.length === 0 ? (
                  <div className="p-6 text-center text-sm text-[#8C7A6B]">
                    No items found matching your search.
                  </div>
                ) : (
                  <div className="divide-y divide-[#F4F7F2] max-h-80 overflow-y-auto">
                    {searchResults.map(prod => (
                      <button
                        key={prod.id}
                        onClick={() => {
                          setActiveProductModal(prod);
                          setSearchFocused(false);
                          setSearchTerm('');
                        }}
                        className="w-full p-3 flex items-center gap-3 text-left hover:bg-[#F9FAF8] transition-colors"
                      >
                        <img
                          src={prod.image_url}
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-lg object-cover bg-stone-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs uppercase tracking-wider text-[#9DB08E] font-semibold">{prod.category_name}</p>
                          <p className="text-sm font-medium text-[#2C1B14] truncate">{prod.name}</p>
                          <p className="text-xs text-[#745442] font-semibold">${prod.price?.toFixed(2)}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Zone: Navigation Links & Actions */}
          <div className="flex items-center gap-1 sm:gap-4 shrink-0">
            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-[#553C2F] mr-2">
              <button
                onClick={() => { setCurrentView('home'); setSelectedCategory(null); }}
                className={`transition-colors whitespace-nowrap cursor-pointer ${currentView === 'home' && !searchTerm ? 'text-[#2C1B14] font-semibold' : 'hover:text-[#2C1B14]'}`}
              >
                Home
              </button>
              <button
                onClick={() => {
                  setSelectedGender('women');
                  setCurrentView('shop');
                }}
                className={`transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${currentView === 'shop' && selectedGender === 'women' ? 'text-[#2C1B14] font-bold' : 'hover:text-[#2C1B14]'}`}
              >
                Women
              </button>
              <button
                onClick={() => {
                  setSelectedGender('men');
                  setCurrentView('shop');
                }}
                className={`transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${currentView === 'shop' && selectedGender === 'men' ? 'text-[#2C1B14] font-bold' : 'hover:text-[#2C1B14]'}`}
              >
                Men
              </button>
              <button
                onClick={() => {
                  setSelectedGender('all');
                  setCurrentView('shop');
                }}
                className={`transition-colors whitespace-nowrap cursor-pointer ${currentView === 'shop' && selectedGender === 'all' ? 'text-[#2C1B14] font-semibold' : 'hover:text-[#2C1B14]'}`}
              >
                All Shop
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('outfit-builder');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else setCurrentView('home');
                }}
                className="hover:text-[#2C1B14] transition-colors whitespace-nowrap flex items-center gap-1 text-[#4E5F42] cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#809770]" />
                Outfit Builder
              </button>
              <button
                onClick={() => setCurrentView('contact')}
                className={`transition-colors whitespace-nowrap cursor-pointer ${currentView === 'contact' ? 'text-[#2C1B14] font-semibold' : 'hover:text-[#2C1B14]'}`}
              >
                Contact
              </button>
            </nav>

            {/* Background Palette Atmosphere Selector */}
            <div className="relative" ref={paletteRef}>
              <button
                onClick={() => setPaletteMenuOpen(!paletteMenuOpen)}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#FAF7F2] hover:bg-[#F2F7F0] border border-[#E5EDE2] text-xs font-semibold text-[#2C1B14] transition-colors"
                title="Switch Website Background Palette"
              >
                <span className="flex items-center -space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#9DB08E] border border-white" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F7C5AB] border border-white" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3D271D] border border-white" />
                </span>
                <span className="capitalize hidden lg:inline text-[11px] text-[#553C2F]">
                  {bgTheme === 'palette' ? 'Palette BG' : `${bgTheme} BG`}
                </span>
              </button>

              {paletteMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E5EDE2] p-2 z-50 text-xs">
                  <div className="px-3 py-1.5 font-bold text-[#2C1B14] border-b border-[#F4F7F2] text-[11px]">
                    Website Background Palette
                  </div>
                  <div className="space-y-1 pt-1.5">
                    <button
                      onClick={() => { setBgTheme('palette'); setPaletteMenuOpen(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-colors ${
                        bgTheme === 'palette' ? 'bg-[#FAF6F2] text-[#2C1B14] font-bold' : 'hover:bg-[#FAF7F2] text-[#553C2F]'
                      }`}
                    >
                      <span className="flex items-center -space-x-1">
                        <span className="w-3 h-3 rounded-full bg-[#9DB08E]" />
                        <span className="w-3 h-3 rounded-full bg-[#F7C5AB]" />
                        <span className="w-3 h-3 rounded-full bg-[#3D271D]" />
                      </span>
                      <span>Tonal Palette (Pista + Peach + Choc)</span>
                    </button>

                    <button
                      onClick={() => { setBgTheme('pista'); setPaletteMenuOpen(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-colors ${
                        bgTheme === 'pista' ? 'bg-[#EDF4EA] text-[#4E5F42] font-bold' : 'hover:bg-[#FAF7F2] text-[#553C2F]'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full bg-[#9DB08E]" />
                      <span>Soothing Pista Green</span>
                    </button>

                    <button
                      onClick={() => { setBgTheme('peach'); setPaletteMenuOpen(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-colors ${
                        bgTheme === 'peach' ? 'bg-[#FDF2EA] text-[#D26736] font-bold' : 'hover:bg-[#FAF7F2] text-[#553C2F]'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full bg-[#F7C5AB]" />
                      <span>Warm Creamy Peach</span>
                    </button>

                    <button
                      onClick={() => { setBgTheme('chocolate'); setPaletteMenuOpen(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-colors ${
                        bgTheme === 'chocolate' ? 'bg-[#231610] text-[#F7C5AB] font-bold' : 'hover:bg-[#FAF7F2] text-[#553C2F]'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full bg-[#3D271D]" />
                      <span>Rich Dark Chocolate</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist Icon */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="p-2 text-[#2C1B14] hover:bg-[#F4F7F2] rounded-full transition-colors relative"
              aria-label="Wishlist"
              title="Saved Items"
            >
              <Heart className="w-5 h-5 text-[#2C1B14]" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#F2A782] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Icon matching image 1 with numeric badge "2" */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-[#2C1B14] hover:bg-[#F4F7F2] rounded-full transition-colors relative"
              aria-label="Shopping Bag"
              title="Shopping Cart & Affiliate Bag"
            >
              <ShoppingBag className="w-5 h-5 text-[#2C1B14]" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-[#2C1B14] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User / Admin Portal Button */}
            <button
              onClick={() => setCurrentView('admin')}
              className="p-2 text-[#745442] hover:text-[#2C1B14] hover:bg-[#F4F7F2] rounded-full transition-colors relative"
              aria-label="Admin Portal"
              title="Admin Dashboard Portal"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5EDE2] bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <button
              onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-lg text-left bg-[#FAF7F2] text-[#2C1B14]"
            >
              Home
            </button>
            <button
              onClick={() => {
                setSelectedGender('women');
                setCurrentView('shop');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg text-left bg-[#FAF7F2] text-[#2C1B14] font-semibold flex items-center justify-between"
            >
              <span>Women</span>
              <span className="text-[10px] text-[#809770] font-bold">New</span>
            </button>
            <button
              onClick={() => {
                setSelectedGender('men');
                setCurrentView('shop');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg text-left bg-[#FAF7F2] text-[#2C1B14] font-semibold flex items-center justify-between"
            >
              <span>Men</span>
              <span className="text-[10px] text-[#809770] font-bold">New</span>
            </button>
            <button
              onClick={() => {
                setSelectedGender('all');
                setCurrentView('shop');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg text-left bg-[#FAF7F2] text-[#2C1B14]"
            >
              Shop All
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                const el = document.getElementById('outfit-builder');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-2.5 rounded-lg text-left bg-[#FAF7F2] text-[#2C1B14]"
            >
              Outfit Builder
            </button>
            <button
              onClick={() => { setCurrentView('contact'); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-lg text-left bg-[#FAF7F2] text-[#2C1B14]"
            >
              Contact Us
            </button>
          </div>

          <div className="pt-2 border-t border-[#F4F7F2]">
            <p className="text-xs uppercase tracking-wider text-[#9DB08E] font-semibold mb-2">Categories</p>
            <div className="flex flex-wrap gap-1.5">
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCategory(c.id);
                    setCurrentView('shop');
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#F4F7F2] text-[#2C1B14] hover:bg-[#9DB08E] hover:text-white transition-colors"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[#F4F7F2] flex items-center justify-between text-xs text-[#745442]">
            <span>Official Amazon Affiliate Partner</span>
            <button
              onClick={() => { setCurrentView('admin'); setMobileMenuOpen(false); }}
              className="font-medium underline hover:text-[#2C1B14]"
            >
              Admin Dashboard →
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
