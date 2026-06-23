import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { getAllTours } from "../service/tour"

const CATEGORIES = ["Adventure", "Cultural", "Beach", "Wildlife", "General"]

const Tours = () => {
  const [tours, setTours] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const { user, setUser } = useAuth()
  const navigate = useNavigate()

  const fetchTours = () => {
    setLoading(true)
    getAllTours({ search, category: category || undefined, page, limit: 9 })
      .then((res) => {
        setTours(res.data.tours)
        setTotalPages(res.data.totalPages)
      })
      .catch(() => setTours([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchTours()
  }, [search, category, page])

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    setUser(null)
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/90 backdrop-blur px-6 py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate(user ? "/dashboard" : "/")}
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center">
              <span className="text-slate-950 text-xs font-black">VL</span>
            </div>
            <span className="font-bold text-lg tracking-tight">VoyaLink</span>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="text-slate-300 hover:text-white text-sm px-3 py-2 rounded-xl hover:bg-white/5 transition"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate("/my-bookings")}
                  className="text-slate-300 hover:text-white text-sm px-3 py-2 rounded-xl hover:bg-white/5 transition"
                >
                  My Bookings
                </button>
                <button
                  onClick={handleLogout}
                  className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-300 hover:bg-red-500/20 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <p className="text-cyan-400 uppercase tracking-[0.2em] text-xs font-semibold">
            Explore
          </p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold">Tour Packages</h1>
          <p className="text-slate-400 mt-1 text-sm">Find your perfect adventure</p>
        </div>

        {/* Search and filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Search by name or location..."
            className="flex-1 min-w-[200px] rounded-2xl bg-slate-900 border border-slate-700 px-4 py-3 text-sm outline-none focus:border-emerald-400 transition"
          />
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value)
              setPage(1)
            }}
            className="rounded-2xl bg-slate-900 border border-slate-700 px-4 py-3 text-sm outline-none focus:border-emerald-400 transition"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Tour grid */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="h-12 w-12 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
          </div>
        ) : tours.length === 0 ? (
          <div className="text-center py-24 text-slate-400">
            <p className="text-4xl mb-3">🔍</p>
            <p>No tours found. Try a different search.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour) => (
              <div
                key={tour._id}
                onClick={() => navigate(`/tours/${tour._id}`)}
                className="rounded-2xl border border-white/10 bg-slate-900 overflow-hidden cursor-pointer hover:border-emerald-400/40 hover:shadow-lg hover:shadow-emerald-500/5 transition"
              >
                {tour.image ? (
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-44 object-cover"
                  />
                ) : (
                  <div className="w-full h-44 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 flex items-center justify-center">
                    <span className="text-5xl">🌍</span>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-xs px-3 py-1 font-medium">
                      {tour.category}
                    </span>
                    <span className="text-cyan-400 font-bold text-lg">LKR {tour.price}</span>
                  </div>
                  <h3 className="font-semibold text-base mt-1">{tour.title}</h3>
                  <p className="text-slate-400 text-xs mt-1">📍 {tour.location}</p>
                  <p className="text-slate-400 text-xs">
                    ⏱ {tour.duration} days · {tour.availableSlots} slots left
                  </p>
                  <button className="mt-4 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 py-2 text-sm font-semibold text-slate-950 hover:opacity-90 transition">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-xl border border-white/10 bg-slate-900 px-5 py-2 text-sm disabled:opacity-40 hover:border-emerald-400/30 transition"
            >
              ← Previous
            </button>
            <span className="text-sm text-slate-400">
              {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-xl border border-white/10 bg-slate-900 px-5 py-2 text-sm disabled:opacity-40 hover:border-emerald-400/30 transition"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Tours