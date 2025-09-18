import { Suspense } from "react"
import { BookingsContent } from "./bookings-content"

function BookingsLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-xl text-gray-600">Loading bookings...</p>
      </div>
    </div>
  )
}

export default function AdminBookingsPage() {
  return (
    <Suspense fallback={<BookingsLoading />}>
      <BookingsContent />
    </Suspense>
  )
}
