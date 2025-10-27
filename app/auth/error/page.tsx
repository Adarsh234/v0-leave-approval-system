"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-sm">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent animate-text-gradient">
            Authentication Error
          </h1>
          <p className="text-slate-400 text-lg">
            Something went wrong during authentication. Please try again or contact support.
          </p>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
            <p className="text-slate-400 mb-4">
              You need to login to continue accessing the Leave Approval System.
            </p>
            <Link href="/auth/login">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white shadow-md transition-all duration-300 transform hover:-translate-y-1">
                Back to Login
              </Button>
            </Link>
          </div>

          <div className="text-slate-500 text-sm mt-4">
            <p>Tip: Make sure your account credentials are correct.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
