'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { getAdBanners, type AdBanner } from '@/app/lib/supabase'

interface AdCarouselProps {
  autoScrollInterval?: number
}

export default function AdCarousel({ autoScrollInterval = 10000 }: AdCarouselProps) {
  const [banners, setBanners] = useState<AdBanner[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
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

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex(index)
      setIsTransitioning(false)
    }, 200)
  }, [isTransitioning])

  const goNext = useCallback(() => {
    if (banners.length <= 1) return
    goTo((currentIndex + 1) % banners.length)
  }, [banners.length, currentIndex, goTo])

  const goPrev = useCallback(() => {
    if (banners.length <= 1) return
    goTo((currentIndex - 1 + banners.length) % banners.length)
  }, [banners.length, currentIndex, goTo])

  // Auto scroll
  useEffect(() => {
    if (banners.length <= 1) return
    const interval = setInterval(goNext, autoScrollInterval)
    return () => clearInterval(interval)
  }, [banners.length, autoScrollInterval, goNext])

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext()
      else goPrev()
    }
    touchStartX.current = null
    touchEndX.current = null
  }

  if (isLoading) {
    return (
      <div className="mb-4">
        <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gray-200 animate-pulse" />
        <div className="flex justify-center gap-2 mt-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-gray-300" />
          ))}
        </div>
      </div>
    )
  }

  if (banners.length === 0) {
    return (
      <div className="mb-4">
        <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center">
          <span className="text-4xl">🎯</span>
        </div>
        <div className="flex justify-center gap-2 mt-3">
          <div className="w-2 h-2 rounded-full bg-white/50" />
        </div>
      </div>
    )
  }

  const currentBanner = banners[currentIndex]

  return (
    <div className="mb-4">
      <div
        ref={containerRef}
        className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-lg cursor-pointer"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => {
          if (currentBanner.link_url) {
            window.open(currentBanner.link_url, '_blank', 'noopener,noreferrer')
          }
        }}
      >
        <a
          href={currentBanner.link_url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full h-full"
        >
          <div className={`w-full h-full transition-opacity duration-5000 ${isTransitioning ? 'opacity-80' : 'opacity-100'}`}>
            {currentBanner.image_url ? (
              <Image
                src={currentBanner.image_url}
                alt="Advertisement"
                fill
                className="object-cover"
                sizes="100vw"
                priority={currentIndex === 0}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center">
                <span className="text-4xl">🎯</span>
              </div>
            )}
          </div>
        </a>

        {/* Dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation()
                  goTo(i)
                }}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  i === currentIndex
                    ? 'bg-white w-4'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}