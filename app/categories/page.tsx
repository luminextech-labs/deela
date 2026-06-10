'use client';

import { useState } from 'react';
import MobileSidebar from '../components/MobileSidebar';
import ProductCard from '../components/ProductCard';

const categoryData = [
  {
    name: 'มือถือ & แก็ดเจ็ต',
    icon: '/icons/mobile.png',
    color: 'bg-white',
    sub: ['สมาร์ทโฟน', 'แท็บเล็ต', 'สมาร์ทวอทช์', 'หูฟัง', 'แบตเตอร์สำรอง', 'เคสมือถือ', 'ฟิล์มกระจก', 'สายชาร์จ'],
    popular: ['iPhone 16', 'Samsung S25', 'Xiaomi 14', 'OPPO Find X8', 'vivo X200'],
    count: 856,
  },
  {
    name: 'คอมพิวเตอร์',
    icon: '/icons/computer.png',
    color: 'bg-white',
    sub: ['โน้ตบุ๊ก', 'PC / คอมเดสก์', 'จอมอนิเตอร์', 'คีย์บอร์ด', 'เมาส์', 'สิ่งของต่อพีซี', 'เครื่องพิมพ์', 'อัพเกรด PC'],
    popular: ['MacBook Pro M4', 'ThinkPad X1', 'Dell XPS', 'ASUS ROG', 'MSI Gaming'],
    count: 2341,
  },
  {
    name: 'หูฟัง & เสียง',
    icon: '/icons/audio.png',
    color: 'bg-white',
    sub: ['หูฟังบลูทูธ TWS', 'หูฟังแบบเกม', 'หูฟังครอบหู', 'ลำโพงบลูทูธ', 'Soundbar', 'ไมค์', 'DAC/Amplifier'],
    popular: ['AirPods Pro 2', 'Sony WF-1000XM5', 'Samsung Buds2 Pro', 'JBL Tune', 'Anker'],
    count: 1567,
  },
  {
    name: 'เกมมิ่งเกียร์',
    icon: '/icons/auto.png',
    color: 'bg-white',
    sub: ['คอนโซล', 'เกม PC', 'เมาส์เกม', 'คีย์บอร์ดเกม', 'หูฟังเกม', 'จอเล่นเกม', 'เกมพอร์ตี้'],
    popular: ['PlayStation 5', 'Nintendo Switch OLED', 'Xbox Series X', 'Steam Deck', 'ROG Ally'],
    count: 892,
  },
  {
    name: 'เครื่องใช้ในบ้าน',
    icon: '/icons/home_new.png',
    color: 'bg-white',
    sub: ['เครื่องดูดฝุ่น', 'เครื่องปรับอากาศ', 'พัดลม', 'กระทะไฟฟ้า', 'เครื่องชงกาแฟ', 'หุงข้าว', 'เครื่องเป่าผม'],
    popular: ['Dyson V15', 'Electrolux', 'Xiaomi Vacuum', 'Phillips Airfryer', 'Coway'],
    count: 3456,
  },
  {
    name: 'สุขภาพ & ความงาม',
    icon: '/icons/beauty.png',
    color: 'bg-white',
    sub: ['สกินแคร์', 'เครื่องมือความงาม', 'วิตามิน', 'อาหารเสริม', 'มาส์กหน้า', 'น้ำหอม', 'เครื่องสำอาง'],
    popular: ['SK-II', 'La Mer', 'The Ordinary', 'Olay', 'Sulwhasoo'],
    count: 678,
  },
  {
    name: 'แม่ & เด็ก',
    icon: '/icons/mother.png',
    color: 'bg-white',
    sub: ['ของเล่นเด็ก', 'เสื้อผ้าเด็ก', 'รถเข็น', 'อุปกรณ์ให้นม', 'เป้ออ่อน', 'ของใช้เบบี๋'],
    popular: ['Huggies', 'Pampers', 'Medela', 'Chicco', 'Aprica'],
    count: 1234,
  },
  {
    name: 'กีฬา & กิจกรรม',
    icon: '/icons/sports.png',
    color: 'bg-white',
    sub: ['รองเท้าวิ่ง', 'ฟิตเนส', 'จักรยาน', 'อุปกรณ์เล่นกีฬา', 'เสื้อผ้ากีฬา', 'กระเป๋า', 'นาฬิกา'],
    popular: ['Nike', 'Adidas', 'Under Armour', 'Asics', 'Puma'],
    count: 2345,
  },
  {
    name: 'ยานยนต์',
    icon: '/icons/icon3.png',
    color: 'bg-white',
    sub: ['อุปกรณ์ตกแต่ง', 'กล้องติดรถ', 'เครื่องเสียงรถยนต์', 'ยางรถยนต์', 'น้ำมันเครื่อง', 'เบาะรถ'],
    popular: ['JBL Car', 'Pioneer', 'Michelin', 'Castrol', '3M'],
    count: 567,
  },
  {
    name: 'สัตว์เลี้ยง',
    icon: '/icons/pet.png',
    color: 'bg-white',
    sub: ['อาหารสุนัข', 'อาหารแมว', 'เตียงสัตว์', 'ของเล่นสัตว์', 'อุปกรณ์ดูแล', 'ปลอกคอ', 'กระเป๋าใส่สัตว์'],
    popular: ['Royal Canin', "Hill's", 'Whiskas', 'Pedigree', 'Frontline'],
    count: 432,
  },
  {
    name: 'หนังสือ & สื่อ',
    icon: '/icons/books.png',
    color: 'bg-white',
    sub: ['นิยาย', 'หนังสือเรียน', 'วารสาร', 'การ์ตูน', 'เพลง', 'ภาพยนตร์', 'ซอฟต์แวร์'],
    popular: ['Harry Potter', 'One Piece', 'Marvel', 'DC Comics', 'K-Pop'],
    count: 890,
  },
  {
    name: 'แฟชั่น',
    icon: '/icons/icon5.png',
    color: 'bg-white',
    sub: ['เสื้อผ้าผู้หญิง', 'เสื้อผ้าผู้ชาย', 'รองเท้า', 'กระเป๋า', 'นาฬิกา', 'เครื่องประดับ'],
    popular: ['Zara', 'H&M', 'Uniqlo', 'Adidas', 'Nike'],
    count: 1543,
  },
];

