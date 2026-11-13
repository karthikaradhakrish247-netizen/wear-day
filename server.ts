import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { db, verifyPassword, hashPassword } from './server/db.js';
import type { Product, Category, HeroSlide, ContactMessage, SiteSettings } from './src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from public and generated images
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/src/assets/images', express.static(path.join(__dirname, 'src/assets/images')));

// Auth middleware for admin endpoints
function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized. Admin session required.' });
    return;
  }
  const token = authHeader.split(' ')[1];
  if (!db.validateSession(token)) {
    res.status(401).json({ error: 'Session expired or invalid.' });
    return;
  }
  next();
}

// Helper to record affiliate clicks
function recordAffiliateClick(product: Product, req: Request): void {
  const raw = db.getRawData();
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];

  product.click_count = (product.click_count || 0) + 1;
  product.updated_at = now.toISOString();

  raw.affiliate_clicks.push({
    id: `clk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    product_id: product.id,
    product_name: product.name,
    product_slug: product.slug,
    clicked_at: now.toISOString(),
    date_str: dateStr,
    referrer: (req.headers.referer || req.headers.referrer || 'direct') as string
  });

  db.save();
}

// Build final Amazon affiliate URL
function buildAffiliateUrl(originalUrl: string, fallbackTag: string): string {
  try {
    const url = new URL(originalUrl);
    if (!url.searchParams.has('tag') && fallbackTag) {
      url.searchParams.set('tag', fallbackTag);
    }
    return url.toString();
  } catch {
    return originalUrl;
  }
}

// ----------------------------------------------------
// 1. AFFILIATE REDIRECT ROUTE (/go/:slug)
// ----------------------------------------------------
app.get('/go/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const raw = db.getRawData();
  const product = raw.products.find(p => p.slug === slug || p.id === slug);

  if (!product) {
    res.status(404).send('Product not found for affiliate redirect.');
    return;
  }

  recordAffiliateClick(product, req);
  const targetUrl = buildAffiliateUrl(product.amazon_affiliate_url, raw.site_settings.amazon_affiliate_tag);

  // If request specifically asked for json
  if (req.headers.accept?.includes('application/json')) {
    res.json({ success: true, redirect_url: targetUrl, product_name: product.name });
    return;
  }

  // Elegant interstitial page with immediate 302 redirect & fallback for strict sandbox environments
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="refresh" content="1;url=${targetUrl}">
        <title>Redirecting to Amazon — ${raw.site_settings.brand_name}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: #FAF7F2;
            color: #2C1B14;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            text-align: center;
            padding: 20px;
          }
          .card {
            background: #FFFFFF;
            border: 1px solid #E5EDE2;
            padding: 32px;
            border-radius: 16px;
            max-width: 440px;
            box-shadow: 0 10px 25px -5px rgba(44, 27, 20, 0.05);
          }
          .spinner {
            width: 36px;
            height: 36px;
            border: 3px solid #E5EDE2;
            border-top: 3px solid #9DB08E;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin: 0 auto 20px;
          }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          h2 { margin: 0 0 8px; font-size: 20px; }
          p { color: #745442; font-size: 14px; line-height: 1.5; margin: 0 0 20px; }
          .btn {
            display: inline-block;
            background: #2C1B14;
            color: #FFFFFF;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="spinner"></div>
          <h2>Heading to Amazon</h2>
          <p>Redirecting you to view <strong>${product.name}</strong> with real-time pricing and availability.</p>
          <a class="btn" href="${targetUrl}" target="_blank" rel="noopener noreferrer">Click here if not redirected</a>
        </div>
      </body>
    </html>
  `;
  res.send(html);
});

// Dedicated tracking API called by client-side before opening modal/window
app.post('/api/track-click/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const raw = db.getRawData();
  const product = raw.products.find(p => p.slug === slug || p.id === slug);

  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  recordAffiliateClick(product, req);
  const targetUrl = buildAffiliateUrl(product.amazon_affiliate_url, raw.site_settings.amazon_affiliate_tag);
  res.json({ success: true, redirect_url: targetUrl, click_count: product.click_count });
});

