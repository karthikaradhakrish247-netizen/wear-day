import React, { useState } from 'react';
import { X, Heart, ExternalLink, ShoppingBag, ShieldCheck, Truck, RefreshCw, Star, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext.js';
import type { Product } from '../types.js';

export const ProductDetailModal: React.FC = () => {
  const {
    activeProductModal,
    setActiveProductModal,
    products,
    addToCart,
    trackAndGo,
    wishlist,
    toggleWishlist
  } = useStore();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [added, setAdded] = useState(false);

  if (!activeProductModal) return null;

  const product = activeProductModal;
  const isWishlisted = wishlist.includes(product.id);
  const allImages = [product.image_url, ...(product.additional_images || [])].filter(Boolean);
  const currentImage = selectedImage || product.image_url;

  // Find related products in same category
  const related = products
    .filter(p => p.id !== product.id && p.status === 'active' && p.category_id === product.category_id)
    .slice(0, 3);

  const handleAddToCart = () => {
    addToCart(product, 1, selectedColor || product.colors?.[0]?.name);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl border border-[#E5EDE2]">
        {/* Close Button */}
        <button
          onClick={() => {
            setActiveProductModal(null);
            setSelectedImage(null);
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#FAF7F2] hover:bg-[#E5EDE2] text-[#2C1B14] transition-colors z-10"
          aria-label="Close product view"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Gallery */}
          <div className="md:col-span-6 space-y-3">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#FAF6F2] border border-[#EBE3D8] relative">
              <img
                src={currentImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />

              {product.discount_percentage && (
                <div className="absolute top-3 left-3 bg-[#E07A4B] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                  {product.discount_percentage}% OFF
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      currentImage === img ? 'border-[#2C1B14]' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Purchase Module */}
          <div className="md:col-span-6 flex flex-col justify-between">
            <div>
              {/* Category & Click metric & Gender */}
              <div className="flex items-center justify-between text-xs text-[#745442] mb-2">
                <div className="flex items-center gap-2">
                  <span className="uppercase tracking-wider font-bold text-[#809770]">
                    {product.category_name || 'Apparel'}
                  </span>
                  {product.gender && (
                    <span className="px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E5EDE2] text-[10px] font-semibold uppercase tracking-wider text-[#745442]">
                      {product.gender === 'women' ? "Women's" : product.gender === 'men' ? "Men's" : 'Unisex'}
                    </span>
                  )}
                </div>
                <span className="bg-[#FAF7F2] px-2 py-0.5 rounded-full border border-[#EBE3D8] font-medium text-[11px]">
                  🔥 {product.click_count || 120}+ clicked on Amazon
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#2C1B14] tracking-tight">
                {product.name}
              </h1>

              {/* Price & Rating */}
              <div className="flex items-center gap-4 mt-3 mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-[#2C1B14] tabular-nums">
                    ${product.price?.toFixed(2)}
                  </span>
                  {product.original_price && (
                    <span className="text-sm text-[#9C7A65] line-through tabular-nums">
                      ${product.original_price.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-[#745442] bg-[#FAF7F2] px-2.5 py-1 rounded-lg">
                  <Star className="w-3.5 h-3.5 text-[#E07A4B] fill-[#E07A4B]" />
                  <span>{product.rating || 4.9}</span>
                  <span className="text-stone-400">({product.reviews_count || 88})</span>
                </div>
              </div>

              {/* Short & Full Description */}
              <p className="text-sm text-[#553C2F] leading-relaxed mb-4">
                {product.short_description}
              </p>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-4">
                  <label className="text-xs font-semibold text-[#2C1B14] block mb-2">
                    Color: {selectedColor || product.colors[0].name}
                  </label>
                  <div className="flex items-center gap-2">
                    {product.colors.map((c, i) => {
                      const isSelected = (selectedColor || product.colors![0].name) === c.name;
                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedColor(c.name)}
                          className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                            isSelected ? 'border-[#2C1B14] scale-110' : 'border-stone-200 hover:border-stone-400'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-[#2C1B14]">Size</span>
                  <span className="text-stone-400">True to size</span>
                </div>
                <div className="flex items-center gap-2">
                  {['S', 'M', 'L', 'XL'].map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-10 h-10 rounded-xl text-xs font-bold border transition-all ${
                        selectedSize === size
                          ? 'border-[#2C1B14] bg-[#2C1B14] text-white'
                          : 'border-[#E5EDE2] bg-[#FAF7F2] text-[#2C1B14] hover:border-[#9DB08E]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Purchase Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => trackAndGo(product)}
                  className="w-full py-4 px-6 bg-[#2C1B14] hover:bg-[#422E23] text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Buy on Amazon — ${product.price?.toFixed(2)}</span>
                  <ExternalLink className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 py-3 px-4 border rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      added
                        ? 'border-[#9DB08E] bg-[#F4F7F2] text-[#657956]'
                        : 'border-[#D5C2B4] hover:bg-[#FAF7F2] text-[#2C1B14]'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{added ? 'Added to Bag!' : 'Save to Shopping Bag'}</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-3 border rounded-xl transition-colors ${
                      isWishlisted
                        ? 'border-[#F2A782] bg-[#FFF8F5] text-[#D26736]'
                        : 'border-[#D5C2B4] hover:bg-[#FAF7F2] text-[#2C1B14]'
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#D26736]' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Guarantees Strip */}
              <div className="mt-6 pt-5 border-t border-[#EBE3D8] grid grid-cols-2 gap-3 text-xs text-[#745442]">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#9DB08E]" />
                  <span>Prime 1-2 Day Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-[#9DB08E]" />
                  <span>30-Day Hassle-Free Returns</span>
                </div>
              </div>
            </div>

            {/* Related Products */}
            {related.length > 0 && (
              <div className="mt-8 pt-6 border-t border-[#EBE3D8]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#745442] mb-3">
                  You May Also Like
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {related.map(rel => (
                    <div
                      key={rel.id}
                      onClick={() => {
                        setActiveProductModal(rel);
                        setSelectedImage(null);
                      }}
                      className="group cursor-pointer"
                    >
                      <div className="aspect-[3/4] rounded-xl overflow-hidden bg-stone-100 mb-1.5 border border-[#EBE3D8]">
                        <img
                          src={rel.image_url}
                          alt={rel.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <p className="text-xs font-medium text-[#2C1B14] truncate group-hover:text-[#9DB08E]">
                        {rel.name}
                      </p>
                      <p className="text-xs font-bold text-[#745442]">${rel.price?.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
