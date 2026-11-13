import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { Product, Category, HeroSlide, AffiliateClick, ContactMessage, SiteSettings } from '../src/types.js';

interface AdminAccount {
  id: string;
  username: string;
  password_hash: string;
  salt: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface DatabaseSchema {
  admins: AdminAccount[];
  products: Product[];
  categories: Category[];
  hero_slides: HeroSlide[];
  affiliate_clicks: AffiliateClick[];
  contact_messages: ContactMessage[];
  site_settings: SiteSettings;
  sessions: { token: string; username: string; expires_at: number }[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, generatedSalt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt: generatedSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const check = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(check, 'hex'));
}

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
  seo_description: 'Curated everyday essentials, modern outfits, and premium streetwear with direct affiliate delivery.',
  amazon_affiliate_tag: 'weardayaff-20',
  currency: 'USD',
  currency_symbol: '$',
  free_shipping_threshold: 50
};

function getSeedData(): DatabaseSchema {
  const { hash, salt } = hashPassword('password123');

  const categories: Category[] = [
    {
      id: 'cat-1',
      name: 'T-Shirts',
      slug: 't-shirts',
      image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80',
      description: 'Ultra-soft organic cotton and everyday relaxed tees.',
      status: 'active',
      display_order: 1,
      created_at: new Date(Date.now() - 30 * 86400000).toISOString()
    },
    {
      id: 'cat-2',
      name: 'Shirts',
      slug: 'shirts',
      image_url: '/src/assets/images/product_peach_linen_shirt_1793947616322.jpg',
      description: 'Linen blends, poplins, and breathable tailored overshirts.',
      status: 'active',
      display_order: 2,
      created_at: new Date(Date.now() - 28 * 86400000).toISOString()
    },
    {
      id: 'cat-3',
      name: 'Pants',
      slug: 'pants',
      image_url: '/src/assets/images/product_chocolate_chino_1793947615594.jpg',
      description: 'Easy stretch chinos and relaxed tailored trousers.',
      status: 'active',
      display_order: 3,
      created_at: new Date(Date.now() - 25 * 86400000).toISOString()
    },
    {
      id: 'cat-4',
      name: 'Denim',
      slug: 'denim',
      image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=300&q=80',
      description: 'Clean raw denim, vintage washed jeans, and trucker jackets.',
      status: 'active',
      display_order: 4,
      created_at: new Date(Date.now() - 24 * 86400000).toISOString()
    },
    {
      id: 'cat-5',
      name: 'Hoodies',
      slug: 'hoodies',
      image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=300&q=80',
      description: 'Heavyweight loopback fleece and everyday pullover hoodies.',
      status: 'active',
      display_order: 5,
      created_at: new Date(Date.now() - 22 * 86400000).toISOString()
    },
    {
      id: 'cat-6',
      name: 'Jackets',
      slug: 'jackets',
      image_url: '/src/assets/images/product_pista_overshirt_1793947613900.jpg',
      description: 'Field coats, utilitarian overshirts, and lightweight layers.',
      status: 'active',
      display_order: 6,
      created_at: new Date(Date.now() - 20 * 86400000).toISOString()
    },
    {
      id: 'cat-7',
      name: 'Accessories',
      slug: 'accessories',
      image_url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=300&q=80',
      description: 'Cotton canvas totes, minimal caps, and leather goods.',
      status: 'active',
      display_order: 7,
      created_at: new Date(Date.now() - 18 * 86400000).toISOString()
    },
    {
      id: 'cat-8',
      name: 'Shoes',
      slug: 'shoes',
      image_url: '/src/assets/images/product_minimalist_sneakers_1793947616208.jpg',
      description: 'Minimalist low-top leather sneakers and easy daily trainers.',
      status: 'active',
      display_order: 8,
      created_at: new Date(Date.now() - 16 * 86400000).toISOString()
    },
    {
      id: 'cat-9',
      name: 'Dresses',
      slug: 'dresses',
      image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=300&q=80',
      description: 'Effortless knit midi dresses and breezy warm-weather silhouettes.',
      status: 'active',
      display_order: 9,
      created_at: new Date(Date.now() - 15 * 86400000).toISOString()
    }
  ];

  const products: Product[] = [
    {
      id: 'prod-1',
      name: 'Relaxed Fit Tee',
      slug: 'relaxed-fit-tee',
      image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      additional_images: [
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80'
      ],
      short_description: 'Heavyweight organic cotton tee with a comfortable relaxed drape.',
      full_description: 'An absolute daily cornerstone. Spun from 100% combed organic long-staple cotton (240 GSM) that holds its shape wash after wash. Features a reinforced ribbed collar, dropped shoulder seams, and a pre-shrunk finish for that lived-in comfort right out of the box.',
      price: 19.99,
      original_price: 28.00,
      discount_percentage: 29,
      currency: 'USD',
      category_id: 'cat-1',
      category_name: 'T-Shirts',
      amazon_affiliate_url: 'https://www.amazon.com/dp/B08X6V5Q8N/?tag=weardayaff-20',
      featured: true,
      status: 'active',
      click_count: 312,
      created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      gender: 'men',
      rating: 4.8,
      reviews_count: 142,
      colors: [
        { name: 'Oatmeal Sand', hex: '#EDE6DB' },
        { name: 'Heather Grey', hex: '#A8A8A8' },
        { name: 'Classic Black', hex: '#1C1C1C' }
      ]
    },
    {
      id: 'prod-2',
      name: 'Linen Blend Casual Shirt',
      slug: 'linen-blend-shirt',
      image_url: '/src/assets/images/product_peach_linen_shirt_1793947616322.jpg',
      additional_images: [
        'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80'
      ],
      short_description: 'Breezy French linen and soft cotton tailored casual button-down.',
      full_description: 'Woven from 55% breathable Normandy linen and 45% combed cotton, this warm-weather hero breathes effortlessly while resisting excessive creasing. Tailored with mother-of-pearl buttons, a relaxed camp collar, and chest pocket.',
      price: 34.99,
      original_price: 49.00,
      discount_percentage: 29,
      currency: 'USD',
      category_id: 'cat-2',
      category_name: 'Shirts',
      amazon_affiliate_url: 'https://www.amazon.com/dp/B07P9XYZ12/?tag=weardayaff-20',
      featured: true,
      status: 'active',
      click_count: 245,
      created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      gender: 'women',
      rating: 4.9,
      reviews_count: 88,
      colors: [
        { name: 'Natural Sand', hex: '#E6DAC8' },
        { name: 'Cloud White', hex: '#F9F9F9' },
        { name: 'Chambray Sky', hex: '#BFD4E4' }
      ]
    },
    {
      id: 'prod-3',
      name: 'Easy Stretch Chino Pants',
      slug: 'easy-chino-pants',
      image_url: '/src/assets/images/product_chocolate_chino_1793947615594.jpg',
      additional_images: [
        'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80'
      ],
      short_description: 'Tapered straight-leg chinos with all-day 2-way flex.',
      full_description: 'A versatile hybrid between smart office tailoring and weekend comfort. Crafted with 98% cotton twill and 2% elastane for subtle flex, featuring an interior hidden drawstring waistband, deep slant pockets, and double-welt back pockets.',
      price: 39.99,
      original_price: 55.00,
      discount_percentage: 27,
      currency: 'USD',
      category_id: 'cat-3',
      category_name: 'Pants',
      amazon_affiliate_url: 'https://www.amazon.com/dp/B08KL34RT5/?tag=weardayaff-20',
      featured: true,
      status: 'active',
      click_count: 189,
      created_at: new Date(Date.now() - 13 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      gender: 'men',
      rating: 4.7,
      reviews_count: 114,
      colors: [
        { name: 'Khaki Sand', hex: '#C2B280' },
        { name: 'Olive Army', hex: '#556B2F' },
        { name: 'Charcoal Black', hex: '#2A2A2A' }
      ]
    },
    {
      id: 'prod-4',
      name: 'Everyday Loopback Hoodie',
      slug: 'everyday-hoodie',
      image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      additional_images: [],
      short_description: 'Ultra-plush 400 GSM loopback cotton fleece with clean minimal hood.',
      full_description: 'Constructed with double-layered hood without strings for a clean aesthetic. Ribbed side gussets provide natural movement without bagging out.',
      price: 44.99,
      original_price: 65.00,
      discount_percentage: 31,
      currency: 'USD',
      category_id: 'cat-5',
      category_name: 'Hoodies',
      amazon_affiliate_url: 'https://www.amazon.com/dp/B09MN45OP1/?tag=weardayaff-20',
      featured: true,
      status: 'active',
      click_count: 278,
      created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      gender: 'unisex',
      rating: 4.9,
      reviews_count: 204,
      colors: [
        { name: 'Warm Cream', hex: '#FAF6F0' },
        { name: 'Heather Grey', hex: '#9E9E9E' },
        { name: 'Washed Black', hex: '#2A2A2A' }
      ]
    },
    {
      id: 'prod-5',
      name: 'Vintage Wash Denim Jacket',
      slug: 'denim-jacket',
      image_url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
      additional_images: [],
      short_description: 'Authentic 13oz cotton denim trucker jacket with antiqued hardware.',
      full_description: 'A timeless silhouette inspired by mid-century workwear. Cut from 100% durable cotton denim and finished with a stone enzyme wash for soft drape and subtle fading at the seams.',
      price: 59.99,
      original_price: 85.00,
      discount_percentage: 29,
      currency: 'USD',
      category_id: 'cat-6',
      category_name: 'Jackets',
      amazon_affiliate_url: 'https://www.amazon.com/dp/B07T6QRS19/?tag=weardayaff-20',
      featured: true,
      status: 'active',
      click_count: 142,
      created_at: new Date(Date.now() - 11 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      gender: 'women',
      rating: 4.8,
      reviews_count: 95,
      colors: [
        { name: 'Vintage Sky Wash', hex: '#779ECB' },
        { name: 'Washed Charcoal', hex: '#333333' }
      ]
    },
    {
      id: 'prod-6',
      name: 'Classic Utility Overshirt',
      slug: 'classic-utility-overshirt',
      image_url: '/src/assets/images/product_pista_overshirt_1793947613900.jpg',
      additional_images: [],
      short_description: 'Heavyweight organic cotton twill overshirt with dual utility chest pockets.',
      full_description: 'Designed to wear open as a light jacket or buttoned up as a crisp structured shirt. Woven from 280 GSM cotton twill. Finished with corozo nut buttons and twin chest flap pockets.',
      price: 49.99,
      original_price: 72.00,
      discount_percentage: 31,
      currency: 'USD',
      category_id: 'cat-6',
      category_name: 'Jackets',
      amazon_affiliate_url: 'https://www.amazon.com/dp/B085FKL901/?tag=weardayaff-20',
      featured: true,
      status: 'active',
      click_count: 421,
      created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      gender: 'unisex',
      rating: 5.0,
      reviews_count: 167,
      colors: [
        { name: 'Olive Green', hex: '#5B6F55' },
        { name: 'Desert Khaki', hex: '#C2B280' },
        { name: 'Jet Black', hex: '#1C1C1C' }
      ]
    },
    {
      id: 'prod-7',
      name: 'Clean Minimalist Sneakers',
      slug: 'clean-sneakers',
      image_url: '/src/assets/images/product_minimalist_sneakers_1793947616208.jpg',
      additional_images: [
        '/public/assets/aistudio/image_4dafd9e5.png'
      ],
      short_description: 'Buttery full-grain calf leather trainers with peach & pista hand-stitching.',
      full_description: 'The definitive minimal everyday sneaker. Handcrafted with ultra-soft white Italian calfskin leather, vulcanized rubber cupsole, and antimicrobial cork insoles that mold to your foot over time.',
      price: 69.99,
      original_price: 99.00,
      discount_percentage: 29,
      currency: 'USD',
      category_id: 'cat-8',
      category_name: 'Shoes',
      amazon_affiliate_url: 'https://www.amazon.com/dp/B09V3W87K2/?tag=weardayaff-20',
      featured: true,
      status: 'active',
      click_count: 538,
      created_at: new Date(Date.now() - 9 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      gender: 'unisex',
      rating: 4.9,
      reviews_count: 310,
      colors: [
        { name: 'Crisp White', hex: '#FFFFFF' },
        { name: 'Pista / White Accent', hex: '#9DB08E' }
      ]
    },
    {
      id: 'prod-8',
      name: 'Basic Crew Neck Tee',
      slug: 'basic-crew-neck-tee',
      image_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
      additional_images: [],
      short_description: 'Midweight combed cotton crewneck in deep midnight and cocoa.',
      full_description: 'Tailored with a slightly closer fit for easy layering beneath knits or overshirts. 100% Peruvian pima cotton for unmatched softness.',
      price: 17.99,
      original_price: 24.00,
      discount_percentage: 25,
      currency: 'USD',
      category_id: 'cat-1',
      category_name: 'T-Shirts',
      amazon_affiliate_url: 'https://www.amazon.com/dp/B08P012LK8/?tag=weardayaff-20',
      featured: false,
      status: 'active',
      click_count: 112,
      created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      gender: 'men',
      rating: 4.6,
      reviews_count: 54,
      colors: [
        { name: 'Midnight Navy', hex: '#1C2833' },
        { name: 'Dark Cocoa', hex: '#3D271D' },
        { name: 'Optic White', hex: '#FFFFFF' }
      ]
    },
    {
      id: 'prod-9',
      name: 'Slim Fit Everyday Jeans',
      slug: 'slim-fit-jeans',
      image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80',
      additional_images: [],
      short_description: 'Japanese selvedge-inspired stretch denim with clean rinse finish.',
      full_description: 'Engineered with 12.5oz medium-weight cotton denim with 1% elastane for all-day flexibility. Clean dark rinse without distressing for a sharp look from day to night.',
      price: 49.99,
      original_price: 75.00,
      discount_percentage: 33,
      currency: 'USD',
      category_id: 'cat-4',
      category_name: 'Denim',
      amazon_affiliate_url: 'https://www.amazon.com/dp/B07Y8PLKM7/?tag=weardayaff-20',
      featured: false,
      status: 'active',
      click_count: 167,
      created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      gender: 'men',
      rating: 4.7,
      reviews_count: 76,
      colors: [
        { name: 'Dark Indigo Rinse', hex: '#1B263B' },
        { name: 'Medium Wash', hex: '#415A77' }
      ]
    },
    {
      id: 'prod-10',
      name: 'Canvas Heavyweight Tote Bag',
      slug: 'canvas-tote-bag',
      image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      additional_images: [],
      short_description: '16oz rugged organic canvas tote with reinforced shoulder straps.',
      full_description: 'Spacious interior fits a 16-inch laptop plus daily gear, with a zippered internal key pouch and brass snap closure. Structured flat bottom stands upright.',
      price: 24.99,
      original_price: 36.00,
      discount_percentage: 30,
      currency: 'USD',
      category_id: 'cat-7',
      category_name: 'Accessories',
      amazon_affiliate_url: 'https://www.amazon.com/dp/B08XYZ7890/?tag=weardayaff-20',
      featured: false,
      status: 'active',
      click_count: 95,
      created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 4 * 86400000).toISOString(),
      gender: 'unisex',
      rating: 4.9,
      reviews_count: 62,
      colors: [
        { name: 'Natural Ecru', hex: '#F0EAD6' },
        { name: 'Chocolate Earth', hex: '#3D271D' }
      ]
    },
    {
      id: 'prod-11',
      name: 'Minimalist Washed Cotton Cap',
      slug: 'minimalist-cap',
      image_url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
      additional_images: [],
      short_description: 'Low-profile unconstructed 6-panel dad cap in vintage olive pista.',
      full_description: 'Garment washed 100% cotton chino twill with adjustable antique brass buckle strap at rear. Breathable embroidered eyelets and pre-curved visor.',
      price: 14.99,
      original_price: 22.00,
      discount_percentage: 32,
      currency: 'USD',
      category_id: 'cat-7',
      category_name: 'Accessories',
      amazon_affiliate_url: 'https://www.amazon.com/dp/B07R9KLMN1/?tag=weardayaff-20',
      featured: false,
      status: 'active',
      click_count: 83,
      created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      gender: 'unisex',
      rating: 4.8,
      reviews_count: 49,
      colors: [
        { name: 'Olive Pista', hex: '#657956' },
        { name: 'Peach Clay', hex: '#E58A62' },
        { name: 'Dark Cocoa', hex: '#3D271D' }
      ]
    },
    {
      id: 'prod-12',
      name: 'Ribbed Knit Midi Dress',
      slug: 'ribbed-knit-midi-dress',
      image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
      additional_images: [],
      short_description: 'Ultra-flattering stretch ribbed cotton-modal midi dress with side slit.',
      full_description: 'An effortless one-piece daily staple. Woven with 95% breathable organic cotton and 5% elastane with a supportive vertical rib knit. Features an elegant crew neckline, clean hem, and subtle side slit for comfortable movement.',
      price: 44.99,
      original_price: 68.00,
      discount_percentage: 34,
      currency: 'USD',
      category_id: 'cat-9',
      category_name: 'Dresses',
      amazon_affiliate_url: 'https://www.amazon.com/dp/B08WK710LM/?tag=weardayaff-20',
      featured: true,
      status: 'active',
      click_count: 289,
      created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      gender: 'women',
      rating: 4.9,
      reviews_count: 178,
      colors: [
        { name: 'Oatmeal Heather', hex: '#E3DAC9' },
        { name: 'Warm Cocoa', hex: '#3D271D' },
        { name: 'Sage Olive', hex: '#8FA382' }
      ]
    },
    {
      id: 'prod-13',
      name: 'High-Rise Wide-Leg Pleated Trousers',
      slug: 'pleated-wide-leg-trousers',
      image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
      additional_images: [],
      short_description: 'Tailored fluid-drape wide-leg trousers with front knife pleats.',
      full_description: 'The definitive modern tailored trouser. Features clean front knife pleats, an elasticated back waistband for supreme all-day comfort, deep functional slash pockets, and a clean wide-leg silhouette that pairs effortlessly with tees, blazers, and sneakers.',
      price: 48.99,
      original_price: 70.00,
      discount_percentage: 30,
      currency: 'USD',
      category_id: 'cat-3',
      category_name: 'Pants',
      amazon_affiliate_url: 'https://www.amazon.com/dp/B09V7TR102/?tag=weardayaff-20',
      featured: true,
      status: 'active',
      click_count: 341,
      created_at: new Date(Date.now() - 11 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      gender: 'women',
      rating: 4.9,
      reviews_count: 215,
      colors: [
        { name: 'Desert Sand', hex: '#D2B48C' },
        { name: 'Dark Mocha', hex: '#2C1B14' },
        { name: 'Soft Pista Cream', hex: '#D8E2DC' }
      ]
    },
    {
      id: 'prod-14',
      name: 'Oversized Structured Tailored Blazer',
      slug: 'structured-tailored-blazer',
      image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
      additional_images: [],
      short_description: 'Contemporary relaxed-fit blazer with notched lapels and satin lining.',
      full_description: 'Tailored for effortless layering over everything from casual tees to dresses. Cut with slightly padded shoulders for structure, double-welt flap pockets, and single-breasted tortoiseshell button closure.',
      price: 68.99,
      original_price: 110.00,
      discount_percentage: 37,
      currency: 'USD',
      category_id: 'cat-6',
      category_name: 'Jackets',
      amazon_affiliate_url: 'https://www.amazon.com/dp/B08T5678JK/?tag=weardayaff-20',
      featured: true,
      status: 'active',
      click_count: 412,
      created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      gender: 'women',
      rating: 5.0,
      reviews_count: 142,
      colors: [
        { name: 'Cocoa Brown', hex: '#322119' },
        { name: 'Oatmeal Melange', hex: '#E0D7CC' },
        { name: 'Classic Black', hex: '#1C1C1C' }
      ]
    },
    {
      id: 'prod-15',
      name: 'Relaxed Silk-Touch Linen Blouse',
      slug: 'silk-touch-blouse',
      image_url: 'https://images.unsplash.com/photo-1589465885857-44edb59bbff2?auto=format&fit=crop&w=800&q=80',
      additional_images: [],
      short_description: 'Breathable dropped-shoulder linen blouse with clean concealed placket.',
      full_description: 'A luxurious take on casual shirting. Blended with 60% softened French linen and 40% organic viscose for an airy, feather-light hand-feel that drapes fluidly without stiffness.',
      price: 36.99,
      original_price: 52.00,
      discount_percentage: 29,
      currency: 'USD',
      category_id: 'cat-2',
      category_name: 'Shirts',
      amazon_affiliate_url: 'https://www.amazon.com/dp/B07R456MN8/?tag=weardayaff-20',
      featured: true,
      status: 'active',
      click_count: 198,
      created_at: new Date(Date.now() - 9 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      gender: 'women',
      rating: 4.8,
      reviews_count: 94,
      colors: [
        { name: 'Cream Peach', hex: '#FDF2EA' },
        { name: 'Chalk White', hex: '#FFFFFF' },
        { name: 'Soft Sage', hex: '#9DB08E' }
      ]
    },
    {
      id: 'prod-16',
      name: 'Cashmere-Blend Mockneck Knit',
      slug: 'cashmere-mockneck-knit',
      image_url: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80',
      additional_images: [],
      short_description: 'Sumptuously soft cashmere and merino mockneck in relaxed silhouette.',
      full_description: 'Crafted with 10% Grade-A Mongolian cashmere and 90% extrafine merino wool for lightweight warmth without itchiness. Features ribbed collar, cuffs, and gently curved hem.',
      price: 54.99,
      original_price: 85.00,
      discount_percentage: 35,
      currency: 'USD',
      category_id: 'cat-5',
      category_name: 'Hoodies',
      amazon_affiliate_url: 'https://www.amazon.com/dp/B09C345678/?tag=weardayaff-20',
      featured: false,
      status: 'active',
      click_count: 221,
      created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      gender: 'women',
      rating: 4.9,
      reviews_count: 112,
      colors: [
        { name: 'Cloud Oat', hex: '#F5EFEB' },
        { name: 'Dusty Cocoa', hex: '#553C2F' },
        { name: 'Muted Pista', hex: '#B2CDA7' }
      ]
    },
    {
      id: 'prod-17',
      name: 'Camp-Collar Oxford Resort Shirt',
      slug: 'camp-collar-oxford-shirt',
      image_url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      additional_images: [],
      short_description: '100% breathable Oxford cotton casual button-down with camp collar.',
      full_description: 'A warm-weather wardrobe essential. Cut in a modern boxy silhouette with an open Cuban camp collar, clean chest patch pocket, and natural coconut shell buttons.',
      price: 36.99,
      original_price: 50.00,
      discount_percentage: 26,
      currency: 'USD',
      category_id: 'cat-2',
      category_name: 'Shirts',
      amazon_affiliate_url: 'https://www.amazon.com/dp/B08F912345/?tag=weardayaff-20',
      featured: true,
      status: 'active',
      click_count: 175,
      created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      gender: 'men',
      rating: 4.8,
      reviews_count: 83,
      colors: [
        { name: 'Crisp White', hex: '#FFFFFF' },
        { name: 'Faded Olive', hex: '#5B6F55' },
        { name: 'Dark Navy', hex: '#1B263B' }
      ]
    }
  ];

  const hero_slides: HeroSlide[] = [
    {
      id: 'slide-1',
      title: 'Everyday Looks. Made Effortless.',
      description: 'Practical pieces. Real comfort. Designed for women and men for every part of your day.',
      cta_text: 'Shop All Looks',
      cta_url: '/shop',
      image_url: '/public/assets/aistudio/image_4dafd9e5.png',
      display_order: 1,
      status: 'active',
      created_at: new Date(Date.now() - 30 * 86400000).toISOString()
    },
    {
      id: 'slide-2',
      title: "The Women's Modern Capsule",
      description: 'Effortless rib-knit midi dresses, fluid high-rise trousers, and soft tailored blazers.',
      cta_text: "Explore Women's",
      cta_url: '/shop?gender=women',
      image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
      display_order: 2,
      status: 'active',
      created_at: new Date(Date.now() - 25 * 86400000).toISOString()
    },
    {
      id: 'slide-3',
      title: 'Mix, Match & Build Your Outfit',
      description: 'Interactive capsule builder with real-time pairing for both her and his wardrobe.',
      cta_text: 'Start Building',
      cta_url: '#outfit-builder',
      image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
      display_order: 3,
      status: 'active',
      created_at: new Date(Date.now() - 20 * 86400000).toISOString()
    }
  ];

  // Seed realistic historical clicks for the past 7 days
  const affiliate_clicks: AffiliateClick[] = [];
  const now = Date.now();
  for (let i = 0; i < 48; i++) {
    const daysAgo = Math.floor(Math.random() * 7);
    const clickTime = new Date(now - daysAgo * 86400000 - Math.random() * 50000000);
    const prod = products[Math.floor(Math.random() * products.length)];
    affiliate_clicks.push({
      id: `clk-${i + 1}`,
      product_id: prod.id,
      product_name: prod.name,
      product_slug: prod.slug,
      clicked_at: clickTime.toISOString(),
      date_str: clickTime.toISOString().split('T')[0],
      referrer: 'https://wearday.store/'
    });
  }

  const contact_messages: ContactMessage[] = [
    {
      id: 'msg-1',
      name: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      phone: '+1 555-019-2834',
      message: 'Hi! I love the sage pistachio overshirt. Are you planning to restock the size L soon?',
      is_read: false,
      created_at: new Date(Date.now() - 4 * 3600000).toISOString()
    },
    {
      id: 'msg-2',
      name: 'Marcus Vance',
      email: 'm.vance@company.design',
      phone: '+1 555-382-9011',
      message: 'Inquiring about sizing for the easy chinos. Do they run true to size or should I size up?',
      is_read: true,
      created_at: new Date(Date.now() - 28 * 3600000).toISOString()
    }
  ];

  return {
    admins: [
      {
        id: 'admin-1',
        username: 'admin',
        password_hash: hash,
        salt,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      }
    ],
    products,
    categories,
    hero_slides,
    affiliate_clicks,
    contact_messages,
    site_settings: DEFAULT_SETTINGS,
    sessions: []
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error('Error reading db.json, generating seeds', err);
        this.data = getSeedData();
        this.save();
      }
    } else {
      this.data = getSeedData();
      this.save();
    }
  }

  public save(): void {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save db.json:', err);
    }
  }

  public getRawData(): DatabaseSchema {
    return this.data;
  }

  // Admin Session helpers
  public createSession(username: string): string {
    const token = crypto.randomBytes(32).toString('hex');
    const expires_at = Date.now() + 7 * 86400000; // 7 days
    this.data.sessions.push({ token, username, expires_at });
    this.save();
    return token;
  }

  public validateSession(token: string): boolean {
    const session = this.data.sessions.find(s => s.token === token);
    if (!session) return false;
    if (Date.now() > session.expires_at) {
      this.data.sessions = this.data.sessions.filter(s => s.token !== token);
      this.save();
      return false;
    }
    return true;
  }

  public removeSession(token: string): void {
    this.data.sessions = this.data.sessions.filter(s => s.token !== token);
    this.save();
  }
}

export const db = new Database();
