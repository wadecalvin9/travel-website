"use client"

import { useSettings } from "@/components/settings-provider"
import { useEffect } from "react"

interface DynamicSEOProps {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
}

export function DynamicSEO({ title, description, keywords, ogImage }: DynamicSEOProps) {
  const { settings } = useSettings()

  useEffect(() => {
    if (typeof document !== "undefined") {
      // Update document title
      const pageTitle = title || settings.meta_title || settings.site_name || "Travel Connect Expeditions"
      document.title = pageTitle

      // Update or create meta tags
      const updateMetaTag = (name: string, content: string) => {
        let meta = document.querySelector(`meta[name="${name}"]`)
        if (!meta) {
          meta = document.createElement("meta")
          meta.setAttribute("name", name)
          document.head.appendChild(meta)
        }
        meta.setAttribute("content", content)
      }

      const updatePropertyTag = (property: string, content: string) => {
        let meta = document.querySelector(`meta[property="${property}"]`)
        if (!meta) {
          meta = document.createElement("meta")
          meta.setAttribute("property", property)
          document.head.appendChild(meta)
        }
        meta.setAttribute("content", content)
      }

      // Basic meta tags
      updateMetaTag(
        "description",
        description ||
          settings.meta_description ||
          "Experience unforgettable safari adventures across East and Southern Africa",
      )
      updateMetaTag(
        "keywords",
        keywords || settings.meta_keywords || "safari, africa, wildlife, travel, kenya, tanzania",
      )
      updateMetaTag("author", settings.meta_author || settings.site_name || "Travel Connect Expeditions")
      updateMetaTag("robots", settings.meta_robots || "index,follow")

      // Open Graph tags
      updatePropertyTag("og:title", title || settings.og_title || settings.meta_title || pageTitle)
      updatePropertyTag(
        "og:description",
        description ||
          settings.og_description ||
          settings.meta_description ||
          "Experience unforgettable safari adventures across East and Southern Africa",
      )
      updatePropertyTag("og:image", ogImage || settings.og_image || "/placeholder.svg?height=630&width=1200")
      updatePropertyTag("og:type", "website")
      updatePropertyTag("og:site_name", settings.site_name || "Travel Connect Expeditions")

      // Twitter Card tags
      updateMetaTag("twitter:card", settings.twitter_card || "summary_large_image")
      updateMetaTag("twitter:title", title || settings.og_title || settings.meta_title || pageTitle)
      updateMetaTag(
        "twitter:description",
        description ||
          settings.og_description ||
          settings.meta_description ||
          "Experience unforgettable safari adventures across East and Southern Africa",
      )
      updateMetaTag("twitter:image", ogImage || settings.og_image || "/placeholder.svg?height=630&width=1200")

      // Update favicon if provided
      if (settings.favicon) {
        const favicon = document.querySelector('link[rel="shortcut icon"]') as HTMLLinkElement
        if (favicon) {
          favicon.href = settings.favicon
        }
      }

      // Add structured data if provided
      if (settings.schema_markup) {
        try {
          const existingSchema = document.querySelector('script[type="application/ld+json"]')
          if (existingSchema) {
            existingSchema.remove()
          }

          const script = document.createElement("script")
          script.type = "application/ld+json"
          script.textContent = settings.schema_markup
          document.head.appendChild(script)
        } catch (error) {
          console.warn("Invalid schema markup:", error)
        }
      }
    }
  }, [settings, title, description, keywords, ogImage])

  return null
}
