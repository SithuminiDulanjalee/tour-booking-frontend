import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { getMyDetails, login } from "../service/auth"
import { useAuth } from "../hooks/useAuth"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { setUser } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill all fields.")
      return
    }

    try {
      setLoading(true)
      const data = await login(email, password)

      localStorage.setItem("accessToken", data.data.accessToken)
      localStorage.setItem("refreshToken", data.data.refreshToken)

      const resData = await getMyDetails()
      setUser(resData.data)

      navigate("/dashboard")
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-0 overflow-hidden rounded-[2rem] border border-cyan-400/20 shadow-2xl bg-slate-900/70 backdrop-blur">
        <div className="p-10 md:p-14 bg-gradient-to-br from-cyan-500/20 via-emerald-500/15 to-slate-950">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 px-4 py-2 text-sm text-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            Welcome back
          </div>
          <h1 className="mt-6 text-4xl md:text-5xl font-bold leading-tight">
            Sign in to your dashboard.
          </h1>
          <p className="mt-4 text-slate-300 max-w-md">
            A clean auth flow with refresh token recovery and role-aware access.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-emerald-200 font-semibold">Security</p>
              <p className="text-slate-300 mt-1">JWT protected</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-emerald-200 font-semibold">UI</p>
              <p className="text-slate-300 mt-1">Green / blue theme</p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 bg-slate-950/80">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold">Login</h2>
            <p className="text-slate-400 mt-2">Use your email and password.</p>

            <form onSubmit={handleLogin} className="mt-8 space-y-4">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                type="email"
                className="w-full rounded-2xl bg-slate-900 border border-slate-700 px-4 py-3 outline-none focus:border-emerald-400"
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
                className="w-full rounded-2xl bg-slate-900 border border-slate-700 px-4 py-3 outline-none focus:border-emerald-400"
              />

              {error && (
                <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:opacity-95 disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-400">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-emerald-300 font-semibold hover:underline"
              >
                Register
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
