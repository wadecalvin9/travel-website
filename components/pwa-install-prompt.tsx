"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, X, Smartphone, Chrome, AppleIcon as Safari } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showManualInstructions, setShowManualInstructions] = useState(false)
  const [browserType, setBrowserType] = useState<"chrome" | "safari" | "other">("other")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Set client-side flag
    setIsClient(true)

    // Only run client-side code after hydration
    if (typeof window === "undefined") return

    // Detect browser type
    const userAgent = navigator.userAgent.toLowerCase()
    if (userAgent.includes("chrome") && !userAgent.includes("edg")) {
      setBrowserType("chrome")
    } else if (userAgent.includes("safari") && !userAgent.includes("chrome")) {
      setBrowserType("safari")
    }

    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone) {
      setIsInstalled(true)
      return
    }

    // Check if user already dismissed this session (only on client)
    try {
      if (sessionStorage.getItem("pwa-prompt-dismissed")) {
        return
      }
    } catch (error) {
      // Ignore sessionStorage errors
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log("PWA: beforeinstallprompt event fired")
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Show prompt after a shorter delay for testing
      setTimeout(() => {
        setShowPrompt(true)
      }, 3000)
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log("PWA: App installed")
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    // Show manual instructions after 5 seconds if no install prompt
    const manualTimer = setTimeout(() => {
      if (!deferredPrompt && !isInstalled) {
        console.log("PWA: No install prompt detected, showing manual instructions")
        setShowManualInstructions(true)
      }
    }, 5000)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
      clearTimeout(manualTimer)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      console.log(`PWA: User ${outcome} the install prompt`)

      setDeferredPrompt(null)
      setShowPrompt(false)
    } catch (error) {
      console.error("PWA: Error during installation:", error)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setShowManualInstructions(false)

    // Only use sessionStorage on client-side
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("pwa-prompt-dismissed", "true")
      } catch (error) {
        // Ignore sessionStorage errors
      }
    }
  }

  // Don't render anything during SSR or if not client-side
  if (!isClient) {
    return null
  }

  // Don't show if already installed
  if (isInstalled) {
    return null
  }

  // Check if user already dismissed this session (client-side only)
  try {
    if (typeof window !== "undefined" && sessionStorage.getItem("pwa-prompt-dismissed")) {
      return null
    }
  } catch (error) {
    // Ignore sessionStorage errors
  }

  // Show automatic install prompt
  if (showPrompt && deferredPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm animate-in slide-in-from-bottom-4">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-5 h-5 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 mb-1">Install Travel Connect</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Get quick access to safari packages, offline browsing, and booking notifications.
                </p>

                <div className="flex gap-2">
                  <Button
                    onClick={handleInstallClick}
                    size="sm"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Install App
                  </Button>

                  <Button
                    onClick={handleDismiss}
                    size="sm"
                    variant="ghost"
                    className="text-slate-500 hover:text-slate-700"
                  >
                    Not now
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleDismiss}
                size="sm"
                variant="ghost"
                className="p-1 h-auto text-slate-400 hover:text-slate-600 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show manual installation instructions
  if (showManualInstructions) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm animate-in slide-in-from-bottom-4">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                {browserType === "safari" ? (
                  <Safari className="w-5 h-5 text-white" />
                ) : (
                  <Chrome className="w-5 h-5 text-white" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 mb-1">Install Travel Connect App</h3>

                {browserType === "safari" ? (
                  <div className="text-sm text-slate-600 mb-3">
                    <p className="mb-2">To install on iPhone/iPad:</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                      <li>Tap the Share button (□↗)</li>
                      <li>Scroll down and tap "Add to Home Screen"</li>
                      <li>Tap "Add" to install</li>
                    </ol>
                  </div>
                ) : (
                  <div className="text-sm text-slate-600 mb-3">
                    <p className="mb-2">To install on Android:</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                      <li>Tap the menu (⋮) in your browser</li>
                      <li>Select "Add to Home Screen"</li>
                      <li>Tap "Add" to install</li>
                    </ol>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={handleDismiss}
                    size="sm"
                    variant="outline"
                    className="text-slate-600 border-slate-300"
                  >
                    Got it
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleDismiss}
                size="sm"
                variant="ghost"
                className="p-1 h-auto text-slate-400 hover:text-slate-600 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
