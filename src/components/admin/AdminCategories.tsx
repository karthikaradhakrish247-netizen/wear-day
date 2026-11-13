import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext.js';
import { useStore } from '../../context/StoreContext.js';
import type { Category } from '../../types.js';

export const AdminCategories: React.FC = () => {
  const { token } = useAdminAuth();
  const { refreshData } = useStore();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add/Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [imageUrl, setImageUrl] = useState('/src/assets/images/product_pista_overshirt_1793947613900.jpg');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setCategories(json.categories || []);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [token]);

  const openAddModal = () => {
    setEditingCat(null);
    setName('');
    setSlug('');
    setImageUrl('/src/assets/images/product_pista_overshirt_1793947613900.jpg');
    setDescription('');
    setStatus('active');
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCat(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setImageUrl(cat.image_url);
    setDescription(cat.description || '');
    setStatus(cat.status);
    setError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      image_url: imageUrl,
      description,
      status
    };

    try {
      const url = editingCat ? `/api/admin/categories/${editingCat.id}` : '/api/admin/categories';
      const method = editingCat ? 'PUT' : 'POST';

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
        throw new Error(data.error || 'Failed to save category.');
      }

      setIsModalOpen(false);
      fetchCategories();
      refreshData();
    } catch (err: any) {
      setError(err.message || 'Error saving category.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: Category) => {
    if (cat.product_count && cat.product_count > 0) {
      setError(`Cannot delete category "${cat.name}": It currently has ${cat.product_count} product(s) assigned. Please reassign or delete these products first.`);
      return;
    }

    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchCategories();
        refreshData();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete category.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error deleting category.');
    }
  };

  const handleToggleStatus = async (cat: Category) => {
    const newStatus = cat.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchCategories();
        refreshData();
      }
    } catch (err) {
      console.error('Error toggling category status:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
            Category Management
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Organize catalog departments, thumbnail icons, and navigation taxonomy
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-[#9DB08E] hover:bg-[#809770] text-[#170D09] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Category Table matching Section 20 */}
      <div className="bg-[#231610] rounded-2xl border border-[#3D271D] overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs text-stone-300">
          <thead className="bg-[#170D09] text-stone-400 font-semibold border-b border-[#3D271D] uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Image</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Slug</th>
              <th className="py-3 px-4">Assigned Products</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3D271D]">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-stone-500">
                  Loading categories...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-stone-500">
                  No categories configured.
                </td>
              </tr>
            ) : (
              categories.map(cat => (
                <tr key={cat.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4">
                    <img
                      src={cat.image_url}
                      alt={cat.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover bg-stone-900 border border-white/10"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-white">{cat.name}</p>
                    <p className="text-[11px] text-stone-500 line-clamp-1">{cat.description}</p>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-stone-400">
                    {cat.slug}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-[#170D09] text-[#9DB08E] border border-[#3D271D] font-bold tabular-nums">
                      {cat.product_count || 0} products
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleStatus(cat)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                        cat.status === 'active'
                          ? 'bg-[#9DB08E]/20 text-[#9DB08E] hover:bg-[#9DB08E]/30'
                          : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                      }`}
                    >
                      {cat.status === 'active' ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          <span>Inactive</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-[#9DB08E] hover:bg-[#3D271D] transition-colors"
                        title="Edit Category"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-400 hover:bg-[#3D271D] transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit Category */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#231610] rounded-2xl max-w-md w-full p-6 text-white border border-[#3D271D] shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">
              {editingCat ? `Edit Category: ${editingCat.name}` : 'Add New Category'}
            </h3>

            {error && (
              <div className="mb-4 p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                    if (!editingCat) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  placeholder="e.g. Knitwear"
                  className="w-full px-3 py-2 bg-[#170D09] border border-[#3D271D] text-white rounded-xl focus:border-[#9DB08E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  placeholder="knitwear"
                  className="w-full px-3 py-2 bg-[#170D09] border border-[#3D271D] text-white rounded-xl focus:border-[#9DB08E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="https://... or /src/assets/..."
                  className="w-full px-3 py-2 bg-[#170D09] border border-[#3D271D] text-white rounded-xl focus:border-[#9DB08E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Brief description for category banner..."
                  className="w-full px-3 py-2 bg-[#170D09] border border-[#3D271D] text-white rounded-xl focus:border-[#9DB08E] focus:outline-none"
                />
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
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
