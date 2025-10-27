"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Home,
  ClipboardList,
  CalendarDays,
  Clock,
  Users,
  BarChart2,
  CheckSquare,
  LogOut,
  Menu,
  X,
} from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()

        if (!authUser) {
          router.push("/auth/login")
          return
        }

        setUser(authUser)

        const { data: userData } = await supabase
          .from("users")
          .select("role, full_name, department_id")
          .eq("id", authUser.id)
          .single()

        if (userData) {
          setUserRole(userData.role)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push("/auth/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="text-white text-lg font-medium animate-pulse">
          Loading Dashboard...
        </div>
      </div>
    )
  }

  // Sidebar navigation links grouped by role
  const navLinks: Record<string, { href: string; label: string; icon: React.ReactNode }[]> = {
    employee: [
      { href: "/dashboard/request-leave", label: "Request Leave", icon: <ClipboardList className="w-4 h-4" /> },
      { href: "/dashboard/my-requests", label: "My Requests", icon: <CalendarDays className="w-4 h-4" /> },
      { href: "/dashboard/leave-balance", label: "Leave Balance", icon: <BarChart2 className="w-4 h-4" /> },
    ],
    manager: [
      { href: "/dashboard/approvals", label: "Pending Approvals", icon: <CheckSquare className="w-4 h-4" /> },
      { href: "/dashboard/team-leaves", label: "Team Leaves", icon: <Users className="w-4 h-4" /> },
    ],
    coordinator: [
      { href: "/dashboard/all-requests", label: "All Requests", icon: <ClipboardList className="w-4 h-4" /> },
      { href: "/dashboard/leave-records", label: "Leave Records", icon: <Clock className="w-4 h-4" /> },
    ],
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Sidebar (mobile overlay + desktop fixed) */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-slate-800/80 backdrop-blur-md border-r border-slate-700
        p-6 flex flex-col justify-between shadow-xl z-50 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div>
          {/* Logo Section */}
          <div className="mb-10 flex justify-between items-center">
            <h1 className="text-2xl font-bold flex items-center gap-2 text-white">
              <Clock className="w-5 h-5 text-blue-500" /> Leave System
            </h1>
            {/* Close button (mobile only) */}
            <button
              className="md:hidden text-slate-300 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <Link href="/dashboard" onClick={() => setSidebarOpen(false)}>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-slate-300 
                hover:text-white hover:bg-slate-700/60 rounded-xl transition duration-200"
              >
                <Home className="w-4 h-4" /> Dashboard
              </Button>
            </Link>

            {userRole &&
              navLinks[userRole]?.map((link, i) => (
                <Link key={i} href={link.href} onClick={() => setSidebarOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-slate-300 
                    hover:text-white hover:bg-slate-700/60 rounded-xl transition duration-200"
                  >
                    {link.icon}
                    {link.label}
                  </Button>
                </Link>
              ))}
          </nav>
        </div>

        {/* User Info + Logout */}
        <div className="border-t border-slate-700 pt-4">
          <div className="mb-4">
            <p className="text-slate-400 text-sm">Logged in as</p>
            <p className="text-white font-medium truncate">{user?.email}</p>
            <p className="text-slate-400 text-xs capitalize">{userRole}</p>
          </div>
          <Button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white 
            flex items-center justify-center gap-2 rounded-xl transition-all duration-200"
          >
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main
        className="flex-1 p-4 md:p-8 overflow-y-auto transition-all duration-300 
        bg-slate-900/40 backdrop-blur-md rounded-none md:rounded-l-3xl shadow-inner relative"
      >
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between mb-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white hover:text-blue-400 transition"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>

        {children}
      </main>
    </div>
  )
}
