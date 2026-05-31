export default function DesktopPage() {
  const products = [
    { name: 'Anker Soundcore P20i', price: '฿690', old: '฿1,290', discount: '-47%', image: 'https://picsum.photos/300?1' },
    { name: 'iPhone 15 (128GB)', price: '฿27,900', old: '฿31,900', discount: '-12%', image: 'https://picsum.photos/300?2' },
    { name: 'Dyson V12 Detect Slim', price: '฿18,900', old: '฿22,900', discount: '-15%', image: 'https://picsum.photos/300?3' },
    { name: 'Logitech G304', price: '฿890', old: '฿1,390', discount: '-36%', image: 'https://picsum.photos/300?4' },
  ];

  const navItems = ['หน้าหลัก', 'ค้นหา', 'สินค้ายอดนิยม', 'เปรียบเทียบ', 'แจ้งเตือนราคา', 'ประวัติราคา'];
  const categories = ['อิเล็กทรอนิกส์', 'มือถือ & แก็ดเจ็ต', 'เกมมิ่งเกียร์', 'บ้าน & ไลฟ์สไตล์', 'ความงาม'];
  const features = ['เปรียบเทียบราคาทุกแพลตฟอร์ม', 'รีวิวจริงจากผู้ซื้อ', 'แจ้งเตือนราคาลด', 'สินค้ายอดนิยม'];

  return (
    <div className="min-h-screen bg-[#F5F5FA] flex text-[#111827]">
      {/* Sidebar */}
      <aside className="w-[260px] bg-white border-r border-gray-100 p-6 flex flex-col justify-between flex-shrink-0">
        <div>
          <h1 className="text-4xl font-black mb-10">
            dee<span className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">la</span>
          </h1>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <div key={item} className="px-4 py-3 rounded-2xl hover:bg-violet-50 cursor-pointer transition font-medium text-sm">
                {item}
              </div>
            ))}
          </nav>

          <div className="mt-10">
            <h3 className="font-bold mb-4 text-sm text-gray-500">หมวดหมู่</h3>
            <div className="space-y-3 text-sm">
              {categories.map((c) => (
                <div key={c} className="text-gray-600 hover:text-violet-600 cursor-pointer">{c}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-violet-50 rounded-3xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-bold">N</div>
          <div>
            <div className="font-semibold text-sm">Nattawat</div>
            <div className="text-xs text-gray-500">Premium</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {/* Search Bar */}
        <div className="flex items-center gap-4 mb-8">
          <input
            placeholder="ค้นหาสินค้า เช่น iPhone, หูฟัง, โน๊ตบุ๊ค..."
            className="flex-1 bg-white rounded-2xl px-6 py-4 border border-gray-100 outline-none focus:border-violet-300 transition"
          />
          <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl transition">
            ค้นหา
          </button>
        </div>

        {/* Hero Banner */}
        <div className="rounded-[32px] bg-gradient-to-r from-violet-600 to-fuchsia-500 p-10 text-white relative overflow-hidden mb-10">
          <div className="max-w-xl relative z-10">
            <h2 className="text-5xl font-black leading-tight mb-5">
              ค้นหาของที่ใช่<br />ในราคาที่คุ้มที่สุด
            </h2>
            <p className="text-lg opacity-90 mb-8">
              เปรียบเทียบราคาจาก Shopee, Lazada และ TikTok Shop ในที่เดียว
            </p>
            <div className="bg-white rounded-2xl p-2 flex items-center gap-3 max-w-2xl">
              <input
                placeholder="ลองค้นหา: iPhone 15, หูฟัง, Dyson"
                className="flex-1 px-4 py-3 text-black outline-none rounded-2xl bg-transparent"
              />
              <button className="bg-violet-600 px-6 py-3 rounded-2xl font-semibold text-white">
                Search
              </button>
            </div>
          </div>
          <div className="absolute right-10 top-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          {features.map((feature) => (
            <div key={feature} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-violet-100 mb-4" />
              <h3 className="font-bold mb-2">{feature}</h3>
              <p className="text-sm text-gray-500">AI ช่วยวิเคราะห์และค้นหาดีลที่คุ้มที่สุด</p>
            </div>
          ))}
        </div>

        {/* Trending Products */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black">สินค้ากำลังมาแรง 🔥</h2>
          <button className="text-violet-600 font-semibold">ดูทั้งหมด</button>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-12">
          {products.map((product) => (
            <div key={product.name} className="bg-white rounded-[28px] p-5 shadow-sm border border-gray-100 hover:shadow-xl transition cursor-pointer">
              <img src={product.image} alt={product.name} className="w-full h-64 object-cover rounded-3xl mb-5" />
              <div className="font-bold text-lg mb-3 line-clamp-2">{product.name}</div>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl font-black text-red-500">{product.price}</div>
                <div className="line-through text-gray-400 text-sm">{product.old}</div>
              </div>
              <div className="flex items-center justify-between">
                <span className="bg-red-100 text-red-500 text-sm font-bold px-3 py-1 rounded-full">{product.discount}</span>
                <button className="bg-gradient-to-r from-violet-600 to-pink-500 text-white px-5 py-2 rounded-xl font-semibold text-sm">
                  ดูดีล
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Price Tracking */}
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black">ติดตามราคา</h2>
            <button className="bg-violet-100 text-violet-700 px-5 py-3 rounded-2xl font-semibold">
              เพิ่มสินค้าใหม่
            </button>
          </div>

          <div className="space-y-5">
            {products.map((product) => (
              <div key={product.name + 'track'} className="flex items-center gap-5 p-5 rounded-3xl border border-gray-100 hover:bg-gray-50 transition cursor-pointer">
                <img src={product.image} alt={product.name} className="w-24 h-24 rounded-2xl object-cover flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-bold text-lg mb-2">{product.name}</div>
                  <div className="text-sm text-gray-500 mb-3">ราคาปัจจุบันลดลงจากเดิม 18%</div>
                  <div className="h-3 bg-violet-100 rounded-full overflow-hidden">
                    <div className="w-2/3 h-full bg-gradient-to-r from-violet-600 to-pink-500 rounded-full" />
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl font-black text-violet-600">{product.price}</div>
                  <div className="text-green-500 font-semibold text-sm">ลดแล้ว!</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-20" />
      </main>
    </div>
  );
}