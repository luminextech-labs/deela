'use client';

import { useState } from 'react';
import Link from 'next/link';
import { categories, products, type Product } from '../lib/data';

function formatPrice(p: number) {
  return '฿' + p.toLocaleString('th-TH');
}

function getBestPrice(product: Product) {
  return product.prices.reduce((a, b) => a.price < b.price ? a : b);
}

// Icons per category (emoji-based, standard mall style)
const categoryIcons: Record<string, string> = {
  'อิเล็กทรอนิกส์': '📺',
  'มือถือ & แก็ดเจ็ต': '📱',
  'คอมพิวเตอร์': '💻',
  'หูฟัง & เสียง': '🎧',
  'เกมมิ่งเกียร์': '🎮',
  'บ้าน & ไลฟ์สไตล์': '🏠',
  'สุขภาพ & ความงาม': '💆',
  'แฟชั่น': '👕',
};

const dealerLogos: Record<string, string> = {
  shopee: '/logo_shopee.png',
  lazada: '/logo_lazada.png',
  tiktok: '/logo_tiktok.png',
};

export default function CategoriesPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredProducts = activeCategory
    ? products.filter(p => p.category === activeCategory)
    : products;

  return (
    <div className="min-h-screen bg-[#F5F5FA]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-xl text-gray-600">←</Link>
          <h1 className="font-black text-gray-800">หมวดหมู่สินค้า</h1>
        </div>
      </header>

      {/* Category Grid */}
      <div className="p-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3 mb-6">
          <button
            onClick={() => setActiveCategory(null)}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition ${
              activeCategory === null ? 'bg-violet-600 text-white' : 'bg-white text-gray-600 hover:bg-violet-50'
            }`}
          >
            <span className="text-2xl">🏪</span>
            <span className="text-xs font-semibold text-center">ทั้งหมด</span>
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
              className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition ${
                activeCategory === cat ? 'bg-violet-600 text-white' : 'bg-white text-gray-600 hover:bg-violet-50'
              }`}
            >
              <span className="text-2xl">{categoryIcons[cat] || '📦'}</span>
              <span className="text-xs font-semibold text-center leading-tight">{cat.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filteredProducts.map(p => {
            const best = getBestPrice(p);
            return (
              <Link key={p.id} href={`/product/${p.id}`}>
                <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer h-full flex flex-col">
                  <div className="relative mb-2">
                    <img src={p.image} alt={p.name} className="w-full h-28 object-cover rounded-lg" />
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
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      ⭐ {best.rating}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-lg font-bold text-gray-700 mb-1">ไม่มีสินค้าในหมวดนี้</h3>
            <button onClick={() => setActiveCategory(null)} className="text-violet-600 font-semibold mt-2">ดูสินค้าทั้งหมด</button>
          </div>
        )}
      </div>
    </div>
  );
}