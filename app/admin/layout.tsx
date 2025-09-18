"use client"

import type React from "react"
import { useState, Suspense } from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Menu, Bell, Search, User } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 lg:static lg:inset-0
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Premium Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-xl"
              >
                <Menu className="h-6 w-6 text-slate-600" />
              </Button>

              {/* Search */}
              <div className="hidden md:flex relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search admin panel..."
                  className="pl-10 w-80 bg-slate-50/50 border-slate-200 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="relative p-2 hover:bg-slate-100 rounded-xl">
                <Bell className="h-5 w-5 text-slate-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                </span>
              </Button>

              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center shadow-md">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6 bg-gradient-to-br from-slate-50/50 to-white/50">
          <div className="max-w-7xl mx-auto">
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}
