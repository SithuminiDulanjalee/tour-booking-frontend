import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import AdminNavbar from "../components/AdminNavbar"
import { getAllBookings } from "../service/booking"
import { getPaymentStats } from "../service/payment"
import { getAdminTours } from "../service/tour"

const lkr = (amount: number | undefined | null) =>
  `LKR ${(amount ?? 0).toLocaleString("en-LK", { minimumFractionDigits: 2 })}`

const AdminDashboard = () => {
  const { user } = useAuth()
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

  const activeTours = tours.filter((t) => t.isActive).length
  const awaitingConfirm = bookings.filter(
    (b) => b.paymentStage === "advance_paid" && b.status === "pending"
  ).length

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AdminNavbar />

      <div className="mx-auto max-w-6xl px-4 md:px-6 py-8 md:py-10">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-[2rem] border border-purple-400/20 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 md:p-10 shadow-2xl mb-6 md:mb-8">
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
          <p className="text-purple-400 uppercase tracking-[0.25em] text-xs font-semibold">
            Admin Panel
          </p>
          <h1 className="mt-3 text-2xl md:text-4xl font-bold">
            Hello,{" "}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {user?.name?.split(" ")[0]}
            </span>{" "}
            ⚙️
          </h1>
          <p className="mt-1 text-slate-400 text-sm">
            Manage tours, bookings and payments · All amounts in LKR
          </p>
          {!loading && awaitingConfirm > 0 && (
            <div
              onClick={() => navigate("/admin/bookings")}
              className="mt-4 md:mt-5 inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-4 md:px-5 py-2.5 md:py-3 text-cyan-300 text-xs md:text-sm cursor-pointer hover:bg-cyan-500/20 transition"
            >
              <span className="font-bold">
                ⚡ {awaitingConfirm} booking(s) awaiting confirmation
              </span>
              <span className="hidden sm:inline text-xs">
                — advance received → Go confirm →
              </span>
            </div>
          )}
        </div>

        {/* Tour & booking stats */}
        <p className="text-slate-400 text-xs uppercase tracking-wider mb-3">
          Tours & Bookings
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          {[
            { label: "Total Tours", value: tours.length, icon: "🗺", border: "border-cyan-400/20", text: "text-cyan-400" },
            { label: "Active Tours", value: activeTours, icon: "✅", border: "border-emerald-400/20", text: "text-emerald-400" },
            { label: "Total Bookings", value: bookings.length, icon: "🎫", border: "border-purple-400/20", text: "text-purple-400" },
            { label: "Awaiting Confirm", value: awaitingConfirm, icon: "⚡", border: "border-cyan-400/20", text: "text-cyan-400" }
          ].map((stat) => (
            <div key={stat.label} className={`rounded-2xl border ${stat.border} bg-slate-900 p-4 md:p-5`}>
              <span className="text-xl md:text-2xl">{stat.icon}</span>
              <p className={`mt-2 md:mt-3 text-2xl md:text-3xl font-bold ${stat.text}`}>
                {loading ? "…" : stat.value}
              </p>
              <p className="text-slate-400 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Payment stats */}
        <p className="text-slate-400 text-xs uppercase tracking-wider mb-3 mt-4 md:mt-6">
          Payment Overview · LKR
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {[
            { label: "Total Revenue", value: paymentStats ? lkr(paymentStats.totalRevenue) : "…", icon: "💰", border: "border-emerald-400/20", text: "text-emerald-400" },
            { label: "Advances", value: paymentStats ? lkr(paymentStats.advanceRevenue) : "…", icon: "📥", border: "border-cyan-400/20", text: "text-cyan-400" },
            { label: "Balances", value: paymentStats ? lkr(paymentStats.balanceRevenue) : "…", icon: "✅", border: "border-emerald-400/20", text: "text-emerald-400" },
            { label: "Refunded", value: paymentStats ? lkr(paymentStats.refundedAmount) : "…", icon: "↩️", border: "border-orange-400/20", text: "text-orange-400" }
          ].map((stat) => (
            <div key={stat.label} className={`rounded-2xl border ${stat.border} bg-slate-900 p-4 md:p-5`}>
              <span className="text-xl md:text-2xl">{stat.icon}</span>
              <p className={`mt-2 md:mt-3 text-sm md:text-xl font-bold ${stat.text} break-all`}>
                {loading ? "…" : stat.value}
              </p>
              <p className="text-slate-400 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              path: "/admin/tours", icon: "🗺", label: "Manage Tours",
              sub: "Create, edit, delete tours →",
              border: "border-cyan-400/20", bg: "from-cyan-500/5 to-emerald-500/5 hover:from-cyan-500/10",
              text: "text-cyan-300", badge: 0
            },
            {
              path: "/admin/bookings", icon: "📋", label: "Manage Bookings",
              sub: "Confirm after advance received →",
              border: "border-purple-400/20", bg: "from-purple-500/5 to-cyan-500/5 hover:from-purple-500/10",
              text: "text-purple-300", badge: awaitingConfirm
            },
            {
              path: "/admin/payments", icon: "💰", label: "Manage Payments",
              sub: "Track LKR revenue & refunds →",
              border: "border-emerald-400/20", bg: "from-emerald-500/5 to-cyan-500/5 hover:from-emerald-500/10",
              text: "text-emerald-300", badge: 0
            }
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`group rounded-2xl border ${item.border} bg-gradient-to-br ${item.bg} p-6 md:p-7 text-left transition`}
            >
              <span className="text-3xl md:text-4xl">{item.icon}</span>
              <p className={`mt-3 md:mt-4 text-base md:text-lg font-semibold ${item.text} flex items-center gap-2`}>
                {item.label}
                {!loading && item.badge > 0 && (
                  <span className="rounded-full bg-cyan-500 text-slate-950 text-xs px-2 py-0.5 font-bold">
                    {item.badge}
                  </span>
                )}
              </p>
              <p className="text-slate-400 text-xs md:text-sm mt-1">{item.sub}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard