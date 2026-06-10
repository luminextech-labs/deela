'use client';

const categories = ['อิเล็กทรอนิกส์', 'มือถือ & แก็ดเจ็ต', 'คอมพิวเตอร์', 'หูฟัง & เสียง', 'เกมมิ่งเกียร์', 'บ้าน & ไลฟ์สไตล์', 'สุขภาพ & ความงาม', 'แฟชั่น'];

const navItems = [
  { name: 'หน้าหลัก', href: '/', icon: '/icons/icon_home_menu.png' },
  { name: 'ค้นหา', href: '/search', icon: '/icons/icon_search.png' },
  { name: 'หมวดหมู่', href: '/categories', icon: '/icons/icon_categories.png' },
  { name: 'สินค้ายอดนิยม', href: '/popular', icon: '/icons/icon_popular.png' },
  { name: 'เปรียบเทียบ', href: '/compare', icon: '/icons/icon_compare.png' },
  { name: 'ติดตามราคา', href: '/alerts', icon: '/icons/icon_alerts.png' },
  { name: 'ประวัติการเข้าชม', href: '/history', icon: '/icons/icon_history.png' },
  { name: 'รายการโปรด', href: '/favorites', icon: '/icons/icon_favorites.png' },
];

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activePage?: string;
}

function NavIcon({ src }: { src: string }) {
  return (
    <img 
      src={src} 
      alt="" 
      className="w-5 h-5 object-contain shrink-0"
    />
  );
}

export default function MobileSidebar({ isOpen, onClose, activePage }: MobileSidebarProps) {
  return (
    <div className={`fixed inset-0 z-50 lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <aside className="absolute right-0 top-0 bottom-0 w-[85%] max-w-[340px] bg-white shadow-xl overflow-y-auto">
        <div className="p-4 flex items-center justify-between border-b border-gray-100">
          <img src="/logo.png" alt="deela logo" className="h-12 object-contain" />
          <button onClick={onClose} className="text-gray-500 text-xl p-2">✕</button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${item.href === activePage || (activePage === '/' && item.href === '/') ? 'bg-violet-50 text-violet-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <NavIcon src={item.icon} />
              <span>{item.name}</span>
            </a>
          ))}
        </nav>

        <div className="mt-auto mb-4 px-4">
          <span className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 font-semibold">หมวดหมู่</span>
          <div className="space-y-1">
            {categories.map((cat) => (
              <a
                key={cat}
                href="#"
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 cursor-pointer hover:text-violet-600 hover:bg-violet-50 rounded-lg transition"
              >
                {cat}
              </a>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-violet-50 mx-4 mb-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <img src="/placeholder.png" alt="" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <div className="font-semibold text-sm">Nattawat</div>
              <div className="text-xs text-gray-500">Premium</div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}