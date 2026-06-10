'use client';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price?: number;
    oldPrice?: number;
    discount?: number;
    shop?: string;
    rating?: number;
    reviews?: number;
    sold?: number;
    image?: string;
    image_url?: string;
    lowest_price?: string | number;
    highest_rating?: string | number;
  };
}

function ShopBadge({ shop }: { shop: string }) {
  const colors: Record<string, string> = {
    Shopee: 'bg-red-100 text-red-600',
    Lazada: 'bg-blue-100 text-blue-600',
    TikTok: 'bg-black text-white',
  };
  return (
    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${colors[shop] || 'bg-gray-100 text-gray-600'}`}>
      {shop}
    </span>
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  const price = product.price ?? Number(product.lowest_price) ?? 0;
  const oldPrice = product.oldPrice ?? 0;
  const discount = product.discount ?? (oldPrice > price ? Math.round((1 - price / oldPrice) * 100) : 0);
  const rating = product.rating ?? Number(product.highest_rating) ?? 0;
  const reviews = product.reviews ?? 0;
  const sold = product.sold ?? 0;
  const image = product.image || product.image_url || '/placeholder.png';
  const shop = product.shop || 'Shopee';

  return (
    <a
      href={`/product/${product.id}`}
      className="bg-white rounded-xl p-2.5 shadow-sm border border-gray-100 hover:shadow-md hover:border-violet-200 transition cursor-pointer block group"
    >
      {/* Image */}
      <div className="relative mb-2">
        <img
          src={image}
          alt={product.name}
          className="w-full h-28 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
          onError={(e) => { e.currentTarget.src = '/placeholder.png'; }}
        />
        {discount > 0 && (
          <span className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            -{discount}%
          </span>
        )}
        {sold > 1000 && (
          <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded backdrop-blur-sm">
            🔥 {sold.toLocaleString()} ขายแล้ว
          </span>
        )}
      </div>

      {/* Product Name */}
      <h3 className="font-semibold text-[11px] text-gray-800 mb-1.5 line-clamp-2 leading-tight group-hover:text-violet-700 transition">
        {product.name}
      </h3>

      {/* Price */}
      <div className="flex items-baseline gap-1.5 mb-1.5">
        <span className="text-base font-black text-red-500">฿{price.toLocaleString()}</span>
        {oldPrice > price && (
          <span className="text-[10px] text-gray-400 line-through">฿{oldPrice.toLocaleString()}</span>
        )}
      </div>

      {/* Rating + Shop */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-yellow-400 text-[10px]">⭐</span>
          <span className="text-[10px] font-medium text-gray-600">{rating.toFixed(1)}</span>
          <span className="text-[9px] text-gray-400">({reviews > 999 ? `${(reviews/1000).toFixed(1)}K` : reviews})</span>
        </div>
        <ShopBadge shop={shop} />
      </div>
    </a>
  );
}