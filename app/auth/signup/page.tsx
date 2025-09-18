"use client"

export const dynamic = "force-dynamic"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth" // Changed from useSimpleAuth
import { Eye, EyeOff, UserPlus } from "lucide-react"
import Link from "next/link"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    agreeToTerms: false,
    subscribeNewsletter: true, // Not implemented backend for this
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const router = useRouter()
  const { toast } = useToast()
  const { user, loading, signUp } = useAuth() // Changed from useSimpleAuth

  // Redirect if already signed in
  useEffect(() => {
    if (!loading && user) {
      router.push("/profile")
    }
  }, [user, loading, router])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const result = await signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
      })

      if (result.success) {
        toast({
          title: "Account Created Successfully!",
          description: "Welcome to Travel Connect Expeditions. You can now sign in with your credentials.",
        })
        router.push("/auth/signin?message=registration-success")
      } else {
        toast({
          title: "Registration Failed",
          description: result.error || "Something went wrong. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md backdrop-blur-lg bg-white/80 border-0 shadow-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Create Your Account</CardTitle>
          <p className="text-gray-600">Join Travel Connect Expeditions and start your safari adventure</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`${errors.name ? "border-red-500" : ""} focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`${errors.email ? "border-red-500" : ""} focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200`}
                placeholder="Enter your email address"
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                placeholder="Enter your phone number (optional)"
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`${errors.password ? "border-red-500 pr-10" : "pr-10"} focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200`}
                  placeholder="Create a password (min. 6 characters)"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className={`${errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"} focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                  className={errors.agreeToTerms ? "border-red-500" : ""}
                />
                <Label htmlFor="agreeToTerms" className="text-sm leading-5">
                  I agree to the{" "}
                  <Link href="/terms" className="text-green-600 hover:text-green-700 underline">
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-green-600 hover:text-green-700 underline">
                    Privacy Policy
                  </Link>
                  *
                </Label>
              </div>
              {errors.agreeToTerms && <p className="text-sm text-red-600">{errors.agreeToTerms}</p>}

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="subscribeNewsletter"
                  checked={formData.subscribeNewsletter}
                  onCheckedChange={(checked) => handleInputChange("subscribeNewsletter", checked as boolean)}
                />
                <Label htmlFor="subscribeNewsletter" className="text-sm leading-5">
                  Subscribe to our newsletter for safari tips, special offers, and travel inspiration
                </Label>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-green-600 hover:text-green-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>

          {/* Back to Homepage */}
          <div className="mt-4 text-center">
            <Button variant="link" asChild>
              <Link href="/">Back to Homepage</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