// ----------------------------------------------------
// 2. PUBLIC API ENDPOINTS
// ----------------------------------------------------

// Products
app.get('/api/products', (req: Request, res: Response) => {
  const raw = db.getRawData();
  let items = raw.products.filter(p => p.status === 'active');

  const { category, gender, featured, search, sort } = req.query;

  if (category) {
    items = items.filter(p => p.category_id === category || p.category_name?.toLowerCase() === (category as string).toLowerCase());
  }
  if (gender && gender !== 'all') {
    items = items.filter(p => p.gender === gender || p.gender === 'unisex');
  }
  if (featured === 'true') {
    items = items.filter(p => p.featured);
  }
  if (search) {
    const q = (search as string).toLowerCase();
    items = items.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.short_description.toLowerCase().includes(q) ||
      p.full_description.toLowerCase().includes(q) ||
      (p.category_name && p.category_name.toLowerCase().includes(q))
    );
  }

  if (sort === 'price_asc') {
    items.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sort === 'price_desc') {
    items.sort((a, b) => (b.price || 0) - (a.price || 0));
  } else if (sort === 'clicks') {
    items.sort((a, b) => (b.click_count || 0) - (a.click_count || 0));
  } else {
    items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  res.json({ products: items, total: items.length });
});

app.get('/api/products/:slugOrId', (req: Request, res: Response) => {
  const raw = db.getRawData();
  const product = raw.products.find(p => p.slug === req.params.slugOrId || p.id === req.params.slugOrId);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  // Related products
  const related = raw.products
    .filter(p => p.id !== product.id && p.status === 'active' && p.category_id === product.category_id)
    .slice(0, 4);

  res.json({ product, related });
});

// Categories
app.get('/api/categories', (_req: Request, res: Response) => {
  const raw = db.getRawData();
  const activeCategories = raw.categories
    .filter(c => c.status === 'active')
    .sort((a, b) => a.display_order - b.display_order)
    .map(c => ({
      ...c,
      product_count: raw.products.filter(p => p.category_id === c.id && p.status === 'active').length
    }));

  res.json({ categories: activeCategories });
});

// Hero Slides
app.get('/api/hero-slides', (_req: Request, res: Response) => {
  const raw = db.getRawData();
  const slides = raw.hero_slides
    .filter(s => s.status === 'active')
    .sort((a, b) => a.display_order - b.display_order);
  res.json({ slides });
});

// Settings
app.get('/api/settings', (_req: Request, res: Response) => {
  const raw = db.getRawData();
  res.json({ settings: raw.site_settings });
});

// Contact message submission
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, phone, message } = req.body;
  if (!name || !email || !message) {
    res.status(400).json({ error: 'Name, email and message are required.' });
    return;
  }

  const raw = db.getRawData();
  const newMsg: ContactMessage = {
    id: `msg-${Date.now()}`,
    name: String(name).trim(),
    email: String(email).trim(),
    phone: phone ? String(phone).trim() : undefined,
    message: String(message).trim(),
    is_read: false,
    created_at: new Date().toISOString()
  };

  raw.contact_messages.unshift(newMsg);
  db.save();

  res.json({ success: true, message: 'Message sent successfully.' });
});

// ----------------------------------------------------
// 3. ADMIN AUTHENTICATION
// ----------------------------------------------------
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  const raw = db.getRawData();
  const admin = raw.admins.find(a => a.username.toLowerCase() === String(username).toLowerCase().trim());

  if (!admin || !verifyPassword(String(password), admin.password_hash, admin.salt)) {
    res.status(401).json({ error: 'Invalid username or password.' });
    return;
  }

  admin.last_login = new Date().toISOString();
  const token = db.createSession(admin.username);

  res.json({
    token,
    user: {
      id: admin.id,
      username: admin.username,
      last_login: admin.last_login
    }
  });
});

