import React from 'react';
import { Home, LayoutGrid, Tag, Heart, User } from 'lucide-react';
import { useStore } from '../context/StoreContext.js';

export const MobileBottomNav: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    setSelectedCategory,
    wishlist,
    setIsWishlistOpen
  } = useStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EBE3D8] md:hidden px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => {
            setCurrentView('home');
            setSelectedCategory(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] transition-colors ${
            currentView === 'home' ? 'text-[#2C1B14] font-bold' : 'text-[#745442]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        {/* Categories */}
        <button
          onClick={() => {
            const el = document.getElementById('categories-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            else setCurrentView('shop');
          }}
          className="flex flex-col items-center justify-center p-1.5 min-w-[56px] text-[#745442] hover:text-[#2C1B14]"
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Categories</span>
        </button>

        {/* Deals / Shop */}
        <button
          onClick={() => setCurrentView('shop')}
          className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] transition-colors ${
            currentView === 'shop' ? 'text-[#2C1B14] font-bold' : 'text-[#745442]'
          }`}
        >
          <Tag className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Deals</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={() => setIsWishlistOpen(true)}
          className="flex flex-col items-center justify-center p-1.5 min-w-[56px] text-[#745442] hover:text-[#2C1B14] relative"
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-[#F2A782] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">Wishlist</span>
        </button>

        {/* Account / Admin */}
        <button
          onClick={() => setCurrentView('admin')}
          className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] transition-colors ${
            currentView === 'admin' ? 'text-[#2C1B14] font-bold' : 'text-[#745442]'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Account</span>
        </button>
      </div>
    </nav>
  );
};
