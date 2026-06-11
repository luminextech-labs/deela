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

  // Auto scroll slide
  useEffect(() => {
    if (banners.length <= 1) return
    const interval = setInterval(() => {
      setTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length)
        setTransitioning(false)
      }, 500)
    }, autoScrollInterval)
    return () => clearInterval(interval)
  }, [banners.length, autoScrollInterval])

  if (isLoading) {
    return (
      <div className="mb-4 rounded-2xl overflow-hidden bg-gray-200 animate-pulse aspect-[21/9]" />
    )
  }

  if (banners.length === 0) {
    return (
      <div className="mb-4 rounded-2xl overflow-hidden bg-gradient-to-br from-violet-600 to-fuchsia-500 aspect-[21/9] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 bg-white/20 rounded-2xl flex items-center justify-center">
            <span className="text-4xl">🎯</span>
          </div>
          <p className="text-white/80 text-sm font-medium">รอการตั้งค่าโฆษณา</p>
        </div>
      </div>
    )
  }

  const currentBanner = banners[currentIndex]

  return (
    <div className="mb-4">
      <div className="relative rounded-2xl overflow-hidden shadow-xl">
        {/* Single banner that slides */}
        <div 
          className={`transition-transform duration-500 ease-in-out ${transitioning ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}
        >
          <a
            href={currentBanner.link_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative aspect-[21/9] bg-gradient-to-br from-violet-600 to-fuchsia-500"
          >
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
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl">🎯</span>
              </div>
            )}
          </a>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div 
            className="h-full bg-white/60 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / banners.length) * 100}%` }}
          />
        </div>

        {/* Navigation arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={() => {
                setTransitioning(true)
                setTimeout(() => {
                  setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
                  setTransitioning(false)
                }, 500)
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 opacity-70 hover:opacity-100 transition-all"
            >
              ‹
            </button>
            <button
              onClick={() => {
                setTransitioning(true)
                setTimeout(() => {
                  setCurrentIndex((prev) => (prev + 1) % banners.length)
                  setTransitioning(false)
                }, 500)
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 opacity-70 hover:opacity-100 transition-all"
            >
              ›
            </button>
          </>
        )}
      </div>
    </div>
  )
}