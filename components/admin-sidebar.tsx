"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  MessageCircle,
  Package2,
  Settings,
  Star,
  Users,
  Calendar,
  MapPin,
  MessageSquare,
  ChevronRight,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminSidebarProps {
  onClose?: () => void
}

const navItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard, color: "text-blue-500" },
  { title: "Packages", href: "/admin/packages", icon: Package2, color: "text-emerald-500" },
  { title: "Bookings", href: "/admin/bookings", icon: Calendar, color: "text-purple-500" },
  { title: "Users", href: "/admin/users", icon: Users, color: "text-orange-500" },
  { title: "Inquiries", href: "/admin/inquiries", icon: MessageSquare, color: "text-cyan-500" },
  { title: "Reviews", href: "/admin/reviews", icon: Star, color: "text-yellow-500" },
  { title: "Testimonials", href: "/admin/testimonials", icon: MessageCircle, color: "text-pink-500" },
  { title: "Destinations", href: "/admin/destinations", icon: MapPin, color: "text-red-500" },
  { title: "Chat Support", href: "/admin/chat", icon: MessageCircle, color: "text-indigo-500" },
  { title: "Settings", href: "/admin/settings", icon: Settings, color: "text-gray-500" },
]

export function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <div className="h-screen w-72 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 flex flex-col relative overflow-hidden fixed left-0 top-0 z-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-emerald-500/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />

      {/* Header */}
      <div className="relative p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Admin Panel</h2>
            <p className="text-xs text-slate-400">Travel Connect</p>
          </div>
        </div>
      </div>

      {/* Navigation - Scrollable */}
      <div className="flex-1 py-6 relative overflow-y-auto">
        <nav className="space-y-2 px-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative overflow-hidden",
                  isActive
                    ? "bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-white border border-emerald-500/30 shadow-lg shadow-emerald-500/10"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50 hover:shadow-md",
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-xl" />
                )}

                <div className="flex items-center gap-3 relative z-10">
                  <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-emerald-400" : item.color)} />
                  <span className="font-medium">{item.title}</span>
                </div>

                <ChevronRight
                  className={cn(
                    "h-4 w-4 transition-all duration-200",
                    isActive ? "text-emerald-400 rotate-90" : "text-slate-500 group-hover:text-slate-300",
                  )}
                />
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer - Fixed at bottom */}
      <div className="relative p-4 border-t border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm flex-shrink-0">
        <div className="text-center">
          <p className="text-xs text-slate-400">© 2024 Travel Connect</p>
          <p className="text-xs text-slate-500 mt-1">Premium Admin Dashboard</p>
        </div>
      </div>
    </div>
  )
}

export default AdminSidebar
