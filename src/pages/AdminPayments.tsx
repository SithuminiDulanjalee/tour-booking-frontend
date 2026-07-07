import { useEffect, useState } from "react"
import AdminNavbar from "../components/AdminNavbar"
import { getAllPayments, getPaymentStats, updatePaymentStatus } from "../service/payment"

const lkr = (amount: number | undefined | null) =>
  `LKR ${(amount ?? 0).toLocaleString("en-LK", { minimumFractionDigits: 2 })}`

const STATUS_OPTIONS = ["pending", "completed", "failed", "refunded"]

const AdminPayments = () => {
  const [payments, setPayments] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchAll = () => {
    setLoading(true)
    Promise.all([getAllPayments(), getPaymentStats()])
      .then(([paymentsRes, statsRes]) => {
        setPayments(paymentsRes.data)
        setStats(statsRes.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchAll() }, [])

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id)
    try { await updatePaymentStatus(id, status); fetchAll() }
    catch { alert("Failed to update payment status.") }
    finally { setUpdatingId(null) }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AdminNavbar />

      <div className="mx-auto max-w-6xl px-4 md:px-6 py-8 md:py-10">
        <div className="mb-6 md:mb-8">
          <p className="text-emerald-400 uppercase tracking-[0.2em] text-xs font-semibold">
            Admin · LKR
          </p>
          <h1 className="mt-1 text-2xl md:text-3xl font-bold">Manage Payments</h1>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            {[
              { label: "Total Revenue", value: lkr(stats.totalRevenue), icon: "💰", border: "border-emerald-400/20", text: "text-emerald-400" },
              { label: "Advances", value: lkr(stats.advanceRevenue), icon: "📥", border: "border-cyan-400/20", text: "text-cyan-400" },
              { label: "Balances", value: lkr(stats.balanceRevenue), icon: "✅", border: "border-emerald-400/20", text: "text-emerald-400" },
              { label: "Refunded", value: lkr(stats.refundedAmount), icon: "↩️", border: "border-orange-400/20", text: "text-orange-400" }
            ].map((stat) => (
              <div key={stat.label} className={`rounded-2xl border ${stat.border} bg-slate-900 p-4 md:p-5`}>
                <span className="text-xl md:text-2xl">{stat.icon}</span>
                <p className={`mt-2 md:mt-3 text-sm md:text-xl font-bold ${stat.text} break-all`}>
                  {stat.value}
                </p>
                <p className="text-slate-400 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="h-12 w-12 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-slate-900 overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-4 md:px-6 py-4 text-left">Transaction ID</th>
                  <th className="px-4 md:px-6 py-4 text-left">User</th>
                  <th className="px-4 md:px-6 py-4 text-left">Tour</th>
                  <th className="px-4 md:px-6 py-4 text-left">Type</th>
                  <th className="px-4 md:px-6 py-4 text-left">Amount</th>
                  <th className="px-4 md:px-6 py-4 text-left">Date</th>
                  <th className="px-4 md:px-6 py-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-white/5 transition">
                    <td className="px-4 md:px-6 py-4 font-mono text-xs text-cyan-400 max-w-[100px] truncate">
                      {payment.transactionId}
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <p className="font-medium text-xs md:text-sm">{payment.user?.name}</p>
                      <p className="text-slate-400 text-xs hidden sm:block">{payment.user?.email}</p>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <p className="font-medium text-xs md:text-sm">
                        {payment.booking?.tour?.title || "Tour"}
                      </p>
                      <p className="text-slate-400 text-xs hidden sm:block">
                        {payment.booking?.tour?.location}
                      </p>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span
                        className={`rounded-full px-2 md:px-3 py-1 text-xs font-semibold border ${
                          payment.paymentType === "advance"
                            ? "bg-cyan-500/10 text-cyan-300 border-cyan-400/20"
                            : "bg-emerald-500/10 text-emerald-300 border-emerald-400/20"
                        }`}
                      >
                        {payment.paymentType === "advance" ? "Advance" : "Balance"}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-emerald-400 font-bold text-xs md:text-sm">
                      {lkr(payment.amount)}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-slate-400 text-xs">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <select
                        value={payment.status}
                        disabled={updatingId === payment._id}
                        onChange={(e) => handleStatusChange(payment._id, e.target.value)}
                        className={`rounded-lg border px-2 md:px-3 py-1.5 text-xs outline-none transition disabled:opacity-50 ${
                          payment.status === "completed"
                            ? "bg-emerald-500/10 border-emerald-400/30 text-emerald-300"
                            : payment.status === "refunded"
                            ? "bg-blue-500/10 border-blue-400/30 text-blue-300"
                            : payment.status === "pending"
                            ? "bg-yellow-500/10 border-yellow-400/30 text-yellow-300"
                            : "bg-red-500/10 border-red-400/30 text-red-300"
                        }`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s} className="bg-slate-900 text-white">
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {payments.length === 0 && (
              <div className="text-center py-16 text-slate-400">No payments yet.</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPayments