import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { createPayment, getBookingPaymentSummary } from "../service/payment"

// LKR formatter helper
const lkr = (amount: number) =>
  `LKR ${amount.toLocaleString("en-LK", { minimumFractionDigits: 2 })}`

const PAYMENT_METHODS = [
  { value: "card", label: "💳 Credit / Debit Card" },
  { value: "bank_transfer", label: "🏦 Bank Transfer" },
  { value: "cash", label: "💵 Cash" }
]

// Which step the payment UI is on
type PaymentStep = "advance" | "awaiting_confirmation" | "balance" | "complete"

const Payment = () => {
  const { bookingId } = useParams()
  const navigate = useNavigate()

  const [summaryData, setSummaryData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [method, setMethod] = useState("card")
  const [notes, setNotes] = useState("")
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState("")
  const [lastPayment, setLastPayment] = useState<any>(null)

  const fetchSummary = () => {
    if (!bookingId) return
    setLoading(true)
    getBookingPaymentSummary(bookingId)
      .then((res) => setSummaryData(res.data))
      .catch(() => setSummaryData(null))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchSummary()
  }, [bookingId])

  // Determine which step the user is on
  const getStep = (): PaymentStep => {
    if (!summaryData) return "advance"
    const { paymentStage, status } = summaryData.booking
    if (paymentStage === "fully_paid") return "complete"
    if (paymentStage === "advance_paid" && status === "confirmed") return "balance"
    if (paymentStage === "advance_paid" && status !== "confirmed") return "awaiting_confirmation"
    return "advance" // unpaid
  }

  const handlePay = async (paymentType: "advance" | "balance") => {
    if (!summaryData) return
    setError("")
    setPaying(true)

    const amount =
      paymentType === "advance"
        ? summaryData.summary.advanceAmount
        : summaryData.summary.balanceAmount

    try {
      const result = await createPayment({ bookingId: bookingId!, amount, method, notes })
      setLastPayment(result.data)
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
  const step = getStep()

  const progressPercent =
    summary.totalPrice > 0
      ? Math.min(100, (summary.paidAmount / summary.totalPrice) * 100)
      : 0

  // Step indicators shown at top
  const steps = [
    { key: "advance", label: "Pay Advance (30%)", done: step !== "advance" },
    { key: "confirm", label: "Admin Confirms", done: step === "balance" || step === "complete" },
    { key: "balance", label: "Pay Balance (70%)", done: step === "complete" }
  ]

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
            <span className="font-bold text-lg tracking-tight">VoyaLink</span>
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
            Secure Payment · LKR
          </p>
          <h1 className="mt-2 text-3xl font-bold">Complete Your Payment</h1>
        </div>

        {/* Progress steps */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2 flex-shrink-0">
              <div
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold border transition ${
                  s.done
                    ? "bg-emerald-500/15 border-emerald-400/30 text-emerald-300"
                    : i === steps.findIndex((x) => !x.done)
                    ? "bg-cyan-500/15 border-cyan-400/30 text-cyan-300"
                    : "bg-slate-800 border-slate-700 text-slate-500"
                }`}
              >
                {s.done ? "✅" : i + 1}
                <span>{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="h-px w-6 bg-slate-700 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left: booking info + price breakdown + history */}
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

              {/* Price breakdown */}
              <div className="mt-5 space-y-2.5 border-t border-white/10 pt-5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Total Package Price</span>
                  <span className="font-semibold">{lkr(summary.totalPrice)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">
                    Advance Payment{" "}
                    <span className="text-xs text-cyan-400">(30% — pay now)</span>
                  </span>
                  <span
                    className={
                      step !== "advance"
                        ? "text-emerald-400 font-semibold"
                        : "text-slate-300 font-semibold"
                    }
                  >
                    {step !== "advance" ? "✅ " : ""}
                    {lkr(summary.advanceAmount)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">
                    Balance Payment{" "}
                    <span className="text-xs text-slate-500">(70% — after confirmation)</span>
                  </span>
                  <span
                    className={
                      step === "complete"
                        ? "text-emerald-400 font-semibold"
                        : "text-slate-300 font-semibold"
                    }
                  >
                    {step === "complete" ? "✅ " : ""}
                    {lkr(summary.balanceAmount)}
                  </span>
                </div>

                <div className="flex justify-between text-sm border-t border-white/10 pt-2.5">
                  <span className="font-semibold">Amount Paid So Far</span>
                  <span className="font-bold text-lg text-emerald-400">
                    {lkr(summary.paidAmount)}
                  </span>
                </div>

                {summary.remainingAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Remaining Balance</span>
                    <span className="font-bold text-red-400">
                      {lkr(summary.remainingAmount)}
                    </span>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div className="mt-5">
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <span>Payment Progress</span>
                  <span>{progressPercent.toFixed(0)}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>0%</span>
                  <span className="text-cyan-500">30% advance</span>
                  <span>100%</span>
                </div>
              </div>
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
                      className="flex items-center justify-between px-5 py-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-semibold border ${
                              p.paymentType === "advance"
                                ? "bg-cyan-500/10 text-cyan-300 border-cyan-400/20"
                                : "bg-emerald-500/10 text-emerald-300 border-emerald-400/20"
                            }`}
                          >
                            {p.paymentType === "advance" ? "Advance" : "Balance"}
                          </span>
                          <span className="font-mono text-xs text-slate-400">
                            {p.transactionId}
                          </span>
                        </div>
                        <p className="text-slate-400 text-xs">
                          {p.method.replace("_", " ")} ·{" "}
                          {new Date(p.createdAt).toLocaleDateString()}
                          {p.notes ? ` · ${p.notes}` : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-400 font-bold">{lkr(p.amount)}</p>
                        <span className="text-xs text-emerald-300">completed</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Payment action card */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-2xl border border-emerald-400/20 bg-slate-900 p-6 shadow-2xl">

              {/* ── STEP: ADVANCE PAYMENT ── */}
              {step === "advance" && !lastPayment && (
                <>
                  <p className="text-xs text-cyan-400 uppercase tracking-wider mb-1">
                    Step 1 of 3
                  </p>
                  <p className="font-bold text-lg mb-1">Pay Advance Amount</p>
                  <p className="text-slate-400 text-xs mb-5">
                    Pay 30% now to reserve your booking. The admin will confirm after receiving your advance.
                  </p>

                  <div className="rounded-xl bg-cyan-500/10 border border-cyan-400/20 px-4 py-4 mb-5 text-center">
                    <p className="text-slate-400 text-xs mb-1">Advance Amount (30%)</p>
                    <p className="text-3xl font-bold text-cyan-400">
                      {lkr(summary.advanceAmount)}
                    </p>
                  </div>

                  <div className="mb-4">
                    <label className="text-xs text-slate-400 mb-2 block">
                      Payment Method
                    </label>
                    <div className="space-y-2">
                      {PAYMENT_METHODS.map((m) => (
                        <label
                          key={m.value}
                          className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition ${
                            method === m.value
                              ? "border-cyan-400/50 bg-cyan-500/10"
                              : "border-slate-700 bg-slate-800 hover:border-slate-600"
                          }`}
                        >
                          <input
                            type="radio"
                            name="method"
                            value={m.value}
                            checked={method === m.value}
                            onChange={() => setMethod(m.value)}
                            className="accent-cyan-400"
                          />
                          <span className="text-sm">{m.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="text-xs text-slate-400 mb-1 block">
                      Notes (optional)
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Bank reference number"
                      className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-sm outline-none focus:border-cyan-400 transition"
                    />
                  </div>

                  {error && (
                    <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-red-200 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={() => handlePay("advance")}
                    disabled={paying}
                    className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 py-3 font-semibold text-slate-950 hover:opacity-90 transition disabled:opacity-50"
                  >
                    {paying ? "Processing..." : `Pay Advance · ${lkr(summary.advanceAmount)}`}
                  </button>
                </>
              )}

              {/* ── STEP: ADVANCE SUCCESS ── */}
              {step === "advance" && lastPayment && (
                <div className="text-center py-4">
                  <p className="text-5xl mb-3">🎉</p>
                  <p className="font-bold text-emerald-300 text-xl">Advance Paid!</p>
                  <p className="font-mono text-slate-400 text-xs mt-2">
                    {lastPayment.transactionId}
                  </p>
                  <p className="text-slate-300 text-sm mt-2">
                    {lkr(lastPayment.amount)} advance received.
                  </p>
                  <div className="mt-4 rounded-xl bg-yellow-500/10 border border-yellow-400/20 px-4 py-3 text-yellow-200 text-sm">
                    ⏳ Waiting for admin to confirm your booking. You'll be able to pay the balance once confirmed.
                  </div>
                  <button
                    onClick={() => navigate("/my-bookings")}
                    className="mt-5 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 py-2.5 text-sm font-semibold text-slate-950"
                  >
                    View My Bookings
                  </button>
                </div>
              )}

              {/* ── STEP: AWAITING ADMIN CONFIRMATION ── */}
              {step === "awaiting_confirmation" && (
                <div className="text-center py-4">
                  <p className="text-5xl mb-3">⏳</p>
                  <p className="font-bold text-yellow-300 text-lg">Awaiting Confirmation</p>
                  <p className="text-slate-400 text-sm mt-2">
                    Your advance payment of{" "}
                    <span className="text-cyan-400 font-semibold">
                      {lkr(summary.advanceAmount)}
                    </span>{" "}
                    has been received.
                  </p>
                  <div className="mt-4 rounded-xl bg-yellow-500/10 border border-yellow-400/20 px-4 py-3 text-yellow-200 text-sm text-left">
                    <p className="font-semibold mb-1">What happens next?</p>
                    <p className="text-xs">
                      The admin will review your advance payment and confirm your booking. Once confirmed, you'll be able to pay the remaining balance of{" "}
                      <span className="text-white font-semibold">{lkr(summary.balanceAmount)}</span>.
                    </p>
                  </div>
                  <div className="mt-4 rounded-xl bg-slate-800 border border-white/10 px-4 py-3 text-sm text-left">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Advance Paid</span>
                      <span className="text-emerald-400 font-semibold">
                        {lkr(summary.advanceAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between mt-1.5">
                      <span className="text-slate-400">Balance Due (after confirmation)</span>
                      <span className="text-slate-300 font-semibold">
                        {lkr(summary.balanceAmount)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/my-bookings")}
                    className="mt-5 w-full rounded-xl border border-white/10 bg-slate-800 py-2.5 text-sm hover:bg-slate-700 transition"
                  >
                    Back to My Bookings
                  </button>
                </div>
              )}

              {/* ── STEP: BALANCE PAYMENT ── */}
              {step === "balance" && !lastPayment && (
                <>
                  <div className="rounded-xl bg-emerald-500/10 border border-emerald-400/20 px-4 py-2.5 text-emerald-300 text-xs font-semibold mb-5 text-center">
                    ✅ Booking Confirmed by Admin
                  </div>
                  <p className="text-xs text-emerald-400 uppercase tracking-wider mb-1">
                    Step 3 of 3
                  </p>
                  <p className="font-bold text-lg mb-1">Pay Remaining Balance</p>
                  <p className="text-slate-400 text-xs mb-5">
                    Pay the balance to fully confirm your tour. Your tour slot is reserved.
                  </p>

                  <div className="rounded-xl bg-emerald-500/10 border border-emerald-400/20 px-4 py-4 mb-5 text-center">
                    <p className="text-slate-400 text-xs mb-1">Balance Amount (70%)</p>
                    <p className="text-3xl font-bold text-emerald-400">
                      {lkr(summary.balanceAmount)}
                    </p>
                  </div>

                  <div className="mb-4">
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

                  <div className="mb-4">
                    <label className="text-xs text-slate-400 mb-1 block">
                      Notes (optional)
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Bank reference number"
                      className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-sm outline-none focus:border-emerald-400 transition"
                    />
                  </div>

                  {error && (
                    <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-red-200 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={() => handlePay("balance")}
                    disabled={paying}
                    className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-3 font-semibold text-slate-950 hover:opacity-90 transition disabled:opacity-50"
                  >
                    {paying ? "Processing..." : `Pay Balance · ${lkr(summary.balanceAmount)}`}
                  </button>
                </>
              )}

              {/* ── STEP: BALANCE SUCCESS ── */}
              {step === "balance" && lastPayment && (
                <div className="text-center py-4">
                  <p className="text-5xl mb-3">🎊</p>
                  <p className="font-bold text-emerald-300 text-xl">Fully Paid!</p>
                  <p className="font-mono text-slate-400 text-xs mt-2">
                    {lastPayment.transactionId}
                  </p>
                  <p className="text-slate-300 text-sm mt-2">
                    Balance of{" "}
                    <span className="text-emerald-400 font-bold">
                      {lkr(lastPayment.amount)}
                    </span>{" "}
                    received.
                  </p>
                  <div className="mt-4 rounded-xl bg-emerald-500/10 border border-emerald-400/30 px-4 py-3 text-emerald-200 text-sm">
                    🏖 Your tour is now fully confirmed! Have a great trip.
                  </div>
                  <button
                    onClick={() => navigate("/my-bookings")}
                    className="mt-5 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-2.5 text-sm font-semibold text-slate-950"
                  >
                    View My Bookings
                  </button>
                </div>
              )}

              {/* ── STEP: COMPLETE ── */}
              {step === "complete" && (
                <div className="text-center py-4">
                  <p className="text-5xl mb-3">✅</p>
                  <p className="font-bold text-emerald-300 text-xl">Fully Paid</p>
                  <p className="text-slate-400 text-sm mt-2">No outstanding balance.</p>
                  <div className="mt-4 space-y-2 rounded-xl bg-slate-800 border border-white/10 px-4 py-4 text-sm text-left">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Advance</span>
                      <span className="text-emerald-400 font-semibold">
                        {lkr(summary.advanceAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Balance</span>
                      <span className="text-emerald-400 font-semibold">
                        {lkr(summary.balanceAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-2">
                      <span className="font-semibold">Total Paid</span>
                      <span className="text-emerald-400 font-bold">
                        {lkr(summary.totalPrice)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/my-payments")}
                    className="mt-5 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-2.5 text-sm font-semibold text-slate-950"
                  >
                    View Payment History
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment