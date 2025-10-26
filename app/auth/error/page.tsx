"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ErrorPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Authentication Error</h1>
        <p className="text-slate-400 mb-6">Something went wrong during authentication.</p>
        <Link href="/auth/login">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Back to Login</Button>
        </Link>
      </div>
    </div>
  )
}
