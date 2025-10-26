"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      console.log("[v0] Attempting login with email:", email)

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        console.log("[v0] Sign in error:", signInError.message)
        throw signInError
      }

      console.log("[v0] Login successful, user:", data.user?.email)
      router.push("/dashboard")
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred during login"
      console.log("[v0] Login error:", errorMessage)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Leave Approval System</h1>
            <p className="text-slate-400">Manage your leave requests efficiently</p>
          </div>

          <Card className="border-slate-700 bg-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Login</CardTitle>
              <CardDescription className="text-slate-400">Enter your credentials to access the system</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-slate-200">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@company.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-slate-200">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
                {error && (
                  <div className="p-3 bg-red-900/20 border border-red-700 rounded text-sm text-red-400">{error}</div>
                )}
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="bg-blue-900/20 border border-blue-700 rounded p-4 text-sm text-blue-300">
            <p className="font-semibold mb-2">Setup Instructions:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Go to Supabase Dashboard → Authentication → Users</li>
              <li>Click "Add user" and create test accounts</li>
              <li>Use the email and password you created to login</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
