"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type SiteSettings, DEFAULT_SETTINGS, getSettings } from "@/lib/settings"

interface SettingsContextType {
  settings: SiteSettings
  loading: boolean
  updateSettings: (newSettings: Partial<SiteSettings>) => void
}

export const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SETTINGS,
  loading: true,
  updateSettings: () => {},
})

export function useSettings() {
  return useContext(SettingsContext)
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const loadedSettings = await getSettings()
      setSettings(loadedSettings)
      applyThemeColors(loadedSettings)
    } catch (error) {
      console.warn("Failed to load settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)
    applyThemeColors(updatedSettings)
  }

  const applyThemeColors = (settings: SiteSettings) => {
    if (typeof document !== "undefined") {
      const root = document.documentElement

      // Helper function to convert hex to HSL
      const hexToHsl = (hex: string) => {
        if (!hex || !hex.startsWith("#")) return "0 0% 50%"

        const r = Number.parseInt(hex.slice(1, 3), 16) / 255
        const g = Number.parseInt(hex.slice(3, 5), 16) / 255
        const b = Number.parseInt(hex.slice(5, 7), 16) / 255

        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        let h = 0,
          s = 0,
          l = (max + min) / 2

        if (max !== min) {
          const d = max - min
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
          switch (max) {
            case r:
              h = (g - b) / d + (g < b ? 6 : 0)
              break
            case g:
              h = (b - r) / d + 2
              break
            case b:
              h = (r - g) / d + 4
              break
          }
          h /= 6
        }

        return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
      }

      // Apply theme colors using CSS custom properties
      const colorMappings = {
        "--primary": settings.primary_color || "#16a34a",
        "--secondary": settings.secondary_color || "#059669",
        "--accent": settings.accent_color || "#f59e0b",
        "--background": settings.background_primary || "#ffffff",
        "--foreground": settings.text_primary || "#111827",
        "--muted": settings.background_secondary || "#f9fafb",
        "--muted-foreground": settings.text_secondary || "#6b7280",
        "--border": settings.border_color || "#e5e7eb",
      }

      // Apply colors as HSL values for shadcn/ui compatibility
      Object.entries(colorMappings).forEach(([property, hexValue]) => {
        const hslValue = hexToHsl(hexValue)
        root.style.setProperty(property, hslValue)
      })

      // Update theme color meta tag
      const themeColorMeta = document.querySelector('meta[name="theme-color"]')
      if (themeColorMeta) {
        themeColorMeta.setAttribute("content", settings.primary_color || "#16a34a")
      }

      // Apply custom CSS if provided
      if (settings.custom_css) {
        let customStyleElement = document.getElementById("custom-settings-css")
        if (!customStyleElement) {
          customStyleElement = document.createElement("style")
          customStyleElement.id = "custom-settings-css"
          document.head.appendChild(customStyleElement)
        }
        customStyleElement.textContent = settings.custom_css
      }
    }
  }

  return <SettingsContext.Provider value={{ settings, loading, updateSettings }}>{children}</SettingsContext.Provider>
}
