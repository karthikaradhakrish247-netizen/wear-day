import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, Category, HeroSlide, SiteSettings, CartItem } from '../types.js';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  heroSlides: HeroSlide[];
  settings: SiteSettings;
  loading: boolean;
  selectedCategory: string | null;
  setSelectedCategory: (catId: string | null) => void;
  selectedGender: 'all' | 'men' | 'women' | 'unisex';
  setSelectedGender: (gender: 'all' | 'men' | 'women' | 'unisex') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeProductModal: Product | null;
  setActiveProductModal: (prod: Product | null) => void;
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartTotal: number;
  cartCount: number;
  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  // Lookbook modal
  activeLookbook: { title: string; subtitle: string; description: string; items: Product[] } | null;
  setActiveLookbook: (lb: { title: string; subtitle: string; description: string; items: Product[] } | null) => void;
  // Affiliate redirect helper
  trackAndGo: (product: Product) => void;
  isRedirecting: boolean;
  redirectTarget: { url: string; productName: string } | null;
  setRedirectTarget: (target: { url: string; productName: string } | null) => void;
  refreshData: () => Promise<void>;
  // Active View / Page
  currentView: 'home' | 'shop' | 'about' | 'contact' | 'admin';
  setCurrentView: (view: 'home' | 'shop' | 'about' | 'contact' | 'admin') => void;
  // Background theme mode for Pista, Chocolate, Peach palette
  bgTheme: 'palette' | 'pista' | 'peach' | 'chocolate';
  setBgTheme: (theme: 'palette' | 'pista' | 'peach' | 'chocolate') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const DEFAULT_SETTINGS: SiteSettings = {
  brand_name: 'WearDay',
  logo_url: '',
  website_description: 'Practical pieces. Real comfort. For every part of your day.',
  contact_email: 'hello@wearday.store',
  contact_phone: '+1 (800) 458-9273',
  social_links: {
    instagram: 'https://instagram.com/wearday',
    twitter: 'https://twitter.com/wearday',
    facebook: 'https://facebook.com/wearday',
    pinterest: 'https://pinterest.com/wearday'
  },
  footer_text: '© 2026 WearDay. As an Amazon Associate we earn from qualifying purchases.',
  seo_title: 'WearDay — Everyday Looks. Made Effortless.',
  seo_description: 'Curated everyday essentials, modern outfits, and premium streetwear.',
  amazon_affiliate_tag: 'weardayaff-20',
  currency: 'USD',
  currency_symbol: '$',
  free_shipping_threshold: 50
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<'all' | 'men' | 'women' | 'unisex'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [activeLookbook, setActiveLookbook] = useState<{ title: string; subtitle: string; description: string; items: Product[] } | null>(null);

  const [currentView, setCurrentView] = useState<'home' | 'shop' | 'about' | 'contact' | 'admin'>('home');
  const [bgTheme, setBgTheme] = useState<'palette' | 'pista' | 'peach' | 'chocolate'>(() => {
    try {
      const saved = localStorage.getItem('wearday_bg_theme');
      return (saved as any) || 'palette';
    } catch {
      return 'palette';
    }
  });

  useEffect(() => {
    localStorage.setItem('wearday_bg_theme', bgTheme);
  }, [bgTheme]);

  // Cart state persisted to localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('wearday_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wishlist state persisted to localStorage
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('wearday_wishlist');
      return saved ? JSON.parse(saved) : ['prod-1', 'prod-7'];
    } catch {
      return ['prod-1', 'prod-7'];
    }
  });
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Affiliate redirect state
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectTarget, setRedirectTarget] = useState<{ url: string; productName: string } | null>(null);

  useEffect(() => {
    localStorage.setItem('wearday_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wearday_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const refreshData = async () => {
    try {
      const [prodRes, catRes, slidesRes, setRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
        fetch('/api/hero-slides'),
        fetch('/api/settings')
      ]);

      if (prodRes.ok) {
        const data = await prodRes.json();
        setProducts(data.products || []);
      }
      if (catRes.ok) {
        const data = await catRes.json();
        setCategories(data.categories || []);
      }
      if (slidesRes.ok) {
        const data = await slidesRes.json();
        setHeroSlides(data.slides || []);
      }
      if (setRes.ok) {
        const data = await setRes.json();
        if (data.settings) setSettings(data.settings);
      }
    } catch (err) {
      console.error('Failed to load store data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addToCart = (product: Product, quantity = 1, color?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.selectedColor === color);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id && item.selectedColor === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedColor: color || product.colors?.[0]?.name }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const trackAndGo = async (product: Product) => {
    setIsRedirecting(true);
    let targetUrl = product.amazon_affiliate_url;

    try {
      const res = await fetch(`/api/track-click/${product.slug || product.id}`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.redirect_url) targetUrl = data.redirect_url;
        // Optimistically update product click count locally
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, click_count: (p.click_count || 0) + 1 } : p));
      }
    } catch (err) {
      console.error('Click tracking error:', err);
    }

    setRedirectTarget({ url: targetUrl, productName: product.name });
    setIsRedirecting(true);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        heroSlides,
        settings,
        loading,
        selectedCategory,
        setSelectedCategory,
        selectedGender,
        setSelectedGender,
        searchQuery,
        setSearchQuery,
        activeProductModal,
        setActiveProductModal,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartTotal,
        cartCount,
        wishlist,
        toggleWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
        activeLookbook,
        setActiveLookbook,
        trackAndGo,
        isRedirecting,
        redirectTarget,
        setRedirectTarget,
        refreshData,
        currentView,
        setCurrentView,
        bgTheme,
        setBgTheme
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
