'use client';

import { useState, useEffect } from 'react';
import MobileSidebar from '../components/MobileSidebar';
import ProductCard from '../components/ProductCard';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'https://deela-foa0.onrender.com').replace(/\/$/, '');

const sortOptions = [
  { value: 'relevance', label: 'ความเกี่ยวข้อง' },
  { value: 'price_asc', label: 'ราคา: ต่ำ → สูง' },
  { value: 'price_desc', label: 'ราคา: สูง → สูง' },
  { value: 'rating', label: 'คะแนนสูงสุด' },
];

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  lowest_price: string;
  highest_rating: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  product_count: number;
}

export default function SearchPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputQuery, setInputQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch categories
    fetch(`${API_BASE}/api/categories/`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setCategories(data))
      .catch(() => setCategories([]));

    // Fetch products from URL params
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q') || '';
    setSearchQuery(q);
    setInputQuery(q);

    async function fetchProducts() {
      try {
        const url = q
          ? `${API_BASE}/api/products/search?q=${encodeURIComponent(q)}`
          : `${API_BASE}/api/products/`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setProducts(data);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(inputQuery)}`;
    } else {
      window.location.href = '/search';
    }
  };

  const toggleCategory = (slug: string) => {
    setSelectedCategories(prev =>
      prev.includes(slug) ? prev.filter(c => c !== slug) : [...prev, slug]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSortBy('relevance');
  };

  const filteredProducts = products.filter((p: any) => {
    if (selectedCategories.length === 0) return true;
    // No category field in product, show all
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a: any, b: any) => {
    if (sortBy === 'price_asc') return Number(a.lowest_price || 0) - Number(b.lowest_price || 0);
    if (sortBy === 'price_desc') return Number(b.lowest_price || 0) - Number(a.lowest_price || 0);
    if (sortBy === 'rating') return Number(b.highest_rating || 0) - Number(a.highest_rating || 0);
    return 0;
  });

  const hasActiveFilters = selectedCategories.length > 0 || sortBy !== 'relevance';

  return (
    <div className="min-h-screen bg-[#F5F5FA] flex">
      {/* Left Sidebar - Desktop Filter */}
      <aside className="w-[260px] bg-white border-r border-gray-100 p-5 flex flex-col h-screen sticky top-0 overflow-y-auto flex-shrink-0 hidden lg:flex">
        <img src="/logo.png" alt="Deela" className="h-12 mb-5 object-contain" />

        {/* Categories filter */}
        <div className="mb-5">
          <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-3">📂 หมวดหมู่</h3>
          <div className="space-y-0.5">
            {categories.slice(0, 12).map((cat) => (
              <label key={cat.slug} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.slug)}
                    onChange={() => toggleCategory(cat.slug)}
                    className="w-4 h-4 rounded border-gray-300 text-violet-600 accent-violet-600"
                  />
                  <span className="text-sm text-gray-600">{cat.name}</span>
                </div>
                <span className="text-xs text-gray-400">{cat.product_count?.toLocaleString() || '0'}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="mb-5">
          <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-3">↕️ จัดเรียง</h3>
          <div className="space-y-0.5">
            {sortOptions.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition">
                <input
                  type="radio"
                  name="sortBy"
                  checked={sortBy === opt.value}
                  onChange={() => setSortBy(opt.value)}
                  className="w-4 h-4 text-violet-600 accent-violet-600"
                />
                <span className="text-sm text-gray-600">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="w-full py-2.5 text-sm font-semibold text-violet-600 border border-violet-200 rounded-xl hover:bg-violet-50 transition"
          >
            🔄 ล้างตัวกรองทั้งหมด
          </button>
        )}
      </aside>

      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activePage="/search" />

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Search Header */}
        <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-30">
          <div className="flex items-center gap-3 max-w-3xl mx-auto">
            <a href="/" className="text-gray-400 hover:text-gray-600 text-xl shrink-0">←</a>
            <form onSubmit={handleSearch} className="flex-1 flex items-center bg-gray-100 rounded-2xl px-4 py-2.5 gap-2">
              <span className="text-gray-400 text-lg">🔍</span>
              <input
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="ค้นหาสินค้า..."
                className="flex-1 bg-transparent outline-none text-sm text-gray-700"
              />
              <button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-1.5 rounded-xl font-semibold text-sm transition shrink-0">
                ค้นหา
              </button>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="p-4 lg:p-6">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-4 bg-white rounded-2xl px-4 py-3 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2">
              {searchQuery && (
                <>
                  <span className="text-sm text-gray-500">ผลการค้นหา</span>
                  <span className="font-bold text-gray-800">"{searchQuery}"</span>
                </>
              )}
              {!searchQuery && (
                <>
                  <span className="text-sm text-gray-500">พบ</span>
                  <span className="font-bold text-gray-800">{sortedProducts.length}</span>
                  <span className="text-sm text-gray-500">รายการ</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-violet-50 rounded-xl text-sm text-violet-600 font-medium"
              >
                🎛️ ตัวกรอง
                {hasActiveFilters && <span className="w-2 h-2 bg-violet-600 rounded-full" />}
              </button>
            </div>
          </div>

          {/* Active filters pills */}
          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs text-gray-400">ตัวกรอง:</span>
              {selectedCategories.map((slug) => {
                const cat = categories.find(c => c.slug === slug);
                return (
                  <span key={slug} className="flex items-center gap-1.5 bg-violet-100 text-violet-700 text-xs font-semibold px-3 py-1 rounded-full">
                    {cat?.name || slug}
                    <button onClick={() => toggleCategory(slug)} className="hover:text-violet-900 ml-1">✕</button>
                  </span>
                );
              })}
            </div>
          )}

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {[1,2,3,4,5,6,7,8,9,10].map((i) => (
                <div key={i} className="bg-white rounded-xl p-2.5 animate-pulse border border-gray-100">
                  <div className="w-full h-32 bg-gray-200 rounded-lg mb-2" />
                  <div className="h-3.5 bg-gray-200 rounded mb-1.5 w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">🔍</div>
              <h3 className="font-bold text-gray-700 text-lg mb-1">ไม่พบสินค้า</h3>
              <p className="text-gray-400 text-sm mb-4">ลองค้นหาด้วยคำอื่น หรือปรับตัวกรอง</p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-violet-600 font-semibold text-sm hover:underline">ล้างตัวกรอง</button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {sortedProducts.map((p: any, i: number) => (
                <ProductCard key={p.id || i} product={p} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}