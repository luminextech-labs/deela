'use client';

import { useState } from 'react';
import Link from 'next/link';
import { products, type Product } from '../lib/data';

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
  lazada: 'bg-blue-600',
  tiktok: 'bg-black',
};

// สินค้าที่เลือกเปรียบเทียบ
type CompareProduct = {
  product: Product;
  selectedDealer: string;
};

export default function ComparePage() {
  const [compareList, setCompareList] = useState<CompareProduct[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const availableProducts = products.filter(
    p => !compareList.some(c => c.product.id === p.id)
  );

  function addProduct(product: Product) {
    const lowestPrice = product.prices.reduce((a, b) => a.price < b.price ? a : b);
    setCompareList([...compareList, { product, selectedDealer: lowestPrice.dealer }]);
    setShowAddModal(false);
  }

  function removeProduct(id: string) {
    setCompareList(compareList.filter(c => c.product.id !== id));
  }

  function updateDealer(productId: string, dealer: string) {
    setCompareList(compareList.map(c =>
      c.product.id === productId ? { ...c, selectedDealer: dealer } : c
    ));
  }

  return (
    <div className="min-h-screen bg-[#F5F5FA]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-xl text-gray-600">←</Link>
          <h1 className="font-black text-gray-800">เปรียบเทียบราคา</h1>
          <div className="flex-1" />
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-violet-600 text-white text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-1"
          >
            + เพิ่มสินค้า
          </button>
        </div>
      </header>

      <div className="p-4 max-w-7xl mx-auto">
        {compareList.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⚖️</div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">ยังไม่มีสินค้าในการเปรียบเทียบ</h2>
            <p className="text-sm text-gray-400 mb-6">เพิ่มสินค้าที่ต้องการเปรียบเทียบราคาจากหลายร้านค้า</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-violet-600 text-white font-bold px-6 py-3 rounded-xl"
            >
              + เพิ่มสินค้าเปรียบเทียบ
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Compare Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="grid overflow-x-auto" style={{ minWidth: 600 }}>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left p-4 font-bold text-gray-500 text-sm w-40">สินค้า</th>
                      {compareList.map(c => (
                        <th key={c.product.id} className="p-4 text-center min-w-44">
                          <div className="relative">
                            <button
                              onClick={() => removeProduct(c.product.id)}
                              className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full"
                            >
                              ✕
                            </button>
                            <img src={c.product.image} alt={c.product.name} className="w-full h-24 object-cover rounded-xl mb-2" />
                            <div className="text-xs font-bold text-gray-800 line-clamp-2">{c.product.name}</div>
                          </div>
                        </th>
                      ))}
                      {compareList.length < 3 && (
                        <th className="p-4 text-center min-w-44">
                          <button
                            onClick={() => setShowAddModal(true)}
                            className="w-full h-24 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:border-violet-400 hover:text-violet-600 transition"
                          >
                            <span className="text-2xl">+</span>
                          </button>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Price per dealer */}
                    {['shopee', 'lazada', 'tiktok'].map(dealer => (
                      <tr key={dealer} className="border-b border-gray-100">
                        <td className="p-4">
                          <div className={`w-6 h-6 rounded-full ${dealerColors[dealer]} flex items-center justify-center text-white text-xs font-bold`}>
                            {dealer[0].toUpperCase()}
                          </div>
                        </td>
                        {compareList.map(c => {
                          const priceData = c.product.prices.find(p => p.dealer === dealer);
                          return (
                            <td key={c.product.id} className="p-4 text-center">
                              {priceData ? (
                                <div>
                                  <div className={`font-black text-lg ${priceData.dealer === c.selectedDealer ? 'text-violet-600' : 'text-gray-800'}`}>
                                    {formatPrice(priceData.price)}
                                  </div>
                                  <div className="text-xs text-gray-400 line-through">{formatPrice(priceData.oldPrice)}</div>
                                  <div className="text-xs text-red-500 font-bold">-{priceData.discount}%</div>
                                </div>
                              ) : (
                                <span className="text-gray-300 text-sm">—</span>
                              )}
                            </td>
                          );
                        })}
                        {compareList.length < 3 && <td />}
                      </tr>
                    ))}

                    {/* Rating */}
                    <tr className="border-b border-gray-100">
                      <td className="p-4 font-bold text-gray-500 text-sm">⭐ คะแนน</td>
                      {compareList.map(c => {
                        const avgRating = c.product.prices.reduce((s, p) => s + p.rating, 0) / c.product.prices.length;
                        return (
                          <td key={c.product.id} className="p-4 text-center">
                            <span className="font-bold text-gray-800">{avgRating.toFixed(1)}</span>
                          </td>
                        );
                      })}
                      {compareList.length < 3 && <td />}
                    </tr>

                    {/* Sold count */}
                    <tr className="border-b border-gray-100">
                      <td className="p-4 font-bold text-gray-500 text-sm">📦 ขายแล้ว</td>
                      {compareList.map(c => {
                        const totalSold = c.product.prices.reduce((s, p) => s + p.sold, 0);
                        return (
                          <td key={c.product.id} className="p-4 text-center">
                            <span className="font-bold text-gray-800">{totalSold.toLocaleString()}</span>
                          </td>
                        );
                      })}
                      {compareList.length < 3 && <td />}
                    </tr>

                    {/* Action */}
                    <tr>
                      <td className="p-4 font-bold text-gray-500 text-sm">🛒 ซื้อ</td>
                      {compareList.map(c => {
                        const selectedPrice = c.product.prices.find(p => p.dealer === c.selectedDealer) || c.product.prices[0];
                        return (
                          <td key={c.product.id} className="p-4 text-center">
                            <a
                              href={selectedPrice.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block bg-violet-600 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-violet-700 transition"
                            >
                              ซื้อจาก {dealerLabels[selectedPrice.dealer]}
                            </a>
                          </td>
                        );
                      })}
                      {compareList.length < 3 && <td />}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Winner Banner */}
            {compareList.length >= 2 && (() => {
              const best = compareList.map(c => {
                const lowest = c.product.prices.reduce((a, b) => a.price < b.price ? a : b);
                return { ...c, lowest };
              }).sort((a, b) => a.lowest.price - b.lowest.price)[0];

              return (
                <div className="bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-2xl p-6 text-center text-white">
                  <div className="text-sm font-medium opacity-80 mb-1">ราคาถูกสุด</div>
                  <div className="text-2xl font-black mb-2">{best.product.name}</div>
                  <div className="text-4xl font-black mb-4">
                    {formatPrice(best.lowest.price)}
                    <span className="text-lg ml-2 opacity-80">จาก {dealerLabels[best.lowest.dealer]}</span>
                  </div>
                  <a
                    href={best.lowest.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-white text-violet-600 font-bold px-8 py-3 rounded-xl"
                  >
                    ซื้อเลย →
                  </a>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-800">เพิ่มสินค้าเปรียบเทียบ</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 text-xl">✕</button>
            </div>
            <div className="p-4 overflow-y-auto max-h-96 space-y-2">
              {availableProducts.map(p => {
                const best = p.prices.reduce((a, b) => a.price < b.price ? a : b);
                return (
                  <button
                    key={p.id}
                    onClick={() => addProduct(p)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-violet-50 transition text-left"
                  >
                    <img src={p.image} alt={p.name} className="w-14 h-14 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-gray-800 line-clamp-1">{p.name}</div>
                      <div className="text-xs text-gray-500">{dealerLabels[best.dealer]} · {formatPrice(best.price)}</div>
                    </div>
                    <div className="text-violet-600 font-bold text-sm">+</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}