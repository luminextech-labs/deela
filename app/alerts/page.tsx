'use client';

import { useState, useEffect } from 'react';
import { fetchProducts } from '@/lib/api';
import MobileSidebar from '../components/MobileSidebar';

// Fetch products from API
async function getTrackedProducts() {
  try {
    const products = await fetchProducts();
    return products.slice(0, 10).map((p: any) => ({
      id: p.id,
      name: p.name,
      currentPrice: p.lowest_price || 0,
      originalPrice: p.highest_price || p.lowest_price || 0,
      drop: p.original_price ? p.original_price - (p.lowest_price || 0) : 0,
      dropPercent: p.original_price && p.lowest_price 
        ? Math.round((1 - (p.lowest_price / p.original_price)) * 100) : 0,
      cheapestShop: p.prices?.[0]?.platform || 'N/A',
      cheapestLogo: getLogoForPlatform(p.prices?.[0]?.platform),
      history: generateMockHistory(p.lowest_price || 25000),
      lowestPrice: p.lowest_price || 0,
      slug: p.slug,
      imageUrl: p.image_url,
    }));
  } catch (e) {
    console.error('Failed to fetch products:', e);
    return [];
  }
}

function getLogoForPlatform(platform: string) {
  switch (platform) {
    case 'shopee': return '/logo_shopee.png';
    case 'lazada': return '/logo_lazada.png';
    case 'tiktok': return '/logo_tiktok.png';
    default: return '/placeholder.jpg';
  }
}

function generateMockHistory(currentPrice: number) {
  // Generate realistic price history that ends at current price
  const history = [];
  let price = currentPrice * 1.15; // Start 15% higher
  for (let i = 0; i < 10; i++) {
    history.push(Math.round(price));
    price = price * (0.95 + Math.random() * 0.08); // Fluctuate downward
  }
  history[history.length - 1] = currentPrice; // End at current price
  return history;
}

