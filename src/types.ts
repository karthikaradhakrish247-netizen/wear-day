export interface Product {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  additional_images: string[];
  short_description: string;
  full_description: string;
  price?: number;
  original_price?: number;
  discount_percentage?: number;
  currency: string;
  category_id: string;
  category_name?: string;
  amazon_affiliate_url: string;
  featured: boolean;
  status: 'active' | 'inactive';
  click_count: number;
  created_at: string;
  updated_at: string;
  colors?: { name: string; hex: string }[];
  gender?: 'men' | 'women' | 'unisex' | 'all';
  rating?: number;
  reviews_count?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  description: string;
  status: 'active' | 'inactive';
  display_order: number;
  product_count?: number;
  created_at: string;
}

export interface HeroSlide {
  id: string;
  image_url: string;
  title: string;
  description: string;
  cta_text: string;
  cta_url: string;
  display_order: number;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface AffiliateClick {
  id: string;
  product_id: string;
  product_name: string;
  product_slug: string;
  clicked_at: string;
  date_str: string;
  referrer?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface SiteSettings {
  brand_name: string;
  logo_url: string;
  favicon_url?: string;
  website_description: string;
  contact_email: string;
  contact_phone: string;
  social_links: {
    instagram: string;
    twitter: string;
    facebook: string;
    pinterest: string;
  };
  footer_text: string;
  seo_title: string;
  seo_description: string;
  amazon_affiliate_tag: string;
  currency: string;
  currency_symbol: string;
  free_shipping_threshold: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}
