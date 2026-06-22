import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { getAllBookings } from "../service/booking"
import { getPaymentStats } from "../service/payment"
import { getAdminTours } from "../service/tour"

const AdminDashboard = () => {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const [tours, setTours] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [paymentStats, setPaymentStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getAdminTours(), getAllBookings(), getPaymentStats()])
      .then(([toursRes, bookingsRes, statsRes]) => {
        setTours(toursRes.data)
        setBookings(bookingsRes.data)
        setPaymentStats(statsRes.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    setUser(null)
    navigate("/login")
  }

  const activeTours = tours.filter((t) => t.isActive).length
  const pendingBookings = bookings.filter((b) => b.status === "pending").length

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/90 backdrop-blur px-6 py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center">
              <span className="text-slate-950 text-xs font-black">VV</span>
            </div>
            <span className="font-bold text-lg tracking-tight">VoyageVerde</span>
            <span className="rounded-full bg-purple-500/10 border border-purple-400/30 text-purple-300 text-xs px-3 py-1 font-semibold">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/admin/tours")}
              className="text-slate-300 hover:text-white text-sm px-3 py-2 rounded-xl hover:bg-white/5 transition"
            >
              Tours
            </button>
            <button
              onClick={() => navigate("/admin/bookings")}
              className="text-slate-300 hover:text-white text-sm px-3 py-2 rounded-xl hover:bg-white/5 transition"
            >
              Bookings
            </button>
            <button
              onClick={() => navigate("/admin/payments")}
              className="text-slate-300 hover:text-white text-sm px-3 py-2 rounded-xl hover:bg-white/5 transition"
            >
              Payments
            </button>
            <button
              onClick={handleLogout}
              className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-300 hover:bg-red-500/20 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-[2rem] border border-purple-400/20 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 md:p-10 shadow-2xl mb-8">
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
          <p className="text-purple-400 uppercase tracking-[0.25em] text-xs font-semibold">
            Admin Panel
          </p>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold">
            Hello,{" "}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {user?.name?.split(" ")[0]}
            </span>{" "}
            ⚙️
          </h1>
          <p className="mt-1 text-slate-400 text-sm">
            Manage tours, bookings, and payments from here.
          </p>
        </div>

        {/* Tour & Booking stats */}
        <p className="text-slate-400 text-xs uppercase tracking-wider mb-3">
          Tours & Bookings
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {[
            {
              label: "Total Tours",
              value: tours.length,
              icon: "🗺",
              border: "border-cyan-400/20",
              text: "text-cyan-400"
            },
            {
              label: "Active Tours",
              value: activeTours,
              icon: "✅",
              border: "border-emerald-400/20",
              text: "text-emerald-400"
            },
            {
              label: "Total Bookings",
              value: bookings.length,
              icon: "🎫",
              border: "border-purple-400/20",
              text: "text-purple-400"
            },
            {
              label: "Pending",
              value: pendingBookings,
              icon: "⏳",
              border: "border-yellow-400/20",
              text: "text-yellow-400"
            }
          ].map((stat) => (
            <div
              key={stat.label}
              className={`rounded-2xl border ${stat.border} bg-slate-900 p-5`}
            >
              <span className="text-2xl">{stat.icon}</span>
              <p className={`mt-3 text-3xl font-bold ${stat.text}`}>
                {loading ? "…" : stat.value}
              </p>
              <p className="text-slate-400 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Payment stats */}
        <p className="text-slate-400 text-xs uppercase tracking-wider mb-3 mt-6">
          Payment Overview
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Revenue",
              value: paymentStats ? `$${paymentStats.totalRevenue.toFixed(2)}` : "…",
              icon: "💰",
              border: "border-emerald-400/20",
              text: "text-emerald-400"
            },
            {
              label: "Transactions",
              value: paymentStats?.totalTransactions ?? "…",
              icon: "🔄",
              border: "border-cyan-400/20",
              text: "text-cyan-400"
            },
            {
              label: "Completed",
              value: paymentStats?.completedCount ?? "…",
              icon: "✅",
              border: "border-emerald-400/20",
              text: "text-emerald-400"
            },
            {
              label: "Refunded",
              value: paymentStats ? `$${paymentStats.refundedAmount.toFixed(2)}` : "…",
              icon: "↩️",
              border: "border-orange-400/20",
              text: "text-orange-400"
            }
          ].map((stat) => (
            <div
              key={stat.label}
              className={`rounded-2xl border ${stat.border} bg-slate-900 p-5`}
            >
              <span className="text-2xl">{stat.icon}</span>
              <p className={`mt-3 text-3xl font-bold ${stat.text}`}>
                {loading ? "…" : stat.value}
              </p>
              <p className="text-slate-400 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/admin/tours")}
            className="group rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5 p-7 text-left hover:border-cyan-400/40 transition"
          >
            <span className="text-4xl">🗺</span>
            <p className="mt-4 text-lg font-semibold text-cyan-300">Manage Tours</p>
            <p className="text-slate-400 text-sm mt-1">Create, edit, delete tours →</p>
          </button>
          <button
            onClick={() => navigate("/admin/bookings")}
            className="group rounded-2xl border border-purple-400/20 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 p-7 text-left hover:border-purple-400/40 transition"
          >
            <span className="text-4xl">📋</span>
            <p className="mt-4 text-lg font-semibold text-purple-300">Manage Bookings</p>
            <p className="text-slate-400 text-sm mt-1">Update booking statuses →</p>
          </button>
          <button
            onClick={() => navigate("/admin/payments")}
            className="group rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 p-7 text-left hover:border-emerald-400/40 transition"
          >
            <span className="text-4xl">💰</span>
            <p className="mt-4 text-lg font-semibold text-emerald-300">Manage Payments</p>
            <p className="text-slate-400 text-sm mt-1">Track revenue & refunds →</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard