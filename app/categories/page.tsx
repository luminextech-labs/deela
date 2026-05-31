'use client';

import { useState } from 'react';
import MobileSidebar from '../components/MobileSidebar';

const categories = [
  { name: 'มือถือ & แก็ดเจ็ต', icon: '/icons/mobile.jpg', count: 856 },
  { name: 'คอมพิวเตอร์', icon: '/icons/computer.jpg', count: 2341 },
  { name: 'หูฟัง & เสียง', icon: '/icons/audio.jpg', count: 1567 },
  { name: 'บ้าน & ไลฟ์สไตล์', icon: '/icons/icon6.jpg', count: 3456 },
  { name: 'สุขภาพ & ความงาม', icon: '/icons/beauty.svg', count: 678 },
  { name: 'แม่ & เด็ก', icon: '/icons/icon5.jpg', count: 1234 },
  { name: 'กีฬา & กิจกรรม', icon: '/icons/icon4.jpg', count: 2345 },
  { name: 'ยานยนต์', icon: '/icons/icon3.jpg', count: 567 },
  { name: 'หนังสือ & สื่อ', icon: '/icons/icon2.jpg', count: 890 },
  { name: 'สัตว์เลี้ยง', icon: '/icons/pet.jpg', count: 432 },
];

export default function CategoriesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F5FA] flex">
      <aside className="w-[240px] bg-white border-r border-gray-100 p-6 flex flex-col h-screen sticky top-0 overflow-y-auto flex-shrink-0 hidden lg:flex">
        <img src="/logo.png" alt="deela logo" className="h-16 mb-8 object-contain" />
        <nav className="space-y-1 mb-8">
          {[
            { name: 'หน้าหลัก', href: '/', icon: '/icons/icon_home_menu.jpg' },
            { name: 'ค้นหา', href: '/search', icon: '/icons/icon_search.jpg' },
            { name: 'หมวดหมู่', href: '/categories', icon: '/icons/icon_categories.jpg', active: true },
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

      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activePage="/categories" />

      <main className="flex-1 min-w-0 pb-20">
        <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <a href="/" className="text-gray-500 hover:text-gray-700 text-xl">←</a>
            <h1 className="text-lg font-bold text-gray-800">📂 หมวดหมู่สินค้า</h1>
          </div>
        </div>

        <div className="p-4 lg:p-6">
          <div className="grid grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
            {categories.map((cat, i) => (
              <a key={i} href="#" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer flex flex-col items-center text-center">
                <img src={cat.icon} alt={cat.name} className="w-10 h-10 mb-2 object-contain" style={{imageRendering:'auto'}} />
                <h3 className="font-bold text-xs text-gray-800 leading-tight">{cat.name}</h3>
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}