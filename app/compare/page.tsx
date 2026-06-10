'use client';

import { useState, useEffect } from 'react';
import MobileSidebar from '../components/MobileSidebar';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'https://deela-foa0.onrender.com').replace(/\/$/, '');

interface Product {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  lowest_price: string;
  highest_rating: string;
}

function getLogoForPlatform(platform: string) {
  switch (platform) {
    case 'shopee': return '/logo_shopee.png';
    case 'lazada': return '/logo_lazada.png';
    case 'tiktok': return '/logo_tiktok.png';
    default: return '/logo_shopee.png';
  }
}

const specLabels: Record<string, string> = {
  battery: 'แบตเตอร์',
  water: 'กันน้ำ',
  weight: 'น้ำหนัก',
  noiseCancel: 'ตัดเสียง',
  bluetooth: 'Bluetooth',
  charging: 'พอร์ตชาร์จ',
  display: 'จอแสดงผล',
  warranty: 'การรับประกัน',
};

export default function ComparePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${API_BASE}/api/products/`);
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setProducts(data.slice(0, 20));
        // Pre-select first 3 for comparison
        setSelectedProducts(data.slice(0, 3).map((p: any) => p.id));
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const displayProducts = products.filter((p: any) => selectedProducts.includes(p.id)).slice(0, 3);

  const toggleProduct = (id: string) => {
    setSelectedProducts(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

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
            { name: 'เปรียบเทียบ', href: '/compare', icon: '/icons/icon_compare.png', active: true },
            { name: 'ติดตามราคา', href: '/alerts', icon: '/icons/icon_alerts.png' },
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

      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activePage="/compare" />

      <main className="flex-1 min-w-0 pb-20">
        <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <a href="/" className="text-gray-400 hover:text-gray-600 text-xl">←</a>
            <div className="flex items-center gap-2">
              <span className="text-xl">⚖️</span>
              <h1 className="text-lg font-bold text-gray-800">เปรียบเทียบราคา</h1>
            </div>
          </div>
        </div>

        <div className="p-4 lg:p-6">
          {loading ? (
            <div className="text-center py-16 text-gray-400">กำลังโหลด...</div>
          ) : (
            <>
              {/* Product selector */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 shadow-sm">
                <h3 className="font-bold text-sm text-gray-700 mb-3">📋 เลือกสินค้าที่ต้องการเปรียบเทียบ (สูงสุด 3 รายการ)</h3>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {products.slice(0, 12).map((p: any) => (
                    <button
                      key={p.id}
                      onClick={() => toggleProduct(p.id)}
                      className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition ${
                        selectedProducts.includes(p.id)
                          ? 'border-violet-400 bg-violet-50 text-violet-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-violet-200'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                        <img src={p.image_url || '/placeholder.png'} alt={p.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }} />
                      </div>
                      <span className="whitespace-nowrap line-clamp-1">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {displayProducts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-5xl mb-3">⚖️</div>
                  <h3 className="font-bold text-gray-700 text-lg mb-1">เลือกสินค้าที่ต้องการเปรียบเทียบ</h3>
                  <p className="text-gray-400 text-sm">เลือกสินค้าอย่างน้อย 1 รายการ</p>
                </div>
              ) : (
                <>
                  {/* Comparison table */}
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm mb-4">
                    {/* Header row */}
                    <div className="grid" style={{ gridTemplateColumns: `160px repeat(${displayProducts.length}, 1fr)` }}>
                      <div className="p-4 bg-gray-50 flex items-center">
                        <span className="text-sm font-semibold text-gray-500">สินค้า</span>
                      </div>
                      {displayProducts.map((p: any) => (
                        <div key={p.id} className="p-4 text-center border-l border-gray-100">
                          <div className="w-20 h-20 rounded-xl overflow-hidden mx-auto mb-2 bg-gray-50">
                            <img src={p.image_url || '/placeholder.png'} alt={p.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }} />
                          </div>
                          <h3 className="font-bold text-xs text-gray-800 line-clamp-2 leading-tight mb-1">{p.name}</h3>
                          {p.highest_rating && (
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <span className="text-yellow-400 text-xs">⭐</span>
                              <span className="text-xs font-medium">{Number(p.highest_rating).toFixed(1)}</span>
                            </div>
                          )}
                          <div className="text-lg font-black text-red-500">฿{Number(p.lowest_price || 0).toLocaleString()}</div>
                          <a href={`/product/${p.slug}`} className="mt-1 inline-block bg-violet-600 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-violet-700 transition">ดูสินค้า</a>
                        </div>
                      ))}
                    </div>

                    {/* Price row */}
                    <div className="grid border-t border-gray-100" style={{ gridTemplateColumns: `160px repeat(${displayProducts.length}, 1fr)` }}>
                      <div className="p-4 bg-gray-50 flex items-center">
                        <span className="text-sm font-semibold text-gray-500">ราคา</span>
                      </div>
                      {displayProducts.map((p: any) => (
                        <div key={p.id} className="p-4 text-center border-l border-gray-100">
                          <span className="text-lg font-black text-red-500">฿{Number(p.lowest_price || 0).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    {/* Rating row */}
                    <div className="grid border-t border-gray-100" style={{ gridTemplateColumns: `160px repeat(${displayProducts.length}, 1fr)` }}>
                      <div className="p-4 bg-gray-50 flex items-center">
                        <span className="text-sm font-semibold text-gray-500">คะแนน</span>
                      </div>
                      {displayProducts.map((p: any) => (
                        <div key={p.id} className="p-4 text-center border-l border-gray-100">
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-yellow-400 text-sm">⭐</span>
                            <span className="text-sm font-bold">{Number(p.highest_rating || 0).toFixed(1)}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shop row */}
                    <div className="grid border-t border-gray-100" style={{ gridTemplateColumns: `160px repeat(${displayProducts.length}, 1fr)` }}>
                      <div className="p-4 bg-gray-50 flex items-center">
                        <span className="text-sm font-semibold text-gray-500">ร้านค้า</span>
                      </div>
                      {displayProducts.map((p: any) => (
                        <div key={p.id} className="p-4 text-center border-l border-gray-100">
                          <div className="flex items-center justify-center gap-1">
                            <img src="/logo_shopee.png" alt="Shopee" className="w-5 h-5 object-contain" />
                            <img src="/logo_lazada.png" alt="Lazada" className="w-5 h-5 object-contain" />
                            <img src="/logo_tiktok.png" alt="TikTok" className="w-5 h-5 object-contain" />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Buy button row */}
                    <div className="grid border-t border-gray-100" style={{ gridTemplateColumns: `160px repeat(${displayProducts.length}, 1fr)` }}>
                      <div className="p-4 bg-gray-50 flex items-center">
                        <span className="text-sm font-semibold text-gray-500">ซื้อ</span>
                      </div>
                      {displayProducts.map((p: any) => (
                        <div key={p.id} className="p-4 text-center border-l border-gray-100">
                          <a href={`/product/${p.slug}`} className="inline-block bg-violet-600 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-violet-700 transition">
                            ซื้อเลย
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendation */}
                  {displayProducts.length >= 2 && (
                    <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-4 border border-violet-100">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">💡</span>
                        <div className="flex-1">
                          <h3 className="font-bold text-violet-700 text-sm">แนะนำ</h3>
                          <p className="text-xs text-gray-600">
                            {displayProducts[0].name} — ราคาถูกที่สุด ฿{Number(displayProducts[0].lowest_price || 0).toLocaleString()}
                          </p>
                        </div>
                        <a href={`/product/${displayProducts[0].slug}`} className="bg-violet-600 text-white px-4 py-2 rounded-xl font-semibold text-xs whitespace-nowrap hover:bg-violet-700 transition">
                          ซื้อเลย
                        </a>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}