import api from "./api"

export const getAllTours = async (params?: {
  search?: string
  category?: string
  page?: number
  limit?: number
}) => {
  const res = await api.get("/tours", { params })
  return res.data
}

export const getTourById = async (id: string) => {
  const res = await api.get(`/tours/${id}`)
  return res.data
}

export const getAdminTours = async () => {
  const res = await api.get("/tours/admin/all")
  return res.data
}

export const createTour = async (data: object) => {
  const res = await api.post("/tours", data)
  return res.data
}

export const updateTour = async (id: string, data: object) => {
  const res = await api.put(`/tours/${id}`, data)
  return res.data
}

export const deleteTour = async (id: string) => {
  const res = await api.delete(`/tours/${id}`)
  return res.data
}