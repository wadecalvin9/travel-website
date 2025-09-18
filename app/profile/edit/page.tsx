"use client"

export const dynamic = "force-dynamic"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth" // Changed from useSimpleAuth
import { useProfile } from "@/hooks/use-profile"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import type { UserProfile } from "@/types/profile"

const INTERESTS = [
  "Wildlife Photography",
  "Bird Watching",
  "Cultural Experiences",
  "Adventure Activities",
  "Luxury Accommodations",
  "Budget Travel",
  "Solo Travel",
  "Family Travel",
  "Conservation",
  "Local Cuisine",
]

export default function EditProfilePage() {
  const { user, loading: authLoading } = useAuth() // Changed from useSimpleAuth
  const { profile, updateProfile, loading: profileLoading } = useProfile()
  const { toast } = useToast()
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dateOfBirth: "",
    nationality: "",
    passportNumber: "",
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
    },
    travelPreferences: {
      accommodationType: "mid-range" as const,
      groupSize: "couple" as const,
      activityLevel: "moderate" as const,
      interests: [] as string[],
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
        dateOfBirth: profile.dateOfBirth || "",
        nationality: profile.nationality || "",
        passportNumber: profile.passportNumber || "",
        emergencyContact: profile.emergencyContact || {
          name: "",
          phone: "",
          relationship: "",
        },
        travelPreferences: profile.travelPreferences || {
          accommodationType: "mid-range",
          groupSize: "couple",
          activityLevel: "moderate",
          interests: [],
        },
      })
    }
  }, [profile])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleEmergencyContactChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value,
      },
    }))
  }

  const handlePreferenceChange = (field: keyof UserProfile["travelPreferences"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      travelPreferences: {
        ...prev.travelPreferences,
        [field]: value,
      },
    }))
  }

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      travelPreferences: {
        ...prev.travelPreferences,
        interests: prev.travelPreferences.interests.includes(interest)
          ? prev.travelPreferences.interests.filter((i) => i !== interest)
          : [...prev.travelPreferences.interests, interest],
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const success = await updateProfile({
        name: formData.name,
        phone: formData.phone || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        nationality: formData.nationality || undefined,
        passportNumber: formData.passportNumber || undefined,
        emergencyContact: formData.emergencyContact.name ? formData.emergencyContact : undefined,
        travelPreferences: formData.travelPreferences,
      })

      if (success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        })
        router.push("/profile")
      } else {
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <Button asChild>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/profile">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-600">Update your personal information and travel preferences</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    value={formData.nationality}
                    onChange={(e) => handleInputChange("nationality", e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="passportNumber">Passport Number</Label>
                  <Input
                    id="passportNumber"
                    value={formData.passportNumber}
                    onChange={(e) => handleInputChange("passportNumber", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="emergencyName">Contact Name</Label>
                  <Input
                    id="emergencyName"
                    value={formData.emergencyContact.name}
                    onChange={(e) => handleEmergencyContactChange("name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyPhone">Contact Phone</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    value={formData.emergencyContact.phone}
                    onChange={(e) => handleEmergencyContactChange("phone", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyRelationship">Relationship</Label>
                  <Input
                    id="emergencyRelationship"
                    value={formData.emergencyContact.relationship}
                    onChange={(e) => handleEmergencyContactChange("relationship", e.target.value)}
                    placeholder="e.g., Spouse, Parent, Friend"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Travel Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Travel Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accommodationType">Accommodation Type</Label>
                  <Select
                    value={formData.travelPreferences.accommodationType}
                    onValueChange={(value) => handlePreferenceChange("accommodationType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="budget">Budget</SelectItem>
                      <SelectItem value="mid-range">Mid-range</SelectItem>
                      <SelectItem value="luxury">Luxury</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="groupSize">Preferred Group Size</Label>
                  <Select
                    value={formData.travelPreferences.groupSize}
                    onValueChange={(value) => handlePreferenceChange("groupSize", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solo">Solo</SelectItem>
                      <SelectItem value="couple">Couple</SelectItem>
                      <SelectItem value="small-group">Small Group (3-6)</SelectItem>
                      <SelectItem value="large-group">Large Group (7+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="activityLevel">Activity Level</Label>
                  <Select
                    value={formData.travelPreferences.activityLevel}
                    onValueChange={(value) => handlePreferenceChange("activityLevel", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relaxed">Relaxed</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="adventurous">Adventurous</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Interests</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {INTERESTS.map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest}
                        checked={formData.travelPreferences.interests.includes(interest)}
                        onCheckedChange={() => handleInterestToggle(interest)}
                      />
                      <Label htmlFor={interest} className="text-sm">
                        {interest}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/profile">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
