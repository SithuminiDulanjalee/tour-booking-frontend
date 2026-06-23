import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { getAllBookings } from "../service/booking"
import { getPaymentStats } from "../service/payment"
import { getAdminTours } from "../service/tour"

const lkr = (amount: number) =>
  `LKR ${amount.toLocaleString("en-LK", { minimumFractionDigits: 2 })}`

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
  // Bookings with advance paid but not yet confirmed — admin action needed
  const awaitingConfirm = bookings.filter(
    (b) => b.paymentStage === "advance_paid" && b.status === "pending"
  ).length

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/90 backdrop-blur px-6 py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center">
              <span className="text-slate-950 text-xs font-black">VL</span>
            </div>
            <span className="font-bold text-lg tracking-tight">VoyaLink</span>
            <span className="rounded-full bg-purple-500/10 border border-purple-400/30 text-purple-300 text-xs px-3 py-1 font-semibold">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/admin/tours")} className="text-slate-300 hover:text-white text-sm px-3 py-2 rounded-xl hover:bg-white/5 transition">Tours</button>
            <button onClick={() => navigate("/admin/bookings")} className="text-slate-300 hover:text-white text-sm px-3 py-2 rounded-xl hover:bg-white/5 transition">Bookings</button>
            <button onClick={() => navigate("/admin/payments")} className="text-slate-300 hover:text-white text-sm px-3 py-2 rounded-xl hover:bg-white/5 transition">Payments</button>
            <button onClick={handleLogout} className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-300 hover:bg-red-500/20 transition">Logout</button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-[2rem] border border-purple-400/20 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 md:p-10 shadow-2xl mb-8">
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
          <p className="text-purple-400 uppercase tracking-[0.25em] text-xs font-semibold">Admin Panel</p>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold">
            Hello,{" "}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {user?.name?.split(" ")[0]}
            </span>{" "}⚙️
          </h1>
          <p className="mt-1 text-slate-400 text-sm">
            Manage tours, bookings, and payments · All amounts in LKR
          </p>
          {/* Action needed alert */}
          {!loading && awaitingConfirm > 0 && (
            <div
              onClick={() => navigate("/admin/bookings")}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-5 py-3 text-cyan-300 text-sm cursor-pointer hover:bg-cyan-500/20 transition"
            >
              <span className="font-bold">⚡ {awaitingConfirm} booking(s) awaiting your confirmation</span>
              <span className="text-xs">— advance payment received → Go confirm →</span>
            </div>
          )}
        </div>

        {/* Tour & booking stats */}
        <p className="text-slate-400 text-xs uppercase tracking-wider mb-3">Tours & Bookings</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Tours", value: tours.length, icon: "🗺", border: "border-cyan-400/20", text: "text-cyan-400" },
            { label: "Active Tours", value: activeTours, icon: "✅", border: "border-emerald-400/20", text: "text-emerald-400" },
            { label: "Total Bookings", value: bookings.length, icon: "🎫", border: "border-purple-400/20", text: "text-purple-400" },
            { label: "Awaiting Confirm", value: awaitingConfirm, icon: "⚡", border: "border-cyan-400/20", text: "text-cyan-400" }
          ].map((stat) => (
            <div key={stat.label} className={`rounded-2xl border ${stat.border} bg-slate-900 p-5`}>
              <span className="text-2xl">{stat.icon}</span>
              <p className={`mt-3 text-3xl font-bold ${stat.text}`}>{loading ? "…" : stat.value}</p>
              <p className="text-slate-400 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Payment stats */}
        <p className="text-slate-400 text-xs uppercase tracking-wider mb-3">Payment Overview · LKR</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Revenue", value: paymentStats ? lkr(paymentStats.totalRevenue) : "…", icon: "💰", border: "border-emerald-400/20", text: "text-emerald-400" },
            { label: "Advances Collected", value: paymentStats ? lkr(paymentStats.advanceRevenue) : "…", icon: "📥", border: "border-cyan-400/20", text: "text-cyan-400" },
            { label: "Balances Collected", value: paymentStats ? lkr(paymentStats.balanceRevenue) : "…", icon: "✅", border: "border-emerald-400/20", text: "text-emerald-400" },
            { label: "Refunded", value: paymentStats ? lkr(paymentStats.refundedAmount) : "…", icon: "↩️", border: "border-orange-400/20", text: "text-orange-400" }
          ].map((stat) => (
            <div key={stat.label} className={`rounded-2xl border ${stat.border} bg-slate-900 p-5`}>
              <span className="text-2xl">{stat.icon}</span>
              <p className={`mt-3 text-xl font-bold ${stat.text}`}>{loading ? "…" : stat.value}</p>
              <p className="text-slate-400 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <button onClick={() => navigate("/admin/tours")} className="group rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5 p-7 text-left hover:border-cyan-400/40 transition">
            <span className="text-4xl">🗺</span>
            <p className="mt-4 text-lg font-semibold text-cyan-300">Manage Tours</p>
            <p className="text-slate-400 text-sm mt-1">Create, edit, delete tours →</p>
          </button>
          <button onClick={() => navigate("/admin/bookings")} className="group rounded-2xl border border-purple-400/20 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 p-7 text-left hover:border-purple-400/40 transition">
            <span className="text-4xl">📋</span>
            <p className="mt-4 text-lg font-semibold text-purple-300">Manage Bookings</p>
            <p className="text-slate-400 text-sm mt-1">
              Confirm after advance received →
              {!loading && awaitingConfirm > 0 && (
                <span className="ml-1 rounded-full bg-cyan-500 text-slate-950 text-xs px-2 py-0.5 font-bold">
                  {awaitingConfirm}
                </span>
              )}
            </p>
          </button>
          <button onClick={() => navigate("/admin/payments")} className="group rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 p-7 text-left hover:border-emerald-400/40 transition">
            <span className="text-4xl">💰</span>
            <p className="mt-4 text-lg font-semibold text-emerald-300">Manage Payments</p>
            <p className="text-slate-400 text-sm mt-1">Track LKR revenue & refunds →</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard