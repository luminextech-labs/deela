'use client';

import { useState } from 'react';
import MobileSidebar from '../components/MobileSidebar';

const historyItems = [
  { id: 1, name: 'หูฟังบลูทูธ Anker Soundcore P20i', price: 690, date: '24 พ.ค.', time: '14:30', shop: 'Shopee' },
  { id: 2, name: 'iPhone 15 (128GB)', price: 27900, date: '23 พ.ค.', time: '10:15', shop: 'Shopee' },
  { id: 3, name: 'Samsung Galaxy S24 Ultra', price: 39900, date: '22 พ.ค.', time: '18:45', shop: 'Lazada' },
];

export default function HistoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
            { name: 'ประวัติการเข้าชม', href: '/history', icon: '/icons/icon_history.jpg', active: true },
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

      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activePage="/history" />

      <main className="flex-1 min-w-0 pb-20">
        <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <a href="/" className="text-gray-500 hover:text-gray-700 text-xl">←</a>
            <h1 className="text-lg font-bold text-gray-800">📋 ประวัติการเข้าชม</h1>
          </div>
        </div>

        <div className="p-4 lg:p-6">
          <div className="space-y-3">
            {historyItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-4 flex items-center gap-4 border border-gray-100 hover:shadow-md transition cursor-pointer">
                <img src="/placeholder.jpg" alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-800">{item.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {item.shop === 'Shopee' && <img src="/logo_shopee.png" alt="Shopee" className="w-4 h-4" />}
                    {item.shop === 'Lazada' && <img src="/logo_lazada.png" alt="Lazada" className="w-4 h-4" />}
                    <span className="text-xs text-gray-400">{item.date} {item.time}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-500">฿{item.price.toLocaleString()}</div>
                  <button className="bg-violet-100 text-violet-700 px-3 py-1 rounded-lg font-semibold text-xs mt-1">ซื้อ</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}