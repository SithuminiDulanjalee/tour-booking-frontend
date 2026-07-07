import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import UserNavbar from "../components/UserNavbar"
import { getAllTours } from "../service/tour"

const CATEGORIES = ["Adventure", "Cultural", "Beach", "Wildlife", "General"]

const Tours = () => {
  const [tours, setTours] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
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

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <UserNavbar />

      <div className="mx-auto max-w-6xl px-4 md:px-6 py-8 md:py-10">
        <div className="mb-6 md:mb-8">
          <p className="text-cyan-400 uppercase tracking-[0.2em] text-xs font-semibold">
            Explore
          </p>
          <h1 className="mt-2 text-2xl md:text-4xl font-bold">Tour Packages</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Find your perfect Sri Lanka adventure
          </p>
        </div>

        {/* Search and filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 md:mb-8">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Search by name or location..."
            className="flex-1 rounded-2xl bg-slate-900 border border-slate-700 px-4 py-3 text-sm outline-none focus:border-emerald-400 transition"
          />
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value)
              setPage(1)
            }}
            className="rounded-2xl bg-slate-900 border border-slate-700 px-4 py-3 text-sm outline-none focus:border-emerald-400 transition sm:w-48"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
                <div className="p-4 md:p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-xs px-3 py-1 font-medium">
                      {tour.category}
                    </span>
                    <span className="text-cyan-400 font-bold text-sm md:text-base">
                      LKR {tour.price?.toLocaleString()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm md:text-base mt-1">{tour.title}</h3>
                  <p className="text-slate-400 text-xs mt-1">📍 {tour.location}</p>
                  <p className="text-slate-400 text-xs">
                    ⏱ {tour.duration} days · {tour.availableSlots} slots left
                  </p>
                  <button className="mt-3 md:mt-4 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 py-2 text-sm font-semibold text-slate-950 hover:opacity-90 transition">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8 md:mt-10">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-xl border border-white/10 bg-slate-900 px-4 md:px-5 py-2 text-sm disabled:opacity-40 hover:border-emerald-400/30 transition"
            >
              ← Prev
            </button>
            <span className="text-sm text-slate-400">
              {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-xl border border-white/10 bg-slate-900 px-4 md:px-5 py-2 text-sm disabled:opacity-40 hover:border-emerald-400/30 transition"
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