app.get('/api/auth/check', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ authenticated: false });
    return;
  }
  const token = authHeader.split(' ')[1];
  const valid = db.validateSession(token);
  if (!valid) {
    res.status(401).json({ authenticated: false });
    return;
  }
  const raw = db.getRawData();
  const session = raw.sessions.find(s => s.token === token);
  res.json({ authenticated: true, username: session?.username });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    db.removeSession(token);
  }
  res.json({ success: true });
});

app.post('/api/auth/change-password', requireAdmin, (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    res.status(400).json({ error: 'New password must be at least 6 characters.' });
    return;
  }

  const raw = db.getRawData();
  const admin = raw.admins[0];
  if (!admin || !verifyPassword(String(currentPassword), admin.password_hash, admin.salt)) {
    res.status(400).json({ error: 'Current password does not match.' });
    return;
  }

  const { hash, salt } = hashPassword(String(newPassword));
  admin.password_hash = hash;
  admin.salt = salt;
  admin.updated_at = new Date().toISOString();
  db.save();

  res.json({ success: true, message: 'Password updated successfully.' });
});

// ----------------------------------------------------
// 4. ADMIN DASHBOARD & CRUD ENDPOINTS
// ----------------------------------------------------

// Admin products list
app.get('/api/admin/products', requireAdmin, (_req: Request, res: Response) => {
  const raw = db.getRawData();
  res.json({ products: raw.products });
});

// Admin create product
app.post('/api/admin/products', requireAdmin, (req: Request, res: Response) => {
  const data = req.body;
  if (!data.name || !data.category_id || !data.amazon_affiliate_url) {
    res.status(400).json({ error: 'Name, Category, and Amazon Affiliate URL are required.' });
    return;
  }

  const raw = db.getRawData();
  const cat = raw.categories.find(c => c.id === data.category_id);
  const slug = data.slug
    ? data.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    : data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    name: data.name.trim(),
    slug: `${slug}-${Math.random().toString(36).substring(2, 5)}`,
    image_url: data.image_url || '/src/assets/images/product_pista_overshirt_1793947613900.jpg',
    additional_images: Array.isArray(data.additional_images) ? data.additional_images : [],
    short_description: data.short_description || '',
    full_description: data.full_description || '',
    price: data.price !== undefined && data.price !== '' ? Number(data.price) : undefined,
    original_price: data.original_price !== undefined && data.original_price !== '' ? Number(data.original_price) : undefined,
    discount_percentage: (data.original_price && data.price)
      ? Math.round(((Number(data.original_price) - Number(data.price)) / Number(data.original_price)) * 100)
      : undefined,
    currency: data.currency || raw.site_settings.currency || 'USD',
    category_id: data.category_id,
    category_name: cat?.name || 'General',
    amazon_affiliate_url: data.amazon_affiliate_url.trim(),
    featured: Boolean(data.featured),
    status: data.status === 'inactive' ? 'inactive' : 'active',
    click_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    colors: Array.isArray(data.colors) ? data.colors : [],
    gender: data.gender || 'unisex',
    rating: 5.0,
    reviews_count: 1
  };

  raw.products.unshift(newProduct);
  db.save();

  res.json({ success: true, product: newProduct });
});

// Admin update product
app.put('/api/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const raw = db.getRawData();
  const index = raw.products.findIndex(p => p.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Product not found.' });
    return;
  }

  const existing = raw.products[index];
  const cat = req.body.category_id ? raw.categories.find(c => c.id === req.body.category_id) : undefined;

  const updated: Product = {
    ...existing,
    ...req.body,
    category_name: cat ? cat.name : existing.category_name,
    updated_at: new Date().toISOString()
  };

  if (updated.price && updated.original_price && updated.original_price > updated.price) {
    updated.discount_percentage = Math.round(((updated.original_price - updated.price) / updated.original_price) * 100);
  }

  raw.products[index] = updated;
  db.save();

  res.json({ success: true, product: updated });
});

