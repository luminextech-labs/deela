'use client';

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

// Sort by total sold across all dealers
const popularProducts = [...products].sort((a, b) => {
  const soldA = a.prices.reduce((s, p) => s + p.sold, 0);
  const soldB = b.prices.reduce((s, p) => s + p.sold, 0);
  return soldB - soldA;
});

export default function PopularPage() {
  return (
    <div className="min-h-screen bg-[#F5F5FA]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-xl text-gray-600">←</Link>
          <h1 className="font-black text-gray-800">🔥 สินค้ายอดนิยม</h1>
        </div>
      </header>

      <div className="p-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {popularProducts.map((p, index) => {
            const best = getBestPrice(p);
            const totalSold = p.prices.reduce((s, price) => s + price.sold, 0);
            return (
              <Link key={p.id} href={`/product/${p.id}`}>
                <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer h-full flex flex-col relative">
                  {/* Rank badge */}
                  <div className={`absolute top-1 left-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                    index === 0 ? 'bg-yellow-400 text-yellow-900' :
                    index === 1 ? 'bg-gray-300 text-gray-700' :
                    index === 2 ? 'bg-amber-600 text-white' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="relative mb-2 mt-4">
                    <img src={p.image} alt={p.name} className="w-full h-28 object-cover rounded-lg" />
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                      -{best.discount}%
                    </span>
                  </div>
                  <h3 className="font-bold text-xs text-gray-800 mb-1 line-clamp-2 flex-1">{p.name}</h3>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-base font-black text-red-500">{formatPrice(best.price)}</span>
                    <span className="text-xs text-gray-400 line-through">{formatPrice(best.oldPrice)}</span>
                  </div>
                  <div className="text-xs text-gray-400 mb-2">📦 ขายแล้ว {totalSold.toLocaleString()}</div>
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
      </div>
    </div>
  );
}