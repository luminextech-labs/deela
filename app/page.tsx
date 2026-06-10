'use client';

import { useState, useEffect } from 'react';
import MobileSidebar from './components/MobileSidebar';
import ProductCard from './components/ProductCard';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'https://deela-foa0.onrender.com').replace(/\/$/, '');

// Full category hierarchy like Lazada
const topCategories = [
  { name: 'อิเล็กทรอนิกส์', icon: '/icons/computer.png', sub: ['มือถือ', 'แล็ปท็อป', 'กล้อง', 'จอมอนิเตอร์', 'พริ้นเตอร์'] },
  { name: 'มือถือ & แก็ดเจ็ต', icon: '/icons/mobile.png', sub: ['สมาร์ทโฟน', 'แท็บเล็ต', 'สมาร์ทวอทช์', 'หูฟัง', 'แบตเตอร์สำรอง'] },
  { name: 'คอมพิวเตอร์', icon: '/icons/computer.png', sub: ['เดสก์ท็อป', 'โน้ตบุ๊ก', 'คีย์บอร์ด', 'เมาส์', 'อุปกรณ์เสริม'] },
  { name: 'หูฟัง & เสียง', icon: '/icons/audio.png', sub: ['หูฟังบลูทูธ', 'หูฟังแบบเกม', 'ลำโพง', 'Soundbar', 'ไมค์'] },
  { name: 'เกมมิ่งเกียร์', icon: '/icons/auto.png', sub: ['คอนโซล', 'เกมพีซี', 'เมาส์เกม', 'คีย์บอร์ดเกม', 'หูฟังเกม'] },
  { name: 'เครื่องใช้ในบ้าน', icon: '/icons/home.png', sub: ['เครื่องดูดฝุ่น', 'เครื่องปรับอากาศ', 'พัดลม', 'กระทะไฟฟ้า', 'เครื่องชงกาแฟ'] },
  { name: 'สุขภาพ & ความงาม', icon: '/icons/beauty.png', sub: ['สกินแคร์', 'เครื่องมือความงาม', 'วิตามิน', 'อาหารเสริม'] },
  { name: 'แม่ & เด็ก', icon: '/icons/mother.png', sub: ['ของเล่น', 'เสื้อผ้าเด็ก', 'รถเข็น', 'อุปกรณ์ให้นม'] },
  { name: 'กีฬา & กิจกรรม', icon: '/icons/sports.png', sub: ['รองเท้าวิ่ง', 'ฟิตเนส', 'จักรยาน', 'อุปกรณ์เล่นกีฬา'] },
  { name: 'ยานยนต์', icon: '/icons/auto.png', sub: ['อุปกรณ์ตกแต่ง', 'กล้องติดรถ', 'เครื่องเสียงรถยนต์'] },
  { name: 'สัตว์เลี้ยง', icon: '/icons/pets.png', sub: ['อาหารสัตว์', 'เตียงสัตว์', 'ของเล่นสัตว์'] },
  { name: 'หนังสือ & สื่อ', icon: '/icons/books.png', sub: ['นิยาย', 'หนังสือเรียน', 'วารสาร'] },
];

// Category icons for the horizontal row
const categoryIcons = [
  { name: 'มือถือ', icon: '/icons/mobile.png', href: '/categories?cat=mobile' },
  { name: 'คอมพิวเตอร์', icon: '/icons/computer.png', href: '/categories?cat=computer' },
  { name: 'หูฟัง', icon: '/icons/audio.png', href: '/categories?cat=audio' },
  { name: 'เกมมิ่ง', icon: '/icons/auto.png', href: '/categories?cat=gaming' },
  { name: 'เครื่องใช้', icon: '/icons/home_new.png', href: '/categories?cat=home' },
  { name: 'สุขภาพ', icon: '/icons/beauty.png', href: '/categories?cat=beauty' },
  { name: 'แม่ & เด็ก', icon: '/icons/mother.png', href: '/categories?cat=mother' },
  { name: 'กีฬา', icon: '/icons/sports.png', href: '/categories?cat=sports' },
  { name: 'ยานยนต์', icon: '/icons/icon3.png', href: '/categories?cat=auto' },
  { name: 'สัตว์เลี้ยง', icon: '/icons/pet.png', href: '/categories?cat=pet' },
];

