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

interface HistoryItem {
  productId: string;
  viewedAt: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('deela_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  function clearHistory() {
    setHistory([]);
    localStorage.removeItem('deela_history');
  }

  // Map history to products (dedup, latest first)
  const historyProducts = history
    .map(h => ({ ...h, product: products.find(p => p.id === h.productId) }))
    .filter(h => h.product)
    .reverse();

  // Group by date
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    const dStr = d.toDateString();
    if (dStr === today) return 'วันนี้';
    if (dStr === yesterday) return 'เมื่อวาน';
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  }

  // Add sample history if empty (for demo)
  useEffect(() => {
    if (history.length === 0) {
      const sampleHistory: HistoryItem[] = [
        { productId: 'p001', viewedAt: new Date(Date.now() - 3600000).toISOString() },
        { productId: 'p002', viewedAt: new Date(Date.now() - 7200000).toISOString() },
        { productId: 'p004', viewedAt: new Date(Date.now() - 86400000).toISOString() },
        { productId: 'p007', viewedAt: new Date(Date.now() - 172800000).toISOString() },
      ];
      setHistory(sampleHistory);
      localStorage.setItem('deela_history', JSON.stringify(sampleHistory));
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5FA]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-xl text-gray-600">←</Link>
          <h1 className="font-black text-gray-800">📜 ประวัติการเข้าชม</h1>
          <div className="flex-1" />
          {historyProducts.length > 0 && (
            <button onClick={clearHistory} className="text-sm text-gray-400 hover:text-red-500">
              🗑 ล้างประวัติ
            </button>
          )}
        </div>
      </header>

      {historyProducts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📜</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">ยังไม่มีประวัติการเข้าชม</h2>
          <p className="text-sm text-gray-400 mb-6">เริ่มค้นหาและดูสินค้าที่สนใจ</p>
          <Link href="/search" className="bg-violet-600 text-white font-bold px-6 py-3 rounded-xl inline-block">
            เริ่มค้นหาสินค้า
          </Link>
        </div>
      ) : (
        <div className="p-4 max-w-2xl mx-auto space-y-4">
          {/* Group by date */}
          {['วันนี้', 'เมื่อวาน', 'ก่อนหน้า'].map((label) => {
            const items = historyProducts.filter(h => {
              const d = new Date(h.viewedAt);
              if (label === 'วันนี้') return d.toDateString() === today;
              if (label === 'เมื่อวาน') return d.toDateString() === yesterday;
              return d.toDateString() !== today && d.toDateString() !== yesterday;
            });
            if (items.length === 0) return null;

            return (
              <div key={label}>
                <div className="text-sm font-bold text-gray-400 mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  {label}
                </div>
                <div className="space-y-2">
                  {items.map((h, idx) => {
                    if (!h.product) return null;
                    const best = getBestPrice(h.product);
                    return (
                      <Link key={`${h.productId}-${idx}`} href={`/product/${h.product.id}`}>
                        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer flex items-center gap-3">
                          <img src={h.product.image} alt={h.product.name} className="w-16 h-16 rounded-xl object-cover" />
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm text-gray-800 line-clamp-1">{h.product.name}</div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              ดูเมื่อ {formatTime(h.viewedAt)}
                            </div>
                            <div className="flex items-baseline gap-1 mt-1">
                              <span className="text-sm font-black text-violet-600">{formatPrice(best.price)}</span>
                              <span className="text-xs text-gray-400 line-through">{formatPrice(best.oldPrice)}</span>
                            </div>
                          </div>
                          <img src={dealerLogos[best.dealer]} alt={best.dealer} className="w-5 h-5 object-contain shrink-0" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}