// Admin delete product
app.delete('/api/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const raw = db.getRawData();
  raw.products = raw.products.filter(p => p.id !== id);
  db.save();
  res.json({ success: true });
});

// Admin duplicate product
app.post('/api/admin/products/:id/duplicate', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const raw = db.getRawData();
  const original = raw.products.find(p => p.id === id);

  if (!original) {
    res.status(404).json({ error: 'Product not found.' });
    return;
  }

  const duplicated: Product = {
    ...original,
    id: `prod-${Date.now()}`,
    name: `${original.name} (Copy)`,
    slug: `${original.slug}-copy-${Math.random().toString(36).substring(2, 5)}`,
    click_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  raw.products.unshift(duplicated);
  db.save();

  res.json({ success: true, product: duplicated });
});

// Admin Categories CRUD
app.get('/api/admin/categories', requireAdmin, (_req: Request, res: Response) => {
  const raw = db.getRawData();
  const list = raw.categories.map(c => ({
    ...c,
    product_count: raw.products.filter(p => p.category_id === c.id).length
  }));
  res.json({ categories: list });
});

app.post('/api/admin/categories', requireAdmin, (req: Request, res: Response) => {
  const { name, slug, image_url, description, status } = req.body;
  if (!name) {
    res.status(400).json({ error: 'Category name is required.' });
    return;
  }
  const raw = db.getRawData();
  const newCat: Category = {
    id: `cat-${Date.now()}`,
    name: name.trim(),
    slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    image_url: image_url || '/src/assets/images/product_pista_overshirt_1793947613900.jpg',
    description: description || '',
    status: status === 'inactive' ? 'inactive' : 'active',
    display_order: raw.categories.length + 1,
    created_at: new Date().toISOString()
  };

  raw.categories.push(newCat);
  db.save();

  res.json({ success: true, category: newCat });
});

app.put('/api/admin/categories/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const raw = db.getRawData();
  const index = raw.categories.findIndex(c => c.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Category not found.' });
    return;
  }
  raw.categories[index] = { ...raw.categories[index], ...req.body };
  db.save();
  res.json({ success: true, category: raw.categories[index] });
});

app.delete('/api/admin/categories/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const raw = db.getRawData();
  const associated = raw.products.filter(p => p.category_id === id);
  if (associated.length > 0) {
    res.status(400).json({
      error: `Cannot delete: ${associated.length} product(s) are assigned to this category. Please reassign them first.`
    });
    return;
  }
  raw.categories = raw.categories.filter(c => c.id !== id);
  db.save();
  res.json({ success: true });
});

// Admin Hero Slides CRUD
app.get('/api/admin/hero-slides', requireAdmin, (_req: Request, res: Response) => {
  const raw = db.getRawData();
  res.json({ slides: raw.hero_slides.sort((a, b) => a.display_order - b.display_order) });
});

app.post('/api/admin/hero-slides', requireAdmin, (req: Request, res: Response) => {
  const { title, description, cta_text, cta_url, image_url, status } = req.body;
  if (!title) {
    res.status(400).json({ error: 'Title is required.' });
    return;
  }
  const raw = db.getRawData();
  const newSlide: HeroSlide = {
    id: `slide-${Date.now()}`,
    title: title.trim(),
    description: description || '',
    cta_text: cta_text || 'Shop Now',
    cta_url: cta_url || '/shop',
    image_url: image_url || '/src/assets/images/hero_autumn_pista_peach_1793947613725.jpg',
    display_order: raw.hero_slides.length + 1,
    status: status === 'inactive' ? 'inactive' : 'active',
    created_at: new Date().toISOString()
  };

  raw.hero_slides.push(newSlide);
  db.save();
  res.json({ success: true, slide: newSlide });
});

