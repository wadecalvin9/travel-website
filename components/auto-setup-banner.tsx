"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2, Database, Zap, ExternalLink } from "lucide-react"

interface SetupStatus {
  needsSetup: boolean
  reason: string
  missingTables?: string[]
  requiresEnvVar?: boolean
}

export function AutoSetupBanner() {
  const [setupStatus, setSetupStatus] = useState<SetupStatus | null>(null)
  const [isSettingUp, setIsSettingUp] = useState(false)
  const [setupComplete, setSetupComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    checkSetupStatus()
  }, [])

  const checkSetupStatus = async () => {
    try {
      const response = await fetch("/api/auto-setup")
      const status = await response.json()
      setSetupStatus(status)

      // Auto-dismiss if no setup needed and no env var required
      if (!status.needsSetup && !status.requiresEnvVar) {
        setDismissed(true)
      }
    } catch (error) {
      console.error("Failed to check setup status:", error)
      setError("Failed to check database status")
    }
  }

  const runAutoSetup = async () => {
    setIsSettingUp(true)
    setError(null)

    try {
      const response = await fetch("/api/auto-setup", { method: "POST" })
      const result = await response.json()

      if (result.success) {
        setSetupComplete(true)
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        setError(result.error || result.details || "Setup failed")
      }
    } catch (error) {
      console.error("Auto-setup failed:", error)
      setError("Setup failed. Please check your database connection.")
    } finally {
      setIsSettingUp(false)
    }
  }

  // Don't show banner if dismissed
  if (dismissed) {
    return null
  }

  // Show environment variable setup instructions
  if (setupStatus?.requiresEnvVar) {
    return (
      <div className="fixed top-4 right-4 z-50 max-w-md">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Database className="h-5 w-5" />
              Database Configuration Required
            </CardTitle>
            <CardDescription className="text-blue-700">Add your database connection to get started.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-2">Add this environment variable:</p>
              <div className="bg-blue-100 p-2 rounded text-xs font-mono">DATABASE_URL="your-neon-database-url"</div>
            </div>

            <div className="text-xs text-blue-600">
              <p className="mb-1">Get a free database from:</p>
              <a
                href="https://neon.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline"
              >
                Neon.tech <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDismissed(true)}
                className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Don't show banner if no setup needed
  if (!setupStatus?.needsSetup) {
    return null
  }

  if (setupComplete) {
    return (
      <div className="fixed top-4 right-4 z-50 max-w-md">
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            🎉 Setup completed successfully! Reloading page...
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <Database className="h-5 w-5" />
            Database Setup Required
          </CardTitle>
          <CardDescription className="text-amber-700">
            Your database needs to be set up with sample data to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 text-xs">{error}</AlertDescription>
            </Alert>
          )}

          <div className="text-sm text-amber-700">
            <p className="font-medium mb-1">This will create:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Sample safari packages</li>
              <li>Popular destinations</li>
              <li>Customer testimonials</li>
              <li>Default site settings</li>
              <li>Admin user account</li>
            </ul>
          </div>

          <div className="text-xs text-amber-600 bg-amber-100 p-2 rounded">
            <strong>Admin Login:</strong> admin@travelconnect.com / admin123
          </div>

          <div className="flex gap-2">
            <Button
              onClick={runAutoSetup}
              disabled={isSettingUp}
              className="flex-1 bg-amber-600 hover:bg-amber-700"
              size="sm"
            >
              {isSettingUp ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Auto Setup
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDismissed(true)}
              className="border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              Dismiss
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
