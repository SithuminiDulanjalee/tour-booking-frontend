import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getAllPayments, getPaymentStats, updatePaymentStatus } from "../service/payment"

const STATUS_OPTIONS = ["pending", "completed", "failed", "refunded"]

const AdminPayments = () => {
  const [payments, setPayments] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const navigate = useNavigate()

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

  useEffect(() => {
    fetchAll()
  }, [])

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id)
    try {
      await updatePaymentStatus(id, status)
      fetchAll()
    } catch {
      alert("Failed to update payment status.")
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/90 backdrop-blur px-6 py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/admin")}
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center">
                <span className="text-slate-950 text-xs font-black">VV</span>
              </div>
              <span className="font-bold text-lg tracking-tight">VoyageVerde</span>
            </div>
            <span className="rounded-full bg-purple-500/10 border border-purple-400/30 text-purple-300 text-xs px-3 py-1">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/admin")}
              className="text-slate-300 hover:text-white text-sm px-3 py-2 rounded-xl hover:bg-white/5 transition"
            >
              ← Dashboard
            </button>
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
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <p className="text-emerald-400 uppercase tracking-[0.2em] text-xs font-semibold">
            Admin
          </p>
          <h1 className="mt-1 text-3xl font-bold">Manage Payments</h1>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Total Revenue",
                value: `$${stats.totalRevenue.toFixed(2)}`,
                icon: "💰",
                border: "border-emerald-400/20",
                text: "text-emerald-400"
              },
              {
                label: "Total Transactions",
                value: stats.totalTransactions,
                icon: "🔄",
                border: "border-cyan-400/20",
                text: "text-cyan-400"
              },
              {
                label: "Completed",
                value: stats.completedCount,
                icon: "✅",
                border: "border-emerald-400/20",
                text: "text-emerald-400"
              },
              {
                label: "Refunded",
                value: `$${stats.refundedAmount.toFixed(2)}`,
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
                <p className={`mt-3 text-2xl font-bold ${stat.text}`}>{stat.value}</p>
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
            <table className="w-full text-sm min-w-[850px]">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 text-left">Transaction ID</th>
                  <th className="px-6 py-4 text-left">User</th>
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
                      <p className="font-medium">{payment.user?.name}</p>
                      <p className="text-slate-400 text-xs">{payment.user?.email}</p>
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
                      <select
                        value={payment.status}
                        disabled={updatingId === payment._id}
                        onChange={(e) => handleStatusChange(payment._id, e.target.value)}
                        className={`rounded-lg border px-3 py-1.5 text-xs outline-none transition disabled:opacity-50 ${
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