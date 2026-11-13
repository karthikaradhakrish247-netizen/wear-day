import React, { useState } from 'react';
import { ArrowRight, BookOpen, X, ExternalLink, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext.js';
import type { Product } from '../types.js';

interface Guide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  readTime: string;
  summary: string;
  keyRules: string[];
  productSlugs: string[];
}

export const StylingGuides: React.FC = () => {
  const { products, trackAndGo, setActiveProductModal, bgTheme } = useStore();
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);

  const guides: Guide[] = [
    {
      id: 'guide-1',
      title: "Women's Capsule: Fluid Tailoring & Knit Dresses",
      subtitle: 'Effortless Feminine Silhouettes',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
      readTime: '3 min read',
      summary: 'Combine rib-knit midi dresses with tailored oversized blazers and fluid wide-leg trousers. Balance structured shoulders with flowing drape for an elevated day-to-night look.',
      keyRules: [
        'Contrast structured tailored shoulders with relaxed wide-leg trousers',
        'Use ribbed knit textures to add effortless dimension without bulk',
        'Anchor fluid monochrome looks with crisp clean white leather sneakers'
      ],
      productSlugs: ['ribbed-knit-midi-dress', 'pleated-wide-leg-trousers', 'structured-tailored-blazer']
    },
    {
      id: 'guide-2',
      title: "Men's Everyday: The Layered Overshirt Look",
      subtitle: 'Utilitarian Texture & Comfort',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
      readTime: '4 min read',
      summary: 'Mastering the overshirt is the fastest way to upgrade any simple tee. Discover how differing weights and textures elevate basic casual outfits into tailored silhouettes.',
      keyRules: [
        'Layer from lightest fabric closest to skin to heaviest on exterior',
        'Let the inner collar or hem peek through for subtle contrast',
        'Leave overshirts unbuttoned for easy relaxed movement'
      ],
      productSlugs: ['classic-utility-overshirt', 'relaxed-fit-tee', 'easy-chino-pants']
    },
    {
      id: 'guide-3',
      title: 'Effortless Couple Weekend Dressing',
      subtitle: 'Shared Warm Neutral Palette',
      image: '/src/assets/images/hero_autumn_pista_peach_1793947613725.jpg',
      readTime: '4 min read',
      summary: 'Transition effortlessly from city strolls to brunch. Crisp linen button-downs paired with vintage denim and clean leather sneakers keep both his and her looks effortlessly synchronized.',
      keyRules: [
        'Tone-coordinate without matching: pair pistachio sage with creamy peach and cocoa',
        'Breathable French linen and soft combed cotton ensure all-day comfort',
        'Minimalist calfskin trainers tie both casual outfits together'
      ],
      productSlugs: ['linen-blend-shirt', 'camp-collar-oxford-shirt', 'clean-sneakers']
    }
  ];

  const getGuideProducts = (slugs: string[]): Product[] => {
    return products.filter(p => slugs.includes(p.slug));
  };

  const sectionBg =
    bgTheme === 'pista'
      ? 'bg-[#E5EFE2]'
      : bgTheme === 'peach'
      ? 'bg-[#FDF2EA]'
      : bgTheme === 'chocolate'
      ? 'bg-[#1D110A]'
      : 'bg-[#FDF3EB]';

  const headingColor =
    bgTheme === 'chocolate' ? 'text-white' : 'text-[#2C1B14]';

  return (
    <section className={`py-8 sm:py-12 transition-colors duration-500 ${sectionBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header matching image 1 */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className={`text-2xl sm:text-3xl font-display font-bold tracking-tight ${headingColor}`}>
              Styling Guides
            </h2>
            <p className="text-xs sm:text-sm text-[#745442]">Curated inspiration to master effortless daily dressing</p>
          </div>

          <button
            onClick={() => setSelectedGuide(guides[0])}
            className="text-xs sm:text-sm font-semibold text-[#553C2F] hover:text-[#2C1B14] flex items-center gap-1 group cursor-pointer"
          >
            <span>Explore all</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 3 Guide Cards matching image 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {guides.map(guide => (
            <div
              key={guide.id}
              onClick={() => setSelectedGuide(guide)}
              className="group bg-white rounded-2xl border border-[#EBE3D8] overflow-hidden flex flex-col hover:shadow-md hover:border-[#9DB08E] transition-all cursor-pointer"
            >
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#9DB08E] font-semibold mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{guide.readTime}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#2C1B14] group-hover:text-[#553C2F] transition-colors line-clamp-2">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-[#745442] mt-1 line-clamp-2">
                    {guide.summary}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#2C1B14] group-hover:text-[#9DB08E] transition-colors">
                  <span>Read Guide</span>
                  <div className="w-6 h-6 rounded-full bg-[#FAF7F2] group-hover:bg-[#9DB08E] group-hover:text-white flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>

              {/* Photo on right or bottom */}
              <div className="h-44 sm:h-48 overflow-hidden bg-[#FAF6F2]">
                <img
                  src={guide.image}
                  alt={guide.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guide Detail Modal */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl border border-[#E5EDE2]">
            <button
              onClick={() => setSelectedGuide(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#FAF7F2] hover:bg-[#E5EDE2] text-[#2C1B14] transition-colors"
              aria-label="Close guide"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs uppercase tracking-wider font-bold text-[#9DB08E]">
              {selectedGuide.subtitle} · {selectedGuide.readTime}
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[#2C1B14] mt-1 mb-4">
              {selectedGuide.title}
            </h2>

            <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-6 bg-stone-100">
              <img
                src={selectedGuide.image}
                alt={selectedGuide.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-sm text-[#553C2F] leading-relaxed mb-6">
              {selectedGuide.summary}
            </p>

            <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#EBE3D8] mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#745442] mb-3">
                Key Styling Principles
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-[#2C1B14]">
                {selectedGuide.keyRules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9DB08E] mt-1.5 shrink-0" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Featured Pieces in this Guide */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#745442] mb-3">
                Featured Essentials in this Look
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {getGuideProducts(selectedGuide.productSlugs).map(prod => (
                  <div
                    key={prod.id}
                    className="p-3 bg-[#FAF6F2] rounded-xl border border-[#EBE3D8] flex flex-col justify-between"
                  >
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedGuide(null);
                        setActiveProductModal(prod);
                      }}
                    >
                      <img
                        src={prod.image_url}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-24 object-cover rounded-lg mb-2"
                      />
                      <p className="text-xs font-semibold text-[#2C1B14] line-clamp-1">{prod.name}</p>
                      <p className="text-xs text-[#745442] font-semibold">${prod.price?.toFixed(2)}</p>
                    </div>

                    <button
                      onClick={() => trackAndGo(prod)}
                      className="mt-2 w-full py-1.5 px-2 bg-[#2C1B14] hover:bg-[#422E23] text-white text-[11px] font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Buy on Amazon</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
