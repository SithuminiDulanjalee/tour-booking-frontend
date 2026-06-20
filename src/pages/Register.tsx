import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { register } from "../service/auth"

const Register = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
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

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-0 overflow-hidden rounded-[2rem] border border-cyan-400/20 shadow-2xl bg-slate-900/70 backdrop-blur">
        <div className="p-10 md:p-14 bg-gradient-to-br from-emerald-500/20 via-cyan-500/15 to-slate-950">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 px-4 py-2 text-sm text-cyan-200">
            <span className="h-2 w-2 rounded-full bg-cyan-300" />
            Secure authentication
          </div>
          <h1 className="mt-6 text-4xl md:text-5xl font-bold leading-tight">
            Join the platform with a clean, modern experience.
          </h1>
          <p className="mt-4 text-slate-300 max-w-md">
            User and admin roles only, protected with JWT and bcryptjs, styled in a professional green-blue theme.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-cyan-200 font-semibold">Role-based</p>
              <p className="text-slate-300 mt-1">USER / ADMIN</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-cyan-200 font-semibold">Token flow</p>
              <p className="text-slate-300 mt-1">Access + refresh</p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 bg-slate-950/80">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold">Create account</h2>
            <p className="text-slate-400 mt-2">Enter your details to continue.</p>

            <form onSubmit={handleRegister} className="mt-8 space-y-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full rounded-2xl bg-slate-900 border border-slate-700 px-4 py-3 outline-none focus:border-cyan-400"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                type="email"
                className="w-full rounded-2xl bg-slate-900 border border-slate-700 px-4 py-3 outline-none focus:border-cyan-400"
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
                className="w-full rounded-2xl bg-slate-900 border border-slate-700 px-4 py-3 outline-none focus:border-cyan-400"
              />
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                type="password"
                className="w-full rounded-2xl bg-slate-900 border border-slate-700 px-4 py-3 outline-none focus:border-cyan-400"
              />

              {error && (
                <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:opacity-95 disabled:opacity-70"
              >
                {loading ? "Creating account..." : "Register"}
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-400">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-cyan-300 font-semibold hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
