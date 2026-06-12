import { NextResponse } from 'next/server'

const CATEGORIES = [
  { name: 'smartphones', label: 'มือถือ' },
  { name: 'laptops', label: 'คอมพิวเตอร์' },
  { name: 'mobile-accessories', label: 'อิเล็กทรอนิกส์' },
]

export async function GET() {
  try {
    const results = await Promise.all(
      CATEGORIES.map(async (cat) => {
        const res = await fetch(
          `https://dummyjson.com/products/category/${cat.name}?limit=20&select=id,title,price,thumbnail,description,rating,brand,category`
        )
        const data = await res.json()
        return {
          category: cat.name,
          label: cat.label,
          products: data.products,
        }
      })
    )

    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
