"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Mail, Phone, Calendar, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export const dynamic = "force-dynamic"

interface Inquiry {
  id: number
  name: string
  email: string
  phone?: string
  message: string
  package_id?: number
  package_title?: string
  status: "pending" | "responded" | "closed"
  created_at: string
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    try {
      const response = await fetch("/api/admin/inquiries")
      if (response.ok) {
        const data = await response.json()
        setInquiries(data)
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error)
      toast({
        title: "Error",
        description: "Failed to load inquiries",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateInquiryStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        setInquiries((prev) =>
          prev.map((inquiry) => (inquiry.id === id ? { ...inquiry, status: status as any } : inquiry)),
        )
        toast({
          title: "Success",
          description: "Inquiry status updated",
        })
      }
    } catch (error) {
      console.error("Error updating inquiry:", error)
      toast({
        title: "Error",
        description: "Failed to update inquiry status",
        variant: "destructive",
      })
    }
  }

  const deleteInquiry = async (id: number) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return

    try {
      const response = await fetch(`/api/admin/inquiries/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setInquiries((prev) => prev.filter((inquiry) => inquiry.id !== id))
        toast({
          title: "Success",
          description: "Inquiry deleted successfully",
        })
      }
    } catch (error) {
      console.error("Error deleting inquiry:", error)
      toast({
        title: "Error",
        description: "Failed to delete inquiry",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "responded":
        return "bg-blue-100 text-blue-800"
      case "closed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading inquiries...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Customer Inquiries</h1>
        <Badge variant="secondary">{inquiries.length} Total</Badge>
      </div>

      {inquiries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Mail className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Inquiries Yet</h3>
            <p className="text-gray-500 text-center">Customer inquiries will appear here when they contact you.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {inquiries.map((inquiry) => (
            <Card key={inquiry.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {inquiry.name}
                      <Badge className={getStatusColor(inquiry.status)}>{inquiry.status}</Badge>
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {inquiry.email}
                      </div>
                      {inquiry.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {inquiry.phone}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(inquiry.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteInquiry(inquiry.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {inquiry.package_title && (
                  <div className="flex items-center gap-2 mb-3 text-sm text-blue-600">
                    <MapPin className="h-4 w-4" />
                    <span>Inquiry about: {inquiry.package_title}</span>
                  </div>
                )}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{inquiry.message}</p>
                </div>
                <div className="flex gap-2">
                  {inquiry.status === "pending" && (
                    <Button size="sm" onClick={() => updateInquiryStatus(inquiry.id, "responded")}>
                      Mark as Responded
                    </Button>
                  )}
                  {inquiry.status === "responded" && (
                    <Button size="sm" variant="outline" onClick={() => updateInquiryStatus(inquiry.id, "closed")}>
                      Close Inquiry
                    </Button>
                  )}
                  {inquiry.status === "closed" && (
                    <Button size="sm" variant="outline" onClick={() => updateInquiryStatus(inquiry.id, "pending")}>
                      Reopen
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
