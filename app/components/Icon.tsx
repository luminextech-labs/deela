'use client';

import Image from 'next/image';

// Map icon name to its SVG file path
const iconSvgs: Record<string, string> = {
  'mobile': '/icons/mobile.svg',
  'computer': '/icons/computer.svg',
  'audio': '/icons/audio.svg',
  'auto': '/icons/auto.svg',
  'beauty': '/icons/beauty.svg',
  'books': '/icons/books.svg',
  'home': '/icons/home.svg',
  'home_new': '/icons/home.svg',
  'mother': '/icons/mother.svg',
  'pet': '/icons/pet.svg',
  'pets': '/icons/pets.svg',
  'sports': '/icons/sports.svg',
  'icon_home_menu': '/icons/icon_home_menu.svg',
  'icon_search': '/icons/icon_search.svg',
  'icon_categories': '/icons/icon_categories.svg',
  'icon_popular': '/icons/icon_popular.svg',
  'icon_compare': '/icons/icon_compare.svg',
  'icon_alerts': '/icons/icon_alerts.svg',
  'icon_history': '/icons/icon_history.svg',
  'icon_favorites': '/icons/icon_favorites.svg',
  'icon_exchange': '/icons/icon_exchange.svg',
  'icon_home2': '/icons/icon_home2.svg',
  'icon_audio2': '/icons/icon_audio2.svg',
  'icon_beauty2': '/icons/icon_beauty2.svg',
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