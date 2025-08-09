'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const banners = [
  {
    id: 1,
    title: 'Robotech Collection',
    subtitle: 'New Arrivals',
    description: 'Discover the latest Robotech figures and collectibles',
    image: '/images/robotech-banner.jpg',
    link: '/products?brand=robotech',
    buttonText: 'Shop Now'
  },
  {
    id: 2,
    title: 'Voltron Legacy',
    subtitle: 'Limited Edition',
    description: 'Exclusive Voltron collectibles now available',
    image: '/images/voltron-banner.jpg',
    link: '/products?brand=voltron',
    buttonText: 'Explore Collection'
  },
  {
    id: 3,
    title: 'Naruto Shippuden',
    subtitle: 'Fan Favorites',
    description: 'Complete your Naruto collection today',
    image: '/images/naruto-banner.jpg',
    link: '/products?brand=naruto',
    buttonText: 'View Products'
  }
]

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-gradient-to-b from-background to-muted">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="relative h-full">
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/20 z-10" />
            <div className="absolute inset-0 flex items-center z-20">
              <div className="container mx-auto px-4">
                <div className="max-w-2xl">
                  <p className="text-primary font-semibold mb-2">{banner.subtitle}</p>
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">{banner.title}</h1>
                  <p className="text-xl text-muted-foreground mb-8">{banner.description}</p>
                  <Button asChild size="lg">
                    <Link href={banner.link}>{banner.buttonText}</Link>
                  </Button>
                </div>
              </div>
            </div>
            <div className="h-full w-full bg-muted" />
          </div>
        </div>
      ))}

      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-primary w-8'
                : 'bg-background/60 hover:bg-background/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}