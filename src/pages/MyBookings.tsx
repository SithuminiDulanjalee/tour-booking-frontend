import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { cancelBooking, getMyBookings } from "../service/booking"

const lkr = (amount: number | undefined | null) =>
  `LKR ${(amount ?? 0).toLocaleString("en-LK", { minimumFractionDigits: 2 })}`

// Returns the correct action button label and style based on booking state
const getPaymentAction = (booking: any) => {
  const { paymentStage, status } = booking

  if (status === "cancelled") return null

  if (paymentStage === "unpaid") {
    return {
      label: "💳 Pay Advance (30%)",
      style: "border-cyan-400/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20",
      navigate: true
    }
  }

  if (paymentStage === "advance_paid" && status !== "confirmed") {
    return {
      label: "⏳ Awaiting Admin Confirmation",
      style: "border-yellow-400/30 bg-yellow-500/10 text-yellow-300 cursor-default opacity-80",
      navigate: false
    }
  }

  if (paymentStage === "advance_paid" && status === "confirmed") {
    return {
      label: "💰 Pay Balance (70%)",
      style: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20",
      navigate: true
    }
  }

  if (paymentStage === "fully_paid") {
    return {
      label: "✅ Fully Paid",
      style: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300 cursor-default",
      navigate: false
    }
  }

  return null
}

