import React from 'react';
import { ExternalLink, CheckCircle, X } from 'lucide-react';
import { useStore } from '../context/StoreContext.js';

export const AffiliateRedirectModal: React.FC = () => {
  const { isRedirecting, redirectTarget, setRedirectTarget } = useStore();

  if (!isRedirecting && !redirectTarget) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center border border-[#E5EDE2] shadow-2xl relative">
        <button
          onClick={() => setRedirectTarget(null)}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Animated green ring */}
        <div className="w-12 h-12 rounded-full bg-[#F4F7F2] border-2 border-[#9DB08E] flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="w-6 h-6 text-[#657956]" />
        </div>

        <h3 className="text-base font-bold text-[#2C1B14] mb-1">
          Opening Amazon Storefront
        </h3>
        <p className="text-xs text-[#745442] mb-4">
          Taking you to view <strong>{redirectTarget?.productName || 'product'}</strong> on Amazon with verified pricing, buyer protection, and Prime delivery.
        </p>

        {redirectTarget?.url && (
          <a
            href={redirectTarget.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setRedirectTarget(null)}
            className="w-full py-3 px-4 bg-[#2C1B14] hover:bg-[#422E23] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            <span>Proceed to Amazon</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};
