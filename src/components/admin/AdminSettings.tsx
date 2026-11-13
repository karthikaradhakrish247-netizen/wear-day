import React, { useState } from 'react';
import { Save, Check, Globe, Shield, Tag } from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext.js';
import { useStore } from '../../context/StoreContext.js';
import type { SiteSettings } from '../../types.js';

export const AdminSettings: React.FC = () => {
  const { token } = useAdminAuth();
  const { settings, refreshData } = useStore();

  const [brandName, setBrandName] = useState(settings.brand_name || 'WearDay');
  const [websiteDesc, setWebsiteDesc] = useState(settings.website_description || '');
  const [affiliateTag, setAffiliateTag] = useState(settings.amazon_affiliate_tag || 'weardayaff-20');
  const [currency, setCurrency] = useState(settings.currency || 'USD');
  const [currencySymbol, setCurrencySymbol] = useState(settings.currency_symbol || '$');
  const [freeShipping, setFreeShipping] = useState(settings.free_shipping_threshold?.toString() || '50');
  const [contactEmail, setContactEmail] = useState(settings.contact_email || 'hello@wearday.store');
  const [contactPhone, setContactPhone] = useState(settings.contact_phone || '+1 (800) 458-9273');
  const [seoTitle, setSeoTitle] = useState(settings.seo_title || '');
  const [seoDesc, setSeoDesc] = useState(settings.seo_description || '');
  const [footerText, setFooterText] = useState(settings.footer_text || '');

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    const payload: Partial<SiteSettings> = {
      brand_name: brandName,
      website_description: websiteDesc,
      amazon_affiliate_tag: affiliateTag,
      currency,
      currency_symbol: currencySymbol,
      free_shipping_threshold: parseFloat(freeShipping) || 50,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      seo_title: seoTitle,
      seo_description: seoDesc,
      footer_text: footerText
    };

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSavedSuccess(true);
        refreshData();
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to update settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
            Site Settings & Affiliate Configuration
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Configure global brand identity, Amazon Associate credentials, and SEO meta tags
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#9DB08E]/20 text-[#9DB08E] border border-[#9DB08E]/30 rounded-xl text-xs font-bold">
            <Check className="w-4 h-4" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand & Identity Card */}
        <div className="bg-[#231610] p-6 rounded-2xl border border-[#3D271D] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#3D271D] pb-3">
            <Globe className="w-4 h-4 text-[#9DB08E]" />
            <span>Storefront Brand Identity</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Storefront Brand Name *
              </label>
              <input
                type="text"
                required
                value={brandName}
                onChange={e => setBrandName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#170D09] border border-[#3D271D] focus:border-[#9DB08E] text-xs sm:text-sm text-white rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Free Shipping Threshold ($)
              </label>
              <input
                type="number"
                value={freeShipping}
                onChange={e => setFreeShipping(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#170D09] border border-[#3D271D] focus:border-[#9DB08E] text-xs sm:text-sm text-white rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Website Tagline / Description
            </label>
            <input
              type="text"
              value={websiteDesc}
              onChange={e => setWebsiteDesc(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#170D09] border border-[#3D271D] focus:border-[#9DB08E] text-xs sm:text-sm text-white rounded-xl focus:outline-none"
            />
          </div>
        </div>

        {/* Amazon Associates Integration Card */}
        <div className="bg-[#231610] p-6 rounded-2xl border border-[#553C2F] space-y-4">
          <h3 className="text-sm font-bold text-[#F7C5AB] flex items-center gap-2 border-b border-[#3D271D] pb-3">
            <Tag className="w-4 h-4 text-[#F7C5AB]" />
            <span>Amazon Affiliate Tracking Credentials</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Amazon Affiliate Associate Tag (Tracking ID) *
              </label>
              <input
                type="text"
                required
                value={affiliateTag}
                onChange={e => setAffiliateTag(e.target.value)}
                placeholder="e.g. weardayaff-20"
                className="w-full px-3.5 py-2.5 bg-[#170D09] border border-[#3D271D] focus:border-[#9DB08E] text-xs sm:text-sm text-white rounded-xl focus:outline-none font-mono"
              />
              <p className="text-[11px] text-stone-400 mt-1">
                Automatically appended to all product affiliate redirection targets across the store.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Store Currency
              </label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#170D09] border border-[#3D271D] text-xs sm:text-sm text-white rounded-xl"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact & Support */}
        <div className="bg-[#231610] p-6 rounded-2xl border border-[#3D271D] space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-[#3D271D] pb-3">
            Contact & Customer Support
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Support Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#170D09] border border-[#3D271D] text-xs sm:text-sm text-white rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Support Phone
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#170D09] border border-[#3D271D] text-xs sm:text-sm text-white rounded-xl focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SEO & Compliance */}
        <div className="bg-[#231610] p-6 rounded-2xl border border-[#3D271D] space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-[#3D271D] pb-3">
            SEO & Affiliate Compliance
          </h3>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Default SEO Meta Title
            </label>
            <input
              type="text"
              value={seoTitle}
              onChange={e => setSeoTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#170D09] border border-[#3D271D] text-xs sm:text-sm text-white rounded-xl focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Footer Compliance Text
            </label>
            <textarea
              rows={2}
              value={footerText}
              onChange={e => setFooterText(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#170D09] border border-[#3D271D] text-xs text-white rounded-xl focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-[#9DB08E] hover:bg-[#809770] text-[#170D09] font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving Settings...' : 'Save Configuration'}</span>
        </button>
      </form>
    </div>
  );
};
