import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios"
import { refreshTokenCall } from "./auth"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"
})

const PUBLIC_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/refresh"]

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("accessToken")
  const isPublic = PUBLIC_ENDPOINTS.some((url) => config.url?.includes(url))
  if (!isPublic && token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config
    const isPublic = PUBLIC_ENDPOINTS.some((url) =>
      originalRequest?.url?.includes(url)
    )
    if (!isPublic && error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = localStorage.getItem("refreshToken")
        if (!refreshToken) throw new Error("No refresh token")
        const refreshResponse = await refreshTokenCall(refreshToken)
        const newAccessToken = refreshResponse.data.accessToken
        localStorage.setItem("accessToken", newAccessToken)
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (err) {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)

export default api