const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://deela-foa0.onrender.com';

export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/api/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchTrendingDeals() {
  const res = await fetch(`${API_BASE}/api/trending/deals`);
  if (!res.ok) throw new Error('Failed to fetch trending deals');
  return res.json();
}

export async function fetchProduct(id: string) {
  const res = await fetch(`${API_BASE}/api/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/api/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}