app.put('/api/admin/hero-slides/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const raw = db.getRawData();
  const index = raw.hero_slides.findIndex(s => s.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Slide not found.' });
    return;
  }
  raw.hero_slides[index] = { ...raw.hero_slides[index], ...req.body };
  db.save();
  res.json({ success: true, slide: raw.hero_slides[index] });
});

app.delete('/api/admin/hero-slides/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const raw = db.getRawData();
  raw.hero_slides = raw.hero_slides.filter(s => s.id !== id);
  db.save();
  res.json({ success: true });
});

// Admin Analytics API
app.get('/api/admin/analytics', requireAdmin, (_req: Request, res: Response) => {
  const raw = db.getRawData();
  const clicks = raw.affiliate_clicks;

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const todayCount = clicks.filter(c => c.date_str === todayStr).length;
  const yesterdayCount = clicks.filter(c => c.date_str === yesterdayStr).length;

  const oneWeekAgo = Date.now() - 7 * 86400000;
  const oneMonthAgo = Date.now() - 30 * 86400000;

  const thisWeekCount = clicks.filter(c => new Date(c.clicked_at).getTime() >= oneWeekAgo).length;
  const thisMonthCount = clicks.filter(c => new Date(c.clicked_at).getTime() >= oneMonthAgo).length;

  // Clicks over time (last 14 days)
  const clicksByDate: Record<string, number> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
    clicksByDate[d] = 0;
  }
  clicks.forEach(c => {
    if (clicksByDate[c.date_str] !== undefined) {
      clicksByDate[c.date_str]++;
    }
  });

  const clicksTimeline = Object.entries(clicksByDate).map(([date, count]) => ({ date, count }));

  // Top products
  const topProducts = [...raw.products]
    .sort((a, b) => (b.click_count || 0) - (a.click_count || 0))
    .slice(0, 8)
    .map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      image_url: p.image_url,
      price: p.price,
      click_count: p.click_count || 0,
      last_clicked: clicks.filter(c => c.product_id === p.id).sort((a, b) => new Date(b.clicked_at).getTime() - new Date(a.clicked_at).getTime())[0]?.clicked_at || p.updated_at
    }));

  res.json({
    totalClicks: clicks.length,
    todayClicks: todayCount,
    yesterdayClicks: yesterdayCount,
    thisWeekClicks: thisWeekCount,
    thisMonthClicks: thisMonthCount,
    totalProducts: raw.products.filter(p => p.status === 'active').length,
    totalCategories: raw.categories.length,
    unreadMessages: raw.contact_messages.filter(m => !m.is_read).length,
    featuredCount: raw.products.filter(p => p.featured).length,
    timeline: clicksTimeline,
    topProducts,
    recentClicks: clicks.slice(-30).reverse()
  });
});

// Admin Contact Messages
app.get('/api/admin/messages', requireAdmin, (_req: Request, res: Response) => {
  const raw = db.getRawData();
  res.json({ messages: raw.contact_messages });
});

app.put('/api/admin/messages/:id/read', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const raw = db.getRawData();
  const msg = raw.contact_messages.find(m => m.id === id);
  if (!msg) {
    res.status(404).json({ error: 'Message not found.' });
    return;
  }
  msg.is_read = req.body.is_read !== undefined ? Boolean(req.body.is_read) : true;
  db.save();
  res.json({ success: true, message: msg });
});

app.delete('/api/admin/messages/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const raw = db.getRawData();
  raw.contact_messages = raw.contact_messages.filter(m => m.id !== id);
  db.save();
  res.json({ success: true });
});

// Admin Site Settings
app.put('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
  const raw = db.getRawData();
  raw.site_settings = { ...raw.site_settings, ...req.body };
  db.save();
  res.json({ success: true, settings: raw.site_settings });
});

// ----------------------------------------------------
// 5. DEV & PRODUCTION SERVER SETUP
// ----------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
