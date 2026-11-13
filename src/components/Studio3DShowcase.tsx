import React, { useState } from 'react';
import { Sparkles, ExternalLink, ShoppingBag, Eye, RotateCw, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext.js';

export const Studio3DShowcase: React.FC = () => {
  const { products, trackAndGo, addToCart } = useStore();
  const sneaker = products.find(p => p.slug === 'clean-sneakers') || products[0];

  const [activeColor, setActiveColor] = useState<'white' | 'tan' | 'black' | 'chambray'>('white');
  const [rotateDegree, setRotateDegree] = useState(0);

  const colorConfig = {
    white: {
      name: 'Optic Crisp White',
      hex: '#FFFFFF',
      tag: 'Signature Everyday',
      accent: 'border-stone-300 bg-stone-50',
      desc: 'The essential daily silhouette. Handcrafted from full-grain calfskin with breathable leather lining.'
    },
    tan: {
      name: 'Warm Natural Tan',
      hex: '#D7C2AC',
      tag: 'Vegetable Tanned',
      accent: 'border-[#D7C2AC] bg-[#FAF5EF]',
      desc: 'Finished with natural un-dyed vegetable leather trim and an antimicrobial cork insole.'
    },
    black: {
      name: 'Midnight Monochrome',
      hex: '#1F1F1F',
      tag: 'Minimalist Black',
      accent: 'border-stone-700 bg-stone-900',
      desc: 'Deep clean matte black finish with tonal eyelets and durable vulcanized rubber soles.'
    },
    chambray: {
      name: 'Chambray Minimal Accent',
      hex: '#8A9EA7',
      tag: 'Seasonal Detail',
      accent: 'border-[#8A9EA7] bg-[#F2F6F8]',
      desc: 'Subtle clean contrast heel tab on pure white leather for understated versatility.'
    }
  };

  const currentVariant = colorConfig[activeColor];

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-[#FAF7F2] to-white border-b border-[#EBE3D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#2C1B14] rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#9DB08E]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F7C5AB]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center relative z-10">
            {/* Left Column: Product Story & Configurator */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-[#F7C5AB] text-xs font-semibold uppercase tracking-wider mb-4 w-fit">
                <Sparkles className="w-3.5 h-3.5" />
                <span>3D Interactive Showcase</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight leading-tight mb-3">
                Crafted For Every Step
              </h2>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-6">
                {currentVariant.desc} Handcrafted in small batches with ergonomic arch support, recycled rubber soles, and breathable calfskin lining.
              </p>

              {/* Colorway Switcher matching Pista, Peach, Chocolate palette */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs mb-2.5">
                  <span className="text-stone-400 font-medium">Select Colorway:</span>
                  <span className="text-white font-semibold">{currentVariant.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  {(Object.keys(colorConfig) as (keyof typeof colorConfig)[]).map(key => (
                    <button
                      key={key}
                      onClick={() => setActiveColor(key)}
                      className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${
                        activeColor === key
                          ? 'border-white scale-110 ring-2 ring-[#9DB08E]/50'
                          : 'border-white/20 hover:border-white/50'
                      }`}
                      style={{ backgroundColor: colorConfig[key].hex }}
                      title={colorConfig[key].name}
                    >
                      {activeColor === key && (
                        <Check className={`w-4 h-4 ${key === 'white' ? 'text-black' : 'text-white'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-3 gap-3 p-3.5 bg-white/5 rounded-2xl border border-white/10 mb-8 text-center text-xs">
                <div>
                  <p className="text-stone-400 text-[11px]">Weight</p>
                  <p className="font-bold text-white text-sm mt-0.5">290g</p>
                </div>
                <div>
                  <p className="text-stone-400 text-[11px]">Insole</p>
                  <p className="font-bold text-white text-sm mt-0.5">Cork Bio</p>
                </div>
                <div>
                  <p className="text-stone-400 text-[11px]">Sole Drop</p>
                  <p className="font-bold text-white text-sm mt-0.5">8mm</p>
                </div>
              </div>

              {/* CTA Row */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => sneaker && trackAndGo(sneaker)}
                  className="flex-1 py-3.5 px-6 bg-[#9DB08E] hover:bg-[#809770] text-[#170D09] font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Buy on Amazon — ${sneaker?.price?.toFixed(2) || '69.99'}</span>
                  <ExternalLink className="w-4 h-4" />
                </button>

                <button
                  onClick={() => sneaker && addToCart(sneaker, 1, currentVariant.name)}
                  className="py-3.5 px-5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                  title="Add to Shopping List"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
            </div>

            {/* Right Column: Isometric 3D Stage matching image 2 */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
              {/* Floating perspective stage */}
              <div className="w-full max-w-lg aspect-square relative flex items-center justify-center">
                {/* 3D Platform Pedestal */}
                <div className="absolute w-72 h-72 sm:w-88 sm:h-88 rounded-full bg-gradient-to-tr from-white/10 to-transparent border border-white/10 blur-xs transform -rotate-12" />
                <div className="absolute w-64 h-20 rounded-full bg-black/40 blur-xl transform translate-y-28 scale-90" />

                {/* Floating Sneaker Asset */}
                <div
                  className="relative z-10 transition-transform duration-700 ease-out cursor-grab active:cursor-grabbing hover:scale-105"
                  style={{
                    transform: `rotate(${rotateDegree}deg) translateY(-10px)`
                  }}
                  onClick={() => setRotateDegree(prev => prev + 45)}
                >
                  <img
                    src="/src/assets/images/product_minimalist_sneakers_1793947616208.jpg"
                    alt="3D Floating Showcase"
                    referrerPolicy="no-referrer"
                    className="w-72 sm:w-96 rounded-2xl shadow-2xl border border-white/20 object-cover"
                  />
                </div>

                {/* Floating Widgets inspired by image 2 */}
                <div className="absolute -top-2 right-4 bg-white/95 text-[#2C1B14] p-3 rounded-2xl shadow-xl border border-white/20 backdrop-blur-md max-w-[170px] z-20">
                  <p className="text-[10px] uppercase font-bold text-[#657956] tracking-wider">Fast Delivery</p>
                  <p className="text-xs font-extrabold mt-0.5">Prime 24-hr Shipping</p>
                  <p className="text-[10px] text-stone-500">Fulfilled by Amazon</p>
                </div>

                <div className="absolute bottom-4 left-4 bg-white/95 text-[#2C1B14] p-3 rounded-2xl shadow-xl border border-white/20 backdrop-blur-md max-w-[170px] z-20">
                  <p className="text-[10px] uppercase font-bold text-[#D26736] tracking-wider">Shopper Rating</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-xs font-extrabold">4.9 / 5.0</span>
                    <span className="text-[10px] text-stone-500">(310+ reviews)</span>
                  </div>
                </div>

                {/* Rotation hint button */}
                <button
                  onClick={() => setRotateDegree(prev => prev + 90)}
                  className="absolute bottom-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors flex items-center gap-1.5 text-xs z-20"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Rotate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
