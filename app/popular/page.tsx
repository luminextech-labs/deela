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

export default function PopularPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try trending endpoint first, fallback to products list
    async function fetchProducts() {
      try {
        const res = await fetch(`${API_BASE}/api/trending/deals`);
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data.slice(0, 24));
        } else if (data.products) {
          setProducts(data.products.slice(0, 24));
        } else {
          throw new Error('Invalid format');
        }
      } catch {
        // Fallback to products list
        try {
          const res2 = await fetch(`${API_BASE}/api/products/`);
          if (!res2.ok) throw new Error('Failed');
          const data2 = await res2.json();
          setProducts(data2.slice(0, 24));
        } catch {
          setProducts([]);
        }
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
            { name: 'สินค้ายอดนิยม', href: '/popular', icon: '/icons/icon_popular.png', active: true },
            { name: 'เปรียบเทียบ', href: '/compare', icon: '/icons/icon_compare.png' },
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

      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activePage="/popular" />

      <main className="flex-1 min-w-0 pb-20">
        <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <a href="/" className="text-gray-400 hover:text-gray-600 text-xl">←</a>
            <div className="flex items-center gap-2">
              <span className="text-xl">📈</span>
              <h1 className="text-lg font-bold text-gray-800">สินค้ายอดนิยม</h1>
            </div>
          </div>
        </div>

        <div className="p-4 lg:p-6">
          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-5 mb-5">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏆</span>
              <div>
                <h2 className="text-white font-black text-lg">สินค้าขายดีที่สุด</h2>
                <p className="text-white/80 text-sm">คัดสรรจากยอดขายและรีวิวจริง</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {[1,2,3,4,5,6,7,8,9,10].map((i) => (
                <div key={i} className="bg-white rounded-xl p-2.5 animate-pulse border border-gray-100">
                  <div className="w-full h-32 bg-gray-200 rounded-lg mb-2" />
                  <div className="h-3.5 bg-gray-200 rounded mb-1.5 w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">📭</div>
              <h3 className="font-bold text-gray-700 text-lg mb-1">ยังไม่มีข้อมูล</h3>
              <p className="text-gray-400 text-sm">ลองเช็คอีกครั้งในไม่ช้า</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">แนะนำ {products.length} รายการ</p>
                <div className="flex items-center gap-2">
                  <button className="text-xs px-3 py-1.5 bg-violet-100 text-violet-700 rounded-full font-medium">🔥 ขายดี</button>
                  <button className="text-xs px-3 py-1.5 bg-gray-100 text-gray-500 rounded-full font-medium hover:bg-gray-200 transition">⭐ คะแนนสูง</button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {products.map((p: any, i: number) => (
                  <ProductCard key={p.id || i} product={p} rank={i + 1} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}