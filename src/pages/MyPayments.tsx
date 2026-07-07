import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import UserNavbar from "../components/UserNavbar"
import { getMyPayments } from "../service/payment"

const lkr = (amount: number | undefined | null) =>
  `LKR ${(amount ?? 0).toLocaleString("en-LK", { minimumFractionDigits: 2 })}`

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
  const advancePaid = payments
    .filter((p) => p.status === "completed" && p.paymentType === "advance")
    .reduce((sum, p) => sum + p.amount, 0)
  const balancePaid = payments
    .filter((p) => p.status === "completed" && p.paymentType === "balance")
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <UserNavbar />

      <div className="mx-auto max-w-5xl px-4 md:px-6 py-8 md:py-10">
        <div className="mb-6 md:mb-8">
          <p className="text-emerald-400 uppercase tracking-[0.2em] text-xs font-semibold">
            My Account · LKR
          </p>
          <h1 className="mt-2 text-2xl md:text-3xl font-bold">Payment History</h1>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {[
            { icon: "💰", value: lkr(totalPaid), label: "Total Paid", border: "border-emerald-400/20", text: "text-emerald-400" },
            { icon: "📥", value: lkr(advancePaid), label: "Advances Paid", border: "border-cyan-400/20", text: "text-cyan-400" },
            { icon: "✅", value: lkr(balancePaid), label: "Balances Paid", border: "border-emerald-400/20", text: "text-emerald-400" },
            { icon: "🔄", value: payments.length, label: "Transactions", border: "border-purple-400/20", text: "text-purple-400" }
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
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-4 md:px-6 py-4 text-left">Transaction ID</th>
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
                    <td className="px-4 md:px-6 py-4 font-mono text-xs text-cyan-400 max-w-[120px] truncate">
                      {payment.transactionId}
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <p className="font-medium text-xs md:text-sm">
                        {payment.booking?.tour?.title || "Tour"}
                      </p>
                      <p className="text-slate-400 text-xs">
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
                      <span
                        className={`rounded-full px-2 md:px-3 py-1 text-xs font-semibold border ${
                          payment.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-300 border-emerald-400/20"
                            : payment.status === "refunded"
                            ? "bg-blue-500/10 text-blue-300 border-blue-400/20"
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