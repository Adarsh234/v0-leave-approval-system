"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
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

        // Fetch user role from database
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
      <div className="flex min-h-svh items-center justify-center bg-slate-900">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh bg-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Leave System</h1>
          <p className="text-slate-400 text-sm mt-1">HR Management</p>
        </div>

        <nav className="space-y-4 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700">
              Dashboard
            </Button>
          </Link>

          {userRole === "employee" && (
            <>
              <Link href="/dashboard/request-leave">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700"
                >
                  Request Leave
                </Button>
              </Link>
              <Link href="/dashboard/my-requests">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700"
                >
                  My Requests
                </Button>
              </Link>
              <Link href="/dashboard/leave-balance">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700"
                >
                  Leave Balance
                </Button>
              </Link>
            </>
          )}

          {userRole === "manager" && (
            <>
              <Link href="/dashboard/approvals">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700"
                >
                  Pending Approvals
                </Button>
              </Link>
              <Link href="/dashboard/team-leaves">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700"
                >
                  Team Leaves
                </Button>
              </Link>
            </>
          )}

          {userRole === "coordinator" && (
            <>
              <Link href="/dashboard/all-requests">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700"
                >
                  All Requests
                </Button>
              </Link>
              <Link href="/dashboard/leave-records">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700"
                >
                  Leave Records
                </Button>
              </Link>
            </>
          )}
        </nav>

        <div className="border-t border-slate-700 pt-4">
          <div className="mb-4">
            <p className="text-slate-400 text-sm">Logged in as</p>
            <p className="text-white font-medium">{user?.email}</p>
            <p className="text-slate-400 text-xs capitalize">{userRole}</p>
          </div>
          <Button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 text-white">
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
