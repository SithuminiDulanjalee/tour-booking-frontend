import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { getMyDetails, login } from "../service/auth"
import { useAuth } from "../hooks/useAuth"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Navbar */}
      <nav className="px-6 py-4 border-b border-white/10">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-slate-950 text-sm font-black">VL</span>
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight leading-none">VoyaLink</span>
              <p className="text-emerald-400 text-[10px] leading-none tracking-widest uppercase">Sri Lanka Tours</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-slate-400 hover:text-white text-sm px-3 py-2 rounded-xl hover:bg-white/5 transition"
          >
            ← Back to Home
          </button>
        </div>
      </nav>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Background glows */}
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 right-1/4 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-5xl grid md:grid-cols-2 gap-0 overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl shadow-black/50 bg-slate-900/80 backdrop-blur">

          {/* Left panel */}
          <div className="relative p-10 md:p-14 bg-gradient-to-br from-cyan-500/15 via-emerald-500/10 to-slate-950 overflow-hidden">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-emerald-300 text-xs font-medium mb-8">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Welcome back
              </div>

              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                Sign in to your
                <br />
                <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  travel account
                </span>
              </h1>

              <p className="mt-4 text-slate-400 text-sm leading-relaxed max-w-xs">
                Access your bookings, track payments, and get personalised AI travel recommendations.
              </p>

              {/* Feature list */}
              <div className="mt-10 space-y-3">
                {[
                  { icon: "🗺", text: "Browse 50+ Sri Lanka tours" },
                  { icon: "💳", text: "Flexible LKR payment plans" },
                  { icon: "🤖", text: "AI-powered travel assistant" },
                  { icon: "📋", text: "Full booking management" }
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3 text-sm text-slate-300">
                    <span className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-base flex-shrink-0">
                      {item.icon}
                    </span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel — form */}
          <div className="p-8 md:p-12 bg-slate-950/90 flex flex-col justify-center">
            <div>
              <h2 className="text-2xl font-bold mb-1">Login</h2>
              <p className="text-slate-400 text-sm mb-8">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/register")}
                  className="text-emerald-400 font-semibold hover:text-emerald-300 transition"
                >
                  Register free
                </button>
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">✉️</span>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      type="email"
                      className="w-full rounded-2xl bg-slate-900 border border-slate-700 pl-10 pr-4 py-3.5 text-sm outline-none focus:border-emerald-400 transition placeholder:text-slate-600"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">Password</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔑</span>
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Your password"
                      type={showPassword ? "text" : "password"}
                      className="w-full rounded-2xl bg-slate-900 border border-slate-700 pl-10 pr-12 py-3.5 text-sm outline-none focus:border-emerald-400 transition placeholder:text-slate-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs transition"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-red-300 text-sm flex items-center gap-2">
                    <span>⚠️</span>
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-4 font-bold text-slate-950 transition hover:opacity-90 disabled:opacity-60 shadow-lg shadow-emerald-500/20 text-sm mt-2"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    "Sign In to VoyaLink →"
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-slate-600 text-xs">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <button
                onClick={() => navigate("/register")}
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition"
              >
                Create a new account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div className="text-center pb-6 text-slate-600 text-xs">
        © 2025 VoyaLink · Sri Lanka's Premier Tour Booking Platform
      </div>
    </div>
  )
}

export default Login