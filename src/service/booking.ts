import api from "./api"

export const createBooking = async (data: {
  tourId: string
  bookingDate: string
  numberOfPeople: number
  specialRequests?: string
}) => {
  const res = await api.post("/bookings", data)
  return res.data
}

export const getMyBookings = async () => {
  const res = await api.get("/bookings/my")
  return res.data
}

export const cancelBooking = async (id: string) => {
  const res = await api.put(`/bookings/${id}/cancel`)
  return res.data
}

export const getAllBookings = async () => {
  const res = await api.get("/bookings/all")
  return res.data
}

export const updateBookingStatus = async (id: string, status: string) => {
  const res = await api.put(`/bookings/${id}/status`, { status })
  return res.data
}