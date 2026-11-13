import React, { useState } from 'react';
import { Lock, Key, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext.js';

export const AdminProfile: React.FC = () => {
  const { token, adminUser } = useAdminAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password confirmation does not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update password.');
      }

      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Error updating password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
          Admin Profile & Security
        </h2>
        <p className="text-xs text-stone-400 mt-0.5">
          Manage your credentials and encryption settings
        </p>
      </div>

      {/* Account Info Card */}
      <div className="bg-[#231610] p-6 rounded-2xl border border-[#3D271D]">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#9DB08E]" />
          <span>Active Admin Session</span>
        </h3>

        <div className="space-y-2 text-xs text-stone-300">
          <p>
            <span className="text-stone-500">Username:</span>{' '}
            <strong className="text-white font-mono">{adminUser?.username || 'admin'}</strong>
          </p>
          <p>
            <span className="text-stone-500">Last Login:</span>{' '}
            <span>{adminUser?.last_login ? new Date(adminUser.last_login).toLocaleString() : 'Active now'}</span>
          </p>
          <p>
            <span className="text-stone-500">Encryption Method:</span>{' '}
            <span className="text-[#9DB08E]">PBKDF2-SHA512 (10,000 rounds with random salt)</span>
          </p>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="bg-[#231610] p-6 rounded-2xl border border-[#3D271D]">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Key className="w-4 h-4 text-[#F7C5AB]" />
          <span>Change Admin Password</span>
        </h3>

        {success && (
          <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Password successfully updated and securely hashed!</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
          <div>
            <label className="block text-stone-300 font-semibold mb-1">
              Current Password *
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 bg-[#170D09] border border-[#3D271D] focus:border-[#9DB08E] text-white rounded-xl focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-stone-300 font-semibold mb-1">
              New Password (min 6 characters) *
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 bg-[#170D09] border border-[#3D271D] focus:border-[#9DB08E] text-white rounded-xl focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-stone-300 font-semibold mb-1">
              Confirm New Password *
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 bg-[#170D09] border border-[#3D271D] focus:border-[#9DB08E] text-white rounded-xl focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#9DB08E] hover:bg-[#809770] text-[#170D09] font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{loading ? 'Updating Password...' : 'Save New Password'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