// Stage badge
const StageBadge = ({ stage }: { stage: string }) => {
  const map: Record<string, { label: string; cls: string }> = {
    unpaid: { label: "Not Paid", cls: "bg-slate-700 text-slate-300 border-slate-600" },
    advance_paid: {
      label: "Advance Paid",
      cls: "bg-cyan-500/10 text-cyan-300 border-cyan-400/20"
    },
    fully_paid: {
      label: "Fully Paid",
      cls: "bg-emerald-500/10 text-emerald-300 border-emerald-400/20"
    }
  }
  const s = map[stage] || map["unpaid"]
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold border ${s.cls}`}>
      {s.label}
    </span>
  )
}

const MyBookings = () => {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const navigate = useNavigate()

  const fetchBookings = () => {
    setLoading(true)
    getMyBookings()
      .then((res) => setBookings(res.data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return
    setCancellingId(id)
    try {
      await cancelBooking(id)
      fetchBookings()
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to cancel booking.")
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/90 backdrop-blur px-6 py-4">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
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
            <button
              onClick={() => navigate("/dashboard")}
              className="text-slate-300 hover:text-white text-sm px-3 py-2 rounded-xl hover:bg-white/5 transition"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/my-payments")}
              className="text-slate-300 hover:text-white text-sm px-3 py-2 rounded-xl hover:bg-white/5 transition"
            >
              Payments
            </button>
            <button
              onClick={() => navigate("/tours")}
              className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-500/20 transition"
            >
              Browse Tours
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <p className="text-cyan-400 uppercase tracking-[0.2em] text-xs font-semibold">
            My Account
          </p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold">My Bookings</h1>
          <p className="text-slate-400 text-sm mt-1">
            Pay advance to reserve · Admin confirms · Pay balance to finalise
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="h-12 w-12 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-24 text-slate-400">
            <p className="text-5xl mb-4">🧳</p>
            <p className="text-lg">No bookings yet.</p>
            <button
              onClick={() => navigate("/tours")}
              className="mt-5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-6 py-2.5 text-sm font-semibold text-slate-950"
            >
              Explore Tours
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const action = getPaymentAction(booking)
              const advancePct =
                booking.totalPrice > 0
                  ? Math.round(((booking.advanceAmount ?? Math.round(booking.totalPrice * 0.3)) / booking.totalPrice) * 100)
                  : 30
              const progressPct =
                booking.paymentStage === "fully_paid"
                  ? 100
                  : booking.paymentStage === "advance_paid"
                  ? advancePct
                  : 0

              return (
                <div
                  key={booking._id}
                  className="rounded-2xl border border-white/10 bg-slate-900 p-6"
                >
                  {/* Top row: tour info + booking status + payment stage */}
                  <div className="flex flex-col md:flex-row gap-5 md:items-start">
                    <div className="flex gap-4 items-start flex-1">
                      {booking.tour?.image ? (
                        <img
                          src={booking.tour.image}
                          alt={booking.tour.title}
                          className="h-16 w-24 rounded-xl object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="h-16 w-24 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">🌍</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold">{booking.tour?.title || "Tour"}</h3>
                        <p className="text-slate-400 text-sm mt-0.5">
                          📍 {booking.tour?.location}
                        </p>
                        <p className="text-slate-400 text-xs mt-0.5">
                          📅 {new Date(booking.bookingDate).toLocaleDateString()} ·{" "}
                          {booking.numberOfPeople} person(s)
                        </p>
                      </div>
                    </div>

                    {/* Right: badges + action button */}
                    <div className="flex flex-col gap-2 items-start md:items-end flex-shrink-0">
                      <div className="flex items-center gap-2 flex-wrap justify-end">
                        {/* Booking status badge */}
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold border ${
                            booking.status === "confirmed"
                              ? "bg-emerald-500/10 text-emerald-300 border-emerald-400/20"
                              : booking.status === "pending"
                              ? "bg-yellow-500/10 text-yellow-300 border-yellow-400/20"
                              : "bg-red-500/10 text-red-300 border-red-400/20"
                          }`}
                        >
                          {booking.status === "confirmed"
                            ? "✅ Booking Confirmed"
                            : booking.status === "pending"
                            ? "🕐 Booking Pending"
                            : "❌ Cancelled"}
                        </span>

                        {/* Payment stage badge */}
                        {booking.status !== "cancelled" && (
                          <StageBadge stage={booking.paymentStage} />
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 mt-1">
                        {action && (
                          <button
                            onClick={() =>
                              action.navigate && navigate(`/payment/${booking._id}`)
                            }
                            className={`rounded-xl border px-4 py-2 text-xs font-semibold transition ${action.style}`}
                          >
                            {action.label}
                          </button>
                        )}

                        {booking.status !== "cancelled" &&
                          booking.paymentStage !== "fully_paid" && (
                            <button
                              onClick={() => handleCancel(booking._id)}
                              disabled={cancellingId === booking._id}
                              className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-xs text-red-300 hover:bg-red-500/20 transition disabled:opacity-50"
                            >
                              {cancellingId === booking._id ? "…" : "Cancel"}
                            </button>
                          )}
                      </div>
                    </div>
                  </div>

                  {/* Payment summary row */}
                  {booking.status !== "cancelled" && (
                    <div className="mt-5 border-t border-white/10 pt-4">
                      {/* Price labels */}
                      <div className="flex items-center justify-between text-xs mb-2 flex-wrap gap-2">
                        <span className="text-slate-400 font-medium">Payment Breakdown</span>
                        <div className="flex items-center gap-4">
                          <span className="text-slate-400">
                            Total:{" "}
                            <span className="text-white font-semibold">
                              {lkr(booking.totalPrice)}
                            </span>
                          </span>
                          <span className="text-slate-400">
                            Advance (30%):{" "}
                            <span
                              className={
                                booking.paymentStage !== "unpaid"
                                  ? "text-emerald-400 font-semibold"
                                  : "text-cyan-400 font-semibold"
                              }
                            >
                              {lkr((booking.advanceAmount ?? Math.round(booking.totalPrice * 0.3)))}
                            </span>
                          </span>
                          <span className="text-slate-400">
                            Balance (70%):{" "}
                            <span
                              className={
                                booking.paymentStage === "fully_paid"
                                  ? "text-emerald-400 font-semibold"
                                  : "text-slate-300 font-semibold"
                              }
                            >
                              {lkr(booking.totalPrice - (booking.advanceAmount ?? Math.round(booking.totalPrice * 0.3)))}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>0%</span>
                        <span className="text-cyan-500/70">
                          {advancePct}% advance
                        </span>
                        <span>100%</span>
                      </div>

                      {/* Contextual status message */}
                      <p className="text-xs mt-2">
                        {booking.paymentStage === "unpaid" && (
                          <span className="text-cyan-400">
                            ℹ️ Pay the advance to reserve your slot. Admin will confirm after payment.
                          </span>
                        )}
                        {booking.paymentStage === "advance_paid" &&
                          booking.status === "pending" && (
                            <span className="text-yellow-400">
                              ⏳ Advance received. Waiting for admin to confirm your booking.
                            </span>
                          )}
                        {booking.paymentStage === "advance_paid" &&
                          booking.status === "confirmed" && (
                            <span className="text-emerald-400">
                              🎉 Booking confirmed! Pay the balance to finalise your tour.
                            </span>
                          )}
                        {booking.paymentStage === "fully_paid" && (
                          <span className="text-emerald-400">
                            ✅ All payments complete. Your tour is fully booked!
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyBookings