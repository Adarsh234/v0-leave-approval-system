import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-700 bg-slate-800/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Leave Approval System
          </h1>
          <Link href="/auth/login">
            <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-2 shadow-md transition-all duration-300">
              Login
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-24 text-center space-y-6">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent animate-text-gradient">
          Streamline Your Leave Management
        </h2>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          A comprehensive platform for managing leave requests, approvals, and records across your organization with
          department-based access and email notifications.
        </p>

        <div className="flex gap-4 justify-center pt-8">
          <Link href="/auth/login">
            <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-8 py-6 text-lg shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              Get Started
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-6 mt-16">
        {[
          { icon: "📋", title: "Leave Requests", text: "Employees can easily submit leave requests with detailed information and reasons." },
          { icon: "✅", title: "Approval Workflow", text: "Managers review and approve/reject requests with a structured workflow." },
          { icon: "📊", title: "Leave Records", text: "Track leave balance and usage per academic year for all employees." },
          { icon: "👥", title: "Department Access", text: "Multiple logins with role-based access for different departments." },
          { icon: "📧", title: "Email Notifications", text: "Automatic notifications to managers and coordinators for all actions." },
          { icon: "📈", title: "Analytics", text: "View comprehensive leave statistics and usage patterns." },
        ].map((feature, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 hover:shadow-2xl hover:border-indigo-500"
          >
            <div className="text-4xl mb-4 animate-bounce">{feature.icon}</div>
            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-slate-400">{feature.text}</p>
          </div>
        ))}
      </div>

      {/* Demo Credentials */}
      <div className="mt-20 max-w-7xl mx-auto px-6">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-white mb-6">Demo Credentials</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { role: "Employee", email: "employee@company.com", password: "password123" },
              { role: "Manager", email: "manager@company.com", password: "password123" },
              { role: "Coordinator", email: "coordinator@company.com", password: "password123" },
            ].map((cred, i) => (
              <div key={i} className="bg-slate-700/50 border border-slate-600 rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300">
                <p className="text-slate-400 text-sm mb-2">{cred.role}</p>
                <p className="text-white font-mono">{cred.email}</p>
                <p className="text-white font-mono">{cred.password}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
