import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { cancelBooking, getMyBookings } from "../service/booking"

const MyBookings = () => {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const navigate = useNavigate()

  const fetchBookings = () => {
    setLoading(true)
    getMyBookings()
      .then((res) => setBookings(res.data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return
    setCancellingId(id)
    try {
      await cancelBooking(id)
      fetchBookings()
    } catch {
      alert("Failed to cancel booking.")
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/90 backdrop-blur px-6 py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center">
              <span className="text-slate-950 text-xs font-black">VV</span>
            </div>
            <span className="font-bold text-lg tracking-tight">VoyageVerde</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-slate-300 hover:text-white text-sm px-3 py-2 rounded-xl hover:bg-white/5 transition"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/tours")}
              className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-500/20 transition"
            >
              Browse Tours
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <p className="text-cyan-400 uppercase tracking-[0.2em] text-xs font-semibold">
            My Account
          </p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold">My Bookings</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="h-12 w-12 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-24 text-slate-400">
            <p className="text-5xl mb-4">🧳</p>
            <p className="text-lg">No bookings yet.</p>
            <button
              onClick={() => navigate("/tours")}
              className="mt-5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-6 py-2.5 text-sm font-semibold text-slate-950"
            >
              Explore Tours
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="rounded-2xl border border-white/10 bg-slate-900 p-6 flex flex-col md:flex-row gap-5 md:items-center justify-between"
              >
                <div className="flex gap-4 items-start">
                  {booking.tour?.image ? (
                    <img
                      src={booking.tour.image}
                      alt={booking.tour.title}
                      className="h-16 w-24 rounded-xl object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="h-16 w-24 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🌍</span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold">{booking.tour?.title || "Tour"}</h3>
                    <p className="text-slate-400 text-sm mt-0.5">
                      📍 {booking.tour?.location}
                    </p>
                    <p className="text-slate-400 text-xs mt-0.5">
                      📅 {new Date(booking.bookingDate).toLocaleDateString()} ·{" "}
                      {booking.numberOfPeople} person(s) · ${booking.totalPrice}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold border ${
                      booking.status === "confirmed"
                        ? "bg-emerald-500/10 text-emerald-300 border-emerald-400/20"
                        : booking.status === "pending"
                        ? "bg-yellow-500/10 text-yellow-300 border-yellow-400/20"
                        : "bg-red-500/10 text-red-300 border-red-400/20"
                    }`}
                  >
                    {booking.status}
                  </span>

                  {booking.status !== "cancelled" && (
                    <button
                      onClick={() => handleCancel(booking._id)}
                      disabled={cancellingId === booking._id}
                      className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-xs text-red-300 hover:bg-red-500/20 transition disabled:opacity-50"
                    >
                      {cancellingId === booking._id ? "Cancelling…" : "Cancel"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyBookings