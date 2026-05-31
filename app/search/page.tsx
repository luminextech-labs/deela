'use client';

import { useState } from 'react';
import MobileSidebar from '../components/MobileSidebar';

const products = [
  { id: 1, name: 'หูฟังบลูทูธ Anker Soundcore P20i', subname: 'True Wireless', price: 690, old: 1290, discount: 47, shop: 'Shopee', rating: 4.7, reviews: 1234 },
  { id: 2, name: 'QCY T13X หูฟังบลูทูธ ราคาถูก', subname: 'True Wireless', price: 399, old: 699, discount: 43, shop: 'Lazada', rating: 4.5, reviews: 856 },
  { id: 3, name: 'Redmi Buds 4 Lite หูฟังไร้สาย', subname: 'True Wireless', price: 599, old: 999, discount: 40, shop: 'Shopee', rating: 4.3, reviews: 2341 },
  { id: 4, name: 'Sony WF-C500 หูฟังไร้สาย', subname: 'True Wireless', price: 1490, old: 2490, discount: 40, shop: 'Lazada', rating: 4.6, reviews: 1567 },
  { id: 5, name: 'JBL Tune 230NC หูฟัง TWS', subname: 'True Wireless', price: 1990, old: 3990, discount: 50, shop: 'TikTok', rating: 4.4, reviews: 892 },
  { id: 6, name: 'Samsung Galaxy Buds2', subname: 'True Wireless', price: 2990, old: 4990, discount: 40, shop: 'Shopee', rating: 4.7, reviews: 3456 },
];

const filterCategories = ['หูฟังบลูทูธ', 'หูฟังแบบเกม', 'หูฟังติดหู', 'หูฟังครอบหู', 'ลำโพงบลูทูธ', 'Soundbar'];

export default function SearchPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState(0);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  return (
    <div className="min-h-screen bg-[#F5F5FA] flex">
      <aside className="w-[240px] bg-white border-r border-gray-100 p-6 flex flex-col h-screen sticky top-0 overflow-y-auto flex-shrink-0 hidden lg:flex">
        <img src="/logo.png" alt="deela logo" className="h-16 mb-8 object-contain" />
        <nav className="space-y-1 mb-8">
          {[
            { name: 'หน้าหลัก', href: '/', icon: '/icons/icon_home_menu.jpg' },
            { name: 'ค้นหา', href: '/search', icon: '/icons/icon_search.jpg', active: true },
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

      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activePage="/search" />

      <main className="flex-1 min-w-0 flex">
        <div className="w-[220px] bg-white border-r border-gray-100 p-5 flex-shrink-0 hidden lg:block">
          <div className="sticky top-0">
            <h2 className="font-bold text-sm text-gray-800 mb-4">ตัวกรอง</h2>
            <div className="mb-5">
              <h3 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-2">หมวดหมู่</h3>
              <div className="space-y-1">
                {filterCategories.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg">
                    <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => toggleCategory(cat)} className="w-3.5 h-3.5 rounded border-gray-300 text-violet-600" />
                    <span className="text-xs text-gray-600">{cat}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-5">
              <h3 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-2">ช่วงราคา</h3>
              <div className="space-y-1">
                {[{min:0,max:500},{min:500,max:1500},{min:1500,max:5000},{min:5000,max:999999}].map((range, i) => (
                  <label key={i} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg">
                    <input type="radio" name="priceRange" className="w-3.5 h-3.5 text-violet-600" />
                    <span className="text-xs text-gray-600">฿{range.min.toLocaleString()} - ฿{range.max >= 999999 ? '∞' : range.max.toLocaleString()}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-2">คะแนนรีวิว</h3>
              <div className="space-y-1">
                {[4, 3, 2, 1].map((r) => (
                  <label key={r} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg">
                    <input type="radio" name="rating" checked={selectedRating === r} onChange={() => setSelectedRating(r)} className="w-3.5 h-3.5 text-violet-600" />
                    <div className="flex items-center gap-0.5"><span className="text-yellow-400 text-xs">{'★'.repeat(r)}</span></div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <a href="/" className="text-gray-500 hover:text-gray-700 text-xl">←</a>
              <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-2.5">
                <span className="text-gray-400">🔍</span>
                <input defaultValue="หูฟังบลูทูธ" className="flex-1 bg-transparent outline-none text-sm text-gray-700" />
              </div>
              <button className="px-5 py-2 rounded-xl bg-violet-600 text-white font-semibold text-sm">ค้นหา</button>
              <button className="text-gray-500 text-lg">🔔</button>
            </div>
          </div>

          <div className="p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">พบ 6 รายการ</span>
              <select className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm">
                <option>เรียงตามราคา</option>
                <option>เรียงตามยอดนิยม</option>
                <option>เรียงตามคะแนน</option>
              </select>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-violet-100 text-violet-700 text-[10px] font-semibold px-2 py-0.5 rounded">เปรียบเทียบ</span>
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-violet-600" />
                  </div>
                  <div className="relative mb-2">
                    <img src="/placeholder.jpg" alt={product.name} className="w-full h-28 object-cover rounded-lg" />
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">-{product.discount}%</span>
                  </div>
                  <h3 className="font-semibold text-xs text-gray-800 mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-[10px] text-gray-400 mb-1">{product.subname}</p>
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-yellow-400 text-xs">⭐</span>
                    <span className="text-xs font-medium">{product.rating}</span>
                    <span className="text-[10px] text-gray-400">({product.reviews})</span>
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-base font-black text-red-500">฿{product.price.toLocaleString()}</span>
                    <span className="text-xs text-gray-400 line-through">฿{product.old.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    {product.shop === 'Shopee' && <img src="/logo_shopee.png" alt="Shopee" className="w-5 h-5 object-contain" />}
                    {product.shop === 'Lazada' && <img src="/logo_lazada.png" alt="Lazada" className="w-5 h-5 object-contain" />}
                    {product.shop === 'TikTok' && <img src="/logo_tiktok.png" alt="TikTok" className="w-5 h-5 object-contain" />}
                    <button className="bg-violet-600 text-white px-3 py-1 rounded-lg font-semibold text-xs">ซื้อ</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}