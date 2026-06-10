'use client';

import { CSSProperties } from 'react';

interface SvgIconProps {
  name: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
}

// Read SVG content - these are inline so we render directly
const svgPaths: Record<string, string> = {
  'icon_home_menu': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 20L24 6l18 14v22a2 2 0 01-2 2H8a2 2 0 01-2-2V20z"/><path d="M18 44V28h12v16"/></svg>`,
  'icon_search': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="20" cy="20" r="12"/><path d="M36 36l8 8"/></svg>`,
  'icon_categories': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><rect x="26" y="4" width="18" height="16" rx="3"/><rect x="4" y="26" width="18" height="18" rx="3"/><rect x="28" y="26" width="16" height="18" rx="3"/></svg>`,
  'icon_popular': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 40l4-4 4 4 4-8 4 4 4-8 4 12H8z"/><path d="M24 8v12M18 14l6-6 6 6"/></svg>`,
  'icon_compare': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 16h12M28 16h12M8 32h12M28 32h12"/><path d="M16 12v24M32 12v24"/></svg>`,
  'icon_alerts': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M24 6a14 14 0 00-14 14v6l-4 6h36l-4-6v-6a14 14 0 00-14-14z"/><path d="M22 42h4M20 46h8"/></svg>`,
  'icon_history': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="18"/><path d="M24 14v10l6 6"/></svg>`,
  'icon_favorites': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6l4 8 8 1-6 6 2 9-8-5-8 5 2-9-6-6 8-1z"/></svg>`,
  'icon_exchange': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12h20M28 12l6-6M28 12l6 6"/><path d="M40 36H20M20 36l-6 6M20 36l-6-6"/></svg>`,
  'icon_home2': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 20L24 6l18 14v22a2 2 0 01-2 2H8a2 2 0 01-2-2V20z"/><path d="M18 44V28h12v16"/></svg>`,
};

export default function SvgIcon({ name, size = 20, className = '', style }: SvgIconProps) {
  const svg = svgPaths[name] || `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="24" cy="24" r="16"/></svg>`;
  
  return (
    <span 
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size, color: 'currentColor', ...style }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}