import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, ArrowUp, ArrowDown, ExternalLink, X } from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext.js';
import { useStore } from '../../context/StoreContext.js';
import type { HeroSlide } from '../../types.js';

export const AdminHeroSlides: React.FC = () => {
  const { token } = useAdminAuth();
  const { refreshData } = useStore();

  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ctaText, setCtaText] = useState('Shop Now');
  const [ctaUrl, setCtaUrl] = useState('/shop');
  const [imageUrl, setImageUrl] = useState('/src/assets/images/hero_autumn_pista_peach_1793947613725.jpg');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [saving, setSaving] = useState(false);

  const fetchSlides = async () => {
    try {
      const res = await fetch('/api/admin/hero-slides', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setSlides(json.slides || []);
      }
    } catch (err) {
      console.error('Failed to fetch slides:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, [token]);

  const openAddModal = () => {
    setEditingSlide(null);
    setTitle('');
    setDescription('');
    setCtaText('Shop Now');
    setCtaUrl('/shop');
    setImageUrl('/src/assets/images/hero_autumn_pista_peach_1793947613725.jpg');
    setStatus('active');
    setIsModalOpen(true);
  };

  const openEditModal = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setTitle(slide.title);
    setDescription(slide.description);
    setCtaText(slide.cta_text);
    setCtaUrl(slide.cta_url);
    setImageUrl(slide.image_url);
    setStatus(slide.status);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title,
      description,
      cta_text: ctaText,
      cta_url: ctaUrl,
      image_url: imageUrl,
      status
    };

    try {
      const url = editingSlide ? `/api/admin/hero-slides/${editingSlide.id}` : '/api/admin/hero-slides';
      const method = editingSlide ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchSlides();
        refreshData();
      }
    } catch (err) {
      console.error('Error saving slide:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slideId: string) => {
    try {
      const res = await fetch(`/api/admin/hero-slides/${slideId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchSlides();
        refreshData();
      }
    } catch (err) {
      console.error('Error deleting slide:', err);
    }
  };

  const handleToggleStatus = async (slide: HeroSlide) => {
    const newStatus = slide.status === 'active' ? 'inactive' : 'active';
    try {
      await fetch(`/api/admin/hero-slides/${slide.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      fetchSlides();
      refreshData();
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
            Hero Slider Management
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Configure full-width campaign banners, headlines, CTAs, and active slides
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-[#9DB08E] hover:bg-[#809770] text-[#170D09] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Hero Slide</span>
        </button>
      </div>

      {/* Grid of Slide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {slides.map(slide => (
          <div
            key={slide.id}
            className="bg-[#231610] rounded-2xl border border-[#3D271D] overflow-hidden flex flex-col justify-between"
          >
            <div className="relative aspect-[16/9] bg-stone-900 overflow-hidden">
              <img
                src={slide.image_url}
                alt={slide.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                <span className="text-[10px] text-[#9DB08E] font-bold uppercase tracking-wider mb-1">
                  Order: #{slide.display_order}
                </span>
                <h3 className="text-base font-bold text-white line-clamp-1">{slide.title}</h3>
                <p className="text-xs text-stone-300 line-clamp-1">{slide.description}</p>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between bg-[#170D09]/50 border-t border-[#3D271D]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleStatus(slide)}
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                    slide.status === 'active'
                      ? 'bg-[#9DB08E]/20 text-[#9DB08E]'
                      : 'bg-stone-800 text-stone-400'
                  }`}
                >
                  {slide.status === 'active' ? 'Active' : 'Inactive'}
                </button>
                <span className="text-[11px] text-stone-400 font-mono">
                  CTA: "{slide.cta_text}" → {slide.cta_url}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(slide)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-[#3D271D]"
                  title="Edit Slide"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(slide.id)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-red-400 hover:bg-[#3D271D]"
                  title="Delete Slide"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#231610] rounded-2xl max-w-lg w-full p-6 text-white border border-[#3D271D] shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">
              {editingSlide ? 'Edit Hero Slide' : 'Add New Hero Slide'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">Headline Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Everyday Looks. Made Effortless."
                  className="w-full px-3 py-2 bg-[#170D09] border border-[#3D271D] text-white rounded-xl focus:border-[#9DB08E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Description Subtitle</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Practical pieces. Real comfort. For every part of your day."
                  className="w-full px-3 py-2 bg-[#170D09] border border-[#3D271D] text-white rounded-xl focus:border-[#9DB08E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="/src/assets/images/... or https://..."
                  className="w-full px-3 py-2 bg-[#170D09] border border-[#3D271D] text-white rounded-xl focus:border-[#9DB08E] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">CTA Text</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={e => setCtaText(e.target.value)}
                    placeholder="Shop Now"
                    className="w-full px-3 py-2 bg-[#170D09] border border-[#3D271D] text-white rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">CTA URL</label>
                  <input
                    type="text"
                    value={ctaUrl}
                    onChange={e => setCtaUrl(e.target.value)}
                    placeholder="/shop or #outfit-builder"
                    className="w-full px-3 py-2 bg-[#170D09] border border-[#3D271D] text-white rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#170D09] border border-[#3D271D] text-white rounded-xl"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#3D271D]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#170D09] text-stone-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#9DB08E] text-[#170D09] font-bold rounded-xl disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
