import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { createBooking } from "../service/booking"
import { getTourById } from "../service/tour"

const TourDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [tour, setTour] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [bookingDate, setBookingDate] = useState("")
  const [numberOfPeople, setNumberOfPeople] = useState(1)
  const [specialRequests, setSpecialRequests] = useState("")
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!id) return
    getTourById(id)
      .then((res) => setTour(res.data))
      .catch(() => setTour(null))
      .finally(() => setLoading(false))
  }, [id])

  const totalPrice = tour ? tour.price * numberOfPeople : 0

  const handleBooking = async () => {
    if (!user) {
      navigate("/login")
      return
    }

    if (!bookingDate) {
      setError("Please select a booking date.")
      return
    }

    setError("")
    setBookingLoading(true)

    try {
      await createBooking({
        tourId: id!,
        bookingDate,
        numberOfPeople,
        specialRequests
      })
      setBookingSuccess(true)
    } catch (err: any) {
      setError(err?.response?.data?.message || "Booking failed. Please try again.")
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-3">😕</p>
          <p className="text-slate-400">Tour not found.</p>
          <button
            onClick={() => navigate("/tours")}
            className="mt-4 rounded-xl bg-emerald-500 px-5 py-2 text-sm text-slate-950 font-semibold"
          >
            Back to Tours
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/90 backdrop-blur px-6 py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/tours")}
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center">
              <span className="text-slate-950 text-xs font-black">VV</span>
            </div>
            <span className="font-bold text-lg tracking-tight">VoyaLink</span>
          </div>
          <button
            onClick={() => navigate("/tours")}
            className="text-slate-300 hover:text-white text-sm px-3 py-2 rounded-xl hover:bg-white/5 transition"
          >
            ← All Tours
          </button>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Tour info */}
          <div className="lg:col-span-2">
            {tour.image ? (
              <img
                src={tour.image}
                alt={tour.title}
                className="w-full h-72 object-cover rounded-2xl"
              />
            ) : (
              <div className="w-full h-72 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 flex items-center justify-center">
                <span className="text-7xl">🌍</span>
              </div>
            )}

            <div className="mt-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-xs px-3 py-1">
                  {tour.category}
                </span>
                <span
                  className={`rounded-full text-xs px-3 py-1 ${
                    tour.isActive
                      ? "bg-emerald-500/10 text-emerald-300"
                      : "bg-red-500/10 text-red-300"
                  }`}
                >
                  {tour.isActive ? "Available" : "Unavailable"}
                </span>
              </div>

              <h1 className="text-3xl font-bold mt-2">{tour.title}</h1>

              <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-400">
                <span>📍 {tour.location}</span>
                <span>⏱ {tour.duration} days</span>
                <span>👥 Max {tour.maxGroupSize} people</span>
                <span>🎟 {tour.availableSlots} slots left</span>
              </div>

              <p className="mt-6 text-slate-300 leading-relaxed">{tour.description}</p>

              {tour.itinerary && tour.itinerary.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-semibold mb-4">Itinerary</h2>
                  <div className="space-y-3">
                    {tour.itinerary.map((item: string, index: number) => (
                      <div
                        key={index}
                        className="flex gap-3 rounded-xl border border-white/10 bg-slate-900 p-4"
                      >
                        <span className="h-6 w-6 flex-shrink-0 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-slate-950 text-xs font-bold">
                          {index + 1}
                        </span>
                        <p className="text-slate-300 text-sm">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Booking card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-cyan-400/20 bg-slate-900 p-6 shadow-2xl">
              <div className="flex items-baseline justify-between mb-6">
                <div>
                  <p className="text-3xl font-bold text-cyan-400">LKR {tour.price}</p>
                  <p className="text-slate-400 text-xs">per person</p>
                </div>
              </div>

              {bookingSuccess ? (
                <div className="text-center py-6">
                  <p className="text-4xl mb-3">🎉</p>
                  <p className="font-semibold text-emerald-300">Booking Successful!</p>
                  <p className="text-slate-400 text-sm mt-1">
                    We'll confirm your booking shortly.
                  </p>
                  <button
                    onClick={() => navigate("/my-bookings")}
                    className="mt-4 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 py-2 text-sm font-semibold text-slate-950"
                  >
                    View My Bookings
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">
                        Travel Date
                      </label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-sm outline-none focus:border-emerald-400 transition"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">
                        Number of People
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={tour.availableSlots}
                        value={numberOfPeople}
                        onChange={(e) => setNumberOfPeople(Number(e.target.value))}
                        className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-sm outline-none focus:border-emerald-400 transition"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">
                        Special Requests (optional)
                      </label>
                      <textarea
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        rows={3}
                        className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-sm outline-none focus:border-emerald-400 transition resize-none"
                        placeholder="Any special requirements..."
                      />
                    </div>
                  </div>

                  <div className="mt-5 rounded-xl bg-slate-800 border border-white/10 p-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">
                        LKR {tour.price} × {numberOfPeople}
                      </span>
                      <span className="font-semibold text-cyan-400">LKR {totalPrice}</span>
                    </div>
                  </div>

                  {error && (
                    <div className="mt-3 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-red-200 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleBooking}
                    disabled={bookingLoading || !tour.isActive || tour.availableSlots === 0}
                    className="mt-5 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 py-3 font-semibold text-slate-950 hover:opacity-90 transition disabled:opacity-50"
                  >
                    {bookingLoading
                      ? "Booking..."
                      : !user
                      ? "Login to Book"
                      : tour.availableSlots === 0
                      ? "Fully Booked"
                      : "Book Now"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TourDetail