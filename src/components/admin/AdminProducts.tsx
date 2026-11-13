import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Copy, Eye, CheckCircle, XCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext.js';
import { useStore } from '../../context/StoreContext.js';
import { AdminProductForm } from './AdminProductForm.js';
import type { Product } from '../../types.js';

interface AdminProductsProps {
  onProductChanged?: () => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({ onProductChanged }) => {
  const { token } = useAdminAuth();
  const { categories, refreshData, setActiveProductModal } = useStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Form modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Delete confirmation modal
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAdminProducts = async () => {
    try {
      const res = await fetch('/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setProducts(json.products || []);
      }
    } catch (err) {
      console.error('Failed to fetch admin products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProducts();
  }, [token]);

  const handleDuplicate = async (prodId: string) => {
    try {
      const res = await fetch(`/api/admin/products/${prodId}/duplicate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchAdminProducts();
        refreshData();
      }
    } catch (err) {
      console.error('Error duplicating:', err);
    }
  };

  const handleToggleStatus = async (prod: Product) => {
    const newStatus = prod.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await fetch(`/api/admin/products/${prod.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchAdminProducts();
        refreshData();
      }
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${productToDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchAdminProducts();
        refreshData();
        setProductToDelete(null);
      }
    } catch (err) {
      console.error('Failed to delete product:', err);
    } finally {
      setDeleting(false);
    }
  };

  // Filtered
  let filtered = products;
  if (filterCategory !== 'all') {
    filtered = filtered.filter(p => p.category_id === filterCategory);
  }
  if (filterStatus !== 'all') {
    filtered = filtered.filter(p => p.status === filterStatus);
  }
  if (searchTerm.trim()) {
    const q = searchTerm.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q));
  }

  return (
    <div className="space-y-6">
      {/* Top Bar with Search & Add Product */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
            Product Management
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Manage catalog items, pricing, affiliate links, and visibility
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setIsFormOpen(true);
          }}
          className="px-4 py-2.5 bg-[#9DB08E] hover:bg-[#809770] text-[#170D09] text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-md cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="bg-[#231610] p-4 rounded-2xl border border-[#3D271D] flex flex-wrap items-center justify-between gap-4">
        <div className="relative min-w-[220px] flex-1">
          <input
            type="text"
            placeholder="Search by name or slug..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#170D09] border border-[#3D271D] text-xs text-white rounded-xl focus:outline-none focus:border-[#9DB08E]"
          />
          <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="px-3 py-2 bg-[#170D09] border border-[#3D271D] text-xs text-white rounded-xl focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-[#170D09] border border-[#3D271D] text-xs text-white rounded-xl focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Product Table matching Section 17 */}
      <div className="bg-[#231610] rounded-2xl border border-[#3D271D] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-[#170D09] text-stone-400 font-semibold border-b border-[#3D271D] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4 text-center">Affiliate Clicks</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3D271D]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-stone-500">
                    Loading products...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-stone-500">
                    No products found matching criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(product => (
                  <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Image */}
                    <td className="py-3 px-4">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-14 object-cover rounded-lg bg-stone-900 border border-white/5"
                      />
                    </td>

                    {/* Name & Slug */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white max-w-[200px] truncate">
                        {product.name}
                      </div>
                      <div className="text-[10px] text-stone-500 font-mono truncate">
                        /go/{product.slug}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-[#170D09] text-stone-300 border border-[#3D271D] text-[10px]">
                        {product.category_name || 'General'}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-bold text-white tabular-nums">
                      ${product.price?.toFixed(2) || '—'}
                    </td>

                    {/* Clicks */}
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-[#9DB08E] tabular-nums text-xs">
                        {product.click_count || 0}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(product)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                          product.status === 'active'
                            ? 'bg-[#9DB08E]/20 text-[#9DB08E] hover:bg-[#9DB08E]/30'
                            : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                        }`}
                        title="Click to toggle active/inactive"
                      >
                        {product.status === 'active' ? (
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

                    {/* Created Date */}
                    <td className="py-3 px-4 text-stone-400 text-[11px] whitespace-nowrap">
                      {new Date(product.created_at).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* View in Storefront */}
                        <button
                          onClick={() => setActiveProductModal(product)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-[#3D271D] transition-colors"
                          title="Preview in Storefront"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Test Affiliate Link */}
                        <a
                          href={`/go/${product.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-stone-400 hover:text-[#9DB08E] hover:bg-[#3D271D] transition-colors"
                          title="Test /go/:slug affiliate redirect"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        {/* Duplicate */}
                        <button
                          onClick={() => handleDuplicate(product.id)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-[#3D271D] transition-colors"
                          title="Duplicate Product"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setIsFormOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-[#9DB08E] hover:bg-[#3D271D] transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setProductToDelete(product)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-400 hover:bg-[#3D271D] transition-colors"
                          title="Delete Product"
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
      </div>

      {/* Product Add/Edit Form Modal */}
      {isFormOpen && (
        <AdminProductForm
          product={editingProduct}
          onClose={() => setIsFormOpen(false)}
          onSaved={() => {
            setIsFormOpen(false);
            fetchAdminProducts();
            refreshData();
            if (onProductChanged) onProductChanged();
          }}
        />
      )}

      {/* Delete Confirmation Modal matching Section 17 */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#231610] rounded-2xl max-w-sm w-full p-6 text-center border border-[#3D271D] shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-800 text-red-400 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              Delete Product?
            </h3>
            <p className="text-xs text-stone-400 mb-6">
              Are you sure you want to permanently delete <strong>{productToDelete.name}</strong>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 bg-[#170D09] hover:bg-[#3D271D] text-stone-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
