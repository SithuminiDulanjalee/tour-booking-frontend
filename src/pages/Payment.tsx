import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { createPayment, getBookingPaymentSummary } from "../service/payment"

const PAYMENT_METHODS = [
  { value: "card", label: "💳 Credit / Debit Card" },
  { value: "bank_transfer", label: "🏦 Bank Transfer" },
  { value: "cash", label: "💵 Cash" }
]

const Payment = () => {
  const { bookingId } = useParams()
  const navigate = useNavigate()

  const [summaryData, setSummaryData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [amount, setAmount] = useState("")
  const [method, setMethod] = useState("card")
  const [notes, setNotes] = useState("")
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState("")
  const [lastPayment, setLastPayment] = useState<any>(null)

  const fetchSummary = () => {
    if (!bookingId) return
    setLoading(true)
    getBookingPaymentSummary(bookingId)
      .then((res) => {
        setSummaryData(res.data)
        // Pre-fill with remaining amount
        setAmount(String(res.data.summary.remainingAmount.toFixed(2)))
      })
      .catch(() => setSummaryData(null))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchSummary()
  }, [bookingId])

  const handlePay = async () => {
    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid payment amount.")
      return
    }
    setError("")
    setPaying(true)
    try {
      const result = await createPayment({
        bookingId: bookingId!,
        amount: Number(amount),
        method,
        notes
      })
      setLastPayment(result.data)
      // Refresh summary to reflect the new payment
      fetchSummary()
    } catch (err: any) {
      setError(err?.response?.data?.message || "Payment failed. Please try again.")
    } finally {
      setPaying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!summaryData) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-3">😕</p>
          <p className="text-slate-400">Booking not found.</p>
          <button
            onClick={() => navigate("/my-bookings")}
            className="mt-4 rounded-xl bg-emerald-500 px-5 py-2 text-sm text-slate-950 font-semibold"
          >
            My Bookings
          </button>
        </div>
      </div>
    )
  }

  const { booking, payments, summary } = summaryData
  const progressPercent =
    summary.totalPrice > 0
      ? Math.min(100, (summary.paidAmount / summary.totalPrice) * 100)
      : 0

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/90 backdrop-blur px-6 py-4">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center">
              <span className="text-slate-950 text-xs font-black">VV</span>
            </div>
            <span className="font-bold text-lg tracking-tight">VoyageVerde</span>
          </div>
          <button
            onClick={() => navigate("/my-bookings")}
            className="text-slate-300 hover:text-white text-sm px-3 py-2 rounded-xl hover:bg-white/5 transition"
          >
            ← My Bookings
          </button>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <p className="text-emerald-400 uppercase tracking-[0.2em] text-xs font-semibold">
            Secure Payment
          </p>
          <h1 className="mt-2 text-3xl font-bold">Complete Your Payment</h1>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left: Booking summary + history */}
          <div className="lg:col-span-3 space-y-5">
            {/* Booking card */}
            <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
              <p className="text-slate-400 text-xs uppercase tracking-wider mb-4">
                Booking Summary
              </p>
              <div className="flex gap-4">
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
                <div>
                  <p className="font-semibold">{booking.tour?.title}</p>
                  <p className="text-slate-400 text-sm">📍 {booking.tour?.location}</p>
                  <p className="text-slate-400 text-xs mt-1">
                    👥 {booking.numberOfPeople} person(s) · 📅{" "}
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Payment breakdown */}
              <div className="mt-5 space-y-2 border-t border-white/10 pt-5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Total Price</span>
                  <span className="font-semibold">${summary.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Already Paid</span>
                  <span className="text-emerald-400 font-semibold">
                    ${summary.paidAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm border-t border-white/10 pt-2">
                  <span className="font-semibold">Remaining Balance</span>
                  <span
                    className={`font-bold text-lg ${
                      summary.remainingAmount <= 0 ? "text-emerald-400" : "text-cyan-400"
                    }`}
                  >
                    ${summary.remainingAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-5">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Payment Progress</span>
                  <span>{progressPercent.toFixed(0)}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {summary.isFullyPaid && (
                <div className="mt-4 rounded-xl bg-emerald-500/10 border border-emerald-400/30 px-4 py-3 text-emerald-300 text-sm text-center font-semibold">
                  ✅ This booking is fully paid
                </div>
              )}
            </div>

            {/* Payment history */}
            {payments.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-slate-900 overflow-hidden">
                <div className="px-5 py-4 border-b border-white/10">
                  <p className="font-semibold text-sm">Payment History</p>
                </div>
                <div className="divide-y divide-white/5">
                  {payments.map((p: any) => (
                    <div
                      key={p._id}
                      className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition"
                    >
                      <div>
                        <p className="font-mono text-xs text-cyan-400">{p.transactionId}</p>
                        <p className="text-slate-400 text-xs mt-0.5">
                          {p.method.replace("_", " ")} ·{" "}
                          {new Date(p.createdAt).toLocaleDateString()}
                          {p.notes ? ` · ${p.notes}` : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-400 font-bold">${p.amount.toFixed(2)}</p>
                        <span className="text-xs text-emerald-300">completed</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Payment form */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-2xl border border-emerald-400/20 bg-slate-900 p-6 shadow-2xl">
              {lastPayment ? (
                /* Success state */
                <div className="text-center py-4">
                  <p className="text-5xl mb-3">🎉</p>
                  <p className="font-bold text-emerald-300 text-xl">Payment Successful!</p>
                  <p className="text-slate-400 text-xs mt-2 font-mono">
                    {lastPayment.transactionId}
                  </p>
                  <p className="text-slate-300 text-sm mt-2">
                    Amount paid:{" "}
                    <span className="text-emerald-400 font-bold">
                      ${lastPayment.amount.toFixed(2)}
                    </span>
                  </p>

                  {summary.isFullyPaid ? (
                    <div className="mt-4 rounded-xl bg-emerald-500/10 border border-emerald-400/30 px-4 py-2 text-emerald-300 text-sm">
                      ✅ Booking fully paid!
                    </div>
                  ) : (
                    <p className="mt-3 text-yellow-300 text-sm">
                      Remaining: ${summary.remainingAmount.toFixed(2)}
                    </p>
                  )}

                  <div className="flex gap-2 mt-5">
                    {!summary.isFullyPaid && (
                      <button
                        onClick={() => setLastPayment(null)}
                        className="flex-1 rounded-xl border border-white/10 bg-slate-800 py-2.5 text-sm hover:bg-slate-700 transition"
                      >
                        Pay More
                      </button>
                    )}
                    <button
                      onClick={() => navigate("/my-bookings")}
                      className="flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 py-2.5 text-sm font-semibold text-slate-950"
                    >
                      My Bookings
                    </button>
                  </div>
                </div>
              ) : summary.isFullyPaid ? (
                /* Already paid state */
                <div className="text-center py-4">
                  <p className="text-4xl mb-3">✅</p>
                  <p className="font-bold text-emerald-300 text-lg">Fully Paid</p>
                  <p className="text-slate-400 text-sm mt-1">No outstanding balance.</p>
                  <button
                    onClick={() => navigate("/my-payments")}
                    className="mt-4 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 py-2.5 text-sm font-semibold text-slate-950"
                  >
                    View Payment History
                  </button>
                </div>
              ) : (
                /* Payment form */
                <>
                  <p className="font-semibold mb-5">Make a Payment</p>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">
                        Amount ($) — max ${summary.remainingAmount.toFixed(2)}
                      </label>
                      <input
                        type="number"
                        min="0.01"
                        max={summary.remainingAmount}
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-sm outline-none focus:border-emerald-400 transition"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 mb-2 block">
                        Payment Method
                      </label>
                      <div className="space-y-2">
                        {PAYMENT_METHODS.map((m) => (
                          <label
                            key={m.value}
                            className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition ${
                              method === m.value
                                ? "border-emerald-400/50 bg-emerald-500/10"
                                : "border-slate-700 bg-slate-800 hover:border-slate-600"
                            }`}
                          >
                            <input
                              type="radio"
                              name="method"
                              value={m.value}
                              checked={method === m.value}
                              onChange={() => setMethod(m.value)}
                              className="accent-emerald-400"
                            />
                            <span className="text-sm">{m.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">
                        Notes (optional)
                      </label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Bank reference number"
                        className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-sm outline-none focus:border-emerald-400 transition"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-red-200 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handlePay}
                    disabled={paying}
                    className="mt-5 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 py-3 font-semibold text-slate-950 hover:opacity-90 transition disabled:opacity-50"
                  >
                    {paying
                      ? "Processing..."
                      : `Pay $${Number(amount || 0).toFixed(2)}`}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment