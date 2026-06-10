'use client';

import { useState, useEffect } from 'react';
import MobileSidebar from '../components/MobileSidebar';
import ProductCard from '../components/ProductCard';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'https://deela-foa0.onrender.com').replace(/\/$/, '');

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  lowest_price: string;
  highest_rating: string;
}

export default function HistoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${API_BASE}/api/products/`);
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setProducts(data.slice(0, 20));
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
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
            { name: 'ติดตามราคา', href: '/alerts', icon: '/icons/icon_alerts.png' },
            { name: 'ประวัติการเข้าชม', href: '/history', icon: '/icons/icon_history.png', active: true },
            { name: 'รายการโปรด', href: '/favorites', icon: '/icons/icon_favorites.png' },
          ].map((item) => (
            <a key={item.name} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition font-medium text-sm ${item.active ? 'bg-violet-50 text-violet-700' : 'text-gray-600 hover:bg-gray-50'}`}>
              <img src={item.icon} alt={item.name} className="w-5 h-5 object-contain shrink-0" />
              <span>{item.name}</span>
            </a>
          ))}
        </nav>
      </aside>

      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activePage="/history" />

      <main className="flex-1 min-w-0 pb-20">
        <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <a href="/" className="text-gray-400 hover:text-gray-600 text-xl">←</a>
            <div className="flex items-center gap-2">
              <span className="text-xl">📋</span>
              <h1 className="text-lg font-bold text-gray-800">ประวัติการเข้าชม</h1>
              {!loading && <span className="text-sm text-gray-400">({products.length} รายการ)</span>}
            </div>
          </div>
        </div>

        <div className="p-4 lg:p-6">
          {loading ? (
            <div className="space-y-3">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="bg-white rounded-xl p-4 flex items-center gap-4 animate-pulse border border-gray-100">
                  <div className="w-16 h-16 bg-gray-200 rounded-xl shrink-0" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-16" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">📭</div>
              <h3 className="font-bold text-gray-700 text-lg mb-1">ยังไม่มีประวัติการเข้าชม</h3>
              <p className="text-gray-400 text-sm">เริ่มสำรวจสินค้าต่างๆ เพื่อดูประวัติที่นี่</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">สินค้าที่คุณเพิ่งดู {products.length} รายการ</p>
                <button className="text-xs text-gray-400 hover:text-gray-600">🗑️ ล้างประวัติ</button>
              </div>
              <div className="space-y-3">
                {products.map((p: any, i: number) => (
                  <div key={p.id || i} className="bg-white rounded-xl p-4 flex items-center gap-4 border border-gray-100 hover:shadow-md transition cursor-pointer group">
                    <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                      <img
                        src={p.image_url || '/placeholder.png'}
                        alt={p.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-gray-800 leading-tight line-clamp-2 group-hover:text-violet-600 transition">{p.name}</h3>
                      {p.highest_rating && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-yellow-400 text-xs">⭐</span>
                          <span className="text-xs font-medium">{p.highest_rating}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-gray-800">฿{Number(p.lowest_price || 0).toLocaleString()}</div>
                      <a href={`/product/${p.slug}`} className="mt-1 inline-block bg-violet-100 text-violet-700 px-3 py-1.5 rounded-lg font-semibold text-xs hover:bg-violet-200 transition">
                        ซื้อเลย
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}