const featuredProducts = [
  { id: 'feat-1', name: 'iPhone 16 Pro Max 256GB ราคาพิเศษ', price: 47900, oldPrice: 54900, discount: 13, shop: 'Shopee', rating: 4.9, reviews: 8560, sold: 12000, image: '/placeholder.png' },
  { id: 'feat-2', name: 'MacBook Air M3 13" รุ่นใหม่ล่าสุด', price: 36900, oldPrice: 44900, discount: 18, shop: 'Lazada', rating: 4.8, reviews: 2340, sold: 4500, image: '/placeholder.png' },
  { id: 'feat-3', name: 'Sony WH-1000XM5 หูฟัง ANC ระดับท็อป', price: 8990, oldPrice: 12900, discount: 30, shop: 'Shopee', rating: 4.9, reviews: 3450, sold: 8900, image: '/placeholder.png' },
  { id: 'feat-4', name: 'Dyson V12 Detect Slim เครื่องดูดฝุ่น', price: 18900, oldPrice: 22900, discount: 17, shop: 'Lazada', rating: 4.8, reviews: 890, sold: 2100, image: '/placeholder.png' },
  { id: 'feat-5', name: 'Nintendo Switch OLED พร้อมเกมติดตั้ง', price: 10900, oldPrice: 13900, discount: 22, shop: 'TikTok', rating: 4.7, reviews: 4560, sold: 6700, image: '/placeholder.png' },
  { id: 'feat-6', name: 'Samsung Galaxy Tab S10 Ultra 256GB', price: 32900, oldPrice: 39900, discount: 18, shop: 'Shopee', rating: 4.8, reviews: 1230, sold: 3200, image: '/placeholder.png' },
];

