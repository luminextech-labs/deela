'use client';

import { useState } from 'react';
import MobileSidebar from '../../components/MobileSidebar';

const shops = [
  { name: 'Shopee', logo: '/logo_shopee.png', price: 690, originalPrice: 1290, discount: 47, rating: 4.8, reviews: 1234, shipping: 'ฟรี' },
  { name: 'Lazada', logo: '/logo_lazada.png', price: 699, originalPrice: 1490, discount: 53, rating: 4.7, reviews: 856, shipping: 'ฟรี' },
  { name: 'TikTok Shop', logo: '/logo_tiktok.png', price: 685, originalPrice: 1390, discount: 51, rating: 4.6, reviews: 567, shipping: '฿30' },
];

const specs = [
  { label: 'แบตเตอร์', value: '10 ชม.', sub: 'ต่อการชาร์จ 1 ครั้ง' },
  { label: 'กันน้ำ', value: 'IPX5', sub: 'กันเหงื่อและน้ำ' },
  { label: 'Bluetooth', value: '5.3', sub: 'เชื่อมต่อเสถียร' },
];

const tags = ['เสียงคุณภาพดี', 'Bass แน่น', 'เชื่อมต่อเสถียร'];

const pros = [
  'Bass แน่น ฟังเพลงเพลิน',
  'เชื่อมต่อ Bluetooth 5.3 เสถียร',
  'แบตเตอร์ทนใช้งานได้นาน',
  'กันน้ำ IPX5 ดีเยี่ยม',
];

const cons = [
  'ไม่มีระบบตัดเสียง ANC',
  'เคสชาร์จวัสดุพลาสติก',
];

const ratingBars = [
  { stars: 5, pct: 79 },
  { stars: 4, pct: 16 },
  { stars: 3, pct: 3 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 1 },
];

