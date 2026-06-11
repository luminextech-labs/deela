'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { getAdBanners, type AdBanner } from '@/app/lib/supabase'

interface AdCarouselProps {
  autoScrollInterval?: number
}

export default function AdCarousel({ autoScrollInterval = 4000 }: AdCarouselProps) {
  const [banners, setBanners] = useState<AdBanner[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchEndX, setTouchEndX] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
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

  // Auto scroll with smooth transition
  useEffect(() => {
    if (banners.length <= 1) return
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length)
        setTimeout(() => setIsTransitioning(false), 50)
      }, 300)
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
      setIsTransitioning(true)
      if (diff > 0) {
        setCurrentIndex((prev) => (prev + 1) % banners.length)
      } else {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
      }
      setTimeout(() => setIsTransitioning(false), 300)
    }
  }

  const nextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
      setTimeout(() => setIsTransitioning(false), 300)
    }, 50)
  }

  const prevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
      setTimeout(() => setIsTransitioning(false), 300)
    }, 50)
  }

  if (isLoading) {
    return (
      <div className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="rounded-2xl border-2 border-violet-200 overflow-hidden bg-gray-100 animate-pulse aspect-[16/9]" />
          ))}
        </div>
      </div>
    )
  }

  if (banners.length === 0) {
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

  // Show 2 banners at a time
  const getVisibleBanners = () => {
    const result = []
    for (let i = 0; i < 2; i++) {
      const idx = (currentIndex + i) % banners.length
      result.push(banners[idx])
    }
    return result
  }

  const visibleBanners = getVisibleBanners()

  return (
    <div className="mb-4">
      <div 
        ref={containerRef}
        className="relative rounded-2xl overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className={`grid grid-cols-2 gap-4 transition-opacity duration-300 ${
            isTransitioning ? 'opacity-80' : 'opacity-100'
          }`}
        >
          {visibleBanners.map((banner, i) => (
            <a
              key={`${banner.id}-${currentIndex}`}
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
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
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
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              </div>
              {banner.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <p className="text-white text-xs font-medium truncate">{banner.title}</p>
                </div>
              )}
            </a>
          ))}
        </div>

        {/* Navigation Arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 opacity-60 hover:opacity-100 transition-all duration-200 hidden lg:flex"
            >
              ‹
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 opacity-60 hover:opacity-100 transition-all duration-200 hidden lg:flex"
            >
              ›
            </button>
          </>
        )}
      </div>
    </div>
  )
}