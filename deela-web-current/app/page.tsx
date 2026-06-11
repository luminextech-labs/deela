'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { products, trendingDeals, categories, type Product } from '../lib/data';
import MobileSidebar from './components/MobileSidebar';

function formatPrice(p: number) {
  return '฿' + p.toLocaleString('th-TH');
}

function getBestPrice(product: Product) {
  return product.prices.reduce((a, b) => a.price < b.price ? a : b);
}

const navItems = [
  { name: 'หน้าหลัก', href: '/', icon: '/icons/icon_home_menu.jpg', active: true },
  { name: 'ค้นหา', href: '/search', icon: '/icons/icon_search.jpg' },
  { name: 'หมวดหมู่', href: '/categories', icon: '/icons/icon_categories.jpg' },
  { name: 'สินค้ายอดนิยม', href: '/popular', icon: '/icons/icon_popular.jpg' },
  { name: 'เปรียบเทียบ', href: '/compare', icon: '/icons/icon_compare.jpg' },
  { name: 'ติดตามราคา', href: '/alerts', icon: '/icons/icon_alerts.jpg' },
  { name: 'ประวัติการเข้าชม', href: '/history', icon: '/icons/icon_history.jpg' },
  { name: 'รายการโปรด', href: '/favorites', icon: '/icons/icon_favorites.jpg' },
];

const dealerLogos: Record<string, string> = {
  shopee: '/logo_shopee.png',
  lazada: '/logo_lazada.png',
  tiktok: '/logo_tiktok.png',
};

const featureCards = [
  { icon: '💰', title: 'เปรียบเทียบราคา', desc: 'ทุกแพลตฟอร์ม' },
  { icon: '⭐', title: 'รีวิวจริง', desc: 'จากผู้ซื้อ' },
  { icon: '🔔', title: 'ติดตามราคา', desc: 'ลดแล้วบอก' },
  { icon: '📈', title: 'สินค้าอันดับ', desc: 'นิยมสุด' },
];

