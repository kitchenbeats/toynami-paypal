"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CarouselSlide, CarouselSettings } from "@/lib/data/carousel";

interface HeroCarouselClientProps {
  slides: CarouselSlide[];
  settings: CarouselSettings;
}

export function HeroCarouselClient({
  slides,
  settings,
}: HeroCarouselClientProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(settings.is_autoplay);

  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;

    const interval = settings?.swap_interval || 5000;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [isAutoPlaying, slides.length, settings?.swap_interval]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  if (slides.length === 0) {
    return null;
  }

  return (
    <section className="heroCarousel">
      {/* Previous Arrow */}
      {slides.length > 1 && (
        <button
          aria-label={`Go to previous slide of ${slides.length}`}
          className="carousel-arrow carousel-prev"
          onClick={goToPrevious}
        >
          <ChevronLeft className="h-5 w-5 text-gray-800" />
        </button>
      )}

      {/* Slides */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <Link
              key={slide.id}
              href={slide.link || "#"}
              className="js-hero-slide min-w-full"
              aria-label={slide.heading || `Slide ${index + 1}`}
            >
              <div
                className={`heroCarousel-slide ${
                  index === 0 ? "heroCarousel-slide--first" : ""
                }`}
              >
                <div className="heroCarousel-image-wrapper">
                  {slide.image_url ? (
                    <div className="heroCarousel-image relative w-full h-[300px] md:h-[490px]">
                      {slide.image_url.startsWith("http") ? (
                        // External image
                        <Image
                          src={slide.image_url}
                          alt={slide.heading || ""}
                          fill
                          className="object-contain"
                          priority
                        />
                      ) : (
                        // Supabase storage image - construct full URL
                        <Image
                          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products${slide.image_url}`}
                          alt={slide.heading || ""}
                          fill
                          className="object-contain"
                          priority
                        />
                      )}

                      {/* Overlay content if heading/text/button provided */}
                      {(slide.heading || slide.text || slide.button_text) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                          <div className="text-white p-8 md:p-12 max-w-2xl">
                            {slide.heading && (
                              <h2 className="text-4xl md:text-6xl font-bold mb-4 text-shadow">
                                {slide.heading}
                              </h2>
                            )}
                            {slide.text && (
                              <p className="text-lg md:text-xl mb-6 text-shadow">
                                {slide.text}
                              </p>
                            )}
                            {slide.button_text && (
                              <span className="inline-block bg-white text-gray-900 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors">
                                {slide.button_text}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Fallback gradient if no image
                    <div className="heroCarousel-image bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center h-[490px]">
                      <div className="text-center text-white p-8 max-w-2xl">
                        {slide.heading && (
                          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-shadow">
                            {slide.heading}
                          </h2>
                        )}
                        {slide.text && (
                          <p className="text-lg md:text-xl mb-6 text-shadow">
                            {slide.text}
                          </p>
                        )}
                        {slide.button_text && (
                          <span className="inline-block bg-white text-gray-900 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors">
                            {slide.button_text}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Next Arrow */}
      {slides.length > 1 && (
        <button
          aria-label={`Go to next slide of ${slides.length}`}
          className="carousel-arrow carousel-next"
          onClick={goToNext}
        >
          <ChevronRight className="h-5 w-5 text-gray-800" />
        </button>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentSlide(index);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-white w-8"
                  : "bg-white/60 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
