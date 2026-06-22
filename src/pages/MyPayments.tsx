import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getMyPayments } from "../service/payment"

const MyPayments = () => {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getMyPayments()
      .then((res) => setPayments(res.data))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false))
  }, [])

  const totalPaid = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0)

  const totalRefunded = payments
    .filter((p) => p.status === "refunded")
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="min-h-screen bg-slate-950 text-white">
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-slate-300 hover:text-white text-sm px-3 py-2 rounded-xl hover:bg-white/5 transition"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/my-bookings")}
              className="text-slate-300 hover:text-white text-sm px-3 py-2 rounded-xl hover:bg-white/5 transition"
            >
              My Bookings
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <p className="text-emerald-400 uppercase tracking-[0.2em] text-xs font-semibold">
            My Account
          </p>
          <h1 className="mt-2 text-3xl font-bold">Payment History</h1>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl border border-emerald-400/20 bg-slate-900 p-5">
            <span className="text-2xl">💰</span>
            <p className="mt-3 text-2xl font-bold text-emerald-400">${totalPaid.toFixed(2)}</p>
            <p className="text-slate-400 text-xs mt-1">Total Paid</p>
          </div>
          <div className="rounded-2xl border border-cyan-400/20 bg-slate-900 p-5">
            <span className="text-2xl">🔄</span>
            <p className="mt-3 text-2xl font-bold text-cyan-400">{payments.length}</p>
            <p className="text-slate-400 text-xs mt-1">Transactions</p>
          </div>
          <div className="rounded-2xl border border-orange-400/20 bg-slate-900 p-5">
            <span className="text-2xl">↩️</span>
            <p className="mt-3 text-2xl font-bold text-orange-400">
              ${totalRefunded.toFixed(2)}
            </p>
            <p className="text-slate-400 text-xs mt-1">Refunded</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="h-12 w-12 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-24 text-slate-400">
            <p className="text-5xl mb-4">💳</p>
            <p>No payment history yet.</p>
            <button
              onClick={() => navigate("/my-bookings")}
              className="mt-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950"
            >
              View Bookings
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-slate-900 overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[650px]">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 text-left">Transaction ID</th>
                  <th className="px-6 py-4 text-left">Tour</th>
                  <th className="px-6 py-4 text-left">Method</th>
                  <th className="px-6 py-4 text-left">Amount</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4 font-mono text-xs text-cyan-400">
                      {payment.transactionId}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">
                        {payment.booking?.tour?.title || "Tour"}
                      </p>
                      <p className="text-slate-400 text-xs">
                        {payment.booking?.tour?.location}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-slate-400 capitalize">
                      {payment.method.replace("_", " ")}
                    </td>
                    <td className="px-6 py-4 text-emerald-400 font-bold">
                      ${payment.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold border ${
                          payment.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-300 border-emerald-400/20"
                            : payment.status === "refunded"
                            ? "bg-blue-500/10 text-blue-300 border-blue-400/20"
                            : payment.status === "pending"
                            ? "bg-yellow-500/10 text-yellow-300 border-yellow-400/20"
                            : "bg-red-500/10 text-red-300 border-red-400/20"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyPayments