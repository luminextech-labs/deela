'use client';

import { useState } from 'react';
import Link from 'next/link';
import { products, categories, type Product } from '../lib/data';

const dealers = ['ทั้งหมด', 'shopee', 'lazada', 'tiktok'];
const sortOptions = [
  { label: 'ราคาต่ำสุด', value: 'price_asc' },
  { label: 'ราคาสูงสุด', value: 'price_desc' },
  { label: 'ลดราคาเยอะสุด', value: 'discount_desc' },
  { label: 'ขายดีสุด', value: 'sold_desc' },
];

function formatPrice(p: number) {
  return '฿' + p.toLocaleString('th-TH');
}

function getBestPrice(product: Product) {
  const lowest = product.prices.reduce((a, b) => a.price < b.price ? a : b);
  return lowest;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDealer, setSelectedDealer] = useState('ทั้งหมด');
  const [sortBy, setSortBy] = useState('discount_desc');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter + sort products
  const filtered = products
    .filter(p => {
      if (query && !p.name.toLowerCase().includes(query.toLowerCase()) &&
        !p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))) return false;
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (selectedDealer !== 'ทั้งหมด') {
        const hasDealer = p.prices.some(pp => pp.dealer === selectedDealer);
        if (!hasDealer) return false;
      }
      const best = getBestPrice(p);
      if (priceMin && best.price < Number(priceMin)) return false;
      if (priceMax && best.price > Number(priceMax)) return false;
      return true;
    })
    .sort((a, b) => {
      const bestA = getBestPrice(a);
      const bestB = getBestPrice(b);
      switch (sortBy) {
        case 'price_asc': return bestA.price - bestB.price;
        case 'price_desc': return bestB.price - bestA.price;
        case 'discount_desc': return bestB.price.discount - bestA.price.discount;
        case 'sold_desc':
          const soldA = a.prices.reduce((s, p) => s + p.sold, 0);
          const soldB = b.prices.reduce((s, p) => s + p.sold, 0);
          return soldB - soldA;
        default: return 0;
      }
    });

  const dealerLogos: Record<string, string> = {
    shopee: '/logo_shopee.png',
    lazada: '/logo_lazada.png',
    tiktok: '/logo_tiktok.png',
  };

  return (
    <div className="min-h-screen bg-[#F5F5FA]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-2xl">←</Link>
          <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-2.5">
            <span className="text-gray-400">🔍</span>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="ค้นหาสินค้า..."
              className="flex-1 bg-transparent outline-none text-sm text-gray-700"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-gray-400 text-sm">✕</button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2.5 rounded-2xl bg-gray-100 text-gray-600 text-lg"
          >
            ⚙️
          </button>
        </div>
      </header>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white border-b border-gray-100 px-4 py-4">
          <div className="max-w-7xl mx-auto space-y-4">
            {/* Categories */}
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-2">หมวดหมู่</div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${!selectedCategory ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-violet-50'}`}
                >
                  ทั้งหมด
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${selectedCategory === cat ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-violet-50'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Dealers */}
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-2">ร้านค้า</div>
              <div className="flex flex-wrap gap-2">
                {dealers.map(d => (
                  <button
                    key={d}
                    onClick={() => setSelectedDealer(d)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${selectedDealer === d ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-violet-50'}`}
                  >
                    {d === 'ทั้งหมด' ? 'ทั้งหมด' : d.charAt(0).toUpperCase() + d.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-2">ราคา (บาท)</div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={priceMin}
                  onChange={e => setPriceMin(e.target.value)}
                  placeholder="ต่ำสุด"
                  className="w-28 px-3 py-1.5 rounded-xl bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-violet-500"
                />
                <span className="text-gray-400">—</span>
                <input
                  type="number"
                  value={priceMax}
                  onChange={e => setPriceMax(e.target.value)}
                  placeholder="สูงสุด"
                  className="w-28 px-3 py-1.5 rounded-xl bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-violet-500"
                />
                <button
                  onClick={() => { setPriceMin(''); setPriceMax(''); }}
                  className="text-xs text-violet-600 font-semibold px-3"
                >
                  ล้าง
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sort bar */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <div className="text-sm text-gray-500">
          เจอ <span className="font-bold text-violet-600">{filtered.length}</span> รายการ
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="text-sm bg-gray-100 px-3 py-2 rounded-xl outline-none text-gray-700 font-medium cursor-pointer"
        >
          {sortOptions.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      <div className="p-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-bold text-gray-700 mb-1">ไม่เจอสินค้าที่ค้นหา</h3>
            <p className="text-sm text-gray-400">ลองเปลี่ยนคำค้นหาหรือปรับตัวกรอง</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filtered.map(p => {
              const best = getBestPrice(p);
              return (
                <Link key={p.id} href={`/product/${p.id}`}>
                  <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer h-full flex flex-col">
                    <div className="relative mb-2">
                      <img src={p.image} alt={p.name} className="w-full h-28 object-cover rounded-lg" />
                      <span className="absolute top-1 left-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                        -{best.discount}%
                      </span>
                      <span className="absolute top-1 right-1 bg-violet-600 text-white text-xs px-1.5 py-0.5 rounded">
                        {p.category.split(' ')[0]}
                      </span>
                    </div>
                    <h3 className="font-bold text-xs text-gray-800 mb-1 line-clamp-2 flex-1">{p.name}</h3>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-base font-black text-red-500">{formatPrice(best.price)}</span>
                      <span className="text-xs text-gray-400 line-through">{formatPrice(best.oldPrice)}</span>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1">
                        <img src={dealerLogos[best.dealer]} alt={best.dealer} className="w-4 h-4 object-contain" />
                        <span className="text-xs text-gray-400">{best.dealer}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        ⭐ {best.rating}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}