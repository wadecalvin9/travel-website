"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X } from "lucide-react"

interface ItineraryInputProps {
  itinerary: Record<string, string>
  onChange: (itinerary: Record<string, string>) => void
  optionalActivities: Array<{
    title: string
    description: string
    price?: number
    duration?: string
  }>
  onOptionalActivitiesChange: (
    activities: Array<{
      title: string
      description: string
      price?: number
      duration?: string
    }>,
  ) => void
  label?: string
}

export function ItineraryInput({
  itinerary,
  onChange,
  optionalActivities,
  onOptionalActivitiesChange,
  label = "Itinerary",
}: ItineraryInputProps) {
  const [newDayTitle, setNewDayTitle] = useState("")

  const addDay = () => {
    if (newDayTitle.trim()) {
      const newItinerary = { ...itinerary, [newDayTitle]: "" }
      onChange(newItinerary)
      setNewDayTitle("")
    }
  }

  const updateDay = (dayTitle: string, description: string) => {
    const newItinerary = { ...itinerary, [dayTitle]: description }
    onChange(newItinerary)
  }

  const removeDay = (dayTitle: string) => {
    const newItinerary = { ...itinerary }
    delete newItinerary[dayTitle]
    onChange(newItinerary)
  }

  const addOptionalActivity = () => {
    const newActivity = {
      title: "",
      description: "",
      price: undefined,
      duration: "",
    }
    onOptionalActivitiesChange([...optionalActivities, newActivity])
  }

  const updateOptionalActivity = (index: number, field: string, value: any) => {
    const newActivities = [...optionalActivities]
    if (field === "price") {
      newActivities[index][field] = value === "" ? undefined : Number(value)
    } else {
      newActivities[index][field] = value
    }
    onOptionalActivitiesChange(newActivities)
  }

  const removeOptionalActivity = (index: number) => {
    const newActivities = optionalActivities.filter((_, i) => i !== index)
    onOptionalActivitiesChange(newActivities)
  }

  return (
    <div className="space-y-6">
      {/* Daily Itinerary */}
      <Card>
        <CardHeader>
          <CardTitle>{label}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(itinerary).map(([dayTitle, description]) => (
            <div key={dayTitle} className="space-y-2 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <Label className="font-semibold">{dayTitle}</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => removeDay(dayTitle)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                value={description}
                onChange={(e) => updateDay(dayTitle, e.target.value)}
                placeholder="Describe the activities for this day..."
                rows={3}
              />
            </div>
          ))}

          <div className="flex items-center space-x-2">
            <Input
              value={newDayTitle}
              onChange={(e) => setNewDayTitle(e.target.value)}
              placeholder="e.g., Day 1, Day 2, etc."
              className="flex-1"
            />
            <Button type="button" onClick={addDay}>
              <Plus className="h-4 w-4 mr-2" />
              Add Day
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Optional Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Optional Activities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {optionalActivities.map((activity, index) => (
            <div key={index} className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <Label className="font-semibold">Optional Activity {index + 1}</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => removeOptionalActivity(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Activity Title</Label>
                  <Input
                    value={activity.title}
                    onChange={(e) => updateOptionalActivity(index, "title", e.target.value)}
                    placeholder="e.g., Hot Air Balloon Ride"
                  />
                </div>
                <div>
                  <Label>Duration</Label>
                  <Input
                    value={activity.duration || ""}
                    onChange={(e) => updateOptionalActivity(index, "duration", e.target.value)}
                    placeholder="e.g., 2 hours"
                  />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={activity.description}
                  onChange={(e) => updateOptionalActivity(index, "description", e.target.value)}
                  placeholder="Describe the optional activity..."
                  rows={2}
                />
              </div>

              <div>
                <Label>Price (Optional)</Label>
                <Input
                  type="number"
                  value={activity.price?.toString() || ""}
                  onChange={(e) => updateOptionalActivity(index, "price", e.target.value)}
                  placeholder="Additional cost for this activity"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          ))}

          <Button type="button" variant="outline" onClick={addOptionalActivity} className="w-full bg-transparent">
            <Plus className="h-4 w-4 mr-2" />
            Add Optional Activity
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