export default function CategoriesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#F5F5FA] flex">
      {/* Sidebar */}
      <aside className="w-[260px] bg-white border-r border-gray-100 p-5 flex flex-col h-screen sticky top-0 overflow-y-auto flex-shrink-0 hidden lg:flex">
        <img src="/logo.png" alt="Deela" className="h-12 mb-5 object-contain" />
        <nav className="space-y-1">
          {[
            { name: 'หน้าหลัก', href: '/', icon: '/icons/icon_home_menu.png' },
            { name: 'ค้นหา', href: '/search', icon: '/icons/icon_search.png' },
            { name: 'หมวดหมู่', href: '/categories', icon: '/icons/icon_categories.png', active: true },
            { name: 'สินค้ายอดนิยม', href: '/popular', icon: '/icons/icon_popular.png' },
            { name: 'เปรียบเทียบ', href: '/compare', icon: '/icons/icon_compare.png' },
            { name: 'ติดตามราคา', href: '/alerts', icon: '/icons/icon_alerts.png' },
            { name: 'ประวัติการเข้าชม', href: '/history', icon: '/icons/icon_history.png' },
            { name: 'รายการโปรด', href: '/favorites', icon: '/icons/icon_favorites.png' },
          ].map((item) => (
            <a key={item.name} href={item.href} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition font-medium text-sm ${(item as any).active ? 'bg-violet-50 text-violet-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                <img src={item.icon} alt={item.name} className="w-5 h-5 object-contain shrink-0" />
              <span>{item.name}</span>
            </a>
          ))}
        </nav>

      </aside>

      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activePage="/categories" />

      <main className="flex-1 min-w-0 pb-20">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <a href="/" className="text-gray-500 hover:text-gray-700 text-xl">←</a>
            <h1 className="text-lg font-bold text-gray-800">📂 หมวดหมู่สินค้า</h1>
          </div>
        </div>

        <div className="p-4 lg:p-6">
          {/* Featured Products Banner */}
          <div className="bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-2xl p-5 mb-6">
            <h2 className="text-white font-black text-lg mb-3">🔥 สินค้าขายดีประจำเดือน</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {featuredProducts.map((p) => (
                <a key={p.id} href={`/product/${p.id}`} className="shrink-0 w-[160px] bg-white/95 rounded-xl p-2.5 hover:shadow-lg transition cursor-pointer">
                  <img src={p.image} alt={p.name} className="w-full h-24 object-cover rounded-lg mb-2" onError={(e) => { e.currentTarget.src = '/placeholder.png'; }} />
                  <h3 className="font-semibold text-[11px] text-gray-800 line-clamp-2 mb-1 leading-tight">{p.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-black text-red-500">฿{p.price.toLocaleString()}</span>
                    <span className="text-[9px] text-gray-400 line-through">฿{p.oldPrice.toLocaleString()}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Category Grid */}
          <div className="mb-6">
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {categoryData.map((cat, i) => (
                <div
                  key={i}
                  className={`relative bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer group ${activeCategory === cat.name ? 'border-violet-400 ring-2 ring-violet-200' : ''}`}
                  onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
                >
                  <div className={`w-10 h-10 rounded-2xl ${cat.color} border border-gray-200 flex items-center justify-center mb-3 mx-auto`}>
                    <img src={cat.icon} alt={cat.name} className="w-6 h-6 object-contain" />
                  </div>
                  <h3 className="font-bold text-xs text-gray-800 leading-tight text-center mb-1">{cat.name}</h3>
                  <p className="text-[10px] text-gray-400 text-center">{cat.count.toLocaleString()} รายการ</p>

                  {/* Expanded subcategories */}
                  {activeCategory === cat.name && (
                    <div className="absolute top-full left-0 right-0 z-50 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 mt-2 min-w-[280px]">
                      <h4 className="font-bold text-sm text-gray-800 mb-3 flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-lg ${cat.color} border border-gray-200 flex items-center justify-center`}>
                          <img src={cat.icon} alt={cat.name} className="w-4 h-4 object-contain" />
                        </div>
                        {cat.name}
                      </h4>
                      <div className="grid grid-cols-2 gap-1 mb-4">
                        {cat.sub.map((s) => (
                          <a key={s} href={`/search?q=${encodeURIComponent(s)}`} className="px-3 py-2 text-xs text-gray-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition">
                            {s}
                          </a>
                        ))}
                      </div>
                      <div>
                        <h5 className="text-xs font-semibold text-gray-500 mb-2">🔥 คำค้นหายอดนิยม</h5>
                        <div className="flex flex-wrap gap-1">
                          {cat.popular.map((p) => (
                            <a key={p} href={`/search?q=${encodeURIComponent(p)}`} className="bg-gray-100 hover:bg-violet-100 text-gray-600 hover:text-violet-700 text-[10px] font-medium px-2.5 py-1 rounded-full transition">
                              {p}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Top Products in Categories */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-gray-800">💎 สินค้ายอดนิยมในหมวดหมู่</h2>
              <a href="/search" className="text-violet-600 font-semibold text-sm hover:underline">ดูทั้งหมด →</a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p as any} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}