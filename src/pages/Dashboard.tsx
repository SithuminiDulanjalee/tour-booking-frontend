import { useAuth } from "../hooks/useAuth"

const Dashboard = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[2rem] border border-cyan-400/20 bg-gradient-to-br from-slate-900 to-slate-950 p-8 md:p-10 shadow-2xl">
          <p className="text-cyan-300 uppercase tracking-[0.25em] text-xs">Dashboard</p>
          <h1 className="mt-3 text-3xl md:text-5xl font-bold">
            Welcome{user?.name ? `, ${user.name}` : ""}.
          </h1>
          <p className="mt-3 text-slate-300 max-w-2xl">
            This is a clean starter dashboard for your RAD project. Keep adding modules here later.
          </p>

          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-slate-400 text-sm">Email</p>
              <p className="mt-1 font-semibold">{user?.email || "-"}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-slate-400 text-sm">Role</p>
              <p className="mt-1 font-semibold">{user?.roles?.join(", ") || "-"}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-slate-400 text-sm">Theme</p>
              <p className="mt-1 font-semibold">Green / Blue professional</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
