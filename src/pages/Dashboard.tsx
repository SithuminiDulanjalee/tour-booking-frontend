import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { getMyBookings } from "../service/booking"
import { getMyPayments } from "../service/payment"

const lkr = (amount: number) =>
  `LKR ${amount.toLocaleString("en-LK", { minimumFractionDigits: 2 })}`

const Dashboard = () => {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getMyBookings(), getMyPayments()])
      .then(([bookingsRes, paymentsRes]) => {
        setBookings(bookingsRes.data)
        setPayments(paymentsRes.data)
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

  const isAdmin = user?.roles?.includes("ADMIN")

  const confirmed = bookings.filter((b) => b.status === "confirmed").length
  const pending = bookings.filter((b) => b.status === "pending").length

  const totalPaid = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0)

  // Outstanding = total booking costs (non-cancelled) minus what's been paid
  const totalBookingCost = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + b.totalPrice, 0)

  const outstanding = Math.max(0, totalBookingCost - totalPaid)

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/90 backdrop-blur px-6 py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center">
              <span className="text-slate-950 text-xs font-black">VL</span>
            </div>
            <span className="font-bold text-lg tracking-tight">VoyaLink</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/tours")} className="text-slate-300 hover:text-white text-sm px-3 py-2 rounded-xl hover:bg-white/5 transition">Browse Tours</button>
            <button onClick={() => navigate("/my-bookings")} className="text-slate-300 hover:text-white text-sm px-3 py-2 rounded-xl hover:bg-white/5 transition">My Bookings</button>
            <button onClick={() => navigate("/my-payments")} className="text-slate-300 hover:text-white text-sm px-3 py-2 rounded-xl hover:bg-white/5 transition">Payments</button>
            <button
  onClick={() => navigate("/ai")}
  className="text-slate-300 hover:text-white text-sm px-3 py-2 rounded-xl hover:bg-white/5 transition"
>
  🤖 AI Guide
