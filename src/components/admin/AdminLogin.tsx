import React, { useState } from 'react';
import { Lock, User, ShieldCheck, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext.js';
import { useStore } from '../../context/StoreContext.js';

export const AdminLogin: React.FC = () => {
  const { login } = useAdminAuth();
  const { settings, setCurrentView } = useStore();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed. Please check credentials.');
      }

      login(data.token, data.user);
    } catch (err: any) {
      setError(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#170D09] text-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-[#231610] rounded-3xl p-8 border border-[#3D271D] shadow-2xl relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#9DB08E]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#F7C5AB]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center mb-8 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-[#3D271D] border border-[#553C2F] flex items-center justify-center mx-auto mb-3 text-[#9DB08E] shadow-sm">
            <Lock className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-display font-extrabold text-white tracking-tight">
            {settings.brand_name || 'WearDay'} Admin
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Secure administrative control & affiliate tracking center
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-10 pr-4 py-2.5 bg-[#170D09] border border-[#3D271D] focus:border-[#9DB08E] text-sm text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[#9DB08E] transition-all"
              />
              <User className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-[#170D09] border border-[#3D271D] focus:border-[#9DB08E] text-sm text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[#9DB08E] transition-all"
              />
              <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Demo Credentials Hint */}
          <div className="p-3 bg-[#170D09]/80 rounded-xl border border-[#3D271D] text-[11px] text-stone-400 flex items-center justify-between">
            <div>
              <span className="text-stone-300 font-semibold">Default Dev Login:</span>
              <span className="ml-1 text-[#9DB08E]">admin / password123</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setUsername('admin');
                setPassword('password123');
              }}
              className="text-[#F7C5AB] hover:underline font-semibold"
            >
              Autofill
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-[#9DB08E] hover:bg-[#809770] text-[#170D09] font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#3D271D] flex items-center justify-between text-xs text-stone-400">
          <button
            onClick={() => setCurrentView('home')}
            className="hover:text-white transition-colors"
          >
            ← Back to Storefront
          </button>
          <div className="flex items-center gap-1 text-[#9DB08E]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PBKDF2 Secured</span>
          </div>
        </div>
      </div>
    </div>
  );
};
