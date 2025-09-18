"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, Smartphone } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone) {
      setIsInstalled(true)
      return
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice

        if (outcome === "accepted") {
          setShowDialog(false)
        }

        setDeferredPrompt(null)
      } catch (error) {
        console.error("Installation failed:", error)
      }
    } else {
      setShowDialog(true)
    }
  }

  // Don't show if already installed
  if (isInstalled) {
    return null
  }

  return (
    <>
      <Button
        onClick={handleInstallClick}
        variant="outline"
        size="sm"
        className="hidden md:flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
      >
        <Download className="w-4 h-4" />
        Install App
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Install Travel Connect App
            </DialogTitle>
            <DialogDescription>
              Install our app for quick access, offline browsing, and push notifications.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">📱 On Mobile:</h4>
              <div className="text-sm text-slate-600 space-y-2">
                <div>
                  <strong>iPhone/iPad (Safari):</strong>
                  <ol className="list-decimal list-inside mt-1 ml-2 space-y-1">
                    <li>Tap the Share button (□↗)</li>
                    <li>Select "Add to Home Screen"</li>
                    <li>Tap "Add"</li>
                  </ol>
                </div>
                <div>
                  <strong>Android (Chrome):</strong>
                  <ol className="list-decimal list-inside mt-1 ml-2 space-y-1">
                    <li>Tap the menu (⋮)</li>
                    <li>Select "Add to Home Screen"</li>
                    <li>Tap "Add"</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">💻 On Desktop:</h4>
              <div className="text-sm text-slate-600">
                <p>
                  Look for the install icon (⊕) in your browser's address bar, or check the browser menu for "Install
                  Travel Connect" option.
                </p>
              </div>
            </div>

            <Button onClick={() => setShowDialog(false)} className="w-full">
              Got it!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
