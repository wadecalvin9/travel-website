import { DynamicSEO } from "@/components/dynamic-seo"
import { HeroSection } from "@/components/hero-section"
import { FeaturedPackages } from "@/components/featured-packages"
import { PopularDestinations } from "@/components/popular-destinations"
import { TestimonialsSection } from "@/components/testimonials-section"
import { StatsSection } from "@/components/stats-section"
import { NewsletterSection } from "@/components/newsletter-section"

export default function HomePage() {
  return (
    <>
      <DynamicSEO />
      <HeroSection />
      <FeaturedPackages />
      <PopularDestinations />
      <TestimonialsSection />
      <StatsSection />
      <NewsletterSection />
    </>
  )
}