function PriceChart({ data }: { data: number[] }) {
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
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getTrackedProducts();
      setProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5FA] flex">
      <aside className="w-[240px] bg-white border-r border-gray-100 p-6 flex flex-col h-screen sticky top-0 overflow-y-auto flex-shrink-0 hidden lg:flex">
        <img src="/logo.png" alt="deela logo" className="h-16 mb-8 object-contain" />
        <nav className="space-y-1 mb-8">
          {[
            { name: 'หน้าหลัก', href: '/', icon: '/icons/icon_home_menu.jpg' },
            { name: 'ค้นหา', href: '/search', icon: '/icons/icon_search.jpg' },
            { name: 'หมวดหมู่', href: '/categories', icon: '/icons/icon_categories.jpg' },
            { name: 'สินค้ายอดนิยม', href: '/popular', icon: '/icons/icon_popular.jpg' },
            { name: 'เปรียบเทียบ', href: '/compare', icon: '/icons/icon_compare.jpg' },
            { name: 'ติดตามราคา', href: '/alerts', icon: '/icons/icon_alerts.jpg', active: true },
            { name: 'ประวัติการเข้าชม', href: '/history', icon: '/icons/icon_history.jpg' },
            { name: 'รายการโปรด', href: '/favorites', icon: '/icons/icon_favorites.jpg' },
          ].map((item) => (
            <a key={item.name} href={item.href} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition font-medium text-sm ${item.active ? 'bg-violet-50 text-violet-700' : 'text-gray-600 hover:bg-gray-50'}`}>
              <img src={item.icon} alt={item.name} className="w-5 h-5 object-contain shrink-0" />
              <span>{item.name}</span>
            </a>
          ))}
        </nav>
        <div className="mt-auto mb-4">
          <span className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 font-semibold">หมวดหมู่</span>
          <div className="space-y-1">
            {['อิเล็กทรอนิกส์', 'มือถือ & แก็ดเจ็ต', 'คอมพิวเตอร์', 'หูฟัง & เสียง', 'เกมมิ่งเกียร์', 'บ้าน & ไลฟ์สไตล์', 'สุขภาพ & ความงาม', 'แฟชั่น'].map((cat) => (
              <a key={cat} href="#" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 cursor-pointer hover:text-violet-600 hover:bg-violet-50 rounded-lg transition">{cat}</a>
            ))}
          </div>
        </div>
        <div className="bg-violet-50 rounded-2xl p-3 flex items-center gap-3">
          <img src="/placeholder.jpg" alt="" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <div className="font-semibold text-sm">Nattawat</div>
            <div className="text-xs text-gray-500">Premium</div>
          </div>
        </div>
      </aside>

      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activePage="/alerts" />

      <main className="flex-1 min-w-0 pb-20">
        {/* Mobile header */}
        <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <a href="/" className="text-gray-500 hover:text-gray-700 text-xl">←</a>
            <h1 className="text-lg font-bold text-gray-800">🔔 ติดตามราคา</h1>
          </div>
        </div>

        <div className="p-4 lg:p-6">

          {/* Header row: tabs + add button */}
          <div className="flex items-center justify-between mb-4">
            {/* Tabs */}
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab('tracking')}
                className={`text-sm font-semibold pb-1 border-b-2 transition ${
                  activeTab === 'tracking'
                    ? 'border-violet-600 text-violet-700'
                    : 'border-transparent text-gray-400'
                }`}
              >
                สินค้าที่ติดตาม ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('alerts')}
                className={`text-sm font-semibold pb-1 border-b-2 transition ${
                  activeTab === 'alerts'
                    ? 'border-violet-600 text-violet-700'
                    : 'border-transparent text-gray-400'
                }`}
              >
                แจ้งเตือนราคา
              </button>
            </div>
            {/* Add button */}
            <button className="bg-violet-100 hover:bg-violet-200 text-violet-700 font-semibold text-xs px-4 py-2 rounded-full">
              + เพิ่มสินค้าติดตาม
            </button>
          </div>

          {/* Time range pills */}
          <div className="flex gap-2 mb-5">
            {['7 วัน', '30 วัน', '90 วัน'].map((range) => (
              <button
                key={range}
                onClick={() => setActiveRange(range)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition ${
                  activeRange === range
                    ? 'bg-violet-600 text-white'
                    : 'bg-white text-gray-500 border border-gray-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Product list */}
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-12 text-gray-400">กำลังโหลดข้อมูล...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 text-gray-400">ยังไม่มีสินค้าที่ติดตาม</div>
            ) : products.map((product: any) => (
              <div key={product.id} className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center gap-4">
                {/* Product image */}
                <img
                  src={product.imageUrl || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-20 h-20 rounded-2xl object-cover shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }}
                />

                {/* Product info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base text-gray-800 leading-tight">{product.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <img src={product.cheapestLogo} alt={product.cheapestShop} className="w-4 h-4 object-contain" />
                    <span className="text-sm text-gray-400">{product.cheapestShop}</span>
                  </div>
                </div>

                {/* Price info */}
                <div className="text-right shrink-0">
                  <div className="font-black text-lg text-gray-800">฿{product.currentPrice.toLocaleString()}</div>
                  <div className="text-sm text-green-600 font-semibold">
                    -{product.dropPercent}%
                  </div>
                </div>

                {/* Price chart */}
                <div className="flex-1 hidden md:block">
                  <PriceChart data={product.history} />
                  <div className="text-xs text-gray-400 mt-1">
                    ต่ำสุด: ฿{product.lowestPrice.toLocaleString()}
                  </div>
                </div>

                {/* Alert button */}
                <button className="w-11 h-11 rounded-2xl border-2 border-violet-200 flex items-center justify-center text-violet-500 shrink-0 hover:border-violet-400 hover:bg-violet-50 transition text-xl">
                  🔔
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