// Flash sale products
const flashSaleProducts = [
  { id: 'flash-1', name: 'iPhone 15 Pro Max 256GB', price: 41900, oldPrice: 54900, discount: 24, shop: 'Shopee', rating: 4.9, reviews: 8560, sold: 1200, image: '/placeholder.png' },
  { id: 'flash-2', name: 'MacBook Air M3 13"', price: 36900, oldPrice: 44900, discount: 18, shop: 'Lazada', rating: 4.8, reviews: 2340, sold: 450, image: '/placeholder.png' },
  { id: 'flash-3', name: 'Sony WH-1000XM5', price: 8990, oldPrice: 12900, discount: 30, shop: 'Shopee', rating: 4.7, reviews: 3450, sold: 890, image: '/placeholder.png' },
  { id: 'flash-4', name: 'iPad Pro M4 11"', price: 34900, oldPrice: 42900, discount: 19, shop: 'Lazada', rating: 4.9, reviews: 1560, sold: 320, image: '/placeholder.png' },
  { id: 'flash-5', name: 'Dyson V12 Detect', price: 18900, oldPrice: 22900, discount: 17, shop: 'Shopee', rating: 4.8, reviews: 890, sold: 210, image: '/placeholder.png' },
  { id: 'flash-6', name: 'Nintendo Switch OLED', price: 10900, oldPrice: 13900, discount: 22, shop: 'TikTok', rating: 4.7, reviews: 4560, sold: 670, image: '/placeholder.png' },
];

// Mall / Official stores
const mallStores = [
  { name: 'Apple Authorized', logo: '/logo_apple.svg', tag: 'Official' },
  { name: 'Samsung Official', logo: '/logo_samsung.png', tag: 'Official' },
  { name: 'Logitech Official', logo: '/logo_logitech.svg', tag: 'Official' },
  { name: 'Anker Official', logo: '/logo_anker.png', tag: 'Official' },
  { name: 'Dyson Official', logo: '/logo_dyson.png', tag: 'Official' },
];

// Just for you products
const fallbackProducts = [
  { id: 'fallback-1', name: 'Anker Soundcore P20i หูฟัง TWS', price: 690, oldPrice: 1290, discount: 47, shop: 'Shopee', rating: 4.7, reviews: 1234, sold: 5600, image: '/placeholder.png' },
  { id: 'fallback-2', name: 'iPhone 15 (128GB) สีใหม่', price: 27900, oldPrice: 31900, discount: 12, shop: 'Lazada', rating: 4.9, reviews: 8560, sold: 12000, image: '/placeholder.png' },
  { id: 'fallback-3', name: 'Dyson V12 Detect Slim', price: 18900, oldPrice: 22900, discount: 17, shop: 'Shopee', rating: 4.8, reviews: 890, sold: 1200, image: '/placeholder.png' },
  { id: 'fallback-4', name: 'Logitech G304 HERO Mouse', price: 890, oldPrice: 1390, discount: 36, shop: 'Lazada', rating: 4.6, reviews: 3450, sold: 8900, image: '/placeholder.png' },
  { id: 'fallback-5', name: 'Samsung Galaxy Buds FE', price: 2990, oldPrice: 3990, discount: 25, shop: 'TikTok', rating: 4.5, reviews: 2340, sold: 4300, image: '/placeholder.png' },
  { id: 'fallback-6', name: 'iPad Pro M4 11" 256GB WiFi', price: 34900, oldPrice: 38900, discount: 10, shop: 'Shopee', rating: 4.9, reviews: 1560, sold: 2100, image: '/placeholder.png' },
  { id: 'fallback-7', name: 'Sony WF-1000XM5 หูฟัง ANC', price: 8990, oldPrice: 12900, discount: 30, shop: 'Lazada', rating: 4.8, reviews: 1670, sold: 3200, image: '/placeholder.png' },
  { id: 'fallback-8', name: 'MacBook Air M3 13" 8GB/256GB', price: 36900, oldPrice: 44900, discount: 18, shop: 'Shopee', rating: 4.8, reviews: 2340, sold: 1800, image: '/placeholder.png' },
  { id: 'fallback-9', name: 'Nintendo Switch OLED', price: 10900, oldPrice: 13900, discount: 22, shop: 'TikTok', rating: 4.7, reviews: 4560, sold: 6700, image: '/placeholder.png' },
  { id: 'fallback-10', name: 'JBL Tune 230NC TWS หูฟัง', price: 1990, oldPrice: 3990, discount: 50, shop: 'Shopee', rating: 4.4, reviews: 892, sold: 3400, image: '/placeholder.png' },
  { id: 'fallback-11', name: 'Logitech G Pro X Superlight 2', price: 4590, oldPrice: 5990, discount: 23, shop: 'Lazada', rating: 4.9, reviews: 1230, sold: 2100, image: '/placeholder.png' },
  { id: 'fallback-12', name: 'AirPods Pro 2 (USB-C)', price: 7990, oldPrice: 9990, discount: 20, shop: 'Shopee', rating: 4.8, reviews: 5670, sold: 12000, image: '/placeholder.png' },
];

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  lowest_price: string;
  highest_rating: string;
}

function TopNavbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <a href="/" className="shrink-0">
            <img src="/logo.png" alt="Deela" className="h-10 object-contain" />
          </a>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl flex items-center bg-gray-100 rounded-2xl px-4 py-2.5 gap-2">
            <span className="text-gray-400 text-lg">🔍</span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาสินค้าใน Deela..."
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
            />
            <button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-1.5 rounded-xl font-semibold text-sm transition">
              ค้นหา
            </button>
          </form>

          {/* Quick links */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="/search" className="flex items-center gap-1 text-gray-600 hover:text-violet-600 text-sm font-medium transition">
              <span>🔍</span> ค้นหา
            </a>
            <a href="/alerts" className="flex items-center gap-1 text-gray-600 hover:text-violet-600 text-sm font-medium transition">
              <span>🔔</span> ติดตามราคา
            </a>
            <a href="/compare" className="flex items-center gap-1 text-gray-600 hover:text-violet-600 text-sm font-medium transition">
              <span>⚖️</span> เปรียบเทียบ
            </a>
          </div>
        </div>
      </div>

      {/* Category navigation bar */}
      <div className="border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 py-1.5 overflow-x-auto scrollbar-hide">
            <a href="/categories" className="shrink-0 px-3 py-1.5 text-xs font-semibold text-violet-600 bg-violet-50 rounded-lg whitespace-nowrap">
              📂 ทั้งหมด
            </a>
            {topCategories.map((cat) => (
              <div key={cat.name} className="shrink-0 relative"
                onMouseEnter={() => setActiveDropdown(cat.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <a href={`/categories?cat=${encodeURIComponent(cat.name)}`} className="block px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg whitespace-nowrap transition">
                  {cat.name}
                </a>
                {activeDropdown === cat.name && (
                  <div className="absolute top-full left-0 bg-white border border-gray-100 rounded-xl shadow-lg p-4 min-w-[200px] z-50">
                    <div className="grid grid-cols-2 gap-1">
                      {cat.sub.map((s) => (
                        <a key={s} href={`/search?q=${encodeURIComponent(s)}`} className="px-3 py-2 text-xs text-gray-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition">
                          {s}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryRow() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-800 text-sm">📂 หมวดหมู่สินค้า</h3>
        <a href="/categories" className="text-violet-600 text-xs font-semibold hover:underline">ดูทั้งหมด →</a>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categoryIcons.map((cat) => (
          <a key={cat.name} href={cat.href} className="flex flex-col items-center gap-1.5 shrink-0 group">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:border-violet-300 group-hover:bg-violet-50 transition">
              <img src={cat.icon} alt={cat.name} className="w-8 h-8 object-contain" />
            </div>
            <span className="text-[10px] text-gray-600 font-medium text-center whitespace-nowrap group-hover:text-violet-600 transition">{cat.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function FlashSaleSection() {
  const [timeLeft, setTimeLeft] = useState({ h: 10, m: 30, s: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-4">
      {/* Header */}
      <div className="bg-red-500 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-white font-black text-lg">⚡ FLASH SALE</span>
          <div className="flex items-center gap-1 bg-white/20 rounded-lg px-3 py-1">
            <span className="text-white font-bold text-sm">{String(timeLeft.h).padStart(2, '0')}</span>
            <span className="text-white font-bold">:</span>
            <span className="text-white font-bold text-sm">{String(timeLeft.m).padStart(2, '0')}</span>
            <span className="text-white font-bold">:</span>
            <span className="text-white font-bold text-sm">{String(timeLeft.s).padStart(2, '0')}</span>
          </div>
        </div>
        <a href="/search?filter=flash" className="text-white text-xs font-semibold hover:underline">ดูทั้งหมด →</a>
      </div>

      {/* Products */}
      <div className="p-4">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {flashSaleProducts.map((p) => (
            <a key={p.id} href={`/product/${p.id}`} className="shrink-0 w-[150px] bg-gray-50 rounded-xl p-2.5 hover:shadow-md transition cursor-pointer block border border-gray-100 hover:border-red-200">
              <div className="relative mb-2">
                <img src={p.image} alt={p.name} className="w-full h-24 object-cover rounded-lg" onError={(e) => { e.currentTarget.src = '/placeholder.png'; }} />
                <span className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">-{p.discount}%</span>
              </div>
              <h3 className="font-bold text-[11px] text-gray-800 line-clamp-2 mb-1 leading-tight">{p.name}</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-sm font-black text-red-500">฿{p.price.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-400">{p.sold} ขายแล้ว</span>
                <span className="text-[10px] text-gray-400">⭐ {p.rating}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function MallSection() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏪</span>
          <h3 className="font-bold text-gray-800 text-sm">Deela Mall — ร้านค้าอย่างเป็นทางการ</h3>
        </div>
        <a href="/mall" className="text-violet-600 text-xs font-semibold hover:underline">ดูทั้งหมด →</a>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {mallStores.map((store) => (
          <a key={store.name} href={`/mall/${store.name}`} className="shrink-0 flex flex-col items-center gap-1.5 group">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:border-violet-300 group-hover:bg-violet-50 transition p-2">
              <img src={store.logo} alt={store.name} className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <span className="text-[10px] text-gray-600 font-medium text-center whitespace-nowrap group-hover:text-violet-600 transition">{store.name}</span>
            <span className="text-[9px] text-green-600 font-semibold">{store.tag}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function PopularBrands() {
  const brands = [
    { name: 'Apple',    logo: '/logo_apple.svg',    bg: 'bg-gray-900' },    // Apple: dark gray
    { name: 'Samsung',  logo: '/logo_samsung.png',  bg: 'bg-blue-700' },    // Samsung: blue
    { name: 'Logitech',logo: '/logo_logitech.svg', bg: 'bg-sky-500' },     // Logitech: sky blue
    { name: 'Anker',    logo: '/logo_anker.png',    bg: 'bg-gray-800' },    // Anker: dark
    { name: 'Dyson',    logo: '/logo_dyson.png',    bg: 'bg-purple-700' },  // Dyson: purple
    { name: 'JBL',      logo: '/logo_jbl.png',      bg: 'bg-orange-500' },  // JBL: orange
    { name: 'Nintendo', logo: '/logo_nintendo.png', bg: 'bg-red-600' },     // Nintendo: red
  ];
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
      <h3 className="font-bold text-gray-800 text-sm mb-3">🏷️ แบรนด์ยอดนิยม</h3>
      <div className="grid grid-cols-4 lg:grid-cols-8 gap-2">
        {brands.map((brand) => (
          <a key={brand.name} href={`/search?brand=${brand.name}`} className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-gray-50 transition group">
            <div className={`w-10 h-10 rounded-xl ${brand.bg} border border-gray-200 flex items-center justify-center group-hover:border-violet-200 transition`}>
              <img src={brand.logo} alt={brand.name} className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <span className="text-[10px] text-gray-500 font-medium group-hover:text-violet-600 transition">{brand.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${API_BASE}/api/products/`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setProducts(data.slice(0, 24));
      } catch (err) {
        console.error('API error:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const displayProducts = products.length > 0 ? products : (fallbackProducts as any);

  return (
    <div className="min-h-screen bg-[#F5F5FA]">
      {/* Top Navbar */}
      <TopNavbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Hero Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 p-6 lg:p-8 mb-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <h2 className="text-2xl lg:text-4xl font-black text-white leading-tight mb-2 relative z-10">ค้นหาของที่ใช่<br />ในราคาที่คุ้มที่สุด</h2>
          <p className="text-white/80 text-sm mb-4 relative z-10">เปรียบเทียบราคาจาก Shopee, Lazada และ TikTok Shop</p>
          <div className="relative z-10 flex gap-2 max-w-md">
            <input placeholder="ลองค้นหา เช่น iPhone 15, MacBook..." className="flex-1 bg-white rounded-xl px-4 py-2.5 text-sm text-black outline-none shadow-lg" />
            <button className="bg-white text-violet-600 px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg">🔍</button>
          </div>
        </div>

        {/* Category Row */}
        <CategoryRow />

        {/* Flash Sale */}
        <FlashSaleSection />

        {/* Mall Section */}
        <MallSection />

        {/* Popular Brands */}
        <PopularBrands />

        {/* Just For You - Product Grid */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">💖</span>
              <h2 className="text-lg font-black text-gray-800">Just For You</h2>
              <span className="text-xs text-gray-400 font-medium ml-1">สินค้าแนะนำสำหรับคุณ</span>
            </div>
            <a href="/search" className="text-violet-600 font-semibold text-sm hover:underline">ดูทั้งหมด →</a>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[1,2,3,4,5,6,7,8,9,10,11,12].map((i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-2.5 animate-pulse">
                  <div className="w-full h-28 bg-gray-200 rounded-lg mb-2" />
                  <div className="h-3.5 bg-gray-200 rounded mb-1.5 w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {displayProducts.map((p: any, i: number) => (
                <ProductCard key={p.id || i} product={p} />
              ))}
            </div>
          )}
        </div>

        {/* Bottom spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
}