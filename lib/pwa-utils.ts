// PWA utility functions

export interface NotificationOptions {
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
  data?: any
}

export class PWAManager {
  private static instance: PWAManager
  private registration: ServiceWorkerRegistration | null = null

  private constructor() {}

  static getInstance(): PWAManager {
    if (!PWAManager.instance) {
      PWAManager.instance = new PWAManager()
    }
    return PWAManager.instance
  }

  // Initialize PWA features (client-side only)
  async initialize(): Promise<void> {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return

    try {
      this.registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      })

      console.log("Service Worker registered successfully:", this.registration)

      // Listen for updates
      this.registration.addEventListener("updatefound", () => {
        console.log("New service worker version available")
        this.handleServiceWorkerUpdate()
      })
    } catch (error) {
      console.error("Service Worker registration failed:", error)
    }
  }

  // Handle service worker updates
  private handleServiceWorkerUpdate(): void {
    if (!this.registration?.installing) return

    const newWorker = this.registration.installing

    newWorker.addEventListener("statechange", () => {
      if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
        // New version available
        this.showUpdateNotification()
      }
    })
  }

  // Show update notification
  private showUpdateNotification(): void {
    if (typeof window === "undefined") return

    // You can implement a custom notification UI here
    if (confirm("A new version is available. Refresh to update?")) {
      window.location.reload()
    }
  }

  // Request notification permission (client-side only)
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (typeof window === "undefined" || !("Notification" in window)) {
      console.warn("This browser does not support notifications")
      return "denied"
    }

    if (Notification.permission === "granted") {
      return "granted"
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission()
      return permission
    }

    return Notification.permission
  }

  // Send local notification (client-side only)
  async sendNotification(options: NotificationOptions): Promise<void> {
    if (typeof window === "undefined") return

    const permission = await this.requestNotificationPermission()

    if (permission !== "granted") {
      console.warn("Notification permission not granted")
      return
    }

    if (this.registration) {
      // Use service worker for better control
      await this.registration.showNotification(options.title, {
        body: options.body,
        icon: options.icon || "/icons/icon-192x192.png",
        badge: options.badge || "/icons/icon-72x72.png",
        tag: options.tag,
        data: options.data,
        vibrate: [100, 50, 100],
        requireInteraction: false,
        actions: [
          {
            action: "view",
            title: "View",
            icon: "/icons/icon-96x96.png",
          },
        ],
      })
    } else {
      // Fallback to regular notification
      new Notification(options.title, {
        body: options.body,
        icon: options.icon || "/icons/icon-192x192.png",
        tag: options.tag,
        data: options.data,
      })
    }
  }

  // Check if app is installed (client-side only)
  isInstalled(): boolean {
    if (typeof window === "undefined") return false

    return window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true
  }

  // Get installation status
  getInstallationStatus(): "installed" | "installable" | "not-supported" {
    if (typeof window === "undefined") return "not-supported"

    if (this.isInstalled()) {
      return "installed"
    }

    if ("serviceWorker" in navigator && "PushManager" in window) {
      return "installable"
    }

    return "not-supported"
  }

  // Background sync for offline actions (client-side only)
  async scheduleBackgroundSync(tag: string): Promise<void> {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      !("sync" in window.ServiceWorkerRegistration.prototype)
    )
      return

    try {
      const registration = await navigator.serviceWorker.ready
      await registration.sync.register(tag)
      console.log("Background sync scheduled:", tag)
    } catch (error) {
      console.error("Background sync failed:", error)
    }
  }

  // Store data for offline use (client-side only)
  async storeOfflineData(key: string, data: any): Promise<void> {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(
        `offline_${key}`,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        }),
      )
    } catch (error) {
      console.error("Failed to store offline data:", error)
    }
  }

  // Retrieve offline data (client-side only)
  getOfflineData(key: string): any | null {
    if (typeof window === "undefined") return null

    try {
      const stored = localStorage.getItem(`offline_${key}`)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Check if data is not too old (24 hours)
        if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
          return parsed.data
        }
      }
    } catch (error) {
      console.error("Failed to retrieve offline data:", error)
    }
    return null
  }
}

// Export singleton instance
export const pwaManager = PWAManager.getInstance()
