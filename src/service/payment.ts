import api from "./api"

export const createPayment = async (data: {
  bookingId: string
  amount: number
  method: string
  notes?: string
}) => {
  const res = await api.post("/payments", data)
  return res.data
}

export const getMyPayments = async () => {
  const res = await api.get("/payments/my")
  return res.data
}

export const getBookingPaymentSummary = async (bookingId: string) => {
  const res = await api.get(`/payments/booking/${bookingId}`)
  return res.data
}

export const getAllPayments = async () => {
  const res = await api.get("/payments/all")
  return res.data
}

export const updatePaymentStatus = async (id: string, status: string) => {
  const res = await api.put(`/payments/${id}/status`, { status })
  return res.data
}

export const getPaymentStats = async () => {
  const res = await api.get("/payments/stats")
  return res.data
}