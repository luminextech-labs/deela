'use client';

import { useState, useEffect } from 'react';
import MobileSidebar from '../components/MobileSidebar';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'https://deela-foa0.onrender.com').replace(/\/$/, '');

interface TrackedProduct {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  lowest_price: string;
  highest_rating: string;
  history: number[];
  platform: string;
}

function getLogoForPlatform(platform: string) {
  switch (platform?.toLowerCase()) {
    case 'shopee': return '/logo_shopee.png';
    case 'lazada': return '/logo_lazada.png';
    case 'tiktok': return '/logo_tiktok.png';
    default: return '/logo_shopee.png';
  }
}

function generateHistory(currentPrice: number) {
  const history = [];
  let price = currentPrice * (1.1 + Math.random() * 0.1);
  for (let i = 0; i < 10; i++) {
    history.push(Math.round(price));
    price = price * (0.95 + Math.random() * 0.08);
  }
  history[history.length - 1] = currentPrice;
  return history;
}

function PriceChart({ data }: { data: number[] }) {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 40 - ((v - min) / range) * 36;
    return `${x},${y}`;
  });
  return (
    <svg viewBox="0 0 100 40" className="w-full h-10" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={pts.join(' ') + ',100,0'} fill="url(#chartGrad)" />
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke="#8B5CF6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AlertsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('tracking');
  const [activeRange, setActiveRange] = useState('30 วัน');
  const [products, setProducts] = useState<TrackedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/products/`);
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        const tracked = data.slice(0, 10).map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          image_url: p.image_url || '/placeholder.png',
          lowest_price: p.lowest_price || '0',
          highest_rating: p.highest_rating || '0',
          history: generateHistory(Number(p.lowest_price) || 1000),
          platform: 'Shopee',
        }));
        setProducts(tracked);
      } catch (e) {
        console.error(e);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5FA] flex">
      <aside className="w-[260px] bg-white border-r border-gray-100 p-5 flex flex-col h-screen sticky top-0 overflow-y-auto flex-shrink-0 hidden lg:flex">
        <img src="/logo.png" alt="Deela" className="h-12 mb-5 object-contain" />
        <nav className="space-y-1">
          {[
            { name: 'หน้าหลัก', href: '/', icon: '/icons/icon_home_menu.png' },
            { name: 'ค้นหา', href: '/search', icon: '/icons/icon_search.png' },
            { name: 'หมวดหมู่', href: '/categories', icon: '/icons/icon_categories.png' },
            { name: 'สินค้ายอดนิยม', href: '/popular', icon: '/icons/icon_popular.png' },
            { name: 'เปรียบเทียบ', href: '/compare', icon: '/icons/icon_compare.png' },
            { name: 'ติดตามราคา', href: '/alerts', icon: '/icons/icon_alerts.png', active: true },
            { name: 'ประวัติการเข้าชม', href: '/history', icon: '/icons/icon_history.png' },
            { name: 'รายการโปรด', href: '/favorites', icon: '/icons/icon_favorites.png' },
          ].map((item) => (
            <a key={item.name} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition font-medium text-sm ${item.active ? 'bg-violet-50 text-violet-700' : 'text-gray-600 hover:bg-gray-50'}`}>
              <img src={item.icon} alt={item.name} className="w-5 h-5 object-contain shrink-0" />
              <span>{item.name}</span>
            </a>
          ))}
        </nav>
      </aside>

      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activePage="/alerts" />

      <main className="flex-1 min-w-0 pb-20">
        <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <a href="/" className="text-gray-400 hover:text-gray-600 text-xl">←</a>
            <div className="flex items-center gap-2">
              <span className="text-xl">🔔</span>
              <h1 className="text-lg font-bold text-gray-800">ติดตามราคา</h1>
            </div>
          </div>
        </div>

        <div className="p-4 lg:p-6">
          {/* Header row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab('tracking')}
                className={`text-sm font-semibold pb-1 border-b-2 transition ${
                  activeTab === 'tracking' ? 'border-violet-600 text-violet-700' : 'border-transparent text-gray-400'
                }`}
              >
                สินค้าที่ติดตาม ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('alerts')}
                className={`text-sm font-semibold pb-1 border-b-2 transition ${
                  activeTab === 'alerts' ? 'border-violet-600 text-violet-700' : 'border-transparent text-gray-400'
                }`}
              >
                แจ้งเตือนราคา
              </button>
            </div>
            <button className="bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs px-4 py-2 rounded-full transition flex items-center gap-1.5">
              <span>+</span> เพิ่มสินค้าติดตาม
            </button>
          </div>

          {/* Time range pills */}
          <div className="flex gap-2 mb-5">
            {['7 วัน', '30 วัน', '90 วัน'].map((range) => (
              <button
                key={range}
                onClick={() => setActiveRange(range)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition ${
                  activeRange === range ? 'bg-violet-600 text-white' : 'bg-white text-gray-500 border border-gray-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Empty state */}
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center gap-4 animate-pulse">
                  <div className="w-20 h-20 bg-gray-200 rounded-2xl" />
                  <div className="flex-1"><div className="h-4 bg-gray-200 rounded w-3/4 mb-2" /><div className="h-3 bg-gray-200 rounded w-1/2" /></div>
                  <div className="h-6 bg-gray-200 rounded w-20" />
                  <div className="w-32 h-10 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">🔔</div>
              <h3 className="font-bold text-gray-700 text-lg mb-1">ยังไม่มีสินค้าที่ติดตาม</h3>
              <p className="text-gray-400 text-sm mb-4">เพิ่มสินค้าที่ต้องการติดตามเพื่อรับแจ้งเตือนเมื่อราคาลด</p>
              <a href="/search" className="inline-block bg-violet-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-violet-700 transition">ค้นหาสินค้า</a>
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center gap-4 hover:shadow-md transition cursor-pointer">
                  {/* Product image */}
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                  />

                  {/* Product info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-gray-800 leading-tight line-clamp-2">{product.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <img src={getLogoForPlatform(product.platform)} alt={product.platform} className="w-4 h-4 object-contain" />
                      <span className="text-xs text-gray-400">{product.platform}</span>
                      <span className="text-xs text-gray-300">•</span>
                      <span className="text-xs text-yellow-500">⭐ {Number(product.highest_rating).toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Price info */}
                  <div className="text-right shrink-0 min-w-[80px]">
                    <div className="font-black text-lg text-gray-800">฿{Number(product.lowest_price).toLocaleString()}</div>
                    <div className="text-xs text-green-600 font-semibold">ต่ำสุด</div>
                  </div>

                  {/* Price chart */}
                  <div className="flex-1 hidden md:block px-2">
                    <PriceChart data={product.history} />
                    <div className="text-[10px] text-gray-400 text-center mt-0.5">
                      ต่ำสุด ฿{Math.min(...product.history).toLocaleString()}
                    </div>
                  </div>

                  {/* Alert button */}
                  <button className="w-11 h-11 rounded-2xl border-2 border-violet-200 flex items-center justify-center text-violet-400 shrink-0 hover:border-violet-400 hover:bg-violet-50 transition text-xl">
                    🔔
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}