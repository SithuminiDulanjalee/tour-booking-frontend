import axios, { AxiosError } from "axios"
import { refreshTokenCall } from "./auth"

// FIX: switched to localhost for local development (Vercel URL commented out)
const api = axios.create({
  // baseURL: "https://rad-73-be-main.vercel.app/api/v1"
  baseURL: "http://localhost:5000/api/v1"
})

const PUBLIC_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/refresh"]

// For add token to all request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken")

  const isPublic = PUBLIC_ENDPOINTS.some((url) => config.url?.includes(url))

  if (!isPublic && token) {
    config.headers.Authorization = `Bearer ${token}`
    // config.headers.Authorization = "Bearer" + token
  }
  return config
})

api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest: any = error.config

    const isPublic = PUBLIC_ENDPOINTS.some((url) =>
      originalRequest.url?.includes(url)
    )

    if (
      !isPublic &&
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true
      try {
        const refreshToken = localStorage.getItem("refreshToken") as string
        if (!refreshToken) {
          throw new Error("No refresh token available")
        }
        const refreshResponse = await refreshTokenCall(refreshToken)
        const newAccessToken = refreshResponse.data.accessToken

        localStorage.setItem("accessToken", newAccessToken)
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (err) {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        window.location.href = "/login"
        console.error(err)
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)

export default api
