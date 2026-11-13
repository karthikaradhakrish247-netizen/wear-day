import React, { useState } from 'react';
import { Plus, Check, ShoppingBag, ExternalLink, Sparkles, RefreshCw } from 'lucide-react';
import { useStore } from '../context/StoreContext.js';
import type { Product } from '../types.js';

interface OutfitSlot {
  label: string;
  options: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    product_slug: string;
    color: string;
  }[];
}

export const OutfitBuilder: React.FC = () => {
  const { products, addToCart, trackAndGo, setActiveProductModal, bgTheme } = useStore();

  const [genderMode, setGenderMode] = useState<'men' | 'women'>('men');

  // Men's capsule pieces
  const mensOutfitData: OutfitSlot[] = [
    {
      label: 'Top',
      options: [
        {
          id: 'opt-tee-1',
          name: 'Essential Tee',
          price: 19.99,
          image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
          product_slug: 'relaxed-fit-tee',
          color: 'Oatmeal Sand'
        },
        {
          id: 'opt-tee-2',
          name: 'Camp-Collar Shirt',
          price: 36.99,
          image_url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=400&q=80',
          product_slug: 'camp-collar-oxford-shirt',
          color: 'Chalk White'
        }
      ]
    },
    {
      label: 'Bottom',
      options: [
        {
          id: 'opt-pants-1',
          name: 'Chino Pants',
          price: 39.99,
          image_url: '/src/assets/images/product_chocolate_chino_1793947615594.jpg',
          product_slug: 'easy-chino-pants',
          color: 'Classic Khaki'
        },
        {
          id: 'opt-pants-2',
          name: 'Slim Fit Jeans',
          price: 49.99,
          image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=400&q=80',
          product_slug: 'slim-fit-jeans',
          color: 'Dark Indigo'
        }
      ]
    },
    {
      label: 'Layer',
      options: [
        {
          id: 'opt-layer-1',
          name: 'Utility Overshirt',
          price: 49.99,
          image_url: '/src/assets/images/product_pista_overshirt_1793947613900.jpg',
          product_slug: 'classic-utility-overshirt',
          color: 'Olive Army'
        },
        {
          id: 'opt-layer-2',
          name: 'Loopback Hoodie',
          price: 44.99,
          image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80',
          product_slug: 'everyday-hoodie',
          color: 'Warm Cream'
        }
      ]
    },
    {
      label: 'Footwear',
      options: [
        {
          id: 'opt-shoe-1',
          name: 'Clean Sneakers',
          price: 69.99,
          image_url: '/src/assets/images/product_minimalist_sneakers_1793947616208.jpg',
          product_slug: 'clean-sneakers',
          color: 'Optic White'
        }
      ]
    }
  ];

  // Women's capsule pieces
  const womensOutfitData: OutfitSlot[] = [
    {
      label: 'Top',
      options: [
        {
          id: 'opt-w-top-1',
          name: 'Silk-Touch Blouse',
          price: 36.99,
          image_url: 'https://images.unsplash.com/photo-1589465885857-44edb59bbff2?auto=format&fit=crop&w=400&q=80',
          product_slug: 'silk-touch-blouse',
          color: 'Cream Peach'
        },
        {
          id: 'opt-w-top-2',
          name: 'Linen Casual Shirt',
          price: 34.99,
          image_url: '/src/assets/images/product_peach_linen_shirt_1793947616322.jpg',
          product_slug: 'linen-blend-shirt',
          color: 'Natural Sand'
        }
      ]
    },
    {
      label: 'Bottom',
      options: [
        {
          id: 'opt-w-bot-1',
          name: 'Wide-Leg Trousers',
          price: 48.99,
          image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=400&q=80',
          product_slug: 'pleated-wide-leg-trousers',
          color: 'Desert Sand'
        },
        {
          id: 'opt-w-bot-2',
          name: 'Ribbed Midi Dress',
          price: 44.99,
          image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80',
          product_slug: 'ribbed-knit-midi-dress',
          color: 'Oatmeal Heather'
        }
      ]
    },
    {
      label: 'Layer',
      options: [
        {
          id: 'opt-w-lay-1',
          name: 'Tailored Blazer',
          price: 68.99,
          image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=400&q=80',
          product_slug: 'structured-tailored-blazer',
          color: 'Cocoa Brown'
        },
        {
          id: 'opt-w-lay-2',
          name: 'Denim Jacket',
          price: 59.99,
          image_url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=400&q=80',
          product_slug: 'denim-jacket',
          color: 'Vintage Wash'
        }
      ]
    },
    {
      label: 'Footwear',
      options: [
        {
          id: 'opt-w-shoe-1',
          name: 'Clean Sneakers',
          price: 69.99,
          image_url: '/src/assets/images/product_minimalist_sneakers_1793947616208.jpg',
          product_slug: 'clean-sneakers',
          color: 'Optic White'
        },
        {
          id: 'opt-w-shoe-2',
          name: 'Canvas Tote Bag',
          price: 24.99,
          image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
          product_slug: 'canvas-tote-bag',
          color: 'Natural Ecru'
        }
      ]
    }
  ];

  const outfitData = genderMode === 'women' ? womensOutfitData : mensOutfitData;

  const [selectedIndices, setSelectedIndices] = useState<number[]>([0, 0, 0, 0]);
  const [addedAll, setAddedAll] = useState(false);

  // Reset indices when switching gender
  const handleGenderSwitch = (mode: 'men' | 'women') => {
    setGenderMode(mode);
    setSelectedIndices([0, 0, 0, 0]);
  };

  // Calculate current combination total
  const selectedItems = outfitData.map((slot, slotIndex) => slot.options[selectedIndices[slotIndex]] || slot.options[0]);
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);

  const cycleItem = (slotIndex: number) => {
    setSelectedIndices(prev => {
      const next = [...prev];
      const maxOptions = outfitData[slotIndex].options.length;
      next[slotIndex] = (next[slotIndex] + 1) % maxOptions;
      return next;
    });
  };

  const handleAddAllToCart = () => {
    selectedItems.forEach(item => {
      const fullProd = products.find(p => p.slug === item.product_slug) || {
        id: item.id,
        name: item.name,
        slug: item.product_slug,
        price: item.price,
        image_url: item.image_url,
        currency: 'USD',
        category_id: 'cat-1',
        amazon_affiliate_url: 'https://www.amazon.com/?tag=weardayaff-20',
        featured: true,
        status: 'active' as const,
        click_count: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        short_description: `${item.name} in ${item.color}`,
        full_description: `${item.name} in ${item.color}`,
        additional_images: []
      };
      addToCart(fullProd, 1, item.color);
    });

    setAddedAll(true);
    setTimeout(() => setAddedAll(false), 2500);
  };

  const handleBuyOutfit = () => {
    // Open the primary item via affiliate redirect
    const firstProd = products.find(p => p.slug === selectedItems[0].product_slug);
    if (firstProd) {
      trackAndGo(firstProd);
    }
  };

  const sectionBg =
    bgTheme === 'pista'
      ? 'bg-[#E5EFE2]'
      : bgTheme === 'peach'
      ? 'bg-[#FDF2EA]'
      : bgTheme === 'chocolate'
      ? 'bg-[#1D110A]'
      : 'bg-gradient-to-b from-[#FAF7F2] via-[#FDF3EB] to-[#FAF7F2]';

  const cardBg =
    bgTheme === 'chocolate'
      ? 'bg-[#281810] border-[#3D271D] text-white'
      : 'bg-gradient-to-br from-[#FFFFFF] via-[#FAFDF8] to-[#FFF9F5] border-[#E2ECE0]';

  return (
    <section id="outfit-builder" className={`py-8 sm:py-12 transition-colors duration-500 ${sectionBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs relative overflow-hidden border ${cardBg}`}>
          {/* Section Header matching image 1 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-[#9DB08E]" />
                <span className="text-xs uppercase tracking-wider font-semibold text-[#9DB08E]">
                  Interactive Wardrobe
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#2C1B14] tracking-tight">
                Build Your Outfit
              </h2>
              <p className="text-sm text-[#745442] mt-0.5">
                Mix. Match. Make it yours. Click any piece to swap styles.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Women / Men Wardrobe Toggle */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#D5C2B4] shadow-xs">
                <button
                  onClick={() => handleGenderSwitch('women')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    genderMode === 'women'
                      ? 'bg-[#2C1B14] text-white shadow-xs'
                      : 'text-[#745442] hover:text-[#2C1B14]'
                  }`}
                >
                  Women's Look
                </button>
                <button
                  onClick={() => handleGenderSwitch('men')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    genderMode === 'men'
                      ? 'bg-[#2C1B14] text-white shadow-xs'
                      : 'text-[#745442] hover:text-[#2C1B14]'
                  }`}
                >
                  Men's Look
                </button>
              </div>
              <button
                onClick={handleAddAllToCart}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                  addedAll
                    ? 'bg-[#9DB08E] text-white'
                    : 'bg-[#2C1B14] hover:bg-[#422E23] text-white'
                }`}
              >
                {addedAll ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add Complete Look (${totalPrice.toFixed(2)})</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Outfit Modular Strip matching image 1:
              [ Tee ] + [ Pants ] + [ Overshirt ] + [ Sneakers ] = [ Your Look ] */}
          <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-3 sm:gap-4 bg-[#FAF7F2] p-4 sm:p-6 rounded-2xl border border-[#EDE4D8]">
            {selectedItems.map((item, idx) => (
              <React.Fragment key={idx}>
                {/* Product Box */}
                <div className="flex-1 min-w-[130px] sm:min-w-[150px] bg-white rounded-xl p-3 border border-[#E5EDE2] hover:border-[#9DB08E] transition-all group relative flex flex-col items-center text-center">
                  {outfitData[idx].options.length > 1 && (
                    <button
                      onClick={() => cycleItem(idx)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-[#FAF7F2] hover:bg-[#E5EDE2] text-[#745442] text-xs transition-colors"
                      title="Swap this piece"
                      aria-label="Swap piece"
                    >
                      <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-300" />
                    </button>
                  )}

                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden mb-2.5 bg-[#FAF6F2]">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                      onClick={() => {
                        const p = products.find(prod => prod.slug === item.product_slug);
                        if (p) setActiveProductModal(p);
                      }}
                    />
                  </div>

                  <p className="text-xs font-semibold text-[#2C1B14] line-clamp-1">{item.name}</p>
                  <p className="text-xs text-[#745442] font-semibold mt-0.5">${item.price.toFixed(2)}</p>
                  <span className="text-[10px] text-[#9DB08E] mt-1 font-medium">{item.color}</span>
                </div>

                {/* Operator Symbol (+ or =) */}
                {idx < selectedItems.length - 1 ? (
                  <div className="shrink-0 flex items-center justify-center text-[#9C7A65] font-bold text-lg select-none px-1">
                    +
                  </div>
                ) : (
                  <div className="shrink-0 flex items-center justify-center text-[#9C7A65] font-bold text-lg select-none px-1">
                    =
                  </div>
                )}
              </React.Fragment>
            ))}

            {/* Total "Your Look" Card matching image 1 */}
            <div className="flex-1 min-w-[150px] sm:min-w-[170px] bg-gradient-to-b from-[#FAF6F2] to-white rounded-xl p-3 border-2 border-[#9DB08E] flex flex-col items-center text-center relative shadow-sm">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#657956] mb-1">
                Completed Combo
              </span>

              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden mb-2.5 bg-stone-100 relative">
                <img
                  src={
                    genderMode === 'women'
                      ? 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80'
                      : '/src/assets/images/hero_autumn_pista_peach_1793947613725.jpg'
                  }
                  alt={genderMode === 'women' ? "Women's Curated Look" : "Men's Curated Look"}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>

              <p className="text-xs font-bold text-[#2C1B14]">Your Look</p>
              <p className="text-sm font-extrabold text-[#2C1B14] tabular-nums mt-0.5">
                ${totalPrice.toFixed(2)}
              </p>

              <button
                onClick={handleBuyOutfit}
                className="mt-2 w-full py-1.5 px-2 bg-[#2C1B14] hover:bg-[#422E23] text-white text-[11px] font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Buy on Amazon</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
