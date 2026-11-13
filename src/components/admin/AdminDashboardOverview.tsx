import React, { useState, useEffect } from 'react';
import { Package, MousePointerClick, Calendar, LayoutGrid, Mail, Star, TrendingUp, ExternalLink, ArrowRight, Plus } from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext.js';
import { useStore } from '../../context/StoreContext.js';

interface AnalyticsData {
  totalClicks: number;
  todayClicks: number;
  yesterdayClicks: number;
  thisWeekClicks: number;
  thisMonthClicks: number;
  totalProducts: number;
  totalCategories: number;
  unreadMessages: number;
  featuredCount: number;
  timeline: { date: string; count: number }[];
  topProducts: {
    id: string;
    name: string;
    slug: string;
    image_url: string;
    price?: number;
    click_count: number;
    last_clicked?: string;
  }[];
  recentClicks: {
    id: string;
    product_name: string;
    product_slug: string;
    clicked_at: string;
    referrer?: string;
  }[];
}

interface OverviewProps {
  setActiveTab: (tab: string) => void;
  openNewProductForm: () => void;
}

export const AdminDashboardOverview: React.FC<OverviewProps> = ({ setActiveTab, openNewProductForm }) => {
  const { token } = useAdminAuth();
  const { settings } = useStore();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/analytics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) {
    return (
      <div className="p-8 text-center text-stone-400">
        <div className="w-8 h-8 border-2 border-[#9DB08E] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs">Loading analytics and catalog telemetry...</p>
      </div>
    );
  }

  const kpis = [
    {
      title: 'Total Active Products',
      value: data?.totalProducts || 0,
      icon: <Package className="w-5 h-5 text-[#9DB08E]" />,
      action: () => setActiveTab('products'),
      desc: `${data?.featuredCount || 0} featured on storefront`
    },
    {
      title: 'Total Affiliate Clicks',
      value: data?.totalClicks || 0,
      icon: <MousePointerClick className="w-5 h-5 text-[#F7C5AB]" />,
      action: () => setActiveTab('analytics'),
      desc: 'All-time tracked clicks to Amazon'
    },
    {
      title: "Today's Clicks",
      value: data?.todayClicks || 0,
      icon: <Calendar className="w-5 h-5 text-[#9DB08E]" />,
      action: () => setActiveTab('analytics'),
      desc: `${data?.yesterdayClicks || 0} clicks yesterday`
    },
    {
      title: 'Product Categories',
      value: data?.totalCategories || 0,
      icon: <LayoutGrid className="w-5 h-5 text-[#D5C2B4]" />,
      action: () => setActiveTab('categories'),
      desc: 'Active wardrobe taxonomy'
    },
    {
      title: 'Unread Messages',
      value: data?.unreadMessages || 0,
      icon: <Mail className="w-5 h-5 text-[#E07A4B]" />,
      action: () => setActiveTab('messages'),
      desc: 'Customer contact submissions'
    },
    {
      title: 'Featured Essentials',
      value: data?.featuredCount || 0,
      icon: <Star className="w-5 h-5 text-[#F2A782]" />,
      action: () => setActiveTab('products'),
      desc: 'Spotlighted on homepage'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#231610] p-6 rounded-2xl border border-[#3D271D]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
            Overview & Affiliate Health
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Tracking tag: <span className="text-[#9DB08E] font-semibold">{settings.amazon_affiliate_tag || 'weardayaff-20'}</span> · Currency: <span className="text-white font-semibold">{settings.currency || 'USD'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openNewProductForm}
            className="px-4 py-2 bg-[#9DB08E] hover:bg-[#809770] text-[#170D09] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
          <button
            onClick={() => setActiveTab('hero_slides')}
            className="px-4 py-2 bg-[#3D271D] hover:bg-[#553C2F] text-white text-xs font-semibold rounded-xl border border-white/10 transition-colors"
          >
            Manage Hero Slides
          </button>
        </div>
      </div>

      {/* 6 KPI Cards matching Section 16 of Master Prompt */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, index) => (
          <div
            key={index}
            onClick={kpi.action}
            className="bg-[#231610] p-4 rounded-2xl border border-[#3D271D] hover:border-[#9DB08E] transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 rounded-xl bg-[#170D09] border border-[#3D271D]">
                {kpi.icon}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-white transition-colors" />
            </div>

            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums tracking-tight">
                {kpi.value}
              </p>
              <p className="text-xs font-semibold text-stone-300 mt-1 line-clamp-1">{kpi.title}</p>
              <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">{kpi.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Rankings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Clicks Timeline Chart */}
        <div className="lg:col-span-7 bg-[#231610] p-6 rounded-2xl border border-[#3D271D]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#9DB08E]" />
                <span>Affiliate Clicks Over Time (14 Days)</span>
              </h3>
              <p className="text-[11px] text-stone-400 mt-0.5">Daily visitor redirections to Amazon storefront</p>
            </div>
            <button
              onClick={() => setActiveTab('analytics')}
              className="text-xs font-semibold text-[#9DB08E] hover:underline"
            >
              Full Analytics →
            </button>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-48 flex items-end justify-between gap-1 sm:gap-2 pt-6">
            {data?.timeline.map((item, idx) => {
              const maxVal = Math.max(1, ...data.timeline.map(t => t.count));
              const heightPercent = Math.max(8, Math.round((item.count / maxVal) * 100));
              const dayLabel = item.date.slice(5); // MM-DD
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                  {/* Tooltip */}
                  <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[10px] px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap z-20">
                    {item.count} clicks
                  </div>

                  <div
                    className="w-full bg-[#3D271D] group-hover:bg-[#9DB08E] rounded-t transition-all duration-300"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[9px] text-stone-500 truncate w-full text-center">
                    {dayLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Clicked Products */}
        <div className="lg:col-span-5 bg-[#231610] p-6 rounded-2xl border border-[#3D271D] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-[#F7C5AB]" />
                <span>Top Performing Products</span>
              </h3>
              <button
                onClick={() => setActiveTab('products')}
                className="text-xs text-stone-400 hover:text-white"
              >
                View all
              </button>
            </div>

            <div className="divide-y divide-[#3D271D]">
              {data?.topProducts.slice(0, 5).map(prod => (
                <div key={prod.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={prod.image_url}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover bg-stone-900 shrink-0 border border-white/5"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{prod.name}</p>
                      <p className="text-[11px] text-stone-400">${prod.price?.toFixed(2) || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-[#9DB08E] tabular-nums">
                      {prod.click_count} clicks
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#3D271D] mt-2">
            <a
              href="/go/relaxed-fit-tee"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 bg-[#170D09] hover:bg-[#3D271D] text-stone-300 hover:text-white text-xs font-medium rounded-xl border border-[#3D271D] transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Test Affiliate Redirect Route (/go/:slug)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
