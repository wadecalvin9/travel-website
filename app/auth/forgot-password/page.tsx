"use client"

export const dynamic = "force-dynamic"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      })
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real app, this would send a password reset email
      setIsSubmitted(true)

      toast({
        title: "Reset Link Sent",
        description: "If an account with that email exists, we've sent you a password reset link.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md backdrop-blur-lg bg-white/80 border-0 shadow-2xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <p className="text-gray-600">We've sent password reset instructions to your email address</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <Mail className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                If an account with <strong>{email}</strong> exists, you'll receive a password reset link shortly.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Didn't receive the email? Check your spam folder or try again with a different email address.
              </p>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setIsSubmitted(false)
                  setEmail("")
                }}
              >
                Try Different Email
              </Button>
            </div>

            <div className="text-center">
              <Button variant="link" asChild>
                <Link href="/auth/signin">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Sign In
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md backdrop-blur-lg bg-white/80 border-0 shadow-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <p className="text-gray-600">Enter your email address and we'll send you a link to reset your password</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                placeholder="Enter your email address"
                className="mt-1 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending Reset Link...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Reset Link
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link href="/auth/signin" className="text-green-600 hover:text-green-700 font-medium">
                Sign in here
              </Link>
            </p>

            <Button variant="link" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Homepage
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