</button>
            {isAdmin && (
              <button onClick={() => navigate("/admin")} className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-500/20 transition">Admin Panel</button>
            )}
            <button onClick={handleLogout} className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-300 hover:bg-red-500/20 transition">Logout</button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Welcome hero */}
        <div className="relative overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 md:p-12 shadow-2xl mb-8">
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
          <div className="relative flex items-center justify-between flex-wrap gap-6">
            <div>
              <p className="text-cyan-400 uppercase tracking-[0.25em] text-xs font-semibold">User Dashboard</p>
              <h1 className="mt-3 text-3xl md:text-5xl font-bold leading-tight">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  {user?.name?.split(" ")[0] || "Traveler"}
                </span>{" "}👋
              </h1>
              <p className="mt-2 text-slate-400 text-sm">{user?.email}</p>
            </div>
            <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-emerald-300 text-xs font-bold uppercase tracking-widest">
              {user?.roles?.[0] || "USER"}
            </span>
          </div>
        </div>

        {/* Booking stats */}
        <p className="text-slate-400 text-xs uppercase tracking-wider mb-3">Booking Overview</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Bookings", value: bookings.length, icon: "🎫", border: "border-cyan-400/20", text: "text-cyan-400" },
            { label: "Confirmed", value: confirmed, icon: "✅", border: "border-emerald-400/20", text: "text-emerald-400" },
            { label: "Pending", value: pending, icon: "⏳", border: "border-yellow-400/20", text: "text-yellow-400" },
            { label: "Total Cost", value: lkr(totalBookingCost), icon: "🗓", border: "border-slate-600/50", text: "text-slate-300" }
          ].map((stat) => (
            <div key={stat.label} className={`rounded-2xl border ${stat.border} bg-slate-900 p-5`}>
              <span className="text-2xl">{stat.icon}</span>
              <p className={`mt-3 text-2xl font-bold ${stat.text}`}>{loading ? "…" : stat.value}</p>
              <p className="text-slate-400 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Payment stats */}
        <p className="text-slate-400 text-xs uppercase tracking-wider mb-3">Payment Overview · LKR</p>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="rounded-2xl border border-emerald-400/20 bg-slate-900 p-5">
            <span className="text-2xl">💰</span>
            <p className="mt-3 text-2xl font-bold text-emerald-400">{loading ? "…" : lkr(totalPaid)}</p>
            <p className="text-slate-400 text-xs mt-1">Total Paid</p>
          </div>
          <div className={`rounded-2xl border bg-slate-900 p-5 ${outstanding > 0 ? "border-red-400/20" : "border-emerald-400/20"}`}>
            <span className="text-2xl">{outstanding > 0 ? "⚠️" : "✅"}</span>
            <p className={`mt-3 text-2xl font-bold ${outstanding > 0 ? "text-red-400" : "text-emerald-400"}`}>
              {loading ? "…" : lkr(outstanding)}
            </p>
            <p className="text-slate-400 text-xs mt-1">Outstanding Balance</p>
          </div>
        </div>

        {/* Quick actions */}
<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
  <button
    onClick={() => navigate("/tours")}
    className="group rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5 p-6 text-left hover:border-cyan-400/40 transition"
  >
    <span className="text-3xl">🌍</span>
    <p className="mt-3 font-semibold text-cyan-300">Browse Tours</p>
    <p className="text-slate-400 text-xs mt-1">Find your next adventure →</p>
  </button>
  <button
    onClick={() => navigate("/my-bookings")}
    className="group rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 p-6 text-left hover:border-emerald-400/40 transition"
  >
    <span className="text-3xl">📋</span>
    <p className="mt-3 font-semibold text-emerald-300">My Bookings</p>
    <p className="text-slate-400 text-xs mt-1">Pay advance & balance →</p>
  </button>
  <button
    onClick={() => navigate("/my-payments")}
    className="group rounded-2xl border border-purple-400/20 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 p-6 text-left hover:border-purple-400/40 transition"
  >
    <span className="text-3xl">💳</span>
    <p className="mt-3 font-semibold text-purple-300">Payment History</p>
    <p className="text-slate-400 text-xs mt-1">LKR transactions →</p>
  </button>
  <button
    onClick={() => navigate("/ai")}
    className="group rounded-2xl border border-pink-400/20 bg-gradient-to-br from-pink-500/5 to-purple-500/5 p-6 text-left hover:border-pink-400/40 transition"
  >
    <span className="text-3xl">🤖</span>
    <p className="mt-3 font-semibold text-pink-300">AI Travel Guide</p>
    <p className="text-slate-400 text-xs mt-1">Ask anything about Sri Lanka →</p>
  </button>
</div>

        {/* Recent bookings */}
        <div className="rounded-2xl border border-white/10 bg-slate-900 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="font-semibold">Recent Bookings</h2>
            <button onClick={() => navigate("/my-bookings")} className="text-sm text-cyan-400 hover:text-cyan-300 transition">View all →</button>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-3xl mb-2">🌏</p>
              <p className="text-sm">No bookings yet.</p>
              <button onClick={() => navigate("/tours")} className="mt-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950">Browse Tours</button>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {bookings.slice(0, 5).map((booking: any) => {
                const canPay = booking.status !== "cancelled"
                const btnLabel =
                  booking.paymentStage === "unpaid"
                    ? "Pay Advance"
                    : booking.paymentStage === "advance_paid" &&
                      booking.status === "confirmed"
                    ? "Pay Balance"
                    : booking.paymentStage === "fully_paid"
                    ? "Paid ✅"
                    : "Awaiting ⏳"

                return (
                  <div key={booking._id} className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition">
                    <div>
                      <p className="font-medium text-sm">{booking.tour?.title || "Tour"}</p>
                      <p className="text-slate-400 text-xs mt-0.5">
                        📍 {booking.tour?.location} · {booking.numberOfPeople} person(s) · {lkr(booking.totalPrice)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold border ${
                        booking.status === "confirmed" ? "bg-emerald-500/10 text-emerald-300 border-emerald-400/20"
                          : booking.status === "pending" ? "bg-yellow-500/10 text-yellow-300 border-yellow-400/20"
                          : "bg-red-500/10 text-red-300 border-red-400/20"
                      }`}>
                        {booking.status}
                      </span>
                      {canPay && booking.paymentStage !== "fully_paid" && (
                        <button
                          onClick={() => navigate(`/payment/${booking._id}`)}
                          className="rounded-lg bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs px-3 py-1 hover:bg-cyan-500/20 transition"
                        >
                          {btnLabel}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard