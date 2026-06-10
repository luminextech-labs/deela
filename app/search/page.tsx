'use client';

import { useState, useEffect } from 'react';
import MobileSidebar from '../components/MobileSidebar';
import ProductCard from '../components/ProductCard';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://deela-production.up.railway.app';

const filterCategories = [
  { name: 'หูฟังบลูทูธ', count: 856 },
  { name: 'หูฟังแบบเกม', count: 234 },
  { name: 'หูฟังติดหู', count: 567 },
  { name: 'หูฟังครอบหู', count: 189 },
  { name: 'ลำโพงบลูทูธ', count: 432 },
  { name: 'Soundbar', count: 123 },
  { name: 'ไมค์', count: 345 },
  { name: 'กล้องเว็บแคม', count: 234 },
];

const sortOptions = [
  { value: 'relevance', label: 'ความเกี่ยวข้อง' },
  { value: 'price_asc', label: 'ราคา: ต่ำ → สูง' },
  { value: 'price_desc', label: 'ราคา: สูง → ต่ำ' },
  { value: 'rating', label: 'คะแนนสูงสุด' },
  { value: 'sold', label: 'ขายดีสุด' },
];

const mockProducts = [
  { id: '1', name: 'หูฟังบลูทูธ Anker Soundcore P20i รุ่นใหม่ล่าสุด TWS', price: 690, oldPrice: 1290, discount: 47, shop: 'Shopee', rating: 4.7, reviews: 1234, sold: 5600, image: '/placeholder.jpg' },
  { id: '2', name: 'QCY T13X หูฟังบลูทูธ ราคาถูก คุณภาพดี', price: 399, oldPrice: 699, discount: 43, shop: 'Lazada', rating: 4.5, reviews: 856, sold: 3400, image: '/placeholder.jpg' },
  { id: '3', name: 'Redmi Buds 4 Lite หูฟังไร้สาย รุ่นจีน', price: 599, oldPrice: 999, discount: 40, shop: 'Shopee', rating: 4.3, reviews: 2341, sold: 12000, image: '/placeholder.jpg' },
  { id: '4', name: 'Sony WF-C500 หูฟังไร้สาย วงเสียงใส', price: 1490, oldPrice: 2490, discount: 40, shop: 'Lazada', rating: 4.6, reviews: 1567, sold: 3200, image: '/placeholder.jpg' },
  { id: '5', name: 'JBL Tune 230NC หูฟัง TWS พร้อม ANC', price: 1990, oldPrice: 3990, discount: 50, shop: 'TikTok', rating: 4.4, reviews: 892, sold: 2100, image: '/placeholder.jpg' },
  { id: '6', name: 'Samsung Galaxy Buds2 หูฟังไร้สาย ANC', price: 2990, oldPrice: 4990, discount: 40, shop: 'Shopee', rating: 4.7, reviews: 3456, sold: 8700, image: '/placeholder.jpg' },
  { id: '7', name: 'Apple AirPods Pro 2 (USB-C) รุ่นใหม่', price: 7990, oldPrice: 9990, discount: 20, shop: 'Lazada', rating: 4.8, reviews: 5670, sold: 15000, image: '/placeholder.jpg' },
  { id: '8', name: 'Sony WH-1000XM5 หูฟังครอบหู ANC ระดับท็อป', price: 8990, oldPrice: 12900, discount: 30, shop: 'Shopee', rating: 4.9, reviews: 2340, sold: 4500, image: '/placeholder.jpg' },
  { id: '9', name: 'Logitech G Pro X Superlight 2 เมาส์ไร้สาย', price: 4590, oldPrice: 5990, discount: 23, shop: 'Lazada', rating: 4.9, reviews: 1230, sold: 2100, image: '/placeholder.jpg' },
  { id: '10', name: 'MacBook Air M3 13" 8GB/256GB สีใหม่', price: 36900, oldPrice: 44900, discount: 18, shop: 'Shopee', rating: 4.8, reviews: 2340, sold: 1800, image: '/placeholder.jpg' },
  { id: '11', name: 'iPhone 15 Pro Max 256GB ราคาพิเศษ', price: 41900, oldPrice: 54900, discount: 24, shop: 'Lazada', rating: 4.9, reviews: 8560, sold: 12000, image: '/placeholder.jpg' },
  { id: '12', name: 'Nintendo Switch OLED พร้อมเกมติดตั้ง', price: 10900, oldPrice: 13900, discount: 22, shop: 'TikTok', rating: 4.7, reviews: 4560, sold: 6700, image: '/placeholder.jpg' },
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

export default function SearchPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('relevance');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q') || '';
    setSearchQuery(q);

    async function fetchProducts() {
      try {
        const url = q ? `${API_BASE}/api/products/search?q=${encodeURIComponent(q)}` : `${API_BASE}/api/products`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setProducts(data);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const displayProducts = products.length > 0 ? products : (mockProducts as any);

  return (
    <div className="min-h-screen bg-[#F5F5FA] flex">
      {/* Left Sidebar - Desktop Filter */}
      <aside className="w-[240px] bg-white border-r border-gray-100 p-5 flex flex-col h-screen sticky top-0 overflow-y-auto flex-shrink-0 hidden lg:flex">
        <img src="/logo.png" alt="deela logo" className="h-14 mb-6 object-contain" />

        <div className="mb-6">
          <h3 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-3">📂 หมวดหมู่สินค้า</h3>
          <div className="space-y-0.5">
            {filterCategories.map((cat) => (
              <label key={cat.name} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.name)}
                    onChange={() => toggleCategory(cat.name)}
                    className="w-3.5 h-3.5 rounded border-gray-300 text-violet-600 accent-violet-600"
                  />
                  <span className="text-xs text-gray-600">{cat.name}</span>
                </div>
                <span className="text-[10px] text-gray-400">{cat.count.toLocaleString()}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-3">💰 ช่วงราคา</h3>
          <div className="space-y-0.5">
            {[
              { label: 'ทุกราคา', min: 0, max: 999999 },
              { label: '฿0 - ฿500', min: 0, max: 500 },
              { label: '฿500 - ฿1,500', min: 500, max: 1500 },
              { label: '฿1,500 - ฿5,000', min: 1500, max: 5000 },
              { label: '฿5,000 - ฿15,000', min: 5000, max: 15000 },
              { label: '฿15,000 ขึ้นไป', min: 15000, max: 999999 },
            ].map((range, i) => (
              <label key={i} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition">
                <input
                  type="radio"
                  name="priceRange"
                  checked={priceRange?.[0] === range.min}
                  onChange={() => setPriceRange([range.min, range.max])}
                  className="w-3.5 h-3.5 text-violet-600 accent-violet-600"
                />
                <span className="text-xs text-gray-600">{range.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-3">⭐ คะแนนรีวิว</h3>
          <div className="space-y-0.5">
            {[4, 3, 2, 1].map((r) => (
              <label key={r} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition">
                <input
                  type="radio"
                  name="rating"
                  checked={minRating === r}
                  onChange={() => setMinRating(r)}
                  className="w-3.5 h-3.5 text-violet-600 accent-violet-600"
                />
                <div className="flex items-center gap-0.5">
                  {Array.from({length: 5}).map((_, i) => (
                    <span key={i} className={`text-xs ${i < r ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                  ))}
                  <span className="text-[10px] text-gray-500 ml-1">{r}+ ดาว</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={() => { setSelectedCategories([]); setPriceRange(null); setMinRating(0); }}
          className="w-full py-2 text-xs font-semibold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
        >
          🔄 ล้างตัวกรอง
        </button>

        {/* Sidebar user */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="bg-violet-50 rounded-2xl p-3 flex items-center gap-3">
            <img src="/placeholder.jpg" alt="" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <div className="font-semibold text-sm">Nattawat</div>
              <div className="text-xs text-gray-500">Premium</div>
            </div>
          </div>
        </div>
      </aside>

      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activePage="/search" />

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Search Header */}
        <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <a href="/" className="text-gray-500 hover:text-gray-700 text-xl">←</a>
            <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-2.5">
              <span className="text-gray-400 text-lg">🔍</span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาสินค้า..."
                className="flex-1 bg-transparent outline-none text-sm text-gray-700"
              />
            </div>
            <a href={`/search?q=${encodeURIComponent(searchQuery)}`} className="px-5 py-2 rounded-xl bg-violet-600 text-white font-semibold text-sm">ค้นหา</a>
            <button className="text-gray-500 text-lg">❤️</button>
          </div>
        </div>

        {/* Results */}
        <div className="p-4">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-4 bg-white rounded-xl px-4 py-3 border border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">พบ</span>
              <span className="font-bold text-gray-800">{displayProducts.length}</span>
              <span className="text-sm text-gray-500">รายการ</span>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-xl text-sm text-gray-600"
              >
                🎛️ ตัวกรอง
              </button>
            </div>
          </div>

          {/* Active filters */}
          {(selectedCategories.length > 0 || priceRange || minRating > 0) && (
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs text-gray-500">ตัวกรอง:</span>
              {selectedCategories.map((cat) => (
                <span key={cat} className="flex items-center gap-1 bg-violet-100 text-violet-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {cat}
                  <button onClick={() => toggleCategory(cat)} className="ml-1 hover:text-violet-900">✕</button>
                </span>
              ))}
              {priceRange && (
                <span className="bg-violet-100 text-violet-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  ฿{priceRange[0].toLocaleString()} - ฿{priceRange[1] >= 999999 ? '∞' : priceRange[1].toLocaleString()}
                  <button onClick={() => setPriceRange(null)} className="ml-1">✕</button>
                </span>
              )}
              {minRating > 0 && (
                <span className="bg-violet-100 text-violet-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  ⭐ {minRating}+
                  <button onClick={() => setMinRating(0)} className="ml-1">✕</button>
                </span>
              )}
            </div>
          )}

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {[1,2,3,4,5,6,7,8,9,10,11,12].map((i) => (
                <div key={i} className="bg-white rounded-xl p-2.5 animate-pulse border border-gray-100">
                  <div className="w-full h-28 bg-gray-200 rounded-lg mb-2" />
                  <div className="h-3.5 bg-gray-200 rounded mb-1.5 w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {displayProducts.map((p: any, i: number) => (
                <ProductCard key={p.id || i} product={p} />
              ))}
            </div>
          )}

          {/* Load more */}
          <div className="mt-6 text-center">
            <button className="px-8 py-3 bg-white border-2 border-violet-200 text-violet-600 font-bold rounded-2xl hover:bg-violet-50 transition">
              โหลดเพิ่มเติม ↓
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}