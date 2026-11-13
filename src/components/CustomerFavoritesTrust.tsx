import React from 'react';
import { Star, Heart, RefreshCw, ShieldCheck } from 'lucide-react';

export const CustomerFavoritesTrust: React.FC = () => {
  const trustPoints = [
    {
      icon: <Star className="w-5 h-5 text-[#E07A4B]" />,
      title: 'Great Quality',
      subtitle: 'Loved by thousands'
    },
    {
      icon: <Heart className="w-5 h-5 text-[#D26736]" />,
      title: 'Everyday Comfort',
      subtitle: 'Designed for real life'
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-[#657956]" />,
      title: 'Easy Returns',
      subtitle: 'No hassle, ever'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#3D271D]" />,
      title: 'Secure Checkout',
      subtitle: 'Shop with confidence'
    }
  ];

  return (
    <section className="py-8 sm:py-10 bg-[#231610] text-white border-y border-[#3D271D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {trustPoints.map((point, index) => (
            <div
              key={index}
              className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#170D09]/60 border border-[#3D271D] hover:border-[#9DB08E] transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-[#2D1B13] border border-white/10 flex items-center justify-center shrink-0">
                {point.icon}
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-white leading-tight">
                  {point.title}
                </p>
                <p className="text-[11px] sm:text-xs text-[#F7C5AB]/80 leading-tight mt-0.5">
                  {point.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
