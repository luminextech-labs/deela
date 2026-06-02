// Mock data for Deela - สินค้า + Dealers

export type Dealer = 'shopee' | 'lazada' | 'tiktok';

export interface ProductPrice {
  price: number;
  oldPrice: number;
  discount: number;
  dealer: Dealer;
  url: string;
  rating: number;
  sold: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  prices: ProductPrice[];
  description: string;
  specs: Record<string, string>;
  tags: string[];
}

// หมวดหมู่
export const categories = [
  'อิเล็กทรอนิกส์',
  'มือถือ & แก็ดเจ็ต',
  'คอมพิวเตอร์',
  'หูฟัง & เสียง',
  'เกมมิ่งเกียร์',
  'บ้าน & ไลฟ์สไตล์',
  'สุขภาพ & ความงาม',
  'แฟชั่น',
];

// Mock Products
export const products: Product[] = [
  {
    id: 'p001',
    name: 'Anker Soundcore P20i หูฟัง TWS',
    category: 'หูฟัง & เสียง',
    image: '/placeholder.jpg',
    description: 'หูฟัง True Wireless ราคาประหยัด ฟังเพลงได้ 10 ชม. พร้อม Driver 10mm, BassUp, AI Noise Cancellation',
    specs: { 'การเชื่อมต่อ': 'Bluetooth 5.3', 'แบตเตอรี่': '10 ชม. (รวมเคส 40 ชม.)', 'กันน้ำ': 'IPX5', 'ไมค์': 'AI Noise Cancellation' },
    tags: ['หูฟัง', 'TWS', 'บลูทูธ'],
    prices: [
      { price: 690, oldPrice: 1290, discount: 47, dealer: 'shopee', url: 'https://shopee.co.th/anker-p20i', rating: 4.8, sold: 12500 },
      { price: 750, oldPrice: 1390, discount: 46, dealer: 'lazada', url: 'https://lazada.co.th/anker-p20i', rating: 4.7, sold: 8300 },
      { price: 699, oldPrice: 1290, discount: 46, dealer: 'tiktok', url: 'https://tiktok.com/anker-p20i', rating: 4.9, sold: 4200 },
    ],
  },
  {
    id: 'p002',
    name: 'iPhone 15 (128GB) สีฟ้า',
    category: 'มือถือ & แก็ดเจ็ต',
    image: '/placeholder.jpg',
    description: 'iPhone 15 พร้อม Dynamic Island, กล้อง 48MP, USB-C, ชิป A16 Bionic',
    specs: { 'จอ': '6.1" OLED Super Retina', 'ชิป': 'A16 Bionic', 'กล้อง': '48MP + 12MP Ultra Wide', 'แบต': '，视频播放最长可达20小时', 'USB': 'USB-C' },
    tags: ['iPhone', 'มือถือ', 'Apple'],
    prices: [
      { price: 27900, oldPrice: 31900, discount: 12, dealer: 'shopee', url: 'https://shopee.co.th/iphone15-128', rating: 4.9, sold: 3200 },
      { price: 28490, oldPrice: 32900, discount: 13, dealer: 'lazada', url: 'https://lazada.co.th/iphone15-128', rating: 4.8, sold: 2100 },
      { price: 28200, oldPrice: 31900, discount: 12, dealer: 'tiktok', url: 'https://tiktok.com/iphone15-128', rating: 4.9, sold: 980 },
    ],
  },
  {
    id: 'p003',
    name: 'Dyson V12 Detect Slim',
    category: 'บ้าน & ไลฟ์สไตล์',
    image: '/placeholder.jpg',
    description: 'เครื่องดูดฝุ่นไร้สาย พร้อมเลเซอร์ตรวจจับฝุ่น, จอ LCD, แรงดูด 150 AW',
    specs: { 'แรงดูด': '150 AW', 'ระยะเวลา': '60 นาที', 'ถัง': '0.35 ลิตร', 'น้ำหนัก': '2.2 กก.', 'เสียง': 'ต่ำกว่า 78 dB' },
    tags: ['เครื่องดูดฝุ่น', 'Dyson', 'ไร้สาย'],
    prices: [
      { price: 18900, oldPrice: 22900, discount: 17, dealer: 'shopee', url: 'https://shopee.co.th/dyson-v12', rating: 4.7, sold: 890 },
      { price: 19200, oldPrice: 23400, discount: 18, dealer: 'lazada', url: 'https://lazada.co.th/dyson-v12', rating: 4.8, sold: 560 },
      { price: 19500, oldPrice: 22900, discount: 15, dealer: 'tiktok', url: 'https://tiktok.com/dyson-v12', rating: 4.6, sold: 230 },
    ],
  },
  {
    id: 'p004',
    name: 'Logitech G304 Lightspeed',
    category: 'เกมมิ่งเกียร์',
    image: '/placeholder.jpg',
    description: 'เมาส์เกมไร้สาย HERO sensor, 12000 DPI, คลิก 10 ล้านครั้ง, 250 ชม. battery',
    specs: { 'เซนเซอร์': 'HERO 12K', 'DPI': '200-12000', 'ปุ่ม': '6 ปุ่ม', 'น้ำหนัก': '99 กรัม', 'เชื่อมต่อ': '2.4GHz Lightspeed' },
    tags: ['เมาส์', 'เกม', 'Logitech', 'ไร้สาย'],
    prices: [
      { price: 890, oldPrice: 1390, discount: 36, dealer: 'shopee', url: 'https://shopee.co.th/logitech-g304', rating: 4.9, sold: 18500 },
      { price: 920, oldPrice: 1490, discount: 38, dealer: 'lazada', url: 'https://lazada.co.th/logitech-g304', rating: 4.8, sold: 11200 },
      { price: 870, oldPrice: 1390, discount: 37, dealer: 'tiktok', url: 'https://tiktok.com/logitech-g304', rating: 4.9, sold: 6700 },
    ],
  },
  {
    id: 'p005',
    name: 'Samsung Galaxy Buds FE',
    category: 'หูฟัง & เสียง',
    image: '/placeholder.jpg',
    description: 'หูฟัง TWS พร้อม Active Noise Canceling, 6 ชม. (รวมเคส 21 ชม.), IPX2',
    specs: { 'การเชื่อมต่อ': 'Bluetooth 5.3', 'แบตเตอรี่': '6 ชม. (รวมเคส 21 ชม.)', 'กันน้ำ': 'IPX2', 'ไมค์': '3 มิค ตัดเสียง' },
    tags: ['หูฟัง', 'TWS', 'Samsung', 'ANC'],
    prices: [
      { price: 2990, oldPrice: 3990, discount: 25, dealer: 'shopee', url: 'https://shopee.co.th/galaxy-buds-fe', rating: 4.7, sold: 5600 },
      { price: 3090, oldPrice: 3990, discount: 23, dealer: 'lazada', url: 'https://lazada.co.th/galaxy-buds-fe', rating: 4.6, sold: 3200 },
      { price: 2890, oldPrice: 3990, discount: 28, dealer: 'tiktok', url: 'https://tiktok.com/galaxy-buds-fe', rating: 4.8, sold: 1800 },
    ],
  },
  {
    id: 'p006',
    name: 'iPad Pro M4 11 นิ้ว 256GB',
    category: 'คอมพิวเตอร์',
    image: '/placeholder.jpg',
    description: 'iPad Pro M4 พร้อม OLED Ultra Retina XDR, ชิป M4, รองรับ Apple Pencil Pro',
    specs: { 'จอ': '11" OLED Ultra Retina XDR', 'ชิป': 'M4', 'RAM': '8GB', 'ความจุ': '256GB', 'กล้อง': '12MP Wide + 10MP Ultra Wide' },
    tags: ['iPad', 'แท็บเล็ต', 'Apple'],
    prices: [
      { price: 34900, oldPrice: 38900, discount: 10, dealer: 'shopee', url: 'https://shopee.co.th/ipad-pro-m4', rating: 4.9, sold: 1200 },
      { price: 35400, oldPrice: 39900, discount: 11, dealer: 'lazada', url: 'https://lazada.co.th/ipad-pro-m4', rating: 4.9, sold: 780 },
      { price: 35200, oldPrice: 38900, discount: 10, dealer: 'tiktok', url: 'https://tiktok.com/ipad-pro-m4', rating: 5.0, sold: 340 },
    ],
  },
  {
    id: 'p007',
    name: 'Sony WH-1000XM5',
    category: 'หูฟัง & เสียง',
    image: '/placeholder.jpg',
    description: 'หูฟัง Over-ear ระดับท็อป พร้อม ANC ขั้นสูงสุด, 30 ชม., DSEE Extreme',
    specs: { 'การเชื่อมต่อ': 'Bluetooth 5.2', 'แบตเตอรี่': '30 ชม.', 'ANC': 'Auto NC Optimizer', 'ไดรเวอร์': '30mm' },
    tags: ['หูฟัง', 'Sony', 'ANC', 'Over-ear'],
    prices: [
      { price: 8990, oldPrice: 11990, discount: 25, dealer: 'shopee', url: 'https://shopee.co.th/sony-wh1000xm5', rating: 4.9, sold: 4200 },
      { price: 9190, oldPrice: 12490, discount: 26, dealer: 'lazada', url: 'https://lazada.co.th/sony-wh1000xm5', rating: 4.8, sold: 2800 },
      { price: 8790, oldPrice: 11990, discount: 27, dealer: 'tiktok', url: 'https://tiktok.com/sony-wh1000xm5', rating: 4.9, sold: 1100 },
    ],
  },
  {
    id: 'p008',
    name: 'MacBook Air M3 13 นิ้ว 8GB/256GB',
    category: 'คอมพิวเตอร์',
    image: '/placeholder.jpg',
    description: 'MacBook Air ชิป M3 พร้อม Neural Engine 16-core, จอ 13.6" Liquid Retina, บาง 1.13 ซม.',
    specs: { 'จอ': '13.6" Liquid Retina', 'ชิป': 'M3 8-core', 'RAM': '8GB', 'ความจุ': '256GB SSD', 'พอร์ต': '2x Thunderbolt / USB-C' },
    tags: ['MacBook', 'โน้ตบุ๊ก', 'Apple'],
    prices: [
      { price: 38900, oldPrice: 42900, discount: 9, dealer: 'shopee', url: 'https://shopee.co.th/macbook-air-m3', rating: 4.9, sold: 2100 },
      { price: 39400, oldPrice: 43500, discount: 9, dealer: 'lazada', url: 'https://lazada.co.th/macbook-air-m3', rating: 4.9, sold: 1400 },
      { price: 39200, oldPrice: 42900, discount: 9, dealer: 'tiktok', url: 'https://tiktok.com/macbook-air-m3', rating: 5.0, sold: 620 },
    ],
  },
  {
    id: 'p009',
    name: 'Nintendo Switch OLED',
    category: 'เกมมิ่งเกียร์',
    image: '/placeholder.jpg',
    description: 'เครื่องเล่นเกม Nintendo Switch รุ่น OLED พร้อมจอ 7 นิ้ว, 64GB, ขาตั้งปรับได้',
    specs: { 'จอ': '7" OLED', 'ความจุ': '64GB', 'เชื่อมต่อ': 'Wi-Fi, Bluetooth', 'แบต': '4.5-9 ชม.', 'พอร์ต': 'USB-C, HDMI' },
    tags: ['Nintendo', 'เกมคอนโซล', 'พกพา'],
    prices: [
      { price: 12990, oldPrice: 15990, discount: 19, dealer: 'shopee', url: 'https://shopee.co.th/switch-oled', rating: 4.9, sold: 8700 },
      { price: 13200, oldPrice: 16490, discount: 20, dealer: 'lazada', url: 'https://lazada.co.th/switch-oled', rating: 4.8, sold: 5400 },
      { price: 12800, oldPrice: 15990, discount: 20, dealer: 'tiktok', url: 'https://tiktok.com/switch-oled', rating: 4.9, sold: 2100 },
    ],
  },
  {
    id: 'p010',
    name: 'AirPods Pro 2nd Gen',
    category: 'หูฟัง & เสียง',
    image: '/placeholder.jpg',
    description: 'หูฟัง Apple AirPods Pro รุ่นที่ 2 พร้อม USB-C, ANC, Adaptive Audio, 6 ชม.',
    specs: { 'การเชื่อมต่อ': 'Bluetooth 5.3', 'แบตเตอรี่': '6 ชม. (รวมเคส 30 ชม.)', 'ชาร์จ': 'USB-C', 'กันน้ำ': 'IP54' },
    tags: ['AirPods', 'Apple', 'TWS', 'ANC'],
    prices: [
      { price: 7990, oldPrice: 9290, discount: 14, dealer: 'shopee', url: 'https://shopee.co.th/airpods-pro-2', rating: 4.9, sold: 15800 },
      { price: 8190, oldPrice: 9490, discount: 14, dealer: 'lazada', url: 'https://lazada.co.th/airpods-pro-2', rating: 4.8, sold: 9800 },
      { price: 7850, oldPrice: 9290, discount: 15, dealer: 'tiktok', url: 'https://tiktok.com/airpods-pro-2', rating: 4.9, sold: 4300 },
    ],
  },
  {
    id: 'p011',
    name: 'Google Pixel 9 Pro',
    category: 'มือถือ & แก็ดเจ็ต',
    image: '/placeholder.jpg',
    description: 'สมาร์ทโฟน Google Pixel 9 Pro พร้อม Tensor G4, กล้อง 50MP, 7 ปี update',
    specs: { 'จอ': '6.3" OLED 120Hz', 'ชิป': 'Tensor G4', 'RAM': '16GB', 'กล้อง': '50MP + 48MP Ultra Wide + 48MP Tele', 'แบต': '4700 mAh' },
    tags: ['Pixel', 'มือถือ', 'Google'],
    prices: [
      { price: 34990, oldPrice: 39990, discount: 13, dealer: 'shopee', url: 'https://shopee.co.th/pixel-9-pro', rating: 4.8, sold: 1200 },
      { price: 35490, oldPrice: 40990, discount: 13, dealer: 'lazada', url: 'https://lazada.co.th/pixel-9-pro', rating: 4.7, sold: 780 },
      { price: 35200, oldPrice: 39990, discount: 12, dealer: 'tiktok', url: 'https://tiktok.com/pixel-9-pro', rating: 4.9, sold: 340 },
    ],
  },
  {
    id: 'p012',
    name: 'Logitech MX Master 3S',
    category: 'คอมพิวเตอร์',
    image: '/placeholder.jpg',
    description: 'เมาส์ไร้สายระดับมืออาชีพ MagSpeed wheel, 8K DPI, คลิกเงียบ, 70 วัน',
    specs: { 'เซนเซอร์': '8000 DPI', 'ปุ่ม': '7 ปุ่ม', 'เชื่อมต่อ': 'Bluetooth + USB Receiver', 'แบต': '70 วัน', 'น้ำหนัก': '141 กรัม' },
    tags: ['เมาส์', 'Logitech', 'มืออาชีพ', 'ไร้สาย'],
    prices: [
      { price: 3490, oldPrice: 4290, discount: 19, dealer: 'shopee', url: 'https://shopee.co.th/mx-master-3s', rating: 4.9, sold: 9800 },
      { price: 3590, oldPrice: 4490, discount: 20, dealer: 'lazada', url: 'https://lazada.co.th/mx-master-3s', rating: 4.8, sold: 6200 },
      { price: 3390, oldPrice: 4290, discount: 21, dealer: 'tiktok', url: 'https://tiktok.com/mx-master-3s', rating: 4.9, sold: 2100 },
    ],
  },
];

// Trending deals (สินค้าลดราคาแรง)
export const trendingDeals = products
  .flatMap(p => p.prices.map(price => ({ ...p, price: price })))
  .sort((a, b) => b.price.discount - a.price.discount)
  .slice(0, 8);

// ค้นหาสินค้า
export function searchProducts(query: string, category?: string): Product[] {
  return products.filter(p => {
    const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()));
    const matchesCategory = !category || p.category === category;
    return matchesQuery && matchesCategory;
  });
}

// หาสินค้าตาม ID
export function getProduct(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

// เปรียบเทียบราคา
export function comparePrices(product: Product): ProductPrice[] {
  return product.prices.sort((a, b) => a.price - b.price);
}

// สินค้าแนะนำ (กลุ่มเดียวกัน)
export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}