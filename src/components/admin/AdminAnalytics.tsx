import React, { useState, useEffect } from 'react';
import { MousePointerClick, Calendar, TrendingUp, Search, ExternalLink, Filter, Clock } from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext.js';

interface AnalyticsPayload {
  totalClicks: number;
  todayClicks: number;
  yesterdayClicks: number;
  thisWeekClicks: number;
  thisMonthClicks: number;
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

export const AdminAnalytics: React.FC = () => {
  const { token } = useAdminAuth();
  const [data, setData] = useState<AnalyticsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [tableSearch, setTableSearch] = useState('');
  const [timePeriod, setTimePeriod] = useState<'all' | '30d' | '7d'>('all');

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/admin/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [token]);

  if (loading) {
    return (
      <div className="p-12 text-center text-stone-400">
        <div className="w-8 h-8 border-2 border-[#9DB08E] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs">Aggregating Amazon affiliate click stream telemetry...</p>
      </div>
    );
  }

  const filteredProducts = data?.topProducts.filter(p =>
    p.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
    p.slug.toLowerCase().includes(tableSearch.toLowerCase())
  ) || [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
          Affiliate Performance & Click Tracking
        </h2>
        <p className="text-xs text-stone-400 mt-0.5">
          Real-time metrics, conversion trends, and verified click log to Amazon
        </p>
      </div>

      {/* Top 4 KPI Cards matching Section 21 of Master Prompt */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#231610] p-5 rounded-2xl border border-[#3D271D]">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
            <span>Total Clicks</span>
            <MousePointerClick className="w-4 h-4 text-[#9DB08E]" />
          </div>
          <p className="text-3xl font-extrabold text-white tabular-nums tracking-tight">
            {data?.totalClicks || 0}
          </p>
          <p className="text-[11px] text-stone-500 mt-1">All-time lifetime tracking</p>
        </div>

        <div className="bg-[#231610] p-5 rounded-2xl border border-[#3D271D]">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
            <span>Today's Clicks</span>
            <Calendar className="w-4 h-4 text-[#F7C5AB]" />
          </div>
          <p className="text-3xl font-extrabold text-white tabular-nums tracking-tight">
            {data?.todayClicks || 0}
          </p>
          <p className="text-[11px] text-stone-500 mt-1">
            vs {data?.yesterdayClicks || 0} yesterday
          </p>
        </div>

        <div className="bg-[#231610] p-5 rounded-2xl border border-[#3D271D]">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
            <span>This Week</span>
            <TrendingUp className="w-4 h-4 text-[#9DB08E]" />
          </div>
          <p className="text-3xl font-extrabold text-white tabular-nums tracking-tight">
            {data?.thisWeekClicks || 0}
          </p>
          <p className="text-[11px] text-stone-500 mt-1">Last 7 calendar days</p>
        </div>

        <div className="bg-[#231610] p-5 rounded-2xl border border-[#3D271D]">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
            <span>This Month</span>
            <Calendar className="w-4 h-4 text-[#F2A782]" />
          </div>
          <p className="text-3xl font-extrabold text-white tabular-nums tracking-tight">
            {data?.thisMonthClicks || 0}
          </p>
          <p className="text-[11px] text-stone-500 mt-1">Last 30 calendar days</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Clicks Over Time Line/Bar Chart */}
        <div className="lg:col-span-8 bg-[#231610] p-6 rounded-2xl border border-[#3D271D]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#9DB08E]" />
                <span>Clicks Over Time</span>
              </h3>
              <p className="text-[11px] text-stone-400 mt-0.5">Track daily visitor traffic to Amazon storefronts</p>
            </div>
            <span className="text-[11px] text-stone-400 bg-[#170D09] px-2.5 py-1 rounded-lg border border-[#3D271D]">
              Past 14 Days
            </span>
          </div>

          <div className="h-56 flex items-end justify-between gap-2 pt-6">
            {data?.timeline.map((item, idx) => {
              const maxVal = Math.max(1, ...data.timeline.map(t => t.count));
              const heightPercent = Math.max(8, Math.round((item.count / maxVal) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[10px] px-2 py-0.5 rounded pointer-events-none whitespace-nowrap z-20">
                    {item.date}: {item.count} clicks
                  </div>

                  <div
                    className="w-full bg-gradient-to-t from-[#3D271D] to-[#9DB08E] group-hover:to-white rounded-t transition-all duration-300"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[9px] text-stone-500 truncate w-full text-center">
                    {item.date.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Products Bar Breakdown */}
        <div className="lg:col-span-4 bg-[#231610] p-6 rounded-2xl border border-[#3D271D] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Top Clicked Breakdown</h3>
            <div className="space-y-3.5">
              {data?.topProducts.slice(0, 5).map((prod, i) => {
                const maxClicks = Math.max(1, data.topProducts[0]?.click_count || 1);
                const percent = Math.round((prod.click_count / maxClicks) * 100);
                return (
                  <div key={prod.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-stone-300 font-semibold truncate max-w-[170px]">
                        {i + 1}. {prod.name}
                      </span>
                      <span className="text-[#9DB08E] font-bold tabular-nums">
                        {prod.click_count}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#170D09] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#9DB08E] rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#3D271D] text-[11px] text-stone-400 mt-4">
            Aggregated across all affiliate redirect pathways.
          </div>
        </div>
      </div>

      {/* Analytics Product Table matching Section 9 & 21 */}
      <div className="bg-[#231610] rounded-2xl border border-[#3D271D] p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-white">
            Product Affiliate Click Leaderboard
          </h3>

          <div className="relative min-w-[240px]">
            <input
              type="text"
              placeholder="Filter products..."
              value={tableSearch}
              onChange={e => setTableSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#170D09] border border-[#3D271D] text-xs text-white rounded-xl focus:outline-none focus:border-[#9DB08E]"
            />
            <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-[#170D09] text-stone-400 font-semibold border-b border-[#3D271D] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4 text-right">Total Clicks</th>
                <th className="py-3 px-4 text-right">Last Clicked</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3D271D]">
              {filteredProducts.map(prod => (
                <tr key={prod.id} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={prod.image_url}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-lg object-cover bg-stone-900 border border-white/5"
                    />
                    <span className="font-semibold text-white">{prod.name}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-stone-400">
                    /go/{prod.slug}
                  </td>
                  <td className="py-3 px-4 tabular-nums">
                    ${prod.price?.toFixed(2) || '—'}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-[#9DB08E] tabular-nums text-sm">
                    {prod.click_count}
                  </td>
                  <td className="py-3 px-4 text-right text-stone-400 tabular-nums">
                    {prod.last_clicked ? new Date(prod.last_clicked).toLocaleString() : 'Recent'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <a
                      href={`/go/${prod.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#9DB08E] hover:underline text-xs"
                    >
                      <span>Redirect</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-time Click Log Stream */}
      <div className="bg-[#231610] rounded-2xl border border-[#3D271D] p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#F7C5AB]" />
            <span>Recent Click Stream Log</span>
          </h3>
          <span className="text-xs text-stone-400">Latest 30 recorded clicks</span>
        </div>

        <div className="overflow-x-auto max-h-60 overflow-y-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-[#170D09] text-stone-400 text-[10px] uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Product</th>
                <th className="py-2.5 px-3">Target Slug</th>
                <th className="py-2.5 px-3 text-right">Referrer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3D271D]">
              {data?.recentClicks.map(clk => (
                <tr key={clk.id} className="hover:bg-white/[0.02]">
                  <td className="py-2 px-3 text-stone-400 font-mono text-[11px] whitespace-nowrap">
                    {new Date(clk.clicked_at).toLocaleString()}
                  </td>
                  <td className="py-2 px-3 font-medium text-white">{clk.product_name}</td>
                  <td className="py-2 px-3 text-stone-400 font-mono text-[11px]">/go/{clk.product_slug}</td>
                  <td className="py-2 px-3 text-right text-stone-500 truncate max-w-[160px]">{clk.referrer || 'direct'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
