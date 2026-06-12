'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface Product {
  id: number
  title: string
  price: number
  thumbnail: string
  description: string
  rating: number
  brand: string
  category: string
}

interface CategoryData {
  name: string
  slug: string
  emoji: string
  products: Product[]
}

const CATEGORIES = [
  { name: 'มือถือ', slug: 'smartphones', emoji: '📱' },
  { name: 'คอมพิวเตอร์', slug: 'laptops', emoji: '💻' },
  { name: 'อิเล็กทรอนิกส์', slug: 'mobile-accessories', emoji: '📷' },
]

export default function ProductShowcase() {
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const results = await Promise.all(
          CATEGORIES.map(async (cat) => {
            const res = await fetch(
              `https://dummyjson.com/products/category/${cat.slug}?limit=20&select=id,title,price,thumbnail,description,rating,brand,category`
            )
            const data = await res.json()
            return {
              name: cat.name,
              slug: cat.slug,
              emoji: cat.emoji,
              products: data.products as Product[],
            }
          })
        )
        setCategories(results)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        {CATEGORIES.map((cat) => (
          <div key={cat.slug} className="mb-6">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-3" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="rounded-xl bg-gray-200 animate-pulse aspect-[3/4]" />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {categories.map((cat) => (
        <section key={cat.slug} className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">{cat.emoji}</span>
            <h2 className="text-lg font-semibold text-gray-800">{cat.name}</h2>
            <span className="text-xs text-gray-400">({cat.products.length} รายการ)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {cat.products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer group"
              >
                <div className="relative w-full aspect-square bg-gray-50">
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-200"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-400 mb-1">{product.brand}</p>
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 leading-tight">
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-yellow-400 text-xs">★</span>
                    <span className="text-xs text-gray-500">{product.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-base font-semibold text-gray-900">
                    ฿{product.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
