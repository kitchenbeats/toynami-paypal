import { HeroCarouselClient } from './hero-carousel-client'
import { getCarouselSlides, getCarouselSettings } from '@/lib/data/carousel'

export async function HeroCarousel() {
  const [slides, settings] = await Promise.all([
    getCarouselSlides(),
    getCarouselSettings()
  ])
  
  return <HeroCarouselClient slides={slides} settings={settings} />
}