// Trending products (sorted by discount)
const trendingProducts = [...products].sort((a, b) => {
  const bestA = getBestPrice(a).discount;
  const bestB = getBestPrice(b).discount;
  return bestB - bestA;
});

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('deela_favorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  function toggleFavorite(productId: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const next = favorites.includes(productId)
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId];
    setFavorites(next);
    localStorage.setItem('deela_favorites', JSON.stringify(next));
  }

  return (
    <div className="min-h-screen bg-[#F5F5FA] flex">
      {/* Left Sidebar - Desktop */}
      <aside className="w-[240px] bg-white border-r border-gray-100 p-6 flex flex-col h-screen sticky top-0 overflow-y-auto flex-shrink-0 hidden lg:flex">
        <img src="/logo.png" alt="deela logo" className="h-16 mb-8 object-contain" />

        <nav className="space-y-1 mb-8">
          {navItems.map((item) => (
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
              <a key={cat} href="/categories" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 cursor-pointer hover:text-violet-600 hover:bg-violet-50 rounded-lg transition">{cat}</a>
            ))}
          </div>
        </div>

        <div className="bg-violet-50 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-violet-200 flex items-center justify-center text-violet-700 font-bold text-sm">M</div>
          <div>
            <div className="font-semibold text-sm">เยี่ยมชมแบบไม่ลงทะเบียน</div>
            <div className="text-xs text-gray-500">กด ❤️ เพื่อบันทึก</div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 px-4 py-3 z-40 lg:hidden">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileMenuOpen(true)} className="text-gray-600 text-xl p-1">☰</button>
          <img src="/logo.png" alt="deela logo" className="h-8 object-contain" />
          <div className="flex-1" />
          <Link href="/favorites" className="text-gray-400 text-lg">❤️</Link>
        </div>
      </div>

      <MobileSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} activePage="/" />

      {/* Main Content */}
      <main className="flex-1 min-w-0 pt-14 lg:pt-0">
        {/* Search Bar - Desktop */}
        <div className="bg-white border-b border-gray-100 px-8 py-4 sticky top-0 z-30 hidden lg:block">
          <div className="flex items-center gap-4">
            <div className="flex-1 flex items-center gap-3 bg-gray-100 rounded-2xl px-5 py-3">
              <span className="text-gray-400">🔍</span>
              <Link href="/search" className="flex-1 bg-transparent outline-none text-sm text-gray-500 cursor-pointer">
                ค้นหาสินค้า...
              </Link>
            </div>
            <Link href="/search" className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-500 text-white font-semibold text-sm shadow-lg">
              ค้นหา
            </Link>
            <Link href="/alerts" className="text-gray-400 hover:text-gray-600 text-xl">🔔</Link>
          </div>
        </div>

        <div className="p-4 lg:p-8">
          {/* Hero Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 p-6 lg:p-10 mb-6 relative overflow-hidden">
            {/* 2 กล่องใส่รูปโฆษณา */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl overflow-hidden aspect-[2/1] flex items-center justify-center border-2 border-dashed border-white/40">
                <span className="text-white/60 text-xs text-center px-2">📢 Ad Banner 1<br /><span className="text-white/40 text-[10px]">300×150</span></span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl overflow-hidden aspect-[2/1] flex items-center justify-center border-2 border-dashed border-white/40">
                <span className="text-white/60 text-xs text-center px-2">📢 Ad Banner 2<br /><span className="text-white/40 text-[10px]">300×150</span></span>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 flex items-center gap-2">
              <Link href="/search" className="flex-1 bg-white rounded-lg px-4 py-2 text-sm text-black outline-none w-full text-center font-medium">
                พิมพ์ชื่อสินค้าที่ต้องการ...
              </Link>
              <Link href="/search" className="bg-white text-violet-600 px-5 py-2 rounded-lg font-semibold text-sm whitespace-nowrap">
                ค้นหา
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
            {featureCards.map((f) => (
              <a key={f.title} href={f.title === 'เปรียบเทียบราคา' ? '/compare' : f.title === 'รีวิวจริง' ? '/search' : f.title === 'ติดตามราคา' ? '/alerts' : '/popular'} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer">
                <div className="text-2xl mb-2">{f.icon}</div>
                <h3 className="font-bold text-sm text-gray-800">{f.title}</h3>
                <p className="text-xs text-gray-500 hidden lg:block">{f.desc}</p>
              </a>
            ))}
          </div>

          {/* Trending Products */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-black text-gray-800">🔥 สินค้าลดราคาแรง</h2>
            <Link href="/search" className="text-violet-600 font-semibold text-sm">ดูทั้งหมด →</Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-4 mb-6">
            {trendingProducts.slice(0, 6).map((p) => {
              const best = getBestPrice(p);
              const isFav = favorites.includes(p.id);
              return (
                <Link key={p.id} href={`/product/${p.id}`}>
                  <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer h-full flex flex-col relative">
                    <button
                      onClick={(e) => toggleFavorite(p.id, e)}
                      className={`absolute top-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center text-sm transition ${isFav ? 'bg-red-50 text-red-500' : 'bg-white/70 text-gray-300'}`}
                    >
                      {isFav ? '♥' : '♡'}
                    </button>
                    <div className="relative mb-2">
                      <img src={p.image} alt={p.name} className="w-full h-24 object-cover rounded-lg" />
                      <span className="absolute top-1 left-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                        -{best.discount}%
                      </span>
                    </div>
                    <h3 className="font-bold text-xs text-gray-800 mb-1 line-clamp-2 flex-1">{p.name}</h3>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-base font-black text-red-500">{formatPrice(best.price)}</span>
                      <span className="text-xs text-gray-400 line-through">{formatPrice(best.oldPrice)}</span>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <img src={dealerLogos[best.dealer]} alt={best.dealer} className="w-4 h-4 object-contain" />
                      <button className="bg-violet-600 text-white px-3 py-1 rounded-lg font-semibold text-xs">ดูดีล</button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Price Alerts */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-gray-800">🔔 ติดตามราคา</h2>
              <Link href="/alerts" className="bg-violet-100 text-violet-700 px-4 py-2 rounded-xl font-semibold text-sm">+ เพิ่มสินค้า</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {products.slice(0, 3).map((p) => {
                const best = getBestPrice(p);
                return (
                  <Link key={p.id} href={`/product/${p.id}`} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition cursor-pointer">
                    <img src={p.image} alt={p.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-gray-800 truncate">{p.name}</div>
                      <div className="flex items-center gap-1 mt-1">
                        {p.prices.map(price => (
                          <img key={price.dealer} src={dealerLogos[price.dealer]} alt={price.dealer} className="w-4 h-4 object-contain" />
                        ))}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-lg font-black text-violet-600">{formatPrice(best.price)}</div>
                      <span className="text-xs text-orange-500">ราคาถูกสุด</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}