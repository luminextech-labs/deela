'use client';

import Image from 'next/image';

// Map icon name to its SVG file path
const iconSvgs: Record<string, string> = {
  'mobile': '/icons/mobile.png',
  'computer': '/icons/computer.png',
  'audio': '/icons/audio.png',
  'auto': '/icons/auto.png',
  'beauty': '/icons/beauty.png',
  'books': '/icons/books.png',
  'home': '/icons/home.png',
  'home_new': '/icons/home.png',
  'mother': '/icons/mother.png',
  'pet': '/icons/pet.png',
  'pets': '/icons/pets.png',
  'sports': '/icons/sports.png',
  'icon_home_menu': '/icons/icon_home_menu.png',
  'icon_search': '/icons/icon_search.png',
  'icon_categories': '/icons/icon_categories.png',
  'icon_popular': '/icons/icon_popular.png',
  'icon_compare': '/icons/icon_compare.png',
  'icon_alerts': '/icons/icon_alerts.png',
  'icon_history': '/icons/icon_history.png',
  'icon_favorites': '/icons/icon_favorites.png',
  'icon_exchange': '/icons/icon_exchange.png',
  'icon_home2': '/icons/icon_home2.png',
  'icon_audio2': '/icons/icon_audio2.png',
  'icon_beauty2': '/icons/icon_beauty2.png',
  'placeholder': '/placeholder.svg',
};

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function Icon({ name, size = 24, className = '', style }: IconProps) {
  const src = iconSvgs[name] || `/icons/${name}.svg`;
  
  return (
    <Image
      src={src}
      alt={name}
      width={size}
      height={size}
      className={className}
      style={{ color: 'currentColor', ...style }}
      unoptimized
    />
  );
}