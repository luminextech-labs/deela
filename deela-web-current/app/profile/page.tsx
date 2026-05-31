'use client';

import { useState } from 'react';

const menuItems = [
  { name: 'ข้อมูลส่วนตัว', icon: '/icons/menu_profile.svg' },
  { name: 'ที่อยู่จัดส่ง', icon: '/icons/menu_location.svg' },
  { name: 'การชำระเงิน', icon: '/icons/menu_payment.svg' },
  { name: 'ประวัติคำสั่งซื้อ', icon: '/icons/menu_order.svg' },
  { name: 'คูปองของฉัน', icon: '/icons/menu_coupon.svg' },
  { name: 'สินค้าที่ดูล่าสุด', icon: '/icons/menu_history2.svg' },
];

const bottomItems = [
  { name: 'นโยบาย', icon: '/icons/menu_policy.svg' },
  { name: 'การตั้งค่า', icon: '/icons/menu_settings.svg' },
  { name: 'ช่วยเหลือ & ติดต่อเรา', icon: '/icons/menu_help.svg' },
  { name: 'ออกจากระบบ', icon: '/icons/menu_logout.svg' },
];

const bottomNavItems = [
  { name: 'หน้าแรก', href: '/', icon: '🏠' },
  { name: 'ค้นหา', href: '/search', icon: '🔍' },
  { name: 'รายการโปรด', href: '/favorites', icon: '❤️' },
  { name: 'แจ้งเตือน', href: '/alerts', icon: '🔔' },
  { name: 'บัญชี', href: '/profile', icon: '/icons/menu_profile.svg', active: true },
];

const categories = ['อิเล็กทรอนิกส์', 'มือถือ & แก็ดเจ็ต', 'คอมพิวเตอร์', 'หูฟัง & เสียง', 'เกมมิ่งเกียร์', 'บ้าน & ไลฟ์สไตล์', 'สุขภาพ & ความงาม', 'แฟชั่น'];

export default function ProfilePage() {
  const [activeNav, setActiveNav] = useState('/profile');

  return (
    <div className="min-h-screen bg-[#F5F5FA]">
      {/* Desktop main layout */}
      <div className="flex">
        {/* Left sidebar nav */}
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

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Profile card */}
          <div className="bg-gradient-to-br from-violet-600 via-violet-500 to-purple-400 rounded-b-3xl px-8 py-8 lg:px-12">
            {/* Page label */}


            {/* Profile info */}
            <div className="flex items-center gap-5">
              <img src="/placeholder.jpg" alt="Avatar" className="w-20 h-20 rounded-full object-cover border-3 border-white/40" />
              <div>
                <h1 className="text-white text-2xl font-bold">Nattawat</h1>
                <p className="text-white/70 text-sm">natt...mail.com</p>
                <div className="inline-flex items-center gap-1.5 mt-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-white text-xs font-semibold">👑</span>
                  <span className="text-white text-xs font-semibold">Premium</span>
                </div>
              </div>
            </div>
          </div>

          {/* White content area */}
          <div className="bg-white rounded-t-3xl -mt-4 mx-4 lg:mx-8 shadow-sm border border-gray-100">
            {/* Menu items */}
            <div className="p-6 lg:p-8">
              <div className="divide-y divide-gray-100">
                {menuItems.map((item) => (
                  <button
                    key={item.name}
                    className="w-full flex items-center gap-4 py-4 text-left hover:bg-gray-50 transition rounded-xl px-4 -mx-4"
                  >
                    <div className="w-10 flex-shrink-0 flex items-center justify-center"><img src={item.icon} alt="" className="w-6 h-6 object-contain" /></div>
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    <span className="ml-auto text-gray-300">›</span>
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-100" />

              {/* Bottom settings */}
              <div className="space-y-0">
                {bottomItems.map((item, idx) => (
                  <button
                    key={item.name}
                    className={`w-full flex items-center gap-4 py-4 text-left hover:bg-gray-50 transition rounded-xl px-4 -mx-4 ${idx < bottomItems.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    <div className="w-10 flex-shrink-0 flex items-center justify-center"><img src={item.icon} alt="" className="w-6 h-6 object-contain" /></div>
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    <span className="ml-auto text-gray-300">›</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Bottom navigation - mobile only */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around py-2 px-4 z-50">
        {bottomNavItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition ${item.active ? 'text-violet-600' : 'text-gray-400'}`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.name}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}