export default function ProductPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const cheapest = shops.reduce((min, s) => (s.price < min.price ? s : min), shops[0]);

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

      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activePage="/product" />

      <main className="flex-1 min-w-0 pb-20">
        {/* Mobile header */}
        <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-30 lg:hidden">
          <div className="flex items-center gap-3">
            <a href="/" className="text-gray-500 text-xl">←</a>
            <div className="flex-1" />
            <button className="text-gray-500 text-lg">❤️</button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto p-4 lg:p-6">

          {/* Breadcrumb */}
          <div className="text-xs text-gray-400 mb-4">
            <span className="text-gray-400">หน้าหลัก</span>
                <span className="text-gray-300 mx-1">{' > '}</span>
                <span className="text-gray-400">ค้นหา</span>
                <span className="text-gray-300 mx-1">{' > '}</span>
                <span className="text-gray-400">หูฟังบลูทูธ</span>
                <span className="text-gray-300 mx-1">{' > '}</span>
                <span className="text-gray-600 font-medium">Anker Soundcore P20i</span>
          </div>

          {/* Top section: image + info */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

              {/* Left: image gallery */}
              <div className="p-4 lg:p-6">
                <div className="relative">
                  <img src="/placeholder.jpg" alt="Product" className="w-full h-52 lg:h-72 object-cover rounded-2xl" />
                  <button className="absolute top-3 right-3 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center text-gray-500 text-lg backdrop-blur-sm">🤍</button>
                </div>
                {/* Thumbnails */}
                <div className="flex gap-2 mt-3">
                  {[1,2,3,4,5].map((_, i) => (
                    <div key={i} className={`w-14 h-14 rounded-xl overflow-hidden border-2 ${i === 0 ? 'border-violet-500' : 'border-gray-100'}`}>
                      <img src="/placeholder.jpg" alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>

                {/* Specs card */}
                <div className="mt-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="grid grid-cols-3 divide-x divide-gray-200">
                    {specs.map((spec) => (
                      <div key={spec.label} className="text-center px-2">
                        <div className="font-black text-base text-gray-800">{spec.value}</div>
                        <div className="text-[10px] text-gray-400">{spec.label}</div>
                        <div className="text-[9px] text-gray-300 mt-0.5">{spec.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: product info */}
              <div className="p-4 lg:p-6 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <h1 className="font-black text-lg lg:text-xl text-gray-800 leading-tight">Anker Soundcore P20i</h1>
                  <div className="flex gap-2 ml-2">
                    <button className="text-gray-400 text-lg">🔗</button>
                    <button className="text-gray-400 text-lg">❤️</button>
                  </div>
                </div>

                {/* Rating row */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-yellow-400 text-sm">⭐⭐⭐⭐⭐</span>
                  <span className="font-bold text-sm text-gray-700">4.8</span>
                  <span className="text-sm text-gray-400">({(12340).toLocaleString()} รีวิว)</span>
                  <span className="ml-2 bg-violet-100 text-violet-700 text-xs font-bold px-2 py-0.5 rounded-full">50K+ ขายแล้ว</span>
                </div>

                {/* Feature tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {tags.map((tag) => (
                    <span key={tag} className="bg-violet-50 text-violet-700 text-xs font-semibold px-3 py-1 rounded-full">{tag}</span>
                  ))}
                </div>

                {/* Price comparison */}
                <div className="mb-2">
                  <h3 className="text-xs font-semibold text-gray-500 mb-2">💰 เปรียบเทียบราคาจากทุกแพลตฟอร์ม</h3>
                </div>
                <div className="space-y-2 flex-1">
                  {shops.map((shop) => (
                    <div key={shop.name} className={`flex items-center justify-between p-3 rounded-xl border ${shop.price === cheapest.price ? 'border-violet-300 bg-violet-50' : 'border-gray-100 bg-gray-50/50'}`}>
                      <div className="flex items-center gap-2">
                        <img src={shop.logo} alt={shop.name} className="w-7 h-7 object-contain" />
                        <div>
                          <span className="text-sm font-semibold">{shop.name}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-400">⭐ {shop.rating}</span>
                            <span className="text-xs text-gray-300">·</span>
                            <span className={`text-xs ${shop.shipping === 'ฟรี' ? 'text-green-600' : 'text-gray-400'}`}>{shop.shipping}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <span className="font-black text-sm text-gray-800">฿{shop.price}</span>
                          <span className="text-xs text-gray-400 line-through ml-1">฿{shop.originalPrice}</span>
                          <span className="text-xs text-red-500 ml-1">-{shop.discount}%</span>
                        </div>
                        <a href="#" className="bg-violet-600 text-white px-3 py-1.5 rounded-xl font-semibold text-xs">ไปร้านค้า</a>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] text-gray-300 mt-3">* ลิงก์ในหน้านี้เป็นลิงก์พันธมิตร (Affiliate Links)</p>
              </div>
            </div>
          </div>

          {/* Bottom: AI Summary + Rating Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* AI Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">🤖</span>
                <h3 className="font-bold text-gray-800">สรุปจากผู้ใช้งาน (AI)</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 rounded-xl p-4">
                  <h4 className="font-bold text-green-700 text-xs mb-2">✅ ข้อดี</h4>
                  <ul className="space-y-1">
                    {pros.map((p, i) => (
                      <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
                        <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 rounded-xl p-4">
                  <h4 className="font-bold text-red-700 text-xs mb-2">⚠️ ข้อควรพิจารณา</h4>
                  <ul className="space-y-1">
                    {cons.map((c, i) => (
                      <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
                        <span className="text-red-400 mt-0.5 shrink-0">✗</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-black text-gray-800">4.8</span>
                <div>
                  <div className="flex text-yellow-400 text-sm">⭐⭐⭐⭐⭐</div>
                  <span className="text-xs text-gray-400">{(12340).toLocaleString()} รีวิว</span>
                </div>
              </div>
              <div className="space-y-1.5">
                {ratingBars.map((r) => (
                  <div key={r.stars} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-5">{r.stars}⭐</span>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex-1">
                      <div className="h-full bg-violet-500 rounded-full" style={{width: `${r.pct}%`}} />
                    </div>
                    <span className="text-xs text-gray-400 w-8">{r.pct}%</span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 bg-violet-100 hover:bg-violet-200 text-violet-700 font-semibold text-xs py-2 rounded-xl transition">
                อ่านรีวิวทั้งหมด
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
