import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SettingsProvider } from "@/components/settings-provider"
import { Toaster } from "@/components/ui/toaster"
import { Navigation } from "@/components/navigation"
import { DynamicFooter } from "@/components/dynamic-footer"
import { ChatWidget } from "@/components/chat-widget"
import { AutoSetupBanner } from "@/components/auto-setup-banner"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"

const inter = Inter({ subsets: ["latin"] })

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#16a34a" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <SettingsProvider>
            <div className="min-h-screen flex flex-col">
              <Navigation />
              <main className="flex-1">{children}</main>
              <DynamicFooter />
            </div>
            <ChatWidget />
            <AutoSetupBanner />
            <PWAInstallPrompt />
            <Toaster />
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
