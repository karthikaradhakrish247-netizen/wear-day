import React, { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext.js';
import { useStore } from '../../context/StoreContext.js';
import type { Product } from '../../types.js';

interface FormProps {
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
}

export const AdminProductForm: React.FC<FormProps> = ({ product, onClose, onSaved }) => {
  const { token } = useAdminAuth();
  const { categories, settings } = useStore();

  const isEditing = Boolean(product);

  const [name, setName] = useState(product?.name || '');
  const [slug, setSlug] = useState(product?.slug || '');
  const [imageUrl, setImageUrl] = useState(product?.image_url || '/src/assets/images/product_pista_overshirt_1793947613900.jpg');
  const [additionalImages, setAdditionalImages] = useState(product?.additional_images?.join(', ') || '');
  const [shortDesc, setShortDesc] = useState(product?.short_description || '');
  const [fullDesc, setFullDesc] = useState(product?.full_description || '');
  const [categoryId, setCategoryId] = useState(product?.category_id || (categories[0]?.id || 'cat-1'));
  const [price, setPrice] = useState(product?.price?.toString() || '39.99');
  const [originalPrice, setOriginalPrice] = useState(product?.original_price?.toString() || '55.00');
  const [affiliateUrl, setAffiliateUrl] = useState(
    product?.amazon_affiliate_url || `https://www.amazon.com/dp/B08X6V5Q8N/?tag=${settings.amazon_affiliate_tag || 'weardayaff-20'}`
  );
  const [featured, setFeatured] = useState(product?.featured ?? true);
  const [status, setStatus] = useState<'active' | 'inactive'>(product?.status || 'active');
  const [gender, setGender] = useState<'men' | 'women' | 'unisex' | 'all'>(product?.gender || 'unisex');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-slugify when name changes if creating
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      name,
      slug,
      image_url: imageUrl,
      additional_images: additionalImages ? additionalImages.split(',').map(s => s.trim()).filter(Boolean) : [],
      short_description: shortDesc,
      full_description: fullDesc,
      category_id: categoryId,
      price: price ? parseFloat(price) : undefined,
      original_price: originalPrice ? parseFloat(originalPrice) : undefined,
      amazon_affiliate_url: affiliateUrl,
      featured,
      status,
      gender,
      currency: settings.currency || 'USD'
    };

    try {
      const url = isEditing ? `/api/admin/products/${product!.id}` : '/api/admin/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save product.');
      }

      onSaved();
    } catch (err: any) {
      setError(err.message || 'Error saving product.');
    } finally {
      setLoading(false);
    }
  };

  // Preset image gallery choices
  const presetImages = [
    { label: 'Pistachio Overshirt', url: '/src/assets/images/product_pista_overshirt_1793947613900.jpg' },
    { label: 'Peach Linen Shirt', url: '/src/assets/images/product_peach_linen_shirt_1793947616322.jpg' },
    { label: 'Chocolate Chino', url: '/src/assets/images/product_chocolate_chino_1793947615594.jpg' },
    { label: 'Clean Sneakers', url: '/src/assets/images/product_minimalist_sneakers_1793947616208.jpg' },
    { label: 'Streetwear Hero', url: '/src/assets/images/hero_autumn_pista_peach_1793947613725.jpg' },
    { label: '3D Studio Shoe', url: '/public/assets/aistudio/image_4dafd9e5.png' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#231610] text-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl border border-[#3D271D]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#170D09] hover:bg-[#3D271D] text-stone-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white mb-1">
          {isEditing ? `Edit Product: ${product?.name}` : 'Add New Product'}
        </h2>
        <p className="text-xs text-stone-400 mb-6">
          Set up product metadata, photography, pricing, and Amazon affiliate target links.
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => handleNameChange(e.target.value)}
                placeholder="e.g. Sage Pistachio Overshirt"
                className="w-full px-3.5 py-2.5 bg-[#170D09] border border-[#3D271D] focus:border-[#9DB08E] text-xs sm:text-sm text-white rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="sage-pistachio-overshirt"
                className="w-full px-3.5 py-2.5 bg-[#170D09] border border-[#3D271D] focus:border-[#9DB08E] text-xs sm:text-sm text-white rounded-xl focus:outline-none"
              />
            </div>
          </div>

          {/* Image URL & Presets */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Primary Image URL *
            </label>
            <input
              type="text"
              required
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://... or /src/assets/images/..."
              className="w-full px-3.5 py-2.5 bg-[#170D09] border border-[#3D271D] focus:border-[#9DB08E] text-xs sm:text-sm text-white rounded-xl focus:outline-none mb-2"
            />

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-stone-400 mr-1">Quick Selects:</span>
              {presetImages.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setImageUrl(p.url)}
                  className="px-2 py-0.5 rounded-md bg-[#170D09] hover:bg-[#3D271D] text-stone-300 hover:text-white border border-[#3D271D]"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Additional Images (Comma-separated URLs)
            </label>
            <input
              type="text"
              value={additionalImages}
              onChange={e => setAdditionalImages(e.target.value)}
              placeholder="https://..., https://..."
              className="w-full px-3.5 py-2.5 bg-[#170D09] border border-[#3D271D] focus:border-[#9DB08E] text-xs sm:text-sm text-white rounded-xl focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#170D09] border border-[#3D271D] focus:border-[#9DB08E] text-xs sm:text-sm text-white rounded-xl focus:outline-none"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="49.99"
                className="w-full px-3.5 py-2.5 bg-[#170D09] border border-[#3D271D] focus:border-[#9DB08E] text-xs sm:text-sm text-white rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Original Price ($ Strike-through)
              </label>
              <input
                type="number"
                step="0.01"
                value={originalPrice}
                onChange={e => setOriginalPrice(e.target.value)}
                placeholder="72.00"
                className="w-full px-3.5 py-2.5 bg-[#170D09] border border-[#3D271D] focus:border-[#9DB08E] text-xs sm:text-sm text-white rounded-xl focus:outline-none"
              />
            </div>
          </div>

          {/* Amazon Affiliate URL */}
          <div>
            <label className="block text-xs font-semibold text-[#F7C5AB] mb-1">
              Amazon Affiliate Target URL *
            </label>
            <input
              type="url"
              required
              value={affiliateUrl}
              onChange={e => setAffiliateUrl(e.target.value)}
              placeholder="https://www.amazon.com/dp/B08X6V5Q8N/?tag=weardayaff-20"
              className="w-full px-3.5 py-2.5 bg-[#170D09] border border-[#553C2F] focus:border-[#9DB08E] text-xs sm:text-sm text-white rounded-xl focus:outline-none font-mono"
            />
            <p className="text-[11px] text-stone-400 mt-1">
              Visitors clicking Buy Now will be tracked through <code className="text-[#9DB08E]">/go/{slug || 'slug'}</code> and redirected here.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Short Description
            </label>
            <textarea
              rows={2}
              value={shortDesc}
              onChange={e => setShortDesc(e.target.value)}
              placeholder="Crisp 1-2 line summary displayed on cards..."
              className="w-full px-3.5 py-2.5 bg-[#170D09] border border-[#3D271D] focus:border-[#9DB08E] text-xs sm:text-sm text-white rounded-xl focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Full Product Story & Specifications
            </label>
            <textarea
              rows={4}
              value={fullDesc}
              onChange={e => setFullDesc(e.target.value)}
              placeholder="Detailed description, fabric composition (e.g. 100% organic cotton twill, 280 GSM), fit notes..."
              className="w-full px-3.5 py-2.5 bg-[#170D09] border border-[#3D271D] focus:border-[#9DB08E] text-xs sm:text-sm text-white rounded-xl focus:outline-none"
            />
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#3D271D]">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Gender</label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#170D09] border border-[#3D271D] text-xs text-white rounded-xl"
              >
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featuredToggle"
                checked={featured}
                onChange={e => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-[#9DB08E] focus:ring-0 cursor-pointer"
              />
              <label htmlFor="featuredToggle" className="text-xs font-medium text-stone-300 cursor-pointer">
                Featured on Homepage
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#170D09] border border-[#3D271D] text-xs text-white rounded-xl"
              >
                <option value="active">Active (Visible)</option>
                <option value="inactive">Inactive (Draft)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#3D271D]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-[#170D09] hover:bg-[#3D271D] text-stone-300 text-xs font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#9DB08E] hover:bg-[#809770] text-[#170D09] text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
