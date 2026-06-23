import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { register } from "../service/auth"

const Register = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill all fields.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    try {
      setLoading(true)
      await register(name, email, password)
      navigate("/login")
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed.")
    } finally {
      setLoading(false)
    }
  }

  // Password strength
  const strength =
    password.length === 0 ? 0
    : password.length < 6 ? 1
    : password.length < 10 ? 2
    : 3

  const strengthLabel = ["", "Weak", "Good", "Strong"][strength]
  const strengthColor = ["", "bg-red-500", "bg-yellow-500", "bg-emerald-500"][strength]

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
        <div className="absolute -top-32 right-1/4 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 left-1/4 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-5xl grid md:grid-cols-2 gap-0 overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl shadow-black/50 bg-slate-900/80 backdrop-blur">

          {/* Left panel */}
          <div className="relative p-10 md:p-14 bg-gradient-to-br from-emerald-500/15 via-cyan-500/10 to-slate-950 overflow-hidden">
            <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-10 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-cyan-300 text-xs font-medium mb-8">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Join for free
              </div>

              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                Start your
                <br />
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Sri Lanka journey
                </span>
              </h1>

              <p className="mt-4 text-slate-400 text-sm leading-relaxed max-w-xs">
                Create a free account to browse tours, make bookings, and access your personal AI travel guide.
              </p>

              {/* Steps */}
              <div className="mt-10 space-y-4">
                {[
                  {
                    step: "01",
                    text: "Create your account",
                    color: "text-cyan-400",
                    bg: "bg-cyan-500/10 border-cyan-400/20"
                  },
                  {
                    step: "02",
                    text: "Browse & book a tour",
                    color: "text-emerald-400",
                    bg: "bg-emerald-500/10 border-emerald-400/20"
                  },
                  {
                    step: "03",
                    text: "Pay advance in LKR",
                    color: "text-purple-400",
                    bg: "bg-purple-500/10 border-purple-400/20"
                  },
                  {
                    step: "04",
                    text: "Travel & enjoy! 🌴",
                    color: "text-pink-400",
                    bg: "bg-pink-500/10 border-pink-400/20"
                  }
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-3 text-sm">
                    <span
                      className={`h-8 w-8 rounded-xl ${item.bg} border flex items-center justify-center text-xs font-bold ${item.color} flex-shrink-0`}
                    >
                      {item.step}
                    </span>
                    <span className="text-slate-300">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel — form */}
          <div className="p-8 md:p-12 bg-slate-950/90 flex flex-col justify-center">
            <div>
              <h2 className="text-2xl font-bold mb-1">Create Account</h2>
              <p className="text-slate-400 text-sm mb-8">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-cyan-400 font-semibold hover:text-cyan-300 transition"
                >
                  Sign in
                </button>
              </p>

              <form onSubmit={handleRegister} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">Full Name</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">👤</span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full rounded-2xl bg-slate-900 border border-slate-700 pl-10 pr-4 py-3.5 text-sm outline-none focus:border-cyan-400 transition placeholder:text-slate-600"
                    />
                  </div>
                </div>

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
                      className="w-full rounded-2xl bg-slate-900 border border-slate-700 pl-10 pr-4 py-3.5 text-sm outline-none focus:border-cyan-400 transition placeholder:text-slate-600"
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
                      placeholder="Min. 6 characters"
                      type={showPassword ? "text" : "password"}
                      className="w-full rounded-2xl bg-slate-900 border border-slate-700 pl-10 pr-12 py-3.5 text-sm outline-none focus:border-cyan-400 transition placeholder:text-slate-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs transition"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {/* Strength bar */}
                  {password.length > 0 && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all ${
                              i <= strength ? strengthColor : "bg-slate-800"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-slate-500">
                        Password strength:{" "}
                        <span className={`font-semibold ${
                          strength === 1 ? "text-red-400"
                          : strength === 2 ? "text-yellow-400"
                          : "text-emerald-400"
                        }`}>
                          {strengthLabel}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">Confirm Password</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔒</span>
                    <input
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      type={showPassword ? "text" : "password"}
                      className={`w-full rounded-2xl bg-slate-900 border pl-10 pr-4 py-3.5 text-sm outline-none transition placeholder:text-slate-600 ${
                        confirmPassword.length > 0
                          ? password === confirmPassword
                            ? "border-emerald-500 focus:border-emerald-400"
                            : "border-red-500/50 focus:border-red-400"
                          : "border-slate-700 focus:border-cyan-400"
                      }`}
                    />
                    {confirmPassword.length > 0 && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm">
                        {password === confirmPassword ? "✅" : "❌"}
                      </span>
                    )}
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
                  className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-4 font-bold text-slate-950 transition hover:opacity-90 disabled:opacity-60 shadow-lg shadow-emerald-500/20 text-sm mt-2"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    "Create My Account →"
                  )}
                </button>
              </form>
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

export default Register