import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext.js';
import { AdminAuthProvider, useAdminAuth } from './components/admin/AdminAuthContext.js';
import { Header } from './components/Header.js';
import { HeroSlider } from './components/HeroSlider.js';
import { GenderDepartmentShowcase } from './components/GenderDepartmentShowcase.js';
import { CategoryBar } from './components/CategoryBar.js';
import { OutfitBuilder } from './components/OutfitBuilder.js';
import { NewArrivals } from './components/NewArrivals.js';
import { StylingGuides } from './components/StylingGuides.js';
import { CustomerFavoritesTrust } from './components/CustomerFavoritesTrust.js';
import { RecommendedGrid } from './components/RecommendedGrid.js';
import { Studio3DShowcase } from './components/Studio3DShowcase.js';
import { ShopPage } from './components/ShopPage.js';
import { ContactSection } from './components/ContactSection.js';
import { Footer } from './components/Footer.js';
import { CartDrawer } from './components/CartDrawer.js';
import { WishlistDrawer } from './components/WishlistDrawer.js';
import { ProductDetailModal } from './components/ProductDetailModal.js';
import { AffiliateRedirectModal } from './components/AffiliateRedirectModal.js';
import { MobileBottomNav } from './components/MobileBottomNav.js';
import { AdminLayout } from './components/admin/AdminLayout.js';
import { AdminLogin } from './components/admin/AdminLogin.js';

const MainApp: React.FC = () => {
  const { currentView, loading, bgTheme } = useStore();
  const { isAuthenticated, checkingAuth } = useAdminAuth();

  // If viewing admin route
  if (currentView === 'admin') {
    if (checkingAuth) {
      return (
        <div className="min-h-screen bg-[#170D09] flex items-center justify-center text-[#9DB08E]">
          <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }
    return isAuthenticated ? <AdminLayout /> : <AdminLogin />;
  }

  const rootBgClass =
    bgTheme === 'chocolate'
      ? 'bg-[#170D09] text-white'
      : bgTheme === 'pista'
      ? 'bg-[#E5EFE2] text-[#2C1B14]'
      : bgTheme === 'peach'
      ? 'bg-[#FDF2EA] text-[#2C1B14]'
      : 'bg-[#FAF7F2] text-[#2C1B14]';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 selection:bg-[#9DB08E]/30 selection:text-[#2C1B14] ${rootBgClass}`}>
      <Header />

      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HeroSlider />
            <GenderDepartmentShowcase />
            <CategoryBar />
            <OutfitBuilder />
            <NewArrivals />
            <StylingGuides />
            <CustomerFavoritesTrust />
            <RecommendedGrid />
            <Studio3DShowcase />
          </>
        )}

        {currentView === 'shop' && <ShopPage />}

        {currentView === 'contact' && <ContactSection />}
      </main>

      <Footer />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <WishlistDrawer />
      <ProductDetailModal />
      <AffiliateRedirectModal />
      <MobileBottomNav />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AdminAuthProvider>
        <MainApp />
      </AdminAuthProvider>
    </StoreProvider>
  );
}
