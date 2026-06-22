import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getAllBookings, updateBookingStatus } from "../service/booking"

const STATUS_OPTIONS = ["pending", "confirmed", "cancelled"]

const AdminBookings = () => {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const navigate = useNavigate()

  const fetchBookings = () => {
    setLoading(true)
    getAllBookings()
      .then((res) => setBookings(res.data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id)
    try {
      await updateBookingStatus(id, status)
      fetchBookings()
    } catch {
      alert("Failed to update status.")
    } finally {
      setUpdatingId(null)
    }
  }

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
              <span className="font-bold text-lg tracking-tight">VoyageVerde</span>
            </div>
            <span className="rounded-full bg-purple-500/10 border border-purple-400/30 text-purple-300 text-xs px-3 py-1">
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
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <p className="text-purple-400 uppercase tracking-[0.2em] text-xs font-semibold">
            Admin
          </p>
          <h1 className="mt-1 text-3xl font-bold">Manage Bookings</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="h-12 w-12 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-slate-900 overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 text-left">User</th>
                  <th className="px-6 py-4 text-left">Tour</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">People</th>
                  <th className="px-6 py-4 text-left">Total</th>
                  <th className="px-6 py-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4">
                      <p className="font-medium">{booking.user?.name || "Unknown"}</p>
                      <p className="text-slate-400 text-xs">{booking.user?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{booking.tour?.title || "Tour"}</p>
                      <p className="text-slate-400 text-xs">{booking.tour?.location}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-slate-400">{booking.numberOfPeople}</td>
                    <td className="px-6 py-4 text-cyan-400 font-semibold">
                      ${booking.totalPrice}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={booking.status}
                        disabled={updatingId === booking._id}
                        onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                        className={`rounded-lg border px-3 py-1.5 text-xs outline-none transition disabled:opacity-50 ${
                          booking.status === "confirmed"
                            ? "bg-emerald-500/10 border-emerald-400/30 text-emerald-300"
                            : booking.status === "pending"
                            ? "bg-yellow-500/10 border-yellow-400/30 text-yellow-300"
                            : "bg-red-500/10 border-red-400/30 text-red-300"
                        }`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s} className="bg-slate-900 text-white">
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {bookings.length === 0 && (
              <div className="text-center py-16 text-slate-400">No bookings yet.</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminBookings