'use client';

import { useState, useEffect } from 'react';
import MobileSidebar from './components/MobileSidebar';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://deela-foa0.onrender.com';

const categories = ['อิเล็กทรอนิกส์', 'มือถือ & แก็ดเจ็ต', 'คอมพิวเตอร์', 'หูฟัง & เสียง', 'เกมมิ่งเกียร์', 'บ้าน & ไลฟ์สไตล์', 'สุขภาพ & ความงาม', 'แฟชั่น'];

const fallbackProducts = [
  { id: 'fallback-1', name: 'Anker Soundcore P20i', lowest_price: '690', image_url: '/placeholder.jpg', shop: 'Shopee', discount: '-47%', old: '฿1,290' },
  { id: 'fallback-2', name: 'iPhone 15 (128GB)', lowest_price: '27,900', image_url: '/placeholder.jpg', shop: 'Lazada', discount: '-12%', old: '฿31,900' },
  { id: 'fallback-3', name: 'Dyson V12 Detect Slim', lowest_price: '18,900', image_url: '/placeholder.jpg', shop: 'Shopee', discount: '-15%', old: '฿22,900' },
  { id: 'fallback-4', name: 'Logitech G304', lowest_price: '890', image_url: '/placeholder.jpg', shop: 'Lazada', discount: '-36%', old: '฿1,390' },
  { id: 'fallback-5', name: 'Samsung Galaxy Buds FE', lowest_price: '2,990', image_url: '/placeholder.jpg', shop: 'TikTok', discount: '-25%', old: '฿3,990' },
  { id: 'fallback-6', name: 'iPad Pro M4 11"', lowest_price: '34,900', image_url: '/placeholder.jpg', shop: 'Shopee', discount: '-10%', old: '฿38,900' },
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

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${API_BASE}/api/products`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        // Take first 12 products
        setProducts(data.slice(0, 12));
      } catch (err) {
        console.error('API error:', err);
        setError('ไม่สามารถโหลดข้อมูลได้');
        // Use fallback data
        setProducts(fallbackProducts as any);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const getShopLogo = (shop: string) => {
    if (shop === 'Shopee') return '/logo_shopee.png';
    if (shop === 'Lazada') return '/logo_lazada.png';
    if (shop === 'TikTok') return '/logo_tiktok.png';
    return '/logo_shopee.png';
  };

  return (
    <div className="min-h-screen bg-[#F5F5FA] flex">
      {/* Left Sidebar - Desktop */}
      <aside className="w-[240px] bg-white border-r border-gray-100 p-6 flex flex-col h-screen sticky top-0 overflow-y-auto flex-shrink-0 hidden lg:flex">
        <img src="/logo.png" alt="deela logo" className="h-16 mb-8 object-contain" />

        <nav className="space-y-1 mb-8">
          {[
            { name: 'หน้าหลัก', href: '/', icon: '/icons/icon_home_menu.jpg', active: true },
            { name: 'ค้นหา', href: '/search', icon: '/icons/icon_search.jpg' },
            { name: 'หมวดหมู่', href: '/categories', icon: '/icons/icon_categories.jpg' },
            { name: 'สินค้ายอดนิยม', href: '/popular', icon: '/icons/icon_popular.jpg' },
            { name: 'เปรียบเทียบ', href: '/compare', icon: '/icons/icon_compare.jpg' },
            { name: 'ติดตามราคา', href: '/alerts', icon: '/icons/icon_alerts.jpg' },
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
          <span className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 font-semibold cursor-default">หมวดหมู่</span>
          <div className="space-y-1">
            {categories.map((cat) => (
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

      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 px-4 py-3 z-40 lg:hidden">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileMenuOpen(true)} className="text-gray-600 text-xl p-1">☰</button>
          <img src="/logo.png" alt="deela logo" className="h-8 object-contain" />
          <div className="flex-1" />
          <button className="text-gray-400 text-lg">🔔</button>
        </div>
      </div>

      <MobileSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} activePage="/" />

      {/* Main Content */}
      <main className="flex-1 min-w-0 pt-14 lg:pt-0">
        <div className="bg-white border-b border-gray-100 px-8 py-4 sticky top-0 z-30 hidden lg:block">
          <div className="flex items-center gap-4">
            <div className="flex-1 flex items-center gap-3 bg-gray-100 rounded-2xl px-5 py-3">
              <span className="text-gray-400">🔍</span>
              <input placeholder="ค้นหาสินค้า..." className="flex-1 bg-transparent outline-none text-sm text-gray-700" />
            </div>
            <button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-500 text-white font-semibold text-sm shadow-lg">ค้นหา</button>
            <button className="text-gray-400 hover:text-gray-600 text-xl">🔔</button>
          </div>
        </div>

        <div className="p-4 lg:p-8">
          <div className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 p-6 lg:p-10 mb-6 relative overflow-hidden">
            <h2 className="text-2xl lg:text-4xl font-black text-white leading-tight mb-2">ค้นหาของที่ใช่<br />ในราคาที่คุ้มที่สุด</h2>
            <p className="text-white/80 text-sm mb-4">เปรียบเทียบราคาจาก Shopee, Lazada และ TikTok Shop</p>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 flex items-center gap-2">
              <input placeholder="ลองค้นหา..." className="flex-1 bg-white rounded-lg px-4 py-2 text-sm text-black outline-none" />
              <button className="bg-white text-violet-600 px-5 py-2 rounded-lg font-semibold text-sm">ค้นหา</button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
            {[{icon:'💰',title:'เปรียบเทียบราคา',desc:'ทุกแพลตฟอร์ม'},{icon:'⭐',title:'รีวิวจริง',desc:'จากผู้ซื้อ'},{icon:'🔔',title:'ติดตามราคา',desc:'ลดแล้วบอก'},{icon:'📈',title:'สินค้าอันดับ',desc:'นิยมสุด'}].map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-2xl mb-2">{f.icon}</div>
                <h3 className="font-bold text-sm text-gray-800">{f.title}</h3>
                <p className="text-xs text-gray-500 hidden lg:block">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-black text-gray-800">สินค้ากำลังมาแรง 🔥</h2>
            <a href="/search" className="text-violet-600 font-semibold text-sm">ดูทั้งหมด →</a>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-4 mb-6">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 animate-pulse">
                  <div className="w-full h-24 bg-gray-200 rounded-lg mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-4 mb-6">
              {products.map((p) => (
                <a key={p.id} href={`/product/${p.id}`} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer block">
                  <div className="relative mb-2">
                    <img src={p.image_url || '/placeholder.jpg'} alt={p.name} className="w-full h-24 object-cover rounded-lg" onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }} />
                    <span className="absolute top-1 left-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">Sale</span>
                  </div>
                  <h3 className="font-bold text-xs text-gray-800 mb-1 line-clamp-2">{p.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-base font-black text-red-500">฿{Number(p.lowest_price).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{p.highest_rating} ⭐</span>
                    <button className="bg-violet-600 text-white px-3 py-1 rounded-lg font-semibold text-xs">ดู</button>
                  </div>
                </a>
              ))}
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-gray-800">🔔 ติดตามราคา</h2>
              <a href="/alerts" className="bg-violet-100 text-violet-700 px-4 py-2 rounded-xl font-semibold text-sm">+ เพิ่มสินค้า</a>
            </div>
            <div className="space-y-3">
              {loading ? (
                [1,2,3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 animate-pulse">
                    <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))
              ) : (
                products.slice(0, 3).map((p) => (
                  <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition cursor-pointer">
                    <img src={p.image_url || '/placeholder.jpg'} alt={p.name} className="w-16 h-16 rounded-xl object-cover" onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }} />
                    <div className="flex-1">
                      <div className="font-bold text-sm text-gray-800 truncate">{p.name}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs text-gray-500">{p.highest_rating} ⭐</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-violet-600">฿{Number(p.lowest_price).toLocaleString()}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}