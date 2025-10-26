import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-svh bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Leave Approval System</h1>
          <Link href="/auth/login">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Login</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-6">
          <h2 className="text-5xl font-bold text-white">Streamline Your Leave Management</h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            A comprehensive platform for managing leave requests, approvals, and records across your organization with
            department-based access and email notifications.
          </p>

          <div className="flex gap-4 justify-center pt-8">
            <Link href="/auth/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">Get Started</Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="text-3xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-white mb-2">Leave Requests</h3>
            <p className="text-slate-400">
              Employees can easily submit leave requests with detailed information and reasons.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="text-3xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-white mb-2">Approval Workflow</h3>
            <p className="text-slate-400">Managers review and approve/reject requests with a structured workflow.</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-2">Leave Records</h3>
            <p className="text-slate-400">Track leave balance and usage per academic year for all employees.</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="text-3xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-white mb-2">Department Access</h3>
            <p className="text-slate-400">Multiple logins with role-based access for different departments.</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="text-3xl mb-4">📧</div>
            <h3 className="text-xl font-bold text-white mb-2">Email Notifications</h3>
            <p className="text-slate-400">Automatic notifications to managers and coordinators for all actions.</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="text-3xl mb-4">📈</div>
            <h3 className="text-xl font-bold text-white mb-2">Analytics</h3>
            <p className="text-slate-400">View comprehensive leave statistics and usage patterns.</p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-20 bg-slate-800 border border-slate-700 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-white mb-4">Demo Credentials</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-slate-400 text-sm mb-2">Employee</p>
              <p className="text-white font-mono">employee@company.com</p>
              <p className="text-white font-mono">password123</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-2">Manager</p>
              <p className="text-white font-mono">manager@company.com</p>
              <p className="text-white font-mono">password123</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-2">Coordinator</p>
              <p className="text-white font-mono">coordinator@company.com</p>
              <p className="text-white font-mono">password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
