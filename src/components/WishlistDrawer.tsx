import React from 'react';
import { X, Heart, ExternalLink, ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext.js';

export const WishlistDrawer: React.FC = () => {
  const {
    wishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    products,
    toggleWishlist,
    addToCart,
    trackAndGo
  } = useStore();

  if (!isWishlistOpen) return null;

  const savedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#E5EDE2]">
          <div className="p-5 border-b border-[#EBE3D8] flex items-center justify-between bg-[#FAF7F2]">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#D26736] fill-[#D26736]" />
              <h2 className="text-lg font-bold font-display text-[#2C1B14]">
                Saved Favorites
              </h2>
              <span className="text-xs bg-[#FDEEE7] text-[#D26736] font-semibold px-2 py-0.5 rounded-full">
                {wishlist.length}
              </span>
            </div>

            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-1.5 rounded-full text-stone-400 hover:text-[#2C1B14] hover:bg-white transition-colors"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#F4F7F2]">
            {savedProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#745442]">
                <div className="w-16 h-16 rounded-full bg-[#FAF7F2] flex items-center justify-center mb-4 text-[#D26736]">
                  <Heart className="w-8 h-8" />
                </div>
                <p className="text-base font-bold text-[#2C1B14]">No saved favorites yet</p>
                <p className="text-xs mt-1 max-w-xs">
                  Tap the heart on any product card to save pieces you love and revisit them anytime.
                </p>
              </div>
            ) : (
              savedProducts.map(product => (
                <div key={product.id} className="py-4 flex gap-4">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-24 object-cover rounded-xl bg-stone-100 shrink-0 border border-[#EBE3D8]"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-[#2C1B14] line-clamp-1">
                          {product.name}
                        </h4>
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="text-stone-400 hover:text-red-500 transition-colors p-1"
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs font-bold text-[#2C1B14] mt-1 tabular-nums">
                        ${product.price?.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => addToCart(product)}
                        className="py-1.5 px-3 bg-[#FAF7F2] hover:bg-[#E5EDE2] text-[#2C1B14] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Bag</span>
                      </button>

                      <button
                        onClick={() => trackAndGo(product)}
                        className="py-1.5 px-3 bg-[#2C1B14] hover:bg-[#422E23] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <span>Buy on Amazon</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
