'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getAdBanners, type AdBanner } from '@/app/lib/supabase'

interface AdCarouselProps {
  autoScrollInterval?: number
}

export default function AdCarousel({ autoScrollInterval = 4000 }: AdCarouselProps) {
  const [banners, setBanners] = useState<AdBanner[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [transitioning, setTransitioning] = useState(false)

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

  // Auto scroll - move 2 at a time
  useEffect(() => {
    if (banners.length <= 2) return
    const interval = setInterval(() => {
      setTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 2) % banners.length)
        setTransitioning(false)
      }, 500)
    }, autoScrollInterval)
    return () => clearInterval(interval)
  }, [banners.length, autoScrollInterval])

  if (isLoading) {
    return (
      <div className="mb-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden bg-gray-200 animate-pulse aspect-[16/9]" />
        ))}
      </div>
    )
  }

  if (banners.length === 0) {
    return (
      <div className="mb-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-violet-600 to-fuchsia-500 aspect-[16/9] flex items-center justify-center">
          <span className="text-4xl">🎯</span>
        </div>
        <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-fuchsia-500 to-pink-500 aspect-[16/9] flex items-center justify-center">
          <span className="text-4xl">🔥</span>
        </div>
      </div>
    )
  }

  // Get 2 banners at a time
  const getVisibleBanners = () => {
    return [0, 1].map(i => banners[(currentIndex + i) % banners.length])
  }

  const visibleBanners = getVisibleBanners()

  return (
    <div className="mb-4">
      <div className={`grid grid-cols-1 xl:grid-cols-2 gap-4 transition-opacity duration-300 ${transitioning ? 'opacity-80' : 'opacity-100'}`}>
        {visibleBanners.map((banner, i) => (
          <a
            key={`${banner.id}-${currentIndex}`}
            href={banner.link_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <div className="w-full aspect-[16/9] relative bg-gradient-to-br from-violet-600 to-fuchsia-500">
              {banner.image_url ? (
                <Image
                  src={banner.image_url}
                  alt="Advertisement"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl">🎯</span>
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}