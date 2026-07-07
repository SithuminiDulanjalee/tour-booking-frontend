import { useEffect, useState } from "react"
import AdminNavbar from "../components/AdminNavbar"
import { getAllBookings, updateBookingStatus } from "../service/booking"

const lkr = (amount: number | undefined | null) =>
  `LKR ${(amount ?? 0).toLocaleString("en-LK", { minimumFractionDigits: 2 })}`

const StageBadge = ({ stage }: { stage: string }) => {
  const map: Record<string, { label: string; cls: string }> = {
    unpaid: { label: "Not Paid", cls: "bg-slate-700 text-slate-300 border-slate-600" },
    advance_paid: { label: "✅ Advance Paid", cls: "bg-cyan-500/10 text-cyan-300 border-cyan-400/20" },
    fully_paid: { label: "✅ Fully Paid", cls: "bg-emerald-500/10 text-emerald-300 border-emerald-400/20" }
  }
  const s = map[stage] || map["unpaid"]
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold border ${s.cls}`}>
      {s.label}
    </span>
  )
}

const AdminBookings = () => {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchBookings = () => {
    setLoading(true)
    getAllBookings()
      .then((res) => setBookings(res.data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchBookings() }, [])

  const handleConfirm = async (id: string) => {
    if (!confirm("Confirm this booking? User will be able to pay the balance.")) return
    setUpdatingId(id)
    try { await updateBookingStatus(id, "confirmed"); fetchBookings() }
    catch (err: any) { alert(err?.response?.data?.message || "Failed to confirm booking.") }
    finally { setUpdatingId(null) }
  }

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this booking?")) return
    setUpdatingId(id)
    try { await updateBookingStatus(id, "cancelled"); fetchBookings() }
    catch (err: any) { alert(err?.response?.data?.message || "Failed to cancel booking.") }
    finally { setUpdatingId(null) }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AdminNavbar />

      <div className="mx-auto max-w-6xl px-4 md:px-6 py-8 md:py-10">
        <div className="mb-5 md:mb-6">
          <p className="text-purple-400 uppercase tracking-[0.2em] text-xs font-semibold">Admin</p>
          <h1 className="mt-1 text-2xl md:text-3xl font-bold">Manage Bookings</h1>
          <p className="text-slate-400 text-sm mt-1">
            Confirm button unlocks only after user pays the advance.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 mb-5 md:mb-6">
          {[
            { label: "Not Paid — locked", cls: "bg-slate-700 text-slate-300 border-slate-600" },
            { label: "Advance Paid — ready to confirm", cls: "bg-cyan-500/10 text-cyan-300 border-cyan-400/20" },
            { label: "Fully Paid — complete", cls: "bg-emerald-500/10 text-emerald-300 border-emerald-400/20" }
          ].map((b) => (
            <span
              key={b.label}
              className={`rounded-full px-3 py-1 text-xs font-medium border ${b.cls}`}
            >
              {b.label}
            </span>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="h-12 w-12 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.length === 0 && (
              <div className="text-center py-16 text-slate-400 rounded-2xl border border-white/10 bg-slate-900">
                No bookings yet.
              </div>
            )}

            {bookings.map((booking) => {
              const canConfirm =
                booking.paymentStage === "advance_paid" && booking.status === "pending"
              const isActive = updatingId === booking._id
              const advanceAmt =
                booking.advanceAmount ?? Math.round(booking.totalPrice * 0.3)

              return (
                <div
                  key={booking._id}
                  className="rounded-2xl border border-white/10 bg-slate-900 p-4 md:p-5"
                >
                  <div className="flex flex-col md:flex-row gap-4 md:gap-5 md:items-center justify-between">
                    {/* Booking info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <p className="font-semibold text-sm md:text-base truncate">
                          {booking.tour?.title || "Tour"}
                        </p>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold border ${
                            booking.status === "confirmed"
                              ? "bg-emerald-500/10 text-emerald-300 border-emerald-400/20"
                              : booking.status === "pending"
                              ? "bg-yellow-500/10 text-yellow-300 border-yellow-400/20"
                              : "bg-red-500/10 text-red-300 border-red-400/20"
                          }`}
                        >
                          {booking.status}
                        </span>
                        <StageBadge stage={booking.paymentStage} />
                      </div>

                      <div className="text-slate-400 text-xs flex flex-wrap gap-2 md:gap-3">
                        <span>👤 {booking.user?.name}</span>
                        <span className="hidden sm:inline">({booking.user?.email})</span>
                        <span>📍 {booking.tour?.location}</span>
                        <span>📅 {new Date(booking.bookingDate).toLocaleDateString()}</span>
                        <span>👥 {booking.numberOfPeople} person(s)</span>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-2 text-xs">
                        <span className="text-slate-400">
                          Total:{" "}
                          <span className="text-white font-semibold">{lkr(booking.totalPrice)}</span>
                        </span>
                        <span className="text-slate-400">
                          Advance:{" "}
                          <span
                            className={
                              booking.paymentStage !== "unpaid"
                                ? "text-emerald-400 font-semibold"
                                : "text-cyan-400 font-semibold"
                            }
                          >
                            {lkr(advanceAmt)}
                          </span>
                        </span>
                        <span className="text-slate-400 hidden sm:inline">
                          Balance:{" "}
                          <span
                            className={
                              booking.paymentStage === "fully_paid"
                                ? "text-emerald-400 font-semibold"
                                : "text-slate-300 font-semibold"
                            }
                          >
                            {lkr(booking.totalPrice - advanceAmt)}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    {booking.status !== "cancelled" && booking.status !== "confirmed" && (
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleConfirm(booking._id)}
                          disabled={!canConfirm || isActive}
                          title={
                            !canConfirm
                              ? "User must pay advance first"
                              : "Confirm booking"
                          }
                          className={`rounded-xl border px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-semibold transition ${
                            canConfirm
                              ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                              : "border-slate-700 bg-slate-800 text-slate-500 cursor-not-allowed opacity-50"
                          } disabled:opacity-50`}
                        >
                          {isActive
                            ? "…"
                            : canConfirm
                            ? "✅ Confirm"
                            : "🔒 Awaiting Advance"}
                        </button>
                        <button
                          onClick={() => handleCancel(booking._id)}
                          disabled={isActive}
                          className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm text-red-300 hover:bg-red-500/20 transition disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {booking.status === "confirmed" && (
                      <span className="text-emerald-400 text-sm font-semibold flex-shrink-0">
                        ✅ Confirmed
                      </span>
                    )}
                    {booking.status === "cancelled" && (
                      <span className="text-red-400 text-sm flex-shrink-0">❌ Cancelled</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminBookings