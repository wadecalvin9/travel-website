"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Wifi, RefreshCw, Home, Package } from "lucide-react"
import Link from "next/link"

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          {/* Offline Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
            <Wifi className="w-10 h-10 text-slate-400" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-slate-800 mb-3 font-playfair">You're Offline</h1>

          {/* Description */}
          <p className="text-slate-600 mb-8 leading-relaxed">
            It looks like you've lost your internet connection. Don't worry - you can still browse some content that's
            been saved on your device.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>

            <div className="flex gap-3">
              <Button asChild variant="outline" className="flex-1">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </Button>

              <Button asChild variant="outline" className="flex-1">
                <Link href="/packages">
                  <Package className="w-4 h-4 mr-2" />
                  Packages
                </Link>
              </Button>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-8 p-4 bg-slate-50 rounded-lg">
            <h3 className="font-semibold text-slate-700 mb-2">Offline Tips:</h3>
            <ul className="text-sm text-slate-600 space-y-1 text-left">
              <li>• Check your internet connection</li>
              <li>• Try refreshing the page</li>
              <li>• Some content may still be available</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
