import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  Image as ImageIcon,
  BarChart3,
  Mail,
  Settings,
  User,
  LogOut,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext.js';
import { useStore } from '../../context/StoreContext.js';
import { AdminDashboardOverview } from './AdminDashboardOverview.js';
import { AdminProducts } from './AdminProducts.js';
import { AdminCategories } from './AdminCategories.js';
import { AdminHeroSlides } from './AdminHeroSlides.js';
import { AdminAnalytics } from './AdminAnalytics.js';
import { AdminMessages } from './AdminMessages.js';
import { AdminSettings } from './AdminSettings.js';
import { AdminProfile } from './AdminProfile.js';
import { AdminProductForm } from './AdminProductForm.js';

export const AdminLayout: React.FC = () => {
  const { logout, adminUser } = useAdminAuth();
  const { setCurrentView, settings, refreshData } = useStore();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'products', label: 'Products', icon: <Package className="w-4 h-4" /> },
    { id: 'categories', label: 'Categories', icon: <Layers className="w-4 h-4" /> },
    { id: 'hero_slides', label: 'Hero Slides', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'analytics', label: 'Click Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'messages', label: 'Contact Messages', icon: <Mail className="w-4 h-4" /> },
    { id: 'settings', label: 'Site Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'profile', label: 'Admin Security', icon: <User className="w-4 h-4" /> }
  ];

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <AdminDashboardOverview
            setActiveTab={setActiveTab}
            openNewProductForm={() => setIsNewProductOpen(true)}
          />
        );
      case 'products':
        return <AdminProducts onProductChanged={() => refreshData()} />;
      case 'categories':
        return <AdminCategories />;
      case 'hero_slides':
        return <AdminHeroSlides />;
      case 'analytics':
        return <AdminAnalytics />;
      case 'messages':
        return <AdminMessages />;
      case 'settings':
        return <AdminSettings />;
      case 'profile':
        return <AdminProfile />;
      default:
        return (
          <AdminDashboardOverview
            setActiveTab={setActiveTab}
            openNewProductForm={() => setIsNewProductOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#170D09] text-white flex">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-[#231610] border-r border-[#3D271D] p-5 flex flex-col justify-between transition-transform duration-200 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Wordmark & Tag */}
          <div className="flex items-center justify-between pb-6 border-b border-[#3D271D] mb-6">
            <div className="flex items-center gap-2">
              <div className="font-display font-extrabold text-xl text-white tracking-tight flex items-center">
                <span>{settings.brand_name || 'WearDay'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#9DB08E] ml-1 inline-block" />
              </div>
              <span className="text-[10px] bg-[#3D271D] text-[#9DB08E] px-2 py-0.5 rounded-full font-bold uppercase">
                Admin
              </span>
            </div>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#9DB08E] text-[#170D09] shadow-sm font-bold'
                      : 'text-stone-300 hover:text-white hover:bg-[#3D271D]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions: View Storefront & Logout */}
        <div className="pt-6 border-t border-[#3D271D] space-y-2">
          <button
            onClick={() => setCurrentView('home')}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-stone-300 hover:text-white hover:bg-[#3D271D] transition-colors"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-[#9DB08E]" />
              <span>Live Storefront</span>
            </div>
            <span className="text-[10px] text-stone-500">Preview</span>
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs text-stone-400 hover:text-red-400 hover:bg-[#3D271D] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>

          <div className="px-3.5 pt-2 text-[10px] text-stone-500">
            Logged in as <strong className="text-stone-300">{adminUser?.username || 'admin'}</strong>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-[#170D09]/90 backdrop-blur-md border-b border-[#3D271D] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 text-stone-400 hover:text-white rounded-lg"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500">Admin</span>
              <span className="text-stone-600">/</span>
              <span className="text-white font-semibold capitalize">
                {navItems.find(n => n.id === activeTab)?.label || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('home')}
              className="text-xs font-semibold text-[#9DB08E] hover:underline flex items-center gap-1.5"
            >
              <span>Back to Customer Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          {renderActiveView()}
        </div>
      </main>

      {/* Global Add Product Modal Shortcut */}
      {isNewProductOpen && (
        <AdminProductForm
          product={null}
          onClose={() => setIsNewProductOpen(false)}
          onSaved={() => {
            setIsNewProductOpen(false);
            refreshData();
            setActiveTab('products');
          }}
        />
      )}
    </div>
  );
};
