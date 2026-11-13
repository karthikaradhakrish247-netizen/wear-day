import React, { useState, useEffect } from 'react';
import { Mail, Trash2, CheckCircle2, Clock, Phone, User, Eye, X } from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext.js';
import type { ContactMessage } from '../../types.js';

export const AdminMessages: React.FC = () => {
  const { token } = useAdminAuth();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMessage, setActiveMessage] = useState<ContactMessage | null>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/admin/messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setMessages(json.messages || []);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [token]);

  const toggleRead = async (msg: ContactMessage) => {
    const newStatus = !msg.is_read;
    try {
      const res = await fetch(`/api/admin/messages/${msg.id}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ is_read: newStatus })
      });
      if (res.ok) {
        fetchMessages();
      }
    } catch (err) {
      console.error('Error updating message status:', err);
    }
  };

  const handleDelete = async (msgId: string) => {
    try {
      const res = await fetch(`/api/admin/messages/${msgId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchMessages();
        if (activeMessage?.id === msgId) setActiveMessage(null);
      }
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
            Contact Messages & Customer Inquiries
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Messages submitted through the public Contact page form
          </p>
        </div>

        <span className="text-xs bg-[#170D09] text-[#9DB08E] border border-[#3D271D] px-3 py-1.5 rounded-xl font-bold">
          {messages.filter(m => !m.is_read).length} Unread
        </span>
      </div>

      <div className="bg-[#231610] rounded-2xl border border-[#3D271D] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-[#170D09] text-stone-400 font-semibold border-b border-[#3D271D] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Sender Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Message Preview</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3D271D]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-500">
                    Loading messages...
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-500">
                    No contact submissions recorded yet.
                  </td>
                </tr>
              ) : (
                messages.map(msg => (
                  <tr
                    key={msg.id}
                    className={`hover:bg-white/[0.02] transition-colors ${
                      !msg.is_read ? 'bg-[#9DB08E]/5 font-medium text-white' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleRead(msg)}
                        className={`p-1 rounded-md text-[10px] font-bold ${
                          msg.is_read
                            ? 'text-stone-500 hover:text-stone-300'
                            : 'text-[#9DB08E] bg-[#9DB08E]/20'
                        }`}
                        title={msg.is_read ? 'Mark as Unread' : 'Mark as Read'}
                      >
                        {msg.is_read ? 'Read' : '● New'}
                      </button>
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">{msg.name}</td>
                    <td className="py-3 px-4 text-stone-400">{msg.email}</td>
                    <td className="py-3 px-4 text-stone-400">{msg.phone || '—'}</td>
                    <td className="py-3 px-4 max-w-xs truncate text-stone-300">
                      {msg.message}
                    </td>
                    <td className="py-3 px-4 text-stone-400 text-[11px] whitespace-nowrap">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setActiveMessage(msg);
                            if (!msg.is_read) toggleRead(msg);
                          }}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-[#3D271D]"
                          title="View Message"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(msg.id)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-400 hover:bg-[#3D271D]"
                          title="Delete Message"
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

      {/* Message View Modal */}
      {activeMessage && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#231610] rounded-2xl max-w-md w-full p-6 text-white border border-[#3D271D] shadow-2xl relative">
            <button
              onClick={() => setActiveMessage(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="text-[10px] uppercase font-bold text-[#9DB08E] tracking-wider">
              Message from {activeMessage.name}
            </span>
            <h3 className="text-base font-bold text-white mt-1 mb-4">
              Inquiry Details
            </h3>

            <div className="space-y-3 bg-[#170D09] p-4 rounded-xl border border-[#3D271D] text-xs mb-4">
              <div>
                <span className="text-stone-500">Email:</span>{' '}
                <a href={`mailto:${activeMessage.email}`} className="text-[#9DB08E] underline">
                  {activeMessage.email}
                </a>
              </div>
              {activeMessage.phone && (
                <div>
                  <span className="text-stone-500">Phone:</span>{' '}
                  <span className="text-white">{activeMessage.phone}</span>
                </div>
              )}
              <div>
                <span className="text-stone-500">Submitted:</span>{' '}
                <span className="text-stone-300">
                  {new Date(activeMessage.created_at).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="bg-[#170D09] p-4 rounded-xl border border-[#3D271D] text-xs text-stone-200 leading-relaxed max-h-60 overflow-y-auto mb-5">
              {activeMessage.message}
            </div>

            <div className="flex items-center justify-between">
              <a
                href={`mailto:${activeMessage.email}?subject=Re: Your WearDay Inquiry`}
                className="px-4 py-2 bg-[#9DB08E] hover:bg-[#809770] text-[#170D09] text-xs font-bold rounded-xl transition-all"
              >
                Reply via Email
              </a>
              <button
                onClick={() => setActiveMessage(null)}
                className="px-4 py-2 bg-[#170D09] text-stone-300 hover:text-white text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
