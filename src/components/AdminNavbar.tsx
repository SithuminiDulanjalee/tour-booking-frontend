import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const AdminNavbar = () => {
  const { setUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    setUser(null)
    navigate("/login")
    setMenuOpen(false)
  }

  const navTo = (path: string) => {
    navigate(path)
    setMenuOpen(false)
  }

  const isActive = (path: string) => location.pathname === path

  const links = [
    { label: "Dashboard", path: "/admin" },
    { label: "Tours", path: "/admin/tours" },
    { label: "Bookings", path: "/admin/bookings" },
    { label: "Payments", path: "/admin/payments" }
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/90 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navTo("/admin")}
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center">
              <span className="text-slate-950 text-xs font-black">VL</span>
            </div>
            <span className="font-bold text-lg tracking-tight">VoyaLink</span>
          </div>
          <span className="rounded-full bg-purple-500/10 border border-purple-400/30 text-purple-300 text-xs px-2.5 py-1 font-semibold">
            Admin
          </span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <button
              key={link.path}
              onClick={() => navTo(link.path)}
              className={`text-sm px-3 py-2 rounded-xl transition ${
                isActive(link.path)
                  ? "text-white bg-white/10"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-300 hover:bg-red-500/20 transition ml-1"
          >
            Logout
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-xl hover:bg-white/5 transition text-white"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-80" : "max-h-0"
        }`}
      >
        <div className="border-t border-white/10 bg-slate-900/98 px-4 py-3 space-y-1">
          {links.map((link) => (
            <button
              key={link.path}
              onClick={() => navTo(link.path)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm transition ${
                isActive(link.path)
                  ? "text-white bg-white/10"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-1 border-t border-white/5">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 rounded-xl text-sm text-red-300 hover:bg-red-500/10 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default AdminNavbar