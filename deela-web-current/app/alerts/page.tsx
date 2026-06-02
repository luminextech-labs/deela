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

const dealerLabels: Record<string, string> = {
  shopee: 'Shopee',
  lazada: 'Lazada',
  tiktok: 'TikTok Shop',
};

const dealerColors: Record<string, string> = {
  shopee: 'bg-orange-500',
  lazada: 'bg-blue-600',
  tiktok: 'bg-black',
};

export interface PriceAlert {
  productId: string;
  targetPrice: number;
  createdAt: string;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [targetPrice, setTargetPrice] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('deela_alerts');
    if (saved) setAlerts(JSON.parse(saved));
  }, []);

  function addAlert() {
    if (!selectedProductId || !targetPrice) return;
    const newAlert: PriceAlert = {
      productId: selectedProductId,
      targetPrice: Number(targetPrice),
      createdAt: new Date().toISOString(),
    };
    const next = [...alerts, newAlert];
    setAlerts(next);
    localStorage.setItem('deela_alerts', JSON.stringify(next));
    setSelectedProductId('');
    setTargetPrice('');
    setShowAddModal(false);
  }

  function removeAlert(productId: string) {
    const next = alerts.filter(a => a.productId !== productId);
    setAlerts(next);
    localStorage.setItem('deela_alerts', JSON.stringify(next));
  }

  return (
    <div className="min-h-screen bg-[#F5F5FA]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-xl text-gray-600">←</Link>
          <h1 className="font-black text-gray-800">🔔 ติดตามราคา</h1>
          <div className="flex-1" />
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-violet-600 text-white text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-1"
          >
            + เพิ่มสินค้า
          </button>
        </div>
      </header>

      {alerts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔔</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">ยังไม่มีการติดตามราคา</h2>
          <p className="text-sm text-gray-400 mb-6">ตั้งค่าราคาที่ต้องการ เราจะแจ้งเตือนเมื่อราคาลงถึง</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-violet-600 text-white font-bold px-6 py-3 rounded-xl"
          >
            + ตั้งค่าติดตามราคา
          </button>
        </div>
      ) : (
        <div className="p-4 max-w-2xl mx-auto space-y-3">
          {alerts.map(alert => {
            const product = products.find(p => p.id === alert.productId);
            if (!product) return null;
            const best = getBestPrice(product);
            const isBelowTarget = best.price <= alert.targetPrice;

            return (
              <div key={alert.productId} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <img src={product.image} alt={product.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${product.id}`} className="font-bold text-sm text-gray-800 hover:text-violet-600">
                      {product.name}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <img src="/logo_shopee.png" alt="shopee" className="w-4 h-4" />
                      <img src="/logo_lazada.png" alt="lazada" className="w-4 h-4" />
                      <img src="/logo_tiktok.png" alt="tiktok" className="w-4 h-4" />
                    </div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-lg font-black text-violet-600">{formatPrice(best.price)}</span>
                      <span className="text-xs text-gray-400 line-through">{formatPrice(best.oldPrice)}</span>
                      <span className="text-xs text-red-500 font-bold ml-1">-{best.discount}%</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`text-xs font-bold px-3 py-1 rounded-full ${isBelowTarget ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {isBelowTarget ? '🎉 ถึงราคาแล้ว!' : '⏳ รอราคาลง'}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      เป้า: {formatPrice(alert.targetPrice)}
                    </div>
                  </div>
                  <button
                    onClick={() => removeAlert(alert.productId)}
                    className="text-gray-300 hover:text-red-500 text-lg"
                  >
                    🗑
                  </button>
                </div>
              </div>
            );
          })}

          <div className="bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-2xl p-4 text-center text-white">
            <p className="text-sm opacity-80 mb-1">แจ้งเตือนราคาอัตโนมัติ</p>
            <p className="font-bold text-xs opacity-60">เมื่อเชื่อมต่อ API ของ Shopee, Lazada, TikTok</p>
          </div>
        </div>
      )}

      {/* Add Alert Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h2 className="font-black text-gray-800 mb-4">🔔 ตั้งค่าติดตามราคา</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-500 mb-1 block">เลือกสินค้า</label>
                <select
                  value={selectedProductId}
                  onChange={e => {
                    setSelectedProductId(e.target.value);
                    if (e.target.value) {
                      const product = products.find(p => p.id === e.target.value);
                      if (product) setTargetPrice(String(Math.floor(product.prices[0].price * 0.9)));
                    }
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="">-- เลือกสินค้า --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {selectedProductId && (() => {
                const product = products.find(p => p.id === selectedProductId);
                if (!product) return null;
                const best = getBestPrice(product);
                return (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-xs text-gray-500 mb-1">ราคาปัจจุบัน (ต่ำสุด)</div>
                    <div className="text-lg font-black text-violet-600">{formatPrice(best.price)}</div>
                  </div>
                );
              })()}

              <div>
                <label className="text-sm font-semibold text-gray-500 mb-1 block">ราคาเป้าหมาย (บาท)</label>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={e => setTargetPrice(e.target.value)}
                  placeholder="ใส่ราคาที่ต้องการ"
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <button
                onClick={addAlert}
                disabled={!selectedProductId || !targetPrice}
                className="w-full bg-violet-600 text-white font-bold py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ตั้งค่าติดตาม
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}