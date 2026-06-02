'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { products, type Product } from '../lib/data';

function formatPrice(p: number) {
  return '฿' + p.toLocaleString('th-TH');
}

function getBestPrice(product: Product) {
  return product.prices.reduce((a, b) => a.price < b.price ? a : b);
}

const dealerLogos: Record<string, string> = {
  shopee: '/logo_shopee.png',
  lazada: '/logo_lazada.png',
  tiktok: '/logo_tiktok.png',
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('deela_favorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  function toggleFavorite(productId: string) {
    const next = favorites.includes(productId)
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId];
    setFavorites(next);
    localStorage.setItem('deela_favorites', JSON.stringify(next));
  }

  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  return (
    <div className="min-h-screen bg-[#F5F5FA]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-xl text-gray-600">←</Link>
          <h1 className="font-black text-gray-800">รายการโปรด</h1>
          <div className="flex-1" />
          <span className="text-sm text-gray-500">{favoriteProducts.length} รายการ</span>
        </div>
      </header>

      {favoriteProducts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">💖</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">ยังไม่มีรายการโปรด</h2>
          <p className="text-sm text-gray-400 mb-6">กดไอคอน ❤️ ที่สินค้าที่ชอบเพื่อบันทึกไว้</p>
          <Link href="/search" className="bg-violet-600 text-white font-bold px-6 py-3 rounded-xl inline-block">
            เริ่มค้นหาสินค้า
          </Link>
        </div>
      ) : (
        <div className="p-4 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {favoriteProducts.map(p => {
              const best = getBestPrice(p);
              return (
                <div key={p.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer relative">
                  <button
                    onClick={() => toggleFavorite(p.id)}
                    className="absolute top-2 right-2 z-10 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-red-500 hover:scale-110 transition"
                  >
                    ♥
                  </button>
                  <Link href={`/product/${p.id}`} className="block">
                    <div className="relative mb-2">
                      <img src={p.image} alt={p.name} className="w-full h-28 object-cover rounded-lg" />
                      <span className="absolute top-1 left-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                        -{best.discount}%
                      </span>
                    </div>
                    <h3 className="font-bold text-xs text-gray-800 mb-1 line-clamp-2">{p.name}</h3>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-base font-black text-red-500">{formatPrice(best.price)}</span>
                      <span className="text-xs text-gray-400 line-through">{formatPrice(best.oldPrice)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <img src={dealerLogos[best.dealer]} alt={best.dealer} className="w-4 h-4 object-contain" />
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        ⭐ {best.rating}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}