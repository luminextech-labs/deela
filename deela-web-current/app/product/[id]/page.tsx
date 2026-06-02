'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { getProduct, comparePrices, getRelatedProducts, type ProductPrice } from '../../lib/data';

function formatPrice(p: number) {
  return '฿' + p.toLocaleString('th-TH');
}

const dealerLabels: Record<string, string> = {
  shopee: 'Shopee',
  lazada: 'Lazada',
  tiktok: 'TikTok Shop',
};

const dealerColors: Record<string, string> = {
  shopee: 'bg-orange-500',
  lazada: '#2E5BFF',
  tiktok: 'bg-black',
};

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const product = getProduct(params.id as string);

  // Track view history
  useEffect(() => {
    if (product) {
      const historyItem = { productId: product.id, viewedAt: new Date().toISOString() };
      const saved = localStorage.getItem('deela_history');
      const history = saved ? JSON.parse(saved) : [];
      // Remove old entry for same product, add new
      const filtered = history.filter((h: { productId: string }) => h.productId !== product.id);
      const updated = [historyItem, ...filtered].slice(0, 50); // keep last 50
      localStorage.setItem('deela_history', JSON.stringify(updated));
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F5F5FA] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">ไม่พบสินค้านี้</h2>
          <Link href="/" className="text-violet-600 font-semibold">← กลับหน้าหลัก</Link>
        </div>
      </div>
    );
  }

  const sortedPrices = comparePrices(product);
  const bestPrice = sortedPrices[0];
  const related = getRelatedProducts(product);

  return (
    <div className="min-h-screen bg-[#F5F5FA]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Link href="/search" className="text-xl text-gray-600">←</Link>
          <div className="flex-1 truncate">
            <h1 className="font-bold text-sm text-gray-800 truncate">{product.name}</h1>
          </div>
          <button className="p-2 text-gray-400 text-lg">🔔</button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-4">
        {/* Product Info */}
        <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <img src={product.image} alt={product.name} className="w-full aspect-square object-cover rounded-xl" />
              <span className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-lg">
                -{bestPrice.discount}%
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-violet-100 text-violet-700 text-xs px-2 py-1 rounded-lg font-semibold">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  ⭐ {bestPrice.rating} · ขายแล้ว {bestPrice.sold.toLocaleString()} ชิ้น
                </div>
              </div>
              <h1 className="text-xl font-black text-gray-800 mb-3">{product.name}</h1>
              <p className="text-sm text-gray-600 mb-4">{product.description}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {product.tags.map(tag => (
                  <span key={tag} className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">#{tag}</span>
                ))}
              </div>

              {/* Specs */}
              <div className="bg-gray-50 rounded-xl p-3 mb-4">
                <div className="text-xs font-bold text-gray-500 mb-2">สเปค</div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="flex items-start gap-2">
                      <span className="text-xs text-gray-400 shrink-0">{key}:</span>
                      <span className="text-xs font-semibold text-gray-700">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Price Comparison */}
        <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100">
          <h2 className="text-lg font-black text-gray-800 mb-4 flex items-center gap-2">
            💰 เปรียบเทียบราคา
            <span className="text-sm font-normal text-gray-400">({sortedPrices.length} ร้าน)</span>
          </h2>

          <div className="space-y-3">
            {sortedPrices.map((price, index) => (
              <a
                key={price.dealer}
                href={price.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition cursor-pointer hover:shadow-md ${
                  index === 0 ? 'border-violet-500 bg-violet-50' : 'border-gray-100 bg-white hover:border-violet-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-full ${dealerColors[price.dealer]} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                  {price.dealer[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm text-gray-800">{dealerLabels[price.dealer]}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <span>⭐ {price.rating}</span>
                    <span>·</span>
                    <span>ขายแล้ว {price.sold.toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-black ${index === 0 ? 'text-violet-600' : 'text-gray-800'}`}>
                    {formatPrice(price.price)}
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-gray-400 line-through">{formatPrice(price.oldPrice)}</span>
                    <span className="text-red-500 font-bold">-{price.discount}%</span>
                  </div>
                </div>
                {index === 0 && (
                  <div className="bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-lg shrink-0">
                    ถูกสุด ✓
                  </div>
                )}
              </a>
            ))}
          </div>

          <div className="mt-4 bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-xl p-4 text-center">
            <a
              href={bestPrice.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-bold text-lg"
            >
              ซื้อจาก {dealerLabels[bestPrice.dealer]} → ราคา {formatPrice(bestPrice.price)}
            </a>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h2 className="text-lg font-black text-gray-800 mb-4">📦 สินค้าที่เกี่ยวข้อง</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {related.map(p => {
                const best = p.prices.reduce((a, b) => a.price < b.price ? a : b);
                return (
                  <Link key={p.id} href={`/product/${p.id}`}>
                    <div className="bg-gray-50 rounded-xl p-3 hover:bg-violet-50 transition cursor-pointer">
                      <img src={p.image} alt={p.name} className="w-full h-20 object-cover rounded-lg mb-2" />
                      <h3 className="font-bold text-xs text-gray-800 line-clamp-2 mb-1">{p.name}</h3>
                      <div className="text-sm font-black text-violet-600">{formatPrice(best.price)}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}