import React from 'react';
import { ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext.js';

export const Footer: React.FC = () => {
  const { settings, categories, setSelectedCategory, setCurrentView } = useStore();

  return (
    <footer className="bg-[#231610] text-[#E4D5CA] pt-12 pb-24 md:pb-12 border-t border-[#3D271D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/10">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl font-extrabold text-white tracking-tight">
                {settings.brand_name || 'WearDay'}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#9DB08E]" />
            </div>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-sm">
              {settings.website_description || 'Curated daily wardrobe pieces designed to mix, match, and elevate your personal style effortlessly.'}
            </p>

            <div className="flex items-center gap-2 text-xs text-[#9DB08E]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Official Amazon Associates Affiliate Platform</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F7C5AB]">Navigation</h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>
                <button
                  onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('shop')} className="hover:text-white transition-colors">
                  Shop All Pieces
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('outfit-builder');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Outfit Builder
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('contact')} className="hover:text-white transition-colors">
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('admin')}
                  className="text-stone-400 hover:text-[#9DB08E] transition-colors"
                >
                  Admin Portal →
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F7C5AB]">Collections</h4>
            <ul className="space-y-2 text-xs text-stone-300">
              {categories.slice(0, 5).map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setCurrentView('shop');
                    }}
                    className="hover:text-white transition-colors text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Affiliate Tag info */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F7C5AB]">Affiliate Info</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Every purchase made through our links directly supports our curation team with zero extra cost to you.
            </p>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-stone-300">
              <span className="text-[#9DB08E] font-semibold">Affiliate Tag:</span> {settings.amazon_affiliate_tag || 'weardayaff-20'}
            </div>
          </div>
        </div>

        {/* Amazon Associates Disclosure & Copyright */}
        <div className="pt-8 space-y-3 text-center md:text-left">
          <p className="text-[11px] text-stone-400 leading-relaxed">
            {settings.footer_text || '© 2026 WearDay. All rights reserved.'} As an Amazon Associate, this website earns from qualifying purchases. Product prices, coupons, and stock availability on Amazon are subject to change.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-2">
            <span>Designed in Pista, Chocolate & Peach tones for maximum conversion & elegance.</span>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Affiliate Disclosure</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
