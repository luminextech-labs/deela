'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { getAdBanners, type AdBanner } from '@/app/lib/supabase'

interface AdCarouselProps {
  maxVisible?: number
  autoScrollInterval?: number
}

export default function AdCarousel({ maxVisible = 2, autoScrollInterval = 4000 }: AdCarouselProps) {
  const [banners, setBanners] = useState<AdBanner[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchEndX, setTouchEndX] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchBanners() {
      try {
        const data = await getAdBanners()
        setBanners(data)
      } catch (error) {
        console.error('Error fetching banners:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchBanners()
  }, [])

  // Auto scroll
  useEffect(() => {
    if (banners.length <= 1) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, autoScrollInterval)
    return () => clearInterval(interval)
  }, [banners.length, autoScrollInterval])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    const diff = touchStartX - touchEndX
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left - next
        setCurrentIndex((prev) => (prev + 1) % banners.length)
      } else {
        // Swipe right - previous
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
      }
    }
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
  }

  if (isLoading) {
    return (
      <div className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          {[...Array(maxVisible)].map((_, i) => (
            <div key={i} className="rounded-2xl border-2 border-violet-200 overflow-hidden bg-gray-100 animate-pulse aspect-[16/9]" />
          ))}
        </div>
      </div>
    )
  }

  if (banners.length === 0) {
    // Fallback placeholder
    return (
      <div className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border-2 border-violet-300 overflow-hidden bg-gradient-to-br from-violet-600 to-fuchsia-500 aspect-[16/9] flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-white/20 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">🎯</span>
              </div>
              <p className="text-white/80 text-xs font-medium">รอการตั้งค่า</p>
            </div>
          </div>
          <div className="rounded-2xl border-2 border-violet-300 overflow-hidden bg-gradient-to-br from-fuchsia-500 to-pink-500 aspect-[16/9] flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-white/20 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">🔥</span>
              </div>
              <p className="text-white/80 text-xs font-medium">Advertisement</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show maxVisible banners at a time
  const visibleBanners = banners.slice(currentIndex, currentIndex + maxVisible)
  const remaining = currentIndex + maxVisible - banners.length
  const wrappedBanners = remaining > 0 ? [...visibleBanners, ...banners.slice(0, remaining)] : visibleBanners

  return (
    <div className="mb-4">
      {/* Carousel Container */}
      <div 
        ref={containerRef}
        className="relative rounded-2xl overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="grid grid-cols-2 gap-4">
          {wrappedBanners.map((banner, i) => (
            <a
              key={banner.id}
              href={banner.link_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="relative rounded-2xl border-2 border-violet-300 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <div className="w-full aspect-[16/9] relative bg-gradient-to-br from-violet-600 to-fuchsia-500">
                {banner.image_url ? (
                  <Image
                    src={banner.image_url}
                    alt={banner.title || 'Advertisement'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-white/20 rounded-2xl flex items-center justify-center">
                      <span className="text-3xl">🎯</span>
                    </div>
                    <p className="text-white/80 text-xs font-medium absolute bottom-3">
                      {banner.title || 'Advertisement'}
                    </p>
                  </div>
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              </div>
              {/* Arrow indicators */}
              {banner.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <p className="text-white text-xs font-medium truncate">{banner.title}</p>
                </div>
              )}
            </a>
          ))}
        </div>

        {/* Navigation Arrows - Desktop */}
        {banners.length > maxVisible && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 opacity-60 hover:opacity-100 transition-opacity hidden lg:flex"
            >
              ‹
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 opacity-60 hover:opacity-100 transition-opacity hidden lg:flex"
            >
              ›
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {banners.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentIndex === i ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Banner count indicator */}
      <p className="text-center text-xs text-gray-400 mt-2">
        {currentIndex + 1} / {banners.length} รูป
      </p>
    </div>
  )
}