import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getAdminAILogs } from "../service/ai"

const AdminAI = () => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    getAdminAILogs()
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const logs = data?.logs || []
  const stats = data?.stats || { totalInteractions: 0, uniqueUsers: 0 }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
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
              <span className="font-bold text-lg tracking-tight">VoyaLink</span>
            </div>
            <span className="rounded-full bg-purple-500/10 border border-purple-400/30 text-purple-300 text-xs px-3 py-1 font-semibold">
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
            <button
              onClick={() => navigate("/admin/payments")}
              className="text-slate-300 hover:text-white text-sm px-3 py-2 rounded-xl hover:bg-white/5 transition"
            >
              Payments
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <p className="text-cyan-400 uppercase tracking-[0.2em] text-xs font-semibold">
              Admin
            </p>
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-emerald-300 text-xs">Groq AI</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold">AI Usage Logs</h1>
          <p className="text-slate-400 text-sm mt-1">
            Monitor all AI travel recommendation interactions
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Interactions",
              value: loading ? "…" : stats.totalInteractions,
              icon: "🤖",
              border: "border-cyan-400/20",
              text: "text-cyan-400"
            },
            {
              label: "Unique Users",
              value: loading ? "…" : stats.uniqueUsers,
              icon: "👥",
              border: "border-emerald-400/20",
              text: "text-emerald-400"
            },
            {
              label: "Logs Shown",
              value: loading ? "…" : logs.length,
              icon: "📋",
              border: "border-purple-400/20",
              text: "text-purple-400"
            },
            {
              label: "AI Model",
              value: "llama3-70b",
              icon: "⚡",
              border: "border-yellow-400/20",
              text: "text-yellow-400"
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

        {/* Logs */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="h-12 w-12 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-24 text-slate-400">
            <p className="text-5xl mb-4">🤖</p>
            <p>No AI interactions yet.</p>
            <p className="text-sm mt-1">
              Once users chat with the AI, logs will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log: any) => {
              const isExpanded = expandedId === log._id

              return (
                <div
                  key={log._id}
                  className="rounded-2xl border border-white/10 bg-slate-900 overflow-hidden"
                >
                  {/* Header row */}
                  <button
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition text-left"
                    onClick={() => setExpandedId(isExpanded ? null : log._id)}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs">🤖</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-sm">
                            {log.user?.name || "Unknown User"}
                          </p>
                          <span className="text-slate-500 text-xs">
                            {log.user?.email}
                          </span>
                        </div>
                        <p className="text-slate-400 text-xs mt-0.5 truncate">
                          💬 {log.message}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                      <span className="text-slate-500 text-xs">
                        {new Date(log.createdAt).toLocaleDateString()} ·{" "}
                        {new Date(log.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                      <span className="text-slate-400 text-xs">
                        {isExpanded ? "▲" : "▼"}
                      </span>
                    </div>
                  </button>

                  {/* Expanded view */}
                  {isExpanded && (
                    <div className="border-t border-white/10 px-6 py-5 space-y-4">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                          User Message
                        </p>
                        <div className="rounded-xl bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-400/20 px-4 py-3">
                          <p className="text-sm text-slate-200 whitespace-pre-wrap">
                            {log.message}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                          AI Response
                        </p>
                        <div className="rounded-xl bg-slate-800 border border-white/10 px-4 py-3">
                          <p className="text-sm text-slate-200 whitespace-pre-wrap">
                            {log.response}
                          </p>
                        </div>
                      </div>
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

export default AdminAI