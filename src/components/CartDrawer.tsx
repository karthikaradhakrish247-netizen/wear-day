import React from 'react';
import { X, Trash2, Plus, Minus, ExternalLink, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext.js';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    trackAndGo,
    settings
  } = useStore();

  if (!isCartOpen) return null;

  const freeShippingThreshold = settings.free_shipping_threshold || 50;
  const progressPercent = Math.min(100, Math.round((cartTotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#E5EDE2]">
          {/* Header */}
          <div className="p-5 border-b border-[#EBE3D8] flex items-center justify-between bg-[#FAF7F2]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#2C1B14]" />
              <h2 className="text-lg font-bold font-display text-[#2C1B14]">
                My Saved Bag
              </h2>
              <span className="text-xs bg-[#E5EDE2] text-[#4E5F42] font-semibold px-2 py-0.5 rounded-full">
                {cart.reduce((sum, i) => sum + i.quantity, 0)} items
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full text-stone-400 hover:text-[#2C1B14] hover:bg-white transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-[#FAF6F2] px-5 py-3 border-b border-[#EBE3D8]">
            <div className="flex justify-between text-xs text-[#553C2F] font-medium mb-1.5">
              <span>
                {remainingForFreeShipping === 0 ? (
                  <strong className="text-[#657956]">🎉 You qualify for Free Amazon Shipping!</strong>
                ) : (
                  <>Add <strong>${remainingForFreeShipping.toFixed(2)}</strong> more for Free Shipping</>
                )}
              </span>
              <span className="font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#E5EDE2] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#9DB08E] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#F4F7F2]">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#745442]">
                <div className="w-16 h-16 rounded-full bg-[#FAF7F2] flex items-center justify-center mb-4 text-[#9DB08E]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-base font-bold text-[#2C1B14]">Your bag is currently empty</p>
                <p className="text-xs mt-1 max-w-xs">
                  Discover curated everyday essentials and add them here to compare or checkout directly on Amazon.
                </p>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={`${item.product.id}-${idx}`} className="py-4 flex gap-4">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-24 object-cover rounded-xl bg-stone-100 shrink-0 border border-[#EBE3D8]"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-[#2C1B14] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-stone-400 hover:text-red-500 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.selectedColor && (
                        <p className="text-xs text-[#745442] mt-0.5">Color: {item.selectedColor}</p>
                      )}

                      <p className="text-xs font-bold text-[#2C1B14] mt-1 tabular-nums">
                        ${item.product.price?.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#E5EDE2] rounded-lg bg-[#FAF7F2]">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-white rounded-l-lg text-stone-600 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-[#2C1B14] tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-white rounded-r-lg text-stone-600 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Direct Amazon Buy for single item */}
                      <button
                        onClick={() => trackAndGo(item.product)}
                        className="text-xs font-semibold text-[#9DB08E] hover:text-[#657956] flex items-center gap-1 cursor-pointer"
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

          {/* Footer & Amazon Affiliate Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#EBE3D8] bg-[#FAF7F2] space-y-4">
              <div className="space-y-1.5 text-xs text-[#553C2F]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold tabular-nums">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amazon Shipping</span>
                  <span className="text-[#657956] font-semibold">
                    {remainingForFreeShipping === 0 ? 'Free' : 'Calculated at Amazon'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#2C1B14] pt-2 border-t border-[#EBE3D8]">
                  <span>Total Estimated</span>
                  <span className="tabular-nums">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Clear Affiliate Notice */}
              <div className="p-2.5 rounded-xl bg-white border border-[#E5EDE2] text-[11px] text-[#745442] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#9DB08E] shrink-0 mt-0.5" />
                <p>
                  Final checkout takes place on Amazon with full buyer protection, returns, and Prime benefits.
                </p>
              </div>

              {/* Main Checkout Button */}
              <button
                onClick={() => {
                  // Redirect to first item or open affiliate page
                  if (cart.length > 0) {
                    trackAndGo(cart[0].product);
                  }
                }}
                className="w-full py-3.5 px-4 bg-[#2C1B14] hover:bg-[#422E23] text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Checkout on Amazon</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <div className="flex justify-between items-center text-xs">
                <button
                  onClick={clearCart}
                  className="text-stone-400 hover:text-stone-600 transition-colors"
                >
                  Clear bag
                </button>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="font-medium text-[#2C1B14] underline"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
